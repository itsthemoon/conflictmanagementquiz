"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Shuffle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type StyleKey =
  | "collaborating"
  | "competing"
  | "avoiding"
  | "accommodating"
  | "compromising";

interface Question {
  id: number;
  text: string;
  style: StyleKey;
}

const questions: Question[] = [
  {
    id: 1,
    text: "I discuss issues with others to try to find solutions that meet everyone's needs.",
    style: "collaborating",
  },
  {
    id: 2,
    text: "I try to negotiate and use a give-and-take approach to problem situations.",
    style: "compromising",
  },
  {
    id: 3,
    text: "I try to meet the expectations of others.",
    style: "accommodating",
  },
  {
    id: 4,
    text: "I would argue my case and insist on the advantages of my point of view.",
    style: "competing",
  },
  {
    id: 5,
    text: "When there is a disagreement, I gather as much information as I can and keep the lines of communication open.",
    style: "collaborating",
  },
  {
    id: 6,
    text: "When I find myself in an argument, I usually say very little and try to leave as soon as possible.",
    style: "avoiding",
  },
  {
    id: 7,
    text: "I try to see conflicts from both sides. What do I need? What does the other person need? What are the issues involved?",
    style: "collaborating",
  },
  {
    id: 8,
    text: "I prefer to compromise when solving problems and just move on.",
    style: "compromising",
  },
  {
    id: 9,
    text: "I find conflicts exhilarating; I enjoy the battle of wits that usually follows.",
    style: "competing",
  },
  {
    id: 10,
    text: "Being in a disagreement with other people makes me feel uncomfortable and anxious.",
    style: "avoiding",
  },
  {
    id: 11,
    text: "I try to meet the wishes of my friends and family.",
    style: "accommodating",
  },
  {
    id: 12,
    text: "I can figure out what needs to be done and I am usually right.",
    style: "competing",
  },
  {
    id: 13,
    text: "To break deadlocks, I would meet people halfway.",
    style: "compromising",
  },
  {
    id: 14,
    text: "I may not get what I want but it's a small price to pay for keeping the peace.",
    style: "accommodating",
  },
  {
    id: 15,
    text: "I avoid hard feelings by keeping my disagreements with others to myself.",
    style: "avoiding",
  },
];

// Create a dynamic zod schema based on question IDs
const createFormSchema = () => {
  const schemaFields: Record<string, z.ZodType<string>> = {};

  questions.forEach((q) => {
    schemaFields[`q${q.id}`] = z.string().min(1, "Please answer this question");
  });

  return z.object(schemaFields);
};

const formSchema = createFormSchema();

export default function IndexPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: questions.reduce((acc, q) => {
      acc[`q${q.id}`] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  // Watch all fields to calculate progress
  const values = form.watch();

  // Update progress when form values change
  useEffect(() => {
    // Calculate completion percentage inside useEffect
    const calculateProgress = () => {
      const answeredCount = Object.values(values).filter(Boolean).length;
      return (answeredCount / questions.length) * 100;
    };

    setProgress(calculateProgress());
  }, [values]);

  function randomizeAnswers() {
    const randomValues: Record<string, string> = {};
    questions.forEach((q) => {
      randomValues[`q${q.id}`] = Math.floor(Math.random() * 4 + 1).toString();
    });
    form.reset(randomValues);
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    // tally totals
    const totals: Record<StyleKey, number> = {
      collaborating: 0,
      competing: 0,
      avoiding: 0,
      accommodating: 0,
      compromising: 0,
    };

    questions.forEach((q) => {
      totals[q.style] += parseInt(data[`q${q.id}`], 10);
    });

    // Create URL search params
    const params = new URLSearchParams();
    Object.entries(totals).forEach(([key, value]) => {
      params.set(key, value.toString());
    });

    // Navigate to results page
    router.push(`/result?${params.toString()}`);
  }

  return (
    <main className="grid place-items-center min-h-screen py-10">
      <div className="w-full max-w-3xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Conflict Management Styles Quiz</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-6 space-y-2">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground text-right">
                {Object.values(values).filter(Boolean).length} of{" "}
                {questions.length} questions answered
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {questions.map((q) => (
                  <div key={q.id} className="p-4 border rounded-lg">
                    <FormField
                      control={form.control}
                      name={`q${q.id}`}
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-base leading-relaxed">
                            {q.id}. {q.text}
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-5">
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3"
                              >
                                {[
                                  { value: "1", label: "Rarely" },
                                  { value: "2", label: "Sometimes" },
                                  { value: "3", label: "Often" },
                                  { value: "4", label: "Always" },
                                ].map((option) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={option.value}
                                      id={`q${q.id}-${option.value}`}
                                    />
                                    <Label htmlFor={`q${q.id}-${option.value}`}>
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <div className="flex justify-between gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    onClick={randomizeAnswers}
                    variant="outline"
                    className="w-1/2"
                  >
                    <Shuffle className="mr-2 h-4 w-4" />
                    Randomize
                  </Button>
                  <Button type="submit" className="w-1/2">
                    <Check className="mr-2 h-4 w-4" />
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
