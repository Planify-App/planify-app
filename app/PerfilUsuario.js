import { Text, Button, TextInput, StyleSheet, View } from 'react-native';
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';

export default function PerfilUsuario() {
    const [campoAvatar, setAvatar] = useState('');
    const [campoNombreUsuario, setNombreUsuario] = useState('');
    const [campoCorreo, setCorreo] = useState('');
    const [campoNombre, setNombre] = useState('');
    const [campoApellidos, setApellido] = useState('');
    const [campoAlergenos, setAlergenos] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [originalValues, setOriginalValues] = useState({});

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos', 'livePhotos'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const iniciarEdicion = () => {
        setOriginalValues({
            campoNombreUsuario,
            campoCorreo,
            campoNombre,
            campoApellidos,
            campoAlergenos,
            campoAvatar,
        });
        setModoEdicion(true);
    };

    const cancelarEdicion = () => {
        setNombreUsuario(originalValues.campoNombreUsuario);
        setCorreo(originalValues.campoCorreo);
        setNombre(originalValues.campoNombre);
        setApellido(originalValues.campoApellidos);
        setAlergenos(originalValues.campoAlergenos);
        setAvatar(originalValues.campoAvatar);
        setModoEdicion(false);
    };

    return (
        <>
            <Avatar
                size="xlarge"
                rounded
                source={{ uri: campoAvatar }}
                showAccessory={modoEdicion}>
                {modoEdicion && <Avatar.Accessory size={24} onPress={pickImage} />}
            </Avatar>

            <StatusBar style="auto" />

            <Text>Nombre Usuario</Text>
            <TextInput
                style={styles.input}
                placeholder="NOMBRE USUARIO"
                value={campoNombreUsuario}
                onChangeText={setNombreUsuario}
                editable={modoEdicion}
            />

            <Text>Correo electrónico</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={campoCorreo}
                onChangeText={setCorreo}
                editable={modoEdicion}
            />

            <Text>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={campoNombre}
                onChangeText={setNombre}
                editable={modoEdicion}
            />

            <Text>Apellidos</Text>
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={campoApellidos}
                onChangeText={setApellido}
                editable={modoEdicion}
            />

            <Text>Alérgenos (Opcional)</Text>
            <TextInput
                style={styles.input}
                placeholder="Alérgenos"
                value={campoAlergenos}
                onChangeText={setAlergenos}
                editable={modoEdicion}
            />

            <View style={styles.buttonContainer}>
                {modoEdicion ? (
                    <>
                        <Button title="Cancelar" onPress={cancelarEdicion} color="red" />
                        <Button title="Guardar" onPress={() => setModoEdicion(false)} />
                    </>
                ) : (
                    <Button title="Editar" onPress={iniciarEdicion} />
                )}
            </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});