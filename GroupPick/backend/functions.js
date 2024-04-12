import React from "react";

function GetGames() {
  fetch("http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1")
    .then((res) => {
      data = res.json();
      console.log("data1 is ", data);
      return data;
    })
    .then((data) => {
      console.log("data2 is", data.dates[0].games);
    });
  console.log("calling GetGames");
  return <div></div>;
}

export { GetGames };
