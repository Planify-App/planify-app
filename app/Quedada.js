import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';

export default function Quedada(){
    const [visibleEvent, setVisibleEvent] = useState(false);
    const [visibleTiket, setVisibleTiket] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.containerImagenQuedada}>
                // Imagen de la quedada
            </View>
            <View style={styles.containerInfoQuedada}>
                <Text style={styles.nombre}>Nombre de la quedada</Text>
                <View style={styles.containerDescripcio}>
                    <Text style={styles.descripcion}>Descripcion de la quedada</Text>
                </View>
                <View style={styles.containerProximoEvento}>
                    <TouchableOpacity onPress={() => setVisibleEvent(!visibleEvent)} style={styles.button}>
                        <View style={styles.textProximoEvento}>
                            <Text style={styles.buttonText}>{visibleEvent ? "Ocultar" : "Ver"} Proximo Evento</Text>
                            <Text style={styles.buttonText}>{visibleEvent ? "⬇" : "⬆"}</Text>
                        </View>
                    </TouchableOpacity>

                    {visibleEvent && (
                        <View style={styles.EventoCercano}>
                            <View style={styles.InfoEvento}>
                                <Text>Evento</Text>
                            </View>
                            <View style={styles.MapaEvento}>
                                <Text>Mapa</Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.containerCalendario7dias}>
                    <Text>Calendario 7 dias</Text>
                    <View style={styles.tabla}>
                    {["Col 1", "Col 2", "Col 3", "Col 4", "Col 5", "Col 6", "Col 7"].map((item, index) => (
                        <View key={index} style={styles.cell}>
                            <Text style={styles.text}>{item}</Text>
                        </View>
                    ))}
                    </View>
                </View>
                <View style={styles.containerAsistentes}>
                    <View className={"border-b-2 border-black"}>
                        <Text>Asistentes</Text>
                    </View>
                    <View>
                        <Text>Nombre - Admin</Text>
                        <Text>Nombre - Organizador</Text>
                        <Text>Nombre</Text>
                    </View>

                </View>
                <View style={styles.containerTikets}>
                    <TouchableOpacity onPress={() => setVisibleTiket(!visibleTiket)} style={styles.button}>
                        <View style={styles.textTiket}>
                            <Text style={styles.buttonText}>Tikets</Text>
                            <Text style={styles.buttonText}>{visibleTiket ? "⬇" : "⬆"}</Text>
                        </View>
                    </TouchableOpacity>

                    {visibleTiket && (
                        <View style={styles.tikets}>
                            <View style={styles.tabla}>
                                {["Col 1", "Col 2", "Col 3"].map((item, index) => (
                                    <View key={index} style={styles.cell}>
                                        <Text style={styles.text}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.containerPagos}>

                </View>
                <Button title={"Salir de la quedada"} />
            </View>
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
    input: {
        height: 40,
        width: 200,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 20,
    },
    tabla: {
        flexDirection: "row", // Para colocar las celdas en fila
        borderWidth: 1,
        borderColor: "black",
    },
    cell: {
        flex: 1, // Distribuye equitativamente las columnas
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    textProximoEvento: {
        flexDirection: "row"
    },
    tiket: {
        flexDirection: "row"
    },
});