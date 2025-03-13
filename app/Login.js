import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, Alert, TextInput, View, TouchableOpacity, Platform} from 'react-native';
import "../global.css"
import {useState} from "react";
import {Link, router} from "expo-router";
import Logo from "./Logo";
import Constants from "expo-constants";
import {MaterialIcons} from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const ip = "192.168.1.111"
    const [Auth, setAuth] = useState('');
    const [campoContra, contrasena] = useState('');
    const [secureText, setSecureText] = useState(true);

    const storeUserSession = async (userData) => {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
            try {
                await AsyncStorage.setItem('userSession', JSON.stringify(userData));
            } catch (error) {
                console.error('Error al guardar la sesión:', error);
            }
        } else if (Platform.OS === 'web') {
            try {
                sessionStorage.setItem('userSession', JSON.stringify(userData));
            } catch (error) {
                console.error('Error al guardar la sesión:', error);
            }
        }
    };

    const subirFormulario = async () => {
        if (!Auth || !campoContra) {
            Alert.alert('Error', 'Por favor, completa ambos campos.');
            return;
        }

        try {
            const response = await fetch(`http://${ip}:3080/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    authUser: Auth,
                    contrasena: campoContra,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                const userData = {
                    nombre_usuario: data.nombre_usuario,
                    token: data.token,
                    refreshToken: data.refreshToken,
                    refreshTokenUpdated: data.refreshTokenUpdated,
                    userId: data.userId,
                };
                await storeUserSession(userData);

                router.push('/InicioQuedadas');
            } else {
                Alert.alert('Error', data.message || 'Credenciales inválidas.');
            }

        } catch (error) {
            Alert.alert('Error', 'Ocurrió un problema con la solicitud.');
            console.error('Error en la petición:', error);
        }
    };

    return (
        <>
            <View style={styles.view} className="w-full min-h-full lg:min-h-screen bg-[#DBF3EF] pb-10">
                <View className="flex items-center justify-center">
                    <View className="max-w-[89%] mx-auto">
                        <Text className="my-5 text-center text-balance font-bold text-4xl">Bienvenido de nuevo a Planify</Text>
                    </View>
                    <Logo size="w-40 h-40" color="#297169" />
                    <StatusBar style="auto" />
                    <Text className="my-5 font-bold text-4xl">Iniciar Sesión</Text>

                    <View className="lg:w-1/3 lg:mx-auto">

                        <Text className="mt-2 font-bold">Nombre de usuario o correo electrónico:</Text>
                        <TextInput
                            className="w-72 lg:w-full bg-white/60"
                            style={styles.input}
                            placeholder="Nombre de usuario o correo electrónico"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={Auth}
                            onChangeText={setAuth}
                        />

                        <Text className="mt-2 font-bold">Contraseña:</Text>
                        <View className="flex flex-row items-center relative">
                            <TextInput
                                secureTextEntry={secureText}
                                keyboardType="default"
                                autoCapitalize="none"
                                className="w-72 lg:w-full bg-white/60"
                                style={styles.input}
                                placeholder="Contraseña"
                                value={campoContra}
                                onChangeText={contrasena}
                            />
                            <TouchableOpacity onPress={() => setSecureText(!secureText)} className="absolute right-2">
                                <MaterialIcons name={secureText ? 'visibility-off' : 'visibility'} size={24} color="rgba(0, 0, 0, 0.3)" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text className={"mb-10 mt-2"}>No tienes cuenta? Registrate <Link href="/Register" style={styles.enlace} className="font-bold">aquí</Link></Text>
                    <TouchableOpacity className="bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                                      onPress={subirFormulario}
                    >
                        <Text className="text-white font-semibold">
                            Iniciar Sesión
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    view: {
        paddingTop: Constants.statusBarHeight,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginTop: 4,
        backgroundColor: '#fff',
    },
    enlace: {
        color: "#0000FF",
    },
});
