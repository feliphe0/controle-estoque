import { useState } from "react";
import Login from "./Login";
import Abas from "./Abas";

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="container">
      <h1>
        Bem-vindo, {user.email} ({user.role})
      </h1>
      <Abas user={user} />
    </div>
  );
}

export default App;
