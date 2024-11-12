import React, {useContext, useEffect, useState} from "react";
import Car from "./Car";
import {IonButton, IonInfiniteScroll, IonInfiniteScrollContent, IonInput} from "@ionic/react";
import { useHistory } from "react-router";
import { CarsContext } from "../App";
import { WsStateContext } from "../App";
import NetworkStatus from "../components/NetworkStatus";
import axios from "axios";
import {CarProps} from "./CarProps";

const CarList = (): React.JSX.Element => {
  const history = useHistory();
  const { cars } = useContext(CarsContext);
  const { wsState, setWsState } = useContext(WsStateContext);

    const [filter, setFilter] = useState(""); // State to track the filter input

    // Filter the car list based on the input
    const filteredCars = cars.filter((car) =>
        car.brand.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <div>
      <div>
        <NetworkStatus />

        {/*{cars.map((car) => (*/}
        {/*  <Car*/}
        {/*    key={car.id}*/}
        {/*    id={car.id}*/}
        {/*    brand={car.brand}*/}
        {/*    date={car.date}*/}
        {/*    is_new={car.is_new}*/}
        {/*  />*/}
        {/*))}*/}

          {/* Display filtered cars */}
          {filteredCars.map((car) => (
              <Car
                  key={car.id}
                  id={car.id}
                  brand={car.brand}
                  date={car.date}
                  is_new={car.is_new}
              />
          ))}

          {/* Input field for filtering */}
          <IonInput
              placeholder={"Filter by brand"}
              value={filter}
              onIonChange={(e) => setFilter(e.detail.value || "")}
              //clearInput
          />

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
