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
  pressure: number // hPa
  temperature: number // °C
  isa_temperature: number // °C
  specific_humidity: number // g/kg
  wind_speed: number // knots/ms
  wind_u: number
  wind_v: number
  geopotential: number // gpm
}

// standard pressure levels from schema
const PRESSURE_LEVELS = [
  10, 30, 50, 70, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 925, 950, 975, 1000
]

// Generate Standard Reference Atmosphere (ISA) temperature based on pressure altitude
function getISATempByPressure(pressure: number): number {
  // Rough approximation of ISA based on pressure levels
  if (pressure >= 226.32) { // Troposphere
    return 15 - 6.5 * (44.3308 * (1 - Math.pow(pressure / 1013.25, 0.190263)))
  } else { // Lower Stratosphere
    return -56.5
  }
}

// Generate geopotential height (rough approximation) from pressure
function getGeopotentialByPressure(pressure: number): number {
  return 44330.8 * (1 - Math.pow(pressure / 1013.25, 0.190263))
}

// Simulated scientific atmospheric sounding data
const SOUNDING_DATA: SoundingDataPoint[] = PRESSURE_LEVELS.map(p => {
  const isa = getISATempByPressure(p)
  // Add some realistic variation for the "actual" profile
  const variation = (Math.sin(p / 100) * 5) + (Math.random() * 2 - 1)
  const temperature = isa + variation
  
  // Simulated humidity (decreases with height generally)
  const specific_humidity = Math.max(0.1, (p / 1000) * 10 * Math.random())
  
  // Simulated wind components
  const wind_u = (Math.random() * 20) + (1000 - p) / 20
  const wind_v = (Math.random() * 10) - 5
  const wind_speed = Math.sqrt(wind_u * wind_u + wind_v * wind_v)

  return {
    pressure: p,
    temperature,
    isa_temperature: isa,
    specific_humidity,
    wind_u,
    wind_v,
    wind_speed,
    geopotential: getGeopotentialByPressure(p)
  }
}).sort((a, b) => b.pressure - a.pressure) // Sort for display (1000 at bottom)

// Generate data for visualization
const SOUNDING_DATA_FOR_CHART = SOUNDING_DATA.map((point) => ({
  ...point,
  // Range for the shaded area [min, max]
  temperature_range: [point.isa_temperature, point.temperature],
  // Deviation for coloring (actual - isa)
  deviation: point.temperature - point.isa_temperature,
}))

// Custom tooltip component that shows all three variables
interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: number
  pressure?: number
}

function CustomTooltip({ active, pressure }: CustomTooltipProps) {
  if (!active || pressure === undefined) {
    return null
  }

  // Find the data point closest to the hovered pressure
  const closestPoint = SOUNDING_DATA_FOR_CHART.reduce((prev, curr) =>
    Math.abs(curr.pressure - pressure) < Math.abs(prev.pressure - pressure) ? curr : prev
  )

  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 font-mono text-xs font-semibold text-foreground">Pressure: {closestPoint.pressure} hPa</p>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Temperature:</span>
          <span className="font-mono font-semibold text-foreground">{closestPoint.temperature.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">ISA Ref:</span>
          <span className="font-mono font-semibold text-muted-foreground">{closestPoint.isa_temperature.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Signal (Anomaly):</span>
          <span className={`font-mono font-semibold ${closestPoint.deviation > 0 ? 'text-critical' : 'text-primary'}`}>
            {(closestPoint.deviation > 0 ? '+' : '')}{closestPoint.deviation.toFixed(1)}°C
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border mt-1 pt-1">
          <span className="text-muted-foreground">Altitude (approx):</span>
          <span className="font-mono font-semibold text-foreground">{closestPoint.geopotential.toLocaleString()} m</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Wind:</span>
          <span className="font-mono font-semibold text-foreground">{closestPoint.wind_speed.toFixed(1)} kn</span>
        </div>
      </div>
    </div>
  )
}

export function VerticalProfile({ balloonId }: VerticalProfileProps) {
  const [hoveredPressure, setHoveredPressure] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

  // Handle mouse move over the chart to show tooltip at Y-axis position
  const handleMouseMove = useCallback((e: any) => {
    if (!e || !e.activeCoordinate) return

    const y = e.activeCoordinate.y
    const x = e.activeCoordinate.x

    // Calculate pressure from Y position
    const chartHeight = 280 - 40 - 30 
    const topMargin = 10
    const relativeY = y - topMargin
    
    // Inverted axis: top is 10, bottom is 1000
    const pressure = 10 + (relativeY / chartHeight) * (1000 - 10)

    if (pressure >= 10 && pressure <= 1000) {
      setHoveredPressure(pressure)
      setMousePosition({ x: x + 20, y: y })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredPressure(null)
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
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scientific Vertical Profile</h2>
        <p className="font-mono text-[10px] text-muted-foreground">Pressure-Level Anomaly Shading</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={SOUNDING_DATA_FOR_CHART}
            margin={{ top: 10, right: 10, bottom: 30, left: 35 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="temperature"
              domain={[-80, 30]}
              ticks={[-80, -60, -40, -20, 0, 20]}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "9px", fontFamily: "var(--font-mono)" }}
              label={{
                value: "TEMP (°C)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "600" },
              }}
            />
            <YAxis
              type="number"
              dataKey="pressure"
              domain={[10, 1000]}
              reversed
              ticks={[10, 100, 250, 500, 700, 850, 1000]}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "9px", fontFamily: "var(--font-mono)" }}
              label={{
                value: "PRESSURE (hPa)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                style: { fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "600" },
              }}
            />
            <Tooltip
              content={<CustomTooltip pressure={hoveredPressure ?? undefined} active={hoveredPressure !== null} />}
              cursor={false}
              active={hoveredPressure !== null}
              position={mousePosition ? { x: mousePosition.x, y: mousePosition.y } : undefined}
            />
            
            {/* Reference lines for standard pressure levels */}
            {[250, 500, 850].map((p) => (
              <ReferenceLine
                key={p}
                y={p}
                stroke="hsl(var(--border))"
                strokeDasharray="2 2"
                opacity={0.5}
              />
            ))}
            
            {/* Anomaly shading - "The Signal" */}
            <Area
              type="monotone"
              dataKey="temperature_range"
              stroke="none"
              fill="hsl(var(--critical))"
              fillOpacity={0.2}
              connectNulls
            />

            {/* ISA Ref line */}
            <Line
              type="monotone"
              dataKey="isa_temperature"
              stroke="#9ca3af"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              name="ISA"
            />
            
            {/* Observed Temperature */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 1 }}
              name="Observed"
            />

            {/* Humidity Line - secondary subtle indicator */}
            <Line
              type="monotone"
              dataKey="specific_humidity"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              strokeOpacity={0.4}
              dot={false}
              name="Humidity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
