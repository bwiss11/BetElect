import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { Team } from "./Team";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import GroupGameTopRow from "./GroupGameTopRow";

const GroupPicksGame = (props) => {
  // console.log("game props", props);
  let myTime = new Date(props.time);
  return (
    <View style={styles.container}>
      <GroupGameTopRow time={props.time} />

      <View style={styles.teamsContainer}>
        <Team
          teamType="away"
          teamID={props.awayTeamID}
          team={props.awayTeam}
          wins={props.awayTeamWins}
          losses={props.awayTeamLosses}
          starter={props.awayStarter}
          starterID={props.awayStarterPlayerID}
        />
        <Team
          teamType="home"
          teamID={props.homeTeamID}
          team={props.homeTeam}
          wins={props.homeTeamWins}
          losses={props.homeTeamLosses}
          starter={props.homeStarter}
          starterID={props.homeStarterPlayerID}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 900,
    backgroundColor: "white",
    alignItems: "center",
    margin: 10,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 10,
    overflow: "hide",
  },
  time: {
    padding: 5,
  },
  timeHolder: {
    flex: 1,
    backgroundColor: "blue",
  },
  recordsContainer: {
    flexDirection: "row",
  },
  records: {
    paddingRight: 100,
  },
  teamsContainer: {
    flexDirection: "row",
  },
  awayTeam: {
    rightBorderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
  },
  topRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "left",
    backgroundColor: "red",
    width: "100%",
    height: 50,
  },
  avatarsHolder: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "red",
  },
  groupAvatars: {
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
});

export { GroupPicksGame };
