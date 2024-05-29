import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { TranslatePick, GetFormattedDate } from "../backend/functions";
import { logGroupFirestoreTranslatedPicks } from "../backend/firestore";
import { PickOptions } from "./PickOptions";

const curDate = GetFormattedDate();
const GroupGamePick = (props) => {
  useEffect(() => {
    if (props.translatedPicks && props.translatedPicks[props.index]) {
      setGroupPick(props.translatedPicks[props.index]);
    }
  }, []);

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
            if (translatedPick[0] == "No Pick") {
              setGroupPick(translatedPick);
            } else {
              let oddsConverted = translatedPick[1];
              if (Number(oddsConverted) > 0) {
                oddsConverted = "+" + oddsConverted;
              }
              setGroupPick(translatedPick[0] + " " + oddsConverted);
              let translatedPicks = props.translatedPicks;
              translatedPicks[props.index] =
                translatedPick[0] + " " + oddsConverted;
              logGroupFirestoreTranslatedPicks(
                curDate,
                translatedPicks,
                props.groupID,
                props.translatedPicksDocID
              );
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
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    overflow: "hidden",
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
    overflow: "hidden",
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
    borderBottomLeftRadius: 5,
    overflow: "hide",
  },
  checkButtonText: {
    color: "white",
  },
});
