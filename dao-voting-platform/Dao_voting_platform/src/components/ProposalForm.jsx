import React, { useState } from 'react';
import { handleTransactionError } from '../utils/contract';
import './ProposalForm.css';

const ProposalForm = ({ contract, account }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!contract) {
      alert('Contract not initialized. Please refresh and try again.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Creating proposal:', formData);
      
      // Estimate gas first
      const gasEstimate = await contract.createProposal.estimateGas(
        formData.title.trim(),
        formData.description.trim()
      );
      
      console.log('Gas estimate:', gasEstimate.toString());

      // Create proposal with some buffer for gas
      const tx = await contract.createProposal(
        formData.title.trim(),
        formData.description.trim(),
        {
          gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
        }
      );

      console.log('Transaction submitted:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Reset form
      setFormData({ title: '', description: '' });
      
      // Show success message
      alert(`Proposal created successfully! 🎉\nTransaction: ${tx.hash}`);
      
    } catch (error) {
      console.error('Error creating proposal:', error);
      const errorMessage = handleTransactionError(error);
      alert(`Error creating proposal: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && !loading;

  return (
    <div className="proposal-form">
      <h2>📝 Create New Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Proposal Title *
            <span className="char-count">
              {formData.title.length}/100
            </span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a clear, concise title for your proposal"
            className={errors.title ? 'error' : ''}
            maxLength={100}
            disabled={loading}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description *
            <span className="char-count">
              {formData.description.length}/500
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide detailed information about your proposal. What are you proposing and why should people vote for it?"
            rows={6}
            className={errors.description ? 'error' : ''}
            maxLength={500}
            disabled={loading}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-info">
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <span>Voting period: 3 days</span>
          </div>
          <div className="info-item">
            <span className="info-icon">💰</span>
            <span>Gas fee: ~0.001 MATIC</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔗</span>
            <span>Stored on Polygon blockchain</span>
          </div>
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${loading ? 'loading' : ''}`}
          disabled={!isFormValid}
        >
          {loading ? (
            <>
              <span className="spinner">⏳</span>
              Creating Proposal...
            </>
          ) : (
            <>
              <span className="submit-icon">🚀</span>
              Create Proposal
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProposalForm;