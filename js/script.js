// -----------------------------
// firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbx3bL74am6Nodr3AD-4cCaoo01-0O5-4",
  authDomain: "conan-phim.firebaseapp.com",
  projectId: "conan-phim",
  storageBucket: "conan-phim.firebasestorage.app",
  messagingSenderId: "771353230997",
  appId: "1:771353230997:web:28e151de17d625fc5d259c",
  measurementId: "G-R5Z7T812RR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "vars", "N6zh9Dgufi7eKOILGhwd");

// firestore
async function getCurrentEpisode() {
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Current Episode:", data.epsode);
    return data.epsode;
  } else {
    console.log("No such document!");
    return null;
  }
}

async function updateCurrentEpisode(newEpisode) {
  await setDoc(docRef, { epsode: newEpisode }, { merge: true });
}

// -------------------------
const h1Ep = document.getElementById("ep");

const webUrl = (ep) =>
  `https://boctem.com/xem-phim/tham-tu-lung-danh-conan-1-tap-${ep}-server-1/`;

async function loadWeb(ep) {
  const web = document.getElementById("web");
  web.src = webUrl(ep);
  await updateCurrentEpisode(ep);
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
