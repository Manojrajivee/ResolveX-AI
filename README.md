<<<<<<< HEAD
# Runbook Agent MongoDB Database

This directory contains the complete MongoDB database structure for the Runbook Following Agent application, including schemas, indexes, seed data, and validation rules.

## Database Structure

```
runbook_agent_db/
├── Authentication
│   ├── users
│   ├── roles
│   ├── sessions
│   └── refresh_tokens
├── Runbook Management
│   ├── runbooks
│   ├── runbook_versions
│   └── runbook_chunks
├── AI/RAG
│   ├── embedding_metadata
│   ├── ai_memory
│   ├── prompt_templates
│   └── llm_configurations
├── Incident Management
│   ├── incidents
│   ├── incident_steps
│   ├── execution_logs
│   └── reports
├── Communication
│   └── chats
└── Security
    ├── audit_logs
    ├── activity_logs
    ├── command_whitelist
    └── approval_requests
```

## Directory Structure

```
database/
├── schemas/              # JSON schema definitions for each collection
├── indexes/              # Index definitions and management scripts
├── seed-data/            # Initial seed data for database setup
├── validation/           # Validation rule application scripts
└── README.md            # This file
```

## Collections Overview

### Phase 1: Core Database (Mandatory)

| Collection | Purpose | Example |
|------------|---------|---------|
| `users` | Authentication & user profile | User accounts with roles |
| `roles` | RBAC | ADMIN, ENGINEER, VIEWER |
| `runbooks` | Store uploaded runbook details | Database Recovery Guide.pdf |
| `runbook_versions` | Track changes | Database Recovery v1.0, v2.0 |
| `runbook_chunks` | Store extracted text chunks | Parsed PDF chunks for embedding |
| `incidents` | Main project entity | INC-10001 - Database Down |
| `incident_steps` | Stores AI plan | Step 1: Check Database |
| `execution_logs` | Stores command execution | `df -h` → Disk 95% |
| `reports` | AI generated reports | Incident Summary PDF |
| `chats` | AI conversation history | User: Database is down |

### Phase 2: AI/RAG Database

| Collection | Purpose | Description |
|------------|---------|-------------|
| `embedding_metadata` | Chunk ID, Vector ID, ChromaDB reference | Links chunks to vector store |
| `ai_memory` | Previous incidents, solutions, AI learning context | Stores learned patterns |
| `prompt_templates` | Planner, Executor, Reporter agent prompts | AI agent templates |
| `llm_configurations` | Model name, temperature, token limit | LLM settings |

### Phase 3: Security (Important for Judges)

| Collection | Purpose | Example |
|------------|---------|---------|
| `refresh_tokens` | JWT refresh management | Token rotation |
| `sessions` | Active user sessions | Session tracking |
| `audit_logs` | Critical security events | User logged in, file uploaded |
| `activity_logs` | User activity tracking | Page views, searches |
| `command_whitelist` | Safe commands | Allowed: `df -h`, Blocked: `rm -rf` |
| `approval_requests` | Dangerous command approval | AI wants to restart database |

## Quick Start

### Prerequisites

- MongoDB 4.4 or higher
- Node.js 16 or higher
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install mongodb
```

2. **Set environment variables:**
```bash
export MONGODB_URI="mongodb://localhost:27017/runbook_agent_db"
```

Or create a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/runbook_agent_db
```

### Database Setup

Run the following commands in order:

1. **Apply validation rules:**
```bash
cd validation
node validation.js apply
```

2. **Create indexes:**
```bash
cd ../indexes
node indexes.js create
```

3. **Insert seed data:**
```bash
cd ../seed-data
node seed.js seed
```

## Usage

### Validation Rules

Apply JSON schema validation to collections:

```bash
cd validation
node validation.js apply    # Apply validation to all collections
node validation.js remove   # Remove validation from all collections
node validation.js show     # Show current validation rules
```

### Indexes

Manage database indexes:

```bash
cd indexes
node indexes.js create      # Create all indexes
node indexes.js drop        # Drop all indexes (except _id)
node indexes.js stats       # Show index statistics
```

### Seed Data

Manage initial data:

```bash
cd seed-data
node seed.js seed          # Insert seed data
node seed.js clear         # Clear all collections (use with caution!)
```

## Default Users

The seed data includes three default users (all with password `Admin@123`):

| Username | Email | Role | Permissions |
|----------|-------|------|-------------|
| `admin` | admin@runbook-agent.com | ADMIN | Full system access |
| `engineer` | engineer@runbook-agent.com | ENGINEER | Runbook & incident management |
| `viewer` | viewer@runbook-agent.com | VIEWER | Read-only access |

**⚠️ IMPORTANT:** Change default passwords after first login!

## Default Command Whitelist

The seed data includes a pre-configured command whitelist:

### Allowed Commands (Low Risk)
- `df -h` - Display disk space
- `ls` - List directory contents
- `pwd` - Print working directory
- `ps aux` - Display running processes
- `top` - Display system processes
- `systemctl status` - Check service status
- `cat` - Display file contents
- `tail` - Display end of file
- `grep` - Search text in files
- `netstat` - Network statistics
- `ping` - Ping a host
- `curl` - Transfer data from URLs

### Requires Approval (Medium Risk)
- `systemctl restart` - Restart a service

### Blocked (Critical Risk)
- `rm -rf` - Force remove files/directories
- `shutdown` - Shutdown the system

## Default AI Configurations

### Prompt Templates
- **Planner Agent**: Creates step-by-step resolution plans
- **Executor Agent**: Executes approved steps safely
- **Reporter Agent**: Generates comprehensive incident reports

### LLM Configurations
- **GPT-4 Turbo**: Default model (OpenAI)
- **GPT-3.5 Turbo**: Cost-effective option (OpenAI)
- **Claude 3 Opus**: High-quality planning (Anthropic)
- **Claude 3 Sonnet**: Balanced execution (Anthropic)

## Schema Files

Each collection has a corresponding JSON schema file in the `schemas/` directory:

- `users.json` - User schema with authentication fields
- `roles.json` - RBAC role definitions
- `runbooks.json` - Runbook metadata
- `runbook_versions.json` - Version tracking
- `runbook_chunks.json` - Text chunks for embedding
- `incidents.json` - Incident records
- `incident_steps.json` - AI-generated steps
- `execution_logs.json` - Command execution logs
- `reports.json` - AI-generated reports
- `chats.json` - Conversation history
- `embedding_metadata.json` - Vector store references
- `ai_memory.json` - AI learning context
- `prompt_templates.json` - AI agent prompts
- `llm_configurations.json` - LLM settings
- `refresh_tokens.json` - JWT refresh tokens
- `sessions.json` - User sessions
- `audit_logs.json` - Security audit trail
- `activity_logs.json` - User activity tracking
- `command_whitelist.json` - Command security rules
- `approval_requests.json` - Command approval workflow

## Index Strategy

### Single Indexes
- Unique constraints (username, email, token, etc.)
- Foreign key references (userId, runbookId, etc.)
- Status fields (status, isActive, etc.)

### Compound Indexes
- User + status queries
- Incident + priority sorting
- Time-based queries with filters

### Text Indexes
- Full-text search on runbooks
- Full-text search on incidents
- Full-text search on chats
- Full-text search on AI memory

### TTL Indexes
- Session expiration (24 hours)
- Token expiration (30 days)
- Activity log retention (90 days)
- Audit log retention (7 years)

## Security Features

### Authentication
- BCrypt password hashing
- JWT access tokens (15 min expiry)
- Refresh tokens (30 day expiry)
- Session management with device tracking

### Authorization
- Role-Based Access Control (RBAC)
- Three roles: ADMIN, ENGINEER, VIEWER
- Granular permissions per role
- Resource-level ownership checks

### Audit Trail
- Comprehensive audit logging
- Track all critical events
- User activity monitoring
- IP address and user agent tracking

### Command Security
- Command whitelist for safe execution
- Risk-based approval workflow
- Blocked dangerous commands
- Role-based command permissions

## Maintenance

### Regular Tasks

1. **Monitor index usage:**
```bash
cd indexes
node indexes.js stats
```

2. **Clean up old data:**
- Sessions and tokens auto-expire via TTL
- Activity logs retain 90 days
- Audit logs retain 7 years

3. **Backup database:**
```bash
mongodump --uri="mongodb://localhost:27017/runbook_agent_db" --out="./backups"
```

4. **Restore database:**
```bash
mongorestore --uri="mongodb://localhost:27017/runbook_agent_db" "./backups"
```

## Troubleshooting

### Validation Errors

If you encounter validation errors when inserting documents:

1. Check the schema file for the collection
2. Verify all required fields are present
3. Ensure data types match schema definitions
4. Check enum values match allowed options

### Index Creation Errors

If index creation fails:

1. Check for duplicate key errors
2. Verify collection exists
3. Check for existing indexes with same name
4. Use `node indexes.js drop` to reset indexes

### Connection Issues

If you cannot connect to MongoDB:

1. Verify MongoDB is running
2. Check connection string in environment variables
3. Ensure network access to MongoDB
4. Check authentication credentials

## Development

### Adding New Collections

1. Create schema file in `schemas/`
2. Add index definition in `indexes/indexes.js`
3. Add to `collectionSchemaMap` in `validation/validation.js`
4. Run validation script to apply schema
5. Run index script to create indexes

### Modifying Schemas

1. Update JSON schema file in `schemas/`
2. Re-run validation script:
```bash
cd validation
node validation.js apply
```

### Adding Seed Data

1. Add data to `seed-data/seed.js`
2. Run seed script:
```bash
cd seed-data
node seed.js seed
```

## Production Considerations

### Security
- Enable MongoDB authentication
- Use TLS/SSL for connections
- Implement IP whitelisting
- Regular security audits
- Monitor audit logs

### Performance
- Use replica sets for high availability
- Configure appropriate connection pool size
- Monitor index usage and query performance
- Implement read preferences for scaling
- Consider sharding for large datasets

### Backup Strategy
- Daily automated backups
- Point-in-time recovery capability
- Backup retention policy
- Regular restore testing
- Off-site backup storage

### Monitoring
- Monitor database metrics
- Track slow queries
- Alert on connection pool exhaustion
- Monitor disk space usage
- Track replication lag

## Support

For issues or questions:
1. Check this README
2. Review schema files for field definitions
3. Check MongoDB documentation
4. Review audit logs for error details

## License

This database structure is part of the Runbook Following Agent application.

## Version History

- **v1.0** - Initial database structure with 18 collections
  - Phase 1: Core Database (10 collections)
  - Phase 2: AI/RAG Database (4 collections)
  - Phase 3: Security (4 collections)
=======
# ResolveX-AI
ResolveX AI is an enterprise AI-powered Runbook Automation Platform that uses RAG, AI Agents, and MCP to automate incident diagnosis, execute approved remediation steps, and generate intelligent incident reports, reducing Mean Time to Resolution (MTTR).
>>>>>>> 62a8be1a7de355c7793f77ed12b97be92e49b50b
