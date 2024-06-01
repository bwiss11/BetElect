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
import Ionicons from "@expo/vector-icons/Ionicons";

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
        {picksIn == props.members.length ? (
          <Ionicons name="checkbox-outline" size={18} color="rgb(80,200,120)" />
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
    paddingTop: 6,
  },
});
