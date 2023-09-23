import { useState } from "react";

import AuthenticateUser from "./components/AuthenticateUser/AuthenticateUser";
import Navbar from "./Navbar/Navbar";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleAuth() {
    setLoggedIn(true);
  }

  return (
    <>
      <Navbar />
      {!loggedIn ? <AuthenticateUser onAuth={handleAuth}/> : "You are logged in!"}
    </>
  );
}

export default App;
