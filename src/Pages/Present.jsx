import React, { useState, useEffect } from 'react';
import { Users, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import '../Styles/list.css';

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
      <div className="present-container">
        <div className="present-header">
          <div className="header-title">
            <CheckCircle className="icon" color="#10b981" />
            <h2>Present Candidates</h2>
          </div>
          <div className="total-count">
            Total: {count}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loader2 className="loading-icon rotating" />
            <h3>Loading present candidates...</h3>
          </div>
        ) : presentCandidates.length === 0 ? (
          <div className="no-data">
            <h3>No candidates are marked as present yet</h3>
          </div>
        ) : (
          <div className="present-list">
            <div className="table-container">
              <div className="table-header">
                <span>ID</span>
                <span>Name</span>
                <span>Contact</span>
                <span>Fisatian</span>
                <span>Watch Party</span>
              </div>
              
              <div className="table-body">
                {presentCandidates.map((candidate, index) => (
                  <div key={candidate.registrationId} className={`candidate-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                    <span className="cell" data-label="ID">{candidate.registrationId}</span>
                    <span className="cell" data-label="Name">{candidate.name}</span>
                    <span className="cell" data-label="Contact">
                      <div>{candidate.email}</div>
                      <div>{candidate.phone}</div>
                    </span>
                    <span className="cell" data-label="Fisatian">{candidate.isFisatian}</span>
                    <span className="cell" data-label="Watch Party">{candidate.isWatchParty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentCandidates;