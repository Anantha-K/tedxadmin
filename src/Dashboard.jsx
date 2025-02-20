import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import './registrations.css';

const RegistrationsList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('https://registration-lhy3.onrender.com/registrations');
      const data = await response.json();
      setRegistrations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
      setLoading(false);
    }
  };

  const handleOpenModal = (screenshotUrl) => {
    setSelectedScreenshot(screenshotUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedScreenshot(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading registrations...</h2>
      </div>
    );
  }

  return (
    <div className="registrations-container">
      <h2>Registrations</h2>
      <div className="registrations-list">
        {registrations.map((registration) => (
          <div key={registration._id} className="registration-card">
            <div className="registration-info">
              <h3>{registration.personalInfo.name}</h3>
              <p>{registration.personalInfo.email}</p>
              <p>{registration.personalInfo.phone}</p>
            </div>
            <div className="registration-actions">
              <button
                className="view-screenshot"
                onClick={() => handleOpenModal(registration.paymentInfo.screenshotUrl)}
              >
                View Screenshot
              </button>
              <button
                className="view-screenshot"
              >
                Send Mail
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedScreenshot} alt="Payment Screenshot" />
            <button className="close-modal" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsList;
