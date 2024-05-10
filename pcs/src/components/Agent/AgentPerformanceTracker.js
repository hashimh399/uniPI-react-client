import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/agentPerformance.css";
import { useWebSocket } from "../../services/WebScoketContext";

const AgentPerformanceTracker = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [filter, setFilter] = useState("all");

  // web socket data fetching
  const { messages, sendMessage, isConnected } = useWebSocket();
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (isConnected) {
      sendMessage({ data: { api: "AgentWiseReport" } });
      console.log(sendMessage);
      setAgentData(messages);
      console.log("message is ", messages);
      console.log("agent Data is ", agentData);
    }
  };

  useEffect(() => {
    if (isConnected) {
      sendMessage({ data: { api: "AgentWiseReport" } });
      console.log("message is ", messages);
      setAgentData(messages);
    }
  }, [isConnected]);

  const [agentData, setAgentData] = useState("");

  useEffect(() => {
    fetchData();
    // handleSendMessage();
  }, [filter]);

  const fetchData = async () => {
    try {
      let url = "https://jsonplaceholder.typicode.com/todos";
      if (filter === "last7days") {
        setInputMessage("Last7Days");
      } else if (filter === "today") {
      }

      const response = await axios.get(url);
      setPerformanceData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  return (
    <div className="relative w-full shadow-md">
      {/* <button onClick={handleSendMessage} className="z-40">
        click me
      </button> */}
      <div className="flex justify-between items-center mb-2 orange-Gradient p-2 rounded-md">
        <h2 className="text-lg text-slate-800 font-semibold">
          Agent Performance
        </h2>

        <div className=" customSelect ">
          <select
            value={filter}
            onChange={(e) => {
              handleFilterChange(e.target.value);
            }}
          >
            <option value="all">All Time</option>
            <option value="last7days">Last 7 Days</option>
            <option value="today">Today</option>
          </select>
        </div>
      </div>

      <div className=" w-full h-[20rem]    rounded-md overflow-y-scroll">
        <ul>
          {performanceData.map((agent, index) => (
            <li className=" border-b-2 p-4" key={index}>
              <div className="flex justify-between">
                <p> Agent: {agent.id}</p>
                <p className="flex flex-col ">score: {agent.id}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgentPerformanceTracker;

//*************************************************************************************************************** */
