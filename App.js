import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer,  } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Onboarding from './Components/Screens/Onboarding';
import HomeScreen from './Components/Screens/HomeScreen';
import Notepad from './Components/Screens/Notepad';

import * as SQLite from 'expo-sqlite/legacy'

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
              } else {
                setFirstTime(true)
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
    console.log(firstTime);
  }, [firstTime, Stack])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {firstTime ?
          <Stack.Group navigationKey='HomeScreen'>
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Notepad" component={Notepad} options={{
              animationEnabled: true, animation: 'slide_from_bottom',
              gestureEnabled: true,
              presentation: 'modal',
              ...(TransitionPresets.ModalPresentationIOS)
            }} />
          </Stack.Group>
          :
          <Stack.Group>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Notepad" component={Notepad} options={{
              animationEnabled: true, animation: 'slide_from_bottom',
              gestureEnabled: true,
              presentation: 'modal',
              ...(TransitionPresets.ModalPresentationIOS)
            }} />
          </Stack.Group>
        }
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;