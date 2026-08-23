import { cp, mkdir } from 'fs/promises';
import { existsSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, 'src');
const distDir = join(__dirname, 'dist');

console.log('========================================');
console.log('  COPYING ASSETS TO DIST');
console.log('========================================');
console.log(`Source: ${srcDir}`);
console.log(`Dist: ${distDir}`);

async function copyDir(src, dest) {
    if (!existsSync(src)) {
        console.warn(`⚠️ Source not found: ${src}`);
        return false;
    }

    if (!existsSync(dest)) {
        await mkdir(dest, { recursive: true });
    }

    const items = readdirSync(src);
    for (const item of items) {
        const srcPath = join(src, item);
        const destPath = join(dest, item);
        const stats = statSync(srcPath);

        if (stats.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            try {
                await cp(srcPath, destPath, { force: true });
            } catch (err) {
                console.error(`  ❌ Failed to copy ${item}:`, err.message);
            }
        }
    }
    return true;
}

async function copyAssets() {
    try {
        // Copy views
        console.log('\n📁 Copying views...');
        const viewsSrc = join(srcDir, 'views');
        const viewsDist = join(distDir, 'views');

        if (existsSync(viewsSrc)) {
            await copyDir(viewsSrc, viewsDist);
            console.log('✅ Views copied successfully');
        } else {
            console.error('❌ Views source not found!');
        }

        // Verify admin-base.njk
        console.log('\n🔍 Verifying admin-base.njk...');
        const adminBasePath = join(viewsDist, 'admin', 'admin-base.njk');
        if (existsSync(adminBasePath)) {
            const stats = statSync(adminBasePath);
            console.log(`✅ admin-base.njk FOUND! Size: ${stats.size} bytes`);
        } else {
            console.log('⚠️ admin-base.njk NOT found!');
            // Try emergency copy
            const srcAdminBase = join(viewsSrc, 'admin', 'admin-base.njk');
            if (existsSync(srcAdminBase)) {
                const destDir = join(viewsDist, 'admin');
                if (!existsSync(destDir)) {
                    await mkdir(destDir, { recursive: true });
                }
                await cp(srcAdminBase, adminBasePath, { force: true });
                console.log(`✅ Emergency copy succeeded: ${adminBasePath}`);
            }
        }

        // Copy public
        console.log('\n📁 Copying public files...');
        const publicSrc = join(srcDir, 'public');
        const publicDist = join(distDir, 'public');

        if (existsSync(publicSrc)) {
            await copyDir(publicSrc, publicDist);
            console.log('✅ Public files copied successfully');
        } else {
            console.warn('⚠️ Public source not found, skipping...');
        }

        console.log('\n========================================');
        console.log('  COPY COMPLETE');
        console.log('========================================');
        
    } catch (error) {
        console.error('❌ Copy failed:', error);
        console.log('⚠️ Continuing with build despite errors...');
    }
}

copyAssets();
