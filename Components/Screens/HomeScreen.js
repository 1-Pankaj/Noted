import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Portal, Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../Elements/Theme/Colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from 'react-native-render-html';

const HomeScreen = ({ navigation }) => {
    const [data, setData] = useState(null);
    const [buttonEnabled, setButtonEnabled] = useState(true);

    const GetData = async () => {
        try {
            const rs = await AsyncStorage.getItem('notes');
            if (rs !== null) {
                const noteData = JSON.parse(rs);
                setData(noteData);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const navigationRef = useNavigation();

    useEffect(() => {
        const unsubscribe = navigationRef.addListener('state', (rs) => {
            GetData();
            if (rs.data.state.routes.length == 1) {
                setButtonEnabled(true);
            }
        });

        return unsubscribe;
    }, [navigationRef]);

    const truncateHTML = (htmlContent, maxLength) => {
        if (htmlContent.length > maxLength) {
            return htmlContent.substring(0, maxLength) + '...';
        }
        return htmlContent;
    };

    const customRenderers = {
        input: (attribs) => {
            if (attribs.type === "checkbox") {
                return (
                    <View style={styles.checkboxContainer}>
                        <Text>{attribs.checked === "true" ? "☑" : "☐"}</Text>
                    </View>
                );
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {data ?
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-evenly',
                        width: Dimensions.get('window').width
                    }}>
                        <View>
                            {data.map((item, index) => {
                                return (
                                    index % 2 == 0 ?
                                        <View key={index}>
                                            <TouchableRipple onPress={() => {
                                                console.log(item.note);
                                            }} style={{
                                                backgroundColor: item.bg === "#FFF" ? Colors.blue : item.bg,
                                                width: Dimensions.get('window').width / 2.3,
                                                margin: 10, padding: 10, borderRadius: 15, minHeight: 150, maxHeight: 300
                                            }}>
                                                <RenderHTML
                                                    contentWidth={Dimensions.get('window').width / 2.3}
                                                    source={{ html: truncateHTML(item.note, 55) }}
                                                    tagsStyles={htmlStyles}
                                                    customHTMLElementModels={{
                                                        span: { block: false },
                                                        u: { block: false },
                                                        i: { block: false }
                                                    }}
                                                    renderers={customRenderers}
                                                />
                                            </TouchableRipple>
                                        </View>
                                        :
                                        null
                                )
                            })}
                        </View>
                        <View>
                            {data.map((item, index) => {
                                return (
                                    index % 2 != 0 ?
                                        <View key={index}>
                                            <TouchableRipple onPress={() => {
                                                console.log(item.note);
                                            }} style={{
                                                backgroundColor: item.bg === "#FFF" ? Colors.blue : item.bg,
                                                width: Dimensions.get('window').width / 2.3,
                                                margin: 10, padding: 10,
                                                borderRadius: 15, minHeight: 150,
                                                 maxHeight: 300
                                            }}>
                                                <RenderHTML
                                                    contentWidth={Dimensions.get('window').width / 2.3}
                                                    source={{ html: truncateHTML(item.note, 55) }}
                                                    tagsStyles={htmlStyles}
                                                    customHTMLElementModels={{
                                                        span: { block: false },
                                                        u: { block: false },
                                                        i: { block: false }
                                                    }}
                                                    renderers={customRenderers}
                                                />
                                            </TouchableRipple>
                                        </View>
                                        :
                                        null
                                )
                            })}
                        </View>
                    </View>
                    :
                    <View></View>}
            </ScrollView>

            {buttonEnabled ?
                <Portal>
                    <TouchableRipple borderless onPress={() => {
                        navigation.navigate('Notepad');
                        setButtonEnabled(false);
                    }} style={{
                        width: '80%', height: 64, backgroundColor: 'black',
                        alignItems: 'center', justifyContent: 'center',
                        borderRadius: 25, elevation: 20, position: 'absolute', bottom: 30,
                        alignSelf: 'center'
                    }} android_ripple={true} >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>
                                CREATE NEW NOTE
                            </Text>
                            <MaterialIcons name="add" color="white" size={22} style={{ marginStart: 10, marginTop: 2 }} />
                        </View>
                    </TouchableRipple>
                </Portal>
                :
                null}
        </SafeAreaView>
    );
};

const htmlStyles = {
    h1: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    span: {
        fontSize: 14,
        color: '#333',
    },
    u: {
        textDecorationLine: 'underline',
    },
    i: {
        fontStyle: 'italic',
    },
    input: {
        margin: 5,
    },
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default HomeScreen;
