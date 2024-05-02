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

// import { app, db, logFirestorePicks } from "../backend/firestore";

// import { getData } from "../backend/database";

// console.log("logging");
// getData();

const Tracker = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");
  const [oddsBool, setOddsBool] = useState(false);
  const [picks, setPicks] = useState([]);

  const curDate = new Date(Date.now()).toISOString().split("T")[0];

  useEffect(() => {
    GetGames().then((res) => {
      setData(res);
    });

    GetLocalPicks().then((GLPRes) => {
      if (GLPRes) {
        GetLocalGames().then((GLGRes) => {
          if (GLPRes.length < GLGRes.length) {
            for (i = GLPRes.length; i < GLGRes.length; i++) {
              GLPRes.push("");
            }
          }
        });

        setPicks(GLPRes);
      } else {
      }
    });
    // GetLiveData(744864).then((res) => {
    //   console.log("liveData received: ", res);
    // });

    // clearAll();
    GetLocalOdds().then((res) => {
      setOdds(res);
    });

    // const q = query(collection(db, "groups"), where("groupId", "==", "123456"));
    // getDocs(q).then((res) => {
    //   console.log("result of getDocs is", res.docs[0].data());
    // });

    // console.log("should be running lFP");
    // logFirestorePicks("20240502", ["hi", "lye", "why"], "123456").then(
    //   (res) => {
    //     console.log("res of lFP:", res);
    //   }
    // );

    // db.collection("groups")
    //   .get()
    //   .then((result) => console.log(result.docs));
  }, []);

  useEffect(() => {
    if (data) {
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

    GetLocalPicks().then((GLPRes) => {
      if (!GLPRes) {
        picksList = [];
        for (let i = 0; i < data.length; i++) {
          picksList.push("");
        }
        setPicks(picksList);
      }
    });
  }, [data]);

  // useEffect(() => {
  //   console.log("odds are", odds);
  // }, [odds]);

  if (data && odds && oddsBool) {
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
  outermostContainer: { minWidth: "40%" },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
    paddingBottom: 100,
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
