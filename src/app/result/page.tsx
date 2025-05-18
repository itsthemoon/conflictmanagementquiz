"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

type StyleKey =
  | "collaborating"
  | "competing"
  | "avoiding"
  | "accommodating"
  | "compromising";

// Main page component
export default function ResultPage() {
  return (
    <Suspense fallback={<ResultPageLoading />}>
      <ResultContent />
    </Suspense>
  );
}

// Loading component while suspense resolves
function ResultPageLoading() {
  return (
    <main className="flex justify-center">
      <div className="container max-w-4xl py-10">
        <Card>
          <CardContent className="p-6 text-center">
            Loading results...
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// Actual content component that uses useSearchParams
function ResultContent() {
  const searchParams = useSearchParams();
  const [chartData, setChartData] = useState<
    Array<{
      subject: string;
      score: number;
      fullMark: number;
    }>
  >([]);
  const [primaryStyle, setPrimaryStyle] = useState<StyleKey | null>(null);

  useEffect(() => {
    // Extract scores from URL params
    const scores: Record<StyleKey, number> = {
      collaborating: parseInt(searchParams.get("collaborating") || "0", 10),
      competing: parseInt(searchParams.get("competing") || "0", 10),
      avoiding: parseInt(searchParams.get("avoiding") || "0", 10),
      accommodating: parseInt(searchParams.get("accommodating") || "0", 10),
      compromising: parseInt(searchParams.get("compromising") || "0", 10),
    };

    // Prepare data for the chart
    const data = [
      {
        subject: "Collaborating",
        score: scores.collaborating,
        fullMark: 12,
      },
      {
        subject: "Competing",
        score: scores.competing,
        fullMark: 12,
      },
      {
        subject: "Avoiding",
        score: scores.avoiding,
        fullMark: 12,
      },
      {
        subject: "Accommodating",
        score: scores.accommodating,
        fullMark: 12,
      },
      {
        subject: "Compromising",
        score: scores.compromising,
        fullMark: 12,
      },
    ];

    setChartData(data);

    // Find primary style
    const sortedStyles = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sortedStyles.length > 0) {
      setPrimaryStyle(sortedStyles[0][0] as StyleKey);
    }
  }, [searchParams]);

  if (!primaryStyle) {
    return (
      <main className="flex justify-center">
        <div className="container max-w-4xl py-10">
          <Card>
            <CardContent className="p-6 text-center">
              Loading results...
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center">
      <div className="container max-w-4xl py-10">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              Your Conflict Management Style Results
            </CardTitle>
            <CardDescription className="text-center">
              Based on your responses, here&apos;s your conflict management
              profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] sm:h-96 w-full">
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
                Conflict Management Styles
              </h2>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="60%"
                  width={500}
                  height={400}
                  data={chartData}
                  margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
                >
                  <PolarGrid gridType="polygon" stroke="#ccc" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={(props) => {
                      const { x, y, textAnchor, payload } = props;

                      // Adjust positions for mobile view
                      let adjustedX = x;
                      let adjustedY = y;

                      // Adjust specific labels that might get cut off
                      if (payload.value === "Collaborating") {
                        adjustedY = y - 10;
                      } else if (payload.value === "Competing") {
                        adjustedX = window.innerWidth < 640 ? x + 10 : x;
                      } else if (payload.value === "Compromising") {
                        adjustedX = window.innerWidth < 640 ? x - 10 : x;
                      }

                      return (
                        <text
                          x={adjustedX}
                          y={adjustedY}
                          textAnchor={textAnchor}
                          fill="#666"
                          fontSize={window.innerWidth < 640 ? 10 : 12}
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                    tickLine={false}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 12]}
                    axisLine={false}
                    tickCount={4}
                    tick={{
                      fill: "#666",
                      fontSize: 11,
                    }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#F97316"
                    fill="#F97316"
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Link href="/" passHref>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Take the Quiz Again
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
