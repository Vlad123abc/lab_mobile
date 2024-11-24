import React, { memo } from "react";
import { IonButton, IonItem, IonLabel, IonRow, IonCol } from "@ionic/react";
import { getLogger } from "../core";
import { CarProps } from "./CarProps";
import { useHistory } from "react-router";
import CarMap from "../components/CarMap";

const handleLocationSelect = (lat: number, lng: number) => {
  console.log(`Selected location: ${lat}, ${lng}`);
  // Update the car's location or perform other actions
};
const log = getLogger("Item");
const Car: React.FC<{ car: CarProps }> = ({ car }) => {
  const history = useHistory();
  return (
    <>
      <IonCol>{car.id}</IonCol>
      <IonCol>{car.brand}</IonCol>
      <IonCol>{car.date}</IonCol>
      <IonCol className="left-align">{car.is_new ? "Yes" : "No"}</IonCol>
      <IonCol>
        <img
          src={car.car_image}
          alt="Car Preview"
          style={{ width: "100%", maxWidth: "300px", height: "auto" }}
        />
      </IonCol>
      <IonCol>
        <CarMap
          car={car}
          height="180px"
          width="50%"
          onLocationSelect={handleLocationSelect}
        />
      </IonCol>
      <IonCol>
        <IonButton
          onClick={() => {
            history.push(`/carBy/${car.id}`);
          }}
        >
          Edit
        </IonButton>
      </IonCol>
    </>
  );
};

export default memo(Car);
