import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import axios from "axios";
import CarList from "./CarList"; // Adjust the import path as necessary
import { CarsContext } from "../App"; // Adjust the import path as necessary

// Define the Car type
interface Car {
  id: number;
  brand: string;
  date: string;
  is_new: boolean;
}

// Mock the axios module
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CarList Component", () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  it("fetches and displays car data using context", async () => {
    // Mock the response from axios to return the expected data structure
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 1, brand: "Car A", date: "09/11", is_new: false },
        { id: 2, brand: "Car B", date: "09/11", is_new: false },
        { id: 3, brand: "Car C", date: "09/11", is_new: false },
      ],
    });

    // Use the mockCars array
    const mockCars: Car[] = [
      { id: 1, brand: "Car A", date: "09/11", is_new: false },
      { id: 2, brand: "Car B", date: "09/11", is_new: false },
      { id: 3, brand: "Car C", date: "09/11", is_new: false },
    ];

    const mockSetCars = vi.fn();

    // Render the component with the CarsContext provider
    render(
      <CarsContext.Provider value={{ cars: mockCars, setCars: mockSetCars }}>
        <CarList />
      </CarsContext.Provider>,
    );

    // Wait for the component to update with fetched data
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    // Check if car data is displayed

    const ionItems = document.querySelectorAll("ion-item ion-label");
    expect(ionItems).toHaveLength(3);

    expect(
      screen.getByText(/id: 1, brand: Car A, date: 09\/11, new: false/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/id: 2, brand: Car B, date: 09\/11, new: false/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/id: 3, brand: Car C, date: 09\/11, new: false/i),
    ).toBeInTheDocument();
  });
});
