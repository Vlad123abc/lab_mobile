import React, { useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonInput,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import { useHistory } from "react-router";
import { CarsContext } from "../App";
import { WsStateContext } from "../App";
import Car from "./Car";
import NetworkStatus from "../components/NetworkStatus";
import axios from "axios";
import { CarProps } from "./CarProps";

const CarList = (): React.JSX.Element => {
  const history = useHistory();
  const { cars, setCars } = useContext(CarsContext);
  const { wsState } = useContext(WsStateContext);
  const [filter, setFilter] = useState(""); // State to track the filter input
  const [offset, setOffset] = useState(0); // Offset for pagination
  const [loading, setLoading] = useState(false); // Loading state for infinite scroll

  useEffect(() => {
    loadMoreCars();
  }, []);

  const loadMoreCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get<CarProps[]>(
        `http://localhost:3000/car?page=${offset}&pageSize=3`, // Fetch cars in batches of 3
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setCars((prevCars) => [...prevCars, ...response.data]);
      setOffset((prevOffset) => prevOffset + response.data.length);
    } catch (error) {
      console.log("Failed to load more cars:", error);
    }
    setLoading(false);
  };

  // Filter the car list based on the input
  const filteredCars = cars.filter((car) =>
    car.brand.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <div>
        <NetworkStatus />
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
          placeholder="Filter by brand"
          value={filter}
          onIonChange={(e) => setFilter(e.detail.value || "")}
        />

        <IonButton
          onClick={(e) => {
            e.preventDefault();
            history.push("/carsadd");
          }}
        >
          Add cars
        </IonButton>

        {/* Infinite scroll component */}
        <IonInfiniteScroll
          threshold="100px"
          onIonInfinite={(e) => {
            loadMoreCars().then(() => e.target.complete());
          }}
          disabled={loading}
        >
          <IonInfiniteScrollContent loadingText="Loading more cars..."></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </div>
    </div>
  );
};

export default CarList;
