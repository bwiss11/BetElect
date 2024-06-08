import { React, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { getUserInfo } from "../backend/firestore";

const MyGroupAvatar = (props) => {
  // Avatars to be displayed for group members on Profile page
  const [picUrl, setPicUrl] = useState("");
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Gets user information from Firestore and sets related state variables
    getUserInfo(props.userId).then((res) => {
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
