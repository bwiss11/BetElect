import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import SoloPicks from "./screens/SoloPicks";
// import GroupPicks from "./screens/GroupPicks";
// import Stats from "./screens/Stats";
// import ProfilePage from "./screens/ProfilePage";
// import Tracker from "./screens/Tracker";
import Login from "./screens/Login";
import { Tabs } from "./navigation/Tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  tabBarActiveTintColor: "rgb(150, 150, 255, 100)",
  tabBarInactiveTintColor: "white",
  headerStyle: {
    backgroundColor: "black",
  },
  headerTitleStyle: {
    color: "white",
  },
  right: 10,
  height: 900,
  tabBarStyle: {
    backgroundColor: "black",
    color: "white",
  },
};

const loggedIn = false;

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tabs" component={Tabs} />
      </Stack.Navigator>
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
