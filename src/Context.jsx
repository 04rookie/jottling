// createContext.js
import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
const DataContext = createContext();
import axios from "axios";
import { DateTime } from "luxon";

const DataProvider = ({ children }) => {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });
  useEffect(() => {}, []);
  async function postMessage(data) {
    try {
      const res = await instance.post(
        "/api/genq/",
        {
          text: data,
          // text: "Hello world"
        },
        { timeout: 10000 }
      );
    } catch (err) {
      console.log(err);
    }
    return;
  }

  useEffect(() => {}, []);
  return <DataContext.Provider value={{
    postMessage
  }}>{children}</DataContext.Provider>;
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DataProvider, DataContext };
