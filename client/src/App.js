import { useState } from "react";
import AuthenticateUser from "./components/AuthenticateUser";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import useAuth from "./hooks/useAuth";

import './index.css';

function App() {
  const { 
    loggedIn, 
    authenticate, 
    createAccount, 
    logout, 
    errors 
  } = useAuth();
  const [currentPage, setCurrentPage] = useState('profile');

  function handleNavbarClick(buttonId) {
    if (buttonId === 'logout') {
      logout();
      return;
    }

    if (buttonId !== '') {
      setCurrentPage(buttonId);
    }
  }

  return (
    <>
      {loggedIn && <Navbar onClick={handleNavbarClick}/>}
      {!loggedIn ? 
      <AuthenticateUser 
        authenticate={authenticate}
        createAccount={createAccount}
        errors={errors}
      /> : <Dashboard loggedIn={loggedIn} currentPage={currentPage} />}
    </>
  );
}

export default App;
