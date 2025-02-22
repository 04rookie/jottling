import { Stack } from "@mui/material";
import React, { useState } from "react";
import Questions from "./Components/Questions";
function OutputDesk() {
  const [data, setData] = useState([
    {
      question: "Where is Earth?",
      answer: [
        { label: "Mars", correct: false },
        { label: "Moon", correct: false },
        { label: "Earth", correct: true },
      ],
    },
    {
      question: "Where is the Moon?",
      answer: [
        { label: "Mars", correct: false },
        { label: "Moon", correct: true },
        { label: "Earth", correct: false },
      ],
    },
    {
      question: "Where is Mars?",
      answer: [
        { label: "Mars", correct: true },
        { label: "Moon", correct: false },
        { label: "Earth", correct: false },
      ],
    },
  ]);

  const [selected, setSelected] = useState(null);
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop: "10%",
        // overflowY: "auto",
      }}
    >
      <Stack spacing={2}>
        {data.map((item, index) => {
          return (
            <Questions
              key={index}
              question={item.question}
              answer={item.answer}
              selected={selected}
              setSelected={setSelected}
            />
          );
        })}
      </Stack>
    </div>
  );
}

export default OutputDesk;
