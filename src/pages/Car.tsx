import React, { memo } from "react";
import { IonButton, IonItem, IonLabel, IonRow, IonCol } from "@ionic/react";
import { getLogger } from "../core";
import { CarProps } from "./CarProps";
import { useHistory } from "react-router";

const log = getLogger("Item");
const Car: React.FC<CarProps> = ({ id, brand, date, is_new, car_image }) => {
  const history = useHistory();
  return (
    <>
      <IonCol>{id}</IonCol>
      <IonCol>{brand}</IonCol>
      <IonCol>{date}</IonCol>
      <IonCol className="left-align">{is_new ? "Yes" : "No"}</IonCol>
      <IonCol>
        <img
          src={car_image}
          alt="Car Preview"
          style={{ width: "100%", maxWidth: "300px", height: "auto" }}
        />
      </IonCol>
      <IonCol>
        <IonButton
          onClick={() => {
            history.push(`/carBy/${id}`);
          }}
        >
          Edit
        </IonButton>
      </IonCol>
    </>
  );
};

export default memo(Car);
