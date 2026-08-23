import ConfidenceBadge from "./ConfidenceBadge";
import ProbabilityBars from "./ProbabilityBars";

function PredictionResult({
    prediction,
    homeTeam,
    awayTeam
}) {
    return (
        <div className="panel result show">

            {/* TOP */}
            <div className="result-top">

                <div className="result-teams">
                    {homeTeam?.label.toUpperCase()}
                    {" VS "}
                    {awayTeam?.label.toUpperCase()}
                </div>

                <ConfidenceBadge
                    confidence={prediction.confidence}
                />

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
            <ProbabilityBars
                probabilities={prediction.probabilities}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
            />


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
    );
}

export default PredictionResult;