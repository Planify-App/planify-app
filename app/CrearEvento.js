import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Platform, ToastAndroid} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Globals from "./globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as navigation from "expo-router/build/global-state/routing";

const CrearEvento = ({ idQuedada }) => {
    const [pagos, setPagos] = useState(false);
    const [tipoPago, setTipoPago] = useState('Equitativo');
    const [descripcion, setDescripcion] = useState('');
    const [nombreEvento, setNombreEvento] = useState('');
    const [lugar, setLugar] = useState('');
    const [users, setUsers] = useState([]);
    const [fecha, setFecha] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cantidad, setCantidad] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUserSession = async () => {
            try {
                let session;
                session = await AsyncStorage.getItem("userSession");

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
                const response = await fetch(`http://${Globals.ip}:3080/api/getUsersFromHangout/${idQuedada}`);
                const data = await response.json();

                const formattedUsers = data
                    .filter(u => u.usuario) // filtrar nulos
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

        if (idQuedada) fetchUsuarios();
    }, [idQuedada]);

    useEffect(() => {
        if (tipoPago === 'Equitativo' && cantidad && users.length > 0) {
            const cantidadFloat = parseFloat(cantidad);
            const cantidadPorUsuario = (cantidadFloat / users.length).toFixed(2);
            const usersActualizados = users.map(user => ({
                ...user,
                cantidad: cantidadPorUsuario
            }));
            setUsers(usersActualizados);
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
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const handleGuardarEvento = () => {
        const eventoData = {
            id_quedada: idQuedada,
            nombre_evento: nombreEvento,
            descripcion_evento: descripcion,
            fecha_hora_evento: formatDate(fecha).toString(),
            lugar_evento: lugar,
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

            eventoData.mostrar_pagos = true;
            eventoData.precio_total = cantidad;
            eventoData.tipo_pago = tipoPago;
            eventoData.pagos_usuario = pagos_usuario;
        }

        fetch(`http://${Globals.ip}:3080/api/createEvent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventoData),
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al guardar el evento');
                return response.json();
            })
            .then(
                window.location.reload()
            )
            .catch(err => {
                console.error('Error al guardar el evento:', err);
                ToastAndroid.show("❌ Error al guardar el evento", ToastAndroid.LONG);
            });
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Evento</Text>

            <Text>Nombre Evento</Text>
            <TextInput style={styles.input} onChangeText={setNombreEvento}
                       placeholder="Introduce un nombre para el evento"/>

            {Platform.OS === 'android' && (
                <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                    <Text>Selecciona fecha</Text>
                </TouchableOpacity>
            )}
            {Platform.OS === 'web' ? (
                <input
                    type="date"
                    value={fecha.toISOString().split('T')[0]}
                    onChange={(e) => setFecha(new Date(e.target.value))}
                    style={styles.webDatePicker}
                />
            ) : showDatePicker || Platform.OS === 'ios' ? (
                <DateTimePicker
                    value={fecha}
                    mode="date"
                    display={Platform.OS === 'ios' ? "inline" : "default"}
                    onChange={onChangeFecha}
                />
            ) : null}

            {Platform.OS !== 'web' && (
                <View style={styles.fechaContainer}>
                    <Text style={styles.fechaTexto}>{fecha.toLocaleDateString('es-ES', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}</Text>
                </View>
            )}

            <TextInput style={styles.input} onChangeText={setLugar} placeholder="Lugar"/>

            <View style={styles.switchContainer}>
                <Switch value={pagos} onValueChange={setPagos}/>
                <Text>Pagos</Text>
            </View>

            {pagos && (
                <View style={styles.pagosContainer}>
                    <Text>Cantidad total:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Ingrese cantidad"
                        value={cantidad}
                        onChangeText={(text) => setCantidad(text.replace(/[^0-9]/g, ''))}
                    />

                    <Text>Tipo de pago</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={tipoPago}
                        onValueChange={(itemValue) => setTipoPago(itemValue)}>
                        <Picker.Item label="Equitativo" value="Equitativo"/>
                        <Picker.Item label="Repartir" value="Repartir"/>
                    </Picker>

                    <Text>Usuarios y cantidades:</Text>
                    {users.map((user, index) => (
                        <View key={user.id} style={styles.usuarioRow}>
                            <Text style={styles.usuarioNombre}>{user.nombre}</Text>
                            <TextInput
                                style={styles.inputCantidad}
                                keyboardType="numeric"
                                placeholder="Cantidad"
                                value={user.cantidad}
                                editable={tipoPago === 'Repartir' && cantidad !== ''}
                                onChangeText={(text) => handleCantidadChange(index, text)}
                            />
                        </View>
                    ))}

                    <Text style={styles.note}>
                        Lo que falte de dinero se repartirá entre los usuarios que no están equitativamente.
                    </Text>
                </View>
            )}

            <Text>Descripción:</Text>
            <TextInput
                style={styles.inputLarge}
                multiline
                onChangeText={setDescripcion}
                placeholder="Agrega una descripción"
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}><Text>Cancelar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleGuardarEvento}>
                    <Text>Guardar</Text>
                </TouchableOpacity>
            </View>
        </View>
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
    usuarioNombre: { fontSize: 16, fontWeight: 'bold', flex: 1 },
    inputCantidad: { borderWidth: 1, padding: 8, borderRadius: 5, flex: 1 },
    note: { fontSize: 12, color: 'gray', marginTop: 5 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { borderWidth: 1, padding: 10, alignItems: 'center', flex: 1, marginHorizontal: 5, borderRadius: 5 },
    picker: { width: '100%', marginVertical: 10 },
    fechaContainer: { borderWidth: 1, padding: 15, marginVertical: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
    fechaTexto: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    webDatePicker: { borderWidth: 1, padding: 8, marginVertical: 5, borderRadius: 5, width: '100%' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    textProximoEvento: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default CrearEvento;
