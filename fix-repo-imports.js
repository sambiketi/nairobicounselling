import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function fixRepoImports(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            fixRepoImports(fullPath);
        } else if (extname(file) === '.ts') {
            let content = readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Fix imports without .js extension
            content = content.replace(/from\s+['"]\.\.\/([^'"]+?)(?<!\.js)['"]/g, (match, p1) => {
                if (p1.match(/^[a-zA-Z@]/)) return match;
                return rom '../.js';
            });
            
            content = content.replace(/from\s+['"]\.\/([^'"]+?)(?<!\.js)['"]/g, (match, p1) => {
                if (p1.match(/^[a-zA-Z@]/)) return match;
                return rom './.js';
            });
            
            if (content !== original) {
                writeFileSync(fullPath, content, 'utf8');
                console.log(✅ Fixed: );
            }
        }
    }
}

fixRepoImports('./src/db/repositories');
fixRepoImports('./src/modules');
console.log('✅ All imports fixed!');
