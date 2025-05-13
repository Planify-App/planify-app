import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, Image, Platform, TextInput, Alert} from 'react-native';
import { useRoute } from "@react-navigation/native";
import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "expo-status-bar";
import Constants from "expo-constants";
import Globals from "./globals";
import {Checkbox} from "react-native-paper";
import {Avatar} from "react-native-elements";
import defaultAvatar from '../assets/profile-photo.jpg';
import CrownIcon from "./CrownIcon";
import { Picker } from '@react-native-picker/picker';

export default function Quedada() {

    const route = useRoute();
    const { id } = route.params || {};
    const [quedada, setQuedada] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleUpdates, setRoleUpdates] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    const [visibleEvent, setVisibleEvent] = useState(false);
    const [visibleTicket, setVisibleTicket] = useState(false);
    const [editarQuedada, setEditarQuedada] = useState(false);
    const [avatarsMap, setAvatarsMap] = useState({});
    const [viewUsuariosQuedada, setViewUsuariosQuedada] = useState(false);
    const [usuarioRol, setUsuarioRol] = useState(null);
    const [userId, setUserId] = useState(null);

    const [proximoEventoStatus, setProximoEventoStatus] = useState(true);
    const [asistentesStatus, setAsistentesStatus] = useState(true);
    const [ticketsStatus, setTicketsStatus] = useState(true);

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
            const resp = await fetch(`http://${Globals.ip}:3080/api/getUsersFromHangout/${id}`);
            const data = await resp.json();
            setUsers(data);
            setRoleUpdates(
                data.reduce((acc, u) => {
                    acc[u.idUsuario] = u.rol || 'usuario';
                    return acc;
                }, {})
            );
        };
        if (id) fetchUsuarios();
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
                const response = await fetch(
                    `http://${Globals.ip}:3080/api/getHangoutById`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, hangoutId: id }),
                        signal,
                    }
                );
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errText}`);
                }
                const data = await response.json();
                setQuedada(data[0]);
            } catch (err) {
                if (!signal.aborted) {
                    console.error('Error fetching quedada:', err);
                    setError('Failed to load quedada. ' + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchQuedada();

        return () => controller.abort();
    }, [userId, id]);

    useEffect(() => {
        if (!users?.length) {
            console.log("users aún vacío:", users);
            return;
        }

        users.forEach(async (user) => {
            const uid = user.usuario?.id;
            if (!uid) return;

            try {
                const res = await fetch(
                    `http://${Globals.ip}:3080/api/getUserInfo/${uid}`
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                console.log("CONSULTA: " + data)
                const avatarUrl =
                    typeof data.avatar === 'string' && data.avatar.length > 0
                        ? data.avatar
                        : defaultAvatar;
                console.log("AVATAR URL: "+ avatarUrl)

                setAvatarsMap((prev) => ({
                    ...prev,
                    [uid]: avatarUrl,
                }));
            } catch (err) {
                console.warn(`No se pudo cargar avatar de ${uid}:`, err);
                setAvatarsMap((prev) => ({
                    ...prev,
                    [uid]: defaultAvatar,
                }));
            }
        });
    }, [users]);


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

    const changeUserRole = async (userIdToChange, newRole) => {
        try {
            await fetch(`http://${Globals.ip}:3080/api/updateUserRole`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hangoutId: id,
                    userId: userIdToChange,
                    role: newRole
                }),
            });
        } catch (err) {
            console.error('Error actualizando rol:', err);
        }
    };

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
                <Text
                    onPress={() => {
                        setEditarQuedada(false);
                        setViewUsuariosQuedada(false);
                    }}
                    style={styles.button}
                    className="text-red-600 font-bold"
                >
                    Cancelar
                </Text>

                <Button title={"Editar quedada"} onPress={() => setViewUsuariosQuedada(false)} />
                <Button title={"Usuarios quedada"} onPress={() => setViewUsuariosQuedada(true)} />

                {!viewUsuariosQuedada && <View>
                    {quedada && quedada.link_imagen && (
                    <View className="w-full h-fit">
                        <Image
                            source={{ uri: quedada.link_imagen }}
                            className="w-full h-32 lg:h-96 mb-5"
                        />
                        <Avatar.Accessory size={24} />
                    </View>
                    )}
                    <View style={styles.containerInfoQuedada} className="px-5">
                        <Text>Nombre quedada</Text>
                        <View className="flex flex-row gap-x-2 items-end justify-between">
                            <TextInput
                                className="w-72 lg:w-full bg-white/60"
                                style={[styles.inputEditable]}
                                placeholder="NOMBRE USUARIO"
                                value={quedada.nombre_quedada}
                                //onChangeText={}

                            />
                        </View>
                        <View style={styles.containerDescripcio}>

                            <Text>Descripcion</Text>
                            <View className="flex flex-row gap-x-2 items-end justify-between">
                                <TextInput
                                    className="w-72 lg:w-full bg-white/60"
                                    style={[styles.inputEditable]}
                                    placeholder="NOMBRE USUARIO"
                                    value={quedada.descripcion_quedada}
                                    //onChangeText={}

                                />
                            </View>
                        </View>
                        <Checkbox.Item
                            label="Próximo Evento"
                            status={proximoEventoStatus ? 'checked' : 'unchecked'}
                            onPress={() => setProximoEventoStatus(!proximoEventoStatus)}
                            title="Próximo Evento"
                        />
                        {proximoEventoStatus && (
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
                        )}

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

                        <Checkbox.Item
                            label="Asistentes"
                            status={asistentesStatus ? 'checked' : 'unchecked'}
                            onPress={() => setAsistentesStatus(!asistentesStatus)}
                            title="Asistentes"
                        />
                        {asistentesStatus && (
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
                        )}

                        <Checkbox.Item
                            label="Tikets"
                            status={ticketsStatus ? 'checked' : 'unchecked'}
                            onPress={() => setTicketsStatus(!ticketsStatus)}
                            title="Tikets"
                        />
                        {ticketsStatus && (
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
                        )}

                        <Button className="absolute bottom-0" /* onPress={salirQuedada}*/  title={"Aplicar cambios"} />


                    </View>
                </View>}
                {editarQuedada && viewUsuariosQuedada && (
                    <View className="w-64 mx-auto">
                        {(() => {
                            const organiser = users.find(u => u.rol === 'organizador');
                            const iAmOrg = userId === organiser?.idUsuario;

                            return (
                                <>
                                    {users.map(user => {
                                            const isUserOrganizer = user.rol === 'organizador';
                                        const avatarSrc =
                                            typeof user.usuario.avatar === 'string' && user.usuario.avatar.trim().length > 0
                                            ? user.usuario.avatar
                                            : defaultAvatar;
                                    return (
                                <View
                                    key={user.idUsuario}
                                    className="flex flex-row items-center border-2 border-black/20 rounded-lg py-2 px-4 mt-2"
                                >
                                    <Image
                                        source={{ uri: avatarSrc }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            marginRight: 16,
                                        }}
                                        resizeMode="cover"
                                    />

                                    <View className="flex-1">
                                        <Text className="font-bold mb-1">
                                            {user.usuario.nombre_usuario}
                                        </Text>

                                        {isUserOrganizer ? (
                                            <Text className="text-sm text-gray-600 font-semibold">
                                                Organizador
                                            </Text>
                                        ) : (
                                            <Picker
                                                selectedValue={roleUpdates[user.idUsuario]}
                                                onValueChange={val => {
                                                    setRoleUpdates(prev => ({
                                                        ...prev,
                                                        [user.idUsuario]: val
                                                    }));
                                                    setHasChanges(true);
                                                }}
                                                style={{ height: 40 }}
                                            >
                                                <Picker.Item label="Usuario" value="usuario" />
                                                <Picker.Item label="Colaborador" value="colaborador" />
                                            </Picker>
                                        )}
                                    </View>

                                    {isUserOrganizer && <CrownIcon color="black" />}
                                </View>
                                    );
                                })}

                        {hasChanges && (
                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={async () => {
                                    await Promise.all(
                                        Object.entries(roleUpdates).map(([uid, role]) => {
                                            const payload = {
                                                hangoutId: id,
                                                userId: uid,
                                                role: role === 'usuario' ? null : role
                                            };
                                            return fetch(`http://${Globals.ip}:3080/api/updateUserRole`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(payload),
                                            });
                                        })
                                    );
                                    Alert.alert('Guardado', 'Roles actualizados');
                                    setHasChanges(false);
                                }}
                            >
                                <Text style={styles.saveText}>Guardar cambios</Text>
                            </TouchableOpacity>
                        )}
                                </>
                            );
                        })()}
                    </View>
                )}
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
    saveBtn: {
        backgroundColor: '#2C7067',
        margin: 16,
        padding: 12,
        borderRadius: 8,
    },
    saveText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});