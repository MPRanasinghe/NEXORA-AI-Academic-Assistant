import {
  StaffCourse,
  StaffCourseResource,
  AcademicPolicy,
  StaffStudent,
  AcademicStaffActivity,
  StaffOverviewMetrics,
} from "./academic-staff-types";

// ============================================================================
// Synthetic Assigned Courses Fixtures for Academic Staff
// ============================================================================
export const DEMO_STAFF_COURSES: StaffCourse[] = [
  {
    id: "se301",
    code: "SE301",
    title: "Advanced Software Engineering & Verification",
    semester: "Semester 1",
    academicYear: "2025/2026",
    credits: 4,
    studentCount: 56,
    description:
      "Advanced engineering principles covering formal methods, software verification, automated testing pipelines, test-driven development, and mission-critical system safety certification.",
    learningObjectives: [
      "Select and apply automated verification techniques for complex system architectures.",
      "Design formal test suites achieving high condition/decision coverage.",
      "Evaluate software quality metrics across continuous delivery pipelines.",
      "Synthesize verification evidence for compliance and regulatory audits.",
    ],
    department: "Department of Software Engineering",
    schedule: "Mondays 10:00 - 12:00, Wednesdays 14:00 - 16:00",
    venue: "Lecture Hall 4A & Computing Lab 2",
    syllabusProgress: 78,
    activeQuizzesCount: 3,
    assignmentsCount: 4,
  },
  {
    id: "se202",
    code: "SE202",
    title: "Software Engineering Principles & Lifecycle",
    semester: "Semester 1",
    academicYear: "2025/2026",
    credits: 3,
    studentCount: 72,
    description:
      "Comprehensive introduction to software engineering paradigms, requirements engineering, agile methodologies, Scrum ceremonies, and modern lifecycle management.",
    learningObjectives: [
      "Compare predictive, iterative, and adaptive software process models.",
      "Elicit and document stakeholder requirements using user stories and use cases.",
      "Plan sprints, track velocity, and manage technical debt in agile teams.",
      "Execute quality assurance reviews and peer code inspection rituals.",
    ],
    department: "Department of Software Engineering",
    schedule: "Tuesdays 08:30 - 11:30",
    venue: "Lecture Hall 2B",
    syllabusProgress: 85,
    activeQuizzesCount: 4,
    assignmentsCount: 3,
  },
  {
    id: "se206",
    code: "SE206",
    title: "Software Architecture & Design Patterns",
    semester: "Semester 2",
    academicYear: "2024/2025",
    credits: 4,
    studentCount: 64,
    description:
      "Study of architectural styles, GoF design patterns, cloud microservice patterns, fault tolerance, and trade-offs in building scalable, loosely coupled enterprise systems.",
    learningObjectives: [
      "Decompose monolithic designs into microservice and event-driven architectures.",
      "Apply structural, behavioral, and creational design patterns appropriately.",
      "Assess non-functional architectural drivers such as latency, availability, and elasticity.",
      "Document architectures using C4 models and Architectural Decision Records (ADRs).",
    ],
    department: "Department of Software Engineering",
    schedule: "Thursdays 13:00 - 17:00",
    venue: "Lecture Hall 3A & Studio Lab",
    syllabusProgress: 100,
    activeQuizzesCount: 2,
    assignmentsCount: 5,
  },
  {
    id: "cs106",
    code: "CS106",
    title: "Object-Oriented Programming with Java",
    semester: "Semester 2",
    academicYear: "2024/2025",
    credits: 4,
    studentCount: 88,
    description:
      "In-depth object-oriented software development in Java, covering encapsulation, polymorphism, inheritance, generics, stream APIs, exception handling, and GUI development.",
    learningObjectives: [
      "Model real-world business domains using object-oriented principles.",
      "Implement robust error recovery using Java checked/unchecked exceptions.",
      "Leverage Java collections, lambdas, and functional pipelines for clean code.",
      "Develop unit test suites with JUnit and assertions.",
    ],
    department: "Department of Computer Science",
    schedule: "Mondays 09:00 - 12:00, Fridays 10:00 - 12:00",
    venue: "Main Auditorium & Computing Lab 1",
    syllabusProgress: 100,
    activeQuizzesCount: 3,
    assignmentsCount: 6,
  },
];

// ============================================================================
// Synthetic Teaching & Course Resources
// ============================================================================
export const DEMO_STAFF_RESOURCES: StaffCourseResource[] = [
  {
    id: "res-se301-01",
    courseId: "se301",
    courseCode: "SE301",
    courseTitle: "Advanced Software Engineering & Verification",
    title: "Formal Verification & Unit Testing Frameworks",
    type: "Lecture slides",
    description:
      "Core lecture slides introducing verification theory, symbolic execution, equivalence partitioning, and boundary value testing methods.",
    fileName: "SE301_Lecture04_Formal_Verification.pdf",
    fileSize: "2.4 MB",
    dateAdded: "2026-10-18",
    previewContent:
      "# SE301: Advanced Software Engineering & Verification\n\n## Module 4: Verification Theory & Boundary Analysis\n- Verification vs. Validation (Boehm's duality)\n- Equivalence Partitioning & Decision Tables\n- Modified Condition/Decision Coverage (MC/DC)\n- Automated test generation in continuous integration",
  },
  {
    id: "res-se301-02",
    courseId: "se301",
    courseCode: "SE301",
    courseTitle: "Advanced Software Engineering & Verification",
    title: "Automated Mutation Testing Lab Exercise",
    type: "Lab sheet",
    description:
      "Hands-on laboratory tutorial on configuring mutation analysis tools and calculating mutation scores on complex algorithm suites.",
    fileName: "SE301_Lab03_Mutation_Testing.pdf",
    fileSize: "1.2 MB",
    dateAdded: "2026-10-25",
    previewContent:
      "# SE301 Laboratory Session 03\n\n### Objective:\n1. Configure mutation operators (AOR, ROR, LCR).\n2. Execute Pitest over the benchmark banking microservice.\n3. Identify survived mutants and design killing test cases.\n4. Deliverable: Lab report with mutation score analysis.",
  },
  {
    id: "res-se301-03",
    courseId: "se301",
    courseCode: "SE301",
    courseTitle: "Advanced Software Engineering & Verification",
    title: "Safety-Critical Software Standards (DO-178C & ISO 26262)",
    type: "Reading material",
    description:
      "Annotated guide summarizing industry safety integrity levels, traceability matrices, and audit obligations for safety-critical software.",
    fileName: "SE301_Reading_Safety_Standards.pdf",
    fileSize: "980 KB",
    dateAdded: "2026-11-01",
    previewContent:
      "# Safety-Critical Software Compliance Notes\n\n- ISO 26262 ASIL A through D risk classifications\n- Bidirectional traceability from system hazards to source code\n- Static code analysis rules (MISRA C / SonarQube Quality Gates)\n- Independent audit procedures.",
  },
  {
    id: "res-se202-01",
    courseId: "se202",
    courseCode: "SE202",
    courseTitle: "Software Engineering Principles & Lifecycle",
    title: "Agile Ceremonies & Sprint Planning Playbook",
    type: "Lecture slides",
    description:
      "Comprehensive slide deck detailing sprint cadences, user story point estimation (Planning Poker), and velocity tracking.",
    fileName: "SE202_Lecture05_Agile_Planning.pdf",
    fileSize: "3.1 MB",
    dateAdded: "2026-10-12",
    previewContent:
      "# SE202: Agile Ceremonies & Story Estimation\n\n- Definition of Ready (DoR) and Definition of Done (DoD)\n- Fibonacci story point scaling\n- Sprint burndown and burnup chart interpretation\n- Handling scope creep in sprints.",
  },
  {
    id: "res-se202-02",
    courseId: "se202",
    courseCode: "SE202",
    courseTitle: "Software Engineering Principles & Lifecycle",
    title: "Software Requirements Specification (SRS) Template",
    type: "Syllabus & Guide",
    description:
      "Standard IEEE 830-compliant SRS specification template provided to student project teams for coursework milestone submissions.",
    fileName: "SE202_SRS_Standard_Template.docx",
    fileSize: "450 KB",
    dateAdded: "2026-10-15",
    previewContent:
      "# IEEE 830 SRS Template (Department of Software Engineering)\n\n1. Introduction\n   1.1 Purpose\n   1.2 Document Conventions\n   1.3 Project Scope\n2. Overall Description\n   2.1 Product Perspective\n   2.2 User Classes & Characteristics\n3. System Features & Functional Requirements\n4. External Interface Requirements\n5. Non-Functional Requirements",
  },
  {
    id: "res-se206-01",
    courseId: "se206",
    courseCode: "SE206",
    courseTitle: "Software Architecture & Design Patterns",
    title: "Clean Architecture & Hexagonal Ports/Adapters",
    type: "Lecture notes",
    description:
      "Detailed lecture notes detailing dependency inversion, application core domain modeling, and decoupling database persistence.",
    fileName: "SE206_Notes_Clean_Architecture.pdf",
    fileSize: "1.8 MB",
    dateAdded: "2026-03-14",
    previewContent:
      "# SE206: Hexagonal & Clean Architecture\n\n- Onion Architecture principles\n- Decoupling infrastructure from business domain logic\n- Inversion of Control (IoC) containers\n- Unit testing domain entities in isolation.",
  },
  {
    id: "res-se206-02",
    courseId: "se206",
    courseCode: "SE206",
    courseTitle: "Software Architecture & Design Patterns",
    title: "Architectural Decision Records (ADR) Workshop",
    type: "Lab sheet",
    description:
      "Practical case study worksheet analyzing microservice trade-offs, consensus algorithms, and documenting decisions using ADRs.",
    fileName: "SE206_ADR_Case_Study.pdf",
    fileSize: "720 KB",
    dateAdded: "2026-03-22",
    previewContent:
      "# Architecture Decision Record (ADR) Framework\n\n- Context and Problem Statement\n- Considered Options\n- Decision Outcome & Justification\n- Positive and Negative Consequences\n- Compliance Review Checklists",
  },
  {
    id: "res-cs106-01",
    courseId: "cs106",
    courseCode: "CS106",
    courseTitle: "Object-Oriented Programming with Java",
    title: "Java Concurrency & Thread Synchronization Guide",
    type: "PDF document",
    description:
      "Reference manual explaining memory model semantics, thread life-cycles, lock primitives, and deadlock prevention.",
    fileName: "CS106_Java_Concurrency_Reference.pdf",
    fileSize: "1.6 MB",
    dateAdded: "2026-02-10",
    previewContent:
      "# CS106: Java Concurrency Reference\n\n- Thread states and scheduling\n- Synchronized methods vs reentrant locks\n- Volatile memory visibility guarantees\n- Deadlock, livelock, and race conditions\n- java.util.concurrent executors and thread pools",
  },
  {
    id: "res-cs106-02",
    courseId: "cs106",
    courseCode: "CS106",
    courseTitle: "Object-Oriented Programming with Java",
    title: "Object-Oriented Design Principles (SOLID)",
    type: "Lecture slides",
    description:
      "Illustrated slides illustrating Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
    fileName: "CS106_SOLID_Principles.pdf",
    fileSize: "2.8 MB",
    dateAdded: "2026-02-18",
    previewContent:
      "# CS106: SOLID Principles in Practice\n\n- S: Single Responsibility Principle\n- O: Open/Closed Principle\n- L: Liskov Substitution Principle\n- I: Interface Segregation Principle\n- D: Dependency Inversion Principle",
  },
];

// ============================================================================
// Synthetic Academic Policies Library (Read-only Institutional Policies)
// ============================================================================
export const DEMO_ACADEMIC_POLICIES: AcademicPolicy[] = [
  {
    id: "pol-exam-01",
    code: "POL-EXAM-01",
    title: "University Examination Conduct & Continuous Assessment Regulations",
    category: "Examination Regulations",
    description:
      "Governs the conduct of official term examinations, invigilation duties, prohibited electronic devices, identity verification, and assessment integrity.",
    lastUpdated: "2026-08-15",
    effectiveSemester: "Academic Year 2025/2026",
    clauses: [
      {
        clauseNumber: "3.1",
        heading: "Candidate Identification & Hall Admission",
        content:
          "Candidates must present a valid university student identity card or national identification document. Admission to the examination venue is prohibited beyond thirty (30) minutes after the scheduled commencement.",
      },
      {
        clauseNumber: "3.4",
        heading: "Prohibited Electronic Devices",
        content:
          "Smartphones, smartwatches, programmable calculators, and unauthorized wireless communication devices are strictly banned from examination desks. Any possession constitutes an immediate breach of academic integrity.",
      },
      {
        clauseNumber: "4.2",
        heading: "Invigilator Reporting Protocol",
        content:
          "Invigilators detecting suspected malpractice must confiscate evidence, issue a new answer booklet with recorded timestamps, and submit a formal incident docket to the Examination Board within 24 hours.",
      },
    ],
    applicableRoles: ["Academic Staff", "Invigilators", "Undergraduate Students"],
  },
  {
    id: "pol-asmt-03",
    code: "POL-ASMT-03",
    title: "Continuous Assessment Weighting & Moderation Framework",
    category: "Assessment Guidelines",
    description:
      "Defines maximum and minimum weighting for continuous coursework, laboratory assignments, quizzes, and external peer moderation criteria.",
    lastUpdated: "2026-09-02",
    effectiveSemester: "Academic Year 2025/2026",
    clauses: [
      {
        clauseNumber: "2.1",
        heading: "Continuous Assessment Proportion",
        content:
          "Unless specifically exempted by Faculty Academic Board approval, continuous assessment components must constitute between 40% and 60% of the total aggregate course evaluation mark.",
      },
      {
        clauseNumber: "2.5",
        heading: "Moderation of Assessment Instruments",
        content:
          "All midterm papers, final exam question sets, and marking rubrics must undergo independent internal moderation by a designated peer academic staff member prior to publication.",
      },
      {
        clauseNumber: "3.2",
        heading: "Timely Feedback Return",
        content:
          "Evaluated continuous assessment coursework, along with formative rubric feedback, must be returned to students within fifteen (15) working days from the submission deadline.",
      },
    ],
    applicableRoles: ["Academic Staff", "Course Directors", "Department Heads"],
  },
  {
    id: "pol-attn-02",
    code: "POL-ATTN-02",
    title: "Mandatory Student Attendance & Condonation Regulations",
    category: "Attendance",
    description:
      "Prescribes minimum physical and virtual attendance thresholds, medical certificate endorsement procedures, and eligibility criteria for sit-in examinations.",
    lastUpdated: "2026-07-20",
    effectiveSemester: "Academic Year 2025/2026",
    clauses: [
      {
        clauseNumber: "1.2",
        heading: "80% Minimum Attendance Requirement",
        content:
          "A minimum cumulative attendance of 80% in scheduled lectures, practical laboratories, and tutorials is required to be certified eligible to sit for the final semester examination in that course.",
      },
      {
        clauseNumber: "1.6",
        heading: "Endorsement of Medical Certificates",
        content:
          "Absence due to illness must be supported by a certified medical practitioner and submitted to the Chief Medical Officer within seven (7) calendar days of returning to campus.",
      },
      {
        clauseNumber: "2.1",
        heading: "Condonation of Attendance Shortfall",
        content:
          "Where attendance falls between 70% and 79% due to substantiated compassionate or medical grounds, condonation may be granted exclusively by recommendation of the Dean of Faculty.",
      },
    ],
    applicableRoles: ["Academic Staff", "Students", "Academic Services"],
  },
  {
    id: "pol-degr-05",
    code: "POL-DEGR-05",
    title: "Honours Classification, Progression & Graduation Benchmarks",
    category: "Degree Requirements",
    description:
      "Establishes GPA cut-offs for honours tracks, prerequisite progression rules, capstone research requirements, and minimum credit quotas for degree conferral.",
    lastUpdated: "2026-08-30",
    effectiveSemester: "Academic Year 2025/2026",
    clauses: [
      {
        clauseNumber: "5.1",
        heading: "Degree Credit Accumulation",
        content:
          "Conferment of a four-year Bachelor of Science (Honours) requires successful completion of at least 120 credit units, inclusive of required core modules and the final-year capstone project.",
      },
      {
        clauseNumber: "5.2",
        heading: "Honours GPA Cut-offs",
        content:
          "First-Class Honours: CGPA ≥ 3.70 with no unresolved failed courses. Second-Class Upper: 3.30 ≤ CGPA < 3.70. Second-Class Lower: 2.70 ≤ CGPA < 3.30. General Pass: 2.00 ≤ CGPA < 2.70.",
      },
      {
        clauseNumber: "5.5",
        heading: "Capstone Project Clearance",
        content:
          "All undergraduate candidates must secure a passing grade (minimum 'C') in their final-year capstone research project and undergo oral viva examination before degree clearance.",
      },
    ],
    applicableRoles: ["Senate", "Academic Staff", "Degree Auditing Officers"],
  },
  {
    id: "pol-proc-04",
    code: "POL-PROC-04",
    title: "Student Academic Appeal & Grade Re-scrutiny Procedures",
    category: "Academic Procedures",
    description:
      "Outlines the structured timeline, submission channels, committee review protocols, and fee schedule for academic grade re-scrutiny requests.",
    lastUpdated: "2026-09-10",
    effectiveSemester: "Academic Year 2025/2026",
    clauses: [
      {
        clauseNumber: "2.2",
        heading: "Filing Deadline & Channel",
        content:
          "Applications for grade re-scrutiny must be submitted via the Academic Information System portal within fourteen (14) calendar days from the date of official grade notification publication.",
      },
      {
        clauseNumber: "2.4",
        heading: "Re-scrutiny Fee & Refund Policy",
        content:
          "A non-refundable administrative processing fee of $25 per module applies. If re-scrutiny causes an upward grade adjustment of one full letter grade or more, the administrative fee is reimbursed.",
      },
      {
        clauseNumber: "3.1",
        heading: "Independent Examiner Review",
        content:
          "Re-scrutiny is executed by a senior academic staff member who was not the primary examiner for that course offering, ensuring impartial assessment verification.",
      },
    ],
    applicableRoles: ["Academic Staff", "Examinations Office", "Appealing Students"],
  },
];

// ============================================================================
// Synthetic Student Fixtures (Read-only Academic Staff Demo Roster)
// Note: Separate from any single student's private localStorage records
// ============================================================================
export const DEMO_STAFF_STUDENTS: StaffStudent[] = [
  {
    id: "stu-001",
    studentId: "SE/2023/014",
    name: "Kavindu Perera",
    email: "kavindu.p@student.nexora.edu",
    program: "BSc (Hons) in Software Engineering",
    intakeYear: "2023",
    currentLevel: "Level 3, Semester 1",
    cgpa: 3.84,
    sgpa: 3.92,
    creditsCompleted: 81,
    totalRequiredCredits: 120,
    attendanceRate: 94,
    academicStanding: "Dean's List",
    enrolledCourses: [
      {
        courseId: "se301",
        courseCode: "SE301",
        courseTitle: "Advanced Software Engineering & Verification",
        credits: 4,
        attendance: 96,
        gradeEstimate: "A",
        quizzesCompleted: 3,
        totalQuizzes: 3,
      },
      {
        courseId: "se202",
        courseCode: "SE202",
        courseTitle: "Software Engineering Principles & Lifecycle",
        credits: 3,
        attendance: 92,
        gradeEstimate: "A+",
        quizzesCompleted: 4,
        totalQuizzes: 4,
      },
    ],
  },
  {
    id: "stu-002",
    studentId: "SE/2023/028",
    name: "Nisali Jayasuriya",
    email: "nisali.j@student.nexora.edu",
    program: "BSc (Hons) in Software Engineering",
    intakeYear: "2023",
    currentLevel: "Level 3, Semester 1",
    cgpa: 3.65,
    sgpa: 3.71,
    creditsCompleted: 81,
    totalRequiredCredits: 120,
    attendanceRate: 88,
    academicStanding: "Good Standing",
    enrolledCourses: [
      {
        courseId: "se301",
        courseCode: "SE301",
        courseTitle: "Advanced Software Engineering & Verification",
        credits: 4,
        attendance: 87,
        gradeEstimate: "A-",
        quizzesCompleted: 3,
        totalQuizzes: 3,
      },
      {
        courseId: "se202",
        courseCode: "SE202",
        courseTitle: "Software Engineering Principles & Lifecycle",
        credits: 3,
        attendance: 89,
        gradeEstimate: "A-",
        quizzesCompleted: 3,
        totalQuizzes: 4,
      },
    ],
  },
  {
    id: "stu-003",
    studentId: "SE/2023/041",
    name: "Dineth Senanayake",
    email: "dineth.s@student.nexora.edu",
    program: "BSc (Hons) in Software Engineering",
    intakeYear: "2023",
    currentLevel: "Level 3, Semester 1",
    cgpa: 2.92,
    sgpa: 3.05,
    creditsCompleted: 77,
    totalRequiredCredits: 120,
    attendanceRate: 82,
    academicStanding: "Good Standing",
    enrolledCourses: [
      {
        courseId: "se301",
        courseCode: "SE301",
        courseTitle: "Advanced Software Engineering & Verification",
        credits: 4,
        attendance: 80,
        gradeEstimate: "B",
        quizzesCompleted: 2,
        totalQuizzes: 3,
      },
      {
        courseId: "se202",
        courseCode: "SE202",
        courseTitle: "Software Engineering Principles & Lifecycle",
        credits: 3,
        attendance: 84,
        gradeEstimate: "B+",
        quizzesCompleted: 3,
        totalQuizzes: 4,
      },
    ],
  },
  {
    id: "stu-004",
    studentId: "SE/2023/055",
    name: "Tharushi Silva",
    email: "tharushi.s@student.nexora.edu",
    program: "BSc (Hons) in Software Engineering",
    intakeYear: "2023",
    currentLevel: "Level 3, Semester 1",
    cgpa: 3.91,
    sgpa: 3.98,
    creditsCompleted: 81,
    totalRequiredCredits: 120,
    attendanceRate: 98,
    academicStanding: "Dean's List",
    enrolledCourses: [
      {
        courseId: "se301",
        courseCode: "SE301",
        courseTitle: "Advanced Software Engineering & Verification",
        credits: 4,
        attendance: 100,
        gradeEstimate: "A+",
        quizzesCompleted: 3,
        totalQuizzes: 3,
      },
      {
        courseId: "se202",
        courseCode: "SE202",
        courseTitle: "Software Engineering Principles & Lifecycle",
        credits: 3,
        attendance: 96,
        gradeEstimate: "A",
        quizzesCompleted: 4,
        totalQuizzes: 4,
      },
    ],
  },
  {
    id: "stu-005",
    studentId: "SE/2023/067",
    name: "Ravindu Bandara",
    email: "ravindu.b@student.nexora.edu",
    program: "BSc (Hons) in Software Engineering",
    intakeYear: "2023",
    currentLevel: "Level 3, Semester 1",
    cgpa: 2.14,
    sgpa: 2.05,
    creditsCompleted: 68,
    totalRequiredCredits: 120,
    attendanceRate: 74,
    academicStanding: "Academic Warning",
    enrolledCourses: [
      {
        courseId: "se301",
        courseCode: "SE301",
        courseTitle: "Advanced Software Engineering & Verification",
        credits: 4,
        attendance: 72,
        gradeEstimate: "C",
        quizzesCompleted: 1,
        totalQuizzes: 3,
      },
      {
        courseId: "se202",
        courseCode: "SE202",
        courseTitle: "Software Engineering Principles & Lifecycle",
        credits: 3,
        attendance: 76,
        gradeEstimate: "C+",
        quizzesCompleted: 2,
        totalQuizzes: 4,
      },
    ],
  },
  {
    id: "stu-006",
    studentId: "SE/2023/082",
    name: "Hansani Fernando",
    email: "hansani.f@student.nexora.edu",
    program: "BSc (Hons) in Software Engineering",
    intakeYear: "2023",
    currentLevel: "Level 3, Semester 1",
    cgpa: 3.48,
    sgpa: 3.55,
    creditsCompleted: 81,
    totalRequiredCredits: 120,
    attendanceRate: 90,
    academicStanding: "Good Standing",
    enrolledCourses: [
      {
        courseId: "se301",
        courseCode: "SE301",
        courseTitle: "Advanced Software Engineering & Verification",
        credits: 4,
        attendance: 88,
        gradeEstimate: "B+",
        quizzesCompleted: 3,
        totalQuizzes: 3,
      },
      {
        courseId: "se202",
        courseCode: "SE202",
        courseTitle: "Software Engineering Principles & Lifecycle",
        credits: 3,
        attendance: 92,
        gradeEstimate: "A-",
        quizzesCompleted: 4,
        totalQuizzes: 4,
      },
    ],
  },
  {
    id: "stu-007",
    studentId: "SE/2023/099",
    name: "Sachintha Alwis",
    email: "sachintha.a@student.nexora.edu",
    program: "BSc (Hons) in Software Engineering",
    intakeYear: "2023",
    currentLevel: "Level 3, Semester 1",
    cgpa: 1.88,
    sgpa: 1.95,
    creditsCompleted: 62,
    totalRequiredCredits: 120,
    attendanceRate: 68,
    academicStanding: "Academic Probation",
    enrolledCourses: [
      {
        courseId: "se301",
        courseCode: "SE301",
        courseTitle: "Advanced Software Engineering & Verification",
        credits: 4,
        attendance: 65,
        gradeEstimate: "D+",
        quizzesCompleted: 1,
        totalQuizzes: 3,
      },
      {
        courseId: "se202",
        courseCode: "SE202",
        courseTitle: "Software Engineering Principles & Lifecycle",
        credits: 3,
        attendance: 71,
        gradeEstimate: "C-",
        quizzesCompleted: 2,
        totalQuizzes: 4,
      },
    ],
  },
  {
    id: "stu-008",
    studentId: "SE/2023/112",
    name: "Imasha De Silva",
    email: "imasha.d@student.nexora.edu",
    program: "BSc (Hons) in Software Engineering",
    intakeYear: "2023",
    currentLevel: "Level 3, Semester 1",
    cgpa: 3.73,
    sgpa: 3.82,
    creditsCompleted: 81,
    totalRequiredCredits: 120,
    attendanceRate: 95,
    academicStanding: "Dean's List",
    enrolledCourses: [
      {
        courseId: "se301",
        courseCode: "SE301",
        courseTitle: "Advanced Software Engineering & Verification",
        credits: 4,
        attendance: 96,
        gradeEstimate: "A-",
        quizzesCompleted: 3,
        totalQuizzes: 3,
      },
      {
        courseId: "se202",
        courseCode: "SE202",
        courseTitle: "Software Engineering Principles & Lifecycle",
        credits: 3,
        attendance: 94,
        gradeEstimate: "A",
        quizzesCompleted: 4,
        totalQuizzes: 4,
      },
    ],
  },
];

// ============================================================================
// Synthetic Recent Academic Activities for Staff
// ============================================================================
export const DEMO_STAFF_ACTIVITIES: AcademicStaffActivity[] = [
  {
    id: "act-01",
    title: "New Quiz Published",
    detail: "SE301: Verification & Mutation Testing Quiz 03 launched for 56 students.",
    timestamp: "2 hours ago",
    type: "quiz",
    courseCode: "SE301",
  },
  {
    id: "act-02",
    title: "Teaching Resource Uploaded",
    detail: "Uploaded 'Safety Standards DO-178C Guide' under SE301 resources.",
    timestamp: "Yesterday, 15:30",
    type: "resource",
    courseCode: "SE301",
  },
  {
    id: "act-03",
    title: "Continuous Assessment Moderation Completed",
    detail: "Peer moderation sign-off recorded for SE202 Sprint 2 deliverables.",
    timestamp: "2 days ago",
    type: "review",
    courseCode: "SE202",
  },
  {
    id: "act-04",
    title: "Course Syllabus Progress Updated",
    detail: "SE202 syllabus milestone reached 85% completion.",
    timestamp: "3 days ago",
    type: "course",
    courseCode: "SE202",
  },
  {
    id: "act-05",
    title: "Academic Policy Library Consulted",
    detail: "Reviewed POL-ATTN-02 attendance condonation guidelines for Level 3.",
    timestamp: "4 days ago",
    type: "policy",
  },
];

// ============================================================================
// Staff Overview Metrics
// ============================================================================
export const DEMO_STAFF_METRICS: StaffOverviewMetrics = {
  assignedCoursesCount: DEMO_STAFF_COURSES.length,
  totalEnrolledStudents: DEMO_STAFF_COURSES.reduce(
    (sum, c) => sum + c.studentCount,
    0
  ),
  teachingResourcesCount: DEMO_STAFF_RESOURCES.length,
  academicPoliciesCount: DEMO_ACADEMIC_POLICIES.length,
  activeQuizzesCount: DEMO_STAFF_COURSES.reduce(
    (sum, c) => sum + c.activeQuizzesCount,
    0
  ),
  averageAttendanceRate: 86.4,
  academicStaffName: "Prof. D. Karunaratne",
  departmentName: "Department of Software Engineering",
};
