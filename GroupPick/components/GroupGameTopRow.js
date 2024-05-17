import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import {
  getGroup,
  getUserInfo,
  getUserFirestorePicks,
} from "../backend/firestore";
import { GetFormattedDate } from "../backend/functions";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import GroupGameAvatar from "./GroupGameAvatar";

const userToPicksId = {
  L2tcqkRGYEEHb20DVbv5: "JU9K63mDllpPQbDt1Gx9",
  MJ53DXM7CXOzljAnlN5N: "gN6Pk4d81ocdGoXwlmnv",
  rDjcAkiv1vq2pIzzPNoZ: "0PlJUzddfM5kKnAgis0k",
};

const curDate = GetFormattedDate();

const GroupGameTopRow = (props) => {
  const [picksIn, setPicksIn] = useState(0);
  // const [members, setMembers] = useState("");
  // console.log("ggtr props", props);

  let myTime = new Date(props.time);

  // useEffect(() => {
  //   let group = getGroup("8CRNyZRpMI69ogcSQkt3").then((res) => {
  //     setMembers(res);
  //     console.log("members set to", res);
  //   });
  // }, []);

  useEffect(() => {
    let pickCount = 0;
    for (i = 0; i < props.members.length; i++) {
      getUserFirestorePicks(
        curDate,
        props.members[i],
        userToPicksId[props.members[i]]
      ).then((res) => {
        // console.log(props.userId, "retrieved picks in GGA are", res);
        if (res && res[props.index]) {
          setPicksIn((picksIn) => picksIn + 1);
        }
      });
    }
  }, []);

  // useEffect(() => {
  //   console.log("picksInarenow", picksIn);
  // }, [picksIn]);

  return (
    <View style={styles.topRow}>
      <View style={styles.timeHolder}>
        <Text style={styles.time}>
          {props.status == "Postponed"
            ? "Postponed"
            : myTime.toLocaleTimeString([], {
                timeStyle: "short",
              })}
        </Text>
      </View>
      <View style={styles.avatarsHolder}>
        {props.members.map((member, index) => (
          <GroupGameAvatar
            key={index}
            userId={member}
            gameId={props.key}
            index={props.index}
          />
        ))}
      </View>
      <View style={styles.check}>
        {picksIn == 3 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 50 50"
            fill="rgb(80, 200, 120)"
          >
            <path d="M 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 15 L 44 17.3125 L 44 39 C 44 41.800781 41.800781 44 39 44 L 11 44 C 8.199219 44 6 41.800781 6 39 L 6 11 C 6 8.199219 8.199219 6 11 6 L 37.40625 6 L 39 4 Z M 43.25 7.75 L 23.90625 30.5625 L 15.78125 22.96875 L 14.40625 24.4375 L 23.3125 32.71875 L 24.09375 33.4375 L 24.75 32.65625 L 44.75 9.03125 Z"></path>
          </svg>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};

export default GroupGameTopRow;

const styles = StyleSheet.create({
  topRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "left",
    alignContent: "center",
    width: "100%",
    backgroundColor: "black",
  },
  timeHolder: {
    // marginRight: 20,
    flexShrink: 1,
    width: "30%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  avatarsHolder: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 10,
  },
  groupAvatars: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    opacity: 0.5,
  },
  groupAvatarPickIn: {
    opacity: 1,
  },
  check: {
    color: "white",
    justifyContent: "center",
  },
});
