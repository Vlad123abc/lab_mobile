// import React, {useEffect, useState} from "react";
// import {CarProps} from "../pages/CarProps";
// import {Network} from "@capacitor/network";
//
// const NetworkStatus:React.FC = () => {
//     const [connected, setConnected] = useState(false)
//
//     useEffect(() => {
//         Network.getStatus().then(status=>console.log(status))
//     }, []);
//
//     return <div>
//         {connected? "Connect" : "Not Connected"}
//     </div>
// }
//
// export default NetworkStatus

import React, { useEffect, useState, useContext } from "react";
import { CarProps } from "../pages/CarProps";
import { Network } from "@capacitor/network";
import { WsStateContext } from "../App";
const NetworkStatus: React.FC = () => {
  const { wsState, setWsState } = useContext(WsStateContext);
  useEffect(() => {
    Network.addListener("networkStatusChange", (status) => {
      console.log("Network status changed", status);
    }).then((r) => logCurrentNetworkStatus());
  }, []);

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();

    console.log("Network status:", wsState);
  };

  return <div>{wsState}</div>;
};

export default NetworkStatus;
