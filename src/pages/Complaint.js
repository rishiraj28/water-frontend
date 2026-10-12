import React, { useState } from 'react';
import { createComplaint } from '../api';

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto 0',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

function Complaint() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    zone: '',
    complaintType: '',
    phoneNumber: '',
    emailAddress: '',
    description: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSuccess = formError === 'Complaint submitted successfully!';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const normalizedForm = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );
    if (Object.values(normalizedForm).some((value) => !value)) {
      setFormError('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createComplaint(normalizedForm);
      if (response.status !== 201 || !response.data?.id) {
        throw new Error('The server did not confirm that the complaint was saved.');
      }
      setFormData({
        name: '',
        address: '',
        zone: '',
        complaintType: '',
        phoneNumber: '',
        emailAddress: '',
        description: '',
      });
      setFormError('Complaint submitted successfully!');
    } catch (error) {
      const message = error.response?.data?.detail || error.response?.data?.message;
      setFormError(error.message.includes('API URL is not configured')
        ? error.message
        : message || 'Error submitting complaint. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div style={styles.container}>
      <h1>Submit a Complaint</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Zone</label>
          <select
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Zone</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Complaint Type</label>
          <select
            name="complaintType"
            value={formData.complaintType}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Complaint Type</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Water Contamination">Water Contamination</option>
            <option value="Low Water Pressure">Low Water Pressure</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            style={styles.input}
            minLength={7}
            maxLength={20}
            pattern="[0-9+()\\s-]{7,20}"
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: '110px', resize: 'vertical' }}
            maxLength={2000}
            required
          />
        </div>
        {formError && <p role={isSuccess ? 'status' : 'alert'} style={{ color: isSuccess ? 'green' : 'red' }}>{formError}</p>}
        <button type="submit" style={{ ...styles.button, opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}

export default Complaint;