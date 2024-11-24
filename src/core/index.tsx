import "leaflet/dist/leaflet.css";
export const getLogger: (tag: string) => (...args: any) => void =
  (tag) =>
  (...args) =>
    console.log(tag, ...args);
