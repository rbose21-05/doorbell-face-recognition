import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VisitorLog from "./VisitorLog";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
/*import speech from react-text-to-speech;*/

function Home() {
    /*<speech text="Hello, this is React speaking!" />;*/

    const [result, setResult] = useState("");
    const [showAddPrompt, setShowAddPrompt] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const webcamRef = React.useRef(null);

    const handleClick = async () => {
        const audio = new Audio("/bell.mp3");
        audio.play();
        setResult("Capturing...");

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            setResult("⚠️ No image captured. Please try again.");
            return;
        }
        try {
            const res = await axios.post("http://localhost:5000/recognize", {
                image: imageSrc,
            });
            if (res.data.match) {
                setResult(`✅ Hello ${res.data.name}!`);
                setShowAddPrompt(false);
            } else {
                const audio_2 = new Audio("/alarm.mp3");
                audio_2.play();
                setResult("❌ Face not recognized.");
                setShowAddPrompt(true);
            }
        } catch (error) {
            setResult("⚠️ Error: " + error.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
                boxSizing: "border-box",
                overflowX: "hidden",
                overflowY: "scroll",
                backgroundImage:
                    "linear-gradient(to right, #9d4edd, #f15bb5, #00bbf9)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <div
                style={{
                    width: "90%",
                    maxWidth: "480px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",

                    padding: "24px",
                    borderRadius: "24px",
                    color: "white",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                    textAlign: "center",
                    backdropFilter: "blur(10px)", // Optional: keep frosted feel
                    WebkitBackdropFilter: "blur(10px)",
                }}
            >
                <h1
                    style={{
                        fontSize: "32px",
                        fontWeight: "800",
                        letterSpacing: "3px",
                        marginBottom: "8px",
                        color: "white",
                        textTransform: "uppercase",
                    }}
                >
                    FACE-BELL
                </h1>

                <p
                    style={{
                        fontSize: "14px",
                        fontStyle: "italic",
                        color: "white",
                        letterSpacing: "1px",
                        marginBottom: "24px",
                    }}
                >
                    Downloading a dad joke, smile!!
                </p>

                <div
                    style={{
                        borderRadius: "50%",
                        overflow: "hidden",
                        width: "200px",
                        height: "200px",
                        backgroundColor: "#003566",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto 24px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    }}
                >
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                    style={{
                        width: "100%",
                        height: "50px",
                        fontSize: "18px",
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    📸 Capture Face
                </motion.button>

                {showAddPrompt && (
                    <div style={{ marginTop: "30px" }}>
                        <p>Do you want to add this person?</p>
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            style={{
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "6px",
                                marginRight: "10px",
                                marginBottom: "10px",
                            }}
                        />
                        <button
                            onClick={async () => {
                                if (!nameInput.trim()) return;
                                try {
                                    const res = await axios.post(
                                        "http://localhost:5000/add_face",
                                        { name: nameInput.trim() }
                                    );
                                    alert(res.data.message || "Face added!");
                                    setNameInput("");
                                    setShowAddPrompt(false);
                                } catch (err) {
                                    alert(
                                        "⚠️ " +
                                            (err.response?.data?.error ||
                                                err.message)
                                    );
                                }
                            }}
                            style={{
                                padding: "10px 16px",
                                fontSize: "16px",
                                backgroundColor: "#673AB7",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            ➕ Add Face
                        </button>
                    </div>
                )}

                {result && (
                    <p
                        style={{
                            fontSize: "24px",
                            backgroundColor: "lightblue",
                            padding: "10px",
                            borderRadius: "8px",
                            marginTop: "30px",
                        }}
                    >
                        {result}
                    </p>
                )}

                <Link to="/log">
                    <button
                        style={{
                            marginTop: "30px",
                            padding: "10px 20px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            backgroundColor: "#eee",
                            cursor: "pointer",
                        }}
                    >
                        📄 View Visitor Log
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/log" element={<VisitorLog />} />
            </Routes>
        </Router>
    );
}

export default App;
