import React, { useEffect, useRef, useState } from "react";
import {
    Appearance,
    Dimensions,
    ScrollView,
    StyleSheet,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    Divider,
    Modal,
    Portal,
    Text,
    TouchableRipple,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { UseCustomTheme } from "../Elements/Theme/Colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from "react-native-render-html";

import * as Device from "expo-device";

import Carousel from "react-native-reanimated-carousel";

import * as Updates from 'expo-updates'

import * as MediaLibrary from "expo-media-library";

import { ThemedButton } from "react-native-really-awesome-button";

import LottieView from "lottie-react-native";

import { BlurView } from "expo-blur";

import { StatusBar } from "expo-status-bar";
import {
    FadeInLeft,
    FadeInRight,
    FadeInUp,
    FadeOutDown,
    FadeOutLeft,
    FadeOutRight,
    FadeOutUp,
    ZoomInEasyDown,
    ZoomInEasyUp,
    ZoomOutEasyDown,
    ZoomOutEasyUp,
} from "react-native-reanimated";
import { Stagger } from "@animatereactnative/stagger";

import { captureRef } from "react-native-view-shot";

import * as Sharing from "expo-sharing";

const HomeScreen = ({ navigation }) => {
    const Colors = UseCustomTheme();
    const [data, setData] = useState(null);
    const [buttonEnabled, setButtonEnabled] = useState(true);

    const [status, requestPermission] = MediaLibrary.usePermissions();

    const GetData = async () => {

        try {
            const rs = await AsyncStorage.getItem("notes");
            if (rs !== null) {
                const noteData = JSON.parse(rs);
                setData(noteData);
            } else if (rs == []) {
                setData(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteNote = async (noteToDelete) => {
        try {
            const rs = await AsyncStorage.getItem("notes");
            if (rs !== null) {
                const noteData = JSON.parse(rs);
                const updatedData = noteData.filter(
                    (note) => note.id !== noteToDelete.id
                );
                await AsyncStorage.setItem("notes", JSON.stringify(updatedData));
                setData(updatedData); // Update state to trigger useEffect and re-render
            }
        } catch (err) {
            console.log(err);
        }
    };

    const ImageRef = useRef();

    const ShareImage = async () => {
        if (status.granted === false && status.canAskAgain) {
            requestPermission();
        }
        if (status.granted) {
            try {
                const localUri = await captureRef(ImageRef, {
                    height: 440,
                    quality: 1,
                });

                await MediaLibrary.saveToLibraryAsync(localUri).then(() => {
                    ToastAndroid.show("Saved to Gallery", ToastAndroid.SHORT);
                    Sharing.isAvailableAsync().then((rs) => {
                        Sharing.shareAsync(localUri);
                        setPopup(false);
                        setPopupData(null);
                    });
                });
            } catch (e) {
                console.log(e);
            }
        }
    };


    const ShareCarouselNote = async (note) => {
        setPopupData(note);
        setPopup(true);
        if (status.granted === false && status.canAskAgain) {
            requestPermission();
        }
    };

    const navigationRef = useNavigation();

    useEffect(() => {
        const unsubscribe = navigationRef.addListener("state", (rs) => {
            GetData();
            if (rs.data.state.routes.length == 1) {
                setButtonEnabled(true);
            }
        });

        return unsubscribe;
    }, [navigationRef]);

    const CheckForUpdates = async() =>{    
        Updates.checkForUpdateAsync().then((rs) => {
            if(rs.isAvailable){
                setloading(true)
                setButtonEnabled(false)
                Updates.fetchUpdateAsync().then(()=>{
                    setloading(false)
                    setButtonEnabled(true)
                    ToastAndroid.show("Updated to latest version", ToastAndroid.SHORT)
                    Updates.reloadAsync()
                })
            }
        }).catch((err) => {
            setloading(false)
        })
    }

    useEffect(() => {
        CheckForUpdates()
    }, [])

    const truncateHTML = (htmlContent, maxLength) => {
        if (htmlContent.length > maxLength) {
            return htmlContent.substring(0, maxLength) + "...";
        }
        return htmlContent;
    };

    const [searchText, setSearchText] = useState("");

    const OpenNotepad = () => {
        navigation.navigate("Notepad");
        setButtonEnabled(false);
    };

    const [open, setOpen] = useState(false);

    const EditNote = (note) => {
        navigation.navigate("Notepad", {
            noteData: note,
        });
        setButtonEnabled(false);
    };

    const [orientation, setOrientation] = useState("LANDSCAPE");

    const determineAndSetOrientation = () => {
        let width = Dimensions.get("window").width;
        let height = Dimensions.get("window").height;

        if (width < height) {
            setOrientation("PORTRAIT");
        } else {
            setOrientation("LANDSCAPE");
        }
    };

    const [popup, setPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);

    const [loading, setloading] = useState(false)

    const [visible, setVisible] = useState(false);

    const hideDialog = () => {
        setVisible(false);
    };

    const PopOpenNote = (data) => {
        setPopup(true);
        setPopupData(data);
    };

    const [carousel, setCarousel] = useState(false);

    useEffect(() => {
        determineAndSetOrientation();
        Dimensions.addEventListener("change", determineAndSetOrientation);
    }, []);

    const SearchInArray = async (txt) => {
        setSearchText(txt);

        try {
            const rs = await AsyncStorage.getItem("notes");
            if (rs !== null) {
                const noteData = JSON.parse(rs);
                GetData().then(() => {
                    if (txt && data != null) {
                        const filtered = noteData.filter((item) =>
                            item.note.toLowerCase().includes(txt.toLowerCase())
                        );
                        setData(filtered);
                    } else {
                        GetData();
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <SafeAreaView
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: Colors.background,
            }}
        >
            <StatusBar translucent style="auto" />
            {buttonEnabled ? (
                <Portal>
                    <SafeAreaView>
                        {open ? (
                            <BlurView
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "90%",
                                    alignSelf: "center",
                                    paddingVertical: 15,
                                    paddingHorizontal: 20,
                                    borderRadius: 20,
                                    overflow: "hidden",
                                    marginTop: 10,
                                }}
                                intensity={100}
                                experimentalBlurMethod="dimezisBlurView"
                            >
                                <Stagger
                                    stagger={2}
                                    duration={1000}
                                    exitDirection={-1}
                                    entering={() => FadeInLeft.springify()}
                                    exiting={() => FadeOutRight.springify()}
                                    style={{
                                        alignItems: "center",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        width: "100%",
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (open) {
                                                setOpen(!open);
                                                setSearchText("");
                                                GetData();
                                            } else {
                                                setOpen(!open);
                                                setSearchText("");
                                            }
                                        }}
                                        hitSlop={20}
                                        borderless
                                        style={{
                                            borderRadius: 30,
                                            width: 40,
                                            height: 40,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        activeOpacity={0.6}
                                    >
                                        <MaterialIcons name="search" size={30} />
                                    </TouchableOpacity>
                                    <TextInput
                                        placeholder="Search Here"
                                        style={{ flex: 1, marginStart: 10 }}
                                        value={searchText}
                                        onChangeText={(txt) => {
                                            SearchInArray(txt);
                                        }}
                                        cursorColor="black"
                                        autoFocus
                                    />
                                </Stagger>
                            </BlurView>
                        ) : (
                            <BlurView
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "90%",
                                    alignSelf: "center",
                                    paddingVertical: 15,
                                    paddingHorizontal: 20,
                                    borderRadius: 20,
                                    overflow: "hidden",
                                    marginTop: 10,
                                }}
                                intensity={100}
                                experimentalBlurMethod="dimezisBlurView"
                            >
                                <Stagger
                                    stagger={0}
                                    duration={500}
                                    exitDirection={-1}
                                    entering={() => FadeInRight.springify()}
                                    exiting={() => FadeOutUp.springify()}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCarousel(!carousel)
                                        }}
                                        borderless
                                        hitSlop={20}
                                        style={{
                                            borderRadius: 30,
                                            width: 40,
                                            height: 40,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        activeOpacity={0.6}
                                    >
                                        <MaterialIcons name="view-carousel" size={30} />
                                    </TouchableOpacity>
                                </Stagger>
                                <Stagger
                                    stagger={0}
                                    duration={500}
                                    exitDirection={-1}
                                    entering={() => FadeInRight.springify()}
                                    exiting={() => FadeOutLeft.springify()}
                                >
                                    <Text style={{ fontSize: 18, fontWeight: "bold", color:'black'}}>
                                        All Notes
                                    </Text>
                                </Stagger>
                                <Stagger
                                    stagger={0}
                                    duration={500}
                                    exitDirection={-1}
                                    entering={() => FadeInRight.springify()}
                                    exiting={() => FadeOutLeft.springify()}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setOpen(!open);
                                        }}
                                        borderless
                                        hitSlop={20}
                                        style={{
                                            borderRadius: 30,
                                            width: 40,
                                            height: 40,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        activeOpacity={0.6}
                                    >
                                        <MaterialIcons name="search" size={30} />
                                    </TouchableOpacity>
                                </Stagger>
                            </BlurView>
                        )}
                    </SafeAreaView>
                </Portal>
            ) : null}
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {data == null || data.length === 0 ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            height: Dimensions.get("window").height,
                        }}
                    >
                        <LottieView
                            autoPlay
                            style={{
                                width: Dimensions.get("window").width / 2,
                                height: Dimensions.get("window").height / 2,
                            }}
                            source={require("../Elements/Animation/emptyanim.json")}
                        />
                        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                            Oops, nothing here!
                        </Text>
                    </View>
                ) : carousel ? (
                    <Carousel
                        data={data}
                        width={Dimensions.get("window").width}
                        height={500}
                        key={(item) => item.id}
                        style={{
                            alignItems: "center",
                            width: Dimensions.get("window").width,
                            height: Dimensions.get("window").height,
                        }}
                        withAnimation={{ type: "spring" }}
                        mode="parallax"
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    alignItems: "center",
                                    marginTop: orientation === "PORTRAIT" ? -100 : 0,
                                    flexDirection: orientation === "PORTRAIT" ? "column" : "row",
                                    justifyContent: orientation === "PORTRAIT" ? null : "space-evenly",
                                }}
                            >
                                <Stagger
                                    stagger={2}
                                    duration={500}
                                    exitDirection={-1}
                                    entering={() => FadeInUp.springify()}
                                    exiting={() => ZoomOutEasyDown.springify()}
                                    style={{
                                        alignItems: "center",
                                        width: "100%",
                                        height: "100%",
                                        flexDirection: orientation === "PORTRAIT" ? "column" : "row",
                                        justifyContent: orientation === "PORTRAIT" ? null : "space-evenly",
                                    }}
                                >
                                    <TouchableRipple
                                        style={{
                                            width: orientation === "PORTRAIT" ? "100%" : "60%",
                                            height:
                                                orientation === "PORTRAIT"
                                                    ? "100%"
                                                    : Device.deviceType === Device.DeviceType.TABLET
                                                        ? "100%"
                                                        : "50%",
                                            backgroundColor: item.bg,
                                            borderRadius: 25,
                                            padding: 25,
                                            marginBottom: orientation === "PORTRAIT" ? 20 : 0,
                                        }}
                                        onPress={() => {
                                            EditNote(item);
                                        }}
                                        rippleColor="transparent"
                                    >
                                        <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
                                            <RenderHTML
                                                source={{ html: item.note }}
                                                contentWidth={Dimensions.get("window").width}
                                                tagsStyles={htmlStyles}
                                                baseStyle={{
                                                    maxHeight: 400,
                                                    minHeight: 80,
                                                }}
                                            />
                                        </ScrollView>
                                    </TouchableRipple>

                                    <BlurView
                                        intensity={100}
                                        experimentalBlurMethod="dimezisBlurView"
                                        style={{
                                            width: 225,
                                            overflow: "hidden",
                                            borderRadius: 20,
                                            justifyContent: "center",
                                            elevation: 2,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginTop: 5,
                                                paddingHorizontal: 20,
                                                marginBottom: 10,
                                                paddingVertical: 8,
                                            }}
                                            onPress={() => {
                                                ShareCarouselNote(item);
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    fontWeight: "bold",
                                                    color: "#000",
                                                }}
                                            >
                                                Share
                                            </Text>
                                            <Ionicons name="share-outline" size={22} color="#000" />
                                        </TouchableOpacity>
                                        <Divider style={{ width: "100%", backgroundColor: "black" }} />
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginTop: 5,
                                                paddingHorizontal: 20,
                                                marginBottom: 10,
                                                paddingVertical: 8,
                                            }}
                                            onPress={() => {
                                                EditNote(item);
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    fontWeight: "bold",
                                                    color: "#000",
                                                }}
                                            >
                                                Edit Note
                                            </Text>
                                            <MaterialIcons name="edit-note" size={24} color="#000" />
                                        </TouchableOpacity>

                                        <Divider style={{ width: "100%", backgroundColor: "black" }} />
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginTop: 5,
                                                paddingHorizontal: 20,
                                                marginBottom: 10,
                                                paddingVertical: 8,
                                            }}
                                            onPress={() => {
                                                setPopupData(item);
                                                setVisible(true);
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    fontWeight: "bold",
                                                    color: "#cc0000",
                                                }}
                                            >
                                                Delete
                                            </Text>
                                            <Ionicons name="trash-outline" size={22} color="#cc0000" />
                                        </TouchableOpacity>
                                    </BlurView>
                                </Stagger>
                            </View>
                        )}
                    />
                ) : data.length === 1 ? (
                    <Stagger
                        stagger={50}
                        duration={1000}
                        exitDirection={-1}
                        entering={() => FadeInUp.springify()}
                        exiting={() => FadeOutDown.springify()}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: Dimensions.get("window").width,
                                marginTop: 45,
                                alignItems: "flex-start",
                                marginStart: 3,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    EditNote(data[0]);
                                }}
                                onLongPress={() => {
                                    PopOpenNote(data[0]);
                                }}
                                style={{
                                    backgroundColor: data[0].bg === "#FFF" ? Colors.blue : data[0].bg,
                                    width: Dimensions.get("window").width / 2.3,
                                    borderRadius: 15,
                                    minHeight: 80,
                                    maxHeight: 500,
                                    padding: 15,
                                    margin: 10,
                                }}
                                activeOpacity={0.6}
                            >
                                <ScrollView>
                                    <RenderHTML
                                        contentWidth={Dimensions.get("window").width / 2.3}
                                        source={{
                                            html: truncateHTML(data[0].note, 100),
                                        }}
                                        tagsStyles={htmlStyles}
                                        baseStyle={{
                                            maxHeight: 400,
                                            minHeight: 80,
                                        }}
                                    />
                                </ScrollView>
                            </TouchableOpacity>
                        </View>
                    </Stagger>
                ) : (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            width: Dimensions.get("window").width,
                            marginBottom: 200,
                            marginTop: 90,
                        }}
                    >
                        <View>
                            {data.map((item, index) => {
                                return index % 2 == 0 ? (
                                    <Stagger
                                        key={index}
                                        stagger={50}
                                        duration={1000}
                                        exitDirection={-1}
                                        entering={() => FadeInUp.springify()}
                                        exiting={() => FadeOutDown.springify()}
                                        style={{
                                            justifyContent: "center",
                                            gap: 12,
                                            alignItems: "center",
                                        }}
                                    >
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    EditNote(item);
                                                }}
                                                onLongPress={() => {
                                                    PopOpenNote(item);
                                                }}
                                                style={{
                                                    backgroundColor: item.bg === "#FFF" ? Colors.blue : item.bg,
                                                    width: Dimensions.get("window").width / 2.3,
                                                    borderRadius: 15,
                                                    minHeight: 80,
                                                    maxHeight: 500,
                                                    padding: 15,
                                                    margin: 10,
                                                }}
                                                activeOpacity={0.6}
                                            >
                                                <ScrollView>
                                                    <RenderHTML
                                                        contentWidth={Dimensions.get("window").width / 2.3}
                                                        source={{ html: truncateHTML(item.note, 100) }}
                                                        tagsStyles={htmlStyles}
                                                        baseStyle={{
                                                            maxHeight: 400,
                                                            minHeight: 80,
                                                        }}
                                                    />
                                                </ScrollView>
                                            </TouchableOpacity>
                                        </View>
                                    </Stagger>
                                ) : null;
                            })}
                        </View>
                        <View>
                            {data.map((item, index) => {
                                return index % 2 != 0 ? (
                                    <Stagger
                                        key={index}
                                        stagger={50}
                                        duration={1000}
                                        exitDirection={-1}
                                        entering={() => FadeInUp.springify()}
                                        exiting={() => FadeOutDown.springify()}
                                        style={{
                                            justifyContent: "center",
                                            gap: 12,
                                            alignItems: "center",
                                        }}
                                    >
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    EditNote(item);
                                                }}
                                                onLongPress={() => {
                                                    PopOpenNote(item);
                                                }}
                                                style={{
                                                    backgroundColor: item.bg === "#FFF" ? Colors.blue : item.bg,
                                                    width: Dimensions.get("window").width / 2.3,
                                                    borderRadius: 15,
                                                    minHeight: 80,
                                                    maxHeight: 500,
                                                    padding: 15,
                                                    margin: 10,
                                                }}
                                                activeOpacity={0.6}
                                            >
                                                <ScrollView>
                                                    <RenderHTML
                                                        contentWidth={Dimensions.get("window").width / 2.3}
                                                        source={{ html: truncateHTML(item.note, 100) }}
                                                        tagsStyles={htmlStyles}
                                                        baseStyle={{
                                                            maxHeight: 400,
                                                            minHeight: 80,
                                                        }}
                                                    />
                                                </ScrollView>
                                            </TouchableOpacity>
                                        </View>
                                    </Stagger>
                                ) : null;
                            })}
                        </View>
                    </View>
                )}
            </ScrollView>

            {buttonEnabled ? (
                <Portal>
                    <Stagger
                        stagger={2}
                        duration={500}
                        exitDirection={-1}
                        entering={() => ZoomInEasyUp.springify()}
                        exiting={() => ZoomOutEasyDown.springify()}
                        style={{
                            position: "absolute",
                            alignItems: "center",
                            justifyContent: "center",
                            bottom: 20,
                            left: 0,
                            right: 0,
                        }}
                    >
                        {carousel ?
                            <View style={{ position: "absolute", right: 10, bottom: 0 }}>
                                <ThemedButton
                                    name="rick"
                                    onPress={() => {
                                        OpenNotepad();
                                    }}
                                    size="large"
                                    textSize={16}
                                    textColor="white"
                                    backgroundColor="black"
                                    backgroundDarker="#414141"
                                    width={75}
                                    height={75}
                                    borderRadius={40}
                                >
                                    <MaterialIcons name="add" color="white" size={30} />
                                </ThemedButton>
                            </View> : (
                                <ThemedButton
                                    name="rick"
                                    onPress={() => {
                                        OpenNotepad();
                                    }}
                                    size="large"
                                    textSize={16}
                                    textColor="white"
                                    backgroundColor="black"
                                    backgroundDarker="#414141"
                                >
                                    Create a new Note
                                </ThemedButton>
                            )}
                    </Stagger>
                </Portal>
            ) : null}
            {popup && popupData ? (
                <Portal>
                    <Modal
                        visible
                        contentContainerStyle={{
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                        }}
                        onDismiss={() => {
                            setPopup(false);
                            setPopupData(null);
                        }}
                        dismissable
                        dismissableBackButton
                    >
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                flexDirection: orientation === "PORTRAIT" ? "column" : "row",
                                justifyContent: "space-evenly",
                                maxHeight: Dimensions.get("window").height,
                            }}
                        >
                            <View
                                style={{
                                    width: orientation === "PORTRAIT" ? "80%" : "50%",
                                    height: orientation === "PORTRAIT" ? "60%" : "90%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                ref={ImageRef}
                                collapsable={false}
                            >
                                <Card
                                    style={{
                                        borderRadius: 30,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: popupData.bg,
                                        padding: 20,
                                        paddingVertical: 25,
                                    }}
                                >
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <RenderHTML
                                            contentWidth={200}
                                            source={{ html: popupData.note }}
                                            tagsStyles={htmlStyles}
                                            baseStyle={{
                                                minHeight: 80,
                                            }}
                                        />
                                    </ScrollView>
                                </Card>
                            </View>
                            <Stagger
                                stagger={2}
                                duration={500}
                                exitDirection={-1}
                                entering={() => FadeInUp.springify()}
                                exiting={() => ZoomOutEasyDown.springify()}
                                style={{
                                    alignItems: "center",
                                }}
                            >
                                <BlurView
                                    intensity={100}
                                    experimentalBlurMethod="dimezisBlurView"
                                    style={{
                                        width: 225,
                                        overflow: "hidden",
                                        borderRadius: 20,
                                        justifyContent: "center",
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 5,
                                            paddingHorizontal: 20,
                                            marginBottom: 10,
                                            paddingVertical: 8,
                                        }}
                                        onPress={() => {
                                            ShareImage();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontWeight: "bold",
                                                color: "#414141",
                                            }}
                                        >
                                            Share
                                        </Text>
                                        <Ionicons name="share-outline" size={22} color="#414141" />
                                    </TouchableOpacity>
                                    <Divider style={{ width: "100%", backgroundColor: "black" }} />
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 5,
                                            paddingHorizontal: 20,
                                            marginBottom: 10,
                                            paddingVertical: 8,
                                        }}
                                        onPress={() => {
                                            EditNote(popupData);
                                            setPopup(false);
                                            setPopupData(null);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontWeight: "bold",
                                                color: "#414141",
                                            }}
                                        >
                                            Edit Note
                                        </Text>
                                        <MaterialIcons name="edit-note" size={24} color="#414141" />
                                    </TouchableOpacity>
                                    <Divider style={{ width: "100%", backgroundColor: "black" }} />
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 5,
                                            paddingHorizontal: 20,
                                            marginBottom: 10,
                                            paddingVertical: 8,
                                        }}
                                        onPress={() => {
                                            setPopup(false);
                                            setPopupData(null);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontWeight: "bold",
                                                color: "#414141",
                                            }}
                                        >
                                            Close
                                        </Text>
                                        <Ionicons name="close-outline" size={24} color="#414141" />
                                    </TouchableOpacity>
                                    <Divider style={{ width: "100%", backgroundColor: "black" }} />
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 5,
                                            paddingHorizontal: 20,
                                            marginBottom: 10,
                                            paddingVertical: 8,
                                        }}
                                        onPress={() => {
                                            setPopup(false);
                                            setVisible(true);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontWeight: "bold",
                                                color: "#cc0000",
                                            }}
                                        >
                                            Delete
                                        </Text>
                                        <Ionicons name="trash-outline" size={22} color="#cc0000" />
                                    </TouchableOpacity>
                                </BlurView>
                            </Stagger>
                        </View>
                    </Modal>
                </Portal>
            ) : null}
            <Portal>
                <Dialog
                    visible={visible}
                    onDismiss={() => {
                        hideDialog();
                        setPopupData(null);
                    }}
                    style={{ width: orientation === "PORTRAIT" ? "80%" : "50%", alignSelf: "center" }}
                >
                    <Dialog.Title>Delete Note!</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyLarge">
                            Are you sure you want to delete this note? This action is
                            irreversible.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => {
                                hideDialog();
                                setPopupData(null);
                            }}
                            textColor="black"
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={() => {
                                hideDialog();
                                setPopupData(null);
                                deleteNote(popupData);
                            }}
                            textColor="red"
                        >
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>


            {loading ?
                <Portal>
                    <BlurView style={{
                        alignItems: 'center', justifyContent: 'center',
                        width: Dimensions.get('window').width,
                        height: Dimensions.get("window").height
                    }} intensity={70} experimentalBlurMethod="dimezisBlurView">
                        <Card style={{
                            width: 90, height: 90,
                            borderRadius: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}>
                            <ActivityIndicator size={45}
                                color="gray" />
                        </Card>
                        <Text
                            style={{
                                color: '#414141',
                                fontWeight: "bold",
                                fontSize: 20,
                                marginTop: 20
                            }}>Checking for Updates</Text>
                    </BlurView>
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
