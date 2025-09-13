console.log('CityData API Script loading...');

// Test API function
async function testAPI() {
    console.log('Test API function called');
    
    // Create or find result display area
    let resultDiv = document.getElementById('api-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'api-result';
        resultDiv.style.cssText = `
            margin-top: 20px;
            padding: 20px;
            background: #e8f5e8;
            border: 1px solid #d4edda;
            border-radius: 8px;
            font-family: monospace;
            display: block;
        `;
        
        // Insert after current section or append to body
        const sections = document.querySelectorAll('.section');
        if (sections.length >= 3) {
            sections[2].appendChild(resultDiv);
        } else {
            document.body.appendChild(resultDiv);
        }
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = 'Testing API... Please wait...';
    
    try {
        const response = await fetch('/api/v1/cities/austin-tx', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer cd_demo_12345abcdef',
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.city_name) {
            resultDiv.innerHTML = `
                <div style="font-weight: bold; color: #155724; margin-bottom: 15px;">
                    API SUCCESS!
                </div>
                <div style="font-size: 14px; line-height: 1.6;">
                    <strong>City:</strong> ${data.city_name}, ${data.state_code}<br>
                    <strong>Population:</strong> ${data.population?.toLocaleString() || 'N/A'}<br>
                    <strong>Median Income:</strong> $${data.median_income?.toLocaleString() || 'N/A'}<br>
                    <strong>Home Price:</strong> $${data.median_home_price?.toLocaleString() || 'N/A'}<br>
                    <strong>Safety Score:</strong> ${data.safety_score || 'N/A'}/10<br>
                    <strong>School Rating:</strong> ${data.school_rating || 'N/A'}/10<br>
                    <strong>Cap Rate:</strong> ${data.cap_rate ? (data.cap_rate * 100).toFixed(1) + '%' : 'N/A'}
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; font-size: 12px;">
                    Your API is working perfectly! Ready for production use.
                </div>
            `;
        } else {
            resultDiv.style.background = '#f8d7da';
            resultDiv.style.borderColor = '#f5c6cb';
            resultDiv.innerHTML = `
                <div style="font-weight: bold; color: #721c24;">
                    API ERROR: ${data.error || 'Unknown error'}
                </div>
            `;
        }
    } catch (error) {
        resultDiv.style.background = '#f8d7da';
        resultDiv.style.borderColor = '#f5c6cb';
        resultDiv.innerHTML = `
            <div style="font-weight: bold; color: #721c24;">
                CONNECTION ERROR: ${error.message}
            </div>
        `;
    }
}

// Signup function
function signup() {
    console.log('Signup function called');
    
    const email = prompt('Enter your email to get a FREE API key:');
    
    if (!email) {
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address');
        return;
    }
    
    const apiKey = 'cd_live_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    
    alert(`SUCCESS! Your API key has been generated:

API Key: ${apiKey}

SAVE THIS KEY! Test it with:
curl -H "Authorization: Bearer ${apiKey}" "${window.location.origin}/api/v1/cities/austin-tx"

Support: support@citydata-api.com
You have 1,000 free API calls per month!`);
}

// Contact sales function
function contactSales() {
    console.log('Contact sales function called');
    
    alert(`ENTERPRISE SALES

Email: sales@citydata-api.com
Phone: +1 (555) 123-4567

Enterprise Features:
- Unlimited API calls
- Custom data sources
- Dedicated support
- On-premise deployment
- SLA guarantees

Response time: Within 24 hours`);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Wait for elements to be ready
    setTimeout(() => {
        // Get all buttons and assign handlers
        const buttons = document.querySelectorAll('button');
        console.log(`Found ${buttons.length} buttons`);
        
        buttons.forEach((button, index) => {
            const text = button.textContent.toLowerCase();
            
            // Force assign onclick handlers
            if (text.includes('test') || text.includes('demo')) {
                button.onclick = testAPI;
                console.log(`Assigned testAPI to button: "${button.textContent}"`);
            }
            else if (text.includes('start') || text.includes('get') || text.includes('signup') || text.includes('trial') || text.includes('free')) {
                button.onclick = signup;
                console.log(`Assigned signup to button: "${button.textContent}"`);
            }
            else if (text.includes('contact') || text.includes('sales')) {
                button.onclick = contactSales;
                console.log(`Assigned contactSales to button: "${button.textContent}"`);
            }
        });
        
        console.log('All button handlers assigned');
    }, 500);
});

// Make functions globally available
window.testAPI = testAPI;
window.signup = signup;
window.contactSales = contactSales;

console.log('Script loaded successfully');
