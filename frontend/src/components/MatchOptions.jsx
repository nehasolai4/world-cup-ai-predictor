function MatchOptions({
    neutral,
    setNeutral,
    tournament,
    setTournament
}) {
    return (
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
    );
}

export default MatchOptions;