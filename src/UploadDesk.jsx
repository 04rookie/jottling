import { Button, Typography } from "@mui/material";
import React, { useContext } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { DataContext } from "./Context";

function UploadDesk() {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const { postMessage, loading } = useContext(DataContext);
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file

    // Check if the file exists and is a text file
    if (file && file.type === "text/plain") {
      const reader = new FileReader();

      // Read the file as text
      reader.readAsText(file);

      // Handle successful reading
      reader.onload = () => {
        console.log("File content:", reader.result); // Log the text content
        postMessage(reader.result);
      };

      // Handle errors during reading
      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
      };
    } else {
      console.error("Please select a valid text file.");
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        // overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10%",
        }}
      >
        <Typography
          variant="h4"
          alt={loading ? "Uploading..." : "Upload your notes here"}
          inputProps={{
            "aria-label": loading ? "Uploading..." : "Upload your notes here",
          }}
        >
          {loading ? "Uploading..." : "Upload your notes here!"}
        </Typography>
        <Button
          color={loading? "primary" : "secondary"}
          style={{ marginTop: "10%" }}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          loading={loading}
          startIcon={<CloudUploadIcon />}
        >
          {loading ? "Uploading..." : "Upload files"}
          <VisuallyHiddenInput
            type="file"
            accept=".txt" // Restrict to text files
            onChange={handleFileChange}
          />
        </Button>
      </div>
    </div>
  );
}

export default UploadDesk;
