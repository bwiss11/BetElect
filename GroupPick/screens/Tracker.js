import { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";

const Tracker = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bet Tracker Page Placeholder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});

export default Tracker;