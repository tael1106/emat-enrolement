import axios from 'axios';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ClavierNumerique({ navigation } ) {
    const API__URL = "https://oxygene-ci.com/emat";
    /*  const API__URL = "http://192.168.1.128/emat"; */
    const [mecano, setMecano] = useState('');

    const ajouterChiffre = (chiffre: number) => {
        setMecano((prev) => prev + chiffre);
        setMessage(false)
    };

    const effacerDernier = () => {
        setMecano((prev) => prev.slice(0, -1));
        setMessage(false)
    };

    const reinitialiser = () => {
        setMecano('');
        setMessage(false)
    };

    const [message, setMessage] = useState(false)

    const valider = async () => {
        try {
            const url = API__URL + '/enrolement/index.php';
            console.log(url)
            const { data } = await axios.post(url, { mecano });
            console.log(data)
            if (data.success === true) {
                navigation.navigate('home', { userInfo: data.user })
            }
            if (data.success === false) {
                setMessage(true)
            }
        } catch (error) {
            console.error("Erreur:", error);
            /*   setError("Une erreur s'est produite. Veuillez réessayer."); */
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

            <View style={styles.container}>
                {!message
                    ? <Text style={styles.texte1}>Veuillez saisir le mécano</Text>
                    : <Text style={[styles.texte1, { color: 'red' }]}>Le mécano que vous avez saisi est incorrect</Text>
                }




                <TextInput
                    style={styles.input}
                    value={mecano}
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
                    {mecano.length > 3
                        ?
                        <Pressable onPress={valider}
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
    }
});
