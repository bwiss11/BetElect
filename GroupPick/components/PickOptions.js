import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

import {
  UpdateLocalPicks,
  GetLocalPicks,
  GetFormattedDate,
} from "../backend/functions";
import { getUserFirestorePicks } from "../backend/firestore";

// const jsonPicks = await JSON.parse(AsyncStorage.getItem("picks"));

const PickOptions = (props) => {
  // const curDate = new Date(Date.now()).toISOString().split("T")[0];
  const curDate = GetFormattedDate();

  // console.log("picks are", JSON.parse(AsyncStorage.getItem("picks")));
  const [userPick, setUserPick] = useState("");
  // picksCopy = GetLocalPicks(curDate, "123456");
  picksCopy = getUserFirestorePicks(curDate, props.userID);
  useEffect(() => {
    if (userPick) {
      UpdateLocalPicks(
        props.index,
        userPick,
        picksCopy,
        curDate,
        "123456",
        props.numberOfGames,
        props.userID,
        props.picksDocID,
        props.groupID
      );
    }
  }, [userPick]);

  useEffect(() => {
    // console.log(
    //   "pick should be getting set as ",
    //   picksCopy[props.index],
    //   picksCopy
    // );
    // GetLocalPicks(curDate, "123456").then((res) => {
    //   if (res && res[props.index]) {
    //     setUserPick(res[props.index]);
    //   }
    // });

    picksCopy = getUserFirestorePicks(curDate, props.userID).then((res) => {
      if (res && res[props.index]) {
        setUserPick(res[props.index]);
      }
    });
    // if (picksCopy[props.index]) {
    //   console.log("setting user pick to:", picksCopy[props.index]);
    //   setUserPick(picksCopy[props.index]);
    // }
  }, []);

  // console.log("in pick options");
  if (props.status != "Postponed") {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Pressable
            onPress={() => {
              setUserPick("awaySpread");
            }}
            style={
              userPick == "awaySpread"
                ? styles.button25FarLeftSelected
                : styles.button25FarLeft
            }
          >
            <Text
              style={
                userPick == "awaySpread" ? styles.textSelected : styles.text
              }
            >
              {Number(props.awaySpread) > 0
                ? "+" + props.awaySpread
                : props.awaySpread}
            </Text>
            <Text
              style={
                userPick == "awaySpread" ? styles.textSelected : styles.text
              }
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
            onPress={() => setUserPick("under")}
            style={
              userPick == "under"
                ? styles.button25LeftRightSelected
                : styles.button25LeftRight
            }
          >
            <Text
              style={userPick == "under" ? styles.textSelected : styles.text}
            >
              u{props.total}
            </Text>
            <Text
              style={userPick == "under" ? styles.textSelected : styles.text}
            >
              {Number(props.under) > 0 ? "+" + props.under : props.under}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setUserPick("over")}
            style={
              userPick == "over"
                ? styles.button25RightLeftSelected
                : styles.button25RightLeft
            }
          >
            <Text
              style={userPick == "over" ? styles.textSelected : styles.text}
            >
              o{props.total}
            </Text>
            <Text
              style={userPick == "over" ? styles.textSelected : styles.text}
            >
              {Number(props.over) > 0 ? "+" + props.over : props.over}
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
              style={
                userPick == "homeSpread" ? styles.textSelected : styles.text
              }
            >
              {Number(props.homeSpread) > 0
                ? "+" + props.homeSpread
                : props.homeSpread}
            </Text>
            <Text
              style={
                userPick == "homeSpread" ? styles.textSelected : styles.text
              }
            >
              {Number(props.homeSpreadOdds) > 0
                ? "+" + props.homeSpreadOdds
                : props.homeSpreadOdds}
            </Text>
          </Pressable>
        </View>
        <View style={styles.optOutContainer}>
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
      </View>
    );
  } else {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Pressable style={styles.button25FarLeft}>
            <Text style={styles.text}>-</Text>
          </Pressable>
          <Pressable style={styles.button25MiddleLeft}>
            <Text style={styles.text}>-</Text>
          </Pressable>

          <Pressable style={styles.button25LeftRight}>
            <Text style={styles.text}>-</Text>
          </Pressable>
          <Pressable style={styles.button25RightLeft}>
            <Text style={styles.text}>-</Text>
          </Pressable>

          <Pressable style={styles.button25MiddleRight}>
            <Text style={styles.text}>-</Text>
          </Pressable>
          <Pressable style={styles.button25FarRight}>
            <Text style={styles.text}>-</Text>
          </Pressable>
        </View>
        <View style={styles.optOutContainer}>
          <Pressable style={styles.button100}>
            <Text style={styles.text}>-</Text>
          </Pressable>
        </View>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    minHeight: 70,
  },
  container: {
    width: "100%",
    flexDirection: "row",
    // justifyContent: "space-between",
    flex: 1,
    // flexWrap: "wrap",
  },
  buttons: {
    justifyContent: "center",
  },
  optOutContainer: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
  },
  button25FarLeft: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25FarLeftSelected: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25MiddleLeft: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25MiddleLeftSelected: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25LeftRight: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25LeftRightSelected: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderRightWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25RightLeft: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25RightLeftSelected: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25MiddleRight: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25MiddleRightSelected: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25FarRight: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    alignItems: "center",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
  },
  button25FarRightSelected: {
    width: "16.666666%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
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
    justifyContent: "center",
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
    justifyContent: "center",
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
    justifyContent: "center",
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
    justifyContent: "center",
  },
  button100: {
    width: "100%",
    borderColor: "black",
    backgroundColor: "#cccccc",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    borderTopWidth: 2,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    justifyContent: "center",
  },
  button100Selected: {
    width: "100%",
    borderColor: "black",
    backgroundColor: "rgb(60, 90, 190)",
    fontColor: "white",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    borderTopWidth: 2,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    justifyContent: "center",
  },
  text: { fontSize: 12 },
  textSelected: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export { PickOptions };
