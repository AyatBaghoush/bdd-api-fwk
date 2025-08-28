module.exports = {
    default: {
        paths: ["features"],
        dryRun: false,
      require: [
            "steps/**/*.js",
            "helpers/**/*.js"
        ],
        format: [
            "progress-bar",
            "summary",
            "json:reports/reports/report.json",
            "html:reports/cucumber-report.html",
            "allure-cucumberjs/reporter"
        ],
        formatOptions: {
            colorsEnabled: true,
            snippetInterface: "async-await",
            resultsDir: "reports/allure-results"
        }
    }
  
};