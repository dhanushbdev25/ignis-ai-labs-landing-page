/**
 * IndexNow submission script for Ignis AI Labs
 * Usage: node scripts/ping-indexnow.js
 */

const HOST = 'ignisailabs.com';
const KEY = '4f9b2d8e7c1a49a8b13c52e786df9012';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/solutions/production-routing-chart`,
  `https://${HOST}/solutions/warehouse-management-system`,
  `https://${HOST}/solutions/erp-for-manufacturers`,
  `https://${HOST}/solutions/logistics-software`,
  `https://${HOST}/services/sap-and-system-integration`,
  `https://${HOST}/services/ai-automation-for-manufacturing`,
  `https://${HOST}/services/custom-software-for-factories`,
  `https://${HOST}/industries/composites-and-fiber-moulding`,
  `https://${HOST}/case-studies`,
  `https://${HOST}/case-studies/production-routing-chart`,
  `https://${HOST}/case-studies/warehouse-management-system`,
  `https://${HOST}/case-studies/import-export-workflow-handler`,
  `https://${HOST}/about`,
  `https://${HOST}/contact`,
  `https://${HOST}/faq`,
];

async function submit() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Successfully submitted ${URLS.length} URLs to IndexNow (Status ${res.status}).`);
    } else {
      console.warn(`[IndexNow] Submission returned status: ${res.status} ${res.statusText}`);
    }
  } catch (error) {
    console.error('[IndexNow] Failed to ping IndexNow endpoint:', error);
  }
}

submit();

