# RevenueRecover AI — Environment Setup & Configuration Reference

## API Credentials Configuration

| Environment Variable | Provider | Purpose | Optional / Required |
| :--- | :--- | :--- | :--- |
| `DISCOVERY_DRY_RUN` | Internal | `true` prevents real outbound SMS; `false` activates live gateways | Required |
| `GEMINI_API_KEY` | Google AI | Power AI Lead Scoring, Intent Classification, and Recovery copy | Optional (Heuristic fallback included) |
| `GOOGLE_MAPS_API_KEY` | Google Maps | High-accuracy Places discovery in USA/UK/CA | Optional (Deterministic test fixture included) |
| `YELP_API_KEY` | Yelp Fusion | Trade reviews & category tags | Optional (Deterministic test fixture included) |
| `FOURSQUARE_API_KEY`| Foursquare | Global trade contractor geolocation | Optional (Deterministic test fixture included) |
| `UK_COMPANIES_HOUSE_API_KEY` | UK Gov | UK official corporate entity verification | Optional (Mock fallback included) |
| `PAYPAL_CLIENT_SECRET` | PayPal | Secure order creation & capture | Required for automated PayPal API |
