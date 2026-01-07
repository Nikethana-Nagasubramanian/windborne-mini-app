"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { FleetHealthOverview } from "@/components/fleet-health-overview"
import { ExceptionList } from "@/components/exception-list"
import { VerticalProfile } from "@/components/vertical-profile"
import { GeospatialMap, BALLOON_CLUSTER } from "@/components/geospatial-map"
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
  const [selectedBalloon, setSelectedBalloon] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBalloons = useMemo(() => {
    if (!searchQuery) return []
    return BALLOON_CLUSTER.filter(b => 
      b.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleSearchSelect = (balloon: any) => {
    // Enrich with mock data similar to what's in other components
    const enrichedBalloon = {
      ...balloon,
      altitude: (balloon as any).altitude || 25000,
      temperature: -52.4,
      pressure: 28.2,
      batteryPercent: 34,
      lastUpdate: new Date().toISOString(),
    }
    setSelectedBalloon(enrichedBalloon)
    setSearchQuery("")
  }

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

        <div className="flex flex-1 items-center justify-center px-8 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search balloon ID..."
              className="w-full bg-muted/50 pl-9 pr-4 text-xs font-mono"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredBalloons.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border bg-popover p-1 shadow-md">
                {filteredBalloons.map((balloon) => (
                  <button
                    key={balloon.id}
                    className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs font-mono hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSearchSelect(balloon)}
                  >
                    <span>{balloon.id}</span>
                    <Badge variant={balloon.status === "anomalous" ? "destructive" : "secondary"} className="scale-75 origin-right">
                      {balloon.status}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
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
          <GeospatialMap selectedBalloon={selectedBalloon} onSelectBalloon={setSelectedBalloon} />
          <div className="grid grid-cols-2 gap-3">
            {selectedBalloon ? (
              <>
                <VerticalProfile balloonId={selectedBalloon.id} />
                <TelemetryPanel balloon={selectedBalloon} />
              </>
            ) : (
              <div className="col-span-2 flex h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
                <p className="text-sm text-muted-foreground">Select a balloon to view detailed telemetry</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Exception List */}
        <div className="col-span-12 lg:col-span-3">
          <ExceptionList onSelectBalloon={setSelectedBalloon} selectedBalloonId={selectedBalloon?.id} />
        </div>
      </div>
    </div>
  )
}
