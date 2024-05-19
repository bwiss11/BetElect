import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { TrackerAwayTeam } from "./TrackerAwayTeam";
import { GetTeamData, GetLiveData } from "../backend/functions";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";

const TrackerGameStatus = (props) => {

  function textStyle() {
    if (props.gameState == "Final") {

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
  if (props.gameStatus != "Preview" && props.status.slice(0, 3) == "Top") {
    return (
      <View style={styles.container}>
        <AntDesign name="caretup" size={18} color="black" paddingTop={5} />
        <Text style={textStyle()}>{props.status.split(" ")[1]}</Text>
      </View>
    );
  } else if (
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
    <Text style={textStyle()}>
      {props.status == "Final" ? props.status : props.time}
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
