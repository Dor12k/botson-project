import { useState } from "react";
import axios from "axios";

export default function ChatAssistant() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
        setError("Please enter a question before sending.");
        return;
    }

    try {
      setError(null);
      setCurrentPage(1); // Reset to first page on new query
      const res = await axios.post("http://localhost:5000/api/chat", { question });

      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError("Error sending question.");
      setResponse(null);
    }
  };

  // Extract columns dynamically except "progress" (handle it separately)
  const columns =
    response?.results?.length > 0
      ? Object.keys(response.results[0]).filter((col) => col !== "progress")
      : [];

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = response?.results?.slice(indexOfFirstRow, indexOfLastRow) || [];

  const totalPages = Array.isArray(response?.results)
    ? Math.ceil(response.results.length / rowsPerPage)
    : 0;

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Chat Assistant</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-gray-800 rounded shadow-sm">
          💡 <span className="font-medium">Tip:</span> To see a real example, type '<code className="bg-gray-100 px-1 rounded text-sm">example123</code>' as your question. This will process a query that retrieves all <strong>completed transactions</strong> from <code className="bg-gray-100 px-1 rounded">Deal4</code> in <strong>July 2025</strong> where the total jobs sent to index are at least <strong>10,000</strong>.
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question..."
          maxLength={500} 
          className="p-2 border rounded resize-none h-24"
        />
        <p className="text-xs text-gray-500">
           {question.length} / 500 characters
        </p>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

      {response && (
        <div className="bg-gray-50 border p-4 rounded shadow-sm mb-6">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Echo:</strong> {response.echo}
          </p>
          {/* Show summary if exists */}
          {response.summary && (
            <p className="mb-2 text-gray-800">
              <strong>Summary:</strong> {response.summary}
            </p>
          )}

          {/* Show answer if no results but there's an answer */}
          {!response.results && response.answer && (
            <p className="mb-2 text-gray-800 italic">
              {response.answer}
            </p>
          )}
        </div>
      )}

      {/* Show table only if there are results */}
      {currentRows.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-left border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th key={col} className="p-2 border">
                    {col}
                  </th>
                ))}
                <th className="p-2 border">progress</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, idx) => (
                <tr key={idx} className="border-t">
                  {columns.map((col) => (
                    <td key={col} className="p-2 border">
                      {row[col] === null || row[col] === undefined
                        ? "-"
                        : String(row[col])}
                    </td>
                  ))}
                  <td className="p-2 border">
                    {row.progress && typeof row.progress === "object" ? (
                      <table className="w-full text-xs border border-gray-200">
                        <tbody>
                          {Object.entries(row.progress).map(([key, value]) => (
                            <tr key={key} className="border-b border-gray-100">
                              <td className="font-semibold pr-2">{key}</td>
                              <td>{String(value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
