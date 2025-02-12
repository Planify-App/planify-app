import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Feather } from '@expo/vector-icons';

export default function CrearQuedada() {
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());

    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().setHours(23, 59)));
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [isMultiDay, setIsMultiDay] = useState(false);


    const onChangeStartDate = (date) => {
        if (date) {
            setStartDate(date);
            updateStartText(date, startTime);
        }
    };

    const onChangeStartTime = (time) => {
        if (time) {
            setStartTime(time);
            updateStartText(startDate, time);
        }
    };

    const onChangeEndDate = (date) => {
        if (date) {
            setEndDate(date);
            updateEndText(date, endTime);
        }
    };

    const onChangeEndTime = (time) => {
        if (time) {
            setEndTime(time);
            updateEndText(endDate, time);
        }
    };

    const updateStartText = (selectedDate, selectedTime) => {
        let formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
        let formattedTime = `Horas: ${selectedTime.getHours()} | Minutos: ${selectedTime.getMinutes()}`;
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
            <Text style={styles.text}>¿Más de un día?</Text>
            <TouchableOpacity style={styles.checkboxContainer} onPress={handleBoxPress}>
                <Text style={styles.checkboxLabel}>Marcar opción</Text>
                {isMultiDay ? (
                    <Feather name="check-circle" size={24} color="green" />
                ) : (
                    <Feather name="circle" size={24} color="gray" />
                )}
            </TouchableOpacity>

            <Text style={styles.text}>Fecha y hora de inicio</Text>

            <>
                <TouchableOpacity style={styles.button} onPress={() => setShowStartDatePicker(true)}>
                    <Text style={styles.buttonText}>Fecha de inicio</Text>
                </TouchableOpacity>

                {showStartDatePicker && (
                    <DatePicker
                        selected={startDate}
                        onChange={onChangeStartDate}
                        dateFormat="dd/MM/yyyy"
                    />
                )}

                <TouchableOpacity style={styles.button} onPress={() => setShowStartTimePicker(true)}>
                    <Text style={styles.buttonText}>Hora de Inicio</Text>
                </TouchableOpacity>

                {showStartTimePicker && (
                    <DatePicker
                        selected={startTime}
                        onChange={onChangeStartTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeFormat="HH:mm"
                        timeIntervals={15}
                    />
                )}
            </>

            {isMultiDay && (
                <>
                    <Text style={styles.text}>Fecha y hora de finalización</Text>

                    <>
                        <TouchableOpacity style={styles.button} onPress={() => setShowEndDatePicker(true)}>
                            <Text style={styles.buttonText}>Fecha de finalización</Text>
                        </TouchableOpacity>

                        {showEndDatePicker && (
                            <DatePicker
                                selected={endDate}
                                onChange={onChangeEndDate}
                                dateFormat="dd/MM/yyyy"
                            />
                        )}

                        <TouchableOpacity style={styles.button} onPress={() => setShowEndTimePicker(true)}>
                            <Text style={styles.buttonText}>Hora de finalización</Text>
                        </TouchableOpacity>

                        {showEndTimePicker && (
                            <DatePicker
                                selected={endTime}
                                onChange={onChangeEndTime}
                                showTimeSelect
                                showTimeSelectOnly
                                timeFormat="HH:mm"
                                timeIntervals={15}
                            />
                        )}
                        <Text style={styles.text}>Hora de finalización: {endTimeString}</Text>

                    </>
                </>
            )}
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
});
