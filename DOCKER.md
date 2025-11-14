# Docker Deployment Guide

This guide explains how to deploy the Unio backend using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)
- Supabase credentials

## Quick Start

### 1. Set up Environment Variables

Create a `.env` file in the `app/` directory:

```bash
cd app
cp .env.example .env
# Edit .env with your Supabase credentials
```

Or set environment variables directly:

```bash
export SUPABASE_URL=your_supabase_url
export SUPABASE_KEY=your_supabase_key
```

### 2. Build and Run with Docker

#### Option A: Using Docker directly

```bash
# Build the image
docker build -t unio-backend .

# Run the container
docker run -d \
  --name unio-backend \
  -p 8000:8000 \
  -e SUPABASE_URL=your_supabase_url \
  -e SUPABASE_KEY=your_supabase_key \
  unio-backend
```

#### Option B: Using Docker Compose (Recommended)

```bash
# Make sure your .env file is set up in app/.env
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

### 3. Verify Deployment

```bash
# Check health endpoint
curl http://localhost:8000/health

# Check root endpoint
curl http://localhost:8000/
```

## Configuration

### Environment Variables

The following environment variables are required:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase service role key

### Port Configuration

By default, the backend runs on port 8000. To change this:

**Docker:**
```bash
docker run -p 8080:8000 unio-backend
```

**Docker Compose:**
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:8000"
```

## Production Deployment

### 1. Build for Production

```bash
docker build -t unio-backend:latest .
```

### 2. Tag for Registry (if using a registry)

```bash
docker tag unio-backend:latest your-registry/unio-backend:latest
docker push your-registry/unio-backend:latest
```

### 3. Run in Production

```bash
docker run -d \
  --name unio-backend \
  --restart unless-stopped \
  -p 8000:8000 \
  -e SUPABASE_URL=${SUPABASE_URL} \
  -e SUPABASE_KEY=${SUPABASE_KEY} \
  unio-backend:latest
```

### 4. Using Docker Compose in Production

```bash
docker-compose -f docker-compose.yml up -d
```

## Health Checks

The container includes a health check that monitors the `/health` endpoint. You can check the health status:

```bash
docker ps  # Shows health status
docker inspect unio-backend | grep -A 10 Health
```

## Logs

View container logs:

```bash
# Docker
docker logs unio-backend
docker logs -f unio-backend  # Follow logs

# Docker Compose
docker-compose logs
docker-compose logs -f  # Follow logs
```

## Troubleshooting

### Container won't start

1. Check logs: `docker logs unio-backend`
2. Verify environment variables are set correctly
3. Ensure port 8000 is not already in use

### Connection issues

1. Verify Supabase credentials are correct
2. Check network connectivity from container
3. Ensure Supabase project is accessible

### Performance

For production, consider:
- Using a reverse proxy (nginx, traefik)
- Setting resource limits in docker-compose.yml
- Using multiple replicas for load balancing

## Example docker-compose.yml with Resource Limits

```yaml
version: '3.8'

services:
  unio-backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: unio-backend
    ports:
      - "8000:8000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Updating the Application

To update the application:

```bash
# Rebuild the image
docker build -t unio-backend:latest .

# Stop and remove old container
docker stop unio-backend
docker rm unio-backend

# Start new container
docker run -d --name unio-backend -p 8000:8000 \
  -e SUPABASE_URL=${SUPABASE_URL} \
  -e SUPABASE_KEY=${SUPABASE_KEY} \
  unio-backend:latest
```

Or with Docker Compose:

```bash
docker-compose up -d --build
```

