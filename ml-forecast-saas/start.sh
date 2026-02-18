#!/bin/bash

echo "🚀 Starting ML Forecast SaaS Application..."

# Start Backend
echo "📦 Starting Backend API on port 8000..."
cd backend
PORT=8000 python -m app.main &
BACKEND_PID=$!

# Start Frontend
echo "⚛️  Starting Frontend on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
