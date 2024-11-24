import React, { useContext, useEffect } from "react";
import {
  IonButton,
  IonCheckbox,
  IonDatetime,
  IonInput,
  IonLabel,
} from "@ionic/react";
import { CarAction, CarProps } from "./CarProps";
import axios from "axios";
import { useHistory } from "react-router";
import { AuthContext } from "../App";
import { ActionsContext } from "../App";
import CarMap from "../components/CarMap";
import { processActionQueue } from "../App";
import "./AddCarPageStyles.css"; // Import the CSS file

const AddCarPage = (): React.JSX.Element => {
  const { token } = useContext(AuthContext);
  const { actions: actions, setActions: setActions } =
    useContext(ActionsContext);
  const [car, setCar] = React.useState<CarProps>({
    brand: "",
    date: "",
    id: "",
    is_new: false,
    car_image: "",
    latitude: 46.770439,
    longitude: 23.591423,
  });
  const history = useHistory();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle file change!");
    const file = e.target.files?.[0];

    console.log("file is:", file);
    if (file) {
      console.log("going to read the:", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("the image blob we read:", reader.result as string);
        setCar((prevState) => {
          return { ...prevState, car_image: reader.result as string };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log(`Selected location: ${lat}, ${lng}`);
    setCar((prevCar) => ({
      ...prevCar,
      latitude: lat,
      longitude: lng,
    }));
    // Update the car's location or perform other actions
  };
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
        {car.car_image && (
          <div style={{ marginTop: "20px" }}>
            <img
              src={car.car_image}
              alt="Car Preview"
              style={{ width: "100%", maxWidth: "300px", height: "auto" }}
            />
          </div>
        )}
      </div>
      <div>
        <IonLabel position="stacked">Image2</IonLabel>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <CarMap
          car={car}
          height="400px"
          width="100%"
          onLocationSelect={handleLocationSelect}
        />
      </div>
      <div>
        <IonButton expand="block" className="custom-ion-button"
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
          <div></div>
          Add car
        </IonButton>
      </div>
    </div>
  );
};

export default AddCarPage;
