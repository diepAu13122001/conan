// -----------------------------
// firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "vars", "N6zh9Dgufi7eKOILGhwd");

// --------------------------------------
// firestore
async function getCurrentEpisode() {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.epsode;
  } else {
    console.log("No such document!");
    return null;
  }
}

async function updateCurrentEpisode(newEpisode) {
  await setDoc(docRef, { epsode: newEpisode }, { merge: true });
}

async function updateLinkData(links) {
  await setDoc(docRef, { links: links }, { merge: true });
  await setDoc(docRef, { update: serverTimestamp() }, { merge: true });
}

async function checkUpdateTime() {
  const res = await fetch("../../data.json");
  const data = await res.json();
  const lastUpdated = new Date(data.updated);
  const now = new Date();

  const isOld =
    now.getFullYear() > lastUpdated.getFullYear() ||
    now.getMonth() > lastUpdated.getMonth();
  if (isOld) {
    console.log("🔄 Updating links via Pyodide...");
    await updateLinkData(data.links);
  } else {
    console.log("✅ No update needed this month.");
  }
}

async function getLinkByEp() {
  let curEp = await getCurrentEpisode();
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.links[curEp];
  } else {
    console.log("No such document!");
    return null;
  }
}

// -------------------------

const webUrl = async () => await getLinkByEp();

async function loadWeb(ep) {
  const h1Ep = document.getElementById("ep");
  console.log(h1Ep);
  const web = document.getElementById("web");
  web.src = await webUrl();
  await updateCurrentEpisode(ep);
  await checkUpdateTime();
  h1Ep.textContent = ep;
}
// -------------------------
document.getElementById("prev").addEventListener("click", async () => {
  let curEp = await getCurrentEpisode();
  if (curEp > 1) {
    curEp--;
    await loadWeb(curEp);
  }
});
document.getElementById("next").addEventListener("click", async () => {
  let curEp = await getCurrentEpisode();
  curEp++;
  await loadWeb(curEp);
});
document.addEventListener("keydown", async (event) => {
  let curEp = await getCurrentEpisode();
  if (event.key === "ArrowLeft") {
    if (curEp > 1) {
      curEp--;
      await loadWeb(curEp);
    }
  } else if (event.key === "ArrowRight") {
    curEp++;
    await loadWeb(curEp);
  }
});
//--------------------------
getCurrentEpisode().then(async (ep) => {
  if (ep) {
    await loadWeb(ep);
  } else {
    alert("Failed to load current episode.");
  }
});
