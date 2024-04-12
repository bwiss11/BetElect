import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

const Game = (props) => {
  console.log("game props", props);
  return (
    <View style={styles.container}>
      <View style={styles.teams}>
        <Text>
          {props.awayTeam} @ {props.homeTeam}
        </Text>
      </View>
      <View style={styles.records}>
        <Text>
          ({props.awayTeamWins} - {props.awayTeamLosses})
        </Text>
        <Text>
          ({props.homeTeamWins} - {props.homeTeamLosses})
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "black",
    margin: 10,
    borderColor: "black",
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
  },
  teams: {
    margin: 1,
  },
  records: {
    flexDirection: "row",
    margin: 1,
  },
  //   title: {
  //     marginTop: 16,
  //     paddingVertical: 8,
  //     borderWidth: 4,
  //     borderColor: "#20232a",
  //     borderRadius: 6,
  //     backgroundColor: "#61dafb",
  //     color: "#20232a",
  //     textAlign: "center",
  //     fontSize: 30,
  //     fontWeight: "bold",
  //   },
});

export { Game };
