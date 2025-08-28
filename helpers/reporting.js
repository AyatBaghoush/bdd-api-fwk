const { allure } = require('allure-cucumberjs');

/**
 * Attach styled text to Allure report
 * @param {Function} attach - Allure attach function
 * @param {string} name - Name of the attachment
 * @param {boolean} isMatch - Whether the test passed or failed
 * @param {string} expected - Expected value
 * @param {string} actual - Actual value
 */
async function attachText(attach, name, isMatch, expected, actual) {
  const styledLog = isMatch
    ? `
      <div style="font-family:Arial; color:#2c3e50;">
        <h3 style="color:#27ae60;">✅ Test Passed</h3>
        <p><strong>Expected:</strong> <em style="color:green;">${expected}</em></p>
        <p><strong>Actual:</strong> <em style="color:green;">${actual}</em></p>
      </div>
    `
    : `
      <div style="font-family:Arial; color:#2c3e50;">
        <h3 style="color:#e74c3c;">🚨 Test Failed</h3>
        <p><strong>Expected:</strong> <em style="color:green;">${expected}</em></p>
        <p><strong>Actual:</strong> <em style="color:red;">${actual}</em></p>
      </div>
    `;
  await attach(styledLog, 'text/html', name);

}

module.exports = { attachText };
