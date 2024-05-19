import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";

const Login = ({ navigation }) => {
  return (
    <View style={styles.outermostContainer}>
      <Pressable onPress={() => navigation.navigate("Tabs")}>
        <Text style={styles.buttonText}>Login Button</Text>
      </Pressable>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  outermostContainer: {
    minWidth: "40%",
    backgroundColor: "black",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  //   container: {
  //     flex: 1,
  //     width: "100%",
  //     backgroundColor: "black",
  //     alignItems: "center",
  //     paddingBottom: 100,
  //   },
});
