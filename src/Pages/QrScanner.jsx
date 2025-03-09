import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Scan = () => {
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchParticipantData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const qrData = queryParams.get("qr");

      if (!qrData) {
        setError("No QR code data provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/scan-qr`, {
          qrData,
        });
        setParticipant(response.data);
      } catch (err) {
        setError("Failed to fetch participant data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantData();
  }, [location]);

  const markAsPresent = async () => {
    if (!participant || participant.present) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/scan-qr`, {
        qrData: new URLSearchParams(location.search).get("qr"),
      });
      setParticipant(response.data);
    } catch (err) {
      setError("Failed to mark as present");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Participant Details</h1>
      {participant && (
        <div>
          <p><strong>Registration ID:</strong> {participant.registrationId}</p>
          <p><strong>Name:</strong> {participant.name}</p>
          <p><strong>Email:</strong> {participant.email}</p>
          <p><strong>Phone:</strong> {participant.phone}</p>
          <p><strong>Fisatian:</strong> {participant.isFisatian}</p>
          <p><strong>Watch Party:</strong> {participant.isWatchParty}</p>
          <p><strong>Present:</strong> {participant.present ? "Yes" : "No"}</p>
          {!participant.present && (
            <button
              onClick={markAsPresent}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Mark as Present
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Scan;