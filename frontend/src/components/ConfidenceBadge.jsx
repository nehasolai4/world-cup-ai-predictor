function ConfidenceBadge({ confidence }) {

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
        <div
            className={`confidence ${getConfidenceClass(confidence)}`}
        >
            {getConfidenceText(confidence)}
        </div>
    );
}

export default ConfidenceBadge;