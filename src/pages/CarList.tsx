import React, { useContext } from "react";
import Car from "./Car";
import { IonButton } from "@ionic/react";
import { useHistory } from "react-router";
import { CarsContext } from "../App";
import { WsStateContext } from "../App";
import NetworkStatus from "../components/NetworkStatus";
const CarList = (): React.JSX.Element => {
  const history = useHistory();
  const { cars } = useContext(CarsContext);
  const { wsState, setWsState } = useContext(WsStateContext);
  return (
    <div>
      <div>
        <NetworkStatus />
        {cars.map((car) => (
          <Car
            key={car.id}
            id={car.id}
            brand={car.brand}
            date={car.date}
            is_new={car.is_new}
          />
        ))}
        <IonButton
          onClick={(e) => {
            e.preventDefault();
            history.push("/carsadd");
          }}
        >
          Add cars
        </IonButton>
      </div>
    </div>
  );
};

export default CarList;
