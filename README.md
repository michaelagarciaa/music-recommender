# 🎧 Music Recommender

A web app that connects to your Spotify account and generates personalized song recommendations based on your listening habits.

---

## 🚀 Features

- Spotify OAuth login  
- Displays your top 10 songs  
- Generates 10 recommended songs  
- Filters out songs you have already listened to  
- Refresh button for new recommendations  
- Limits to 1 song per artist for better variety  
- Clean side-by-side UI  

---

## 🧠 How It Works

1. Fetches your top 50 tracks from Spotify  
2. Fetches your recently played tracks  
3. Builds a list of songs you have already heard  
4. Uses your favorite songs as search seeds  
5. Finds similar tracks using Spotify search  
6. Filters results:
   - Removes songs you already know  
   - Limits to 1 song per artist  
7. Returns 10 diverse recommendations  

---

## 🛠 Tech Stack

- React (Frontend)  
- Node.js + Express (Backend)  
- Spotify Web API  
- CSS  

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/michaelagarciaa/music-recommender.git
cd music-recommender
2. Install dependencies
Frontend
cd frontend
npm install
Backend
cd ../backend
npm install
3. Create a Spotify App

Go to: https://developer.spotify.com/dashboard

Click Create App
Add a name and description
Go to Settings
Add this Redirect URI:
http://localhost:5000/callback
Save and copy:
Client ID
Client Secret
4. Create .env file in /backend

Create a file called .env inside the backend folder and add:

SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:5000/callback
5. Start the backend
cd backend
node server.js

You should see:

Backend running on http://localhost:5000
6. Start the frontend

Open a new terminal:

cd frontend
npm run dev
7. Open the app

Go to:

http://localhost:5173

Click Connect Spotify and log in.

⚠️ Notes
Spotify API limitations restrict full recommendation features
This app uses search-based similarity as a workaround
Some songs may overlap with your listening history
📈 Future Improvements
Better similarity scoring
Genre-based filtering
Save recommendations as Spotify playlists
Deploy live version
👤 Author

Michael Garcia
Computer Science Graduate