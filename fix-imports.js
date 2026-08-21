import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function fixAllImports(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            fixAllImports(fullPath);
        } else if (extname(file) === '.ts') {
            let content = readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Fix: from '../../something' -> from '../../something.js'
            content = content.replace(/from\s+['"]\.\.\/([^'"]+?)(?<!\.js)(?<!\.json)(?<!\.d\.ts)['"]/g, (match, p1) => {
                if (p1.match(/^[a-zA-Z@]/)) return match;
                return rom '../.js';
            });
            
            // Fix: from './something' -> from './something.js'
            content = content.replace(/from\s+['"]\.\/([^'"]+?)(?<!\.js)(?<!\.json)(?<!\.d\.ts)['"]/g, (match, p1) => {
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

fixAllImports('./src');
console.log('✅ All imports fixed!');
