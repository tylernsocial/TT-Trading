# System Architecture

## Overview

The Market Intelligence & Paper Trading Platform will use a client-server architecture.

The React and TypeScript frontend will communicate with a FastAPI backend using REST APIs. The backend will contain the application's business logic and will communicate with PostgreSQL and external financial-data providers.

External financial data will initially come from a market-data provider and SEC EDGAR.

Data retrieved from external services will be validated and transformed before being stored in the database or returned to the frontend.

---

## High-Level Architecture

```text
User
 |
 v
React + TypeScript
 |
 | HTTP / JSON
 v
FastAPI
 |
 +-------------------+
 |                   |
 v                   v
PostgreSQL       External APIs
                     |
                +----+----+
                |         |
                v         v
           Market Data   SEC EDGAR
```

### Frontend

The React frontend is responsible for displaying information and handling user interaction.

It will communicate with the backend rather than directly communicating with the database or external financial APIs.

### Backend

FastAPI will expose REST endpoints used by the frontend.

The backend will handle:

* Business logic
* Input validation
* Database access
* External API communication
* Data transformation
* Error handling

### Database

PostgreSQL will store persistent application data such as:

* Companies
* Historical stock prices
* Financial information
* SEC filing metadata

Additional tables for users, watchlists, portfolios, and simulated trades will be added in later releases.

### External Data Sources

The application will initially retrieve financial information from:

* A stock-market-data provider
* SEC EDGAR

The backend will act as the layer between these external services and the frontend.

---

## Initial Domain Model

The first version of the system will focus on four main entities.

### Company

Represents a publicly traded company.

Possible fields:

* id
* ticker
* name
* exchange
* CIK
* sector
* industry

### PriceBar

Represents historical stock-price data for a company.

Possible fields:

* id
* company_id
* timestamp
* open
* high
* low
* close
* volume

One company can have many price records.

### Filing

Represents an SEC filing belonging to a company.

Possible fields:

* id
* company_id
* accession_number
* form_type
* filing_date
* report_date
* document_url

One company can have many SEC filings.

### FinancialFact

Represents a financial value reported by a company.

Examples include revenue, net income, assets, liabilities, and earnings per share.

Possible fields:

* id
* company_id
* concept
* value
* unit
* fiscal_year
* fiscal_period

One company can have many financial facts.

---

## Initial Relationships

```text
               Company
                  |
        +---------+---------+
        |         |         |
        v         v         v
    PriceBar    Filing   FinancialFact
```

The database structure will evolve as new features such as watchlists and paper trading are introduced.
