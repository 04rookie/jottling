import { Typography } from "@mui/material";
import React from "react";
import Options from "./Options";

function Questions({ question, answer, selected, setSelected }) {
  return (
    <div>
      <Typography variant="h4">Q: {question}</Typography>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {answer.map((ans, index) => {
          return (
            <Options
              key={index}
              label={ans.label}
              correct={ans.correct}
              selected={selected}
              setSelected={setSelected}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Questions;
