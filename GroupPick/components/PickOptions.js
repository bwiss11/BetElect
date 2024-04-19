import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

const PickOptions = (props) => {
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
    <>
      <View style={styles.container}>
        <Pressable style={styles.button25}>
          <Text>ML</Text>
          <Text>{props.awayML}</Text>
        </Pressable>
        <Pressable style={styles.button25}>
          <Text>{awaySpread}</Text>
          <Text>{props.awaySpreadOdds}</Text>
        </Pressable>
        <Pressable style={styles.button25}>
          <Text>{homeSpread}</Text>
          <Text>{props.homeSpreadOdds}</Text>
        </Pressable>
        <Pressable style={styles.button25}>
          <Text>ML</Text>
          <Text>{props.homeML}</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Pressable style={styles.button50}>
          <Text>Under {props.total}</Text>
          <Text>{props.under}</Text>
        </Pressable>
        <Pressable style={styles.button50}>
          <Text>Over {props.total}</Text>
          <Text>{props.over}</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Pressable style={styles.button100}>
          <Text>Opt Out</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    flexWrap: "wrap",
  },
  button25: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button50: {
    width: "50%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button100: {
    width: "100%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export { PickOptions };
