// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  addDoc,
} from "firebase/firestore";

import { ScreenStackHeaderConfig } from "react-native-screens";
import { getLocaleDirection } from "react-native-web/dist/cjs/modules/useLocale";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

const auth = getAuth();
const signUp = () => {
  createUserWithEmailAndPassword(auth, "emaily@email.com", "passwordtest")
    .then(() => {
      console.log("user created!");
    })
    .catch((e) => {
      console.log(e);
    });
};

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

// const userToPicksId = {
//   L2tcqkRGYEEHb20DVbv5: "JU9K63mDllpPQbDt1Gx9",
//   MJ53DXM7CXOzljAnlN5N: "gN6Pk4d81ocdGoXwlmnv",
//   rDjcAkiv1vq2pIzzPNoZ: "0PlJUzddfM5kKnAgis0k",
// };

async function createUserDoc(firebaseId, email, firstName, lastName) {
  await setDoc(doc(db, "users", firebaseId), {
    firebaseID: firebaseId,
    email: email,
    firstName: firstName,
    lastName: lastName,
  });
  const docRef = await addDoc(collection(db, "users", firebaseId, "picks"), {});
}

async function logFirestorePicks(date, picks, userId, pickId) {
  // const res = await updateDoc(
  //   doc(db, "users", userId, "picks", pickId),
  //   {
  //     [date]: picks,
  //   },
  //   { merge: true }
  // );

  //
  // console.log("userId is", userId);

  // SPECIAL CODE FOR TESTING - logs user's picks for the whole group
  if (userId == "L2tcqkRGYEEHb20DVbv5") {
    let userInfo = await getUserInfo(userId);
    let groupId = userInfo.groupId;
    // console.log("groupId is", groupId);
    let groupData = await getGroup(groupId);
    let members = groupData.members;
    console.log("members are", members);

    for (let i = 0; i < members.length; i++) {
      // console.log("member", i, "is", members[i]);
      let memberId = members[i];
      // let memberInfo = await getUserInfo(memberId);
      let memberPicksDoc = await getUserPicksDoc(memberId);
      // console.log("member", memberId, "picks doc is", memberPicksDoc[0]);
      await updateDoc(
        doc(db, "users", memberId, "picks", memberPicksDoc[0]),
        {
          [date]: picks,
        },
        { merge: true }
      );
    }
  } else {
    let memberPicksDoc = await getUserPicksDoc(userId);
    await updateDoc(
      doc(db, "users", userId, "picks", memberPicksDoc[0]),
      {
        [date]: picks,
      },
      { merge: true }
    );
  }
  // PLACEHOLDER that logs the same picks for the whole group as the logged-in user's pick
  // const res1 = await updateDoc(
  //   doc(
  //     db,
  //     "users",
  //     "MJ53DXM7CXOzljAnlN5N",
  //     "picks",
  //     userToPicksId["MJ53DXM7CXOzljAnlN5N"]
  //   ),
  //   {
  //     [date]: picks,
  //   },
  //   { merge: true }
  // );
  // const res2 = await updateDoc(
  //   doc(
  //     db,
  //     "users",
  //     "rDjcAkiv1vq2pIzzPNoZ",
  //     "picks",
  //     userToPicksId["rDjcAkiv1vq2pIzzPNoZ"]
  //   ),
  //   {
  //     [date]: picks,
  //   },
  //   { merge: true }
  // );
  // PLACEHOLDER

  // return res;
}

async function logGroupFirestoreTranslatedPicks(
  date,
  picks,
  groupID,
  translatedPicksDocID
) {
  // PLACEHOLDER: group id and translated picks document id hardcoded
  console.log("all data", date, picks, groupID, translatedPicksDocID);
  const res = await updateDoc(
    doc(db, "groups", groupID, "picks", translatedPicksDocID),
    {
      [date]: picks,
    },
    { merge: true }
  );
  // PLACEHOLDER

  // return res;
}

async function logFirestoreData(date, data, groupId, groupDataDocID) {
  console.log("other data", date, data, groupId, groupDataDocID);
  // PLACEHOLDER: group id and data document id hardcoded
  const res = await updateDoc(
    doc(db, "groups", groupId, "data", groupDataDocID),
    {
      [date]: data,
    },
    { merge: true }
  );
  // PLACEHOLDER

  return res;
}

async function getFirestoreData(date, groupId, groupDataDocID) {
  const docSnap = await getDoc(
    doc(db, "groups", groupId, "data", groupDataDocID)
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return null;
  }
}

async function getFirestorePicks(date, groupId, groupPicksDocID) {
  const docSnap = await getDoc(
    doc(db, "groups", groupId, "picks", groupPicksDocID)
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return [];
  }
}

async function getTranslatedFirestorePicks(
  date,
  groupId,
  translatedPicksDocID
) {
  // console.log("Group id in translated is", groupId);
  const docSnap = await getDoc(
    doc(db, "groups", groupId, "picks", translatedPicksDocID)
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserFirestorePicks(date, userId, picksId) {
  let userPicksDocId = await getUserPicksDoc(userId);
  // console.log("userpicksdocid is", userPicksDocId);
  const docSnap = await getDoc(
    doc(db, "users", userId, "picks", userPicksDocId[0])
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
    return docSnap.data();
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

async function getUserDoc(firebaseID) {
  console.log("getting docData for ", firebaseID);
  usersRef = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersRef, where("firebaseID", "==", firebaseID, limit(1)))
  );
  let ans;

  await querySnapshot.forEach((doc) => {
    console.log("doc data is", doc.data(), doc.id);
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });

  return ans;
}

async function getGroupPicksDoc(groupID) {
  groupsRef = collection(db, "groups", groupID, "picks");
  const querySnapshot = await getDocs(
    query(groupsRef, where("type", "==", "groupPicks", limit(1)))
  );
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });

  return ans;
}

async function getTranslatedPicksDoc(groupID) {
  groupsRef = collection(db, "groups", groupID, "picks");
  const querySnapshot = await getDocs(
    query(groupsRef, where("type", "==", "translatedPicks", limit(1)))
  );
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });

  return ans;
}

async function getUserPicksDoc(userId) {
  picksRef = collection(db, "users", userId, "picks");
  const querySnapshot = await getDocs(query(picksRef, limit(1)));
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });
  return ans;
}

async function getGroupDataDoc(groupId) {
  picksRef = collection(db, "groups", groupId, "data");
  const querySnapshot = await getDocs(query(picksRef, limit(1)));
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });
  return ans;
}

async function checkPickAgreement(date, groupId, groupPicksDocID) {
  // console.log("Group id in CPA", groupId);
  pickMap = {};
  groupPicks = [];

  for (let i = 0; i < 20; i++) {
    pickMap[i] = {
      awayML: 0,
      awaySpread: 0,
      homeML: 0,
      homeSpread: 0,
      over: 0,
      under: 0,
      optOut: 0,
    };
  }

  // const userToPicksId = {
  //   L2tcqkRGYEEHb20DVbv5: "JU9K63mDllpPQbDt1Gx9",
  //   MJ53DXM7CXOzljAnlN5N: "gN6Pk4d81ocdGoXwlmnv",
  //   rDjcAkiv1vq2pIzzPNoZ: "0PlJUzddfM5kKnAgis0k",
  // };

  const docSnap = await getDoc(doc(db, "groups", groupId));
  // console.log("members are", docSnap.data().members);
  const members = docSnap.data().members;
  for (let i = 0; i < members.length; i++) {
    let memberPicksDoc = await getUserPicksDoc(members[i]);
    userPicks = await getUserFirestorePicks(date, members[i], memberPicksDoc);
    for (let i = 0; i < userPicks.length; i++) {
      // console.log("hi");
      // pickMap[i] = 1;
      // console.log("pick is", userPicks[i]);
      // console.log("current value for that pick is", pickMap[i][userPicks[i]]);
      pickMap[i][userPicks[i]] = pickMap[i][userPicks[i]] + 1;
    }
  }

  for (let i = 0; i < userPicks.length; i++) {
    let gamePicks = pickMap[i];
    let curMax = 0;
    let chosenPick = "";
    for (let pick in gamePicks) {
      // PLACEHOLDER FOR number of picks needed for agreement
      if (gamePicks[pick] > curMax && gamePicks[pick] > 1) {
        curMax = gamePicks[pick];
        chosenPick = pick;
      }
    }
    groupPicks.push(chosenPick);
  }
  // console.log("returning group picks from checkPickAgreement:", groupPicks);
  // PLACEHOLDER: GroupID hardcoded
  const res = await updateDoc(
    doc(db, "groups", groupId, "picks", groupPicksDocID),
    {
      [date]: groupPicks,
    },
    { merge: true }
  );
  return groupPicks;
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
  checkPickAgreement,
  logGroupFirestoreTranslatedPicks,
  getTranslatedFirestorePicks,
  logFirestoreData,
  getFirestoreData,
  signUp,
  getUserDoc,
  getUserPicksDoc,
  getGroupPicksDoc,
  getTranslatedPicksDoc,
  getGroupDataDoc,
  createUserDoc,
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
