import { Link, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <header>
        <Link className="homeLink" to="/">
          <h1>VALOLODLE</h1>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
