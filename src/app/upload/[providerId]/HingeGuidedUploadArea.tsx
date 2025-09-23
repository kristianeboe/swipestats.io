"use client";
import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import JSZip from "jszip";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";
import { Alert } from "@/app/_components/tw/Alert";
import { analyticsTrackClient } from "@/lib/analytics/analyticsTrackClient";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

// Types for File System API
interface FileSystemEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
}

interface FileSystemFileEntry extends FileSystemEntry {
  isFile: true;
  file(callback: (file: File) => void): void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  isDirectory: true;
  createReader(): FileSystemDirectoryReader;
}

interface FileSystemDirectoryReader {
  readEntries(callback: (entries: FileSystemEntry[]) => void): void;
}

interface DataTransferItem {
  webkitGetAsEntry?: () => FileSystemEntry | null;
  getAsFile(): File | null;
}

interface HingeFileStatus {
  user: File | null;
  matches: File | null;
  prompts: File | null;
  subscriptions: File | null;
  media: File | null;
}

interface FileEntry {
  file: File;
  type: keyof HingeFileStatus;
  status: "pending" | "success" | "error";
  content?: string;
}

const REQUIRED_FILES = ["user", "matches", "prompts"] as const;
const OPTIONAL_FILES = ["subscriptions", "media"] as const;
const IGNORED_FILES = ["index.html", "readme.txt"];

export function HingeGuidedUploadArea({
  onAcceptedFileLoad,
}: {
  onAcceptedFileLoad: (data: string[]) => void;
}) {
  const [fileStatus, setFileStatus] = useState<HingeFileStatus>({
    user: null,
    matches: null,
    prompts: null,
    subscriptions: null,
    media: null,
  });

  const [fileEntries, setFileEntries] = useState<FileEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const getFileType = (fileName: string): keyof HingeFileStatus | null => {
    const name = fileName.toLowerCase();
    if (name.includes("user.json")) return "user";
    if (name.includes("matches.json")) return "matches";
    if (name.includes("prompts.json")) return "prompts";
    if (name.includes("subscriptions.json")) return "subscriptions";
    if (name.includes("media.json")) return "media";
    return null;
  };

  const shouldIgnoreFile = (fileName: string): boolean => {
    const name = fileName.toLowerCase();
    return IGNORED_FILES.some((ignored) => name.includes(ignored));
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    const newFileStatus = { ...fileStatus };
    const newEntries: FileEntry[] = [];

    // First, extract ZIP files if any
    const allFilesToProcess: File[] = [];

    for (const file of files) {
      // Check if this is a ZIP file
      if (
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        file.type === "application/zip-compressed" ||
        file.type === "application/x-zip" ||
        file.type === "multipart/x-zip" ||
        file.name.toLowerCase().endsWith(".zip")
      ) {
        try {
          analyticsTrackClient("ZIP File Upload Detected", {
            providerId: "HINGE",
          });

          const zip = new JSZip();
          const zipContent = await zip.loadAsync(file);

          // Extract all JSON files from the ZIP
          const extractedFiles: File[] = [];
          const promises: Promise<void>[] = [];

          zipContent.forEach((relativePath, zipFile) => {
            if (relativePath.toLowerCase().endsWith(".json") && !zipFile.dir) {
              promises.push(
                zipFile.async("blob").then((blob) => {
                  // Create a new File object from the blob
                  const extractedFile = new File([blob], relativePath, {
                    type: "application/json",
                  });
                  extractedFiles.push(extractedFile);
                }),
              );
            }
          });

          await Promise.all(promises);
          allFilesToProcess.push(...extractedFiles);

          analyticsTrackClient("ZIP File Extracted Successfully", {
            providerId: "HINGE",
            filesFound: extractedFiles.length,
          });
        } catch (error) {
          console.error("Error extracting ZIP file:", error);
          analyticsTrackClient("ZIP File Extraction Failed", {
            providerId: "HINGE",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      } else {
        // Regular file, add to processing list
        allFilesToProcess.push(file);
      }
    }

    // Now process all files (extracted + regular)
    for (const file of allFilesToProcess) {
      if (shouldIgnoreFile(file.name)) {
        continue; // Skip ignored files
      }

      const fileType = getFileType(file.name);
      if (!fileType) {
        continue; // Skip unrecognized files
      }

      // Don't overwrite if we already have this file type
      if (newFileStatus[fileType]) {
        continue;
      }

      try {
        const content = await readFileAsText(file);
        newFileStatus[fileType] = file;
        newEntries.push({
          file,
          type: fileType,
          status: "success",
          content,
        });

        analyticsTrackClient("Hinge File Processed", {
          providerId: "HINGE",
          fileType,
        });
      } catch (error) {
        newEntries.push({
          file,
          type: fileType,
          status: "error",
        });
        console.error(`Error reading ${file.name}:`, error);
      }
    }

    setFileStatus(newFileStatus);
    setFileEntries((prev) => [...prev, ...newEntries]);
    setIsProcessing(false);

    // Files are processed, user can now choose to continue
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsText(file);
    });
  };

  const handleCompleteUpload = async (currentFileStatus: HingeFileStatus) => {
    const filesToProcess = [
      currentFileStatus.user,
      currentFileStatus.matches,
      currentFileStatus.prompts,
      currentFileStatus.subscriptions,
      currentFileStatus.media,
    ].filter(Boolean) as File[];

    try {
      const fileContents = await Promise.all(
        filesToProcess.map((file) => readFileAsText(file)),
      );

      setUploadComplete(true);
      onAcceptedFileLoad(fileContents);

      analyticsTrackClient("Hinge Profile Upload Complete", {
        providerId: "HINGE",
        filesCount: filesToProcess.length,
        hasOptionalFiles: !!(
          currentFileStatus.subscriptions || currentFileStatus.media
        ),
      });
    } catch (error) {
      console.error("Error processing Hinge files:", error);
      analyticsTrackClient("Hinge Profile Upload Failed", {
        providerId: "HINGE",
      });
    }
  };

  // Handle folder and file drops
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DragEvent,
    ) => {
      analyticsTrackClient("Hinge Files Dropped", {
        providerId: "HINGE",
        filesCount: acceptedFiles.length,
      });

      // Check if this is a folder drop by looking at the drag event
      const items = event.dataTransfer?.items;
      let allFiles: File[] = [];

      if (items) {
        // Handle folder drops
        const handleFolderDrop = async () => {
          for (const item of Array.from(items) as DataTransferItem[]) {
            if (item.webkitGetAsEntry) {
              const entry = item.webkitGetAsEntry();
              if (entry?.isDirectory) {
                const folderFiles = await readDirectory(
                  entry as FileSystemDirectoryEntry,
                );
                allFiles = [...allFiles, ...folderFiles];
              } else if (entry?.isFile) {
                const file = item.getAsFile();
                if (file) allFiles.push(file);
              }
            }
          }

          // If no folder files found, use the regular accepted files
          if (allFiles.length === 0) {
            allFiles = acceptedFiles;
          }

          await processFiles(allFiles);
        };

        // Execute async handling
        handleFolderDrop().catch(console.error);
      } else {
        // If no drag event items, just process the accepted files
        processFiles(acceptedFiles).catch(console.error);
      }
    },
    [fileStatus],
  );

  // Helper function to read directory contents
  const readDirectory = (
    directoryEntry: FileSystemDirectoryEntry,
  ): Promise<File[]> => {
    return new Promise((resolve) => {
      const files: File[] = [];
      const reader = directoryEntry.createReader();

      const readEntries = () => {
        reader.readEntries((entries: FileSystemEntry[]) => {
          if (entries.length === 0) {
            resolve(files);
            return;
          }

          for (const entry of entries) {
            if (entry.isFile) {
              new Promise<File>((resolve) => {
                (entry as FileSystemFileEntry).file(resolve);
              })
                .then((file) => {
                  files.push(file);
                })
                .catch((err) => {
                  console.error("Error reading file:", err);
                });
            }
          }
          readEntries(); // Continue reading
        });
      };

      readEntries();
    });
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      // @ts-expect-error - my types are better and everything is working
      onDrop,
      accept: {
        "application/json": [".json"],
        "application/zip": [".zip"],
        "application/x-zip-compressed": [".zip"],
        "application/zip-compressed": [".zip"],
        "application/x-zip": [".zip"],
        "multipart/x-zip": [".zip"],
      },
      disabled: uploadComplete,
    });

  const requiredFilesComplete = REQUIRED_FILES.every(
    (type) => fileStatus[type],
  );
  const nextRequiredFile = REQUIRED_FILES.find((type) => !fileStatus[type]);

  if (uploadComplete) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-green-50 p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Files processed successfully!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Your Hinge data has been analyzed and is ready for upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Drop Zone */}
      <div
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-all ${
          isDragActive
            ? "cursor-pointer border-rose-500 bg-rose-50"
            : "cursor-pointer border-gray-300 hover:border-rose-400 hover:bg-rose-50"
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Drop your Hinge export folder, ZIP file, or select files
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You can drop the entire &quot;export&quot; folder, a ZIP archive, or
          select individual .json files
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Files are not uploaded to a server, just used to extract your
          relevant, anonymous profile information.
        </p>
      </div>

      {/* Action Info Box */}
      <ActionInfoBox
        fileStatus={fileStatus}
        onContinue={() => handleCompleteUpload(fileStatus)}
        isProcessing={isProcessing}
      />

      {/* Progress Indicator */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Upload Progress</h3>

        {/* Required Files */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Required Files</h4>
          {REQUIRED_FILES.map((fileType) => (
            <FileStatusItem
              key={fileType}
              fileType={fileType}
              file={fileStatus[fileType]}
              isRequired={true}
              isNext={fileType === nextRequiredFile}
            />
          ))}
        </div>

        {/* Optional Files */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Optional Files</h4>
          {OPTIONAL_FILES.map((fileType) => (
            <FileStatusItem
              key={fileType}
              fileType={fileType}
              file={fileStatus[fileType]}
              isRequired={false}
            />
          ))}
        </div>
      </div>

      {fileRejections.length > 0 && !requiredFilesComplete && (
        <Alert
          title="Some files were rejected"
          category="warning"
          description="Only .json files and .zip archives are accepted. Other file types are ignored."
        />
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

function FileStatusItem({
  fileType,
  file,
  isRequired,
  isNext = false,
}: {
  fileType: keyof HingeFileStatus;
  file: File | null;
  isRequired: boolean;
  isNext?: boolean;
}) {
  const getIcon = () => {
    if (file) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    if (isRequired) {
      return <XCircleIcon className="h-5 w-5 text-gray-300" />;
    }
    return <DocumentIcon className="h-5 w-5 text-gray-300" />;
  };

  const getStatusText = () => {
    if (file) return "Uploaded";
    if (isNext) return "Upload next";
    if (isRequired) return "Required";
    return "Optional";
  };

  return (
    <div
      className={`flex items-center space-x-3 rounded-lg p-3 ${
        isNext ? "border border-rose-200 bg-rose-50" : "bg-gray-50"
      }`}
    >
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {fileType}.json
          {isRequired && <span className="ml-1 text-rose-500">*</span>}
        </p>
        <p className="text-xs text-gray-500">
          {file ? file.name : getStatusText()}
        </p>
      </div>
    </div>
  );
}

function ActionInfoBox({
  fileStatus,
  onContinue,
  isProcessing,
}: {
  fileStatus: HingeFileStatus;
  onContinue: () => void;
  isProcessing: boolean;
}) {
  const requiredFilesComplete = REQUIRED_FILES.every(
    (type) => fileStatus[type],
  );
  const requiredFilesCount = REQUIRED_FILES.filter(
    (type) => fileStatus[type],
  ).length;
  const totalRequiredFiles = REQUIRED_FILES.length;
  const nextRequiredFile = REQUIRED_FILES.find((type) => !fileStatus[type]);
  const hasOptionalFiles = OPTIONAL_FILES.some((type) => fileStatus[type]);
  const missingOptionalFiles = OPTIONAL_FILES.filter(
    (type) => !fileStatus[type],
  );

  if (requiredFilesCount === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
              <FolderIcon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Ready to upload your Hinge data
              </p>
              <p className="text-xs text-gray-500">
                Start by uploading your <strong>user.json</strong> file, or drop
                the entire export folder
              </p>
            </div>
          </div>
          <Button
            disabled
            size="sm"
            variant="secondary"
            className="ml-4 flex-shrink-0"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (!requiredFilesComplete) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
              <DocumentIcon className="h-4 w-4 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-amber-900">
                {requiredFilesCount} of {totalRequiredFiles} required files
                uploaded
              </p>
              <p className="text-xs text-amber-700">
                <strong>Next:</strong> Upload your{" "}
                <strong>{nextRequiredFile}.json</strong> file
                {nextRequiredFile &&
                  ` - ${getFileDescription(nextRequiredFile)}`}
              </p>
            </div>
          </div>
          <Button
            disabled
            size="sm"
            variant="secondary"
            className="ml-4 flex-shrink-0"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 flex-1 items-center space-x-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-green-900">
              All required files uploaded!
            </p>
            {!hasOptionalFiles && missingOptionalFiles.length > 0 ? (
              <p className="text-xs text-green-700">
                <strong>Optional:</strong> You can also add{" "}
                {missingOptionalFiles.map((file, idx) => (
                  <span key={file}>
                    <strong>{file}.json</strong>
                    {idx < missingOptionalFiles.length - 1
                      ? idx === missingOptionalFiles.length - 2
                        ? " or "
                        : ", "
                      : ""}
                  </span>
                ))}{" "}
                for more insights, or continue without them.
              </p>
            ) : hasOptionalFiles ? (
              <p className="text-xs text-green-700">
                Great! You&apos;ve included optional files for richer insights.
              </p>
            ) : (
              <p className="text-xs text-green-700">
                All required files uploaded. Ready to analyze your data!
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={onContinue}
          disabled={isProcessing}
          loading={isProcessing}
          size="sm"
          className="ml-4 flex-shrink-0 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}

function getFileDescription(fileType: string): string {
  switch (fileType) {
    case "user":
      return "profile info, preferences, and account details";
    case "matches":
      return "conversation history and match data";
    case "prompts":
      return "your prompt responses and answers";
    case "subscriptions":
      return "subscription and payment history";
    case "media":
      return "photo and media information";
    default:
      return "part of your Hinge data export";
  }
}
