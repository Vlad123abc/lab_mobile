import React from "react";
import { Redirect, Route } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import axios from "axios";

import CarList from "./pages/CarList";
import AddCarPage from "./pages/AddCarPage";
import CarEditPage from "./pages/CarEditPage";
import { CarProps } from "./pages/CarProps";

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
                <Route path="/carBy/:id" exact render={() => <CarEditPage cars={cars} setCars={setCars} />} />
                <Route path="/cars" render={() => <CarList cars={cars} setCars={setCars} />} />
                <Route exact path="/" render={() => <Redirect to="/cars" />} />
                <Route exact path="/carsadd" render={() => <AddCarPage setCars={setCars} />} />
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
