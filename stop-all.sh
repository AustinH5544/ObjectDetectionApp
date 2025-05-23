#!/bin/bash

if [ -f .pids ]; then
  echo "Stopping all services..."
  kill $(cat .pids)
  rm .pids
  echo "All services stopped."
else
  echo "No running services found."
fi
