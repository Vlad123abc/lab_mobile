import React, { createContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import axios from "axios";

import CarList from "./pages/CarList";
import AddCarPage from "./pages/AddCarPage";
import CarEditPage from "./pages/CarEditPage";
import { CarProps } from "./pages/CarProps";
import NetworkStatus from "./components/NetworkStatus";
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

setupIonicReact();

interface IWsState {
  wsState: string;
  setWsState: React.Dispatch<React.SetStateAction<string>>;
}

export const WsStateContext = createContext<IWsState>({
  wsState: "",
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
  React.useEffect(() => {
    const wsState = localStorage.getItem("wsState");
    if (wsState && wsState !== "") {
      setWsState(wsState);
    }

    console.log("wsstate is now:", wsState);

    const token = localStorage.getItem("token");
    if (token && token !== "") {
      setToken(token);
    }
    const uname = localStorage.getItem("uname");
    if (uname && uname !== "") {
      setUname(uname);
    }
  }, []);

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

      // Set up WebSocket connection
      console.log("wsState is:", wsState);
      console.log("token is:", token);
      console.log("uname is:", uname);
      const ws = new WebSocket("ws://localhost:3000?username=" + uname);

      ws.onopen = () => {
        console.log("Sending token to server");

        console.log("wsstate is now:", wsState);
        ws.send(token);
        console.log("setting ws state to open!");
        setWsState("open");
        localStorage.setItem("wsState", "open");
        console.log("wsstate is now:", wsState);
      };
      // Handle WebSocket messages
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };
      ws.onclose = () => {
        console.log("ws disconnected!!!");
        setWsState("disco");
        localStorage.setItem("wsState", "disco");
        console.log("wsstate is now:", wsState);
      };
      // Clean up WebSocket connection on component unmount
      return () => {
        ws.close();
      };
    }
  }, [token]);

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
      <WsStateContext.Provider value={{ wsState, setWsState }}>
        <NetworkStatus />
      </WsStateContext.Provider>
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
            <Route exact path="/" render={() => <Redirect to="/cars" />} />
            <Route exact path="/carsadd" render={() => <AddCarPage />} />
          </IonReactRouter>
        </CarsContext.Provider>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
