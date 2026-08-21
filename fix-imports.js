import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function fixImports(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            fixImports(fullPath);
        } else if (extname(file) === '.ts') {
            let content = readFileSync(fullPath, 'utf8');
            let changed = false;
            
            // Fix imports without .js extension
            content = content.replace(/from\s+['"]\.\.\/([^'"]+?)(?<!\.js)(?<!\.json)['"]/g, (match, p1) => {
                // Skip if it's a package import (starts with @ or letter)
                if (p1.match(/^[a-zA-Z@]/)) return match;
                changed = true;
                return rom '../.js';
            });
            
            content = content.replace(/from\s+['"]\.\/([^'"]+?)(?<!\.js)(?<!\.json)['"]/g, (match, p1) => {
                // Skip if it's a package import (starts with @ or letter)
                if (p1.match(/^[a-zA-Z@]/)) return match;
                changed = true;
                return rom './.js';
            });
            
            // Fix import statements without from
            content = content.replace(/import\s+['"]\.\.\/([^'"]+?)(?<!\.js)(?<!\.json)['"]/g, (match, p1) => {
                if (p1.match(/^[a-zA-Z@]/)) return match;
                changed = true;
                return import '../.js';
            });
            
            content = content.replace(/import\s+['"]\.\/([^'"]+?)(?<!\.js)(?<!\.json)['"]/g, (match, p1) => {
                if (p1.match(/^[a-zA-Z@]/)) return match;
                changed = true;
                return import './.js';
            });
            
            if (changed) {
                writeFileSync(fullPath, content, 'utf8');
                console.log(✅ Fixed: );
            }
        }
    }
}

fixImports('./src');
console.log('✅ All imports fixed!');
