"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

// ============================================================================
// NEXORA Academic Progress & Grading System Models
// Sample academic records are fixtures only; active account records are scoped
// to the authenticated database user and remain empty until populated.
// ============================================================================

export type GradeLetter =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D+"
  | "D"
  | "F";

export type CourseCategory = "Core" | "Elective" | "General" | "Project";

export type StandingStatus =
  | "Good Standing"
  | "Academic Warning"
  | "Academic Probation"
  | "Not available";

export interface AcademicCourseResult {
  id: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  grade: GradeLetter;
  gradePoints: number; // e.g. 4.00, 3.70, 3.30
  termId: string;
  termLabel: string;
  category: CourseCategory;
  instructor?: string;
}

export interface AcademicTerm {
  id: string;
  label: string; // e.g. "Year 1 Semester 1"
  academicYear: string; // e.g. "2023/2024"
  semesterNumber: number; // 1 to 8
  isCurrent: boolean;
  courses: AcademicCourseResult[];
  semesterCredits: number;
  semesterGpa: number;
  cumulativeGpa: number;
  cumulativeCredits: number;
}

export interface AcademicStanding {
  status: StandingStatus;
  honoursTrack: string; // e.g. "First-Class Honours Track"
  description: string;
  gpaThreshold: number;
}

export interface StudentAcademicRecord {
  studentId: string;
  studentName: string;
  program: string;
  faculty: string;
  intakeYear: string;
  currentLevel: string;
  totalCreditsRequired: number;
  totalCreditsEarned: number;
  cumulativeGpa: number;
  currentSemesterGpa: number;
  academicStanding: AcademicStanding;
  terms: AcademicTerm[];
}

// ============================================================================
// Grade Point Scale Definitions (Standard University 4.0 Scale)
// ============================================================================

export const GRADE_POINT_MAP: Record<GradeLetter, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

export function getGradePoint(grade: GradeLetter): number {
  return GRADE_POINT_MAP[grade] ?? 0.0;
}

// ============================================================================
// GPA & Credit Calculation Helpers
// Formula: GPA = sum(course credits × grade points) / sum(course credits)
// ============================================================================

export function calculateTermGpa(
  courses: { credits: number; gradePoints: number }[]
): number {
  if (courses.length === 0) return 0.0;
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  if (totalCredits === 0) return 0.0;
  const totalQualityPoints = courses.reduce(
    (sum, c) => sum + c.credits * c.gradePoints,
    0
  );
  return Number((totalQualityPoints / totalCredits).toFixed(2));
}

// ============================================================================
// Explicit sample data, never used as an authenticated user's academic record.
// ============================================================================

export const SAMPLE_STUDENT_RECORD: StudentAcademicRecord = {
  studentId: "sample-student",
  studentName: "Sample Student",
  program: "BSc (Hons) in Software Engineering",
  faculty: "Faculty of Computing & Information Technology",
  intakeYear: "2023",
  currentLevel: "Level 3, Semester 1",
  totalCreditsRequired: 120,
  totalCreditsEarned: 81,
  cumulativeGpa: 3.81,
  currentSemesterGpa: 3.94,
  academicStanding: {
    status: "Good Standing",
    honoursTrack: "First-Class Honours Track (CGPA ≥ 3.70)",
    description:
      "Student is in exceptional academic standing with Dean's Commendation. On track for First-Class Honours clearance as specified in University Regulation Section 5.2.",
    gpaThreshold: 3.7,
  },
  terms: [
    {
      id: "term-y1s1",
      label: "Year 1 Semester 1",
      academicYear: "2023/2024",
      semesterNumber: 1,
      isCurrent: false,
      semesterCredits: 15,
      semesterGpa: 3.74,
      cumulativeCredits: 15,
      cumulativeGpa: 3.74,
      courses: [
        {
          id: "crs-101",
          courseCode: "CS101",
          courseTitle: "Programming Fundamentals & Problem Solving",
          credits: 4,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y1s1",
          termLabel: "Year 1 Semester 1",
          category: "Core",
          instructor: "Prof. D. Karunaratne",
        },
        {
          id: "crs-102",
          courseCode: "CS102",
          courseTitle: "Discrete Mathematics for Computing",
          credits: 3,
          grade: "A-",
          gradePoints: 3.7,
          termId: "term-y1s1",
          termLabel: "Year 1 Semester 1",
          category: "Core",
          instructor: "Dr. A. Fernando",
        },
        {
          id: "crs-103",
          courseCode: "CS103",
          courseTitle: "Computer Systems Architecture",
          credits: 3,
          grade: "B+",
          gradePoints: 3.3,
          termId: "term-y1s1",
          termLabel: "Year 1 Semester 1",
          category: "Core",
          instructor: "Dr. K. Perera",
        },
        {
          id: "crs-104",
          courseCode: "CS104",
          courseTitle: "Academic Writing & Professional Communication",
          credits: 2,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y1s1",
          termLabel: "Year 1 Semester 1",
          category: "General",
          instructor: "Ms. S. Jayasinghe",
        },
        {
          id: "crs-105",
          courseCode: "CS105",
          courseTitle: "Fundamentals of Information Systems",
          credits: 3,
          grade: "A-",
          gradePoints: 3.7,
          termId: "term-y1s1",
          termLabel: "Year 1 Semester 1",
          category: "Core",
          instructor: "Dr. M. Silva",
        },
      ],
    },
    {
      id: "term-y1s2",
      label: "Year 1 Semester 2",
      academicYear: "2023/2024",
      semesterNumber: 2,
      isCurrent: false,
      semesterCredits: 17,
      semesterGpa: 3.63,
      cumulativeCredits: 32,
      cumulativeGpa: 3.68,
      courses: [
        {
          id: "crs-106",
          courseCode: "CS106",
          courseTitle: "Object-Oriented Programming with Java",
          credits: 4,
          grade: "A+",
          gradePoints: 4.0,
          termId: "term-y1s2",
          termLabel: "Year 1 Semester 2",
          category: "Core",
          instructor: "Prof. D. Karunaratne",
        },
        {
          id: "crs-107",
          courseCode: "CS107",
          courseTitle: "Data Structures & Algorithms I",
          credits: 4,
          grade: "A-",
          gradePoints: 3.7,
          termId: "term-y1s2",
          termLabel: "Year 1 Semester 2",
          category: "Core",
          instructor: "Dr. N. Wickramasinghe",
        },
        {
          id: "crs-108",
          courseCode: "CS108",
          courseTitle: "Linear Algebra & Computational Probability",
          credits: 3,
          grade: "B+",
          gradePoints: 3.3,
          termId: "term-y1s2",
          termLabel: "Year 1 Semester 2",
          category: "Core",
          instructor: "Dr. A. Fernando",
        },
        {
          id: "crs-109",
          courseCode: "CS109",
          courseTitle: "Database Systems Fundamentals",
          credits: 3,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y1s2",
          termLabel: "Year 1 Semester 2",
          category: "Core",
          instructor: "Dr. K. Perera",
        },
        {
          id: "crs-110",
          courseCode: "CS110",
          courseTitle: "Digital Logic & Microprocessors",
          credits: 3,
          grade: "B",
          gradePoints: 3.0,
          termId: "term-y1s2",
          termLabel: "Year 1 Semester 2",
          category: "Core",
          instructor: "Eng. R. Wijesinghe",
        },
      ],
    },
    {
      id: "term-y2s1",
      label: "Year 2 Semester 1",
      academicYear: "2024/2025",
      semesterNumber: 3,
      isCurrent: false,
      semesterCredits: 17,
      semesterGpa: 3.82,
      cumulativeCredits: 49,
      cumulativeGpa: 3.73,
      courses: [
        {
          id: "crs-201",
          courseCode: "SE201",
          courseTitle: "Advanced Data Structures & Algorithms",
          credits: 4,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y2s1",
          termLabel: "Year 2 Semester 1",
          category: "Core",
          instructor: "Dr. N. Wickramasinghe",
        },
        {
          id: "crs-202",
          courseCode: "SE202",
          courseTitle: "Software Engineering Principles & Lifecycle",
          credits: 3,
          grade: "A+",
          gradePoints: 4.0,
          termId: "term-y2s1",
          termLabel: "Year 2 Semester 1",
          category: "Core",
          instructor: "Prof. D. Karunaratne",
        },
        {
          id: "crs-203",
          courseCode: "SE203",
          courseTitle: "Operating Systems Principles & Concurrency",
          credits: 3,
          grade: "B+",
          gradePoints: 3.3,
          termId: "term-y2s1",
          termLabel: "Year 2 Semester 1",
          category: "Core",
          instructor: "Dr. K. Perera",
        },
        {
          id: "crs-204",
          courseCode: "SE204",
          courseTitle: "Relational Database Management Systems",
          credits: 4,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y2s1",
          termLabel: "Year 2 Semester 1",
          category: "Core",
          instructor: "Dr. M. Silva",
        },
        {
          id: "crs-205",
          courseCode: "SE205",
          courseTitle: "Statistics & Empirical Research Methods",
          credits: 3,
          grade: "A-",
          gradePoints: 3.7,
          termId: "term-y2s1",
          termLabel: "Year 2 Semester 1",
          category: "Core",
          instructor: "Dr. A. Fernando",
        },
      ],
    },
    {
      id: "term-y2s2",
      label: "Year 2 Semester 2",
      academicYear: "2024/2025",
      semesterNumber: 4,
      isCurrent: false,
      semesterCredits: 16,
      semesterGpa: 3.94,
      cumulativeCredits: 65,
      cumulativeGpa: 3.78,
      courses: [
        {
          id: "crs-206",
          courseCode: "SE206",
          courseTitle: "Software Architecture & Design Patterns",
          credits: 4,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y2s2",
          termLabel: "Year 2 Semester 2",
          category: "Core",
          instructor: "Prof. D. Karunaratne",
        },
        {
          id: "crs-207",
          courseCode: "SE207",
          courseTitle: "Computer Networks & Distributed Systems",
          credits: 3,
          grade: "A-",
          gradePoints: 3.7,
          termId: "term-y2s2",
          termLabel: "Year 2 Semester 2",
          category: "Core",
          instructor: "Dr. K. Perera",
        },
        {
          id: "crs-208",
          courseCode: "SE208",
          courseTitle: "Web Application Engineering & API Design",
          credits: 3,
          grade: "A+",
          gradePoints: 4.0,
          termId: "term-y2s2",
          termLabel: "Year 2 Semester 2",
          category: "Core",
          instructor: "Mr. T. Jayawardena",
        },
        {
          id: "crs-209",
          courseCode: "SE209",
          courseTitle: "Requirements Engineering & Agile Methodologies",
          credits: 3,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y2s2",
          termLabel: "Year 2 Semester 2",
          category: "Core",
          instructor: "Dr. M. Silva",
        },
        {
          id: "crs-210",
          courseCode: "SE210",
          courseTitle: "Human-Computer Interaction & UI/UX Design",
          credits: 3,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y2s2",
          termLabel: "Year 2 Semester 2",
          category: "Elective",
          instructor: "Ms. N. Rajapakse",
        },
      ],
    },
    {
      id: "term-y3s1",
      label: "Year 3 Semester 1",
      academicYear: "2025/2026",
      semesterNumber: 5,
      isCurrent: true,
      semesterCredits: 16,
      semesterGpa: 3.94,
      cumulativeCredits: 81,
      cumulativeGpa: 3.81,
      courses: [
        {
          id: "crs-301",
          courseCode: "SE301",
          courseTitle: "Advanced Software Engineering & Verification",
          credits: 4,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y3s1",
          termLabel: "Year 3 Semester 1",
          category: "Core",
          instructor: "Prof. D. Karunaratne",
        },
        {
          id: "crs-302",
          courseCode: "SE302",
          courseTitle: "Artificial Intelligence & Knowledge Systems",
          credits: 3,
          grade: "A-",
          gradePoints: 3.7,
          termId: "term-y3s1",
          termLabel: "Year 3 Semester 1",
          category: "Core",
          instructor: "Dr. N. Wickramasinghe",
        },
        {
          id: "crs-303",
          courseCode: "SE303",
          courseTitle: "Cloud Infrastructure & DevOps Practices",
          credits: 3,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y3s1",
          termLabel: "Year 3 Semester 1",
          category: "Core",
          instructor: "Eng. H. Bandara",
        },
        {
          id: "crs-304",
          courseCode: "SE304",
          courseTitle: "Mobile Application Engineering",
          credits: 3,
          grade: "A+",
          gradePoints: 4.0,
          termId: "term-y3s1",
          termLabel: "Year 3 Semester 1",
          category: "Elective",
          instructor: "Mr. T. Jayawardena",
        },
        {
          id: "crs-305",
          courseCode: "SE305",
          courseTitle: "Undergraduate Research Proposal & Ethics",
          credits: 3,
          grade: "A",
          gradePoints: 4.0,
          termId: "term-y3s1",
          termLabel: "Year 3 Semester 1",
          category: "Project",
          instructor: "Prof. D. Karunaratne",
        },
      ],
    },
  ],
};

// ============================================================================
// Storage Key & Browser Storage Helpers
// ============================================================================

export const ACADEMIC_STORAGE_KEY = "nexora-student-academic-records";

function createEmptyStudentRecord(
  userId = "",
  fullName = "",
): StudentAcademicRecord {
  return {
    studentId: userId,
    studentName: fullName,
    program: "Not available",
    faculty: "Not available",
    intakeYear: "Not available",
    currentLevel: "Not available",
    totalCreditsRequired: 0,
    totalCreditsEarned: 0,
    cumulativeGpa: 0,
    currentSemesterGpa: 0,
    academicStanding: {
      status: "Not available",
      honoursTrack: "Not available",
      description: "No academic record is connected to this account.",
      gpaThreshold: 0,
    },
    terms: [],
  };
}

function getUserStorageKey(userId: string) {
  return `${ACADEMIC_STORAGE_KEY}:${encodeURIComponent(userId)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredAcademicRecord(value: unknown): value is StudentAcademicRecord {
  if (!isRecord(value) || !isRecord(value.academicStanding)) return false;
  return (
    typeof value.program === "string" &&
    typeof value.faculty === "string" &&
    typeof value.intakeYear === "string" &&
    typeof value.currentLevel === "string" &&
    Number.isFinite(value.totalCreditsRequired) &&
    Number.isFinite(value.totalCreditsEarned) &&
    Number.isFinite(value.cumulativeGpa) &&
    Number.isFinite(value.currentSemesterGpa) &&
    Array.isArray(value.terms) &&
    (value.academicStanding.status === "Good Standing" ||
      value.academicStanding.status === "Academic Warning" ||
      value.academicStanding.status === "Academic Probation" ||
      value.academicStanding.status === "Not available") &&
    typeof value.academicStanding.honoursTrack === "string" &&
    typeof value.academicStanding.description === "string" &&
    Number.isFinite(value.academicStanding.gpaThreshold)
  );
}

export function getStudentAcademicRecord(
  userId: string,
  fullName: string,
): StudentAcademicRecord {
  const emptyRecord = createEmptyStudentRecord(userId, fullName);
  if (typeof window === "undefined" || !userId) return emptyRecord;
  try {
    const raw = localStorage.getItem(getUserStorageKey(userId));
    if (!raw) return emptyRecord;
    const saved: unknown = JSON.parse(raw);
    if (!isStoredAcademicRecord(saved)) {
      console.error("Saved academic record has an invalid shape.");
      return emptyRecord;
    }
    return {
      ...saved,
      studentId: userId,
      studentName: fullName,
    };
  } catch (error) {
    console.error("Failed to read academic record from localStorage:", error);
    return emptyRecord;
  }
}

export function saveStudentAcademicRecord(
  record: StudentAcademicRecord,
  userId: string,
): void {
  if (typeof window === "undefined" || !userId) {
    throw new Error("An authenticated account is required to save academic records.");
  }
  try {
    localStorage.setItem(
      getUserStorageKey(userId),
      JSON.stringify({ ...record, studentId: userId }),
    );
  } catch (error) {
    console.error("Failed to save academic record to localStorage:", error);
    throw error;
  }
}

export function resetStudentAcademicRecord(
  userId: string,
  fullName: string,
): StudentAcademicRecord {
  if (!userId) {
    throw new Error("An authenticated account is required to reset academic records.");
  }
  try {
    localStorage.removeItem(getUserStorageKey(userId));
  } catch (error) {
    console.error("Failed to reset academic record in localStorage:", error);
    throw error;
  }
  return createEmptyStudentRecord(userId, fullName);
}

export function useStudentAcademicRecord() {
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";
  const fullName = user?.full_name ?? "";
  const [recordState, setRecordState] = useState(() => ({
    userId,
    record: getStudentAcademicRecord(userId, fullName),
  }));
  const record =
    recordState.userId === userId
      ? recordState.record
      : getStudentAcademicRecord(userId, fullName);

  const updateRecord = (newRecord: StudentAcademicRecord) => {
    const ownedRecord = {
      ...newRecord,
      studentId: userId,
      studentName: fullName,
    };
    saveStudentAcademicRecord(ownedRecord, userId);
    setRecordState({ userId, record: ownedRecord });
  };

  const resetRecord = () => {
    const reset = resetStudentAcademicRecord(userId, fullName);
    setRecordState({ userId, record: reset });
  };

  return { record, updateRecord, resetRecord };
}
