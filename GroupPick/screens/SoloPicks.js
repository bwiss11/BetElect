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
import { Game } from "../components/Game";

import {
  getUserFirestorePicks,
  getFirestoreData,
  logFirestoreData,
  getUserDoc,
  getUserPicksDoc,
  getGroupDataDoc,
} from "../backend/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const SoloPicks = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");
  const [oddsBool, setOddsBool] = useState(false);
  const [picks, setPicks] = useState("");
  const auth = getAuth();
  const [picksDocID, setPicksDocID] = useState("");
  const [userID, setUserID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [groupDataDocID, setGroupDataDocID] = useState("");

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
  // const curDate = new Date(Date.now()).toISOString().split("T")[0];
  const curDate = GetFormattedDate();

  // useEffect(() => {
  //   console.log("pickDoc ID is", picksDocID);
  // }, [picksDocID]);

  // useEffect(() => {
  //   console.log("user ID is", userID);
  // }, [userID]);

  useEffect(() => {
    // clearAll();
  }, []);

  useEffect(() => {
    if (groupID) {
      getGroupDataDoc(groupID).then((res) => {
        setGroupDataDocID(res[0]);
      });
    }
  }, [groupID]);

  useEffect(() => {
    if (groupDataDocID) {
      getFirestoreData(curDate, groupID, groupDataDocID).then((res) => {
        if (!res) {
          GetGames().then((resGG) => {
            logFirestoreData(curDate, resGG, groupDataDocID);
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

    // GetLocalPicks(curDate, "123456").then((GLPRes) => {
    //   if (!GLPRes) {
    //     // console.log("no response setting picks to []");
    //     picksList = [];
    //     for (let i = 0; i < data.length; i++) {
    //       picksList.push("");
    //     }
    //     setPicks(picksList);
    //   }
    // });
  }, [data]);

  useEffect(() => {
    if (userID) {
      getUserFirestorePicks(curDate, userID).then((res) => {
        setPicks(res);
      });
    }
  }, [userID]);

  if (data && odds && oddsBool && userID && picksDocID && groupID) {
    // console.log("log of odds", odds, picks);
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
          {data.map((game, index) => (
            <Game
              key={index}
              time={game.gameDate}
              status={game.status.detailedState}
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
              numberOfGames={data.length}
              userID={userID}
              picksDocID={picksDocID}
              groupID={groupID}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
};

export default SoloPicks;

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
});
