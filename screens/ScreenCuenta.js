import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, TextInput, DevSettings, ScrollView, StatusBar, View, Text, Dimensions, Image, Pressable, LogBox } from "react-native";
import { NativeBaseProvider, Center, extendTheme, FormControl, Input, Slide, Box, CheckIcon, HStack, Spinner, Icon, Modal, Button } from "native-base";
import { ListItem, Avatar } from "react-native-elements";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase } from "../database/firebase";
import storage from './Storage';
import CryptoJS from "react-native-crypto-js";
export default function ScreenCuenta(props) {
    LogBox.ignoreLogs(['Warning: ...']);
    const isFocused = useIsFocused();
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [show, setShow] = React.useState(true);
    const [idUsuario, setIdUsuario] = useState(null);
    const [apellido, setApellido] = useState(null);
    const [telefono, setTelefono] = useState(null);
    const [display, setDisplay] = useState("none");
    const [password, setPassword] = useState(null);
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    const [correo, setCorreo] = useState(null);
    const [datos, setDatos] = useState([]);
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
    const cs = () => {
        storage.remove({
            key: 'loginState'
        });
        props.navigation.navigate("LoginState")
    };
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
                    setIdUsuario(ret.id)
                    setNombre(ret.nombre)
                    setApellido(ret.apellido)
                    setTelefono(ret.telefono)
                    setPassword(ret.clave)
                    setCorreo(ret.correo)
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
            <SafeAreaView style={{ paddingTop: StatusBar.currentHeight, }}>
                <ScrollView style={styles.scrollView}>
                    <NativeBaseProvider theme={theme} >
                        <Center flex={1}>
                            <View>
                                <Text style={styles.text}>Cuenta</Text>
                            </View>
                            <Slide in={isOpenTop} placement="top" style={{ marginTop: "20%", alignItems: "center" }}>
                                <Box w="70%" position="absolute" p="2" borderRadius="2xl" bg="primary.2" alignItems="center" justifyContent="center" _dark={{
                                    bg: "primary.2"
                                }} safeArea>
                                    <HStack space={2}>
                                        <CheckIcon size="4" color="emerald.600" mt="1" _dark={{
                                            color: "emerald.700"
                                        }} />
                                        <Text color="primary.1" textAlign="center" _dark={{
                                            color: "primary.1"
                                        }} fontWeight="medium">
                                            Datos modificados correctamente
                                        </Text>
                                    </HStack>
                                </Box>
                            </Slide>
                            <View>
                                <Modal isOpen={showModal} onClose={() => setShowModal(false)} style={{ width: '100%' }}>
                                    <Modal.Content maxWidth="400px">
                                        <Modal.CloseButton />
                                        <Modal.Header>
                                            <Text style={{ textTransform: 'capitalize', fontSize: 20 }}>
                                                Editar datos
                                            </Text>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Text style={{ color: "#ED6A5A", fontFamily: "Poppins Regular", textAlign: "center" }}>Al modificar los datos debe iniciar sesión nuevamente</Text>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Nombre</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    onChangeText={setNombre}
                                                    value={nombre}
                                                />
                                            </View>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Apellido</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    onChangeText={setApellido}
                                                    value={apellido}
                                                />
                                            </View>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Correo</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    onChangeText={setCorreo}
                                                    value={correo}
                                                />
                                            </View>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Telefono</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    onChangeText={setTelefono}
                                                    value={telefono}
                                                />
                                            </View>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Clave</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    secureTextEntry={show}
                                                />
                                                <Pressable onPress={() => setShow(!show)} >
                                                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.1" />
                                                </Pressable>
                                            </View>
                                            <Text style={{ color: "red", display: display }}>Complete todos los campos</Text>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button.Group space={1}>
                                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                                    setShowModal(false)
                                                }
                                                }
                                                    _pressed={{
                                                        bg: "primary.4"
                                                    }}
                                                    _text={{
                                                        color: "primary.1",
                                                        fontFamily: "Poppins SemiBold"
                                                    }}
                                                    bg="primary.4"
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {

                                                    if (nombre == "" || apellido == "" || correo == "" || telefono == "" || password == "") {
                                                        setDisplay("flex")
                                                    } else {
                                                        setShowModal(false);
                                                        setDisplay("none")
                                                        let timeout;
                                                        setIsOpenTop(true)
                                                        timeout = setTimeout(alertFunc, 1500);
                                                        function alertFunc() {
                                                            setIsOpenTop(false)
                                                            var encode = CryptoJS.AES.encrypt(password, 'Clav3123!').toString();
                                                            firebase.firestore().collection("usuarios").doc(idUsuario).set({
                                                                nombre: nombre,
                                                                apellido: apellido,
                                                                telefono: telefono,
                                                                correo: correo,
                                                                clave: encode,
                                                                nivel: user
                                                            })
                                                            storage.remove({
                                                                key: 'loginState'
                                                            });
                                                            props.navigation.navigate("LoginState")
                                                        }

                                                    }
                                                }
                                                }
                                                    _pressed={{
                                                        bg: "primary.5"
                                                    }}
                                                    _text={{
                                                        color: "primary.1",
                                                        fontFamily: "Poppins SemiBold"
                                                    }}
                                                    bg="primary.2"
                                                >
                                                    Modificar
                                                </Button>

                                            </Button.Group>
                                        </Modal.Footer>
                                    </Modal.Content>
                                </Modal>
                            </View>
                            <Box w="90%" bg="primary.5" p="5" rounded="2xl" _text={{
                                fontSize: 'md',
                                fontWeight: 'medium',
                                color: 'warmGray.50',
                                textAlign: 'center'
                            }}>
                                <Pressable onPress={() => setShowModal(true)}>
                                    <Text style={{ alignSelf: 'flex-end' }}>
                                        <MaterialCommunityIcons name="account-edit" color="#5D576B" size={30} />
                                    </Text>
                                </Pressable>

                                {datos.map((d) => {
                                    return (
                                        <ListItem
                                            key={d.id}
                                            containerStyle={{ padding: 0 }}
                                        >
                                            <ListItem.Content style={{ backgroundColor: "#F4F1BB", color: "#5D576B", alignItems: 'center', alignSelf: 'center' }}>
                                                <ListItem.Title style={{ textAlign: 'center', backgroundColor: "#F4F1BB", color: "#5D576B", fontSize: 25, fontFamily: "Poppins Bold" }}>{d.nombre + " " + d.apellido}</ListItem.Title>
                                                <ListItem.Subtitle style={{ backgroundColor: "#F4F1BB", color: "#5D576B" }}>{d.correo}</ListItem.Subtitle>
                                                <ListItem.Subtitle style={{ backgroundColor: "#F4F1BB", color: "#5D576B" }}>{d.telefono}</ListItem.Subtitle>
                                            </ListItem.Content>
                                        </ListItem>
                                    );
                                })}

                            </Box>
                            <View style={{ alignItems: 'flex-start', width: '90%', marginTop: 5, backgroundColor: "#FFA78C" }}>
                                <Pressable onPress={cs} style={{ width: '100%' }}>
                                    <HStack space={2}>
                                        <MaterialCommunityIcons style={{ marginRight: 20 }} name="logout" color="#5D576B" size={40} />
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: "#5D576B", fontSize: 15, fontFamily: "Poppins SemiBold", paddingTop: 5 }}>
                                                Cerrar Sesión
                                            </Text>
                                        </View>
                                    </HStack>
                                </Pressable>
                            </View>
                        </Center>
                    </NativeBaseProvider>
                </ScrollView>
            </SafeAreaView>
        );
    } else if (user == 1) {
        return (
            <SafeAreaView style={{ paddingTop: StatusBar.currentHeight, }}>
                <ScrollView style={styles.scrollView}>
                    <NativeBaseProvider theme={theme} >
                        <Center flex={1}>
                            <View>
                                <Text style={styles.text}>Cuenta</Text>
                            </View>
                            <Slide in={isOpenTop} placement="top" style={{ marginTop: "20%", alignItems: "center" }}>
                                <Box w="70%" position="absolute" p="2" borderRadius="2xl" bg="primary.2" alignItems="center" justifyContent="center" _dark={{
                                    bg: "primary.2"
                                }} safeArea>
                                    <HStack space={2}>
                                        <CheckIcon size="4" color="emerald.600" mt="1" _dark={{
                                            color: "emerald.700"
                                        }} />
                                        <Text color="primary.1" textAlign="center" _dark={{
                                            color: "primary.1"
                                        }} fontWeight="medium">
                                            Datos modificados correctamente
                                        </Text>
                                    </HStack>
                                </Box>
                            </Slide>
                            <View>
                                <Modal isOpen={showModal} onClose={() => setShowModal(false)} style={{ width: '100%' }}>
                                    <Modal.Content maxWidth="400px">
                                        <Modal.CloseButton />
                                        <Modal.Header>
                                            <Text style={{ textTransform: 'capitalize', fontSize: 20 }}>
                                                Editar datos
                                            </Text>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Text style={{ color: "#ED6A5A", fontFamily: "Poppins Regular", textAlign: "center" }}>Al modificar los datos debe iniciar sesión nuevamente</Text>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Nombre</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    onChangeText={setNombre}
                                                    value={nombre}
                                                />
                                            </View>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Apellido</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    onChangeText={setApellido}
                                                    value={apellido}
                                                />
                                            </View>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Correo</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    onChangeText={setCorreo}
                                                    value={correo}
                                                />
                                            </View>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Telefono</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    onChangeText={setTelefono}
                                                    value={telefono}
                                                />
                                            </View>
                                            <Text style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}>Clave</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputField}
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    secureTextEntry={show}
                                                />
                                                <Pressable onPress={() => setShow(!show)} >
                                                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.1" />
                                                </Pressable>
                                            </View>
                                            <Text style={{ color: "red", display: display }}>Complete todos los campos</Text>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button.Group space={1}>
                                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                                    setShowModal(false)
                                                }
                                                }
                                                    _pressed={{
                                                        bg: "primary.4"
                                                    }}
                                                    _text={{
                                                        color: "primary.1",
                                                        fontFamily: "Poppins SemiBold"
                                                    }}
                                                    bg="primary.4"
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {

                                                    if (nombre == "" || apellido == "" || correo == "" || telefono == "" || password == "") {
                                                        setDisplay("flex")
                                                    } else {
                                                        setShowModal(false);
                                                        setDisplay("none")
                                                        let timeout;
                                                        setIsOpenTop(true)
                                                        timeout = setTimeout(alertFunc, 1500);
                                                        function alertFunc() {
                                                            setIsOpenTop(false)
                                                            var encode = CryptoJS.AES.encrypt(password, 'Clav3123!').toString();
                                                            firebase.firestore().collection("usuarios").doc(idUsuario).set({
                                                                nombre: nombre,
                                                                apellido: apellido,
                                                                telefono: telefono,
                                                                correo: correo,
                                                                clave: encode,
                                                                nivel: user
                                                            })
                                                            storage.remove({
                                                                key: 'loginState'
                                                            });
                                                            props.navigation.navigate("LoginState")
                                                        }

                                                    }
                                                }
                                                }
                                                    _pressed={{
                                                        bg: "primary.5"
                                                    }}
                                                    _text={{
                                                        color: "primary.1",
                                                        fontFamily: "Poppins SemiBold"
                                                    }}
                                                    bg="primary.2"
                                                >
                                                    Modificar
                                                </Button>

                                            </Button.Group>
                                        </Modal.Footer>
                                    </Modal.Content>
                                </Modal>
                            </View>
                            <Box w="90%" bg="primary.5" p="5" rounded="2xl" _text={{
                                fontSize: 'md',
                                fontWeight: 'medium',
                                color: 'warmGray.50',
                                textAlign: 'center'
                            }}>
                                <Pressable onPress={() => setShowModal(true)}>
                                    <Text style={{ alignSelf: 'flex-end' }}>
                                        <MaterialCommunityIcons name="account-edit" color="#5D576B" size={30} />
                                    </Text>
                                </Pressable>

                                {
                                    datos.map((d) => {
                                        return (
                                            <ListItem
                                                key={d.id}
                                                containerStyle={{ padding: 0 }}
                                            >
                                                <ListItem.Content style={{ backgroundColor: "#F4F1BB", color: "#5D576B", alignItems: 'center' }}>
                                                    <ListItem.Title style={{ textAlign: "center", backgroundColor: "#F4F1BB", color: "#5D576B", fontSize: 25, fontFamily: "Poppins Bold" }}>{d.nombre + " " + d.apellido}</ListItem.Title>
                                                    <ListItem.Subtitle style={{ backgroundColor: "#F4F1BB", color: "#5D576B" }}>{d.correo}</ListItem.Subtitle>
                                                    <ListItem.Subtitle style={{ backgroundColor: "#F4F1BB", color: "#5D576B" }}>{d.telefono}</ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        );
                                    })
                                }

                            </Box>
                            <View style={{ alignItems: 'flex-start', width: '90%', marginTop: 5, backgroundColor: "#E6EBE0" }}>
                                <Pressable onPress={() => props.navigation.navigate("ScreenCitas")} style={{ width: '100%' }}>
                                    <HStack space={2}>
                                        <MaterialCommunityIcons style={{ marginRight: 20 }} name="calendar" color="#5D576B" size={40} />
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: "#5D576B", fontSize: 15, fontFamily: "Poppins SemiBold", paddingTop: 5 }}>
                                                Citas
                                            </Text>
                                        </View>
                                    </HStack>
                                </Pressable>
                            </View>
                            <View style={{ alignItems: 'flex-start', width: '90%', marginTop: 5, backgroundColor: "#FFA78C" }}>
                                <Pressable onPress={cs} style={{ width: '100%' }}>
                                    <HStack space={2}>
                                        <MaterialCommunityIcons style={{ marginRight: 20 }} name="logout" color="#5D576B" size={40} />
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: "#5D576B", fontSize: 15, fontFamily: "Poppins SemiBold", paddingTop: 5 }}>
                                                Cerrar Sesión
                                            </Text>
                                        </View>
                                    </HStack>
                                </Pressable>
                            </View>
                        </Center>
                    </NativeBaseProvider>
                </ScrollView>
            </SafeAreaView>
        );
    }

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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

    inputContainer: {
        width: '100%',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black'
    },
    inputField: {
        padding: 14,
        color: "#5D576B",
        fontFamily: "Poppins Regular",
        width: '90%'
    }
});