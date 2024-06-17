import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import React from "react";

export function Alert(props: {
  title: string;
  category: "danger" | "success" | "warning" | "info";
  description?: string;
  descriptionList?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions?: any[];
}) {
  // const icon = props.category === 'success' ?  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" /> : props.category === 'error' ?
  let icon: JSX.Element;
  let color: string;

  switch (props.category) {
    case "success":
      icon = <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      color = "green";
      break;
    case "danger":
      icon = (
        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      );
      color = "red";
      break;
    case "warning":
      icon = (
        <ExclamationTriangleIcon
          className="h-5 w-5 text-yellow-400"
          aria-hidden="true"
        />
      );
      color = "yellow";
      break;
    default:
      // info
      icon = (
        <InformationCircleIcon
          className="h-5 w-5 text-blue-400"
          aria-hidden="true"
        />
      );
      color = "blue";
  }

  console.log("alert", { c: props.category, col: color });

  return (
    <div
      className={`rounded-md bg-${color}-50 border-l-4 p-4 border-${color}-400`}
    >
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium text-${color}-800`}>
            {props.title}
          </h3>
          {props.description && (
            <div className={`mt-2 text-sm text-${color}-700`}>
              <p>{props.description}</p>
            </div>
          )}

          {props.descriptionList && (
            <div className={`mt-2 text-sm text-${color}-700`}>
              <ul role="list" className="list-disc space-y-1 pl-5">
                {props.descriptionList.map((item) => (
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
