import type { ManagedQuiz } from "@/lib/quiz-storage";

export const DEMO_QUIZZES: ManagedQuiz[] = [
  {
    id: "quiz-01",
    title: "Introduction to Machine Learning",
    subject: "Artificial Intelligence",
    description:
      "Test your understanding of learning approaches, model evaluation, and overfitting.",
    difficulty: "Intermediate",
    duration: 20,
    maxAttempts: 1,
    questionCount: 3,
    attempts: 0,
    status: "Published",
    questions: [
      {
        id: "quiz-01-q1",
        question: "Which learning approach uses labeled examples?",
        options: [
          "Supervised learning",
          "Unsupervised learning",
          "Reinforcement learning",
          "Dimensionality reduction",
        ],
        correctAnswer: 0,
        explanation:
          "Supervised learning trains from examples that include target labels.",
      },
      {
        id: "quiz-01-q2",
        question: "What is overfitting?",
        options: [
          "A model that generalizes equally well to all data",
          "A model that fits training data too closely and generalizes poorly",
          "A model trained without any input data",
          "A model with no adjustable parameters",
        ],
        correctAnswer: 1,
        explanation:
          "An overfit model learns details of its training data that do not generalize.",
      },
      {
        id: "quiz-01-q3",
        question: "Which dataset is held out to estimate performance on unseen data?",
        options: [
          "Training set",
          "Test set",
          "Feature set",
          "Label set",
        ],
        correctAnswer: 1,
        explanation:
          "A separate test set estimates model performance on data not used for fitting.",
      },
    ],
  },
  {
    id: "quiz-02",
    title: "Database Management Systems",
    subject: "Computer Science",
    description:
      "Review relational tables, keys, SQL queries, and transaction properties.",
    difficulty: "Beginner",
    duration: 25,
    maxAttempts: 1,
    questionCount: 3,
    attempts: 0,
    status: "Published",
    questions: [
      {
        id: "quiz-02-q1",
        question: "What does a primary key identify in a relational table?",
        options: [
          "A unique row",
          "A database server",
          "A query plan",
          "A table's display name",
        ],
        correctAnswer: 0,
        explanation:
          "A primary key uniquely identifies each row in its table.",
      },
      {
        id: "quiz-02-q2",
        question: "Which SQL clause filters rows before grouping?",
        options: ["ORDER BY", "WHERE", "HAVING", "LIMIT"],
        correctAnswer: 1,
        explanation: "WHERE filters source rows before grouping and aggregation.",
      },
      {
        id: "quiz-02-q3",
        question: "Which ACID property means a transaction is all-or-nothing?",
        options: ["Isolation", "Durability", "Atomicity", "Consistency"],
        correctAnswer: 2,
        explanation:
          "Atomicity requires a transaction to complete fully or have no effect.",
      },
    ],
  },
  {
    id: "quiz-03",
    title: "Data Structures and Algorithms",
    subject: "Computer Science",
    description:
      "Evaluate basic complexity, data-structure behavior, and algorithm properties.",
    difficulty: "Advanced",
    duration: 30,
    maxAttempts: 1,
    questionCount: 3,
    attempts: 0,
    status: "Published",
    questions: [
      {
        id: "quiz-03-q1",
        question: "What is the average lookup complexity of a hash table?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 0,
        explanation:
          "With a suitable hash function and controlled collisions, lookup is O(1) on average.",
      },
      {
        id: "quiz-03-q2",
        question: "Which traversal visits a binary search tree in sorted order?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        correctAnswer: 1,
        explanation:
          "Inorder traversal visits left subtree, node, then right subtree.",
      },
      {
        id: "quiz-03-q3",
        question: "Which algorithm finds shortest paths in an unweighted graph?",
        options: [
          "Depth-first search",
          "Breadth-first search",
          "Insertion sort",
          "Binary search",
        ],
        correctAnswer: 1,
        explanation:
          "Breadth-first search explores by distance in edges and finds shortest unweighted paths.",
      },
    ],
  },
  {
    id: "quiz-04",
    title: "Software Engineering Principles",
    subject: "Software Engineering",
    description:
      "Practice requirements, testing, software design, and iterative development concepts.",
    difficulty: "Intermediate",
    duration: 35,
    maxAttempts: 1,
    questionCount: 3,
    attempts: 0,
    status: "Published",
    questions: [
      {
        id: "quiz-04-q1",
        question: "What is the primary purpose of a software requirement?",
        options: [
          "Describe a stakeholder need or system constraint",
          "Specify the source-code formatting",
          "Replace all software tests",
          "Record a deployment password",
        ],
        correctAnswer: 0,
        explanation:
          "Requirements describe needed behavior or constraints from relevant stakeholders.",
      },
      {
        id: "quiz-04-q2",
        question: "What does a unit test usually verify?",
        options: [
          "A small component in isolation",
          "The entire organization",
          "Only network availability",
          "A release schedule",
        ],
        correctAnswer: 0,
        explanation:
          "Unit tests check a small unit of software, commonly in isolation.",
      },
      {
        id: "quiz-04-q3",
        question: "In iterative development, working software is delivered:",
        options: [
          "Only after the project is closed",
          "In repeated increments",
          "Before requirements are discussed",
          "Only by external users",
        ],
        correctAnswer: 1,
        explanation:
          "Iterative approaches build and evaluate software through successive increments.",
      },
    ],
  },
  {
    id: "quiz-05",
    title: "Computer Networks",
    subject: "Networking",
    description:
      "Explore packet delivery, transport protocols, and IP addressing fundamentals.",
    difficulty: "Beginner",
    duration: 20,
    maxAttempts: 1,
    questionCount: 3,
    attempts: 0,
    status: "Published",
    questions: [
      {
        id: "quiz-05-q1",
        question: "Which protocol provides reliable, ordered byte-stream delivery?",
        options: ["UDP", "TCP", "IP", "ARP"],
        correctAnswer: 1,
        explanation:
          "TCP provides reliable, ordered delivery between endpoints.",
      },
      {
        id: "quiz-05-q2",
        question: "What does an IP address identify?",
        options: [
          "A network interface's logical address",
          "A file format",
          "A programming language",
          "A database table",
        ],
        correctAnswer: 0,
        explanation:
          "An IP address identifies a network interface for packet routing.",
      },
      {
        id: "quiz-05-q3",
        question: "Which device forwards packets between IP networks?",
        options: ["Router", "Keyboard", "Compiler", "Printer driver"],
        correctAnswer: 0,
        explanation:
          "Routers forward packets between networks using routing information.",
      },
    ],
  },
  {
    id: "quiz-06",
    title: "Artificial Intelligence Fundamentals",
    subject: "Artificial Intelligence",
    description:
      "Assess search, agent, and knowledge-representation fundamentals.",
    difficulty: "Advanced",
    duration: 50,
    maxAttempts: 1,
    questionCount: 3,
    attempts: 0,
    status: "Published",
    questions: [
      {
        id: "quiz-06-q1",
        question: "What is a rational agent designed to do?",
        options: [
          "Choose actions that maximize expected performance",
          "Always use the same action",
          "Avoid observing its environment",
          "Store every possible state in memory",
        ],
        correctAnswer: 0,
        explanation:
          "A rational agent selects actions expected to perform well against its objective.",
      },
      {
        id: "quiz-06-q2",
        question: "Which search strategy uses a heuristic to guide exploration?",
        options: [
          "Uniform random search",
          "Greedy best-first search",
          "Linear scan",
          "Bubble sort",
        ],
        correctAnswer: 1,
        explanation:
          "Greedy best-first search prioritizes nodes using a heuristic estimate.",
      },
      {
        id: "quiz-06-q3",
        question: "In a knowledge-based system, a rule commonly has the form:",
        options: [
          "If condition, then conclusion",
          "Input, then pixel",
          "File, then socket",
          "Loop, then compiler",
        ],
        correctAnswer: 0,
        explanation:
          "Rule-based representations express conclusions that follow from conditions.",
      },
    ],
  },
];
