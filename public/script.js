console.log('🚀 Script loading...');

// Test API function
async function testAPI() {
    console.log('🧪 Test API called');
    const resultDiv = document.getElementById('api-result');
    if (!resultDiv) {
        alert('❌ Result div not found!');
        return;
    }
    
    resultDiv.style.display = 'block';
    resultDiv.className = 'result-box';
    resultDiv.innerHTML = '🔄 Testing API...';
    
    try {
        const response = await fetch('/api/v1/cities/austin-tx', {
            headers: {
                'Authorization': 'Bearer cd_demo_12345abcdef'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            resultDiv.innerHTML = `
                <strong>✅ API SUCCESS!</strong><br><br>
                <strong>City:</strong> ${data.city_name}, ${data.state_code}<br>
                <strong>Population:</strong> ${data.population?.toLocaleString()}<br>
                <strong>Median Income:</strong> $${data.median_income?.toLocaleString()}<br>
                <strong>Median Home Price:</strong> $${data.median_home_price?.toLocaleString()}<br>
                <strong>Safety Score:</strong> ${data.safety_score}/10<br>
                <strong>School Rating:</strong> ${data.school_rating}/10<br>
                <strong>Cap Rate:</strong> ${(data.cap_rate * 100).toFixed(1)}%
            `;
        } else {
            resultDiv.innerHTML = `❌ <strong>API Error:</strong> ${data.error}`;
        }
    } catch (error) {
        resultDiv.innerHTML = `❌ <strong>Connection Error:</strong> ${error.message}`;
    }
}

// Signup function
function signup() {
    console.log('📝 Signup called');
    const email = prompt('Enter your email address to get a FREE API key:');
    if (email && email.includes('@')) {
        const apiKey = 'cd_live_' + Math.random().toString(36).substring(2, 15);
        alert(`🎉 SUCCESS! Your API Key: ${apiKey}\n\nSave this key: ${apiKey}\n\nTest it at: /api/v1/cities/austin-tx`);
    } else if (email) {
        alert('❌ Please enter a valid email address');
    }
}

// Contact sales function  
function contactSales() {
    console.log('📞 Contact sales called');
    alert(`📞 CONTACT SALES\n\n📧 Email: sales@citydata-api.com\n📱 Phone: +1 (555) 123-4567\n\nWe'll respond within 24 hours!`);
}

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, adding event listeners...');
    
    const buttons = {
        'test-hero': testAPI,
        'test-api': testAPI,
        'signup-hero': signup,
        'signup-free': signup,
        'signup-starter': signup,
        'final-signup': signup,
        'contact-sales': contactSales
    };
    
    Object.keys(buttons).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', buttons[id]);
            console.log(`✅ Added listener to: ${id}`);
        } else {
            console.log(`❌ Element not found: ${id}`);
        }
    });
    
    console.log('🎉 All event listeners added!');
});
