import { useRef, useState } from "react";

import Places from "./layouts/Places/Places";
import { AVAILABLE_PLACES } from "../shared/data";
import Modal from "../shared/ui/Modal/Modal";
import DeleteConfirmation from "../shared/ui/DeleteConfirmation/DeleteConfirmation";
import logoImg from "../assets/logo.png";
import type { Place } from "../shared/types/place";
import type { ModalHandle } from "../shared/types/modal-handle";

function App() {
  const modal = useRef<ModalHandle | null>(null);
  const selectedPlace = useRef<string>(null);
  const [pickedPlaces, setPickedPlaces] = useState<Place[]>([]);

  function handleStartRemovePlace(id: string) {
    modal.current?.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current?.close();
  }

  function handleSelectPlace(id: string) {
    setPickedPlaces((prev) => {
      if (prev.some((p) => p.id === id)) return prev;

      const place = AVAILABLE_PLACES.find((p) => p.id === id);
      if (!place) return prev;

      return [place, ...prev];
    });
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current),
    );
    modal.current?.close();
  }

  return (
    <>
      <Modal ref={modal}>
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
          places={AVAILABLE_PLACES}
          onSelectPlace={handleSelectPlace}
          fallbackText="No places"
        />
      </main>
    </>
  );
}

export default App;
