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
    question: "Who can book a bay?",
    answer: "You must belong to an approved company to log in and book bays. Your account will only show the specific bays that your company has active authorization to use.",
  },
  {
    question: "How is the booking price calculated?",
    answer: "Pricing is calculated based on a per-person rate, but every transaction is subject to a minimum booking fee. Your final quote will never drop below the minimum fee for your selected bay.",
  },
  {
    question: "Is there a discount for booking on the same day?",
    answer: "Yes! Same-day bookings automatically trigger a lower, flat-configured rate structure. Any bookings reserved for future dates will correctly process using the standard rate.",
  },
  {
    question: "How do I book Bay 2 or Bay 3?",
    answer: "By operational rule, booking either Bay 2 or Bay 3 requires both bays to be safely reserved simultaneously. They represent a joint operational zone and cannot be split.",
  },
  {
    question: "Why can't I see who else is booked at the facility?",
    answer: "For privacy and operational security, external users can exclusively see their own company's bookings. Unavailable times across the facility are simply marked as blocked or unavailable.",
  },
  {
    question: "What are the insurance requirements (COI)?",
    answer: "Your company must maintain an active Certificate of Insurance (COI) on file. COI expiration dates are proactively tracked in the system, and expired records will issue an email warning and restrict booking capabilities.",
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
