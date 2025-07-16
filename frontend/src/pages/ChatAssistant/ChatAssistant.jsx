import { useState } from 'react';
import axios from 'axios';

export default function ChatAssistant() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await axios.post('http://localhost:5000/api/chat', { question });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError('Error sending question.');
      setResponse(null);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Chat Assistant</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question..."
          className="p-2 border rounded resize-none h-24"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      {error && (
        <div className="text-red-600 font-semibold mb-4">{error}</div>
      )}

      {response && (
        <div className="bg-gray-50 border p-4 rounded shadow-sm mb-6">
          <p className="text-sm text-gray-600 mb-2"><strong>Echo:</strong> {response.echo}</p>
          <p className="text-base text-gray-800"><strong>Response:</strong> {response.answer}</p>
        </div>
      )}

      {response?.data?.length > 0 && (
        <table className="w-full text-left border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Average Jobs Sent</th>
            </tr>
          </thead>
          <tbody>
            {response.data.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2 border">{row.client}</td>
                <td className="p-2 border">{row.average.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
