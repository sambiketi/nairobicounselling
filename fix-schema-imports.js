import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function fixSchemaImports(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            fixSchemaImports(fullPath);
        } else if (extname(file) === '.ts') {
            let content = readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Fix: from '../schema' -> from '../schema/index.js'
            content = content.replace(/from\s+['"]\.\.\/schema['"]/g, "from '../schema/index.js'");
            content = content.replace(/from\s+['"]\.\/schema['"]/g, "from './schema/index.js'");
            
            if (content !== original) {
                writeFileSync(fullPath, content, 'utf8');
                console.log(✅ Fixed: );
            }
        }
    }
}

fixSchemaImports('./src');
console.log('✅ All schema imports fixed!');
