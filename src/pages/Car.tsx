import React, { memo } from "react";
import { IonButton, IonItem, IonLabel } from "@ionic/react";
import { getLogger } from "../core";
import { CarProps } from "./CarProps";
import { useHistory } from "react-router";

const log = getLogger("Item");
const Car: React.FC<CarProps> = ({ id, brand, date, is_new, car_image }) => {
  const history = useHistory();
  return (
    <tr>
      <td>{id}</td>
      <td>{brand}</td>
      <td>{date}</td>
      <td>{is_new ? "Yes" : "No"}</td>
      <td>{car_image}</td>
      <td>
        {" "}
        <IonButton
          onClick={() => {
            history.push(`/carBy/${id}`);
          }}
        >
          Edit
        </IonButton>
      </td>
    </tr>
  );
};

export default memo(Car);
