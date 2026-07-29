/**
 * Fix MongoDB JSON Schema Compatibility
 * 
 * This script removes unsupported keywords from all schema files:
 * - 'default' keyword (not supported by MongoDB JSON Schema)
 * - 'unique' keyword (not supported by MongoDB JSON Schema)
 */

const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, 'schemas');

/**
 * Remove unsupported keywords from a schema
 */
function fixSchema(schema) {
  if (schema.$jsonSchema && schema.$jsonSchema.properties) {
    for (const [fieldName, fieldSchema] of Object.entries(schema.$jsonSchema.properties)) {
      // Remove 'default' keyword
      if ('default' in fieldSchema) {
        delete fieldSchema.default;
      }
      // Remove 'unique' keyword
      if ('unique' in fieldSchema) {
        delete fieldSchema.unique;
      }
    }
  }
  return schema;
}

/**
 * Fix all schema files
 */
function fixAllSchemas() {
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.json'));
  
  console.log('Fixing schema files...');
  
  for (const file of files) {
    const filePath = path.join(schemasDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const schema = JSON.parse(content);
    
    const fixedSchema = fixSchema(schema);
    const fixedContent = JSON.stringify(fixedSchema, null, 2);
    
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`  ✓ Fixed ${file}`);
  }
  
  console.log('\n✓ All schema files fixed');
}

// Run if called directly
if (require.main === module) {
  fixAllSchemas();
}

module.exports = { fixSchema, fixAllSchemas };
