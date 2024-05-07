import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import { getUserInfo, getUserFirestorePicks } from "../backend/firestore";
import { GetFormattedDate } from "../backend/functions";

const GroupGameAvatar = (props) => {
  // console.log("gga props", props);
  const [picUrl, setPicUrl] = useState("");
  const [pick, setPick] = useState("");

  const curDate = GetFormattedDate();

  useEffect(() => {
    getUserInfo(props.userId).then((res) => {
      setPicUrl(res.picUrl);
    });

    getUserFirestorePicks(curDate, props.userId).then((res) => {
      if (res[props.index] && res[props.index]) {
        setPick(res[props.index]);
      }
    });
  }, []);

  function dynamicOpacity(pick) {
    if (pick) {
      return {
        opacity: 1,
      };
    } else {
      return {
        opacity: 0.5,
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
