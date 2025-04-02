// app/globals.js

const Globals = {
    ip: "localhost",
    isLoged: false,
    quedadas: [],

    setIp: (nuevoValor) => {
        Globals.ip = nuevoValor;
    },
    setIsLoged: (nuevoValor) => {
        Globals.isLoged = nuevoValor;
    },
};

export default Globals;
