// QR Code utilities for GIFTY Card
export function generateGiftCardQR(tokenId: string): string {
  // In production, this would use a proper QR code library
  // For now, return SVG-based QR code pattern
  const qrData = `GIFTY:${tokenId}`;
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="white"/>
      <!-- QR Code pattern simulation -->
      <rect x="20" y="20" width="20" height="20" fill="black"/>
      <rect x="20" y="60" width="20" height="20" fill="black"/>
      <rect x="20" y="100" width="20" height="20" fill="black"/>
      <rect x="60" y="20" width="20" height="20" fill="black"/>
      <rect x="60" y="100" width="20" height="20" fill="black"/>
      <rect x="100" y="20" width="20" height="20" fill="black"/>
      <rect x="100" y="60" width="20" height="20" fill="black"/>
      <rect x="140" y="20" width="20" height="20" fill="black"/>
      <rect x="140" y="60" width="20" height="20" fill="black"/>
      <rect x="140" y="100" width="20" height="20" fill="black"/>
      <rect x="180" y="20" width="20" height="20" fill="black"/>
      <rect x="180" y="60" width="20" height="20" fill="black"/>
      <!-- Corner squares -->
      <rect x="10" y="10" width="40" height="40" fill="none" stroke="black" stroke-width="2"/>
      <rect x="150" y="10" width="40" height="40" fill="none" stroke="black" stroke-width="2"/>
      <rect x="10" y="150" width="40" height="40" fill="none" stroke="black" stroke-width="2"/>
      <text x="100" y="105" text-anchor="middle" font-family="monospace" font-size="6" fill="black">${tokenId.substring(0, 16)}</text>
    </svg>
  `)}`;
}

export function parseGiftCardQR(qrData: string): { tokenId: string } | null {
  try {
    if (qrData.startsWith('GIFTY:')) {
      const tokenId = qrData.replace('GIFTY:', '');
      return { tokenId };
    }
    return null;
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
}

export function downloadQRCode(qrDataUrl: string, filename: string = 'gift-card-qr.svg'): void {
  const link = document.createElement('a');
  link.href = qrDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
