import {Text, Button, TextInput, StyleSheet, View, Alert, Platform} from 'react-native';
import {useEffect, useState} from "react";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import Constants from "expo-constants";

export default function PerfilUsuario() {
    const ip = "192.168.1.111"
    const [campoAvatar, setAvatar] = useState(require('../assets/profile-photo.jpg'));
    const [campoNombreUsuario, setNombreUsuario] = useState('');
    const [campoCorreo, setCorreo] = useState('');
    const [campoNombre, setNombre] = useState('');
    const [campoApellidos, setApellido] = useState('');
    const [campoAlergenos, setAlergenos] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [originalValues, setOriginalValues] = useState({});
    const [userId, setUserId] = useState(null);
    const [hayCambios, setHayCambios] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState("")

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
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
    } else if (Platform.OS === 'web') {
        useEffect(() => {
            const getUserSession = async () => {
                try {
                    const session = sessionStorage.getItem("userSession");
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
    }


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
                    const response = await fetch(`http://${ip}:3080/api/getUserInfo/${userId}`);
                    const data = await response.json();
                    setOriginalValues({
                        campoAvatar: data.avatar,
                        campoNombreUsuario: data.nombre_usuario,
                        campoCorreo: data.correo,
                        campoNombre: data.nombre,
                        campoApellidos: data.apellidos,
                        campoAlergenos: data.alergenos,
                    });
                    if (data.avatar !== "") {
                        setAvatar(data.avatar);
                    }
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const newUrl = await uploadImage(result.assets[0].uri);
            if (newUrl) {
                setUploadedUrl(newUrl);
                setAvatar(newUrl);
            }
        }
    };



    const uploadImage = async (imageUri) => {
        let formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            name: 'foto.jpg',
            type: 'image/jpeg',
        });

        formData.append('userId', userId);

        try {
            let response = await fetch(`http://${ip}:3080/api/upload`, { // Endpoint de tu backend
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            let json = await response.json();
            if (json.url) {
                console.log('Imagen subida correctamente:', json.url);
                return json.url;
            } else {
                console.error('Error en la respuesta del backend:', json);
                return null;
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            return null;
        }
    };


    const iniciarEdicion = () => {
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
        if (!userId) {
            Alert.alert("Error", "No se encontró el ID de usuario");
            return;
        }
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
        if (uploadedUrl && uploadedUrl !== originalValues.campoAvatar) {
            data.avatar = uploadedUrl;
        }


        if (Object.keys(data).length === 0) {
            return;
        }

        data.userId = userId;

        console.log("Enviando datos:", JSON.stringify(data, null, 2));

        try {
            const response = await fetch(`http://${ip}:3080/api/editUserInfo`, {
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
            <View style={{paddingTop: Constants.statusBarHeight}} className="w-full flex justify-center items-center bg-[#DBF3EF]">
                <Avatar
                    size="xlarge"
                    rounded
                    source={typeof campoAvatar === 'string' ? { uri: campoAvatar } : campoAvatar}
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
                    style={[styles.input, styles.inputDisabled]}
                    placeholder="Correo electrónico"
                    value={campoCorreo}
                    onChangeText={setCorreo}
                    editable={false}
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
                            <Button title="Guardar" disabled={!hayCambios} onPress={() => { guardarUsuario(); setModoEdicion(false); }} />
                        </>
                    ) : (
                        <Button title="Editar" onPress={iniciarEdicion} />
                    )}
                </View>
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