import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VisitorLog from "./VisitorLog";
import { motion } from "framer-motion";

function Home() {
    const [result, setResult] = useState("");
    const [showAddPrompt, setShowAddPrompt] = useState(false);
    const [nameInput, setNameInput] = useState("");

    const handleClick = async () => {
        const audio = new Audio("/bell.mp3");
        audio.play();
        setResult("Capturing...");
        try {
            const res = await axios.get("http://localhost:5000/capture");
            if (res.data.match) {
                setResult(`✅ Hello ${res.data.name}!`);
                setShowAddPrompt(false);
            } else {
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
                textAlign: "center",
                backgroundColor: "#e6ffe6",
                padding: "20px",
                border: "8px solid brown",
                minHeight: "100vh",
                width: "100vw",
                boxSizing: "border-box",
                margin: "0",
            }}
        >
            {/* Logo Image */}
            <img src="/logo.jpg" alt="Logo" width="150" />

            <h1>🎥 Doorbell Face Recognition</h1>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                style={{
                    width: "100%",
                    height: "60px",
                    fontSize: "18px",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    boxSizing: "border-box", // ✅ important so padding + border fit
                    overflowX: "hidden",
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
                        }}
                    />
                    <button
                        onClick={async () => {
                            if (!nameInput.trim()) return;
                            try {
                                const res = await axios.post(
                                    "http://localhost:5000/add_face",
                                    {
                                        name: nameInput.trim(),
                                    }
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
                        fontSize: "36px",
                        backgroundColor: "lightblue",
                        padding: "10px",
                        borderRadius: "8px",
                        marginTop: "40px",
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
                    }}
                >
                    📄 View Visitor Log
                </button>
            </Link>
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
