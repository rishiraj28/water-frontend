import React, { useRef, useState } from 'react';

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
  const [referenceId, setReferenceId] = useState('');
  const isProcessing = useRef(false);
  const isSuccess = Boolean(referenceId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError('');
    setReferenceId('');
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing.current) return;
    setFormError('');

    const normalizedForm = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );
    if (Object.values(normalizedForm).some((value) => !value)) {
      setFormError('Please fill out all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedForm.emailAddress)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!/^[0-9()+ -]{7,20}$/.test(normalizedForm.phoneNumber)) {
      setFormError('Please enter a valid phone number.');
      return;
    }

    isProcessing.current = true;
    try {
      const generatedReference = `WQM-${Math.floor(100000 + Math.random() * 900000)}`;
      setFormData({
        name: '',
        address: '',
        zone: '',
        complaintType: '',
        phoneNumber: '',
        emailAddress: '',
        description: '',
      });
      setReferenceId(generatedReference);
      setFormError('');
    } finally {
      isProcessing.current = false;
    }
  };  

  return (
    <div style={styles.container}>
      <h1>Submit a Complaint</h1>
      <form onSubmit={handleSubmit} noValidate>
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
            pattern="[0-9()+ -]{7,20}"
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
        {formError && <p role="alert" style={{ color: 'red' }}>{formError}</p>}
        {isSuccess && (
          <div role="status" style={{ color: 'green' }}>
            <p>Complaint registered successfully!</p>
            <p>Reference ID: {referenceId}</p>
            <p>Frontend demo only: complaints are not saved and will not persist after refreshing.</p>
          </div>
        )}
        <button type="submit" style={styles.button}>Submit Complaint</button>
      </form>
    </div>
  );
}

export default Complaint;