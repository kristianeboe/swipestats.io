"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { Alert } from "@/app/_components/tw/Alert";
import { analyticsTrackClient } from "@/lib/analytics/analyticsTrackClient";
import Link from "next/link";

export function HingeUploadArea({
  onAcceptedFileLoad,
}: {
  onAcceptedFileLoad: (data: string[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);

      const fileReads: Promise<string>[] = acceptedFiles.map((file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          analyticsTrackClient("File reading Initialized", {
            providerId: "HINGE",
          });

          reader.onabort = () => {
            analyticsTrackClient("File reading Aborted", {
              providerId: "HINGE",
            });
            reject(new Error("File reading aborted"));
          };
          reader.onerror = () => {
            analyticsTrackClient("File reading Failed", {
              providerId: "HINGE",
            });
            reject(new Error("File reading failed"));
          };
          reader.onload = () => {
            analyticsTrackClient("File reading Succeeded", {
              providerId: "HINGE",
            });
            resolve(reader.result as string);
          };
          reader.readAsText(file);
        });
      });

      Promise.all(fileReads)
        .then((fileContents) => {
          onAcceptedFileLoad(fileContents);
        })
        .catch((error) => {
          console.error("Error reading Hinge files:", error);
        });
    },
    [files, onAcceptedFileLoad],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 10, // Hinge exports can have multiple files
      accept: {
        "application/json": [".json"],
      },
      validator: () => null,
    });

  useEffect(() => {
    if (fileRejections.length) {
      console.log("Hinge fileRejections effect", fileRejections.length);
      analyticsTrackClient("File reading Rejected", {
        event_category: "Upload",
        providerId: "HINGE",
      });
    }
  }, [fileRejections.length]);

  return (
    <div className="space-y-8">
      <div
        className={`mx-auto w-full max-w-6xl cursor-pointer rounded-md transition-all hover:bg-rose-50 ${
          isDragActive ? "bg-rose-100 p-2" : ""
        }`}
        {...getRootProps()}
      >
        <label
          htmlFor="cover-photo"
          className="sr-only block text-sm font-medium text-gray-700"
        >
          Hinge files select dropzone
        </label>
        <div
          className={`drop-area transition-color flex justify-center border-2 px-6 pb-6 pt-5 ${
            isDragActive ? "border-rose-500" : "border-gray-300"
          } rounded-md border-dashed`}
        >
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              />
            </svg>

            <div className="flex text-sm text-gray-600">
              <p className="pr-1">Select your Hinge</p>
              <label
                htmlFor="file-select"
                className="relative cursor-pointer rounded-md bg-white font-medium text-rose-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2 hover:text-rose-500"
              >
                <span>.json files</span>
                <input
                  id="file-select"
                  name="file-select"
                  type="file"
                  className="sr-only"
                  multiple
                  {...getInputProps()}
                />
              </label>
              <p className="pl-1">(multiple files)</p>
            </div>
            <p className="text-xs text-gray-500">or drag and drop</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Files selected:</p>
          <ul className="mt-2 text-xs text-gray-500">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-1 text-sm text-gray-500">
        The files are NOT uploaded to a server, just used to extract your
        relevant, anonymous profile information.
      </p>
      {fileRejections.length > 0 && (
        <Alert title="Unsupported file" category="danger" />
      )}
      <Alert
        title="Don't have your Hinge data files yet?"
        category="info"
        description={
          <Link
            href={"/#data-request-support"}
            className="underline hover:text-rose-500"
          >
            Learn how to get them here
          </Link>
        }
      />
    </div>
  );
}
