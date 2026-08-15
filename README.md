# TechTogether




## Steps to Setting up DNS

in cloudfront when I configure alternate domain, it is asking to create a TLS cert, is ther a cost to that.

Step 1: Request an SSL/TLS Certificate in ACM (AWS Side)
Go to the AWS Certificate Manager (ACM) console — make sure you're in the us-east-1 (N. Virginia) region
Click Request a certificate → Select Request a public certificate
Enter your domain names:
techtogetherinc.com
*.techtogetherinc.com (wildcard, optional but recommended)
For validation method, select DNS validation
Click Request
ACM will provide you with a CNAME record (Name and Value) that you need to add to your DNS to prove domain ownership — copy these values

Step 2: Validate the Certificate (Namecheap Side)
Log in to Namecheap → Go to Domain List → Click Manage next to techtogetherinc.com
Go to the Advanced DNS tab
Add a new CNAME Record with the values ACM provided:
Host: The Name value from ACM (remove the .techtogetherinc.com suffix — Namecheap appends it automatically)
Value/Target: The Value from ACM
TTL: Automatic
Save the record
Wait for ACM to validate (can take a few minutes to a few hours) — the certificate status will change to Issued in the ACM console


Step 3: Configure CloudFront Distribution (AWS Side)
Go to the CloudFront console
Select your distribution (dxxxxxxxxxxxxpau.cloudfront.net)
Go to the General tab → Click Edit
Under Alternate domain name (CNAME), add:
techtogetherinc.com
www.techtogetherinc.com (if you want www to work too)
Under Custom SSL certificate, select the ACM certificate you just created from the dropdown
Leave Security policy at the recommended default (TLSv1.2_2021)
Click Save changes


Step 4: Point Your Domain to CloudFront (Namecheap Side)
Go back to Namecheap → Advanced DNS for techtogetherinc.com
Delete any existing A records or URL redirect records for the root domain (@) and www
Add the following CNAME records:

CNAME	www	dxxxxxxxxxxxu.cloudfront.net
CNAME	@   dxxxxxxxxxpau.cloudfront.net

Step 5: Verify Everything Works
Wait for DNS propagation (typically 5–30 minutes, can take up to 48 hours)
Test by visiting:
https://www.techtogetherinc.com
https://techtogetherinc.com
Verify the SSL padlock appears in your browser


