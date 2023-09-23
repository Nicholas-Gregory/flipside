import AuthenticateUser from "./components/AuthenticateUser/AuthenticateUser";
import Navbar from "./Navbar/Navbar";
import useAuth from "./hooks/useAuth";

function App() {
  const { loggedIn, authenticate, createAccount, errors } = useAuth();

  return (
    <>
      <Navbar />
      {!loggedIn ? 
      <AuthenticateUser 
        authenticate={authenticate}
        createAccount={createAccount}
        errors={errors}
      /> : "You are logged in!"}
    </>
  );
}

export default App;
