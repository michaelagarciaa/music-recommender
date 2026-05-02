import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import RecentlyPlayed from "./RecentlyPlayed.jsx";

function App() {
  // Save token from URL on first load
  const urlToken = new URLSearchParams(window.location.search).get("access_token");
  if (urlToken) {
    localStorage.setItem("access_token", urlToken);
    window.history.replaceState({}, "", "/");
  }

  const accessToken = localStorage.getItem("access_token");

  const [tracks, setTracks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [knownSongIds, setKnownSongIds] = useState(new Set());
  const [knownArtistNames, setKnownArtistNames] = useState(new Set());

  // ⭐ OLD RECOMMENDATION ENGINE (RESTORED)
  const getRecommendations = async (
    topTracks,
    blockedIds = knownSongIds,
    blockedArtists = knownArtistNames
  ) => {
    if (!topTracks || topTracks.length === 0) return;

    const seedTracks = [...topTracks]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    let allRecommendations = [];

    for (const seed of seedTracks) {
      const artistName = seed.artists[0].name;

      const searchQueries = [
        `${artistName} similar artists`,
        `${artistName} fans also like`,
        `${artistName} deep cuts`,
        `${artistName} underrated songs`,
        `${artistName} playlist`,
      ];

      const randomQuery =
        searchQueries[Math.floor(Math.random() * searchQueries.length)];

      try {
        const searchRes = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            randomQuery
          )}&type=track&limit=10&market=US&offset=${Math.floor(
            Math.random() * 20
          )}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!searchRes.ok) continue;

        const searchData = await searchRes.json();

        if (searchData.tracks?.items) {
          allRecommendations.push(...searchData.tracks.items);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }

    allRecommendations = allRecommendations.sort(() => 0.5 - Math.random());

    const usedArtists = new Set();
    const usedSongs = new Set();
    const finalRecommendations = [];

    for (const track of allRecommendations) {
      if (!track.id) continue;
      if (blockedIds.has(track.id)) continue;
      if (usedSongs.has(track.id)) continue;

      const mainArtist = track.artists[0]?.name;
      if (!mainArtist) continue;

      const artistKey = mainArtist.toLowerCase();
      if (blockedArtists.has(artistKey)) continue;
      if (usedArtists.has(artistKey)) continue;

      finalRecommendations.push(track);
      usedArtists.add(artistKey);
      usedSongs.add(track.id);

      if (finalRecommendations.length === 10) break;
    }

    setRecommendations(finalRecommendations);
  };

  // Load top tracks
  useEffect(() => {
    if (!accessToken) return;

    const loadData = async () => {
      const topRes = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=50",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const topData = await topRes.json();
      const topTracks = topData.items || [];

      setTracks(topTracks.slice(0, 10));

      const blockedIds = new Set(topTracks.map((t) => t.id));
      const blockedArtists = new Set(
        topTracks.map((t) => t.artists[0].name.toLowerCase())
      );

      setKnownSongIds(blockedIds);
      setKnownArtistNames(blockedArtists);

      // ⭐ Call old recommendation engine
      getRecommendations(topTracks, blockedIds, blockedArtists);
    };

    loadData();
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="container">
        <h1>Music Recommender</h1>
        <a href="http://127.0.0.1:5000/login">
          <button>Connect Spotify</button>
        </a>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="container">
            <h1>Music Recommender</h1>

            <Link to="/recent">
              <button>View Recently Played</button>
            </Link>

            <div className="columns">
              {/* TOP SONGS */}
              <section className="column">
                <h2>Your Top Songs</h2>
                <div className="song-list">
                  {tracks.map((track) => (
                    <div className="song-card" key={track.id}>
                      <img src={track.album?.images?.[0]?.url || ""} alt="" />
                      <div>
                        <h3>{track.name}</h3>
                        <p>{track.artists[0].name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* RECOMMENDED SONGS */}
              <section className="column">
                <h2>Recommended Songs</h2>

                <button
                  onClick={() =>
                    getRecommendations(tracks, knownSongIds, knownArtistNames)
                  }
                  style={{ marginBottom: "15px" }}
                >
                  Refresh Recommendations
                </button>

                <div className="song-list">
                  {recommendations.map((track) => (
                    <div className="song-card" key={track.id}>
                      <img src={track.album?.images?.[0]?.url || ""} alt="" />
                      <div>
                        <h3>{track.name}</h3>
                        <p>{track.artists[0].name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        }
      />

      <Route
        path="/recent"
        element={<RecentlyPlayed accessToken={accessToken} />}
      />
    </Routes>
  );
}

export default App;
