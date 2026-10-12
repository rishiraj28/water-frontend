import React from 'react';

const styles = {
  page: {
    backgroundColor: '#f0f2f5', // Light background for the page
    padding: '20px',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '900px',
    margin: '20px auto', // Decreased margin from top
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '40px',
  },
};

function About() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>About Us</h1>
        <div style={styles.content}>
          <p>
            Welcome to the Water Quality Management (WQM) platform! Our mission is to raise awareness about the importance of clean water and promote sustainable practices for managing water resources.
          </p>
          <p>
            At WQM, we believe that access to clean water is a fundamental human right. We work towards ensuring that everyone has access to safe and clean drinking water, as well as proper sanitation facilities.
          </p>
          <p>
            Our platform provides information about water quality, common water pollutants, and ways to protect water resources. We also support initiatives aligned with Sustainable Development Goal 6 (SDG 6), which aims to ensure availability and sustainable management of water and sanitation for all.
          </p>
          <p>
            We are committed to taking complaints and addressing water quality issues promptly. If you have any concerns or complaints about water quality in your area, please reach out to us. Together, we can make a difference.
          </p>
          <p>
            Thank you for joining us in our mission to promote clean water and sustainable development!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
