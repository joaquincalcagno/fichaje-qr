export interface Employee {
  id: string;
  name: string;
  email: string;
  dni: string;
  position: string;
  active: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  type: "entry" | "exit";
  timestamp: string;
  created_at: string;
  employee?: Employee;
}

export interface QrToken {
  id: string;
  token: string;
  expires_at: string;
  created_at: string;
}
