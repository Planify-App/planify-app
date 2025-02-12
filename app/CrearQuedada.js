import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons'; // Necesitas instalar @expo/vector-icons si aún no lo tienes

export default function CrearQuedada() {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [text, setText] = useState('Selecciona fecha y hora');

    const rotateAnim = useState(new Animated.Value(0))[0]; // Animación para la flecha

    const onChangeDate = (event, selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
            updateText(selectedDate, time);
        }
    };

    const onChangeTime = (event, selectedTime) => {
        if (selectedTime) {
            setTime(selectedTime);
            updateText(date, selectedTime);
        }
    };

    const updateText = (selectedDate, selectedTime) => {
        let formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
        let formattedTime = `Horas: ${selectedTime.getHours()} | Minutos: ${selectedTime.getMinutes()}`;
        setText(`${formattedDate}\n${formattedTime}`);
    };

    const togglePicker = () => {
        setShowPicker(!showPicker);
        Animated.timing(rotateAnim, {
            toValue: showPicker ? 0 : 1, // Rotación de la flecha
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>

            <TouchableOpacity style={styles.button} onPress={togglePicker}>
                <Text style={styles.buttonText}>Fecha y hora de inicio</Text>
                <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <AntDesign name="down" size={20} color="white" />
                </Animated.View>
            </TouchableOpacity>

            {showPicker && (
                <View style={styles.pickerContainer}>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        locale="es-ES"
                        onChange={onChangeDate}
                    />
                    <DateTimePicker
                        value={time}
                        mode="time"
                        locale="es-ES"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeTime}
                    />
                </View>
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
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-between",
        width: 220,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        marginRight: 10,
    },
    pickerContainer: {
        marginTop: 10,
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 10,
    },
});
