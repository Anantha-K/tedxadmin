import React, { useState, useEffect } from 'react';
import { Users, Mail, Eye, X, Loader2 , MailIcon, Phone, Shirt} from 'lucide-react';
import '../Styles/dashboard.css';
import toast from 'react-hot-toast';


const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL;

const RegistrationsList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [token, setToken] = useState(null);
  const [watchParty,isWatchParty] = useState(false);

  useEffect(() => {
    fetchRegistrations();
    localStorage.getItem('authToken') || window.location.replace('/admin/signin');
    setToken(localStorage.getItem('authToken'));
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/registrations`);
      const data = await response.json();
      setRegistrations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setLoading(false);
    }
  };

  const sendMail = async (email, name, registrationId, isFisatian) => {
    try {
      await fetch(`${API_BASE_URL}/sendmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          registrationId,
          isFisatian
        }),
      });
      toast.success('Mail sent successfully!');
    } catch (error) {
      console.error('Error sending mail:', error);
      toast.error('Failed to send mail');
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
        <Loader2 className="loading-icon" />
        <h2>Loading registrations...</h2>
      </div>
    );
  }

  if(!setToken){
    return(
      <div className="loading-container">
        <h2>Unauthorized Access</h2>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="headerr">
        <Users className="icon" />
        <h1>TEDx Registrations</h1>
      </div>

      <div className="registrations">
        {registrations.map((registration,index) => (
          <div key={registration._id} className="card">
            <div className="card-content">
              <div className="info">
                <div style={{display:"flex",justifyContent:"start",gap:"10px",alignItems:"center"}}>
                <h3>{index+1}.</h3>
                <h3>{registration.personalInfo.name}</h3>
                </div>
                {registration.personalInfo.isFisatian && <p className="fisatian">Fisatian</p>}
                {registration.isWatchParty && <p className="watchParty">Watch Party</p>}
                <p><MailIcon/>{registration.personalInfo.email}</p>
                <p><Phone/>{registration.personalInfo.phone}</p>
                <div style={{display:"flex",justifyContent:"start",gap:"10px",alignItems:"center"}}>
                <Shirt/>
                <h3>{registration.personalInfo.tshirtSize}</h3>
                </div>
              </div>
              
              <div className="actions">
                <button onClick={() => handleOpenModal(registration.paymentInfo.screenshotUrl)} className="btn view">
                  <Eye className="btn-icon" /> View Payment
                </button>
                {registration.personalInfo.mailSent? <button disabled={true} className="btn send">
                  <Mail className="btn-icon" /> Mail Sent already
                </button>: 
                <button onClick={() => sendMail(
                  registration.personalInfo.email,
                  registration.personalInfo.name,
                  registration._id,
                  registration.personalInfo.isFisatian
                )} className="btn send">
                  <Mail className="btn-icon" /> Send Mail
                </button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseModal} className="close-btn">
              <X />
            </button>
            <img src={selectedScreenshot} alt="Payment Screenshot" className="modal-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsList;
