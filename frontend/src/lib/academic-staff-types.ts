export type CourseResourceType =
  | "Lecture slides"
  | "Lecture notes"
  | "Reading material"
  | "PDF document"
  | "Lab sheet"
  | "Syllabus & Guide";

export type PolicyCategory =
  | "Examination Regulations"
  | "Assessment Guidelines"
  | "Attendance"
  | "Degree Requirements"
  | "Academic Procedures";

export type StudentStanding =
  | "Good Standing"
  | "Dean's List"
  | "Academic Warning"
  | "Academic Probation";

export interface StaffCourse {
  id: string;
  code: string;
  title: string;
  semester: string;
  academicYear: string;
  credits: number;
  studentCount: number;
  description: string;
  learningObjectives: string[];
  department: string;
  schedule: string;
  venue: string;
  syllabusProgress: number; // 0 - 100 percentage
  activeQuizzesCount: number;
  assignmentsCount: number;
}

export interface StaffCourseResource {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  type: CourseResourceType;
  description: string;
  fileName?: string;
  fileSize: string;
  dateAdded: string;
  downloadUrl?: string;
  externalUrl?: string;
  previewContent?: string;
}

export interface PolicyClause {
  clauseNumber: string;
  heading: string;
  content: string;
}

export interface AcademicPolicy {
  id: string;
  code: string;
  title: string;
  category: PolicyCategory;
  description: string;
  lastUpdated: string;
  effectiveSemester: string;
  clauses: PolicyClause[];
  applicableRoles: string[];
}

export interface StudentCourseEnrollment {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  attendance: number; // percentage
  gradeEstimate: string;
  quizzesCompleted: number;
  totalQuizzes: number;
}

export interface StaffStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  program: string;
  intakeYear: string;
  currentLevel: string;
  cgpa: number;
  sgpa: number;
  creditsCompleted: number;
  totalRequiredCredits: number;
  attendanceRate: number;
  academicStanding: StudentStanding;
  enrolledCourses: StudentCourseEnrollment[];
}

export interface AcademicStaffActivity {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: "quiz" | "resource" | "review" | "course" | "policy";
  courseCode?: string;
}

export interface StaffOverviewMetrics {
  assignedCoursesCount: number;
  totalEnrolledStudents: number;
  teachingResourcesCount: number;
  academicPoliciesCount: number;
  activeQuizzesCount: number;
  averageAttendanceRate: number;
  academicStaffName: string;
  departmentName: string;
}
