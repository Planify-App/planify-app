import {Text, Button, TextInput, StyleSheet, View, Alert} from 'react-native';
import {useEffect, useState} from "react";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";

export default function PerfilUsuario() {
    const [campoAvatar, setAvatar] = useState('');
    const [campoNombreUsuario, setNombreUsuario] = useState('');
    const [campoCorreo, setCorreo] = useState('');
    const [campoNombre, setNombre] = useState('');
    const [campoApellidos, setApellido] = useState('');
    const [campoAlergenos, setAlergenos] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [originalValues, setOriginalValues] = useState({});
    const [userId, setUserId] = useState(null);
    const [hayCambios, setHayCambios] = useState(false);

    useEffect(() => {
        const getUserSession = async () => {
            try {
                const session = await AsyncStorage.getItem("userSession");
                if (session) {
                    const userData = JSON.parse(session);
                    setUserId(userData.userId);
                }
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
            }
        };

        getUserSession();
    }, []);

    useEffect(() => {
        const verificarCambios = () => {
            const cambios =
                campoNombreUsuario !== originalValues.campoNombreUsuario ||
                campoCorreo !== originalValues.campoCorreo ||
                campoNombre !== originalValues.campoNombre ||
                campoApellidos !== originalValues.campoApellidos ||
                campoAlergenos !== originalValues.campoAlergenos ||
                campoAvatar !== originalValues.campoAvatar;

            setHayCambios(cambios);
        };

        verificarCambios();
    }, [campoNombreUsuario, campoCorreo, campoNombre, campoApellidos, campoAlergenos, campoAvatar, originalValues]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (userId) {
                try {
                    const response = await fetch(`http://192.168.1.229:3080/api/getUserInfo/${userId}`);
                    const data = await response.json();
                    setAvatar(data.avatar);
                    setNombreUsuario(data.nombre_usuario);
                    setCorreo(data.correo);
                    setNombre(data.nombre);
                    setApellido(data.apellidos);
                    setAlergenos(data.alergenos);
                } catch (error) {
                    console.error("Error al obtener la información del usuario:", error);
                }
            }
        };

        fetchUserInfo();
    }, [userId]);



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

    const guardarUsuario = async () => {
        const data = {};

        if (campoNombreUsuario !== originalValues.campoNombreUsuario) {
            data.nombre_usuario = campoNombreUsuario;
        }
        if (campoCorreo !== originalValues.campoCorreo) {
            data.correo = campoCorreo;
        }
        if (campoNombre !== originalValues.campoNombre) {
            data.nombre = campoNombre;
        }
        if (campoApellidos !== originalValues.campoApellidos) {
            data.apellidos = campoApellidos;
        }
        if (campoAlergenos !== originalValues.campoAlergenos) {
            data.alergenos = campoAlergenos;
        }
        if (campoAvatar !== originalValues.campoAvatar) {
            data.avatar = campoAvatar;
        }

        if (Object.keys(data).length === 0) {

            return;
        }

        try {
            const response = await fetch('http://192.168.1.229:3080/api/editUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                Alert.alert('Error', errorData.message || 'Error al guardar la información del usuario');
            }
            router.push('/MenuNoLog');
        } catch (error) {
            console.error("Error al guardar la información del usuario:", error);
        }
    }

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
                className="w-72 lg:w-full bg-white/60"
                style={[styles.input, modoEdicion ? styles.inputEditable : styles.inputDisabled]}
                placeholder="NOMBRE USUARIO"
                value={campoNombreUsuario}
                onChangeText={setNombreUsuario}
                editable={modoEdicion}
            />

            <Text>Correo electrónico</Text>
            <TextInput
                className="w-72 lg:w-full bg-white/60"
                style={[styles.input, modoEdicion ? styles.inputEditable : styles.inputDisabled]}
                placeholder="Correo electrónico"
                value={campoCorreo}
                onChangeText={setCorreo}
                editable={modoEdicion}
            />

            <Text>Nombre</Text>
            <TextInput
                className="w-72 lg:w-full bg-white/60"
                style={[styles.input, modoEdicion ? styles.inputEditable : styles.inputDisabled]}
                placeholder="Nombre"
                value={campoNombre}
                onChangeText={setNombre}
                editable={modoEdicion}
            />

            <Text>Apellidos</Text>
            <TextInput
                className="w-72 lg:w-full bg-white/60"
                style={[styles.input, modoEdicion ? styles.inputEditable : styles.inputDisabled]}
                placeholder="Apellido"
                value={campoApellidos}
                onChangeText={setApellido}
                editable={modoEdicion}
            />

            <Text>Alérgenos (Opcional)</Text>
            <TextInput
                className="w-72 lg:w-full bg-white/60"
                style={[styles.input, modoEdicion ? styles.inputEditable : styles.inputDisabled]}
                placeholder="Alérgenos"
                value={campoAlergenos}
                onChangeText={setAlergenos}
                editable={modoEdicion}
            />

            <View style={styles.buttonContainer}>
                {modoEdicion ? (
                    <>
                        <Button title="Cancelar" onPress={cancelarEdicion} color="red" />
                        <Button title="Guardar" disabled={!hayCambios} onPress={() => setModoEdicion(false) && guardarUsuario()} />
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
        marginTop: 4,
        backgroundColor: '#fff',
    },
    inputEditable: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        color: '#000',
    },
    inputDisabled: {
        backgroundColor: '#e0e0e0',
        borderColor: '#bdbdbd',
        color: '#757575',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});