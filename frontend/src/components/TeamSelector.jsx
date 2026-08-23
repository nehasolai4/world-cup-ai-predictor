import Select from "react-select";

function TeamSelector({
    teams,
    selectedTeam,
    setSelectedTeam,
    side
}) {
    const isHome = side === "home";

    return (
        <div className={`panel team-card ${side}`}>

            <div className="side-label">
                {isHome ? "◤ HOME" : "AWAY ◢"}
            </div>

            <Select
                options={teams}
                value={selectedTeam}
                onChange={setSelectedTeam}
                placeholder={
                    isHome
                        ? "Select home team..."
                        : "Select away team..."
                }
                className="team-select-react"
                classNamePrefix="team"
            />

            <div className="rating-row">
                <span>
                    Selected Team
                </span>

                <b>
                    {selectedTeam ? selectedTeam.label : "—"}
                </b>
            </div>

        </div>
    );
}

export default TeamSelector;