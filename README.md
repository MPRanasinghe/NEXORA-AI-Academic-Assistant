# NEXORA

### Explainable Agentic RAG-Based Intelligent Academic and Student Services Platform

NEXORA is an AI-powered academic and student services assistant designed for higher education institutions.

It supports students, academic staff, and administrative personnel through an explainable Agentic Retrieval-Augmented Generation (RAG) architecture.

## Core Features

- Academic learning assistance
- Lecture PDF question answering
- Short and detailed note generation
- MCQ and exam-style question generation
- Interactive quizzes and feedback
- Academic regulations and examination guidance
- Student services information retrieval
- Academic staff resource assistance
- Source citations and retrieval explainability

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| LLM | Gemini Flash |
| Sparse Retrieval | TF-IDF, scikit-learn |
| Dense Retrieval | Embedding model |
| Vector Database | ChromaDB |
| Application Database | SQLite |
| PDF Processing | PyMuPDF |

## Architecture

NEXORA uses a shared Explainable RAG Engine coordinated by an Agentic Controller.

The controller follows:

**Observation → Reasoning → Action → Persistence**

The knowledge base contains four categories:

1. Learning Resources
2. Academic Regulations
3. Student Services
4. Academic Staff Resources

## Repository Structure

- `frontend/` — Next.js application
- `backend/` — FastAPI application and RAG engine
- `docs/` — Architecture, API, database and evaluation documentation

## Development Setup

Setup instructions for the frontend and backend will be added as the implementation progresses.

See `backend/requirements.txt` for backend dependencies.

## Project Team

Two-member development team.

## Project Scope

NEXORA provides information and guidance supported by institutional documents. It does not independently approve academic requests, assign official grades, or execute sensitive university administrative transactions.
