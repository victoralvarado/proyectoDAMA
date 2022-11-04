import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Pressable, Text, ToastAndroid, Image, ActivityIndicator, Dimensions } from "react-native";
import { Input, Center, NativeBaseProvider, FormControl, extendTheme, HStack, Box, CheckIcon, Icon, Button, useToast, Slide, Alert, TextArea, Checkbox } from "native-base";
import { Base64 } from 'js-base64';
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from 'formik';
import * as yup from 'yup'
import CryptoJS from "react-native-crypto-js";
import { firebase } from "../database/firebase";
import * as ImagePicker from 'expo-image-picker';
export default function ScreenEditarProducto(props) {
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [error, setError] = useState(null);
    const [showC, setShowC] = React.useState(false);
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(null);
    const [display, setDisplay] = useState("none");
    const [displayImg, setDisplayImg] = useState("none");
    const productRef = firebase.firestore().collection("productos").doc(props.route.params.productId);
    const initialState = {
        id: "",
        nombre: "",
        marca: "",
        cantidad: "",
        precio: "",
        imagen: "",
        precioAnterior: "",
        detalle: "",
        activo: "",
    };

    const [product, setProduct] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const getProductById = async (id) => {
        const dbRef = firebase.firestore().collection("productos").doc(id);
        const doc = await dbRef.get();
        const product = doc.data();
        setProduct({ ...product, id: doc.id });
        setLoading(false);
    };

    useEffect(() => {
        getProductById(props.route.params.productId);
    }, []);
    const uploadImage = async (nombre, marca, cantidad, precio, precioAnterior, detalle, activo,imagenAnterior) => {
        setError(null);
        setUploading(true);
        const response = await fetch(image.uri)
        const blob = await response.blob();
        const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
        var ref = firebase.storage().ref().child(filename).put(blob);
        try {
            await ref;
        } catch (e) {
            console.log(e);
        }
        setUploading(false);
        
        setImage(null);
        fetch('https://firebasestorage.googleapis.com/v0/b/reservacionrn.appspot.com/o/' + filename)
            .then(res => res.json())
            .then((data) => dataimg(data));
        function dataimg(data) {
            productRef.set({
                nombre: nombre,
                marca: marca,
                cantidad: cantidad,
                precio: precio,
                precioAnterior: precioAnterior,
                detalle: detalle,
                imagen: 'https://firebasestorage.googleapis.com/v0/b/reservacionrn.appspot.com/o/' + filename + '?alt=media&token=' + data.downloadTokens,
                activo: activo
            })
        }

        var desertRef = firebase.storage().ref().child(imagenAnterior.substring(imagenAnterior.lastIndexOf('/') + 1,imagenAnterior.lastIndexOf('?')));
        desertRef.delete().then(() => {
            console.log('File deleted successfully');
          }).catch((error) => {
            console.log('Uh-oh, an error occurred!');
          });

    };
    const SignupSchema = yup.object().shape({
        nombre: yup
            .string()
            .required('El nombre es requerido'),
        marca: yup
            .string()
            .required('La marca es requerida'),
        cantidad: yup
            .number()
            .min(1, "La cantidad minima de producto es 1")
            .integer('Por favor, Digite una cantidad valida!')
            .required('La cantidad es requerida')
            .typeError('Por favor, Digite una cantidad valida!'),
        precio: yup
            .number('Por favor, Digite un precio valido!')
            .min(0.05, 'Por favor, Digite un precio mayor o igual a 0.05')
            .typeError('Por favor, Digite un precio valido!')
            .required('El precio es requerido'),
        precioAnterior: yup
            .number('Por favor, Digite un precio valido!')
            .min(0.05, 'Por favor, Digite un precio mayor o igual a 0.05')
            .typeError('Por favor, Digite un precio valido!'),
        detalle: yup
            .string(),
    });
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            }
        );

        const source = { uri: result.uri };
        console.log(source);
        setImage(source);
        if (source.uri == undefined) {
            setDisplayImg("flex")
            setDisplay("none")
        } else {
            setDisplayImg("none")
            setDisplay("none")
        }
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
    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#9E9E9E" />
            </View>
        );
    }
    return (
        <Formik
            initialValues={{
                nombre: product.nombre,
                marca: product.marca,
                cantidad: product.cantidad,
                precio: product.precio,
                precioAnterior: product.precioAnterior,
                detalle: product.detalle,
                activo: product.activo,
                image: product.imagen,
            }}
            validationSchema={SignupSchema}
            onSubmit={values => {
                setDisplay("none")
                setDisplayImg("none")
                if (image != null) {
                    if (image.uri == undefined) {
                        setDisplay("none")
                        setDisplayImg("flex")
                    } else {
                        setDisplay("none")
                        setDisplayImg("none")
                        let timeout;
                        setIsOpenTop(true)
                        uploadImage(values.nombre, values.marca, values.cantidad, values.precio, values.precioAnterior, values.detalle, values.activo, values.image)
                        timeout = setTimeout(alertFunc, 1500);


                        function alertFunc() {
                            props.navigation.goBack();
                        }
                    }
                } else {
                    let timeout;
                    setIsOpenTop(true)
                    productRef.set({
                        nombre: values.nombre,
                        marca: values.marca,
                        cantidad: values.cantidad,
                        precio: values.precio,
                        precioAnterior: values.precioAnterior,
                        detalle: values.detalle,
                        activo: values.activo,
                        imagen: values.image,
                    })
                    timeout = setTimeout(alertFunc, 1500);


                    function alertFunc() {
                        props.navigation.goBack();
                    }
                }

            }}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', }} style={styles.scrollView}>
                        <NativeBaseProvider theme={theme}>
                            <Center>
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
                                                Producto modificado correctamente
                                            </Text>
                                        </HStack>
                                    </Box>
                                </Slide>
                                <View>
                                    <Text style={styles.text}>Editar Producto</Text>
                                </View>
                                <View style={{ width: '90%', }}>
                                    <FormControl isRequired>
                                        <FormControl.Label>Nombre</FormControl.Label>

                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Nombre producto"
                                            value={values.nombre}
                                            onChangeText={handleChange('nombre')}
                                            onBlur={() => setFieldTouched('nombre')}
                                        />
                                    </FormControl>

                                    {
                                        touched.nombre && errors.nombre &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.nombre}</Text>
                                    }
                                    <FormControl isRequired>
                                        <FormControl.Label>Marca</FormControl.Label>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Marca producto"
                                            value={values.marca}
                                            onChangeText={handleChange('marca')}
                                            onBlur={() => setFieldTouched('marca')}
                                        />
                                    </FormControl>
                                    {
                                        touched.marca && errors.marca &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.marca}</Text>
                                    }
                                    <FormControl isRequired>
                                        <FormControl.Label>Cantidad</FormControl.Label>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Cantidad producto"
                                            value={values.cantidad}
                                            onChangeText={handleChange('cantidad')}
                                            onBlur={() => setFieldTouched('cantidad')}
                                        />
                                    </FormControl>
                                    {
                                        touched.cantidad && errors.cantidad &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.cantidad}</Text>
                                    }
                                    <FormControl isRequired>
                                        <FormControl.Label>Precio</FormControl.Label>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Precio producto"
                                            value={values.precio}
                                            onChangeText={handleChange('precio')}
                                            onBlur={() => setFieldTouched('precio')}
                                        />
                                    </FormControl>
                                    {
                                        touched.precio && errors.precio &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.precio}</Text>
                                    }
                                    <FormControl isRequired>
                                        <FormControl.Label>Imagen</FormControl.Label>
                                        {image == null ? <Image source={{ uri: values.image }} style={{ width: 50, height: 50 }} /> : image && <Image source={{ uri: image.uri }} style={{ width: 50, height: 50 }} />}
                                        <Button onPress={pickImage}
                                            _pressed={{
                                                bg: "primary.5"
                                            }}
                                            _text={{
                                                color: "primary.1",
                                                fontFamily: "Poppins SemiBold"
                                            }}
                                            bg="primary.2"
                                        >
                                            Seleccionar Imagen
                                        </Button>
                                    </FormControl>
                                    <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium', display: display }}>Seleccione una imagen</Text>
                                    <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium', display: displayImg }}>No se selecciono una imagen, vuelva a selccionarla</Text>
                                    <FormControl>
                                        <FormControl.Label>Precio Anterior</FormControl.Label>
                                        <Input
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            size="2xl"
                                            variant="outline"
                                            placeholder="Precio anterior producto"
                                            value={values.precioAnterior}
                                            onChangeText={handleChange('precioAnterior')}
                                            onBlur={() => setFieldTouched('precioAnterior')}
                                        />
                                    </FormControl>
                                    {
                                        touched.precioAnterior && errors.precioAnterior &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.precioAnterior}</Text>
                                    }
                                    <FormControl>
                                        <FormControl.Label>Detalle</FormControl.Label>
                                        <TextArea
                                            style={{ color: "#5D576B", fontFamily: "Poppins Regular" }}
                                            size="2xl"
                                            h={20} placeholder="Detalle" w="100%"
                                            value={values.detalle}
                                            onChangeText={handleChange('detalle')}
                                            onBlur={() => setFieldTouched('detalle')}
                                        />
                                    </FormControl>
                                    {
                                        touched.detalle && errors.detalle &&
                                        <Text style={{ fontSize: 12, color: '#ED6A5A', fontFamily: 'Poppins Medium' }}>{errors.detalle}</Text>
                                    }

                                    <FormControl>
                                        <FormControl.Label>Activo</FormControl.Label>
                                        <Checkbox value='1'
                                            onChange={state => {
                                                if (state) {
                                                    values.activo = '1'
                                                } else {
                                                    values.activo = '0'
                                                }
                                            }
                                            }
                                            shadow={1} accessibilityLabel="Activo" defaultIsChecked={values.activo == '1' ? true : false} >
                                            Activo
                                        </Checkbox>
                                    </FormControl>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 5 }}>
                                        <Button disabled={!isValid} onPress={handleSubmit}
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
                                        <Button style={{ marginLeft: 5 }} onPress={() => props.navigation.goBack()}
                                            _pressed={{
                                                bg: "primary.5"
                                            }}
                                            _text={{
                                                color: "primary.4",
                                                fontFamily: "Poppins SemiBold"
                                            }}
                                            bg="primary.1"
                                        >
                                            Cancelar
                                        </Button>
                                    </View>

                                </View>
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
        flexDirection: 'column',
        backgroundColor: "#FFF",
        paddingTop: 0,
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
        fontSize: 32
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});