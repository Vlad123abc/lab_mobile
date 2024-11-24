import React, { useState, useEffect } from "react";
import {
  useMapEvents,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { CarProps } from "../pages/CarProps";
import "./CarMap.css";

export interface CarMapProps {
  car: CarProps;
  height: string;
  width: string;
  onLocationSelect: (lat: number, lng: number) => void; // Callback for location selection
}

const CarMap: React.FC<CarMapProps> = ({
  car,
  height = "100px",
  width = "100%",
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<[number, number]>([
    car.latitude,
    car.longitude,
  ]);
  // Update position when car prop changes
  useEffect(() => {
    setPosition([car.latitude, car.longitude]);
  }, [car]);
  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position);
    }, [map, position]);
    return null;
  };
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      },
    });

    return position ? (
      <Marker position={position}>
        <Popup>
          Selected Location: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </Popup>
      </Marker>
    ) : null;
  };
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapUpdater />
      <LocationMarker />
    </MapContainer>
  );
};

export default CarMap;
