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
                .slice(1) // skip header
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
                    textAlign: "center",
                    backgroundColor: "#c084fc",
                    minHeight: "100vh",
                    paddingTop: "100px",
                    paddingBottom: "50px",
                }}
            >
                <h2>📄 Visitor Log</h2>
                <Link to="/">
                    <button style={{ marginTop: "10px", padding: "8px 20px" }}>
                        🔙 Back
                    </button>
                </Link>

                {!access ? (
                    loading ? (
                        <p style={{ marginTop: "30px", color: "blue" }}>
                            ⏳ Loading...
                        </p>
                    ) : (
                        <div style={{ marginTop: "30px" }}>
                            <input
                                type="password"
                                placeholder="Enter key"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                style={{ padding: "8px", marginRight: "10px" }}
                            />
                            <button onClick={handleAccess}>
                                🔓 Access Log
                            </button>
                            {error && (
                                <p style={{ color: "red", marginTop: "10px" }}>
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
                                    margin: "30px auto",
                                    borderCollapse: "collapse",
                                    border: "2px solid black",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {log.map((entry, index) => (
                                        <tr key={index}>
                                            <td
                                                style={{
                                                    border: "1px solid black",
                                                    padding: "8px",
                                                }}
                                            >
                                                {entry[0]}
                                            </td>
                                            <td
                                                style={{
                                                    border: "1px solid black",
                                                    padding: "8px",
                                                }}
                                            >
                                                {entry[1]}
                                            </td>
                                            <td
                                                style={{
                                                    border: "1px solid black",
                                                    padding: "8px",
                                                }}
                                            >
                                                {entry[2]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No visitors yet.</p>
                        )}
                        <button
                            onClick={clearLog}
                            style={{ marginTop: "20px", padding: "8px 16px" }}
                        >
                            🗑️ Clear Log
                        </button>
                    </>
                )}
            </motion.div>
            <ToastContainer />
        </>
    );
}

export default VisitorLog;
