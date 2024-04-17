import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { WinningChoices } from "./WinningChoices";
import { TotalsChoices } from "./TotalsChoices";
import { Team } from "./Team";

const Game = (props) => {
  console.log("game props", props);
  let myTime = new Date(props.time);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.time}>
          {myTime.toLocaleTimeString([], {
            timeStyle: "short",
          })}
        </Text>
      </View>
      <View style={styles.teamsContainer}>
        <Team
          team={props.awayTeam}
          wins={props.awayTeamWins}
          losses={props.awayTeamLosses}
          starter={props.awayStarter}
        />
        <Team
          team={props.homeTeam}
          wins={props.homeTeamWins}
          losses={props.homeTeamLosses}
          starter={props.homeStarter}
        />
      </View>
      <WinningChoices
        homeML={props.homeML}
        awayML={props.awayML}
        homeSpreadOdds={props.homeSpreadOdds}
        awaySpreadOdds={props.awaySpreadOdds}
      />
      <TotalsChoices
        total={props.total}
        over={props.over}
        under={props.under}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    margin: 10,
    borderColor: "black",
    borderWidth: 2,
    overflow: "hide",
  },
  time: {
    padding: 5,
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
});

export { Game };
