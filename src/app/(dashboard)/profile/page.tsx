"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Avatar, AvatarFallback } from "@dashboardpack/core/components/ui/avatar";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@dashboardpack/core/components/ui/tabs";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Calendar,
  Briefcase,
  GitCommit,
  Eye,
  Rocket,
  MessageSquare,
  CheckCircle,
  CalendarDays,
  Users,
  FolderOpen,
  Award,
  Settings,
  Share2,
  MessageCircle,
  Search,
} from "lucide-react";
import {
  getProfileUser,
  getProfileStats,
  getProfileSkills,
  getProfileActivities,
  getProfileConnections,
} from "@dashboardpack/core/lib/data/profile";
import type {
  ProfileUser,
  ProfileActivityType,
  ProfileStat,
  ProfileConnection,
} from "@dashboardpack/core/lib/data/profile";

// ── Activity icon mapping ──

const activityIconMap: Record<ProfileActivityType, { icon: React.ElementType; color: string; bg: string }> = {
  commit: { icon: GitCommit, color: "text-chart-1", bg: "bg-chart-1/10" },
  review: { icon: Eye, color: "text-chart-2", bg: "bg-chart-2/10" },
  deploy: { icon: Rocket, color: "text-chart-3", bg: "bg-chart-3/10" },
  comment: { icon: MessageSquare, color: "text-chart-4", bg: "bg-chart-4/10" },
  task: { icon: CheckCircle, color: "text-chart-5", bg: "bg-chart-5/10" },
  meeting: { icon: CalendarDays, color: "text-chart-2", bg: "bg-chart-2/10" },
};

// ── Status dot colors ──

const statusColor: Record<string, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-muted-foreground/40",
};

// ── Stat icon mapping ──

const statIconMap: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  projects: { icon: FolderOpen, color: "text-chart-1", bg: "bg-chart-1/10" },
  tasks: { icon: CheckCircle, color: "text-chart-2", bg: "bg-chart-2/10" },
  team: { icon: Users, color: "text-chart-3", bg: "bg-chart-3/10" },
  experience: { icon: Award, color: "text-chart-4", bg: "bg-chart-4/10" },
};

// ── ProfileBanner ──

function ProfileBanner({ user }: { user: ProfileUser }) {
  return (
    <div>
      {/* Gradient banner */}
      <div className="h-32 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />

      {/* Profile info overlay */}
      <div className="px-6 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Avatar */}
          <Avatar className="-mt-12 h-24 w-24 ring-4 ring-background">
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-3xl font-bold text-primary-foreground">
              {user.initials}
            </AvatarFallback>
          </Avatar>

          {/* Name & role */}
          <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{user.department}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="me-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Demo mode — link copied!")}
              >
                <Share2 className="me-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Contact details */}
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {user.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {user.phone}
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            {user.website}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Joined {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── StatsRow ──

function StatsRow({ stats }: { stats: ProfileStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => {
        const { icon: Icon, color, bg } = statIconMap[stat.iconType];
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── SkillsSection ──

function SkillsSection() {
  const skills = getProfileSkills();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Skills & Expertise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{skill.name}</span>
              <span className="text-muted-foreground">{skill.level}%</span>
            </div>
            <Progress value={skill.level} indicatorClassName={skill.color} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── OverviewTab ──

function OverviewTab({ user }: { user: ProfileUser }) {
  const stats = getProfileStats();

  return (
    <div className="space-y-6">
      <StatsRow stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* About */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{user.bio}</p>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Department</p>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  {user.department}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Location</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {user.location}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Website</p>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  {user.website}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Member Since</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <div className="space-y-6">
          <SkillsSection />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/settings">
                  <Settings className="me-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/settings">
                  <Mail className="me-2 h-4 w-4" />
                  Email Settings
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/notifications">
                  <MessageSquare className="me-2 h-4 w-4" />
                  Notifications
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── ActivityTimeline ──

function ActivityTimeline() {
  const activities = getProfileActivities();

  // Group by date label
  const groups: { label: string; items: typeof activities }[] = [];
  let currentDate = "";

  for (const activity of activities) {
    const label =
      activity.date === "2026-02-22"
        ? "Today"
        : activity.date === "2026-02-21"
          ? "Yesterday"
          : new Date(activity.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (label !== currentDate) {
      currentDate = label;
      groups.push({ label, items: [] });
    }
    groups[groups.length - 1].items.push(activity);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {groups.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <div className="space-y-0">
              {group.items.map((activity, i) => {
                const { icon: Icon, color, bg } = activityIconMap[activity.type];
                const isLast = i === group.items.length - 1;

                return (
                  <div key={activity.id} className="flex gap-3">
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", bg)}>
                        <Icon className={cn("h-4 w-4", color)} />
                      </div>
                      {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-5">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{activity.description}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── ConnectionCard ──

function ConnectionCard({ connection }: { connection: ProfileConnection }) {
  return (
    <Card className="transition-all hover:border-primary/20 hover:shadow-sm">
      <CardContent className="flex items-start gap-4 p-4">
        {/* Avatar with status dot */}
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {connection.initials}
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "absolute bottom-0 ltr:right-0 rtl:left-0 h-3 w-3 rounded-full border-2 border-background",
              statusColor[connection.status]
            )}
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold">{connection.name}</p>
          <p className="text-xs text-muted-foreground">{connection.role}</p>
          <div className="flex items-center gap-3 pt-1">
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {connection.department}
            </Badge>
            <span className="text-[11px] text-muted-foreground">
              {connection.mutualProjects} mutual projects
            </span>
          </div>
        </div>

        {/* Action */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => toast.info("Demo mode — message sent!")}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ── ConnectionsTab ──

function ConnectionsTab() {
  const [search, setSearch] = useState("");
  const connections = getProfileConnections();

  const filtered = search
    ? connections.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.role.toLowerCase().includes(search.toLowerCase()) ||
          c.department.toLowerCase().includes(search.toLowerCase())
      )
    : connections;

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search connections..."
          className="h-9 ps-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No connections found matching &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──

export default function ProfilePage() {
  const user = getProfileUser();

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="Profile"
          description="View and manage your profile information."
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Profile" },
          ]}
        />
      </div>

      {/* Banner / Hero */}
      <Card className="mb-6 overflow-hidden">
        <ProfileBanner user={user} />
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <OverviewTab user={user} />
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <ActivityTimeline />
        </TabsContent>
        <TabsContent value="connections" className="mt-6">
          <ConnectionsTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
