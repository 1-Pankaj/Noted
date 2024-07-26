import React, { useEffect } from "react";
import { View, Image } from "react-native";
import SwipeToStart from "../Elements/UiComponents/SwipeToStart";

import OnboardingText from '../Elements/Svg/onboardingText.svg'
import { StatusBar } from "expo-status-bar";

import * as SQLite from 'expo-sqlite/legacy'

const Onboarding = (props) => {

    const db = SQLite.openDatabase("Noted.db")

    

    const NavigateToHomeScreen = () => {
        db.transaction((tx) => {
            tx.executeSql("INSERT INTO Onboarding (value) values ('true')", [],
                (sql, rs) => {
                    props.navigation.replace("HomeScreen")
                }
            )
        }, error => {
            console.log(error);
        })
    }

    return (
        <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'black' }}>
            <StatusBar translucent />
            <Image source={require('../Elements/Images/onboarding.png')} style={{
                position: 'absolute', width: '100%', height: '100%'
            }} />
            <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                <OnboardingText />
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