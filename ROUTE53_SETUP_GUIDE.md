# Route 53 DNS Setup for Third-Party Domain

Complete guide to use AWS Route 53 for DNS management when your domain (padho.net) is registered with a third-party registrar.

---

## Why Use Route 53?

**Problem**: Most third-party domain registrars don't support ALIAS records for root domains (padho.net), which are needed to point directly to CloudFront.

**Solution**: Transfer DNS management to Route 53 (domain stays with your registrar, only DNS moves to Route 53).

**Benefits**:
- ✅ ALIAS records for root domain
- ✅ Better integration with AWS services
- ✅ Fast DNS propagation
- ✅ Easy management with other AWS resources
- ✅ Only $0.50/month per domain

---

## Step-by-Step Guide

### Step 1: Create Hosted Zone in Route 53

1. **Go to AWS Console** → Search for "Route 53" → Click

2. **Click "Hosted zones"** in the left sidebar

3. **Click "Create hosted zone"**

4. **Configure the hosted zone:**
   - **Domain name**: `padho.net` (enter your exact domain)
   - **Description**: `DNS for padho.net website` (optional)
   - **Type**: **Public hosted zone**
   - **Tags**: (optional, leave blank)

5. **Click "Create hosted zone"**

6. **You'll see your new hosted zone** with 2 default record sets:
   - NS (Name Server) record
   - SOA (Start of Authority) record

---

### Step 2: Note Down Route 53 Nameservers

1. **Click on the NS record** (Type: NS) in your hosted zone

2. **You'll see 4 nameservers** in the "Value/Route traffic to" column:
   ```
   ns-1234.awsdns-56.org
   ns-789.awsdns-01.com
   ns-234.awsdns-89.net
   ns-567.awsdns-12.co.uk
   ```

3. **Copy all 4 nameservers** (you'll need these for the next step)

   **Important**: Your nameservers will be different from the example above!

---

### Step 3: Update Nameservers at Your Domain Registrar

This step varies by registrar, but the general process is the same:

#### **Generic Instructions:**

1. **Log in to your domain registrar** (where you bought padho.net)
   - Examples: GoDaddy, Namecheap, Google Domains, Cloudflare, etc.

2. **Go to domain management** / DNS settings for padho.net

3. **Find "Nameservers" or "DNS Servers" section**
   - May be called: "Nameservers", "Name Servers", "DNS", "Custom DNS"

4. **Select "Custom Nameservers" or "Use custom nameservers"**

5. **Replace existing nameservers with Route 53 nameservers**
   - Delete existing nameservers
   - Add all 4 Route 53 nameservers (from Step 2)

6. **Save changes**

7. **Wait for DNS propagation** (can take 5 minutes to 48 hours, usually 1-2 hours)

---

#### **Specific Registrar Instructions:**

<details>
<summary><b>GoDaddy</b></summary>

1. Log in to GoDaddy
2. Go to "My Products" → "Domains"
3. Click on padho.net
4. Scroll to "Additional Settings" → Click "Manage DNS"
5. Scroll to "Nameservers" → Click "Change"
6. Select "Enter my own nameservers (advanced)"
7. Remove existing nameservers
8. Add all 4 Route 53 nameservers
9. Click "Save"
</details>

<details>
<summary><b>Namecheap</b></summary>

1. Log in to Namecheap
2. Go to "Domain List"
3. Click "Manage" next to padho.net
4. Find "Nameservers" section
5. Select "Custom DNS"
6. Add all 4 Route 53 nameservers
7. Click the checkmark to save
</details>

<details>
<summary><b>Google Domains</b></summary>

1. Log in to Google Domains
2. Click on padho.net
3. Go to "DNS" tab
4. Click "Custom name servers"
5. Add all 4 Route 53 nameservers
6. Click "Switch to these settings"
</details>

<details>
<summary><b>Cloudflare Registrar</b></summary>

1. Log in to Cloudflare
2. Select padho.net
3. Go to "DNS" → "Settings"
4. Scroll to "Cloudflare Nameservers"
5. Note: If using Cloudflare, you may want to keep Cloudflare DNS instead of Route 53
   - Cloudflare also supports ALIAS-like records (flattened CNAME)
</details>

---

### Step 4: Verify Nameserver Change

**Wait 5-10 minutes after updating nameservers**, then test:

#### **Method 1: Using nslookup**
```bash
nslookup -type=ns padho.net
```

You should see your Route 53 nameservers in the result.

#### **Method 2: Using dig (Mac/Linux)**
```bash
dig NS padho.net
```

#### **Method 3: Online Tool**
Visit: https://www.whatsmydns.net/#NS/padho.net

---

### Step 5: Create DNS Records in Route 53

Once nameservers are propagated (Step 4 shows Route 53 nameservers):

#### **5.1: Create ALIAS Record for Root Domain (padho.net)**

1. **Go to your hosted zone** in Route 53

2. **Click "Create record"**

3. **Configure the record:**
   - **Record name**: (leave blank for root domain)
   - **Record type**: `A - Routes traffic to an IPv4 address and some AWS resources`
   - **Alias**: Toggle **ON** (very important!)
   - **Route traffic to**:
     - Select: **Alias to CloudFront distribution**
     - Select your CloudFront distribution from dropdown
     - (If not showing, enter CloudFront domain: `d1234abcd.cloudfront.net`)
   - **Routing policy**: Simple routing
   - **Evaluate target health**: No

4. **Click "Create records"**

---

#### **5.2: Create ALIAS Record for WWW Subdomain (www.padho.net)**

1. **Click "Create record"** again

2. **Configure the record:**
   - **Record name**: `www`
   - **Record type**: `A - Routes traffic to an IPv4 address and some AWS resources`
   - **Alias**: Toggle **ON**
   - **Route traffic to**:
     - Select: **Alias to CloudFront distribution**
     - Select your CloudFront distribution
   - **Routing policy**: Simple routing
   - **Evaluate target health**: No

3. **Click "Create records"**

---

#### **5.3: (Optional) Create CNAME for SSL Certificate Validation**

If you're doing SSL certificate validation via DNS and haven't done it yet:

1. **Go to ACM** (Certificate Manager) → Select your certificate

2. **Copy the CNAME name and value** from the validation section

3. **Go back to Route 53** → Click "Create record"

4. **Configure:**
   - **Record name**: (paste CNAME name, e.g., `_abc123.padho.net`)
   - **Record type**: `CNAME`
   - **Value**: (paste CNAME value)
   - **TTL**: 300

5. **Click "Create records"**

6. **Repeat for www.padho.net** if you have a separate validation record

---

### Step 6: Verify DNS Records

Wait 5-10 minutes after creating records, then test:

#### **Test Root Domain:**
```bash
nslookup padho.net
```

Should return CloudFront IP addresses.

#### **Test WWW Subdomain:**
```bash
nslookup www.padho.net
```

Should return CloudFront IP addresses.

#### **Test in Browser:**
1. Visit: `https://padho.net`
2. Visit: `https://www.padho.net`

Both should load your site with HTTPS!

---

## Complete Route 53 Records Summary

After setup, your Route 53 hosted zone should have these records:

| Name | Type | Value/Target |
|------|------|--------------|
| padho.net | A (ALIAS) | CloudFront distribution |
| www.padho.net | A (ALIAS) | CloudFront distribution |
| _abc123.padho.net | CNAME | (ACM validation - if needed) |
| padho.net | NS | Route 53 nameservers (auto-created) |
| padho.net | SOA | Route 53 SOA record (auto-created) |

---

## Troubleshooting

### Issue: Nameserver not updating

**Check:**
- Did you save changes at registrar?
- Some registrars take up to 48 hours
- Check with: `nslookup -type=ns padho.net`

**Solution:**
- Wait longer (up to 48 hours)
- Contact registrar support if stuck

---

### Issue: Certificate validation stuck

**Check:**
- Are nameservers pointing to Route 53?
- Are CNAME validation records created in Route 53?

**Solution:**
```bash
# Check nameservers first
nslookup -type=ns padho.net

# Should show Route 53 nameservers before validation works
```

---

### Issue: Website not loading

**Check:**
- DNS propagation: `nslookup padho.net`
- CloudFront status: Should be "Enabled"
- ALIAS records point to CloudFront

**Solution:**
```bash
# Test DNS resolution
nslookup padho.net

# Should return CloudFront IP addresses
# If not, check ALIAS records in Route 53
```

---

### Issue: "DNS_PROBE_FINISHED_NXDOMAIN" error

**Meaning**: DNS records not found

**Solution:**
- Wait for nameserver propagation (up to 48 hours)
- Verify nameservers at registrar match Route 53
- Clear your DNS cache:
  - Windows: `ipconfig /flushdns`
  - Mac: `sudo dscacheutil -flushcache`
  - Linux: `sudo systemd-resolve --flush-caches`

---

## Cost

- **Route 53 Hosted Zone**: $0.50/month
- **DNS Queries**: $0.40 per million queries (first 1 billion)
- **ALIAS Queries**: FREE (to AWS resources like CloudFront)

**Estimated cost**: ~$0.50-0.60/month

---

## Alternative: Keep Current DNS (If Registrar Supports ALIAS)

Some registrars support ALIAS-like records:
- **Cloudflare** - Use "Flattened CNAME" or keep Cloudflare proxy
- **DNSimple** - Supports ALIAS records
- **DNS Made Easy** - Supports ANAME records

**If your registrar supports ALIAS/ANAME for root domain:**
- You don't need Route 53!
- Just create ALIAS/ANAME record pointing to CloudFront domain
- Create CNAME for www subdomain

---

## Quick Reference Commands

### Check Nameservers
```bash
nslookup -type=ns padho.net
```

### Check A Records
```bash
nslookup padho.net
```

### Check DNS Propagation Globally
```bash
# Online tool
https://www.whatsmydns.net/#A/padho.net
```

### Flush Local DNS Cache
```bash
# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches
```

---

## Timeline

| Step | Time |
|------|------|
| Create Route 53 hosted zone | 2 minutes |
| Update nameservers at registrar | 5 minutes |
| Wait for nameserver propagation | 1-48 hours (usually 1-2 hours) |
| Create DNS records in Route 53 | 5 minutes |
| Wait for DNS propagation | 5-30 minutes |
| **Total** | **~1-48 hours** (mostly waiting) |

---

## Summary Checklist

- [ ] Created Route 53 hosted zone for padho.net
- [ ] Noted down 4 Route 53 nameservers
- [ ] Updated nameservers at domain registrar
- [ ] Verified nameservers propagated (nslookup)
- [ ] Created A (ALIAS) record for padho.net → CloudFront
- [ ] Created A (ALIAS) record for www.padho.net → CloudFront
- [ ] Created CNAME records for ACM validation (if needed)
- [ ] Verified DNS resolves to CloudFront IPs
- [ ] Tested https://padho.net in browser
- [ ] Tested https://www.padho.net in browser

---

**You're all set with Route 53! 🚀**

*Cost: ~$0.50/month for professional DNS management*
