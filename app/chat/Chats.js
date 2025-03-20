
import React, { useEffect, useRef, useState } from "react";
import {Platform, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import {StatusBar} from "expo-status-bar";
import Logo from "../Logo";
import {router} from "expo-router";
import PinIcon from "../PinIcon";

export default function Chats(){
    const [quedadas, setQuedadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        useEffect(() => {
            const getUserSession = async () => {
                try {
                    const session = await AsyncStorage.getItem("userSession");
                    if (session) {
                        const userData = JSON.parse(session);
                        setUserId(userData.userId);
                    }
                } catch (error) {
                    console.error("Error al obtener la sesión:", error);
                }
            };

            getUserSession();
        }, []);
    } else if (Platform.OS === 'web') {
        useEffect(() => {
            const getUserSession = async () => {
                try {
                    const session = sessionStorage.getItem("userSession");
                    if (session) {
                        const userData = JSON.parse(session);
                        setUserId(userData.userId);
                    }
                } catch (error) {
                    console.error("Error al obtener la sesión:", error);
                }
            };

            getUserSession();
        }, []);
    }

    useEffect(() => {
        async function fetchQuedadas() {
            if (userId) {
                setLoading(true);
                setError(null);

                try {
                    const response = await fetch(`http://192.168.19.191:3080/api/getHangoutsUser/${userId}`);
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

    if (loading) {
        return (
            <View style={{paddingTop: Constants.statusBarHeight}} className="bg-[#DBF3EF] flex items-center min-h-screen">
                <StatusBar style="auto" />
                <View className="flex bg-[#2C7067] justify-center w-full">
                    <Text className="w-full font-semibold text-center text-2xl py-2 border-b-2 border-gray-300">
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
                    <Text className="w-full font-semibold text-center text-2xl py-2 border-b-2 border-gray-300">
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
                </View>
            </View>
        )
    }

    return (
        <View style={{paddingTop: Constants.statusBarHeight}} className="bg-[#DBF3EF] flex items-center min-h-screen">
            <StatusBar style="auto" />
            <View className="flex bg-[#2C7067] justify-center w-full">
                <Text className="w-full font-semibold text-center text-2xl py-2 border-b-2 border-gray-300">
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
                {quedadas.map((quedada) => (
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
                ))}
            </View>
        </View>
    )
}