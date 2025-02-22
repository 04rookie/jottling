import { Radio, Typography } from "@mui/material";
import React from "react";
import { red, green, blue } from "@mui/material/colors";
export default function Options({
  label,
  correct,
  selected,
  setSelected,
  uuid,
  questionRef,
  i,
}) {
  console.log(correct, selected, i);

  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <Radio
        inputProps={{
          'aria-label': label,
        }}
        checked={selected == i}
        onChange={(e) => {
          setSelected(Number(e.target.value));
        }}
        name={questionRef.current}
        value={i}
        sx={{
          color:
            selected === i ? (correct === i ? green[500] : red[500]) : "white",
          "&.Mui-checked": {
            color: correct === i ? green[500] : red[500],
          },
        }}
      />
      <Typography variant="subtitle">{label}</Typography>
    </div>
  );
}
