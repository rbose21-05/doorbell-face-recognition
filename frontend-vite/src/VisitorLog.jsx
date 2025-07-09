import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VisitorLog() {
    const [log, setLog] = useState([]);
    const [access, setAccess] = useState(false);
    const [key, setKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAccess = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Access denied");
            }

            const text = await res.text();
            const rows = text
                .trim()
                .split("\n")
                .slice(1)
                .map((line) => line.split(","));
            setLog(rows);
            setAccess(true);
            setError("");
        } catch (err) {
            toast.error("Access Denied");
            setError("⚠️ " + err.message);
        }
        setLoading(false);
    };

    const clearLog = async () => {
        try {
            const res = await fetch("http://localhost:5000/clear_log", {
                method: "POST",
            });
            if (!res.ok) {
                throw new Error("Failed to clear log");
            }
            setLog([]);
            toast.success("Visitor log cleared ✅");
        } catch (err) {
            toast.error("⚠️ " + err.message);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    position: "fixed", // Ensures full coverage
                    top: 0,
                    left: 0,
                    width: "100vw", // Full width
                    height: "100vh", // Full height
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundImage:
                        "linear-gradient(to right, #9d4edd, #f15bb5, #00bbf9)",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    boxSizing: "border-box",
                    padding: "20px",
                    overflow: "hidden",
                    margin: 0,
                    overflowY: "auto", // enables vertical scrolling
                    paddingBottom: "80px", // gives room below table for button
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        padding: "30px",
                        borderRadius: "20px",
                        color: "white",
                        textAlign: "center",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                        fontFamily: "Poppins, sans-serif",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "28px",
                            marginBottom: "10px",
                            letterSpacing: "2px",
                        }}
                    >
                        📄 Visitor Log
                    </h2>
                    <Link to="/">
                        <button
                            style={{
                                padding: "8px 20px",
                                backgroundColor: "#f0f0f0",
                                color: "#333",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                marginBottom: "20px",
                            }}
                        >
                            🔙 Back
                        </button>
                    </Link>

                    {!access ? (
                        loading ? (
                            <p
                                style={{
                                    color: "lightblue",
                                    marginTop: "30px",
                                }}
                            >
                                ⏳ Loading...
                            </p>
                        ) : (
                            <div style={{ marginTop: "30px" }}>
                                <input
                                    type="password"
                                    placeholder="Enter key"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    style={{
                                        padding: "10px",
                                        fontSize: "16px",
                                        borderRadius: "8px",
                                        marginRight: "10px",
                                        border: "1px solid #ccc",
                                        outline: "none",
                                    }}
                                />
                                <button
                                    onClick={handleAccess}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    🔓 Access Log
                                </button>
                                {error && (
                                    <p
                                        style={{
                                            color: "salmon",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {error}
                                    </p>
                                )}
                            </div>
                        )
                    ) : (
                        <>
                            {log.length > 0 ? (
                                <table
                                    style={{
                                        width: "100%",
                                        marginTop: "30px",
                                        borderCollapse: "collapse",
                                        border: "1px solid #ccc",
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.2)",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <thead
                                        style={{
                                            backgroundColor:
                                                "rgba(255,255,255,0.3)",
                                        }}
                                    >
                                        <tr>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    color: "#fff",
                                                }}
                                            >
                                                Name
                                            </th>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    color: "#fff",
                                                }}
                                            >
                                                Date
                                            </th>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    color: "#fff",
                                                }}
                                            >
                                                Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {log.map((entry, index) => (
                                            <tr key={index}>
                                                {entry.map((cell, i) => (
                                                    <td
                                                        key={i}
                                                        style={{
                                                            padding: "10px",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                            color: "white",
                                                            fontSize: "15px",
                                                        }}
                                                    >
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No visitors yet.</p>
                            )}
                            <button
                                onClick={clearLog}
                                style={{
                                    marginTop: "20px",
                                    padding: "10px 20px",
                                    backgroundColor: "#e53935",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                🗑️ Clear Log
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
            <ToastContainer />
        </>
    );
}

export default VisitorLog;
