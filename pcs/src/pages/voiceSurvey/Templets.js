// import React from "react";
// import MediaCard from "../../components/TempletsCard";
// import { motion } from "framer-motion";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";

// const Templets = () => {
//   const cards = [

//      {
//       title: "Banking",
//       image:
//         "https://images.unsplash.com/photo-1591033594798-33227a05780d?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       surveyFor: "Three questions",
//       audioFiles: ["Q1_audio_file.mp3", "Q2_audio_file.mp3", "Q3_audio_file.mp3"]
//     },
//       {
//       title: "Banking",
//       image:
//         "https://images.unsplash.com/photo-1591033594798-33227a05780d?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       surveyFor: "Three questions",
//       audioFiles: ["Q1_audio_file.mp3", "Q2_audio_file.mp3", "Q3_audio_file.mp3"]
//     },

//       {
//       title: "Banking",
//       image:
//         "https://images.unsplash.com/photo-1591033594798-33227a05780d?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       surveyFor: "Three questions",
//       audioFiles: ["Q1_audio_file.mp3", "Q2_audio_file.mp3", "Q3_audio_file.mp3"]
//     },

//       {
//       title: "Banking",
//       image:
//         "https://images.unsplash.com/photo-1591033594798-33227a05780d?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       surveyFor: "Three questions",
//       audioFiles: ["Q1_audio_file.mp3", "Q2_audio_file.mp3", "Q3_audio_file.mp3"]
//     },

//   ];

//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div className="mt-5">
//       <React.Fragment>
//         <Dialog
//           open={open}
//           onClose={handleClose}
//           PaperProps={{
//             component: "form",
//             onSubmit: (event) => {
//               event.preventDefault();
//               const formData = new FormData(event.currentTarget);
//               const formJson = Object.fromEntries(formData.entries());
//               const email = formJson.email;
//               console.log(email);
//               handleClose();
//             },
//           }}
//         >
//           <DialogTitle>Export new Flow</DialogTitle>
//           <DialogContent>
//             <DialogContentText>Export new flow.</DialogContentText>
//             <TextField
//               autoFocus
//               required
//               margin="dense"
//               id="name"
//               name="email"
//               label="Email Address"
//               type="email"
//               fullWidth
//               variant="standard"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button type="submit">Export</Button>
//           </DialogActions>
//         </Dialog>
//       </React.Fragment>
//       <div className="flex gap-3 pr-6    ">
//         {cards.map((card, index) => (
//           <motion.div
//             className="w-full"
//             transition={{ duration: 0.5 }}
//             initial={{ opacity: 0, y: -100 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <MediaCard
//               image={card.image}
//               queueName={card.title}
//               surveyFor={card.surveyFor}
//               handleClickOpen={handleClickOpen}
//             />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Templets;

// ********************************************************************************

import React, { useState, useEffect } from "react";
import MediaCard from "../../components/TempletsCard";
import { motion } from "framer-motion";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import sampleAudio from "../../assets/audio.wav";
import { InputLabel, Select, MenuItem } from "@mui/material";
import consiliumLogo from "../../assets/consiliumLogo.png";
const Templets = ({ accessToken }) => {
  const [open, setOpen] = useState(false);

  const [selectedQueue, setSelectedQueue] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentCardDetails, setCurrentCardDetails] = useState(null);
  const [data, setData] = useState();
  const [response, setResponse] = useState(null);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const queues = [];

  data &&
    data.length > 0 &&
    data.forEach((element) => {
      if (!queues.includes(element.queueName)) {
        queues.push(element?.queueName);
      }
    });

  const handleClickOpen = (cardDetails) => {
    setCurrentCardDetails(cardDetails);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleQueueChange = (event) => {
    setSelectedQueue(event.target.value);
  };

  const handleExport = () => {
    //sending queue name to backend
    postQueue();
    console.log("Exporting flow for queue:", selectedQueue);
    console.log("POST DATA", response);

    // handleClose();
  };

  //   *************************************************************

  //posting the queue name

  const postQueue = async () => {
    try {
      const apiUrl = "http://localhost:8000/ivr/queue";

      const requestBody = {
        queueName: selectedQueue,
      };

      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: headers,
      });

      setResponse(response);
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  // ****************************************************************

  const cards = [
    {
      title: "Banking Experience",
      tootlip: "info",

      info: "Welcome to our banking survey! Your feedback is crucial in helping us improve our services to better meet your needs. This survey is designed to gather insights into your banking experience and preferences.",
      image:
        "https://images.unsplash.com/photo-1591033594798-33227a05780d?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      surveyFor: "3 Questions",
      audioFiles: [`${sampleAudio}`, `${sampleAudio}`, `${sampleAudio}`],
    },
    {
      title: "Shopping Experience ",
      tootlip: "info",
      info: "Welcome to our banking survey! Your feedback is crucial in helping us improve our services to better meet your needs. This survey is designed to gather insights into your banking experience and preferences.",
      image:
        "https://images.unsplash.com/photo-1555529669-26f9d103abdd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fHNob3BwaW5nfGVufDB8fDB8fHww",
      surveyFor: "3 Questions",
      audioFiles: [
        "Q1_audio_file.mp3",
        "Q2_audio_file.mp3",
        "Q3_audio_file.mp3",
      ],
    },
    {
      title: "Consilium Services",
      tootlip: "info",
      info: "Welcome to our banking survey! Your feedback is crucial in helping us improve our services to better meet your needs. This survey is designed to gather insights into your banking experience and preferences.",
      image: `${consiliumLogo}`,
      surveyFor: "3 Questions",
      audioFiles: [
        "Q1_audio_file.mp3",
        "Q2_audio_file.mp3",
        "Q3_audio_file.mp3",
      ],
    },
  ];

  return (
    <div className="mt-5 ">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <React.Fragment>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                handleExport();
              },
            }}
          >
            {response && response.status && response?.status !== 200 ? (
              <>
                {console.log(response.status !== 200)}
                <DialogContent style={{ minWidth: "35vw", minHeight: "100px" }}>
                  Please select the Entry Point
                </DialogContent>
                <div className="px-3">
                  <TextField
                    select
                    autoFocus
                    label="Entey Point"
                    value={selectedQueue}
                    onChange={handleQueueChange}
                    fullWidth
                    required
                    margin="dense"
                  >
                    {/* <MenuItem value></MenuItem> */}
                    {queues.map((queue) =>
                      loading ? (
                        <div>loading...</div>
                      ) : queues.length !== 0 ? (
                        <MenuItem key={queue} value={queue}>
                          {" "}
                          {queue}
                        </MenuItem>
                      ) : (
                        <p className="text-center font-semibold ">
                          NO data found{" "}
                        </p>
                      )
                    )}
                  </TextField>
                </div>

                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Export</Button>
                </DialogActions>
              </>
            ) : (
              <>
                {console.log(response?.status !== 200)}
                <DialogTitle>Export new Flow</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {" "}
                    {currentCardDetails?.title}{" "}
                  </DialogContentText>

                  <TextField
                    select
                    autoFocus
                    label="Select Queue"
                    value={selectedQueue}
                    onChange={handleQueueChange}
                    fullWidth
                    required
                    margin="dense"
                  >
                    {/* <MenuItem value></MenuItem> */}
                    {queues.map((queue) =>
                      loading ? (
                        <div>loading...</div>
                      ) : queues.length !== 0 ? (
                        <MenuItem key={queue} value={queue}>
                          {" "}
                          {queue}
                        </MenuItem>
                      ) : (
                        <p className="text-center font-semibold ">
                          NO data found{" "}
                        </p>
                      )
                    )}
                  </TextField>
                  {console.log("currcard details", currentCardDetails)}
                  {currentCardDetails?.audioFiles?.map((audioUrl, index) => (
                    <div key={index} className="flex gap-2 items-center p-2">
                      <h1>Q{index + 1}. Audio</h1>
                      {console.log("AUDIO URL ", audioUrl)}
                      <audio controls>
                        <source src={audioUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Export</Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </React.Fragment>
      </motion.div>
      <div className="flex gap-3 flex-wrap  pr-6">
        {cards.map((card, index) => (
          <motion.div
            className=" w-[300px]  "
            key={index}
            transition={{ type: "spring", stiffness: 300, duration: 0.2 }}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, shadow: 2 }}
          >
            <MediaCard
              image={card.image}
              queueName={card.title}
              surveyFor={card.surveyFor}
              audioFiles={card.audioFiles}
              info={card.info}
              handleClickOpen={() => handleClickOpen(card)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Templets;
