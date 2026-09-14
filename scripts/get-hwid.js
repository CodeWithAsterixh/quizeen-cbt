const os = require('node:os');
const crypto = require('node:crypto');

function getHardwareId() {
  const interfaces = os.networkInterfaces();
  const macs = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
        macs.push(net.mac.toLowerCase());
      }
    }
  }
  macs.sort();
  const rawSeed = [
    macs[0] || '00:11:22:33:44:55',
    os.hostname().toLowerCase(),
    os.platform(),
    os.arch(),
  ].join('|');

  const hash = crypto.createHash('sha256').update(rawSeed).digest('hex').toUpperCase();
  return `QZN-HW-${hash.slice(0, 4)}-${hash.slice(4, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}`;
}

console.log(`\nHardware ID: ${getHardwareId()}\n`);
