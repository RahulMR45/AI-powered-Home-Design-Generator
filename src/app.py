import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

# Set up OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')


class HomeDesignGenerator:
    def generate_design_and_image(self, requirements):
        # Text description for explanation
        prompt_text = f"""
        Generate a comprehensive home construction blueprint:
        - Total Area: {requirements['total_area']} sq ft
        - Bedrooms: {requirements['bedrooms']}
        - Bathrooms: {requirements['bathrooms']}
        - Style: {requirements['style']}
        - Budget: ${requirements['budget']}
        - Climate: {requirements['climate']}

        Provide:
        1. Detailed room layout
        2. Construction cost breakdown
        3. Sustainable design recommendations
        """

        # Image description for DALL·E
        prompt_image = f"""
        A {requirements['style']} style house with {requirements['bedrooms']} bedrooms, {requirements['bathrooms']} bathrooms, suitable for a {requirements['climate']} climate, within a {requirements['total_area']} sq ft area, designed with sustainable materials.
        """

        try:
            # Generate textual explanation using GPT
            explanation_response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert architectural design AI."},
                    {"role": "user", "content": prompt_text}
                ],
                max_tokens=1000
            )
            explanation = explanation_response.choices[0].message.content

            # Generate 2D/3D home design image using DALL·E
            image_response = openai.Image.create(
                prompt=prompt_image,
                n=1,
                size="1024x1024"
            )
            image_url = image_response['data'][0]['url']

            return explanation, image_url

        except Exception as e:
            return str(e), None


@app.route('/generate-design', methods=['POST'])
def generate_home_design():
    data = request.json
    generator = HomeDesignGenerator()
    explanation, image_url = generator.generate_design_and_image(data)

    if image_url:
        return jsonify({"explanation": explanation, "image_url": image_url})
    else:
        return jsonify({"error": explanation}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
