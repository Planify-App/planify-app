import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [globalVar, setGlobalVar] = useState("Hola Mundo");

    return (
        <GlobalContext.Provider value={{ globalVar, setGlobalVar }}>
            {children}
        </GlobalContext.Provider>
    );
};
export const useGlobal = () => useContext(GlobalContext);
