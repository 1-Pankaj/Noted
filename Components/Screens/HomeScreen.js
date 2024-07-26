import React from "react";
import { View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = (props) => {
    return (
        <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'space-between'}}>
            <View>

            </View>

            <TouchableRipple borderless onPress={()=>{}} style={{width:'80%', height:64, backgroundColor:'black',
                alignItems:'center', justifyContent:'center',
                borderRadius:25, elevation:20, marginBottom:30
            }} android_ripple={true} >
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View>
                        <Text style={{color:'white', fontSize:16}}>
                            CREATE NEW NOTE
                        </Text>
                    </View>
                    <View>
                        <MaterialIcons name="add" color="white" size={20}/>
                    </View>
                </View>
            </TouchableRipple>
        </SafeAreaView>
    )
}

export default HomeScreen