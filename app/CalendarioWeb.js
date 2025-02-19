import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

export default class CalendarioWeb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
            selectedEndDate: null,
            selectedTime: "",
        };
        this.onDateChange = this.onDateChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
    }

    onDateChange(date, type) {
        if (type === "END_DATE") {
            this.setState({
                selectedEndDate: date,
            });
        } else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }

    onTimeChange(time) {
        this.setState({ selectedTime: time });
    }

    render() {
        const { selectedStartDate, selectedEndDate, selectedTime } = this.state;
        const minDate = new Date(); // Hoy
        const maxDate = new Date(minDate.getFullYear() + 1, 11, 31);

        const startDate = selectedStartDate ? selectedStartDate.toString() : "";
        const endDate = selectedEndDate ? selectedEndDate.toString() : "";

        return (
            <View style={styles.container}>
                <View style={styles.calendario}>
                    <CalendarPicker
                        startFromMonday={true}
                        allowRangeSelection={true}
                        minDate={minDate}
                        maxDate={maxDate}
                        weekdays={["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"]}
                        months={["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]}
                        previousTitle="Anterior"
                        nextTitle="Próximo"
                        todayBackgroundColor="#e6ffe6"
                        selectedDayColor="#e6ffe6"
                        selectedDayTextColor="#000000"
                        scaleFactor={500}
                        textStyle={{
                            fontFamily: "Cochin",
                            color: "#000000",
                        }}
                        onDateChange={this.onDateChange}
                    />

                    <View>
                        <Text>SELECTED START DATE: {startDate}</Text>
                        <Text>SELECTED END DATE: {endDate}</Text>
                    </View>
                </View>

                <View style={styles.timePickerContainer}>
                    <Text>Start time:</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={styles.timeInput}
                        onChangeText={this.onTimeChange}
                        value={selectedTime}
                        placeholder="HH:MM"
                    />
                    <Text>Value of the time input: "{selectedTime}"</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        marginTop: 100,
        alignItems: "center",
    },
    calendario: {
        width: 400,
    },
    timePickerContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    timeInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        marginTop: 10,
        width: 100,
        textAlign: "center",
    },
});
