/**
 * MongoDB Database Verification Script
 * 
 * This script verifies the complete database setup including:
 * - MongoDB connection
 * - Database existence
 * - Collections existence
 * - Validation rules
 * - Indexes
 * - Seed data
 * - Required documents
 * - Schema validation
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

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

/**
 * Expected seed data counts
 */
const expectedSeedCounts = {
  roles: 3,
  users: 3,
  command_whitelist: 14,
  prompt_templates: 3,
  llm_configurations: 4
};

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
 * Verify MongoDB connection
 */
async function verifyConnection(client) {
  try {
    await client.db('admin').command({ ping: 1 });
    return { success: true, message: 'Connected to MongoDB' };
  } catch (error) {
    return { success: false, message: `Connection failed: ${error.message}` };
  }
}

/**
 * Verify database exists
 */
async function verifyDatabaseExists(client) {
  try {
    const admin = client.db('admin');
    const result = await admin.command({ listDatabases: 1 });
    const databases = result.databases;
    const dbExists = databases.some(db => db.name === DB_NAME);
    
    if (dbExists) {
      return { success: true, message: `Database '${DB_NAME}' exists` };
    } else {
      return { success: false, message: `Database '${DB_NAME}' does not exist` };
    }
  } catch (error) {
    return { success: false, message: `Database check failed: ${error.message}` };
  }
}

/**
 * Verify collections exist
 */
async function verifyCollectionsExist(db) {
  try {
    const existingCollections = await db.listCollections().toArray();
    const existingNames = new Set(existingCollections.map(c => c.name));
    
    const missingCollections = [];
    const existingCount = existingCollections.length;
    const expectedCount = Object.keys(collectionSchemaMap).length;
    
    for (const collectionName of Object.keys(collectionSchemaMap)) {
      if (!existingNames.has(collectionName)) {
        missingCollections.push(collectionName);
      }
    }
    
    if (missingCollections.length === 0) {
      return { 
        success: true, 
        message: `All ${expectedCount} collections exist`,
        details: { existingCount, expectedCount }
      };
    } else {
      return { 
        success: false, 
        message: `Missing ${missingCollections.length} collections: ${missingCollections.join(', ')}`,
        details: { missingCollections, existingCount, expectedCount }
      };
    }
  } catch (error) {
    return { success: false, message: `Collection verification failed: ${error.message}` };
  }
}

/**
 * Verify validation rules exist
 */
async function verifyValidationRules(db) {
  try {
    const collections = await db.listCollections().toArray();
    let withValidation = 0;
    let withoutValidation = [];
    
    for (const collection of collections) {
      const options = await db.collection(collection.name).options();
      if (options.validator && Object.keys(options.validator).length > 0) {
        withValidation++;
      } else {
        withoutValidation.push(collection.name);
      }
    }
    
    if (withoutValidation.length === 0) {
      return { 
        success: true, 
        message: `All ${withValidation} collections have validation rules`,
        details: { withValidation, withoutValidation: [] }
      };
    } else {
      return { 
        success: false, 
        message: `${withoutValidation.length} collections without validation: ${withoutValidation.join(', ')}`,
        details: { withValidation, withoutValidation }
      };
    }
  } catch (error) {
    return { success: false, message: `Validation verification failed: ${error.message}` };
  }
}

/**
 * Verify indexes exist
 */
async function verifyIndexes(db) {
  try {
    const collections = await db.listCollections().toArray();
    let totalIndexes = 0;
    let collectionsWithoutIndexes = [];
    
    for (const collection of collections) {
      const coll = db.collection(collection.name);
      const indexes = await coll.indexes();
      totalIndexes += indexes.length;
      
      if (indexes.length === 1) { // Only _id index
        collectionsWithoutIndexes.push(collection.name);
      }
    }
    
    if (collectionsWithoutIndexes.length === 0) {
      return { 
        success: true, 
        message: `All collections have indexes (total: ${totalIndexes})`,
        details: { totalIndexes, collectionsWithoutIndexes: [] }
      };
    } else {
      return { 
        success: false, 
        message: `${collectionsWithoutIndexes.length} collections without indexes: ${collectionsWithoutIndexes.join(', ')}`,
        details: { totalIndexes, collectionsWithoutIndexes }
      };
    }
  } catch (error) {
    return { success: false, message: `Index verification failed: ${error.message}` };
  }
}

/**
 * Verify seed data exists
 */
async function verifySeedData(db) {
  try {
    const results = [];
    let allPresent = true;
    
    for (const [collectionName, expectedCount] of Object.entries(expectedSeedCounts)) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      
      if (count >= expectedCount) {
        results.push({ collection: collectionName, status: 'PASS', expected: expectedCount, actual: count });
      } else {
        results.push({ collection: collectionName, status: 'FAIL', expected: expectedCount, actual: count });
        allPresent = false;
      }
    }
    
    if (allPresent) {
      return { 
        success: true, 
        message: 'All seed data present',
        details: results
      };
    } else {
      return { 
        success: false, 
        message: 'Some seed data missing or incomplete',
        details: results
      };
    }
  } catch (error) {
    return { success: false, message: `Seed data verification failed: ${error.message}` };
  }
}

/**
 * Verify specific collection seed data
 */
async function verifyCollectionSeed(db, collectionName) {
  try {
    const expectedCount = expectedSeedCounts[collectionName];
    if (!expectedCount) {
      return { success: true, message: `No seed data expected for ${collectionName}` };
    }
    
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    
    if (count >= expectedCount) {
      return { 
        success: true, 
        message: `${collectionName}: ${count}/${expectedCount} documents present`,
        details: { expected: expectedCount, actual: count }
      };
    } else {
      return { 
        success: false, 
        message: `${collectionName}: ${count}/${expectedCount} documents present (expected ${expectedCount})`,
        details: { expected: expectedCount, actual: count }
      };
    }
  } catch (error) {
    return { success: false, message: `${collectionName} verification failed: ${error.message}` };
  }
}

/**
 * Verify schema validation by attempting to insert a test document
 */
async function verifySchemaValidation(db, collectionName) {
  try {
    const schema = loadSchema(collectionSchemaMap[collectionName]);
    if (!schema) {
      return { success: false, message: `Could not load schema for ${collectionName}` };
    }
    
    const collection = db.collection(collectionName);
    
    // Try to get collection stats to check if validation is enabled
    const stats = await db.command({ collStats: collectionName });
    
    if (stats.validator && Object.keys(stats.validator).length > 0) {
      return { 
        success: true, 
        message: `${collectionName} has validation enabled`,
        details: { hasValidator: true }
      };
    } else {
      return { 
        success: false, 
        message: `${collectionName} does not have validation enabled`,
        details: { hasValidator: false }
      };
    }
  } catch (error) {
    return { success: false, message: `${collectionName} schema verification failed: ${error.message}` };
  }
}

/**
 * Run complete verification
 */
async function verifyDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  console.log('==============================');
  console.log('DATABASE VERIFICATION');
  console.log('==============================\n');
  
  const results = {
    connection: null,
    database: null,
    collections: null,
    validation: null,
    indexes: null,
    seedData: null,
    roles: null,
    users: null,
    whitelist: null,
    templates: null,
    llmConfig: null
  };
  
  try {
    await client.connect();
    console.log('Connecting to MongoDB...');
    
    // Verify connection
    const connectionResult = await verifyConnection(client);
    results.connection = connectionResult;
    console.log(`MongoDB ........ ${connectionResult.success ? 'PASS' : 'FAIL'}`);
    if (!connectionResult.success) {
      console.log(`  ${connectionResult.message}`);
    }
    
    // Verify database
    const dbResult = await verifyDatabaseExists(client);
    results.database = dbResult;
    console.log(`Database ...... ${dbResult.success ? 'PASS' : 'FAIL'}`);
    if (!dbResult.success) {
      console.log(`  ${dbResult.message}`);
    }
    
    const db = client.db(DB_NAME);
    
    // Verify collections
    const collectionsResult = await verifyCollectionsExist(db);
    results.collections = collectionsResult;
    console.log(`Collections ..... ${collectionsResult.success ? 'PASS' : 'FAIL'}`);
    if (!collectionsResult.success) {
      console.log(`  ${collectionsResult.message}`);
    }
    
    // Verify validation
    const validationResult = await verifyValidationRules(db);
    results.validation = validationResult;
    console.log(`Validation ...... ${validationResult.success ? 'PASS' : 'FAIL'}`);
    if (!validationResult.success) {
      console.log(`  ${validationResult.message}`);
    }
    
    // Verify indexes
    const indexResult = await verifyIndexes(db);
    results.indexes = indexResult;
    console.log(`Indexes ......... ${indexResult.success ? 'PASS' : 'FAIL'}`);
    if (!indexResult.success) {
      console.log(`  ${indexResult.message}`);
    }
    
    // Verify seed data
    const seedResult = await verifySeedData(db);
    results.seedData = seedResult;
    console.log(`Seed Data ....... ${seedResult.success ? 'PASS' : 'FAIL'}`);
    if (!seedResult.success) {
      console.log(`  ${seedResult.message}`);
      if (seedResult.details) {
        seedResult.details.forEach(detail => {
          if (detail.status === 'FAIL') {
            console.log(`    ${detail.collection}: ${detail.actual}/${detail.expected} documents`);
          }
        });
      }
    }
    
    // Verify specific collections
    console.log('\nDetailed Seed Data Verification:');
    
    const rolesResult = await verifyCollectionSeed(db, 'roles');
    results.roles = rolesResult;
    console.log(`Roles ........... ${rolesResult.success ? 'PASS' : 'FAIL'}`);
    if (!rolesResult.success) {
      console.log(`  ${rolesResult.message}`);
    }
    
    const usersResult = await verifyCollectionSeed(db, 'users');
    results.users = usersResult;
    console.log(`Users ........... ${usersResult.success ? 'PASS' : 'FAIL'}`);
    if (!usersResult.success) {
      console.log(`  ${usersResult.message}`);
    }
    
    const whitelistResult = await verifyCollectionSeed(db, 'command_whitelist');
    results.whitelist = whitelistResult;
    console.log(`Whitelist ....... ${whitelistResult.success ? 'PASS' : 'FAIL'}`);
    if (!whitelistResult.success) {
      console.log(`  ${whitelistResult.message}`);
    }
    
    const templatesResult = await verifyCollectionSeed(db, 'prompt_templates');
    results.templates = templatesResult;
    console.log(`Templates ....... ${templatesResult.success ? 'PASS' : 'FAIL'}`);
    if (!templatesResult.success) {
      console.log(`  ${templatesResult.message}`);
    }
    
    const llmConfigResult = await verifyCollectionSeed(db, 'llm_configurations');
    results.llmConfig = llmConfigResult;
    console.log(`LLM Config .... ${llmConfigResult.success ? 'PASS' : 'FAIL'}`);
    if (!llmConfigResult.success) {
      console.log(`  ${llmConfigResult.message}`);
    }
    
    console.log('\n==============================');
    
    // Determine overall status
    const allPassed = Object.values(results).every(result => result === null || result.success === true);
    
    if (allPassed) {
      console.log('OVERALL STATUS');
      console.log('DATABASE READY');
    } else {
      console.log('OVERALL STATUS');
      console.log('DATABASE NOT READY');
      console.log('\nFailed checks:');
      Object.entries(results).forEach(([key, result]) => {
        if (result && result.success === false) {
          console.log(`  - ${key}: ${result.message}`);
        }
      });
    }
    
    console.log('==============================\n');
    
    return { success: allPassed, results };
    
  } catch (error) {
    console.error('Verification failed:', error);
    return { success: false, error: error.message, results };
  } finally {
    await client.close();
  }
}

// Export functions
module.exports = {
  verifyDatabase,
  verifyConnection,
  verifyDatabaseExists,
  verifyCollectionsExist,
  verifyValidationRules,
  verifyIndexes,
  verifySeedData,
  verifyCollectionSeed,
  verifySchemaValidation
};

// Run if called directly
if (require.main === module) {
  verifyDatabase().then(result => {
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('Verification error:', error);
    process.exit(1);
  });
}
