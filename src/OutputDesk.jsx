import { Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import Questions from "./Components/Questions";
import { DataContext } from "./Context";

function OutputDesk() {
  const { data } = useContext(DataContext);
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
