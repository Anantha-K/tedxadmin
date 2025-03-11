import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Scan = () => {
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const qrData = queryParams.get("qr");
        
        console.log("QR data from URL:", qrData);
        
        if (!qrData) {
          setError("No QR code data provided");
          setLoading(false);
          return;
        }

        // Try to parse the QR data if it's JSON
        let parsedQrData;
        try {
          parsedQrData = JSON.parse(qrData);
          console.log("Parsed QR data:", parsedQrData);
        } catch (parseError) {
          console.error("Failed to parse QR data:", parseError);
        }

        let responseData;

        // Handle both cases - either we have parsed email or direct QR data
        if (parsedQrData && parsedQrData.email) {
          // Case 1: We have parsed JSON with email
          const response = await axios.get(`${API_BASE_URL}/get-qr/${parsedQrData.email}`);
          console.log("Response from get-qr:", response.data);
          responseData = response.data;
        } else {
          // Case 2: We use raw QR data
          const response = await axios.post(`${API_BASE_URL}/scan-qr`, { qrData });
          console.log("Response from scan-qr:", response.data);
          responseData = response.data;
        }

        // Consistently format the participant data
        setParticipant({
          registrationId: responseData.registrationId,
          name: responseData.name,
          email: responseData.email,
          phone: responseData.phone || "N/A",
          isFisatian: responseData.isFisatian ? "Yes" : "No",
          isWatchParty: responseData.isWatchParty ? "Yes" : "No",
          present: responseData.present,
          tshirtSize: responseData.tshirtSize || "N/A",
        });
        
      } catch (err) {
        console.error("Error fetching participant data:", err);
        
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.error || "Failed to fetch participant data"}`);
        } else if (err.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantData();
  }, [location]);

  const markAsPresent = async () => {
    if (!participant || participant.present) return;
    
    setLoading(true);
    try {
      const payload = {
        registrationId: participant.registrationId,
        email: participant.email
      };
      
      const response = await axios.post(`${API_BASE_URL}/mark-present`, payload);
      
      console.log("Mark as present response:", response.data);
      
      setParticipant({
        ...participant,
        present: true
      });
      
      toast.success(`${participant.name} has been marked as present!`);
    } catch (err) {
      console.error("Error marking participant as present:", err);
      
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.error || "Failed to mark as present"}`);
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: "40px", 
        textAlign: "center",
        fontFamily: "Arial, sans-serif" 
      }}>
        <h2>Loading participant details...</h2>
        <div style={{ 
          margin: "20px auto",
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #3498db",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          animation: "spin 2s linear infinite",
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: "40px", 
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        color: "#d9534f"
      }}>
        <h2>Error Scanning QR Code</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#5bc0de",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "30px", 
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ color: "#343a40", marginBottom: "30px" }}>Participant Details</h1>
      
      {participant && (
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            textAlign: "left",
            marginBottom: "30px"
          }}>
            <div style={{ fontWeight: "bold", color: "#6c757d" }}>Registration ID:</div>
            <div>{participant.registrationId}</div>
            
            <div style={{ fontWeight: "bold", color: "#6c757d" }}>Name:</div>
            <div>{participant.name}</div>
            
            <div style={{ fontWeight: "bold", color: "#6c757d" }}>Email:</div>
            <div>{participant.email}</div>
            
            <div style={{ fontWeight: "bold", color: "#6c757d" }}>Phone:</div>
            <div>{participant.phone}</div>
            
            <div style={{ fontWeight: "bold", color: "#6c757d" }}>Fisatian:</div>
            <div>{participant.isFisatian}</div>
            
            <div style={{ fontWeight: "bold", color: "#6c757d" }}>Watch Party:</div>
            <div>{participant.isWatchParty}</div>
            
            {/* Always show T-shirt size field, displaying N/A if not available */}
            <div style={{ fontWeight: "bold", color: "#6c757d" }}>T-shirt Size:</div>
            <div>{participant.tshirtSize}</div>
            
            <div style={{ fontWeight: "bold", color: "#6c757d" }}>Present:</div>
            <div style={{ 
              color: participant.present ? "#28a745" : "#dc3545",
              fontWeight: "bold" 
            }}>
              {participant.present ? "Yes" : "No"}
            </div>
          </div>
          
          {!participant.present && (
            <button
              onClick={markAsPresent}
              style={{
                padding: "12px 24px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "background-color 0.3s"
              }}
            >
              Mark as Present
            </button>
          )}
          
          {participant.present && (
            <div style={{
              padding: "15px",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "4px",
              marginTop: "20px"
            }}>
              This participant has already been marked as present.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scan;