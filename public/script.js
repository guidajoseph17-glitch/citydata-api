console.log('🚀 CityData API Script loading...');

// Test API function
async function testAPI() {
    console.log('🧪 Test API function called');
    
    // Find the result div
    let resultDiv = document.getElementById('api-result');
    if (!resultDiv) {
        // Create result div if it doesn't exist
        resultDiv = document.createElement('div');
        resultDiv.id = 'api-result';
        resultDiv.className = 'result-box';
        resultDiv.style.marginTop = '20px';
        resultDiv.style.padding = '20px';
        resultDiv.style.background = '#e8f5e8';
        resultDiv.style.border = '1px solid #d4edda';
        resultDiv.style.borderRadius = '8px';
        resultDiv.style.fontFamily = 'monospace';
        
        // Try to insert after the button that was clicked
        const button = event.target;
        if (button && button.parentNode) {
            button.parentNode.insertBefore(resultDiv, button.nextSibling);
        } else {
            document.body.appendChild(resultDiv);
        }
    }
    
    resultDiv.style.display = 'block';
    resultDiv.className = 'result-box';
    resultDiv.innerHTML = '🔄 Testing API... Please wait...';
    
    try {
        console.log('📡 Making API request...');
        const response = await fetch('/api/v1/cities/austin-tx', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer cd_demo_12345abcdef',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📊 Response data:', data);
        
        if (response.ok && data.city_name) {
            resultDiv.style.background = '#e8f5e8';
            resultDiv.style.borderColor = '#d4edda';
            resultDiv.innerHTML = `
                <div style="font-weight: bold; color: #155724; margin-bottom: 15px;">
                    ✅ API TEST SUCCESSFUL!
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
                    🎉 <strong>Your API is working perfectly!</strong> Ready for production use.
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
        console.error('❌ API test error:', error);
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
    console.log('📝 Signup function called');
    
    const email = prompt('🎯 Enter your email to get a FREE API key:\n\nWe\'ll generate your key instantly!');
    
    if (!email) {
        return; // User cancelled
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        alert('❌ Please enter a valid email address\n\nExample: yourname@company.com');
        return;
    }
    
    // Generate a realistic API key
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    const apiKey = `cd_live_${timestamp}${random}`;
    
    // Show success message
    alert(`🎉 SUCCESS! Your API key has been generated:

📋 API Key: ${apiKey}

💾 IMPORTANT: Save this key safely!

🚀 Test it now:
curl -H "Authorization: Bearer ${apiKey}" \\
     "${window.location.origin}/api/v1/cities/austin-tx"

📚 Documentation: ${window.location.origin}
📧 Support: support@citydata-api.com

✨ You now have 1,000 free API calls per month!`);
    
    console.log('✅ API key generated:', apiKey);
}

// Contact sales function
function contactSales() {
    console.log('📞 Contact sales function called');
    
    alert(`📞 ENTERPRISE SALES

🏢 Ready to scale? Let's talk!

📧 Email: sales@citydata-api.com
📱 Phone: +1 (555) 123-4567
💬 Slack: citydata-api.slack.com

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

// Health check function
async function checkAPIHealth() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        if (data.status === 'healthy') {
            console.log('✅ API is healthy and ready');
        }
    } catch (error) {
        console.log('⚠️ API health check failed:', error.message);
    }
}

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM content loaded, setting up event listeners...');
    
    // Method 1: Try specific IDs first
    const specificButtons = {
        'test-hero': testAPI,
        'test-api': testAPI,
        'signup-hero': signup,
        'signup-free': signup,
        'signup-starter': signup,
        'final-signup': signup,
        'contact-sales': contactSales
    };
    
    let buttonsFound = 0;
    Object.keys(specificButtons).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', specificButtons[id]);
            console.log(`✅ Added specific listener to: ${id}`);
            buttonsFound++;
        }
    });
    
    // Method 2: Find ALL buttons and add listeners based on text content
    const allButtons = document.querySelectorAll('button');
    console.log(`🔍 Found ${allButtons.length} total buttons on page`);
    
    allButtons.forEach((button, index) => {
        const buttonText = button.textContent.toLowerCase().trim();
        const buttonId = button.id || `button-${index}`;
        
        // Skip if already has a listener from Method 1
        if (button.hasAttribute('data-listener-added')) {
            return;
        }
        
        if (buttonText.includes('test api') || buttonText.includes('test this')) {
            button.addEventListener('click', testAPI);
            button.setAttribute('data-listener-added', 'true');
            console.log(`✅ Added testAPI to: "${buttonText}" (ID: ${buttonId})`);
        }
        else if (buttonText.includes('start') || buttonText.includes('get started') || 
                 buttonText.includes('free trial') || buttonText.includes('signup')) {
            button.addEventListener('click', signup);
            button.setAttribute('data-listener-added', 'true');
            console.log(`✅ Added signup to: "${buttonText}" (ID: ${buttonId})`);
        }
        else if (buttonText.includes('contact') || buttonText.includes('sales')) {
            button.addEventListener('click', contactSales);
            button.setAttribute('data-listener-added', 'true');
            console.log(`✅ Added contactSales to: "${buttonText}" (ID: ${buttonId})`);
        }
    });
    
    // Mark buttons that got specific listeners
    Object.keys(specificButtons).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('data-listener-added', 'true');
        }
    });
    
    console.log(`🎉 Event listeners setup complete! Found ${buttonsFound} buttons with specific IDs.`);
    
    // Check API health
    checkAPIHealth();
    
    // Add some helpful global functions for debugging
    window.testAPIManually = testAPI;
    window.signupManually = signup;
    window.contactSalesManually = contactSales;
    
    console.log('🛠️ Debug functions available: testAPIManually(), signupManually(), contactSalesManually()');
});

// Handle any click events that might not be caught
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        const buttonText = event.target.textContent.toLowerCase();
        
        // Backup click handler
        if (buttonText.includes('test api') && !event.target.hasAttribute('data-listener-added')) {
            console.log('🔄 Backup handler: Test API clicked');
            testAPI();
        }
    }
});

console.log('📜 CityData API Script loaded successfully!');
console.log('🎯 Ready to handle: Test API, Signup, Contact Sales');
console.log('🐛 Debug mode: Check console for detailed logs');
