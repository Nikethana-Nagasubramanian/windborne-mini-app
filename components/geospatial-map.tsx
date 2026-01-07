"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GeospatialMapProps {
  selectedBalloon: {
    id: string
    lat: number
    lon: number
    status: string
  }
  onSelectBalloon?: (balloon: {
    id: string
    lat: number
    lon: number
    altitude: number
    temperature: number
    pressure: number
    batteryPercent: number
    status: string
    lastUpdate: string
  }) => void
}

interface TrajectoryPoint {
  timestamp: number // hours from now
  lat: number
  lon: number
}

interface ConfidenceCone {
  center_lat: number
  center_lon: number
  radius_km: number
  angle_deg: number
}

interface BalloonData {
  id: string
  lat: number
  lon: number
  status: "nominal" | "anomalous"
  predicted_trajectory: TrajectoryPoint[]
  confidence_cone: ConfidenceCone
}

// Generate 6-hour predicted trajectory (hourly intervals)
function generateTrajectory(startLat: number, startLon: number, status: "nominal" | "anomalous"): TrajectoryPoint[] {
  const trajectory: TrajectoryPoint[] = []
  const driftLat = status === "anomalous" ? 0.15 : 0.05 // More drift for anomalous
  const driftLon = status === "anomalous" ? 0.2 : 0.08

  for (let hour = 1; hour <= 6; hour++) {
    trajectory.push({
      timestamp: hour,
      lat: startLat + driftLat * hour * (Math.random() > 0.5 ? 1 : -1),
      lon: startLon + driftLon * hour * (Math.random() > 0.5 ? 1 : -1),
    })
  }
  return trajectory
}

// Generate confidence cone data
function generateConfidenceCone(
  currentLat: number,
  currentLon: number,
  trajectory: TrajectoryPoint[]
): ConfidenceCone {
  // Use the 6-hour point as the cone center
  const endPoint = trajectory[trajectory.length - 1]
  const radius_km = 25 + Math.random() * 20 // 25-45 km radius
  const angle_deg = Math.atan2(endPoint.lat - currentLat, endPoint.lon - currentLon) * (180 / Math.PI)

  return {
    center_lat: endPoint.lat,
    center_lon: endPoint.lon,
    radius_km,
    angle_deg,
  }
}

// Simulated balloon cluster positions with trajectories and cones
// All anomalous balloons from the sidebar are included here
export const BALLOON_CLUSTER: BalloonData[] = [
  {
    id: "WB-7284",
    lat: 37.2841,
    lon: -115.8245,
    status: "anomalous",
    predicted_trajectory: generateTrajectory(37.2841, -115.8245, "anomalous"),
    confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 }, // Will be calculated
  },
  {
    id: "WB-3921",
    lat: 42.1547,
    lon: -98.4523,
    status: "anomalous",
    predicted_trajectory: generateTrajectory(42.1547, -98.4523, "anomalous"),
    confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 },
  },
  {
    id: "WB-5103",
    lat: 35.6892,
    lon: -102.3341,
    status: "anomalous",
    predicted_trajectory: generateTrajectory(35.6892, -102.3341, "anomalous"),
    confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 },
  },
  {
    id: "WB-8432",
    lat: 39.7456,
    lon: -104.9923,
    status: "anomalous",
    predicted_trajectory: generateTrajectory(39.7456, -104.9923, "anomalous"),
    confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 },
  },
  {
    id: "WB-2067",
    lat: 41.2534,
    lon: -95.9345,
    status: "anomalous",
    predicted_trajectory: generateTrajectory(41.2534, -95.9345, "anomalous"),
    confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 },
  },
  {
    id: "WB-9154",
    lat: 38.5816,
    lon: -109.5498,
    status: "anomalous",
    predicted_trajectory: generateTrajectory(38.5816, -109.5498, "anomalous"),
    confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 },
  },
  {
    id: "WB-4728",
    lat: 36.7783,
    lon: -119.4179,
    status: "anomalous",
    predicted_trajectory: generateTrajectory(36.7783, -119.4179, "anomalous"),
    confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 },
  },
  { lat: 38.5, lon: -108.2, status: "nominal", id: "WB-1001", predicted_trajectory: [], confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 } },
  { lat: 37.8, lon: -110.5, status: "nominal", id: "WB-1002", predicted_trajectory: [], confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 } },
  { lat: 39.2, lon: -107.8, status: "nominal", id: "WB-1003", predicted_trajectory: [], confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 } },
  { lat: 38.1, lon: -109.4, status: "nominal", id: "WB-1004", predicted_trajectory: [], confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 } },
  { lat: 36.9, lon: -111.3, status: "nominal", id: "WB-1005", predicted_trajectory: [], confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 } },
  { lat: 39.8, lon: -108.9, status: "nominal", id: "WB-1006", predicted_trajectory: [], confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 } },
  { lat: 38.7, lon: -112.1, status: "nominal", id: "WB-1007", predicted_trajectory: [], confidence_cone: { center_lat: 0, center_lon: 0, radius_km: 0, angle_deg: 0 } },
]

// Initialize trajectories and cones
BALLOON_CLUSTER.forEach((balloon) => {
  if (balloon.predicted_trajectory.length === 0) {
    balloon.predicted_trajectory = generateTrajectory(balloon.lat, balloon.lon, balloon.status)
  }
  balloon.confidence_cone = generateConfidenceCone(balloon.lat, balloon.lon, balloon.predicted_trajectory)
})

// Generate SVG path for confidence cone
function generateConePath(
  startLat: number,
  startLon: number,
  cone: ConfidenceCone,
  lonToX: (lon: number) => number,
  latToY: (lat: number) => number
): string {
  const startX = lonToX(startLon)
  const startY = latToY(startLat)
  const centerX = lonToX(cone.center_lon)
  const centerY = latToY(cone.center_lat)

  // Convert radius from km to degrees (approximate)
  const radiusDeg = cone.radius_km / 111
  const radiusX = (radiusDeg * Math.cos((cone.angle_deg * Math.PI) / 180) * 111) / 15
  const radiusY = (radiusDeg * Math.sin((cone.angle_deg * Math.PI) / 180) * 111) / 10

  // Create a cone shape (triangle-like path)
  const angle1 = (cone.angle_deg - 30) * (Math.PI / 180)
  const angle2 = (cone.angle_deg + 30) * (Math.PI / 180)

  const endX1 = centerX + Math.cos(angle1) * radiusX * 2
  const endY1 = centerY - Math.sin(angle1) * radiusY * 2
  const endX2 = centerX + Math.cos(angle2) * radiusX * 2
  const endY2 = centerY - Math.sin(angle2) * radiusY * 2

  return `M ${startX} ${startY} L ${endX1} ${endY1} L ${endX2} ${endY2} Z`
}

// Balloon altitude lookup for anomalous balloons (matching sidebar data)
const ANOMALOUS_BALLOON_DATA: Record<string, { altitude: number }> = {
  "WB-7284": { altitude: 28450 },
  "WB-3921": { altitude: 31200 },
  "WB-5103": { altitude: 29880 },
  "WB-8432": { altitude: 26100 },
  "WB-2067": { altitude: 32450 },
  "WB-9154": { altitude: 30120 },
  "WB-4728": { altitude: 24890 },
}

export function GeospatialMap({ selectedBalloon, onSelectBalloon }: GeospatialMapProps) {
  const [hoveredBalloonId, setHoveredBalloonId] = useState<string | null>(null)
  const width = 600
  const height = 400

  // Simple projection (not geographically accurate, just for visualization)
  const margin = 20
  const lonToX = (lon: number) => margin + ((lon + 125) / 35) * (width - 2 * margin)
  const latToY = (lat: number) => height - margin - ((lat - 32) / 15) * (height - 2 * margin)

  const anomalousBalloons = BALLOON_CLUSTER.filter((b) => b.status === "anomalous")
  const nominalBalloons = BALLOON_CLUSTER.filter((b) => b.status === "nominal")
  const hasSelection = !!(selectedBalloon && selectedBalloon.id)

  // Zoom logic
  let viewBox = `0 0 ${width} ${height}`
  if (hasSelection) {
    const zoomSize = 300 // More zoomed out than before (was 150)
    const centerX = lonToX(selectedBalloon.lon)
    const centerY = latToY(selectedBalloon.lat)
    
    // Clamp coordinates to keep zoom within map bounds
    const x = Math.max(0, Math.min(width - zoomSize, centerX - zoomSize / 2))
    const y = Math.max(0, Math.min(height - zoomSize, centerY - zoomSize / 2))
    viewBox = `${x} ${y} ${zoomSize} ${zoomSize}`
  }

  return (
    <Card className="border-border bg-card p-3 relative overflow-hidden">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Map Detail</h2>
        <Badge variant="outline" className="font-mono text-xs">
          CONUS Region
        </Badge>
      </div>

      <div className="rounded-md bg-slate-900 p-4 relative overflow-hidden">
        <svg width="100%" height="400" viewBox={viewBox} className="overflow-hidden transition-all duration-700 ease-in-out">
          {/* Grid overlay */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100, 116, 139, 0.2)" strokeWidth="0.5" />
            </pattern>
            <clipPath id="map-clip">
              <rect width={width} height={height} />
            </clipPath>
          </defs>
          <rect width={width} height={height} fill="url(#grid)" />

          <g clipPath="url(#map-clip)">
            {/* Confidence cones - render all at 10% opacity, except hovered/selected at 80% */}
            {BALLOON_CLUSTER.map((balloon) => {
              const isActive = hoveredBalloonId === balloon.id || selectedBalloon?.id === balloon.id
              const opacity = isActive ? 0.8 : hasSelection ? 0.06 : 0.1

              return (
                <path
                  key={`cone-${balloon.id}`}
                  d={generateConePath(balloon.lat, balloon.lon, balloon.confidence_cone, lonToX, latToY)}
                  fill="rgb(147, 51, 234)"
                  opacity={opacity}
                  className="transition-opacity duration-300"
                  onMouseEnter={() => setHoveredBalloonId(balloon.id)}
                  onMouseLeave={() => setHoveredBalloonId(null)}
                />
              )
            })}

            {/* Predicted trajectories - 6 hour forecast */}
            {BALLOON_CLUSTER.map((balloon) => {
              if (balloon.predicted_trajectory.length === 0) return null

              const trajectoryPath = [
                `M ${lonToX(balloon.lon)} ${latToY(balloon.lat)}`,
                ...balloon.predicted_trajectory.map((point) => `L ${lonToX(point.lon)} ${latToY(point.lat)}`),
              ].join(" ")

              const isActive = hoveredBalloonId === balloon.id || selectedBalloon?.id === balloon.id
              const trajectoryOpacity = isActive ? 0.9 : hasSelection ? 0.18 : 0.3

              return (
                <path
                  key={`trajectory-${balloon.id}`}
                  d={trajectoryPath}
                  fill="none"
                  stroke={balloon.status === "anomalous" ? "rgb(239, 68, 68)" : "rgb(59, 130, 246)"}
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  opacity={trajectoryOpacity}
                  className="transition-opacity duration-300"
                  onMouseEnter={() => setHoveredBalloonId(balloon.id)}
                  onMouseLeave={() => setHoveredBalloonId(null)}
                />
              )
            })}

            {/* Nominal balloons */}
            {nominalBalloons.map((balloon) => {
              const isSelected = selectedBalloon?.id === balloon.id
              const opacity = isSelected
                ? 1
                : hasSelection
                  ? 0.6
                  : hoveredBalloonId === balloon.id
                    ? 1
                    : 0.6

              return (
              <circle
                  key={balloon.id}
                cx={lonToX(balloon.lon)}
                cy={latToY(balloon.lat)}
                r="4"
                fill="rgb(59, 130, 246)"
                  opacity={opacity}
                  className="transition-opacity duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredBalloonId(balloon.id)}
                onMouseLeave={() => setHoveredBalloonId(null)}
                onClick={() => {
                  if (onSelectBalloon) {
                    onSelectBalloon({
                      id: balloon.id,
                      lat: balloon.lat,
                      lon: balloon.lon,
                      altitude: 25000, // Default altitude for nominal balloons
                      temperature: -45,
                      pressure: 30,
                      batteryPercent: 50,
                      status: "nominal",
                      lastUpdate: new Date().toISOString(),
                    })
                  }
                }}
                />
              )
            })}

            {/* Anomalous balloons with enhanced visibility */}
            {anomalousBalloons.map((balloon) => {
              const isSelected = selectedBalloon?.id === balloon.id
              const isHovered = hoveredBalloonId === balloon.id
              const opacity = isSelected ? 1 : hasSelection ? 0.6 : isHovered ? 1 : 0.6

              return (
                <g key={balloon.id}>
              {/* Anomalous balloon */}
              <circle
                    cx={lonToX(balloon.lon)}
                    cy={latToY(balloon.lat)}
                    r={isSelected || isHovered ? "8" : "6"}
                fill="rgb(239, 68, 68)"
                stroke="rgb(255, 255, 255)"
                    strokeWidth={isSelected || isHovered ? "3" : "2"}
                    opacity={opacity}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredBalloonId(balloon.id)}
                    onMouseLeave={() => setHoveredBalloonId(null)}
                    onClick={() => {
                      if (onSelectBalloon) {
                        const balloonInfo = ANOMALOUS_BALLOON_DATA[balloon.id] || { altitude: 28450 }
                        const balloonData = {
                          id: balloon.id,
                          lat: balloon.lat,
                          lon: balloon.lon,
                          altitude: balloonInfo.altitude,
                          temperature: -52.4,
                          pressure: 28.2,
                          batteryPercent: 34,
                          status: "anomalous" as const,
                          lastUpdate: new Date().toISOString(),
                        }
                        onSelectBalloon(balloonData)
                      }
                    }}
                  />
                  {/* Pulse effect for selected/hovered */}
                  {(isSelected || isHovered) && (
              <circle
                      cx={lonToX(balloon.lon)}
                      cy={latToY(balloon.lat)}
                r="6"
                fill="none"
                stroke="rgb(239, 68, 68)"
                strokeWidth="2"
                opacity="0.5"
              >
                <animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
                  )}
            </g>
              )
            })}
          </g>

          {/* Coordinate labels - dynamic based on projection */}
          <text x="10" y={latToY(45)} className="fill-slate-400 font-mono text-[11px]">
            45°N
          </text>
          <text x="10" y={latToY(35)} className="fill-slate-400 font-mono text-[11px]">
            35°N
          </text>
          <text x={lonToX(-120)} y={height - 5} className="fill-slate-400 font-mono text-[11px]">
            120°W
          </text>
          <text x={lonToX(-105)} y={height - 5} className="fill-slate-400 font-mono text-[11px]">
            105°W
          </text>
          <text x={lonToX(-95)} y={height - 5} className="fill-slate-400 font-mono text-[11px]">
            95°W
          </text>
        </svg>
      </div>

      {/* Map Legend - Moved below map and restyled to 4 columns */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-blue-500" />
            <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Nominal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-red-500" />
            <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Anomalous</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 border-t border-dashed border-red-500" />
            <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Predicted Track</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3.5 rounded-sm bg-purple-500/40" />
            <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Confidence Cone</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
