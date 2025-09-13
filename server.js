const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config();
// Auto-load sample data on startup
require('./load-sample-data.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const path = require('path'); // Add this at the top with other requires

// Serve static files
app.use(express.static('public'));

// Serve the website at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files
app.use(express.static('public'));

// Serve the website at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rate limiting
const createRateLimit = (windowMs, max) => rateLimit({
  windowMs,
  max,
  message: { error: 'Rate limit exceeded. Upgrade your plan for higher limits.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// API key validation
const validateApiKey = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid API key' });
  }
  
  const apiKey = authHeader.substring(7);
  
  // For demo - accept the demo key
  if (apiKey === 'cd_demo_12345abcdef') {
    req.user = { customer_id: 'demo_001', subscription_tier: 'free', monthly_limit: 1000 };
    return next();
  }
  
  try {
    const result = await pool.query(
      'SELECT c.*, ak.rate_limit_per_month FROM customers c JOIN api_keys ak ON c.customer_id = ak.customer_id WHERE ak.key_id = $1 AND ak.is_active = true',
      [apiKey]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    cities_available: 100,
    uptime: process.uptime()
  });
});

// Get single city data
app.get('/api/v1/cities/:cityId', validateApiKey, async (req, res) => {
  try {
    const { cityId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        c.city_id, c.city_name, c.state_code, c.state_full, c.population, c.latitude, c.longitude,
        d.median_age, d.median_income, d.education_bachelor_plus,
        e.unemployment_rate, e.job_growth_rate_1yr, e.cost_of_living_index,
        q.crime_index, q.safety_score, q.school_rating, q.walkability_score, q.weather_score,
        r.median_home_price, r.median_rent, r.price_to_rent_ratio, r.market_trend,
        i.cap_rate, i.cash_on_cash_return, i.growth_potential,
        inf.public_transit_score, inf.avg_internet_speed_mbps, inf.avg_commute_time,
        l.restaurants_per_capita, l.nightlife_score, l.outdoor_recreation_score
      FROM cities c
      LEFT JOIN demographics d ON c.city_id = d.city_id
      LEFT JOIN economy e ON c.city_id = e.city_id  
      LEFT JOIN quality_of_life q ON c.city_id = q.city_id
      LEFT JOIN real_estate r ON c.city_id = r.city_id
      LEFT JOIN investment_metrics i ON c.city_id = i.city_id
      LEFT JOIN infrastructure inf ON c.city_id = inf.city_id
      LEFT JOIN lifestyle l ON c.city_id = l.city_id
      WHERE c.city_id = $1
    `, [cityId.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'City not found',
        suggestion: 'Try searching with /api/v1/cities/search',
        available_cities: ['austin-tx', 'denver-co', 'nashville-tn', 'raleigh-nc', 'tampa-fl']
      });
    }
    
    res.json({
      ...result.rows[0],
      meta: {
        last_updated: new Date().toISOString(),
        data_sources: ['US Census', 'FBI Crime Data', 'BLS', 'Local APIs'],
        api_version: '1.0'
      }
    });
    
  } catch (error) {
    console.error('City lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search cities
app.get('/api/v1/cities/search', validateApiKey, async (req, res) => {
  try {
    const {
      min_population,
      max_population,
      max_crime_index,
      min_school_rating,
      state,
      max_home_price,
      min_cap_rate,
      sort_by = 'population',
      limit = 20
    } = req.query;
    
    let query = `
      SELECT 
        c.city_id, c.city_name, c.state_code, c.population,
        q.crime_index, q.safety_score, q.school_rating,
        r.median_home_price, r.median_rent, r.market_trend,
        i.cap_rate, i.growth_potential
      FROM cities c
      LEFT JOIN quality_of_life q ON c.city_id = q.city_id
      LEFT JOIN real_estate r ON c.city_id = r.city_id
      LEFT JOIN investment_metrics i ON c.city_id = i.city_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;
    
    // Build dynamic query
    if (min_population) {
      query += ` AND c.population >= $${++paramCount}`;
      params.push(parseInt(min_population));
    }
    if (max_population) {
      query += ` AND c.population <= $${++paramCount}`;
      params.push(parseInt(max_population));
    }
    if (max_crime_index) {
      query += ` AND q.crime_index <= $${++paramCount}`;
      params.push(parseFloat(max_crime_index));
    }
    if (min_school_rating) {
      query += ` AND q.school_rating >= $${++paramCount}`;
      params.push(parseFloat(min_school_rating));
    }
    if (state) {
      query += ` AND c.state_code = $${++paramCount}`;
      params.push(state.toUpperCase());
    }
    if (max_home_price) {
      query += ` AND r.median_home_price <= $${++paramCount}`;
      params.push(parseInt(max_home_price));
    }
    if (min_cap_rate) {
      query += ` AND i.cap_rate >= $${++paramCount}`;
      params.push(parseFloat(min_cap_rate));
    }
    
    // Add sorting
    const sortOptions = {
      population: 'c.population DESC',
      safety: 'q.safety_score DESC',
      home_price: 'r.median_home_price ASC',
      cap_rate: 'i.cap_rate DESC',
      school_rating: 'q.school_rating DESC'
    };
    
    query += ` ORDER BY ${sortOptions[sort_by] || 'c.population DESC'}`;
    query += ` LIMIT $${++paramCount}`;
    params.push(parseInt(limit));
    
    const result = await pool.query(query, params);
    
    res.json({
      results: result.rows,
      total_count: result.rows.length,
      filters_applied: req.query,
      meta: {
        generated_at: new Date().toISOString(),
        api_version: '1.0'
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Investment recommendations
app.get('/api/v1/investment/recommendations', validateApiKey, async (req, res) => {
  try {
    const {
      budget_min,
      budget_max,
      min_cap_rate,
      risk_tolerance = 'medium',
      limit = 10
    } = req.query;
    
    let query = `
      SELECT 
        c.city_id, c.city_name, c.state_code, c.population,
        r.median_home_price, r.market_trend,
        i.cap_rate, i.cash_on_cash_return, i.growth_potential,
        q.safety_score, q.school_rating,
        e.job_growth_rate_1yr,
        -- Calculate investment score
        ROUND(
          (COALESCE(i.cap_rate, 0) * 100 * 5) + 
          (COALESCE(q.safety_score, 0) * 3) + 
          (COALESCE(q.school_rating, 0) * 2) + 
          (COALESCE(e.job_growth_rate_1yr, 0) * 100 * 10) +
          (CASE i.growth_potential 
              WHEN 'high' THEN 20 
              WHEN 'medium' THEN 10 
              ELSE 5 END)
        , 1) as investment_score
      FROM cities c
      LEFT JOIN real_estate r ON c.city_id = r.city_id
      LEFT JOIN investment_metrics i ON c.city_id = i.city_id
      LEFT JOIN quality_of_life q ON c.city_id = q.city_id
      LEFT JOIN economy e ON c.city_id = e.city_id
      WHERE r.median_home_price IS NOT NULL AND i.cap_rate IS NOT NULL
    `;
    const params = [];
    let paramCount = 0;
    
    if (budget_min) {
      query += ` AND r.median_home_price >= $${++paramCount}`;
      params.push(parseInt(budget_min));
    }
    if (budget_max) {
      query += ` AND r.median_home_price <= $${++paramCount}`;
      params.push(parseInt(budget_max));
    }
    if (min_cap_rate) {
      query += ` AND i.cap_rate >= $${++paramCount}`;
      params.push(parseFloat(min_cap_rate));
    }
    
    query += ` ORDER BY investment_score DESC LIMIT $${++paramCount}`;
    params.push(parseInt(limit));
    
    const result = await pool.query(query, params);
    
    // Add highlights for each recommendation
    const recommendations = result.rows.map(city => ({
      ...city,
      highlights: [
        `${(city.cap_rate * 100).toFixed(1)}% cap rate`,
        `${city.growth_potential} growth potential`,
        `Safety score: ${city.safety_score}/10`,
        `School rating: ${city.school_rating}/10`
      ]
    }));
    
    res.json({
      recommendations,
      criteria: req.query,
      meta: {
        generated_at: new Date().toISOString(),
        api_version: '1.0'
      }
    });
    
  } catch (error) {
    console.error('Investment recommendations error:', error);
    res.status(500).json({ error: 'Recommendations failed' });
  }
});

// Compare cities
app.post('/api/v1/cities/compare', validateApiKey, async (req, res) => {
  try {
    const { city_ids } = req.body;
    
    if (!city_ids || !Array.isArray(city_ids) || city_ids.length < 2) {
      return res.status(400).json({ 
        error: 'Please provide at least 2 city IDs to compare',
        example: '{"city_ids": ["austin-tx", "denver-co", "nashville-tn"]}'
      });
    }
    
    const placeholders = city_ids.map((_, i) => `$${i + 1}`).join(',');
    const query = `
      SELECT 
        c.city_id, c.city_name, c.state_code, c.population,
        d.median_income, q.crime_index, q.safety_score, q.school_rating,
        r.median_home_price, r.median_rent, i.cap_rate, i.growth_potential
      FROM cities c
      LEFT JOIN demographics d ON c.city_id = d.city_id
      LEFT JOIN quality_of_life q ON c.city_id = q.city_id
      LEFT JOIN real_estate r ON c.city_id = r.city_id
      LEFT JOIN investment_metrics i ON c.city_id = i.city_id
      WHERE c.city_id IN (${placeholders})
    `;
    
    const result = await pool.query(query, city_ids);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No cities found' });
    }
    
    // Calculate comparison metrics
    const comparison = result.rows;
    const analysis = {
      most_affordable: comparison.reduce((min, city) => 
        (city.median_home_price || Infinity) < (min.median_home_price || Infinity) ? city : min
      ),
      safest: comparison.reduce((max, city) => 
        (city.safety_score || 0) > (max.safety_score || 0) ? city : max
      ),
      best_schools: comparison.reduce((max, city) => 
        (city.school_rating || 0) > (max.school_rating || 0) ? city : max
      ),
      best_investment: comparison.reduce((max, city) => 
        (city.cap_rate || 0) > (max.cap_rate || 0) ? city : max
      )
    };
    
    res.json({
      comparison,
      analysis,
      summary: {
        cities_compared: comparison.length,
        price_range: {
          lowest: Math.min(...comparison.map(c => c.median_home_price || 0)),
          highest: Math.max(...comparison.map(c => c.median_home_price || 0))
        }
      },
      meta: {
        generated_at: new Date().toISOString(),
        api_version: '1.0'
      }
    });
    
  } catch (error) {
    console.error('City comparison error:', error);
    res.status(500).json({ error: 'Comparison failed' });
  }
});

// List all available cities
app.get('/api/v1/cities', validateApiKey, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.city_id, c.city_name, c.state_code, c.population,
             r.median_home_price, q.safety_score
      FROM cities c
      LEFT JOIN real_estate r ON c.city_id = r.city_id
      LEFT JOIN quality_of_life q ON c.city_id = q.city_id
      ORDER BY c.population DESC
      LIMIT 100
    `);
    
    res.json({
      cities: result.rows,
      total_count: result.rows.length,
      meta: {
        generated_at: new Date().toISOString(),
        api_version: '1.0'
      }
    });
    
  } catch (error) {
    console.error('Cities list error:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /health',
      'GET /api/v1/cities',
      'GET /api/v1/cities/:cityId',
      'GET /api/v1/cities/search',
      'GET /api/v1/investment/recommendations',
      'POST /api/v1/cities/compare'
    ],
    demo_api_key: 'cd_demo_12345abcdef'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CityData API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Demo API key: cd_demo_12345abcdef`);
});

module.exports = app;
