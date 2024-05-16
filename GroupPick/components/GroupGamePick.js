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
  //   console.log("GROUP GAME PICK PROPS ARE", props);
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
              props.awaySpreadOdds,
              props.awayML,
              props.homeTeamID,
              props.homeSpread,
              props.homeSpreadOdds,
              props.homeML,
              props.total,
              props.over,
              props.under
            );
            console.log("translatedPick is", translatedPick);
            if (translatedPick[0] == "No Pick") {
              setGroupPick(translatedPick);
            } else {
              let oddsConverted = translatedPick[1];
              if (Number(oddsConverted) > 0) {
                oddsConverted = "+" + oddsConverted;
              }
              setGroupPick(translatedPick[0] + " " + oddsConverted);
            }
          }
        }}
      >
        <Text style={styles.checkButtonText}>Check</Text>
      </Pressable>
      <View style={styles.pickHolder}>
        <Text style={styles.text}>{groupPick}</Text>
      </View>
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
    justifyContent: "center",
  },
  pickHolder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
