import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HeatMap from "@uiw/react-heat-map";
import {
  Cell,
  Pie,
  PieChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart3, Calendar, Award, Zap, TrendingUp, HelpCircle } from "lucide-react";
import { AppLayout, PageContainer, PageHeader, PageGrid } from "../components/layouts";
import { Card, Skeleton, Button } from "../components/ui";

// Chart configurations matching existing endpoints
const CHARTS = [
  {
    label: "Today's Projects",
    endpoint: "today",
    color: "#a78bfa", // Purple-400
    colorGlow: "rgba(167, 139, 250, 0.15)",
    icon: Zap,
  },
  {
    label: "This Week's Projects",
    endpoint: "thisweek",
    color: "#6366f1", // Indigo-500
    colorGlow: "rgba(99, 102, 241, 0.15)",
    icon: Calendar,
  },
  {
    label: "This Month's Projects",
    endpoint: "thismonth",
    color: "#3b82f6", // Blue-500
    colorGlow: "rgba(59, 130, 246, 0.15)",
    icon: Award,
  },
];

// Activity heatmap colors matching original theme
const heatmapColors = [
  "#16161e", // 0 activities (sleek dark surface)
  "#312e81", // 1-3 activities (indigo-900)
  "#4338ca", // 4-7 activities (indigo-700)
  "#6366f1", // 8-11 activities (indigo-500)
  "#818cf8", // 12+ activities (indigo-400)
];

function getPanelColor(count) {
  if (count === 0) return heatmapColors[0];
  if (count <= 3) return heatmapColors[1];
  if (count <= 7) return heatmapColors[2];
  if (count <= 11) return heatmapColors[3];
  return heatmapColors[4];
}

// Donut completion component inside customized glass Card
function StatDonut({ label, stats, loading, color, colorGlow, animatedPercent, icon: Icon }) {
  const completed = stats.completed || 0;
  const remaining = (stats.total || 0) - completed;
  const chartData = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining > 0 ? remaining : 0 },
  ];

  // Colors for active & inactive parts
  const COLORS = [color, "rgba(255, 255, 255, 0.04)"];

  return (
    <Card 
      variant="default"
      className="flex flex-col items-center justify-between text-center relative overflow-hidden bg-[#111119]/60 border border-white/[0.05] hover:border-violet-500/20 shadow-xl rounded-2xl p-6 min-h-[340px]"
    >
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: color }} />
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-50" style={{ backgroundColor: colorGlow }} />

      <div className="w-full">
        {/* Header Title with Small Icon */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {Icon && <Icon size={16} style={{ color }} />}
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            {label}
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[180px] gap-2">
            <Skeleton width="w-28" height="h-28" rounded="rounded-full" />
            <Skeleton width="w-20" height="h-3" />
          </div>
        ) : stats.total === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-slate-500 font-medium">
            No projects registered
          </div>
        ) : (
          <div className="flex justify-center my-1 relative">
            <PieChart width={160} height={160}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={68}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={1000}
              >
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
                ))}
              </Pie>
            </PieChart>
            {/* Absolute Centered Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tracking-tight text-white">
                {animatedPercent}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-0.5">
                done
              </span>
            </div>
          </div>
        )}
      </div>

      {!loading && stats.total > 0 && (
        <div className="mt-2 text-xs font-semibold text-slate-400">
          <span className="text-white font-bold">{completed}</span> completed of{" "}
          <span className="text-white font-bold">{stats.total}</span> total
        </div>
      )}
    </Card>
  );
}

function StatPage() {
  const { user_id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Donut stats states
  const [stats, setStats] = useState([
    { total: 0, completed: 0 },
    { total: 0, completed: 0 },
    { total: 0, completed: 0 },
  ]);
  const [loading, setLoading] = useState([true, true, true]);
  const [animatedPercent, setAnimatedPercent] = useState([0, 0, 0]);

  // Heatmap states
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapLoading, setHeatmapLoading] = useState(true);

  // Area chart states (weekly deadlines)
  const [weeklyDeadlineData, setWeeklyDeadlineData] = useState([]);
  const [weeklyDeadlineLoading, setWeeklyDeadlineLoading] = useState(true);

  // Fetch donut completion data
  useEffect(() => {
    CHARTS.forEach((chart, idx) => {
      setLoading((prev) => {
        const arr = [...prev];
        arr[idx] = true;
        return arr;
      });

      fetch(`http://localhost:3000/stats/projects-${chart.endpoint}/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          setStats((prev) => {
            const arr = [...prev];
            arr[idx] = data;
            return arr;
          });
          setLoading((prev) => {
            const arr = [...prev];
            arr[idx] = false;
            return arr;
          });
        })
        .catch(() => {
          setLoading((prev) => {
            const arr = [...prev];
            arr[idx] = false;
            return arr;
          });
        });
    });
  }, [user_id, token]);

  // Fetch heatmap activities data
  useEffect(() => {
    setHeatmapLoading(true);
    fetch(`http://localhost:3000/${user_id}/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setHeatmapData(data.value || []);
      })
      .catch(() => {})
      .finally(() => setHeatmapLoading(false));
  }, [user_id, token]);

  // Fetch weekly deadlines data
  useEffect(() => {
    setWeeklyDeadlineLoading(true);
    fetch(`http://localhost:3000/stats/weekly-deadlines/${user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setWeeklyDeadlineData(data.data || []);
      })
      .catch(() => {})
      .finally(() => setWeeklyDeadlineLoading(false));
  }, [user_id, token]);

  // Animate counter percentages for the donuts
  useEffect(() => {
    stats.forEach((stat, idx) => {
      if (!stat.total) {
        setAnimatedPercent((prev) => {
          const arr = [...prev];
          arr[idx] = 0;
          return arr;
        });
        return;
      }
      let percent = Math.round((stat.completed / stat.total) * 100);
      let current = 0;
      const step = () => {
        if (current < percent) {
          current += 1;
          setAnimatedPercent((prev) => {
            const arr = [...prev];
            arr[idx] = current;
            return arr;
          });
          setTimeout(step, 8);
        } else {
          setAnimatedPercent((prev) => {
            const arr = [...prev];
            arr[idx] = percent;
            return arr;
          });
        }
      };
      step();
    });
  }, [stats]);

  return (
    <AppLayout>
      <PageContainer className="py-10">
        {/* Modernized Header with Breadcrumbs */}
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", onClick: () => navigate(`/${user_id}/dashboard`) },
            { label: "Analytics & Performance" },
          ]}
          title="Performance Metrics"
          subtitle="Real-time completion quotients, activity calendars, and workload tracking insights."
          gradientTitle
          icon={BarChart3}
        />

        {/* Completion Donut cards row */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-violet-400" />
            Project Completion Ratios
          </h2>
          <PageGrid cols={3} gap="gap-6">
            {CHARTS.map((chart, idx) => (
              <StatDonut
                key={chart.label}
                label={chart.label}
                stats={stats[idx]}
                loading={loading[idx]}
                color={chart.color}
                colorGlow={chart.colorGlow}
                animatedPercent={animatedPercent[idx]}
                icon={chart.icon}
              />
            ))}
          </PageGrid>
        </div>

        {/* Chart + Heatmap layout side-by-side or stack */}
        <div className="space-y-10">
          {/* Weekly Project Deadlines Area Chart */}
          <Card 
            variant="default"
            className="p-6 bg-[#111119]/60 border border-white/[0.05] rounded-2xl shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-col gap-1 mb-6">
              <h3 className="text-base font-bold text-slate-100">
                Weekly Deadline Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing cumulative project dues categorized by upcoming calendar deadlines.
              </p>
            </div>

            {weeklyDeadlineLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton width="w-full" height="h-64" rounded="rounded-xl" />
              </div>
            ) : weeklyDeadlineData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-500 font-semibold">
                No active project deadlines registered for this weekly interval.
              </div>
            ) : (
              <div className="w-full h-[300px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyDeadlineData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        return `${day}/${month}`;
                      }}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f0f16",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        color: "#f1f5f9",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      }}
                      labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                      itemStyle={{ color: "#818cf8", fontSize: "13px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      fill="url(#gradientColor)"
                      strokeWidth={2}
                      activeDot={{ r: 6, fill: "#6366f1", stroke: "#000", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Activity Heatmap Panel */}
          <Card 
            variant="default"
            className="p-6 bg-[#111119]/60 border border-white/[0.05] rounded-2xl shadow-xl overflow-x-auto relative"
          >
            <div className="flex flex-col gap-1 mb-6">
              <h3 className="text-base font-bold text-slate-100">
                Account Activity Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Heatmap tracing log increments, updates, and deliverables finalized across your workspace.
              </p>
            </div>

            {heatmapLoading ? (
              <div className="py-12 flex flex-col gap-3">
                <Skeleton width="w-full" height="h-24" />
                <Skeleton width="w-1/2" height="h-4" />
              </div>
            ) : (
              <div className="min-w-[720px] flex flex-col items-center justify-center py-4 bg-[#0a0a0f]/40 border border-white/[0.03] rounded-xl">
                <HeatMap
                  value={heatmapData}
                  width={720}
                  rectSize={14}
                  space={4}
                  startDate={new Date("2025/01/06")}
                  panelColors={heatmapColors}
                  rectProps={{
                    rx: 3,
                    style: {
                      stroke: "rgba(0, 0, 0, 0.4)",
                      strokeWidth: 1.5,
                    },
                  }}
                  rectRender={(props, data) => (
                    <rect
                      {...props}
                      fill={getPanelColor(data.count || 0)}
                      style={{
                        ...props.style,
                        transition: "fill 0.2s ease-out",
                        cursor: data.count ? "pointer" : "default",
                      }}
                    >
                      <title>
                        {data.date || "Date unspecified"}: {data.count || 0} active operations
                      </title>
                    </rect>
                  )}
                />

                {/* Heatmap Legend indicator */}
                <div className="mt-6 flex gap-2.5 items-center text-xs font-semibold text-slate-400">
                  <span>Less Active</span>
                  {heatmapColors.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-5 h-3.5 rounded"
                      style={{
                        backgroundColor: color,
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    />
                  ))}
                  <span>More Active</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Elegant Minimal Footer */}
        <footer className="py-12 mt-12 text-center text-xs text-slate-600 border-t border-white/[0.03]">
          © 2026 SoloFlow. All rights reserved. Powered by premium management frameworks.
        </footer>
      </PageContainer>
    </AppLayout>
  );
}

export default StatPage;
