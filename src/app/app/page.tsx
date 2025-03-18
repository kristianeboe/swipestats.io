"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  UserCircle,
  ArrowRightLeft,
  Upload,
  Settings,
  ChevronRight,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";

export default function Dashboard() {
  const [hasData, setHasData] = useState(false);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Swipestats
          </h1>
          <p className="text-muted-foreground">
            Analyze your dating app data and gain insights into your online
            dating experience
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Option 1: Tinder Profile Data */}
          <Card.Container className="hover:border-primary/50 relative overflow-hidden border-2 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-primary h-5 w-5" />
                View Tinder Profile Data
              </CardTitle>
              <CardDescription>
                Analyze your swiping patterns, matches, and messaging behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 flex h-32 items-center justify-center rounded-md">
                {hasData ? (
                  <div className="text-center">
                    <p className="font-medium">Your data is ready to explore</p>
                    <p className="text-muted-foreground text-sm">
                      Last updated: March 18, 2025
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-medium">No data connected yet</p>
                    <p className="text-muted-foreground text-sm">
                      Upload your Tinder data to get started
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {hasData ? (
                <Link href="/profile">
                  <Button>
                    View Profile Data <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Dialog>
                  <DialogTrigger>
                    <Button>
                      Connect Data <Upload className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect your Tinder data</DialogTitle>
                      <DialogDescription>
                        Upload your Tinder data export to analyze your dating
                        patterns and insights.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6">
                        <Upload className="text-muted-foreground h-8 w-8" />
                        <p className="font-medium">
                          Drag and drop your data file here
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Or click to browse files
                        </p>
                      </div>
                    </div>
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="outline"
                        onClick={() => setHasData(true)}
                      >
                        Use Sample Data
                      </Button>
                      <Link href="/docs/get-started">
                        <Button>
                          How to get your data <Info className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Link href="/docs/tinder-insights">
                <Button variant="ghost">Learn more</Button>
              </Link>
            </CardFooter>
            <div className="absolute right-0 top-0 p-2">
              <div className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
                Popular
              </div>
            </div>
          </Card.Container>

          {/* Main Option 2: Profile Compare */}
          <Card.Container className="hover:border-primary/50 relative overflow-hidden border-2 transition-all">
            <div className="absolute right-0 top-0 p-2">
              <div className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
                New
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="text-primary h-5 w-5" />
                Profile Compare
              </CardTitle>
              <CardDescription>
                Compare your profile with others or against different time
                periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 flex h-32 items-center justify-center rounded-md">
                <div className="text-center">
                  <p className="font-medium">Discover how you compare</p>
                  <p className="text-muted-foreground text-sm">
                    Benchmark your results against others
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/compare">
                <Button>
                  Compare Profiles <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs/profile-compare">
                <Button variant="ghost">Learn more</Button>
              </Link>
            </CardFooter>
          </Card.Container>
        </div>

        {/* Secondary Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card.Container>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-4 w-4" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Manage your account preferences and privacy settings
            </CardContent>
            <CardFooter>
              <Link href="/settings" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Settings <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card.Container>

          <Card.Container>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCircle className="h-4 w-4" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              View and update your Swipestats profile information
            </CardContent>
            <CardFooter>
              <Link href="/profile" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Profile <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card.Container>

          <Card.Container>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-4 w-4" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Learn how to get the most out of Swipestats
            </CardContent>
            <CardFooter>
              <Link href="/docs" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Docs <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card.Container>
        </div>
      </div>
    </div>
  );
}
