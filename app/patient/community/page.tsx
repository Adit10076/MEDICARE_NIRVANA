"use client";

import { useState, useEffect } from "react";

interface Request {
  id: string;
  name: string;
  description: string;
  createdAt?: { seconds: number; nanoseconds: number };
  replies: { name: string; message: string }[];
}

export default function CommunityPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: { name: string; message: string } }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  async function fetchRequests(pageNumber: number) {
    const res = await fetch(`/api/community?page=${pageNumber}&limit=10`);
    const data: Request[] = await res.json();
  
    setRequests((prev) => {
      const existingIds = new Set(prev.map((req) => req.id)); // Track existing IDs
      const uniqueNewRequests = data.filter((req) => !existingIds.has(req.id)); // Filter out duplicates
      return pageNumber === 1 ? data : [...prev, ...uniqueNewRequests]; // Merge without duplicates
    });
  
    setHasMore(data.length === 10); // Disable "Load More" if fewer than 10 items were fetched
  }
  

  async function submitRequest() {
    if (!name || !description) return alert("Fill all fields!");

    await fetch("/api/community/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    setPage(1);
    fetchRequests(1);
    setName("");
    setDescription("");
  }

  async function submitReply(requestId: string) {
    const { name: replyName, message: replyMessage } = replyInputs[requestId] || {};
    if (!replyName || !replyMessage) return alert("Fill all fields!");

    await fetch("/api/community/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, name: replyName, message: replyMessage }),
    });

    fetchRequests(1);
    setReplyInputs((prev) => ({ ...prev, [requestId]: { name: "", message: "" } }));
  }

  return (
    <div className="container mx-auto p-6 pt-[90px] bg-gradient-to-br from-blue-500 to-cyan-400 min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center mb-6">Community Center</h1>

      {/* Submit Request Form */}
      <div className="bg-white p-6 shadow-lg rounded-lg mb-6 text-gray-900">
        <h2 className="text-2xl font-semibold mb-4">Submit a Help Request</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 w-full mb-3 rounded-lg"
        />
        <textarea
          placeholder="Describe your request"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 w-full mb-3 rounded-lg"
        />
        <button onClick={submitRequest} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg w-full font-semibold">
          Submit
        </button>
      </div>

      {/* Display Requests */}
      <h2 className="text-2xl font-semibold mb-4">Help Requests</h2>
      {requests.map((req) => (
        <div key={req.id} className="bg-white p-5 rounded-lg shadow-lg mb-5 text-gray-900">
          <strong className="text-lg text-blue-700">{req.name}</strong>
          <p className="mb-3 text-gray-700">{req.description}</p>

          {/* Reply Section */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Your Name"
              value={replyInputs[req.id]?.name || ""}
              onChange={(e) => setReplyInputs((prev) => ({ ...prev, [req.id]: { ...prev[req.id], name: e.target.value } }))}
              className="border p-3 rounded-lg flex-1"
            />
            <input
              type="text"
              placeholder="Your Message"
              value={replyInputs[req.id]?.message || ""}
              onChange={(e) => setReplyInputs((prev) => ({ ...prev, [req.id]: { ...prev[req.id], message: e.target.value } }))}
              className="border p-3 rounded-lg flex-2"
            />
            <button
              onClick={() => submitReply(req.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Reply
            </button>
          </div>

          {/* Display Replies */}
          {req.replies?.map((reply, idx) => (
            <p key={idx} className="ml-4 text-gray-700 mt-2">
              <strong className="text-green-600">{reply.name}:</strong> {reply.message}
            </p>
          ))}
        </div>
      ))}

      {/* Pagination */}
      {hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg w-full mt-6 font-semibold"
        >
          Load More
        </button>
      )}
    </div>
  );
}