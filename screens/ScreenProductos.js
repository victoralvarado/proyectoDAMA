import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, View, Pressable, Text, Alert, Image, Dimensions } from "react-native";
import { Input, Center, NativeBaseProvider, Checkbox, Modal, IconButton, VStack, Tooltip, Button, FormControl, TextArea, extendTheme, Box, Select, CheckIcon, HStack, Link } from "native-base";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup'
import { ListItem, Icon } from "react-native-elements";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { firebase } from "../database/firebase";
import * as ImagePicker from 'expo-image-picker';
import { log } from "react-native-reanimated";
export default function ScreenProductos(props) {
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [urlImage, setUrlImage] = useState(null);
    const [display, setDisplay] = useState("none");
    const [displayImg, setDisplayImg] = useState("none");
    const [productos, setProductos] = useState([]);
    useEffect(() => {
        firebase.firestore().collection("productos").onSnapshot((querySnapshot) => {
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
    }, []);
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

    const uploadImage = async (nombre, marca, cantidad, precio, precioAnterior, detalle, activo) => {
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
            firebase.firestore().collection("productos").add({
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
    const deleteProduct = (id, imagen) => {
        firebase.firestore().collection("productos").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        var desertRef = firebase.storage().ref().child(imagen.substring(imagen.lastIndexOf('/') + 1, imagen.lastIndexOf('?')));
        desertRef.delete().then(() => {
            console.log('File deleted successfully');
        }).catch((error) => {
            console.log('Uh-oh, an error occurred!');
        });
    };
    const openConfirmationAlert = (id, imagen) => {
        Alert.alert(
            "Eliminar Producto",
            "¿Esta seguro que desea eiliminar el producto?",
            [
                { text: "Si", onPress: () => deleteProduct(id, imagen) },
                { text: "No", onPress: () => console.log("canceled") },
            ],
            {
                cancelable: true,
            }
        );
    };
    const handleShowM = () => {
        setShowModal(true);
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
    return (
        <Formik
            initialValues={{
                nombre: '',
                marca: '',
                cantidad: '',
                precio: '',
                precioAnterior: '',
                detalle: '',
                activo: '1',
            }}
            validationSchema={SignupSchema}
            onSubmit={values => {
                console.log(image)
                if (image == null) {
                    setDisplay("flex")
                } else if (image.uri == undefined) {
                    setDisplay("none")
                    setDisplayImg("flex")
                } else {
                    setDisplay("none")
                    setDisplayImg("none")
                    uploadImage(values.nombre, values.marca, values.cantidad, values.precio, values.precioAnterior, values.detalle, values.activo)
                    let timeout;
                    timeout = setTimeout(alertFunc, 1500);
                    function alertFunc() {
                        setShowModal(false);
                        values.nombre = '';
                        values.marca = '';
                        values.cantidad = '';
                        values.precio = '';
                        values.precioAnterior = '';
                        values.detalle = '';
                        setImage(null);
                    }

                }

            }}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                <SafeAreaView style={styles.scrollView}>
                    <NativeBaseProvider theme={theme}>
                        <Center>
                            <View>
                                <Text style={styles.text}>Productos</Text>
                            </View>
                            <View style={{ marginTop: 14 }}>
                                <Text style={{ fontFamily: "Poppins Medium", fontSize: 16, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                                    Lista de productos
                                </Text>
                                <VStack style={{ marginTop: 5 }} space={4} alignItems="center">
                                    <Tooltip label="Nuevo Producto" >
                                        <Button onPress={handleShowM}
                                            _pressed={{
                                                bg: "primary.5"
                                            }}
                                            alignSelf="center" _text={{
                                                color: "primary.1",
                                                fontFamily: "Poppins SemiBold"
                                            }} bg="primary.2" >Agregar Nuevo Producto</Button>
                                    </Tooltip>
                                </VStack>
                            </View>
                            <Box w="95%" style={{ marginTop: 5 }} rounded="sm" _text={{
                                fontSize: 'md',
                                fontWeight: 'medium',
                                color: 'warmGray.50',
                                textAlign: 'center'
                            }}>
                                {
                                    productos.sort(((a, b) => a.nombre - b.nombre)).map((pr) => {
                                        return (
                                            <ListItem
                                                key={pr.id}
                                                containerStyle={{ borderColor: 'gray', borderWidth: 1, borderRadius: 4, padding: 0, marginTop: 2 }}
                                            >
                                                <ListItem.Chevron />
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ color: "#5D576B", fontSize: 15, fontFamily: "Poppins Bold" }}>{pr.nombre}</ListItem.Title>
                                                    <ListItem.Subtitle style={{ color: "#5D576B" }}>Marca: {pr.marca}</ListItem.Subtitle>
                                                    <ListItem.Subtitle style={{ color: "#5D576B" }}>Activo: <Text style={{ color: pr.activo == "1" ? "green" : "red" }}>{pr.activo == "1" ? "✔" : "✘"}</Text></ListItem.Subtitle>
                                                    <ListItem.Subtitle style={{ color: "#5D576B" }}>
                                                        Precio: {pr.precio} USD <Text style={{ textDecorationLine: 'line-through', color: 'red' }}>{pr.precioAnterior != "" ? pr.precioAnterior + " USD" : ""}</Text>
                                                    </ListItem.Subtitle>
                                                </ListItem.Content>
                                                <Image source={{ uri: pr.imagen }} style={{ width: 50, height: 50 }} />
                                                <Icon
                                                    raised
                                                    name='file-edit'
                                                    type='material-community'
                                                    color='green'
                                                    size={20}
                                                    onPress={() => { props.navigation.navigate("ScreenEditarProducto", { productId: pr.id, }) }} />
                                                <Icon
                                                    raised
                                                    name='delete'
                                                    type='material-community'
                                                    color='red'
                                                    size={20}
                                                    onPress={() => openConfirmationAlert(pr.id,pr.imagen)} />
                                            </ListItem>
                                        );
                                    })

                                }
                            </Box>
                            <Modal isOpen={showModal} onClose={() => setShowModal(false)} style={{ width: '100%' }}>
                                <Modal.Content maxWidth="400px">
                                    <Modal.CloseButton />
                                    <Modal.Header>
                                        <Text style={{ textTransform: 'capitalize', fontSize: 20 }}>
                                            Producto
                                        </Text>
                                    </Modal.Header>
                                    <Modal.Body>
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
                                            {
                                                image && <Image source={{ uri: image.uri }} style={{ width: 50, height: 50 }} />}
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
                                                h={20} placeholder="Detalle" w="100%" maxW="300"
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
                                                shadow={1} accessibilityLabel="Activo" defaultIsChecked >
                                                Activo
                                            </Checkbox>
                                        </FormControl>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button.Group space={2}>
                                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                                setShowModal(false);
                                                values.nombre = '';
                                                values.marca = '';
                                                values.cantidad = '';
                                                values.precio = '';
                                                values.precioAnterior = '';
                                                values.detalle = '';
                                                setImage(null);
                                            }}
                                                _text={{
                                                    color: "primary.1",
                                                    fontFamily: "Poppins SemiBold"
                                                }}
                                            >
                                                Cancelar
                                            </Button>
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
                                                Agregar
                                            </Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                        </Center>
                    </NativeBaseProvider>
                </SafeAreaView>
            )
            }
        </Formik >
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