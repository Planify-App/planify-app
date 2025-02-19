import * as React from 'react';
import {StyleSheet, View, Text, Button, TouchableOpacity} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Logo from "./Logo";
import Constants from "expo-constants";

export default function MenuNoLog() {
    const navigation = useNavigation();
    return (
        <>
            <View style={styles.view} className="bg-[#DBF3EF] w-full min-h-full lg:min-h-screen">
                <View className="flex my-auto items-center justify-center">
                    <Logo size="w-60 h-60 mb-5 md:w-72 md:h-72" color="#297169" />
                    <Text style={styles.text}>Bienvenido a Planify</Text>
                    <Text style={styles.text} className="text-center">Organiza y crea nuevas experiencias</Text>


                    <View className="flex gap-y-4 justify-center items-center">
                        <TouchableOpacity
                            className="bg-transparent border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text className="text-[#2C7067] text-lg font-semibold">Iniciar Sesión</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text className="text-white text-lg font-semibold">Registrarse</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                            onPress={() => navigation.navigate('InicioQuedadas')}
                        >
                            <Text className="text-white text-lg font-semibold">Ver Inicio con Quedada</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                            onPress={() => navigation.navigate('CrearQuedada')}
                        >
                            <Text className="text-white text-lg font-semibold">Crear quedada</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                            onPress={() => navigation.navigate('UnirseAQuedada')}
                        >
                            <Text className="text-white text-lg font-semibold">Unirse a Quedada</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    view: {
        paddingTop: Constants.statusBarHeight,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: "bold",
    }
});
