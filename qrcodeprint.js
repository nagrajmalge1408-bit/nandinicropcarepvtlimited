// QR Code Generator for Printing
// Uses QRCode.js library to generate printable QR codes

/**
 * Generate QR Code using QRCode.js library
 * @param {string} text - URL or text to encode
 * @param {number} size - Size of QR code (128, 256, 512, etc.)
 * @returns {string} - Base64 encoded PNG image
 */
function generateQRCodeImage(text, size = 256) {
  return new Promise((resolve, reject) => {
    try {
      // Create temporary container
      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);
      
      // Generate QR code
      new QRCode(container, {
        text: text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.H
      });
      
      // Convert to image after a short delay
      setTimeout(() => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          document.body.removeChild(container);
          resolve(dataUrl);
        } else {
          reject('Failed to generate QR code');
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Download QR code as PNG file
 * @param {string} qrCodeDataUrl - Base64 encoded QR code image
 * @param {string} filename - Name for the downloaded file
 */
function downloadQRCodeImage(qrCodeDataUrl, filename) {
  const link = document.createElement('a');
  link.href = qrCodeDataUrl;
  link.download = filename || 'qrcode.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate QR Code URL using QR Server API (no library needed)
 * @param {string} text - Text or URL to encode
 * @param {number} size - Size of QR code (default: 256)
 * @returns {string} - Direct URL to QR code image
 */
function getQRCodeURL(text, size = 256) {
  if (!text) return null;
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=png`;
}

/**
 * Create a printable QR code label with product info
 * @param {object} product - Product object from PRODUCTS array
 * @returns {HTMLElement} - Label element ready for printing
 */
function createPrintableQRLabel(product) {
  const label = document.createElement('div');
  label.className = 'qr-label';
  label.style.cssText = `
    width: 200px;
    height: 200px;
    page-break-inside: avoid;
    border: 2px solid #333;
    padding: 10px;
    text-align: center;
    font-family: Arial, sans-serif;
    background: white;
    display: inline-block;
    margin: 5px;
    break-inside: avoid;
  `;
  
  const qrCodeURL = getQRCodeURL(product.qrCode, 256);
  
  const qrImg = document.createElement('img');
  qrImg.src = qrCodeURL;
  qrImg.style.cssText = `
    width: 150px;
    height: 150px;
    margin-bottom: 5px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  `;
  
  const productName = document.createElement('div');
  productName.textContent = product.name || 'Product';
  productName.style.cssText = `
    font-size: 10px;
    font-weight: bold;
    margin-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
  
  label.appendChild(qrImg);
  label.appendChild(productName);
  
  return label;
}

/**
 * Create a batch of printable QR code labels for all products
 * @param {array} products - Array of product objects
 * @returns {HTMLElement} - Container with all labels
 */
function createBatchPrintableLabels(products) {
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 20px;
    background: white;
  `;
  
  products.forEach(product => {
    if (product.id && product.qrCode) {
      const label = createPrintableQRLabel(product);
      container.appendChild(label);
    }
  });
  
  return container;
}

/**
 * Open print preview with all QR codes
 * @param {array} products - Array of product objects
 */
function printAllQRCodes(products) {
  const printWindow = window.open('', '', 'height=600,width=800');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Product QR Codes - Print</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 10px;
          background: white;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 24px;
        }
        .qr-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .qr-label {
          width: 200px;
          height: 220px;
          border: 2px solid #333;
          padding: 10px;
          text-align: center;
          page-break-inside: avoid;
          break-inside: avoid;
          background: white;
        }
        .qr-label img {
          width: 150px;
          height: 150px;
          margin-bottom: 5px;
        }
        .qr-label .name {
          font-size: 11px;
          font-weight: bold;
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media print {
          body {
            margin: 0;
          }
          .qr-container {
            gap: 5px;
          }
        }
      </style>
    </head>
    <body>
      <h1>Product QR Codes</h1>
      <div class="qr-container">
  `;
  
  products.forEach(product => {
    if (product.id && product.qrCode) {
      const qrUrl = getQRCodeURL(product.qrCode, 256);
      html += `
        <div class="qr-label">
          <img src="${qrUrl}" alt="QR Code">
          <div class="name">${product.name || 'Product'}</div>
        </div>
      `;
    }
  });
  
  html += `
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Open print dialog after content loads
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

/**
 * Export QR codes as individual files (download all as zip would require a library)
 * This creates downloadable URLs for each QR code
 * @param {array} products - Array of product objects
 */
function exportQRCodeURLs(products) {
  const urls = {};
  
  products.forEach(product => {
    if (product.id && product.qrCode) {
      urls[product.id] = {
        name: product.name,
        qrCodeURL: getQRCodeURL(product.qrCode, 256),
        redirectsTo: product.qrCode
      };
    }
  });
  
  return urls;
}

/**
 * Generate a CSV file with QR code URLs (for reference)
 * @param {array} products - Array of product objects
 * @returns {string} - CSV content
 */
function generateQRCodeCSV(products) {
  let csv = 'Product ID,Product Name,QR Code URL,Redirects To\n';
  
  products.forEach(product => {
    if (product.id && product.qrCode) {
      const qrUrl = getQRCodeURL(product.qrCode, 256);
      csv += `"${product.id}","${product.name}","${qrUrl}","${product.qrCode}"\n`;
    }
  });
  
  return csv;
}

/**
 * Download CSV with QR code references
 * @param {array} products - Array of product objects
 */
function downloadQRCodeCSV(products) {
  const csv = generateQRCodeCSV(products);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qr-codes-reference.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateQRCodeImage,
    downloadQRCodeImage,
    getQRCodeURL,
    createPrintableQRLabel,
    createBatchPrintableLabels,
    printAllQRCodes,
    exportQRCodeURLs,
    generateQRCodeCSV,
    downloadQRCodeCSV
  };
}
