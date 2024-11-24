import React, { useContext, useEffect, useState } from "react";
import Car from "./Car";
import "./CarList.css"; // Import the CSS file
import {
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
} from "@ionic/react";
import { useHistory } from "react-router";
import { CarsContext } from "../App";
import NetworkStatus from "../components/NetworkStatus";

const CarList = (): React.JSX.Element => {
  const history = useHistory();
  const { cars, currentPage, setCurrentPage } = useContext(CarsContext);

  const [filter, setFilter] = useState(""); // State to track the filter input

  // Filter the car list based on the input
  const filteredCars = cars.filter((car) =>
    car.brand.toLowerCase().includes(filter.toLowerCase()),
  );
  const handleNextPage = () => {
    if (currentPage < 100) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  {
    console.log("cars are:", cars);
    console.log("filtered cars are:", filteredCars);
    console.log("current page is:", currentPage);
  }

  return (
    <div>
      <div>
        <NetworkStatus />
        {/* Display filtered cars */}
        <table className="car-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Brand</th>
              <th>Date</th>
              <th>Is new</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => (
              <Car
                key={car.id}
                id={car.id}
                brand={car.brand}
                date={car.date}
                is_new={car.is_new}
                car_image={car.car_image}
              />
            ))}
          </tbody>
        </table>
        {/* Input field for filtering */}
        <IonInput
          placeholder={"Filter by brand"}
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
      </div>
      <div>
        <IonButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </IonButton>
        <span>Page: {currentPage}</span>
        <IonButton onClick={handleNextPage} disabled={currentPage === 100}>
          Next
        </IonButton>
      </div>
    </div>
  );
};

export default CarList;
