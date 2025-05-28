const { spawn } = require('child_process');
const path = require('path');

// Start JSON Server
const jsonServer = spawn('node', [
    path.join(__dirname, 'node_modules', 'json-server', 'lib', 'cli', 'bin.js'),
    '--watch',
    'db.json',
    '--port',
    '3001'
], {
    stdio: 'inherit'
});

jsonServer.on('error', (error) => {
    console.error('Failed to start JSON Server:', error);
    process.exit(1);
});

// Start Express Server
const expressServer = spawn('node', ['server.js'], {
    stdio: 'inherit'
});

expressServer.on('error', (error) => {
    console.error('Failed to start Express Server:', error);
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    jsonServer.kill();
    expressServer.kill();
    process.exit();
}); 