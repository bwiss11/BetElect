import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SoloPicks from "./screens/SoloPicks";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <SoloPicks />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
