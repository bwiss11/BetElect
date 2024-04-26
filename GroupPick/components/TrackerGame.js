import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { TrackerAwayTeam } from "./TrackerAwayTeam";
import { TrackerHomeTeam } from "./TrackerHomeTeam";
import { TrackerGameStatus } from "./TrackerGameStatus";
import { GetTeamData, GetLiveData, GetLocalPicks } from "../backend/functions";
import { useEffect, useState } from "react";
import teamIDMap from "../teamIDMap.json";

const TrackerGame = (props) => {
  console.log("trackergame props:", props);
  const [logo, setLogo] = useState("");
  const [liveData, setLiveData] = useState("");
  const [status, setStatus] = useState("");
  const [pick, setPick] = useState("");
  const [teamData, setTeamData] = useState("");

  useEffect(() => {
    GetLiveData(props.gameID).then((res) => {
      //   console.log("loggin live data", res);
      setLiveData(res);
    });
  }, []);

  useEffect(() => {
    if (teamData) {
      GetLocalPicks().then((res) => {
        if (res && props.passedIndex < res.length) {
          // setPick(res[props.passedIndex]);
          // console.log("slice is ", String(res[props.passedIndex]).slice(0, 4));
          pickOdds = props[props.passedIndex][res[props.passedIndex] + "Odds"];
          if (Number(pickOdds) > 0) {
            pickOdds = "+" + pickOdds;
          }
          let thisPick;
          if (res[props.passedIndex].slice(0, 4) == "away") {
            if (res[props.passedIndex].slice(4, 10) == "Spread") {
              if (Number(props.awaySpread) > 0) {
                thisPick =
                  teamIDMap[String(props.awayTeamID)][2] +
                  " +" +
                  props.awaySpread;
              } else {
                thisPick =
                  teamIDMap[String(props.awayTeamID)][2] +
                  " " +
                  props.awaySpread;
              }
            } else {
              thisPick = teamIDMap[String(props.awayTeamID)][2] + " ML";
            }
          } else if (res[props.passedIndex].slice(0, 4) == "home") {
            if (res[props.passedIndex].slice(4, 10) == "Spread") {
              if (Number(props.homeSpread) > 0) {
                thisPick =
                  teamIDMap[String(props.homeTeamID)][2] +
                  " +" +
                  props.homeSpread;
              } else {
                thisPick =
                  teamIDMap[String(props.homeTeamID)][2] +
                  " " +
                  props.homeSpread;
              }
            } else {
              thisPick = teamIDMap[String(props.homeTeamID)][2] + " ML";
            }
          } else if (res[props.passedIndex].slice(0, 4) == "over") {
            thisPick = "over " + props.total;
          } else if (res[props.passedIndex].slice(0, 5) == "under") {
            thisPick = "under " + props.total;
          }
          setPick(thisPick + " " + pickOdds);
        } else {
          setPick["no Pick"];
        }
      });
    }
  }, [teamData]);

  useEffect(() => {
    GetTeamData(props.awayTeamID).then((res) => {
      console.log("res is", res);
      setTeamData([res.teams[0].franchiseName, res.teams[0].clubName]);
    });
  }, []);

  useEffect(() => {
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
    console.log("props in TG", props);
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
    padding: 10,
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
