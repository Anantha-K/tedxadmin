import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../Styles/reg.css";
import { Loader2 } from "lucide-react";

const STORAGE_KEY = "tedx_registration";
const PAYMENT_TIMEOUT = 600;
const MAX_REGISTRATIONS = 30;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const tshirtSizes = [
  { size: "XS", measurements: "34-36" },
  { size: "S", measurements: "36-38" },
  { size: "M", measurements: "38-40" },
  { size: "L", measurements: "40-42" },
  { size: "XL", measurements: "42-44" },
  { size: "XXL", measurements: "44-46" },
];

const TEDxRegistration = () => {
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationsFull, setRegistrationsFull] = useState(false);
  const [registrationStarted, setRegistrationStarted] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(MAX_REGISTRATIONS);
  const [validationErrors, setValidationErrors] = useState({
    phone: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    isFisatian: "",
    role: "",
    branch: "",
    semester: "",
    tshirtSize: "",
    paymentScreenshot: null,
    registrationTime: null,
  });

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid 10-digit Indian phone number";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const checkRegistrationAvailability = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/registration-count`);
      if (!response.ok) throw new Error("Failed to fetch registration count");

      const data = await response.json();
      setRegistrationsFull(!data.available);
      setRemainingSlots(data.remaining);
      return data.available;
    } catch (error) {
      console.error("Error checking registration availability:", error);
      toast.error("Unable to verify registration availability");
      return false;
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/registration-status`);
      if (!response.ok) throw new Error("Failed to fetch registration status");

      const data = await response.json();
      setRegistrationStarted(data.open);
      return data.started;
    } catch (error) {
      console.error("Error checking registration status:", error);
      toast.error("Unable to verify registration status");
      return false;
    }
  };

  useEffect(() => {
    const checkSlots = async () => {
      await checkRegistrationAvailability();
    };

    checkSlots();

    const intervalId = setInterval(checkSlots, 30000);

    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    const initializeRegistration = async () => {
      setIsLoading(true);

      const hasStarted = await checkRegistrationStatus();
      if (!hasStarted) {
        setIsLoading(false);
        return;
      }

      await checkRegistrationAvailability();

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        if (parsedData.registrationTime) {
          const now = Date.now();
          const timeElapsed = Math.floor(
            (now - parsedData.registrationTime) / 1000
          );
          const remainingTime = PAYMENT_TIMEOUT - timeElapsed;

          if (remainingTime > 0 && !parsedData.paymentScreenshot) {
            setFormData(parsedData);
            setTimeLeft(remainingTime);
            setStep(2);
          } else if (remainingTime <= 0 && !parsedData.paymentScreenshot) {
            localStorage.removeItem(STORAGE_KEY);
            toast.error(
              "Your registration session has expired. Please start again."
            );
          }
        }
      }
      setIsLoading(false);
    };

    initializeRegistration();
  }, []);

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem(STORAGE_KEY);
            setStep(1);
            toast.error("Payment time expired. Please register again.");
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    if (formData.registrationTime) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "phone") {
      setValidationErrors((prev) => ({
        ...prev,
        phone: validatePhone(value),
      }));
    } else if (id === "email") {
      setValidationErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
  };

  const handleTshirtSelect = (size) => {
    setFormData((prev) => ({ ...prev, tshirtSize: size }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, paymentScreenshot: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);

    setValidationErrors({
      phone: phoneError,
      email: emailError,
    });

    if (phoneError || emailError) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    if (step === 1) {
      setIsLoading(true);
      const isAvailable = await checkRegistrationAvailability();

      if (!isAvailable) {
        toast.error("Sorry, registrations are now full");
        setRegistrationsFull(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            isFisatian: formData.isFisatian,
            branch: formData.isFisatian === "yes" ? formData.branch : undefined,
            semester:
              formData.isFisatian === "yes" ? formData.semester : undefined,
            role: formData.isFisatian === "no" ? formData.role : undefined,
            tshirtSize: formData.tshirtSize,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Registration failed");
        }

        const newFormData = {
          ...formData,
          registrationTime: Date.now(),
        };
        setFormData(newFormData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
        setStep(2);
        toast.success("Registration successful! Please complete the payment.");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        const formDataObj = new FormData();
        formDataObj.append("email", formData.email);
        formDataObj.append("payment", formData.paymentScreenshot);

        const response = await fetch(`${API_BASE_URL}/submit-payment`, {
          method: "POST",
          body: formDataObj,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Payment submission failed");
        }

        toast.success("Submitted Successfully! You will receive a confirmation email shortly.");
        localStorage.removeItem(STORAGE_KEY);
        setFormData({
          name: "",
          email: "",
          phone: "",
          gender: "",
          isFisatian: "",
          role: "",
          branch: "",
          semester: "",
          tshirtSize: "",
          paymentScreenshot: null,
          registrationTime: null,
        });
        setStep(1);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-icon" />
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!registrationStarted) {
    return (
      <div className="registration-container">
        <div className="header">
          <img src="/logo-white.png" alt="TEDx Logo" className="logo" />
          <div className="subtitle">Registration Not Started</div>
        </div>
        <div className="registration-closed">
          <h2>Registration Starting Soon</h2>
          <p>Registration has not started yet. Please check back at 7:30pm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="header">
        <img src="/logo-white.png" alt="TEDx Logo" className="logo" />
        {registrationsFull ? (
          <div className="subtitle">Registrations Full</div>
        ) : (
          <div className="subtitle">Second Phase Tickets Live Now</div>
        )}
        {!registrationsFull && (
          <div className="slots-remaining">
            Remaining slots: {remainingSlots}
          </div>
        )}
      </div>

      {registrationsFull ? (
        <div className="registration-closed">
          <h2>Registration Closed</h2>
          <p>Sorry, all available slots have been filled.</p>
        </div>
      ) : step === 1 ? (
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
                className={validationErrors.email ? "error" : ""}
              />
              {validationErrors.email && (
                <div className="error-message">{validationErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                required
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className={validationErrors.phone ? "error" : ""}
              />
              {validationErrors.phone && (
                <div className="error-message">{validationErrors.phone}</div>
              )}
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

            {formData.isFisatian === "no" && (
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

          {formData.isFisatian === "yes" && (
            <div className="academic-section">
              <div className="section-title">Academic Information</div>
              <div className="notice-box">
                <strong>Note:</strong> Please bring your FISAT ID card on the
                event day for verification.
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
                        S{sem}
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
                className={`tshirt-option ${
                  formData.tshirtSize === size ? "selected" : ""
                }`}
                onClick={() => handleTshirtSelect(size)}
              >
                <div className="size-details">
                  <span className="size">{size}</span>
                  <span className="measurements">{measurements}</span>
                </div>
                <div className="radio-circle">
                  {formData.tshirtSize === size && (
                    <div className="radio-dot" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || !formData.tshirtSize}
          >
            {isLoading ? "Processing..." : "Register"}
          </button>
        </form>
      ) : (
        <div className="payment-section">
          <div className="countdown">
            Time remaining: {formatTime(timeLeft)}
          </div>
          <div className="payment-instructions">
            <h2>Payment Instructions</h2>
            <ol>
              <li>Scan the QR code below using any UPI payment app</li>
              <li>
                UPI ID: <span className="upi-id">www.nizamudheen-1@okaxis</span>
              </li>
              <li>Take a screenshot of your payment confirmation</li>
              <li>Upload the screenshot below</li>
            </ol>
            {formData.isFisatian === "yes" ? (
              <div className="price">₹899</div>
            ) : (
              <div className="price">₹999</div>
            )}
          </div>

          <div className="qr-code">
            <img src="/qr.jpeg" alt="Payment QR Code" />
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
              <div className="file-requirements">Maximum file size: 5MB</div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading || !formData.paymentScreenshot}
            >
              {isLoading ? "Processing..." : "Submit Payment"}
            </button>
          </form>

          <div className="payment-note">
            <p>
              Note: Your registration will not be confirmed until payment is
              verified. The payment screenshot helps us track and verify your
              payment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TEDxRegistration;
