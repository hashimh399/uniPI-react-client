import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/agentPerformance.css";
import { useWebSocket } from "../../services/WebScoketContext";

const TeamPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  return (
    <div className="relative w-full shadow-md">
      <div className="flex justify-between items-center mb-2 orange-Gradient p-2 rounded-md">
        <h2 className="text-lg text-slate-800 font-semibold">
          Team Performance
        </h2>
        <div className=" customSelect ">
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="last7days">Last 7 Days</option>
            <option value="today">Today</option>
          </select>
        </div>
      </div>

      <div className=" w-full h-[20rem]     rounded-md  ">
        <ul>
          {performanceData.map((agent, index) => (
            <li className=" border-b-2 p-4" key={index}>
              <div className="flex justify-between">
                <p> Agent: {agent.name}</p>
                <p className="flex flex-col ">
                  score: {agent.id}
                  <a href="# " className=" text-blue-500 text-sm ">
                    Full Report{" "}
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamPerformance;
