import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Image, Pressable, Text, View, Alert, LogBox } from "react-native";
import { Input, Center, NativeBaseProvider, FormControl, extendTheme, Modal, HStack, Link, Icon, Box, VStack, Spacer, Button, Spinner, Select, CheckIcon } from "native-base";
import { firebase } from "../database/firebase";
import storage from './Storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
export default function ScreenHome(props) {
    LogBox.ignoreLogs(['Warning: ...']);
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalUser, setShowModalUser] = useState(false);
    const [showModalEstado, setShowModalEstado] = useState(false);
    const [idCita, setIdCita] = useState(null);
    const [estadoCita, setEstadoCita] = useState(null);
    const [fecha, setFecha] = useState(null);
    const [hora, setHora] = useState(null);
    const [idUsuario, setIdUsuario] = useState(null);
    const [nombreCompleto, setNombreCompleto] = useState(null);
    const [citas, setCitas] = useState([]);
    const [user, setUser] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [marca, setMarca] = useState(null);
    const [detalle, setDetalle] = useState(null);
    const [precio, setPrecio] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [precioAnterior, setPrecioAnterior] = useState(null);
    var time = new Date();
    var da = moment(time).format('DD/MM/YYYY');
    const [selectedDate, setSelectedDate] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
        var d = moment(date).format('DD/MM/YYYY');
        firebase.firestore().collection("citas").where("fecha", "==", d).onSnapshot((querySnapshot) => {
            const citas = [];
            querySnapshot.docs.forEach((doc) => {
                const { estado, fecha, hora, idUsuario, nombreCompleto } = doc.data();
                citas.push({
                    id: doc.id,
                    estado,
                    fecha,
                    hora,
                    idUsuario,
                    nombreCompleto
                });
            });
            setCitas(citas);
        });
    };
    const getProductos = () => {
        firebase.firestore().collection("productos").where("activo", "==", "1").onSnapshot((querySnapshot) => {
            const productos = [];
            querySnapshot.docs.forEach((doc) => {
                const { nombre, marca, detalle, cantidad, precio, imagen, precioAnterior, activo } = doc.data();
                productos.push({
                    id: doc.id,
                    nombre,
                    marca,
                    detalle,
                    cantidad,
                    precio,
                    imagen,
                    precioAnterior,
                    activo
                });
            });
            setProductos(productos);
        });
    }
    const getCitas = () => {
        firebase.firestore().collection("citas").where("fecha", "==", da).onSnapshot((querySnapshot) => {
            const citas = [];
            querySnapshot.docs.forEach((doc) => {
                const { estado, fecha, hora, idUsuario, nombreCompleto } = doc.data();
                citas.push({
                    id: doc.id,
                    estado,
                    fecha,
                    hora,
                    idUsuario,
                    nombreCompleto
                });
            });
            setCitas(citas);
        });
    }
    useEffect(() => {
        getProductos();
    }, []);
    useEffect(() => {
        getCitas();
    }, []);
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
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
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);
    const productoDetalle = (nombre, marca, detalle, precio, imagen, precioAnterior) => {
        setNombre(nombre);
        setMarca(marca);
        setDetalle(detalle);
        setPrecio(precio);
        setImagen(imagen);
        setPrecioAnterior(precioAnterior);
        setShowModal(!showModal);
    }
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
    const citaEstado = (id, estado, fecha, hora, idUsuario, nombreCompleto) => {
        setIdCita(id);
        setEstadoCita(estado);
        setFecha(fecha);
        setHora(hora);
        setIdUsuario(idUsuario);
        setNombreCompleto(nombreCompleto);
        setShowModalEstado(!showModalEstado);
    }

    const cambiarEstadoCita = () => {
        firebase.firestore().collection("citas").doc(idCita).set({
            estado: estadoCita,
            fecha: fecha,
            hora: hora,
            idUsuario: idUsuario,
            nombreCompleto: nombreCompleto
        })
    }
    if (user == null) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                    <NativeBaseProvider theme={theme}>
                        <Center flex={1}>
                            <Spinner size="lg" />
                        </Center>
                    </NativeBaseProvider>
                </ScrollView>
            </SafeAreaView>
        );
    } else if (user == 0) {
        return (
            <SafeAreaView style={styles.container}>
                <NativeBaseProvider theme={theme}>
                    <View>
                        <Text style={styles.text}>SERVICARS</Text>
                    </View>
                    <View>
                        <Text style={{ fontFamily: "Poppins Bold", fontSize: 16, color: "#ED6A5A", alignSelf: "center" }}>Citas de Clientes</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text>{`Fecha:  ${selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : da}`}</Text>
                        <Pressable style={{ width: "95%", alignItems: "center", justifyContent: 'center', backgroundColor: "#9BC1BC", padding: 5, borderRadius: 5, marginTop: 4, marginBottom:4 }}
                            onPress={showDatePicker}>
                            <Text style={{ textAlign: "center", color: "#5D576B", fontFamily: "Poppins SemiBold" }}>Seleccionar Fecha</Text>
                        </Pressable>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <Modal isOpen={showModalEstado} onClose={() => setShowModalEstado(false)} style={{ width: '100%' }}>
                        <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>
                                <Text style={{ textTransform: 'capitalize', fontSize: 20 }}>
                                    Estado Cita
                                </Text>
                            </Modal.Header>
                            <Modal.Body>
                                <Text>Estado</Text>
                                <Box>
                                    <Select style={{ fontSize: 20 }} _text={{ color: "primary.1" }} selectedValue={estadoCita} minWidth="200" accessibilityLabel="Seleccionar Estado" placeholder="Seleccionar Estado" _selectedItem={{
                                        bg: "primary.2",
                                        color: "primary.1",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1} onValueChange={itemValue => setEstadoCita(itemValue)}>
                                        <Select.Item label="Espera" value={0} />
                                        <Select.Item label="En Curso" value={1} />
                                        <Select.Item label="Finalizada" value={2} />
                                        <Select.Item label="Inactiva" value={3} />
                                    </Select>
                                </Box>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={1}>
                                    <Button variant="ghost" colorScheme="blueGray" onPress={() => {

                                        setShowModalEstado(false);
                                        cambiarEstadoCita();
                                    }}
                                        _pressed={{
                                            bg: "primary.5"
                                        }}
                                        _text={{
                                            color: "primary.1",
                                            fontFamily: "Poppins SemiBold"
                                        }}
                                        bg="primary.2"
                                    >
                                        Cambiar Estado
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <FlatList
                        style={{ alignSelf: "center", width: "95%" }}
                        data={citas}
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: "row", backgroundColor: "#EDEDED", borderRadius: 8, padding: 5,marginBottom:4 }}>
                                <View style={{ width: "60%", }} >
                                    <View style={{ margin: 5, alignSelf: "center", backgroundColor: "#EDEDED" }}>

                                        <View style={{ alignSelf: "center" }}>
                                            <Text style={{ textAlign: "center", fontFamily: "Poppins Regular", color: "#5D576B" }}>{item.nombreCompleto}</Text>
                                        </View>
                                        <View style={{ alignSelf: "center" }}>
                                            <Text style={{ textAlign: "center", fontFamily: "Poppins Regular", color: "#5D576B" }}>{item.fecha}</Text>
                                        </View>
                                        <View style={{ alignSelf: "center" }}>
                                            <Text style={{ textAlign: "center", fontFamily: "Poppins Regular", color: "#5D576B" }}>Hora: {item.hora}</Text>
                                        </View>
                                        <View style={{ alignSelf: "center" }}>
                                            <Text style={{ textAlign: "center", fontFamily: "Poppins Regular", color: "#5D576B" }}>Estado: {estado[item.estado]} <Text style={{ color: color[item.estado] }}>■</Text></Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: 'center' }}>
                                    <Pressable style={{ width: "95%", alignItems: "center", justifyContent: 'center', backgroundColor: "#9BC1BC", padding: 5, borderRadius: 5 }} onPress={() => {
                                        firebase.firestore().collection("usuarios").doc(item.idUsuario).get().then((doc) => {
                                            if (doc.exists) {
                                                const { nombre, apellido, correo, telefono } = doc.data();
                                                Alert.alert("Datos Usuario", "Nombre: " + nombre + "\nApellido: " + apellido + "\nCorreo: " + correo + "\nTelefono: " + telefono)
                                            } else {
                                                // doc.data() will be undefined in this case
                                                console.log("No such document!");
                                            }
                                        })

                                    }}>
                                        <Text style={{ textAlign: "center", color: "#5D576B", fontFamily: "Poppins SemiBold" }}>Datos Usuario</Text>
                                    </Pressable>
                                    <Pressable style={{ width: "95%", alignItems: "center", justifyContent: 'center', backgroundColor: "#9BC1BC", padding: 5, borderRadius: 5, marginTop: 4 }}
                                        onPress={() => citaEstado(item.id, item.estado, item.fecha, item.hora, item.idUsuario, item.nombreCompleto)}>
                                        <Text style={{ textAlign: "center", color: "#5D576B", fontFamily: "Poppins SemiBold" }}>Cambiar Estado</Text>
                                    </Pressable>
                                </View>
                            </View>

                        )}
                    />
                </NativeBaseProvider>
            </SafeAreaView>
        );
    } else if (user == 1) {
        return (
            <SafeAreaView style={styles.container}>
                <NativeBaseProvider theme={theme}>
                    <View>
                        <Text style={styles.text}>SERVICARS</Text>
                    </View>
                    <View>
                        <Text style={{ fontFamily: "Poppins Bold", fontSize: 16, color: "#ED6A5A", alignSelf: "center" }}>Productos</Text>
                    </View>
                    <View style={{ marginTop: 14 }}>
                        <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 15, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                            Productos que puedes comprar en el taller
                        </Text>
                    </View>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)} style={{ width: '100%' }}>
                        <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>
                                <Text style={{ textTransform: 'capitalize', fontSize: 20 }}>
                                    Detalle Producto
                                </Text>
                            </Modal.Header>
                            <Modal.Body>
                                <View style={{ alignSelf: "center", }}>
                                    <Image source={{ uri: imagen }} style={{ width: 300, height: 300, borderRadius: 5 }} />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "Poppins Bold", color: "#5D576B" }}>{nombre} {marca}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "Poppins SemiBold", color: "#5D576B" }}>Detalle:</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "Poppins Regular", color: "#5D576B" }}>{detalle}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "Poppins SemiBold", color: "#5D576B" }}>Precio:</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "Poppins Regular", color: "#5D576B" }}>$ {precio}<Text style={{ textDecorationLine: 'line-through', color: '#ED6A5A' }}>{precioAnterior != "" ? " $" + precioAnterior : ""}</Text></Text>
                                </View>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={1}>
                                    <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                        setShowModal(false);
                                    }}
                                        _text={{
                                            color: "primary.1",
                                            fontFamily: "Poppins SemiBold"
                                        }}
                                    >
                                        Cerrar
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <FlatList
                        style={{ alignSelf: "center" }}
                        numColumns={2}
                        data={productos}
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => (
                            <View style={{ borderColor: "#F1F1F1", width: 160, margin: 5, alignSelf: "center", borderRadius: 8, padding: 5, backgroundColor: "#FFF", borderWidth: 2 }}>

                                <View style={{ alignSelf: "center", }}>
                                    <Image source={{ uri: item.imagen }} style={{ width: 100, height: 100, borderRadius: 5 }} />
                                </View>
                                <View style={{ alignSelf: "center" }}>
                                    <Text style={{ textAlign: "center", fontFamily: "Poppins Regular", color: "#5D576B" }} numberOfLines={2}>{item.nombre}</Text>
                                </View>
                                <View style={{ alignSelf: "center" }}>
                                    <Text style={{ textAlign: "center", fontFamily: "Poppins Regular", color: "#5D576B" }}>${item.precio}<Text style={{ textDecorationLine: 'line-through', color: '#ED6A5A' }}>{item.precioAnterior != "" ? "$" + item.precioAnterior : ""}</Text></Text>
                                </View>
                                <View style={{ alignSelf: "center", width: "95%", }}>
                                    <Button
                                        onPress={() => {
                                            productoDetalle(item.nombre, item.marca, item.detalle, item.precio, item.imagen, item.precioAnterior);
                                        }}
                                        _pressed={{
                                            bg: "primary.5"
                                        }}
                                        _text={{
                                            color: "primary.1",
                                            fontFamily: "Poppins SemiBold"
                                        }}
                                        bg="primary.2"
                                    >
                                        Ver Detalle
                                    </Button>
                                </View>

                            </View>

                        )}
                    />
                </NativeBaseProvider>
            </SafeAreaView>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#FFF",
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
        fontSize: 30
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});