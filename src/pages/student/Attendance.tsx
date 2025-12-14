import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

// Dummy data
const monthlyStats = {
  totalDays: 22,
  present: 20,
  absent: 2,
  percentage: 91,
};

const weeklyData = [
  { week: "Week 1", present: 5, absent: 0 },
  { week: "Week 2", present: 4, absent: 1 },
  { week: "Week 3", present: 5, absent: 0 },
  { week: "Week 4", present: 6, absent: 1 },
];

const trendData = [
  { month: "Sep", percentage: 95 },
  { month: "Oct", percentage: 88 },
  { month: "Nov", percentage: 92 },
  { month: "Dec", percentage: 91 },
];

const absenceAlerts = [
  { date: "Dec 5, 2024", reason: "Medical Leave", status: "approved" },
  { date: "Nov 15, 2024", reason: "Family Emergency", status: "approved" },
];

// Dates for calendar highlighting
const presentDates = [
  new Date(2024, 11, 2),
  new Date(2024, 11, 3),
  new Date(2024, 11, 4),
  new Date(2024, 11, 6),
  new Date(2024, 11, 9),
  new Date(2024, 11, 10),
  new Date(2024, 11, 11),
  new Date(2024, 11, 12),
  new Date(2024, 11, 13),
];

const absentDates = [
  new Date(2024, 11, 5),
];

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const modifiers = {
    present: presentDates,
    absent: absentDates,
  };

  const modifiersStyles = {
    present: {
      backgroundColor: "hsl(142.1 76.2% 36.3%)",
      color: "white",
      borderRadius: "50%",
    },
    absent: {
      backgroundColor: "hsl(0 84.2% 60.2%)",
      color: "white",
      borderRadius: "50%",
    },
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">Track your attendance history</p>
      </div>

      {/* Monthly Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{monthlyStats.totalDays}</p>
            <p className="text-xs text-muted-foreground">Total Days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{monthlyStats.present}</p>
            <p className="text-xs text-muted-foreground">Present Days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{monthlyStats.absent}</p>
            <p className="text-xs text-muted-foreground">Absent Days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{monthlyStats.percentage}%</p>
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
              />
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Absent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="present" fill="hsl(142.1 76.2% 36.3%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="hsl(0 84.2% 60.2%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {weeklyData.map((week, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{week.week}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {week.present} Present
                    </Badge>
                    {week.absent > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {week.absent} Absent
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Attendance Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">This Month</span>
                <span className="text-sm text-muted-foreground">{monthlyStats.percentage}%</span>
              </div>
              <Progress value={monthlyStats.percentage} className="h-3" />
            </div>
            <div className="grid grid-cols-4 gap-4 pt-4">
              {trendData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-foreground">{item.percentage}%</div>
                  <div className="text-xs text-muted-foreground">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                  {trendData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.percentage >= 90 ? "hsl(142.1 76.2% 36.3%)" : entry.percentage >= 75 ? "hsl(47.9 95.8% 53.1%)" : "hsl(0 84.2% 60.2%)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Absence Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Absence History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {absenceAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{alert.date}</p>
                  <p className="text-sm text-muted-foreground">{alert.reason}</p>
                </div>
                <Badge variant="secondary">{alert.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
