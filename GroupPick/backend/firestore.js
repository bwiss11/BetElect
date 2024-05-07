// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ScreenStackHeaderConfig } from "react-native-screens";
import { getLocaleDirection } from "react-native-web/dist/cjs/modules/useLocale";
// import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdTzGDjbAUQgy8NRhLdTSfSMbz21-sJu0",
  authDomain: "grouppick-74cf0.firebaseapp.com",
  projectId: "grouppick-74cf0",
  storageBucket: "grouppick-74cf0.appspot.com",
  messagingSenderId: "89195551212",
  appId: "1:89195551212:web:d9e338711c2baf3c0708c9",
  measurementId: "G-EXLBQ3SP17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// function GetGames2() {
//   const curDate = GetFormattedDate();
//   return fetch(
//     "https://statsapi.mlb.com/api/v1/schedule?sportId=1&hydrate=probablePitcher&startDate=" +
//       curDate +
//       "&endDate=" +
//       curDate
//   )
//     .then((res) => {
//       data = res.json();
//       return data;
//     })
//     .then((data) => {
//       return data.dates[0].games;
//     });
// }

const db = getFirestore(app);

async function logFirestorePicks(date, picks, groupId, userId) {
  // console.log("logging Firestore picks date and picks", date, picks);
  // log to Group
  const res = await updateDoc(
    doc(db, "groups", "8CRNyZRpMI69ogcSQkt3", "picks", "fXkpPmYflOV0SeVE4jSj"),
    {
      [date]: picks,
    },
    { merge: true }
  );
  // log to individual
  await updateDoc(
    doc(db, "users", "L2tcqkRGYEEHb20DVbv5", "picks", "JU9K63mDllpPQbDt1Gx9"),
    {
      [date]: picks,
    },
    { merge: true }
  );
  // const res = await updateDoc(
  //   doc(db, "groups", "8CRNyZRpMI69ogcSQkt3"),
  //   // {
  //   //   picks: { [date]: picks },
  //   // },
  //   {
  //     picks[date] : picks,
  //   },
  //   { merge: true }
  // );
  return res;
}

async function getFirestorePicks(date, groupId) {
  const docSnap = await getDoc(
    doc(db, "groups", "8CRNyZRpMI69ogcSQkt3", "picks", "fXkpPmYflOV0SeVE4jSj")
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserFirestorePicks(date, userId) {
  const docSnap = await getDoc(
    doc(db, "users", userId, "picks", "JU9K63mDllpPQbDt1Gx9")
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return [];
  }
}

async function getGroup(groupId) {
  const docSnap = await getDoc(doc(db, "groups", groupId));
  if (docSnap.exists()) {
    return docSnap.data().members;
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserInfo(userId) {
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("no such document");
    return [];
  }
}

// firebase.initializeApp(configuration);

// const db = firebase.firestore();

export {
  app,
  db,
  logFirestorePicks,
  getFirestorePicks,
  getGroup,
  getUserInfo,
  getUserFirestorePicks,
};

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDdTzGDjbAUQgy8NRhLdTSfSMbz21-sJu0",
//   authDomain: "grouppick-74cf0.firebaseapp.com",
//   projectId: "grouppick-74cf0",
//   storageBucket: "grouppick-74cf0.appspot.com",
//   messagingSenderId: "89195551212",
//   appId: "1:89195551212:web:d9e338711c2baf3c0708c9",
//   measurementId: "G-EXLBQ3SP17"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
