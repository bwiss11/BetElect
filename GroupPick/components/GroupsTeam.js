import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { GetPitcherStats, GetTeamData } from "../backend/functions";
import { useEffect, useState } from "react";
import logoMap from "../logoMap.json";

const GroupsTeam = (props) => {
  // Team buckets to be displayed on Group tab
  const [pitcherStats, setPitcherStats] = useState("");
  const [teamData, setTeamData] = useState("");

  useEffect(() => {
    // Gets team and starter's information/stats and sets related state variables
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

  function dynamicStyle(teamType) {
    // Sets the styling of the team bucket to be displayed depending if home (left) or away (right) team
    if (teamType == "away") {
      return {
        borderTopWidth: 2,
        borderRightWidth: 1,
        width: "50%",
        minWidth: 150,
        alignItems: "center",
        backgroundColor: "white",
      };
    } else {
      return {
        borderTopWidth: 2,
        borderLeftWidth: 1,
        width: "50%",
        minWidth: 150,
        alignItems: "center",
        backgroundColor: "white",
        borderTopRightRadius: 10,
      };
    }
  }

  if (teamData) {
    return (
      <View style={dynamicStyle(props.teamType)}>
        <View style={styles.teamInfo}></View>
        <Image style={styles.image} source={{ uri: imageLink }}></Image>
        <Text style={styles.record}>
          ({props.wins} - {props.losses})
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    minWidth: "30%",
    alignItems: "center",
    borderColor: "black",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  image: {
    height: 50,
    width: 50,
    margin: 5,
  },
  teamInfo: {
    color: "red",
    alignItems: "center",
    margin: 5,
  },
  teamName: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  pitcherInfo: {
    alignItems: "center",
    margin: 5,
    marginBottom: 10,
  },
  starterContainer: {
    borderColor: "black",
    borderWidth: 1,
  },
  record: { fontSize: 12, marginBottom: 10 },
  starter: { fontSize: 12 },
  starterStats: { fontSize: 12 },
});

export { GroupsTeam };
