const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');
const packages = fs.readdirSync(packagesDir).filter(f => fs.statSync(path.join(packagesDir, f)).isDirectory());

console.log(`Starting publication of ${packages.length} packages...`);

// Check for token in env
const token = process.env.NODE_AUTH_TOKEN;
if (!token) {
    console.warn('Warning: NODE_AUTH_TOKEN not found in environment.');
}

const failedPackages = [];

packages.forEach(pkg => {
    const pkgPath = path.join(packagesDir, pkg);
    const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf8'));

    console.log(`\n--- Publishing ${pkgJson.name} ---`);
    try {
        // Run npm publish in each package directory
        const command = 'npm publish --access public --no-git-checks';
        execSync(command, {
            cwd: pkgPath,
            stdio: 'inherit',
            env: { ...process.env, NODE_AUTH_TOKEN: token }
        });
        console.log(`✅ Successfully published ${pkg}`);
    } catch (error) {
        console.error(`❌ Failed to publish ${pkg}:`, error.message);
        failedPackages.push(pkg);
    }
});

console.log('\n' + '='.repeat(30));
if (failedPackages.length === 0) {
    console.log('🎉 All packages published successfully!');
} else {
    console.log(`⚠️ Completed with errors. Failed packages (${failedPackages.length}):`);
    console.log(failedPackages.join(', '));
}
console.log('='.repeat(30));
