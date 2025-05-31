import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Employee API
export const getEmployees = () => {
  return axios.get(`${API_URL}/employees`);
};

export const getEmployeeById = (id: number) => {
  return axios.get(`${API_URL}/employees/${id}`);
};

export const createEmployee = (employee: any) => {
  return axios.post(`${API_URL}/employees`, employee);
};

export const updateEmployee = (id: number, employee: any) => {
  return axios.put(`${API_URL}/employees/${id}`, employee);
};

export const deleteEmployee = (id: number) => {
  return axios.delete(`${API_URL}/employees/${id}`);
};

// Grade API
export const getGrades = () => {
  return axios.get(`${API_URL}/grades`);
};

// Worklog API
export const getWorklogs = () => {
  return axios.get(`${API_URL}/worklogs`);
};

export const getWorklogById = (id: number) => {
  return axios.get(`${API_URL}/worklogs/${id}`);
};

export const getWorklogsByEmployee = (employeeId: number) => {
  return axios.get(`${API_URL}/worklogs/employee/${employeeId}`);
};

export const getWorklogsByEmployeeAndMonth = (employeeId: number, month: string) => {
  return axios.get(`${API_URL}/worklogs/employee/${employeeId}/month/${month}`);
};

export const createWorklog = (worklog: any) => {
  return axios.post(`${API_URL}/worklogs`, worklog);
};

export const updateWorklog = (id: number, worklog: any) => {
  return axios.put(`${API_URL}/worklogs/${id}`, worklog);
};

export const deleteWorklog = (id: number) => {
  return axios.delete(`${API_URL}/worklogs/${id}`);
};

// Worklog Type API
export const getWorklogTypes = () => {
  return axios.get(`${API_URL}/worklog-types`);
};

export const createWorklogType = (worklogType: any) => {
  return axios.post(`${API_URL}/worklog-types`, worklogType);
};

export const updateWorklogType = (id: number, worklogType: any) => {
  return axios.put(`${API_URL}/worklog-types/${id}`, worklogType);
};

export const deleteWorklogType = (id: number) => {
  return axios.delete(`${API_URL}/worklog-types/${id}`);
};

// Dashboard API
export const getEmployeeEffortSummary = (employeeId: number, month: string) => {
  return axios.get(`${API_URL}/worklogs/dashboard/employee/${employeeId}/month/${month}`);
};

export const getTeamLeadEffortSummary = (teamLead: string, month: string) => {
  return axios.get(`${API_URL}/worklogs/dashboard/team-lead/${teamLead}/month/${month}`);
};

export const getDirectorEffortSummary = (director: string, month: string) => {
  return axios.get(`${API_URL}/worklogs/dashboard/director/${director}/month/${month}`);
};

export const getTotalEffortByEmployee = (employeeId: number, month: string) => {
  return axios.get(`${API_URL}/worklogs/dashboard/employee/${employeeId}/month/${month}/total`);
};

export const getTotalEffortByTeamLead = (teamLead: string, month: string) => {
  return axios.get(`${API_URL}/worklogs/dashboard/team-lead/${teamLead}/month/${month}/total`);
};

export const getTotalEffortByDirector = (director: string, month: string) => {
  return axios.get(`${API_URL}/worklogs/dashboard/director/${director}/month/${month}/total`);
};