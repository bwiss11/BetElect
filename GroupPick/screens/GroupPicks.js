import { View, ScrollView, StyleSheet, Text, Image } from "react-native";
import { useEffect, useState } from "react";
import { GetGames, GetFormattedDate, HandleOdds } from "../backend/functions";

import {
  checkPickAgreement,
  getTranslatedFirestorePicks,
  getFirestoreData,
  logFirestoreData,
  getUserDoc,
  getUserPicksDoc,
  getGroupPicksDoc,
  getTranslatedPicksDoc,
  getGroupDataDoc,
  getGroup,
} from "../backend/firestore";
import { GroupPicksGame } from "../components/GroupPicksGame";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const GroupPicks = () => {
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");
  const [oddsBool, setOddsBool] = useState(false);
  const [picks, setPicks] = useState("");
  const [translatedPicks, setTranslatedPicks] = useState("");
  const [groupPicks, setGroupPicks] = useState("");
  const [picksDocID, setPicksDocID] = useState("");
  const [userID, setUserID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [group, setGroup] = useState("");
  const [groupPicksDocID, setGroupPicksDocID] = useState("");
  const [translatedPicksDocID, setTranslatedPicksDocID] = useState("");
  const [groupDataDocID, setGroupDataDocID] = useState("");
  const auth = getAuth();

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

  const curDate = GetFormattedDate();

  useEffect(() => {
    // Gets odds either from database or from an API call, sets odds-related state variables
    HandleOdds().then((res) => {
      setOdds(res[0][1]["odds"]);
      setOddsBool(true);
    });
  }, []);

  useEffect(() => {
    // Forced reload when groupPicks is updated
  }, [groupPicks]);

  useEffect(() => {
    // Gets group-related data and sets group-related state variables after the groupID has been set
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

      getGroup(groupID).then((res) => {
        setGroup(res);
      });
    }
  }, [groupID]);

  useEffect(() => {
    // Checks for pick agreement amongst the group members after the group's pick document has been set
    if (groupPicksDocID) {
      checkPickAgreement(curDate, groupID, groupPicksDocID).then((res) => {
        setGroupPicks(res);
      });
    }
  }, [groupPicksDocID]);

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
              blankTranslatedPicks.unshift("");
            }
            setTranslatedPicks(blankTranslatedPicks);
          }
        }
      );
    }
  }, [translatedPicksDocID]);

  useEffect(() => {
    // Retrieves the group's logged MLB game data from either the Firestore database or an API call
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
    // Creates a blank temmplate for the group's picks if it hasn't already been set
    if (!groupPicks) {
      let groupPicksBlank = [];
      for (let i = 0; i < data.length; i++) {
        groupPicksBlank.push("");
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
    translatedPicksDocID &&
    group
  ) {
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
                unitSize={group.unitSize}
              />
            ))}
          </View>
        </ScrollView>
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
    marginTop: 25,
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
    justifyContent: "center",
    padding: 10,
  },
  runButtonText: {
    color: "white",
  },
});
