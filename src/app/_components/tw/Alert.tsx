import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import React from "react";

type AlertColor = {
  background: string;
  border: string;
  text: string;
  icon: string;
};

type AlertCategory = "success" | "danger" | "warning" | "info";
const alertColors: Record<AlertCategory, AlertColor> = {
  success: {
    background: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    icon: "text-green-400",
  },
  danger: {
    background: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    icon: "text-red-400",
  },
  warning: {
    background: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-800",
    icon: "text-yellow-400",
  },
  info: {
    background: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-800",
    icon: "text-blue-400",
  },
} as const;

export function Alert({
  title,
  category,
  description,
  descriptionList,
}: {
  title: string;
  category: AlertCategory;
  description?: React.ReactNode;
  descriptionList?: string[];
}) {
  const colors = alertColors[category];

  const icon = {
    success: <CheckCircleIcon className={cn("h-5 w-5", colors.icon)} />,
    danger: (
      <XCircleIcon className={cn("h-5 w-5", colors.icon)} aria-hidden="true" />
    ),
    warning: (
      <ExclamationTriangleIcon
        className={cn("h-5 w-5", colors.icon)}
        aria-hidden="true"
      />
    ),
    info: (
      <InformationCircleIcon
        className={cn("h-5 w-5", colors.icon)}
        aria-hidden="true"
      />
    ),
  }[category];

  return (
    <div
      className={cn(
        "rounded-md border-l-4 p-4",
        colors.background,
        colors.border,
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <h3 className={cn("text-sm font-medium", colors.text)}>{title}</h3>
          {description && (
            <div className={cn("mt-2 text-sm", colors.text)}>
              <p>{description}</p>
            </div>
          )}

          {descriptionList && (
            <div className={cn("mt-2 text-sm", colors.text)}>
              <ul role="list" className="list-disc space-y-1 pl-5">
                {descriptionList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
