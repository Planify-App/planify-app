import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import Globals from "./globals";
import { useRouter, useRootNavigationState } from "expo-router";

export default function InicioQuedadas(){
    const navigation = useNavigation();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    const [quedadas, setQuedadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            if (!navigationState?.key) return;

            try {
                let session = null;

                if (Platform.OS === 'web') {
                    session = localStorage.getItem("userSession");
                } else {
                    session = await AsyncStorage.getItem("userSession");
                }

                if (session) {
                    const userData = JSON.parse(session);
                    setUserId(userData.userId);
                } else {
                    router.replace('/MenuNoLog');
                }
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
                router.replace('/MenuNoLog');
            }
        };

        checkSession();
    }, [navigationState]);

    useEffect(() => {
        async function fetchQuedadas() {
            if (userId) {
                setLoading(true);
                setError(null);

                try {
                    const response = await fetch(`http://${Globals.ip}:3080/api/getHangoutsUser/${userId}`);
                    console.log(response);
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.log(new Error(`HTTP error! status: ${response.status}, message: ${errorText}`));
                    }
                    const data = await response.json();
                    setQuedadas(data);
                } catch (err) {
                    console.error("Error fetching quedadas:", err);
                    setError("Failed to load quedadas. " + err.message);
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchQuedadas();
    }, [userId]);

    function cortarFrase(frase) {
        if (frase.length > 100) {
            return frase.substring(0, 30) + '...';
        }
        return frase;
    }

    if (loading) {
        return (
            <View style={{paddingTop: Constants.statusBarHeight}} className="flex lg:justify-center items-center min-h-screen bg-[#DBF3EF]">
                <StatusBar style="auto" />
                <View className="flex gap-y-4 mb-6">
                    <TouchableOpacity
                        className="bg-[#2C7067] mt-4 border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px-4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                        onPress={() => navigation.navigate('CrearQuedada')}
                    >
                        <Text className="text-white font-semibold">
                            Crear Quedada
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                        onPress={() => navigation.navigate('UnirseAQuedada')}
                    >
                        <Text className="text-white font-semibold">
                            Unirse a Quedada
                        </Text>
                    </TouchableOpacity>
                    <Text className="text-center text-2xl font-semibold">Cargando quedadas...</Text>
                </View>
            </View>
        )
    }

    if (error) {
        return (
            <View style={{paddingTop: Constants.statusBarHeight}} className="flex lg:justify-center items-center min-h-screen">
                <StatusBar style="auto" />
                <View className="flex gap-y-4 mb-6">
                    <TouchableOpacity
                        className="bg-[#2C7067] mt-4 border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px-4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                        onPress={() => navigation.navigate('CrearQuedada')}
                    >
                        <Text className="text-white font-semibold">
                            Crear Quedada
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                        onPress={() => navigation.navigate('UnirseAQuedada')}
                    >
                        <Text className="text-white font-semibold">
                            Unirse a Quedada
                        </Text>
                    </TouchableOpacity>
                    <Text className="text-center text-2xl font-semibold">Error al cargar quedadas...</Text>
                </View>
            </View>
        )
    }
    return (
        <View style={{paddingTop: Constants.statusBarHeight}} className="flex md:w-full lg:justify-center items-center min-h-screen">
            <StatusBar style="auto" />
            <View className="flex gap-y-4 mb-6">
                <TouchableOpacity
                    className="bg-[#2C7067] mt-4 border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px-4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                    onPress={() => navigation.navigate('CrearQuedada')}
                >
                    <Text className="text-white font-semibold">
                        Crear Quedada
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-[#2C7067] border-[#2C7067] border-2 py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all"
                    onPress={() => navigation.navigate('UnirseAQuedada')}
                >
                    <Text className="text-white font-semibold">
                        Unirse a Quedada
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="w-full mx-auto">
                <View
                    style={{ width: '100%'}}
                    className="mx-auto flex-row flex-wrap justify-center gap-6"
                >
                    {quedadas.map((q) => {
                        return (
                            <TouchableOpacity
                                key={q.id}
                                className="w-[75%] max-w-[80%] self-center md:w-1/4 md:mx-0 md:hover:scale-[1.01] transition-transform"
                                onPress={() => navigation.navigate('Quedada', { id: q.id })}
                            >
                                <View className="border-2 min-w-[80%] md:min-w-full min-h-60 border-black/40 rounded-lg overflow-hidden">
                                    { q.link_imagen ? (
                                        <Image
                                            source={{ uri: q.link_imagen }}
                                            style={{ width: '100%', height: 150 }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Image
                                            source={ require('../assets/default-image.png') }
                                            style={{ width: '100%', height: 150 }}
                                            resizeMode="contain"
                                        />
                                    )}
                                    <View className="px-4 py-3 flex-row justify-between">
                                        <View className="flex-1 pr-2">
                                            <Text className="font-semibold mb-1">
                                                {q.nombre_quedada || 'Nombre no disponible'}
                                            </Text>
                                            <Text className="text-sm text-black/60">
                                                {cortarFrase(q.descripcion_quedada)}
                                            </Text>
                                        </View>
                                        <Text className="text-sm">
                                            {q.fecha_hora_inicio
                                                ? new Date(q.fecha_hora_inicio).toLocaleDateString('es-ES')
                                                : '—'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        color: 'black',
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 20,
    },
    quedadaContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
    },
    boxInfo: {
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imagen: {
        width: "auto",
        height: 100,
    },
});