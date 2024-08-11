import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Onboarding from './Components/Screens/Onboarding';
import HomeScreen from './Components/Screens/HomeScreen';
import Notepad from './Components/Screens/Notepad';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaperProvider } from 'react-native-paper';
import PrivacyPolicy from './Components/Screens/PrivacyPolicy';
import TermsAndConditions from './Components/Screens/TermsAndConditions';


const Stack = createStackNavigator();


function App() {

  const [firsttime, setFirstTime] = React.useState(false)

  const GetFirstTime = async () => {
    await AsyncStorage.getItem("firsttime").then((rs) => {
      if (rs == null) {
        setFirstTime(true)
      }
      else {
        setFirstTime(false)
      }
    })
  }

  React.useEffect(() => {
    GetFirstTime()
  }, [])

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>


          {firsttime ?
            <Stack.Group navigationKey='Onboarding'>
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="Notepad" component={Notepad} options={{
                animationEnabled: true, animation: 'slide_from_bottom',
                gestureEnabled: true,
                presentation: 'modal',
                ...(TransitionPresets.ModalPresentationIOS)
              }} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
                animationEnabled: true, animation: 'slide_from_bottom',
                gestureEnabled: true,
                presentation: 'modal',
                ...(TransitionPresets.ModalPresentationIOS)
              }} />
              <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{
                animationEnabled: true, animation: 'slide_from_bottom',
                gestureEnabled: true,
                presentation: 'modal',
                ...(TransitionPresets.ModalPresentationIOS)
              }} />
            </Stack.Group>
            :
            <Stack.Group navigationKey='HomeScreen'>
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="Notepad" component={Notepad} options={{
                animationEnabled: true, animation: 'slide_from_bottom',
                gestureEnabled: true,
                presentation: 'modal',
                ...(TransitionPresets.ModalPresentationIOS)
              }} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
                animationEnabled: true, animation: 'slide_from_bottom',
                gestureEnabled: true,
                presentation: 'modal',
                ...(TransitionPresets.ModalPresentationIOS)
              }} />
              <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{
                animationEnabled: true, animation: 'slide_from_bottom',
                gestureEnabled: true,
                presentation: 'modal',
                ...(TransitionPresets.ModalPresentationIOS)
              }} />
            </Stack.Group>}

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;