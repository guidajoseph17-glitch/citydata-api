-- Add 20 more major cities with sample data
INSERT INTO cities (city_id, city_name, state_code, state_full, population, latitude, longitude) VALUES
('miami-fl', 'Miami', 'FL', 'Florida', 442241, 25.7617, -80.1918),
('seattle-wa', 'Seattle', 'WA', 'Washington', 749256, 47.6062, -122.3321),
('boston-ma', 'Boston', 'MA', 'Massachusetts', 685094, 42.3601, -71.0589),
('atlanta-ga', 'Atlanta', 'GA', 'Georgia', 498715, 33.7490, -84.3880),
('phoenix-az', 'Phoenix', 'AZ', 'Arizona', 1608139, 33.4484, -112.0740),
('san-francisco-ca', 'San Francisco', 'CA', 'California', 881549, 37.7749, -122.4194),
('chicago-il', 'Chicago', 'IL', 'Illinois', 2693976, 41.8781, -87.6298),
('new-york-ny', 'New York', 'NY', 'New York', 8336817, 40.7128, -74.0060),
('los-angeles-ca', 'Los Angeles', 'CA', 'California', 3979576, 34.0522, -118.2437),
('philadelphia-pa', 'Philadelphia', 'PA', 'Pennsylvania', 1603797, 39.9526, -75.1652),
('dallas-tx', 'Dallas', 'TX', 'Texas', 1304379, 32.7767, -96.7970),
('san-diego-ca', 'San Diego', 'CA', 'California', 1386932, 32.7157, -117.1611),
('san-antonio-tx', 'San Antonio', 'TX', 'Texas', 1547253, 29.4241, -98.4936),
('houston-tx', 'Houston', 'TX', 'Texas', 2320268, 29.7604, -95.3698),
('portland-or', 'Portland', 'OR', 'Oregon', 641162, 45.5152, -122.6784),
('las-vegas-nv', 'Las Vegas', 'NV', 'Nevada', 641903, 36.1699, -115.1398),
('orlando-fl', 'Orlando', 'FL', 'Florida', 307573, 28.5383, -81.3792),
('tampa-fl', 'Tampa', 'FL', 'Florida', 384959, 27.9506, -82.4572),
('minneapolis-mn', 'Minneapolis', 'MN', 'Minnesota', 429954, 44.9778, -93.2650),
('cleveland-oh', 'Cleveland', 'OH', 'Ohio', 383793, 41.4993, -81.6944);

-- Add corresponding data for each city (demographics, real estate, etc.)
-- This is sample data - in production you'd collect real data

-- Demographics for new cities
INSERT INTO demographics (city_id, median_age, median_income, education_bachelor_plus) VALUES
('miami-fl', 40.2, 62000, 0.35),
('seattle-wa', 35.4, 98000, 0.63),
('boston-ma', 32.1, 85000, 0.71),
('atlanta-ga', 33.2, 65000, 0.52),
('phoenix-az', 34.8, 67000, 0.33),
('san-francisco-ca', 38.5, 125000, 0.72),
('chicago-il', 34.7, 71000, 0.41),
('new-york-ny', 36.8, 82000, 0.58),
('los-angeles-ca', 36.2, 75000, 0.44),
('philadelphia-pa', 34.9, 58000, 0.37);

-- Continue with quality_of_life, real_estate, investment_metrics for each city...
