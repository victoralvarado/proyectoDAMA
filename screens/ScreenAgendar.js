import React, { useState, useEffect } from "react";
import {
    Button,
    View,
    StyleSheet,
    TextInput,
    Text,
    SafeAreaView, ScrollView, StatusBar, Dimensions, Pressable,LogBox
} from "react-native";
import storage from './Storage';
import {firebase} from "../database/firebase";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import { NativeBaseProvider, Center, extendTheme, FormControl, Input, Slide, Box, CheckIcon, HStack } from "native-base";
import * as yup from 'yup'
import { Formik } from 'formik'
export default function ScreenAgendar(props) {
    LogBox.ignoreLogs(['Warning:']);
    const ref = firebase.firestore().collection("citas");
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    return (
        <Formik initialValues={{
            fecha: "",
            hora: "",
        }}
            onSubmit={(values) => {
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
                        ref.add({
                            nombreCompleto: ret.nombre + " " + ret.apellido,
                            idUsuario: ret.id,
                            fecha: values.fecha,
                            hora: values.hora,
                            estado:0
                        })
                        let timeout;
                        setIsOpenTop(true)
                        timeout = setTimeout(alertFunc, 2000);
                        function alertFunc() {
                            props.navigation.navigate("ScreenCuenta")
                        }

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

            }}
            validationSchema={yup.object().shape({
                fecha: yup
                    .string()
                    .required('Por favor, Seleccione una fecha!'),
                hora: yup
                    .string()
                    .required('Por favor, Seleccione una hora!'),

            })}>
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
                <MyForm values={values} isOpenTop={isOpenTop} handleChange={handleChange} errors={errors} setFieldTouched={setFieldTouched} touched={touched} isValid={isValid} setFieldValue={setFieldValue} handleSubmit={handleSubmit} />
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
    const { handleSubmit, handleChange, values, setFieldValue, errors, setFieldTouched, touched, isValid, isOpenTop } = props;
    const fecha = new Date();

    const [rss, setRS] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [a, setArray] = useState([]);
    const [h, setH] = useState("");
    const [horarioss, setHorarios] = useState([]);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const dias = [
            'domingo',
            'lunes',
            'martes',
            'miercoles',
            'jueves',
            'viernes',
            'sabado',
        ];
        setSelectedDate(date);
        setFieldValue('fecha', moment(date).format('DD/MM/YYYY'));
        var da = moment(date).format('DD/MM/YYYY');
        var dateParts = da.split("/");
        var dateObject = new Date(dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2]);
        var day = dateObject.getDay()
        let nombreDia = "";
        nombreDia = dias[day];
        const rs = [];
        const horarios = [];
        const array = [];
        if (nombreDia != "") {
            firebase.firestore().collection(nombreDia).onSnapshot((querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                    const { value, h } = doc.data();
                    horarios.push({
                        label: value,
                        value,
                        fecha: moment(date).format('DD/MM/YYYY'),
                        h
                    });
                    const dataHo = new Set(horarios);
                    setHorarios([...dataHo]);

                });
                firebase.firestore().collection("citas").where("fecha", "==", moment(date).format('DD/MM/YYYY')).onSnapshot((querySnapshot) => {
                    querySnapshot.docs.forEach((doc) => {
                        const { fecha, hora,estado } = doc.data();
                        if (estado < 3) {
                            rs.push({
                                label: hora,
                                value: hora,
                                fecha
                            });
                            const dataRS = new Set(rs);
                            setRS([...dataRS]);
                        }
                       

                    });
                    for (var i = 0; i < horarios.length; i++) {
                        var igual = false;
                        for (var j = 0; j < rs.length & !igual; j++) {
                            if (horarios[i]['label'] == rs[j]['label'] &&
                                horarios[i]['value'] == rs[j]['value'])
                                igual = true;
                        }
                        if (!igual) {
                            array.push(horarios[i]);
                        }

                    }

                    const dataA = new Set(array);
                    setArray([...dataA]);
                });

            });
        }
        hideDatePicker();
    };

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                <NativeBaseProvider theme={theme}>
                    <Center flex={1}>
                    <Slide in={isOpenTop} placement="top" style={{ marginTop: "20%", alignItems: "center" }}>
                                <Box w="70%" position="absolute" p="5" style={{paddingTop:15}} borderRadius="2xl" bg="primary.2" alignItems="center" justifyContent="center" _dark={{
                                    bg: "primary.2"
                                }} safeArea>
                                    <HStack space={2}>
                                        <CheckIcon size="4" color="emerald.600" mt="1" _dark={{
                                            color: "emerald.700"
                                        }} />
                                        <Text color="primary.1" textAlign="center" _dark={{
                                            color: "primary.1"
                                        }} fontWeight="medium">
                                            Cita agendada correctamente
                                        </Text>
                                    </HStack>
                                </Box>
                            </Slide>
                        <View>
                            <Text style={styles.text}>Agendar Cita</Text>
                        </View>
                        <View style={{ marginTop: 14 }}>
                            <Text style={{ fontFamily: "Poppins Medium", fontSize: 16, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                                Seleccione una fecha y una hora para agendar una cita
                            </Text>
                        </View>
                        <FormControl w="100%" maxW="390px" style={{ marginTop: 34 }}>
                            <View>
                                <FormControl.Label _text={{ fontSize: 15, fontWeight: "500", fontFamily: "Poppins Medium", color: "primary.1" }} >
                                    Fecha
                                </FormControl.Label>
                                <View
                                    style={{
                                        borderColor: "#5D576B",
                                        borderWidth: 1,
                                        borderRadius: 4,
                                    }}>
                                    <Pressable onPress={showDatePicker}>
                                        <Input
                                            isReadOnly
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            value={selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : ""}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Seleccione una fecha"
                                        />
                                    </Pressable>
                                </View>
                                <DateTimePickerModal
                                    minimumDate={new Date(fecha.getFullYear(), fecha.getMonth(), (fecha.getDate() + 1))}
                                    maximumDate={new Date(fecha.getFullYear(), fecha.getMonth(), (fecha.getDate() + 21))}
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </View>
                            {
                                touched.fecha && errors.fecha &&
                                <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.fecha}</Text>
                            }
                        </FormControl>
                        <FormControl w="100%" maxW="390px" style={{ marginTop: 10 }}>
                            <View>
                                <FormControl.Label _text={{ fontSize: 15, fontFamily: "Poppins Medium", color: "primary.1" }} >
                                    Hora
                                </FormControl.Label>

                                <RNPickerSelect
                                    onValueChange={(v) => { setFieldValue('hora', v), setH(v) }}
                                    placeholder={{ label: "Seleccione una hora", value: h }}
                                    useNativeAndroidPickerStyle={false}
                                    items={a.sort(((a, b) => a.h - b.h)).map(obj => (
                                        {
                                            label: obj.label,
                                            value: obj.value,
                                        }))}
                                    style={pickerSelectStyles}
                                />
                                {
                                    touched.hora && errors.hora &&
                                    <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.hora}</Text>
                                }
                            </View>
                        </FormControl>
                        <View style={{ marginTop: 50, alignItems: "center" }}>
                            <Pressable
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: pressed
                                            ? 'rgb(210, 230, 255)'
                                            : '#9BC1BC',
                                        fontFamily: "",
                                        width: 265,
                                        height: 64,
                                        borderRadius: 15,
                                        alignItems: "center",
                                        justifyContent: 'center'
                                    },
                                    styles.wrapperCustom
                                ]}
                                onPress={handleSubmit} disabled={!isValid}>
                                <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 16, color: "#5D576B" }}>Agendar Cita</Text>
                            </Pressable>
                        </View>
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
        fontSize: 35
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 20,
        fontFamily: "Poppins Regular",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderColor: "#5D576B",
        borderWidth: 1,
        borderRadius: 4,
        color: "#5D576B",
        paddingRight: 12 // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 20,
        fontFamily: "Poppins Regular",
        paddingHorizontal: 12,
        borderColor: "#5D576B",
        paddingVertical: 8,
        borderWidth: 1.3,
        borderRadius: 4,
        color: "#5D576B",
        paddingRight: 12 // to ensure the text is never behind the icon
    }
});