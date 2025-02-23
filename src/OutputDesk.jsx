import { Stack } from "@mui/material";
import React, { useState } from "react";
import Questions from "./Components/Questions";
import { v4 as uuid } from "uuid";

function OutputDesk() {
  const [data, setData] = useState([
    {
      question: "Where is Earth?",
      answerOptions: [
        { label: "Mars", correct: false, uuid: uuid() },
        { label: "Moon", correct: false, uuid: uuid() },
        { label: "Earth", correct: true, uuid: uuid() },
      ],
      correct: 2,
    },
    {
      question: "Where is the Moon?",
      answerOptions: [
        { label: "Mars", correct: false, uuid: uuid() },
        { label: "Moon", correct: true, uuid: uuid() },
        { label: "Earth", correct: false, uuid: uuid() },
      ],
      correct: 1,
    },
    {
      question: "Where is Mars?",
      answerOptions: [
        { label: "Mars", correct: true, uuid: uuid() },
        { label: "Moon", correct: false, uuid: uuid() },
        { label: "Earth", correct: false, uuid: uuid() },
      ],
      correct: 0,
    },
  ]);


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
              answerOptions={item.answerOptions}
              correct={item.correct}
            />
          );
        })}
      </Stack>
    </div>
  );
}

export default OutputDesk;
