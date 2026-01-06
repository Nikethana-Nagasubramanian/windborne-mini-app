"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GeospatialMapProps {
  selectedBalloon: {
    id: string
    lat: number
    lon: number
    status: string
  }
}

// Simulated balloon cluster positions
const BALLOON_CLUSTER = [
  { lat: 38.5, lon: -108.2, status: "nominal" },
  { lat: 37.8, lon: -110.5, status: "nominal" },
  { lat: 39.2, lon: -107.8, status: "nominal" },
  { lat: 38.1, lon: -109.4, status: "nominal" },
  { lat: 37.2, lon: -115.8, status: "anomalous" }, // Selected balloon
  { lat: 36.9, lon: -111.3, status: "nominal" },
  { lat: 39.8, lon: -108.9, status: "nominal" },
  { lat: 38.7, lon: -112.1, status: "nominal" },
]

export function GeospatialMap({ selectedBalloon }: GeospatialMapProps) {
  const width = 600
  const height = 400

  // Simple projection (not geographically accurate, just for visualization)
  const lonToX = (lon: number) => ((lon + 120) / 15) * width
  const latToY = (lat: number) => height - ((lat - 35) / 10) * height

  return (
    <Card className="border-border bg-card p-3">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Geospatial Overview</h2>
        <Badge variant="outline" className="font-mono text-xs">
          CONUS Region
        </Badge>
      </div>
      <div className="rounded-md bg-slate-900 p-4">
        <svg width="100%" height="400" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid overlay */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100, 116, 139, 0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid)" />

          {/* Nominal balloons */}
          {BALLOON_CLUSTER.filter((b) => b.status === "nominal").map((balloon, i) => (
            <circle
              key={i}
              cx={lonToX(balloon.lon)}
              cy={latToY(balloon.lat)}
              r="4"
              fill="rgb(59, 130, 246)"
              opacity="0.6"
            />
          ))}

          {/* Anomalous balloon with trajectory */}
          <g>
            {/* Flight path */}
            <path
              d={`M ${lonToX(-105)} ${latToY(40)} Q ${lonToX(-110)} ${latToY(38)}, ${lonToX(-115.8)} ${latToY(37.2)}`}
              fill="none"
              stroke="rgb(239, 68, 68)"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.8"
            />
            {/* Anomalous balloon */}
            <circle
              cx={lonToX(selectedBalloon.lon)}
              cy={latToY(selectedBalloon.lat)}
              r="6"
              fill="rgb(239, 68, 68)"
              stroke="rgb(255, 255, 255)"
              strokeWidth="2"
            />
            {/* Pulse effect */}
            <circle
              cx={lonToX(selectedBalloon.lon)}
              cy={latToY(selectedBalloon.lat)}
              r="6"
              fill="none"
              stroke="rgb(239, 68, 68)"
              strokeWidth="2"
              opacity="0.5"
            >
              <animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Coordinate labels */}
          <text x="10" y="20" className="fill-slate-400 font-mono text-[11px]">
            45°N
          </text>
          <text x="10" y={height - 10} className="fill-slate-400 font-mono text-[11px]">
            35°N
          </text>
          <text x={width - 50} y={height - 10} className="fill-slate-400 font-mono text-[11px]">
            105°W
          </text>
        </svg>
      </div>
    </Card>
  )
}
