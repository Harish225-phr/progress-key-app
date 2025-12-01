import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, DollarSign, TrendingUp, Award, AlertCircle } from "lucide-react";

export default function ClassOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Class Overview</h1>
        <p className="text-muted-foreground">Complete snapshot of your class performance</p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">93%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">37 paid / 5 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">85%</div>
            <p className="text-xs text-muted-foreground">Academic performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                <span className="text-sm font-medium">Present Today</span>
                <span className="text-lg font-bold text-accent">38</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg">
                <span className="text-sm font-medium">Absent Today</span>
                <span className="text-lg font-bold text-destructive">4</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium">Monthly Average</span>
                <span className="text-lg font-bold text-primary">93%</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Attendance has improved by 2% compared to last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Fee Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                <span className="text-sm font-medium">Fees Collected</span>
                <span className="text-lg font-bold text-accent">37</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg">
                <span className="text-sm font-medium">Fees Pending</span>
                <span className="text-lg font-bold text-destructive">5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium">Collection Rate</span>
                <span className="text-lg font-bold text-primary">88%</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  5 students have pending fees for this quarter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Behaviour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Academic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Award className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Top Performers (Above 90%)</p>
                  <p className="text-sm text-muted-foreground">12 students</p>
                </div>
                <span className="text-lg font-bold text-accent">29%</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Average Performers (70-90%)</p>
                  <p className="text-sm text-muted-foreground">24 students</p>
                </div>
                <span className="text-lg font-bold text-primary">57%</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Needs Attention (Below 70%)</p>
                  <p className="text-sm text-muted-foreground">6 students</p>
                </div>
                <span className="text-lg font-bold text-destructive">14%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Behaviour Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                <span className="text-sm font-medium">Excellent Behaviour</span>
                <span className="text-lg font-bold text-accent">28</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium">Good Behaviour</span>
                <span className="text-lg font-bold text-primary">10</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg">
                <span className="text-sm font-medium">Needs Improvement</span>
                <span className="text-lg font-bold text-destructive">4</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Overall class discipline is good with 90% positive remarks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
