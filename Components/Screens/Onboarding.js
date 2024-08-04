import React from "react";
import { View, Image, Dimensions } from "react-native";
import SwipeToStart from "../Elements/UiComponents/SwipeToStart";

import { StatusBar } from "expo-status-bar";

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stagger } from '@animatereactnative/stagger'
import { FadeOutDown, ZoomInEasyDown } from "react-native-reanimated";
import { Text } from "react-native-paper";

const Onboarding = (props) => {


    const NavigateToHomeScreen = async () => {
        await AsyncStorage.setItem("firsttime", "false").then(() => {
            props.navigation.replace("HomeScreen")
        })
    }


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
                    entering={() => ZoomInEasyDown.springify()}
                    exiting={() => FadeOutDown.springify()}
                    style={{
                        justifyContent: 'center',
                        gap: 12,
                        alignItems: 'center'
                    }}>
                    <Image source={require('../../assets/icon-empty.png')}
                        style={{
                            width: Dimensions.get('window').width / 1.7, height: Dimensions.get('window').width / 1.7, alignSelf: 'center',
                        }} />
                    <Text style={{fontSize:30, fontWeight:'bold',
                        textAlign:'center', marginTop:20
                    }}>
                        Get Started with Noted!
                    </Text>
                    <Text style={{fontSize:20, paddingHorizontal:20,
                        textAlign:'center', fontWeight:'700',
                        color:'#414141'
                    }}>Save, Edit and Manage your notes with a minimalistic note taking application</Text>
                </Stagger>
            </View>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View />
                <View style={{ marginBottom: 30, width: '100%', alignItems: 'center' }}>
                    <SwipeToStart onStart={() => NavigateToHomeScreen()} />
                </View>
            </View>
        </View>
    )
}

export default Onboarding