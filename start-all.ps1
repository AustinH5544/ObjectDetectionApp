Write-Host "Starting all services..."

Start-Process powershell -ArgumentList "-NoExit", "cd frontend; npm start"
Start-Process powershell -ArgumentList "-NoExit", "cd backend; dotnet run"
Start-Process powershell -ArgumentList "-NoExit", "cd ml-service; .\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 5000"


Write-Host "All services started in new terminals."

