import { useEffect, useState } from "react";

function RecentlyPlayed({ accessToken }) {
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        if (!accessToken) return;

        const loadRecent = async () => {
            const res = await fetch(
                "https://api.spotify.com/v1/me/player/recently-played?limit=50",
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            const data = await res.json();
            const tracks = (data.items || []).map((item) => item.track);
            setRecent(tracks);
        };

        loadRecent();
    }, [accessToken]);

    return (
        <div className="container">
            <h1>Recently Played (Last 50)</h1>

            <a href="/">
                <button>Back</button>
            </a>

            <div className="song-list">
                {recent.map((track) => (
                    <div className="song-card" key={track.id}>
                        <img src={track.album?.images?.[0]?.url || ""} alt="" />

                        <div className="song-info">
                            <div className="song-text">
                                <h3>{track.name}</h3>
                                <p>{track.artists[0].name}</p>
                            </div>

                            <a
                                href={track.external_urls?.spotify}
                                target="_blank"
                                rel="noreferrer"
                                className="spotify-link"
                            >
                                ▶
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyPlayed;
