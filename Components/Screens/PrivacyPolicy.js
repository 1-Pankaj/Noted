import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";

const PrivacyPolicy = (props) => {
    return (
        <View style={{flex:1, alignItems:'center', backgroundColor:'white'}}>
            <TouchableOpacity style={{alignSelf:'flex-start', margin:25}}
            onPress={()=>{
                props.navigation.goBack()
            }} hitSlop={30}>
                <MaterialIcons name="arrow-back-ios" size={30}/>
            </TouchableOpacity>
            <WebView
            containerStyle={{}}
            contentMode="mobile"
            style={{flex:1, width:Dimensions.get('window').width, height:Dimensions.get('window').height,}}
            source={{uri:'https://www.termsfeed.com/live/85a9560d-0190-4da1-8c9e-0a7f2ea6e866'}}/>
        </View>
    )
}

export default PrivacyPolicy