import { Card } from "@/components/ui/card"
import { Activity, AlertTriangle, Battery } from "lucide-react"

const FLEET_STATS = [
  {
    label: "Total Active",
    value: "9,847",
    subtext: "98.5% nominal",
    icon: Activity,
    color: "text-success",
  },
  {
    label: "Off-Course",
    value: "127",
    subtext: "1.3% deviation",
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    label: "Low Battery",
    value: "89",
    subtext: "<30% charge",
    icon: Battery,
    color: "text-critical",
  },
]

export function FleetHealthOverview() {
  return (
    <Card className="border-border bg-card p-3">
      <div className="mb-3 border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fleet Health</h2>
      </div>
      <div className="space-y-3">
        {FLEET_STATS.map((stat) => (
          <div key={stat.label} className="flex items-start gap-3">
            <div className="mt-0.5">
              <stat.icon className={`size-4 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <span className={`font-mono text-lg font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
