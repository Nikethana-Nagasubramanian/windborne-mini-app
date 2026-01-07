"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, TrendingDown, Wifi, Navigation } from "lucide-react"

// Helper function to calculate Euclidean distance in km
function calculateSpatialDivergence(
  actual: { lat: number; lon: number },
  predicted: { lat: number; lon: number }
): number {
  const latDiff = actual.lat - predicted.lat
  const lonDiff = actual.lon - predicted.lon
  // Convert degrees to km (approximately 111 km per degree)
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111
}

// Helper function to calculate deviation percentage
function calculateDeviationPercentage(divergence: number, uncertainty: number): number {
  return (divergence / uncertainty) * 100
}

interface BalloonAnomaly {
  id: string
  actual_position: { lat: number; lon: number }
  predicted_trajectory_point: { lat: number; lon: number }
  path_uncertainty: number // in km
  altitude: number
  lat: number
  lon: number
  icon: typeof AlertTriangle
}

const CRITICAL_BALLOONS: BalloonAnomaly[] = [
  {
    id: "WB-7284",
    actual_position: { lat: 37.2841, lon: -115.8245 },
    predicted_trajectory_point: { lat: 37.1523, lon: -115.7123 },
    path_uncertainty: 45.2,
    altitude: 28450,
    lat: 37.2841,
    lon: -115.8245,
    icon: TrendingDown,
  },
  {
    id: "WB-3921",
    actual_position: { lat: 42.1547, lon: -98.4523 },
    predicted_trajectory_point: { lat: 42.0891, lon: -98.3892 },
    path_uncertainty: 38.7,
    altitude: 31200,
    lat: 42.1547,
    lon: -98.4523,
    icon: AlertTriangle,
  },
  {
    id: "WB-5103",
    actual_position: { lat: 35.6892, lon: -102.3341 },
    predicted_trajectory_point: { lat: 35.7123, lon: -102.2987 },
    path_uncertainty: 52.1,
    altitude: 29880,
    lat: 35.6892,
    lon: -102.3341,
    icon: Wifi,
  },
  {
    id: "WB-8432",
    actual_position: { lat: 39.7456, lon: -104.9923 },
    predicted_trajectory_point: { lat: 39.6234, lon: -104.9123 },
    path_uncertainty: 41.8,
    altitude: 26100,
    lat: 39.7456,
    lon: -104.9923,
    icon: TrendingDown,
  },
  {
    id: "WB-2067",
    actual_position: { lat: 41.2534, lon: -95.9345 },
    predicted_trajectory_point: { lat: 41.2345, lon: -95.9012 },
    path_uncertainty: 48.3,
    altitude: 32450,
    lat: 41.2534,
    lon: -95.9345,
    icon: AlertTriangle,
  },
  {
    id: "WB-9154",
    actual_position: { lat: 38.5816, lon: -109.5498 },
    predicted_trajectory_point: { lat: 38.5123, lon: -109.4891 },
    path_uncertainty: 43.6,
    altitude: 30120,
    lat: 38.5816,
    lon: -109.5498,
    icon: Wifi,
  },
  {
    id: "WB-4728",
    actual_position: { lat: 36.7783, lon: -119.4179 },
    predicted_trajectory_point: { lat: 36.6456, lon: -119.3234 },
    path_uncertainty: 39.4,
    altitude: 24890,
    lat: 36.7783,
    lon: -119.4179,
    icon: TrendingDown,
  },
]

interface ExceptionListProps {
  onSelectBalloon: (balloon: any) => void
  selectedBalloonId?: string
}

export function ExceptionList({ onSelectBalloon, selectedBalloonId }: ExceptionListProps) {
  return (
    <Card className="border-border bg-card p-3">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Anomalies</h2>
        <Badge variant="destructive" className="font-mono text-xs">
          {CRITICAL_BALLOONS.length}
        </Badge>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-2">
          {CRITICAL_BALLOONS.map((balloon) => {
            const spatialDivergence = calculateSpatialDivergence(
              balloon.actual_position,
              balloon.predicted_trajectory_point
            )
            const deviationPercentage = calculateDeviationPercentage(
              spatialDivergence,
              balloon.path_uncertainty
            )
            const isHighDeviation = deviationPercentage > 15
            const isSelected = selectedBalloonId === balloon.id

            return (
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
                className={`w-full rounded-md p-2 text-left transition-all ${
                  isSelected
                    ? "border-[3px] border-critical bg-critical/10 ring-2 ring-critical/20 opacity-100"
                    : isHighDeviation
                      ? "border border-critical bg-critical/5 hover:bg-critical/10 opacity-60"
                      : "border border-border bg-card hover:bg-accent opacity-60"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Navigation className="mt-1 size-3.5 text-critical" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold text-foreground">{balloon.id}</span>
                      {isHighDeviation && (
                        <Badge variant="destructive" className="font-mono text-xs">
                          HIGH DEVIATION
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        Spatial Path Divergence:
                      </span>
                      <span
                        className={`font-mono text-sm font-bold ${
                          isHighDeviation ? "text-critical" : "text-warning"
                        }`}
                      >
                        {spatialDivergence.toFixed(1)} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-muted-foreground">
                        Deviation: {deviationPercentage.toFixed(1)}%
                      </span>
                      <span className="font-mono text-muted-foreground">
                        Uncertainty: {balloon.path_uncertainty.toFixed(1)} km
                      </span>
                    </div>
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
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}
