#!/usr/bin/env bash
# Build script for Render backend deployment
# This script runs database migrations after dependencies are installed

set -o errexit  # Exit on error

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
flask db upgrade

echo "Build complete!"
