import React from 'react';
import './App.css'; // Import your CSS file
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp';


function App() {
  return (
    <div className="App">
   {/* // <Home/> */}
   <Login/>
      <SignUp/>
    </div>
  );
}

export default App;