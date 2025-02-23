import { Typography } from "@mui/material";
import React, { useRef } from "react";
import Options from "./Options";
import { v4 as uuidv4 } from "uuid";
function Questions({ question, answerOptions, correct }) {
  const questionRef = useRef(uuidv4());
  const [selected, setSelected] = React.useState(-1);
  return (
    <div>
      <Typography variant="h4">Q: {question}</Typography>
      <div style={{ display: "flex", flexDirection: "column", marginLeft: "10%", marginRight: "10%" }}>
        {answerOptions.map((ans, index) => {
          return (
            <Options
              key={index}
              i = {index}
              label={ans.label}
              correct={correct}
              selected={selected}
              setSelected={setSelected}
              uuid={ans.uuid}
              questionRef={questionRef}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Questions;
