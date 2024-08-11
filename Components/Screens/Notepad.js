import { darkEditorTheme, RichText, TenTapStartKit, Toolbar, useEditorBridge, useEditorContent } from "@10play/tentap-editor";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {  Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip, FAB, Text } from "react-native-paper";

import { UseCustomTheme } from "../Elements/Theme/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stagger } from "@animatereactnative/stagger";
import { FadeOutDown,  ZoomInEasyUp } from "react-native-reanimated";


const Notepad = (props) => {

    const Colors = UseCustomTheme();

    const [expanded, setExpanded] = useState(false)

    const [reading, setReading] = useState(false)

    const [keyboardShown, setKeyboardShown] = useState(false)


    function getRandomNumber() {
        const num = Math.floor(Math.random() * 5) + 1;

        let bgColor;
        if (num === 1) bgColor = '#FFF';
        if (num === 2) bgColor = Colors.blue;
        if (num === 3) bgColor = Colors.green;
        if (num === 4) bgColor = Colors.yellow;
        if (num === 5) bgColor = Colors.pink;

        setColorBg(bgColor);
    }

    useEffect(() => {
        getRandomNumber();

        editor.toggleHeading(2)
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardShown(true)
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardShown(false)
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const [colorBg, setColorBg] = useState('#FFF')

    const editor = useEditorBridge({
        bridgeExtensions: TenTapStartKit,
        theme: darkEditorTheme,
        autofocus: true,
        editable: !reading
    })


    useEffect(() => {
        editor.toggleHeading(2)
    }, [editor.getEditorState().isReady])

    const content = useEditorContent(editor, { type: 'html' });
    const contentText = useEditorContent(editor, { type: 'text' });


    const ManualSaveNote = async () => {
        if (contentText) {
            const notes = await AsyncStorage.getItem("notes").then((rs) => {
                if (rs == null) {
                    const note = {
                        "id": 1,
                        "note": content,
                        "bg": colorBg
                    }

                    const noteArr = [note]

                    AsyncStorage.setItem("notes", JSON.stringify(noteArr)).then(async (rs) => {
                        props.navigation.goBack()
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    AsyncStorage.getItem('notes').then((rs) => {
                        const noteData = JSON.parse(rs)
                        const newId = noteData.length + 1;
                        const note = {
                            "id": newId,
                            "note": content,
                            "bg": colorBg
                        }
                        const noteArr = [...noteData, note]

                        AsyncStorage.setItem('notes', JSON.stringify(noteArr)).then(() => {
                            props.navigation.goBack()
                        }).catch((err) => {
                            console.log(err);
                        })
                    })
                }
            })
        }
    }

    const [noteData, setNoteData] = useState(null)

    useEffect(() => {
        if (props.route.params) {
            setNoteData(props.route.params.noteData)
            editor.setContent(props.route.params.noteData.note)
            setColorBg(props.route.params.noteData.bg)
        }
    }, [props.route.params, editor.getEditorState().isReady])

    const UpdateNote = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem("notes");
            let notes = storedNotes ? JSON.parse(storedNotes) : [];

            const noteIndex = notes.findIndex(note => note.id === props.route.params.noteData.id);

            if (noteIndex !== -1) {
                notes[noteIndex].note = content;
                notes[noteIndex].bg = colorBg;
                notes[noteIndex].id = notes.length + 1; // Assign a new ID
            } else {
                const newNote = {
                    id: notes.length + 1,
                    note: content,
                    bg: colorBg,
                };
                notes.push(newNote);
            }

            await AsyncStorage.setItem("notes", JSON.stringify(notes));
            props.navigation.goBack();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        content && contentText
    }, [content, contentText])

    return (
        <View style={{ flex: 1, backgroundColor: colorBg, padding: 26, width: '100%' }}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', width: '100%',

            }}>
                <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                    <FontAwesome6 name="chevron-left" size={26} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color:'black'}}>Edit Note</Text>
                <TouchableOpacity onPress={() => { setExpanded(!expanded) }}>
                    <MaterialIcons name="more-vert" size={30} />
                </TouchableOpacity>
            </View>
                {expanded?
                <Stagger
                stagger={2}
                duration={600}
                exitDirection={-1}
                entering={() => ZoomInEasyUp.springify()}
                exiting={() => FadeOutDown.springify()}
                style={{
                    alignItems: 'center', padding: 10, marginTop: 20,
                }}>
                <View style={{
                    

                }}>


                    <View style={{
                        alignItems: 'center', justifyContent: 'space-evenly',
                        width: '100%', flexDirection: 'row'
                    }}>

                        <TouchableOpacity style={{
                            backgroundColor: '#FFF',
                            borderColor: '#464646', width: 35, height: 35,
                            borderRadius: 30, borderWidth: 0.5
                        }} onPress={() => { setColorBg('#FFF') }} />
                        <TouchableOpacity style={{
                            backgroundColor: Colors.blue,
                            borderColor: '#464646', width: 35, height: 35,
                            borderRadius: 30, borderWidth: 0.5
                        }} onPress={() => { setColorBg(Colors.blue) }} />
                        <TouchableOpacity style={{
                            backgroundColor: Colors.green,
                            borderColor: '#464646', width: 35, height: 35,
                            borderRadius: 30, borderWidth: 0.5
                        }} onPress={() => { setColorBg(Colors.green) }} />
                        <TouchableOpacity style={{
                            backgroundColor: Colors.pink,
                            borderColor: '#464646', width: 35, height: 35,
                            borderRadius: 30, borderWidth: 0.5
                        }} onPress={() => { setColorBg(Colors.pink) }} />
                        <TouchableOpacity style={{
                            backgroundColor: Colors.yellow,
                            borderColor: '#464646', width: 35, height: 35,
                            borderRadius: 30, borderWidth: 0.5
                        }} onPress={() => { setColorBg(Colors.yellow) }} />

                    </View>
                </View>

                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    width: '100%', justifyContent: 'space-evenly',
                    marginTop: 20
                }}>
                    <Chip mode="outlined" onPress={() => { setReading(false) }}
                        style={{ backgroundColor: 'transparent' }}
                        icon="note-edit" theme={{
                            colors: {
                                primary: !reading ? 'blue' : 'black'
                            }
                        }} selectedColor={reading ? 'black' : 'blue'} selected={!reading}><Text
                        style={{color:'black'}}>Editing</Text></Chip>
                    <Chip mode="outlined" onPress={() => { setReading(true) }}
                        style={{ backgroundColor: 'transparent' }}
                        icon="read" theme={{
                            colors: {
                                primary: !reading ? 'black' : 'blue'
                            }
                        }} selectedColor={reading ? 'blue' : 'black'} selected={reading}><Text
                        style={{color:'black'}}>Reading</Text></Chip>
                </View>
            </Stagger>
            :
            null}
            <RichText editor={editor} onSourceChanged={(rs) => { console.log(rs); }}
                style={{ marginTop: 20, flex: 1, backgroundColor: colorBg }} contentMode="mobile"
            />
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}>
                <Toolbar editor={editor} />
            </KeyboardAvoidingView>

            <FAB
                icon="check-all"
                visible={contentText ? true : false}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: keyboardShown ? 40 : 10,
                    backgroundColor: 'black',
                    borderRadius: 30
                }}
                onPress={() => {
                    if (props.route.params == undefined) {
                        ManualSaveNote()
                    } else {
                        UpdateNote()
                    }

                }} color="white" />
        </View >
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