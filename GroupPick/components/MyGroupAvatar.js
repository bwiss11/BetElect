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

const MyGroupAvatar = (props) => {
  const [picUrl, setPicUrl] = useState("");

  useEffect(() => {
    getUserInfo(props.userId).then((res) => {
      setPicUrl(res.picUrl);
    });
  }, []);

  if (picUrl) {
    let imageSource = picUrl;
    return (
      <View style={styles.groupAvatars}>
        <Avatar.Image
          source={{
            uri: imageSource,
          }}
          size={75}
        />
      </View>
    );
  }
};

export default MyGroupAvatar;

const styles = StyleSheet.create({
  groupAvatars: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    opacity: 1,
  },
});
