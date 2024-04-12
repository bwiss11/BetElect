import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { GetGames } from "../backend/functions";
import { Game } from "../components/Game";

const Home = () => {
  const [name, setName] = useState("defaultName");
  const [data, setData] = useState("");

  useEffect(() => {
    GetGames().then((res) => {
      console.log("executing");
      setData(res);
    });
  }, []);

  useEffect(() => {}, [data]);

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
              awayTeam={game.teams.away.team.name}
              awayTeamWins={game.teams.away.leagueRecord.wins}
              awayTeamLosses={game.teams.away.leagueRecord.losses}
              homeTeam={game.teams.home.team.name}
              homeTeamWins={game.teams.home.leagueRecord.wins}
              homeTeamLosses={game.teams.home.leagueRecord.losses}
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
    justifyContent: "center",
  },
});
