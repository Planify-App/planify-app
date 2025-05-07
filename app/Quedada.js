import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, Image, Platform} from 'react-native';
import { useRoute } from "@react-navigation/native";
import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "expo-status-bar";
import Constants from "expo-constants";
import Globals from "./globals";

export default function Quedada() {

    const route = useRoute();
    const { id } = route.params || {};
    const [quedada, setQuedada] = useState(null);
    const [tickets, setTickets] = useState(null);
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visibleEvent, setVisibleEvent] = useState(false);
    const [visibleTicket, setVisibleTicket] = useState(false);
    const [editarQuedada, setEditarQuedada] = useState(false);
    const [usuarioRol, setUsuarioRol] = useState(null);
    const [userId, setUserId] = useState(null);

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        useEffect(() => {
            const getUserSession = async () => {
                try {
                    const session = await AsyncStorage.getItem("userSession");
                    if (session) {
                        const userData = JSON.parse(session);
                        setUserId(userData.userId);
                    }else {
                        router.replace('/MenuNoLog');
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
                    const session = localStorage.getItem("userSession");
                    if (session) {
                        const userData = JSON.parse(session);
                        setUserId(userData.userId);
                    }else {
                        router.replace('/MenuNoLog');
                    }
                } catch (error) {
                    console.error("Error al obtener la sesión:", error);
                }
            };

            getUserSession();
        }, []);
    }


    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch(`http://${Globals.ip}:3080/api/getUsersFromHangout/${id}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (id) {
            fetchUsuarios();
        }
    }, [id]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`http://${Globals.ip}:3080/api/getTicketsFromHangout/${id}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setTickets(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (id) {
            fetchTickets();
        }
    }, [id]);

    useEffect(() => {
        if (!userId || !id) return;

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchQuedada = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://${Globals.ip}:3080/api/getHangoutById`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, hangoutId: id }),
                    signal,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
                const data = await response.json();
                console.log(data);
                setQuedada(data[0]);
            } catch (error) {
                if (signal.aborted) {
                    console.log("Fetch aborted");
                    return;
                }
                console.error('Error fetching quedada:', error);
                setError("Failed to load quedada data. " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuedada();

        return () => controller.abort();
    }, [userId, id]);

    async function salirQuedada() {
        const id_quedada = quedada?.id;
        if (id_quedada) {
            await fetch(`http://${Globals.ip}:3080/api/leaveHangout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_quedada: id_quedada,
                    userId: userId
                }),
            });
            router.push('/InicioQuedadas');
        }
    }

    if (loading) {
        return (
            <View className="w-full min-h-screen lg:min-h-screen bg-[#DBF3EF] pb-10 flex justify-center items-center flex-col">
                <StatusBar style="auto" />
                <Text className="text-center text-2xl font-bold">Cargando Quedada...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View className="w-full min-h-screen lg:min-h-screen bg-[#DBF3EF] pb-10 flex justify-center items-center flex-col">
                <StatusBar style="auto" />
                <Text className="text-center text-2xl font-bold">Error al obtener la Quedada.</Text>
            </View>
        )
    }

    return (
        <View style={{paddingTop: Constants.statusBarHeight}} className="w-full min-h-screen lg:min-h-screen bg-[#DBF3EF] pb-10 flex justify-start flex-col">
            <StatusBar style="auto" />
            {!editarQuedada && <View>
                {quedada && quedada.link_imagen && (
                    <View className="w-full h-fit">
                        <Image
                            source={{ uri: quedada.link_imagen }}
                            className="w-full h-32 lg:h-96 mb-5"
                        />
                    </View>
                )}
                <View style={styles.containerInfoQuedada} className="px-5">
                    <View className="flex flex-row gap-x-2 items-end justify-between">
                        <Text className="font-bold text-4xl text-gray-700">{quedada.nombre_quedada}</Text>
                        <Text className="text-xs text-blue-400 font-semibold pb-1" onPress={() => setEditarQuedada(true)}>Editar</Text>
                    </View>
                    <View style={styles.containerDescripcio}>
                        <Text style={styles.descripcion}>{quedada.descripcion_quedada}</Text>
                    </View>
                    <View style={styles.containerProximoEvento}>
                        <TouchableOpacity onPress={() => setVisibleEvent(!visibleEvent)} style={styles.button}>
                            <View style={styles.textProximoEvento} className={`flex flex-row justify-between items-center bg-blue-400 rounded-lg ${visibleEvent ? "rounded-b-none" : ""} px-4 py-2`}>
                                <Text style={styles.buttonText} className="text-white">Próximo Evento</Text>
                                <Text style={styles.buttonText} className="text-white">{visibleEvent ? "⬆" : "⬇"}</Text>
                            </View>
                        </TouchableOpacity>

                        {visibleEvent && (
                            <View className="px-4 py-2 bg-blue-300 rounded-b-lg">
                                <View style={styles.InfoEvento}>
                                    <Text className="text-black">Evento</Text>
                                </View>
                                <View style={styles.MapaEvento}>
                                    <Text>Mapa</Text>
                                </View>
                            </View>
                        )}
                    </View>
                    <View style={styles.containerCalendario7dias}>
                        <Text>Calendario 7 dias</Text>
                        <View style={styles.tabla}>
                            {["Col 1", "Col 2", "Col 3", "Col 4", "Col 5", "Col 6", "Col 7"].map((item, index) => (
                                <View key={index} style={styles.cell}>
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View className="mb-2">
                        <Text className="text-center text-2xl font-semibold">Asistentes</Text>
                        <View className="border-b-2 border-black flex flex-row justify-between">
                            <Text className="font-bold">Nombre de Usuario</Text>
                            <Text className="font-bold">Rol</Text>
                        </View>
                        {
                            users && users.length > 0 && (
                                <View>
                                    {users.map((user) => (
                                        <View key={user.id} className="flex flex-row justify-between items-center">
                                            <Text>{user.usuario.nombre_usuario}</Text>
                                            <Text>
                                                {(() => {
                                                    switch (user.rol) {
                                                        case "organizador":
                                                            return "Organizador";
                                                        case "colaborador":
                                                            return "Colaborador";
                                                        default:
                                                            return "Usuario";
                                                    }
                                                })()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )
                        }
                    </View>
                    <View style={styles.containerTickets}>
                        {tickets && tickets.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setVisibleTicket(!visibleTicket)}
                                style={styles.button}
                                className={`flex flex-row justify-between items-center bg-blue-400 rounded-lg ${visibleTicket ? "rounded-b-none" : ""} px-4 py-2`}
                            >
                                <Text style={styles.buttonText} className="text-white">Tickets</Text>
                                <Text style={styles.buttonText} className="text-white">
                                    {visibleTicket ? "⬆" : "⬇"}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {visibleTicket && tickets && tickets.length > 0 && (
                            <View className="grid grid-cols-2 gap-4 px-4 py-2 bg-blue-300 rounded-b-lg mb-5">
                                {tickets.map((ticket) => (
                                    <View key={ticket.id} className="flex flex-row justify-between items-center">
                                        <Text className="text-white">{ticket.nombre}</Text>
                                        <Text className="text-white">{ticket.precio}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.containerPagos}>

                    </View>
                    <Button className="absolute bottom-0" onPress={salirQuedada} title={"Salir de la quedada"} />
                </View>
            </View>}
            {editarQuedada && <View style={styles.containerEditarQuedada}>
                <Text onPress={() => setEditarQuedada(false)} style={styles.button}>Cancelar</Text>
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
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
    tabla: {
        flexDirection: "row", // Para colocar las celdas en fila
        borderWidth: 1,
        borderColor: "black",
    },
    cell: {
        flex: 1, // Distribuye equitativamente las columnas
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    textProximoEvento: {
        flexDirection: "row"
    },
    ticket: {
        flexDirection: "row"
    },
});