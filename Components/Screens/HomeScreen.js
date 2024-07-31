import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../Elements/Theme/Colors";
import { useNavigation } from "@react-navigation/native";

import * as SQLite from 'expo-sqlite/legacy'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GridList } from "react-native-ui-lib";

import HTMLView from 'react-native-htmlview';

import {htmlToText} from 'html-to-text'

const HomeScreen = ({ navigation }) => {

    const [data, setData] = useState(null)

    const GetData = async () => {
        await AsyncStorage.getItem('notes').then((rs) => {
            if (rs == null) {

            } else {
                const noteData = JSON.parse(rs)
                setData(noteData)
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const navigationRef = useNavigation();

    useEffect(() => {
        const unsubscribe = navigationRef.addListener('state', () => {
            GetData();
        });


        return unsubscribe;
    }, [navigationRef]);

    const truncateHTML = (htmlContent, maxLength) => {
        const text = htmlToText(htmlContent, {
            wordwrap: false,
            noLinkBrackets: true,
            selectors: [{ selector: 'a', options: { ignoreHref: true } }],
        });
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background }}>
            {data ?
                <GridList data={data}
                    numColumns={2}

                    style={{ width: '100%', flex: 1 }}
                    contentContainerStyle={{ width: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}
                    renderItem={(item) => (
                        <HTMLView
                            value={truncateHTML(item.item.note, 100)}
                            style={{
                                backgroundColor: item.item.bg === "#FFF" ? Colors.blue : item.item.bg,
                                width: Dimensions.get('window').width / 2.3, 
                                margin: 10, maxHeight:400, padding:10, marginBottom:40
                            }} />
                    )} />
                :
                null}

            <TouchableRipple borderless onPress={() => { navigation.navigate('Notepad') }} style={{
                width: '80%', height: 64, backgroundColor: 'black',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 25, elevation: 20, marginBottom: 30
            }} android_ripple={true} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        CREATE NEW NOTE
                    </Text>
                    <MaterialIcons name="add" color="white" size={22} style={{ marginStart: 10, marginTop: 2 }} />
                </View>
            </TouchableRipple>
        </SafeAreaView>
    )
}

export default HomeScreen