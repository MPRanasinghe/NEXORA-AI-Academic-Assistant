import {
  StaffCourse,
  StaffCourseResource,
  AcademicPolicy,
  StaffStudent,
  AcademicStaffActivity,
  StaffOverviewMetrics,
  PolicyCategory,
} from "./academic-staff-types";
import {
  DEMO_STAFF_COURSES,
  DEMO_STAFF_RESOURCES,
  DEMO_ACADEMIC_POLICIES,
  DEMO_STAFF_STUDENTS,
  DEMO_STAFF_ACTIVITIES,
  DEMO_STAFF_METRICS,
} from "./academic-staff-demo-data";

/**
 * Academic Staff Service Layer
 *
 * Provides clean asynchronous service functions for Academic Staff workspace.
 * In current demo phase, returns typed synthetic data fixtures.
 * In production, these methods will connect to authenticated university backend API endpoints.
 */

export async function getAssignedCourses(): Promise<StaffCourse[]> {
  // Simulate network tick
  return Promise.resolve([...DEMO_STAFF_COURSES]);
}

export async function getCourseById(
  courseId: string
): Promise<StaffCourse | null> {
  const normalized = courseId.toLowerCase().trim();
  const match = DEMO_STAFF_COURSES.find(
    (c) =>
      c.id.toLowerCase() === normalized || c.code.toLowerCase() === normalized
  );
  return Promise.resolve(match ? { ...match } : null);
}

export async function getStaffResources(): Promise<StaffCourseResource[]> {
  return Promise.resolve([...DEMO_STAFF_RESOURCES]);
}

export async function getResourcesByCourse(
  courseId: string
): Promise<StaffCourseResource[]> {
  const normalized = courseId.toLowerCase().trim();
  const matches = DEMO_STAFF_RESOURCES.filter(
    (r) =>
      r.courseId.toLowerCase() === normalized ||
      r.courseCode.toLowerCase() === normalized
  );
  return Promise.resolve([...matches]);
}

export async function getAcademicPolicies(): Promise<AcademicPolicy[]> {
  return Promise.resolve([...DEMO_ACADEMIC_POLICIES]);
}

export async function searchPolicies(
  query: string,
  category?: PolicyCategory | "All"
): Promise<AcademicPolicy[]> {
  const trimmed = query.trim().toLowerCase();
  const list = DEMO_ACADEMIC_POLICIES.filter((p) => {
    const matchesCategory =
      !category || category === "All" || p.category === category;
    if (!matchesCategory) return false;

    if (!trimmed) return true;

    const inTitle = p.title.toLowerCase().includes(trimmed);
    const inCode = p.code.toLowerCase().includes(trimmed);
    const inDesc = p.description.toLowerCase().includes(trimmed);
    const inClauses = p.clauses.some(
      (c) =>
        c.heading.toLowerCase().includes(trimmed) ||
        c.content.toLowerCase().includes(trimmed) ||
        c.clauseNumber.includes(trimmed)
    );
    return inTitle || inCode || inDesc || inClauses;
  });

  return Promise.resolve(list);
}

export async function getSyntheticStudents(): Promise<StaffStudent[]> {
  return Promise.resolve([...DEMO_STAFF_STUDENTS]);
}

export async function getStudentById(
  studentId: string
): Promise<StaffStudent | null> {
  const normalized = decodeURIComponent(studentId).toLowerCase().trim();
  const match = DEMO_STAFF_STUDENTS.find(
    (s) =>
      s.id.toLowerCase() === normalized ||
      s.studentId.toLowerCase() === normalized ||
      s.studentId.toLowerCase().replace(/\//g, "-") === normalized
  );
  return Promise.resolve(match ? { ...match } : null);
}

export async function getStaffOverviewMetrics(): Promise<StaffOverviewMetrics> {
  return Promise.resolve({ ...DEMO_STAFF_METRICS });
}

export async function getRecentActivities(): Promise<AcademicStaffActivity[]> {
  return Promise.resolve([...DEMO_STAFF_ACTIVITIES]);
}
