# AWS S3 + CloudFront Deployment Guide for padho.net

Complete guide to deploy your Next.js static site to AWS S3 with CloudFront CDN.

---

## Prerequisites Checklist

- ✅ AWS Account (with billing enabled)
- ✅ Domain: padho.net (from third-party registrar)
- ✅ GitHub repository: https://github.com/owais-io/padho
- ✅ Credit/debit card (for AWS, even for free tier)

---

## Architecture Overview

```
GitHub Push → GitHub Actions → Build Static Site → Deploy to S3 → Serve via CloudFront → HTTPS at padho.net
```

**Components:**
- **S3 Bucket**: Stores your static files (HTML, CSS, JS, images)
- **CloudFront**: Global CDN for fast delivery + HTTPS
- **ACM (Certificate Manager)**: Free SSL certificate
- **Route 53 or External DNS**: Points padho.net to CloudFront
- **IAM User**: Credentials for GitHub Actions to deploy

---

## Phase 1: Create S3 Bucket for Website Hosting

### Step 1.1: Create S3 Bucket

1. **Go to AWS Console** → Search for "S3" → Click "Create bucket"

2. **Bucket Settings:**
   - **Bucket name**: `padho-net-website` (must be globally unique, adjust if taken)
   - **AWS Region**: `us-east-1` (US East - N. Virginia)
     - *Important: Use us-east-1 for easier CloudFront + ACM integration*
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access settings**:
     - ⚠️ **UNCHECK** "Block all public access"
     - Check the acknowledgment box
     - *We need public read access for website hosting*
   - Leave other settings as default
   - Click "Create bucket"

3. **Note down your bucket name**: `padho-net-website`

---

### Step 1.2: Configure Bucket for Static Website Hosting

1. **Click on your bucket** → Go to "Properties" tab

2. **Scroll down to "Static website hosting"** → Click "Edit"

3. **Configure:**
   - Static website hosting: **Enable**
   - Hosting type: **Host a static website**
   - Index document: `index.html`
   - Error document: `404.html`
   - Click "Save changes"

4. **Note down the bucket website endpoint** (appears after saving)
   - Example: `http://padho-net-website.s3-website-us-east-1.amazonaws.com`

---

### Step 1.3: Add Bucket Policy for Public Read Access

1. **Go to "Permissions" tab** → Scroll to "Bucket policy" → Click "Edit"

2. **Paste this policy** (replace `padho-net-website` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::padho-net-website/*"
    }
  ]
}
```

3. **Click "Save changes"**

---

## Phase 2: Request SSL Certificate (ACM)

### Step 2.1: Request Certificate

1. **Go to AWS Console** → Search for "Certificate Manager" → Click

2. **IMPORTANT**: Make sure you're in **us-east-1 region** (top-right corner)
   - CloudFront only uses certificates from us-east-1

3. **Click "Request certificate"**

4. **Certificate type:**
   - Select: **Request a public certificate**
   - Click "Next"

5. **Domain names:**
   - Domain name 1: `padho.net`
   - Click "Add another name to this certificate"
   - Domain name 2: `www.padho.net`

6. **Validation method:**
   - Select: **DNS validation**

7. **Key algorithm:**
   - Select: **RSA 2048**

8. **Click "Request"**

---

### Step 2.2: Validate Certificate

1. **Click "View certificate"** → You'll see pending validation status

2. **For each domain**, click "Create records in Route 53" OR manually add to your DNS:

   **Option A: If using Route 53** (easier):
   - Click "Create records in Route 53"
   - Click "Create records"
   - Wait 5-10 minutes

   **Option B: If using external DNS** (your registrar):
   - Click on the domain to expand details
   - You'll see **CNAME name** and **CNAME value**
   - Copy these values
   - Go to your domain registrar's DNS settings
   - Add a **CNAME record**:
     - Name: (the CNAME name, usually starts with `_` )
     - Value: (the CNAME value)
     - TTL: 300
   - Do this for both domains if needed
   - Click "Save"

3. **Wait for validation** (5 minutes to 24 hours, usually 5-30 minutes)

4. **Certificate status should change to "Issued"**

⏸️ **Leave this tab open** - you'll need the certificate ARN later

---

## Phase 3: Create CloudFront Distribution

### Step 3.1: Create Distribution

1. **Go to AWS Console** → Search for "CloudFront" → Click "Create distribution"

2. **Origin settings:**
   - **Origin domain**:
     - ⚠️ **DO NOT** select the S3 bucket from dropdown
     - **Manually type**: `padho-net-website.s3-website-us-east-1.amazonaws.com`
     - (This is your S3 website endpoint without http://)
   - **Protocol**: **HTTP only** (S3 website endpoints don't support HTTPS)
   - **Name**: Auto-filled (leave as is)

3. **Default cache behavior:**
   - **Viewer protocol policy**: **Redirect HTTP to HTTPS**
   - **Allowed HTTP methods**: **GET, HEAD**
   - **Cache policy**: **CachingOptimized**
   - **Origin request policy**: None
   - Leave other settings as default

4. **Settings:**
   - **Price class**: **Use all edge locations** (or select based on your audience)
   - **Alternate domain names (CNAMEs)**:
     - Click "Add item"
     - Add: `padho.net`
     - Click "Add item"
     - Add: `www.padho.net`
   - **Custom SSL certificate**:
     - Select the certificate you created (padho.net)
   - **Default root object**: `index.html`
   - **Description**: `padho.net website distribution` (optional)

5. **Click "Create distribution"**

6. **Wait for deployment** (5-15 minutes)
   - Status will change from "Deploying" to "Enabled"

7. **Note down the Distribution domain name** (e.g., `d1234abcd.cloudfront.net`)

8. **Note down the Distribution ID** (e.g., `E1234ABCDEFG`)
   - You'll need this for GitHub Actions

---

### Step 3.2: Configure Error Pages (Optional but Recommended)

1. **Click on your distribution** → Go to "Error pages" tab

2. **Create custom error response:**
   - Click "Create custom error response"
   - **HTTP error code**: 404
   - **Customize error response**: Yes
   - **Response page path**: `/404.html`
   - **HTTP Response code**: 404
   - Click "Create custom error response"

---

## Phase 4: Configure DNS for Custom Domain

### Step 4.1: Add DNS Records at Your Domain Registrar

1. **Log in to your domain registrar** (where you bought padho.net)

2. **Go to DNS settings** for padho.net

3. **Add/Edit the following DNS records:**

   **CNAME Record for root domain (padho.net):**

   *Note: Some registrars don't allow CNAME for root domain. If that's the case, use A record with CloudFront IP or use ALIAS record if available, or use www subdomain only.*

   **If your registrar supports ALIAS/ANAME for root domain:**
   - Type: `ALIAS` or `ANAME`
   - Name: `@` (or leave blank)
   - Value: `d1234abcd.cloudfront.net` (your CloudFront domain)
   - TTL: `300`

   **If your registrar does NOT support ALIAS for root (most common):**
   - You'll need to use Route 53 for DNS, OR
   - Only use www subdomain, OR
   - Use A record pointing to CloudFront IPs (not recommended, IPs can change)

   **CNAME Record for www subdomain:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `d1234abcd.cloudfront.net` (your CloudFront domain)
   - TTL: `300`

4. **Save changes**

5. **Wait for DNS propagation** (5 minutes to 24 hours)

6. **Test DNS:**
   ```bash
   nslookup www.padho.net
   ```

**IMPORTANT NOTE**: If your registrar doesn't support ALIAS records for root domain, I recommend using **AWS Route 53** for DNS (see Optional Phase 7 below).

---

## Phase 5: Create IAM User for GitHub Actions

### Step 5.1: Create IAM User

1. **Go to AWS Console** → Search for "IAM" → Click

2. **Click "Users"** (left sidebar) → **"Create user"**

3. **User details:**
   - User name: `github-actions-padho`
   - Click "Next"

4. **Set permissions:**
   - Select: **Attach policies directly**
   - Search and select: **AmazonS3FullAccess**
   - Search and select: **CloudFrontFullAccess**
   - Click "Next"

5. **Review and create:**
   - Click "Create user"

---

### Step 5.2: Create Access Keys

1. **Click on the user** you just created: `github-actions-padho`

2. **Go to "Security credentials" tab**

3. **Scroll to "Access keys"** → Click "Create access key"

4. **Use case:**
   - Select: **Application running outside AWS**
   - Check the confirmation box
   - Click "Next"

5. **Description tag:**
   - Description: `GitHub Actions deployment key`
   - Click "Create access key"

6. **⚠️ IMPORTANT - Save these credentials:**
   - **Access key ID**: (starts with `AKIA...`)
   - **Secret access key**: (shown only once!)
   - **Download .csv file** OR copy both values to a secure location
   - Click "Done"

⚠️ **You won't be able to see the secret key again!**

---

## Phase 6: Configure GitHub Secrets

### Step 6.1: Add Secrets to GitHub Repository

1. **Go to**: https://github.com/owais-io/padho

2. **Click Settings** → **Secrets and variables** → **Actions**

3. **Click "New repository secret"** and add these 4 secrets:

   **Secret 1: AWS_ACCESS_KEY_ID**
   - Name: `AWS_ACCESS_KEY_ID`
   - Value: (your access key ID from IAM user)
   - Click "Add secret"

   **Secret 2: AWS_SECRET_ACCESS_KEY**
   - Name: `AWS_SECRET_ACCESS_KEY`
   - Value: (your secret access key from IAM user)
   - Click "Add secret"

   **Secret 3: S3_BUCKET_NAME**
   - Name: `S3_BUCKET_NAME`
   - Value: `padho-net-website` (your bucket name)
   - Click "Add secret"

   **Secret 4: CLOUDFRONT_DISTRIBUTION_ID**
   - Name: `CLOUDFRONT_DISTRIBUTION_ID`
   - Value: (your CloudFront distribution ID, e.g., `E1234ABCDEFG`)
   - Click "Add secret"

---

## Phase 7: Deploy Your Site

### Step 7.1: Initial Manual Deployment (Optional)

Before using GitHub Actions, let's test with a manual deployment:

1. **On your local machine**, make sure you've built the site:
   ```bash
   npm run build
   ```

2. **Install AWS CLI** (if not already installed):

   **Windows:**
   ```powershell
   # Download and run installer from:
   # https://awscli.amazonaws.com/AWSCLIV2.msi
   ```

   **Mac:**
   ```bash
   brew install awscli
   ```

   **Linux:**
   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

3. **Configure AWS CLI:**
   ```bash
   aws configure
   ```
   - AWS Access Key ID: (your access key)
   - AWS Secret Access Key: (your secret key)
   - Default region name: `us-east-1`
   - Default output format: `json`

4. **Deploy to S3:**
   ```bash
   aws s3 sync out/ s3://padho-net-website --delete
   ```

5. **Invalidate CloudFront cache:**
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

6. **Test your site:**
   - Wait 2-3 minutes for CloudFront invalidation
   - Visit: https://www.padho.net (if www CNAME is set up)
   - Or: https://d1234abcd.cloudfront.net (CloudFront domain)

---

### Step 7.2: Automatic Deployment via GitHub Actions

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Configure S3 + CloudFront deployment"
   git push origin master
   ```

2. **Go to GitHub Actions tab:**
   - https://github.com/owais-io/padho/actions

3. **Watch the deployment workflow run** (takes 3-5 minutes)

4. **If successful:**
   - Visit https://padho.net (after DNS propagates)
   - Visit https://www.padho.net

---

## Phase 8: Verify Everything Works

### Checklist:

- [ ] Certificate status is "Issued" in ACM
- [ ] CloudFront distribution status is "Enabled"
- [ ] DNS records are configured correctly
- [ ] Visit http://padho.net → redirects to https://
- [ ] Visit https://padho.net → shows your homepage
- [ ] HTTPS lock icon shows in browser
- [ ] All pages load correctly (categories, articles)
- [ ] Images load properly
- [ ] GitHub Actions deployment succeeds

---

## Your Workflow After Setup

1. **Run admin locally** (http://localhost:3000/admin)
2. **Fetch Guardian articles and generate summaries**
3. **Deploy summaries as MDX files** to `content/articles/`
4. **Commit and push to GitHub:**
   ```bash
   git add content/articles/
   git commit -m "Add new articles: [titles]"
   git push origin master
   ```
5. **GitHub Actions automatically builds and deploys** (3-5 minutes)
6. **CloudFront serves updated content globally**
7. **Live on padho.net!**

---

## Optional: Phase 7 - Use AWS Route 53 for DNS (Recommended)

If your domain registrar doesn't support ALIAS records for root domain, use Route 53:

### Step 7.1: Create Hosted Zone

1. **Go to AWS Console** → Search for "Route 53" → Click

2. **Click "Hosted zones"** → **"Create hosted zone"**

3. **Configuration:**
   - Domain name: `padho.net`
   - Type: Public hosted zone
   - Click "Create hosted zone"

4. **Note down the 4 nameservers** (e.g., `ns-123.awsdns-12.com`)

---

### Step 7.2: Update Nameservers at Registrar

1. **Go to your domain registrar**

2. **Find DNS/Nameserver settings**

3. **Replace existing nameservers with Route 53 nameservers** (all 4)

4. **Save changes**

5. **Wait for propagation** (can take up to 48 hours)

---

### Step 7.3: Create DNS Records in Route 53

1. **Go to your hosted zone** → Click "Create record"

2. **Create A record for root domain:**
   - Record name: (leave blank for root domain)
   - Record type: `A`
   - Alias: **YES** (toggle on)
   - Route traffic to: **Alias to CloudFront distribution**
   - Choose your CloudFront distribution
   - Click "Create records"

3. **Create A record for www:**
   - Record name: `www`
   - Record type: `A`
   - Alias: **YES**
   - Route traffic to: **Alias to CloudFront distribution**
   - Choose your CloudFront distribution
   - Click "Create records"

---

## Troubleshooting

### Issue: Certificate validation stuck

**Solution:**
- Check DNS records at registrar
- CNAME records must match exactly
- Wait up to 24 hours for validation

### Issue: CloudFront shows "Access Denied"

**Solution:**
```bash
# Check bucket policy is correct
# Ensure Origin domain uses S3 website endpoint, not S3 bucket endpoint
# Format: bucket-name.s3-website-region.amazonaws.com
```

### Issue: Changes not appearing on site

**Solution:**
```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Issue: GitHub Actions deployment fails

**Solution:**
- Check AWS credentials in GitHub secrets
- Verify IAM user has S3 and CloudFront permissions
- Check S3 bucket name in secrets

### Issue: Root domain (padho.net) not working

**Solution:**
- Use Route 53 for DNS (supports ALIAS records)
- OR use www.padho.net only
- OR check if registrar supports ALIAS/ANAME records

---

## Costs After Free Tier

### Free Tier (12 months):
- **S3**: 5 GB storage, 20,000 GET, 2,000 PUT requests/month
- **CloudFront**: 1 TB transfer, 10 million requests/month
- **Route 53**: $0.50/month (if using)
- **Certificate**: FREE forever

### After Free Tier:
- **S3**: ~$0.023/GB storage
- **CloudFront**: ~$0.085/GB transfer
- **Route 53**: $0.50/month per hosted zone
- **Estimated total**: $1-5/month for typical news site

---

## Security Best Practices

1. **Use CloudFront** - Don't expose S3 bucket directly
2. **Enable HTTPS** - CloudFront + ACM provide free SSL
3. **Restrict IAM permissions** - Only give necessary permissions
4. **Rotate access keys** - Every 90 days
5. **Enable CloudFront logging** (optional) - Monitor traffic

---

## Performance Optimization

### Current Setup:
- Static files cached for 1 year
- HTML files revalidated on each request
- CloudFront serves from 450+ edge locations globally

### Further Optimizations:
```bash
# Enable compression in CloudFront
# Already configured in deployment workflow
# Static assets: immutable, 1 year cache
# HTML: must-revalidate, no cache
```

---

## Useful AWS CLI Commands

### Check bucket contents:
```bash
aws s3 ls s3://padho-net-website --recursive
```

### Manual deployment:
```bash
aws s3 sync out/ s3://padho-net-website --delete
```

### Invalidate CloudFront:
```bash
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```

### Check CloudFront distribution:
```bash
aws cloudfront get-distribution --id DIST_ID
```

---

## Need Help?

- **S3 docs**: https://docs.aws.amazon.com/s3/
- **CloudFront docs**: https://docs.aws.amazon.com/cloudfront/
- **ACM docs**: https://docs.aws.amazon.com/acm/
- **Route 53 docs**: https://docs.aws.amazon.com/route53/

---

**Good luck with your S3 + CloudFront deployment! ☁️🚀**
