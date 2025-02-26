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
      <div style={{width:"100vw",marginTop:"10vh",display:"flex",justifyContent:"center",alignItems:"center",flexWrap:"wrap", gap:"50px", flexDirection:window.innerHeight>window.innerWidth?"column":"row"}}>
        {Object.entries(registrations.sizes).map(([key, value]) => (
          <div key={key} style={{width:window.innerHeight>window.innerWidth?"80vw":"20vw",display:"flex",justifyContent:"center",alignItems:"center",height:"30vh",backgroundColor:"#202020",borderRadius:"15px",flexDirection:"column",gap:"50px"}}>
            <h1>{key}</h1>
            <h2>{value}</h2>
          </div>
        ))}
      </div>
      
    </div>
  );
}


export default Tshirt