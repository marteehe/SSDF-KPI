const fs = require('fs');

function updateDocumentation(riskReportPath, advisoryPath, outputPath) {
    try {
        // Check if required files exist
        if (!fs.existsSync(riskReportPath)) {
            console.error(`Error: ${riskReportPath} not found!`);
            process.exit(1);
        }
        if (!fs.existsSync(advisoryPath)) {
            console.error(`Error: ${advisoryPath} not found!`);
            process.exit(1);
        }

        console.log('Updating documentation...');

        // Read contents of the risk report and advisory report
        const riskReportContent = fs.readFileSync(riskReportPath, 'utf8');
        const advisoryContent = fs.readFileSync(advisoryPath, 'utf8');

        // Generate documentation content
        let documentationContent = `# Documentation Update\n\n**Generated at:** ${new Date().toISOString()}\n\n`;
        documentationContent += `## Risk Report\n\n${riskReportContent}\n\n`;
        documentationContent += `## Advisory Report\n\n${advisoryContent}\n\n`;

        // Write the updated documentation to a file
        fs.writeFileSync(outputPath, documentationContent);
        console.log('Documentation updated successfully.');
    } catch (error) {
        console.error('Error updating documentation:', error);
    }
}

// Use command-line arguments or default file paths
const riskReportPath = process.argv[2] || 'risk_report.md';
const advisoryPath = process.argv[3] || 'detailed_advisory.md';
const outputPath = process.argv[4] || 'documentation_update.md';
updateDocumentation(riskReportPath, advisoryPath, outputPath);
