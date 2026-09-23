# TT-Trading

## Market Intelligence & Paper Trading Platform

TT-Trading is a full-stack market intelligence and investment research platform for exploring publicly traded companies, analyzing financial data, and experimenting with investment ideas using simulated money.

The platform is designed to bring together market data, company fundamentals, SEC filings, company events, portfolio tracking, and paper trading into one application.

A major goal of the project is to connect financial information with stock-price behavior. Over time, users will be able to examine SEC filings, earnings and other company events alongside historical price movements to better understand how markets reacted.

The application will **not execute real-money trades**.

## Planned Features

* Search publicly traded companies
* View historical stock-price data and interactive charts
* Explore company fundamentals and financial statements
* Retrieve SEC filings such as 10-K, 10-Q, and 8-K reports
* View company events alongside historical stock-price movements
* Create stock watchlists
* Build a simulated investment portfolio
* Buy and sell stocks using paper money
* Track positions, average cost, portfolio value, and realized/unrealized profit and loss
* Compare portfolio performance against market benchmarks
* Create price and company-event alerts
* Run basic trading-strategy backtests
* Analyze portfolio performance and risk
* Eventually add an AI-powered financial research assistant that retrieves real financial data from the platform before answering questions

## Planned Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* TanStack Query
* Recharts or another financial charting library

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* Alembic
* HTTPX

### Database

* PostgreSQL

### Data Sources

* SEC EDGAR
* Public/free market-data APIs

### Testing

* Pytest
* Vitest
* React Testing Library
* Playwright

### Infrastructure

* Docker
* Docker Compose
* GitHub Actions
* Microsoft Azure

## Project Goal

This project is being developed as a learning-focused, production-style software engineering project.

Rather than simply building a portfolio demo, the goal is to practice building a full-stack application using realistic software engineering concepts and workflows.

The project will provide hands-on experience with:

* REST API design
* Relational database design
* External API integrations
* Financial-data ingestion and transformation
* SEC EDGAR data
* Business logic and database transactions
* Automated testing
* Authentication and authorization
* Docker and containerization
* CI/CD
* Cloud deployment
* Background jobs
* Monitoring and structured logging
* Secure secrets and environment configuration
* Software architecture
* Git and GitHub workflows
* AI tool calling and grounded AI systems

The project will be developed incrementally.

The first version will focus on company research, historical market data, financial information, and SEC filings. Later versions will add watchlists, paper trading, portfolio analytics, company-event analysis, alerts, backtesting, cloud infrastructure, and AI-assisted financial research.

The goal is not to include as many technologies or features as possible, but to build each part of the system with enough depth to understand how and why it works.
