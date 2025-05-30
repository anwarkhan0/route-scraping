# Business Sales Data Collector API

## Overview

This API collects business sales information from various websites, processes the data into a structured JSON format, and stores it in a database. The system leverages LangChain and OpenAI API to intelligently extract and normalize sales data from diverse web sources.

## Features

- **Web Scraping**: Extracts business sales data from e-commerce platforms and business directories
- **Data Processing**: Converts unstructured data into standardized JSON format
- **AI-Powered Extraction**: Uses OpenAI's language models via LangChain for intelligent data parsing
- **Database Storage**: Persists collected data in a structured database
- **Normalization**: Standardizes different data formats across sources

## Technology Stack

- **Backend**: Nodejs (epxressjs)
- **AI Processing**: LangChain + OpenAI API
- **Database**: MongoDB
- **Web Scraping**: Playwright

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/business-sales-collector.git
   cd business-sales-collector
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your:
   - OpenAI API key
   - Database connection strings
   - Any other service credentials

## Configuration

Modify `config/settings.py` to:
- Define target websites and scraping rules
- Set up data normalization rules
- Configure database schema

## Usage

### Running the API
```bash
uvicorn main:app --reload
```

### API Endpoints

- `POST /collect` - Submit a website URL for data collection
- `GET /sales/{business_id}` - Retrieve collected sales data
- `GET /search` - Search sales data with filters

### Example Request
```bash
curl -X POST "http://localhost:8000/collect" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://example-business.com/sales"}'
```

## Data Format

Collected data is stored in this JSON structure:
```json
{
  "business_name": "string",
  "sale_date": "date",
  "amount": "float",
  "products": [
    {
      "name": "string",
      "quantity": "integer",
      "unit_price": "float"
    }
  ],
  "customer_info": {
    "type": "business/individual",
    "location": "string"
  },
  "source": "string",
  "metadata": {}
}
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

Your Name - your.email@example.com  
Project Link: [https://github.com/yourusername/business-sales-collector](https://github.com/yourusername/business-sales-collector)
