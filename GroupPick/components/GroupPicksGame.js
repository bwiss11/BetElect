import { React, useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { GroupsTeam } from "./GroupsTeam";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import GroupGameTopRow from "./GroupGameTopRow";
import { getGroup } from "../backend/firestore";
import { GroupGamePick } from "./GroupGamePick";

const GroupPicksGame = (props) => {
  // console.log("gpg props", props);

  const [members, setMembers] = useState("");

  let myTime = new Date(props.time);

  useEffect(() => {
    getGroup("8CRNyZRpMI69ogcSQkt3").then((res) => {
      setMembers(res.members);
    });
  }, []);

  if (members) {
    return (
      <View style={styles.container}>
        <GroupGameTopRow
          time={props.time}
          status={props.status}
          members={members}
          index={props.index}
        />
        <View style={styles.teamsContainer}>
          <GroupsTeam
            teamType="away"
            teamID={props.awayTeamID}
            team={props.awayTeam}
            wins={props.awayTeamWins}
            losses={props.awayTeamLosses}
            starter={props.awayStarter}
            starterID={props.awayStarterPlayerID}
          />
          <GroupsTeam
            teamType="home"
            teamID={props.homeTeamID}
            team={props.homeTeam}
            wins={props.homeTeamWins}
            losses={props.homeTeamLosses}
            starter={props.homeStarter}
            starterID={props.homeStarterPlayerID}
          />
        </View>
        {/* <View style={styles.pickHolder}> */}
        <GroupGamePick {...props}></GroupGamePick>
        {/* </View> */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 900,
    alignItems: "center",
    margin: 10,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 10,
    overflow: "hide",
    backgroundColor: "black",
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
  pickHolder: {
    width: 10,
    minWidth: "100%",
    backgroundColor: "red",
  },
});

export { GroupPicksGame };
