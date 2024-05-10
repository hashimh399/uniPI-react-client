import React from "react";
import CreateSurvey from "../../components/CreateSurvey";
import Dummy from "./Dummy";
import { Outlet } from "react-router-dom";

function VoiceSurvey() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default VoiceSurvey;
