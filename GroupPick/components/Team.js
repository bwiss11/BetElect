import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const Team = (props) => {
  // console.log("Team props", props);
  return (
    <View style={styles.container}>
      <View style={styles.gameInfo}>
        <Text style={styles.teamName}>{props.team}</Text>
        <Text style={styles.record}>
          ({props.wins} - {props.losses})
        </Text>
        <Text style={styles.starter}>{props.starter}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  gameInfo: {
    padding: 10,
    alignItems: "center",
  },
  teamName: {
    alignItems: "center",
    fontWeight: "bold",
    fontStyle: "bold",
  },
  record: {},
  starter: {},
});

export { Team };
