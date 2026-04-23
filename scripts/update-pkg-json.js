const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');
const packages = fs.readdirSync(packagesDir).filter(f => fs.statSync(path.join(packagesDir, f)).isDirectory());

const repoUrl = 'git+https://github.com/AdekunleBamz/StacksDao.git';
const license = 'MIT';

packages.forEach(pkg => {
    const pkgJsonPath = path.join(packagesDir, pkg, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

        pkgJson.publishConfig = { access: 'public' };
        pkgJson.files = ['dist'];
        pkgJson.license = license;
        pkgJson.repository = {
            type: 'git',
            url: repoUrl
        };

        // Ensure version is correct (optional, but good to check)
        if (!pkgJson.version) pkgJson.version = '1.0.0';

        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
        console.log(`Updated ${pkg}/package.json`);
    }
});
