import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const MAX_WIDTH = Math.round(Dimensions.get('screen').width)
const MAX_HEIGHT = Math.round(Dimensions.get('screen').height)
const API__URL = "http://oxygene-ci.com/emat";
/* const API__URL = "http://192.168.1.128/emat"; */

export default function HomeScreen({ navigation, route }) {
    const { userInfo } = route.params;

    const [user, setUser] = useState({
        id_personnel: false,
        image_profil: false,
        nom_user: false,
        prenom_user: false,
        sigle: false,
        telephone: false,
        telephone_2: false
    })

    const [display, setDisplay] = useState('root')

    const [telephoneEdit, setTelephoneEdit] = useState('');
    const [telephoneCible, setTelephoneCible] = useState('');
    const [message, setMessage] = useState('');


    const recuperationInfo = async () => {
        setUser(userInfo)
        console.log(userInfo)
    }
    useEffect(() => {
        recuperationInfo()
    }, [])


    const formatNumero = (numero) => {
        // S'assurer que c'est une string
        const str = String(numero);

        // Regrouper par paires
        return str.replace(/(\d{2})(?=\d)/g, '$1.').trim();
    };


    const takePhoto = async () => {
        // Demande la permission d'utiliser la caméra
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission requise', 'L\'application a besoin de la permission pour utiliser la caméra.');
            return;
        }

        // Lance la caméra
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1
        });
        /*  console.log(result) */
        if (result.canceled) {
            /*     captureImage(null, 'cancel') */
            console.log('Capture Camera # cancel')
        } else {
            const photoUri = result.assets[0].uri;
            console.log('photoUri ', photoUri)
            uploadImage(photoUri)
            /*  setImageUri(photoUri); */
        }
    };

    const uploadImage = async (uri: any) => {
        const formData = new FormData();
        formData.append('file', {
            uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });
        formData.append('id_personnel', user.id_personnel as any)


        try {
            const response = await fetch('http://oxygene-ci.com/emat/img/profile.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const reponse = await response.json();
            console.log(reponse);

            if (reponse.success === true) {
                setUser(prevUser => ({
                    ...prevUser,
                    image_profil: reponse.image
                }));

            }
        } catch (error) {
            console.log('Erreur lors de l\'upload : ', error);
        }
    };


    const ajouterChiffre = (chiffre: number) => {
        setTelephoneEdit((prev) => prev + chiffre);
        /*   setMessage(false) */
    };

    const effacerDernier = () => {
        setTelephoneEdit((prev) => prev.slice(0, -1));
        /*  setMessage(false) */
    };

    const reinitialiser = () => {
        setTelephoneEdit('');
        /*  setMessage(false) */
    };

    const updateContact = async () => {
        console.log('telephoneCibleddd : ', telephoneCible)
        console.log('telephoneEdit : ', telephoneEdit.length)
        console.log('substring : ', telephoneEdit.substring(0, 10))

        
        try {
            const url = API__URL + '/enrolement/ajouter_contact.php';
            console.log(url)
            const { data } = await axios.post(url, { telephone: telephoneEdit.substring(0, 10), telephoneCible, id_personnel: user.id_personnel });
            console.log(data)
            if (data.success) {

                if (telephoneCible == '1') {
                    setUser(prevUser => ({ ...prevUser, telephone: telephoneEdit.substring(0, 10) }));
                    setTelephoneEdit('')
                    setTelephoneCible('')
                    setDisplay('root')
                }
                if (telephoneCible == '2') {
                    setUser(prevUser => ({ ...prevUser, telephone_2: telephoneEdit.substring(0, 10) }));
                    setTelephoneEdit('')
                    setTelephoneCible('')
                    setDisplay('root')
                }
            } else {
                setMessage(true)
            }

        } catch (error) {
            console.error("Erreur:", error);

        }


    }
    return (
        <View style={{ flex: 1, }}>
            <View style={{
                height: 100,
                backgroundColor: '#596643',
                marginBottom: 20,
            }}>
                <View style={{ marginTop: 50 }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.titre}>EMAT | ENROLEMENT </Text>
                </View>
            </View>
            {display === 'root'
                &&
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', margin: 5 }}>
                        <Pressable
                            onPress={() => navigation.navigate('index')}
                        >
                            <Ionicons name="home" size={40} color="#333" />
                        </Pressable>

                        <View style={{ flex: 1, marginLeft: 20 }}>

                            <View

                                style={{ backgroundColor: '#CDD5BF', width: '100%', borderRadius: 10 }} >
                                <View style={{ margin: 5, justifyContent: 'center', alignItems: 'left' }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{"   "}{user.sigle} </Text >
                                    <Text>{"  "}{user.nom_user} {user.prenom_user}</Text >
                                </View>
                            </View>



                        </View>

                    </View>
                    <View style={{ marginTop: 30 }}>
                        {!user.image_profil
                            ? <Image style={styles.icon_selected} source={require('./assets/avatar.png')} />
                            : <Image style={styles.icon_selected}
                                source={{ uri: 'https://oxygene-ci.com/emat/img/profile/' + user.image_profil }}
                            />
                        }
                    </View>

                    <Pressable
                        style={{
                            marginTop: -50,
                            marginLeft: 100,
                            backgroundColor: '#000',
                            borderRadius: 50,
                            borderWidth: 4,
                            borderColor: 'white',
                            padding: 10
                        }}
                        onPress={() => { takePhoto() }}
                    >
                        <MaterialCommunityIcons name='camera' size={30} color="#fff" />
                    </Pressable>


                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                        <Text style={{ textTransform: 'uppercase', }}>Contacts téléphoniques</Text>




                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Pressable
                            style={{ flex: 1, alignItems: 'center' }}
                            onPress={() => {
                                setDisplay('telephone')
                                setTelephoneCible('1')

                            }}
                        >
                            <Text style={styles.contact}>{formatNumero(user.telephone)}</Text>
                        </Pressable>
                        <Pressable
                            style={{ flex: 1, alignItems: 'center' }}
                            onPress={() => {
                                setDisplay('telephone')
                                setTelephoneCible('2')

                            }}
                        >
                            <Text style={styles.contact}>{formatNumero(user.telephone_2)}</Text>
                        </Pressable>
                    </View>
                </View>
            }

            {display === 'telephone'
                &&
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', margin: 5 }}>
                        <Pressable
                            onPress={() => {
                                setDisplay('root')
                                setTelephoneCible('')
                                setTelephoneEdit('')
                            }}
                        >
                            <Ionicons name="close" size={40} color="#333" />
                        </Pressable>

                        <View style={{ flex: 1, marginLeft: 20 }}>
                            <View

                                style={{ backgroundColor: '#CDD5BF', width: '100%', borderRadius: 10 }} >
                                <View style={{ margin: 5, justifyContent: 'center', alignItems: 'left' }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{"   "}{user.sigle} </Text >
                                    <Text>{"  "}{user.nom_user} {user.prenom_user}</Text >
                                </View>
                            </View>



                        </View>

                    </View>





                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        {!message
                            ? <Text style={{ textTransform: 'uppercase', }}>Modifier le contact téléphonique</Text>
                            : <Text style={{ fontSize: 12, color: "red" }}>Une erreur s'est produite durant l'enregistrement.</Text>
                        }
                    </View>
                    <TextInput
                        style={styles.input}
                        value={telephoneEdit}
                        editable={false}
                        maxLength={10}
                        placeholder='- - - - - -'

                    />

                    <View style={styles.clavier}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <TouchableOpacity key={num} style={styles.bouton} onPress={() => ajouterChiffre(Number(num))}>
                                <Text style={styles.texte}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.bouton} onPress={effacerDernier}>
                            <Text style={styles.texte}>←</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bouton} onPress={() => ajouterChiffre(0)}>
                            <Text style={styles.texte}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bouton} onPress={reinitialiser}>
                            <Text style={styles.texte}>C</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 20 }}>
                        {telephoneEdit.length > 9
                            ?
                            <Pressable onPress={updateContact}
                                style={{ backgroundColor: '#596643', width: '100%', borderRadius: 10 }} >
                                <View style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.titre}>VALIDER</Text>
                                </View>
                            </Pressable>
                            :
                            <Pressable

                                style={{ backgroundColor: '#333', width: '100%', borderRadius: 10 }} >
                                <View style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.titre}>VALIDER</Text>
                                </View>
                            </Pressable>
                        }

                    </View>
                </View>
            }

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // prend tout l'espace de l'écran
        alignItems: 'center', // centre horizontalement
        backgroundColor: '#f2f2f2',
    },
    input: {
        /*    width: '80%', */
        /* height: 50, */
        borderWidth: 1,
        borderColor: '#f2f2f2',
        borderRadius: 10,
        fontSize: 60,
        textAlign: 'center',
        paddingHorizontal: 15,
        marginBottom: 20
    },
    clavier: {
        width: '80%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    bouton: {
        width: '30%',
        paddingVertical: 15,
        backgroundColor: '#ddd',
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 10,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,

        borderColor: "#d9dada",
        borderStyle: 'solid',
        borderWidth: 3,
    },
    titre: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#fff"
    },
    texte1: {
        fontSize: 16,
        color: '#999'

    },
    texte: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    contact: {
        fontSize: 22,
        fontWeight: 'bold'
    }
    , icon_selected: {
        width: MAX_WIDTH * 0.5,
        height: MAX_WIDTH * 0.5,
        borderRadius: 999,
        borderColor: "#fff",
        backgroundColor: "#9ca1ac",
        borderWidth: 1
    },
});
