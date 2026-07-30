ResolveX AI - Enterprise AI-Powered Runbook Automation Platform
ResolveX AI is a modern Site Reliability Engineering (SRE) and DevOps Incident Automation Platform. It leverages Retrieval-Augmented Generation (RAG), AI Agents, and Model Context Protocol (MCP) to parse operations runbooks, diagnose real-time infrastructure alerts, request human-in-the-loop approvals for command executions, and auto-generate PDF post-mortem incident reports to drive down Mean Time to Resolution (MTTR).

🚀 Key Features
AI Troubleshooting Assistant (RAG Chat): Ask questions, diagnose incidents, and let the agent parse and retrieve operational guidance using high-dimensional vector embeddings of your internal runbook directory.
Document Vault (Runbooks Ingestion): Ingest, index, and organize .md and .pdf files. Runbooks are automatically segmented, chunked, and vector-embedded.
Human-in-the-loop MCP Command Approvals: Destructive and risky actions (e.g., restarts, disk cleaners) trigger approval cards inside the chat window, preventing accidental execution.
Auto-generated Post-Mortem Reports: Automatically generate PDF/Markdown reports summarizing incident timelines, execution metrics, and command logs.
Multi-Channel Alert Integration: Connect system alerts to notification channels, including Email, Slack webhooks, SMS, and Microsoft Teams.
Admin Control Center: Manage system audit trails, feature flags, API credentials, and database backups.
🛠️ Technology Stack
Backend
Java 17 & Spring Boot 3.x
MongoDB (Persisted database storage)
OpenAI API (gpt-4o-mini for chat & text-embedding-3-small for vector generation)
OpenPDF (iText) for generating incident report PDFs
Spring Security (Stateless authentication via JWT)
Frontend
Next.js 16 (App Router)
Tailwind CSS v4 (Tailored dark glassmorphic SRE theme)
Zustand (Global client store management)
Framer Motion & Lucide React (Rich visual interactions)
📂 Repository Structure

├── backend/                  # Spring Boot Maven application
│   ├── src/                  # Controllers, Models, Services, Repositories
│   ├── uploads/runbooks/     # Local disk repository for uploaded runbooks
│   └── pom.xml               # Dependencies configurations
└── runbook-following-agent/  # Next.js web application
    ├── src/app/              # Next.js App Router (chat, vault, analytics)
    ├── src/components/       # React layouts and UI components
    └── package.json          # Node scripts and dependencies
🚀 Getting Started
Prerequisites
Java SDK 17 or higher
Node.js v18.x or higher
MongoDB Community Server running locally (port 27017)
OpenAI API Key (optional, fallback offline mode is supported)
Step 1: Configure & Start Backend
Navigate to the backend directory:
bash

cd backend
Open src/main/resources/application.properties and customize database connections or add your OpenAI key:
properties

spring.data.mongodb.uri=mongodb://localhost:27017/runbook_agent_db
app.openai.api-key=your-openai-api-key-here
Run the application using Maven:
bash

mvn clean spring-boot:run
The backend will boot on port 8080 (API endpoint: http://localhost:8080).
Step 2: Configure & Start Frontend
Navigate to the frontend directory:
bash

cd runbook-following-agent
Install npm dependencies:
bash

npm install
Setup the environment variable to point to the Spring Boot REST server (create a .env.local file):
env

NEXT_PUBLIC_API_URL=http://localhost:8080/api
Start the Turbopack development server:
bash

npm run dev
The frontend application will start on http://localhost:3000.
🧪 Testing the E2E Flow
Open your browser and go to http://localhost:3000.
Go to Runbook Vault -> Upload New Runbook and ingest a sample operations manual (examples available in root: mysql_recovery.md, nginx_ssl_renewal.md).
Open AI Assistant and search or type an alert matching keywords (e.g. "Database server PostgreSQL is unresponsive").
Watch the SRE agent analyze the alert, recommend steps, ask for approval for risky actions, and generate a post-mortem document.
📄 License
This project is licensed under the MIT License. See the 
LICENSE
 file for more information.
