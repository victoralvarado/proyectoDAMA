import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, DevSettings, ScrollView, StatusBar, View, Text, Dimensions, Alert, Image, Pressable, LogBox } from "react-native";
import { NativeBaseProvider, Center, extendTheme, FormControl, Input, Slide, Box, CheckIcon, HStack } from "native-base";
import { ListItem, Icon } from "react-native-elements";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase } from "../database/firebase";
import storage from './Storage';
export default function ScreenCuenta(props) {
    LogBox.ignoreLogs(['Warning: ...']);
    const [user, setUser] = useState("");
    const [datos, setDatos] = useState([]);
    const [cita, setCita] = useState([]);//0
    const [citaInactiva, setCitaInactiva] = useState([]);//3
    const theme = extendTheme({
        colors: {
            primary: {
                1: '#5D576B',
                2: '#9BC1BC',
                3: '#ED6A5A',
                4: '#E6EBE0',
                5: '#F4F1BB',
            },
        },
        config: {
            // Changing initialColorMode to 'dark'
            initialColorMode: 'light'
        }
    });
    const estado = [
        'Espera',
        'En Curso',
        'Finalizada',
        'Inactiva',
    ];
    const color = [
        '#83D0F3',
        '#0FB202',
        '#DFDC10',
        '#A90505',
    ];

    const deleteC = (id) => {
        firebase.firestore().collection("citas").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            storage
            .load({
                key: 'loginState',

                // autoSync (default: true) means if data is not found or has expired,
                // then invoke the corresponding sync method
                autoSync: true,

                // syncInBackground (default: true) means if data expired,
                // return the outdated data first while invoking the sync method.
                // If syncInBackground is set to false, and there is expired data,
                // it will wait for the new data and return only after the sync completed.
                // (This, of course, is slower)
                syncInBackground: true,

                // you can pass extra params to the sync method
                // see sync example below
                syncParams: {
                    extraFetchOptions: {
                        // blahblah
                    },
                    someFlag: true
                }
            })
            .then(ret => {
                // found data go to then()

                firebase.firestore().collection("citas").where("idUsuario", "==", ret.id).onSnapshot((querySnapshot) => {
                    const cita = [];
                    const citaInactiva = [];
                    querySnapshot.docs.forEach((doc) => {
                        const { estado, fecha, hora, nombreCompleto } = doc.data();
                        if (estado <= 2) {
                            cita.push({
                                id: doc.id,
                                estado,
                                fecha,
                                hora,
                                nombreCompleto
                            });
                            setCita([]);
                            const dataCita = new Set(cita);
                            setCita([...dataCita]);
                        }
                        if (estado == 3) {
                            citaInactiva.push({
                                id: doc.id,
                                estado,
                                fecha,
                                hora,
                                nombreCompleto
                            });
                            setCitaInactiva([]);
                            const dataCitaInactiva = new Set(citaInactiva);
                            setCitaInactiva([...dataCitaInactiva]);
                        }
                    });


                });
            })
            .catch(err => {
                // any exception including data not found
                // goes to catch()
                //console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        break;
                    case 'ExpiredError':
                        // TODO
                        break;
                }
            });
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    const openConfirmationAlert = (id, estado) => {
        console.log(estado);
        if (estado == 0 || estado == 3) {
            Alert.alert(
                "Eliminar Cita",
                "¿Está seguro que desea eliminar la cita?",
                [
                    { text: "Si", onPress: () => deleteC(id) },
                    { text: "No", onPress: () => console.log("canceled") },
                ],
                {
                    cancelable: true,
                }
            );
        } else {
            Alert.alert(
                "Eliminar Cita",
                "No puede eliminar esta cita"
            );
        }

    };
    React.useEffect(() => {
        storage
            .load({
                key: 'loginState',

                // autoSync (default: true) means if data is not found or has expired,
                // then invoke the corresponding sync method
                autoSync: true,

                // syncInBackground (default: true) means if data expired,
                // return the outdated data first while invoking the sync method.
                // If syncInBackground is set to false, and there is expired data,
                // it will wait for the new data and return only after the sync completed.
                // (This, of course, is slower)
                syncInBackground: true,

                // you can pass extra params to the sync method
                // see sync example below
                syncParams: {
                    extraFetchOptions: {
                        // blahblah
                    },
                    someFlag: true
                }
            })
            .then(ret => {
                // found data go to then()
                setUser(ret.nivel);
                const datos = [];
                datos.push(ret);
                setDatos(datos);

                firebase.firestore().collection("citas").where("idUsuario", "==", ret.id).onSnapshot((querySnapshot) => {
                    const cita = [];
                    const citaInactiva = [];
                    querySnapshot.docs.forEach((doc) => {
                        const { estado, fecha, hora, nombreCompleto } = doc.data();
                        if (estado <= 2) {
                            cita.push({
                                id: doc.id,
                                estado,
                                fecha,
                                hora,
                                nombreCompleto
                            });
                            setCita([]);
                            const dataCita = new Set(cita);
                            setCita([...dataCita]);
                        }
                        if (estado == 3) {
                            citaInactiva.push({
                                id: doc.id,
                                estado,
                                fecha,
                                hora,
                                nombreCompleto
                            });
                            setCitaInactiva([]);
                            const dataCitaInactiva = new Set(citaInactiva);
                            setCitaInactiva([...dataCitaInactiva]);
                        }
                    });


                });
            })
            .catch(err => {
                // any exception including data not found
                // goes to catch()
                //console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        break;
                    case 'ExpiredError':
                        // TODO
                        break;
                }
            });
        // Call any action
    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <NativeBaseProvider theme={theme}>
                    <Center>
                        <View>
                            <Text style={styles.text}>Citas</Text>
                        </View>
                        <View style={{ alignItems: 'center', width: '95%', marginTop: 10, backgroundColor: "#E6EBE0" }}>
                            <Text style={{ color: "#5D576B", fontSize: 20, fontFamily: "Poppins Bold" }}>Activas</Text>
                        </View>
                        <Box w="95%" bg="primary.5" style={{ marginTop: 5 }} rounded="sm" _text={{
                            fontSize: 'md',
                            fontWeight: 'medium',
                            color: 'warmGray.50',
                            textAlign: 'center'
                        }}>
                            {cita.map((d) => {
                                return (
                                    <ListItem
                                        key={d.id}
                                        containerStyle={{ borderColor: color[d.estado], borderWidth: 4, borderRadius: 4, padding: 0, marginTop: 2 }}
                                    >
                                        <ListItem.Content style={{ backgroundColor: "#FFF", color: "#5D576B", alignItems: 'center' }}>
                                            <ListItem.Title style={{ color: "#5D576B", fontSize: 25, fontFamily: "Poppins Bold" }}>{d.nombreCompleto}</ListItem.Title>
                                            <ListItem.Subtitle style={{ color: "#5D576B" }}>Fecha: {d.fecha}</ListItem.Subtitle>
                                            <ListItem.Subtitle style={{ color: "#5D576B" }}>Hora: {d.hora}</ListItem.Subtitle>
                                            <ListItem.Subtitle style={{ color: "#5D576B" }}>Estado: {estado[d.estado]}</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <Icon
                                            raised
                                            name='delete'
                                            type='material-community'
                                            color='red'
                                            size={20}
                                            onPress={() => openConfirmationAlert(d.id, d.estado)} />
                                    </ListItem>
                                );
                            })}
                        </Box>
                        <View style={{ alignItems: 'center', width: '95%', marginTop: 10, backgroundColor: "#E6EBE0" }}>
                            <Text style={{ color: "#5D576B", fontSize: 20, fontFamily: "Poppins Bold" }}>Inactivas</Text>
                        </View>
                        <Box w="95%" bg="primary.5" style={{ marginTop: 5 }} rounded="sm" _text={{
                            fontSize: 'md',
                            fontWeight: 'medium',
                            color: 'warmGray.50',
                            textAlign: 'center'
                        }}>
                            {citaInactiva.map((d) => {
                                return (
                                    <ListItem
                                        key={d.id}
                                        containerStyle={{ borderColor: color[d.estado], borderWidth: 4, borderRadius: 4, padding: 0, marginTop: 2 }}
                                    >
                                        <ListItem.Content style={{ backgroundColor: "#FFF", color: "#5D576B", alignItems: 'center' }}>
                                            <ListItem.Title style={{ color: "#5D576B", fontSize: 25, fontFamily: "Poppins Bold" }}>{d.nombreCompleto}</ListItem.Title>
                                            <ListItem.Subtitle style={{ color: "#5D576B" }}>Fecha: {d.fecha}</ListItem.Subtitle>
                                            <ListItem.Subtitle style={{ color: "#5D576B" }}>Hora: {d.hora}</ListItem.Subtitle>
                                            <ListItem.Subtitle style={{ color: "#5D576B" }}>Estado: {estado[d.estado]}</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <Icon
                                            raised
                                            name='delete'
                                            type='material-community'
                                            color='red'
                                            size={20}
                                            onPress={() => openConfirmationAlert(d.id, d.estado)} />
                                    </ListItem>
                                );
                            })}
                        </Box>
                    </Center>
                </NativeBaseProvider>
            </ScrollView>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#FFF"
    },
    scrollView: {
        height: Dimensions.get('window').height,
        backgroundColor: '#FFF',
        marginHorizontal: 5,
    },
    text: {
        textAlign: 'center',
        fontFamily: "Poppins Bold",
        color: "#ED6A5A",
        fontSize: 35
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});