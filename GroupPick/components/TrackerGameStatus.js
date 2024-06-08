import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const TrackerGameStatus = (props) => {
  // Game status for game buckets in Tracker tab - shows start time if not started yet, inning if started, "Final"/"Postponed" if finished/never started
  function textStyle() {
    // Styles text based on game's status
    if (props.gameState == "Final" || props.detailedState == "Postponed") {
      return {
        color: "rgba(255,255,255, 0.8)",
        fontSize: 16,
        margin: 3,
      };
    } else {
      return {
        fontSize: 16,
        margin: 3,
      };
    }
  }

  // If game has started
  if (props.gameStatus != "Preview" && props.status.slice(0, 3) == "Top") {
    // If top of inning
    return (
      <View style={styles.container}>
        <AntDesign name="caretup" size={18} color="black" paddingTop={5} />
        <Text style={textStyle()}>{props.status.split(" ")[1]}</Text>
      </View>
    );
  } else if (
    // If bottom of inning
    props.gameStatus != "Preview" &&
    props.status.slice(0, 3) == "Bot"
  ) {
    return (
      <View style={styles.container}>
        <AntDesign name="caretdown" size={18} color="black" paddingBottom={4} />
        <Text style={textStyle()}>{props.status.split(" ")[1]}</Text>
      </View>
    );
  }
  return (
    // If game is not currently in progress
    <Text style={textStyle()}>
      {props.status == "Final"
        ? props.status
        : props.detailedState == "Postponed"
        ? "Postponed"
        : props.time}
    </Text>
  );
};

export { TrackerGameStatus };

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    justifyContent: "center",
    alignContent: "center",
  },
  image: {
    height: 40,
    width: 40,
    marginLeft: 15,
    paddingBottom: 10,
  },
});
