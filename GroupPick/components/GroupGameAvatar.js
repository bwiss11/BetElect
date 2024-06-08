import { React, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { getUserInfo, getUserFirestorePicks } from "../backend/firestore";
import { GetFormattedDate } from "../backend/functions";

const GroupGameAvatar = (props) => {
  const [picUrl, setPicUrl] = useState("");
  const [pick, setPick] = useState("");

  const curDate = GetFormattedDate();

  useEffect(() => {
    // Gets the user's profile pic url and sets its associated state variable
    getUserInfo(props.userId).then((res) => {
      setPicUrl(res.picUrl);
    });

    // Gets individual user's Firestore picks and sets the pick for this particular game
    getUserFirestorePicks(curDate, props.userId).then((res) => {
      if (res && res[props.index] && res[props.index]) {
        setPick(res[props.index]);
      }
    });
  }, []);

  function dynamicOpacity(pick) {
    // If the user has made their pick, their avatar will be lit up
    if (pick) {
      return {
        opacity: 1,
      };
    } else {
      // If the user has not made their pick for this game, their avatar will be greyed out
      return {
        opacity: 0.35,
      };
    }
  }

  if (picUrl) {
    let imageSource = picUrl;
    return (
      <View style={[styles.groupAvatars, dynamicOpacity(pick)]}>
        <Avatar.Image
          source={{
            uri: imageSource,
          }}
          size={25}
        />
      </View>
    );
  }
};

export default GroupGameAvatar;

const styles = StyleSheet.create({
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
});
