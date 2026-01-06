"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { FleetHealthOverview } from "@/components/fleet-health-overview"
import { ExceptionList } from "@/components/exception-list"
import { VerticalProfile } from "@/components/vertical-profile"
import { GeospatialMap } from "@/components/geospatial-map"
import { FleetTimeline } from "@/components/fleet-timeline"
import { TelemetryPanel } from "@/components/telemetry-panel"
import { Activity, Satellite } from "lucide-react"

// Mock data for a selected balloon
const SELECTED_BALLOON = {
  id: "WB-7284",
  lat: 37.2841,
  lon: -115.8245,
  altitude: 28450,
  temperature: -52.4,
  pressure: 28.2,
  batteryPercent: 34,
  status: "anomalous" as const,
  lastUpdate: "2026-01-06T14:32:18Z",
}

export function MissionControlDashboard() {
  const [selectedBalloon, setSelectedBalloon] = useState(SELECTED_BALLOON)

  return (
    <div className="min-h-screen bg-background p-3">
      {/* Header */}
      <header className="mb-3 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
            <Satellite className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">STRATOSPHERE CONTROL</h1>
            <p className="text-xs text-muted-foreground">Global Weather Balloon Fleet Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-success" />
            <span className="font-mono text-xs text-muted-foreground">SYSTEM NOMINAL</span>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {new Date().toISOString().split("T")[0]} {new Date().toTimeString().split(" ")[0]}Z
          </Badge>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-3">
        {/* Left Column: Fleet Health + Timeline */}
        <div className="col-span-12 space-y-3 lg:col-span-3">
          <FleetHealthOverview />
          <FleetTimeline />
        </div>

        {/* Center Column: Map + Vertical Profile */}
        <div className="col-span-12 space-y-3 lg:col-span-6">
          <GeospatialMap selectedBalloon={selectedBalloon} />
          <div className="grid grid-cols-2 gap-3">
            <VerticalProfile balloonId={selectedBalloon.id} />
            <TelemetryPanel balloon={selectedBalloon} />
          </div>
        </div>

        {/* Right Column: Exception List */}
        <div className="col-span-12 lg:col-span-3">
          <ExceptionList onSelectBalloon={setSelectedBalloon} />
        </div>
      </div>
    </div>
  )
}
