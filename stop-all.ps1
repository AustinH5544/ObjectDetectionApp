Get-Process -Name node, dotnet, uvicorn | Stop-Process -Force
Write-Host "Stopped all related services (node, dotnet, uvicorn)"
