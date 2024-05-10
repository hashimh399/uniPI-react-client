import React from "react";
import SelectMenu from "../../components/SelectMenu";
import { useState } from "react";
import { TbArrowBigLeftLines } from "react-icons/tb";
import { TbArrowBigLeft } from "react-icons/tb";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
import { FaRegClock } from "react-icons/fa6";
import { MdOutlineMotionPhotosPause } from "react-icons/md";
import { RiChatSmile2Line } from "react-icons/ri";
import { PiClockCounterClockwiseFill } from "react-icons/pi";

function ChatTraffic(agentData) {
  const teams = [
    { value: "team1", label: "Team 1" },
    { value: "team2", label: "Team 2" },
    { value: "team3", label: "Team 3" },
  ];

  const [selectedTeam, setSelectedTeam] = useState("");

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };
  const chatoverview = [
    {
      name: "Open conversation",
      icon: <HiOutlineChatBubbleLeftEllipsis />,
    },
    {
      name: "Waiting in queue",
      icon: <FaRegClock />,
    },
    {
      name: "On hold",
      icon: <MdOutlineMotionPhotosPause />,
    },
    {
      name: "Awating Response",
      icon: <RiChatSmile2Line />,
    },
  ];

  const pendingResponsesMenu = [
    {
      name: "Chats pending responses ",
      icon: <TbArrowBigLeftLines />,
    },
    {
      name: "Chats pending from agent ",
      icon: <TbArrowBigLeft />,
    },
    {
      name: "Chats pending from customer ",
      icon: <PiClockCounterClockwiseFill />,
    },
  ];

  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <div className="">
          <p className="font-semibold text-lg">Real-time chat overview </p>
          <p className="text-sm text-slate-500">
            Track key chat metrics in real-time
          </p>
        </div>
        <div>
          <SelectMenu
            options={teams}
            selectedOption={selectedTeam}
            onChange={handleTeamChange}
          />
        </div>
      </div>

      <div className=" lg:flex lg:gap-3 sm:flex sm:flex-column sm:gap-4 justify-between mt-5 ">
        <div>
          <p className="text-sm">Chat overview</p>
          <div className="shadow-md  grid grid-cols-4 rounded-md py-4  gap-2 p-4  ">
            {chatoverview.map((menu, index) => {
              return (
                <div
                  key={index}
                  className={`flex  flex-col justify-between cursor-pointer hover:bg-slate-50 duration-300  py-5 items-center  text-center gap-3 ${
                    index !== chatoverview.length - 1 &&
                    "border-r-2 border-slate-200"
                  } p-3`}
                >
                  <p>{menu.name}</p>
                  <h1 className="text-3xl font-semibold text-slate-300 ">
                    {menu.icon}
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-sm">Chats pendig response</p>
          <div className="shadow-md  grid grid-cols-3 rounded-md py-4  gap-2 p-4  ">
            {pendingResponsesMenu.map((menu, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-col justify-between cursor-pointer hover:bg-slate-50 duration-300  py-5 items-center   text-center gap-3    ${
                    index !== pendingResponsesMenu.length - 1 &&
                    "border-r-2 border-slate-200"
                  } p-3`}
                >
                  <p>{menu.name}</p>
                  <h1 className="text-3xl font-semibold text-slate-300 ">
                    {menu.icon}
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatTraffic;
