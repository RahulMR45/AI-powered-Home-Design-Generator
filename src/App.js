import React, { useState } from 'react';
import axios from 'axios';

const HomeDesignGenerator = () => {
  const [formData, setFormData] = useState({
    total_area: 1500,
    bedrooms: 3,
    bathrooms: 2,
    style: 'Modern',
    budget: 250000,
    climate: 'Temperate'
  });
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateDesign = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-design', formData);
      setDesign(response.data.design);
    } catch (error) {
      console.error('Design generation failed', error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>AI Home Design Generator</h1>
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
          <option>Temperate</option>
          <option>Tropical</option>
          <option>Desert</option>
        </select>
      </div>
      <button onClick={generateDesign} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Design'}
      </button>
      {design && (
        <div className="design-result">
          <h2>Generated Home Design</h2>
          <pre>{design}</pre>
        </div>
      )}
    </div>
  );
};

export default HomeDesignGenerator;