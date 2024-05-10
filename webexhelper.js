const axios = require("axios");
const { response } = require("express");
const qs = require("qs");

const authorize = () => {
  return `https://webexapis.com/v1/authorize?client_id=${process.env.WEBEX_CLIENT_ID}&response_type=code&redirect_uri=${process.env.WEBEX_REDIRECT_URI}&scope=${process.env.WEBEX_SCOPE_LIST} `;
};

const redirect = async (code) => {
  let tokenUri = "https://webexapis.com/v1/access_token";
  let payload = qs.stringify({
    code: code,
    grant_type: "authorization_code",
    client_id: process.env.WEBEX_CLIENT_ID,
    client_secret: process.env.WEBEX_CLIENT_SECRET,
    redirect_uri: process.env.WEBEX_REDIRECT_URI,
  });
  const { data } = await axios({
    url: tokenUri,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: payload,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  console.log(data.access_token);
  console.log("data is ", data);
  return data;
  localStorage.setItem("webexAccessToken", data.access_token);
  // Change "http://localhost:3000/home" with the address of your home page
  const redirectUri = "http://localhost:3000/home";
  res.redirect(redirectUri);
};

module.exports = { authorize, redirect };
