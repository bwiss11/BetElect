import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const WinningChoices = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Text>ML</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>-1.5</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>+1.5</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>ML</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderColor: "black",
    backgroundColor: "yellow",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    flexWrap: "wrap",
  },
  button: {
    width: "25%",
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    zIndex: 1000000,
  },
});

export { WinningChoices };
