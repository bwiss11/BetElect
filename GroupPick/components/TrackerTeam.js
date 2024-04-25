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

const TrackerTeam = (props) => {
  const [pitcherStats, setPitcherStats] = useState("");
  const [teamData, setTeamData] = useState("");
  const [logo, setLogo] = useState("");
  // console.log("Team props", props, props.starterID);

  useEffect(() => {
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
      // console.log("Team data set to", [
      //   res.teams[0].franchiseName,
      //   res.teams[0].clubName,
      // ]);
    });
    // GetTeamLogo(props.teamID).then((res) => {
    //   console.log("team logo:", res.toString());
    //   setLogo(res.toString());
    //   // setTeamData([res.teams[0].franchiseName, res.teams[0].clubName]);
    // });
  }, []);

  let imageLink =
    "https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/" +
    logoMap[props.teamID] +
    ".png";

  function dynamicStyle(teamType) {
    if (teamType == "away") {
      return {
        borderTopWidth: 2,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        width: "50%",
        minWidth: 150,
        alignItems: "center",
      };
    } else {
      return {
        borderTopWidth: 2,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        width: "50%",
        minWidth: 150,
        alignItems: "center",
      };
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: imageLink }}></Image>
      <Text style={styles.text}>{teamData[1]}</Text>
      <View style={styles.scoreHolder}>
        <Text style={[styles.text]}>{props.runs}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "50%",
    borderColor: "black",
    justifyContent: "left",
  },
  image: {
    height: 30,
    width: 30,
    margin: 5,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
  scoreHolder: {
    marginLeft: "auto",
  },
});

export { TrackerTeam };
