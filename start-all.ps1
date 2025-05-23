Write-Host "Starting all services..."

Start-Process powershell -ArgumentList "cd frontend; npm start"
Start-Process powershell -ArgumentList "cd backend; dotnet run"
Start-Process powershell -ArgumentList "cd ml-service; uvicorn main:app --reload --port 5000"

Write-Host "All services started in new terminals."
