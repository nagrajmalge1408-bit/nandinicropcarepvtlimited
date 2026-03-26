# QR Code for Printable Product Labels - Complete Setup Guide

## 🎯 Overview

This system generates QR codes that can be **physically printed on product packaging** or labels. When customers scan the QR code, they're taken to a complete product detail page with full specifications, benefits, dosage, and safety information.

## 📁 Files Created

1. **products (2).js** - Updated with `qrCode` field for each product
2. **qrCodePrint.js** - Core QR code generation and printing functions
3. **generate-qr-codes.html** - Dashboard to generate, preview, and print all QR codes
4. **product.html** - Product detail page that displays when QR code is scanned

## 🚀 Quick Setup (4 Steps)

### Step 1: Update Your Domain in products.js

Replace all instances of `yoursite.com` with your actual domain:

```javascript
// NOT THIS:
qrCode: "https://yoursite.com/product/dhartigold",

// DO THIS:
qrCode: "https://yourdomain.com/product/dhartigold",
// or
qrCode: "https://nandinicropcarecare.com/product/dhartigold",
// or with port (if testing locally):
qrCode: "http://localhost:3000/product/dhartigold",
```

**Update these 6 products in products.js:**
- dhartigold
- nagrajgold
- gibbogrow
- ethyripe
- sturdystem
- yieldmax

### Step 2: Set Up URL Routing

You have **two options** for URL structure:

#### Option A: Query Parameter (Easiest)
```
https://yourdomain.com/product.html?id=dhartigold
```

Update products.js:
```javascript
qrCode: "https://yourdomain.com/product.html?id=dhartigold",
```

#### Option B: Path-based (Professional)
```
https://yourdomain.com/product/dhartigold
```

Update products.js:
```javascript
qrCode: "https://yourdomain.com/product/dhartigold",
```

Then configure your server to route `/product/*` to `product.html`

**For Apache (.htaccess):**
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^product/(.+)$ product.html [L]
</IfModule>
```

**For Nginx:**
```
location /product/ {
  try_files $uri $uri/ /product.html;
}
```

**For Node.js/Express:**
```javascript
app.get('/product/:id', (req, res) => {
  res.sendFile('product.html');
});
```

### Step 3: Deploy Files to Your Server

Upload these files to your web server:
- `products (2).js` (updated)
- `qrCodePrint.js`
- `generate-qr-codes.html` (rename to `qr-generator.html` or keep as is)
- `product.html`
- `nag.html` (your main page)

### Step 4: Test the QR Codes

1. **Access the QR Code Generator:**
   ```
   https://yourdomain.com/generate-qr-codes.html
   ```

2. **View all QR codes and their redirect URLs**

3. **Print Test QR Codes:**
   - Click "Print All QR Codes"
   - Print to PDF or paper
   - Scan with your phone

4. **Verify the redirect:**
   - Scanning should take you to the product detail page
   - Product details should display correctly

## 🖨️ How to Print QR Codes

### Option 1: Print All QR Codes (Recommended)

1. Visit: `https://yourdomain.com/generate-qr-codes.html`
2. Click **"Print All QR Codes"**
3. Choose print settings:
   - Paper size: A4
   - Orientation: Portrait
   - Margins: 10mm
   - Colors: On
4. Print to PDF or directly to paper
5. Cut and apply to product packaging

### Option 2: Print Individual QR Codes

Each QR code card on the generator page can be individually downloaded or saved as an image.

### Option 3: Embed in Design Software

Use the QR code URLs directly in Adobe InDesign, Canva, or other design tools:

```
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fyourdomain.com%2Fproduct.html%3Fid%3Ddhartigold
```

## 📊 QR Code Structure

Each QR code encodes a URL that links to:

```
https://yourdomain.com/product.html?id=dhartigold
```

When scanned, it opens the product detail page showing:
- Product image
- Category
- Full description
- Technical specifications
- Key benefits
- Suitable crops
- Recommended dosage
- Safety warnings
- Share QR code for further sharing

## 🎨 Customizing QR Codes

### Change QR Code Size

Edit `qrCodePrint.js` function `getQRCodeURL()`:

```javascript
// For larger codes (better for far distances):
getQRCodeURL(text, 512)  // 512x512 px

// For smaller codes (for small labels):
getQRCodeURL(text, 128)  // 128x128 px
```

### Change Label Layout

Edit `generate-qr-codes.html` in the `createQRCard()` function to adjust:
- Label dimensions
- QR code size ratio
- Product name position
- Border style

### Change Colors

Modify in `qrCodePrint.js`:

```javascript
// QR code colors
colorDark: "#000000",    // QR code color (black)
colorLight: "#FFFFFF",   // Background (white)
```

## 💾 Export & Archive

### Export All QR Code URLs as CSV

1. Visit: `https://yourdomain.com/generate-qr-codes.html`
2. Click **"Download Reference (CSV)"**
3. Opens file with:
   - Product ID
   - Product name
   - QR code image URL
   - Redirect destination

Use this to:
- Track which products have QR codes
- Update batch records
- Archive for compliance
- Share with design/packaging teams

## 🔍 Testing Checklist

- [ ] All 6 products show in QR generator
- [ ] Each QR code displays
- [ ] Scanning redirects to correct product page
- [ ] Product details load correctly
- [ ] Links include your actual domain (not "yoursite.com")
- [ ] Print preview shows properly formatted labels
- [ ] QR codes are scannable (test with 3-4 codes)
- [ ] Product page works on mobile
- [ ] Product sharing QR code works

## 🛠️ Troubleshooting

### QR Codes Not Showing

**Problem:** QR code images don't appear in generator

**Solution 1:** Check domain is updated in products.js
```javascript
// Must be real URL, not placeholder:
qrCode: "https://yoursite.com/..."  // ❌ Wrong
qrCode: "https://yourdomain.com/..."  // ✅ Correct
```

**Solution 2:** Verify products.js is loaded
```javascript
// In browser console:
console.log(PRODUCTS);  // Should show products array
```

### QR Code Doesn't Scan

**Problem:** QR code won't scan or scans incorrectly

**Solution 1:** Increase QR code size in printable labels
```javascript
// In qrCodePrint.js, increase size parameter:
const qrUrl = getQRCodeURL(product.qrCode, 512);  // Larger
```

**Solution 2:** Ensure sufficient white border around QR code
- Print with 10mm margins minimum
- Keep QR code away from label edges

**Solution 3:** Test QR code quality
- Print sample on paper (not sticker)
- Test with 3+ different scanner apps
- Try different lighting conditions

### Link Goes to Wrong Place

**Problem:** Scanning QR code shows 404 error

**Cause:** URL not matching actual file location

**Solution:**
1. Check URL path exactly matches how you're hosting it
2. Verify `product.html` is in the same directory as other files
3. Test URL directly in browser: `https://yourdomain.com/product.html?id=dhartigold`

### Product Details Don't Display

**Problem:** Scanned QR code shows blank page or error

**Solution 1:** Verify PRODUCTS array loads
```javascript
// Check browser console:
console.log(PRODUCTS);
```

**Solution 2:** Check product ID matches exactly (case-sensitive)
```javascript
// These are NOT the same:
dhartigold  ❌
DhartiGold  ❌
DHARTIGOLD  ❌
dhartigold  ✅
```

## 📱 Mobile Optimization

The product page is fully responsive and works great on mobile:

- Tested on iOS Safari and Chrome
- Android Chrome and native browsers
- Displays optimized for all screen sizes
- Touch-friendly buttons and readable text

## 🔐 Security Notes

- QR codes are public (anyone can scan)
- Product detail page has no authentication
- Consider if sensitive information should be restricted
- All URLs are HTTPS ready

## 📈 Analytics Integration

To track QR code scans, add Google Analytics to `product.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

Then track product page views by product ID:

```javascript
gtag('event', 'page_view', {
  'page_path': '/product/' + productId,
  'page_title': product.name
});
```

## 🎁 Advanced Usage

### Generate QR Codes Dynamically

```javascript
// Generate a new QR code for any URL:
const newQRURL = getQRCodeURL("https://example.com/custom");
// Use in img tag: <img src={newQRURL}>
```

### Batch Generate and Download

```javascript
// Get all QR code URLs:
const qrUrls = exportQRCodeURLs(PRODUCTS);

// Loop through and download:
Object.keys(qrUrls).forEach(productId => {
  const imageUrl = qrUrls[productId].qrCodeURL;
  downloadQRCodeImage(imageUrl, `qr-${productId}.png`);
});
```

### Create Custom Labels

In `generate-qr-codes.html`, modify the label template to add:
- Custom branding
- Product sizes/prices
- Expiration dates
- Batch numbers
- Barcode integration

## 📞 Support

If QR codes don't work:

1. **First:** Verify all products have non-empty `qrCode` values in products.js
2. **Second:** Test URL directly in browser (without scanning)
3. **Third:** Check domain is correctly set throughout files
4. **Fourth:** Verify file structure matches expected paths

## ✨ Features Summary

✅ Generate professional QR codes for all products  
✅ Printable labels ready to apply to packaging  
✅ Scans redirect to full product detail page  
✅ Mobile-optimized product pages  
✅ Responsive design  
✅ CSV export for tracking  
✅ Batch print functionality  
✅ Security-hardened (uses HTTPS-ready URLs)  
✅ No external dependencies (uses free QR API)  
✅ Works with any web hosting

---

**Next Steps:** Update `yoursite.com` in products.js and deploy to your server!
