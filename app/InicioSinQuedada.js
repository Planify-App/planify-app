// instalar navigation
// npm install @react-navigation/native
// npm install react-native-screens react-native-safe-area-context
// npm install @react-navigation/stack
import React from "react";
import {View, Text, StyleSheet, Button} from "react-native";


export function InicioSinQuedada({ navigation }){
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Biene benido a planify</Text>
            <Text style={styles.title}>Organiza i crear nuevas experiencias</Text>
            <Button title={"Crear Quedada"} />
            <Button title={"Unirse a una Quedadas"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        color: 'black',
    },
});