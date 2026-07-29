/**
 * MongoDB Validator Inspection Script
 * 
 * This script prints the COMPLETE validator stored in MongoDB for every collection.
 * Use this to debug validation issues.
 */

const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/runbook_agent_db';
const DB_NAME = 'runbook_agent_db';

/**
 * Check validator for all collections
 */
async function checkAllValidators() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db(DB_NAME);
    
    // Get all collections with full info
    const collections = await db.listCollections({}, { nameOnly: false }).toArray();
    
    console.log('==============================');
    console.log('STORED VALIDATORS');
    console.log('==============================\n');
    
    for (const collection of collections) {
      console.log(`COLLECTION: ${collection.name}`);
      console.log('------------------------------');
      
      // Get collection options to see validator
      const options = await db.collection(collection.name).options();
      
      console.log(`Validator: ${JSON.stringify(options.validator, null, 2)}`);
      console.log(`Validation Level: ${options.validationLevel || 'not set'}`);
      console.log(`Validation Action: ${options.validationAction || 'not set'}`);
      
      // Check if validator has $jsonSchema
      if (options.validator && options.validator.$jsonSchema) {
        console.log('✓ Validator has $jsonSchema wrapper');
      } else if (options.validator && Object.keys(options.validator).length > 0) {
        console.log('✗ Validator MISSING $jsonSchema wrapper');
        console.log('  Validator keys:', Object.keys(options.validator));
      } else {
        console.log('✗ No validator set');
      }
      
      console.log('');
    }
    
    console.log('==============================\n');
    
  } catch (error) {
    console.error('Error checking validators:', error);
    throw error;
  } finally {
    await client.close();
  }
}

/**
 * Check validator for a specific collection
 */
async function checkValidator(collectionName) {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log(`Connected to MongoDB\n`);
    
    const db = client.db(DB_NAME);
    
    console.log(`COLLECTION: ${collectionName}`);
    console.log('------------------------------');
    
    const options = await db.collection(collectionName).options();
    
    console.log(`Validator: ${JSON.stringify(options.validator, null, 2)}`);
    console.log(`Validation Level: ${options.validationLevel || 'not set'}`);
    console.log(`Validation Action: ${options.validationAction || 'not set'}`);
    
    if (options.validator && options.validator.$jsonSchema) {
      console.log('✓ Validator has $jsonSchema wrapper');
    } else if (options.validator && Object.keys(options.validator).length > 0) {
      console.log('✗ Validator MISSING $jsonSchema wrapper');
      console.log('  Validator keys:', Object.keys(options.validator));
    } else {
      console.log('✗ No validator set');
    }
    
    console.log('');
    
  } catch (error) {
    console.error(`Error checking validator for ${collectionName}:`, error);
    throw error;
  } finally {
    await client.close();
  }
}

// Export functions
module.exports = {
  checkAllValidators,
  checkValidator
};

// Run if called directly
if (require.main === module) {
  const collectionName = process.argv[2];
  
  if (collectionName) {
    checkValidator(collectionName);
  } else {
    checkAllValidators();
  }
}
