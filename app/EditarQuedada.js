import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Switch, StyleSheet,
    Platform, ToastAndroid, Alert, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Globals from './globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const EditarEvento = ({ evento, onClose }) => {
    const [pagos, setPagos] = useState(!!evento.mostrar_pagos);
    const [tipoPago, setTipoPago] = useState(evento.tipo_pago || 'Equitativo');
    const [descripcion, setDescripcion] = useState(evento.descripcion_evento || '');
    const [nombreEvento, setNombreEvento] = useState(evento.nombre_evento || '');
    const [lugar, setLugar] = useState(evento.lugar_evento || '');
    const [users, setUsers] = useState([]);
    const [fecha, setFecha] = useState(new Date(evento.fecha_hora_evento));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cantidad, setCantidad] = useState(evento.precio_total || '');
    const [userId, setUserId] = useState(null);
    const [startTime, setStartTime] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());

    const navigation = useNavigation();

    const onChangeStartTime = (event, selectedTime) => {
        if (selectedTime) {
            const now = new Date();
            const selected = new Date(startDate);
            selected.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

            const nowCompare = new Date();
            nowCompare.setSeconds(0, 0); // ✅ CAMBIO: más preciso

            if (selected < nowCompare) {
                Alert.alert("Hora inválida", "La hora de inicio no puede ser anterior a la hora actual.");
                return;
            }

            setStartTime(selectedTime);
            updateStartText(startDate, selectedTime);
            if (Platform.OS === 'android') {
                setShowStartTimePicker(false);
            }
        }
    };

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

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch(`http://${Globals.ip}:3080/api/getUsersFromHangout/${evento.id_quedada}`);
                const data = await response.json();

                const formattedUsers = data
                    .filter(u => u.usuario)
                    .map(u => ({
                        id: u.idUsuario,
                        nombre: u.usuario.nombre || 'Usuario sin nombre',
                        cantidad: '',
                        rol: u.rol
                    }));

                setUsers(formattedUsers);
            } catch (err) {
                console.error('Error al cargar usuarios:', err);
            }
        };

        if (evento.id_quedada) fetchUsuarios();
    }, [evento.id_quedada]);

    useEffect(() => {
        if (tipoPago === 'Equitativo' && cantidad && users.length > 0) {
            const cantidadFloat = parseFloat(cantidad);
            const cantidadPorUsuario = (cantidadFloat / users.length).toFixed(2);
            const updatedUsers = users.map(user => ({
                ...user,
                cantidad: cantidadPorUsuario
            }));
            setUsers(updatedUsers);
        }
    }, [tipoPago, cantidad, users.length]);

    const onChangeFecha = (event, selectedDate) => {
        if (selectedDate) setFecha(selectedDate);
        setShowDatePicker(false);
    };

    const handleCantidadChange = (index, text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const updatedUsers = [...users];
        updatedUsers[index].cantidad = numericText;
        setUsers(updatedUsers);
    };
    const formatDateTime = (date, time) => {
        const d = new Date(date);
        d.setHours(time.getHours(), time.getMinutes(), 0, 0);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    };

    const handleGuardarCambios = () => {
        const eventoData = {
            id_evento: evento.id_evento,
            nombre_evento: nombreEvento,
            descripcion_evento: descripcion,
            fecha_hora_evento: formatDateTime(fecha, startTime),
            lugar_evento: lugar,
            mostrar_pagos: pagos,
            completado: false,
        };

        if (pagos) {
            const pagos_usuario = users.map(user => ({
                usuario: user.id,
                cantidad: user.cantidad || '0'
            }));

            if (tipoPago === 'Repartir') {
                const suma = pagos_usuario.reduce((acc, u) => acc + parseFloat(u.cantidad || 0), 0);
                if (suma > parseFloat(cantidad)) {
                    alert("La suma de las cantidades por usuario supera el total indicado.");
                    return;
                }
            }

            eventoData.cantidad_total = cantidad;
            eventoData.tipo_pago = tipoPago;
            eventoData.pagos_usuario = pagos_usuario;
        }

        fetch(`http://${Globals.ip}:3080/api/editEvent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventoData),
        })
            .then(res => res.json())
            .then(data => {
                onClose();
                location.reload();
            })
            .catch(err => {
                console.error("Error editando evento:", err);
                ToastAndroid.show("❌ Error de red", ToastAndroid.LONG);
            });
    };


    return (

        <ScrollView className="p-6 bg-white rounded-2xl shadow-md w-full max-w-xl mx-auto">
            <Text className="text-2xl font-bold text-center mb-6">Editar Evento</Text>

            <Text className="text-base font-medium mb-1">Nombre del Evento</Text>
            <TextInput
                className="bg-gray-100 p-3 rounded-lg mb-4"
                value={nombreEvento}
                onChangeText={setNombreEvento}
                placeholder="Introduce un nombre para el evento"
            />

            {/* Fecha */}
            {Platform.OS === 'android' && (
                <TouchableOpacity className="bg-blue-100 py-2 px-4 rounded-lg mb-4" onPress={() => setShowDatePicker(true)}>
                    <Text className="text-blue-800 text-center">Selecciona fecha</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.text}>Fecha y hora de inicio</Text>

            {Platform.OS === 'android' ? (
                <>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Hora de inicio</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                        value={startTime}
                        mode="time"
                        display="default"
                        is24Hour={true}
                        locale="es-ES"
                        onChange={onChangeStartTime}
                    />
                </>
            ) : (
                <View className="w-full max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-md space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Hora de Inicio:</label>
                        <input
                            type="time"
                            value={startTime.toLocaleTimeString('it-IT').slice(0, 5)}
                            onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':');
                                const newTime = new Date(startTime);
                                newTime.setHours(hours, minutes);
                                setStartTime(newTime);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#297169]"
                        />
                    </div>
                </View>

            )}

            {Platform.OS === 'web' ? (
                <input
                    type="date"
                    value={fecha.toISOString().split('T')[0]}
                    onChange={(e) => setFecha(new Date(e.target.value))}
                    className="bg-gray-100 p-3 rounded-lg mb-4 w-full"
                />
            ) : showDatePicker || Platform.OS === 'ios' ? (
                <DateTimePicker
                    value={fecha}
                    mode="date"
                    display="default"
                    onChange={onChangeFecha}
                />
            ) : null}

            <TextInput
                className="bg-gray-100 p-3 rounded-lg mb-4"
                value={lugar}
                onChangeText={setLugar}
                placeholder="Lugar"
            />

            <View className="flex flex-row items-center justify-between mb-4">
                <Text className="text-base font-medium">Pagos</Text>
                <Switch value={pagos} onValueChange={setPagos} />
            </View>

            {pagos && (
                <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                    <Text className="font-medium mb-1">Cantidad total:</Text>
                    <TextInput
                        className="bg-white p-3 rounded-lg mb-4"
                        keyboardType="numeric"
                        placeholder="Ingrese cantidad"
                        value={cantidad}
                        onChangeText={(text) => setCantidad(text.replace(/[^0-9]/g, ''))}
                    />

                    <Text className="font-medium mb-1">Tipo de pago</Text>
                    <Picker
                        selectedValue={tipoPago}
                        onValueChange={setTipoPago}
                        className="bg-white mb-4"
                    >
                        <Picker.Item label="Equitativo" value="Equitativo" />
                        <Picker.Item label="Repartir" value="Repartir" />
                    </Picker>

                    <Text className="font-medium mb-2">Usuarios y cantidades:</Text>
                    {users.map((user, index) => (
                        <View key={user.id} className="flex flex-row items-center justify-between mb-2">
                            <Text className="flex-1">{user.nombre}</Text>
                            <TextInput
                                className="bg-white p-2 rounded-lg w-24"
                                keyboardType="numeric"
                                value={user.cantidad}
                                editable={tipoPago === 'Repartir'}
                                onChangeText={(text) => handleCantidadChange(index, text)}
                            />
                        </View>
                    ))}
                </View>
            )}

            <Text className="text-base font-medium mb-1">Descripción</Text>
            <TextInput
                className="bg-gray-100 p-3 rounded-lg mb-6 h-28 text-start"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                placeholder="Agrega una descripción"
            />

            <View className="flex flex-row justify-between">
                <TouchableOpacity className="bg-gray-300 py-2 px-4 rounded-lg" onPress={onClose}>
                    <Text className="text-gray-800 font-medium">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-green-600 py-2 px-4 rounded-lg" onPress={handleGuardarCambios}>
                    <Text className="text-white font-medium">Guardar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    );

};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, padding: 8, marginVertical: 5, borderRadius: 5 },
    inputLarge: { borderWidth: 1, padding: 8, marginVertical: 5, height: 80, borderRadius: 5 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    pagosContainer: { borderWidth: 1, padding: 15, marginVertical: 10, borderRadius: 5 },
    usuarioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 },
    inputCantidad: { borderWidth: 1, padding: 8, borderRadius: 5, flex: 1, marginLeft: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { borderWidth: 1, padding: 10, borderRadius: 5, flex: 1, alignItems: 'center', marginHorizontal: 5 },
    webDatePicker: { borderWidth: 1, padding: 8, marginVertical: 5, borderRadius: 5, width: '100%' },
});

export default EditarEvento;
