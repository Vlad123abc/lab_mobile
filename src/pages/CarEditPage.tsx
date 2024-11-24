import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import { ActionsContext } from "../App";
import {
  IonLabel,
  IonButton,
  IonCheckbox,
  IonDatetime,
  IonInput,
} from "@ionic/react";
import { CarAction, CarProps } from "./CarProps";
import axios from "axios";
import { AuthContext, CarsContext } from "../App";
import CarMap from "../components/CarMap";
const CarEditPage = (): React.JSX.Element => {
  const { actions: actions, setActions: setActions } =
    useContext(ActionsContext);
  const [car, setCar] = useState<CarProps>({
    brand: "",
    date: "",
    is_new: false,
    car_image: "",
    latitude: 46.770439,
    longitude: 23.591423,
  });
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { cars, setCars } = useContext(CarsContext);

  const findCarById = (id: number): CarProps | undefined => {
    return cars.find((car) => parseInt(car.id || "0", 10) === id);
  };

  useEffect(() => {
    console.log("edit car page trying to load cars");
    if (cars && cars.length > 0) {
      const selectedCar = findCarById(parseInt(id, 10));
      if (selectedCar) {
        setCar(selectedCar);
        console.log("found focking Car: ", selectedCar);
      } else {
        console.log("no focking car found");
        throw TypeError("foking hell");
      }
    }
  }, [cars, id]); // Ensure id is in the dependency array
  console.log("cars length is now:", cars.length);
  console.log("cars is now:", cars);

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
      <IonInput readonly={true} value={id}>
        Id
      </IonInput>
      <IonInput
        placeholder={"Brand"}
        value={car.brand}
        onIonChange={(e) =>
          setCar((prevState) => ({
            ...prevState,
            brand: e.detail.value || "", // Handle potential null value
          }))
        }
      />
      <IonDatetime
        value={car.date}
        onIonChange={(e) =>
          setCar((prevState) => ({
            ...prevState,
            date: e.detail.value ? String(e.detail.value).split("T")[0] : "", // Handle potential null value
          }))
        }
      />
      <IonCheckbox
        checked={car.is_new}
        onIonChange={(e) =>
          setCar((prevState) => ({
            ...prevState,
            is_new: e.detail.checked,
          }))
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
        <IonButton
          onClick={() => {
            let action: CarAction = {
              action: "Change",
              car: car,
            };
            let items = [...actions, action];
            console.log("saving:", car);
            console.log("Setting action items to:", items);
            setActions(items);
            history.push("/cars");
          }}
        >
          Save
        </IonButton>
      </div>
    </div>
  );
};

export default CarEditPage;
