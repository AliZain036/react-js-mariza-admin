import firebase from "firebase"
import "firebase/storage"

const firebaseProduction = {
  apiKey: process.env.REACT_APP_FIREBASE_PROD_CONFIG_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROD_CONFIG_PROJECT_ID,
  authDomain: process.env.REACT_APP_FIREBASE_PROD_CONFIG_AUTH_DOMAIN,
  storageBucket: process.env.REACT_APP_FIREBASE_PROD_CONFIG_STORAGE_BUCKET,
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_PROD_CONFIG_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_PROD_CONFIG_APP_ID,
}

const firebaseDevelopment = {
  apiKey: process.env.REACT_APP_FIREBASE_CONFIG_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_CONFIG_PROJECT_ID,
  authDomain: process.env.REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
  storageBucket: process.env.REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_CONFIG_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_CONFIG_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_CONFIG_MEASUREMENT_ID,
}

let appConfig = { ...firebaseDevelopment }
if (process.env.REACT_APP_ENVIRONMENT === "production") {
  appConfig = { ...firebaseProduction }
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
