import "./Modal.scss";
import modalStore from "../modalStore";

const Modal = ({ id, children }) => {
  const modals = modalStore((state) => state.modals);
  const closeModal = modalStore((state) => state.closeModal);

  if (!modals[id]) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        e.stopPropagation();
        closeModal(id);
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
