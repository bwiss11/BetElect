import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const WinningChoices = (props) => {
  let homeSpread;
  if (props.homeML[0] == "-" && props.awayML[0] == "+") {
    homeSpread = "-1.5";
    awaySpread = "+1.5";
  } else if (
    props.homeML[0] == "-" &&
    props.awayML[0] == "-" &&
    Number(props.homeML.slice(1, props.homeML.length)) >
      Number(props.awayML.slice(1, props.awayML.length))
  ) {
    console.log(Number(props.homeML.slice(1, props.homeML.length)));
    homeSpread = "-1.5";
    awaySpread = "+1.5";
  } else {
    homeSpread = "+1.5";
    awaySpread = "-1.5";
  }
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Text>ML</Text>
        <Text>{props.awayML}</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>{awaySpread}</Text>
        <Text>{props.awaySpreadOdds}</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>{homeSpread}</Text>
        <Text>{props.homeSpreadOdds}</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text>ML</Text>
        <Text>{props.homeML}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderColor: "black",
    backgroundColor: "rgb(2, 190, 252)",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    flexWrap: "wrap",
  },
  button: {
    width: "25%",
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    zIndex: 1000000,
  },
});

export { WinningChoices };
