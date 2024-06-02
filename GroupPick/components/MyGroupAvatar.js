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
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    getUserInfo(props.userId).then((res) => {
      console.log("avatar info is", res);
      setFirstName(res.firstName);
      setPicUrl(res.picUrl);
    });
  }, []);

  if (picUrl && firstName) {
    let imageSource = picUrl;
    return (
      <View style={styles.groupAvatars}>
        <Avatar.Image
          style={styles.image}
          source={{
            uri: imageSource,
          }}
          size={75}
        />
        <Text style={styles.text}>{firstName}</Text>
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
    alignItems: "center",
  },
  text: {
    marginTop: 5,
    color: "white",
  },
});
