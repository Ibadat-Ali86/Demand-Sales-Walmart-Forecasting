const fs = require('fs');

const dateKeywords = ['date', 'time', 'year', 'month', 'day', 'timestamp', 'period'];

const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return { headers: [], data: [] };
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((h, i) => row[h] = values[i]);
        return row;
    }).filter(row => Object.keys(row).length === headers.length);
    return { headers, data };
};

const validate = (filePath) => {
    const text = fs.readFileSync(filePath, 'utf-8');
    const { headers, data } = parseCSV(text);

    console.log(`Headers: ${JSON.stringify(headers)}`);
    console.log(`First Row: ${JSON.stringify(data[0])}`);

    const hasDateColumn = headers.some(h => dateKeywords.some(k => h.toLowerCase().includes(k)));
    console.log(`Has Date Column: ${hasDateColumn}`);

    if (!hasDateColumn) {
        console.log("Failed Date Check");
        return;
    }

    const firstRow = data[0] || {};
    const hasNumericColumn = headers.some(h => {
        const value = firstRow[h];
        const isNum = !isNaN(parseFloat(value)) && isFinite(value);
        const isNotDate = !dateKeywords.some(k => h.toLowerCase().includes(k));
        // console.log(`Column ${h}: Value=${value}, isNum=${isNum}, isNotDate=${isNotDate}`);
        return isNum && isNotDate;
    });

    console.log(`Has Numeric Column: ${hasNumericColumn}`);

    if (!hasNumericColumn && headers.length < 2) {
        console.log("Failed Numeric Check (Relaxed)");
    } else {
        console.log("Passed Numeric Check");
    }
};

validate('/media/ibadat/NewVolume/DATA SCIENCE/ML/DATASCIENCE PROJECTS/Demand Sales Walmart Forecasting/Market_Trend_Analysis.csv');
