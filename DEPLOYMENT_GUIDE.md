# Deployment Guide: Django + React on Ubuntu

This guide walks you through deploying a Django application with a React frontend (built with tools like Webpack/Tailwind) on an Ubuntu server using Caddy and Gunicorn.

**Assumptions:**

*   You have SSH access to a clean Ubuntu server (e.g., Ubuntu 20.04 or 22.04).
*   You have a domain name pointing to your server's IP address (optional but recommended for HTTPS).
*   Your project structure is similar to the one provided (Django project root, `jstoolchains` subdirectory for React).
*   You are comfortable using the Linux command line.

---

## Step 1: Server Setup & Initial Dependencies

**Goal:** Prepare the server with essential software.

**Why:** We need Python to run Django, Node.js/npm to build the React frontend, pip to install Python packages, Caddy as the webserver, and potentially a database.

**Commands (run on your Ubuntu server via SSH):**

```bash
# Update package lists and upgrade existing packages
sudo apt update
sudo apt upgrade -y

# Install Python, pip, and venv
sudo apt install python3 python3-pip python3-venv -y

# Install Node.js and npm (Consider using NodeSource for specific versions if needed)
# This installs the version from Ubuntu repos, which might be older.
sudo apt install nodejs npm -y
# --- OR --- (Example for Node.js 18.x using NodeSource)
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt-get install -y nodejs
# ------------

# Caddy installation instructions (Refer to official Caddy docs for the latest method)
# Example for Debian/Ubuntu:
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy -y

# Install PostgreSQL client (if using PostgreSQL database)
# Even if the DB is remote, the client libraries are often needed by psycopg2
sudo apt install libpq-dev python3-dev -y # For psycopg2 build dependencies
# sudo apt install postgresql postgresql-contrib -y # If hosting DB on the same server

# Install Git (if deploying via Git)
sudo apt install git -y
```

---

## Step 2: Deploy Your Code

**Goal:** Get your application code onto the server.

**Why:** The server needs the code to run it.

**Method 1: Git (Recommended)**

```bash
# Clone your repository (replace with your repo URL)
git clone https://your-repository-url.com/project.git /path/to/your/project
# Example:
# git clone https://github.com/yourusername/todo-react-django.git /var/www/todo-react-django

cd /path/to/your/project
# Example:
# cd /var/www/todo-react-django
```

**Method 2: Manual Copy (e.g., using `scp`)**

```bash
# From your local machine:
scp -r /path/to/local/project your_user@your_server_ip:/path/to/your/project
# Example:
# scp -r . juanda@YOUR_SERVER_IP:/var/www/todo-react-django
```

*Choose a suitable location like `/var/www/yourproject`.*

---

## Step 3: Backend Setup (Django)

**Goal:** Configure and prepare the Django application for production.

**Why:** We need a dedicated environment, install dependencies, adjust settings for security and production use, set up the database, and collect static files.

**Commands (run in your project directory on the server):**

```bash
cd /path/to/your/project
# Example: cd /var/www/todo-react-django

# 1. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate
# Your prompt should now start with (venv)

# 2. Install Python dependencies
pip install -r requirements.txt
pip install gunicorn # Install the application server

# 3. Configure Production Settings (todo_react_django/settings.py)
#    - SECRET_KEY: MUST be changed and kept secret. Use environment variables or a .env file.
#    - DEBUG = False: CRITICAL for security and performance.
#    - ALLOWED_HOSTS = ['your_domain.com', 'your_server_ip']: Set to your domain/IP.
#    - Database Settings: Update to use PostgreSQL/MySQL if not using SQLite.
#    *Security Note:* Do NOT commit sensitive keys directly into settings.py. Use environment variables.
#      Example using python-decouple or django-environ:
#      Install: pip install python-decouple
#      In settings.py:
#      from decouple import config
#      SECRET_KEY = config('SECRET_KEY')
#      DEBUG = config('DEBUG', default=False, cast=bool)
#      ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])
#      Create a .env file (add to .gitignore!) in the project root:
#      SECRET_KEY=your_super_secret_random_key_here
#      DEBUG=False
#      ALLOWED_HOSTS=your_domain.com,your_server_ip

#    *Edit settings.py using a server-side editor like nano or vim:*
#    nano todo_react_django/settings.py

# 4. Run Database Migrations
python manage.py migrate

# 5. Collect Static Files
#    Ensure STATIC_ROOT is set in settings.py, e.g., STATIC_ROOT = BASE_DIR / 'staticfiles'
#    Then run:
python manage.py collectstatic --noinput # Gathers all static files into STATIC_ROOT

# 6. Create Superuser (Optional, for admin access)
python manage.py createsuperuser
```

---

## Step 4: Frontend Setup (React)

**Goal:** Build the optimized static assets for the React frontend.

**Why:** Development servers (`npm start`) are not suitable for production. We need to compile and minify the JS/CSS code.

**Commands (run in your frontend directory on the server):**

```bash
cd /path/to/your/project/jstoolchains
# Example: cd /var/www/todo-react-django/jstoolchains

# Install Node.js dependencies
npm install

# Build the production assets (check your package.json scripts for the exact command)
# Common commands: npm run build, webpack --mode production
npm run build # Assuming 'build' script exists in package.json
```

*This typically creates a `build` or `dist` directory within `jstoolchains` containing the optimized static files (JS bundles, CSS, etc.). Nginx will be configured to serve these.*

---

## Step 5: Application Server (Gunicorn)

**Goal:** Set up Gunicorn to run the Django application and manage it with systemd.

**Why:** Gunicorn acts as the interface between Nginx and Django (WSGI). Systemd ensures Gunicorn runs reliably as a background service.

**Commands:**

```bash
# (Ensure virtual environment is active: source /path/to/your/project/venv/bin/activate)
cd /path/to/your/project
# Example: cd /var/www/todo-react-django

# 1. Test Gunicorn manually (replace 'todo_react_django.wsgi' if your project name differs)
#    This binds to localhost:8000. We'll use a socket file later.
gunicorn --workers 3 todo_react_django.wsgi:application --bind 0.0.0.0:8000
#    - Press CTRL+C to stop. If it runs without errors, Gunicorn is working.
#    - '--workers 3': Adjust based on server CPU cores (2 * cores + 1 is a common starting point).

# 2. Create a systemd Socket File
sudo nano /etc/systemd/system/gunicorn.socket
```

**Paste into `gunicorn.socket`:**

```ini
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
```

```bash
# 3. Create a systemd Service File
sudo nano /etc/systemd/system/gunicorn.service
```

**Paste into `gunicorn.service` (ADJUST PATHS AND USER):**

```ini
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=your_user # Replace with the user running the app (e.g., www-data or a dedicated user)
Group=www-data # Or the group for the user
WorkingDirectory=/path/to/your/project # Example: /var/www/todo-react-django
ExecStart=/path/to/your/project/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          todo_react_django.wsgi:application # Replace 'todo_react_django' if needed

[Install]
WantedBy=multi-user.target
```

*   **Important:** Replace `your_user`, `/path/to/your/project`, and `todo_react_django.wsgi` with your actual values. The `User` and `Group` should have permissions to access the project directory and the socket file. Using `www-data` is common if Nginx runs as `www-data`.

```bash
# 4. Start and Enable Gunicorn
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket # Enable on boot

# Check status (should show active/listening)
sudo systemctl status gunicorn.socket

# Check for the socket file (requires sudo or correct permissions)
file /run/gunicorn.sock
```

---

## Step 6: Web Server (Caddy)

**Goal:** Configure Caddy to serve static files, proxy dynamic requests to Gunicorn, and handle HTTPS automatically.

**Why:** Caddy simplifies web server configuration and automatically manages TLS certificates (HTTPS).

**Commands:**

```bash
# Caddy typically uses a Caddyfile for configuration.
# The default location is /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile
```

**Replace the entire content of `/etc/caddy/Caddyfile` with the following (ADJUST PATHS AND DOMAIN):**

```caddyfile
# Replace your_domain.com with your actual domain name
your_domain.com {
    # Set the root directory for your *entire* project
    # Caddy directives often work relative to this root.
    root * /path/to/your/project # Example: /var/www/todo-react-django

    # Enable compression
    encode gzip zstd

    # Serve Django static files (collected by collectstatic)
    # Assumes STATIC_URL = '/static/' and STATIC_ROOT = 'staticfiles' relative to project root
    handle_path /static/* {
        file_server browse {
            root staticfiles # Path relative to the main 'root' directive above
        }
    }

    # Serve Django media files (user uploads)
    # Assumes MEDIA_URL = '/media/' and MEDIA_ROOT = 'mediafiles' relative to project root
    handle_path /media/* {
        file_server browse {
            root mediafiles # Path relative to the main 'root' directive above
        }
    }

    # Handle API calls and other Django-specific routes
    # Add all URL prefixes that Django should handle
    handle_path /api/* /admin/* /accounts/* /other-django-paths/* {
        reverse_proxy unix//run/gunicorn.sock {
            # Optional: Add headers if needed by Django (Caddy forwards most by default)
            # header_up Host {http.request.host}
            # header_up X-Forwarded-Proto {http.request.scheme}
        }
    }

    # Handle all other requests (React frontend)
    # Assumes React build output is in 'jstoolchains/build' relative to project root
    handle {
        file_server {
            root jstoolchains/build # Path relative to the main 'root' directive above
            # Enable SPA (Single Page App) support for React Router
            try_files {path} {path}/ /index.html
        }
    }

    # Optional: Add logging
    # log {
    #   output file /var/log/caddy/access.log
    #   format json
    # }
}

# If you don't have a domain yet, you can use the server's IP address or localhost
# for testing (HTTPS will be self-signed and show a browser warning).
# Replace the domain line above with:
# :80 {
#   ... rest of the config ...
# }
# Or for a specific IP:
# your_server_ip {
#   ... rest of the config ...
# }
```

*   **Key Adjustments:**
    *   `your_domain.com`: Replace with your actual domain. Caddy will automatically provision Let's Encrypt certificates for it. If using an IP, replace with the IP or just `:80`.
    *   `root * /path/to/your/project`: Set the main project root directory.
    *   `/static/*` handle_path `root`: Path to your `STATIC_ROOT` (relative to the main `root`).
    *   `/media/*` handle_path `root`: Path to your `MEDIA_ROOT` (relative to the main `root`).
    *   `handle_path /api/* ...`: List all URL prefixes Django should handle.
    *   `reverse_proxy unix//run/gunicorn.sock`: Points to the Gunicorn socket.
    *   `handle { file_server { root ... } }`: Configures serving the React app from its build directory (relative to the main `root`) and enables SPA routing with `try_files`.

```bash
# Check Caddyfile syntax (run from the directory containing the Caddyfile, or specify path)
# Caddy automatically checks syntax on reload/restart, but manual check is good.
# sudo caddy fmt --overwrite /etc/caddy/Caddyfile # Optional: Format the file
sudo caddy validate --config /etc/caddy/Caddyfile

# Reload Caddy to apply changes (preferred over restart)
sudo systemctl reload caddy
# Or restart if needed: sudo systemctl restart caddy

# Check Caddy status
sudo systemctl status caddy
```

**Automatic HTTPS:** If you use a valid public domain name in the `Caddyfile`, Caddy automatically obtains and renews Let's Encrypt TLS certificates for you. No separate Certbot step is needed.

---

## Step 7: Database (Production Considerations)

**Goal:** Use a robust database like PostgreSQL or MySQL instead of SQLite.

**Why:** SQLite is file-based and doesn't handle concurrent writes well, making it unsuitable for most production web applications. PostgreSQL or MySQL offer better performance, scalability, and features.

**Brief Overview (PostgreSQL Example):**

1.  **Install PostgreSQL Server (if hosting locally):**
    ```bash
    sudo apt install postgresql postgresql-contrib -y
    ```
2.  **Create Database and User:**
    ```bash
    sudo -u postgres psql
    postgres=# CREATE DATABASE yourdbname;
    postgres=# CREATE USER yourdbuser WITH PASSWORD 'yourpassword';
    postgres=# ALTER ROLE yourdbuser SET client_encoding TO 'utf8';
    postgres=# ALTER ROLE yourdbuser SET default_transaction_isolation TO 'read committed';
    postgres=# ALTER ROLE yourdbuser SET timezone TO 'UTC';
    postgres=# GRANT ALL PRIVILEGES ON DATABASE yourdbname TO yourdbuser;
    postgres=# \q
    ```
3.  **Install `psycopg2`:** (Ensure `libpq-dev python3-dev` are installed first - see Step 1)
    ```bash
    # (Activate virtual env: source venv/bin/activate)
    pip install psycopg2-binary # Or just psycopg2 if build tools are set up
    ```
4.  **Update Django `settings.py`:**
    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'yourdbname',
            'USER': 'yourdbuser',
            'PASSWORD': 'yourpassword', # Use environment variables!
            'HOST': 'localhost', # Or DB server address
            'PORT': '5432', # Default PostgreSQL port
        }
    }
    ```
5.  **Run Migrations:** `python manage.py migrate`

---

## Step 8: Firewall (UFW)

**Goal:** Restrict access to only necessary ports.

**Why:** Security best practice to minimize attack surface.

**Commands:**

```bash
# Allow SSH (IMPORTANT!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS traffic (Caddy handles both)
sudo ufw allow http
sudo ufw allow https
# Or more simply if Caddy is recognized as an app profile (check with `sudo ufw app list`):
# sudo ufw allow 'Caddy'

# Enable the firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 9: Final Checks & Troubleshooting

*   **Reload/Restart Services:** If you made changes:
    ```bash
    sudo systemctl restart gunicorn # Restart Gunicorn service if backend changed
    sudo systemctl reload caddy     # Reload Caddy for Caddyfile changes
    ```
*   **Check Logs:**
    *   Caddy (via systemd journal): `sudo journalctl -u caddy -f --output cat` (the `--output cat` provides cleaner output than default)
    *   Gunicorn (via systemd journal): `sudo journalctl -u gunicorn -f`
*   **Common Issues:**
    *   **Permissions:** Ensure the user running Gunicorn (`your_user` or `www-data`) has read/write access to the project directory, static/media roots, and the `/run/gunicorn.sock` file. Ensure the `caddy` user (or the user Caddy runs as) has read access to the project root, static/media files, and the React build directory.
    *   **Firewall:** Double-check UFW rules (`sudo ufw status`). Ensure ports 80/443 are open.
    *   **Caddyfile:** Typos, incorrect paths (remember paths in `handle*` blocks are often relative to the main `root`), incorrect domain name, missing `handle_path` directives for Django URLs. Use `sudo caddy validate --config /etc/caddy/Caddyfile`. Check Caddy logs (`journalctl -u caddy`).
    *   **Django Settings:** `DEBUG=False`, correct `ALLOWED_HOSTS`, database connection strings.
    *   **Static Files:** 404 errors often mean `collectstatic` wasn't run or Caddy `file_server` root paths are wrong. Check Caddy logs.
    *   **React Routing:** If non-root React routes give 404s, ensure the `try_files` directive is correct in the Caddy `handle` block for the frontend.
    *   **Gunicorn Socket:** Ensure Caddy `reverse_proxy` points to the correct socket path (`unix//run/gunicorn.sock`) and that the socket exists and has correct permissions for the `caddy` user to access.
    *   **Automatic HTTPS:** If HTTPS isn't working, ensure your domain's DNS A/AAAA records point correctly to the server IP and that ports 80/443 are open in the firewall. Check Caddy logs for certificate acquisition errors.

---

This guide provides a comprehensive overview. Depending on your specific application needs (e.g., background tasks with Celery, caching with Redis), further configuration might be necessary.
