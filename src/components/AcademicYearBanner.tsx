import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface AcademicYearBannerProps {
  /** When true, show the banner asking admin to set current academic year */
  noCurrentYear: boolean;
}

export default function AcademicYearBanner({ noCurrentYear }: AcademicYearBannerProps) {
  if (!noCurrentYear) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No current academic year</AlertTitle>
      <AlertDescription>
        Many features (exams, fees, class teacher) require a current academic year. Please{" "}
        <Link to="/admin/academic-years" className="underline font-medium">
          create and set the current academic year
        </Link>{" "}
        before using year-dependent features.
      </AlertDescription>
    </Alert>
  );
}
