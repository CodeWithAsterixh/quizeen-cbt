import { generateEd25519Keypair, signLicensePayload, verifySignedToken } from '../../quizeen-licensing-portal/src/lib/crypto.js';
import { cryptoLicenseService } from '../apps/server/src/features/license/crypto-license.service.js';
import { tamperTrapService } from '../apps/server/src/features/license/tamper-trap.service.js';
import { getHardwareId } from '../apps/server/src/features/license/hardware.service.js';

async function runTest() {
  console.log('Testing Cryptographic Licensing System Flow...');

  // 1. Generate Keypair
  const { publicKeyPem, privateKeyBase64 } = generateEd25519Keypair();
  process.env.QUEEZ_LICENSE_PUBLIC_KEY = publicKeyPem;
  console.log('1. Generated Ed25519 Keypair & loaded public key.');

  // 2. Hardware ID
  const serverHardwareId = getHardwareId();
  console.log('2. Detected Server Hardware ID:', serverHardwareId);

  // 3. Create License Payload with White-label Customization
  const validUntil = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString();
  const payload = {
    licenseId: 'LIC-TEST-2026',
    issuedAt: new Date().toISOString(),
    validUntil,
    term: 'First Term 2026/2027',
    hardwareId: serverHardwareId,
    stationLimit: 75,
    branding: {
      schoolName: 'King\'s College Lagos',
      shortName: 'KCL',
      schoolCode: 'KCL-001',
      motto: 'Knowledge is Power',
      watermarkText: 'King\'s College Examination',
      headerText: 'King\'s College CBT Platform',
    },
    theme: {
      primaryColor: '#1e40af',
      accentColor: '#3b82f6',
      surfaceMode: 'light' as const,
      borderRadius: 'md' as const,
      fontPreset: 'inter' as const,
    },
    features: ['offline_runner', 'automated_grading', 'analytics'],
  };

  // 4. Sign with Private Key
  const token = signLicensePayload(payload, privateKeyBase64);
  console.log('3. Signed license payload. Signature len:', token.signature.length);

  // 5. Verify in browser/portal crypto
  const portalVerified = verifySignedToken(token, publicKeyPem);
  console.log('4. Portal self-verification:', portalVerified ? 'PASSED' : 'FAILED');
  if (!portalVerified) throw new Error('Portal self-verification failed');

  // 6. Verify with Server crypto service
  const sigValid = cryptoLicenseService.verifySignature(token);
  console.log('5. Server crypto signature verification:', sigValid ? 'PASSED' : 'FAILED');
  if (!sigValid) throw new Error('Server crypto signature verification failed');

  // 7. Activate on Server
  const actResult = cryptoLicenseService.activateLicense(JSON.stringify(token));
  console.log('6. Server activation status:', actResult.state.status);
  if (actResult.state.status !== 'active') {
    throw new Error(`Server activation failed: ${actResult.error || actResult.state.message}`);
  }

  // 8. Test Tamper Clock Trap
  const trapResult = tamperTrapService.verifyAndRecordTimestamp();
  console.log('7. Anti-Tamper Clock Trap Check:', trapResult.valid ? 'PASSED (Clock OK)' : 'FAILED');

  // Simulate Clock Rollback: record future time then simulate past time
  tamperTrapService.verifyAndRecordTimestamp(Date.now() + 86400000); // 1 day in future
  const rollbackCheck = tamperTrapService.verifyAndRecordTimestamp(Date.now());
  console.log('8. Clock Rollback Trap Caught:', !rollbackCheck.valid ? 'PASSED (Tamper Caught)' : 'FAILED');
  if (rollbackCheck.valid) throw new Error('Failed to catch clock rollback');

  console.log('\nALL CRYPTOGRAPHIC, TIME-BOMB & ANTI-TAMPER TESTS PASSED SUCCESSFULLY.');
}

runTest().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
