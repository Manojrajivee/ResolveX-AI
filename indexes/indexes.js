/**
 * MongoDB Index Definitions for Runbook Agent Database
 * 
 * This file contains all index definitions for the database collections.
 * Run this script to create indexes on all collections.
 */

const { MongoClient } = require('mongodb');

// MongoDB connection string - update with your configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/runbook_agent_db';
const DB_NAME = 'runbook_agent_db';

/**
 * Index definitions for all collections
 */
const indexDefinitions = {
  // ==================== AUTHENTICATION ====================
  users: [
    { key: { username: 1 }, options: { unique: true } },
    { key: { email: 1 }, options: { unique: true } },
    { key: { role: 1 } },
    { key: { status: 1 } },
    { key: { createdAt: -1 } },
    { key: { lastLoginAt: -1 } },
    { key: { role: 1, status: 1 } }
  ],

  roles: [
    { key: { name: 1 }, options: { unique: true } },
    { key: { createdAt: -1 } }
  ],

  refresh_tokens: [
    { key: { token: 1 }, options: { unique: true } },
    { key: { userId: 1 } },
    { key: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
    { key: { userId: 1, expiresAt: 1 } },
    { key: { revoked: 1 } }
  ],

  sessions: [
    { key: { sessionToken: 1 }, options: { unique: true } },
    { key: { userId: 1 } },
    { key: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
    { key: { userId: 1, isActive: 1 } },
    { key: { lastActivityAt: -1 } }
  ],

  // ==================== RUNBOOK MANAGEMENT ====================
  runbooks: [
    { key: { title: 'text', description: 'text' }, options: { name: 'text_search' } },
    { key: { uploadedBy: 1 } },
    { key: { status: 1 } },
    { key: { category: 1 } },
    { key: { tags: 1 } },
    { key: { createdAt: -1 } },
    { key: { updatedAt: -1 } },
    { key: { uploadedBy: 1, status: 1 } },
    { key: { category: 1, status: 1 } }
  ],

  runbook_versions: [
    { key: { runbookId: 1, version: -1 }, options: { unique: true } },
    { key: { runbookId: 1 } },
    { key: { uploadedBy: 1 } },
    { key: { isCurrent: 1 } },
    { key: { createdAt: -1 } },
    { key: { runbookId: 1, isCurrent: 1 } }
  ],

  runbook_chunks: [
    { key: { runbookId: 1, versionId: 1, chunkNumber: 1 } },
    { key: { runbookId: 1 } },
    { key: { versionId: 1 } },
    { key: { embeddingStatus: 1 } },
    { key: { content: 'text' }, options: { name: 'chunk_text_search' } },
    { key: { createdAt: -1 } },
    { key: { runbookId: 1, embeddingStatus: 1 } }
  ],

  // ==================== INCIDENT MANAGEMENT ====================
  incidents: [
    { key: { incidentNumber: 1 }, options: { unique: true } },
    { key: { title: 'text', description: 'text' }, options: { name: 'incident_text_search' } },
    { key: { status: 1 } },
    { key: { priority: 1 } },
    { key: { assignedTo: 1 } },
    { key: { runbookId: 1 } },
    { key: { createdBy: 1 } },
    { key: { tags: 1 } },
    { key: { createdAt: -1 } },
    { key: { updatedAt: -1 } },
    { key: { status: 1, priority: -1 } },
    { key: { assignedTo: 1, status: 1 } },
    { key: { createdBy: 1, status: 1 } },
    { key: { createdAt: -1, status: 1 } }
  ],

  incident_steps: [
    { key: { incidentId: 1, stepNumber: 1 }, options: { unique: true } },
    { key: { incidentId: 1 } },
    { key: { status: 1 } },
    { key: { requiresApproval: 1 } },
    { key: { approvedBy: 1 } },
    { key: { createdAt: -1 } },
    { key: { incidentId: 1, status: 1 } },
    { key: { incidentId: 1, requiresApproval: 1, status: 1 } }
  ],

  execution_logs: [
    { key: { incidentId: 1, stepId: 1 } },
    { key: { incidentId: 1 } },
    { key: { stepId: 1 } },
    { key: { executedBy: 1 } },
    { key: { status: 1 } },
    { key: { createdAt: -1 } },
    { key: { incidentId: 1, createdAt: -1 } },
    { key: { executedBy: 1, createdAt: -1 } }
  ],

  reports: [
    { key: { incidentId: 1 } },
    { key: { reportType: 1 } },
    { key: { generatedBy: 1 } },
    { key: { isAIGenerated: 1 } },
    { key: { createdAt: -1 } },
    { key: { incidentId: 1, createdAt: -1 } },
    { key: { reportType: 1, createdAt: -1 } }
  ],

  // ==================== AI/RAG ====================
  embedding_metadata: [
    { key: { chunkId: 1 }, options: { unique: true } },
    { key: { runbookId: 1 } },
    { key: { vectorId: 1 }, options: { unique: true } },
    { key: { vectorStore: 1 } },
    { key: { collectionName: 1 } },
    { key: { createdAt: -1 } },
    { key: { runbookId: 1, vectorStore: 1 } }
  ],

  ai_memory: [
    { key: { memoryType: 1 } },
    { key: { incidentId: 1 } },
    { key: { runbookId: 1 } },
    { key: { tags: 1 } },
    { key: { embeddingId: 1 } },
    { key: { content: 'text' }, options: { name: 'memory_text_search' } },
    { key: { accessCount: -1 } },
    { key: { successRate: -1 } },
    { key: { createdAt: -1 } },
    { key: { updatedAt: -1 } },
    { key: { memoryType: 1, createdAt: -1 } }
  ],

  prompt_templates: [
    { key: { name: 1, version: 1 }, options: { unique: true } },
    { key: { agentType: 1 } },
    { key: { isActive: 1 } },
    { key: { createdBy: 1 } },
    { key: { createdAt: -1 } },
    { key: { agentType: 1, isActive: 1 } }
  ],

  llm_configurations: [
    { key: { name: 1 }, options: { unique: true } },
    { key: { provider: 1 } },
    { key: { agentType: 1 } },
    { key: { isActive: 1 } },
    { key: { isDefault: 1 } },
    { key: { createdBy: 1 } },
    { key: { createdAt: -1 } },
    { key: { provider: 1, isActive: 1 } },
    { key: { agentType: 1, isActive: 1 } }
  ],

  // ==================== COMMUNICATION ====================
  chats: [
    { key: { incidentId: 1, timestamp: -1 } },
    { key: { incidentId: 1 } },
    { key: { role: 1 } },
    { key: { timestamp: -1 } },
    { key: { content: 'text' }, options: { name: 'chat_text_search' } },
    { key: { 'metadata.agentType': 1 } },
    { key: { 'metadata.stepReference': 1 } }
  ],

  // ==================== SECURITY ====================
  audit_logs: [
    { key: { userId: 1 } },
    { key: { action: 1 } },
    { key: { entityType: 1 } },
    { key: { entityId: 1 } },
    { key: { timestamp: -1 } },
    { key: { result: 1 } },
    { key: { ipAddress: 1 } },
    { key: { sessionId: 1 } },
    { key: { correlationId: 1 }, options: { unique: true, sparse: true } },
    { key: { userId: 1, timestamp: -1 } },
    { key: { action: 1, timestamp: -1 } },
    { key: { entityType: 1, timestamp: -1 } },
    { key: { timestamp: -1, result: 1 } },
    { key: { timestamp: 1 }, options: { expireAfterSeconds: 2555395200 } } // 7 years TTL
  ],

  activity_logs: [
    { key: { userId: 1 } },
    { key: { activityType: 1 } },
    { key: { resourceType: 1 } },
    { key: { resourceId: 1 } },
    { key: { timestamp: -1 } },
    { key: { sessionId: 1 } },
    { key: { ipAddress: 1 } },
    { key: { userId: 1, timestamp: -1 } },
    { key: { activityType: 1, timestamp: -1 } },
    { key: { resourceType: 1, timestamp: -1 } },
    { key: { timestamp: 1 }, options: { expireAfterSeconds: 7776000 } } // 90 days TTL
  ],

  command_whitelist: [
    { key: { command: 1 }, options: { unique: true } },
    { key: { category: 1 } },
    { key: { isAllowed: 1 } },
    { key: { riskLevel: 1 } },
    { key: { requiresApproval: 1 } },
    { key: { createdAt: -1 } },
    { key: { category: 1, isAllowed: 1 } },
    { key: { riskLevel: 1, isAllowed: 1 } }
  ],

  approval_requests: [
    { key: { incidentId: 1, stepId: 1 }, options: { unique: true } },
    { key: { incidentId: 1 } },
    { key: { stepId: 1 } },
    { key: { requestedBy: 1 } },
    { key: { status: 1 } },
    { key: { riskLevel: 1 } },
    { key: { approvedBy: 1 } },
    { key: { expiresAt: 1 } },
    { key: { createdAt: -1 } },
    { key: { status: 1, createdAt: -1 } },
    { key: { requestedBy: 1, status: 1 } },
    { key: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } }
  ]
};

/**
 * Create indexes for a single collection
 */
async function createIndexesForCollection(db, collectionName) {
  const collection = db.collection(collectionName);
  const indexes = indexDefinitions[collectionName];
  
  if (!indexes) {
    console.log(`No indexes defined for collection: ${collectionName}`);
    return;
  }

  console.log(`Creating indexes for collection: ${collectionName}`);
  
  for (const indexDef of indexes) {
    try {
      await collection.createIndex(indexDef.key, indexDef.options || {});
      console.log(`  ✓ Created index on ${JSON.stringify(indexDef.key)}`);
    } catch (error) {
      console.error(`  ✗ Failed to create index on ${JSON.stringify(indexDef.key)}:`, error.message);
    }
  }
}

/**
 * Create all indexes for all collections
 */
async function createAllIndexes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Create indexes for each collection
    for (const collectionName of Object.keys(indexDefinitions)) {
      await createIndexesForCollection(db, collectionName);
    }
    
    console.log('\n✓ All indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  } finally {
    await client.close();
  }
}

/**
 * Drop all indexes (except _id) for a collection
 */
async function dropIndexesForCollection(db, collectionName) {
  const collection = db.collection(collectionName);
  const indexes = await collection.indexes();
  
  for (const index of indexes) {
    if (index.name !== '_id_') {
      try {
        await collection.dropIndex(index.name);
        console.log(`  ✓ Dropped index: ${index.name}`);
      } catch (error) {
        console.error(`  ✗ Failed to drop index ${index.name}:`, error.message);
      }
    }
  }
}

/**
 * Drop all indexes (except _id) for all collections
 */
async function dropAllIndexes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      console.log(`\nDropping indexes for collection: ${collection.name}`);
      await dropIndexesForCollection(db, collection.name);
    }
    
    console.log('\n✓ All indexes dropped successfully');
  } catch (error) {
    console.error('Error dropping indexes:', error);
    throw error;
  } finally {
    await client.close();
  }
}

/**
 * Get index statistics for all collections
 */
async function getIndexStats() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      console.log(`\n${collection.name}:`);
      const coll = db.collection(collection.name);
      const indexes = await coll.indexes();
      
      for (const index of indexes) {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
      }
    }
  } catch (error) {
    console.error('Error getting index stats:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Export functions
module.exports = {
  createAllIndexes,
  createIndexesForCollection,
  dropAllIndexes,
  dropIndexesForCollection,
  getIndexStats,
  indexDefinitions
};

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      createAllIndexes();
      break;
    case 'drop':
      dropAllIndexes();
      break;
    case 'stats':
      getIndexStats();
      break;
    default:
      console.log('Usage: node indexes.js [create|drop|stats]');
      console.log('  create - Create all indexes');
      console.log('  drop   - Drop all indexes (except _id)');
      console.log('  stats  - Show index statistics');
  }
}
