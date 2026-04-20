export type ExceptionStatus =
  | 'New'
  | 'In Progress'
  | 'Contacting Member'
  | 'Pending Escalation'
  | 'Resolved';

export type ExceptionType =
  | 'Contribution Shortfall'
  | 'Withdrawal Blocking'
  | 'Account Discrepancy'
  | 'Refund Pending'
  | 'Nomination Update Required';

export interface HistoryEntry {
  timestamp: string;
  from: ExceptionStatus;
  to: ExceptionStatus;
  by?: string;
  note?: string;
}

export interface Remark {
  id: string;
  text: string;
  by: string;
  timestamp: string;
}

export interface ExceptionItem {
  id: string;
  member_id: string;
  member_name: string;
  exception_type: ExceptionType;
  exception_details: string;
  report_date: string;
  status: ExceptionStatus;
  assigned_to: string;
  remarks: Remark[];
  history: HistoryEntry[];
  resolution_notes?: string;
  resolved_at?: string;
}

export const TEAM_MEMBERS = [
  'Alice Tan',
  'Bob Lim',
  'Carol Wong',
  'David Lee',
  'Eve Ng',
] as const;

export type TeamMember = (typeof TEAM_MEMBERS)[number];
