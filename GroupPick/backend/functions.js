import React from "react";

function GetGames() {
  return fetch(
    "https://statsapi.mlb.com/api/v1/schedule?sportId=1&hydrate=probablePitcher"
  )
    .then((res) => {
      data = res.json();
      return data;
    })
    .then((data) => {
      return data.dates[0].games;
    });
}

function GetOdds() {
  let odds = {
    0: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    1: {
      homeML: "+160",
      awayML: "-200",
      homeSpread: "-110",
      awaySpread: "-110",
      total: "9",
      over: "-110",
      under: "-110",
    },
    2: {
      homeML: "-112",
      awayML: "-110",
      homeSpread: "+190",
      awaySpread: "-200",
      total: "9",
      over: "-110",
      under: "-110",
    },
    3: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    4: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    5: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    6: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    7: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    8: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    9: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    10: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    11: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    12: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    13: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    14: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    15: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    16: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    17: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
    18: {
      homeML: "-160",
      awayML: "+125",
      homeSpread: "+130",
      awaySpread: "-135",
      total: "9",
      over: "-110",
      under: "-110",
    },
  };
  return odds;
}

export { GetGames, GetOdds };
