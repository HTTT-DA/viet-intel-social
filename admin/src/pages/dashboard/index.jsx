import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (
      window.localStorage.getItem("userId") &&
      window.localStorage.getItem("email") &&
      window.localStorage.getItem("accessToken")
    ) {
      setIsLoggedIn(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);


  return <>{isLoggedIn && <div>Dashboard</div>}</>;
}

export default Dashboard;
