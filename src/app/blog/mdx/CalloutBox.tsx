import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface CalloutBoxProps {
  type: "info" | "success" | "warning" | "error";
  children: React.ReactNode;
}

const typeConfig = {
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-800",
    iconClassName: "text-blue-500",
  },
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-800",
    iconClassName: "text-green-500",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    iconClassName: "text-yellow-500",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-800",
    iconClassName: "text-red-500",
  },
};

export function CalloutBox({ type, children }: CalloutBoxProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-4 ${config.className}`}>
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconClassName}`} />
        <div className="flex-1">
          <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
