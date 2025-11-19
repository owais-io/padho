# Quick Reference Guide - padho.net (S3 + CloudFront)

Common commands and operations for managing your S3 + CloudFront deployment.

---

## Local Development

### Run Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

### Run Admin Panel (Local Only)
```bash
npm run dev
```
Visit: http://localhost:3000/admin

### Build Static Export
```bash
npm run build
```
Output: `out/` directory

### Test Static Build Locally
```bash
# After building
cd out
python3 -m http.server 8000
# Or use Node.js
npx serve
```
Visit: http://localhost:8000

---

## Content Management Workflow

### 1. Create New Articles
```bash
# Start dev server
npm run dev

# Go to admin panel
# http://localhost:3000/admin

# Fetch articles from Guardian
# Generate summaries
# Deploy as MDX files
```

### 2. Deploy to Production
```bash
# Commit new MDX files
git add content/articles/

# Commit with message
git commit -m "Add new articles: [article titles]"

# Push to GitHub
git push origin master

# GitHub Actions will automatically deploy (3-5 min)
```

### 3. Verify Deployment
- Check GitHub Actions: https://github.com/owais-io/padho/actions
- Visit site: https://padho.net

---

## AWS S3 Management

### List Bucket Contents
```bash
aws s3 ls s3://padho-net-website
```

### List All Files Recursively
```bash
aws s3 ls s3://padho-net-website --recursive
```

### Check Bucket Size
```bash
aws s3 ls s3://padho-net-website --recursive --summarize --human-readable
```

### Manual Deployment to S3
```bash
# Build first
npm run build

# Deploy to S3 (with cache control)
aws s3 sync out/ s3://padho-net-website --delete --cache-control "public,max-age=31536000,immutable" --exclude "*.html"
aws s3 sync out/ s3://padho-net-website --delete --cache-control "public,max-age=0,must-revalidate" --exclude "*" --include "*.html"
```

### Quick Deploy (simple version)
```bash
npm run build
aws s3 sync out/ s3://padho-net-website --delete
```

### Delete Specific File
```bash
aws s3 rm s3://padho-net-website/path/to/file.html
```

### Download Entire Site Backup
```bash
aws s3 sync s3://padho-net-website ./backup-folder
```

### Check Bucket Website Configuration
```bash
aws s3api get-bucket-website --bucket padho-net-website
```

---

## CloudFront Management

### Invalidate Cache (Force Refresh)
```bash
# Invalidate everything
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

# Invalidate specific paths
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/index.html" "/category/*"
```

### Check Invalidation Status
```bash
aws cloudfront get-invalidation --distribution-id YOUR_DIST_ID --id INVALIDATION_ID
```

### List Recent Invalidations
```bash
aws cloudfront list-invalidations --distribution-id YOUR_DIST_ID
```

### Get Distribution Info
```bash
aws cloudfront get-distribution --id YOUR_DIST_ID
```

### Check Distribution Status
```bash
aws cloudfront get-distribution --id YOUR_DIST_ID | grep Status
```

---

## SSL Certificate Management (ACM)

### List Certificates
```bash
aws acm list-certificates --region us-east-1
```

### Check Certificate Details
```bash
aws acm describe-certificate --certificate-arn YOUR_CERT_ARN --region us-east-1
```

### Check Certificate Expiry
```bash
aws acm describe-certificate --certificate-arn YOUR_CERT_ARN --region us-east-1 | grep NotAfter
```

**Note**: ACM certificates auto-renew as long as DNS validation records remain in place.

---

## AWS CLI Configuration

### Check Current Configuration
```bash
aws configure list
```

### Reconfigure AWS CLI
```bash
aws configure
```

### Use Different Profile
```bash
aws configure --profile padho
aws s3 ls --profile padho
```

### Check AWS Identity
```bash
aws sts get-caller-identity
```

---

## DNS Management

### Check DNS Resolution
```bash
nslookup padho.net
```

### Check DNS Propagation
```bash
dig padho.net
```

---

## GitHub Actions

### View Deployment Status
Visit: https://github.com/owais-io/padho/actions

### Re-run Failed Deployment
1. Go to Actions tab
2. Click on failed workflow
3. Click "Re-run jobs"

### Manual Trigger Deployment
1. Go to Actions tab
2. Select "Deploy to AWS EC2" workflow
3. Click "Run workflow"
4. Select branch: master
5. Click "Run workflow"

---

## Troubleshooting Commands

### Website Not Loading
```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -50 /var/log/nginx/padho_error.log

# Restart Nginx
sudo systemctl restart nginx

# Check firewall
sudo ufw status
```

### SSL Issues
```bash
# Check certificate
sudo certbot certificates

# Check Nginx SSL config
sudo nano /etc/nginx/sites-available/padho.net

# Test SSL
curl -I https://padho.net
```

### GitHub Actions Deployment Fails
```bash
# Check SSH connection works
ssh -i ~/Downloads/padho-deployment-key.pem ubuntu@YOUR_EC2_IP

# Check deployment directory permissions
ls -la /var/www/padho

# Fix permissions
sudo chown -R ubuntu:ubuntu /var/www/padho
sudo chmod -R 755 /var/www/padho
```

---

## GitHub Secrets (for reference)

Required secrets in repository settings:

- `AWS_ACCESS_KEY_ID`: IAM user access key
- `AWS_SECRET_ACCESS_KEY`: IAM user secret key
- `S3_BUCKET_NAME`: padho-net-website
- `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

---

## Backup Strategy

### Backup Website Content from S3
```bash
# Download entire site
aws s3 sync s3://padho-net-website ./backups/padho-backup-$(date +%Y%m%d)

# Create compressed backup
cd backups
tar -czf padho-backup-$(date +%Y%m%d).tar.gz padho-backup-$(date +%Y%m%d)
```

### Restore from Backup
```bash
# Extract backup
tar -xzf padho-backup-20250120.tar.gz

# Upload to S3
aws s3 sync padho-backup-20250120/ s3://padho-net-website --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Enable S3 Versioning (Recommended)
```bash
# Enable versioning on bucket
aws s3api put-bucket-versioning --bucket padho-net-website --versioning-configuration Status=Enabled

# List versions of a file
aws s3api list-object-versions --bucket padho-net-website --prefix index.html
```

---

## Performance Monitoring

### Check Page Load Time
```bash
curl -w "@-" -o /dev/null -s https://padho.net <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

### Check Website Status
```bash
curl -I https://padho.net
```

---

## Useful AWS Resources

- **S3 Console**: https://console.aws.amazon.com/s3/
- **CloudFront Console**: https://console.aws.amazon.com/cloudfront/
- **ACM Console**: https://console.aws.amazon.com/acm/ (use us-east-1 region)
- **Route 53 Console**: https://console.aws.amazon.com/route53/
- **IAM Console**: https://console.aws.amazon.com/iam/
- **GitHub Actions**: https://github.com/owais-io/padho/actions

---

## Emergency Contacts & Resources

- **AWS Support**: https://console.aws.amazon.com/support/
- **AWS Documentation**: https://docs.aws.amazon.com/
- **GitHub Support**: https://support.github.com/
- **CloudFront Status**: https://status.aws.amazon.com/

---

**Keep this guide handy for day-to-day operations! 📚**
