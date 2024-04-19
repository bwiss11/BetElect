import { React, useEffect, useState } from "react";
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

  const [userPick, setUserPick] = useState("optOut");

  return (
    <>
      <View style={styles.container}>
        <Pressable
          onPress={() => setUserPick("awayML")}
          style={
            userPick == "awayML" ? styles.button25Selected : styles.button25
          }
        >
          <Text style={userPick == "awayML" ? styles.textSelected : ""}>
            ML
          </Text>
          <Text style={userPick == "awayML" ? styles.textSelected : ""}>
            {props.awayML}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUserPick("awaySpread")}
          style={
            userPick == "awaySpread" ? styles.button25Selected : styles.button25
          }
        >
          <Text style={userPick == "awaySpread" ? styles.textSelected : ""}>
            {awaySpread}
          </Text>
          <Text style={userPick == "awaySpread" ? styles.textSelected : ""}>
            {props.awaySpreadOdds}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUserPick("homeSpread")}
          style={
            userPick == "homeSpread" ? styles.button25Selected : styles.button25
          }
        >
          <Text style={userPick == "homeSpread" ? styles.textSelected : ""}>
            {homeSpread}
          </Text>
          <Text style={userPick == "homeSpread" ? styles.textSelected : ""}>
            {props.homeSpreadOdds}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUserPick("homeML")}
          style={
            userPick == "homeML" ? styles.button25Selected : styles.button25
          }
        >
          <Text style={userPick == "homeML" ? styles.textSelected : ""}>
            ML
          </Text>
          <Text style={userPick == "homeML" ? styles.textSelected : ""}>
            {props.homeML}
          </Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Pressable
          onPress={() => setUserPick("under")}
          style={
            userPick == "under" ? styles.button50Selected : styles.button50
          }
        >
          <Text style={userPick == "under" ? styles.textSelected : ""}>
            Under {props.total}
          </Text>
          <Text style={userPick == "under" ? styles.textSelected : ""}>
            {props.under}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUserPick("over")}
          style={userPick == "over" ? styles.button50Selected : styles.button50}
        >
          <Text style={userPick == "over" ? styles.textSelected : ""}>
            Over {props.total}
          </Text>
          <Text style={userPick == "over" ? styles.textSelected : ""}>
            {props.over}
          </Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Pressable
          onPress={() => setUserPick("optOut")}
          style={
            userPick == "optOut" ? styles.button100Selected : styles.button100
          }
        >
          <Text style={userPick == "optOut" ? styles.textSelected : ""}>
            Opt Out
          </Text>
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
  button25Selected: {
    width: "25%",
    borderColor: "black",
    color: "white",
    backgroundColor: "rgb(60, 90, 190)",
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
  button50Selected: {
    width: "50%",
    borderColor: "black",
    color: "white",
    backgroundColor: "rgb(60, 90, 190)",
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
  button100Selected: {
    width: "100%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    fontColor: "white",
    borderWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  textSelected: {
    color: "white",
    fontWeight: "bold",
  },
});

export { PickOptions };
