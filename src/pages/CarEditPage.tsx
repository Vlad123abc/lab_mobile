import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  IonLabel,
  IonButton,
  IonCheckbox,
  IonDatetime,
  IonInput,
} from "@ionic/react";
import { CarProps } from "./CarProps";
import axios from "axios";
import { AuthContext, CarsContext } from "../App";

const CarEditPage = (): React.JSX.Element => {
  const [car, setCar] = useState<CarProps>({
    brand: "",
    date: "",
    is_new: false,
    car_image: "",
  });
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { cars } = useContext(CarsContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    console.log("edit car page trying to load cars");
    if (cars && cars.length > 0) {
      console.log(cars);
      const selectedCar = cars.find((c) => c.id === id); // Convert id to number
      if (selectedCar) {
        setCar(selectedCar);
        console.log("Car: " + JSON.stringify(selectedCar));
      }
    }
  }, [cars, id]); // Ensure id is in the dependency array
  console.log("cars length is now:", cars.length);
  console.log("cars is now:", cars);
  const findCarById = (id: number): CarProps | undefined => {
    return cars.find((car) => parseInt(car.id || "0", 10) === id);
  };

  const selectedCar = findCarById(parseInt(id, 10)) || car;
  console.log("selected car is:", selectedCar, ",id is:", id);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle file change!");
    const file = e.target.files?.[0];

    console.log("file is:", file);
    if (file) {
      console.log("going to read the:", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("the image blob we read:", reader.result as string);
        selectedCar.car_image = reader.result as string; // HACK
        setCar((prevState) => {
          return { ...prevState, car_image: reader.result as string };
        });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <IonInput readonly={true} value={id}>
        Id
      </IonInput>
      <IonInput
        placeholder={"Brand"}
        value={selectedCar.brand}
        onIonChange={(e) =>
          setCar((prevState) => ({
            ...prevState,
            brand: e.detail.value || "", // Handle potential null value
          }))
        }
      />
      <IonDatetime
        value={selectedCar.date}
        onIonChange={(e) =>
          setCar((prevState) => ({
            ...prevState,
            date: e.detail.value ? String(e.detail.value).split("T")[0] : "", // Handle potential null value
          }))
        }
      />
      <IonCheckbox
        checked={selectedCar.is_new}
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
        {selectedCar.car_image && (
          <div style={{ marginTop: "20px" }}>
            <img
              src={selectedCar.car_image}
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
        <IonButton
          onClick={() => {
            axios
              .put(`http://localhost:3000/car/${id}`, car, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((resp) => {
                history.push("/cars");
              })
              .catch((err) => console.log("Err: car not saved due to: " + err));
          }}
        >
          Save
        </IonButton>
      </div>
    </div>
  );
};

export default CarEditPage;
