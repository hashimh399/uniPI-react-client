import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "../../styles/digital.css";
import "../../styles/dashboard.css";
import { Outlet } from "react-router-dom";

const DigitalDashboard = () => {
  const location = useLocation();
  const { pathname } = location;
  // console.log(pathname);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, origin: "center" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
      className="mt-4 w-11/12 "
    >
      <h1 className="font-semibold text-xl">Dashbaord</h1>
      <p className="text-sm text-slate-600">
        Monitor the performance of your teams to boost productiveity.
      </p>
      {/* navigation buttons */}
      <nav>
        <ul className="flex gap-20 pt-5 border-b-2 border-slate-200 ">
          <li className="text-slate-500  ">
            <NavLink
              to="chat"
              className={`px-4 py-1 ${pathname === "/digitalchannel/dashboard" && "active"}`}
            >
              Chats traffic
            </NavLink>
          </li>
          <li className="text-slate-500  ">
            {" "}
            <NavLink to={`workforce`} className="px-4 py-1">
              Workforce metrics
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* ******************** routes ***************** */}
      <div className=" ">
        <Outlet />
      </div>
    </motion.div>
  );
};

export default DigitalDashboard;
