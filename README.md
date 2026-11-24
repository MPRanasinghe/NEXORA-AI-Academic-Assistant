# NEXORA – AI-Powered University Academic Assistant

<p align="center">
  <strong>An Intelligent Academic Assistance Platform Powered by Retrieval-Augmented Generation (RAG)</strong>
</p>

<p align="center">
  Bringing academic resources, intelligent information retrieval, and AI-powered learning support together in one platform.
</p>

---

## 1. Project Overview

**NEXORA** is an AI-powered University Academic Assistant designed to improve how university students access academic information, interact with learning materials, and receive academic support.

Rather than functioning as a simple chatbot, NEXORA provides a centralized academic assistance platform connecting students, academic staff, and administrators through role-based access and intelligent academic services.

At its core, NEXORA integrates a **Retrieval-Augmented Generation (RAG)** architecture that processes academic documents, retrieves relevant information, and generates context-grounded answers using Google's Gemini AI model.

The platform aims to make university learning resources more accessible, improve information discovery, and provide students with a more reliable way to interact with their academic materials.

## 2. Key Features

### Student Features
- **AI Academic Assistant:** Ask questions and receive AI-generated academic responses.
- **Document-Grounded Answers:** Generate responses using information retrieved from uploaded academic materials.
- **Source References:** Access references associated with generated responses to identify supporting academic documents.
- **Academic Learning Support:** Access learning assistance through the platform.
- **Quiz Functionality:** Support knowledge assessment through quizzes.

### Academic Staff Features
- **Academic Document Management:** Upload academic documents, including PDF resources.
- **Automated Document Processing:** Extract text and divide documents into smaller chunks.
- **Knowledge Base Integration:** Store processed document chunks for retrieval by the RAG system.
- **Resource Management:** Manage academic resources made available to students.

### Administrator Features
- **Administrator Dashboard:** Access dedicated administrative functionality.
- **User Management:** Manage platform users.
- **Role-Based Access Control:** Support different permissions for students, academic staff, and administrators.
- **Platform Administration:** Access administrative functions through a dedicated interface.

## 3. RAG Architecture

NEXORA uses a Retrieval-Augmented Generation architecture to provide answers grounded in academic documents.

Instead of relying exclusively on the language model's pretrained knowledge, the system retrieves relevant information from its academic knowledge base before generating a response.

### RAG Processing Workflow

1. **Document Ingestion:** Academic staff upload PDF documents.
2. **Text Extraction:** The ingestion pipeline extracts textual content from uploaded documents.
3. **Text Chunking:** Extracted content is divided into smaller, manageable chunks.
4. **Knowledge Storage:** Processed chunks are stored in the document retrieval infrastructure.
5. **Query Analysis:** Student questions are analyzed to understand the query.
6. **Retrieval Routing:** The system selects an appropriate retrieval strategy.
7. **Information Retrieval:** Relevant academic chunks are retrieved from the knowledge base.
8. **Retrieval Evaluation:** Retrieved results are evaluated for sufficiency.
9. **Fallback Mechanism:** Alternative retrieval strategies can be attempted when results are insufficient.
10. **Answer Generation:** Retrieved context is passed to Gemini to generate a grounded response.
11. **Response Delivery:** The generated response and available document references are returned through the chat interface.

### RAG Architecture Components

| Component | Responsibility |
|---|---|
| PDF Ingestion Pipeline | Document processing and chunk creation |
| Query Analyzer | Student query analysis |
| Retrieval Router | Retrieval strategy selection |
| TF-IDF Retriever | Keyword-based retrieval |
| Dense Retriever | Semantic retrieval |
| Hybrid Retriever | Combined retrieval approach |
| Agentic Retrieval Engine | Retrieval coordination and fallback |
| Retrieval Evaluator | Retrieval sufficiency evaluation |
| Answer Generator | Context-grounded answer generation |
| Chat API | Frontend and backend communication |

### Retrieval Evaluation

NEXORA includes a retrieval evaluation component that assesses whether retrieved results are sufficient for the requested query.

The agentic retrieval engine records retrieval attempts, evaluation results, and fallback information.

This allows the system to attempt alternative retrieval strategies when the initial results do not meet its sufficiency requirements.

## 4. System Architecture

NEXORA follows a frontend-backend architecture.

```text
                 NEXORA PLATFORM
                        |
          +-------------+-------------+
          |                           |
     FRONTEND                    BACKEND
          |                           |
    Next.js UI                    FastAPI
          |                           |
    +-----+------+              +-----+------+
    |            |              |            |
 Students   Academic Staff    Authentication  APIs
    |            |                           |
    |       Document Upload                  |
    |            |                           |
    |       PDF Ingestion                     |
    |            |                           |
    |       Text Chunking                     |
    |            |                           |
    |       Knowledge Storage                 |
    |                                        |
    +---------- Chat API --------------------+
                     |
              RAG Pipeline
                     |
        +------------+------------+
        |            |            |
     Analysis    Retrieval    Evaluation
        |            |            |
        +------------+------------+
                     |
              Retrieved Context
                     |
              Gemini Generation
                     |
              Grounded Response
                     |
                Student UI
```

## 5. Technology Stack

The project uses the following technologies:

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Frontend Language | TypeScript |
| Backend | Python |
| Backend Framework | FastAPI |
| AI Model | Google Gemini |
| RAG Architecture | Retrieval-Augmented Generation |
| Retrieval Methods | TF-IDF, Dense and Hybrid Retrieval |
| Vector Storage | ChromaDB |
| API Communication | REST API |
| Version Control | Git and GitHub |

## 6. Project Structure

The repository is organized into frontend and backend components.

```text
NEXORA-AI-Academic-Assistant/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── chat.py
│   │   │   │   ├── documents.py
│   │   │   │   └── admin.py
│   │   │
│   │   ├── rag/
│   │   │   ├── ingestion/
│   │   │   │   └── ingestion_pipeline.py
│   │   │   │
│   │   │   ├── agentic/
│   │   │   │   ├── query_analyzer.py
│   │   │   │   ├── retrieval_router.py
│   │   │   │   ├── agentic_retrieval.py
│   │   │   │   └── retrieval_evaluator.py
│   │   │   │
│   │   │   ├── generation/
│   │   │   │   └── answer_generator.py
│   │   │   │
│   │   │   └── retrieval/
│   │   │       ├── tfidf_retriever.py
│   │   │       ├── dense_retriever.py
│   │   │       └── hybrid_retriever.py
│   │   │
│   │   ├── schemas/
│   │   ├── core/
│   │   └── main.py
│   │
│   ├── scripts/
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
│
└── README.md
```

*Note: This is a representative overview of the main project components. Additional modules and files are maintained in the repository.*

## 7. Installation and Setup

Follow the instructions below to run NEXORA locally.

### Prerequisites

- Python
- Node.js and npm
- Git
- Access to a Google Gemini API key
- Required database and storage services configured for the project

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd NEXORA-AI-Academic-Assistant
```

### Step 2: Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
source .venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Configure the backend environment variables using the project's environment configuration and example files.

Ensure that the required database connections, storage configuration, and Gemini API credentials are configured before starting the application.

Start the backend:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend API:

```text
http://127.0.0.1:8000
```

### Step 3: Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the frontend environment variables according to the project's environment configuration.

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

### Step 4: Access NEXORA

Open the frontend URL in your browser:

```text
http://localhost:3000
```

Log in using an appropriately provisioned account.

The available functionality depends on the assigned user role.

## 8. Testing

The backend includes unit and integration tests.

From the backend directory, execute:

```bash
python -m pytest tests/unit tests/integration -q
```

The tests help verify backend components and application functionality.

## 9. Core RAG Implementation Files

The following files implement the main RAG workflow:

| File | Description |
|---|---|
| `ingestion_pipeline.py` | PDF processing, extraction and chunking |
| `query_analyzer.py` | Query analysis |
| `retrieval_router.py` | Retrieval strategy selection |
| `agentic_retrieval.py` | Retrieval orchestration and fallback |
| `retrieval_evaluator.py` | Retrieval sufficiency evaluation |
| `answer_generator.py` | Gemini-based answer generation |
| `chat.py` | Chat API integration |

These components work together to transform uploaded academic documents into searchable knowledge and provide context-grounded answers to student questions.

## 10. Security and Access Management

NEXORA incorporates authentication and role-based access control to separate student, academic staff, and administrator functionality.

Access to protected resources and administrative features is controlled through the backend authentication and authorization mechanisms.

API credentials and other sensitive configuration values should be stored in environment variables and must not be committed to the public repository.

## 11. Future Improvements

Potential areas for further development include:

- Expanded academic document format support.
- Improved retrieval accuracy and evaluation.
- More comprehensive RAG quality benchmarking.
- Enhanced academic recommendation capabilities.
- Expanded analytics for academic staff and administrators.
- Further improvements to answer transparency and source attribution.

## 12. Team

**Project:** NEXORA – AI-Powered University Academic Assistant

**Project Contributors:**
- Devinda
- Methmi

Developed collaboratively as a university software engineering and AI project.

## 13. Demonstration

The project demonstration covers the complete academic document question-answering workflow:

1. Introduction to the NEXORA platform and its user roles.
2. Academic staff login and PDF document upload.
3. Document ingestion and chunk creation.
4. Student login and academic question submission.
5. AI-generated responses with document references.
6. Technical demonstration of the RAG architecture and its implementation.

**Project Demonstration Video:** Add the unlisted YouTube URL here after uploading the final demonstration.

---

<p align="center">
  <strong>NEXORA – Making Academic Knowledge More Accessible Through AI</strong>
</p>
