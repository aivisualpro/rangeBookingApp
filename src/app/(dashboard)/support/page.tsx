"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { ChevronDown, FileText, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@dashboardpack/core/lib/utils";

const faqs = [
  {
    question: "How do I customize the theme colors?",
    answer: "All colors are defined as CSS custom properties in src/app/globals.css using OKLCh format. Edit the :root and .dark blocks to change any color. The dashboard will update automatically since all components reference these tokens.",
  },
  {
    question: "How do I add a new page to the dashboard?",
    answer: "Create a new file in src/app/(dashboard)/your-page/page.tsx. It will automatically inherit the dashboard layout with sidebar and header. Add the route to the navigation in src/lib/navigation.ts to make it appear in the sidebar.",
  },
  {
    question: "Can I use this template with a backend?",
    answer: "Yes! The template is backend-agnostic. Replace the mock data in each page with your actual API calls. The Servers, Deployments, and Incidents pages demonstrate how data flows through the app.",
  },
  {
    question: "How do I deploy to production?",
    answer: "Run 'npm run build' to create an optimized production build, then 'npm run start' to serve it. For Vercel deployment, simply connect your repo and it will be auto-deployed. Check the /docs/deployment page for more details.",
  },
  {
    question: "Is dark mode supported?",
    answer: "Yes, full dark/light/system mode support is built in. The ThemeProvider manages the theme state and persists the user's preference to localStorage. Toggle it from the header icon or the Settings > Appearance page.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border/50 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between py-4 text-start text-sm font-medium hover:text-primary transition-colors"
                >
                  {faq.question}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      openFaq === i && "rotate-180"
                    )}
                  />
                </button>
                {openFaq === i && (
                  <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Contact Support</CardTitle>
            <CardDescription>Send us a message and we&apos;ll get back to you</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.info("Demo mode — message not sent");
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this about?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
