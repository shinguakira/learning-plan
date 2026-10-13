/** Raw sample tasks use day offsets; the frontend expands them into calendar dates. */
export type SeedTask = {
  title: string;
  category:
    | "Frontend"
    | "Backend"
    | "Infra / Cloud"
    | "Database"
    | "CS Fundamentals"
    | "Certification";
  status: "todo" | "doing" | "done";
  priority: "low" | "mid" | "high";
  estimatedHours: number;
  note: string;
  offsetStart: number;
  span: number;
};
