import React, { useState, useEffect } from 'react';
import './reg.css';
const tshirtSizes = [
  { size: 'XS', measurements: '34-36' },
  { size: 'S', measurements: '36-38' },
  { size: 'M', measurements: '38-40' },
  { size: 'L', measurements: '40-42' },
  { size: 'XL', measurements: '42-44' },
  { size: 'XXL', measurements: '44-46' }
];

const TEDxRegistration = () => {
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(600); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    isFisatian: '',
    role: '',
    branch: '',
    semester: '',
    tshirtSize: '',
    paymentScreenshot: null
  });

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTshirtSelect = (size) => {
    setFormData((prev) => ({ ...prev, tshirtSize: size }));
  };

  const handleFileUpload = (e) => {
    setFormData((prev) => ({ ...prev, paymentScreenshot: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      console.log('Form submitted:', formData);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="registration-container">
      <div className="header">
        <img src="logo-white.png" alt="TEDx Logo" className="logo" />
        <div className="subtitle">Register Now</div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="section-title">Personal Information</div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                required
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                required
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="isFisatian">Are you a FISAT student?</label>
              <select
                id="isFisatian"
                required
                value={formData.isFisatian}
                onChange={handleInputChange}
              >
                <option value="">Please select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {formData.isFisatian === 'no' && (
              <div className="form-group">
                <label htmlFor="role">Role/Profession</label>
                <input
                  type="text"
                  id="role"
                  placeholder="Enter your role/profession"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
          </div>

          {formData.isFisatian === 'yes' && (
            <div className="academic-section">
              <div className="section-title">Academic Information</div>
              <div className="notice-box">
                <strong>Note:</strong> Please bring your FISAT ID card on the event day for verification.
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="branch">Branch</label>
                  <select
                    id="branch"
                    required
                    value={formData.branch}
                    onChange={handleInputChange}
                  >
                    <option value="">Select branch</option>
                    <option value="cse">Computer Science Engineering</option>
                    <option value="ece">Electronics & Communication</option>
                    <option value="eee">Electrical & Electronics</option>
                    <option value="mech">Mechanical Engineering</option>
                    <option value="civil">Civil Engineering</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="semester">Semester</label>
                  <select
                    id="semester"
                    required
                    value={formData.semester}
                    onChange={handleInputChange}
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}th Semester
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="section-title">T-Shirt Size</div>
          <div className="tshirt-sizes">
            {tshirtSizes.map(({ size, measurements }) => (
              <div
                key={size}
                className={`tshirt-option ${formData.tshirtSize === size ? 'selected' : ''}`}
                onClick={() => handleTshirtSelect(size)}
              >
                <div className="size-details">
                  <span className="size">{size}</span>
                  <span className="measurements">{measurements}</span>
                </div>
                <div className="radio-circle">
                  {formData.tshirtSize === size && <div className="radio-dot" />}
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      ) : (
        <div className="payment-section">
          <div className="countdown">Time remaining: {formatTime(timeLeft)}</div>
          <div className="payment-instructions">
            <h2>Payment Instructions</h2>
            <ol>
              <li>Scan the QR code below using any UPI payment app</li>
              <li>Take a screenshot of your payment confirmation</li>
              <li>Upload the screenshot below</li>
            </ol>
            <div className="price">Early Bird: ₹699</div>
          </div>

          <div className="qr-code">
            <img src="qr.jpeg" alt="Payment QR Code" />
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="payment">Upload Payment Screenshot</label>
              <input
                type="file"
                id="payment"
                accept="image/*"
                required
                onChange={handleFileUpload}
              />
            </div>
            <button type="submit" className="submit-button">
              Submit Payment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TEDxRegistration;
