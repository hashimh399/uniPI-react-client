const bodyParser = require("body-parser");
const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
var cluster = require("cluster");
var cCPUs = 1;
const { authorize, redirect } = require("./webexhelper");
const { access } = require("fs");
const port = process.env.PORT || 5000;
const refreshTokenInterval = 11 * 60 * 60 * 1000; // 11 hours in milliseconds

require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());

let accessToken = null;
let agentData = null;
let refreshToken = null;
if (cluster.isMaster) {
  for (let i = 0; i < cCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", function (worker) {
    console.log("Worker " + worker.process.pid + " is online.");
  });

  cluster.on("exit", function (worker, code, signal) {
    console.log("Worker " + worker.process.pid + " died.");
  });
} else {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.listen(port, () => {
    console.log(`Server is running on port ${port} hello form server `);
  });

  let isAuthorized = false;

  // Route to initiate Webex authentication
  app.get("/api/authorize/webex", async function (req, res) {
    try {
      const authUrl = authorize();
      res.redirect(authUrl);
      if (res.status === 200) {
        isAuthorized = true;
      } else {
        isAuthorized = false;
      }
    } catch (error) {
      console.error("Error occurred during Webex authorization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Route to handle Webex redirection

  app.get("/api/webex/redirect", async function (req, res) {
    const code = req.query.code;

    try {
      const data = await redirect(code);
      accessToken = data.access_token;
      refreshToken = data.refresh_token;
      console.log("access token is ", accessToken);
      console.log("data is ", data);
      fetchAndSendUserDetails(accessToken, (err, result) => {
        if (err) {
          console.error("Error occurred during Webex redirection:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.redirect("http://localhost:3000/?authenticated=true");
      });
    } catch (error) {
      console.error("Error occurred during Webex redirection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
    //   res.redirect("http://localhost:3000/?authenticated=true");
    // } catch (error) {
    //   console.error("Error occurred during Webex redirection:", error);
    //   res.status(500).json({ error: "Internal server error" });
    // }
  });

  app.get("/api/authorize", cors(), (req, res) => {
    const token = accessToken;
    res.send(token);
  });

  app.get("/api/user", cors(), async function (req, res) {
    try {
      const response = await axios.get(
        "https://webexapis.com/v1/people/me?callingData=true",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      let agentData = response.data;
      const userDetails = response.data;
      console.log(
        "Data to be sent to Operations" + JSON.stringify(accessToken, agentData)
      );
      axios
        .post("http://localhost:8000/accessToken", { accessToken, agentData })
        .then((postResponse) => {
          res.json({
            accessToken: accessToken,
            userDetails: agentData,
            message: "Authentication successful and token sent!",
          });
        })
        .catch((error) => {
          console.error("Error occurred during POST request:", error);
          if (!res.headersSent) {
            res
              .status(500)
              .json({ error: "Internal server error during POST request" });
          }
        });
    } catch (error) {
      console.error("Error occurred fetching user details:", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: "Internal server error fetching user details" });
      }
    }
  });

  async function fetchAndSendUserDetails(accessToken, callback) {
    try {
      const response = await axios.get(
        "https://webexapis.com/v1/people/me?callingData=true",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      let agentData = response.data;
      console.log(
        "Data to be sent to Operations",
        JSON.stringify({ accessToken, agentData })
      );

      await axios.post("http://localhost:8000/accessToken", {
        accessToken,
        displayName: agentData.displayName,
        emails: agentData.emails,
      });

      // On successful POST, execute the callback with no error
      callback(null, {
        accessToken,
        userDetails: agentData,
        message: "Authentication successful and token sent!",
      });
    } catch (error) {
      console.error("Error in fetchAndSendUserDetails:", error.message);
      // On error, execute the callback with the error object
      callback(error);
    }
  }
  // async function fetchAndSendUserDetails(accessToken, res) {
  //   try {
  //     const response = await axios.get(
  //       "https://webexapis.com/v1/people/me?callingData=true",
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     let agentData = response.data;
  //     console.log(
  //       "Data to be sent to Operations",
  //       JSON.stringify({ accessToken, agentData })
  //     );

  //     await axios.post("http://localhost:8000/accessToken", {
  //       accessToken,
  //       displayName: agentData.displayName, // assuming agentData has a displayName
  //       emails: agentData.emails, // assuming agentData contains emails array
  //     });

  //     res.json({
  //       accessToken,
  //       userDetails: agentData,
  //       message: "Authentication successful and token sent!",
  //     });
  //   } catch (error) {
  //     console.error("Error in fetchAndSendUserDetails:", error.message);
  //     if (!res.headersSent) {
  //       res.status(500).json({
  //         error: "Internal server error occurred.",
  //       });
  //     }
  //   }
  // }

  // send access token to the frontend
  app.get("/api/accessToken", cors(), (req, res) => {
    res.json({ accessToken: accessToken });
  });

  // Token refreshing logic
  setInterval(async () => {
    try {
      const updatedToekn = await axios.post(
        "https://webexapis.com/v1/access_token",
        {
          grant_type: "refresh_token",
          client_id: `${process.env.WxCC_CLIENT_ID}`,
          client_secret: `${process.env.WxCC_CLIENT_SECRET}`,
          refresh_token: refreshToken,
        }
      );
      console.log(`Updated Token: ${JSON.stringify(updatedToekn.data)}`);
    } catch (error) {
      console.log(`Error while refreshing token: ${error}`);
    }
  }, refreshTokenInterval);
}

//************************************************************************************************************* */
