import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Globals from "./globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useRootNavigationState } from "expo-router";

export default function CrearQuedada() {
    const navigation = useNavigation();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());

    // Establecer fecha de finalización con un día después de la fecha de inicio
    // ✅ CAMBIO: asegúrate que por defecto `endDate` sea un día después de hoy
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
    });

// ✅ CAMBIO: también por defecto, setear hora final
    const [endTime, setEndTime] = useState(() => {
        const t = new Date();
        t.setHours(23, 59, 0, 0);
        return t;
    });
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [isMultiDay, setIsMultiDay] = useState(false); // Estado de la casilla de "más de un día"

    const [startText, setStartText] = useState('Selecciona fecha y hora de inicio');
    const [endText, setEndText] = useState(`Selecciona fecha y hora de finalización ${endTime}`);

    const [campoNombreQuedada, nombreQuedada] = useState('');
    const [campoDescripcion, descripcion] = useState('');

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

    const showAlert = (title, message) => {
        if (Platform.OS === 'web') {
            // En web usamos el alert nativo del navegador
            window.alert(`${title}\n\n${message}`);
        } else {
            // En móvil usamos el componente Alert de React Native
            Alert.alert(title, message);
        }
    };

    const onChangeStartDate = (event, selectedDate) => {
        if (event?.type === "dismissed") {
            setShowStartDatePicker(false);
            return;
        }

        if (selectedDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // ✅ CAMBIO: para comparar solo fecha
            const selected = new Date(selectedDate);
            selected.setHours(0, 0, 0, 0);

            if (selected < today) {
                Alert.alert("Fecha inválida", "No puedes seleccionar una fecha anterior a hoy.");
                return;
            }

            setStartDate(selectedDate);

            // ✅ CAMBIO: endDate ahora es un día después del startDate
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setEndDate(nextDay);
            setEndTime(new Date(nextDay.setHours(23, 59)));

            updateStartText(selectedDate, startTime);
            if (Platform.OS === 'android') {
                setShowStartDatePicker(false);
            }
        }
    };

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

    const onChangeEndDate = (event, selectedDate) => {
        if (!selectedDate) {
            return;
        }

        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (selected <= start) {
            Alert.alert("Fecha inválida", "La fecha de finalización debe ser posterior a la de inicio.");
            return;
        }

        setEndDate(selectedDate);
        updateEndText(selectedDate, endTime);
        if (Platform.OS === 'android') {
            setShowEndDatePicker(false);
        }
    };

    const onChangeEndTime = (event, selectedTime) => {
        if (!selectedTime) return;

        const start = new Date(startDate);
        start.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

        const end = new Date(endDate);
        end.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

        if (end <= start) {
            Alert.alert("Hora inválida", "La hora de finalización debe ser posterior a la de inicio.");
            return;
        }

        setEndTime(selectedTime);
        updateEndText(endDate, selectedTime);
        if (Platform.OS === 'android') {
            setShowEndTimePicker(false);
        }
    };



    const updateStartText = (selectedDate, selectedTime) => {
        let formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
        let formattedTime = `Horas: ${selectedTime.getHours()} | Minutos: ${selectedTime.getMinutes()}`;
        setStartText(`${formattedDate}\n${formattedTime}`);
    };

    const updateEndText = (selectedDate, selectedTime) => {
        let formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
        let formattedTime = `Horas: ${selectedTime.getHours()} | Minutos: ${selectedTime.getMinutes()}`;
        setEndText(`${formattedDate}\n${formattedTime}`);
    };

    const handleBoxPress = () => {
        setIsMultiDay(!isMultiDay);

        if (!isMultiDay) {
            setEndDate(startDate);
            setEndTime(new Date(startDate.setHours(23, 59)));
        }
    };

    const handleSave = async () => {
        if (campoNombreQuedada === "") {
            showAlert("Error", "El nombre de la quedada no puede estar vacío.");
            return;
        }
        const data = {
            userID: userId,
            nombre_quedada: campoNombreQuedada,
            descripcion_quedada: campoDescripcion,
            fecha_hora_inicio: formatDateTime(startDate, startTime),
            mas_de_un_dia: isMultiDay,
            fecha_hora_final: formatDateTime(endDate, endTime),
            link_imagen: null,
            mostrar_proximos_eventos: true,
            mostrar_asistentes: true,
            mostrar_tickets: true,
        };

        console.log(data);
        try {
            const response = await fetch(`http://${Globals.ip}:3080/api/createHangout`, {
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
            router.replace('/InicioQuedadas');

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        }
    };

    const formatDateTime = (date, time) => {
        const d = new Date(date);
        d.setHours(time.getHours(), time.getMinutes(), 0, 0);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    };

    return (
        <View className="w-full min-h-screen lg:min-h-screen bg-[#DBF3EF] pb-10 flex justify-center items-center flex-col">
            <Text className="mt-2 font-bold">Nombre de la quedada:</Text>
            <TextInput
                className="w-72 lg:w-full bg-white/60"
                style={styles.input}
                value={campoNombreQuedada}
                onChangeText={nombreQuedada}
            />
            <StatusBar style="auto" />

            <Text style={styles.text}>¿Más de un día?</Text>
            <TouchableOpacity style={styles.checkboxContainer} onPress={handleBoxPress}>
                {isMultiDay ? (
                    <Feather name="check-circle" size={24} color="green" />
                ) : (
                    <Feather name="circle" size={24} color="gray" />
                )}
            </TouchableOpacity>

            <Text style={styles.text}>Fecha y hora de inicio</Text>

            {Platform.OS === 'android' ? (
                <>
                    <TouchableOpacity style={styles.button} onPress={() => setShowStartDatePicker(true)}>
                        <Text style={styles.buttonText}>Fecha de inicio</Text>
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

                    <TouchableOpacity style={styles.button} onPress={() => setShowStartTimePicker(true)}>
                        <Text style={styles.buttonText}>Hora de inicio</Text>
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
                // Web version
                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Fecha de Inicio:</Text>
                    <input
                        type="date"
                        value={startDate.toISOString().split('T')[0]}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            setStartDate(newDate);
                        }}
                        style={styles.webInput}
                    />

                    <Text style={styles.pickerLabel}>Hora de Inicio:</Text>
                    <input
                        type="time"
                        value={startTime.toLocaleTimeString('it-IT').slice(0, 5)}
                        onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newTime = new Date(startTime);
                            newTime.setHours(hours, minutes);
                            setStartTime(newTime);
                        }}
                        style={styles.webInput}
                    />
                </View>
            )}

            {isMultiDay && (
                <>
                    <Text style={styles.text}>Fecha y hora de finalización</Text>

                    {Platform.OS === 'android' ? (
                        <>
                            <TouchableOpacity style={styles.button} onPress={() => setShowEndDatePicker(true)}>
                                <Text style={styles.buttonText}>Fecha de finalización</Text>
                            </TouchableOpacity>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    locale="es-ES"
                                    onChange={onChangeEndDate}
                                    minimumDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
                                />
                            )}

                            <TouchableOpacity style={styles.button} onPress={() => setShowEndTimePicker(true)}>
                                <Text style={styles.buttonText}>Hora de finalización</Text>
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
                        // Web version
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Fecha de Finalización:</Text>
                            <input
                                type="date"
                                value={new Date(endDate.getTime() + 86400000).toISOString().split('T')[0]}
                                min={new Date(endDate.getTime() + 86400000).toISOString().split('T')[0]}
                                onChange={(e) => {
                                    const newDate = new Date(e.target.value);
                                    if (newDate <= startDate) {
                                        alert("La fecha final debe ser posterior a la inicial.");
                                        return;
                                    }
                                    setEndDate(newDate);
                                }}
                                style={styles.webInput}
                            />

                            <Text style={styles.pickerLabel}>Hora de Finalización:</Text>
                            <input
                                type="time"
                                value={endTime.toLocaleTimeString('it-IT').slice(0, 5)}
                                onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const end = new Date(endDate);
                                    end.setHours(hours, minutes);

                                    const start = new Date(startDate);
                                    start.setHours(startTime.getHours(), startTime.getMinutes());

                                    if (end <= start) {
                                        alert("La hora final debe ser posterior a la inicial.");
                                        return;
                                    }

                                    const updated = new Date(endTime);
                                    updated.setHours(hours, minutes);
                                    setEndTime(updated);
                                }}
                                style={styles.webInput}
                            />
                        </View>
                    )}
                </>
            )}


            <Text className="mt-2 font-bold">Descripción:</Text>
            <TextInput
                className="w-72 lg:w-full bg-white/60"
                style={styles.desc_input}
                value={campoDescripcion}
                onChangeText={descripcion}
            />

            <TouchableOpacity style={styles.accept_button} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancel_button} onPress={() => navigation.navigate('MenuNoLog')}>
                <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: '#111827',
    },
    input: {
        width: '100%',
        maxWidth: 400,
        height: 45,
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        fontSize: 16,
        marginBottom: 16,
    },
    desc_input: {
        width: '100%',
        maxWidth: 400,
        height: 100,
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 8,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerContainer: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#374151',
    },
    webInput: {
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#fff',
        marginBottom: 16,
        fontSize: 16,
    },
    accept_button: {
        backgroundColor: '#16a34a',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    cancel_button: {
        backgroundColor: '#dc2626',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
});

