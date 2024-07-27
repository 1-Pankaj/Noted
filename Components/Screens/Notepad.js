import { darkEditorTheme, RichText, TenTapStartKit, Toolbar, useEditorBridge, useEditorContent } from "@10play/tentap-editor";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const Notepad = (props) => {

    const editor = useEditorBridge({
        bridgeExtensions: TenTapStartKit,
        theme: darkEditorTheme,
        autofocus: true,
        onChange: ()=>{}
    })

    const content = useEditorContent(editor, { type: 'html' });

    const onSave = (content) =>{
        console.log(content);
    }

    useEffect(()=>{
        content && onSave(content)
    }, [content])

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff',padding: 26, width:'100%' }}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', width: '100%',
                
            }}>
                <FontAwesome6 name="chevron-left" size={26} />
                <Text style={{fontWeight:'bold', fontSize:16}}>Edit Note</Text>
                <MaterialIcons name="more-vert" size={30} />
            </View>
            <RichText editor={editor} onSourceChanged={(rs) => { console.log(rs); }} 
                style={{marginTop:20, flex:1}} contentMode="mobile"/>
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}>
                <Toolbar editor={editor} />
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        bottom: 0,
    },
})

export default Notepad