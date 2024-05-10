// import React, { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Audio } from "react-loader-spinner";
// import axios from "axios";

// function CreateSurvey({ accessToken }) {
//   const [inputTexts, setInputTexts] = useState(["", "", ""]);
//   const [loadingStates, setLoadingStates] = useState([false, false, false]);
//   const [audioUrls, setAudioUrls] = useState(["", "", ""]);
//   const [checkboxStates, setCheckboxStates] = useState([false, false, false]);
//   const [activeInput, setActiveInput] = useState(0);
//   const inputRefs = [useRef(null), useRef(null), useRef(null)];
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const placeholder = [
//     "How would you rate the agent on scale of 1 to 5?",
//     "Is your query resolved?",
//     "Will you suggest survey to your friend?",
//   ];
//   const [live, setLive] = useState(false);

//   const handleInputChange = (index, value) => {
//     const newInputTexts = [...inputTexts];
//     newInputTexts[index] = value;
//     setInputTexts(newInputTexts);
//   };

//   const fetchData = async () => {
//     try {
//       const date = new Date();
//       const to = date.getTime();
//       const from = date.getTime() - 24 * 60 * 60 * 1000;

//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       };

//       const response = await axios.get(
//         `https://api.wxcc-us1.cisco.com/v1/queues/statistics?from=${from}&to=${to}&orgId=69fc3aba-280a-4f8e-b449-2c198d78569b`,
//         {
//           headers: headers,
//         }
//       );

//       setData(response.data.data);
//       setLoading(false);
//       console.log("RECEIVED DATA IS", response.data.data);
//     } catch (error) {
//       setError(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [accessToken]);

//   const queueWiseData = {};

//   data.forEach((item) => {
//     const { queueId } = item;

//     if (queueWiseData.hasOwnProperty(queueId)) {
//       queueWiseData[queueId].push(item);
//     } else {
//       queueWiseData[queueId] = [item];
//     }
//   });
//   console.log(queueWiseData);

//   const sendPostRequest = async (index) => {
//     try {
//       const response = await axios.post(
//         "https://bcc5-119-82-64-26.ngrok-free.app/tts",
//         {
//           text: inputTexts[index],
//         }
//       );
//       return response.data.url;
//     } catch (error) {
//       console.error(
//         "Error:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const handleTTS = async (index) => {
//     setLoadingStates((prevLoadingStates) =>
//       prevLoadingStates.map((state, i) => (i === index ? true : state))
//     );
//     try {
//       const audioUrl = await sendPostRequest(index);
//       if (audioUrl) {
//         const newAudioUrls = [...audioUrls];
//         newAudioUrls[index] = audioUrl;
//         setAudioUrls(newAudioUrls);
//         setActiveInput(index + 1 < inputTexts.length ? index + 1 : activeInput);
//       }
//     } catch (error) {
//       console.error("Error generating TTS:", error);
//     } finally {
//       setLoadingStates((prevLoadingStates) =>
//         prevLoadingStates.map((state, i) => (i === index ? false : state))
//       );
//     }
//   };

//   const handleExport = (index) => {
//     inputRefs[index].current.disabled = true; // Disable the current input
//     inputRefs[index].current.value = ""; // Clear input value
//     inputRefs[index].current.blur(); // Remove focus from the current input

//     if (index + 1 < inputTexts.length) {
//       setActiveInput(index + 1); // Move to the next input
//       inputRefs[index + 1].current.focus(); // Focus on the next input
//     } else {
//       // If all inputs are exported, reset the state
//       setInputTexts(["", "", ""]); // Reset input texts
//       setAudioUrls(["", "", ""]); // Reset audio URLs
//       setActiveInput(0); // Reset active input to the first one
//       setLoadingStates([false, false, false]); // Reset loading states
//     }
//   };

//   const handleCheckboxChange = (index) => {
//     const newCheckboxStates = [...checkboxStates];
//     newCheckboxStates[index] = !newCheckboxStates[index];
//     setCheckboxStates(newCheckboxStates);

//     if (newCheckboxStates[index]) {
//       // Enable the input if checkbox is checked
//       inputRefs[index].current.disabled = false;
//       setActiveInput(index);
//     } else {
//       // Disable the input if checkbox is unchecked
//       inputRefs[index].current.disabled = true;
//       setActiveInput(index + 1);
//     }
//   };

//   return (
//     <div className="container mx-auto mt-5 p-6">
//       <motion.div
//         className={`${live ? "bg-green-200" : "bg-red-200"}  rounded-md px-4 py-2`}
//       >
//         <motion.div className="flex gap-4 items-center">
//           <motion.h1>UniRSM Queue</motion.h1>
//         </motion.div>
//       </motion.div>
//       <div className="flex justify-between items-center bg-blue-400 px-4 py-2 rounded-md mb-5">
//         <h1 className="text-xl font-bold text-white w-full">
//           Voice Survey for UniRSM queue
//         </h1>
//       </div>

//       <div className="flex flex-col justify-center w-full gap-4">
//         {inputTexts.map((inputText, index) => (
//           <div key={index} className="mb-2 flex flex-row gap-2 items-center">
//             <input
//               type="checkbox"
//               id={`checkbox${index + 1}`}
//               checked={checkboxStates[index]}
//               onChange={() => handleCheckboxChange(index)}
//               className="h-8 w-8 text-blue-600 rounded border border-gray-300 focus:ring-blue-500"
//             />

//             <input
//               id={`q${index + 1}`}
//               type="text"
//               placeholder={`${placeholder[index]}`}
//               className="border w-2/3 border-gray-400 p-2 rounded"
//               value={inputText}
//               onChange={(e) => handleInputChange(index, e.target.value)}
//               ref={inputRefs[index]}
//               disabled={!checkboxStates[index]}
//               autoFocus={activeInput === index}
//             />
//             <button
//               className="bg-blue-500 hover:bg-blue-700 flex justify-center items-center max-w-28 duration-300 text-white font-bold py-2 px-4 rounded"
//               onClick={() => handleTTS(index)}
//               disabled={
//                 !inputText || loadingStates[index] || !checkboxStates[index]
//               }
//             >
//               {loadingStates[index] ? (
//                 <Audio
//                   height="20"
//                   width="20"
//                   radius="9"
//                   color="white"
//                   ariaLabel="loading"
//                   wrapperStyle
//                   wrapperClass
//                 />
//               ) : (
//                 "TTS"
//               )}
//             </button>
//             {audioUrls[index] && (
//               <audio controls className="ml-4">
//                 <source src={audioUrls[index]} type="audio/wav" />
//                 Your browser does not support the audio element.
//               </audio>
//             )}
//             {audioUrls[index] && (
//               <button
//                 className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-4"
//                 onClick={() => handleExport(index)}
//               >
//                 Export
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CreateSurvey;

// *************************************************************************************

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { DNA } from "react-loader-spinner";
import axios from "axios";
import { MdOutlineArrowRight } from "react-icons/md";
import { Audio } from "react-loader-spinner";
function CreateSurvey({ accessToken }) {
  const [inputTexts, setInputTexts] = useState(["", "", ""]);
  const [loadingStates, setLoadingStates] = useState([false, false, false]);
  const [audioUrls, setAudioUrls] = useState(["", "", ""]);
  const [checkboxStates, setCheckboxStates] = useState([false, false, false]);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null)];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [live, setLive] = useState(false);
  const [queueWiseData, setQueueWiseData] = useState({});
  const [openQueue, setOpenQueue] = useState(null);

  const placeholder = [
    "How would you rate the agent on a scale of 1 to 5?",
    "Is your query resolved?",
    "Will you suggest the survey to your friend?",
  ];

  const toggleQueue = (queueId) => {
    setOpenQueue((prevOpenQueue) =>
      prevOpenQueue === queueId ? null : queueId
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);
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

      const queueData = {}; // Temporary object to hold queue wise data

      response.data.data.forEach((item) => {
        const { queueId, queueName } = item;
        if (queueData.hasOwnProperty(queueId)) {
          queueData[queueId].push(item);
        } else {
          queueData[queueId] = [item];
        }
      });

      setQueueWiseData(queueData); // Set the queue wise data
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const handleInputChange = (index, value) => {
    const newInputTexts = [...inputTexts];
    newInputTexts[index] = value;
    setInputTexts(newInputTexts);
  };

  const sendPostRequest = async (index) => {
    try {
      // const response = await axios.post(
      //   "https://bcc5-119-82-64-26.ngrok-free.app/tts",
      //   {
      //     text: inputTexts[index],
      //   }
      // );
      // return response.data.url;
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return "https://example.com/audio.wav";
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleTTS = async (index) => {
    setLoadingStates((prevLoadingStates) =>
      prevLoadingStates.map((state, i) => (i === index ? true : state))
    );
    try {
      const audioUrl = await sendPostRequest(index);
      if (audioUrl) {
        const newAudioUrls = [...audioUrls];
        newAudioUrls[index] = audioUrl;
        setAudioUrls(newAudioUrls);
        setActiveInput(index + 1 < inputTexts.length ? index + 1 : activeInput);
      }
    } catch (error) {
      console.error("Error generating TTS:", error);
    } finally {
      setLoadingStates((prevLoadingStates) =>
        prevLoadingStates.map((state, i) => (i === index ? false : state))
      );
    }
  };

  const handleExport = (index) => {
    inputRefs[index].current.disabled = true; // Disable the current input
    inputRefs[index].current.value = ""; // Clear input value
    inputRefs[index].current.blur(); // Remove focus from the current input

    if (index + 1 < inputTexts.length) {
      setActiveInput(index + 1); // Move to the next input
      inputRefs[index + 1].current.focus(); // Focus on the next input
    } else {
      // If all inputs are exported, reset the state
      setInputTexts(["", "", ""]); // Reset input texts
      setAudioUrls(["", "", ""]); // Reset audio URLs
      setActiveInput(0); // Reset active input to the first one
      setLoadingStates([false, false, false]); // Reset loading states
    }
  };

  const handleCheckboxChange = (index) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[index] = !newCheckboxStates[index];
    setCheckboxStates(newCheckboxStates);

    if (newCheckboxStates[index]) {
      // Enable the input if checkbox is checked
      inputRefs[index].current.disabled = false;
      setActiveInput(index);
    } else {
      // Disable the input if checkbox is unchecked
      inputRefs[index].current.disabled = true;
      setActiveInput(index + 1);
    }
  };

  const handleSelectedQueue = (queueId) => {
    setOpenQueue(queueId === openQueue ? null : queueId);
  };

  return (
    <div className="containe mt-5 pr-6">
      {loading ? (
        <div className="w-full h-[calc(100vh-60px)] flex justify-center items-center">
          <DNA
            visible={true}
            height="130"
            width="130"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      ) : (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="flex flex-col gap-2"
        >
          {Object.keys(queueWiseData).map((queueId, index) => (
            <div
              key={queueId}
              className="bg-gray-200 px-4 py-2 rounded flex flex-col justify-between  items-start   hover:bg-gray-300 transition-colors"
            >
              <div className="flex gap-2 w-full font-bold text-lg  justify-between">
                {" "}
                <h1>{queueWiseData[queueId][0].queueName}</h1>
                <MdOutlineArrowRight
                  className={`text-xl cursor-pointer transform transition-transform ${
                    openQueue === queueId ? "rotate-90" : ""
                  }`}
                  onClick={() => toggleQueue(queueId)}
                />
              </div>

              <motion.div
                animate={{ height: openQueue === queueId ? "auto" : 0 }}
                transition={{ type: "spring", stiffness: 200, duration: 0.1 }}
                key={queueId}
                className={`overflow-hidden transition-height  mt-5   ${
                  openQueue === queueId ? "h-auto duration-150" : "h-0"
                }`}
              >
                {/* Render input fields */}
                {inputTexts.map((inputText, index) => (
                  <div
                    key={index}
                    className="mb-2 flex flex-row gap-2 items-center"
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      id={`checkbox${index + 1}`}
                      checked={checkboxStates[index]}
                      onChange={() => handleCheckboxChange(index)}
                      className="h-8 w-8 text-blue-600 rounded border border-gray-300 focus:ring-blue-500"
                    />
                    {/* Input Field */}
                    <input
                      id={`q${index + 1}`}
                      type="text"
                      placeholder={`${placeholder[index]}`}
                      className="border w-2/3 border-gray-400 p-2 rounded"
                      value={inputText}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      ref={inputRefs[index]}
                      disabled={!checkboxStates[index]}
                      autoFocus={activeInput === index}
                    />
                    {/* TTS Button */}
                    <button
                      className="bg-blue-500 hover:bg-blue-700 flex justify-center items-center max-w-28 duration-300 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleTTS(index)}
                      disabled={
                        !inputText ||
                        loadingStates[index] ||
                        !checkboxStates[index]
                      }
                    >
                      {loadingStates[index] ? (
                        <Audio
                          height="20"
                          width="20"
                          radius="9"
                          color="white"
                          ariaLabel="loading"
                          wrapperStyle
                          wrapperClass
                        />
                      ) : (
                        "TTS"
                      )}
                    </button>
                    {/* Audio Player */}
                    {audioUrls[index] && (
                      <audio controls className="ml-4">
                        <source src={audioUrls[index]} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    {/* Export Button */}
                    {audioUrls[index] && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-4"
                        onClick={() => handleExport(index)}
                      >
                        Export
                      </button>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Displaying Queue Names */}
    </div>
  );
}

export default CreateSurvey;
