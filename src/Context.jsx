// createContext.js
import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
const DataContext = createContext();
import axios from "axios";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState([
  //   {
  //     question: "Where is Earth?",
  //     answerOptions: [
  //       { label: "Mars", correct: false, uuid: uuid() },
  //       { label: "Moon", correct: false, uuid: uuid() },
  //       { label: "Earth", correct: true, uuid: uuid() },
  //     ],
  //     correct: 2,
  //   },
  //   {
  //     question: "Where is the Moon?",
  //     answerOptions: [
  //       { label: "Mars", correct: false, uuid: uuid() },
  //       { label: "Moon", correct: true, uuid: uuid() },
  //       { label: "Earth", correct: false, uuid: uuid() },
  //     ],
  //     correct: 1,
  //   },
  //   {
  //     question: "Where is Mars?",
  //     answerOptions: [
  //       { label: "Mars", correct: true, uuid: uuid() },
  //       { label: "Moon", correct: false, uuid: uuid() },
  //       { label: "Earth", correct: false, uuid: uuid() },
  //     ],
  //     correct: 0,
  //   },
  //   {
  //     question: "Where is Mars?",
  //     answerOptions: [
  //       { label: "Mars", correct: true, uuid: uuid() },
  //       { label: "Moon", correct: false, uuid: uuid() },
  //       { label: "Earth", correct: false, uuid: uuid() },
  //     ],
  //     correct: 0,
  //   },
  //   {
  //     question: "Where is Mars?",
  //     answerOptions: [
  //       { label: "Mars", correct: true, uuid: uuid() },
  //       { label: "Moon", correct: false, uuid: uuid() },
  //       { label: "Earth", correct: false, uuid: uuid() },
  //     ],
  //     correct: 0,
  //   },
  //   {
  //     question: "Where is Mars?",
  //     answerOptions: [
  //       { label: "Mars", correct: true, uuid: uuid() },
  //       { label: "Moon", correct: false, uuid: uuid() },
  //       { label: "Earth", correct: false, uuid: uuid() },
  //     ],
  //     correct: 0,
  //   },
  //   {
  //     question: "Where is Mars?",
  //     answerOptions: [
  //       { label: "Mars", correct: true, uuid: uuid() },
  //       { label: "Moon", correct: false, uuid: uuid() },
  //       { label: "Earth", correct: false, uuid: uuid() },
  //     ],
  //     correct: 0,
  //   },
  // ]);

  const [data, setData] = useState([]);
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });
  useEffect(() => {}, []);
  async function postMessage(data) {
    try {
      setData([]);
      setLoading(true);
      const res = await instance.post(
        "/api/genq/",
        {
          text: data,
          // text: "Hello world"
        },
        { timeout: 0 }
      );
      setData(res?.data?.questions);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    return;
  }

  useEffect(() => {}, []);
  return (
    <DataContext.Provider
      value={{
        postMessage,
        data,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DataProvider, DataContext };
