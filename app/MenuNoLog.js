import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Logo from "./Logo";
import Constants from "expo-constants";
import {StatusBar} from "expo-status-bar";
import Globals from "./globals";

export default function MenuNoLog() {
    const navigation = useNavigation();
    return (
        <>
            <View style={{paddingTop: Constants.statusBarHeight}} className="bg-[#DBF3EF] w-full min-h-full lg:h-screen">
                <StatusBar style="auto" />
                <View className="flex py-32 lg:py-24 items-center justify-center">
                    <Text style={styles.text} className="text-4xl font-bold text-center mb-6">Bienvenido a Planify</Text>
                    <Logo size="w-60 h-60 mb-5 md:w-72 md:h-72" color="#297169" />
                    <Text style={styles.text} className="text-xl font-semibold mb-6 text-center w-80 mx-auto">Organiza y crea nuevas experiencias</Text>


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
                        {/*<TouchableOpacity*/}
                        {/*    className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"*/}
                        {/*    onPress={() => navigation.navigate('InicioQuedadas')}*/}
                        {/*>*/}
                        {/*    <Text className="text-white text-lg font-semibold">Ver Inicio con Quedada</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<TouchableOpacity*/}
                        {/*    className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"*/}
                        {/*    onPress={() => navigation.navigate('CrearQuedada')}*/}
                        {/*>*/}
                        {/*    <Text className="text-white text-lg font-semibold">Crear quedada</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<TouchableOpacity*/}
                        {/*    className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"*/}
                        {/*    onPress={() => navigation.navigate('UnirseAQuedada')}*/}
                        {/*>*/}
                        {/*    <Text className="text-white text-lg font-semibold">Unirse a Quedada</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<TouchableOpacity*/}
                        {/*    className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"*/}
                        {/*    onPress={() => navigation.navigate('PerfilUsuario')}*/}
                        {/*>*/}
                        {/*    <Text className="text-white text-lg font-semibold">Perfil del Usuario</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<TouchableOpacity*/}
                        {/*    className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"*/}
                        {/*    onPress={() => router.push('/chat/Chat')}*/}
                        {/*>*/}
                        {/*    <Text className="text-white text-lg font-semibold">Chat</Text>*/}
                        {/*</TouchableOpacity>*/}

                        <TouchableOpacity
                            className="bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                            onPress={() => router.push('/chat/ChatIa')}
                        >
                            <Text className="text-white text-lg font-semibold">Chat IA</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
