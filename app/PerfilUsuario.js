import { Text, Alert, Button, TextInput, StyleSheet } from 'react-native';
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Logo from "./Logo";

export default function PerfilUsuario() {
    const [campoCorreo, setCorreo] = useState('');
    const [campoNombre, setNombre] = useState('');
    const [campoApellido, setApellido] = useState('');
    const [campoUsuario, setUsuario] = useState('');
    const [campoContra, setContra] = useState('');
    const [campoRepContra, setRepContra] = useState('');

    return (
        <>
            <Logo size="w-40 h-40" color="#297169" />
            <StatusBar style="auto" />


            <TextInput
                className="min-w-60"
                style={styles.input}
                placeholder="NOMBRE USUARIO"
                value={campoUsuario}
                onChangeText={setUsuario}
            />

            <Text>Correo electrónico</Text>
            <TextInput
                className="min-w-60"
                style={styles.input}
                placeholder="Correo electrónico"
                value={campoCorreo}
                onChangeText={setCorreo}
            />

            <Text>Nombre</Text>
            <TextInput
                className="min-w-60"
                style={styles.input}
                placeholder="Nombre"
                value={campoNombre}
                onChangeText={setNombre}
            />

            <Text>Apellido</Text>
            <TextInput
                className="min-w-60"
                style={styles.input}
                placeholder="Apellido"
                value={campoApellido}
                onChangeText={setApellido}
            />

            <Text>Contraseña</Text>

            <TextInput
                className="min-w-60"
                style={styles.input}
                placeholder="Contraseña"
                value={campoContra}
                onChangeText={setContra}
            />
            <Text>Número de teléfono</Text>

            <TextInput
                className="min-w-60"
                style={styles.input}
                placeholder="Número de teléfono"
                value={campoContra}
                onChangeText={setContra}
            />

            <Text>Alérgenos (Opcional)</Text>
            <TextInput
                className="min-w-60"
                style={styles.input}
                placeholder="Alérgenos"
                value={campoRepContra}
                onChangeText={setRepContra}
            />
            <Button title="Guardar" />
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,

        borderRadius: 4,
        paddingHorizontal: 8,
        marginTop: 12,
        marginBottom: 12,
    },
    enlace: {
        color: "#0000FF",
    },
});
