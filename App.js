import 'react-native-gesture-handler';

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Onboarding from './Components/Screens/Onboarding';
import HomeScreen from './Components/Screens/HomeScreen';

import * as SQLite from 'expo-sqlite/legacy'
import Notepad from './Components/Screens/Notepad';

const Stack = createStackNavigator();


function App() {

  const [firstTime, setFirstTime] = React.useState(false)

  const db = SQLite.openDatabase("Noted.db")

  const CreateTable = () => {
    db.transaction((tx) => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS Onboarding (value BOOLEAN)", [],
        (sql, rs) => {
          sql.executeSql("SELECT * FROM Onboarding", [],
            (sql, rs) => {
              if (rs.rows._array.length > 0) {
                setFirstTime(false)
                console.log(firstTime);
              }
              else {
                setFirstTime(true)
                console.log(firstTime);
              }
            }
          )
        }
      )
    }, error => {
      console.log(error);
    })
  }

  React.useEffect(() => {
    CreateTable()
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {firstTime ?
          <Stack.Screen name="Onboarding" component={Onboarding} />
          :
          null
        }
        {/* options={{
          animationEnabled: true, animation: 'slide_from_bottom',
          gestureEnabled: true,
          presentation: 'modal',
          ...(TransitionPresets.ModalPresentationIOS)
        }} */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Notepad" component={Notepad} options={{
          animationEnabled: true, animation: 'slide_from_bottom',
          gestureEnabled: true,
          presentation: 'modal',
          ...(TransitionPresets.ModalPresentationIOS)
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;