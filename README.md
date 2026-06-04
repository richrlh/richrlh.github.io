# Feral Gremlin - Reward-Based Calendar Task Manager

Feral Gremlin is a clean, modern, and user-friendly calendar and task manager specifically designed to help **neurodivergent individuals** build rewarding, structured daily routines. 

By wrapping task completion in a gamified pet companion simulator with satisfying audio-visual reinforcement loops (such as flying coins, particle bursts, and success chimes), the app converts typical chore stress into engaging and dopamine-friendly rewards.

---

## 🌟 Key Features

1. **Secure Sign-In & Sync**: Integrated with Google Firebase. Your account securely stores and synchronizes schedules, wallet balance, active pet choices, items inventory, and sound settings in the cloud.
2. **Offline-First Demo Mode**: If no Firebase credentials are set up, the app runs in **Demo Mode**. Any email/password will grant local access, using the browser's `localStorage` to save stats, tasks, and pets.
3. **Interactive Calendar Layout**: Visual day cells showing task markers, today highlights, and expandable daily schedule timetables from 7:00 AM to 11:00 PM.
4. **Pet Variations & Customizations**: Adopt a **Puppy 🐶**, **Turtle 🐢**, or a **Cute Dragon 🐲**! Track their happiness levels and customize them with clothes, toys, and foods purchased from the shop using coins earned by completing tasks.
5. **Aesthetic Dark Blue Theme**: Premium navy glassmorphism layout featuring Outfits typography, neon highlights, glowing borders, custom scrollbars, and fluid animations.
6. **Focus Soundscapes**: Customize a list of ambient sounds, upload MP3 files, or store YouTube links to play back focus tracks while completing tasks.

---

## 🛠️ Step-by-Step Google Firebase Setup

Since this application is a client-side static web app, it loads the Firebase modular SDK (v10) directly via CDN. Follow these steps to connect your own Firebase project:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts to create a new project.

### Step 2: Register a Web App
1. Inside your Firebase project overview dashboard, click the **Web icon (`</>`)** to register a web app.
2. Give your web app a nickname (e.g. `Feral Gremlin App`).
3. Click **Register app** to view your app's `firebaseConfig` object. It will look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

### Step 3: Enable Authentication
1. In the Firebase console sidebar, click **Build** -> **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, choose **Email/Password**, toggle **Enable**, and click **Save**.

### Step 4: Enable Firestore Database
1. In the console sidebar, click **Build** -> **Firestore Database**.
2. Click **Create database**.
3. Select your database location and click **Next**.
4. Choose **Start in test mode** (allows rapid development; you can restrict read/write rules later to logged-in users only), then click **Create**.
5. *For Production Security, update rules to:*
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### Step 5: Embed Config Keys in App Code
1. Open the file [js/firebase-db.js](file:///c:/Users/KZY/git/Client-Project/js/firebase-db.js).
2. Find the `firebaseConfig` object (around line 19) and paste your credentials:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY_HERE",
       authDomain: "YOUR_PROJECT_ID_HERE.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID_HERE",
       ...
   };
   ```
3. Save the file. The next time you open the app, it will connect directly to your database and hide the Demo Mode banner!

---

## 🚀 Running the App Locally

This application is built with vanilla HTML5, Javascript, and CSS3. 
- You can run it by opening [login.html](file:///c:/Users/KZY/git/Client-Project/login.html) directly in any web browser!
- For the best experience (and to avoid potential browser CORS restrictions with dynamic dynamic sidebars injection), we recommend serving the folder using a local HTTP server:
  - **VS Code Live Server**: Open the workspace folder in VS Code, right-click `login.html`, and select **Open with Live Server**.
  - **Node.js `http-server`**: Run `npx http-server` in the directory.
  - **Python server**: Run `python -m http.server` in the directory.

---

## 📂 File Architecture

- [login.html](file:///c:/Users/KZY/git/Client-Project/login.html) - Sign-in/Registration interface.
- [index.html](file:///c:/Users/KZY/git/Client-Project/index.html) - Main calendar dashboard and task checking grid.
- [task-inputter.html](file:///c:/Users/KZY/git/Client-Project/task-inputter.html) - Task input form with drag-and-drop priority boxes.
- [pet.html](file:///c:/Users/KZY/git/Client-Project/pet.html) - Greet Your Pet companion room, stats, and rewards shop.
- [music-selector.html](file:///c:/Users/KZY/git/Client-Project/music-selector.html) - Playlist manager for custom focus track uploads.
- `js/`
  - [firebase-db.js](file:///c:/Users/KZY/git/Client-Project/js/firebase-db.js) - Firebase config initialization and cloud auto-sync hooks.
  - [main.js](file:///c:/Users/KZY/git/Client-Project/js/main.js) - Global auth routing filters, sidebar collapsing, and greeting logic.
  - [calendar.js](file:///c:/Users/KZY/git/Client-Project/js/calendar.js) - Timetable scheduler rendering, reward chimes, coin floaters, and particles.
  - [task-inputter.js](file:///c:/Users/KZY/git/Client-Project/js/task-inputter.js) - Drag/drop handling and algorithmic day schedule generation.
  - [pet.js](file:///c:/Users/KZY/git/Client-Project/js/pet.js) - Character selection, customizable items shop, and accessories overlay renderer.
  - [music.js](file:///c:/Users/KZY/git/Client-Project/js/music.js) - Custom ambient MP3 audio player logic.
- `css/`
  - [style.css](file:///c:/Users/KZY/git/Client-Project/css/style.css) - Global stylesheets containing the dark blue color system and responsive classes.
- `assets/images/`
  - `puppy.png`, `turtle.png`, `dragon.png` - Custom pet illustrations.
