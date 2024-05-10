import { useEffect, useState } from "react";

import { useWebSocket } from "../../services/WebScoketContext";
import ExcelDownloadButton from "../ExcelSheetDownload";
import { Button } from "react-bootstrap";
import * as React from "react";

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

const CardComponent = ({ allData }) => {
  const { data } = useWebSocket();
  const [allTeamData, setAllTeamData] = useState([]);
  const [dateRange, setDateRange] = useState("allTime");
  const [supervisorDetails, setSupervisorDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTeamData, setCurrentTeamData] = useState([]);
  const [currentTeamsDetails, setcurrentTeamsDetails] = useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (details, liveSurvey) => {
    setcurrentTeamsDetails(details);

    const currentTeamId = details?.teamId;
    const currentData = liveSurvey[0]?.filter(
      (survey) => survey?.teamId === currentTeamId
    );
    setCurrentTeamData(currentData);
    setShowModal(true);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Function to calculate the score
  const calculateScore = (data) => {
    return (
      ((data.Question1_Yes + data.Question2_Yes + data.Question3_Yes) /
        (data.Question1_Yes +
          data.Question1_No +
          data.Question2_Yes +
          data.Question2_No +
          data.Question3_Yes +
          data.Question3_No)) *
      100
    ).toFixed(2);
  };

  useEffect(() => {
    if (data && data.TeamWiseReport && data.TeamWiseReport.length > 0) {
      setAllTeamData(data.TeamWiseReport[0]);
    }
  }, [data]);

  useEffect(() => {
    if (allData.SupervisorDetails && allData.SupervisorDetails.teamsData) {
      const supervisorTeams = allData.SupervisorDetails.teamsData;

      // Filter allTeamData based on dateRange
      const filteredAllTeamData = allTeamData.filter((teamData) => {
        const createdAtDate = new Date(teamData.createdAt);
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
          return true;
        }
      });

      const newData = supervisorTeams?.map((team) => {
        const teamData = filteredAllTeamData.find(
          (data) => data.teamId === team.id
        );
        const score = teamData ? calculateScore(teamData) : 0;
        return {
          name: team.name,
          score: parseFloat(score),
          details: teamData,
          liveSurvey: allData.LiveSurvey,
        };
      });

      setSupervisorDetails(newData);
    }
  }, [allData, allTeamData, dateRange]);

  useEffect(() => {
    setDateRange("allTime");
  }, [data]);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleShowModal = (details, liveSurvey) => {
    setcurrentTeamsDetails(details);

    const currentTeamId = details?.teamId;
    const currentData = liveSurvey[0]?.filter(
      (survey) => survey?.teamId === currentTeamId
    );
    setCurrentTeamData(currentData);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card agx">
      <div className="container">
        <div className="flex justify-between items-center mb-3">
          <h4>Team Performance</h4>
          <ExcelDownloadButton
            data={supervisorDetails}
            fileName={dateRange + " agentReport"}
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
          {supervisorDetails.map((team, index) => (
            <li key={index} className="agent-item">
              <p className="agent-name">{team.name}</p>
              <div className="flex flex-col mx-2">
                <p className="agent-score text-blue-500">Score: {team.score}</p>
                {/* <CustomizedDialogs
                  currentTeamsDetails={currentTeamsDetails}
                  currentTeamData={currentTeamData}
                  teamDetail={team.detail}
                  liveSurvey={team.liveSurvey}
                  setcurrentTeamsDetails={setcurrentTeamsDetails}
                /> */}
                {/* ************************************************ */}
                <React.Fragment>
                  <a
                    href="#!"
                    className="text-blue-500 "
                    variant="outlined"
                    onClick={() => {
                      handleClickOpen(team.details, team.liveSurvey);
                    }}
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
                  >
                    <DialogTitle
                      sx={{ m: 0, p: 2 }}
                      id="customized-dialog-title"
                    >
                      Team Details
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
                      {currentTeamsDetails ? (
                        <div>
                          <p>Team Name: {currentTeamsDetails?.teamName}</p>
                          <div className="flex justify-around">
                            <a
                              href="#!"
                              data-tooltip-id="Q1"
                              data-tooltip-content={
                                currentTeamsDetails?.Question1_No +
                                  currentTeamsDetails?.Question1_Yes >
                                0
                                  ? (
                                      (currentTeamsDetails?.Question1_Yes /
                                        (currentTeamsDetails?.Question1_Yes +
                                          currentTeamsDetails?.Question1_No)) *
                                      100
                                    ).toFixed(2)
                                  : 0
                              }
                            >
                              <Button variant="info">Q1 Score</Button>
                            </a>
                            <Tooltip id="Q1"></Tooltip>
                            <a
                              href="#!"
                              data-tooltip-id="Q2"
                              data-tooltip-content={
                                currentTeamsDetails?.Question2_No +
                                  currentTeamsDetails?.Question2_Yes >
                                0
                                  ? (
                                      (currentTeamsDetails?.Question2_Yes /
                                        (currentTeamsDetails?.Question2_Yes +
                                          currentTeamsDetails?.Question2_No)) *
                                      100
                                    ).toFixed(2)
                                  : 0
                              }
                            >
                              <Button variant="info">Q2 Score</Button>
                            </a>
                            <Tooltip id="Q2"></Tooltip>
                            <a
                              href="#!"
                              data-tooltip-id="Q3"
                              data-tooltip-content={
                                currentTeamsDetails?.Question3_No +
                                  currentTeamsDetails?.Question3_Yes >
                                0
                                  ? (
                                      (currentTeamsDetails?.Question3_Yes /
                                        (currentTeamsDetails?.Question3_Yes +
                                          currentTeamsDetails?.Question3_No)) *
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
                            {currentTeamsDetails?.Question1_No +
                              currentTeamsDetails?.Question1_Yes}
                          </p>
                          <div className="tableDiv">
                            <table className="agent-table">
                              <thead>
                                <tr>
                                  <th>Agent Name</th>
                                  <th>Ani</th>
                                  <th>Date Time</th>
                                  <th>Q1</th>
                                  <th>Q2</th>
                                  <th>Q3</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentTeamData?.map((survey, index) => (
                                  <tr
                                    key={index}
                                    className={
                                      index % 2 === 0 ? "even-row" : "odd-row"
                                    }
                                  >
                                    <td>{survey.agentName}</td>
                                    <td>{survey.aniNumber}</td>
                                    <td>
                                      {new Date(
                                        survey.createdAt
                                      ).toLocaleString()}
                                    </td>
                                    <td>{survey.question1}</td>
                                    <td>{survey.question2}</td>
                                    <td>{survey.question3}</td>
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
                      <Button autoFocus onClick={() => handleClose()}>
                        close
                      </Button>
                    </DialogActions>
                  </BootstrapDialog>
                </React.Fragment>

                {/* ***************************************************** */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CardComponent;
