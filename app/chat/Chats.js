import React, { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import Logo from "../Logo";
import PinIcon from "../PinIcon";

export default function Chats() {
    const ip = "192.168.16.112";
    const [quedadas, setQuedadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUserSession = async () => {
            try {
                let session = null;
                if (Platform.OS === 'android' || Platform.OS === 'ios') {
                    session = await AsyncStorage.getItem("userSession");
                } else if (Platform.OS === 'web') {
                    session = localStorage.getItem("userSession");
                }
                if (session) {
                    const userData = JSON.parse(session);
                    if (userData.userId) {
                        setUserId(userData.userId);
                    }
                }
            } catch (err) {
                console.error("Error al obtener la sesión:", err);
            }
        };
        getUserSession();
    }, []);

    useEffect(() => {
        const fetchQuedadas = async () => {
            if (!userId) return;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://${ip}:3080/api/getHangoutsUser/${userId}`);
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP ${response.status}: ${text}`);
                }
                const data = await response.json();
                setQuedadas(data);
            } catch (err) {
                console.error("Error buscando quedadas:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuedadas();
    }, [userId]);

    const Header = () => (
        <View className="flex bg-[#2C7067] justify-center w-full">
            <Text className="w-full font-semibold text-center text-2xl py-2 border-b-2 border-gray-300 text-white">
                Plannify - Chats
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={{ paddingTop: Constants.statusBarHeight }} className="bg-[#DBF3EF] flex items-center min-h-screen">
                <StatusBar style="auto" />
                <Header />
                <View className="flex w-full gap-y-4 mb-6">
                    <TouchableOpacity
                        className="border-b-2 border-gray-300 py-4 px-8 w-full"
                        onPress={() => router.push('/chat/ChatIa')}
                    >
                        <View className="flex flex-row gap-x-4 justify-between">
                            <View className="flex flex-row gap-x-4">
                                <Logo size="w-12 h-12 rounded-full bg-white p-2" color="#297169" />
                                <Text className="font-semibold text-lg">Chat IA</Text>
                            </View>
                            <PinIcon />
                        </View>
                    </TouchableOpacity>
                    <ActivityIndicator size="large" color="#297169" />
                    <Text className="text-center text-xl font-semibold">Cargando chats...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ paddingTop: Constants.statusBarHeight }} className="bg-[#DBF3EF] flex items-center min-h-screen">
                <StatusBar style="auto" />
                <Header />
                <View className="flex w-full gap-y-4 mb-6">
                    <TouchableOpacity
                        className="border-b-2 border-gray-300 py-4 px-8 w-full"
                        onPress={() => router.push('/chat/ChatIa')}
                    >
                        <View className="flex flex-row gap-x-4 justify-between">
                            <Logo size="w-12 h-12 rounded-full bg-white p-2" color="#297169" />
                            <Text className="font-semibold text-lg">Chat IA</Text>
                            <PinIcon />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-center text-xl font-semibold text-red-500">Error al cargar los chats</Text>
                    <Text className="text-center text-lg text-red-500">{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ paddingTop: Constants.statusBarHeight }} className="bg-[#DBF3EF] flex items-center min-h-screen">
            <StatusBar style="auto" />
            <Header />
            <View className="flex w-full gap-y-4 mb-6">
                <TouchableOpacity
                    className="border-b-2 border-gray-300 py-4 px-8 w-full"
                    onPress={() => router.push('/chat/ChatIa')}
                >
                    <View className="flex flex-row items-center gap-x-4 justify-between">
                        <Logo size="w-12 h-12 rounded-full bg-white p-2" color="#297169" />
                        <Text className="font-semibold text-lg flex-1 pl-2">Chat IA</Text>
                        <PinIcon />
                    </View>
                </TouchableOpacity>
                {quedadas.length > 0 ? (
                    quedadas.map((q) => (
                        <TouchableOpacity
                            key={q.id}
                            className="border-b-2 border-gray-300 py-4 px-8 w-full"
                            onPress={() => router.push(`/chat/Chat?id=${q.id}`)}
                        >
                            <View className="flex flex-row items-center gap-x-4 justify-between">
                                {q.link_imagen ? (
                                    <Image
                                        source={{ uri: q.link_imagen }}
                                        className="w-12 h-12 rounded-full bg-white p-2"
                                    />
                                ) : (
                                    <Logo size="w-12 h-12 rounded-full bg-white p-2" color="#297169" />
                                )}
                                <Text className="font-semibold text-lg flex-1 pl-2">{q.nombre_quedada}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text className="text-center text-xl font-semibold mt-4">No tienes chats de quedadas disponibles</Text>
                )}
            </View>
        </View>
    );
}
