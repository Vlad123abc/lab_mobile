import React, { createContext, useState, ReactNode, useRef } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import axios from "axios";

import CarList from "./pages/CarList";
import AddCarPage from "./pages/AddCarPage";
import CarEditPage from "./pages/CarEditPage";
import { CarProps, CarAction } from "./pages/CarProps";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import { useHistory } from "react-router";
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import LoginPage from "./pages/LoginPage";
import NetworkStatus from "./components/NetworkStatus";

setupIonicReact();

interface IActions {
  actions: CarAction[];
  setActions: React.Dispatch<React.SetStateAction<CarAction[]>>;
}

export const ActionsContext = createContext<IActions>({
  actions: [],
  setActions: () => {},
});

interface IWsState {
  wsState: string;
  setWsState: React.Dispatch<React.SetStateAction<string>>;
}

export const WsStateContext = createContext<IWsState>({
  wsState: "BALUBA-NOTSET",
  setWsState: () => {},
});

interface ICars {
  cars: CarProps[];
  setCars: React.Dispatch<React.SetStateAction<CarProps[]>>;
}

export const CarsContext = createContext<ICars>({
  cars: [],
  setCars: () => {},
});

export const processActionQueue = (
  token: string,
  actionQueue: CarAction[],
  setActions: React.Dispatch<React.SetStateAction<CarAction[]>>,
) => {
  console.log("action queue is set to:", actionQueue);

  if (actionQueue.length > 0) {
    let car = actionQueue.at(0);
    axios
      .post("http://localhost:3000/car", car?.car, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        console.log("Car added, status:", resp.status);
        actionQueue = actionQueue.slice(1);
        setActions(actionQueue);
      })
      .catch((err) => console.log("Err car not sent due to: " + err));
  }
};

interface IAuthentication {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  uname: string;
  setUname: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<IAuthentication>({
  token: "",
  setToken: () => {},
  uname: "",
  setUname: () => {},
});

const App: React.FC = () => {
  const [cars, setCars] = React.useState<CarProps[]>([]);
  const [token, setToken] = React.useState<string>("");
  const [uname, setUname] = React.useState<string>("");
  const [wsState, setWsState] = React.useState<string>("");
  const [actions, setActions] = React.useState<CarAction[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  React.useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (token && token !== "") {
    //   setToken(token);
    // }
    // const uname = localStorage.getItem("uname");
    // if (uname && uname !== "") {
    //   setUname(uname);
    // }
  }, []);

  const connectWebSocket = () => {
    if (wsState == "open") {
      console.log("already connected, returning");
      return;
    }
    console.log("connect web socket!!!");
    if (wsRef.current) {
      wsRef.current.close(); // Close the existing connection if any
    }

    const ws = new WebSocket("ws://localhost:3000?username=" + uname);

    ws.onopen = () => {
      console.log("onopen: Sending token to server. websocket is open.");

      console.log("wsstate is now:", wsState);
      ws.send(token);
      console.log("setting ws state to open!");
      setWsState("open");
      console.log("wsstate is now:", wsState);
      processActionQueue(token, actions, setActions);
    };

    ws.onclose = () => {
      console.log("ws disconnected!!!");
      setWsState("disco");
      localStorage.setItem("wsState", "disco");
      console.log("wsstate is now:", wsState);
      setTimeout(() => {
        connectWebSocket();
      }, 5000); // Reconnect after 5 seconds
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    wsRef.current = ws;
  };
  React.useEffect(() => {
    // Fetch initial car list
    console.log("Fetching with token: " + token);
    if (token !== "") {
      axios
        .get<CarProps[]>("http://localhost:3000/car", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => resp.data)
        .then((cars) => setCars(cars))
        .catch((err) => console.log("Error: " + err));
      connectWebSocket();
      return () => {
        wsRef.current?.close();
      };
    }
  }, [token]);

  React.useEffect(() => {
    console.log("Items have been updated due to useEffect:", actions);
    processActionQueue(token, actions, setActions);
  }, [actions]);

  React.useEffect(() => {
    console.log("Items have been updated due to  new wsState:", wsState);
    processActionQueue(token, actions, setActions);
  }, [wsState]);

  // Handle WebSocket messages to update car list
  const handleWebSocketMessage = (message: any) => {
    const { event, payload } = message;

    switch (event) {
      case "created":
        setCars((prevCars) => [...prevCars, payload.item]);
        break;
      case "updated":
        setCars((prevCars) =>
          prevCars.map((car) =>
            car.id === payload.item.id ? payload.item : car,
          ),
        );
        break;
      case "deleted":
        setCars((prevCars) =>
          prevCars.filter((car) => car.id !== payload.item.id),
        );
        break;
      default:
        console.warn("Unknown WebSocket event:", event);
    }
  };

  return (
    <IonApp>
      <ActionsContext.Provider
        value={{ actions: actions, setActions: setActions }}
      >
        {" "}
        <WsStateContext.Provider value={{ wsState, setWsState }}>
          <AuthContext.Provider
            value={{
              token: token,
              setToken: setToken,
              uname: uname,
              setUname: setUname,
            }}
          >
            <CarsContext.Provider
              value={{
                cars: cars,
                setCars: setCars,
              }}
            >
              <IonReactRouter>
                <Route path="/login" exact render={() => <LoginPage />} />
                <Route path="/carBy/:id" exact render={() => <CarEditPage />} />
                <Route path="/cars" render={() => <CarList />} />
                <Route exact path="/" render={() => <Redirect to="/login" />} />
                <Route exact path="/carsadd" render={() => <AddCarPage />} />
              </IonReactRouter>
            </CarsContext.Provider>
          </AuthContext.Provider>
        </WsStateContext.Provider>
      </ActionsContext.Provider>
    </IonApp>
  );
};

export default App;
