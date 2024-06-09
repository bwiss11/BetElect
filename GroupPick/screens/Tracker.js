import { View, ScrollView, StyleSheet, Text, Image } from "react-native";
import { useEffect, useState } from "react";
import { GetGames, GetFormattedDate, HandleOdds } from "../backend/functions";
import { TrackerGame } from "../components/TrackerGame";
import {
  getFirestoreData,
  logFirestoreData,
  getUserDoc,
  getUserPicksDoc,
  getGroupDataDoc,
  getFirestorePicks,
  getTranslatedFirestorePicks,
  getGroupPicksDoc,
  getTranslatedPicksDoc,
} from "../backend/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const Tracker = () => {
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");
  const [oddsBool, setOddsBool] = useState(false);
  const [picks, setPicks] = useState("");
  const [translatedPicks, setTranslatedPicks] = useState("");
  const auth = getAuth();
  const [picksDocID, setPicksDocID] = useState("");
  const [userID, setUserID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [groupDataDocID, setGroupDataDocID] = useState("");
  const [groupPicksDocID, setGroupPicksDocID] = useState("");
  const [translatedPicksDocID, setTranslatedPicksDocID] = useState("");

  const curDate = GetFormattedDate();

  onAuthStateChanged(auth, (user) => {
    if (user && !picksDocID) {
      // User is signed in and their picks document id has not yet been recorded
      // Gets user's picks document
      const uid = user.uid;
      getUserDoc(uid).then((res) => {
        if (res) {
          // Set state for UserID, groupID, and picksDocID
          setUserID(res[0]);
          setGroupID(res[1].groupID);
          getUserPicksDoc(res[0]).then((res) => {
            setPicksDocID(res[0]);
          });
        }
      });
    } else {
      // User is signed out
    }
  });

  useEffect(() => {
    // Gets odds either from database or from an API call, sets odds-related state variables
    HandleOdds().then((res) => {
      setOdds(res[0][1]["odds"]);
      setOddsBool(true);
    });
  }, []);

  useEffect(() => {
    // Once the groupID has been set, sets the group's data document ids, and both raw and translated picks document ids
    if (groupID) {
      getGroupPicksDoc(groupID).then((res) => {
        setGroupPicksDocID(res[0]);
      });
      getTranslatedPicksDoc(groupID).then((res) => {
        setTranslatedPicksDocID(res[0]);
      });
      getGroupDataDoc(groupID).then((res) => {
        setGroupDataDocID(res[0]);
      });
    }
  }, [groupID]);

  useEffect(() => {
    // Gets the group's picks from Firestore
    if (groupPicksDocID) {
      getFirestorePicks(curDate, groupID, groupPicksDocID).then((res) => {
        setPicks(res);
      });
    }
  }, [groupPicksDocID]);

  useEffect(() => {
    // Logs the MLB game data to the database if it hasn't been already
    if (groupDataDocID) {
      getFirestoreData(curDate, groupID, groupDataDocID).then((res) => {
        if (!res) {
          GetGames().then((resGG) => {
            logFirestoreData(curDate, resGG, groupID, groupDataDocID);
            setData(resGG);
          });
        } else {
          setData(res);
        }
      });
    }
  }, [groupDataDocID]);

  useEffect(() => {
    // Gets the group's translated picks and sets the associated state variable, or creates a blank array if there are no translated picks yet
    if (translatedPicksDocID) {
      getTranslatedFirestorePicks(curDate, groupID, translatedPicksDocID).then(
        (res) => {
          if (res) {
            setTranslatedPicks(res);
          } else {
            let blankTranslatedPicks = [];
            for (let i = 0; i < data.length; i++) {
              blankTranslatedPicks.push("");
            }
            setTranslatedPicks(blankTranslatedPicks);
          }
        }
      );
    }
  }, [translatedPicksDocID]);

  useEffect(() => {}, [data]);

  if (data && odds && oddsBool && translatedPicks && picks) {
    return (
      <ScrollView style={styles.outermostContainer}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={styles.image}
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Major_League_Baseball_logo.svg/1920px-Major_League_Baseball_logo.svg.png",
              }}
            ></Image>
            <Text style={styles.text}>
              {new Date().toLocaleDateString("en-us", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.gameHolder}>
            {data.map((game, index) => (
              <TrackerGame
                {...odds}
                awayTeam={game.teams.away.team.clubName}
                homeTeam={game.teams.home.team.clubName}
                passedIndex={index}
                style={styles.game}
                key={index}
                time={game.gameDate}
                gameID={game.gamePk}
                detailedState={game.status.detailedState}
                awayTeamID={game.teams.away.team.id}
                awayStarter={
                  game.teams.away.probablePitcher
                    ? game.teams.away.probablePitcher.fullName
                    : "TBD"
                }
                awayStarterPlayerID={
                  game.teams.away.probablePitcher
                    ? game.teams.away.probablePitcher.id
                    : ""
                }
                awayTeamWins={game.teams.away.leagueRecord.wins}
                awayTeamLosses={game.teams.away.leagueRecord.losses}
                homeTeamID={game.teams.home.team.id}
                homeStarter={
                  game.teams.home.probablePitcher
                    ? game.teams.home.probablePitcher.fullName
                    : "TBD"
                }
                homeStarterPlayerID={
                  game.teams.home.probablePitcher
                    ? game.teams.home.probablePitcher.id
                    : ""
                }
                index={index}
                picks={picks}
                translatedPicks={translatedPicks}
                setTranslatedPicks={setTranslatedPicks}
                homeTeamWins={game.teams.home.leagueRecord.wins}
                homeTeamLosses={game.teams.home.leagueRecord.losses}
                homeML={odds[index].homeMLOdds}
                awayML={odds[index].awayMLOdds}
                awaySpread={odds[index].awaySpread}
                homeSpread={odds[index].homeSpread}
                homeSpreadOdds={odds[index].homeSpreadOdds}
                awaySpreadOdds={odds[index].awaySpreadOdds}
                total={odds[index].total}
                over={odds[index].overOdds}
                under={odds[index].underOdds}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default Tracker;

const styles = StyleSheet.create({
  outermostContainer: { minWidth: "40%", backgroundColor: "black" },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
    paddingBottom: 100,
    marginTop: 25,
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: "black",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 20,
  },
  image: {
    height: 25,
    width: 47,
    margin: 5,
    marginRight: 10,
    marginTop: 15,
  },

  gameHolder: {},
});
