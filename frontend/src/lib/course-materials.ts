import type { StaffCourseResource } from "@/lib/academic-staff-types";

export type CourseMaterialType =
  | "Lecture slides"
  | "Lecture notes"
  | "Reading material"
  | "PDF document"
  | "Supporting resource"
  | "Lab sheet"
  | "Syllabus & Guide";

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  description: string;
  resourceType: CourseMaterialType;
  fileName?: string;
  fileSize: string;
  dateAdded: string;
  externalResourceUrl?: string;
  previewContent?: string;
  source?: "Academic Staff";
}

export function getStaffCourseMaterials(
  studentCourseId: string,
  studentCourseCode: string,
  resources: StaffCourseResource[],
): CourseMaterial[] {
  const normalizedCode = studentCourseCode.trim().toUpperCase();
  return resources
    .filter(
      (resource) => resource.courseCode.trim().toUpperCase() === normalizedCode,
    )
    .map((resource) => ({
      id: `staff-${resource.id}`,
      courseId: studentCourseId,
      title: resource.title,
      description: resource.description,
      resourceType: resource.type,
      ...(resource.fileName ? { fileName: resource.fileName } : {}),
      fileSize: resource.fileSize,
      dateAdded: resource.dateAdded,
      ...(resource.externalUrl
        ? { externalResourceUrl: resource.externalUrl }
        : {}),
      ...(resource.previewContent
        ? { previewContent: resource.previewContent }
        : {}),
      source: "Academic Staff" as const,
    }));
}

export const COURSE_MATERIALS: CourseMaterial[] = [
  {
    id: "se301-slides-01",
    courseId: "crs-301",
    title: "Software Verification Foundations",
    description:
      "Sample lecture slides introducing verification goals, test levels, and evidence.",
    resourceType: "Lecture slides",
    fileName: "se301-verification-foundations-sample.pdf",
    fileSize: "2.1 MB",
    dateAdded: "2026-10-28",
  },
  {
    id: "se301-notes-01",
    courseId: "crs-301",
    title: "Quality Assurance Study Notes",
    description:
      "Sample notes on quality attributes, reviews, and verification planning.",
    resourceType: "Lecture notes",
    fileName: "se301-quality-assurance-notes-sample.pdf",
    fileSize: "860 KB",
    dateAdded: "2026-10-30",
  },
  {
    id: "se301-reading-01",
    courseId: "crs-301",
    title: "Verification and Validation Reading Guide",
    description:
      "A sample guide for comparing verification and validation techniques.",
    resourceType: "Reading material",
    fileName: "se301-reading-guide-sample.pdf",
    fileSize: "540 KB",
    dateAdded: "2026-11-02",
  },
  {
    id: "se302-slides-01",
    courseId: "crs-302",
    title: "Search and Intelligent Agents",
    description:
      "Sample slides covering problem formulation, search strategies, and agents.",
    resourceType: "Lecture slides",
    fileName: "se302-search-agents-sample.pdf",
    fileSize: "1.9 MB",
    dateAdded: "2026-10-27",
  },
  {
    id: "se302-notes-01",
    courseId: "crs-302",
    title: "Knowledge Representation Notes",
    description:
      "Sample notes introducing facts, rules, and structured knowledge models.",
    resourceType: "Lecture notes",
    fileName: "se302-knowledge-representation-sample.pdf",
    fileSize: "740 KB",
    dateAdded: "2026-10-31",
  },
  {
    id: "se302-resource-01",
    courseId: "crs-302",
    title: "Google Machine Learning Crash Course",
    description:
      "An external learning resource covering core machine-learning concepts.",
    resourceType: "Supporting resource",
    fileSize: "Not applicable",
    dateAdded: "2026-11-03",
    externalResourceUrl: "https://developers.google.com/machine-learning/crash-course",
  },
  {
    id: "se303-slides-01",
    courseId: "crs-303",
    title: "Cloud Service Models and Infrastructure",
    description:
      "Sample slides introducing cloud service models and infrastructure concepts.",
    resourceType: "Lecture slides",
    fileName: "se303-cloud-infrastructure-sample.pdf",
    fileSize: "2.3 MB",
    dateAdded: "2026-10-25",
  },
  {
    id: "se303-notes-01",
    courseId: "crs-303",
    title: "Continuous Delivery Notes",
    description:
      "Sample notes on build automation, deployment workflows, and feedback loops.",
    resourceType: "Lecture notes",
    fileName: "se303-continuous-delivery-notes-sample.pdf",
    fileSize: "920 KB",
    dateAdded: "2026-10-29",
  },
  {
    id: "se303-document-01",
    courseId: "crs-303",
    title: "Cloud Operations Reference",
    description:
      "A sample reference document for service monitoring and operational readiness.",
    resourceType: "PDF document",
    fileName: "se303-cloud-operations-sample.pdf",
    fileSize: "1.1 MB",
    dateAdded: "2026-11-01",
  },
  {
    id: "se304-slides-01",
    courseId: "crs-304",
    title: "Mobile Interaction Patterns",
    description:
      "Sample slides on mobile navigation, responsive layouts, and touch interaction.",
    resourceType: "Lecture slides",
    fileName: "se304-mobile-patterns-sample.pdf",
    fileSize: "2.0 MB",
    dateAdded: "2026-10-26",
  },
  {
    id: "se304-notes-01",
    courseId: "crs-304",
    title: "Mobile Application Testing Notes",
    description:
      "Sample notes covering device testing, accessibility, and application quality.",
    resourceType: "Lecture notes",
    fileName: "se304-mobile-testing-notes-sample.pdf",
    fileSize: "810 KB",
    dateAdded: "2026-10-30",
  },
  {
    id: "se304-reading-01",
    courseId: "crs-304",
    title: "Platform Capabilities Reading",
    description:
      "A sample reading document about mobile platform services and constraints.",
    resourceType: "Reading material",
    fileName: "se304-platform-reading-sample.pdf",
    fileSize: "630 KB",
    dateAdded: "2026-11-02",
  },
  {
    id: "se305-slides-01",
    courseId: "crs-305",
    title: "Research Proposal Structure",
    description:
      "Sample slides outlining research questions, literature reviews, and methods.",
    resourceType: "Lecture slides",
    fileName: "se305-proposal-structure-sample.pdf",
    fileSize: "1.7 MB",
    dateAdded: "2026-10-24",
  },
  {
    id: "se305-notes-01",
    courseId: "crs-305",
    title: "Research Ethics Notes",
    description:
      "Sample notes on consent, privacy, integrity, and responsible research.",
    resourceType: "Lecture notes",
    fileName: "se305-research-ethics-notes-sample.pdf",
    fileSize: "780 KB",
    dateAdded: "2026-10-29",
  },
  {
    id: "se305-document-01",
    courseId: "crs-305",
    title: "Proposal Planning Worksheet",
    description:
      "A sample worksheet for organizing a research proposal and its milestones.",
    resourceType: "PDF document",
    fileName: "se305-proposal-worksheet-sample.pdf",
    fileSize: "460 KB",
    dateAdded: "2026-11-01",
  },
];
