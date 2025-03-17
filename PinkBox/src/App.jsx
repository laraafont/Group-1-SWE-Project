import { BrowserRouter } from "react-router-dom";
import NavBar from "./navbar/NavBar"; // Correct import from src/navbar

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <NavBar />

      {/* Main content */}
      <div>
        <h2 style={{ textAlign: 'center', fontFamily: 'Helvetica', fontSize: '1.5rem', color: '#333' }}>
          React Navigation Bar
        </h2>
      </div>
    </BrowserRouter>
  );
}

export default App;