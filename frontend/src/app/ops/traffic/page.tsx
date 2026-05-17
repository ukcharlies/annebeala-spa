import type { Metadata } from "next";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Traffic Console",
  description: "Private Annebeala Spa traffic analytics console.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrafficConsolePage() {
  return <AnalyticsDashboard />;
}
