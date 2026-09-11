import React from "react";
import { createRoot } from "react-dom/client";
import GameTester from "./games/GameTester";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GameTester />
    </React.StrictMode>
);
