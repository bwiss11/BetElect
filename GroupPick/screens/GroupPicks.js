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
} from "../backend/functions";

import {
  getUserInfo,
  checkPickAgreement,
  logGroupFirestoreTranslatedPicks,
  getTranslatedFirestorePicks,
  getFirestoreData,
  logFirestoreData,
  getUserDoc,
  getUserPicksDoc,
  getGroupPicksDoc,
  getTranslatedPicksDoc,
  getGroupDataDoc,
} from "../backend/firestore";
import { GroupPicksGame } from "../components/GroupPicksGame";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const GroupPicks = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");
  const [oddsBool, setOddsBool] = useState(false);
  const [picks, setPicks] = useState("");
  const [translatedPicks, setTranslatedPicks] = useState("");
  const [groupPicks, setGroupPicks] = useState("");
  const [picksDocID, setPicksDocID] = useState("");
  const [userID, setUserID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [groupPicksDocID, setGroupPicksDocID] = useState("");
  const [translatedPicksDocID, setTranslatedPicksDocID] = useState("");
  const [groupDataDocID, setGroupDataDocID] = useState("");
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user && !picksDocID) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      getUserDoc(uid).then((res) => {
        setUserID(res[0]);
        setGroupID(res[1].groupID);
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

  // const curDate = new Date(Date.now()).toISOString().split("T")[0];
  const curDate = GetFormattedDate();

  useEffect(() => {
    // clearAll();
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
      checkPickAgreement(curDate, groupID, groupPicksDocID).then((res) => {
        setGroupPicks(res);
      });

      GetLocalPicks(curDate, groupID, groupPicksDocID).then((GLPRes) => {
        // console.log("GLP response:", GLPRes);
        if (GLPRes) {
          GetLocalGames().then((GLGRes) => {
            if (GLPRes.length < GLGRes.length) {
              for (i = GLPRes.length; i < GLGRes.length; i++) {
                GLPRes.push("");
              }
            }
          });
          console.log("setting picks to", GLPRes);
          setPicks(GLPRes);
        } else {
        }
      });
    }
  }, [groupPicksDocID]);

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
    if (data) {
      // console.log("data is", data);
      // AsyncStorage.getItem(curDate + "setOdds").then((res) => {
      //   console.log("are the odds set", res);
      // });
      GetData(curDate).then((res) => {
        if (!res) {
          setPicks([]);
          StoreData().then(() => {
            //   console.log("storing my data now");
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
          // console.log("retrieved:", res);
        }
      });
    }

    if (!groupPicks) {
      let groupPicksBlank = [];
      for (let i = 0; i < data.length; i++) {
        groupPicksBlank.unshift("");
      }
      setGroupPicks(groupPicksBlank);
    }
  }, [data]);

  useEffect(() => {}, [groupPicks]);

  if (
    data &&
    odds &&
    oddsBool &&
    translatedPicks &&
    groupID &&
    translatedPicksDocID
  ) {
    // console.log("log of odds", odds, picks);
    console.log("data is", data);
    return (
      <>
        <ScrollView style={styles.outermostContainer} stickyHeaderIndices={[]}>
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

            {data.map((game, index) => (
              <GroupPicksGame
                status={game.status.detailedState}
                key={index}
                time={game.gameDate}
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
                groupPick={groupPicks[index]}
                setPicks={setPicks}
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
                userID={userID}
                picksDocID={picksDocID}
                groupID={groupID}
                translatedPicksDocID={translatedPicksDocID}
              />
            ))}
          </View>
        </ScrollView>
        <View style={styles.runButtonContainer}>
          <Pressable style={styles.runButton}>
            <Text style={styles.runButtonText}>Check Picks</Text>
          </Pressable>
        </View>
      </>
    );
  }
};

export default GroupPicks;

const styles = StyleSheet.create({
  outermostContainer: { minWidth: "40%" },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
    //     backgroundImage:
    //       "linear-gradient(to bottom, rgb(60, 90, 190, 100), rgb(150, 150, 255, 100))",
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
  runButtonContainer: {
    display: "flex",
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
  },
  runButton: {
    margin: 10,
    display: "flex",
    color: "white",
    position: "sticky",
    width: "10%",
    minWidth: 200,
    borderRadius: 3,
    borderColor: "white",
    backgroundColor: "rgb(60, 90, 190)",
    borderWidth: 1,
    alignItems: "center",
    // padding: 20,
    justifyContent: "center",
    padding: 10,
  },
  runButtonText: {
    color: "white",
  },
});
