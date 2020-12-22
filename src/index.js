import React from 'react';
import ReactDom from 'react-dom';
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router } from "react-router-dom";
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';
import DashboardComponent from './dashboard/dashboard';


const firebase = require("firebase")
require("firebase/firestore");
// get this encrypted from a database !!
firebase.initializeApp({
  apiKey: "AIzaSyCF9ltc9uQ0e6GmfQ1wCe_6tAuSHHOKeQs",
  authDomain: "simple-chat-app-2eb36.firebaseapp.com",
  projectId: "simple-chat-app-2eb36",
  storageBucket: "simple-chat-app-2eb36.appspot.com",
  messagingSenderId: "789205861738",
  appId: "1:789205861738:web:f6bcb8d618f911058f5113",
  measurementId: "G-YGQT6VMNEN"
});
const routing = (
  <Router>
    <div id="routing-container">
      <Route path='/login' component={LoginComponent}></Route>
      <Route path='/signup' component={SignupComponent}></Route>
      <Route path='/dashboard' component={DashboardComponent}></Route>
    </div>
  </Router>
)

ReactDom.render(routing, document.getElementById("root"));

serviceWorker.register();
