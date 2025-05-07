
import React, { useEffect, useRef, useState } from "react";
import {Platform, Text, TouchableOpacity, View, Image} from "react-native";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import {StatusBar} from "expo-status-bar";
import Logo from "../Logo";
import {router} from "expo-router";
import PinIcon from "../PinIcon";

export default function Chats(){
    const ip = "192.168.1.67"
    const [quedadas, setQuedadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUserSession = async () => {
            try {
                let userData = null;
                
                if (Platform.OS === 'android' || Platform.OS === 'ios') {
                    const session = await AsyncStorage.getItem("userSession");
                    if (session) {
                        userData = JSON.parse(session);
                    }
                } else if (Platform.OS === 'web') {
                    const session = localStorage.getItem("userSession");
                    if (session) {
                        userData = JSON.parse(session);
                    }
                }
                
                if (userData && userData.userId) {
                    setUserId(userData.userId);
                } else {
                    console.log("ID de usuario no encontrado en esta sesión");
                }
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
            }
        };

        getUserSession();
    }, []);

    useEffect(() => {
        async function fetchQuedadas() {
            if (userId) {
                setLoading(true);
                setError(null);

                try {
                    const response = await fetch(`http://${ip}:3080/api/getHangoutsUser/${userId}`);
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                    }
                    
                    const data = await response.json();
                    setQuedadas(data);
                } catch (err) {
                    console.error("Error buscando quedadas:", err);
                    setError("Error al cargar las quedadas: " + err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("Id de usuario no encontrado");
            }
        }

        fetchQuedadas();
    }, [userId]);

    if (loading) {
        return (
            <View style={{paddingTop: Constants.statusBarHeight}} className="bg-[#DBF3EF] flex items-center min-h-screen">
                <StatusBar style="auto" />
                <View className="flex bg-[#2C7067] justify-center w-full">
                    <Text className="w-full font-semibold text-center text-2xl py-2 border-b-2 border-gray-300 text-white">
                        Plannify - Chats
                    </Text>
                </View>
                <View className="flex w-full gap-y-4 mb-6">
                    <TouchableOpacity
                        className="border-b-2 border-gray-300 py-4 lg:py-2 px-8 lg:px-4 w-full"
                        onPress={() => router.push('/chat/ChatIa')}
                    >
                        <View className="flex flex-row w-full md:mx-auto md:w-[85%] items-center gap-x-4 justify-between">
                            <View className="flex flex-row items-center gap-x-4">
                                <Logo
                                    size="w-12 h-12 rounded-full bg-white p-2 md:w-[3em] md:h-[3em]"
                                    color="#297169"
                                />
                                <Text className="font-semibold text-lg">Chat IA</Text>
                            </View>
                            <PinIcon className="text-right" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-center text-2xl font-semibold">Cargando chats...</Text>
                </View>
            </View>
        )
    }

    if (error) {
        return (
            <View style={{paddingTop: Constants.statusBarHeight}} className="bg-[#DBF3EF] flex items-center min-h-screen">
                <StatusBar style="auto" />
                <View className="flex bg-[#2C7067] justify-center w-full">
                    <Text className="w-full font-semibold text-center text-2xl py-2 border-b-2 border-gray-300 text-white">
                        Plannify - Chats
                    </Text>
                </View>
                <View className="flex w-full gap-y-4 mb-6">
                    <TouchableOpacity
                        className="border-b-2 border-gray-300 w-full md:mx-auto md:w-[85%] py-4 lg:py-2 px-8 lg:px-4"
                        onPress={() => router.push('/chat/ChatIa')}
                    >
                        <View className="flex flex-row w-[85%] items-center gap-x-4 justify-between">
                            <View className="flex flex-row items-center gap-x-4">
                                <Logo
                                    size="w-12 h-12 rounded-full bg-white p-2 md:w-[3em] md:h-[3em]"
                                    color="#297169"
                                />
                                <Text className="font-semibold text-lg">Chat IA</Text>
                            </View>
                            <PinIcon className="text-right" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-center text-2xl font-semibold">¡Error al cargar los chats!</Text>
                    <Text className="text-center text-lg text-red-500">{error}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{paddingTop: Constants.statusBarHeight}} className="bg-[#DBF3EF] flex items-center min-h-screen">
            <StatusBar style="auto" />
            <View className="flex bg-[#2C7067] justify-center w-full">
                <Text className="w-full font-semibold text-center text-2xl py-2 border-b-2 border-gray-300 text-white">
                    Plannify - Chats
                </Text>
            </View>
            <View className="flex w-full gap-y-4 mb-6">
                <TouchableOpacity
                    className="border-b-2 border-gray-300 py-4 lg:py-2 px-8 lg:px-4 w-full"
                    onPress={() => router.push('/chat/ChatIa')}
                >
                    <View className="flex flex-row w-full md:mx-auto md:w-[85%] items-center gap-x-4 justify-between">
                        <View className="flex flex-row items-center gap-x-4">
                            <Logo
                                size="w-12 h-12 rounded-full bg-white p-2 md:w-[3em] md:h-[3em]"
                                color="#297169"
                            />
                            <Text className="font-semibold text-lg">Chat IA</Text>
                        </View>
                        <PinIcon className="text-right" />
                    </View>
                </TouchableOpacity>
                {quedadas && quedadas.length > 0 ? (
                    quedadas.map((quedada) => (
                        <TouchableOpacity
                            key={quedada.id}
                            className="border-b-2 border-gray-300 py-4 lg:py-2 px-8 lg:px-4 w-full"
                            onPress={() => router.push(`/chat/Chat?id=${quedada.id}`)}
                        >
                            <View className="flex flex-row w-full md:mx-auto md:w-[85%] items-center gap-x-4 justify-between">
                                <View className="flex flex-row items-center gap-x-4">
                                    {quedada.link_imagen && <Image
                                        source={{ uri: quedada.link_imagen }}
                                        className="w-12 h-12 rounded-full bg-white p-2 md:w-[3em] md:h-[3em]"
                                    />}
                                    {!quedada.link_imagen && <Logo
                                        size="w-12 h-12 rounded-full bg-white p-2 md:w-[3em] md:h-[3em]"
                                        color="#297169"
                                    />}
                                    <Text className="font-semibold text-lg">{quedada.nombre_quedada}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text className="text-center text-xl font-semibold mt-4">No tienes chats de quedadas disponibles</Text>
                )}
            </View>
        </View>
    )
}