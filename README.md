Yeah I see the issue — your README got squished into one big paragraph and lost proper formatting.

Here’s a clean, properly formatted README you can paste directly (this will fix spacing, bullets, and readability):

🎧 Music Recommender

A web app that connects to your Spotify account and generates personalized song recommendations based on your listening habits.

🚀 Features
Spotify OAuth login
Displays your top 10 songs
Generates 10 recommended songs
Filters out songs you’ve already listened to
Refresh button for new recommendations
Limits to 1 song per artist for better variety
Clean side-by-side UI
🧠 How It Works
Fetches your top 50 tracks from Spotify
Fetches your recently played tracks
Builds a list of songs you have already heard
Uses your favorite songs as search seeds
Finds similar tracks using Spotify search
Filters results:
Removes songs you already know
Limits to 1 song per artist
Returns 10 diverse recommendations
🛠 Tech Stack
React (Frontend)
Node.js + Express (Backend)
Spotify Web API
CSS
⚙️ Setup Instructions
1. Clone the repo
git clone https://github.com/michaelagarciaa/music-recommender.git
cd music-recommender
2. Install dependencies
Frontend
cd frontend
npm install
Backend
cd ../backend
npm install
3. Create .env file in /backend
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:5000/callback
4. Start the app
Backend
cd backend
node server.js
Frontend (new terminal)
cd frontend
npm run dev
5. Open in browser
http://localhost:5173
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