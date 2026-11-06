import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PERIODS = ["1M", "3M", "6M", "1Y"];

// Render a responsive line chart showing a stock's closing price over time.
function StockPriceChart({
  data,
  selectedPeriod,
  onPeriodChange,
  loading,
  error,
}) {
  return (
    <div>
      <h3>Price History</h3>

      <div className="price-range-buttons" aria-label="Price history range">
        {PERIODS.map((period) => (
          <button
            key={period}
            type="button"
            className={period === selectedPeriod ? "selected" : ""}
            aria-pressed={period === selectedPeriod}
            onClick={() => onPeriodChange(period)}
          >
            {period}
          </button>
        ))}
      </div>

      {loading && <p>Loading price history...</p>}
      {error && <p>{error}</p>}

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis dataKey="datetime" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="close"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default StockPriceChart;
