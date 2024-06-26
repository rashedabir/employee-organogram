# Employee Hierarchy API

## Description

This API returns employee information in a hierarchical structure based on their position.

## Installation

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up the database: `npm run typeorm migration:run`
4. Seed initial data: `npm run seed`
5. Start the server: `npm run start`

## Usage

- **Get Employee Hierarchy**: `GET /employees/:id/hierarchy`
- **Protected Endpoint**: `GET /protected`

## Testing

- Run unit tests: `npm run test`
- Run end-to-end tests: `npm run test:e2e`

## Scalability

- Implement caching with Redis.
- Optimize database queries.
- Use load balancers for handling high traffic.

## Logging & Monitoring

- Use Winston for structured logging.
- Monitor with Prometheus and Grafana.
