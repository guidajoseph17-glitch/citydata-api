-- Sample city data for immediate testing
INSERT INTO cities (city_id, city_name, state_code, state_full, population, latitude, longitude) VALUES
('austin-tx', 'Austin', 'TX', 'Texas', 964254, 30.2672, -97.7431),
('denver-co', 'Denver', 'CO', 'Colorado', 715522, 39.7392, -104.9903),
('nashville-tn', 'Nashville', 'TN', 'Tennessee', 695598, 36.1627, -86.7816);

INSERT INTO demographics (city_id, median_age, median_income, education_bachelor_plus) VALUES
('austin-tx', 33.9, 78084, 0.52),
('denver-co', 34.8, 72661, 0.49),
('nashville-tn', 34.2, 56512, 0.43);

INSERT INTO quality_of_life (city_id, crime_index, safety_score, school_rating, walkability_score, weather_score) VALUES
('austin-tx', 42.1, 6.8, 8.2, 78, 8.5),
('denver-co', 51.2, 6.1, 7.8, 67, 8.9),
('nashville-tn', 46.3, 6.5, 7.9, 58, 8.1);

INSERT INTO real_estate (city_id, median_home_price, median_rent, price_to_rent_ratio, market_trend) VALUES
('austin-tx', 589000, 2100, 18.2, 'rising'),
('denver-co', 598000, 2200, 18.5, 'rising'),
('nashville-tn', 456000, 1800, 17.1, 'rising');

INSERT INTO investment_metrics (city_id, cap_rate, cash_on_cash_return, growth_potential) VALUES
('austin-tx', 0.064, 0.087, 'high'),
('denver-co', 0.059, 0.078, 'high'),
('nashville-tn', 0.071, 0.092, 'high');
