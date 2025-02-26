import { useState,useEffect } from "react";

const Tshirt = () => {

  const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      console.log("check")
      const response = await fetch(`${API_BASE_URL}/tshirts`);
      const data = await response.json();
      console.log(data)
      setRegistrations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  if(loading){
    return <>Loading...</>
  }

  console.log(registrations.sizes)
  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "black" }}>
      <h1 style={{ color: "red", textAlign: "center" }}>Tshirt Sizes</h1>
      {Object.entries(registrations.sizes).map(([key, value]) => (
        <div key={key}>
          {key}: {value}
        </div>
      ))}
    </div>
  );
}


export default Tshirt