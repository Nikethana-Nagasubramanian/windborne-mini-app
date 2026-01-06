"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, TrendingDown, Wifi } from "lucide-react"

const CRITICAL_BALLOONS = [
  {
    id: "WB-7284",
    status: "Rapid Descent",
    severity: "critical",
    altitude: 28450,
    rate: -12.4,
    lat: 37.2841,
    lon: -115.8245,
    icon: TrendingDown,
  },
  {
    id: "WB-3921",
    status: "Sensor Failure",
    severity: "critical",
    altitude: 31200,
    rate: 0.2,
    lat: 42.1547,
    lon: -98.4523,
    icon: AlertTriangle,
  },
  {
    id: "WB-5103",
    status: "Signal Loss",
    severity: "critical",
    altitude: 29880,
    rate: -2.1,
    lat: 35.6892,
    lon: -102.3341,
    icon: Wifi,
  },
  {
    id: "WB-8432",
    status: "Rapid Descent",
    severity: "critical",
    altitude: 26100,
    rate: -15.8,
    lat: 39.7456,
    lon: -104.9923,
    icon: TrendingDown,
  },
  {
    id: "WB-2067",
    status: "Sensor Failure",
    severity: "critical",
    altitude: 32450,
    rate: 1.1,
    lat: 41.2534,
    lon: -95.9345,
    icon: AlertTriangle,
  },
  {
    id: "WB-9154",
    status: "Signal Loss",
    severity: "critical",
    altitude: 30120,
    rate: -0.8,
    lat: 38.5816,
    lon: -109.5498,
    icon: Wifi,
  },
  {
    id: "WB-4728",
    status: "Rapid Descent",
    severity: "critical",
    altitude: 24890,
    rate: -18.2,
    lat: 36.7783,
    lon: -119.4179,
    icon: TrendingDown,
  },
]

interface ExceptionListProps {
  onSelectBalloon: (balloon: any) => void
}

export function ExceptionList({ onSelectBalloon }: ExceptionListProps) {
  return (
    <Card className="border-border bg-card p-3">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Critical Exceptions</h2>
        <Badge variant="destructive" className="font-mono text-xs">
          {CRITICAL_BALLOONS.length}
        </Badge>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-2">
          {CRITICAL_BALLOONS.map((balloon) => (
            <button
              key={balloon.id}
              onClick={() =>
                onSelectBalloon({
                  id: balloon.id,
                  lat: balloon.lat,
                  lon: balloon.lon,
                  altitude: balloon.altitude,
                  temperature: -52.4,
                  pressure: 28.2,
                  batteryPercent: 34,
                  status: "anomalous",
                  lastUpdate: new Date().toISOString(),
                })
              }
              className="w-full rounded-md border border-border bg-card p-2 text-left transition-colors hover:bg-accent"
            >
              <div className="flex items-start gap-2">
                <balloon.icon className="mt-1 size-3.5 text-critical" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-foreground">{balloon.id}</span>
                    <span
                      className={`font-mono text-xs ${balloon.rate < 0 ? "text-critical" : "text-muted-foreground"}`}
                    >
                      {balloon.rate > 0 ? "+" : ""}
                      {balloon.rate.toFixed(1)} m/s
                    </span>
                  </div>
                  <p className="text-xs text-critical">{balloon.status}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      {balloon.altitude.toLocaleString()}m
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {balloon.lat.toFixed(2)}°, {balloon.lon.toFixed(2)}°
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
