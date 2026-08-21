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
            let changed = false;
            
            // Fix all import/from statements without .js extension
            content = content.replace(/(from\s+['"]\.\.\/[^'"]+)(?<!\.js)(?<!\.json)(['"])/g, (match, p1, p2) => {
                changed = true;
                return \.js\;
            });
            
            content = content.replace(/(from\s+['"]\.\/[^'"]+)(?<!\.js)(?<!\.json)(['"])/g, (match, p1, p2) => {
                changed = true;
                return \.js\;
            });
            
            if (changed) {
                writeFileSync(fullPath, content, 'utf8');
                console.log(✅ Fixed: );
            }
        }
    }
}

fixAllImports('./src');
console.log('✅ All imports fixed!');
