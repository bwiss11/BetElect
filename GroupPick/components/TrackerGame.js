import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { PickOptions } from "./PickOptions";
import { TrackerAwayTeam } from "./TrackerAwayTeam";
import { TrackerHomeTeam } from "./TrackerHomeTeam";
import { TrackerGameStatus } from "./TrackerGameStatus";
import {
  GetTeamData,
  GetLiveData,
  GetLocalPicks,
  GetFormattedDate,
} from "../backend/functions";
import { useEffect, useState } from "react";
import teamIDMap from "../teamIDMap.json";

const TrackerGame = (props) => {
  console.log("trackergame props:", props);
  const [logo, setLogo] = useState("");
  const [liveData, setLiveData] = useState("");
  const [status, setStatus] = useState("");
  const [translatedPick, setTranslatedPick] = useState("");
  const [teamData, setTeamData] = useState("");
  const [pickType, setPickType] = useState("");
  const [pickStatus, setPickStatus] = useState("");

  // const curDate = new Date(Date.now()).toISOString().split("T")[0];
  const curDate = GetFormattedDate();

  useEffect(() => {
    GetLiveData(props.gameID).then((res) => {
      //   console.log("loggin live data", res);
      setLiveData(res);
    });
    // console.log("setting pikc to", props.translatedPicks[props.index]);
    setTranslatedPick(props.translatedPicks[props.index]);
    // console.log("setting picktype to", props.picks[props.index]);
    setPickType([
      props.picks[props.index],
      props.awaySpread,
      props.homeSpread,
      props.total,
    ]);
    // console.log(
    //   "picks is:",
    //   props.picks,
    //   props.index,
    //   props.picks[props.index]
    // );
  }, []);

  useEffect(() => {
    if (teamData) {
      // GetLocalPicks(curDate, "123456").then((res) => {
      //   if (res && props.passedIndex < res.length) {
      //     // setPick(res[props.passedIndex]);
      //     // console.log("slice is ", String(res[props.passedIndex]).slice(0, 4));
      //     pickOdds = props[props.passedIndex][res[props.passedIndex] + "Odds"];
      //     if (Number(pickOdds) > 0) {
      //       pickOdds = "+" + pickOdds;
      //     }
      //     let thisPick;
      //     setPickType([
      //       res[props.passedIndex],
      //       props.awaySpread,
      //       props.homeSpread,
      //       props.total,
      //     ]);
      //     if (res[props.passedIndex].slice(0, 4) == "away") {
      //       if (res[props.passedIndex].slice(4, 10) == "Spread") {
      //         if (Number(props.awaySpread) > 0) {
      //           thisPick =
      //             teamIDMap[String(props.awayTeamID)][2] +
      //             " +" +
      //             props.awaySpread;
      //         } else {
      //           thisPick =
      //             teamIDMap[String(props.awayTeamID)][2] +
      //             " " +
      //             props.awaySpread;
      //         }
      //       } else {
      //         thisPick = teamIDMap[String(props.awayTeamID)][2] + " ML";
      //       }
      //     } else if (res[props.passedIndex].slice(0, 4) == "home") {
      //       if (res[props.passedIndex].slice(4, 10) == "Spread") {
      //         if (Number(props.homeSpread) > 0) {
      //           thisPick =
      //             teamIDMap[String(props.homeTeamID)][2] +
      //             " +" +
      //             props.homeSpread;
      //         } else {
      //           thisPick =
      //             teamIDMap[String(props.homeTeamID)][2] +
      //             " " +
      //             props.homeSpread;
      //         }
      //       } else {
      //         thisPick = teamIDMap[String(props.homeTeamID)][2] + " ML";
      //       }
      //     } else if (res[props.passedIndex].slice(0, 4) == "over") {
      //       thisPick = "Over " + props.total;
      //     } else if (res[props.passedIndex].slice(0, 5) == "under") {
      //       thisPick = "Under " + props.total;
      //     }
      //     if (thisPick && pickOdds) {
      //       setPick(thisPick + " " + pickOdds);
      //     }
      //   } else {
      //     setPick[""];
      //   }
      // });
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
      if (pickStatus == "winning") {
        setPickStatus("won");
      } else if (pickStatus == "losing") {
        setPickStatus("lost");
      }
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
          if (liveData.status == "Final") {
            setPickStatus("won");
          } else {
            setPickStatus("winning");
          }
        } else if (homeScore < awayScore) {
          if (liveData.status == "Final") {
            setPickStatus("lost");
          } else {
            setPickStatus("losing");
          }
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "awayML") {
        if (homeScore > awayScore) {
          if (liveData.status == "Final") {
            setPickStatus("lost");
          } else {
            setPickStatus("losing");
          }
        } else if (homeScore < awayScore) {
          if (liveData.status == "Final") {
            setPickStatus("won");
          } else {
            setPickStatus("winning");
          }
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "homeSpread") {
        if (homeScore + pickType[2] > awayScore) {
          if (liveData.status == "Final") {
            setPickStatus("won");
          } else {
            setPickStatus("winning");
          }
        } else if (homeScore + pickType[2] < awayScore) {
          if (liveData.status == "Final") {
            setPickStatus("lost");
          } else {
            setPickStatus("losing");
          }
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "awaySpread") {
        if (awayScore + pickType[1] > homeScore) {
          if (liveData.status == "Final") {
            setPickStatus("won");
          } else {
            setPickStatus("winning");
          }
        } else if (awayScore + pickType[1] < homeScore) {
          if (liveData.status == "Final") {
            setPickStatus("lost");
          } else {
            setPickStatus("losing");
          }
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "over") {
        if (awayScore + homeScore > pickType[3]) {
          if (liveData.status == "Final") {
            setPickStatus("won");
          } else {
            setPickStatus("winning");
          }
        } else if (awayScore + homeScore < pickType[3]) {
          if (liveData.status == "Final") {
            setPickStatus("lost");
          } else {
            setPickStatus("losing");
          }
        } else {
          setPickStatus("tied");
        }
      } else if (pickType[0] == "under") {
        if (awayScore + homeScore < pickType[3]) {
          if (liveData.status == "Final") {
            setPickStatus("won");
          } else {
            setPickStatus("winning");
          }
        } else if (awayScore + homeScore > pickType[3]) {
          if (liveData.status == "Final") {
            setPickStatus("lost");
          } else {
            setPickStatus("losing");
          }
        } else {
          setPickStatus("tied");
        }
      }
    }
  }, [pickType, liveData]);

  const pickStatusStyle = () => {
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
    } else if (pickStatus == "won") {
      return {
        backgroundColor: "rgba(20, 186, 65, 0.8)",
        flex: 1,
        width: "100%",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderColor: "black",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
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
    } else if (pickStatus == "lost") {
      return {
        backgroundColor: "rgba(235, 31, 45, 0.8)",
        flex: 1,
        width: "100%",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        justifyContent: "center",
        borderBottomWidth: 2,
        borderColor: "black",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
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

  const textStatusStyle = () => {
    if (pickStatus == "won") {
      return {
        padding: 5,
        fontWeight: "bold",
      };
    } else if (pickStatus == "lost") {
      return {
        padding: 5,
        fontWeight: "bold",
      };
    } else {
      return {
        padding: 5,
      };
    }
  };

  const containerStyle = () => {
    if (pickStatus == "won" || pickStatus == "lost") {
      return {
        flex: 1,
        maxWidth: 900,
        backgroundColor: "grey",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        margin: 10,
        borderWidth: 3,
        borderRadius: 10,
        overflow: "hide",
        minWidth: "70%",
      };
    } else {
      return {
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
      };
    }
  };

  let myTime = new Date(props.time);
  if (liveData && status && translatedPick) {
    return (
      <View style={containerStyle()}>
        <View style={pickStatusStyle()}>
          <Text style={textStatusStyle()}>{translatedPick}</Text>
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
