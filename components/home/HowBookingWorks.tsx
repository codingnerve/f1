import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Choose your race",
    body: "Browse the 2026 calendar and pick the Grand Prix weekend you want to experience.",
  },
  {
    title: "Find your view",
    body: "Pick a session, compare grandstands, general admission and hospitality, and see each on the circuit map.",
  },
  {
    title: "Call our booking team",
    body: "Tell us the race, session, seating and group size you have in mind. We talk you through the options.",
  },
  {
    title: "We confirm with you",
    body: "We confirm availability and final pricing on the call. Nothing is booked until you agree.",
  },
];

export function HowBookingWorks({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <ol className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-4", light ? "bg-white/10" : "bg-line")}>
      {steps.map((step, i) => (
        <li key={step.title} className={cn("relative p-6 sm:p-8", light ? "bg-obsidian" : "bg-white")}>
          <span className="font-display text-6xl leading-none font-bold text-racing tabular-nums" aria-hidden="true">
            0{i + 1}
          </span>
          <h3 className={cn("mt-5 text-lg font-semibold", light ? "text-white" : "text-obsidian")}>
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className={cn("mt-2 text-sm leading-relaxed", light ? "text-white/65" : "text-ink-muted")}>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
