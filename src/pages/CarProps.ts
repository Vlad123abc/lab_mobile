export interface CarProps {
  id?: string;
  brand: string;
  date: string;
  is_new: boolean;
}

export interface CarAction {
  car: CarProps;
  action: string;
}
