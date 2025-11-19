# AWS EC2 Deployment Guide for padho.net

This guide will walk you through deploying your Next.js static site to AWS EC2 with automatic GitHub Actions deployment.

---

## Prerequisites Checklist

- ✅ AWS Account (with billing enabled)
- ✅ Domain: padho.net (from third-party registrar)
- ✅ GitHub repository: https://github.com/owais-io/padho
- ✅ Local environment has Git configured

---

## Phase 1: Launch EC2 Instance

### Step 1.1: Create EC2 Instance

1. **Go to AWS Console** → Search for "EC2" → Click "Launch Instance"

2. **Name and Tags**
   - Name: `padho-production`

3. **Application and OS Images (AMI)**
   - Select: **Ubuntu Server 22.04 LTS (HVM)**
   - Architecture: **64-bit (x86)**

4. **Instance Type**
   - Select: **t2.micro** (Free tier eligible)

5. **Key Pair (Login)**
   - Click "Create new key pair"
   - Key pair name: `padho-deployment-key`
   - Key pair type: **RSA**
   - Private key file format: **.pem**
   - Click "Create key pair" (this downloads the .pem file)
   - **IMPORTANT**: Save this file securely - you'll need it for SSH access

6. **Network Settings**
   - Click "Edit"
   - Auto-assign public IP: **Enable**
   - Firewall (Security Groups): **Create security group**
   - Security group name: `padho-web-sg`
   - Description: `Security group for padho.net web server`

   **Add these inbound rules:**
   - SSH: Type=SSH, Port=22, Source=My IP (Your current IP)
   - HTTP: Type=HTTP, Port=80, Source=Anywhere (0.0.0.0/0)
   - HTTPS: Type=HTTPS, Port=443, Source=Anywhere (0.0.0.0/0)

7. **Configure Storage**
   - Size: **20 GB** (Free tier allows up to 30 GB)
   - Volume type: **gp3**

8. **Advanced Details**
   - Leave defaults

9. **Click "Launch Instance"**

10. **Wait for instance to be "Running"** (takes 1-2 minutes)

11. **Note down your EC2 Public IP address** (you'll see it in the instance details)
    - Example: `54.123.45.67`

---

## Phase 2: Initial Server Setup

### Step 2.1: Connect to EC2 via SSH

1. **Open terminal/PowerShell** on your local machine

2. **Set proper permissions for your key file:**

   **On Linux/Mac:**
   ```bash
   chmod 400 ~/Downloads/padho-deployment-key.pem
   ```

   **On Windows PowerShell:**
   ```powershell
   icacls "C:\Users\YourUsername\Downloads\padho-deployment-key.pem" /inheritance:r
   icacls "C:\Users\YourUsername\Downloads\padho-deployment-key.pem" /grant:r "$($env:USERNAME):(R)"
   ```

3. **Connect to your EC2 instance:**
   ```bash
   ssh -i ~/Downloads/padho-deployment-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
   ```
   Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IP

4. **Type "yes" when asked** about authenticity of host

5. **You should now see** a prompt like: `ubuntu@ip-172-31-x-x:~$`

---

### Step 2.2: Update System and Install Required Software

Run these commands one by one on your EC2 instance:

```bash
# Update package list
sudo apt update

# Upgrade all packages
sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Check Nginx status (should show "active (running)")
sudo systemctl status nginx
```

Press `q` to exit the status view.

---

### Step 2.3: Configure Firewall (UFW)

```bash
# Enable UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Verify firewall status
sudo ufw status
```

You should see:
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
```

---

### Step 2.4: Create Deployment Directory

```bash
# Create directory for website files
sudo mkdir -p /var/www/padho

# Set ownership to ubuntu user
sudo chown -R ubuntu:ubuntu /var/www/padho

# Set proper permissions
sudo chmod -R 755 /var/www/padho
```

---

## Phase 3: Configure Domain (padho.net)

### Step 3.1: Configure DNS at Your Domain Registrar

1. **Log in to your domain registrar** (where you bought padho.net)

2. **Go to DNS settings** for padho.net

3. **Add/Edit the following DNS records:**

   **A Record 1:**
   - Type: `A`
   - Name: `@` (or leave blank for root domain)
   - Value: `YOUR_EC2_PUBLIC_IP`
   - TTL: `300` (5 minutes)

   **A Record 2 (Optional - for www subdomain):**
   - Type: `A`
   - Name: `www`
   - Value: `YOUR_EC2_PUBLIC_IP`
   - TTL: `300`

4. **Save changes**

5. **Wait for DNS propagation** (5 minutes to 24 hours, usually 10-30 minutes)

6. **Test DNS propagation:**
   ```bash
   # On your local machine
   nslookup padho.net
   ```
   It should return your EC2 IP address.

---

## Phase 4: Configure Nginx

### Step 4.1: Create Nginx Server Block

1. **On your EC2 instance**, create Nginx config file:
   ```bash
   sudo nano /etc/nginx/sites-available/padho.net
   ```

2. **Copy and paste the following configuration:**
   ```nginx
   server {
       listen 80;
       listen [::]:80;

       server_name padho.net www.padho.net;

       root /var/www/padho;
       index index.html;

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;

       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;

       # Cache static assets
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Next.js static files
       location /_next/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Handle Next.js routing
       location / {
           try_files $uri $uri.html $uri/ /index.html;
       }

       # Handle trailing slashes
       location ~ ^(.+)/$ {
           try_files $uri $uri/ $1.html $1/index.html /index.html;
       }

       # Custom error pages
       error_page 404 /404.html;

       # Deny access to hidden files
       location ~ /\. {
           deny all;
       }

       access_log /var/log/nginx/padho_access.log;
       error_log /var/log/nginx/padho_error.log;
   }
   ```

3. **Save the file:**
   - Press `Ctrl + X`
   - Press `Y`
   - Press `Enter`

---

### Step 4.2: Enable the Site

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/padho.net /etc/nginx/sites-enabled/

# Remove default Nginx site (optional but recommended)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test is successful, reload Nginx
sudo systemctl reload nginx
```

---

## Phase 5: Set Up SSL (HTTPS) with Let's Encrypt

### Step 5.1: Obtain SSL Certificate

**IMPORTANT**: Make sure your DNS is properly configured and pointing to your EC2 IP before running this step!

```bash
# Run Certbot to obtain and configure SSL
sudo certbot --nginx -d padho.net -d www.padho.net
```

**You'll be asked several questions:**
1. **Email address**: Enter your email (for renewal notifications)
2. **Terms of Service**: Type `Y` to agree
3. **Share email**: Type `N` (or `Y` if you want)
4. **Redirect HTTP to HTTPS**: Type `2` (for automatic redirect)

**Certbot will:**
- Obtain SSL certificate
- Modify Nginx config to use SSL
- Set up automatic renewal

---

### Step 5.2: Verify SSL Configuration

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Test auto-renewal
sudo certbot renew --dry-run
```

If you see "Congratulations, all renewals succeeded!" - SSL is configured correctly!

---

## Phase 6: Set Up GitHub Actions Deployment

### Step 6.1: Create SSH Key for GitHub Actions

1. **On your EC2 instance**, create a new SSH key pair:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_deploy
   ```
   Press `Enter` twice (no passphrase)

2. **Add the public key to authorized_keys:**
   ```bash
   cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Display the private key** (you'll copy this to GitHub):
   ```bash
   cat ~/.ssh/github_deploy
   ```

4. **Copy the ENTIRE output** (from `-----BEGIN OPENSSH PRIVATE KEY-----` to `-----END OPENSSH PRIVATE KEY-----`)

---

### Step 6.2: Configure GitHub Secrets

1. **Go to your GitHub repository**: https://github.com/owais-io/padho

2. **Click Settings** → **Secrets and variables** → **Actions**

3. **Click "New repository secret"** and add these 4 secrets:

   **Secret 1: EC2_HOST**
   - Name: `EC2_HOST`
   - Value: Your EC2 public IP (e.g., `54.123.45.67`)
   - Click "Add secret"

   **Secret 2: EC2_USER**
   - Name: `EC2_USER`
   - Value: `ubuntu`
   - Click "Add secret"

   **Secret 3: EC2_SSH_KEY**
   - Name: `EC2_SSH_KEY`
   - Value: Paste the entire private key you copied (from `-----BEGIN` to `-----END`)
   - Click "Add secret"

   **Secret 4: EC2_DEPLOY_PATH**
   - Name: `EC2_DEPLOY_PATH`
   - Value: `/var/www/padho`
   - Click "Add secret"

---

### Step 6.3: Test Deployment

1. **On your local machine**, commit and push the changes:
   ```bash
   git add .
   git commit -m "Configure static export and GitHub Actions deployment"
   git push origin master
   ```

2. **Go to GitHub** → **Actions tab** in your repository

3. **Watch the deployment workflow run** (takes 3-5 minutes)

4. **If successful**, visit https://padho.net in your browser!

---

## Phase 7: Verify Everything Works

### Checklist:

- [ ] Visit http://padho.net → Should redirect to https://padho.net
- [ ] Visit https://padho.net → Should show your homepage
- [ ] Click on a category → Should load category page
- [ ] Check an article → Should display correctly
- [ ] Images should load properly
- [ ] HTTPS lock icon should show in browser

---

## Your Workflow After Setup

1. **Run admin locally** (http://localhost:3000/admin)
2. **Fetch Guardian articles and generate summaries**
3. **Deploy summaries as MDX files** to `content/articles/`
4. **Commit and push to GitHub:**
   ```bash
   git add content/articles/
   git commit -m "Add new articles"
   git push origin master
   ```
5. **GitHub Actions automatically builds and deploys** (3-5 minutes)
6. **Live on padho.net!**

---

## Troubleshooting

### Issue: Site not loading

**Check Nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/padho_error.log
```

### Issue: SSL certificate failed

**Check DNS:**
```bash
nslookup padho.net
```
DNS must point to your EC2 IP before running Certbot.

**Try again:**
```bash
sudo certbot --nginx -d padho.net -d www.padho.net
```

### Issue: GitHub Actions deployment failed

**Check secrets are set correctly** in GitHub repository settings.

**Check SSH connection from local machine:**
```bash
ssh -i ~/.ssh/github_deploy ubuntu@YOUR_EC2_IP
```

### Issue: Permission denied errors

**On EC2:**
```bash
sudo chown -R ubuntu:ubuntu /var/www/padho
sudo chmod -R 755 /var/www/padho
```

---

## Costs (After Free Tier Expires)

- **EC2 t2.micro**: ~$8-10/month
- **Bandwidth**: Usually free for small sites (15 GB/month free)
- **SSL Certificate**: Free (Let's Encrypt)

**Total**: ~$8-10/month

---

## Security Best Practices

1. **Regularly update your server:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Monitor access logs:**
   ```bash
   sudo tail -f /var/log/nginx/padho_access.log
   ```

3. **Keep your SSH key secure** (the .pem file downloaded from AWS)

4. **Consider setting up automatic backups** of `/var/www/padho`

---

## Need Help?

- **Nginx docs**: https://nginx.org/en/docs/
- **Let's Encrypt docs**: https://letsencrypt.org/docs/
- **AWS EC2 docs**: https://docs.aws.amazon.com/ec2/

---

**Good luck with your deployment! 🚀**
