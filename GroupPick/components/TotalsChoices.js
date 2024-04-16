import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const TotalsChoices = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button25}>
        <Text>Under</Text>
      </Pressable>
      <Pressable style={styles.button50}>
        <Text>O/U: </Text>
      </Pressable>
      <Pressable style={styles.button25}>
        <Text>Over</Text>
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
  button25: {
    width: "25%",
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button50: {
    width: "50%",
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export { TotalsChoices };
