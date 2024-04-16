import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const Team = (props) => {
  // console.log("Team props", props);
  return (
    <View style={styles.container}>
      <View style={styles.team}>
        <Text>{props.team}</Text>
        <Text>
          {props.wins} - {props.losses}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aqua",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  team: {
    alignItems: "center",
    padding: 10,
  },
});

export { Team };
