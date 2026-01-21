import { forwardRef, useImperativeHandle, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { ModalHandle } from "../../types/modal-handle";

type ModalProps = {
  children: ReactNode;
};

const Modal = forwardRef<ModalHandle, ModalProps>(function Modal(
  { children },
  ref,
) {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialog.current?.showModal(),
    close: () => dialog.current?.close(),
  }));

  const portalRoot = document.getElementById("modal");
  if (!portalRoot) return null;

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    portalRoot,
  );
});

export default Modal;
