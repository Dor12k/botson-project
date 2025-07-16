

import axios from 'axios'

import { useEffect, useState } from 'react'

import { Pie } from 'react-chartjs-2';
// import Pie from 'react-chartjs-2/dist/chartjs-2.esm';


import { Chart as ChartJS, ArcElement, Tooltip as ChartJSTooltip, Legend } from 'chart.js';


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

ChartJS.register(ArcElement, ChartJSTooltip, Legend);

export default function Dashboard() {

  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Graph variables
  const chartData = transactions.map(tx => ({
    date: new Date(tx.timestamp).toLocaleDateString(),
    jobs: tx.progress?.TOTAL_JOBS_SENT_TO_INDEX || 0,
  }));

  // Pie graph variables
  const countsByCountry = transactions.reduce((acc, tx) => {
    acc[tx.country_code] = (acc[tx.country_code] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(countsByCountry),
    datasets: [
      {
        label: 'Transactions by Country',
        data: Object.values(countsByCountry),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF',
        ],
        hoverOffset: 10,
      },
    ],
  };


  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    country: '',
    client: ''
  })


  const averageJobsSentToIndex = transactions.length ? transactions.reduce((sum, tx) => sum + (tx.progress?.TOTAL_JOBS_SENT_TO_INDEX || 0), 0) / transactions.length : 0;

  
  useEffect(() => {

    const fetchData = async () => {

      try {
        const res = await axios.get('http://localhost:5000/api/transactions') 
        setTransactions(res.data)
        // console.log('Type of transactions:', typeof transactions);
        // console.log('Is Array?', Array.isArray(transactions));
        // console.log('transactions:', transactions);

      } catch (err) {
        console.error('Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  // Filter bar
  const handleFilter = async () => {
    setLoading(true)
    try {
        const params = {}

        if (filters.startDate) params.startDate = filters.startDate
        if (filters.endDate) params.endDate = filters.endDate
        if (filters.country) params.country = filters.country
        if (filters.client) params.client = filters.client

        const res = await axios.get('http://localhost:5000/api/transactions', { params })
        setTransactions(res.data)
        } catch (err) {
            console.error('Error applying filters:', err)
        } finally {
            setLoading(false)
        }
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  // Sort transcations function
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortField) return 0

    const aValue = getNestedValue(a, sortField)
    const bValue = getNestedValue(b, sortField)

    if (typeof aValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' || aValue instanceof Date) {
      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue
    }

    return 0
  })

  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedTransactions.slice(indexOfFirstRow, indexOfLastRow);

  // Change sort direction
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Pagination
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  // Pagination next page
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // Pagination previous page
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };



  if (loading) return <div className="p-4">Loading...</div>

  return (

    <div className="flex-col items-center justify-center p-4">

        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Toolbar */}
        <div className='flex flex-col justify-center items-center gap-2 mb-4'>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-20">

              <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="border p-2"
                  placeholder="Start Date"
              />
              <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="border p-2"
                  placeholder="End Date"
              />
              <input
                  type="text"
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                  className="border p-2"
                  placeholder="Country Code (e.g., US)"
              />
              <input
                  type="text"
                  value={filters.client}
                  onChange={(e) => setFilters({ ...filters, client: e.target.value })}
                  className="border p-2"
                  placeholder="Client (transactionSourceName)"
              />
          </div>

          <button onClick={handleFilter} className="w-40 flex justify-center items-center bg-blue-500 text-white px-4 py-2 my-4 rounded hover:bg-blue-600">
            Apply Filters
          </button>

        </div>

        {/* Average display */}
        <div className="mb-4 text-lg font-semibold">
          Average Jobs Sent to Index: {Math.round(averageJobsSentToIndex)}
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Line Chart Card */}
          <div className="bg-white shadow rounded p-4 h-96 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="jobs" stroke="#8884d8" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart Card */}
          <div className="bg-white shadow rounded p-4 h-96 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Transactions by Country</h2>
            <div style={{ height: 300, width: 300 }}>
              <Pie data={pieData} />
            </div>
          </div>
        </div>


        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">

            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('transactionSourceName')}>
                  Client {sortField === 'transactionSourceName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('country_code')}>
                  Country {sortField === 'country_code' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('timestamp')}>
                  Date {sortField === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('progress.TOTAL_JOBS_SENT_TO_INDEX')}>
                  Jobs Sent {sortField === 'progress.TOTAL_JOBS_SENT_TO_INDEX' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>

            <tbody>
                {currentRows.map((tx) => (
                <tr key={tx._id}>
                    <td className="border p-2">{tx.transactionSourceName}</td>
                    <td className="border p-2">{tx.country_code}</td>
                    <td className="border p-2">{tx.status}</td>
                    <td className="border p-2">{new Date(tx.timestamp).toLocaleDateString()}</td>
                    <td className="border p-2">{tx.progress?.TOTAL_JOBS_SENT_TO_INDEX}</td>
                </tr>
                ))}
            </tbody>

        </table>


        {/* Pagination buttons */ }
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>


    </div>
  )
}
