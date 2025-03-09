import React, { useState, useEffect } from 'react';
import { Users, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PresentCandidates = () => {
  const [presentCandidates, setPresentCandidates] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPresentCandidates();
  }, []);

  const fetchPresentCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/present-candidates`);
      const data = await response.json();
      setPresentCandidates(data.candidates);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching present candidates:', error);
      toast.error('Failed to fetch present candidates');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="present-section">
      <div className="present-container" style={{
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div className="present-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <CheckCircle className="icon" color="#10b981" />
            <h2>Present Candidates</h2>
          </div>
          <div className="total-count" style={{
            backgroundColor: "#10b981",
            color: "white",
            padding: "5px 15px",
            borderRadius: "20px",
            fontWeight: "bold"
          }}>
            Total: {count}
          </div>
        </div>

        {loading ? (
          <div className="loading-container" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px"
          }}>
            <Loader2 className="loading-icon" />
            <h3 style={{ marginLeft: "10px" }}>Loading present candidates...</h3>
          </div>
        ) : presentCandidates.length === 0 ? (
          <div className="no-data" style={{
            textAlign: "center",
            padding: "40px",
            color: "#6b7280"
          }}>
            <h3>No candidates are marked as present yet</h3>
          </div>
        ) : (
          <div className="present-list">
            <div className="table-header" style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 2fr 1fr 1fr 1fr 2fr",
              backgroundColor: "#e5e7eb",
              padding: "10px 15px",
              borderRadius: "4px",
              fontWeight: "bold",
              marginBottom: "10px"
            }}>
              <span>ID</span>
              <span>Name</span>
              <span>Contact</span>
              <span>Fisatian</span>
              <span>Watch Party</span>
              <span>Present</span>
              <span>Marked At</span>
            </div>
            
            {presentCandidates.map((candidate, index) => (
              <div key={candidate.registrationId} className="candidate-row" style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 2fr 1fr 1fr 1fr 2fr",
                padding: "12px 15px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: index % 2 === 0 ? "#f9fafb" : "white"
              }}>
                <span>{candidate.registrationId}</span>
                <span>{candidate.name}</span>
                <span>
                  <div>{candidate.email}</div>
                  <div>{candidate.phone}</div>
                </span>
                <span>{candidate.isFisatian}</span>
                <span>{candidate.isWatchParty}</span>
                <span style={{ color: "#10b981" }}>
                  <CheckCircle size={18} />
                </span>
                <span>{formatDate(candidate.markedPresentAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentCandidates;