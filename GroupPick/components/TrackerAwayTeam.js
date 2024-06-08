import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import {
  GetGames,
  GetOdds,
  GetPitcherStats,
  GetTeamData,
  GetTeamLogo,
} from "../backend/functions";
import { useEffect, useState } from "react";
import logoMap from "../logoMap.json";

const TrackerAwayTeam = (props) => {
  // Away team bucket for Tracker tab
  const [pitcherStats, setPitcherStats] = useState("");
  const [teamData, setTeamData] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    // Gets team and starter info/stats and sets related state variables
    if (props.starterID) {
      GetPitcherStats(props.starterID).then((res) => {
        if (res) {
          setPitcherStats(
            res.people[0].stats ? res.people[0].stats[0].splits[0] : "None"
          );
        }
      });
    }
    GetTeamData(props.teamID).then((res) => {
      setTeamData([res.teams[0].franchiseName, res.teams[0].clubName]);
    });
  }, []);

  // Gets team's logo from ESPN's API based on team id
  let imageLink =
    "https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/" +
    logoMap[props.teamID] +
    ".png";

  // Special handling of team logos that are too dark to see with a black background
  const tooDarkTeamIDs = new Set([115, 135, 147]);

  function dynamicImageStyle() {
    // Sets the styling of the logo based on game status
    if (props.status == "Final" || props.detailedState == "Postponed") {
      // Game is finalized and should be darkened
      if (tooDarkTeamIDs.has(props.teamID)) {
        // Special styling for team logos that are too dark to see on black background
        return {
          height: 40,
          width: 40,
          marginLeft: 5,
          marginRight: 10,
          tintColor: "rgba(255, 255, 255, 1)",
        };
      } else if (props.teamID == 134) {
        // Pirates logo special handling - should be yellow
        return {
          height: 40,
          width: 40,
          marginLeft: 5,
          marginRight: 10,
          tintColor: "rgba(253, 184, 39, 1)",
        };
      } else {
        // Styling for logos that are still visible with black background
        return {
          height: 40,
          width: 40,
          marginLeft: 5,
          marginRight: 10,
        };
      }
    } else {
      // Styling for logos that are still visible with black background
      return {
        height: 40,
        width: 40,
        marginLeft: 5,
        marginRight: 10,
      };
    }
  }

  function textStyle() {
    // Sets the styling of text based on game status
    if (props.status == "Final" || props.detailedState == "Postponed") {
      return {
        fontWeight: "bold",
        fontSize: 28,
        color: "rgba(255,255,255,0.8)",
      };
    } else {
      return {
        fontWeight: "bold",
        fontSize: 28,
      };
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.batHolder}></View>
      <Image style={dynamicImageStyle()} source={{ uri: imageLink }}></Image>
      <View style={styles.scoreHolder}>
        <Text style={textStyle()}>
          {props.status.slice(0, 1) == "B" ||
          props.status.slice(0, 1) == "T" ||
          props.status == "Final"
            ? props.runs
            : ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
  },
  image: {
    height: 40,
    width: 40,
    margin: 5,
    marginRight: 15,
    tintColor: "rgba(255, 255, 255, 0.75)",
  },
  batHolder: {
    minWidth: 5,
  },
});

export { TrackerAwayTeam };
