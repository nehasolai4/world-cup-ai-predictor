function ProbabilityBars({
    probabilities,
    homeTeam,
    awayTeam
}) {
    return (
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
                                probabilities["Home Win"] * 100
                            }%`
                        }}
                    ></div>
                </div>

                <div className="bar-pct">
                    {(
                        probabilities["Home Win"] * 100
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
                                probabilities["Draw"] * 100
                            }%`
                        }}
                    ></div>
                </div>

                <div className="bar-pct">
                    {(
                        probabilities["Draw"] * 100
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
                                probabilities["Away Win"] * 100
                            }%`
                        }}
                    ></div>
                </div>

                <div className="bar-pct">
                    {(
                        probabilities["Away Win"] * 100
                    ).toFixed(1)}%
                </div>

            </div>

        </div>
    );
}

export default ProbabilityBars;