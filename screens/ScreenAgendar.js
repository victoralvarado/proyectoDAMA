import React, { useState, useEffect } from "react";
import {
    Button,
    View,
    StyleSheet,
    TextInput,
    Text,
    SafeAreaView, ScrollView, StatusBar, Dimensions
} from "react-native";

import firebase from "../database/firebase";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import { NativeBaseProvider, Center, extendTheme, FormControl,Input } from "native-base";
import * as yup from 'yup'
import { Formik } from 'formik'
export default function ScreenAgendar() {
    const ref = firebase.firestore().collection("citas");

    return (
        <Formik initialValues={{
            nombreCompleto: "",
            fecha: "",
            hora: "",
        }}
            onSubmit={(values, actions) => {
                actions.resetForm();
                ref.add({
                    nombreCompleto: values.nombreCompleto,
                    fecha: values.fecha,
                    hora: values.hora,
                })
                alert("Agrregado");
            }}
            validationSchema={yup.object().shape({
                nombreCompleto: yup
                    .string()
                    .trim()
                    .required('Por favor, Digite una nombre!'),

                fecha: yup
                    .string()
                    .required('Por favor, Seleccione una fecha!'),
                hora: yup
                    .string()
                    .required('Por favor, Seleccione una hora!'),

            })}>
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (

                <MyForm values={values} handleChange={handleChange} errors={errors} setFieldTouched={setFieldTouched} touched={touched} isValid={isValid} setFieldValue={setFieldValue} handleSubmit={handleSubmit} />

            )}
        </Formik>
    );
};

export const MyForm = props => {
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
    const { handleSubmit, handleChange, values, setFieldValue, errors, setFieldTouched, touched, isValid } = props;
    const fecha = new Date();
    const [rs, setRS] = useState([]);
    const [datos, setDatos] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [array, setArray] = useState([]);
    const [h, setH] = useState("");

    var it = [
        { label: "8:00 AM", value: "8:00 AM", fecha: "" },
        { label: "9:00 AM", value: "9:00 AM", fecha: "" },
        { label: "10:00 AM", value: "10:00 AM", fecha: "" },
        { label: "11:00 AM", value: "11:00 AM", fecha: "" },
        { label: "1:00 PM", value: "1:00 PM", fecha: "" },
        { label: "2:00 PM", value: "2:00 PM", fecha: "" },
        { label: "3:00 PM", value: "3:00 PM", fecha: "" },
        { label: "4:00 PM", value: "4:00 PM", fecha: "" },
    ];

    var itSabado = [
        { label: "8:00 AM", value: "8:00 AM", fecha: "" },
        { label: "9:00 AM", value: "9:00 AM", fecha: "" },
        { label: "10:00 AM", value: "10:00 AM", fecha: "" },
        { label: "11:00 AM", value: "11:00 AM", fecha: "" },
    ];


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        setFieldValue('fecha', moment(date).format('DD/MM/YYYY'));
        var da = moment(date).format('DD/MM/YYYY');
        var dateParts = da.split("/");
        var dateObject = new Date(dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2]);
        var day = dateObject.getDay()
        if (day == 0) {
            setH("");
            const arr = [];
            setArray(arr);
        } else if (day == 6) {
            setH("");
            const arr = [];
            setArray(arr);
            const rs = [];
            firebase.firestore().collection("citas").where("fecha", "==", moment(date).format('DD/MM/YYYY')).onSnapshot((querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                    const { fecha, hora } = doc.data();
                    rs.push({
                        fecha,
                        hora
                    });
                });
                const dataArr = new Set(rs);
                let result = [...dataArr];
                setRS(result);
                for (var i = 0; i < itSabado.length; i++) {
                    itSabado[i].fecha = moment(date).format('DD/MM/YYYY');
                }

                const res = rs.map(({ fecha, hora }) => ({ fecha, label: hora, value: hora }));
                datos.push(res);
                const dataArrI = new Set(res);
                let resultN = [...dataArrI];
                setDatos(resultN);

                const array = [];
                for (var i = 0; i < itSabado.length; i++) {
                    var igual = false;
                    for (var j = 0; j < resultN.length & !igual; j++) {
                        if (itSabado[i]['label'] == resultN[j]['label'] &&
                            itSabado[i]['value'] == resultN[j]['value'])
                            igual = true;
                    }
                    if (!igual) array.push(itSabado[i]);
                }
                const dataA = new Set(array);
                let items = [...dataA];
                setArray(items);

            });
        } else {
            setH("");
            const arr = [];
            setArray(arr);
            const rs = [];
            firebase.firestore().collection("citas").where("fecha", "==", moment(date).format('DD/MM/YYYY')).onSnapshot((querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                    const { fecha, hora } = doc.data();
                    rs.push({
                        fecha,
                        hora
                    });
                });
                const dataArr = new Set(rs);
                let result = [...dataArr];
                setRS(result);
                for (var i = 0; i < it.length; i++) {
                    it[i].fecha = moment(date).format('DD/MM/YYYY');
                }

                const res = rs.map(({ fecha, hora }) => ({ fecha, label: hora, value: hora }));
                datos.push(res);
                const dataArrI = new Set(res);
                let resultN = [...dataArrI];
                setDatos(resultN);

                const array = [];
                for (var i = 0; i < it.length; i++) {
                    var igual = false;
                    for (var j = 0; j < resultN.length & !igual; j++) {
                        if (it[i]['label'] == resultN[j]['label'] &&
                            it[i]['value'] == resultN[j]['value'])
                            igual = true;
                    }
                    if (!igual) array.push(it[i]);
                }
                const dataA = new Set(array);
                let items = [...dataA];
                setArray(items);

            });
        }

        hideDatePicker();
    };


    const inputStyle = {
        borderWidth: 1,
        borderColor: '#4e4e4e',
        padding: 12,
        marginBottom: 5,
    };
    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                <NativeBaseProvider theme={theme}>
                    <Center flex={1}>
                        <FormControl w="100%" maxW="390px" style={{ marginTop: 34 }}>
                            
                            <FormControl.Label _text={{ fontSize: 15, fontWeight: "500", fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Primer nombre
                                    </FormControl.Label>
                                    <View>
                                <Input
                                    style={inputStyle}
                                    value={values.nombreCompleto}
                                    onChangeText={handleChange('nombreCompleto')}
                                    onBlur={() => setFieldTouched('nombreCompleto')}
                                    placeholder="Nombre Completo"
                                />
                                {touched.nombreCompleto && errors.nombreCompleto &&
                                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.nombreCompleto}</Text>
                                }
                            </View>
                            <View>
                                <Text>Fecha:</Text>
                                <Text>{`${selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : ""}`}</Text>
                                <Button title="Seleccionar Fecha" onPress={showDatePicker} />
                                <DateTimePickerModal
                                    minimumDate={new Date(fecha.getFullYear(), fecha.getMonth(), (fecha.getDate() + 1))}
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </View>
                            {touched.fecha && errors.fecha &&
                                <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.fecha}</Text>
                            }
                            <View>
                                <Text>Hora:</Text>

                                <RNPickerSelect
                                    onValueChange={(v) => { setFieldValue('hora', v), setH(v) }}

                                    placeholder={{ label: "Seleccione una Hora", value: h }}
                                    useNativeAndroidPickerStyle={false}
                                    items={array.map(obj => (
                                        {
                                            label: obj.label,
                                            value: obj.value,
                                        }))}
                                    style={pickerSelectStyles}
                                />
                                {touched.hora && errors.hora &&
                                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.hora}</Text>
                                }
                            </View>

                            <View>
                                <Button title="Guardar registro"
                                    disabled={!isValid}
                                    onPress={handleSubmit}
                                />
                            </View>
                        </FormControl>
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
        marginHorizontal: 8,
    },
    text: {
        textAlign: 'center',
        fontFamily: "Poppins Bold",
        color: "#ED6A5A",
        fontSize: 40
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 4,
        color: 'black',
        paddingRight: 30 // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderRadius: 8,
        color: 'black',
        paddingRight: 30 // to ensure the text is never behind the icon
    }
});