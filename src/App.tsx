import React from "react";
import { Redirect, Route } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import axios from "axios";

import CarList from "./pages/CarList";
import AddCarPage from "./pages/AddCarPage";
import CarEditPage from "./pages/CarEditPage";
import { CarProps } from "./pages/CarProps";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
    const [cars, setCars] = React.useState<CarProps[]>([]);

    React.useEffect(() => {
        // Fetch initial car list
        axios.get<CarProps[]>("http://localhost:3000/car")
            .then(resp => resp.data)
            .then(cars => setCars(cars))
            .catch(err => console.log("Error: " + err));

        // Set up WebSocket connection
        const ws = new WebSocket("ws://localhost:3000");

        // Handle WebSocket messages
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
        };

        // Clean up WebSocket connection on component unmount
        return () => {
            ws.close();
        };
    }, []);

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
                        car.id === payload.item.id ? payload.item : car
                    )
                );
                break;
            case "deleted":
                setCars((prevCars) =>
                    prevCars.filter((car) => car.id !== payload.item.id)
                );
                break;
            default:
                console.warn("Unknown WebSocket event:", event);
        }
    };

    return (
        <IonApp>
            <IonReactRouter>
                <Route path="/carBy/:id" exact render={() => <CarEditPage cars={cars} />} />
                <Route path="/cars" render={() => <CarList cars={cars} setCars={setCars} />} />
                <Route exact path="/" render={() => <Redirect to="/cars" />} />
                <Route exact path="/carsadd" render={() => <AddCarPage />} />
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
