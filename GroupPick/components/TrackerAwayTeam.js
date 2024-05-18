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
  console.log("TAT props are:", props);
  const [pitcherStats, setPitcherStats] = useState("");
  const [teamData, setTeamData] = useState("");
  const [logo, setLogo] = useState("");

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

  function dynamicImageStyle() {
    if (props.status == "Final") {
      return {
        height: 40,
        width: 40,
        margin: 5,
        marginRight: 10,
        tintColor: "rgba(255, 255, 255, 0.75)",
      };
    } else {
      return {
        height: 40,
        width: 40,
        margin: 5,
        marginRight: 10,
      };
    }
  }

  function textStyle() {
    if (props.status == "Final") {
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
