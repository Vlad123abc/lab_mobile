import React, { memo } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { getLogger } from '../core';
import {CarProps} from "./CarProps";
import {useHistory} from "react-router";

const log = getLogger('Item');

const Car: React.FC<CarProps> = ({ id, brand,date ,is_new}) => {
    const history = useHistory()
    return (
        <IonItem>
            <IonLabel onClick={()=>{
                history.push(`/carBy/${id}`)
            }}>{`id: ${id}, brand: ${brand}, date: ${date}, new: ${is_new}`}</IonLabel>
        </IonItem>
    )
};

export default memo(Car);
