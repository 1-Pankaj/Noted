import React from "react";
import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../Elements/Theme/Colors";

const HomeScreen = (props) => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor:Colors.background }}>
            <View>

            </View>

            <TouchableRipple borderless onPress={() => { props.navigation.navigate('Notepad') }} style={{
                width: '80%', height: 64, backgroundColor: 'black',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 25, elevation: 20, marginBottom: 30
            }} android_ripple={true} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        CREATE NEW NOTE
                    </Text>
                    <MaterialIcons name="add" color="white" size={22} style={{marginStart:10, marginTop:2}} />
                </View>
            </TouchableRipple>
        </SafeAreaView>
    )
}

export default HomeScreen