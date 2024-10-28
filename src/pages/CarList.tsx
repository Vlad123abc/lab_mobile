import React from "react";
import Car from "./Car";
import {IonButton} from "@ionic/react";
import {useHistory} from "react-router";

const CarList = ({cars, setCars}): React.JSX.Element => {
    const history  = useHistory()
    return <div>
        {cars.map(car => <Car key={car.id} id={car.id} brand={car.brand} date={car.date} is_new={car.is_new}/>)}
        <IonButton onClick={(e)=> {e.preventDefault(); history.push("/carsadd")} }>Add cars</IonButton>
    </div>
}

export default CarList



