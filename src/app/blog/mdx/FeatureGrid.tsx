import React from "react";
import {
  Calendar,
  ChartBar,
  ChartLine,
  Code,
  Cog,
  File,
  Layers,
  Lightbulb,
  Link,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: keyof typeof iconMap;
}

interface FeatureGridProps {
  features: Feature[];
}

const iconMap = {
  calendar: Calendar,
  "shield-check": ShieldCheck,
  code: Code,
  document: File,
  "lightning-bolt": Zap,
  lightbulb: Lightbulb,
  layers: Layers,
  "chart-bar": ChartBar,
  star: Star,
  users: Users,
  cog: Cog,
  link: Link,
  "chart-line": ChartLine,
};

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="my-8 grid gap-6 sm:grid-cols-2">
      {features.map((feature, index) => {
        const IconComponent = iconMap[feature.icon];

        return (
          <div key={index} className="rounded-lg border border-gray-200 p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <IconComponent className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
