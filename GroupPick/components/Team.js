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

const Team = (props) => {
  const [pitcherStats, setPitcherStats] = useState("");
  const [teamData, setTeamData] = useState("");
  const [logo, setLogo] = useState("");
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
    GetTeamData(props.teamID).then((res) => {
      setTeamData([res.teams[0].franchiseName, res.teams[0].clubName]);
    });
    // GetTeamLogo(props.teamID).then((res) => {
    //   console.log("team logo:", res.toString());
    //   setLogo(res.toString());
    //   // setTeamData([res.teams[0].franchiseName, res.teams[0].clubName]);
    // });
    console.log("logo map is:", logoMap[109]);
    console.log(
      "https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/" +
        logoMap[props.teamID] +
        ".png"
    );
  }, []);

  let imageLink =
    "https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/" +
    logoMap[props.teamID] +
    ".png";

  console.log("image link is ", imageLink);

  useEffect(() => {
    console.log("logo data", typeof logo, logo);
  }, [logo]);

  function dynamicStyle(teamType) {
    if (teamType == "away") {
      return {
        borderTopWidth: 1,
        borderRightWidth: 1,
        width: "50%",
        minWidth: 150,
        alignItems: "center",
      };
    } else {
      return {
        borderTopWidth: 1,
        borderLeftWidth: 1,
        width: "50%",
        minWidth: 150,
        alignItems: "center",
      };
    }
  }

  if (pitcherStats && pitcherStats != "None" && teamData) {
    return (
      <View style={dynamicStyle(props.teamType)}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{teamData[0]}</Text>
          <Text style={styles.teamName}>{teamData[1]}</Text>
          <Text style={styles.record}>
            ({props.wins} - {props.losses})
          </Text>
        </View>
        <Image style={styles.image} source={{ uri: imageLink }}></Image>
        <View style={styles.pitcherInfo}>
          <Text style={styles.starter}>{props.starter}</Text>
          <Text style={styles.starterStats}>
            ({pitcherStats.stat.wins} - {pitcherStats.stat.losses} ,{" "}
            {pitcherStats.stat.era})
          </Text>
        </View>
      </View>
    );
  } else if (pitcherStats) {
    if (props.starterID) {
      return (
        <View style={dynamicStyle(props.teamType)}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{teamData[0]}</Text>
            <Text style={styles.teamName}>{teamData[1]}</Text>
            <Text style={styles.record}>
              ({props.wins} - {props.losses})
            </Text>
          </View>
          <Image style={styles.image} source={{ uri: imageLink }}></Image>
          <View style={styles.pitcherInfo}>
            <Text style={styles.starter}>{props.starter}</Text>
            <Text style={styles.starterStats}>(0 - 0, 0.00)</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{teamData[0]}</Text>
            <Text style={styles.teamName}>{teamData[1]}</Text>
            <Text style={styles.record}>
              ({props.wins} - {props.losses})
            </Text>
            <Image style={styles.image} source={{ uri: imageLink }}></Image>
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
    minWidth: 150,
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
    // textTransform: "uppercase",
    alignItems: "center",
    margin: 5,
    marginTop: 10,
  },
  teamName: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 16,
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
  home: {
    backgroundColor: "green",
  },
  away: {
    backgroundColor: "green",
  },
  record: {},
  starter: {},
  starterStats: {},
});

export { Team };
