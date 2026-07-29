#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

for (const fileName of ['package-lock.json', 'yarn.lock']) {
    const filePath = path.join(root, fileName);
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        if (error && error.code !== 'ENOENT') {
            throw error;
        }
    }
}

const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.startsWith('pnpm/')) {
    console.error('Use pnpm instead');
    process.exit(1);
}
