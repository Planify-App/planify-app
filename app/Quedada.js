import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import { useRoute } from "@react-navigation/native";

export default function Quedada() {
    const route = useRoute();
    const { id } = route.params || {};
    const [quedada, setQuedada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visibleEvent, setVisibleEvent] = useState(false);
    const [visibleTicket, setVisibleTicket] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchQuedada() {
            setLoading(true);
            setError(null);

            try {
                if (id) {
                    const response = await fetch(`http://localhost:3080/api/getHangoutById/${id}`, { signal }); // Pass signal
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                    }
                    const data = await response.json();
                    console.log(data);
                    setQuedada(data[0]);
                } else {
                    setError("Quedada ID is missing.");
                }

            } catch (error) {
                if (signal.aborted) {
                    console.log("Fetch aborted");
                    return;
                }
                console.error('Error fetching quedada:', error);
                setError("Failed to load quedada data. " + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchQuedada();

        return () => controller.abort();
    }, [id]);

    if (loading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    if (error) {
        return <View style={styles.container}><Text>{error}</Text></View>;
    }

    if (!quedada) {
        return <View style={styles.container}><Text>Quedada not found.</Text></View>;
    }

    return (
        <View style={styles.container}>
            {quedada && quedada.link_imagen && (
                <View style={styles.containerImagenQuedada}>
                    <Image
                        source={{ uri: quedada.link_imagen }}
                        className="min-w-96 w-full h-32 rounded-lg"
                    />
                </View>
            )}
            <View style={styles.containerInfoQuedada}>
                <Text style={styles.nombre}>{quedada.nombre_quedada}</Text>
                <View style={styles.containerDescripcio}>
                    <Text style={styles.descripcion}>{quedada.descripcion_quedada}</Text>
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
                <View style={styles.containerTickets}>
                    <TouchableOpacity onPress={() => setVisibleTicket(!visibleTicket)} style={styles.button}>
                        <View style={styles.textTicket}>
                            <Text style={styles.buttonText}>Tickets</Text>
                            <Text style={styles.buttonText}>{visibleTicket ? "⬇" : "⬆"}</Text>
                        </View>
                    </TouchableOpacity>

                    {visibleTicket && (
                        <View style={styles.tickets}>
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
    ticket: {
        flexDirection: "row"
    },
});