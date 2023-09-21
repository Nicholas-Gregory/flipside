import LoginForm from "./components/LoginForm/LoginForm";

function App() {
  
  function onSubmit(usernameOrEmail, password) {
    console.log(usernameOrEmail, password);
  }

  return (
    <LoginForm onSubmit={onSubmit} />
  );
}

export default App;
