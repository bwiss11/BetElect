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
import { FontAwesome6 } from "@expo/vector-icons";
import DropShadow from "react-native-drop-shadow";

const TrackerHomeTeam = (props) => {
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

  const nonOutlineTeamIDs = new Set([110, 112, 114, 117, 141, 145, 158]);

  function dynamicImageStyle() {
    if (props.status == "Final" || props.detailedState == "Postponed") {
      if (!nonOutlineTeamIDs.has(props.teamID)) {
        return {
          height: 40,
          width: 40,
          marginLeft: 10,
          marginRight: 5,
          tintColor: "rgba(255, 255, 255, 0.3)",
        };
      } else {
        return {
          height: 40,
          width: 40,
          marginLeft: 10,
          marginRight: 5,
          // tintColor: "grey",
          filter: "grayscale(100%)",
        };
      }
    } else {
      return {
        height: 40,
        width: 40,
        marginLeft: 10,
        marginRight: 5,
        marginLeft: 10,
      };
    }
  }

  function textStyle() {
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
      <View style={styles.scoreHolder}>
        <Text style={textStyle()}>
          {props.status.slice(0, 1) == "B" ||
          props.status.slice(0, 1) == "T" ||
          props.status == "Final"
            ? props.runs
            : ""}
        </Text>
      </View>

      <Image style={dynamicImageStyle()} source={{ uri: imageLink }}></Image>
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
    marginLeft: 15,
    marginRight: 10,
    // shadowColor: "white",
    // shadowOffset: { width: 1, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 1,
    // borderColor: "red",
    // borderWidth: 5,
    tintColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 3,
    // elevation: 5, // Android
  },
  batHolder: {
    alignItems: "center",
    minWidth: 5,
  },
});

export { TrackerHomeTeam };
