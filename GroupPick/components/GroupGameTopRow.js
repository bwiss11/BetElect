import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";

const GroupGameTopRow = (props) => {
  let myTime = new Date(props.time);
  return (
    <View style={styles.topRow}>
      <View style={styles.timeHolder}>
        <Text style={styles.time}>
          {myTime.toLocaleTimeString([], {
            timeStyle: "short",
          })}
        </Text>
      </View>
      <View style={styles.avatarsHolder}>
        <View style={styles.groupAvatars}>
          <Avatar.Image
            source={{
              uri: "https://as2.ftcdn.net/v2/jpg/00/75/13/25/1000_F_75132523_xkLZqbPQkUvVzWSftTf3nAGBjBFkcKuP.jpg",
            }}
            size={25}
          />
        </View>
        <View style={styles.groupAvatars}>
          <Avatar.Image
            source={{
              uri: "https://i.fbcd.co/products/resized/resized-750-500/l010e-6-e08-mainpreview-1543b1db1c818443c5135ba0c3dd8f3cdb03ffd96d1177c659d823cdb2d7477d.webp",
            }}
            size={25}
          />
        </View>
        <View style={styles.groupAvatars}>
          <Avatar.Image
            source={{
              uri: "https://cdn.vectorstock.com/i/1000x1000/01/77/woman-face-portrait-generic-app-profile-picture-vector-42000177.webp",
            }}
            size={25}
          />
        </View>
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
  },
});
