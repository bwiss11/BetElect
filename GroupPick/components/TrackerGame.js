import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TrackerAwayTeam } from "./TrackerAwayTeam";
import { TrackerHomeTeam } from "./TrackerHomeTeam";
import { TrackerGameStatus } from "./TrackerGameStatus";
import {
  GetTeamData,
  GetLiveData,
  GetFormattedDate,
} from "../backend/functions";
import { useEffect, useState } from "react";

const TrackerGame = (props) => {
  // Game bucket for Tracker tab
  const [liveData, setLiveData] = useState("");
  const [status, setStatus] = useState("");
  const [translatedPick, setTranslatedPick] = useState("");
  const [teamData, setTeamData] = useState("");
  const [pickType, setPickType] = useState("");
  const [pickStatus, setPickStatus] = useState("");

  useEffect(() => {
    // Gets the live game data from MLB's API and sets the associated state variable
    GetLiveData(props.gameID).then((res) => {
      setLiveData(res);
    });
    // Sets the translated pick and the pick type state variables
    setTranslatedPick(props.translatedPicks[props.index]);
    setPickType([
      props.picks[props.index],
      props.awaySpread,
      props.homeSpread,
      props.total,
    ]);
  }, []);

  useEffect(() => {
    //Forced refresh when liveData is updated
  }, [liveData]);

  useEffect(() => {
    // Gets and sets team data
    GetTeamData(props.awayTeamID).then((res) => {
      setTeamData([res.teams[0].franchiseName, res.teams[0].clubName]);
    });
  }, []);

  useEffect(() => {
    // Sets game status based on live data information, finalizes pick status if game has ended
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
      // Evaluates whether the pick for the game is winning, losing, won, lost, or tied
      // Gets current scores
      awayScore = liveData.awayTeamRuns;
      homeScore = liveData.homeTeamRuns;
      // Checks status of the pick
      if (props.detailedState == "Postponed") {
        setPickStatus("tied final");
      } else {
        if (liveData.status != "Preview") {
          // Game has already started
          if (pickType[0] == "homeML") {
            // Checks home ML pick status
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
            // Checks away ML pick status
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
            // Checks home spread pick status
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
            // Checks away spread pick status
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
            // Checks over pick status
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
            // Checks under pick status
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
    // Sets the pick's background color based on its status
    if (pickStatus == "winning") {
      // Light green if winning
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
      // Dark green if won
      return {
        backgroundColor: "rgb(2,75,48)",
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      };
    } else if (pickStatus == "losing") {
      // Light red if losing
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
      // Dark red if won
      return {
        backgroundColor: "rgb(114, 0, 0)",
        flex: 1,
        width: "100%",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        justifyContent: "center",
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
    // Sets text style based on pick status
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
    // Sets stylilng based on pick status - black background if game has finished
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
    // Sets stylilng based on pick status - black background if game has finished
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
