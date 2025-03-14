const fs = require('fs');

// Assign a severity score based on vulnerability severity level
function evaluateRisk(vulnerabilities) {
    return vulnerabilities.map(vuln => {
        let severityScore;
        switch (vuln.Severity) {
            case 'CRITICAL':
                severityScore = 5;
                break;
            case 'HIGH':
                severityScore = 4;
                break;
            case 'MEDIUM':
                severityScore = 3;
                break;
            case 'LOW':
                severityScore = 2;
                break;
            default:
                severityScore = 1;
        }
        return {
            ...vuln,
            severityScore
        };
    });
}

// Generate a risk report from the Trivy scan results
function generateRiskReport(trivyReportPath, outputPath) {
    try {
        // Read and parse the Trivy JSON report
        const rawData = fs.readFileSync(trivyReportPath, 'utf8');
        const report = JSON.parse(rawData);

        console.log('Parsed report:', report);

        // Extract vulnerabilities from the report (handle missing data)
        const vulnerabilities = report.Results ? report.Results.flatMap(result => result.Vulnerabilities || []) : [];

        console.log('Parsed vulnerabilities:', vulnerabilities);

        // Assign severity scores to vulnerabilities
        const evaluatedVulnerabilities = evaluateRisk(vulnerabilities);

        // Build the markdown report
        let reportContent = '# Risk Report\n\n';
        evaluatedVulnerabilities.forEach(vuln => {
            reportContent += `## ${vuln.VulnerabilityID}\n`;
            reportContent += `- Severity: ${vuln.Severity}\n`;
            reportContent += `- Severity Score: ${vuln.severityScore}\n`;
            reportContent += `- Description: ${vuln.Description}\n\n`;
        });

        // Write the risk report to a file
        fs.writeFileSync(outputPath, reportContent);
        console.log('Risk report generated successfully.');
    } catch (error) {
        console.error('Error generating risk report:', error);
    }
}

// Read file paths from command-line arguments or use default values
const trivyReportPath = process.argv[2] || 'trivy-report.json';
const outputPath = process.argv[3] || 'risk_report.md';

// Generate the risk report
generateRiskReport(trivyReportPath, outputPath);

