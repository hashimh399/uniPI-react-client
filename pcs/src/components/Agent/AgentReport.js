import { useState, useEffect } from "react";
import "react-tooltip/dist/react-tooltip.css";
import ExcelDownloadButton from "../ExcelSheetDownload";

import * as React from "react";
import Button from "@mui/material/Button";
import { Tooltip } from "react-tooltip";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const AgentPerformance = ({ allData }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (details, liveSurvey) => {
    if (details && liveSurvey) {
      setCurrentAgentDetails(details);
      setCurrentLiveSurvey(liveSurvey);

      //setting current agent detais for excel sheet
      setAgentWiseExcel({
        AgentName: details.agentName,
        Survey_Response: details.Question1_Yes + details.Question1_No,
        liveSurvey: liveSurvey.map((survey) => ({
          ANI: survey.aniNumber,
          Q1: survey.question1,
          Q2: survey.question2,
          Q3: survey.question3,
        })),

        Q1_Score: (
          (details?.Question1_Yes /
            (details?.Question1_Yes + details?.Question1_No)) *
          100
        ).toFixed(2),
        Q2_Score: (
          (details?.Question2_Yes /
            (details?.Question2_Yes + details?.Question2_No)) *
          100
        ).toFixed(2),
        Q3_Score: (
          (details?.Question3_Yes /
            (details?.Question3_Yes + details?.Question3_No)) *
          100
        ).toFixed(2),
      });

      console.log("agent wise excel", agentWiseExcel);

      console.log("current live survey data", currentLiveSurvey);
      setShowModal(true);
      setOpen(true);
    } else {
      alert("No data Found");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  console.log("ALL DATA IS ", allData);
  const [showModal, setShowModal] = useState(false);
  const [currentLiveSurvey, setCurrentLiveSurvey] = useState();
  const [currentAgentDetails, setCurrentAgentDetails] = useState();
  const [agentExcel, setAgentExcel] = useState([]);
  const [agentWiseExcel, setAgentWiseExcel] = useState();
  const [dateRange, setDateRange] = useState("allTime");
  const [agentData, setAgentData] = useState([]);
  const [totalLiveSurvey, setTotalLiveSurvey] = useState([]);
  const [allAgentData, setAllAgentData] = useState([]);

  // Function to calculate the score
  const calculateScore = (data) => {
    const score =
      ((data.Question1_Yes + data.Question2_Yes + data.Question3_Yes) /
        (data.Question1_Yes +
          data.Question1_No +
          data.Question2_Yes +
          data.Question2_No +
          data.Question3_Yes +
          data.Question3_No)) *
      100;
    return isNaN(score) ? 0 : score.toFixed(2);
  };

  useEffect(() => {
    if (
      allData &&
      allData.AgentWiseReport &&
      allData.AgentWiseReport.length > 0
    ) {
      setAllAgentData(allData.AgentWiseReport[0]);
    }
    if (allData?.SupervisorDetails && allData?.SupervisorDetails?.teamsData) {
      const teamsData = allData?.SupervisorDetails?.teamsData;
      if (allData && allData.LiveSurvey && allData.LiveSurvey.length > 0) {
        setTotalLiveSurvey(allData.LiveSurvey[0]);
      }
      // Extract unique agents from all teams
      const uniqueAgents = Array.from(
        new Map(
          teamsData
            .flatMap((team) =>
              team.users.map((user) => ({
                id: user.ciUserId,
                name: user.firstName + " " + user.lastName,
              }))
            )
            .map((user) => [user.id, user])
        ).values()
      );

      // Filter allAgentData based on dateRange
      const filteredAllAgentData = allAgentData.filter((AgentData) => {
        const createdAtDate = new Date(AgentData.createdAt);
        const today = new Date();
        const sevenDaysAgo = new Date(
          today.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        if (dateRange === "today") {
          return (
            createdAtDate.getDate() === today.getDate() &&
            createdAtDate.getMonth() === today.getMonth() &&
            createdAtDate.getFullYear() === today.getFullYear()
          );
        } else if (dateRange === "last7Days") {
          return createdAtDate >= sevenDaysAgo && createdAtDate <= today;
        } else {
          return true; // Show all data for "allTime"
        }
      });

      // filter live survey data
      const filteredLiveSurvey = totalLiveSurvey.filter((liveSurey) => {
        const createdAtDate = new Date(liveSurey.createdAt);
        const today = new Date();
        const sevenDaysAgo = new Date(
          today.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        if (dateRange === "today") {
          return (
            createdAtDate.getDate() === today.getDate() &&
            createdAtDate.getMonth() === today.getMonth() &&
            createdAtDate.getFullYear() === today.getFullYear()
          );
        } else if (dateRange === "last7Days") {
          return createdAtDate >= sevenDaysAgo && createdAtDate <= today;
        } else {
          return true; // Show all data for "allTime"
        }
      });
      filteredLiveSurvey.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB;
      });
      console.log("filtered live survey data is :", filteredLiveSurvey);

      // making of new data set from filtered live survey data
      const newLiveSuveyData = filteredLiveSurvey.map((liveSurey) => {
        const date = new Date(liveSurey.createdAt);
        return {
          ID: liveSurey.agentId,
          AgentName: liveSurey.agentName,
          ANI: liveSurey.aniNumber,
          Date_Time: date.toLocaleString(),
          Q1: liveSurey.question1,
          Q2: liveSurey.question2,
          Q3: liveSurey.question3,
        };
      });

      setAgentExcel(newLiveSuveyData);
      //sortign of data according to the date and time

      const newData = uniqueAgents.map((agent) => {
        const AgentData = filteredAllAgentData.find(
          (data) => data.agentId === agent.id
        );

        const score = AgentData ? calculateScore(AgentData) : 0;
        const filteredAgentLiveSurvey = filteredLiveSurvey.filter(
          (liveSurey) => liveSurey.agentId === agent.id
        );

        return {
          name: agent.name,
          score: parseFloat(score),
          details: AgentData,
          liveSurvey: filteredAgentLiveSurvey,
        };
      });

      setAgentData(newData);
    }
  }, [allData, allAgentData, dateRange, totalLiveSurvey]);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };
  const handleShowModal = (details, liveSurvey) => {
    setCurrentAgentDetails(details);
    setCurrentLiveSurvey(liveSurvey);

    //setting current agent detais for excel sheet
    setAgentWiseExcel({
      AgentName: details.agentName,
      Survey_Response: details.Question1_Yes + details.Question1_No,
      liveSurvey: liveSurvey.map((survey) => ({
        ANI: survey.aniNumber,
        Q1: survey.question1,
        Q2: survey.question2,
        Q3: survey.question3,
      })),

      Q1_Score: (
        (details?.Question1_Yes /
          (details?.Question1_Yes + details?.Question1_No)) *
        100
      ).toFixed(2),
      Q2_Score: (
        (details?.Question2_Yes /
          (details?.Question2_Yes + details?.Question2_No)) *
        100
      ).toFixed(2),
      Q3_Score: (
        (details?.Question3_Yes /
          (details?.Question3_Yes + details?.Question3_No)) *
        100
      ).toFixed(2),
    });

    console.log("agent wise excel", agentWiseExcel);

    console.log("current live survey data", currentLiveSurvey);
    setShowModal(true);
  };

  console.log("agent data is :", agentData);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card agx">
      {/* <button onClick={handleSendMessage}>Refresh</button> */}

      <div className="container">
        <div className="flex justify-between items-center mb-3">
          <h4>Agent Performance</h4>
          <ExcelDownloadButton
            data={agentExcel}
            fileName={dateRange + " agentReport " + Date()}
          />
          <select
            className="form-select-sm"
            onChange={handleDateRangeChange}
            value={dateRange}
          >
            <option value="allTime">All Time</option>
            <option value="today">Today</option>
            <option value="last7Days">Last 7 Days</option>
          </select>
        </div>

        <ul className="agent-list">
          {agentData.map((agent, index) => (
            <li key={index} className="agent-item">
              <p className="agent-name">{agent.name}</p>

              <div className="flex flex-col mx-2">
                <p className="agent-score">Score: {agent.score}</p>
                {/* {console.log("agent current", agent.liveSurvey)} */}
                {/* ************************************************** */}
                <React.Fragment>
                  <a
                    href="#!"
                    className="text-blue-500 "
                    variant="outlined"
                    onClick={() =>
                      handleClickOpen(agent?.details, agent?.liveSurvey)
                    }
                  >
                    Full Report
                  </a>
                  <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    BackdropProps={{
                      sx: { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                    }}
                    s
                  >
                    <DialogTitle
                      sx={{ m: 0, p: 2 }}
                      id="customized-dialog-title"
                    >
                      Agent Details
                    </DialogTitle>
                    <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                      {currentAgentDetails ? (
                        <div>
                          <p>Agent Name: {currentAgentDetails?.agentName}</p>
                          <div className=" d-flex justify-center justify-content-around  ">
                            <a
                              href="#!"
                              data-tooltip-id="Q1"
                              data-tooltip-content={
                                currentAgentDetails?.Question1_No +
                                  currentAgentDetails?.Question1_Yes >
                                0
                                  ? (
                                      (currentAgentDetails?.Question1_Yes /
                                        (currentAgentDetails?.Question1_Yes +
                                          currentAgentDetails?.Question1_No)) *
                                      100
                                    ).toFixed(2)
                                  : 0
                              }
                            >
                              <Button variant="info">Q1 Score</Button>
                            </a>
                            <Tooltip id="Q1"></Tooltip>

                            {/* button 2 */}
                            <a
                              href="#!"
                              data-tooltip-id="Q2"
                              data-tooltip-content={
                                currentAgentDetails?.Question2_No +
                                  currentAgentDetails?.Question2_Yes >
                                0
                                  ? (
                                      (currentAgentDetails?.Question2_Yes /
                                        (currentAgentDetails?.Question2_Yes +
                                          currentAgentDetails?.Question2_No)) *
                                      100
                                    ).toFixed(2)
                                  : 0
                              }
                            >
                              <Button variant="info">Q2 Score</Button>
                            </a>
                            <Tooltip id="Q2"></Tooltip>

                            {/* button 3 for Q3 score */}
                            <a
                              href="#!"
                              data-tooltip-id="Q3"
                              data-tooltip-content={
                                currentAgentDetails?.Question3_No +
                                  currentAgentDetails?.Question3_Yes >
                                0
                                  ? (
                                      (currentAgentDetails?.Question3_Yes /
                                        (currentAgentDetails?.Question3_Yes +
                                          currentAgentDetails?.Question3_No)) *
                                      100
                                    ).toFixed(2)
                                  : 0
                              }
                            >
                              <Button variant="info">Q3 Score</Button>
                            </a>
                            <Tooltip id="Q3"></Tooltip>
                          </div>
                          <p>
                            Survey Response:{" "}
                            {currentAgentDetails?.Question1_No +
                              currentAgentDetails?.Question1_Yes}
                          </p>
                          <div className="tableDiv">
                            <table className="agent-table">
                              <thead>
                                <tr>
                                  <th>Ani</th>
                                  <th>Date Time</th>
                                  <th>Q1</th>
                                  <th>Q2</th>
                                  <th>Q3</th>
                                </tr>
                              </thead>
                              <tbody>
                                {console.log(
                                  "current survey",
                                  currentLiveSurvey
                                )}
                                {currentLiveSurvey?.map((survey, index) => (
                                  <tr
                                    key={index}
                                    className={
                                      index % 2 === 0 ? "even-row" : "odd-row"
                                    }
                                  >
                                    <td>{survey.aniNumber}</td>
                                    <td>
                                      {new Date(
                                        survey.createdAt
                                      ).toLocaleString()}
                                    </td>
                                    <td>{survey?.question1}</td>
                                    <td>{survey?.question2}</td>
                                    <td>{survey?.question3}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p>No data found</p>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button autoFocus onClick={handleClose}>
                        close
                      </Button>
                    </DialogActions>
                  </BootstrapDialog>
                </React.Fragment>

                {/* ************************************************ */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgentPerformance;
