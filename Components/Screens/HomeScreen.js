import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { Portal, Text, TouchableRipple, TextInput as TextInputPaper } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../Elements/Theme/Colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from 'react-native-render-html';

import { ThemedButton } from 'react-native-really-awesome-button'

import { BlurView } from 'expo-blur'

import AnimatedSearchBox from "@ocean28799/react-native-animated-searchbox";
import { ExpandableSection } from "react-native-ui-lib";
import { StatusBar } from "expo-status-bar";

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



    const OpenNotepad = () => {
        navigation.navigate('Notepad');
        setButtonEnabled(false);
    }

    const refSearchBox = useRef();

    const [open, setOpen] = useState(false)

    const openSearchBox = () => {
        setOpen(true)
        refSearchBox.current.open();
    }


    const closeSearchBox = () => {


        setOpen(false)
        refSearchBox.current.close();
    }

    const EditNote = (note) => {
        navigation.navigate('Notepad', {
            noteData:note
        });
        setButtonEnabled(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: "#f7fbfe" }}>

            {buttonEnabled ?
                <Portal>
                    <SafeAreaView>
                        <BlurView style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%',
                            alignSelf: 'center', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 20, overflow: 'hidden',
                            marginTop: 10
                        }} intensity={100} experimentalBlurMethod="dimezisBlurView">
                            <TouchableRipple onPress={() => { }}
                                borderless style={{
                                    borderRadius: 30, width: 40, height: 40,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                <MaterialIcons name="view-carousel" size={30} />
                            </TouchableRipple>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit Note</Text>
                            <TouchableRipple onPress={() => {
                                setOpen(!open)
                            }}
                                borderless style={{
                                    borderRadius: 30, width: 40, height: 40,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                <MaterialIcons name="search" size={30} />
                            </TouchableRipple>
                        </BlurView>
                    </SafeAreaView>
                </Portal>
                :
                null
            }
            <View style={{ width: '100%', alignItems: 'center' }}>


            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {data ?
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-evenly',
                        width: Dimensions.get('window').width, marginBottom: 200, marginTop: 90
                    }}>
                        <View>
                            {data.map((item, index) => {
                                return (
                                    index % 2 == 0 ?
                                        <View key={index}>
                                            <TouchableOpacity onPress={() => {
                                                EditNote(item)
                                            }} style={{
                                                backgroundColor: item.bg === "#FFF" ? Colors.blue : item.bg,
                                                width: Dimensions.get('window').width / 2.3,
                                                margin: 10, padding: 10, borderRadius: 15, minHeight: 150, maxHeight: 350
                                            }} activeOpacity={0.6} >
                                                <RenderHTML
                                                    contentWidth={Dimensions.get('window').width / 2.3}
                                                    source={{ html: truncateHTML(item.note, 55) }}
                                                    tagsStyles={htmlStyles} baseStyle={{ maxHeight: 300, minHeight: 100 }}
                                                />
                                            </TouchableOpacity>
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
                                            <TouchableOpacity onPress={() => {
                                                EditNote(item)
                                            }} style={{
                                                backgroundColor: item.bg === "#FFF" ? Colors.blue : item.bg,
                                                width: Dimensions.get('window').width / 2.3,
                                                margin: 10, padding: 10,
                                                borderRadius: 15, minHeight: 150,
                                                maxHeight: 350
                                            }} activeOpacity={0.6}>
                                                <RenderHTML
                                                    contentWidth={Dimensions.get('window').width / 2.3}
                                                    source={{ html: truncateHTML(item.note, 55) }}
                                                    tagsStyles={htmlStyles}
                                                />
                                            </TouchableOpacity>
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
                    <View style={{
                        position: 'absolute', alignItems: 'center', justifyContent: 'center',
                        bottom: 20, left: 0, right: 0
                    }}>
                        <ThemedButton name="rick" onPress={() => { OpenNotepad() }}
                            size="large" textSize={16} textColor="white" backgroundColor="black" backgroundDarker="#414141" >
                            Create a new Note
                        </ThemedButton>
                    </View>
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
    }
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default HomeScreen;
