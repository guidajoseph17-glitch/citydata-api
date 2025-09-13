-- CityData API Database Schema
-- Creates all tables needed for the API

-- Cities table - Main city information
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(100) UNIQUE NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    state_code CHAR(2) NOT NULL,
    state_full VARCHAR(50) NOT NULL,
    fips_code VARCHAR(10),
    population INTEGER,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demographics table
CREATE TABLE IF NOT EXISTS demographics (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(100) NOT NULL,
    median_age DECIMAL(4,1),
    median_income INTEGER,
    education_bachelor_plus DECIMAL(5,3),
    race_white DECIMAL(5,3),
    race_black DECIMAL(5,3),
    race_hispanic DECIMAL(5,3),
    race_asian DECIMAL(5,3),
    data_year INTEGER DEFAULT 2022,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- Economy table
CREATE TABLE IF NOT EXISTS economy (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(100) NOT NULL,
    unemployment_rate DECIMAL(5,3),
    job_growth_rate_1yr DECIMAL(5,3),
    cost_of_living_index DECIMAL(6,2),
    data_year INTEGER DEFAULT 2022,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- Quality of Life table
CREATE TABLE IF NOT EXISTS quality_of_life (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(100) NOT NULL,
    crime_index DECIMAL(5,2),
    safety_score DECIMAL(3,1),
    school_rating DECIMAL(3,1),
    walkability_score INTEGER,
    weather_score DECIMAL(3,1),
    air_quality_index INTEGER,
    data_year INTEGER DEFAULT 2022,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- Real Estate table
CREATE TABLE IF NOT EXISTS real_estate (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(100) NOT NULL,
    median_home_price INTEGER,
    median_rent INTEGER,
    price_to_rent_ratio DECIMAL(6,2),
    price_per_sqft INTEGER,
    market_trend VARCHAR(20),
    data_year INTEGER DEFAULT 2022,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- Investment Metrics table
CREATE TABLE IF NOT EXISTS investment_metrics (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(100) NOT NULL,
    cap_rate DECIMAL(6,4),
    cash_on_cash_return DECIMAL(6,4),
    growth_potential VARCHAR(20),
    market_volatility VARCHAR(20),
    data_year INTEGER DEFAULT 2022,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- Infrastructure table
CREATE TABLE IF NOT EXISTS infrastructure (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(100) NOT NULL,
    public_transit_score DECIMAL(3,1),
    avg_internet_speed_mbps DECIMAL(8,2),
    avg_commute_time INTEGER,
    traffic_index INTEGER,
    data_year INTEGER DEFAULT 2022,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- Lifestyle table
CREATE TABLE IF NOT EXISTS lifestyle (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(100) NOT NULL,
    restaurants_per_capita DECIMAL(8,6),
    nightlife_score DECIMAL(3,1),
    outdoor_recreation_score DECIMAL(3,1),
    cultural_attractions INTEGER,
    fitness_health_score DECIMAL(3,1),
    data_year INTEGER DEFAULT 2022,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- API Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free',
    monthly_limit INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    key_id VARCHAR(100) UNIQUE NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    key_name VARCHAR(100) DEFAULT 'Default Key',
    rate_limit_per_month INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- API Usage table
CREATE TABLE IF NOT EXISTS api_usage (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    api_key_id VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_code INTEGER,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state_code);
CREATE INDEX IF NOT EXISTS idx_cities_population ON cities(population);
CREATE INDEX IF NOT EXISTS idx_real_estate_price ON real_estate(median_home_price);
CREATE INDEX IF NOT EXISTS idx_quality_crime ON quality_of_life(crime_index);
CREATE INDEX IF NOT EXISTS idx_api_usage_customer ON api_usage(customer_id);

-- Insert demo customer and API key
INSERT INTO customers (customer_id, email, subscription_tier, monthly_limit) 
VALUES ('demo_001', 'demo@citydata-api.com', 'free', 1000)
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO api_keys (key_id, customer_id, key_name, rate_limit_per_month, is_active) 
VALUES ('cd_demo_12345abcdef', 'demo_001', 'Demo Key', 1000, true)
ON CONFLICT (key_id) DO NOTHING;

-- Create view for easy city data access
CREATE OR REPLACE VIEW city_profiles AS
SELECT 
    c.city_id,
    c.city_name,
    c.state_code,
    c.state_full,
    c.population,
    c.latitude,
    c.longitude,
    d.median_age,
    d.median_income,
    d.education_bachelor_plus,
    d.race_white,
    d.race_hispanic,
    d.race_black,
    d.race_asian,
    e.unemployment_rate,
    e.job_growth_rate_1yr,
    e.cost_of_living_index,
    q.crime_index,
    q.safety_score,
    q.school_rating,
    q.walkability_score,
    q.weather_score,
    q.air_quality_index,
    r.median_home_price,
    r.median_rent,
    r.price_to_rent_ratio,
    r.market_trend,
    i.cap_rate,
    i.cash_on_cash_return,
    i.growth_potential,
    inf.public_transit_score,
    inf.avg_internet_speed_mbps,
    inf.avg_commute_time,
    l.restaurants_per_capita,
    l.nightlife_score,
    l.outdoor_recreation_score,
    l.cultural_attractions,
    GREATEST(c.updated_at, d.updated_at, e.updated_at, q.updated_at, r.updated_at, i.updated_at, inf.updated_at, l.updated_at) as last_updated
FROM cities c
LEFT JOIN demographics d ON c.city_id = d.city_id
LEFT JOIN economy e ON c.city_id = e.city_id  
LEFT JOIN quality_of_life q ON c.city_id = q.city_id
LEFT JOIN real_estate r ON c.city_id = r.city_id
LEFT JOIN investment_metrics i ON c.city_id = i.city_id
LEFT JOIN infrastructure inf ON c.city_id = inf.city_id
LEFT JOIN lifestyle l ON c.city_id = l.city_id;

-- Investment opportunities view
CREATE OR REPLACE VIEW investment_opportunities AS
SELECT 
    cp.city_id,
    cp.city_name,
    cp.state_code,
    cp.population,
    cp.median_home_price,
    cp.cap_rate,
    cp.cash_on_cash_return,
    cp.growth_potential,
    cp.crime_index,
    cp.school_rating,
    cp.job_growth_rate_1yr,
    ROUND(
        (COALESCE(cp.cap_rate, 0) * 100 * 5) + 
        (COALESCE(cp.safety_score, 0) * 3) + 
        (COALESCE(cp.school_rating, 0) * 2) + 
        (COALESCE(cp.job_growth_rate_1yr, 0) * 100 * 10) +
        (CASE cp.growth_potential 
            WHEN 'high' THEN 20 
            WHEN 'medium' THEN 10 
            ELSE 5 END)
    , 1) as investment_score,
    cp.last_updated
FROM city_profiles cp
WHERE cp.median_home_price IS NOT NULL 
    AND cp.cap_rate IS NOT NULL
ORDER BY investment_score DESC;

-- Success message
SELECT 'Database schema created successfully!' as status;
