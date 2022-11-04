import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Image, Pressable, Text, View } from "react-native";
import { Input, Center, NativeBaseProvider, FormControl, extendTheme, HStack, Link, Icon, Box, VStack, Spacer, Avatar } from "native-base";
import { firebase } from "../database/firebase";
export default function ScreenHome(props) {
    const [productos, setProductos] = useState([]);
    const getProductos = () => {
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
    }
    useEffect(() => {
        getProductos();
    }, []);
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
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.text}>SERVICARS</Text>
            </View>
            <NativeBaseProvider theme={theme}>

                <Center>

                    <View>
                        <Text style={{ fontFamily: "Poppins Bold", fontSize: 16, color: "#ED6A5A" }}>Productos en Oferta</Text>
                    </View>
                    <View style={{ marginTop: 14 }}>
                        <Text style={{ fontFamily: "Poppins SemiBold", fontSize: 15, color: "#5D576B", marginStart: 55, marginEnd: 55, textAlign: 'center' }}>
                            Productos en oferta que puedes comprar en el taller
                        </Text>
                    </View>
                    <Box w="100%" style={{ marginTop: 5,alignItems: 'center' }} rounded="sm" _text={{
                                fontSize: 'md',
                                fontWeight: 'medium',
                                color: 'warmGray.50',
                                textAlign: 'center'
                            }}>
                    <FlatList
                        numColumns={2}
                        data={productos}
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => (
                            <View style={{width: 160, margin: 5, borderRadius: 8,padding: 5,borderColor: 'gray', borderWidth: 1,}}>
                                
                                <View style={{ alignSelf:"center",}}>
                                <Image source={{ uri: item.imagen }} style={{ width: 100, height: 100,borderRadius: 5 }} />
                                </View>
                                <View style={{ alignSelf:"center"}}>
                                    <Text style={{ textAlign:"center"}}>{item.nombre}</Text>
                                </View>
                                <View style={{ alignSelf:"center"}}>
                               <Text>{item.precio} USD <Text style={{ textDecorationLine: 'line-through', color: 'red' }}>{item.precioAnterior != "" ? item.precioAnterior + " USD" : ""}</Text></Text>
                                </View>
                            </View>

                        )}
                    />
                    </Box>
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
        fontSize: 30
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});