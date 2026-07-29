/**
 * MongoDB Seed Data for Runbook Agent Database
 * 
 * This file contains seed data for initial database setup.
 * Run this script to populate the database with initial data.
 */

const { MongoClient, ObjectId, Double } = require('mongodb');

// MongoDB connection string - update with your configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/runbook_agent_db';
const DB_NAME = 'runbook_agent_db';

/**
 * Seed data for all collections
 */
const seedData = {
  // ==================== ROLES ====================
  roles: [
    {
      name: 'ADMIN',
      description: 'Full system access with all permissions',
      permissions: [
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'role:create',
        'role:read',
        'role:update',
        'role:delete',
        'runbook:create',
        'runbook:read',
        'runbook:update',
        'runbook:delete',
        'incident:create',
        'incident:read',
        'incident:update',
        'incident:delete',
        'incident:assign',
        'command:execute',
        'command:approve',
        'report:generate',
        'report:read',
        'settings:update',
        'audit:read'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'ENGINEER',
      description: 'Can manage runbooks, incidents, and execute commands',
      permissions: [
        'runbook:create',
        'runbook:read',
        'runbook:update',
        'incident:create',
        'incident:read',
        'incident:update',
        'incident:assign',
        'command:execute',
        'command:approve',
        'report:generate',
        'report:read'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'VIEWER',
      description: 'Read-only access to runbooks and incidents',
      permissions: [
        'runbook:read',
        'incident:read',
        'report:read'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // ==================== USERS ====================
  users: [
    {
      username: 'admin',
      email: 'admin@runbook-agent.com',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYlWmZ5qZ1i', // Password: Admin@123
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    },
    {
      username: 'engineer',
      email: 'engineer@runbook-agent.com',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYlWmZ5qZ1i', // Password: Admin@123
      firstName: 'System',
      lastName: 'Engineer',
      role: 'ENGINEER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'viewer',
      email: 'viewer@runbook-agent.com',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYlWmZ5qZ1i', // Password: Admin@123
      firstName: 'System',
      lastName: 'Viewer',
      role: 'VIEWER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // ==================== COMMAND WHITELIST ====================
  command_whitelist: [
    {
      command: 'df -h',
      category: 'SYSTEM_INFO',
      isAllowed: true,
      description: 'Display disk space usage',
      riskLevel: 'LOW',
      requiresApproval: false,
      examples: ['df -h', 'df -h /var'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'ls',
      category: 'FILE_OPS',
      isAllowed: true,
      description: 'List directory contents',
      riskLevel: 'LOW',
      requiresApproval: false,
      pattern: '^ls(-[a-zA-Z]+)?\\s*[\\w/\\.]*$',
      examples: ['ls', 'ls -la', 'ls /var/log'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'pwd',
      category: 'SYSTEM_INFO',
      isAllowed: true,
      description: 'Print working directory',
      riskLevel: 'LOW',
      requiresApproval: false,
      examples: ['pwd'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'ps aux',
      category: 'PROCESS',
      isAllowed: true,
      description: 'Display running processes',
      riskLevel: 'LOW',
      requiresApproval: false,
      examples: ['ps aux', 'ps aux | grep nginx'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'top',
      category: 'SYSTEM_INFO',
      isAllowed: true,
      description: 'Display system processes',
      riskLevel: 'LOW',
      requiresApproval: false,
      examples: ['top', 'top -b -n 1'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'systemctl status',
      category: 'SYSTEM_INFO',
      isAllowed: true,
      description: 'Check service status',
      riskLevel: 'LOW',
      requiresApproval: false,
      pattern: '^systemctl status [\\w-]+$',
      examples: ['systemctl status nginx', 'systemctl status mongodb'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'systemctl restart',
      category: 'PROCESS',
      isAllowed: true,
      description: 'Restart a service',
      riskLevel: 'MEDIUM',
      requiresApproval: true,
      pattern: '^systemctl restart [\\w-]+$',
      examples: ['systemctl restart nginx', 'systemctl restart mongodb'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'rm -rf',
      category: 'FILE_OPS',
      isAllowed: false,
      description: 'Force remove files/directories',
      riskLevel: 'CRITICAL',
      requiresApproval: true,
      pattern: '^rm -rf',
      examples: ['rm -rf /path/to/file'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'shutdown',
      category: 'SYSTEM_INFO',
      isAllowed: false,
      description: 'Shutdown the system',
      riskLevel: 'CRITICAL',
      requiresApproval: true,
      pattern: '^shutdown',
      examples: ['shutdown -h now', 'shutdown -r now'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'cat',
      category: 'FILE_OPS',
      isAllowed: true,
      description: 'Display file contents',
      riskLevel: 'LOW',
      requiresApproval: false,
      pattern: '^cat [\\w/\\.]+$',
      examples: ['cat /var/log/nginx/error.log', 'cat /etc/nginx/nginx.conf'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'tail',
      category: 'FILE_OPS',
      isAllowed: true,
      description: 'Display end of file',
      riskLevel: 'LOW',
      requiresApproval: false,
      pattern: '^tail(-[fn]+)?\\s*[\\w/\\.]+$',
      examples: ['tail -f /var/log/nginx/access.log', 'tail -n 100 /var/log/syslog'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'grep',
      category: 'FILE_OPS',
      isAllowed: true,
      description: 'Search text in files',
      riskLevel: 'LOW',
      requiresApproval: false,
      pattern: '^grep [\\w\\s-]+$',
      examples: ['grep error /var/log/nginx/error.log', 'grep -r "error" /var/log/'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'netstat',
      category: 'NETWORK',
      isAllowed: true,
      description: 'Network statistics',
      riskLevel: 'LOW',
      requiresApproval: false,
      examples: ['netstat -tulpn', 'netstat -an'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'ping',
      category: 'NETWORK',
      isAllowed: true,
      description: 'Ping a host',
      riskLevel: 'LOW',
      requiresApproval: false,
      pattern: '^ping(-c \\d+)?\\s+[\\w\\.]+$',
      examples: ['ping google.com', 'ping -c 4 8.8.8.8'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      command: 'curl',
      category: 'NETWORK',
      isAllowed: true,
      description: 'Transfer data from URLs',
      riskLevel: 'LOW',
      requiresApproval: false,
      pattern: '^curl [\\w\\s:/.-]+$',
      examples: ['curl http://localhost:8080/health', 'curl -I https://example.com'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // ==================== PROMPT TEMPLATES ====================
  prompt_templates: [
    {
      name: 'Planner Agent',
      agentType: 'PLANNER',
      template: `You are a Planner Agent for the Runbook Following Agent system.

Your task is to analyze an incident and create a step-by-step resolution plan based on available runbooks.

Context:
- Incident: {{incidentTitle}}
- Description: {{incidentDescription}}
- Priority: {{incidentPriority}}
- Available Runbooks: {{runbookList}}

Instructions:
1. Analyze the incident description
2. Search relevant runbooks for similar issues
3. Create a detailed step-by-step resolution plan
4. Identify which steps require user approval
5. Estimate the risk level for each step

Output Format:
- Step 1: [Description] - Risk: [LOW/MEDIUM/HIGH/CRITICAL] - Requires Approval: [Yes/No]
- Step 2: [Description] - Risk: [LOW/MEDIUM/HIGH/CRITICAL] - Requires Approval: [Yes/No]
...`,
      version: '1.0',
      description: 'Template for the Planner AI agent',
      variables: ['incidentTitle', 'incidentDescription', 'incidentPriority', 'runbookList'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Executor Agent',
      agentType: 'EXECUTOR',
      template: `You are an Executor Agent for the Runbook Following Agent system.

Your task is to execute approved steps from the incident resolution plan.

Context:
- Incident: {{incidentTitle}}
- Step: {{stepDescription}}
- Command: {{command}}
- Expected Output: {{expectedOutput}}

Instructions:
1. Review the command to be executed
2. Verify the command is safe and whitelisted
3. If approval is required, wait for user approval
4. Execute the command
5. Analyze the output
6. Report success or failure with relevant details

Safety Rules:
- Never execute commands without approval if risk level is HIGH or CRITICAL
- Always verify command output matches expected behavior
- Stop immediately if unexpected behavior is detected`,
      version: '1.0',
      description: 'Template for the Executor AI agent',
      variables: ['incidentTitle', 'stepDescription', 'command', 'expectedOutput'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Reporter Agent',
      agentType: 'REPORTER',
      template: `You are a Reporter Agent for the Runbook Following Agent system.

Your task is to generate comprehensive incident reports after resolution.

Context:
- Incident: {{incidentTitle}}
- Incident Number: {{incidentNumber}}
- Status: {{incidentStatus}}
- Resolution Summary: {{resolutionSummary}}
- Steps Executed: {{stepsExecuted}}
- Execution Logs: {{executionLogs}}

Instructions:
1. Summarize the incident
2. Document the resolution process
3. Highlight key steps and their outcomes
4. Include any lessons learned
5. Provide recommendations for prevention

Report Structure:
1. Executive Summary
2. Incident Details
3. Resolution Timeline
4. Steps Executed
5. Lessons Learned
6. Recommendations`,
      version: '1.0',
      description: 'Template for the Reporter AI agent',
      variables: ['incidentTitle', 'incidentNumber', 'incidentStatus', 'resolutionSummary', 'stepsExecuted', 'executionLogs'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // ==================== LLM CONFIGURATIONS ====================
  llm_configurations: [
    {
      name: 'GPT-4 Turbo',
      modelName: 'gpt-4-turbo-preview',
      provider: 'OPENAI',
      temperature: new Double(0.7),
      maxTokens: 4096,
      topP: new Double(1.0),
      frequencyPenalty: new Double(0.0),
      presencePenalty: new Double(0.0),
      agentType: 'GENERAL',
      isActive: true,
      isDefault: true,
      metadata: {
        costPer1kTokens: new Double(0.01),
        contextWindow: 128000,
        supportsFunctionCalling: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'GPT-3.5 Turbo',
      modelName: 'gpt-3.5-turbo',
      provider: 'OPENAI',
      temperature: new Double(0.7),
      maxTokens: 4096,
      topP: new Double(1.0),
      frequencyPenalty: new Double(0.0),
      presencePenalty: new Double(0.0),
      agentType: 'GENERAL',
      isActive: true,
      isDefault: false,
      metadata: {
        costPer1kTokens: new Double(0.002),
        contextWindow: 16385,
        supportsFunctionCalling: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Claude 3 Opus',
      modelName: 'claude-3-opus-20240229',
      provider: 'ANTHROPIC',
      temperature: new Double(0.7),
      maxTokens: 4096,
      topP: new Double(1.0),
      frequencyPenalty: new Double(0.0),
      presencePenalty: new Double(0.0),
      agentType: 'PLANNER',
      isActive: true,
      isDefault: false,
      metadata: {
        costPer1kTokens: new Double(0.015),
        contextWindow: 200000,
        supportsFunctionCalling: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Claude 3 Sonnet',
      modelName: 'claude-3-sonnet-20240229',
      provider: 'ANTHROPIC',
      temperature: new Double(0.7),
      maxTokens: 4096,
      topP: new Double(1.0),
      frequencyPenalty: new Double(0.0),
      presencePenalty: new Double(0.0),
      agentType: 'EXECUTOR',
      isActive: true,
      isDefault: false,
      metadata: {
        costPer1kTokens: new Double(0.003),
        contextWindow: 200000,
        supportsFunctionCalling: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

/**
 * Seed a single collection
 */
async function seedCollection(db, collectionName) {
  const data = seedData[collectionName];
  
  if (!data || data.length === 0) {
    console.log(`No seed data for collection: ${collectionName}`);
    return;
  }

  const collection = db.collection(collectionName);
  
  console.log(`Seeding collection: ${collectionName}`);
  
  try {
    // Insert seed data
    const result = await collection.insertMany(data, { ordered: false });
    console.log(`  ✓ Inserted ${result.insertedCount} documents`);
  } catch (error) {
    if (error.code === 11000) {
      console.log(`  ⚠ Some documents already exist (duplicate key error)`);
    } else if (error.code === 121) {
      // Document validation failed
      console.error(`  ✗ Document failed validation`);
      console.error(`  Collection: ${collectionName}`);
      console.error(`  MongoDB Error:`, error.message);
      
      if (error.errInfo) {
        console.error(`  Error Info:`);
        console.dir(error.errInfo, { depth: null });
      }
      
      if (error.result) {
        console.error(`  Error Result:`);
        console.dir(error.result, { depth: null });
      }
      
      if (error.writeErrors && error.writeErrors.length > 0) {
        console.error(`  Write Errors:`);
        error.writeErrors.forEach((writeError, index) => {
          console.error(`    Error ${index + 1}:`);
          console.error(`      Code: ${writeError.code}`);
          console.error(`      Index: ${writeError.index}`);
          console.error(`      Message: ${writeError.errmsg}`);
          if (writeError.errInfo) {
            console.error(`      ErrInfo:`);
            console.dir(writeError.errInfo, { depth: null });
          }
        });
      }
    } else {
      console.error(`  ✗ Failed to seed collection:`, error.message);
      console.error(`  Error Code: ${error.code}`);
      console.error(`  Full Error:`);
      console.dir(error, { depth: null });
    }
  }
}

/**
 * Seed all collections
 */
async function seedAllCollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    let successCount = 0;
    let failureCount = 0;
    
    // Seed each collection
    for (const collectionName of Object.keys(seedData)) {
      const data = seedData[collectionName];
      
      if (!data || data.length === 0) {
        console.log(`No seed data for collection: ${collectionName}`);
        continue;
      }

      const collection = db.collection(collectionName);
      
      console.log(`Seeding collection: ${collectionName}`);
      
      try {
        // Insert seed data
        const result = await collection.insertMany(data, { ordered: false });
        console.log(`  ✓ Inserted ${result.insertedCount} documents`);
        successCount++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  ⚠ Some documents already exist (duplicate key error)`);
          successCount++;
        } else if (error.code === 121) {
          // Document validation failed
          console.error(`  ✗ Document failed validation`);
          console.error(`  Collection: ${collectionName}`);
          console.error(`  MongoDB Error:`, error.message);
          
          if (error.errInfo) {
            console.error(`  Error Info:`);
            console.dir(error.errInfo, { depth: null });
          }
          
          if (error.result) {
            console.error(`  Error Result:`);
            console.dir(error.result, { depth: null });
          }
          
          if (error.writeErrors && error.writeErrors.length > 0) {
            console.error(`  Write Errors:`);
            error.writeErrors.forEach((writeError, index) => {
              console.error(`    Error ${index + 1}:`);
              console.error(`      Code: ${writeError.code}`);
              console.error(`      Index: ${writeError.index}`);
              console.error(`      Message: ${writeError.errmsg}`);
              if (writeError.errInfo) {
                console.error(`      ErrInfo:`);
                console.dir(writeError.errInfo, { depth: null });
              }
            });
          }
          failureCount++;
        } else {
          console.error(`  ✗ Failed to seed collection:`, error.message);
          console.error(`  Error Code: ${error.code}`);
          console.error(`  Full Error:`);
          console.dir(error, { depth: null });
          failureCount++;
        }
      }
    }
    
    console.log('\n==============================');
    console.log(`SEEDING SUMMARY`);
    console.log('==============================');
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log('==============================');
    
    if (failureCount === 0) {
      console.log('✓ All seed data inserted successfully');
    } else {
      console.log('✗ Some collections failed to seed');
      throw new Error(`${failureCount} collection(s) failed to seed`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await client.close();
  }
}

/**
 * Clear all collections (use with caution!)
 */
async function clearAllCollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      console.log(`Clearing collection: ${collection.name}`);
      await db.collection(collection.name).deleteMany({});
      console.log(`  ✓ Cleared ${collection.name}`);
    }
    
    console.log('\n✓ All collections cleared successfully');
  } catch (error) {
    console.error('Error clearing collections:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Export functions
module.exports = {
  seedAllCollections,
  seedCollection,
  clearAllCollections,
  seedData
};

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'seed':
      seedAllCollections();
      break;
    case 'clear':
      clearAllCollections();
      break;
    default:
      console.log('Usage: node seed.js [seed|clear]');
      console.log('  seed  - Insert seed data into collections');
      console.log('  clear - Clear all collections (use with caution!)');
  }
}
