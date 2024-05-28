import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <header>
        <h1>VALOLODLE</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
