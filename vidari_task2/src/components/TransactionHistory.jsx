import { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaWallet,
  FaBolt,
  FaRegCreditCard,
  FaFilter,
} from "react-icons/fa";

const API_URL =
  "https://f776e1f2-7f74-4d4d-9ce7-5dfbfbf8b2b2.mock.pstmn.io/test-api/transactions/";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTransactions(
          data.data.transactions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredTransactions = transactions.filter(
    (tx) => filter === "All" || tx.status.toLowerCase() === filter.toLowerCase()
  );

  
  const totalBalance = transactions.reduce((sum, tx) => {
    if (tx.type === "cash_in") return sum + tx.amount;
    if (tx.type === "cash_out") return sum - tx.amount;
    return sum;
  }, 0);

  const latestTransaction = transactions[0];

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === "success") return "#41BC3F";
    if (s === "failed") return "#DC2626";
    if (s === "pending") return "#F59E0B";
    return "#6B7280";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "cash_out":
        return <FaWallet className="inline-block mr-1 text-gray-600" />;
      case "cash_in":
        return <FaMoneyBillWave className="inline-block mr-1 text-gray-600" />;
      case "utility":
        return <FaBolt className="inline-block mr-1 text-gray-600" />;
      case "payment":
        return <FaRegCreditCard className="inline-block mr-1 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-10">
          <img src="/vlogoo2.png" alt="Logo" className="h-10" />
          <h2 className="text-lg font-bold text-gray-700"></h2>
        </div>

        <nav className="space-y-4">
          <p className="text-gray-500 text-sm uppercase">Dashboard</p>
          <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-[#41BC3F] to-[#36a834] text-white rounded-xl font-medium shadow-md flex items-center gap-3">
            <FaWallet className="text-lg" />
            Transactions
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
          <img src="/vlogoo2.png" className="h-8 md:hidden" />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         
          <div className="bg-[#41BC3F] rounded-xl p-6 shadow-lg text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/90 text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold mt-2">{transactions.length}</p>
              </div>
              <div className="p-2">
                <FaWallet className="text-white text-xl" />
              </div>
            </div>
          </div>

          
          <div className="bg-[#D86411] rounded-xl p-6 shadow-lg text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/90 text-sm font-medium">Current Balance</p>
                <p className="text-2xl font-bold mt-2">
                  {totalBalance.toLocaleString()} {transactions[0]?.currency || "USD"}
                </p>
              </div>
              <div className="p-2">
                <FaMoneyBillWave className="text-white text-xl" />
              </div>
            </div>
          </div>

         
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Latest Transaction</p>
                <p className="text-lg font-bold text-gray-800 mt-2 truncate max-w-[150px]">
                  {latestTransaction ? latestTransaction.recipient : "No transactions"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {latestTransaction ? 
                    new Date(latestTransaction.date).toLocaleDateString() : 
                    "---"
                  }
                </p>
              </div>
              <div className="p-2">
                <FaRegCreditCard className="text-gray-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-gray-700 font-medium">Filter by status:</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {["All", "Success", "Pending", "Failed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition 
                    ${filter === s
                      ? s === "Success"
                        ? "bg-[#41BC3F] text-white"
                        : s === "Failed"
                        ? "bg-red-600 text-white"
                        : s === "Pending"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        
        {loading && (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 ml-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {/* TRANSACTION LIST */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => {
              const formattedAmount =
                tx.amount.toLocaleString() + " " + tx.currency;
              const formattedDate = new Date(tx.date).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={tx.id}
                  className="bg-white w-full rounded-xl p-5 flex justify-between items-center border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      {tx.recipient}
                    </p>
                    <p className="text-gray-500 text-sm">{formattedDate}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formattedAmount}</p>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: getStatusColor(tx.status) }}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}