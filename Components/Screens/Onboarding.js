import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, TouchableOpacity } from "react-native";
import SwipeToStart from "../Elements/UiComponents/SwipeToStart";

import { StatusBar } from "expo-status-bar";

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stagger } from '@animatereactnative/stagger'
import { FadeInUp, FadeOutDown, ZoomInEasyDown } from "react-native-reanimated";
import { Text } from "react-native-paper";

const Onboarding = (props) => {


    const NavigateToHomeScreen = async () => {
        await AsyncStorage.setItem("firsttime", "false").then(() => {
            props.navigation.replace("HomeScreen")
        })
    }

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

    useEffect(() => {
        determineAndSetOrientation();
        Dimensions.addEventListener("change", determineAndSetOrientation);
    }, []);


    return (
        <View style={{ flex: 1, width: '100%', height: '100%', }}>
            <StatusBar translucent />
            <View style={{
                position: 'absolute', width: '100%', height: '100%',
                justifyContent: 'center'
            }}>
                <Image source={require('../../Components/Elements/Images/gradientbg.png')} style={{
                    width: '100%', height: '100%', opacity: 0.85, position: 'absolute'
                }} />

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
                    <Image source={require('../../assets/icon-empty.png')}
                        style={{
                            width: 248, height: 248, alignSelf: 'center',
                        }} />
                    <Text style={{
                        fontSize: 24, fontWeight: 'bold',
                        textAlign: 'center', marginTop: 10,
                        color:'#414141'
                    }}>
                        Get Started with Noted!
                    </Text>
                    <Text style={{
                        fontSize: 16, paddingHorizontal: 20,
                        textAlign: 'center', fontWeight: '700',
                        color: '#414141',
                    }}>
                        Save, Edit and Manage your notes with a minimalistic note taking application
                    </Text>
                </Stagger>
            </View>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View />
                <View style={{ marginBottom: 20, width: '100%', alignItems: 'center' }}>
                    <SwipeToStart onStart={() => NavigateToHomeScreen()} />
                </View>
            </View>
            <View style={{
                flexDirection: 'row', alignItems: 'center', alignSelf: 'center',
                marginBottom: 20
            }}>
                <TouchableOpacity onPress={()=>{props.navigation.navigate('PrivacyPolicy')}}>
                    <Text style={{
                        textDecorationLine: 'underline',
                        fontWeight: 'bold',
                        color:'black'
                    }}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={{color:'#414141'}}> And </Text>
                <TouchableOpacity onPress={()=>{props.navigation.navigate('TermsAndConditions')}}>
                    <Text style={{
                        textDecorationLine: 'underline',
                        fontWeight: 'bold',
                        color:'#000'
                    }}>Terms & Conditions</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Onboarding