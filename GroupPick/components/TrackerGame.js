import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { TrackerAwayTeam } from "./TrackerAwayTeam";
import { TrackerHomeTeam } from "./TrackerHomeTeam";
import { TrackerGameStatus } from "./TrackerGameStatus";
import { GetTeamData, GetLiveData, GetLocalPicks } from "../backend/functions";
import { useEffect, useState } from "react";

const TrackerGame = (props) => {
  //   console.log("trackergame props:", props);
  const [logo, setLogo] = useState("");
  const [liveData, setLiveData] = useState("");
  const [status, setStatus] = useState("");
  const [pick, setPick] = useState("");

  useEffect(() => {
    GetLiveData(props.gameID).then((res) => {
      //   console.log("loggin live data", res);
      setLiveData(res);
    });
  }, []);

  useEffect(() => {
    GetLocalPicks().then((res) => {
      console.log("response of GLP is", res);
      if (res && props.passedIndex < res.length) {
        setPick(res[props.passedIndex]);
      } else {
        setPick["no Pick"];
      }
    });
  }, []);

  useEffect(() => {
    console.log("live data", liveData);
    if (liveData.status == "Final") {
      setStatus("Final");
    } else if (liveData.status == "Preview") {
      setStatus(liveData.startTime);
    } else {
      console.log(liveData.inningHalf, liveData.inning);
      setStatus(liveData.inningHalf + " " + liveData.inning);
    }
  }, [liveData]);

  let myTime = new Date(props.time);
  if (liveData && status && pick) {
    // console.log("live data is", liveData);
    return (
      <View style={styles.container}>
        <View style={styles.pickHolder}>
          <Text style={styles.text}>{pick}</Text>
        </View>
        <View style={styles.teamsContainer}>
          <TrackerAwayTeam
            style={styles.awayTeam}
            teamType="away"
            teamID={props.awayTeamID}
            team={props.awayTeam}
            runs={liveData.awayTeamRuns}
            wins={props.awayTeamWins}
            losses={props.awayTeamLosses}
            starter={props.awayStarter}
            starterID={props.awayStarterPlayerID}
          />
          <View style={styles.gameStatus}>
            <TrackerGameStatus status={status}></TrackerGameStatus>
          </View>
          <TrackerHomeTeam
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
    justifyContent: "center",
    alignContent: "center",
    margin: 10,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 10,
    overflow: "hide",
    minWidth: "70%",
  },
  text: {
    padding: 5,
  },
  teamsContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pickHolder: {
    borderBottomWidth: 2,
    borderColor: "black",
    alignItems: "center",
    width: "100%",
  },
  awayTeam: {
    minWidth: "33%",
  },
  gameStatus: {
    minWidth: "33.3333%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export { TrackerGame };
