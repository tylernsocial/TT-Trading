import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Render a responsive line chart showing a stock's closing price over time.
function StockPriceChart({ data }) {
  return (
    <div>
      <h3>Price History</h3>

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
    </div>
  );
}

export default StockPriceChart;