import "./App.css";
import LuckyDraw from "./components/LuckyDraw";

function App() {
  return (
  <>
      <header>
        <div className="logo-container">
            <img src="./taqwa.jpg" alt="Taqwa Bank" className="logo" />
            <div className="title">
            <h1>🎉 Lucky Draw App 🎉</h1>
            </div>
        </div>
    </header>


    <main>
        <div className="container">
        <LuckyDraw/>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 Taqwa Bank. All rights reserved.</p>
    </footer>


  </>
  );
}

export default App;
