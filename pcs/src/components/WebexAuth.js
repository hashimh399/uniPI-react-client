// import React from "react";
import consiliumLogo from "../assets/consiliumSymbol.png";
import webexLogo from "../assets/webex.png";
// import loginIcon from "../assets/login-icon.png";
import "../styles/webex.css";

function WebexAuth({ handleLogin }) {
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="w-10/12 glass h-[80%] flex items-center justify-between">
        {/* left side */}
        <div className="w-1/2 bgimage h-full"></div>
        {/* right side */}
        <div className=" w-1/2 flex flex-col justify-center rounded-md  p-8 max-w-md  space-y-6">
          <img
            className="mx-auto h-16"
            alt="consilium_logo"
            src={consiliumLogo}
          />
          <h1 className="text-xl font-bold text-center text-gray-600">
            CONSILIUM UniPI
          </h1>
          <input className="p-2" type="email" placeholder="Email" required />
          <input
            className="p-2"
            type="password"
            placeholder="password"
            required
          />

          <div className="flex justify-between w-full items-center">
            <button className="bg-blue-500 hover:bg-blue-700 duration-300 rounded-full px-4 py-1  text-white font-semibold">
              Signin
            </button>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="forgot"></input>
              <label for="forgot ">Forgot password?</label>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="flex items-center group justify-center  bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-slate-200 transition-colors duration-300"
          >
            <img
              alt="login_icon "
              src={webexLogo}
              className="h-6 mr-2 group-hover:rotate-[360deg] duration-300"
            />
            <span className="group-hover:text-slate-700">Login with Webex</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebexAuth;

//***************************************************************************** */
