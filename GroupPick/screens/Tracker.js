import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import {
  GetGames,
  GetOdds,
  StoreData,
  GetData,
  clearAll,
  GetFormattedDate,
  OddsMaker,
  GetLocalPicks,
  GetLocalGames,
  GetLocalOdds,
  GetLiveData,
  GetTeamData,
} from "../backend/functions";
import { TrackerGame } from "../components/TrackerGame";
import {
  getUserFirestorePicks,
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
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      getUserDoc(uid).then((res) => {
        setUserID(res[0]);
        setGroupID(res[1].groupId);
        getUserPicksDoc(res[0]).then((res) => {
          setPicksDocID(res[0]);
        });
      });

      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  useEffect(() => {
    GetLocalOdds().then((res) => {
      setOdds(res);
    });
  }, []);

  useEffect(() => {
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
    if (groupPicksDocID) {
      getFirestorePicks(curDate, groupID, groupPicksDocID).then((res) => {
        setPicks(res);
      });
    }
  }, [groupPicksDocID]);

  useEffect(() => {
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
    if (translatedPicksDocID) {
      getTranslatedFirestorePicks(curDate, groupID, translatedPicksDocID).then(
        (res) => {
          if (res) {
            setTranslatedPicks(res);
          } else {
            let blankTranslatedPicks = [];
            for (let i = 0; i < data.length; i++) {
              blankTranslatedPicks.unshift("");
            }
            setTranslatedPicks(blankTranslatedPicks);
          }
        }
      );
    }
  }, [translatedPicksDocID]);

  useEffect(() => {
    if (data) {
      GetData(curDate).then((res) => {
        if (!res) {
          setTranslatedPicks([]);
          StoreData().then(() => {
            OddsMaker(data).then((res) => {
              setOdds(res);
            });
            setOddsBool(true);
          });
        } else {
          OddsMaker(data).then((res) => {
            setOdds(res);
          });
          setOddsBool(true);
        }
      });
    }
  }, [data]);

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
  } else {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.text}>No Picks Today</Text>
      </View>
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
