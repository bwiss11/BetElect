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
  // console.log("trackergame props:", props);
  if (props.detailedState == "Postponed") {
    console.log("this game  in TrackerGame is postponed", props);
  }
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

  useEffect(() => {}, [liveData]);

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

      if (props.detailedState == "Postponed") {
        setPickStatus("tied final");
      } else {
        if (liveData.status != "Preview") {
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
              if (liveData.status == "Final") {
                setPickStatus("tied final");
              } else {
                setPickStatus("tied");
              }
            }
          }
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
        backgroundColor: "rgb(2,75,48)",
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        // borderTopLeftRadius: 5,
        // borderTopRightRadius: 5,
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
        backgroundColor: "rgb(114, 0, 0)",
        flex: 1,
        width: "100%",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        justifyContent: "center",

        // borderTopLeftRadius: 5,
        // borderTopRightRadius: 5,
      };
    } else if (pickStatus == "tied final") {
      return {
        backgroundColor: "black",
        flex: 1,
        width: "100%",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        justifyContent: "center",
        borderBottomWidth: 1,
        bottomBorderColor: "rgba(255, 255, 255, 0.3)",
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
    if (
      pickStatus == "won" ||
      pickStatus == "lost" ||
      pickStatus == "tied final"
    ) {
      return {
        padding: 5,
        color: "rgba(255,255,255,0.8)",
        fontWeight: "bold",
      };
    } else {
      return {
        padding: 5,
      };
    }
  };

  const containerStyle = () => {
    if (
      pickStatus == "won" ||
      pickStatus == "lost" ||
      pickStatus == "tied final"
    ) {
      return {
        flex: 1,
        maxWidth: 900,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
        overflow: "hidden",
        minWidth: "70%",
        borderColor: "rgba(255, 255, 255, 0.3)",
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
        borderWidth: 1,
        borderRadius: 10,
        overflow: "hidden",
        minWidth: "70%",
      };
    }
  };

  function teamsContainerStyle() {
    if (status == "Final" || props.detailedState == "Postponed") {
      return {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
      };
    } else {
      return {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 10,
      };
    }
  }

  let myTime = new Date(props.time).toLocaleTimeString([], {
    timeStyle: "short",
  });
  if (liveData && status && translatedPick && translatedPick != "No Pick") {
    return (
      <View style={containerStyle()}>
        <View style={pickStatusStyle()}>
          <Text style={textStatusStyle()}>{translatedPick}</Text>
        </View>
        <View style={teamsContainerStyle()}>
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
            detailedState={props.detailedState}
          />
          <View style={styles.gameStatus}>
            <TrackerGameStatus
              status={status}
              time={myTime}
              gameState={liveData.status}
              detailedState={props.detailedState}
            ></TrackerGameStatus>
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
            detailedState={props.detailedState}
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
