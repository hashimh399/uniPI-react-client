import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { useState } from "react";

function MediaCard({
  image,
  queueName,
  surveyFor,
  handleClickOpen,
  tooltip,
  info,
}) {
  const [showFullText, setShowFullText] = useState(false);
  const truncatedText = info.slice(0, 80);
  const showButton = info.length > 80;

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <Card sx={{ maxWidth: 345 }} className="p-3 relative">
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content={tooltip}
        className="absolute right-0 -top-[0.03rem] hover:text-shade4 duration-200  text-xl text-shade2"
      >
        <FaCircleInfo />
      </button>
      <Tooltip id="my-tooltip" />
      <CardMedia sx={{ height: 140 }} image={image} title={queueName} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {queueName}
        </Typography>

        <p className="text-sm">
          {showFullText ? info : truncatedText}
          {!showFullText && "..."}
        </p>

        {showButton && (
          <button className="text-sm text-blue-400" onClick={toggleText}>
            {showFullText ? "Read Less" : "Read More"}
          </button>
        )}

        <Typography variant="body2" color="text.secondary">
          {surveyFor}
        </Typography>
      </CardContent>
      <CardActions className="flex justify-end">
        <button
          size="small"
          onClick={handleClickOpen}
          className="bg-shade2 text-white font-semibold rounded-md px-3 duration-200 hover:bg-shade4 py-1"
        >
          Setup Now
        </button>
      </CardActions>
    </Card>
  );
}

export default MediaCard;
