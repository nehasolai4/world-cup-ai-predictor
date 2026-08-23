function PredictionButton({
    loading,
    prediction,
    onClick
}) {
    return (
        <div className="predict-wrap">

            <button
                className="predict-btn"
                onClick={onClick}
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
    );
}

export default PredictionButton;