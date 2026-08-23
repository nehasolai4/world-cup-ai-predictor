function FootballAnimation({ loading }) {
    return (
        <div className="ball-stage">
            <div className="ball-glow"></div>

            <div className={`football ${loading ? "kicking" : ""}`}>
                ⚽
            </div>
        </div>
    );
}

export default FootballAnimation;