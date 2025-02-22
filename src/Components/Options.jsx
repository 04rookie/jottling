import { Radio, Typography } from "@mui/material";
import React from "react";
import { red, green } from "@mui/material/colors";
export default function Options({ label, correct, selected, setSelected }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <Radio
        checked={selected == label}
        onChange={(e) => {
          setSelected(e.target.value);
        }}
        value={label}
        sx={{
          color: correct == true && selected == label ? green[600] : red[600],
          "&.Mui-checked": {
            color: correct == true && selected == label ? green[600] : red[600],
          },
        }}
      />
      <Typography variant="subtitle">{label}</Typography>
    </div>
  );
}
