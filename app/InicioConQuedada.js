import React from 'react';
import {View, Text, StyleSheet, Button, TextInput, Image} from 'react-native';

export default function InicioConQuedada({ navigation }){
    const quedadas = [
        { id: 1, nombre: 'Quedada 1', descripcion: 'Descripcion de la quedada 1', fecha: '2022-01-01', tiempoRestante: '2h', imagen: null },
        { id: 2, nombre: 'Quedada 2', descripcion: 'Descripcion de la quedada 2', fecha: '2022-01-02', tiempoRestante: '2h', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCgLKOFbr0B71QYXSkJ7YEmD-eVxOh9wohMQ&s' },
        { id: 3, nombre: 'Quedada 3', descripcion: 'Descripcion de la quedada 3', fecha: '2022-01-03', tiempoRestante: '2h', imagen: null },
    ];
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button title={"Crear Quedada"} />
                <Button title={"Unirse a una Quedadas"} />
            </View>
            <View style={styles.containerQuedadas}>
                {quedadas.map((quedada) => (
                    <View key={quedada.id} style={styles.quedadaContainer}>
                        {quedada.imagen ? (
                            <View style={styles.quedadaWithImage}>
                                <View style={styles.boxImagen}>
                                    <Image
                                        source={{ uri: quedada.imagen }}
                                        style={styles.imagen}
                                    />
                                </View>
                                <View style={styles.boxInfo}>
                                    <View>
                                        <Text style={styles.quedadaText}>{quedada.nombre}</Text>
                                        <Text style={styles.quedadaText}>{quedada.descripcion}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.quedadaText}>{quedada.fecha}</Text>
                                        <Text style={styles.quedadaText}>{quedada.tiempoRestante}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.quedadaWithoutImage}>
                                <View style={styles.boxInfo}>
                                    <View>
                                        <Text style={styles.quedadaText}>{quedada.nombre}</Text>
                                        <Text style={styles.quedadaText}>{quedada.descripcion}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.quedadaText}>{quedada.fecha}</Text>
                                        <Text style={styles.quedadaText}>{quedada.tiempoRestante}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        color: 'black',
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 20,
    },
    quedadaContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
    },
    boxInfo: {
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imagen: {
        width: "auto",
        height: 100,
    },
});