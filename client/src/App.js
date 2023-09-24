import AuthenticateUser from "./components/AuthenticateUser";
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

  function handleNavbarClick(buttonId) {
    if (buttonId === 'logout') logout();
  }

  return (
    <>
      <Navbar 
        loggedIn={loggedIn}
        onClick={handleNavbarClick}
      />
      {!loggedIn ? 
      <AuthenticateUser 
        authenticate={authenticate}
        createAccount={createAccount}
        errors={errors}
      /> : loggedIn}
    </>
  );
}

export default App;
