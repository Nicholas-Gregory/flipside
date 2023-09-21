import AuthenticateUser from "./components/AuthenticateUser/AuthenticateUser";


function App() {

  function handleAuth() {
    
  }

  return (
    <>
      <AuthenticateUser onAuth={handleAuth}/>
    </>
  );
}

export default App;
