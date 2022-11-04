import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Pressable, Text, Alert } from "react-native";
import { Input, Center, NativeBaseProvider, Modal, IconButton, VStack, Tooltip, Button, FormControl, extendTheme, Box, Select, CheckIcon, HStack, Link } from "native-base";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup'
import { ListItem, Icon } from "react-native-elements";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {firebase} from "../database/firebase";
export default function ScreenDias(props) {

    const [dia, setdia] = React.useState("domingo");

    var time = new Date();

    const ref = firebase.firestore().collection(dia);
    const [selectedTime, setSelectedTime] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [horarios, setHorarios] = useState([]);
    useEffect(() => {
        firebase.firestore().collection(dia).onSnapshot((querySnapshot) => {
            const horarios = [];
            querySnapshot.docs.forEach((doc) => {
                const { label, value, datetime, h } = doc.data();
                horarios.push({
                    id: doc.id,
                    label,
                    value,
                    datetime,
                    h
                });
            });
            setHorarios(horarios);
        });
    }, []);
    const handleSave = () => {
        setShowModal(false);
        add(selectedTime)
    }

    const handleShowM = () => {
        setSelectedTime(time.toISOString());
        setShowModal(true);
    }

    const add = (s) => {
        function padTo2Digits(num) {
            return String(num).padStart(2, '0');
        }
        let t = new Date(s);
        ref.add({
            label: moment(s).format("h:mm A"),
            value: moment(s).format("h:mm A"),
            datetime: '' + s,
            h: parseInt(t.getHours() + "" + padTo2Digits(t.getMinutes()))
        })

    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const deleteH = (id) => {
        firebase.firestore().collection(dia).doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const openConfirmationAlert = (id) => {
        Alert.alert(
            "Eliminar Hora",
            "¿Está seguro?",
            [
                { text: "Si", onPress: () => deleteH(id) },
                { text: "No", onPress: () => console.log("canceled") },
            ],
            {
                cancelable: true,
            }
        );
    };

    const daySelection = (d) => {
        setdia(d);
        firebase.firestore().collection(d).onSnapshot((querySnapshot) => {
            const horarios = [];
            querySnapshot.docs.forEach((doc) => {
                const { label, value, datetime, h } = doc.data();
                horarios.push({
                    id: doc.id,
                    label,
                    value,
                    datetime,
                    h
                });
            });
            setHorarios(horarios);
        });

    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedTime(date);
    };
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
    return (<SafeAreaView style={styles.container}>
        <NativeBaseProvider theme={theme}>
            <Center>
                <View>
                    <Text style={styles.text}>Horarios</Text>
                </View>
                <View style={{ marginTop: 14 }}>
                    <Text style={{ fontFamily: "Poppins Medium", fontSize: 16, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                        Seleccione el dia para ver el horario o agregar uno nuevo
                    </Text>
                </View>
                <Box>
                    <Select style={{ fontSize: 20 }} _text={{ color: "primary.1" }} selectedValue={dia} minWidth="300" accessibilityLabel="Seleccionar Dia" placeholder="Seleccionar Dia" _selectedItem={{
                        bg: "primary.2",
                        color: "primary.1",
                        endIcon: <CheckIcon size="5" />
                    }} mt={1} onValueChange={itemValue => daySelection(itemValue)}>
                        <Select.Item label="Domingo" value="domingo" />
                        <Select.Item label="Lunes" value="lunes" />
                        <Select.Item label="Martes" value="martes" />
                        <Select.Item label="Miercoles" value="miercoles" />
                        <Select.Item label="Jueves" value="jueves" />
                        <Select.Item label="Viernes" value="viernes" />
                        <Select.Item label="Sabado" value="sabado" />
                    </Select>
                </Box>
                <VStack style={{ marginTop: 5 }} space={4} alignItems="center">
                    <Tooltip label="Nuevo Horario" >
                        <Button onPress={handleShowM}
                            _pressed={{
                                bg: "primary.5"
                            }}
                            alignSelf="center" _text={{
                                color: "primary.1",
                                fontFamily: "Poppins SemiBold"
                            }} bg="primary.2" >Agregar Nueva Hora</Button>
                    </Tooltip>
                </VStack>
            </Center>
            <ScrollView style={styles.scrollView}>
                {
                    horarios.sort(((a, b) => a.h - b.h)).map((ho) => {
                        return (
                            <ListItem
                                key={ho.id}
                            >
                                <ListItem.Chevron />
                                <ListItem.Content>
                                    <ListItem.Title>{ho.label}</ListItem.Title>
                                </ListItem.Content>
                                <Icon
                                    raised
                                    name='delete'
                                    type='material-community'
                                    color='red'
                                    size={20}
                                    onPress={() => openConfirmationAlert(ho.id)} />
                            </ListItem>
                        );
                    })

                }
            </ScrollView>
            <Center>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>
                            <Text style={{ textTransform: 'capitalize', fontSize: 20 }}>
                                {dia}
                            </Text>
                        </Modal.Header>
                        <Modal.Body>
                            <FormControl>
                                <FormControl.Label>Hora</FormControl.Label>
                                <Pressable onPress={showDatePicker}>
                                    <Input
                                        isReadOnly
                                        style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                        value={selectedTime ? moment(selectedTime).format("h:mm A") : ''}
                                        size="2xl"
                                        variant="outline"
                                        placeholder="Seleccione una hora"
                                    />
                                </Pressable>
                                <DateTimePickerModal

                                    isVisible={isDatePickerVisible}
                                    mode="time"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setShowModal(false);
                                }}
                                    _text={{
                                        color: "primary.1",
                                        fontFamily: "Poppins SemiBold"
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button onPress={handleSave}
                                    _pressed={{
                                        bg: "primary.5"
                                    }}
                                    _text={{
                                        color: "primary.1",
                                        fontFamily: "Poppins SemiBold"
                                    }}
                                    bg="primary.2"
                                >
                                    Agregar
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

            </Center>
        </NativeBaseProvider>
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
        backgroundColor: "#FFF",
        paddingTop: 0,
    },
    scrollView: {
        backgroundColor: '#FFF',
        marginHorizontal: 5,
    },
    scrollView1: {
        backgroundColor: 'white',
        marginHorizontal: 5,
    },
    text: {
        textAlign: 'center',
        fontFamily: "Poppins Bold",
        color: "#ED6A5A",
        fontSize: 32
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});