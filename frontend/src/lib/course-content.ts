export interface CourseSupplementaryInfo {
  description: string;
  learningObjectives: string[];
  prerequisites?: string[];
}

export const COURSE_SUPPLEMENTARY_INFO: Record<
  string,
  CourseSupplementaryInfo
> = {
  "crs-101": {
    description:
      "An introduction to computational thinking, programming fundamentals, and practical problem solving.",
    learningObjectives: [
      "Design algorithms using variables, selection, and iteration.",
      "Write, test, and explain small programs.",
    ],
  },
  "crs-102": {
    description:
      "Foundational discrete structures used to reason about computation and software.",
    learningObjectives: [
      "Apply logic, set theory, and proof techniques to computing problems.",
      "Use relations, functions, and counting methods to model problems.",
    ],
  },
  "crs-103": {
    description:
      "Core computer organization concepts, from binary representation to processor architecture.",
    learningObjectives: [
      "Explain how processor, memory, and input/output components interact.",
      "Trace machine-level data representation and instruction execution.",
    ],
  },
  "crs-104": {
    description:
      "Academic communication practices for clear technical writing, research, and presentations.",
    learningObjectives: [
      "Structure concise academic and technical documents.",
      "Present ideas clearly and cite sources responsibly.",
    ],
  },
  "crs-105": {
    description:
      "An overview of information systems, their organizational role, and their supporting technologies.",
    learningObjectives: [
      "Distinguish common information-system components and types.",
      "Describe how information systems support organizational processes.",
    ],
  },
  "crs-106": {
    description:
      "Object-oriented programming with Java, including class design, inheritance, and exception handling.",
    learningObjectives: [
      "Model program domains with classes, objects, and interfaces.",
      "Build and test Java programs using core object-oriented features.",
    ],
    prerequisites: ["CS101"],
  },
  "crs-107": {
    description:
      "Essential data structures and algorithmic techniques for organizing and processing information.",
    learningObjectives: [
      "Select suitable linear and non-linear data structures for a problem.",
      "Analyze basic algorithm efficiency using asymptotic notation.",
    ],
    prerequisites: ["CS101"],
  },
  "crs-108": {
    description:
      "Linear algebra and probability concepts with applications to computing and data analysis.",
    learningObjectives: [
      "Solve problems involving vectors, matrices, and linear transformations.",
      "Apply probability models to elementary computational problems.",
    ],
    prerequisites: ["CS102"],
  },
  "crs-109": {
    description:
      "Relational database foundations, data modeling, SQL, and the principles of reliable data storage.",
    learningObjectives: [
      "Translate requirements into relational schemas.",
      "Write SQL queries and explain normalization choices.",
    ],
  },
  "crs-110": {
    description:
      "Digital representation and logic design, with an introduction to microprocessor systems.",
    learningObjectives: [
      "Analyze Boolean expressions and basic combinational circuits.",
      "Explain the role of registers, instructions, and microprocessors.",
    ],
  },
  "crs-201": {
    description:
      "Advanced data structures, graph algorithms, and methods for evaluating algorithm performance.",
    learningObjectives: [
      "Choose and implement advanced structures for computational tasks.",
      "Compare graph and optimization algorithms by complexity and behavior.",
    ],
    prerequisites: ["CS107"],
  },
  "crs-202": {
    description:
      "Software engineering principles, lifecycle models, requirements, and disciplined development practices.",
    learningObjectives: [
      "Compare software lifecycle and development approaches.",
      "Relate requirements and quality goals to engineering decisions.",
    ],
    prerequisites: ["CS106"],
  },
  "crs-203": {
    description:
      "Operating-system services, process management, concurrency, and resource coordination.",
    learningObjectives: [
      "Explain process, memory, and file-management responsibilities.",
      "Reason about synchronization and common concurrency hazards.",
    ],
    prerequisites: ["CS103", "CS106"],
  },
  "crs-204": {
    description:
      "Relational database design and administration, including transactions and data integrity.",
    learningObjectives: [
      "Design normalized schemas and enforce integrity constraints.",
      "Explain transaction properties and common concurrency controls.",
    ],
    prerequisites: ["CS109"],
  },
  "crs-205": {
    description:
      "Statistical foundations and empirical methods for planning and evaluating computing research.",
    learningObjectives: [
      "Choose suitable descriptive and inferential methods for research data.",
      "Plan a reproducible study and interpret its limitations.",
    ],
    prerequisites: ["CS102"],
  },
  "crs-206": {
    description:
      "Software architecture, design patterns, and trade-offs in structuring maintainable systems.",
    learningObjectives: [
      "Compare architectural styles against functional and quality needs.",
      "Apply design patterns while evaluating their trade-offs.",
    ],
    prerequisites: ["SE202"],
  },
  "crs-207": {
    description:
      "Network protocols and distributed-system concepts for communication across connected services.",
    learningObjectives: [
      "Explain network layers and the responsibilities of common protocols.",
      "Analyze basic reliability and coordination concerns in distributed systems.",
    ],
    prerequisites: ["CS103"],
  },
  "crs-208": {
    description:
      "Engineering web applications and APIs, from client-server foundations to service integration.",
    learningObjectives: [
      "Design and implement structured web APIs.",
      "Apply validation, security, and testing practices to web services.",
    ],
    prerequisites: ["CS106", "CS109"],
  },
  "crs-209": {
    description:
      "Requirements discovery and agile methods for guiding collaborative software development.",
    learningObjectives: [
      "Elicit, document, and validate stakeholder requirements.",
      "Plan iterative work and evaluate progress using agile practices.",
    ],
    prerequisites: ["SE202"],
  },
  "crs-210": {
    description:
      "Human-centered interaction design, usability evaluation, and accessible user experiences.",
    learningObjectives: [
      "Develop user-centered interface concepts from user needs.",
      "Evaluate usability and accessibility with appropriate methods.",
    ],
    prerequisites: ["SE202"],
  },
  "crs-301": {
    description:
      "Advanced software engineering topics, including verification and quality assurance for complex systems.",
    learningObjectives: [
      "Select verification techniques for software requirements and risks.",
      "Evaluate quality evidence across the software lifecycle.",
    ],
    prerequisites: ["SE202", "SE206"],
  },
  "crs-302": {
    description:
      "Artificial intelligence methods and knowledge representation for building intelligent systems.",
    learningObjectives: [
      "Compare search, learning, and knowledge-representation approaches.",
      "Assess the suitability and limitations of AI techniques for a task.",
    ],
    prerequisites: ["SE201"],
  },
  "crs-303": {
    description:
      "Cloud infrastructure and DevOps practices for deploying and operating software reliably.",
    learningObjectives: [
      "Describe cloud service models and infrastructure components.",
      "Design a basic automated delivery and monitoring workflow.",
    ],
    prerequisites: ["SE207"],
  },
  "crs-304": {
    description:
      "Mobile application engineering, including platform capabilities, interaction patterns, and testing.",
    learningObjectives: [
      "Design mobile interfaces for device and platform constraints.",
      "Build and test a small mobile application using platform services.",
    ],
    prerequisites: ["SE208"],
  },
  "crs-305": {
    description:
      "Preparation of an undergraduate research proposal, with attention to ethics and responsible methods.",
    learningObjectives: [
      "Develop a focused research question and proposal structure.",
      "Identify ethical considerations and plan responsible research activity.",
    ],
    prerequisites: ["SE205", "SE209"],
  },
};
