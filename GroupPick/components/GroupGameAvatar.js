import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import { getUserInfo } from "../backend/firestore";

const GroupGameAvatar = (props) => {
  const [picUrl, setPicUrl] = useState("");

  useEffect(() => {
    getUserInfo(props.userId).then((res) => {
      setPicUrl(res.picUrl);
    });
  }, []);

  if (picUrl) {
    console.log("pic url is", picUrl, typeof picUrl);
    let imageSource = picUrl;
    return (
      <View style={[styles.groupAvatars, styles.groupAvatarPickIn]}>
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
