# 🔔 Doorbell Face Recognition

A smart, real-time face recognition doorbell system built with **React** and **Flask**. It captures live webcam footage, detects known or unknown faces using DeepFace, and logs visitor data securely. Designed with a sleek UI and secure access control for the visitor log.

---

## 🚀 Features

- 🎥 Live webcam face capture
- 🧠 Face recognition using DeepFace (Flask backend)
- ✅ Friendly greeting if match found
- ❌ Alarm trigger for unknown faces
- ➕ Add new faces to the system
- 🔐 Secure key-based access to visitor logs
- 📄 CSV log with name, date, and time
- 💅 Stylish UI with gradients, animation, and frosted glass effect
- 🔊 Doorbell and alarm sound effects
- 📦 Full-stack: React (frontend), Flask (backend)

---

## 📸 Preview

| Capture Face UI | Visitor Log UI |
|-----------------|----------------|
| ![Capture](./screenshots/capture-ui.png) | ![Log](./screenshots/log-ui.png) |

> *(Add actual screenshots to a `screenshots/` folder)*

---

## 🧰 Tech Stack

| Frontend        | Backend        | Others             |
|-----------------|----------------|--------------------|
| React           | Flask (Python) | OpenCV, DeepFace   |
| Framer Motion   | Flask-CORS     | React Webcam       |
| React Router    | Python `csv`   | Toast Notifications |
| Tailwind / CSS  |                |                    |

---

## 🔧 Installation

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
Ensure these packages are included in requirements.txt:

text
Copy code
flask
flask-cors
deepface
opencv-python
Frontend (React)
bash
Copy code
cd frontend
npm install
npm run dev
🔐 Accessing the Visitor Log
To view the visitor log, enter the secure key:

text
Copy code
Key: 211005
You can change this in the backend logic inside app.py.

📂 File Structure
csharp
Copy code
doorbell-face-recognition/
│
├── backend/
│   ├── app.py
│   ├── faces/             # Stored face encodings
│   └── visitor_log.csv    # Logged visitors
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── Home.js
│   │   └── VisitorLog.js
│   └── public/
│       ├── bell.mp3
│       └── alarm.mp3
│
└── README.md
📌 TODOs
 Host the app using Render / Vercel + Replit backend

 Add face preview thumbnail

 Implement face deletion or editing

 Add speech feedback (react-text-to-speech)

 Add dark mode 🌙

🙋‍♀️ Author
Made with ❤️ by @rbose21-05

📜 License
MIT License – free to use and modify.

markdown
Copy code

---

### ✅ Next Step

1. **Create a folder** in your repo: `screenshots/`
2. **Add two images**:
   - `capture-ui.png`: from the homepage
   - `log-ui.png`: the visitor log with entries
3. Paste this `README.md` in the root of your repo.

Would you like help generating the screenshots or deploying the app?
