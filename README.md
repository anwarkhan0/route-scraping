# Business Sales Data Collector API

## Overview

This API collects business sales information from various websites, processes the data into a structured JSON format. The system leverages LangChain and OpenAI API to intelligently extract and normalize sales data from diverse web sources.

## Features

- **Web Scraping**: Extracts business sales data from e-commerce platforms and business directories
- **Data Processing**: Converts unstructured data into standardized JSON format
- **AI-Powered Extraction**: Uses OpenAI's language models via LangChain for intelligent data parsing
- **Database Storage**: Persists collected data in a structured database
- **Normalization**: Standardizes different data formats across sources

## Technology Stack

- **Backend**: Nodejs (epxressjs)
- **AI Processing**: LangChain + OpenAI API
- **Web Scraping**: Playwright

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anwarkhan0/route-scraping.git
   cd route-scraping
   ```

2. Install dependencies:
   ```bash
   npm install
   npx playwright
   ```

3. Set up environment variables:
   Edit the `.env` file with your:
   - OpenAI API key
   - Database connection strings
   - Any other service credentials


### API Endpoints

- `GET /scrape?example.com` - the api will filter out business information and return json object.

### Example Request
```bash
curl -X POST "http://localhost:8000/collect" \
     -H "Content-Type: application/json" \
     -d '{"url": "/scrape/example.com"}'
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Syed Anwar - ianwarsyed@gmail.com  
