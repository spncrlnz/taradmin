// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAD6x004HaVP5RxxiJ9Sui3a2SdxN2hhe4",
    authDomain: "tapandrepair-online-cace3.firebaseapp.com",
    databaseURL: "https://tapandrepair-online-cace3-default-rtdb.firebaseio.com",
    projectId: "tapandrepair-online-cace3",
    storageBucket: "tapandrepair-online-cace3.appspot.com",
    messagingSenderId: "101753671107",
    appId: "1:101753671107:web:d38750e9c981de44364176",
    measurementId: "G-YNQ5V3JNEL"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);