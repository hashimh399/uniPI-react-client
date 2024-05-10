import React, { useState } from "react";

import "../styles/sidebar.css";

import { Route, Routes } from "react-router-dom";
import SideBar from "../components/Sidebar/SideNavBar";
import Dashboard from "../pages/Dashboard";
import Results from "../pages/Results";
import VoiceSurvey from "./voiceSurvey/VoiceSurvey";

import consiliumLogo from "../assets/consiliumSymbol.png";
import { IoIosRefreshCircle } from "react-icons/io";
import DigitalDashboard from "./digitalChannel/Dashboard";
import ChatTraffic from "./digitalChannel/ChatTraffic";
import WorkforceMetrics from "./digitalChannel/WorkforceMetrics";
import QueueStatistics from "./Queue_statistics/QueueStatistics";
import CreateSurvey from "../components/CreateSurvey";
import Templets from "./voiceSurvey/Templets";
import Voice from "./Queue_statistics/Voice";
import Chat from "./Queue_statistics/Chat";

function Home({
  userDetails,
  signOut,
  getAllDetails,
  allData,
  agentData,
  accessToken,
}) {
  const [open, setOpen] = useState();
  const checkOpen = (value) => {
    setOpen(value);
  };
  const [refreshClick, setRefreshClick] = useState(false);
  return (
    <div className="   relatives bg-slate-100 ">
      {/* sidebar */}

      {/* <Sidebar signOut={signOut} showLoader={showLoader} /> */}

      <div className={`fixed float-left  `}>
        <SideBar
          checkOpen={checkOpen}
          agentData={agentData}
          getAllDetails={getAllDetails}
          signOut={signOut}
        />
      </div>
      <div
        className={`${open ? "w-[calc(100vw-270px)] duration-300" : "w-[calc(100vw-80px)] duration-300"} float-right mb-[60px]  `}
      >
        <div className="fixed right-4 top-2">
          {" "}
          <img src={consiliumLogo} alt="logo" width="40px"></img>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                allData={allData}
                getAllDetails={getAllDetails}
                agentData={agentData}
              />
            }
          ></Route>
          <Route path="/results" element={<Results />}></Route>

          <Route path="/voice-survey" element={<VoiceSurvey />}>
            <Route
              path="edit"
              element={<CreateSurvey accessToken={accessToken} />}
            ></Route>
            <Route
              path="templet"
              element={<Templets accessToken={accessToken} />}
            ></Route>
            <Route
              path="queue"
              element={
                <QueueStatistics
                  accessToken={accessToken}
                  agentData={agentData}
                />
              }
            ></Route>
          </Route>
          <Route
            path="/queueStatistics"
            element={
              <QueueStatistics
                accessToken={accessToken}
                agentData={agentData}
              />
            }
          >
            <Route path="voice" element={<Voice />}></Route>
            <Route path="chat" element={<Chat />}></Route>
          </Route>
          <Route
            path="/digitalchannel/dashboard"
            element={<DigitalDashboard />}
          >
            <Route
              path=""
              element={<ChatTraffic agentData={agentData} />}
            ></Route>
            <Route
              path="chat"
              element={<ChatTraffic agentData={agentData} />}
            ></Route>
            <Route path="workforce" element={<WorkforceMetrics />}></Route>
          </Route>
        </Routes>
      </div>
      <footer>
        <div className="w-full bg-shade3 flex gap-2 justify-between fixed bottom-0 px-4 items-center  h-[40px]">
          <div>
            <button
              onClick={() => {
                getAllDetails();
                setRefreshClick(true);
                console.log(refreshClick);
              }}
              onMouseLeave={() => {
                setRefreshClick(false);
                console.log(refreshClick);
              }}
              className="text-white text-2xl"
            >
              <IoIosRefreshCircle
                className={`${refreshClick ? "rotate-180 duration-300" : "  duration-300"}`}
              />
            </button>
          </div>
          <div className="flex gap-2">
            <h1 className=" text-xl text-white font-bold  ">&copy; </h1>
            <span className="text-white">Consilium Software</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

// ******************************************************************************
