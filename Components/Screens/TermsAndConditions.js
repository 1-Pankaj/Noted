import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";

const TermsAndConditions = (props) => {
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
            source={{uri:'https://www.termsfeed.com/live/999cd1d3-c75e-4c48-a300-e5f6c137a347'}}/>
        </View>
    )
}

export default TermsAndConditions