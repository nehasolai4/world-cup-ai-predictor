import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchForm from "./components/MatchForm";

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
            <Navbar />
            <Hero />
            <MatchForm />
        </div>
    );
}

export default App;