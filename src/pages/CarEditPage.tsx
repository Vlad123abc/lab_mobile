import React, {useContext, useEffect, useState} from "react";
import { useHistory, useParams } from "react-router";
import { IonButton, IonCheckbox, IonDatetime, IonInput } from "@ionic/react";
import { CarProps } from "./CarProps";
import axios from "axios";
import {AuthContext, CarsContext} from "../App";

const CarEditPage = (): React.JSX.Element => {
    const [car, setCar] = useState<CarProps>({ brand: "", date: "", is_new: false });
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const {cars} = useContext(CarsContext)
    const {token} = useContext(AuthContext)

    useEffect(() => {
        if (cars && cars.length > 0) {
            console.log(cars)
            const selectedCar = cars.find(c => c.id === id); // Convert id to number
            if (selectedCar) {
                setCar(selectedCar);
                console.log("Car: " + JSON.stringify(selectedCar));
            }
        }
    }, [cars, id]); // Ensure id is in the dependency array

    return (
        <div>
            <IonInput readonly={true} value={id}>Id</IonInput>
            <IonInput
                placeholder={"Brand"}
                value={car.brand}
                onIonChange={(e) => setCar((prevState) => ({
                    ...prevState,
                    brand: e.detail.value || '' // Handle potential null value
                }))}
            />
            <IonDatetime
                value={car.date}
                onIonChange={(e) => setCar((prevState) => ({
                    ...prevState,
                    date: e.detail.value ? String(e.detail.value).split("T")[0] : '' // Handle potential null value
                }))}
            />
            <IonCheckbox
                checked={car.is_new}
                onIonChange={(e) => setCar((prevState) => ({
                    ...prevState,
                    is_new: e.detail.checked
                }))}>
                Is new
            </IonCheckbox>
            <div>
                <IonButton onClick={() => {
                    axios.put(`http://localhost:3000/car/${id}`, car, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then(resp => {
                            history.push("/cars");
                        })
                        .catch(err => console.log("Err: car not saved due to: " + err));
                }}>
                    Save
                </IonButton>
            </div>
        </div>
    );
}

export default CarEditPage;
