import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  children: ReactNode;
};

function Modal({ open, children }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open]);

  const portalRoot = document.getElementById("modal");
  if (!portalRoot) return null;

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {open ? children : null}
    </dialog>,
    portalRoot,
  );
}

export default Modal;
