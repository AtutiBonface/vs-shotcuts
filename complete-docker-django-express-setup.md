# Docker + Django + Express Setup Guide

This guide contains a complete example of using Docker with Django, Express, and MariaDB with database wait logic.

---

## 🐚 wait-for-db.sh

```bash
#!/bin/sh

echo "Waiting for MySQL on $DJANGO_DB_HOST:$DJANGO_DB_PORT..."

while ! nc -z $DJANGO_DB_HOST $DJANGO_DB_PORT; do
  sleep 1
done

echo "Database is up — starting app"

exec "$@"
```

Place this script in the root of your Django app directory (e.g., `./django-app/wait-for-db.sh`) and make it executable:

```bash
chmod +x django-app/wait-for-db.sh
```

---

## 🐍 Django Dockerfile (`django-app/Dockerfile`)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install netcat to wait for database
RUN apt-get update && apt-get install -y netcat-openbsd

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make the wait script executable
RUN chmod +x /app/wait-for-db.sh

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

---

## 🐳 docker-compose.yml

```yaml
version: '3.9'

services:
  db:
    image: mariadb:11
    environment:
      MYSQL_DATABASE: stackloopDB
      MYSQL_USER: stackloop
      MYSQL_PASSWORD: stackloop
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mariadb_data:/var/lib/mysql
    ports:
      - "3306:3306"

  django:
    build:
      context: ./django-app
    entrypoint: ["/app/wait-for-db.sh"]
    command: >
      sh -c "python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"
    volumes:
      - ./django-app:/app
    ports:
      - "8000:8000"
    environment:
      - DEBUG=1
      - DJANGO_DB_HOST=db
      - DJANGO_DB_PORT=3306
      - DJANGO_DB_NAME=stackloopDB
      - DJANGO_DB_USER=stackloop
      - DJANGO_DB_PASSWORD=stackloop
    depends_on:
      - db

  express:
    build:
      context: ./express-app
    command: sh -c "npm install && npm run dev"
    volumes:
      - ./express-app:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development

volumes:
  mariadb_data:
```

---

## 🧠 Common Docker Commands

```bash
# Build all services
docker compose build

# Start all services
docker compose up

# Stop all services
docker compose down

# Run a shell inside a container
docker compose exec django sh
docker compose exec express sh

# View logs
docker compose logs -f django
```
