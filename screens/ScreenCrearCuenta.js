import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Pressable, Text, ToastAndroid } from "react-native";
import { Input, Center, NativeBaseProvider, FormControl, extendTheme, HStack, Box, CheckIcon, Icon, useToast, Slide, Alert } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from 'formik';
import * as yup from 'yup'
import CryptoJS from "react-native-crypto-js";
import { firebase } from "../database/firebase";
export default function ScreenCrearCuenta(props) {
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [showC, setShowC] = React.useState(false);
    const ref = firebase.firestore().collection("usuarios");
    const [display, setDisplay] = useState("none");
    const SignupSchema = yup.object().shape({
        nombre: yup
            .string()
            .trim()
            .matches(/^[aA-zZñÑáÁ-úÚ\s]+$/, "Por favor, Digite un nombre valido!")
            .required('Por favor, Digite su nombre!'),

        apellido: yup
            .string()
            .trim()
            .required('Por favor, Digite su apellido!'),

        telefono: yup
            .string()
            .trim()
            .matches(/^[672]{1}[0-9]{7}$/, "El telefono debe contener '8' digitos el primer digito debe empezar con '7' o '6' o '2'")
            .required('El teléfono es requerido'),

        correo: yup
            .string()
            .email('Ingrese un correo valido')
            .required('El correo es requerido'),

        clave: yup
            .string()
            .required('La clave es requerida')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                "Debe contener 8 caracteres, uno en mayúscula, uno en minúscula, un número y un carácter especial"
            ),
        confirmarClave: yup
            .string()
            .required('Confirmar clave es requerido')
            .oneOf([yup.ref('clave')], 'Las claves no coinciden'),
    });
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
    return (
        <Formik
            initialValues={{
                nombre: '',
                apellido: '',
                telefono: '',
                correo: '',
                clave: '',
                confirmarClave: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={values => {
                firebase.firestore().collection("usuarios").where("correo", "==", values.correo).get()
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            setDisplay("flex")
                        } else {
                            setDisplay("none")
                            let timeout;
                            setIsOpenTop(true)
                            timeout = setTimeout(alertFunc, 2000);
                            function alertFunc() {
                                var encode = CryptoJS.AES.encrypt(values.clave, 'Clav3123!').toString();
                                ref.add({
                                    nombre: values.nombre,
                                    apellido: values.apellido,
                                    telefono: values.telefono,
                                    correo: values.correo,
                                    clave: encode,
                                    nivel: 1
                                })
                                props.navigation.navigate("ScreenIniciarSesion")
                            }
                        }
                    }
                    )

            }}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                <SafeAreaView style={styles.container}>

                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                        <NativeBaseProvider theme={theme}>
                            <Center flex={1}>
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
                                                Cuenta creada correctamente
                                            </Text>
                                        </HStack>
                                    </Box>
                                </Slide>
                                <View>
                                    <Text style={styles.text}>Crear Cuenta</Text>
                                </View>
                                <View style={{ marginTop: 14 }}>
                                    <Text style={{ fontFamily: "Poppins Medium", fontSize: 16, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                                        Ingresa tus datos para crear una cuenta
                                    </Text>
                                </View>

                                <FormControl w="100%" maxW="390px" style={{ marginTop: 34 }}>

                                    {/* Inicio Label Nombre */}
                                    <FormControl.Label _text={{ fontSize: 15, fontWeight: "500", fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Primer nombre
                                    </FormControl.Label>
                                    {/* Fin Label Nombre */}

                                    {/* Inicio Input Nombre */}
                                    <View
                                        style={{
                                            borderColor: "#5D576B",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        }}>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            returnKeyType={'next'}
                                            value={values.nombre}
                                            onChangeText={handleChange('nombre')}
                                            onBlur={() => setFieldTouched('nombre')}
                                            _focus={{
                                                backgroundColor: "primary.2",
                                            }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Primer nombre"
                                        />
                                    </View>
                                    {/* Fin Input Nombre */}

                                    {/* Inicio Advertencias de validacion */}
                                    {
                                        touched.nombre && errors.nombre &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.nombre}</Text>
                                    }
                                    {/* Fin Advertencias de validacion */}

                                </FormControl>
                                <FormControl w="100%" maxW="390px" style={{ marginTop: 10 }}>

                                    {/* Inicio Label Apellido */}
                                    <FormControl.Label _text={{ fontSize: 15, fontWeight: "500", fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Primer apellido
                                    </FormControl.Label>
                                    {/* Fin Label Apellido */}

                                    {/* Inicio Input Apellido */}
                                    <View
                                        style={{
                                            borderColor: "#5D576B",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        }}>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            returnKeyType={'next'}
                                            value={values.apellido}
                                            onChangeText={handleChange('apellido')}
                                            onBlur={() => setFieldTouched('apellido')}
                                            _focus={{
                                                backgroundColor: "primary.2",
                                            }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Primer apellido"
                                        />
                                    </View>
                                    {/* Fin Input Apellido */}

                                    {/* Inicio Advertencias de validacion */}
                                    {
                                        touched.apellido && errors.apellido &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.apellido}</Text>
                                    }
                                    {/* Fin Advertencias de validacion */}

                                </FormControl>
                                <FormControl w="100%" maxW="390px" style={{ marginTop: 10 }}>

                                    {/* Inicio Label Teléfono */}
                                    <FormControl.Label _text={{ fontSize: 15, fontWeight: "500", fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Teléfono
                                    </FormControl.Label>
                                    {/* Fin Label Teléfono */}

                                    {/* Inicio Input Teléfono */}
                                    <View
                                        style={{
                                            borderColor: "#5D576B",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        }}>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            returnKeyType={'next'}
                                            value={values.telefono}
                                            keyboardType="phone-pad"
                                            onChangeText={handleChange('telefono')}
                                            onBlur={() => setFieldTouched('telefono')}
                                            _focus={{
                                                backgroundColor: "primary.2",
                                            }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Teléfono"
                                        />
                                    </View>
                                    {/* Fin Input Teléfono */}

                                    {/* Inicio Advertencias de validacion */}
                                    {
                                        touched.telefono && errors.telefono &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.telefono}</Text>
                                    }
                                    {/* Fin Advertencias de validacion */}

                                </FormControl>
                                <FormControl w="100%" maxW="390px" style={{ marginTop: 10 }}>

                                    {/* Inicio Label Correo */}
                                    <FormControl.Label _text={{ fontSize: 15, fontWeight: "500", fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Correo
                                    </FormControl.Label>
                                    {/* Fin Label Correo */}

                                    {/* Inicio Input Correo */}
                                    <View
                                        style={{
                                            borderColor: "#5D576B",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        }}>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            returnKeyType={'next'}
                                            value={values.correo}
                                            keyboardType="email-address"
                                            onChangeText={handleChange('correo')}
                                            onBlur={() => setFieldTouched('correo')}
                                            _focus={{
                                                backgroundColor: "primary.2",
                                            }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Correo"
                                        />
                                    </View>
                                    {/* Fin Input Correo */}

                                    {/* Inicio Advertencias de validacion */}
                                    {
                                        touched.correo && errors.correo &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.correo}</Text>
                                    }
                                    <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium', display: display }}>Correo en uso</Text>
                                    {/* Fin Advertencias de validacion */}

                                </FormControl>
                                <FormControl w="100%" maxW="390px" style={{ marginTop: 10 }}>

                                    {/* Inicio Label Clave */}
                                    <FormControl.Label _text={{ fontSize: 15, fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Clave
                                    </FormControl.Label>
                                    {/* Fin Label Clave */}

                                    {/* Inicio Input Clave */}
                                    <View
                                        style={{
                                            borderColor: "#5D576B",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        }}>
                                        <Input
                                            style={{
                                                color: "#5D576B",
                                                fontFamily: "Poppins Regular"
                                            }}
                                            value={values.clave}
                                            onChangeText={handleChange('clave')}
                                            onBlur={() => setFieldTouched('clave')}
                                            _focus={{
                                                backgroundColor: "primary.2",
                                            }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Clave"
                                            type={show ? "text" : "password"}
                                            InputRightElement={
                                                <Pressable onPress={() => setShow(!show)} >
                                                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.1" />
                                                </Pressable>
                                            }
                                        />
                                    </View>
                                    {/* Fin Input Clave */}

                                    {/* Inicio Advertencias de validacion */}
                                    {
                                        touched.clave && errors.clave &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.clave}</Text>
                                    }
                                    {/* Fin Advertencias de validacion */}

                                </FormControl>
                                <FormControl w="100%" maxW="390px" style={{ marginTop: 10 }}>

                                    {/* Inicio Label Confirmar Clave */}
                                    <FormControl.Label _text={{ fontSize: 15, fontFamily: "Poppins Medium", color: "primary.1" }} >
                                        Confirmar clave
                                    </FormControl.Label>
                                    {/* Fin Label Confirmar Clave */}

                                    {/* Inicio Input Confirmar Clave */}
                                    <View
                                        style={{
                                            borderColor: "#5D576B",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        }}>
                                        <Input
                                            style={{
                                                color: "#5D576B",
                                                fontFamily: "Poppins Regular"
                                            }}
                                            value={values.confirmarClave}
                                            onChangeText={handleChange('confirmarClave')}
                                            onBlur={() => setFieldTouched('confirmarClave')}
                                            _focus={{
                                                backgroundColor: "primary.2",
                                            }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Confirmar clave"
                                            type={showC ? "text" : "password"}
                                            InputRightElement={
                                                <Pressable onPress={() => setShowC(!showC)} >
                                                    <Icon as={<MaterialIcons name={showC ? "visibility" : "visibility-off"} />} size={5} mr="2" color="primary.1" />
                                                </Pressable>
                                            }
                                        />
                                    </View>
                                    {/* Fin Input Confirmar Clave */}

                                    {/* Inicio Advertencias de validacion */}
                                    {
                                        touched.confirmarClave && errors.confirmarClave &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.confirmarClave}</Text>
                                    }
                                    {/* Fin Advertencias de validacion */}

                                </FormControl>
                                {/* Inicio Boton Crear Cuenta */}
                                <View style={{ marginTop: 35, alignItems: "center", marginBottom: 10 }}>
                                    <Pressable
                                        style={({ pressed }) => [
                                            {
                                                backgroundColor: pressed
                                                    ? 'rgb(210, 230, 255)'
                                                    : '#F4F1BB',
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
                                        <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 16, color: "#5D576B" }}>Crear Cuenta</Text>
                                    </Pressable>
                                </View>
                                {/* Fin Boton Crear Cuenta */}
                            </Center>
                        </NativeBaseProvider>
                    </ScrollView>
                </SafeAreaView>
            )}
        </Formik>
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