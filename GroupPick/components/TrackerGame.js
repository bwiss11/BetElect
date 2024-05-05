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
  //   console.log("trackergame props:", props);
  const [logo, setLogo] = useState("");
  const [liveData, setLiveData] = useState("");
  const [status, setStatus] = useState("");
  const [pick, setPick] = useState("");
  const [teamData, setTeamData] = useState("");
  const [pickType, setPickType] = useState("");
  const [pickStatus, setPickStatus] = useState("");

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
          setPickType([
            res[props.passedIndex],
            props.awaySpread,
            props.homeSpread,
            props.total,
          ]);
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
            thisPick = "Over " + props.total;
          } else if (res[props.passedIndex].slice(0, 5) == "under") {
            thisPick = "Under " + props.total;
          }
          if (thisPick && pickOdds) {
            setPick(thisPick + " " + pickOdds);
          }
        } else {
          setPick[""];
        }
      });
    }
  }, [teamData]);

  useEffect(() => {
    GetTeamData(props.awayTeamID).then((res) => {
      setTeamData([res.teams[0].franchiseName, res.teams[0].clubName]);
    });
  }, []);

  useEffect(() => {
    if (liveData.status == "Final") {
      setStatus("Final");
    } else if (liveData.status == "Preview") {
      setStatus(liveData.startTime);
    } else {
      setStatus(liveData.inningHalf + " " + liveData.inning);
    }
  }, [liveData]);

  useEffect(() => {
    if (
      pickType &&
      liveData &&
      status &&
      status.slice(status.length - 1, status.length) != "M"
    ) {
      awayScore = liveData.awayTeamRuns;
      homeScore = liveData.homeTeamRuns;
      if (pickType[0] == "homeML") {
        if (homeScore > awayScore) {
          setPickStatus("winning");
        } else if (homeScore < awayScore) {
          setPickStatus("losing");
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "awayML") {
        if (homeScore > awayScore) {
          setPickStatus("losing");
        } else if (homeScore < awayScore) {
          setPickStatus("winning");
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "homeSpread") {
        if (homeScore + pickType[2] > awayScore) {
          setPickStatus("winning");
        } else if (homeScore + pickType[2] < awayScore) {
          setPickStatus("losing");
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "awaySpread") {
        if (awayScore + pickType[1] > homeScore) {
          setPickStatus("winning");
        } else if (awayScore + pickType[1] < homeScore) {
          setPickStatus("losing");
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "over") {
        if (awayScore + homeScore > pickType[3]) {
          setPickStatus("winning");
        } else if (awayScore + homeScore < pickType[3]) {
          setPickStatus("losing");
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "under") {
        if (awayScore + homeScore < pickType[3]) {
          setPickStatus("winning");
        } else if (awayScore + homeScore > pickType[3]) {
          setPickStatus("losing");
        } else {
          setPickStatus("tied");
        }
      }
    }
  }, [pickType, liveData]);

  const pickStatusStyle = () => {
    console.log("status", status);
    if (pickStatus == "winning") {
      return {
        backgroundColor: "rgba(20, 186, 65, 0.25)",
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderColor: "black",
      };
    } else if (pickStatus == "losing") {
      return {
        backgroundColor: "rgba(235, 31, 45, 0.25)",
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderColor: "black",
      };
    } else {
      return {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderColor: "black",
      };
    }
  };

  let myTime = new Date(props.time);
  if (liveData && status && pick) {
    // console.log("live data is", liveData);
    return (
      <View style={styles.container}>
        <View style={pickStatusStyle()}>
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
            status={status}
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
            status={status}
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
  tied: {
    backgroundColor: "white",
  },
  winning: {
    backgroundColor: "green",
  },
  losing: { backgroundColor: "red" },
});

export { TrackerGame };
