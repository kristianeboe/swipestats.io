import { NextResponse } from "next/server";

const mockData = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ],
};

export async function GET() {
  // Convert mockData to a JSON string
  const jsonData = JSON.stringify(mockData, null, 2);

  // Create a new Response with the JSON data
  const response = new NextResponse(jsonData, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=small-sample.json",
    },
  });

  return response;
}
