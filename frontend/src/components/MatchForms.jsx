import { useEffect, useState } from "react";
import Select from "react-select";
import { getTeams, predictMatch } from "../services/api";

function MatchForms() {

    const [teams, setTeams] = useState([]);

    const [homeTeam, setHomeTeam] = useState(null);
    const [awayTeam, setAwayTeam] = useState(null);

    const [tournament, setTournament] = useState("FIFA World Cup");
    const [neutral, setNeutral] = useState(true);

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // -----------------------------
    // LOAD TEAMS FROM FASTAPI
    // -----------------------------

    useEffect(() => {

        getTeams()
            .then((response) => {

                const formattedTeams = response.data.map((team) => ({
                    value: team,
                    label: team
                }));

                setTeams(formattedTeams);

            })
            .catch((error) => {

                console.error("Error loading teams:", error);

                setError("Could not load teams from backend.");

            });

    }, []);


    // -----------------------------
    // PREDICT MATCH
    // -----------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!homeTeam || !awayTeam) {
            setError("Please select both teams.");
            return;
        }

        if (homeTeam.value === awayTeam.value) {
            setError("Please select two different teams.");
            return;
        }

        setError(null);
        setPrediction(null);
        setLoading(true);

        try {

            const response = await predictMatch({

                home_team: homeTeam.value,
                away_team: awayTeam.value,
                tournament: tournament,
                neutral: neutral

            });

            console.log("Prediction response:", response.data);

            setPrediction(response.data);

        } catch (error) {

            console.error("Prediction error:", error);

            setError(
                "Could not get prediction. Make sure your FastAPI server is running."
            );

        } finally {

            setLoading(false);

        }
    };


    // -----------------------------
    // CONFIDENCE LABEL
    // -----------------------------

    const getConfidenceClass = (confidence) => {

        if (confidence >= 0.55) {
            return "lock";
        }

        if (confidence >= 0.40) {
            return "lean";
        }

        return "coin";
    };


    const getConfidenceText = (confidence) => {

        if (confidence >= 0.55) {
            return "High Confidence";
        }

        if (confidence >= 0.40) {
            return "Lean";
        }

        return "Coin Flip";
    };


    return (

        <div className="worldcup-container">

            {/* ================= BRAND ================= */}

            <div className="brand">

                <div className="tag">
                    Random Forest · Match Engine
                </div>

                <h1>
                    WORLDCUP <span>AI</span>
                </h1>

                <p>
                    Feed in two nations. Walk out with a prediction.
                </p>

            </div>


            {/* ================= FOOTBALL ================= */}

            <div className="ball-stage">

                <div className="ball-glow"></div>

                <div className={`football ${loading ? "kicking" : ""}`}>

                    ⚽

                </div>

            </div>


            {/* ================= TEAMS ================= */}

            <div className="versus-row">

                {/* HOME */}

                <div className="panel team-card home">

                    <div className="side-label">
                        ◤ HOME
                    </div>

                    <Select
                        options={teams}
                        value={homeTeam}
                        onChange={setHomeTeam}
                        placeholder="Select home team..."
                        className="team-select-react"
                        classNamePrefix="team"
                    />

                    <div className="rating-row">

                        <span>
                            Selected Team
                        </span>

                        <b>
                            {homeTeam ? homeTeam.label : "—"}
                        </b>

                    </div>

                </div>


                {/* VS */}

                <div className="vs-badge">

                    <div className="vs-text">
                        VS
                    </div>

                    <div className="bolt">
                        ⚡
                    </div>

                </div>


                {/* AWAY */}

                <div className="panel team-card away">

                    <div className="side-label">
                        AWAY ◢
                    </div>

                    <Select
                        options={teams}
                        value={awayTeam}
                        onChange={setAwayTeam}
                        placeholder="Select away team..."
                        className="team-select-react"
                        classNamePrefix="team"
                    />

                    <div className="rating-row">

                        <span>
                            Selected Team
                        </span>

                        <b>
                            {awayTeam ? awayTeam.label : "—"}
                        </b>

                    </div>

                </div>

            </div>


            {/* ================= OPTIONS ================= */}

            <div className="panel options-row">

                {/* VENUE */}

                <div className="opt-group">

                    <span className="opt-label">
                        Venue
                    </span>

                    <div className="switch-row">

                        <div
                            className={`switch ${neutral ? "on" : ""}`}
                            onClick={() => setNeutral(!neutral)}
                        ></div>

                        <span className="neutral-label">

                            {neutral
                                ? "Neutral ground"
                                : "Home advantage applies"
                            }

                        </span>

                    </div>

                </div>


                {/* TOURNAMENT */}

                <div className="opt-group">

                    <span className="opt-label">
                        Tournament
                    </span>

                    <div className="chip-row">

                        <div
                            className={`chip ${
                                tournament === "Friendly"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => setTournament("Friendly")}
                        >
                            Friendly
                        </div>

                        <div
                            className={`chip ${
                                tournament === "FIFA World Cup"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setTournament("FIFA World Cup")
                            }
                        >
                            FIFA World Cup
                        </div>

                        <div
                            className={`chip ${
                                tournament === "UEFA Euro"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setTournament("UEFA Euro")
                            }
                        >
                            UEFA Euro
                        </div>

                    </div>

                </div>

            </div>


            {/* ================= ERROR ================= */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* ================= BUTTON ================= */}

            <div className="predict-wrap">

                <button
                    className="predict-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >

                    {loading
                        ? "Running Model..."
                        : prediction
                            ? "Re-run Prediction"
                            : "Predict Kickoff"
                    }

                </button>

            </div>


            {/* ================= RESULT ================= */}

            {prediction && (

                <div className="panel result show">

                    <div className="result-top">

                        <div className="result-teams">

                            {homeTeam?.label.toUpperCase()}
                            {" VS "}
                            {awayTeam?.label.toUpperCase()}

                        </div>

                        <div
                            className={`confidence ${
                                getConfidenceClass(
                                    prediction.confidence
                                )
                            }`}
                        >

                            {getConfidenceText(
                                prediction.confidence
                            )}

                        </div>

                    </div>


                    {/* PREDICTION */}

                    <div className="prediction-result">

                        <div className="prediction-label">
                            MODEL PREDICTION
                        </div>

                        <div className="prediction-value">

                            {prediction.prediction}

                        </div>

                    </div>


                    {/* CONFIDENCE */}

                    <div className="confidence-number">

                        Confidence:{" "}

                        {(prediction.confidence * 100).toFixed(1)}%

                    </div>


                    {/* PROBABILITY BARS */}

                    <div className="bars">

                        {/* HOME */}

                        <div className="bar-row">

                            <div className="bar-label">
                                {homeTeam?.label}
                            </div>

                            <div className="bar-track">

                                <div
                                    className="bar-fill home"
                                    style={{
                                        width: `${
                                            prediction.probabilities[
                                                "Home Win"
                                            ] * 100
                                        }%`
                                    }}
                                ></div>

                            </div>

                            <div className="bar-pct">

                                {(
                                    prediction.probabilities[
                                        "Home Win"
                                    ] * 100
                                ).toFixed(1)}%

                            </div>

                        </div>


                        {/* DRAW */}

                        <div className="bar-row">

                            <div className="bar-label">
                                DRAW
                            </div>

                            <div className="bar-track">

                                <div
                                    className="bar-fill draw"
                                    style={{
                                        width: `${
                                            prediction.probabilities[
                                                "Draw"
                                            ] * 100
                                        }%`
                                    }}
                                ></div>

                            </div>

                            <div className="bar-pct">

                                {(
                                    prediction.probabilities[
                                        "Draw"
                                    ] * 100
                                ).toFixed(1)}%

                            </div>

                        </div>


                        {/* AWAY */}

                        <div className="bar-row">

                            <div className="bar-label">
                                {awayTeam?.label}
                            </div>

                            <div className="bar-track">

                                <div
                                    className="bar-fill away"
                                    style={{
                                        width: `${
                                            prediction.probabilities[
                                                "Away Win"
                                            ] * 100
                                        }%`
                                    }}
                                ></div>

                            </div>

                            <div className="bar-pct">

                                {(
                                    prediction.probabilities[
                                        "Away Win"
                                    ] * 100
                                ).toFixed(1)}%

                            </div>

                        </div>

                    </div>


                    {/* NOTE */}

                    <div className="note">

                        <b>How this prediction was built:</b>

                        <br />

                        This prediction comes directly from the
                        project's trained Random Forest model through
                        the FastAPI backend. The model uses team
                        statistics, historical performance, recent
                        form, goal difference, venue information and
                        tournament importance.

                    </div>

                </div>

            )}


            <footer>

                WORLDCUP-AI-PREDICTOR · RANDOM FOREST MATCH ENGINE

            </footer>

        </div>

    );
}

export default MatchForms;