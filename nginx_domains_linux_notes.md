
# NGINX, HOSTS FILE, DOMAINS & SUBDOMAINS (LINUX ONLY)

## 1. Get Your Server's Public IP (Linux)

To find your public IP address:

```bash
curl ifconfig.me
```

Or:

```bash
dig +short myip.opendns.com @resolver1.opendns.com
```

## 2. Edit /etc/hosts for Local Domain Mapping

To map a domain or subdomain locally (for development):

```bash
sudo nano /etc/hosts
```

Add entries like:

```
127.0.0.1   ex.com
127.0.0.1   api.ex.com
127.0.0.1   admin.ex.com
```

This tells your system to resolve these domains to `localhost`.

## 3. NGINX Setup for Domains and Subdomains

Create NGINX server blocks for each domain/subdomain:

### ex.com (Frontend)

```nginx
server {
    listen 80;
    server_name ex.com;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

### api.ex.com (Django or Express API)

```nginx
server {
    listen 80;
    server_name api.ex.com;

    location / {
        proxy_pass http://localhost:8000;
    }
}
```

### admin.ex.com (Admin Dashboard)

```nginx
server {
    listen 80;
    server_name admin.ex.com;

    location / {
        proxy_pass http://localhost:4000;
    }
}
```

After editing the NGINX configuration, reload it:

```bash
sudo systemctl reload nginx
```

## 4. Use Real Domains in Production (DNS A Records)

When using a real domain, go to your domain registrar’s DNS settings and add A records:

- **Root Domain**:

```
Type: A
Name: @
Value: YOUR_SERVER_PUBLIC_IP
TTL: 3600
```

- **Subdomain (e.g., api.ex.com)**:

```
Type: A
Name: api
Value: YOUR_SERVER_PUBLIC_IP
TTL: 3600
```

- **Subdomain (e.g., admin.ex.com)**:

```
Type: A
Name: admin
Value: YOUR_SERVER_PUBLIC_IP
TTL: 3600
```

## 5. Access in Browser

Once set up:

- `http://ex.com` → Frontend
- `http://api.ex.com` → API
- `http://admin.ex.com` → Admin panel

For local use, ensure `/etc/hosts` is properly configured.
For production, make sure your DNS records point to your server IP.

