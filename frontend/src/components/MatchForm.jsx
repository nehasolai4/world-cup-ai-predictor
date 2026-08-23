import { useState } from "react";
import Select from "react-select";

import {useEffect} from "react";
import {getTeams} from "../services/api";
import {predictMatch} from "../services/api";

function MatchForm() {

    const [homeTeam, setHomeTeam] = useState(null);
    const [awayTeam, setAwayTeam] = useState(null);

    const [tournament, setTournament] = useState("FIFA World Cup");
    const [neutral, setNeutral] = useState(false);

    const [teams, setTeams] = useState([]);

    const [prediction, setPrediction] = useState(null);

    const [loading,setLoading] = useState(false);


    useEffect(() => {

        getTeams().then((response) => {

            console.log(response.data);

            const formatted = response.data.map(team => ({
                value: team,
                label: team
            }));

            setTeams(formatted);

        });

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(!homeTeam || !awayTeam){
            alert("Please select both teams");
            return;
        }

        if(homeTeam.value === awayTeam.value){
            alert("Please select different teams");
            return;
        }

        setLoading(true);

        const response = await predictMatch({

            home_team: homeTeam.value,
            away_team: awayTeam.value,
            tournament,
            neutral

        });

        setPrediction(response.data);
        setLoading(false);
    };

    return (

        <div className="flex justify-center">

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl p-8 w-[500px]"
            >

                <h2 className="text-2xl font-bold mb-6">
                    Predict Match
                </h2>

                <div className="mb-5">

                    <label className="font-semibold">
                        Home Team
                    </label>

                    <Select
                        options={teams}
                        value={homeTeam}
                        onChange={setHomeTeam}
                    />

                </div>

                <div className="mb-5">

                    <label className="font-semibold">
                        Away Team
                    </label>

                    <Select
                        options={teams}
                        value={awayTeam}
                        onChange={setAwayTeam}
                    />

                </div>

                <div className="mb-5">

                    <label className="font-semibold">
                        Tournament
                    </label>

                    <select
                        className="w-full border rounded-lg p-3 mt-2"
                        value={tournament}
                        onChange={(e)=>setTournament(e.target.value)}
                    >
                        <option>Friendly</option>
                        <option>FIFA World Cup</option>
                        <option>UEFA Euro</option>
                    </select>

                </div>

                <div className="mb-5">

                    <label className="flex gap-2">

                        <input
                            type="checkbox"
                            checked={neutral}
                            onChange={(e)=>setNeutral(e.target.checked)}
                        />

                        Neutral Venue

                    </label>

                </div>

                <button
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold"
                >
                    {loading ? "Predicting..." : "Predict Match"}
                </button>

                {
                    prediction && (

                        <div className="mt-6 p-4 rounded-xl bg-green-100">
                            <h2 className="text-xl font-bold">
                                Prediction
                            </h2>

                            <div className="mt-6 p-5 rounded-xl bg-green-100">
                                <h2 className="text-2xl font-bold">
                                    Prediction
                                </h2>

                                <p className="text-3xl font-bold mt-2">
                                    {prediction.prediction}
                                </p>

                                <p className="mt-2 text-lg">
                                    Confidence:
                                    <span className="font-semibold">
                                        {" "}
                                        {(prediction.confidence*100).toFixed(1)}%
                                    </span>
                                </p>
                            </div>

                            <div className="mt-5">

                                <h3 className="font-bold mb-3">
                                    Match Probabilities
                                </h3>

                                {
                                    Object.entries(prediction.probabilities).map(([team, prob]) => (
                                        <div key={team} className="mb-3">
                                            <div className="flex justify-between">
                                                <span>{team}</span>
                                                <span>{(prob * 100).toFixed(1)}%</span>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-blue-600 h-3 rounded-full"
                                                    style={{
                                                        width: `${prob * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

            </form>

        </div>

    );

}

export default MatchForm;