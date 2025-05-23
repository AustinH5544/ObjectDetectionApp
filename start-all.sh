#!/bin/bash

echo "Starting all services..."

# Start React frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# Start ASP.NET backend
cd backend
dotnet run &
BACKEND_PID=$!
cd ..

# Start Python ML service
cd ml-service
uvicorn main:app --reload --port 5000 &
PYTHON_PID=$!
cd ..

# Save PIDs to a file for later stopping
echo "$FRONTEND_PID $BACKEND_PID $PYTHON_PID" > .pids

echo "All services started:"
echo "  Frontend PID: $FRONTEND_PID"
echo "  Backend  PID: $BACKEND_PID"
echo "  Python   PID: $PYTHON_PID"
