// EditarQuedada.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const EditarQuedada = ({ evento, onClose }) => {
    const [nombreEvento, setNombreEvento] = useState(evento.nombre_evento);
    const [descripcion, setDescripcion] = useState(evento.descripcion_evento);
    const [lugar, setLugar] = useState(evento.lugar_evento);
    const [fecha, setFecha] = useState(evento.fecha_hora_evento);

    useEffect(() => {
        setNombreEvento(evento.nombre_evento);
        setDescripcion(evento.descripcion_evento);
        setLugar(evento.lugar_evento);
        setFecha(evento.fecha_hora_evento);
    }, [evento]);

    const handleSave = () => {
        console.log("Evento editado:", { nombreEvento, descripcion, lugar, fecha });

        onClose();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Evento</Text>

            <Text>Nombre del Evento</Text>
            <TextInput
                style={styles.input}
                value={nombreEvento}
                onChangeText={setNombreEvento}
            />

            <Text>Descripción</Text>
            <TextInput
                style={styles.input}
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <Text>Lugar</Text>
            <TextInput
                style={styles.input}
                value={lugar}
                onChangeText={setLugar}
            />

            <Text>Fecha y Hora</Text>
            <TextInput
                style={styles.input}
                value={fecha}
                onChangeText={setFecha}
            />

            <Button title="Guardar"   onPress={async () => {
                const success = await handleSave();
                if (success) {
                    onClose(); // Cierra el modal si se guardó correctamente
                }
            }}/>
            <Button title="Cerrar" onPress={onClose} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
    },
});

export default EditarQuedada;
