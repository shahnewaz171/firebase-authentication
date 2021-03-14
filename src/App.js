import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email
      }
      setUser(signedInUser);
    })
    .catch(error => {
      alert('Something went wrong!!')
    })
  }

  //Sign out
  const handleSignOut = () => {
    console.log('clicked');
    firebase.auth().signOut()
    .then(res => {
      const signOutUser = {
        isSignedIn: false,
        name: '',
        email: ''
      }
      setUser(signOutUser)
    })
    .catch(error => {})
  }

  const handleBlur = (event) => {
    let isFieldValid = true;
    // console.log(event.target.name, event.target.value);

    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (event) => {
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        // console.log(res);
      })
      .catch(error => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    event.preventDefault();
  }

  return (
    <div className="App">
      
      {
        user.isSignedIn && <div><p>Welcome, {user.name}</p>
        <p>Your email: {user.email}</p></div>
      }
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
        <button onClick={handleSignIn}>Sign in</button>
      }
      {/* <button onClick={handleSignIn}>Sign in</button> */}

      <h1>Our own Authentication</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" onBlur={handleBlur} placeholder="Your name"/>
        <br/>
        <input type="email" name="email" onBlur={handleBlur} placeholder="Write your email address" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your password" required/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {user.success && <p style={{color: 'green'}}>User created successfully</p>}
    </div>
  );
}

export default App;
