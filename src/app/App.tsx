import { useCallback, useEffect, useRef, useState } from "react";

import Places from "./layouts/Places/Places";
import { AVAILABLE_PLACES } from "../shared/data";
import Modal from "../shared/ui/Modal/Modal";
import DeleteConfirmation from "../shared/ui/DeleteConfirmation/DeleteConfirmation";
import logoImg from "../assets/logo.png";
import type { Place } from "../shared/types/place";
import { sortPlacesByDistance } from "../shared/lib/loc";

const prevSelectedPlacesIds = localStorage.getItem("selectedPlaces")
  ? JSON.parse(localStorage.getItem("selectedPlaces")!)
  : [];

const storedPlaces = prevSelectedPlacesIds.map((id: string) =>
  AVAILABLE_PLACES.find((place) => place.id === id),
);

function App() {
  const selectedPlace = useRef<string>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
  const [pickedPlaces, setPickedPlaces] = useState<Place[]>(storedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const sortedPlaced = sortPlacesByDistance(
          AVAILABLE_PLACES,
          position.coords.latitude,
          position.coords.longitude,
        );

        setAvailablePlaces(
          sortedPlaced.length === 0 ? AVAILABLE_PLACES : sortedPlaced,
        );
      },
      () => {
        setAvailablePlaces(AVAILABLE_PLACES);
      },
    );
  }, []);

  function handleStartRemovePlace(id: string) {
    setIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsOpen(false);
  }

  function handleSelectPlace(id: string) {
    setPickedPlaces((prev) => {
      if (prev.some((p) => p.id === id)) return prev;

      const place = AVAILABLE_PLACES.find((p) => p.id === id);
      if (!place) return prev;

      return [place, ...prev];
    });

    const prevSelectedPlacesIds = localStorage.getItem("selectedPlaces")
      ? JSON.parse(localStorage.getItem("selectedPlaces")!)
      : [];

    if (prevSelectedPlacesIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...prevSelectedPlacesIds]),
      );
    }
  }

  const handleRemovePlace = useCallback(function () {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current),
    );
    setIsOpen(false);

    const prevSelectedPlacesIds = localStorage.getItem("selectedPlaces")
      ? JSON.parse(localStorage.getItem("selectedPlaces")!)
      : [];

    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(
        prevSelectedPlacesIds.filter(
          (id: string) => id !== selectedPlace.current,
        ),
      ),
    );
  }, []);

  return (
    <>
      <Modal open={isOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
          fallbackText="No places"
        />
      </main>
    </>
  );
}

export default App;
