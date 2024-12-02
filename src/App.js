import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const HomeDesignGenerator = () => {
  const [formData, setFormData] = useState({
    total_area: '',
    bedrooms: '',
    bathrooms: '',
    style: '',
    budget: '',
    climate: ''
  });
  const [design, setDesign] = useState(null);
  const [designError, setDesignError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const generateDesign = async () => {
    setLoading(true);
    setDesign(null);
    setDesignError(null);
    try {
      const response = await axios.post('http://localhost:5000/generate-design', formData);
      const { explanation, image_url } = response.data;
      setDesign({ explanation, image_url });
    } catch (error) {
      console.error('Design generation failed', error);
      setDesignError('Failed to generate the design. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Planify AI</h1>
      <h6>(by Rahul and Shashank)</h6>
      <div className="form-grid">
        <input
          type="number"
          name="total_area"
          value={formData.total_area}
          onChange={handleInputChange}
          placeholder="Total Area (sq ft)"
        />
        <input
          type="number"
          name="bedrooms"
          value={formData.bedrooms}
          onChange={handleInputChange}
          placeholder="Bedrooms"
        />
        <input
          type="number"
          name="bathrooms"
          value={formData.bathrooms}
          onChange={handleInputChange}
          placeholder="Bathrooms"
        />
        <select
          name="style"
          value={formData.style}
          onChange={handleInputChange}
        >
          <option value="" disabled>
            Select Style
          </option>
          <option>Modern</option>
          <option>Traditional</option>
          <option>Minimalist</option>
        </select>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          placeholder="Budget"
        />
        <select
          name="climate"
          value={formData.climate}
          onChange={handleInputChange}
        >
          <option value="" disabled>
            Select Climate
          </option>
          <option>Temperate</option>
          <option>Tropical</option>
          <option>Desert</option>
        </select>
      </div>
      <button onClick={generateDesign} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Design'}
      </button>

      {designError && <p className="error">{designError}</p>}

      {design && (
        <div className="design-result">
          
          {design.image_url && (
            <img src={design.image_url} alt="Generated Home Design" className="design-image" />
          )}
          <h2>Generated Home Design</h2>
          <pre>{design.explanation}</pre>
        </div>
      )}
    </div>
  );
};

export default HomeDesignGenerator;
