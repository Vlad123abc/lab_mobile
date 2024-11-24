export interface CarProps {
  id?: string;
  brand: string;
  date: string;
  is_new: boolean;
  car_image: string; // base64-encoded blob
  latitude: number;
  longitude: number;
}

export interface CarAction {
  car: CarProps;
  action: string;
}
