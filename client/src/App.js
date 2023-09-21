import { useState } from "react";

import AuthenticateUser from "./components/AuthenticateUser/AuthenticateUser";

import { auth } from "./utils";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  async function handleAuth(token) {
    
  }

  return (
    <>
      <AuthenticateUser onAuth={handleAuth}/>
    </>
  );
}

export default App;
