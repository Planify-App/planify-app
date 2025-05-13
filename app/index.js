import { useEffect } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRootNavigationState, router } from "expo-router";

export default function Index() {
        const navigationState = useRootNavigationState();

        useEffect(() => {
                const checkUserSession = async () => {
                        try {
                                let userSession = null;

                                if (Platform.OS === 'web') {
                                        userSession = localStorage.getItem('userSession');
                                } else {
                                        userSession = await AsyncStorage.getItem('userSession');
                                }

                                if (userSession) {
                                        router.replace('/InicioQuedadas');
                                } else {
                                        router.replace('/MenuNoLog');
                                }

                        } catch (error) {
                                console.error('Error al verificar la sesión del usuario:', error);
                                router.replace('/MenuNoLog');
                        }
                };

                if (navigationState?.key) {
                        checkUserSession();
                }
        }, [navigationState]);

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#297169" />
            </View>
        );
}
