import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

const PickOptions = (props) => {
  console.log("pickoption props", props);
  // let homeSpread;
  // if (props.homeML && props.homeML[0] == "-" && props.awayML[0] == "+") {
  //   homeSpread = "-1.5";
  //   awaySpread = "+1.5";
  // } else if (
  //   props.homeML &&
  //   props.homeML[0] == "-" &&
  //   props.awayML[0] == "-" &&
  //   Number(props.homeML.slice(1, props.homeML.length)) >
  //     Number(props.awayML.slice(1, props.awayML.length))
  // ) {
  //   homeSpread = "-1.5";
  //   awaySpread = "+1.5";
  // } else {
  //   homeSpread = "+1.5";
  //   awaySpread = "-1.5";
  // }

  const [userPick, setUserPick] = useState("optOut");

  return (
    <>
      <View style={styles.container}>
        <Pressable
          onPress={() => setUserPick("awaySpread")}
          style={
            userPick == "awaySpread"
              ? styles.button25FarLeftSelected
              : styles.button25FarLeft
          }
        >
          <Text
            style={userPick == "awaySpread" ? styles.textSelected : styles.text}
          >
            {Number(props.awaySpread) > 0
              ? "+" + props.awaySpread
              : props.awaySpread}
          </Text>
          <Text
            style={userPick == "awaySpread" ? styles.textSelected : styles.text}
          >
            {Number(props.awaySpreadOdds) > 0
              ? "+" + props.awaySpreadOdds
              : props.awaySpreadOdds}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUserPick("awayML")}
          style={
            userPick == "awayML"
              ? styles.button25MiddleLeftSelected
              : styles.button25MiddleLeft
          }
        >
          <Text
            style={userPick == "awayML" ? styles.textSelected : styles.text}
          >
            ML
          </Text>
          <Text
            style={userPick == "awayML" ? styles.textSelected : styles.text}
          >
            {Number(props.awayML) > 0 ? "+" + props.awayML : props.awayML}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setUserPick("homeML")}
          style={
            userPick == "homeML"
              ? styles.button25MiddleRightSelected
              : styles.button25MiddleRight
          }
        >
          <Text
            style={userPick == "homeML" ? styles.textSelected : styles.text}
          >
            ML
          </Text>
          <Text
            style={userPick == "homeML" ? styles.textSelected : styles.text}
          >
            {Number(props.homeML) > 0 ? "+" + props.homeML : props.homeML}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUserPick("homeSpread")}
          style={
            userPick == "homeSpread"
              ? styles.button25FarRightSelected
              : styles.button25FarRight
          }
        >
          <Text
            style={userPick == "homeSpread" ? styles.textSelected : styles.text}
          >
            {Number(props.homeSpread) > 0
              ? "+" + props.homeSpread
              : props.homeSpread}
          </Text>
          <Text
            style={userPick == "homeSpread" ? styles.textSelected : styles.text}
          >
            {Number(props.homeSpreadOdds) > 0
              ? "+" + props.homeSpreadOdds
              : props.homeSpreadOdds}
          </Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Pressable
          onPress={() => setUserPick("under")}
          style={
            userPick == "under"
              ? styles.button50LeftSelected
              : styles.button50Left
          }
        >
          <Text style={userPick == "under" ? styles.textSelected : styles.text}>
            Under {props.total}
          </Text>
          <Text style={userPick == "under" ? styles.textSelected : styles.text}>
            {props.under}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUserPick("over")}
          style={
            userPick == "over"
              ? styles.button50RightSelected
              : styles.button50Right
          }
        >
          <Text style={userPick == "over" ? styles.textSelected : styles.text}>
            Over {props.total}
          </Text>
          <Text style={userPick == "over" ? styles.textSelected : styles.text}>
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
          <Text
            style={userPick == "optOut" ? styles.textSelected : styles.text}
          >
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
  button25FarLeft: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button25FarLeftSelected: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button25MiddleLeft: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button25MiddleLeftSelected: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button25MiddleRight: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button25MiddleRightSelected: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button25FarRight: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    alignItems: "center",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  button25FarRightSelected: {
    width: "25%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button50Left: {
    width: "50%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button50LeftSelected: {
    width: "50%",
    borderColor: "black",
    color: "white",
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: "rgb(60, 90, 190)",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button50Right: {
    width: "50%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button50RightSelected: {
    width: "50%",
    borderColor: "black",
    color: "white",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: "rgb(60, 90, 190)",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button100: {
    width: "100%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button100Selected: {
    width: "100%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    fontColor: "white",
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
