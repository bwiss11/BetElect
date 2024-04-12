import React from "react";

function GetGames() {
  return fetch("http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1")
    .then((res) => {
      data = res.json();
      return data;
    })
    .then((data) => {
      return data.dates[0].games;
    });
}

export { GetGames };
