import React, { useContext, useEffect } from "react";
import { IonButton, IonCheckbox, IonDatetime, IonInput } from "@ionic/react";
import { CarAction, CarProps } from "./CarProps";
import axios from "axios";
import { useHistory } from "react-router";
import { AuthContext } from "../App";
import { ActionsContext } from "../App";
import { processActionQueue } from "../App";
const AddCarPage = (): React.JSX.Element => {
  const { token } = useContext(AuthContext);
  const { actions: actions, setActions: setActions } =
    useContext(ActionsContext);
  const [car, setCar] = React.useState<CarProps>({
    brand: "",
    date: "",
    id: "",
    is_new: false,
  });
  const history = useHistory();

  return (
    <div>
      <IonInput
        placeholder={"Brand"}
        value={car.brand}
        onIonChange={(e) =>
          setCar((prevState) => {
            return { ...prevState, brand: String(e.detail.value) };
          })
        }
      ></IonInput>
      <IonDatetime
        value={car.date}
        onIonChange={(e) =>
          setCar((prevState) => {
            return { ...prevState, date: String(e.detail.value).split("T")[0] };
          })
        }
      />
      <IonCheckbox
        checked={car.is_new}
        onIonChange={(e) =>
          setCar((prevState) => {
            return { ...prevState, is_new: e.detail.checked };
          })
        }
      >
        Is new
      </IonCheckbox>
      <div>
        <IonButton
          onClick={() => {
            let action: CarAction = {
              action: "Add",
              car: car,
            };
            let items = [...actions, action];
            console.log("Setting action items to:", items);
            setActions(items);
            history.push("/cars");
          }}
        >
          Add car
        </IonButton>
      </div>
    </div>
  );
};

export default AddCarPage;
