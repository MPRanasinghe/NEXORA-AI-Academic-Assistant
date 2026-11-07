"use client";

import { useState, useEffect } from "react";

// ============================================================================
// Types: Explainable Agentic RAG System for Academic-Administration
// ============================================================================

export type DocumentCategory =
  | "Academic Regulations"
  | "Curriculum & Syllabi"
  | "Degree Requirements"
  | "Examination & Grading"
  | "Student Policies";

export type DocumentStatus = "Uploaded" | "Processing" | "Indexed" | "Failed";

export interface AcademicDocument {
  id: string;
  title: string;
  filename: string;
  fileType: "PDF" | "TXT" | "DOCX" | "MD";
  fileSize: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedAt: string;
  chunkCount: number;
  tokenCount: number;
  description: string;
  metadata: {
    faculty: string;
    department: string;
    academicYear: string;
    version: string;
    author: string;
  };
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  section: string;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  termFrequencies: Record<string, number>;
  denseEmbeddingPreview: number[]; // Representative sample values from 768-d vector
  magnitude: number;
}

export interface ProcessingJob {
  id: string;
  documentId: string;
  documentTitle: string;
  stage:
    | "Text Extraction"
    | "Cleaning"
    | "Chunking"
    | "Metadata Assignment"
    | "Sparse Indexing"
    | "Dense Embedding"
    | "Index Storage"
    | "Completed";
  status: "Pending" | "Running" | "Completed" | "Failed";
  progress: number;
  startedAt: string;
  durationMs: number;
  logs: string[];
  error?: string;
}

export interface RetrievalResult {
  chunkId: string;
  documentTitle: string;
  section: string;
  text: string;
  sparseScore: number; // TF-IDF cosine score
  denseScore: number;  // Dense cosine score
  normalizedSparseScore: number;
  normalizedDenseScore: number;
  hybridScore: number;
  rank: number;
  matchedTerms: string[];
  sparseMath: {
    queryTerms: string[];
    termFrequencies: Record<string, number>;
    idfValues: Record<string, number>;
    tfIdfWeights: Record<string, number>;
    dotProduct: number;
    queryMagnitude: number;
    docMagnitude: number;
    cosineSimilarity: number;
  };
  denseMath: {
    dimensions: number;
    queryVectorPreview: number[];
    docVectorPreview: number[];
    dotProduct: number;
    cosineSimilarity: number;
  };
}

export interface AgentStepTrace {
  stepNumber: number;
  cycle: "Observation" | "Reasoning" | "Action";
  timestamp: string;
  details: {
    title: string;
    summary: string;
    data?: Record<string, unknown>;
  };
}

export interface AgentExecution {
  id: string;
  query: string;
  status: "Success" | "Iterating" | "Max Iterations Reached" | "Failed";
  startedAt: string;
  durationMs: number;
  iterationCount: number;
  retrievalActionCount: number;
  evidenceCount: number;
  sufficiencyScore: number; // 0.0 to 1.0
  finalAnswer: string;
  citations: string[];
  traces: AgentStepTrace[];
}

export interface GroundTruthEntry {
  id: string;
  question: string;
  expectedAnswer: string;
  referenceContext: string;
  relevantDocIds: string[];
  category:
    | "Policy Interpretation"
    | "Prerequisite Logic"
    | "Administrative Regulation"
    | "Degree Clearance"
    | "Academic Regulations";
  difficulty: "Standard" | "Multi-step" | "Complex Regulation";
  createdAt: string;
  lastEvaluatedAt?: string;
  lastScores?: {
    contextRelevance: number;
    groundedness: number;
    answerRelevance: number;
  };
}

export interface EvaluationRun {
  id: string;
  timestamp: string;
  datasetSize: number;
  meanContextRelevance: number;
  meanGroundedness: number;
  meanAnswerRelevance: number;
  overallScore: number;
  retrievalMethod: "TF-IDF" | "Dense" | "Hybrid (α=0.60)";
  status: "Completed" | "Running";
  perQuestionResults: {
    entryId: string;
    question: string;
    contextRelevance: number;
    groundedness: number;
    answerRelevance: number;
    notes: string;
  }[];
}

export interface ModelConfiguration {
  embeddingModel: string;
  embeddingDimensions: number;
  chunkSize: number;
  chunkOverlap: number;
  sparseAlgorithm: "TF-IDF (Sublinear TF)" | "BM25" | "Standard TF-IDF";
  sparseTopK: number;
  denseMetric: "Cosine Similarity" | "Dot Product" | "Euclidean Distance";
  denseThreshold: number;
  denseTopK: number;
  hybridAlpha: number; // weight for sparse (0.0 to 1.0), dense is 1 - alpha
  agentMaxIterations: number;
  agentActionLimit: number;
  agentSufficiencyThreshold: number;
  generationModel: string;
  temperature: number;
  maxResponseTokens: number;
}

// ============================================================================
// Default Seed Data (Academic-Administration Domain)
// ============================================================================

export const DEFAULT_DOCUMENTS: AcademicDocument[] = [
  {
    id: "doc-01",
    title: "University Undergraduate Academic Regulations & Standing",
    filename: "Academic_Regulations_Standing_2026.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    category: "Academic Regulations",
    status: "Indexed",
    uploadedAt: "2026-10-12 09:30",
    chunkCount: 24,
    tokenCount: 14850,
    description: "Official policy on GPA thresholds, warning notices, probation removal criteria, and academic suspension rules.",
    metadata: {
      faculty: "Office of Academic Registrar",
      department: "Academic Affairs",
      academicYear: "2025/2026",
      version: "v4.2",
      author: "Senate Academic Policy Committee",
    },
  },
  {
    id: "doc-02",
    title: "Faculty of Computing Prerequisite & Credit Transfer Handbook",
    filename: "Computing_Prerequisite_Handbook.pdf",
    fileType: "PDF",
    fileSize: "1.8 MB",
    category: "Degree Requirements",
    status: "Indexed",
    uploadedAt: "2026-10-18 14:15",
    chunkCount: 18,
    tokenCount: 11200,
    description: "Course dependency chains, waiver processes for CS204 and CS305, and credit equivalencies from accredited institutions.",
    metadata: {
      faculty: "Faculty of Computing & Information Technology",
      department: "Computer Science",
      academicYear: "2025/2026",
      version: "v3.0",
      author: "Curriculum Advisory Board",
    },
  },
  {
    id: "doc-03",
    title: "Grade Appeal and Examination Conduct Guidelines",
    filename: "Grade_Appeal_Guidelines.docx",
    fileType: "DOCX",
    fileSize: "680 KB",
    category: "Examination & Grading",
    status: "Indexed",
    uploadedAt: "2026-10-25 11:00",
    chunkCount: 12,
    tokenCount: 7450,
    description: "Procedures and timelines for student re-scrutiny, re-marking, formal board reviews, and special consideration claims.",
    metadata: {
      faculty: "Senate Examination Board",
      department: "Examinations Branch",
      academicYear: "2025/2026",
      version: "v2.1",
      author: "Examination Controller",
    },
  },
  {
    id: "doc-04",
    title: "BSc in Software Engineering Degree Clearance & Honours Criteria",
    filename: "SE_Honours_Clearance_Criteria.md",
    fileType: "MD",
    fileSize: "320 KB",
    category: "Curriculum & Syllabi",
    status: "Indexed",
    uploadedAt: "2026-11-01 16:45",
    chunkCount: 15,
    tokenCount: 9300,
    description: "Core credit distribution, capstone thesis prerequisites, industrial internship clearance, and first-class honours cutoffs.",
    metadata: {
      faculty: "Faculty of Computing & Information Technology",
      department: "Software Engineering",
      academicYear: "2025/2026",
      version: "v1.4",
      author: "Prof. D. Karunaratne",
    },
  },
  {
    id: "doc-05",
    title: "Student Attendance & Medical Leave Protocol",
    filename: "Attendance_Medical_Protocol.pdf",
    fileType: "PDF",
    fileSize: "940 KB",
    category: "Student Policies",
    status: "Processing",
    uploadedAt: "2026-11-07 10:20",
    chunkCount: 8,
    tokenCount: 4600,
    description: "Mandatory 80% attendance rule, valid medical certificate endorsement window, and condonation appeal procedures.",
    metadata: {
      faculty: "Student Welfare Division",
      department: "Academic Services",
      academicYear: "2025/2026",
      version: "v1.1",
      author: "Dean of Student Affairs",
    },
  },
];

export const DEFAULT_CHUNKS: DocumentChunk[] = [
  {
    id: "chunk-reg-014",
    documentId: "doc-01",
    documentTitle: "University Undergraduate Academic Regulations & Standing",
    section: "Section 4.3 — Academic Probation & Removal Conditions",
    chunkIndex: 14,
    text: "A student whose Semester Grade Point Average (SGPA) falls below 2.00 in any academic semester shall be placed on Academic Probation for the subsequent semester. To remove probation status, the student must achieve an SGPA of at least 2.25 and a Cumulative GPA (CGPA) of at least 2.00 while carrying a minimum workload of 12 academic credits. Failure to meet these criteria across two consecutive semesters results in referral to the Academic Review Board for suspension.",
    tokenCount: 86,
    termFrequencies: {
      probation: 3,
      academic: 4,
      gpa: 3,
      sgpa: 2,
      cgpa: 1,
      credits: 1,
      removal: 1,
      suspension: 1,
      semester: 3,
      threshold: 1,
    },
    denseEmbeddingPreview: [0.082, -0.214, 0.491, -0.012, 0.334, -0.158, 0.602, 0.119],
    magnitude: 1.0,
  },
  {
    id: "chunk-reg-015",
    documentId: "doc-01",
    documentTitle: "University Undergraduate Academic Regulations & Standing",
    section: "Section 4.4 — Academic Warning vs Formal Probation",
    chunkIndex: 15,
    text: "An Academic Warning is an administrative notification issued when a student's CGPA remains between 2.00 and 2.15, alerting them to potential probation risks. Unlike Formal Probation, an Academic Warning does not restrict enrollment in co-curricular activities, nor does it limit maximum semester credit registration below 18 credits.",
    tokenCount: 62,
    termFrequencies: {
      warning: 3,
      academic: 3,
      probation: 2,
      cgpa: 1,
      credits: 2,
      enrollment: 1,
      registration: 1,
    },
    denseEmbeddingPreview: [0.041, -0.198, 0.380, 0.045, 0.281, -0.091, 0.490, 0.075],
    magnitude: 0.98,
  },
  {
    id: "chunk-cs-008",
    documentId: "doc-02",
    documentTitle: "Faculty of Computing Prerequisite & Credit Transfer Handbook",
    section: "Section 3.1 — Prerequisite Waiver Criteria for Advanced Modules",
    chunkIndex: 8,
    text: "Prerequisite module requirements may only be waived under exceptional academic grounds approved by both the Course Director and Head of Department. A student requesting a waiver for CS305 (Advanced Software Engineering) without having completed CS204 (Database Systems) must demonstrate verified industry experience or complete an equivalency assessment with a minimum passing score of 70%.",
    tokenCount: 74,
    termFrequencies: {
      prerequisite: 3,
      waiver: 3,
      requirements: 1,
      department: 1,
      cs305: 1,
      cs204: 1,
      approval: 1,
      assessment: 1,
      score: 1,
    },
    denseEmbeddingPreview: [-0.112, 0.442, -0.054, 0.388, 0.190, 0.298, -0.140, 0.512],
    magnitude: 1.0,
  },
  {
    id: "chunk-appeal-005",
    documentId: "doc-03",
    documentTitle: "Grade Appeal and Examination Conduct Guidelines",
    section: "Section 2.4 — Deadline and Fee Schedule for Re-scrutiny",
    chunkIndex: 5,
    text: "Formal requests for grade re-scrutiny must be submitted via the Academic Information System within fourteen (14) calendar days of official grade publication. A non-refundable processing fee of $25 per module applies. If a re-scrutiny results in an upward grade correction of one full letter grade or more, the processing fee shall be refunded in full to the student.",
    tokenCount: 69,
    termFrequencies: {
      grade: 3,
      appeal: 1,
      scrutiny: 3,
      publication: 1,
      fee: 2,
      refunded: 1,
      days: 1,
      module: 1,
    },
    denseEmbeddingPreview: [0.221, -0.089, 0.112, 0.510, -0.312, 0.040, 0.320, -0.190],
    magnitude: 0.97,
  },
  {
    id: "chunk-se-011",
    documentId: "doc-04",
    documentTitle: "BSc in Software Engineering Degree Clearance & Honours Criteria",
    section: "Section 5.2 — First-Class Honours Minimum CGPA & Capstone Requirements",
    chunkIndex: 11,
    text: "Award of First-Class Honours in BSc (Hons) Software Engineering requires an overall Cumulative GPA (CGPA) of not less than 3.70 calculated across all four academic levels, successful completion of all core modules without an unresolved failing grade, and an evaluated grade of 'A-' or higher in the final-year capstone research project (SE499).",
    tokenCount: 71,
    termFrequencies: {
      honours: 2,
      cgpa: 2,
      firstclass: 1,
      capstone: 2,
      research: 1,
      project: 1,
      grade: 2,
      requirements: 1,
    },
    denseEmbeddingPreview: [0.310, 0.180, 0.245, -0.190, 0.420, -0.210, 0.110, 0.490],
    magnitude: 1.0,
  },
];

export const DEFAULT_PROCESSING_JOBS: ProcessingJob[] = [
  {
    id: "job-101",
    documentId: "doc-01",
    documentTitle: "University Undergraduate Academic Regulations & Standing",
    stage: "Completed",
    status: "Completed",
    progress: 100,
    startedAt: "2026-10-12 09:30",
    durationMs: 4120,
    logs: [
      "[09:30:01] Ingested PDF file: 2.4 MB (24 pages)",
      "[09:30:02] Text extraction completed: 14,850 tokens recovered",
      "[09:30:03] Normalization & sentence boundary detection finished",
      "[09:30:03] Recursive chunking executed: 24 chunks generated (target: 512 tokens, overlap: 64)",
      "[09:30:04] Sparse vocabulary inverted index generated: 1,420 unique academic terms indexed",
      "[09:30:05] Dense embeddings computed with text-embedding-3-small (768-d)",
      "[09:30:05] Chunks persisted with dual sparse-dense vector representation in demo repository",
    ],
  },
  {
    id: "job-102",
    documentId: "doc-02",
    documentTitle: "Faculty of Computing Prerequisite & Credit Transfer Handbook",
    stage: "Completed",
    status: "Completed",
    progress: 100,
    startedAt: "2026-10-18 14:15",
    durationMs: 3450,
    logs: [
      "[14:15:00] Ingested PDF file: 1.8 MB (18 pages)",
      "[14:15:01] Text extraction & OCR sanity check passed",
      "[14:15:02] Chunking: 18 chunks produced with section metadata tags",
      "[14:15:03] Computed sublinear TF and document frequency tables",
      "[14:15:03] Generated dense vectors for each chunk representation",
      "[14:15:04] Indexing completed successfully",
    ],
  },
  {
    id: "job-103",
    documentId: "doc-05",
    documentTitle: "Student Attendance & Medical Leave Protocol",
    stage: "Chunking",
    status: "Running",
    progress: 45,
    startedAt: "2026-11-07 10:20",
    durationMs: 1800,
    logs: [
      "[10:20:01] File upload accepted: Attendance_Medical_Protocol.pdf",
      "[10:20:02] Text extraction complete (4,600 tokens extracted)",
      "[10:20:03] Cleaning text and removing header/footer artifacts",
      "[10:20:04] In progress: Boundary chunking on attendance regulations...",
    ],
  },
];

export const DEFAULT_AGENT_EXECUTIONS: AgentExecution[] = [
  {
    id: "exec-2026-0891",
    query: "What are the exact GPA conditions required to be removed from Academic Probation, and what happens if I take fewer than 12 credits?",
    status: "Success",
    startedAt: "2026-11-06 14:22:10",
    durationMs: 2410,
    iterationCount: 2,
    retrievalActionCount: 3,
    evidenceCount: 2,
    sufficiencyScore: 0.94,
    finalAnswer:
      "To be removed from Academic Probation under Section 4.3 of the University Academic Regulations, you must simultaneously satisfy three criteria: (1) achieve a Semester GPA (SGPA) of at least 2.25, (2) achieve a Cumulative GPA (CGPA) of at least 2.00, and (3) carry a minimum workload of 12 academic credits during that semester. If you enroll in fewer than 12 credits, your probation status cannot be cleared for that semester regardless of GPA achieved, and you remain on probation until a qualifying semester is completed.",
    citations: [
      "Academic_Regulations_Standing_2026.pdf (Section 4.3)",
      "Academic_Regulations_Standing_2026.pdf (Section 4.4)",
    ],
    traces: [
      {
        stepNumber: 1,
        cycle: "Observation",
        timestamp: "14:22:10.120",
        details: {
          title: "Initial Query Ingestion & Goal Identification",
          summary:
            "Analyzed multi-part query: Target 1 = probation removal criteria; Target 2 = credit minimum constraint behavior.",
        },
      },
      {
        stepNumber: 2,
        cycle: "Reasoning",
        timestamp: "14:22:10.350",
        details: {
          title: "Query Decomposition & Retrieval Planning",
          summary:
            "Decomposed query into terms ['academic probation removal', 'gpa threshold', 'minimum credits']. Chose Hybrid Retrieval (α=0.60) to capture exact numerical regulations and conceptual policy context.",
        },
      },
      {
        stepNumber: 3,
        cycle: "Action",
        timestamp: "14:22:10.820",
        details: {
          title: "Tool Execution: Hybrid Retriever",
          summary:
            "Dispatched retrieval with query: 'Academic probation removal SGPA CGPA minimum 12 credits'. Retrieved chunk-reg-014 (Hybrid score: 0.892).",
        },
      },
      {
        stepNumber: 4,
        cycle: "Observation",
        timestamp: "14:22:11.200",
        details: {
          title: "Evidence Evaluation & Gap Detection",
          summary:
            "Retrieved chunk provides SGPA 2.25 and CGPA 2.00 thresholds. Need secondary check regarding distinction between Warning and Probation credit caps.",
        },
      },
      {
        stepNumber: 5,
        cycle: "Action",
        timestamp: "14:22:11.510",
        details: {
          title: "Secondary Targeted Retrieval",
          summary:
            "Dispatched retrieval for 'credit registration restriction academic warning probation'. Retrieved chunk-reg-015.",
        },
      },
      {
        stepNumber: 6,
        cycle: "Reasoning",
        timestamp: "14:22:12.010",
        details: {
          title: "Sufficiency Verification & Answer Synthesis",
          summary:
            "Evidence sufficiency reached 0.94. Context is directly grounded in official regulations. Proceeding to grounded generation without hallucinations.",
        },
      },
    ],
  },
  {
    id: "exec-2026-0892",
    query: "Can a student skip CS204 Database Systems to take CS305 Advanced Software Engineering with department approval?",
    status: "Success",
    startedAt: "2026-11-06 16:05:44",
    durationMs: 1820,
    iterationCount: 1,
    retrievalActionCount: 1,
    evidenceCount: 1,
    sufficiencyScore: 0.91,
    finalAnswer:
      "Yes, under Section 3.1 of the Faculty of Computing Prerequisite & Credit Transfer Handbook, a student can be granted a prerequisite waiver for CS305 without having completed CS204. However, this is not automatic with department approval alone: the student must (1) obtain joint written approval from both the Course Director and Head of Department on exceptional academic grounds, and (2) either demonstrate verified industry experience or achieve at least 70% in an official equivalency assessment.",
    citations: ["Computing_Prerequisite_Handbook.pdf (Section 3.1)"],
    traces: [
      {
        stepNumber: 1,
        cycle: "Observation",
        timestamp: "16:05:44.050",
        details: {
          title: "Query Parsing",
          summary: "Identified prerequisite waiver question regarding CS204 and CS305.",
        },
      },
      {
        stepNumber: 2,
        cycle: "Reasoning",
        timestamp: "16:05:44.220",
        details: {
          title: "Retrieval Strategy Formulation",
          summary: "Prioritizing Computing Prerequisite Handbook chunks matching 'CS204' and 'CS305'.",
        },
      },
      {
        stepNumber: 3,
        cycle: "Action",
        timestamp: "16:05:44.680",
        details: {
          title: "Hybrid Retrieval Execution",
          summary: "Executed hybrid query. Retrieved chunk-cs-008 with hybrid similarity score of 0.884.",
        },
      },
      {
        stepNumber: 4,
        cycle: "Reasoning",
        timestamp: "16:05:45.100",
        details: {
          title: "Sufficiency Check & Direct Synthesis",
          summary: "Chunk directly answers waiver conditions, dual approval requirements, and 70% test threshold.",
        },
      },
    ],
  },
  {
    id: "exec-2026-0893",
    query: "What is the fee for appealing a final grade and can I get a refund if my grade goes up?",
    status: "Success",
    startedAt: "2026-11-07 08:14:02",
    durationMs: 1540,
    iterationCount: 1,
    retrievalActionCount: 1,
    evidenceCount: 1,
    sufficiencyScore: 0.96,
    finalAnswer:
      "According to Section 2.4 of the Grade Appeal and Examination Conduct Guidelines, the non-refundable processing fee for grade re-scrutiny is $25 per module, and the application must be submitted within 14 calendar days of grade publication. If the re-scrutiny leads to an upward correction of one full letter grade or higher, the $25 processing fee is refunded in full.",
    citations: ["Grade_Appeal_Guidelines.docx (Section 2.4)"],
    traces: [
      {
        stepNumber: 1,
        cycle: "Observation",
        timestamp: "08:14:02.100",
        details: {
          title: "Query Receipt",
          summary: "Identified dual intent: Grade appeal fee amount + refund terms upon grade increase.",
        },
      },
      {
        stepNumber: 2,
        cycle: "Action",
        timestamp: "08:14:02.500",
        details: {
          title: "Sparse & Dense Retrieval",
          summary: "Searched terms 'grade appeal fee refund re-scrutiny'. Retrieved chunk-appeal-005.",
        },
      },
      {
        stepNumber: 3,
        cycle: "Reasoning",
        timestamp: "08:14:03.200",
        details: {
          title: "Synthesis",
          summary: "Evidence satisfies both query constraints with exact figures ($25, 14 days, full letter grade refund trigger).",
        },
      },
    ],
  },
];

export const DEFAULT_GROUND_TRUTH_DATASET: GroundTruthEntry[] = [
  {
    id: "gt-001",
    question: "What are the required GPA levels and minimum credit hours to clear Academic Probation status?",
    expectedAnswer:
      "A student on probation must achieve an SGPA of at least 2.25 and a CGPA of at least 2.00 while completing at least 12 academic credits in that semester.",
    referenceContext:
      "To remove probation status, the student must achieve an SGPA of at least 2.25 and a Cumulative GPA (CGPA) of at least 2.00 while carrying a minimum workload of 12 academic credits. (Section 4.3)",
    relevantDocIds: ["doc-01"],
    category: "Academic Regulations",
    difficulty: "Standard",
    createdAt: "2026-10-15",
    lastEvaluatedAt: "2026-11-06 18:00",
    lastScores: {
      contextRelevance: 0.96,
      groundedness: 0.98,
      answerRelevance: 0.95,
    },
  },
  {
    id: "gt-002",
    question: "Can CS305 prerequisite requirements be waived without completing CS204, and what are the prerequisites for such a waiver?",
    expectedAnswer:
      "Yes, with joint approval from the Course Director and Head of Department on exceptional grounds, plus either verified industry experience or scoring at least 70% in an equivalency exam.",
    referenceContext:
      "Prerequisite module requirements may only be waived under exceptional academic grounds approved by both the Course Director and Head of Department... must demonstrate verified industry experience or complete an equivalency assessment with a minimum passing score of 70%. (Section 3.1)",
    relevantDocIds: ["doc-02"],
    category: "Prerequisite Logic",
    difficulty: "Multi-step",
    createdAt: "2026-10-20",
    lastEvaluatedAt: "2026-11-06 18:00",
    lastScores: {
      contextRelevance: 0.92,
      groundedness: 0.95,
      answerRelevance: 0.94,
    },
  },
  {
    id: "gt-003",
    question: "What is the deadline for submitting a grade re-scrutiny appeal and under what condition is the $25 fee refunded?",
    expectedAnswer:
      "The deadline is within 14 calendar days of official grade publication. The $25 fee is refunded in full if re-scrutiny results in an upward grade correction of one full letter grade or more.",
    referenceContext:
      "Formal requests for grade re-scrutiny must be submitted via the Academic Information System within fourteen (14) calendar days of official grade publication... refunded in full to the student if correction is one full letter grade or more. (Section 2.4)",
    relevantDocIds: ["doc-03"],
    category: "Administrative Regulation",
    difficulty: "Standard",
    createdAt: "2026-10-28",
    lastEvaluatedAt: "2026-11-06 18:00",
    lastScores: {
      contextRelevance: 0.95,
      groundedness: 0.99,
      answerRelevance: 0.97,
    },
  },
  {
    id: "gt-004",
    question: "What are the criteria to graduate with First-Class Honours in Software Engineering?",
    expectedAnswer:
      "Overall CGPA of at least 3.70 across all four levels, no unresolved failing grades in core modules, and an evaluated grade of 'A-' or higher in the final-year capstone project (SE499).",
    referenceContext:
      "Award of First-Class Honours in BSc (Hons) Software Engineering requires an overall Cumulative GPA (CGPA) of not less than 3.70... no unresolved failing grade, and an evaluated grade of 'A-' or higher in SE499. (Section 5.2)",
    relevantDocIds: ["doc-04"],
    category: "Degree Clearance",
    difficulty: "Multi-step",
    createdAt: "2026-11-02",
    lastEvaluatedAt: "2026-11-06 18:00",
    lastScores: {
      contextRelevance: 0.90,
      groundedness: 0.93,
      answerRelevance: 0.91,
    },
  },
  {
    id: "gt-005",
    question: "What is the difference in academic rights between an Academic Warning and Formal Academic Probation?",
    expectedAnswer:
      "Academic Warning does not restrict enrollment in co-curricular activities and does not limit semester registration below 18 credits, whereas formal probation imposes restricted registration and academic review.",
    referenceContext:
      "Unlike Formal Probation, an Academic Warning does not restrict enrollment in co-curricular activities, nor does it limit maximum semester credit registration below 18 credits. (Section 4.4)",
    relevantDocIds: ["doc-01"],
    category: "Policy Interpretation",
    difficulty: "Complex Regulation",
    createdAt: "2026-11-03",
    lastEvaluatedAt: "2026-11-06 18:00",
    lastScores: {
      contextRelevance: 0.88,
      groundedness: 0.91,
      answerRelevance: 0.89,
    },
  },
];

export const DEFAULT_MODEL_CONFIG: ModelConfiguration = {
  embeddingModel: "text-embedding-3-small",
  embeddingDimensions: 768,
  chunkSize: 512,
  chunkOverlap: 64,
  sparseAlgorithm: "TF-IDF (Sublinear TF)",
  sparseTopK: 5,
  denseMetric: "Cosine Similarity",
  denseThreshold: 0.65,
  denseTopK: 5,
  hybridAlpha: 0.6,
  agentMaxIterations: 4,
  agentActionLimit: 6,
  agentSufficiencyThreshold: 0.85,
  generationModel: "gemini-1.5-pro",
  temperature: 0.2,
  maxResponseTokens: 2048,
};

// ============================================================================
// LocalStorage Persistence Keys
// ============================================================================

export const STORAGE_KEYS = {
  DOCUMENTS: "nexora_admin_documents_v1",
  CHUNKS: "nexora_admin_chunks_v1",
  JOBS: "nexora_admin_jobs_v1",
  EXECUTIONS: "nexora_admin_executions_v1",
  DATASET: "nexora_admin_dataset_v1",
  CONFIG: "nexora_admin_config_v1",
  LAST_EVAL: "nexora_admin_last_eval_v1",
};

// ============================================================================
// Safe Browser Storage Helpers
// ============================================================================

export function getStoredDocuments(): AcademicDocument[] {
  if (typeof window === "undefined") return DEFAULT_DOCUMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return raw ? JSON.parse(raw) : DEFAULT_DOCUMENTS;
  } catch {
    return DEFAULT_DOCUMENTS;
  }
}

export function saveStoredDocuments(docs: AcademicDocument[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  } catch (e) {
    console.error("Failed to save documents to localStorage:", e);
  }
}

export function getStoredChunks(): DocumentChunk[] {
  if (typeof window === "undefined") return DEFAULT_CHUNKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHUNKS);
    return raw ? JSON.parse(raw) : DEFAULT_CHUNKS;
  } catch {
    return DEFAULT_CHUNKS;
  }
}

export function saveStoredChunks(chunks: DocumentChunk[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHUNKS, JSON.stringify(chunks));
  } catch (e) {
    console.error("Failed to save chunks to localStorage:", e);
  }
}

export function getStoredJobs(): ProcessingJob[] {
  if (typeof window === "undefined") return DEFAULT_PROCESSING_JOBS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
    return raw ? JSON.parse(raw) : DEFAULT_PROCESSING_JOBS;
  } catch {
    return DEFAULT_PROCESSING_JOBS;
  }
}

export function saveStoredJobs(jobs: ProcessingJob[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  } catch (e) {
    console.error("Failed to save jobs to localStorage:", e);
  }
}

export function getStoredExecutions(): AgentExecution[] {
  if (typeof window === "undefined") return DEFAULT_AGENT_EXECUTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXECUTIONS);
    return raw ? JSON.parse(raw) : DEFAULT_AGENT_EXECUTIONS;
  } catch {
    return DEFAULT_AGENT_EXECUTIONS;
  }
}

export function saveStoredExecutions(execs: AgentExecution[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify(execs));
  } catch (e) {
    console.error("Failed to save agent executions to localStorage:", e);
  }
}

export function getStoredDataset(): GroundTruthEntry[] {
  if (typeof window === "undefined") return DEFAULT_GROUND_TRUTH_DATASET;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DATASET);
    return raw ? JSON.parse(raw) : DEFAULT_GROUND_TRUTH_DATASET;
  } catch {
    return DEFAULT_GROUND_TRUTH_DATASET;
  }
}

export function saveStoredDataset(dataset: GroundTruthEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.DATASET, JSON.stringify(dataset));
  } catch (e) {
    console.error("Failed to save dataset to localStorage:", e);
  }
}

export function getStoredConfig(): ModelConfiguration {
  if (typeof window === "undefined") return DEFAULT_MODEL_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return raw ? JSON.parse(raw) : DEFAULT_MODEL_CONFIG;
  } catch {
    return DEFAULT_MODEL_CONFIG;
  }
}

export function saveStoredConfig(config: ModelConfiguration): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config to localStorage:", e);
  }
}

export function resetAllAdminData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
  localStorage.removeItem(STORAGE_KEYS.CHUNKS);
  localStorage.removeItem(STORAGE_KEYS.JOBS);
  localStorage.removeItem(STORAGE_KEYS.EXECUTIONS);
  localStorage.removeItem(STORAGE_KEYS.DATASET);
  localStorage.removeItem(STORAGE_KEYS.CONFIG);
  localStorage.removeItem(STORAGE_KEYS.LAST_EVAL);
}

// ============================================================================
// Mathematical Retrieval Simulation (Foundational VSM + Cosine Sim)
// ============================================================================

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

/**
 * Computes exact TF-IDF, Vector Space Model dot product, and Cosine Similarity
 * over academic chunks to demonstrate foundational text retrieval mathematics.
 */
export function calculateSparseRetrieval(
  query: string,
  chunks: DocumentChunk[]
): RetrievalResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  // 1. Calculate Query Term Frequencies
  const qtf: Record<string, number> = {};
  for (const token of queryTokens) {
    qtf[token] = (qtf[token] || 0) + 1;
  }

  // 2. Document Frequency across all chunks
  const N = chunks.length || 1;
  const df: Record<string, number> = {};
  for (const token of Object.keys(qtf)) {
    let count = 0;
    for (const chunk of chunks) {
      const chunkTokens = tokenize(chunk.text);
      if (chunkTokens.includes(token)) count++;
    }
    df[token] = count;
  }

  // 3. Inverse Document Frequency (Smoothed IDF: ln(1 + (N - df + 0.5) / (df + 0.5)))
  const idf: Record<string, number> = {};
  for (const token of Object.keys(qtf)) {
    const docCount = df[token] || 0;
    idf[token] = Math.max(0.2, Math.log(1 + (N - docCount + 0.5) / (docCount + 0.5)));
  }

  // Query vector magnitude
  let queryMagSq = 0;
  for (const token of Object.keys(qtf)) {
    const w = qtf[token] * idf[token];
    queryMagSq += w * w;
  }
  const queryMagnitude = Math.sqrt(queryMagSq) || 1.0;

  // 4. Score each chunk
  const results: RetrievalResult[] = chunks.map((chunk) => {
    const chunkTokens = tokenize(chunk.text);
    const chunkTf: Record<string, number> = {};
    for (const t of chunkTokens) {
      chunkTf[t] = (chunkTf[t] || 0) + 1;
    }

    let dotProduct = 0;
    const matchedTerms: string[] = [];
    const tfIdfWeights: Record<string, number> = {};

    for (const token of Object.keys(qtf)) {
      if (chunkTf[token]) {
        matchedTerms.push(token);
        // Sublinear TF scaling: (1 + ln(tf))
        const sublinearDocTf = 1 + Math.log(chunkTf[token]);
        const docWeight = sublinearDocTf * idf[token];
        const queryWeight = qtf[token] * idf[token];
        tfIdfWeights[token] = Number(docWeight.toFixed(4));
        dotProduct += queryWeight * docWeight;
      }
    }

    // Document vector magnitude approximation
    let docMagSq = 0;
    for (const t of Object.keys(chunkTf)) {
      const subTf = 1 + Math.log(chunkTf[t]);
      docMagSq += subTf * subTf;
    }
    const docMagnitude = Math.sqrt(docMagSq) || 1.0;

    // Cosine similarity = dotProduct / (|q| * |d|)
    const sparseScore = dotProduct > 0 ? dotProduct / (queryMagnitude * docMagnitude) : 0.0;

    // Simulate representative dense similarity based on query overlap + semantic embeddings
    const overlapRatio = matchedTerms.length / Math.max(1, Object.keys(qtf).length);
    const semanticBaseline = 0.52 + (overlapRatio * 0.42);
    const jitter = ((chunk.chunkIndex % 5) - 2) * 0.03;
    const denseScore = Math.min(0.98, Math.max(0.35, semanticBaseline + jitter));

    return {
      chunkId: chunk.id,
      documentTitle: chunk.documentTitle,
      section: chunk.section,
      text: chunk.text,
      sparseScore: Number(sparseScore.toFixed(4)),
      denseScore: Number(denseScore.toFixed(4)),
      normalizedSparseScore: 0,
      normalizedDenseScore: 0,
      hybridScore: 0,
      rank: 0,
      matchedTerms,
      sparseMath: {
        queryTerms: Object.keys(qtf),
        termFrequencies: chunkTf,
        idfValues: idf,
        tfIdfWeights,
        dotProduct: Number(dotProduct.toFixed(4)),
        queryMagnitude: Number(queryMagnitude.toFixed(4)),
        docMagnitude: Number(docMagnitude.toFixed(4)),
        cosineSimilarity: Number(sparseScore.toFixed(4)),
      },
      denseMath: {
        dimensions: 768,
        queryVectorPreview: [0.124, -0.312, 0.450, 0.089, -0.190, 0.220, 0.540, -0.040],
        docVectorPreview: chunk.denseEmbeddingPreview,
        dotProduct: Number((denseScore * 0.98).toFixed(4)),
        cosineSimilarity: Number(denseScore.toFixed(4)),
      },
    };
  });

  return results;
}

/**
 * Combines Sparse and Dense scores with configurable alpha:
 * Hybrid Score = α * SparseScore + (1 - α) * DenseScore
 */
export function calculateHybridRanking(
  results: RetrievalResult[],
  alpha: number = 0.6
): RetrievalResult[] {
  if (results.length === 0) return [];

  // Find min and max for normalization
  const sparseScores = results.map((r) => r.sparseScore);
  const denseScores = results.map((r) => r.denseScore);

  const maxSparse = Math.max(...sparseScores, 0.001);
  const minSparse = Math.min(...sparseScores);
  const maxDense = Math.max(...denseScores, 0.001);
  const minDense = Math.min(...denseScores);

  const normalized = results.map((r) => {
    const normSparse =
      maxSparse === minSparse ? r.sparseScore : (r.sparseScore - minSparse) / (maxSparse - minSparse);
    const normDense =
      maxDense === minDense ? r.denseScore : (r.denseScore - minDense) / (maxDense - minDense);

    const hybridScore = alpha * normSparse + (1 - alpha) * normDense;

    return {
      ...r,
      normalizedSparseScore: Number(normSparse.toFixed(4)),
      normalizedDenseScore: Number(normDense.toFixed(4)),
      hybridScore: Number(hybridScore.toFixed(4)),
    };
  });

  // Sort descending by hybridScore
  normalized.sort((a, b) => b.hybridScore - a.hybridScore);

  // Assign ranks
  return normalized.map((r, index) => ({
    ...r,
    rank: index + 1,
  }));
}

// ============================================================================
// React Custom Hooks for reactive storage sync
// ============================================================================

export function useAdminDocuments() {
  const [documents, setDocuments] = useState<AcademicDocument[]>(getStoredDocuments);

  const addDocument = (doc: AcademicDocument) => {
    const updated = [doc, ...documents];
    setDocuments(updated);
    saveStoredDocuments(updated);
  };

  const removeDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    saveStoredDocuments(updated);
  };

  const updateDocumentStatus = (id: string, status: DocumentStatus) => {
    const updated = documents.map((d) => (d.id === id ? { ...d, status } : d));
    setDocuments(updated);
    saveStoredDocuments(updated);
  };

  return { documents, addDocument, removeDocument, updateDocumentStatus };
}

export function useAdminDataset() {
  const [dataset, setDataset] = useState<GroundTruthEntry[]>(getStoredDataset);

  const addEntry = (entry: GroundTruthEntry) => {
    const updated = [entry, ...dataset];
    setDataset(updated);
    saveStoredDataset(updated);
  };

  const updateEntry = (id: string, updatedFields: Partial<GroundTruthEntry>) => {
    const updated = dataset.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
    setDataset(updated);
    saveStoredDataset(updated);
  };

  const removeEntry = (id: string) => {
    const updated = dataset.filter((e) => e.id !== id);
    setDataset(updated);
    saveStoredDataset(updated);
  };

  return { dataset, addEntry, updateEntry, removeEntry };
}

export function useAdminConfig() {
  const [config, setConfig] = useState<ModelConfiguration>(getStoredConfig);

  const saveConfig = (newConfig: ModelConfiguration) => {
    setConfig(newConfig);
    saveStoredConfig(newConfig);
  };

  const resetConfig = () => {
    setConfig(DEFAULT_MODEL_CONFIG);
    saveStoredConfig(DEFAULT_MODEL_CONFIG);
  };

  return { config, saveConfig, resetConfig };
}
