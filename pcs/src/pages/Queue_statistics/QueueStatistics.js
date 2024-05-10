import React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import { motion, AnimatePresence } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import noData from "../../assets/no_data.jpg";
import "../../styles/queue.css";
import loadingImage from "../../assets/consiliumSymbol.png";

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const QueueStatistics = ({ accessToken, agentData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQueue, setExpandedQueue] = useState(null); // State to track expanded queue
  console.log(agentData?.orgId);

  const fetchData = async () => {
    try {
      const date = new Date();
      const to = date.getTime();
      const from = date.getTime() - 24 * 60 * 60 * 1000;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get(
        `https://api.wxcc-us1.cisco.com/v1/queues/statistics?from=${from}&to=${to}&orgId=69fc3aba-280a-4f8e-b449-2c198d78569b`,
        {
          headers: headers,
        }
      );

      setData(response.data.data);
      setLoading(false);
      console.log("RECEIVED DATA IS", response.data.data);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const queueWiseData = {};

  data.forEach((item) => {
    const { queueId } = item;

    if (queueWiseData.hasOwnProperty(queueId)) {
      queueWiseData[queueId].push(item);
    } else {
      queueWiseData[queueId] = [item];
    }
  });

  // console.log("Team wise data is ", queueWiseData);

  // Function to handle motion div click
  const handleMotionDivClick = (queueId) => {
    setExpandedQueue(queueId === expandedQueue ? null : queueId);
  };

  return (
    <div className="mt-5 pr-8">
      {loading ? (
        <div className="w-full h-[calc(100vh-40px)] flex justify-center items-center">
          <img
            src={loadingImage}
            alt="logo"
            className="loading-image"
            width="150px"
          ></img>
        </div>
      ) : Object.keys(queueWiseData).length !== 0 ? (
        <AnimatePresence>
          {Object.keys(queueWiseData).map((queue, index) => (
            <motion.div
              key={index}
              onClick={() => handleMotionDivClick(queue)}
              initial={{ height: "auto" }}
              animate={{ height: expandedQueue === queue ? "auto" : 50 }} // Change height based on expanded state
              transition={{ duration: 0.5 }} // Smooth animation transition
              exit={{ height: 0 }} // Animate the exit
            >
              <motion.div
                className="flex justify-between gap-2 items-center bg-slate-200 rounded-md cursor-pointer pl-2 pr-20 py-2 text-lg font-semibold font-sans "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.h2>
                  {" "}
                  Queue Name: {queueWiseData[queue][0]?.queueName}
                </motion.h2>
                <motion.h2>Total data: {queueWiseData[queue].length}</motion.h2>
              </motion.div>

              {expandedQueue === queue && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <table className="w-full bg-white shadow-md rounded-lg overflow-scroll mt-2 mb-2 ">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <tr>
                        <th className="py-3 px-6 text-left">Queue Name</th>
                        <th className="py-3 px-6 text-left">
                          Interval Start Time
                        </th>
                        <th className="py-3 px-6 text-left">Queue ID</th>
                        <th className="py-3 px-6 text-left">Channel Type</th>
                        <th className="py-3 px-6 text-left">
                          Total Offered Tasks
                        </th>
                        <th className="py-3 px-6 text-left">
                          Total Enqueued Tasks
                        </th>
                        <th className="py-3 px-6 text-left">
                          Total Assigned Tasks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {queueWiseData[queue].map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            {item?.queueName}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {new Date(item?.intervalStartTime).toLocaleString()}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {item?.queueId}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {item?.channelType}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {item?.totalOfferedTasks}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {item?.totalEnqueuedTasks}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {item?.totalAssignedTasks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <div className="w-full h-[calc(100vh-40px)] flex justify-center items-center">
          <img src={noData} alt="no data found" width="400rem"></img>
        </div>
      )}

      <div>
        {/* <Stack spacing={2}>
          <Pagination
            count={10}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Stack> */}
      </div>
      <Outlet />
    </div>
  );
};

export default QueueStatistics;
