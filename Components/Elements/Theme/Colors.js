import { useState, useEffect } from "react";
import { Appearance } from "react-native";
import * as Updates from 'expo-updates'
export const UseCustomTheme = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const listener = ({ colorScheme }) => {
      setTheme(colorScheme);
    };
    
    const subscription = Appearance.addChangeListener(listener);
    console.log(theme);
    
  }, []);

  const Colors = theme === "dark" ? darkColors : lightColors;

  return Colors;
};

const lightColors = {
  background: "#F2F9FF",
  pink: "#FFBFD0",
  blue: "#C0E5FF",
  green: "#BFFFE7",
  yellow: "#FEF2BE",
  text:"#414141"
};

const darkColors = {
  background: "#121212",
  pink: "#FFBFD0",
  blue: "#C0E5FF",
  green: "#BFFFE7",
  yellow: "#FEF2BE",
  text:"white"
};
