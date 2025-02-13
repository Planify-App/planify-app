import React, { useState } from "react";
import {Platform, StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/native";

export default function CrearQuedada() {
    const navigation = useNavigation();

    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());

    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().setHours(23, 59))); // Hora 23:59 por defecto

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [isMultiDay, setIsMultiDay] = useState(false); // Estado de la casilla de "más de un día"

    const [startText, setStartText] = useState('Selecciona fecha y hora de inicio');
    const [endText, setEndText] = useState(`Selecciona fecha y hora de finalización ${endTime}`);

    const [campoNombreQuedada, nombreQuedada] = useState('');
    const [campoDescripcion, descripcion] = useState('');

    const onChangeStartDate = (event, selectedDate) => {
        if (selectedDate) {
            setStartDate(selectedDate);
            updateStartText(selectedDate, startTime);
            if (Platform.OS === 'android') {
                setShowStartDatePicker(false);
            }
        }
    };

    const onChangeStartTime = (event, selectedTime) => {
        if (selectedTime) {
            setStartTime(selectedTime);
            updateStartText(startDate, selectedTime);
            if (Platform.OS === 'android') {
                setShowStartTimePicker(false);
            }
        }
    };

    const onChangeEndDate = (event, selectedDate) => {
        if (selectedDate) {
            setEndDate(selectedDate);
            updateEndText(selectedDate, endTime);
            if (Platform.OS === 'android') {
                setShowEndDatePicker(false);
            }
        }
    };

    const onChangeEndTime = (event, selectedTime) => {
        if (selectedTime) {
            setEndTime(selectedTime);
            updateEndText(endDate, selectedTime);
            if (Platform.OS === 'android') {
                setShowEndTimePicker(false);
            }
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
            setEndTime(new Date(startDate.setHours(23, 59))); // Hora 23:59
        }
    };

    const endTimeString = `${endTime.getHours()}:${endTime.getMinutes() < 10 ? '0' : ''}${endTime.getMinutes()}`;

    return (
        <View style={styles.container}>

            <Text className="mt-2 font-bold">Nombre de la quedada:</Text>
            <TextInput
                className="w-72 lg:w-full bg-white/60"
                style={styles.input}
                value={campoNombreQuedada}
                onChangeText={nombreQuedada}
            />

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
                        />
                    )}

                    <TouchableOpacity style={styles.button} onPress={() => setShowStartTimePicker(true)}>
                        <Text style={styles.buttonText}>Hora de Inicio</Text>
                    </TouchableOpacity>

                    {showStartTimePicker && (
                        <DateTimePicker
                            value={startTime}
                            mode="time"
                            locale="es-ES"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeStartTime}
                        />
                    )}
                </>
            ) : (
                <>
                    <View style={styles.pickerContainer}>
                        <View style={styles.dateRow}>
                            <Text style={styles.pickerLabel}>Fecha de Inicio:</Text>
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                locale="es-ES"
                                onChange={onChangeStartDate}
                            />
                        </View>

                        <View style={styles.dateRow}>
                            <Text style={styles.pickerLabel}>Hora de Inicio:</Text>
                            <DateTimePicker
                                value={startTime}
                                mode="time"
                                locale="es-ES"
                                is24Hour={true}
                                display="default"
                                onChange={onChangeStartTime}
                            />
                        </View>
                    </View>
                </>
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
                                />
                            )}

                            <TouchableOpacity style={styles.button} onPress={() => setShowEndTimePicker(true)}>
                                <Text style={styles.buttonText}>Hora de finalización</Text>
                            </TouchableOpacity>

                            {showEndTimePicker && (
                                <DateTimePicker
                                    value={endTime}
                                    mode="time"
                                    locale="es-ES"
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeEndTime}
                                />
                            )}
                        </>

                    ) : (
                        <>
                            <View style={styles.pickerContainer}>
                                <View style={styles.dateRow}>
                                    <Text style={styles.pickerLabel}>Fecha de Finalización:</Text>
                                    <DateTimePicker
                                        value={endDate}
                                        minimumDate={startDate}
                                        mode="date"
                                        display="default"
                                        locale="es-ES"
                                        onChange={onChangeEndDate}
                                    />
                                </View>

                                <View style={styles.dateRow}>
                                    <Text style={styles.pickerLabel}>Hora de Finalización:</Text>
                                    <DateTimePicker
                                        value={endTime}
                                        mode="time"
                                        locale="es-ES"
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeEndTime}
                                    />
                                </View>
                            </View>

                        </>
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

            <TouchableOpacity style={styles.accept_button}>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        width: 220,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    checkboxLabel: {
        fontSize: 18,
        marginRight: 10,
    },
    pickerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    pickerLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginVertical: 5,
        backgroundColor: '#fff',
    },
    desc_input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginTop: 4,
        backgroundColor: '#fff',
    },
    accept_button:{
        flexDirection: "row",
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        width: 220,
    },
    cancel_button:{
        flexDirection: "row",
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        width: 150,
    },
});
