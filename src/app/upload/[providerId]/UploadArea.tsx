"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { Alert } from "@/app/_components/tw/Alert";
import type { DataProvider } from "@prisma/client";
import { analyticsTrackClient } from "@/lib/analytics/client";

export function UploadArea({
  dataProviderId,
  onAcceptedFileLoad,
}: {
  dataProviderId: DataProvider;
  onAcceptedFileLoad: (d: string) => void;
}) {
  //  const log = logger.getSubLogger({ name: "upload" });
  const [files, setFiles] = useState<File[]>([]);

  // const [rejectedFiles, setRejectedFiles] = useState<any[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      setFiles([...files, ...acceptedFiles]);

      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();
        analyticsTrackClient("File reading Initialized", {
          providerId: dataProviderId,
        });

        reader.onabort = () => {
          analyticsTrackClient("File reading Aborted", {
            providerId: dataProviderId,
          });
        };
        reader.onerror = () => {
          analyticsTrackClient("File reading Failed", {
            providerId: dataProviderId,
          });
        };
        reader.onload = () => {
          // Do whatever you want with the file contents
          // const binaryStr = reader.result;
          // console.log(binaryStr);
          analyticsTrackClient("File reading Succeeded", {
            providerId: dataProviderId,
          });
          onAcceptedFileLoad(reader.result as string);
        };
        // reader.readAsArrayBuffer(file);
        reader.readAsText(file);
      });
    },
    [files, onAcceptedFileLoad, dataProviderId],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: dataProviderId === "TINDER" ? 1 : 4,
      // accept: ".json",
      validator: () => null, // can maybe validate already here? Probably need to do it later
    });

  useEffect(() => {
    if (fileRejections.length) {
      console.log("fileRejections effect", fileRejections.length);
      analyticsTrackClient("File reading Rejected", {
        event_category: "Upload",
        providerId: dataProviderId,
      });
    }
  }, [fileRejections.length, dataProviderId]);

  // https://css-tricks.com/drag-and-drop-file-uploading/
  // https://css-tricks.com/examples/DragAndDropFileUploading/
  return (
    <div className="space-y-8">
      <div
        className={`mx-auto w-full max-w-6xl cursor-pointer rounded-md transition-all hover:bg-rose-50  ${
          isDragActive ? "bg-rose-100  p-2" : ""
        }`}
        {...getRootProps()}
      >
        <label
          htmlFor="cover-photo"
          className="sr-only block text-sm font-medium text-gray-700"
        >
          File select dropsone
        </label>
        <div
          className={`drop-area transition-color flex justify-center border-2 px-6 pb-6 pt-5 ${
            isDragActive ? "border-rose-500" : "border-gray-300"
          }   rounded-md border-dashed`}
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
              <p className="pr-1">Select your</p>
              <label
                htmlFor="file-select"
                className="relative cursor-pointer rounded-md bg-white font-medium text-rose-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2 hover:text-rose-500"
              >
                <span>data.json</span>
                <input
                  id="file-select"
                  name="file-select"
                  type="file"
                  className="sr-only"
                  {...getInputProps()}
                />
              </label>
              <p className="pl-1">file</p>
            </div>
            <p className="text-xs text-gray-500">or drag and drop</p>
          </div>
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        The file is NOT uploaded to a server, just used to extract your
        relevant, anonymous profile information.
      </p>
      {fileRejections.length > 0 && (
        <Alert title="Unsupported file" category="danger" />
      )}
    </div>
  );
}

export default function ErrorAlert() {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Unsupported file</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              <li>Your password must be at least 8 characters</li>
              <li>
                Your password must include at least one pro wrestling finishing
                move
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
