import * as React from 'react';
import { StyleSheet, View, Text, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Logo from "./Logo";

export default function MenuNoLog() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Logo size="w-60 h-60 mb-5 md:w-72 md:h-72" color="#297169" />
            <Text style={styles.text}>Bienvenido a Planify</Text>
            <Text style={styles.text}>Organiza y crea nuevas experiencias</Text>


            <View className="flex gap-y-4 justify-center items-center">
                <Button
                    title="Iniciar Sesión"
                    onPress={() => navigation.navigate('Login')}
                />
                <Button
                    title="Registrarse"
                    onPress={() => navigation.navigate('Register')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: "bold",
    }
});
