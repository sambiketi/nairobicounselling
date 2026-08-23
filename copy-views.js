import { cp, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const srcDir = new URL('./src', import.meta.url).pathname;
const distDir = new URL('./dist', import.meta.url).pathname;

async function copyAssets() {
    try {
        // Copy views
        const viewsSrc = `${srcDir}/views`;
        const viewsDist = `${distDir}/views`;
        
        if (!existsSync(viewsDist)) {
            await mkdir(viewsDist, { recursive: true });
        }
        
        await cp(viewsSrc, viewsDist, { recursive: true, force: true });
        console.log('✅ Views copied successfully');
        
        // Copy public
        const publicSrc = `${srcDir}/public`;
        const publicDist = `${distDir}/public`;
        
        if (!existsSync(publicDist)) {
            await mkdir(publicDist, { recursive: true });
        }
        
        await cp(publicSrc, publicDist, { recursive: true, force: true });
        console.log('✅ Public files copied successfully');
    } catch (error) {
        console.error('❌ Copy failed:', error);
        process.exit(1);
    }
}

copyAssets();
