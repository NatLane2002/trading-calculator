function validateAndCalculate() {
    // Get input values
    const capital = document.getElementById('capital').value;
    const maxLosingStreak = document.getElementById('losingStreak').value;
    const averageR = document.getElementById('averageR').value;
    const currency = document.getElementById('currency').value;

    // Validate inputs
    if (!capital || capital < 50000 || capital > 750000 || capital % 50000 !== 0) {
        showToast("Please enter a valid capital amount (50k-750k).");
        return;
    }

    if (!maxLosingStreak || maxLosingStreak <= 0) {
        showToast("Please enter a valid number of losing trades.");
        return;
    }

    if (!averageR || averageR <= 0) {
        showToast("Please enter a valid average R gain per week.");
        return;
    }

    if (!currency) {
        showToast("Please select a currency.");
        return;
    }

    // If all inputs are valid, proceed with the calculation
    calculate();
}

function calculate() {
    const capital = parseFloat(document.getElementById('capital').value);
    const maxLosingStreak = parseInt(document.getElementById('losingStreak').value);
    const averageR = parseFloat(document.getElementById('averageR').value);
    const over50k = document.getElementById('over50k').checked;
    const currency = document.getElementById('currency').value;
    const customRate = parseFloat(document.getElementById('customRate').value);

    const conversionRates = {
        USD: 1,
        CAD: 1.36,
        EUR: 0.90,
        GBP: 0.77,
        CHF: 0.86,
        AUD: 1.48
    };

    let drawdownLimit;

    if (capital <= 50000) {
        drawdownLimit = 2000;
    } else if (capital > 50000 && capital <= 250000) {
        drawdownLimit = over50k ? 1500 : 2000;
    } else {
        drawdownLimit = 1500;
    }

    const riskPer50k = drawdownLimit / maxLosingStreak;
    const numberOf50kUnits = capital / 50000;
    const riskPerTrade = riskPer50k * numberOf50kUnits;

    // Use the custom rate if provided and is a valid number; otherwise, use the default rate
    const conversionRate = !isNaN(customRate) && customRate > 0 ? customRate : conversionRates[currency];

    const weeklyEarningsUSD = averageR * riskPerTrade;
    const dailyEarnings = (weeklyEarningsUSD / 5) * conversionRate;
    const weeklyEarnings = weeklyEarningsUSD * conversionRate;
    const monthlyEarnings = weeklyEarnings * 4;
    const yearlyEarnings = monthlyEarnings * 12;

    let resultsHTML = `
        <p>You can risk approximately $${riskPerTrade.toFixed(2)} per trade.</p>
    `;

    if (capital > 50000) {
        resultsHTML += `
            <p>Risk per 50k: $${riskPer50k.toFixed(2)}</p>
        `;
    }

    resultsHTML += `
    <hr>
        <p>Estimated earnings (in ${currency}):</p>
        <p>Daily: $${dailyEarnings.toFixed(2)}</p>
        <p>Weekly: $${weeklyEarnings.toFixed(2)}</p>
        <p>Monthly: $${monthlyEarnings.toFixed(2)}</p>
        <p>Yearly: $${yearlyEarnings.toFixed(2)}</p>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}

function resetForm() {
    document.getElementById('capital').value = '';
    document.getElementById('losingStreak').value = '';
    document.getElementById('averageR').value = '';
    document.getElementById('over50k').checked = false;
    document.getElementById('currency').value = 'USD';
    document.getElementById('results').innerHTML = '';
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(function() { toast.className = toast.className.replace("show", ""); }, 3000);
}
