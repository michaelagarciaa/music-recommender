const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend is working");
});

// REQUIRED SCOPES
const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-read-recently-played",
    "playlist-read-private",
    "playlist-read-collaborative"
].join(" ");

app.get("/login", (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: process.env.REDIRECT_URI, // MUST MATCH DASHBOARD EXACTLY
        scope: scopes,
        show_dialog: "true"
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;

    try {
        // EXCHANGE CODE FOR TOKEN
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.REDIRECT_URI // MUST MATCH EXACTLY
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
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // OPTIONAL: verify token works
        await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // SEND TOKEN TO FRONTEND
        res.redirect(
            `http://localhost:5173/dashboard?access_token=${accessToken}`
        );

    } catch (error) {
        console.log("TOKEN ERROR:", error.response?.data || error.message);
        res.send("Error getting token");
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://127.0.0.1:5000");
});
