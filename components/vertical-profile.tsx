"use client"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"

interface VerticalProfileProps {
  balloonId: string
}

interface SoundingDataPoint {
  altitude: number
  temperature: number
  pressure: number
  humidity: number
  isa_temperature: number // Standard Reference Atmosphere
}

// Generate Standard Reference Atmosphere (ISA) temperature
function generateISATemperature(altitude: number): number {
  // ISA model: 15°C at sea level, -6.5°C per 1000m up to tropopause (11km)
  const tropopauseAltitude = 11000
  if (altitude <= tropopauseAltitude) {
    return 15 - (altitude / 1000) * 6.5
  } else {
    // Above tropopause: constant -56.5°C
    return -56.5
  }
}

// Simulated atmospheric sounding data with humidity
const SOUNDING_DATA: SoundingDataPoint[] = [
  { altitude: 0, temperature: 15, pressure: 1013, humidity: 85, isa_temperature: 15 },
  { altitude: 5000, temperature: -5, pressure: 540, humidity: 72, isa_temperature: -17.5 },
  { altitude: 10000, temperature: -25, pressure: 265, humidity: 58, isa_temperature: -50 },
  { altitude: 15000, temperature: -45, pressure: 121, humidity: 42, isa_temperature: -82.5 },
  { altitude: 20000, temperature: -56, pressure: 55, humidity: 28, isa_temperature: -56.5 },
  { altitude: 25000, temperature: -52, pressure: 25, humidity: 18, isa_temperature: -56.5 },
  { altitude: 28450, temperature: -48, pressure: 15, humidity: 12, isa_temperature: -56.5 },
  { altitude: 30000, temperature: -46, pressure: 12, humidity: 10, isa_temperature: -56.5 },
]

// Generate ISA data for all altitudes
const SOUNDING_DATA_WITH_ISA = SOUNDING_DATA.map((point) => {
  const isa = generateISATemperature(point.altitude)
  return {
    ...point,
    isa_temperature: isa,
    // Range for the shaded area [min, max]
    temperature_range: [isa, point.temperature],
    // Deviation for coloring (actual - isa)
    deviation: point.temperature - isa,
  }
})

// Custom tooltip component that shows all three variables
interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: number
  altitude?: number
}

function CustomTooltip({ active, altitude }: CustomTooltipProps) {
  if (!active || altitude === undefined) {
    return null
  }

  // Find the data point closest to the hovered altitude
  const closestPoint = SOUNDING_DATA_WITH_ISA.reduce((prev, curr) =>
    Math.abs(curr.altitude - altitude) < Math.abs(prev.altitude - altitude) ? curr : prev
  )

  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 font-mono text-xs font-semibold text-foreground">Altitude: {altitude.toLocaleString()} m</p>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Temperature:</span>
          <span className="font-mono font-semibold text-foreground">{closestPoint.temperature.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Pressure:</span>
          <span className="font-mono font-semibold text-foreground">{closestPoint.pressure.toFixed(1)} hPa</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Humidity:</span>
          <span className="font-mono font-semibold text-foreground">{closestPoint.humidity.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}

export function VerticalProfile({ balloonId }: VerticalProfileProps) {
  const [hoveredAltitude, setHoveredAltitude] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

  // Handle mouse move over the chart to show tooltip at Y-axis position
  const handleMouseMove = useCallback((e: any) => {
    if (!e || !e.activeCoordinate) return

    // Get the Y coordinate from Recharts
    const y = e.activeCoordinate.y
    const x = e.activeCoordinate.x

    // Recharts Y-axis is inverted (top is higher altitude in our case)
    // Calculate altitude from Y position using Recharts' coordinate system
    const chartHeight = 280 - 40 - 30 // total height - top margin - bottom margin
    const topMargin = 10
    const relativeY = y - topMargin
    const maxAltitude = 35000

    // Calculate altitude (Y=0 is at bottom, higher Y is higher altitude)
    const altitude = (relativeY / chartHeight) * maxAltitude

    if (altitude >= 0 && altitude <= maxAltitude) {
      setHoveredAltitude(altitude)
      setMousePosition({ x: x + 20, y: y })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredAltitude(null)
    setMousePosition(null)
  }, [])

  return (
    <Card className="border-border bg-card p-3 relative">
      <div className="absolute right-3 top-3">
        <Badge variant="outline" className="font-mono text-[10px] tracking-tighter">
          {balloonId}
        </Badge>
      </div>
      <div className="mb-2 border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vertical Profile</h2>
        <p className="font-mono text-xs text-muted-foreground">{balloonId}</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={SOUNDING_DATA_WITH_ISA}
            margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="temperature"
              domain={[-60, 20]}
              ticks={[-60, -40, -20, 0, 20]}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "10px", fontFamily: "var(--font-mono)" }}
              label={{
                value: "TEMPERATURE (°C)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: "600" },
              }}
            />
            <YAxis
              type="number"
              dataKey="altitude"
              domain={[0, 35000]}
              ticks={[0, 10000, 20000, 30000]}
              tickFormatter={(value) => `${value / 1000}k`}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "10px", fontFamily: "var(--font-mono)" }}
              label={{
                value: "ALTITUDE (m)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: "600" },
              }}
            />
            <Tooltip
              content={<CustomTooltip altitude={hoveredAltitude ?? undefined} active={hoveredAltitude !== null} />}
              cursor={false}
              active={hoveredAltitude !== null}
              position={mousePosition ? { x: mousePosition.x, y: mousePosition.y } : undefined}
            />
            {/* Reference line showing hovered altitude */}
            {hoveredAltitude !== null && (
              <ReferenceLine
                y={hoveredAltitude}
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                opacity={0.7}
              />
            )}
            {/* Reference lines for altitude markers */}
            {[10000, 20000, 30000].map((alt) => (
              <ReferenceLine
                key={alt}
                y={alt}
                stroke="hsl(var(--border))"
                strokeDasharray="2 2"
                opacity={0.5}
              />
            ))}
            
            {/* Anomaly shading - Area between ISA and Actual */}
            <Area
              type="monotone"
              dataKey="temperature_range"
              stroke="none"
              fill="hsl(var(--critical))"
              fillOpacity={0.15}
              connectNulls
            />

            {/* International Standard Atmosphere (ISA) line - dashed light-gray */}
            <Line
              type="monotone"
              dataKey="isa_temperature"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="International Standard Atmosphere"
            />
            {/* Actual temperature profile */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              dot={false}
              name="Observed Temperature"
            />
            {/* Current balloon position marker */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="none"
              dot={{
                fill: "hsl(var(--critical))",
                stroke: "hsl(var(--card))",
                strokeWidth: 2,
                r: 5,
              }}
              activeDot={{
                r: 7,
                fill: "hsl(var(--critical))",
                stroke: "hsl(var(--card))",
                strokeWidth: 2,
              }}
              data={SOUNDING_DATA_WITH_ISA.filter((d) => d.altitude === 28450)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
