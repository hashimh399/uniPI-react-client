import React, { useState } from "react";
import SelectMenu from "../../components/SelectMenu";
import { IoPerson } from "react-icons/io5";
import { BsChatSquareDotsFill } from "react-icons/bs";
const WorkforceMetrics = () => {
  const [selectedTeam, setSelectedTeam] = useState();
  const workforceMenu = [
    {
      name: "Logged in",
      icon: <IoPerson />,
    },
    {
      name: "Accepting Chats",
      icon: <BsChatSquareDotsFill />,
    },
    {
      name: "Not accepting chats",
      icon: <BsChatSquareDotsFill />,
    },
  ];

  const teams = [
    { value: "team1", label: "Team 1" },
    { value: "team2", label: "Team 2" },
    { value: "team3", label: "Team 3" },
  ];
  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };
  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <div className="">
          <p className="font-semibold text-lg">Real-time workforce overview </p>
          <p className="text-sm text-slate-500">
            Track your workforce availability in real-time
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
          <div className="shadow-md  grid grid-cols-3 rounded-md py-4  gap-2 p-4  ">
            {workforceMenu.map((menu, index) => {
              return (
                <div
                  key={index}
                  className={`flex  flex-col justify-between cursor-pointer hover:bg-slate-50 duration-300  py-[2rem] items-center  text-center gap-3 ${
                    index !== workforceMenu.length - 1 &&
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
};

export default WorkforceMetrics;
