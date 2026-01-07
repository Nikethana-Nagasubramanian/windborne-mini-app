"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Gauge, Battery, MapPin } from "lucide-react"

interface TelemetryPanelProps {
  balloon: {
    id: string
    altitude: number
    temperature: number
    pressure: number
    batteryPercent: number
    lat: number
    lon: number
    lastUpdate: string
  }
}

export function TelemetryPanel({ balloon }: TelemetryPanelProps) {
  return (
    <Card className="border-border bg-card p-3 relative">
      <div className="absolute right-3 top-3">
        <Badge variant="outline" className="font-mono text-[10px] tracking-tighter">
          {balloon.id}
        </Badge>
      </div>
      <div className="mb-3 border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live Telemetry</h2>
        <p className="font-mono text-xs text-muted-foreground">{balloon.id}</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
          <MapPin className="size-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Position</p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {balloon.lat.toFixed(4)}°, {balloon.lon.toFixed(4)}°
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
          <Thermometer className="size-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="font-mono text-sm font-semibold text-foreground">{balloon.temperature.toFixed(1)}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
          <Gauge className="size-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Pressure</p>
            <p className="font-mono text-sm font-semibold text-foreground">{balloon.pressure.toFixed(1)} hPa</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
          <Battery className="size-4 text-critical" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Battery</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-semibold text-critical">{balloon.batteryPercent}%</p>
              {balloon.batteryPercent < 30 && (
                <Badge variant="destructive" className="text-xs">
                  LOW
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-muted/30 p-2">
          <p className="text-xs text-muted-foreground">Last Update</p>
          <p className="font-mono text-xs text-foreground">
            {new Date(balloon.lastUpdate).toISOString().replace("T", " ").split(".")[0]}Z
          </p>
        </div>
      </div>
    </Card>
  )
}
