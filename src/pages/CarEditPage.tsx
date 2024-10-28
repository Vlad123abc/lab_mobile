import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { IonButton, IonCheckbox, IonDatetime, IonInput } from "@ionic/react";
import { CarProps } from "./CarProps";
import axios from "axios";

const CarEditPage = ({ cars, setCars }: { cars: CarProps[] }): React.JSX.Element => {
    const [car, setCar] = useState<CarProps>({ brand: "", date: "", is_new: false });
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    useEffect(() => {
        if (cars && cars.length > 0) {
            const selectedCar = cars.find(c => c.id === Number(id)); // Convert id to number
            if (selectedCar) {
                setCar(selectedCar);
                console.log("Car: " + JSON.stringify(selectedCar));
            }
        }
    }, [cars, id]); // Ensure id is in the dependency array

    return (
        <div>
            aslkd
            {/*<IonInput readonly={true} value={id}>Id</IonInput>*/}
            {/*<IonInput*/}
            {/*    placeholder={"Brand"}*/}
            {/*    value={car.brand}*/}
            {/*    onIonChange={(e) => setCar((prevState) => ({*/}
            {/*        ...prevState,*/}
            {/*        brand: e.detail.value || '' // Handle potential null value*/}
            {/*    }))}*/}
            {/*/>*/}
            {/*<IonDatetime*/}
            {/*    value={car.date}*/}
            {/*    onIonChange={(e) => setCar((prevState) => ({*/}
            {/*        ...prevState,*/}
            {/*        date: e.detail.value ? e.detail.value.split("T")[0] : '' // Handle potential null value*/}
            {/*    }))}*/}
            {/*    displayFormat="YYYY-MM-DD"*/}
            {/*    placeholder="Select a date"*/}
            {/*/>*/}
            {/*<IonCheckbox*/}
            {/*    checked={car.is_new}*/}
            {/*    onIonChange={(e) => setCar((prevState) => ({*/}
            {/*        ...prevState,*/}
            {/*        is_new: e.detail.checked*/}
            {/*    }))}>*/}
            {/*    Is new*/}
            {/*</IonCheckbox>*/}
            {/*<div>*/}
            {/*    <IonButton onClick={() => {*/}
            {/*        axios.put(`http://localhost:3000/car/${car.id}`, car)*/}
            {/*            .then(resp => {*/}
            {/*                console.log("Car edited");*/}
            {/*                const index = cars.findIndex(item => item.id === car.id);*/}
            {/*                setCars((prevState) => {*/}
            {/*                    const updatedCars = [...prevState];*/}
            {/*                    if (index !== -1) {*/}
            {/*                        updatedCars[index] = car;*/}
            {/*                    }*/}
            {/*                    return updatedCars;*/}
            {/*                });*/}
            {/*                history.push("/cars");*/}
            {/*            })*/}
            {/*            .catch(err => console.log("Err: car not saved due to: " + err));*/}
            {/*    }}>*/}
            {/*        Save*/}
            {/*    </IonButton>*/}
            {/*</div>*/}
        </div>
    );
}

export default CarEditPage;
