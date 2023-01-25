import firebase from 'firebase'
import 'firebase/storage'

// const firebaseProduction = {
//   apiKey: 'AIzaSyBrshw3BEyicE6-xnxvjy6xzB_JMe3kPGs',
//   projectId: 'gift-me-that',
//   authDomain: 'giftmethat.io',
//   storageBucket: 'gift-me-that.appspot.com',
//   messagingSenderId: '115552501434',
//   appId: '1:115552501434:web:09e20056161c91d3fa4c83',
//   measurementId: 'G-WV19D5RD7J',
// }

const firebaseDevelopment = {
  apiKey: 'AIzaSyBj2q1fAJ6qEEDckW2sA2rlZerWHYfb2-Y',
  authDomain: 'mariza-9e743.firebaseapp.com',
  projectId: 'mariza-9e743',
  storageBucket: 'mariza-9e743.appspot.com',
  messagingSenderId: '284367458064',
  appId: '1:284367458064:web:c4a3a196f3086c387d5f95',

  // apiKey: "AIzaSyBrshw3BEyicE6-xnxvjy6xzB_JMe3kPGs",
  // projectId: "gift-me-that",
  // authDomain: "giftmethat.io",
  // storageBucket: "gift-me-that.appspot.com",
  // messagingSenderId: "115552501434",
  // appId: "1:115552501434:web:09e20056161c91d3fa4c83",
  // measurementId: "G-WV19D5RD7J"
}

// Initialize Firebase
// firebase.initializeApp(
//   process.env.REACT_APP_ENVIRONMENT === 'development'
//     ? firebaseDevelopment
//     : firebaseProduction,
// )
firebase.initializeApp(firebaseDevelopment)

firebase.analytics()

const storage = firebase.storage()

export { firebase, storage }
