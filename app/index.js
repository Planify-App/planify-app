import MenuNoLog from "./MenuNoLog";
import InicioQuedadas from "./InicioQuedadas";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from "react";

export default async function Index() {
        const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

        useEffect(() => {
                const checkUserSession = async () => {
                        try {
                                const userSession = await AsyncStorage.getItem('userSession');
                                setIsUserLoggedIn(!!userSession);
                        } catch (error) {
                                console.error('Error al verificar la sesión del usuario:', error);
                                setIsUserLoggedIn(false);
                        }
                };

                checkUserSession();
        }, []);

        if (isUserLoggedIn === null) {
                return null;
        }

        return isUserLoggedIn ? <InicioQuedadas /> : <MenuNoLog />;
}