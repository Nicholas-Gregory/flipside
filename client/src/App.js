import CreateAccountForm from "./components/CreateAccountForm/CreateAccountForm";
import LoginForm from "./components/LoginForm/LoginForm";

function App() {
  
  function handleLoginSubmit(usernameOrEmail, password) {
    console.log(usernameOrEmail, password);
  }

  function handleCreateAccountSubmit(username) {
    
  }

  return (
    <>
      <LoginForm onSubmit={handleLoginSubmit} />
      <CreateAccountForm onSubmit={handleCreateAccountSubmit} />
    </>
  );
}

export default App;
