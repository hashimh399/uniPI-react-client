import { NavLink } from "react-router-dom";

import { MdMessage } from "react-icons/md";
import { BiAnalyse } from "react-icons/bi";
import axios from "axios";
import { BsChatText } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdDashboardCustomize } from "react-icons/md";
import { MdRecordVoiceOver } from "react-icons/md";
import { MdOutlineSettingsVoice } from "react-icons/md";
import SidebarMenu from "./SidebarMenu";
import { CiEdit } from "react-icons/ci";
import { PiQueueFill } from "react-icons/pi";
import Dashboard from "../../pages/Dashboard";
import "../../styles/sidebar.css";
import "../../styles/active.css";
import Avatar from "@mui/material/Avatar";
import { BsFillFileRichtextFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiLogoutCircleRLine } from "react-icons/ri";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <MdDashboardCustomize />,
  },

  {
    path: "/results",
    name: "Result",
    icon: <MdMessage />,
  },
  {
    path: "/DigitalChannel",
    name: "Digital Channel",
    icon: <BiAnalyse />,
    subRoutes: [
      {
        path: "/digitalchannel/dashboard",
        name: "Dashboard",
        icon: <MdDashboardCustomize />,
      },
    ],
  },
  {
    path: "/queueStatistics",
    name: "Queue Statistics",
    icon: <PiQueueFill />,
    subRoutes: [
      {
        path: "/queueStatistics/voice",
        name: "Voice",
        icon: <MdOutlineSettingsVoice />,
      },
      {
        path: "/queueStatistics/chat",
        name: "Chat",
        icon: <BsChatText />,
      },
    ],
  },
  {
    path: "/voice-survey",
    name: "Voice Survey",
    icon: <MdRecordVoiceOver />,
    subRoutes: [
      {
        path: "/voice-survey/edit",
        name: "Edit Survey ",
        icon: <CiEdit />,
      },
      {
        path: "/voice-survey/templet",
        name: "Templates ",
        icon: <BsFillFileRichtextFill />,
      },
      {
        path: "/voice-survey/queue",
        name: "Queue Statistics",
        icon: <PiQueueFill />,
      },
    ],
  },
];

const SideBar = ({
  children,
  checkOpen,
  agentData,
  getAllDetails,
  signOut,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  console.log("AGENT DATA IS ", agentData);
  useEffect(() => {
    checkOpen(isOpen);
    console.log(isOpen);
  }, [isOpen]);

  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <>
      <div className="main-container relative   ">
        <motion.div
          animate={{
            width: isOpen ? "240px" : "60px",

            transition: {
              duration: 0.5,
              type: "spring",
            },
          }}
          className={`sidebar  `}
          // onClick={toggle}
          // onMouseEnter={() => {
          //   setIsOpen(true);
          // }}
          // onMouseLeave={() => {
          //   setIsOpen(false);
          // }}
        >
          <div className="top_section border-b-2 border-shade1  bg-shade1 ">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo items-center gap-3 "
                >
                  {/* <img alt="logo " src={logo} width="35px"></img> */}
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl  mb-2">&#120645;</h1>
                    <span className="text-xl font-semibold">UniPI</span>
                  </div>

                  <p className="text-sm flex gap-2 items-center ">
                    <Avatar
                      className="font-semibold"
                      src="/broken-image.jpg"
                      sx={{ width: 24, height: 24 }}
                    />{" "}
                    {agentData?.displayName}
                  </p>
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars cursor-pointer ">
              {isOpen ? (
                <GiHamburgerMenu onClick={toggle} />
              ) : (
                <h1 className="text-3xl pl-2" onClick={toggle}>
                  &#120645;
                </h1>
              )}{" "}
            </div>
          </div>

          <section className="routes ">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link flex items-center"
                >
                  <div className="icon text-2xl">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{
              durationd: 0.5,
              type: "spring",
              stiffness: 200,
              origin: 0,
            }}
            className="flex gap-2 absolute bottom-16 items-center justify-center px-4 py-2 bg-shade4    shadow-inner cursor-pointer rounded-r-md"
          >
            <RiLogoutCircleRLine className="text-xl" />

            {isOpen && (
              <motion.p
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                exit={{ x: -100 }}
                className="font-semibold  text-md z-40 text-white  "
                onClick={signOut}
              >
                Sign out
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SideBar;
