import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { GetGames, GetOdds, GetPitcherStats } from "../backend/functions";
import { useEffect, useState } from "react";

const Team = (props) => {
  const [pitcherStats, setPitcherStats] = useState("");
  console.log("Team props", props, props.starterID);

  useEffect(() => {
    GetPitcherStats(props.starterID).then((res) => {
      setPitcherStats(
        res.people[0].stats ? res.people[0].stats[0].splits[0] : "None"
      );
      console.log(
        "Got pitcher stats:",
        res.people[0].stats ? res.people[0].stats[0].splits[0].stat.era : "None"
      );
    });
  }, []);

  if (pitcherStats && pitcherStats != "None") {
    return (
      <View style={styles.container}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{props.team}</Text>
          <Text style={styles.record}>
            ({props.wins} - {props.losses})
          </Text>
        </View>
        <View style={styles.pitcherInfo}>
          <Text style={styles.starter}>{props.starter}</Text>
          <Text>
            ({pitcherStats.stat.wins} - {pitcherStats.stat.losses} ,{" "}
            {pitcherStats.stat.era})
          </Text>
        </View>
      </View>
    );
  } else if (pitcherStats) {
    if (props.starterID) {
      return (
        <View style={styles.container}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{props.team}</Text>
            <Text style={styles.record}>
              ({props.wins} - {props.losses})
            </Text>
          </View>
          <View style={styles.pitcherInfo}>
            <Text style={styles.starter}>{props.starter}</Text>
            <Text>(0 - 0, 0.00)</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{props.team}</Text>
            <Text style={styles.record}>
              ({props.wins} - {props.losses})
            </Text>
          </View>
          <View style={styles.pitcherInfo}>
            <Text style={styles.starter}>{props.starter}</Text>
          </View>
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    // backgroundColor: "blue",
    padding: 10,
  },
  teamInfo: {
    padding: 5,
    color: "red",
    textTransform: "uppercase",
    alignItems: "center",
  },
  teamName: {
    alignItems: "center",
    fontWeight: "bold",
  },
  pitcherInfo: {
    padding: 5,
    alignItems: "center",
  },
  starterContainer: {
    borderColor: "black",
    borderWidth: 1,
  },
  record: {},
  starter: {},
});

export { Team };
