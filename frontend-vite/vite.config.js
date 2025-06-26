import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/capture": "http://localhost:5000",
            "/add_face": "http://localhost:5000",
            "/log": "http://localhost:5000",
            "/clear_log": "http://localhost:5000",
        },
    },
});
