"use client"

import { Card } from "@/components/ui/card"

interface VerticalProfileProps {
  balloonId: string
}

// Simulated atmospheric sounding data (altitude vs temperature/pressure)
const SOUNDING_DATA = [
  { altitude: 0, temperature: 15, pressure: 1013 },
  { altitude: 5000, temperature: -5, pressure: 540 },
  { altitude: 10000, temperature: -25, pressure: 265 },
  { altitude: 15000, temperature: -45, pressure: 121 },
  { altitude: 20000, temperature: -56, pressure: 55 },
  { altitude: 25000, temperature: -52, pressure: 25 },
  { altitude: 28450, temperature: -48, pressure: 15 },
  { altitude: 30000, temperature: -46, pressure: 12 },
]

export function VerticalProfile({ balloonId }: VerticalProfileProps) {
  const width = 280
  const height = 280
  const padding = 40

  // Scale functions
  const maxAltitude = 35000
  const minTemp = -60
  const maxTemp = 20

  const getX = (temp: number) => {
    return padding + ((temp - minTemp) / (maxTemp - minTemp)) * (width - 2 * padding)
  }

  const getY = (altitude: number) => {
    return height - padding - (altitude / maxAltitude) * (height - 2 * padding)
  }

  // Create path for temperature profile
  const tempPath = SOUNDING_DATA.map((d, i) => {
    const x = getX(d.temperature)
    const y = getY(d.altitude)
    return `${i === 0 ? "M" : "L"} ${x} ${y}`
  }).join(" ")

  return (
    <Card className="border-border bg-card p-3">
      <div className="mb-2 border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vertical Profile</h2>
        <p className="font-mono text-xs text-muted-foreground">{balloonId}</p>
      </div>
      <svg width="100%" height="280" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {[0, 10000, 20000, 30000].map((alt) => (
          <line
            key={alt}
            x1={padding}
            y1={getY(alt)}
            x2={width - padding}
            y2={getY(alt)}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}

        {/* Temperature axis lines */}
        {[-60, -40, -20, 0, 20].map((temp) => (
          <line
            key={temp}
            x1={getX(temp)}
            y1={padding}
            x2={getX(temp)}
            y2={height - padding}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}

        {/* Temperature profile line */}
        <path d={tempPath} fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2.5" />

        {/* Current balloon position */}
        <circle
          cx={getX(-48)}
          cy={getY(28450)}
          r="5"
          fill="hsl(var(--critical))"
          stroke="hsl(var(--card))"
          strokeWidth="2"
        />

        {/* Y-axis labels (altitude) */}
        {[0, 10, 20, 30].map((alt) => (
          <text
            key={alt}
            x={padding - 8}
            y={getY(alt * 1000) + 4}
            textAnchor="end"
            className="fill-muted-foreground font-mono text-[10px]"
          >
            {alt}k
          </text>
        ))}

        {/* X-axis labels (temperature) */}
        {[-60, -40, -20, 0, 20].map((temp) => (
          <text
            key={temp}
            x={getX(temp)}
            y={height - padding + 16}
            textAnchor="middle"
            className="fill-muted-foreground font-mono text-[10px]"
          >
            {temp}°
          </text>
        ))}

        {/* Axis titles */}
        <text
          x={padding - 28}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90 ${padding - 28} ${height / 2})`}
          className="fill-foreground font-mono text-[11px] font-semibold"
        >
          ALTITUDE (m)
        </text>
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          className="fill-foreground font-mono text-[11px] font-semibold"
        >
          TEMPERATURE (°C)
        </text>
      </svg>
    </Card>
  )
}
