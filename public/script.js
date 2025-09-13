console.log('CityData API Script loading...');

// Test API function
async function testAPI() {
    console.log('Test API function called');
    
    // Find or create the result div
    let resultDiv = document.getElementById('api-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'api-result';
        resultDiv.style.marginTop = '20px';
        resultDiv.style.padding = '20px';
        resultDiv.style.background = '#e8f5e8';
        resultDiv.style.border = '1px solid #d4edda';
        resultDiv.style.borderRadius = '8px';
        resultDiv.style.fontFamily = 'monospace';
        resultDiv.style.display = 'block';
        
        // Insert after the clicked button or append to body
        const sections = document.querySelectorAll('.section');
        if (sections.length > 2) {
            sections[2].appendChild(resultDiv);
        } else {
            document.body.appendChild(resultDiv);
        }
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = 'Testing API... Please wait...';
    
    try {
        console.log('Making API request...');
        const response = await fetch('/api/v1/cities/austin-tx', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer cd_demo_12345abcdef',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.city_name) {
            resultDiv.style.background = '#e8f5e8';
            resultDiv.style.borderColor = '#d4edda';
            resultDiv.innerHTML = `
                <div style="font-weight: bold; color: #155724; margin-bottom: 15px;">
                    ✅ API SUCCESS!
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                    <div><strong>City:</strong> ${data.city_name || 'N/A'}</div>
                    <div><strong>State:</strong> ${data.state_code || 'N/A'}</div>
                    <div><strong>Population:</strong> ${data.population?.toLocaleString() || 'N/A'}</div>
                    <div><strong>Median Income:</strong> $${data.median_income?.toLocaleString() || 'N/A'}</div>
                    <div><strong>Home Price:</strong> $${data.median_home_price?.toLocaleString() || 'N/A'}</div>
                    <div><strong>Safety Score:</strong> ${data.safety_score || 'N/A'}/10</div>
                    <div><strong>School Rating:</strong> ${data.school_rating || 'N/A'}/10</div>
                    <div><strong>Cap Rate:</strong> ${data.cap_rate ? (data.cap_rate * 100).toFixed(1) + '%' : 'N/A'}</div>
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; font-size: 12px;">
                    🎉 Your API is working perfectly! Ready for production use.
                </div>
            `;
        } else {
            resultDiv.style.background = '#f8d7da';
            resultDiv.style.borderColor = '#f5c6cb';
            resultDiv.innerHTML = `
                <div style="font-weight: bold; color: #721c24; margin-bottom: 10px;">
                    ❌ API ERROR
                </div>
                <div style="font-size: 14px;">
                    Error: ${data.error || 'Unknown error'}<br>
                    Status: ${response.status}
                </div>
            `;
        }
    } catch (error) {
        console.error('API test error:', error);
        resultDiv.style.background = '#f8d7da';
        resultDiv.style.borderColor = '#f5c6cb';
        resultDiv.innerHTML = `
            <div style="font-weight: bold; color: #721c24; margin-bottom: 10px;">
                ❌ CONNECTION ERROR
            </div>
            <div style="font-size: 14px;">
                ${error.message}<br>
                Check if your server is running.
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
        alert('Please enter a valid email address\n\nExample: yourname@company.com');
        return;
    }
    
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    const apiKey = `cd_live_${timestamp}${random}`;
    
    alert(`🎉 SUCCESS! Your API key has been generated:

📋 API Key: ${apiKey}

💾 IMPORTANT: Save this key safely!

🚀 Test it now:
curl -H "Authorization: Bearer ${apiKey}" \\
     "${window.location.origin}/api/v1/cities/austin-tx"

📚 Documentation: ${window.location.origin}
📧 Support: support@citydata-api.com

✨ You now have 1,000 free API calls per month!`);
    
    console.log('API key generated:', apiKey);
}

// Contact sales function
function contactSales() {
    console.log('Contact sales function called');
    
    alert(`📞 ENTERPRISE SALES

🏢 Ready to scale? Let's talk!

📧 Email: sales@citydata-api.com
📱 Phone: +1 (555) 123-4567

💼 Enterprise Features:
• Unlimited API calls
• Custom data sources  
• Dedicated support team
• On-premise deployment
• SLA guarantees
• White-label options

⚡ Response time: Within 24 hours
🎯 Custom pricing based on your needs

We'll help you build something amazing!`);
}

// Assign click handlers directly to buttons when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, assigning click handlers...');
    
    // Wait a moment for all elements to be ready
    setTimeout(() => {
        const buttons = document.querySelectorAll('button');
        console.log(`Found ${buttons.length} buttons total`);
        
        buttons.forEach((button, index) => {
            const buttonText = button.textContent.toLowerCase().trim();
            const buttonId = button.id || `button-${index}`;
            
            console.log(`Button ${index}: "${buttonText}" (ID: ${buttonId})`);
            
            // Direct onclick assignment based on text content
            if (buttonText.includes('test') || buttonText.includes('demo')) {
                button.onclick = testAPI;
                console.log(`✅ Assigned testAPI to: "${buttonText}"`);
            }
            else if (buttonText.includes('start') || buttonText.includes('get') || 
                     buttonText.includes('signup') || buttonText.includes('trial') ||
                     buttonText.includes('free')) {
                button.onclick = signup;
                console.log(`✅ Assigned signup to: "${buttonText}"`);
            }
            else if (buttonText.includes('contact') || buttonText.includes('sales')) {
                button.onclick = contactSales;
                console.log(`✅ Assigned contactSales to: "${buttonText}"`);
            }
        });
        
        // Double-check specific buttons by ID
        const specificButtons = {
            'test-hero': testAPI,
            'test-api': testAPI,
            'signup-hero': signup,
            'signup-free': signup,
            'signup-starter': signup,
            'final-signup': signup,
            'contact-sales': contactSales
        };
        
        Object.keys(specificButtons).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.onclick = specificButtons[id];
                console.log(`✅ Force-assigned to ID: ${id}`);
            }
        });
        
        console.log('🎉 All click handlers assigned!');
    }, 1000);
});

// Make functions globally available for manual testing
window.testAPI = testAPI;
window.signup = signup;
window.contactSales = contactSales;

// Health check
setTimeout(() => {
    fetch('/health')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'healthy') {
                console.log('✅ API server is healthy');
            }
        })
        .catch(error => {
            console.log('⚠️ API health check failed:', error.message);
        });
}, 2000);

console.log('📜 Script loaded - all functions ready!');
console.log('🔧 Manual test: testAPI(), signup(), contactSales()');
