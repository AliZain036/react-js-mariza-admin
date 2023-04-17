import firebase from "firebase"
import "firebase/storage"

const firebaseProduction = {
  apiKey: "AIzaSyBj2q1fAJ6qEEDckW2sA2rlZerWHYfb2-Y",
  authDomain: "mariza-9e743.firebaseapp.com",
  projectId: "mariza-9e743",
  storageBucket: "mariza-9e743.appspot.com",
  messagingSenderId: "284367458064",
  appId: "1:284367458064:web:c4a3a196f3086c387d5f95",
}

const firebaseDevelopment = {
  apiKey: "AIzaSyDO5ugKl51DJBT1ocM1pKpUdx_AZMq9awU",
  authDomain: "mariza-admin-panel-dev.firebaseapp.com",
  projectId: "mariza-admin-panel-dev",
  storageBucket: "mariza-admin-panel-dev.appspot.com",
  messagingSenderId: "245023990722",
  appId: "1:245023990722:web:cb4910fc23128b86446c5b",
  measurementId: "G-1PJR5TFY2E",
}

let appConfig = firebaseProduction
if (process.env.REACT_APP_ENVIRONMENT === "production") {
  appConfig = firebaseProduction
}

// Initialize Firebase
// firebase.initializeApp(
//   process.env.REACT_APP_ENVIRONMENT === 'development'
//     ? firebaseDevelopment
//     : firebaseProduction,
// )
firebase.initializeApp(appConfig)

firebase.analytics()

const storage = firebase.storage()

export { firebase, storage }
