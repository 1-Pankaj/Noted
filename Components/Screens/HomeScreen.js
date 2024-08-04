import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Portal, Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../Elements/Theme/Colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from 'react-native-render-html';

import { ThemedButton } from 'react-native-really-awesome-button'

import { BlurView } from 'expo-blur'

import { StatusBar } from "expo-status-bar";
import { FadeInLeft, FadeInRight, FadeInUp, FadeOutDown, FadeOutLeft, FadeOutRight, ZoomInEasyDown } from "react-native-reanimated";
import { Stagger } from "@animatereactnative/stagger";

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

    const [searchText, setSearchText] = useState("")



    const OpenNotepad = () => {
        navigation.navigate('Notepad');
        setButtonEnabled(false);
    }

    const [open, setOpen] = useState(false)



    const EditNote = (note) => {
        navigation.navigate('Notepad', {
            noteData: note
        });
        setButtonEnabled(false);
    }

    const SearchInArray = (txt) => {
        setSearchText(txt)
        GetData().then(() => {
            if (txt && data != null) {
                const filtered = data.filter(item => item.note.toLowerCase().includes(txt.toLowerCase()));
                setData(filtered);
            } else {
                GetData()
            }
        })

    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: "#f7fbfe" }}>
            <StatusBar translucent />
            {buttonEnabled ?
                <Portal>
                    <SafeAreaView>
                        {
                            open ?

                                <BlurView style={{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%',
                                    alignSelf: 'center', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 20, overflow: 'hidden',
                                    marginTop: 10
                                }} intensity={100} experimentalBlurMethod="dimezisBlurView">
                                    <Stagger
                                        stagger={2}
                                        duration={1000}
                                        exitDirection={-1}
                                        entering={() => FadeInLeft.springify()}
                                        exiting={() => FadeOutRight.springify()}
                                        style={{
                                            alignItems: 'center', flexDirection: 'row',
                                            justifyContent: 'space-between', width: '100%'
                                        }}>
                                        <TouchableOpacity onPress={() => {
                                            if (open) {
                                                setOpen(!open)
                                                setSearchText("")
                                                GetData()
                                            } else {
                                                setOpen(!open)
                                                setSearchText("")
                                            }
                                        }} hitSlop={20}
                                            borderless style={{
                                                borderRadius: 30, width: 40, height: 40,
                                                alignItems: 'center', justifyContent: 'center'
                                            }} activeOpacity={0.6}>
                                            <MaterialIcons name="search" size={30} />
                                        </TouchableOpacity>
                                        <TextInput placeholder="Search Here" style={{ flex: 1, marginStart: 10 }}
                                            value={searchText} onChangeText={(txt) => { SearchInArray(txt) }}
                                            cursorColor="black" autoFocus />
                                    </Stagger>
                                </BlurView>
                                :
                                <BlurView style={{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%',
                                    alignSelf: 'center', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 20, overflow: 'hidden',
                                    marginTop: 10
                                }} intensity={100} experimentalBlurMethod="dimezisBlurView">
                                    <Stagger
                                        stagger={0}
                                        duration={500}
                                        exitDirection={-1}
                                        entering={() => FadeInRight.springify()}
                                        exiting={() => FadeOutLeft.springify()}
                                        style={{
                                        }}>
                                        <TouchableOpacity onPress={() => { }}
                                            borderless hitSlop={20} style={{
                                                borderRadius: 30, width: 40, height: 40,
                                                alignItems: 'center', justifyContent: 'center'
                                            }} activeOpacity={0.6}>
                                            <MaterialIcons name="view-carousel" size={30} />
                                        </TouchableOpacity>
                                    </Stagger>
                                    <Stagger
                                        stagger={0}
                                        duration={500}
                                        exitDirection={-1}
                                        entering={() => FadeInRight.springify()}
                                        exiting={() => FadeOutLeft.springify()}
                                        style={{
                                        }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit Note</Text>
                                    </Stagger>
                                    <Stagger
                                        stagger={0}
                                        duration={500}
                                        exitDirection={-1}
                                        entering={() => FadeInRight.springify()}
                                        exiting={() => FadeOutLeft.springify()}
                                        style={{
                                        }}>
                                        <TouchableOpacity onPress={() => {
                                            setOpen(!open)
                                        }}
                                            borderless hitSlop={20} style={{
                                                borderRadius: 30, width: 40, height: 40,
                                                alignItems: 'center', justifyContent: 'center'
                                            }} activeOpacity={0.6}>
                                            <MaterialIcons name="search" size={30} />
                                        </TouchableOpacity>
                                    </Stagger>
                                </BlurView>
                        }
                    </SafeAreaView>
                </Portal>
                :
                null
            }
            <View style={{ width: '100%', alignItems: 'center' }}>


            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {data ?
                    data.length === 1 ?
                        <Stagger
                            stagger={50}
                            duration={1000}
                            exitDirection={-1}
                            entering={() => FadeInUp.springify()}
                            exiting={() => FadeOutDown.springify()}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <View style={{
                                width: Dimensions.get('window').width, marginTop: 90,
                                alignItems: 'flex-start', marginStart: 10
                            }}>
                                <TouchableOpacity onPress={() => {
                                    EditNote(data[0])
                                }} style={{
                                    backgroundColor: data[0].bg === "#FFF" ? Colors.blue : data[0].bg,
                                    width: Dimensions.get('window').width / 2.3,
                                    borderRadius: 15, minHeight: 80, maxHeight: 500,
                                    padding: 15, margin: 10
                                }} activeOpacity={0.6} >
                                    <RenderHTML
                                        contentWidth={Dimensions.get('window').width / 2.3}
                                        source={{
                                            html: truncateHTML(data[0]
                                                .note, 100)
                                        }}
                                        tagsStyles={htmlStyles} baseStyle={{
                                            maxHeight: 400, minHeight: 80,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Stagger>
                        :
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-evenly',
                            width: Dimensions.get('window').width, marginBottom: 200, marginTop: 90
                        }}>
                            <View>
                                {data.map((item, index) => {
                                    return (
                                        index % 2 == 0 ?
                                            <Stagger
                                                stagger={50}
                                                duration={1000}
                                                exitDirection={-1}
                                                entering={() => FadeInUp.springify()}
                                                exiting={() => FadeOutDown.springify()}
                                                style={{
                                                    justifyContent: 'center',
                                                    gap: 12,
                                                    alignItems: 'center'
                                                }}>
                                                <View key={index}>
                                                    <TouchableOpacity onPress={() => {
                                                        EditNote(item)
                                                    }} style={{
                                                        backgroundColor: item.bg === "#FFF" ? Colors.blue : item.bg,
                                                        width: Dimensions.get('window').width / 2.3,
                                                        borderRadius: 15, minHeight: 80, maxHeight: 500,
                                                        padding: 15, margin: 10
                                                    }} activeOpacity={0.6} >
                                                        <RenderHTML
                                                            contentWidth={Dimensions.get('window').width / 2.3}
                                                            source={{ html: truncateHTML(item.note, 100) }}
                                                            tagsStyles={htmlStyles} baseStyle={{
                                                                maxHeight: 400, minHeight: 80,
                                                            }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </Stagger>
                                            :
                                            null
                                    )
                                })}
                            </View>
                            <View>
                                {data.map((item, index) => {
                                    return (
                                        index % 2 != 0 ?
                                            <Stagger
                                                stagger={50}
                                                duration={1000}
                                                exitDirection={-1}
                                                entering={() => FadeInUp.springify()}
                                                exiting={() => FadeOutDown.springify()}
                                                style={{
                                                    justifyContent: 'center',
                                                    gap: 12,
                                                    alignItems: 'center'
                                                }}>
                                                <View key={index}>
                                                    <TouchableOpacity onPress={() => {
                                                        EditNote(item)
                                                    }} style={{
                                                        backgroundColor: item.bg === "#FFF" ? Colors.blue : item.bg,
                                                        width: Dimensions.get('window').width / 2.3,
                                                        borderRadius: 15, minHeight: 80, maxHeight: 500,
                                                        padding: 15, margin: 10
                                                    }} activeOpacity={0.6} >
                                                        <RenderHTML
                                                            contentWidth={Dimensions.get('window').width / 2.3}
                                                            source={{ html: truncateHTML(item.note, 100) }}
                                                            tagsStyles={htmlStyles} baseStyle={{
                                                                maxHeight: 400, minHeight: 80,
                                                            }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </Stagger>
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

const Styles = StyleSheet.create({

})

const htmlStyles = {
    h1: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    p: {
        fontSize: 15,
        lineHeight: 15
    }
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default HomeScreen;
