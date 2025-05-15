import React, {useEffect, useState} from 'react';
import {Alert, Button, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useRoute} from "@react-navigation/native";
import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "expo-status-bar";
import Constants from "expo-constants";
import Globals from "./globals";
import {Checkbox} from "react-native-paper";
import {Avatar} from "react-native-elements";
import defaultAvatar from '../assets/profile-photo.jpg';
import CrownIcon from "./CrownIcon";
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from 'expo-clipboard';
import CrearEvento from "./CrearEvento";
import {Feather} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import EditarQuedada from "./EditarQuedada";

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
    const [userOrEmail, setUserOrEmail] = useState('');

    const [visibleEvent, setVisibleEvent] = useState(false);
    const [visibleTicket, setVisibleTicket] = useState(false);
    const [editarQuedada, setEditarQuedada] = useState(false);
    const [avatarsMap, setAvatarsMap] = useState({});
    const [viewUsuariosQuedada, setViewUsuariosQuedada] = useState(false);
    const [usuarioRol, setUsuarioRol] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);


    const [proximoEventoStatus, setProximoEventoStatus] = useState(true);
    const [asistentesStatus, setAsistentesStatus] = useState(true);
    const [ticketsStatus, setTicketsStatus] = useState(true);
    const [linkImagen, setLinkImagen] = useState(null);

    const [nombreQuedada, setNombreQuedada] = useState('');
    const [descripcionQuedada, setDescripcionQuedada] = useState('');
    const [isMultiDay, setIsMultiDay] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().setHours(23, 59)));
    const [eventos, setEventos] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [codigoInvitacion, setCodigoInvitacion] = useState(null);
    const [verInvitacion, setVerInvitacion] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [showKickModal, setShowKickModal] = useState(false);


    const currentUserId = userId;


    useEffect(() => {
        if (eventoSeleccionado) {
            console.log(eventoSeleccionado.pagos);
            setVisibleEvent(false);
        }
    }, [eventoSeleccionado]);
    useEffect(() => {
        if (visibleEvent) {
            setEventoSeleccionado(null);
        }
    }, [visibleEvent]);

    useEffect(() => {
        const cargarEventos = async () => {
            try {
                const response = await fetch(`http://${Globals.ip}:3080/api/getHangoutEvents/${id}`);
                const data = await response.json();
                setEventos(data || []);
                //console.log(data)
            } catch (err) {
                console.error('Error al cargar eventos:', err);
            }
        };

        if (id) cargarEventos();
    }, [id]);
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

            const filteredData = data.filter(u => u && u.idUsuario);
            setUsers(filteredData);

            const roleMap = {};
            filteredData.forEach(u => {
                roleMap[u.idUsuario] = u.rol || 'usuario';
            });
            setRoleUpdates(roleMap);

            if (userId && roleMap[userId]) {
                setUsuarioRol(roleMap[userId]);
                console.log("Actualizo el rol del usuario actual: " + roleMap[userId]);
            }
        };

        if (id && userId) {
            fetchUsuarios();
        }
    }, [id, userId]);


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
                console.log(data);
                setQuedada(data[0]);
                setLinkImagen(data[0].link_imagen);
                setNombreQuedada(data[0].nombre_quedada);
                setDescripcionQuedada(data[0].descripcion_quedada);
                setIsMultiDay(!!data[0].mas_de_un_dia);
                setStartDate(new Date(data[0].fecha_hora_inicio));
                setStartTime(new Date(data[0].fecha_hora_inicio));
                setEndDate(new Date(data[0].fecha_hora_final));
                setEndTime(new Date(data[0].fecha_hora_final));
                setProximoEventoStatus(!!data[0].mostrar_proximos_eventos);
                setTicketsStatus(!!data[0].mostrar_tickets);
                setAsistentesStatus(!!data[0].mostrar_asistentes);
                setCodigoInvitacion(data[0].codigo_invitacion);

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
            //console.log("users aún vacío:", users);
            return;
        }

        users.forEach(async (user) => {
            if (!user?.usuario || !user.usuario.id) return;  // Asegúrate de que existe

            const uid = user.usuario.id;

            try {
                const res = await fetch(`http://${Globals.ip}:3080/api/getUserInfo/${uid}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                const avatarUrl =
                    typeof data.avatar === 'string' && data.avatar.length > 0
                        ? data.avatar
                        : defaultAvatar;

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

    //Cargar iamgen
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const newUrl = await uploadImage(result.assets[0].uri);
            if (newUrl) {
                setLinkImagen(newUrl);
            }
        }
    };

    const uploadImage = async (imageUri) => {
        let formData = new FormData();

        let file;

        if (Platform.OS === 'web') {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            file = new File([blob], 'foto.jpg', {
                type: blob.type || 'image/jpeg',
            });
        } else {
            file = {
                uri: imageUri,
                name: 'foto.jpg',
                type: 'image/jpeg',
            };
        }

        formData.append('image', file);
        formData.append('idQuedada', id);

        try {
            const response = await fetch(`http://${Globals.ip}:3080/api/upload/quedada`, {
                method: 'POST',
                body: formData,
            });

            const json = await response.json();
            if (json.url) {
                console.log('Imagen subida correctamente:', json.url);
                return json.url;
            } else {
                console.error('Error en la respuesta del backend:', json);
                return null;
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            return null;
        }
    };

    const cancelar = async () => {
        setNombreQuedada(quedada.nombre_quedada);
        setDescripcionQuedada(quedada.descripcion_quedada);
        setIsMultiDay(!!quedada.mas_de_un_dia);
        setStartDate(new Date(quedada.fecha_hora_inicio));
        setEndDate(new Date(quedada.fecha_hora_final));
        setStartTime(new Date(quedada.fecha_hora_inicio));
        setEndTime(new Date(quedada.fecha_hora_final));
        setProximoEventoStatus(!!quedada.mostrar_proximos_eventos);
        setTicketsStatus(!!quedada.mostrar_tickets);
        setAsistentesStatus(!!quedada.mostrar_asistentes);
    };

    const guardar = async () => {

        const data = {
            id_quedada: id,
            nombre_quedada: nombreQuedada,
            descripcion_quedada: descripcionQuedada,
            fecha_hora_inicio: formatDateTime(startDate, startTime),
            mas_de_un_dia: isMultiDay,
            fecha_hora_final: formatDateTime(endDate, endTime),
            mostrar_proximos_eventos: proximoEventoStatus,
            mostrar_asistentes: asistentesStatus,
            mostrar_tickets: ticketsStatus,
        };

        console.log(data);
        try {
            const response = await fetch(`http://${Globals.ip}:3080/api/editHangout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            showAlert("Éxito", "La quedada se ha guardado correctamente.");
            setEditarQuedada(false);

        } catch (error) {
            console.error(error);
        }
    }
    const showUserMenu = (targetUserId, targetUserName) => {
        const options = ['Expulsar usuario', 'Cancelar'];
        const destructiveIndex = 0;
        const cancelIndex = 1;

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({
                options,
                destructiveButtonIndex: destructiveIndex,
                cancelButtonIndex: cancelIndex,
                title: `¿Qué quieres hacer con ${targetUserName}?`
            }, buttonIndex => {
                if (buttonIndex === destructiveIndex) {
                    expelUser(targetUserId);
                }
            });
        } else {
            // Android / Web: usa un Alert
            Alert.alert(
                `¿Qué quieres hacer con ${targetUserName}?`,
                null,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Expulsar usuario', style: 'destructive', onPress: () => expelUser(targetUserId) },
                ]
            );
        }
    };

    const handleInviteUser = async () => {
        try {
            const response = await fetch(`http://${Globals.ip}:3080/api/inviteUser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail: userOrEmail, invitationCode: quedada.codigo_invitacion })
            });
            const result = await response.json();
            if (result.status) {
                Alert.alert('Invitación enviada', 'Se ha enviado la invitación a tu correo electrónico.');
            } else {
                Alert.alert('Error', result.message || 'Error al enviar la invitación.');
            }
        } catch (error) {
            console.error('Error en /api/inviteUser:', error);
            Alert.alert('Error', 'Ocurrió un error al enviar la invitación.');
        }
    }

    const expelUser = async (targetUserId) => {
        try {
            await fetch(`http://${Globals.ip}:3080/api/removeUserFromHangout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hangoutId: id, userId: targetUserId })
            });
            // Actualiza la lista local tras expulsión
            setUsers(prev => prev.filter(u => u.idUsuario !== targetUserId));
        } catch (err) {
            console.error('No se pudo expulsar al usuario:', err);
            Alert.alert('Error', 'No pudimos expulsar al usuario.');
        }
    };



    const showAlert = (title, message) => {
        if (Platform.OS === 'web') {
            // En web usamos el alert nativo del navegador
            window.alert(`${title}\n\n${message}`);
        } else {
            // En móvil usamos el componente Alert de React Native
            alert(title, message);
        }
    };

    const formatDateTime = (date, time) => {
        const d = new Date(date);
        d.setHours(time.getHours(), time.getMinutes(), 0, 0);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    };

    const getDiastotales = () => {
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffInMs = endDate.getTime() - startDate.getTime();
        return Math.floor(diffInMs / msPerDay) + 1;
    };


    if (loading) {
        return (
            <View className="w-full min-h-screen lg:min-h-screen pb-10 flex justify-center items-center flex-col">
                <StatusBar style="auto" />
                <Text className="text-center text-2xl font-bold">Cargando Quedada...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View className="w-full min-h-screen lg:min-h-screen pb-10 flex justify-center items-center flex-col">
                <StatusBar style="auto" />
                <Text className="text-center text-2xl font-bold">Error al obtener la Quedada.</Text>
            </View>
        )
    }

    return (
        <View style={{paddingTop: Constants.statusBarHeight}} className="w-full min-h-screen lg:min-h-screen pb-10 flex justify-start flex-col">
            <StatusBar style="auto" />
            {!editarQuedada && <View>
                {linkImagen && (
                    <View className="w-full h-fit relative">
                        <Image
                            source={{ uri: linkImagen }}
                            className="w-full h-48 lg:h-96 mb-6 rounded-b-3xl"
                        />
                    </View>
                )}

                <View className="px-6 pb-28">
                    <View className="flex flex-row justify-between items-end mb-4">
                        <Text className="text-3xl font-bold text-gray-800">{nombreQuedada}</Text>
                        {(usuarioRol === 'organizador' || usuarioRol === 'colaborador') && (
                            <Text onPress={() => setEditarQuedada(true)} className="text-blue-500 text-sm font-semibold">
                                Editar
                            </Text>
                        )}
                    </View>

                    <Text className="text-base text-gray-700 mb-4">{descripcionQuedada}</Text>

                    <View className="mb-4">
                        {isMultiDay ? (
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">🗓 La quedada dura más de un día</Text>
                                <Text>📍 Empieza: <Text style={{ fontWeight: 'bold' }}>{formatDateTime(startDate, startTime)}</Text></Text>
                                <Text>⏱ Dura: <Text style={{ fontWeight: 'bold' }}>{getDiastotales()} días</Text></Text>
                                <Text>🏁 Termina: <Text style={{ fontWeight: 'bold' }}>{formatDateTime(endDate, endTime)}</Text></Text>
                            </View>
                        ) : (
                            <Text className="text-sm text-gray-500">🗓 Solo dura un día: {formatDateTime(startDate, startTime)}</Text>
                        )}
                    </View>

                    {(usuarioRol === 'organizador' || usuarioRol === 'colaborador') && (
                        <TouchableOpacity
                            onPress={() => setShowEventModal(true)}
                            className="bg-green-500 py-3 rounded-xl mb-5"
                        >
                            <Text className="text-white font-semibold text-center">Crear Evento</Text>
                        </TouchableOpacity>
                    )}
                    {/* Próximos eventos */}
                    <View className="mb-5">
                        <TouchableOpacity
                            onPress={() => setVisibleEvent(!visibleEvent)}
                            className={`bg-blue-400 px-4 py-3 rounded-t-xl flex flex-row justify-between items-center ${visibleEvent ? '' : 'rounded-b-xl'}`}
                        >
                            <Text className="text-white font-bold text-base">Próximos Eventos</Text>
                            <Text className="text-white text-lg">{visibleEvent ? '⬆' : '⬇'}</Text>
                        </TouchableOpacity>

                        {visibleEvent && (
                            <View className="bg-blue-300 p-4 rounded-b-xl space-y-2">
                                {eventos.length > 0 ? (
                                    eventos.map((evento) => (
                                        <TouchableOpacity
                                            key={evento.id}
                                            onPress={() => setEventoSeleccionado(evento)}
                                            className="bg-white p-3 rounded-lg"
                                        >
                                            <Text className="font-bold text-lg">{evento.nombre_evento}</Text>
                                            <Text>{evento.lugar_evento}</Text>
                                            <Text>{evento.fecha_hora_evento}</Text>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text className="text-white">No hay eventos disponibles.</Text>
                                )}
                            </View>
                        )}

                        {eventoSeleccionado && (
                            <View className="bg-gray-100 p-4 rounded-xl mt-4 space-y-2">
                                <Text className="text-xl font-bold">{eventoSeleccionado.nombre_evento}</Text>
                                <Text>📍 Lugar: <Text className="font-bold">{eventoSeleccionado.lugar_evento}</Text></Text>
                                <Text>📅 Fecha: <Text className="font-bold">{eventoSeleccionado.fecha_hora_evento}</Text></Text>
                                <Text>📋 Descripción<Text className="font-bold">{eventoSeleccionado.descripcion_evento}</Text></Text>

                                <View className="mt-4">
                                    <Text className="font-bold text-base mb-2">💸 Pagos por usuario:</Text>
                                    <Text>Total a pagar -> <Text className="font-bold">{eventoSeleccionado.precio_total}</Text></Text>

                                    {eventoSeleccionado.pagos && eventoSeleccionado.pagos.length > 0 ? (
                                        eventoSeleccionado.pagos.map((pago, index) => (
                                            <Text key={index}>
                                                Usuario: <Text className="font-bold">{pago.nombre_usuario}</Text> Cantidad: <Text className="font-bold">{pago.cantidad} €</Text>
                                            </Text>
                                        ))
                                    ) : (
                                        <Text className="italic text-gray-600">No hay pagos asignados.</Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        setEventoSeleccionado(null);
                                        setVisibleEvent(true);
                                    }}
                                    className="bg-blue-500 p-3 rounded-lg"
                                >
                                    <Text className="text-white text-center">Cerrar detalle</Text>
                                </TouchableOpacity>


                                {(usuarioRol === 'organizador' || usuarioRol === 'colaborador') && (
                                    <View className="space-y-2">
                                        <TouchableOpacity onPress={() => setShowEditarModal(true)} className="bg-green-500 p-3 rounded-lg">
                                            <Text className="text-white text-center">Editar evento</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setShowConfirmModal(true)} className="bg-red-500 p-3 rounded-lg">
                                            <Text className="text-white text-center">Eliminar evento</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}

                    </View>


                    {/* Modal edición */}
                    <Modal visible={showEditarModal} animationType="slide" onRequestClose={() => setShowEditarModal(false)}>
                        <View className="flex-1 p-4">
                            <EditarQuedada evento={eventoSeleccionado} onClose={() => setShowEditarModal(false)} />
                        </View>
                    </Modal>

                    {/* Asistentes */}
                    {asistentesStatus && (
                        <View className="mb-5">
                            <Text className="text-2xl text-center font-bold mb-3">Asistentes</Text>
                            <View className="border-b border-black flex flex-row justify-between py-1">
                                <Text className="font-bold">Nombre</Text>
                                <Text className="font-bold">Rol</Text>
                            </View>
                            {users.map((user) => (
                                <View key={user.id} className="flex flex-row justify-between py-1">
                                    <Text>{user.usuario.nombre_usuario}</Text>
                                    <Text>
                                        {{
                                            organizador: 'Organizador',
                                            colaborador: 'Colaborador',
                                        }[user.rol] || 'Usuario'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Tickets */}
                    {ticketsStatus && tickets.length > 0 && (
                        <View className="mb-5">
                            <TouchableOpacity
                                onPress={() => setVisibleTicket(!visibleTicket)}
                                className={`bg-blue-400 px-4 py-3 rounded-t-xl flex flex-row justify-between items-center ${visibleTicket ? '' : 'rounded-b-xl'}`}
                            >
                                <Text className="text-white font-bold">Tickets</Text>
                                <Text className="text-white">{visibleTicket ? '⬆' : '⬇'}</Text>
                            </TouchableOpacity>

                            {visibleTicket && (
                                <View className="bg-blue-300 p-4 rounded-b-xl">
                                    {tickets.map((ticket) => (
                                        <View key={ticket.id} className="flex flex-row justify-between py-1">
                                            <Text className="text-white">{ticket.nombre}</Text>
                                            <Text className="text-white">{ticket.precio}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Botón Salir */}
                    <TouchableOpacity onPress={salirQuedada} className="bg-red-500 py-3 rounded-xl mt-4">
                        <Text className="text-white text-center font-semibold">Salir de la quedada</Text>
                    </TouchableOpacity>
                </View>

                {/* Botón Chat */}
                <TouchableOpacity
                    onPress={() => router.replace(`/chat/Chat?id=${id}`)}
                    className="absolute bottom-6 right-6 bg-white rounded-full p-3 shadow-lg"
                    style={{ width: 56, height: 56, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Image
                        source={require('../assets/icono-chat.png')}
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>}
            {editarQuedada && <View style={styles.containerEditarQuedada}>
                <Text
                    onPress={() => {
                        setEditarQuedada(false);
                        setViewUsuariosQuedada(false);
                        cancelar();
                    }}
                    className="text-red-600 font-bold mb-4 text-left pl-6"
                >
                    Cancelar
                </Text>

                <View className="flex flex-row justify-around mb-5">
                    <TouchableOpacity
                        onPress={() => setViewUsuariosQuedada(false)}
                        className={`px-4 py-2 rounded-lg ${!viewUsuariosQuedada ? 'bg-gray-300' : 'bg-blue-500'}`}
                    >
                        <Text className="text-white font-semibold">Editar quedada</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setViewUsuariosQuedada(true)}
                        className={`px-4 py-2 rounded-lg ${viewUsuariosQuedada ? 'bg-gray-300' : 'bg-blue-500'}`}
                    >
                        <Text className="text-white font-semibold">Usuarios quedada</Text>
                    </TouchableOpacity>
                </View>

                {!viewUsuariosQuedada && (
                    <View className="px-4">
                        {linkImagen && (
                            <View className="relative mb-5">
                                <TouchableOpacity onPress={pickImage} className="w-full">
                                    <Image source={{ uri: linkImagen }} className="w-full h-40 rounded-xl shadow-md" />
                                </TouchableOpacity>
                                <Avatar.Accessory
                                    size={28}
                                    onPress={pickImage}
                                    style={{ position: 'absolute', bottom: 10, right: 10 }}
                                />
                            </View>
                        )}

                        {quedada && !quedada.link_imagen && (
                            <Button title="Poner imagen" onPress={pickImage} />
                        )}

                        <View className="bg-white rounded-xl p-4 shadow mb-4">
                            <Text className="font-semibold mb-1">Nombre quedada</Text>
                            <TextInput
                                className="bg-gray-100 rounded-md px-3 py-2 mb-4"
                                style={styles.inputEditable}
                                placeholder="Nombre quedada"
                                value={nombreQuedada}
                                onChangeText={setNombreQuedada}
                            />

                            <Text className="font-semibold mb-1">Descripción</Text>
                            <TextInput
                                className="bg-gray-100 rounded-md px-3 py-2 mb-4"
                                style={styles.inputEditable}
                                placeholder="Descripción"
                                value={descripcionQuedada}
                                onChangeText={setDescripcionQuedada}
                            />

                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="font-semibold">¿Más de un día?</Text>
                                <TouchableOpacity onPress={() => setIsMultiDay(!isMultiDay)}>
                                    {isMultiDay ? (
                                        <Feather name="check-circle" size={24} color="green" />
                                    ) : (
                                        <Feather name="circle" size={24} color="gray" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Text className="font-semibold mb-1">Fecha y hora de inicio</Text>
                            {Platform.OS === 'android' ? (
                                <>
                                    <TouchableOpacity
                                        className="bg-blue-500 py-2 px-4 rounded-lg mb-2"
                                        onPress={() => setShowStartDatePicker(true)}
                                    >
                                        <Text className="text-white text-center">Fecha de inicio</Text>
                                    </TouchableOpacity>
                                    {showStartDatePicker && (
                                        <DateTimePicker
                                            value={startDate}
                                            mode="date"
                                            display="default"
                                            locale="es-ES"
                                            onChange={onChangeStartDate}
                                            minimumDate={new Date()}
                                        />
                                    )}

                                    <TouchableOpacity
                                        className="bg-blue-500 py-2 px-4 rounded-lg mb-4"
                                        onPress={() => setShowStartTimePicker(true)}
                                    >
                                        <Text className="text-white text-center">Hora de inicio</Text>
                                    </TouchableOpacity>
                                    {showStartTimePicker && (
                                        <DateTimePicker
                                            value={startTime}
                                            mode="time"
                                            display="default"
                                            is24Hour={true}
                                            locale="es-ES"
                                            onChange={onChangeStartTime}
                                        />
                                    )}
                                </>
                            ) : (
                                <View className="gap-y-3">
                                    {/* Web */}
                                    <Text className="font-semibold">Fecha:</Text>
                                    <input
                                        type="date"
                                        value={startDate.toISOString().split('T')[0]}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={e => setStartDate(new Date(e.target.value))}
                                        className="border rounded px-2 py-1"
                                    />
                                    <Text className="font-semibold">Hora:</Text>
                                    <input
                                        type="time"
                                        value={startTime.toLocaleTimeString('it-IT').slice(0, 5)}
                                        onChange={e => {
                                            const [h, m] = e.target.value.split(':');
                                            const t = new Date(startTime);
                                            t.setHours(h, m);
                                            setStartTime(t);
                                        }}
                                        className="border rounded px-2 py-1"
                                    />
                                </View>
                            )}

                            {isMultiDay && (
                                <>
                                    <Text className="font-semibold mt-4 mb-1">Fecha y hora de finalización</Text>

                                    {Platform.OS === 'android' ? (
                                        <>
                                            <TouchableOpacity
                                                className="bg-blue-500 py-2 px-4 rounded-lg mb-2"
                                                onPress={() => setShowEndDatePicker(true)}
                                            >
                                                <Text className="text-white text-center">Fecha de finalización</Text>
                                            </TouchableOpacity>
                                            {showEndDatePicker && (
                                                <DateTimePicker
                                                    value={endDate}
                                                    mode="date"
                                                    display="default"
                                                    locale="es-ES"
                                                    onChange={onChangeEndDate}
                                                    minimumDate={new Date(startDate.getTime() + 86400000)}
                                                />
                                            )}

                                            <TouchableOpacity
                                                className="bg-blue-500 py-2 px-4 rounded-lg mb-2"
                                                onPress={() => setShowEndTimePicker(true)}
                                            >
                                                <Text className="text-white text-center">Hora de finalización</Text>
                                            </TouchableOpacity>
                                            {showEndTimePicker && (
                                                <DateTimePicker
                                                    value={endTime}
                                                    mode="time"
                                                    display="default"
                                                    is24Hour={true}
                                                    locale="es-ES"
                                                    onChange={onChangeEndTime}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <View className="gap-y-3">
                                            <Text className="font-semibold">Fecha final:</Text>
                                            <input
                                                type="date"
                                                value={endDate.toISOString().split('T')[0]}
                                                min={new Date(startDate.getTime() + 86400000).toISOString().split('T')[0]}
                                                onChange={e => {
                                                    const d = new Date(e.target.value);
                                                    if (d <= startDate) {
                                                        alert("La fecha final debe ser posterior a la inicial.");
                                                        return;
                                                    }
                                                    setEndDate(d);
                                                }}
                                                className="border rounded px-2 py-1"
                                            />
                                            <Text className="font-semibold">Hora final:</Text>
                                            <input
                                                type="time"
                                                value={endTime.toLocaleTimeString('it-IT').slice(0, 5)}
                                                onChange={e => {
                                                    const [h, m] = e.target.value.split(':');
                                                    const t = new Date(endTime);
                                                    t.setHours(h, m);
                                                    if (t <= startDate) {
                                                        alert("La hora final debe ser posterior a la inicial.");
                                                        return;
                                                    }
                                                    setEndTime(t);
                                                }}
                                                className="border rounded px-2 py-1"
                                            />
                                        </View>
                                    )}
                                </>
                            )}

                            <Checkbox.Item
                                label="Próximo Evento"
                                status={proximoEventoStatus ? 'checked' : 'unchecked'}
                                onPress={() => setProximoEventoStatus(!proximoEventoStatus)}
                            />

                            {proximoEventoStatus && (
                                <View className="mb-4">
                                    <TouchableOpacity
                                        onPress={() => setVisibleEvent(!visibleEvent)}
                                        className="bg-blue-500 px-4 py-2 rounded-t-lg flex-row justify-between items-center"
                                    >
                                        <Text className="text-white font-semibold">Próximo Evento</Text>
                                        <Text className="text-white text-xl">{visibleEvent ? "⬆" : "⬇"}</Text>
                                    </TouchableOpacity>

                                    {visibleEvent && (
                                        <View className="bg-blue-300 px-4 py-3 rounded-b-lg">
                                            <Text className="text-white font-semibold mb-2">Evento 1</Text>
                                            <Text className="text-white font-semibold mb-2">Evento 1</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            <Checkbox.Item
                                label="Asistentes"
                                status={asistentesStatus ? 'checked' : 'unchecked'}
                                onPress={() => setAsistentesStatus(!asistentesStatus)}
                            />

                            {asistentesStatus && (
                                <View className="mt-2 mb-4">
                                    <Text className="text-center font-semibold text-lg mb-2">Asistentes</Text>
                                    <View className="border-b border-black flex-row justify-between pb-1">
                                        <Text className="font-semibold">Usuario</Text>
                                        <Text className="font-semibold">Rol</Text>
                                    </View>
                                    {users && users.map(user => (
                                        <View key={user.id} className="flex-row justify-between py-1">
                                            <Text>{user.usuario.nombre_usuario}</Text>
                                            <Text>
                                                {user.rol === 'organizador'
                                                    ? 'Organizador'
                                                    : user.rol === 'colaborador'
                                                        ? 'Colaborador'
                                                        : 'Usuario'}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <Checkbox.Item
                                label="Tickets"
                                status={ticketsStatus ? 'checked' : 'unchecked'}
                                onPress={() => setTicketsStatus(!ticketsStatus)}
                            />

                            {ticketsStatus && (
                                <View className="mb-5">
                                    <TouchableOpacity
                                        onPress={() => setVisibleTicket(!visibleTicket)}
                                        className="bg-blue-500 px-4 py-2 rounded-t-lg flex-row justify-between items-center"
                                    >
                                        <Text className="text-white font-semibold">Tickets</Text>
                                        <Text className="text-white text-xl">{visibleTicket ? "⬆" : "⬇"}</Text>
                                    </TouchableOpacity>

                                    {visibleTicket && (
                                        <View className="bg-blue-300 p-4 rounded-b-lg grid grid-cols-2 gap-4">
                                            {tickets.map(ticket => (
                                                <View key={ticket.id} className="flex-row justify-between">
                                                    <Text className="text-white">{ticket.nombre}</Text>
                                                    <Text className="text-white">{ticket.precio}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}

                            <Button title="Aplicar cambios" onPress={guardar} />
                        </View>
                    </View>
                )}

                {editarQuedada && viewUsuariosQuedada && (
                    <View className="w-72 sm:w-80 mx-auto">
                        {(() => {
                            const organiser = users.find(u => u.rol === 'organizador');
                            const iAmOrg = userId === organiser?.idUsuario;

                            return (
                                <>
                                    {users.map(user => {
                                        const isUserOrganizer = user.rol === 'organizador';
                                        const isSelf     = user.idUsuario === currentUserId;
                                        const myRole     = roleUpdates[currentUserId];
                                        const targetRole = user.rol;

                                        const showMenu =
                                            !isSelf &&
                                            (
                                                myRole === 'organizador' ||
                                                (myRole === 'colaborador' && targetRole === 'usuario')
                                            );

                                        const avatarSrc =
                                            typeof user.usuario.avatar === 'string' && user.usuario.avatar.trim().length > 0
                                                ? user.usuario.avatar
                                                : defaultAvatar;

                                        return (
                                            <View
                                                key={user.idUsuario}
                                                className="flex flex-row items-center bg-white border border-gray-300 rounded-xl py-3 px-4 mt-3 shadow-sm"
                                            >
                                                {showMenu && (
                                                    <TouchableOpacity
                                                        onPress={() => showUserMenu(user.idUsuario, user.usuario.nombre_usuario)}
                                                        style={{ position: 'absolute', top: 8, right: 8 }}  // ¡arriba a la derecha!
                                                    >
                                                        <Feather name="more-vertical" size={20} color="#555" />
                                                    </TouchableOpacity>
                                                )}
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
                                                    <Text className="font-semibold text-base text-gray-800 mb-1">
                                                        {user.usuario.nombre_usuario}
                                                    </Text>

                                                    {isUserOrganizer ? (
                                                        <Text className="text-sm text-gray-500 font-medium">Organizador</Text>
                                                    ) : (
                                                        <Picker
                                                            selectedValue={roleUpdates[user.idUsuario]}
                                                            onValueChange={val => {
                                                                setRoleUpdates(prev => ({
                                                                    ...prev,
                                                                    [user.idUsuario]: val,
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
                                            className="mt-6 bg-green-600 py-2 px-4 rounded-xl shadow"
                                            onPress={async () => {
                                                await Promise.all(
                                                    Object.entries(roleUpdates).map(([uid, role]) => {
                                                        const payload = {
                                                            hangoutId: id,
                                                            userId: uid,
                                                            role: role === 'usuario' ? null : role,
                                                        };
                                                        return fetch(`http://${Globals.ip}:3080/api/updateUserRole`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify(payload),
                                                        });
                                                    })
                                                );
                                                alert('Guardado', 'Roles actualizados');
                                                setHasChanges(false);
                                            }}
                                        >
                                            <Text className="text-white font-semibold text-center">Guardar cambios</Text>
                                        </TouchableOpacity>
                                    )}
                                    <Text className="mt-4 mb-2 text-md font-bold text-center">Correo Electrónico/Nombre de Usuario:</Text>
                                    <TextInput className="bg-white b-2 py-2 px-4 rounded-lg border-black/60" placeholder="username/email" value={userOrEmail} onChangeText={setUserOrEmail}/>
                                    <TouchableOpacity className="mt-4 bg-[#2C7067] py-4 lg:py-2 px-8 lg:px4 rounded-lg min-w-48 lg:min-w-42 flex items-center justify-center lg:opacity-80 lg:hover:opacity-100 lg:hover:scale-[1.01] lg:transition-all" onPress={handleInviteUser}>
                                        <Text className="text-white text-lg font-semibold">Invitar</Text>
                                    </TouchableOpacity>

                                    <View className="items-center mt-6">
                                        <TouchableOpacity
                                            onPress={() => setVerInvitacion(!verInvitacion)}
                                            className="bg-[#568d85] px-4 py-2 rounded-xl"
                                        >
                                            <Text className="text-white text-base font-medium">
                                                {verInvitacion ? 'Ocultar Código' : 'Mostrar Código de invitación'}
                                            </Text>
                                        </TouchableOpacity>

                                        {verInvitacion && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    Clipboard.setStringAsync(codigoInvitacion);
                                                    alert('¡Código copiado al portapapeles!');
                                                }}
                                                className="mt-4 bg-gray-100 px-4 py-3 rounded-xl w-64"
                                            >
                                                <Text className="text-center text-lg font-bold text-gray-800">
                                                    Código de invitación: {codigoInvitacion}
                                                </Text>
                                                <Text className="text-center text-xs text-gray-500 mt-1">
                                                    (Toca para copiar)
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </>
                            );
                        })()}
                    </View>

                )}
            </View>}

            {/* Modal para crear evento */}
            <Modal
                visible={showEventModal}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setShowEventModal(false)}
            >
                <CrearEvento
                    idQuedada={quedada?.id}
                    onClose={() => setShowEventModal(false)}
                />
            </Modal>

            <Modal
                visible={showConfirmModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: '80%',
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        elevation: 5
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>¿Eliminar evento?</Text>
                        <Text style={{ marginBottom: 20 }}>
                            Esta acción eliminará el evento y todos sus pagos asociados. ¿Estás seguro de que deseas continuar?
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => setShowConfirmModal(false)}
                                style={{ marginRight: 10 }}
                            >
                                <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        const response = await fetch(`http://${Globals.ip}:3080/api/deleteEvent`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ id_evento: eventoSeleccionado.id_evento }),
                                        });

                                        if (!response.ok) throw new Error('Error al eliminar evento');

                                        const result = await response.json();
                                        if (result === true) {
                                            setEventoSeleccionado(null);
                                            window.location.reload();
                                        } else {
                                            Alert.alert("Error", "No se pudo eliminar el evento.");
                                        }

                                    } catch (error) {
                                        console.error("Error al eliminar el evento:", error);
                                        Alert.alert("Error", "Ocurrió un error al eliminar el evento.");
                                    }
                                    setShowConfirmModal(false);
                                }}
                            >
                                <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "black",
    },
    cell: {
        flex: 1,
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
    roundButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    roundButtonImage: {
        width: 32,
        height: 32,
        tintColor: '#fff', // Puedes quitar esto si tu imagen no necesita recolorearse
    },
    botonCrearEvento: {
        backgroundColor: '#5dd55d',
        padding: 5,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    botonTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        justifyContent: 'space-between',
        marginTop: 10
    },
    closeButton: {
        flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
    },
});