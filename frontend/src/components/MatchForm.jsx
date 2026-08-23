import { useEffect, useState } from "react";

import {
    getTeams,
    predictMatch
} from "../services/api";

import BrandHeader from "./BrandHeader";
import FootballAnimation from "./FootballAnimation";
import TeamSelector from "./TeamSelector";
import MatchOptions from "./MatchOptions";
import PredictionButton from "./PredictionButton";
import PredictionResult from "./PredictionResult";


function MatchForm() {

    // =============================
    // STATE
    // =============================

    const [teams, setTeams] = useState([]);

    const [homeTeam, setHomeTeam] = useState(null);
    const [awayTeam, setAwayTeam] = useState(null);

    const [tournament, setTournament] =
        useState("FIFA World Cup");

    const [neutral, setNeutral] = useState(true);

    const [prediction, setPrediction] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);


    // =============================
    // LOAD TEAMS
    // =============================

    useEffect(() => {

        getTeams()

            .then((response) => {

                const formattedTeams =
                    response.data.map((team) => ({
                        value: team,
                        label: team
                    }));

                setTeams(formattedTeams);

            })

            .catch((error) => {

                console.error(
                    "Error loading teams:",
                    error
                );

                setError(
                    "Could not load teams from backend."
                );

            });

    }, []);


    // =============================
    // PREDICT MATCH
    // =============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Validate teams
        if (!homeTeam || !awayTeam) {

            setError(
                "Please select both teams."
            );

            return;
        }

        // Prevent same team
        if (homeTeam.value === awayTeam.value) {

            setError(
                "Please select two different teams."
            );

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

            console.log(
                "Prediction response:",
                response.data
            );

            setPrediction(response.data);

        } catch (error) {

            console.error(
                "Prediction error:",
                error
            );

            setError(
                "Could not get prediction. Make sure your FastAPI server is running."
            );

        } finally {

            setLoading(false);

        }
    };


    // =============================
    // UI
    // =============================

    return (

        <div className="worldcup-container">

            <BrandHeader />

            <FootballAnimation
                loading={loading}
            />


            {/* TEAMS */}

            <div className="versus-row">

                <TeamSelector
                    teams={teams}
                    selectedTeam={homeTeam}
                    setSelectedTeam={setHomeTeam}
                    side="home"
                />

                <div className="vs-badge">

                    <div className="vs-text">
                        VS
                    </div>

                    <div className="bolt">
                        ⚡
                    </div>

                </div>

                <TeamSelector
                    teams={teams}
                    selectedTeam={awayTeam}
                    setSelectedTeam={setAwayTeam}
                    side="away"
                />

            </div>


            {/* OPTIONS */}

            <MatchOptions
                neutral={neutral}
                setNeutral={setNeutral}
                tournament={tournament}
                setTournament={setTournament}
            />


            {/* ERROR */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* BUTTON */}

            <PredictionButton
                loading={loading}
                prediction={prediction}
                onClick={handleSubmit}
            />


            {/* RESULT */}

            {prediction && (

                <PredictionResult
                    prediction={prediction}
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                />

            )}


            <footer>
                WORLDCUP-AI-PREDICTOR · RANDOM FOREST MATCH ENGINE
            </footer>

        </div>
    );
}

export default MatchForm;