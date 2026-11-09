import { POST, OPTIONS, ALL, contactFormSchema } from '../src/pages/api/send-email.ts';

async function runTests() {
  console.log('=== RUNNING TESTS FOR /api/send-email ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Schema Validation Tests
  console.log('--- Testing Zod Validation Schema ---');
  
  const validData = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    subject: 'AI Pipeline Consultation',
    message: 'We want to build an automated LLM pipeline for enterprise data analysis.',
  };
  const schemaResultValid = contactFormSchema.safeParse(validData);
  assert(schemaResultValid.success, 'Valid contact data passes schema validation');

  const invalidEmailData = { ...validData, email: 'not-an-email' };
  const schemaResultInvalidEmail = contactFormSchema.safeParse(invalidEmailData);
  assert(!schemaResultInvalidEmail.success, 'Invalid email fails schema validation');

  const missingNameData = { ...validData, name: '' };
  const schemaResultMissingName = contactFormSchema.safeParse(missingNameData);
  assert(!schemaResultMissingName.success, 'Missing name fails schema validation');

  const missingMessageData = { ...validData, message: '' };
  const schemaResultMissingMessage = contactFormSchema.safeParse(missingMessageData);
  assert(!schemaResultMissingMessage.success, 'Missing message fails schema validation');

  // 2. HTTP Method Handling
  console.log('\n--- Testing HTTP Method Restrictions ---');

  const optionsResponse = await OPTIONS({
    request: new Request('http://localhost/api/send-email', { method: 'OPTIONS' }),
  });
  assert(optionsResponse.status === 204, 'OPTIONS returns HTTP 204');
  assert(
    optionsResponse.headers.get('Access-Control-Allow-Methods')?.includes('POST'),
    'OPTIONS returns Access-Control-Allow-Methods header'
  );

  const getResponse = await ALL({
    request: new Request('http://localhost/api/send-email', { method: 'GET' }),
  });
  assert(getResponse.status === 405, 'GET returns HTTP 405 Method Not Allowed');
  assert(
    getResponse.headers.get('Allow')?.includes('POST'),
    '405 response includes Allow: POST header'
  );

  // 3. Payload size and JSON parsing
  console.log('\n--- Testing Malformed JSON and Payload Limits ---');

  const malformedReq = new Request('http://localhost/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ bad-json,',
  });
  const malformedRes = await POST({ request: malformedReq, locals: {} });
  assert(malformedRes.status === 400, 'Malformed JSON returns HTTP 400 Bad Request');
  const malformedJson = await malformedRes.json();
  assert(malformedJson.error.includes('Malformed JSON'), 'Malformed JSON has informative error message');

  const largeReq = new Request('http://localhost/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': '70000' },
    body: JSON.stringify({ name: 'A'.repeat(70000) }),
  });
  const largeRes = await POST({ request: largeReq, locals: {} });
  assert(largeRes.status === 413, 'Excessive payload returns HTTP 413 Payload Too Large');

  // 4. Honeypot Spam Protection
  console.log('\n--- Testing Honeypot Spam Trap ---');
  const spamReq = new Request('http://localhost/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...validData, website: 'http://spam-link.ru' }),
  });
  const spamRes = await POST({ request: spamReq, locals: {} });
  assert(spamRes.status === 400, 'Honeypot-filled request is rejected with HTTP 400');

  // 5. Missing Environment Variables Handling
  console.log('\n--- Testing Environment Variable Verification ---');
  const missingEnvReq = new Request('http://localhost/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validData),
  });
  // locals with no RESEND_API_KEY
  const missingEnvRes = await POST({ request: missingEnvReq, locals: { runtime: { env: {} } } });
  assert(missingEnvRes.status === 500, 'Missing RESEND_API_KEY returns HTTP 500');
  const missingEnvJson = await missingEnvRes.json();
  assert(missingEnvJson.error.includes('RESEND_API_KEY'), 'Missing RESEND_API_KEY is properly diagnosed');

  // 6. Resend API Error Handling (with dummy key)
  console.log('\n--- Testing Resend API Error Handling ---');
  const dummyKeyReq = new Request('http://localhost/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validData),
  });
  const dummyLocals = {
    runtime: {
      env: {
        RESEND_API_KEY: 're_test_dummy_key_12345',
        CONTACT_EMAIL: 'contact@ignisailabs.com',
        RESEND_FROM_EMAIL: 'hello@ignisailabs.com',
      },
    },
  };
  const dummyRes = await POST({ request: dummyKeyReq, locals: dummyLocals });
  assert(
    dummyRes.status === 502,
    `Resend API error returns HTTP 502 (Received HTTP ${dummyRes.status})`
  );
  const dummyJson = await dummyRes.json();
  assert(!!dummyJson.error, `Resend error is handled cleanly: "${dummyJson.error}"`);

  // 7. Field alias mapping (ConsultationForm compatibility)
  console.log('\n--- Testing Field Mapping (ConsultationForm -> send-email) ---');
  const consultationFormData = {
    fullName: 'Grace Hopper',
    email: 'grace@navy.mil',
    primaryInterest: 'AI Engineering & Agents',
    background: 'Enterprise Executive',
    goals: 'We need to modernize legacy compiler infrastructure with agentic workflows.',
    mobile: '+1 555-0199',
    company: 'US Navy / Harvard',
  };
  const mappedReq = new Request('http://localhost/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(consultationFormData),
  });
  // Should pass validation and attempt Resend call (returning 502 with dummy key rather than 400 validation error)
  const mappedRes = await POST({ request: mappedReq, locals: dummyLocals });
  assert(
    mappedRes.status === 502,
    `Form field aliases (fullName, goals, primaryInterest) normalized and passed Zod validation`
  );

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});

