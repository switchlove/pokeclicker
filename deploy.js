// Deploys the website build in docs/ (from `npm run website`) to the server
// configured by DEPLOY in config.js. See _config.js for the settings.
//
// Remote steps, in one ssh session:
//   1. Back up the live site to BACKUP/game-<timestamp>.tar.gz
//   2. Receive the new build into a staging dir (a failed upload leaves the live site untouched)
//   3. Delete the previous build's files, as listed in its .deploy-manifest (hand-added files are kept)
//   4. Copy the new build in, with a fresh .deploy-manifest
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const fail = (msg) => {
    console.error(`[deploy] ${msg}`);
    process.exit(1);
};

let deploy;
try {
    ({ DEPLOY: deploy } = require('./config.js'));
} catch (err) {
    fail('No config.js found. Copy the DEPLOY entry from _config.js into config.js.');
}
if (!deploy || !deploy.HOST || !deploy.PATH || !deploy.BACKUP) {
    fail('DEPLOY is not set in config.js. It needs HOST, PATH and BACKUP (see _config.js).');
}

const docs = path.join(__dirname, 'docs');
if (!fs.existsSync(path.join(docs, 'index.html'))) {
    fail('docs/index.html not found. Run `npm run website` first.');
}
const { version } = JSON.parse(fs.readFileSync(path.join(docs, 'package.json'), 'utf8'));

const remoteScript = `
set -euo pipefail
GAME="$1"; BACKUP="$2"
mkdir -p "$GAME" "$BACKUP"

ARCHIVE="$BACKUP/game-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$ARCHIVE" -C "$GAME" .
echo "[deploy] Backed up live site to $ARCHIVE"

STAGE=$(mktemp -d); MANIFEST=$(mktemp)
trap 'rm -rf "$STAGE" "$MANIFEST"' EXIT
chmod 755 "$STAGE"
tar -xzf - -C "$STAGE"
( cd "$STAGE" && find . -type f ) > "$MANIFEST"
chmod 644 "$MANIFEST"
cp "$MANIFEST" "$STAGE/.deploy-manifest"

if [ -f "$GAME/.deploy-manifest" ]; then
    ( cd "$GAME" && xargs -d '\\n' rm -f -- < .deploy-manifest )
else
    echo "[deploy] First deploy (no manifest). Live files not in this build, left in place:"
    ( cd "$GAME" && find . -type f ) | grep -vxFf "$STAGE/.deploy-manifest" || echo "  (none)"
fi

cp -a "$STAGE/." "$GAME/"
find "$GAME" -mindepth 1 -type d -empty -delete
echo "[deploy] Deployed $(wc -l < "$GAME/.deploy-manifest") files to $GAME"
`;

// The tar stream uses ssh's stdin, so the script travels base64-encoded in the
// command line (safe through Windows argument quoting) and is decoded remotely.
const shq = (s) => `'${String(s).replace(/'/g, '\'\\\'\'')}'`;
// Strip \r so a CRLF checkout (core.autocrlf) can't break the remote bash script.
const b64 = Buffer.from(remoteScript.replace(/\r/g, '')).toString('base64');
const remoteCmd = `bash -c "$(echo ${b64} | base64 -d)" deploy ${shq(deploy.PATH)} ${shq(deploy.BACKUP)}`;

console.log(`[deploy] Uploading v${version} build to ${deploy.HOST}:${deploy.PATH}`);
const tar = spawn('tar', ['-czf', '-', '-C', docs, '.'], { stdio: ['ignore', 'pipe', 'inherit'] });
const ssh = spawn('ssh', [deploy.HOST, remoteCmd], { stdio: ['pipe', 'inherit', 'inherit'] });
tar.stdout.pipe(ssh.stdin);

let tarCode = null;
tar.on('error', (err) => fail(`Could not run tar: ${err.message}`));
ssh.on('error', (err) => fail(`Could not run ssh: ${err.message}`));
tar.on('close', (code) => { tarCode = code; });
ssh.on('close', (code) => {
    if (tarCode !== 0 && tarCode !== null) fail(`Local tar failed (exit ${tarCode}); the live site was not changed.`);
    if (code !== 0) fail(`Remote deploy failed (exit ${code}). If it failed after the backup, restore from the archive in ${deploy.BACKUP}.`);
    console.log(`[deploy] Done: v${version} is live.`);
});
