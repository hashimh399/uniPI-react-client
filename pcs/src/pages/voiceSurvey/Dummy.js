import React, { useState, useRef, useEffect } from "react";

function Dummy() {
  const [inputs, setInputs] = useState(["", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    inputRefs[activeInput].current.focus();
  }, [activeInput]);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (activeInput < inputRefs.length - 1) {
        setActiveInput(activeInput + 1);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      {inputs.map((input, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Question-${index + 1}`}
          className="border w-2/3 border-gray-400 p-2 rounded mb-2"
          value={input}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyPress={handleKeyPress}
          ref={inputRefs[index]}
          disabled={index !== activeInput}
        />
      ))}
    </div>
  );
}

export default Dummy;
