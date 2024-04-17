import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { GetGames, GetOdds } from "../backend/functions";
import { Game } from "../components/Game";

const Home = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");
  const [odds, setOdds] = useState("");

  useEffect(() => {
    GetGames().then((res) => {
      setData(res);
    });
    let odds = GetOdds();
    console.log("odds are:", odds);
    setOdds(odds);
  }, []);

  useEffect(() => {
    console.log("data is", data);
  }, [data]);

  if (data) {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>{name}</Text>
          <Pressable
            onPress={() => {
              setName("Blaine");
            }}
          >
            <Text>Press me!</Text>
          </Pressable>
          {data.map((game, index) => (
            <Game
              key={index}
              time={game.gameDate}
              awayTeam={game.teams.away.team.name}
              awayTeamWins={game.teams.away.leagueRecord.wins}
              awayTeamLosses={game.teams.away.leagueRecord.losses}
              homeTeam={game.teams.home.team.name}
              homeTeamWins={game.teams.home.leagueRecord.wins}
              homeTeamLosses={game.teams.home.leagueRecord.losses}
              homeML={odds[index].homeML}
              awayML={odds[index].awayML}
              homeSpreadOdds={odds[index].homeSpread}
              awaySpreadOdds={odds[index].awaySpread}
              total={odds[index].total}
              over={odds[index].over}
              under={odds[index].under}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "red",
  },
});
