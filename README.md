# 🎵 Kon Gaan?

> **Identify the music in any video.**

**Kon Gaan** is a web application that identifies songs/music from videos shared through social media and video platforms.

🔗 **Live Demo:** https://kongaan.onrender.com/

---

## ✨ What is Kon Gaan?

Ever watched a Reel, TikTok, YouTube Short, or random video and wondered:

> **"Kon Gaan?" — What song is this?**

Kon Gaan lets you paste a video link and automatically analyzes the audio to identify the music inside it.

The application extracts the audio from the provided video, analyzes the audio clip, and sends it for music recognition.

The live application currently supports links from platforms such as:

* ▶️ YouTube
* 📸 Instagram
* 📘 Facebook
* 🎵 TikTok
* 𝕏 Twitter/X
* 🎬 Vimeo
* 🌐 And many other supported video platforms

---

## 🚀 How It Works

```text
          Video URL
              │
              ▼
       ┌──────────────┐
       │   Kon Gaan   │
       └──────┬───────┘
              │
              ▼
        Extract Audio
              │
              ▼
       Analyze Audio Clip
              │
              ▼
      Music Recognition
              │
              ▼
       🎵 Song Identified
```

The application goes through three main stages:

1. **Extracting audio** from the provided video.
2. **Analyzing the audio** to find recognizable music.
3. **Matching the music** against a music-recognition service.

Depending on the video and connection, the process can take approximately **20–40 seconds**.

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### APIs & Services

* **yt-dlp** — Video/audio extraction
* **AudD Music Recognition API** — Music identification
* **Render** — Backend deployment
* **Vercel** — Frontend deployment

---

## 📂 Project Structure

```text
Kon-Gaan/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── README.md
└── ...
```

> The exact structure may vary depending on the current version of the project.

---

## 💻 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/kon-gaan.git
cd kon-gaan
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the backend directory:

```env
AUDD_API_TOKEN=your_audd_api_token
PORT=3000
```

Replace `your_audd_api_token` with your actual AudD API token.

**Never commit your ****`.env`**** file to GitHub.**

### 4. Start the server

```bash
npm start
```

or, if your project uses a development script:

```bash
npm run dev
```

---

## 🎯 Usage

1. Open **Kon Gaan**.
2. Copy a video URL from a supported platform.
3. Paste the URL into the input field.
4. Click **Khujo**.
5. Wait while Kon Gaan:

   * extracts the audio,
   * analyzes the clip,
   * matches the music.
6. If the music is recognized, the result will be displayed.

If no recognizable music is found, try another video or a different timestamp/clip.

---

## ⚠️ Limitations

Music identification may fail when:

* The video contains very short audio.
* The audio is extremely quiet.
* There is heavy background noise.
* The music is heavily edited or remixed.
* The audio isn't recognizable by the music-recognition service.
* The video cannot be accessed or downloaded.

The application may also depend on the availability and restrictions of the source video platform.

---

## 🔐 Environment Variables

| Variable         | Description                          |
| ---------------- | ------------------------------------ |
| `AUDD_API_TOKEN` | API token used for music recognition |
| `PORT`           | Port used by the Express server      |

---

## 🌐 Live Demo

Try it here:

**https://kongaan.onrender.com/**

---

## 🧠 Why I Built This

Kon Gaan started as a simple idea:

> **What if I could paste a video link and instantly find the song playing in it?**

Instead of manually searching through lyrics, comments, or trying to remember a melody, Kon Gaan automates the process.

This project was also built as a hands-on experiment with:

* Full-stack web development
* REST APIs
* Audio processing
* Video downloading/extraction
* Third-party API integration
* Frontend/backend communication
* Deployment
* Error handling

---

## 🔮 Future Improvements

Some features I'd like to explore:

* [ ] Display album artwork
* [ ] Show artist information
* [ ] Provide Spotify/YouTube links
* [ ] Support uploaded video/audio files
* [ ] Allow users to select a specific timestamp
* [ ] Improve recognition for remixes and covers
* [ ] Add search history
* [ ] Improve mobile UI
* [ ] Add caching for repeated searches
* [ ] Add rate limiting and better abuse protection

---

## 🙏 Credits

Kon Gaan is powered by:

* **yt-dlp** for media extraction
* **AudD** for music recognition

Built with ❤️ by **Rafid A. Prince**

---

## 📜 Disclaimer

Kon Gaan is intended for educational and personal use.

Users are responsible for ensuring that they have the necessary rights and permissions to access and process videos submitted to the application.

---

⭐ **If you found this project interesting, consider giving the repository a star!**
