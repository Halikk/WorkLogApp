// Define types for the application

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  grade?: string | Grade; // Can be either a string or a Grade object
  gradeId?: number; // For form submission
  teamLead?: string;
  director?: string;
  startDate?: string;
  endDate?: string | null | undefined;
}

export interface WorklogType {
  id: number;
  name: string;
}

export interface Worklog {
  id: number;
  employeeId: number;
  date: string; // ISO date string
  hours: number;
  worklogTypeId: number;
  description?: string;
  worklogType?: WorklogType;
  employee?: Employee;
}

export interface Grade {
  id: number;
  name: string;
}
