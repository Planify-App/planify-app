import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Switch, StyleSheet,
    Platform, ToastAndroid
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

    const navigation = useNavigation();

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
            fecha_hora_evento: formatDate(fecha),
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

            eventoData.precio_total = cantidad;
            eventoData.tipo_pago = tipoPago;
            eventoData.pagos_usuario = pagos_usuario;
        }

        fetch(`http://${Globals.ip}:3080/api/editEvent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventoData),
        })
            .then(res => res.json())
            .catch(err => {
                console.error("Error editando evento:", err);
                ToastAndroid.show("❌ Error de red", ToastAndroid.LONG);
            });
    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>Editar Evento</Text>
            <Text>Nombre Evento</Text>
            <TextInput style={styles.input} value={nombreEvento} onChangeText={setNombreEvento} />

            {/* Fecha */}
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
                <DateTimePicker value={fecha} mode="date" display="default" onChange={onChangeFecha} />
            ) : null}

            <TextInput style={styles.input} value={lugar} onChangeText={setLugar} placeholder="Lugar" />

            <View style={styles.switchContainer}>
                <Switch value={pagos} onValueChange={setPagos} />
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
                    <Picker selectedValue={tipoPago} onValueChange={setTipoPago}>
                        <Picker.Item label="Equitativo" value="Equitativo" />
                        <Picker.Item label="Repartir" value="Repartir" />
                    </Picker>

                    {users.map((user, index) => (
                        <View key={user.id} style={styles.usuarioRow}>
                            <Text>{user.nombre}</Text>
                            <TextInput
                                style={styles.inputCantidad}
                                keyboardType="numeric"
                                value={user.cantidad}
                                editable={tipoPago === 'Repartir'}
                                onChangeText={(text) => handleCantidadChange(index, text)}
                            />
                        </View>
                    ))}
                </View>
            )}

            <Text>Descripción</Text>
            <TextInput style={styles.inputLarge} value={descripcion} onChangeText={setDescripcion} multiline />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onClose}><Text>Cancelar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleGuardarCambios}><Text>Guardar</Text></TouchableOpacity>

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
    inputCantidad: { borderWidth: 1, padding: 8, borderRadius: 5, flex: 1, marginLeft: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { borderWidth: 1, padding: 10, borderRadius: 5, flex: 1, alignItems: 'center', marginHorizontal: 5 },
    webDatePicker: { borderWidth: 1, padding: 8, marginVertical: 5, borderRadius: 5, width: '100%' },
});

export default EditarEvento;
