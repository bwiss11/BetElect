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

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdTzGDjbAUQgy8NRhLdTSfSMbz21-sJu0",
  authDomain: "grouppick-74cf0.firebaseapp.com",
  projectId: "grouppick-74cf0",
  storageBucket: "grouppick-74cf0.appspot.com",
  messagingSenderId: "89195551212",
  appId: "1:89195551212:web:d9e338711c2baf3c0708c9",
  measurementId: "G-EXLBQ3SP17",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createUserDoc(firebaseId, email, firstName, lastName) {
  // Creates a document for a new user
  await setDoc(doc(db, "users", firebaseId), {
    firebaseID: firebaseId,
    email: email,
    firstName: firstName,
    lastName: lastName,
    picUrl:
      "https://as2.ftcdn.net/v2/jpg/00/75/13/25/1000_F_75132523_xkLZqbPQkUvVzWSftTf3nAGBjBFkcKuP.jpg",
  });
  const docRef = await addDoc(collection(db, "users", firebaseId, "picks"), {});
}

async function logFirestorePicks(date, picks, userId, pickId) {
  // Logs individual user's picks in their own document
  let memberPicksDoc = await getUserPicksDoc(userId);
  await updateDoc(
    doc(db, "users", userId, "picks", memberPicksDoc[0]),
    {
      [date]: picks,
    },
    { merge: true }
  );
}

async function logGroupFirestoreTranslatedPicks(
  date,
  picks,
  groupID,
  translatedPicksDocID
) {
  // Logs the translated picks (e.g. "Royals ML" instead of "homeML") into the group's translated picks document
  await updateDoc(
    doc(db, "groups", groupID, "picks", translatedPicksDocID),
    {
      [date]: picks,
    },
    { merge: true }
  );
}

async function logFirestoreData(date, data, groupID, groupDataDocID) {
  // Logs a day's game data to the group's database ("data" collection)
  const res = await updateDoc(
    doc(db, "groups", groupID, "data", groupDataDocID),
    {
      [date]: data,
    },
    { merge: true }
  );
  return res;
}

async function getFirestoreData(date, groupID, groupDataDocID) {
  // Retrieves stored data for the day's MLB games from the group's database
  const docSnap = await getDoc(
    doc(db, "groups", groupID, "data", groupDataDocID)
  );
  if (docSnap.exists()) {
    console.log("no such document");
    return docSnap.data()[date];
  } else {
    return null;
  }
}

async function getFirestorePicks(date, groupID, groupPicksDocID) {
  // Retrieves the group's raw picks (e.g. "homeML", "over", etc.) from Firestore and returns them
  const docSnap = await getDoc(
    doc(db, "groups", groupID, "picks", groupPicksDocID)
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
  groupID,
  translatedPicksDocID
) {
  // Retrieves the group's translated picks (e.g. "Royals ML", "Under 8.5", etc.) from Firestore and returns them
  const docSnap = await getDoc(
    doc(db, "groups", groupID, "picks", translatedPicksDocID)
  );
  if (docSnap.exists()) {
    return docSnap.data()[date];
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserFirestorePicks(date, userId, picksId) {
  // Retrieves an individual user's picks from Firestore and returns them
  let userPicksDocId = await getUserPicksDoc(userId);
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

async function getGroup(groupID) {
  // Gets a group's information from Firestore and returns it
  const docSnap = await getDoc(doc(db, "groups", groupID));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserInfo(userId) {
  // Gets a user's information from Firestore and returns it
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("no such document");
    return [];
  }
}

async function getUserDoc(firebaseID) {
  // Gets the user's document from Firestore and returns its id and its data
  usersRef = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersRef, where("firebaseID", "==", firebaseID, limit(1)))
  );
  let ans;

  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });
  return ans;
}

async function getGroupPicksDoc(groupID) {
  // Gets the group's raw picks document from Firestore and returns its id and its data
  groupsRef = collection(db, "groups", groupID, "picks");
  const querySnapshot = await getDocs(
    query(groupsRef, where("type", "==", "genericPicks", limit(1)))
  );
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });
  return ans;
}

async function getTranslatedPicksDoc(groupID) {
  // Gets the group's translated picks document from Firestore and returns its id and its data
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
  // Gets individual user's picks document from Firestore and returns its id and its data
  picksRef = collection(db, "users", userId, "picks");
  const querySnapshot = await getDocs(query(picksRef, limit(1)));
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });
  return ans;
}

async function getGroupDataDoc(groupID) {
  // Gets the document that stores the day's MLB game data from Firestore and returns its id and data
  picksRef = collection(db, "groups", groupID, "data");
  const querySnapshot = await getDocs(query(picksRef, limit(1)));
  let ans;
  await querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    ans = [doc.id, doc.data()];
  });
  return ans;
}
// async function checkPickAgreement(date, groupID, groupPicksDocID) {
//   // console.log("Group id in CPA", groupID);
//   console.log("checking pick agreement", date, groupID, groupPicksDocID);
//   pickMap = {};
//   groupPicks = [];
//   for (let i = 0; i < 20; i++) {
//     pickMap[i] = {
//       awayML: 0,
//       awaySpread: 0,
//       homeML: 0,
//       homeSpread: 0,
//       over: 0,
//       under: 0,
//       optOut: 0,
//     };
//   }
//   const docSnap = await getDoc(doc(db, "groups", groupID));
//   // console.log("members are", docSnap.data().members);
//   const members = docSnap.data().members;
//   let length = 0;
//   for (let i = 0; i < members.length; i++) {
//     let memberPicksDoc = await getUserPicksDoc(members[i]);
//     userPicks = await getUserFirestorePicks(date, members[i], memberPicksDoc);
//     if (userPicks) {
//       length = userPicks.length;
//       for (let j = 0; j < userPicks.length; j++) {
//         // console.log("hi");
//         // pickMap[i] = 1;
//         // console.log("current value for that pick is", pickMap[i][userPicks[i]]);
//         pickMap[j][userPicks[j]] = pickMap[j][userPicks[j]] + 1;
//       }
//     }
//   }
//   if (pickMap) {
//     for (let i = 0; i < length; i++) {
//       console.log("i is", i);
//       obj = pickMap[i];
//       console.log("obj is", obj);
//       let max = 0;
//       let maxKey = "";

//       obj = pickMap[i];
//       console.log("object is ", obj);
//       for (let pick in obj) {
//         if (obj[pick] > max) {
//           max = obj[pick];
//           maxKey = pick;
//         }
//       }
//       groupPicks[i] = maxKey;
//       if (max > members.length / 2) {
//         groupPicks[i] = maxKey;
//       } else {
//         groupPicks[i] = "No Pick";
//       }
//     }
//     // PLACEHOLDER: groupID hardcoded
//     const res = await updateDoc(
//       doc(db, "groups", groupID, "picks", groupPicksDocID),
//       {
//         [date]: groupPicks,
//       },
//       { merge: true }
//     );
//   }
//   console.log("returning", groupPicks);
//   return groupPicks;
// }

async function checkPickAgreement(date, groupID, groupPicksDocID) {
  // Checks pick agreement for the given group

  // Iniitializes object and array for analyzing and recording group picks
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

  // Gets group's document
  const docSnap = await getDoc(doc(db, "groups", groupID));

  // Goes through each member's picks and adds each game's "vote" to the object recording the number of votes for each pick for each game
  const members = docSnap.data().members;
  let length = 0;
  for (let i = 0; i < members.length; i++) {
    let memberPicksDoc = await getUserPicksDoc(members[i]);
    userPicks = await getUserFirestorePicks(date, members[i], memberPicksDoc);
    if (userPicks) {
      if (!length) {
        length = userPicks.length;
      }
      // Casts the user's "vote" for each game
      for (let j = 0; j < userPicks.length; j++) {
        pickMap[j][userPicks[j]] = pickMap[j][userPicks[j]] + 1;
      }
    }
  }

  // Figures out which pick for each game got the most votes, and records it as the group's pick if it is a majority
  // If any of the users made picks, length will be set to something other than 0
  if (length) {
    // Goes through each game
    for (let i = 0; i < length; i++) {
      let max = 0;
      let maxKey = "";
      obj = pickMap[i];
      // Goes through each pick option for the given game
      for (let pick in obj) {
        if (obj[pick] > max) {
          // Updates the highest vote-getter
          max = obj[pick];
          maxKey = pick;
        }
      }
      // Checks if there is a majority, and if so, records the pick
      if (max > members.length / 2) {
        groupPicks[i] = maxKey;
      } else {
        groupPicks[i] = "No Pick";
      }
    }
    // Updates the group's pick in Firestore database
    const res = await updateDoc(
      doc(db, "groups", groupID, "picks", groupPicksDocID),
      {
        [date]: groupPicks,
      },
      { merge: true }
    );
  }
  // Returns the group's picks
  return groupPicks;
}

async function createGroup(userId, bankroll) {
  // Creates a new group with passed-in group information
  try {
    const docRef = await addDoc(collection(db, "groups"), {});
    // Sets password to the group document's newly assigned id number
    await updateDoc(
      doc(db, "groups", docRef.id),
      {
        password: docRef.id,
        groupID: docRef.id,
        members: [],
        bankroll: Number(bankroll),
        unitSize: Number(bankroll / 100),
      },
      { merge: true }
    );

    // Adds a new data collection and document for the group
    await addDoc(collection(db, "groups", docRef.id, "data"), {});

    // Adds a new picks collection and creates new documents for generic picks and translated picks
    const picksRef = await addDoc(
      collection(db, "groups", docRef.id, "picks"),
      {}
    );
    await updateDoc(
      doc(db, "groups", docRef.id, "picks", picksRef.id),
      {
        type: "genericPicks",
      },
      { merge: true }
    );
    const translatedPicksRef = await addDoc(
      collection(db, "groups", docRef.id, "picks"),
      {}
    );
    await updateDoc(
      doc(db, "groups", docRef.id, "picks", translatedPicksRef.id),
      {
        type: "translatedPicks",
      },
      { merge: true }
    );

    // User that created group is set to join the group
    await joinGroup(docRef.id, userId);
    return docRef.id;
  } catch (e) {
    console.error(e);
  }
}

async function joinGroup(groupID, userId) {
  // Passed-in user joins the passed-in group
  const retrievedDoc = await getDoc(doc(db, "groups", groupID));
  let members = retrievedDoc.data().members;

  // Adds user to the group's members list and updates it
  try {
    if (members) {
      members.push(userId);
    } else {
      members = [userId];
    }
    await updateDoc(
      doc(db, "groups", groupID),
      {
        members: members,
      },
      { merge: true }
    );

    // Adds the group to the user's individual document
    await updateDoc(
      doc(db, "users", userId),
      {
        groupID: groupID,
      },
      { merge: true }
    );

    return groupID;
  } catch (e) {
    console.error(e);
  }
}

async function recordOdds(date, hours, odds) {
  // Records the odds for the given hour of the given date
  oddsRef = collection(db, "odds");
  let ans;
  // Gets the day's odds if they already exist
  const querySnapshot = await getDocs(
    query(oddsRef, where("date", "==", date, limit(1)))
  );
  if (!querySnapshot.empty) {
    await querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ans = [doc.id, doc.data()];
    });
    // Only updates odds if odds for this hour have not been already recorded
    if (ans[1].hours != hours) {
      await updateDoc(
        doc(db, "odds", ans[0]),
        {
          odds: odds,
          date: date,
          hours: hours,
        },
        { merge: true }
      );
    } else {
      //  Not need to update odds if they've already been recorded this hour
    }
  } else {
    // No odds yet for the day, so create odds collection and add odds
    const docRef = await addDoc(collection(db, "odds"), {});
    await updateDoc(
      doc(db, "odds", docRef.id),
      {
        odds: odds,
        date: date,
        hours: hours,
      },
      { merge: true }
    );
  }
}

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
  getUserDoc,
  getUserPicksDoc,
  getGroupPicksDoc,
  getTranslatedPicksDoc,
  getGroupDataDoc,
  createUserDoc,
  createGroup,
  joinGroup,
  recordOdds,
};
