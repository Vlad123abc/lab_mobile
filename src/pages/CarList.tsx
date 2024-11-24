import React, { useContext, useEffect, useState } from "react";
import Car from "./Car";
import "./CarList.css"; // Import the CSS file
import {
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonContent, IonToolbar, IonTitle, IonHeader, IonPage,
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
      <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="bouncing-text">Cars List</IonTitle>
        </IonToolbar>
      </IonHeader>
    <IonContent>
      <div>
        <div>
          <NetworkStatus />
          {/* Display filtered cars */}
          <IonGrid className="car-table">
            <IonRow className="header-row">
              <IonCol>
                <strong>ID</strong>
              </IonCol>
              <IonCol>
                <strong>Brand</strong>
              </IonCol>
              <IonCol>
                <strong>Date</strong>
              </IonCol>
              <IonCol>
                <strong>Is new?</strong>
              </IonCol>
              <IonCol>
                <strong>Picture</strong>
              </IonCol>
              <IonCol>
                <strong>Action</strong>
              </IonCol>
            </IonRow>
            {cars.map((car, index) => (
              <IonRow
                key={car.id}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <Car {...car} />
              </IonRow>
            ))}
          </IonGrid>
          {/* Input field for filtering */}
          <IonInput
            placeholder={"Filter by brand"}
            value={filter}
            onIonChange={(e) => setFilter(e.detail.value || "")}
          />

          <IonButton className="animated-button"
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
    </IonContent>
        </IonPage>
  );
};

export default CarList;
