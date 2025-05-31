export interface Grade {
  id: number;
  name: string;
  description?: string;
}

export interface WorklogType {
  id: number;
  name: string;
  description?: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  grade: Grade;
  teamLead?: string;
  director?: string;
  startDate: string;
  endDate?: string;
}

export interface Worklog {
  id: number;
  employee: Employee;
  monthDate: string;
  worklogType: WorklogType;
  effort: number;
}

export interface EffortSummary {
  [key: string]: number;
}