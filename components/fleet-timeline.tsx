import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

const RECENT_EVENTS = [
  { time: "14:32:18", event: "WB-7284 rapid descent detected", severity: "critical" },
  { time: "14:28:43", event: "WB-3921 sensor malfunction", severity: "critical" },
  { time: "14:21:05", event: "Fleet altitude: nominal", severity: "info" },
  { time: "14:15:22", event: "WB-5103 signal intermittent", severity: "warning" },
  { time: "14:08:14", event: "Routine data sync completed", severity: "info" },
]

export function FleetTimeline() {
  return (
    <Card className="border-border bg-card p-3">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
        <Clock className="size-3.5 text-muted-foreground" />
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Event Log</h2>
      </div>
      <div className="space-y-2">
        {RECENT_EVENTS.map((event, i) => (
          <div key={i} className="border-l-2 border-border pl-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-muted-foreground">{event.time}</span>
              <span
                className={`size-1.5 rounded-full ${
                  event.severity === "critical"
                    ? "bg-critical"
                    : event.severity === "warning"
                      ? "bg-warning"
                      : "bg-success"
                }`}
              />
            </div>
            <p className="mt-0.5 text-xs text-foreground">{event.event}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
