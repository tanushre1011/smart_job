# SmartJob - Full Project (Partial Implementation)

This archive contains a working starter for the SmartJob project:
- Backend (Node.js/Express) with controllers, Joi validation, OpenAI embeddings worker (requires OPENAI_API_KEY).
- Parser microservice (Flask + spaCy) for resume parsing.
- Docker Compose to run MongoDB, Redis, Backend, Parser locally.
- Jest + Supertest basic auth test.
- Postman collection at /postman/smartjob_collection.json

How to run (development):
1. Ensure Docker is installed.
2. Copy backend/.env.example to backend/.env and fill values (OPENAI_API_KEY required to run embedding jobs).
3. Build & run: `docker-compose up --build`
4. Backend: http://localhost:5000
5. Parser: http://localhost:8000

Notes:
- The embedding worker uses the OpenAI Node client. Set OPENAI_API_KEY in .env.
- Tests expect a local MongoDB; run `npm test` inside backend if desired (ensure MONGO_URI points to a test DB).

