import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { TranslatePick } from "../backend/functions";

const GroupGamePick = (props) => {
  console.log("GROUP GAME PICK PROPS ARE", props);
  const [groupPick, setGroupPick] = useState("-");
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.checkButton}
        onPress={() => {
          if (props.groupPick) {
            let translatedPick = TranslatePick(
              props.groupPick,
              props.awayTeamID,
              props.awaySpread,
              props.homeTeamID,
              props.homeSpread,
              props.total
            );
            setGroupPick(translatedPick);
          }
        }}
      >
        <Text style={styles.checkButtonText}>Check</Text>
      </Pressable>
      <Text style={styles.text}>{groupPick}</Text>
    </View>
  );
};

export { GroupGamePick };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    maxWidth: 900,
    backgroundColor: "black",
    color: "white",
    alignItems: "center",
    justifyContent: "left",
    minWidth: "100%",
    minHeight: 35,
    borderBottomColor: "white",
    borderLeftColor: "white",
    borderRightColor: "white",
    borderColor: "white",
    borderWidth: 2,
  },
  text: {
    marginLeft: 10,
    color: "white",
  },
  checkButton: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "rgb(60, 90, 190)",
    borderRightColor: "white",
    borderRightWidth: 2,
  },
  checkButtonText: {
    color: "white",
  },
});
