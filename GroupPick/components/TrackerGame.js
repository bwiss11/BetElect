import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { TrackerTeam } from "./TrackerTeam";
import { GetTeamData, GetLiveData } from "../backend/functions";
import { useEffect, useState } from "react";

const TrackerGame = (props) => {
  console.log("trackergame props:", props);
  // console.log("game props", props);
  const [logo, setLogo] = useState("");
  const [liveData, setLiveData] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    GetLiveData(props.gameID).then((res) => {
      //   console.log("loggin live data", res);
      setLiveData(res);
    });
  }, []);

  useEffect(() => {
    if (liveData.status == "Final") {
      setStatus("Final");
    } else {
      //   setStatus("hi");
      console.log(liveData.inningHalf, liveData.inning);
      setStatus(liveData.inningHalf + " " + liveData.inning);
    }
  }, [liveData]);

  let myTime = new Date(props.time);
  if (liveData && status) {
    console.log("live data is", liveData);
    return (
      <View style={styles.container}>
        <View style={styles.statusHolder}>
          <Text style={styles.text}>{status}</Text>
        </View>
        <View style={styles.teamsContainer}>
          <TrackerTeam
            teamType="away"
            teamID={props.awayTeamID}
            team={props.awayTeam}
            runs={liveData.awayTeamRuns}
            wins={props.awayTeamWins}
            losses={props.awayTeamLosses}
            starter={props.awayStarter}
            starterID={props.awayStarterPlayerID}
          />
          <TrackerTeam
            teamType="home"
            teamID={props.homeTeamID}
            team={props.homeTeam}
            runs={liveData.homeTeamRuns}
            wins={props.homeTeamWins}
            losses={props.homeTeamLosses}
            starter={props.homeStarter}
            starterID={props.homeStarterPlayerID}
          />
        </View>
        <View style={styles.pickHolder}>
          <Text style={styles.text}>Pick, Pick Money, Pick Odds</Text>
        </View>
      </View>
    );
  }
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
  text: {
    padding: 5,
  },
  teamsContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "left",
  },
  awayTeam: {
    rightBorderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
  },
  statusHolder: {
    borderBottomWidth: 2,
    borderColor: "black",
    alignItems: "center",
    width: "100%",
  },
  pickHolder: {
    borderTopWidth: 2,
    borderColor: "black",
    alignItems: "center",
    width: "100%",
  },
});

export { TrackerGame };
