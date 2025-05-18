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
import { useEffect, useState } from "react";

type StyleKey =
  | "collaborating"
  | "competing"
  | "avoiding"
  | "accommodating"
  | "compromising";

type StyleInfo = {
  name: string;
  description: string;
  when_to_use: string;
  when_to_avoid: string;
};

const styleDescriptions: Record<StyleKey, StyleInfo> = {
  collaborating: {
    name: "Collaborating",
    description:
      "You actively seek to find a solution that fully satisfies the concerns of all parties involved. This approach focuses on working together to find a win-win solution.",
    when_to_use:
      "When the relationship and outcome are both important, when you need buy-in from all parties, or when you need to work through hard feelings.",
    when_to_avoid:
      "When time is limited, when the issue is trivial, or when parties are not willing to collaborate.",
  },
  competing: {
    name: "Competing",
    description:
      "You pursue your own concerns at the expense of another. This is a power-oriented approach where you use whatever power seems appropriate to win.",
    when_to_use:
      "When quick, decisive action is vital, on important issues where unpopular actions need implementing, or against people who take advantage of non-competitive behavior.",
    when_to_avoid:
      "When you need to build relationships, when you're outmatched in power, or when the situation requires a collaborative approach.",
  },
  avoiding: {
    name: "Avoiding",
    description:
      "You do not immediately pursue your own concerns or those of the other person. You do not address the conflict. This might take the form of diplomatically sidestepping an issue or withdrawing from a threatening situation.",
    when_to_use:
      "When an issue is trivial, when more important issues are pressing, when you need time to cool down, or when you're in a no-win situation.",
    when_to_avoid:
      "When the issue is important, when it won't go away, or when immediate action is required.",
  },
  accommodating: {
    name: "Accommodating",
    description:
      "You neglect your own concerns to satisfy the concerns of the other person. This approach includes an element of self-sacrifice. It might take the form of selfless generosity or charity, obeying another person's order when you would prefer not to, or yielding to another's point of view.",
    when_to_use:
      "When you realize you are wrong, when the issue is more important to others, when you want to build social credits for later issues, or when preserving harmony is especially important.",
    when_to_avoid:
      "When you will feel resentful, when safety is at stake, or when it enables bad behavior from the other person.",
  },
  compromising: {
    name: "Compromising",
    description:
      "You find an expedient, mutually acceptable solution that partially satisfies both parties. It falls between competing and accommodating. Compromising gives up more than competing but less than accommodating.",
    when_to_use:
      "When goals are important but not worth the effort or potential disruption of more assertive approaches, when opponents with equal power are committed to mutually exclusive goals, or to achieve temporary settlements to complex issues.",
    when_to_avoid:
      "When more thorough problem-solving is needed for important issues, or when one party has significantly more power.",
  },
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [chartData, setChartData] = useState<
    Array<{
      subject: string;
      score: number;
      fullMark: number;
    }>
  >([]);
  const [primaryStyle, setPrimaryStyle] = useState<StyleKey | null>(null);

  // We're keeping this variable but commenting out the state setter since it's not used
  // const [secondaryStyle, setSecondaryStyle] = useState<StyleKey | null>(null);

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

    // Find primary and secondary styles
    const sortedStyles = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sortedStyles.length > 0) {
      setPrimaryStyle(sortedStyles[0][0] as StyleKey);
    }
    // Commenting out since this is not used
    // if (sortedStyles.length > 1) {
    //   setSecondaryStyle(sortedStyles[1][0] as StyleKey);
    // }
  }, [searchParams]);

  // Commenting out since this function is not used
  // const getColorForStyle = (style: StyleKey): string => {
  //   const colors = {
  //     collaborating: "#F97316", // orange
  //     competing: "#F97316", // orange
  //     avoiding: "#F97316", // orange
  //     accommodating: "#F97316", // orange
  //     compromising: "#F97316", // orange
  //   };
  //   return colors[style];
  // };

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
            <div className="h-96 w-full">
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
                Conflict Management Styles
              </h2>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="65%"
                  width={500}
                  height={400}
                  data={chartData}
                >
                  <PolarGrid gridType="polygon" stroke="#ccc" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={(props) => {
                      const { x, y, textAnchor, payload } = props;

                      // Only adjust the Collaborating label
                      let adjustedY = y;
                      if (payload.value === "Collaborating") {
                        adjustedY = y - 10; // Move up by 10 pixels
                      }

                      return (
                        <text
                          x={x}
                          y={adjustedY}
                          textAnchor={textAnchor}
                          fill="#666"
                          fontSize={12}
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Your Primary Style: {styleDescriptions[primaryStyle].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Description</h3>
              <p>{styleDescriptions[primaryStyle].description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">When to Use</h3>
              <p>{styleDescriptions[primaryStyle].when_to_use}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">When to Avoid</h3>
              <p>{styleDescriptions[primaryStyle].when_to_avoid}</p>
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
