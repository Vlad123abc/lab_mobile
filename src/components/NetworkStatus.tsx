import React, { useContext } from "react";
import { WsStateContext } from "../App";
const NetworkStatus: React.FC = () => {
  const { wsState } = useContext(WsStateContext);
  return <div>{wsState}</div>;
};

export default NetworkStatus;
