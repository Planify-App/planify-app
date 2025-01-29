import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import { Link } from "expo-router";

export default function MenuNoLog() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido a Planify</Text>
            <Text style={styles.text}>Organiza y crea nuevas experiencias</Text>

            <Link href="/Login" style={styles.enlace}>
                <Button
                    style={styles.button} title={"Iniciar Sesión"}>
                </Button>
            </Link>

            <Link href="/Register" style={styles.enlace}>
                <Button
                    style={styles.button} title={"Registrarse"}>
                </Button>
            </Link>
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
    },
    enlace: {
        marginTop: 20,
    },
    button: {
        backgroundColor: "#0069dd",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold",

    },
});
