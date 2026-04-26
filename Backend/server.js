const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend is working");
});

const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-recently-played"
].join(" ");

app.get("/login", (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: process.env.REDIRECT_URI,
        scope: scopes,
        show_dialog: "true", // THIS IS IMPORTANT
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

const axios = require("axios");

app.get("/callback", async (req, res) => {
    const code = req.query.code;

    try {
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.REDIRECT_URI,
            }),
            {
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            process.env.SPOTIFY_CLIENT_ID +
                            ":" +
                            process.env.SPOTIFY_CLIENT_SECRET
                        ).toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const topTracksResponse = await axios.get(
            "https://api.spotify.com/v1/me/top/tracks?limit=10",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.redirect(
            `http://localhost:5173/dashboard?access_token=${accessToken}`
        );
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.send("Error getting token");
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});