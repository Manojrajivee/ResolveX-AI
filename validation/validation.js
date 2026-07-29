/**
 * MongoDB Validation Rules for Runbook Agent Database
 * 
 * This file contains validation rule application scripts for all collections.
 * Run this script to apply JSON schema validation to collections.
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection string - update with your configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/runbook_agent_db';
const DB_NAME = 'runbook_agent_db';

/**
 * Collection to schema file mapping
 */
const collectionSchemaMap = {
  // Phase 1: Core Database
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
  
  // Phase 2: AI/RAG Database
  embedding_metadata: 'embedding_metadata.json',
  ai_memory: 'ai_memory.json',
  prompt_templates: 'prompt_templates.json',
  llm_configurations: 'llm_configurations.json',
  
  // Phase 3: Security
  refresh_tokens: 'refresh_tokens.json',
  sessions: 'sessions.json',
  audit_logs: 'audit_logs.json',
  activity_logs: 'activity_logs.json',
  command_whitelist: 'command_whitelist.json',
  approval_requests: 'approval_requests.json'
};

/**
 * Load schema from JSON file
 */
function loadSchema(schemaFileName) {
  const schemaPath = path.join(__dirname, '..', 'schemas', schemaFileName);
  
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
 * Apply validation to a single collection
 */
async function applyValidationToCollection(db, collectionName) {
  const schemaFileName = collectionSchemaMap[collectionName];
  
  if (!schemaFileName) {
    console.log(`No schema file mapped for collection: ${collectionName}`);
    return;
  }

  const schema = loadSchema(schemaFileName);
  
  if (!schema) {
    console.log(`Failed to load schema for collection: ${collectionName}`);
    return;
  }

  const collection = db.collection(collectionName);
  
  console.log(`Applying validation to collection: ${collectionName}`);
  
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      await db.createCollection(collectionName);
      console.log(`  ✓ Created collection: ${collectionName}`);
    }
    
    // Apply validation
    await db.command({
      collMod: collectionName,
      validator: {
        $jsonSchema: schema
      },
      validationLevel: 'moderate',
      validationAction: 'error'
    });
    
    console.log(`  ✓ Validation applied to ${collectionName}`);
  } catch (error) {
    if (error.code === 26) {
      // Collection doesn't exist, create it with validation
      try {
        await db.createCollection(collectionName, {
          validator: {
            $jsonSchema: schema
          },
          validationLevel: 'moderate',
          validationAction: 'error'
        });
        console.log(`  ✓ Created collection with validation: ${collectionName}`);
      } catch (createError) {
        console.error(`  ✗ Failed to create collection:`, createError.message);
      }
    } else {
      console.error(`  ✗ Failed to apply validation:`, error.message);
    }
  }
}

/**
 * Apply validation to all collections
 */
async function applyValidationToAllCollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Apply validation to each collection
    for (const collectionName of Object.keys(collectionSchemaMap)) {
      await applyValidationToCollection(db, collectionName);
    }
    
    console.log('\n✓ All validation rules applied successfully');
  } catch (error) {
    console.error('Error applying validation:', error);
    throw error;
  } finally {
    await client.close();
  }
}

/**
 * Remove validation from a collection
 */
async function removeValidationFromCollection(db, collectionName) {
  const collection = db.collection(collectionName);
  
  console.log(`Removing validation from collection: ${collectionName}`);
  
  try {
    await db.command({
      collMod: collectionName,
      validator: {}
    });
    
    console.log(`  ✓ Validation removed from ${collectionName}`);
  } catch (error) {
    console.error(`  ✗ Failed to remove validation:`, error.message);
  }
}

/**
 * Remove validation from all collections
 */
async function removeAllValidation() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Remove validation from each collection
    for (const collectionName of Object.keys(collectionSchemaMap)) {
      await removeValidationFromCollection(db, collectionName);
    }
    
    console.log('\n✓ All validation rules removed successfully');
  } catch (error) {
    console.error('Error removing validation:', error);
    throw error;
  } finally {
    await client.close();
  }
}

/**
 * Get validation rules for a collection
 */
async function getValidationRules(db, collectionName) {
  try {
    const collection = db.collection(collectionName);
    const info = await db.command({ collStats: collectionName });
    
    if (info.validator) {
      console.log(`\n${collectionName} validation rules:`);
      console.log(JSON.stringify(info.validator, null, 2));
    } else {
      console.log(`\n${collectionName} has no validation rules`);
    }
  } catch (error) {
    console.error(`Error getting validation rules for ${collectionName}:`, error.message);
  }
}

/**
 * Get validation rules for all collections
 */
async function getAllValidationRules() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Get validation rules for each collection
    for (const collectionName of Object.keys(collectionSchemaMap)) {
      await getValidationRules(db, collectionName);
    }
  } catch (error) {
    console.error('Error getting validation rules:', error);
    throw error;
  } finally {
    await client.close();
  }
}

/**
 * Validate a document against schema
 */
function validateDocument(schema, document) {
  // Basic validation logic
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in document) || document[field] === null || document[field] === undefined) {
        return {
          valid: false,
          error: `Required field '${field}' is missing`
        };
      }
    }
  }
  
  if (schema.properties) {
    for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
      if (fieldName in document) {
        const value = document[fieldName];
        
        // Check bsonType
        if (fieldSchema.bsonType) {
          const typeMap = {
            'string': 'string',
            'int': 'number',
            'long': 'number',
            'double': 'number',
            'bool': 'boolean',
            'objectId': 'object',
            'date': 'object',
            'array': 'object'
          };
          
          const expectedType = typeMap[fieldSchema.bsonType];
          if (expectedType && typeof value !== expectedType) {
            if (fieldSchema.bsonType === 'objectId' && !(value instanceof ObjectId)) {
              return {
                valid: false,
                error: `Field '${fieldName}' must be ObjectId`
              };
            }
            if (fieldSchema.bsonType === 'date' && !(value instanceof Date)) {
              return {
                valid: false,
                error: `Field '${fieldName}' must be Date`
              };
            }
            if (fieldSchema.bsonType === 'array' && !Array.isArray(value)) {
              return {
                valid: false,
                error: `Field '${fieldName}' must be an array`
              };
            }
          }
        }
        
        // Check enum
        if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
          return {
            valid: false,
            error: `Field '${fieldName}' must be one of: ${fieldSchema.enum.join(', ')}`
          };
        }
        
        // Check minLength
        if (fieldSchema.minLength && typeof value === 'string' && value.length < fieldSchema.minLength) {
          return {
            valid: false,
            error: `Field '${fieldName}' must be at least ${fieldSchema.minLength} characters`
          };
        }
        
        // Check maxLength
        if (fieldSchema.maxLength && typeof value === 'string' && value.length > fieldSchema.maxLength) {
          return {
            valid: false,
            error: `Field '${fieldName}' must be at most ${fieldSchema.maxLength} characters`
          };
        }
        
        // Check minimum
        if (fieldSchema.minimum !== undefined && typeof value === 'number' && value < fieldSchema.minimum) {
          return {
            valid: false,
            error: `Field '${fieldName}' must be at least ${fieldSchema.minimum}`
          };
        }
        
        // Check maximum
        if (fieldSchema.maximum !== undefined && typeof value === 'number' && value > fieldSchema.maximum) {
          return {
            valid: false,
            error: `Field '${fieldName}' must be at most ${fieldSchema.maximum}`
          };
        }
        
        // Check pattern
        if (fieldSchema.pattern && typeof value === 'string') {
          const regex = new RegExp(fieldSchema.pattern);
          if (!regex.test(value)) {
            return {
              valid: false,
              error: `Field '${fieldName}' does not match required pattern`
            };
          }
        }
      }
    }
  }
  
  return { valid: true };
}

// Export functions
module.exports = {
  applyValidationToAllCollections,
  applyValidationToCollection,
  removeAllValidation,
  removeValidationFromCollection,
  getAllValidationRules,
  getValidationRules,
  validateDocument,
  collectionSchemaMap
};

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'apply':
      applyValidationToAllCollections();
      break;
    case 'remove':
      removeAllValidation();
      break;
    case 'show':
      getAllValidationRules();
      break;
    default:
      console.log('Usage: node validation.js [apply|remove|show]');
      console.log('  apply  - Apply validation rules to all collections');
      console.log('  remove - Remove validation rules from all collections');
      console.log('  show   - Show current validation rules');
  }
}
