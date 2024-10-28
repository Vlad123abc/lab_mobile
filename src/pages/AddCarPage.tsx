import React from "react";
import {IonButton, IonCheckbox, IonDatetime, IonInput} from "@ionic/react";
import {CarProps} from "./CarProps";
import axios from "axios";
import {useHistory} from "react-router";

const AddCarPage = (): React.JSX.Element => {
    const [car, setCar] = React.useState<CarProps>({brand: "", date: "", id: "", is_new: false})
    const history = useHistory()


    return <div>
        <IonInput placeholder={"Brand"}
                  value={car.brand}
                  onIonChange={(e)=> setCar((prevState)=>{
                      return {...prevState, brand: e.detail.value};
                  })}
        ></IonInput>
        <IonDatetime
            value={car.date}
            onIonChange={(e)=> setCar((prevState)=>{
                return {...prevState, date: e.detail.value.split("T")[0]};
            })}
            displayFormat="YYYY-MM-DD"
            placeholder="Select a date"
        />
        <IonCheckbox
            checked={car.is_new}
            onIonChange={(e)=> setCar((prevState)=>{
                return {...prevState, is_new: e.detail.checked};
            })}>Is new</IonCheckbox>
        <div>
            <IonButton onClick={()=> {
                axios.post("http://localhost:3000/car", car)
                    .then(resp => {
                        console.log("Car added")
                        history.push("/cars")
                    })
                    .catch(err => console.log("Err car not saved due to: " + err))
            }}>Add car</IonButton>
        </div>
    </div>
}

export default AddCarPage;
