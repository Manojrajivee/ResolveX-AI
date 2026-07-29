/**
 * MongoDB Database Reset Script
 * 
 * This script completely resets the database by:
 * 1. Dropping all collections
 * 2. Recreating collections with correct validation
 * 3. Recreating indexes
 * 4. Seeding initial data
 * 
 * Use this when validators are corrupted or need to be completely reapplied.
 */

const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/runbook_agent_db';
const DB_NAME = 'runbook_agent_db';

/**
 * Collection to schema file mapping
 */
const collectionSchemaMap = {
  users: 'users.json',
  roles: 'roles.json',
  runbooks: 'runbooks.json',
  runbook_versions: 'runbook_versions.json',
  runbook_chunks: 'runbook_chunks.json',
  incidents: 'incidents.json',
  incident_steps: 'incident_steps.json',
  execution_logs: 'execution_logs.json',
  reports: 'reports.json',
  chats: 'chats.json',
  embedding_metadata: 'embedding_metadata.json',
  ai_memory: 'ai_memory.json',
  prompt_templates: 'prompt_templates.json',
  llm_configurations: 'llm_configurations.json',
  refresh_tokens: 'refresh_tokens.json',
  sessions: 'sessions.json',
  audit_logs: 'audit_logs.json',
  activity_logs: 'activity_logs.json',
  command_whitelist: 'command_whitelist.json',
  approval_requests: 'approval_requests.json'
};

const fs = require('fs');
const path = require('path');

/**
 * Load schema from JSON file
 */
function loadSchema(schemaFileName) {
  const schemaPath = path.join(__dirname, 'schemas', schemaFileName);
  
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    return schema.$jsonSchema;
  } catch (error) {
    console.error(`Error loading schema ${schemaFileName}:`, error.message);
    return null;
  }
}

/**
 * Drop all collections
 */
async function dropAllCollections(db) {
  console.log('Dropping all collections...');
  
  const collections = await db.listCollections().toArray();
  
  for (const collection of collections) {
    console.log(`  Dropping: ${collection.name}`);
    await db.collection(collection.name).drop();
    console.log(`  ✓ Dropped ${collection.name}`);
  }
  
  console.log('✓ All collections dropped\n');
}

/**
 * Create collections with validation
 */
async function createCollectionsWithValidation(db) {
  console.log('Creating collections with validation...');
  
  for (const [collectionName, schemaFileName] of Object.entries(collectionSchemaMap)) {
    const schema = loadSchema(schemaFileName);
    
    if (!schema) {
      console.error(`  ✗ Failed to load schema for ${collectionName}`);
      continue;
    }
    
    console.log(`  Creating: ${collectionName}`);
    
    try {
      await db.createCollection(collectionName, {
        validator: {
          $jsonSchema: schema
        },
        validationLevel: 'moderate',
        validationAction: 'error'
      });
      console.log(`  ✓ Created ${collectionName} with validation`);
    } catch (error) {
      console.error(`  ✗ Failed to create ${collectionName}:`, error.message);
    }
  }
  
  console.log('✓ All collections created\n');
}

/**
 * Create indexes
 */
async function createIndexes(db) {
  console.log('Creating indexes...');
  
  // Import and use the indexes module
  const indexesPath = path.join(__dirname, 'indexes', 'indexes.js');
  const indexesModule = require(indexesPath);
  
  await indexesModule.createAllIndexes();
  
  console.log('✓ Indexes created\n');
}

/**
 * Seed data
 */
async function seedData(db) {
  console.log('Seeding data...');
  
  // Import and use the seed module
  const seedPath = path.join(__dirname, 'seed-data', 'seed.js');
  const seedModule = require(seedPath);
  
  await seedModule.seedAllCollections();
  
  console.log('✓ Data seeded\n');
}

/**
 * Complete database reset
 */
async function resetDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db(DB_NAME);
    
    console.log('==============================');
    console.log('DATABASE RESET');
    console.log('==============================\n');
    
    // Step 1: Drop all collections
    await dropAllCollections(db);
    
    // Step 2: Create collections with validation
    await createCollectionsWithValidation(db);
    
    // Step 3: Create indexes
    await createIndexes(db);
    
    // Step 4: Seed data
    await seedData(db);
    
    console.log('==============================');
    console.log('DATABASE RESET COMPLETE');
    console.log('==============================\n');
    
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Export functions
module.exports = {
  resetDatabase,
  dropAllCollections,
  createCollectionsWithValidation
};

// Run if called directly
if (require.main === module) {
  resetDatabase().then(() => {
    console.log('Database reset successful');
    process.exit(0);
  }).catch(error => {
    console.error('Database reset failed:', error);
    process.exit(1);
  });
}
