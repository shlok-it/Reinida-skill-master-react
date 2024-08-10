import { initializeApp } from "firebase/app";

import { getMessaging ,getToken,onMessage } from "firebase/messaging";

//Firebase Config values imported from .env file
const firebaseConfig = {
    apiKey: "AIzaSyCOoLMA97anNT6q6gTWdsFy2SAxooRyzUE",
    authDomain: "shlok-it-solution.firebaseapp.com",
    projectId: "shlok-it-solution",
    storageBucket: "shlok-it-solution.appspot.com",
    messagingSenderId: "378518469998",
    appId: "1:378518469998:web:19f6e1c7bd48524462557f",
    measurementId: "G-CLC233SKPW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// messaging.onBackgroundMessage((payload) => {
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };