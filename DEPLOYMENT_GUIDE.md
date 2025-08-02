# Production Deployment Guide (Ubuntu 24.04 + Caddy + Gunicorn)

This guide outlines the steps to deploy the Todo React Django application on an Ubuntu 24.04 server using Caddy as the web server and Gunicorn as the WSGI application server.

## 1. Server Preparation

### 1.1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2. Install Dependencies

Install Python, pip, venv, Node.js (e.g., v20.x), npm, and Caddy.

```bash
# Python, pip, venv (usually pre-installed on Ubuntu 24.04, but good to ensure)
sudo apt install -y python3 python3-pip python3-venv

# Node.js (using NodeSource setup script for a specific version, e.g., 20.x)
# See https://github.com/nodesource/distributions for current instructions
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Caddy (See https://caddyserver.com/docs/install#debian-ubuntu-raspbian)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

### 1.3. Create Project Directory

Create a directory to hold the application code.

```bash
sudo mkdir /path/to/app
sudo chown $USER:$GROUP /path/to/app # Give your user ownership for now
cd /path/to/app
```

## 2. Application Setup

### 2.1. Clone Repository

```bash
git clone <your-repository-url> . # Clone into the current directory
```

### 2.2. Create Python Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

_(Remember to activate the venv (`source venv/bin/activate`) whenever working in this directory in a new shell)_

### 2.3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2.4. Install Frontend Dependencies

```bash
cd jstoolchains
npm install
cd .. # Return to project root
```

### 2.5. Set Environment Variables

Create a `.env` file in the project root (`/var/www/todo-app`) for environment variables. **Do not commit this file to Git.**

```bash
# /var/www/todo-app/.env
DJANGO_SECRET_KEY='your_strong_random_secret_key_here'
# Add other environment variables if needed (e.g., EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
# EMAIL_HOST_USER='your_email@gmail.com'
# EMAIL_HOST_PASSWORD='your_gmail_app_password'
```

_Generate a strong secret key. You can use Django's `get_random_secret_key()`:_

```python
# Run this in a python shell
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### 2.6. Build Frontend Assets

```bash
cd jstoolchains
npm run build
cd ..
```

### 2.7. Collect Static Files

```bash
python manage.py collectstatic --noinput
```

_(This will create the `/var/www/todo-app/staticfiles` directory based on `STATIC_ROOT` in settings.py)_

### 2.8. Run Database Migrations

This applies when starting with a new database from scratch.

```bash
python manage.py migrate
```

### 2.9. Test Gunicorn

Ensure Gunicorn can serve the application.

```bash
# Activate venv if not already active: source venv/bin/activate
gunicorn --bind 0.0.0.0:8000 todo_react_django.wsgi:application
```

_Stop Gunicorn with Ctrl+C after testing._

## 3. Gunicorn Systemd Service

Create a systemd service file to manage the Gunicorn process.

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

Paste the following content, adjusting `User`, `Group`, and paths if necessary:

```ini
[Unit]
Description=gunicorn daemon for todo-react-django
After=network.target

[Service]
User=user # Or your deployment user
Group=group # Or your deployment user group
WorkingDirectory=/path/to/app
# Create a 'run' directory in your project: mkdir /var/www/todo-app/run
ExecStart=/path/to/app/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/path/to/app/run/gunicorn.sock todo_react_django.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

- **User/Group:** Often `www-data` is used for web server processes. Ensure this user has necessary permissions for the project directory and database file. You might need to adjust ownership: `sudo chown -R www-data:www-data /var/www/todo-app`. Pay special attention to the SQLite database file (`database/db.sqlite3`) and its directory - `www-data` needs write access. Ensure the user also has write access to the `/var/www/todo-app/run` directory to create the socket.
- **Workers:** Adjust the number of workers (e.g., `2 * num_cores + 1`). `3` is a reasonable starting point.
- **Bind:** Using a Unix socket within the project directory (`unix:/path/to/app/run/gunicorn.sock`) avoids potential permission issues with `/run`. Ensure the directory exists (`mkdir /path/to/app/run`) and the Gunicorn user can write to it.

Enable and start the Gunicorn service:

```bash
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl status gunicorn # Check status
```

## 4. Caddy Configuration

Caddy's default configuration file is at `/etc/caddy/Caddyfile`. Replace its contents with the following:

```caddyfile
# /etc/caddy/Caddyfile

your_domain.com { # Or localhost if only accessing locally

    # Directory where your static files are collected
    root * /path/to/app/staticfiles

    # Serve static files directly
    file_server

    # Handle API and other Django requests by proxying to Gunicorn
    handle /api/* {
        reverse_proxy unix//path/to/app/run/gunicorn.sock
    }
    handle /admin/* {
        reverse_proxy unix//path/to/app/run/gunicorn.sock
    }
    handle /accounts/* {
        reverse_proxy unix//path/to/app/run/gunicorn.sock
    }
    # Add other Django URL paths here if needed

    # Handle the root path (React app) by proxying to Gunicorn
    handle {
        reverse_proxy unix//path/to/app/run/gunicorn.sock
    }

    # Enable compression
    encode gzip zstd

    # Logging (optional)
    log {
        output file /var/log/caddy/access.log
        format json
    }

    # Optional: Add security headers
    header {
        # Enable HTTP Strict Transport Security (HSTS)
        Strict-Transport-Security "max-age=31536000;"
        # Prevent clickjacking
        X-Frame-Options "DENY"
        # Prevent content type sniffing
        X-Content-Type-Options "nosniff"
        # Enable cross-site scripting (XSS) filter
        X-XSS-Protection "1; mode=block"
        # Referrer policy
        Referrer-Policy "strict-origin-when-cross-origin"
        # Permissions policy (example, adjust as needed)
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
    }
}

# If accessing via IP address or localhost without a domain:
# localhost {
#     root * /path/to/app/staticfiles
#     file_server
#     reverse_proxy /api/* unix//path/to/app/run/gunicorn.sock
#     reverse_proxy /admin/* unix//path/to/app/run/gunicorn.sock
#     reverse_proxy /accounts/* unix//path/to/app/run/gunicorn.sock
#     # Add other Django URL paths here if needed
#     reverse_proxy unix//path/to/app/run/gunicorn.sock # Fallback for root/other paths
#     encode gzip zstd
#     log {
#         output file /var/log/caddy/access.log
#         format json
#     }
# }
```

- Replace `your_domain.com` with your actual domain or use `localhost` if accessing locally. Caddy will automatically provision HTTPS for public domains.
- The `handle` blocks ensure that requests for static files are served directly by Caddy, while other requests (API, admin, root for the React app) are proxied to Gunicorn via the socket in `/path/to/app/run/gunicorn.sock`. Adjust the paths in `handle` blocks if your Django URL structure is different.

Reload Caddy to apply the changes:

```bash
sudo systemctl reload caddy
sudo systemctl status caddy # Check status
```

## 5. Permissions

Ensure correct permissions, especially for the SQLite database and the Gunicorn socket. The user running Gunicorn (e.g., `www-data`) needs read/write access to the database file and its directory, and the user running Caddy (usually `caddy`) needs access to the Gunicorn socket and the `staticfiles` directory.

```bash
# Example: Give www-data ownership of the project dir
sudo chown -R www-data:www-data /var/www/todo-app
# Ensure staticfiles are readable by Caddy
sudo chmod -R 755 /var/www/todo-app/staticfiles
# Ensure database directory is writable by Gunicorn user
sudo chmod -R 775 /var/www/todo-app/database # Adjust if needed, 775 might be too permissive depending on setup
# Ensure database file is writable by Gunicorn user
sudo chmod 664 /var/www/todo-app/database/db.sqlite3 # Adjust if needed
```

_(Permissions can be tricky. Start with these and adjust if you encounter permission errors in logs (`journalctl -u gunicorn`, `/var/log/caddy/access.log`))_

### 5.1 Socket Permissions (Caddy <-> Gunicorn)

If Caddy logs show "permission denied" when trying to connect to the Gunicorn socket:

1.  **Add Caddy User to Gunicorn Group:** Add the user running Caddy (usually `caddy`) to the group running Gunicorn (e.g., `www-data` in the guide example, or `ubuntu` in your specific case).
    ```bash
    # Example using 'www-data' group from guide:
    # sudo usermod -a -G www-data caddy
    # Example using your 'ubuntu' group:
    sudo usermod -a -G ubuntu caddy
    ```
2.  **Set Directory Permissions:** Ensure the directory containing the socket allows group access.
    ```bash
    # Example using guide paths/groups:
    # sudo chown www-data:www-data /var/www/todo-app/run
    # sudo chmod 775 /var/www/todo-app/run
    # Example using your paths/groups:
    sudo chown pi:ubuntu /var/www/todo-app/run
    sudo chmod 775 /var/www/todo-app/run
    ```
3.  **Restart Services:** Restart both Gunicorn and Caddy.
    ```bash
    sudo systemctl restart gunicorn
    sudo systemctl restart caddy
    ```

## 6. Firewall

Allow HTTP and HTTPS traffic if using a firewall like `ufw`.

```bash
sudo ufw allow 'Caddy' # Caddy registers itself with ufw
sudo ufw enable
sudo ufw status
```

Your application should now be accessible at your domain (or localhost).

## Troubleshooting

- Check Gunicorn status: `sudo systemctl status gunicorn`
- Check Gunicorn logs: `sudo journalctl -u gunicorn`
- Check Caddy status: `sudo systemctl status caddy`
- Check Caddy logs: `/var/log/caddy/access.log` (or as configured)
- Check permissions issues.
- Ensure the virtual environment is activated when running `manage.py` commands manually.
