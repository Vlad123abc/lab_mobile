import React, { useContext } from "react";
import { WsStateContext } from "../App";
const NetworkStatus: React.FC = () => {
  const { wsState } = useContext(WsStateContext);
  return <div>Network Status: {wsState}</div>;
};

export default NetworkStatus;
