import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useWebSocket } from "./services/WebScoketContext";
import WebexAuth from "./components/WebexAuth";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [allData, setAlldata] = useState([]);
  const [agentData, setAgentData] = useState();
  const [accessToken, setAccessToken] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const { sendMessage, data, isConnected } = useWebSocket();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if access token is stored in local storage
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  useEffect(() => {
    // Request access token when the component mounts
    try {
      axios
        .get("http://localhost:5000/api/accessToken")
        .then((res) => {
          const newAccessToken = res.data.accessToken;
          setAccessToken(newAccessToken);
          localStorage.setItem("accessToken", newAccessToken); // Store access token in local storage
        })
        .catch((err) => {
          console.log("Error fetching access token:", err);
        });
    } catch (error) {
      console.log("Error fetching access token:", error);
    }

    if (isConnected) {
      sendMessage({
        data: { api: "SupervisorDetails" },
      });

      sendMessage({
        data: { api: "AllTimeReport" },
      });

      sendMessage({
        data: { api: "TeamWiseReport" },
      });
      sendMessage({
        data: { api: "AgentWiseReport" },
      });
      sendMessage({
        data: { api: "LiveSurvey" },
      });
      setAlldata(data);
    }
    // Optionally, fetch additional data if needed
  }, [isConnected]);

  useEffect(() => {
    // Fetch agent data when access token changes
    fetchData();
  }, [accessToken]);

  function fetchData() {
    // Fetch agent data by calling an API
    axios
      .get("https://webexapis.com/v1/people/me?callingData=true", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setAgentData(response.data);
        console.log("AGENT Data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching agent data:", error);
      });
  }

  const handleLogin = () => {
    // Redirect to Webex authentication page
    window.location.href = "http://localhost:5000/api/authorize/webex";
  };

  const signOut = () => {
    localStorage.removeItem("accessToken"); // Remove access token from local storage
    setAccessToken("");
  };

  const getAllDetails = () => {
    sendMessage({
      data: { api: "SupervisorDetails" },
    });

    sendMessage({
      data: { api: "AllTimeReport" },
    });

    sendMessage({
      data: { api: "TeamWiseReport" },
    });
    sendMessage({
      data: { api: "AgentWiseReport" },
    });
    sendMessage({
      data: { api: "LiveSurvey" },
    });
    setAlldata(data);
    console.log("received data ", allData);
  };

  // Check if the stored access token matches the current access token
  const isAuthenticated =
    accessToken !== "" && localStorage.getItem("accessToken") === accessToken;

  return (
    <>
      {isAuthenticated ? (
        <Home
          userDetails={userDetails}
          signOut={signOut}
          getAllDetails={getAllDetails}
          allData={data}
          agentData={agentData}
          accessToken={accessToken}
        />
      ) : (
        <WebexAuth handleLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
