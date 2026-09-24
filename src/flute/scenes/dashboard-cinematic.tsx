"use client";

import { Surface } from "@webprodigies/flute";
import TasksDashboard from "../../../components/TasksDashboard";

export default function DashboardCinematic() {
    return (
        <Surface id="dashboard" style={{ width: 1400, height: 980 }}>
            <TasksDashboard />
        </Surface>
    );
}
