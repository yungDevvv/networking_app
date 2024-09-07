// context/ModalContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState({
    "choose-network": false,
    "choose-som": false,
  });

  const openModal = (id) => {
    setModals((prev) => ({ ...prev, [id]: true }));
  };

  const closeModal = (id) => {
    setModals((prev) => ({ ...prev, [id]: false }));
  };
  
  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
