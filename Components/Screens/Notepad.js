import { darkEditorTheme, PlaceholderBridge, RichText, TenTapStartKit, Toolbar, useEditorBridge, useEditorContent } from "@10play/tentap-editor";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip, FAB, Text, TouchableRipple } from "react-native-paper";

import { ExpandableSection } from 'react-native-ui-lib'
import { Colors } from "../Elements/Theme/Colors";

import * as SQLite from 'expo-sqlite/legacy'

const Notepad = (props) => {

    const db = SQLite.openDatabase("Noted.db")

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
        CreateTable()
        editor.toggleHeading(1)
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardShown(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardShown(false); // or some other action
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

    const CreateTable = () => {
        db.transaction((tx) => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS Notes (id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, content TEXT, background varchar(20));", [],
                (sql, rs) => {
                    console.log("No Error");
                }
            )
        }, error => {
            console.log(error);
        })
    }

    const DropTable = () => {
        db.transaction((tx) => {
            tx.executeSql("DROP TABLE Notes", [],
                (sql, rs) => {
                    console.log("Dropped");
                }
            )
        }, error => {
            console.log(error);
        })
    }

    useEffect(() => {
        editor.toggleHeading(1)
    }, [editor.getEditorState().isReady])

    const content = useEditorContent(editor, { type: 'html' });
    const contentText = useEditorContent(editor, { type: 'text' });

    const onSave = (content) => {

    }



    const ManualSaveNote = () => {
        if (contentText) {
            db.transaction((tx) => {
                tx.executeSql("INSERT INTO Notes (content, background) values (?,?)", [content, colorBg],
                    (sql, rs) => {
                        console.log("Inserted");
                        sql.executeSql("SELECT * FROM Notes", [],
                            (sql, rs) => {
                                console.log(rs.rows._array);
                            }
                            , error => {
                                console.log(error);
                            })
                    }
                    , error => {
                        console.log(error);
                    })
            }, error => {
                console.log(error);
            })
        }else{
            
        }
    }


    useEffect(() => {
        content && onSave(content)
    }, [content])

    return (
        <View style={{ flex: 1, backgroundColor: colorBg, padding: 26, width: '100%' }}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', width: '100%',

            }}>
                <FontAwesome6 name="chevron-left" size={26} />
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Edit Note</Text>
                <TouchableOpacity onPress={() => { setExpanded(!expanded) }}>
                    <MaterialIcons name="more-vert" size={30} />
                </TouchableOpacity>
            </View>
            <ExpandableSection
                expanded={expanded} >
                <View style={{
                    alignItems: 'center', padding: 10, marginTop: 20,

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
                        }} selectedColor={reading ? 'black' : 'blue'} selected={!reading}><Text>Editing</Text></Chip>
                    <Chip mode="outlined" onPress={() => { setReading(true) }}
                        style={{ backgroundColor: 'transparent' }}
                        icon="read" theme={{
                            colors: {
                                primary: !reading ? 'black' : 'blue'
                            }
                        }} selectedColor={reading ? 'blue' : 'black'} selected={reading}><Text>Reading</Text></Chip>
                </View>
            </ExpandableSection>
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
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: keyboardShown ? 40 : 10,
                    backgroundColor: 'black',
                    borderRadius: 30
                }}
                onPress={() => {
                    ManualSaveNote()
                }} color="white" />
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