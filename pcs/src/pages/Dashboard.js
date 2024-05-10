import AgentCarousel from "../components/Agent/AgentChart";

import PerformanceMeter from "../components/LiveMeter";
import ChartCarousel from "../components/Team/TeamChart";

import CardComponent from "../components/Team/TeamReport";
import AgentPerformance from "../components/Agent/AgentReport";
import FeedbackCarousel from "../components/LiveSurvey";
import { motion } from "framer-motion";
function Dashboard({ allData, getAllDetails, agentData }) {
  return (
    <motion.div
      className="  "
      initial={{ opacity: 0, x: 20, origin: "center" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
    >
      <motion.div className="sm:flex sm:flex-col lg:flex lg:justify-between lg:flex-row w-full mb-4   ">
        {/* Team Wise Report */}
        <div className="   rounded-md p-2 shadow-md">
          <ChartCarousel allData={allData} />
        </div>

        {/* Agent wise */}
        <div className="  rounded-md   p-2 shadow-md">
          <AgentCarousel allData={allData} />
        </div>
      </motion.div>
      {/* live survey */}

      <div className="w-full sm:flex sm:flex-col px-4 lg:flex lg:flex-row lg:items-center sm:gap-3 lg:gap-3   ">
        <div className="sm:w-full lg:w-[50%]">
          <div className="line-chart-container">
            <FeedbackCarousel allData={allData} />
          </div>
        </div>
        <div className="lg:w-[50%] sm:w-full p-4">
          <PerformanceMeter />
        </div>
      </div>

      <div className=" sm:flex sm:flex-col lg:flex px-4  lg:flex-row lg:gap-3 sm:gap-5  mr-6 mt-6  mb-6">
        {/* agent performance */}

        <div className="lg:w-[50%] sm:w-[100%]">
          <AgentPerformance allData={allData} />
        </div>

        {/* team performance */}
        <div className="lg:w-[50%] sm:w-[100%]">
          <CardComponent allData={allData} />
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
