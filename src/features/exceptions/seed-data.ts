import type { ExceptionItem, ExceptionStatus, ExceptionType } from './types';
import { TEAM_MEMBERS } from './types';

const NAMES: string[] = [
  'Tan Wei Ling',
  'Ahmad Faizal bin Ismail',
  'Priya Nair',
  'Lee Boon Keng',
  'Siti Rahimah bte Yusof',
  'Rajesh Kumar',
  'Chua Mei Fong',
  'Mohamed Iqbal bin Hamid',
  'Kavitha Selvaraj',
  'Lim Jia Hui',
  'Nur Hidayah bte Sulaiman',
  'Gopal Krishnan',
  'Teo Siew Hoon',
  'Zainudin bin Othman',
  'Anitha Pillai',
  'Koh Chee Wai',
  'Farhana bte Abdul Rahman',
  'Suresh Balakrishnan',
  'Ng Peck Yeng',
  'Haziq bin Hussain',
  'Deepa Ramasamy',
  'Wong Kok Wai',
  'Norliza bte Ramli',
  'Selvam Arumugam',
  'Chan Shu Fen',
  'Ridhwan bin Roslan',
  'Lalitha Narayanan',
  'Phua Chin Leong',
  'Suriani bte Kadir',
  'Vikram Rajan',
];

const NRICS: string[] = [
  'S7823456A',
  'T0134567B',
  'S8456789C',
  'G9012345D',
  'S6789012E',
  'T1234567F',
  'S5678901G',
  'G8901234H',
  'S4567890I',
  'T2345678J',
  'S3456789K',
  'G7890123L',
  'S2345678M',
  'T9012345N',
  'S1234567O',
  'G6789012P',
  'S9876543Q',
  'T4567890R',
  'S8765432S',
  'G3456789T',
  'S7654321U',
  'T2345678V',
  'S6543210W',
  'G1234567X',
  'S5432109Y',
  'T8901234Z',
  'S4321098A',
  'G7890123B',
  'S3210987C',
  'T6789012D',
];

const EXCEPTION_DETAILS: Record<ExceptionType, string[]> = {
  'Contribution Shortfall': [
    'Employer did not submit CPF contributions for Oct 2025',
    'Underpayment detected: $320 shortfall for Q3 2025',
    'Missing contributions for foreign worker levy exemption period',
    'Employer contributions not received for 3 consecutive months',
    'Shortfall of $1,240 due to incorrect salary base calculation',
    'Late employer contribution flagged by system audit',
  ],
  'Withdrawal Blocking': [
    'Member withdrawal blocked due to outstanding court order',
    'Age 55 withdrawal request held pending identity verification',
    'Withdrawal blocked — CPF LIFE annuity election not completed',
    'Lump sum withdrawal rejected due to discrepancy in bank details',
    'Withdrawal on hold: overseas address not updated in system',
    'Medisave withdrawal blocked pending discharge summary',
  ],
  'Account Discrepancy': [
    'OA balance mismatch between legacy and current system records',
    'Duplicate contribution posting detected for Nov 2025',
    'SA interest accrual discrepancy of $42.50 found in audit',
    'RA allocation does not match CPF LIFE election on file',
    'Employer reference number mismatch causing posting error',
    'Member reports missing top-up credit not reflected in balance',
  ],
  'Refund Pending': [
    'Excess contribution refund pending employer bank verification',
    'Returned MediShield Life premium awaiting re-processing',
    'Overpayment of $680 from voluntary top-up, refund queued',
    'Reversed Workfare payment pending disbursement reissue',
    'Refund of duplicate housing repayment delayed by bank',
    'Member refund held for AML screening clearance',
  ],
  'Nomination Update Required': [
    'Nominee information not updated following marriage in 2024',
    'Named nominee is deceased — member has not updated nomination',
    'Nomination on file is over 10 years old; review required',
    'Member reached 55 but CPF nomination form not submitted',
    'Incomplete nomination form: missing witness signature',
    'Nominee NRIC does not match CPF records, verification needed',
  ],
};

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().slice(0, 10);
}

function randomTimestamp(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 9) + 8, Math.floor(Math.random() * 60));
  return d.toISOString();
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

const EXCEPTION_TYPES: ExceptionType[] = [
  'Contribution Shortfall',
  'Withdrawal Blocking',
  'Account Discrepancy',
  'Refund Pending',
  'Nomination Update Required',
];

export function generateSeedData(): ExceptionItem[] {
  const items: ExceptionItem[] = [];

  for (let i = 0; i < 30; i++) {
    const exType = EXCEPTION_TYPES[i % 5] as ExceptionType;
    const detail = pickRandom(EXCEPTION_DETAILS[exType]);
    const assignedTo = TEAM_MEMBERS[i % TEAM_MEMBERS.length] as string;
    const memberName = NAMES[i] ?? `Member ${i}`;
    const memberId = NRICS[i] ?? `S000000${i}A`;
    const reportDate = randomDate(14);

    let status: ExceptionStatus = 'New';
    let remarks: ExceptionItem['remarks'] = [];
    let history: ExceptionItem['history'] = [];
    let resolution_notes: string | undefined;
    let resolved_at: string | undefined;

    if (i < 2) {
      status = 'Resolved';
      resolution_notes =
        i === 0
          ? 'Member contacted and issue resolved. Employer has submitted outstanding contributions.'
          : 'Discrepancy corrected after manual audit. Member notified via letter.';
      resolved_at = randomTimestamp(3);
      history = [
        {
          timestamp: randomTimestamp(13),
          from: 'New',
          to: 'In Progress',
          by: assignedTo,
        },
        {
          timestamp: randomTimestamp(7),
          from: 'In Progress',
          to: 'Contacting Member',
          by: assignedTo,
        },
        {
          timestamp: resolved_at,
          from: 'Contacting Member',
          to: 'Resolved',
          by: assignedTo,
          note: resolution_notes,
        },
      ];
      remarks = [
        {
          id: uid(),
          text: 'Reached out to employer via phone. Awaiting callback.',
          by: assignedTo,
          timestamp: randomTimestamp(10),
        },
        {
          id: uid(),
          text: 'Employer confirmed payment submitted. Monitoring for 2 days.',
          by: assignedTo,
          timestamp: randomTimestamp(5),
        },
      ];
    } else if (i < 5) {
      status = 'Contacting Member';
      history = [
        {
          timestamp: randomTimestamp(10),
          from: 'New',
          to: 'In Progress',
          by: assignedTo,
        },
        {
          timestamp: randomTimestamp(5),
          from: 'In Progress',
          to: 'Contacting Member',
          by: assignedTo,
        },
      ];
      remarks = [
        {
          id: uid(),
          text: 'Left voicemail for member. Will follow up with mail if no response by Friday.',
          by: assignedTo,
          timestamp: randomTimestamp(5),
        },
      ];
    } else if (i < 10) {
      status = 'In Progress';
      history = [
        {
          timestamp: randomTimestamp(8),
          from: 'New',
          to: 'In Progress',
          by: assignedTo,
        },
      ];
      remarks = [
        {
          id: uid(),
          text: 'Case under review. Pending verification from employer records system.',
          by: assignedTo,
          timestamp: randomTimestamp(6),
        },
      ];
    } else {
      status = 'New';
      history = [];
      remarks = [];
    }

    items.push({
      id: uid(),
      member_id: memberId,
      member_name: memberName,
      exception_type: exType,
      exception_details: detail,
      report_date: reportDate,
      status,
      assigned_to: assignedTo,
      remarks,
      history,
      resolution_notes,
      resolved_at,
    });
  }

  return items;
}
