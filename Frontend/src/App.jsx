import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tracks, setTracks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState("");
  const [importedPlaylistSongs, setImportedPlaylistSongs] = useState([]);
  const [playlistRecommendations, setPlaylistRecommendations] = useState([]);

  const accessToken = new URLSearchParams(window.location.search).get(
    "access_token"
  );

  // =====================
  // LOAD USER PLAYLISTS
  // =====================
  const loadMyPlaylists = async () => {
    console.log("Load My Playlists button clicked");

    const res = await fetch(
      "https://api.spotify.com/v1/me/playlists?limit=20",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    console.log("Status:", res.status);
    console.log("Playlist response:", data);

    if (!res.ok) {
      alert(data.error?.message || "Could not load playlists");
      return;
    }

    setUserPlaylists(data.items || []);
  };

  // =====================
  // IMPORT PLAYLIST
  // =====================
  const importMyPlaylist = async (playlist) => {
    setSelectedPlaylistName(playlist.name);

    const tracksUrl =
      playlist.tracks?.href ||
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`;

    const res = await fetch(`${tracksUrl}?limit=50&market=US`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    console.log("Playlist tracks status:", res.status);
    console.log("Playlist tracks data:", data);

    if (!res.ok) {
      alert(data.error?.message || "Could not read this playlist.");
      return;
    }

    const playlistTracks = (data.items || [])
      .map((item) => item.track)
      .filter((track) => track && track.type === "track");

    setImportedPlaylistSongs(playlistTracks);

    // =====================
    // RECOMMENDATIONS
    // =====================
    const uniqueArtists = [
      ...new Set(
        playlistTracks
          .map((track) => track.artists?.[0]?.name)
          .filter(Boolean)
      ),
    ];

    console.log("Artists from playlist:", uniqueArtists);

    const selectedArtists = uniqueArtists.slice(0, 5);
    const allRecommendations = [];

    for (const artistName of selectedArtists) {
      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          artistName
        )}&type=track&limit=10&market=US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const searchData = await searchRes.json();

      console.log("Search result for", artistName, searchData);

      if (searchData.tracks?.items) {
        allRecommendations.push(...searchData.tracks.items);
      }
    }

    const originalSongIds = new Set(playlistTracks.map((t) => t.id));

    const filtered = allRecommendations.filter(
      (t) => !originalSongIds.has(t.id)
    );

    console.log("Final recommendations:", filtered);

    setPlaylistRecommendations(filtered);
  };

  // =====================
  // USER TOP TRACKS
  // =====================
  useEffect(() => {
    if (!accessToken) return;

    fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTracks(data.items || []);
      });
  }, [accessToken]);

  // =====================
  // LOGIN SCREEN
  // =====================
  if (!accessToken) {
    return (
      <div className="container">
        <h1>Music Recommender</h1>
        <a href="http://localhost:5000/login">
          <button>Connect Spotify</button>
        </a>
      </div>
    );
  }

  // =====================
  // MAIN UI
  // =====================
  return (
    <div className="container">
      <h1>Your Top Songs</h1>

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

      <h1>Import Your Playlist</h1>

      <button onClick={loadMyPlaylists}>Load My Playlists</button>

      <div className="song-list">
        {userPlaylists.map((playlist) => (
          <div className="song-card" key={playlist.id}>
            <img src={playlist.images?.[0]?.url || ""} alt="" />
            <div>
              <h3>{playlist.name}</h3>
              <p>{playlist.tracks?.total || 0} songs</p>

              <button onClick={() => importMyPlaylist(playlist)}>
                Use This Playlist
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>{selectedPlaylistName && `Imported: ${selectedPlaylistName}`}</h2>

      <div className="song-list">
        {importedPlaylistSongs.map((track) => (
          <div className="song-card" key={track.id}>
            <img src={track.album?.images?.[0]?.url || ""} alt="" />
            <div>
              <h3>{track.name}</h3>
              <p>{track.artists[0].name}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Playlist-Based Recommendations</h2>

      {playlistRecommendations.length === 0 && selectedPlaylistName && (
        <p>No recommendations yet. Check console logs.</p>
      )}

      <div className="song-list">
        {playlistRecommendations.map((track) => (
          <div className="song-card" key={track.id}>
            <img src={track.album?.images?.[0]?.url || ""} alt="" />
            <div>
              <h3>{track.name}</h3>
              <p>{track.artists[0].name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;