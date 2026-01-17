// Network utility functions
export const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch('/manifest.json', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const checkAPIConnectivity = async (baseUrl) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('API connectivity check failed:', error.message);
    return false;
  }
};

export const createFallbackImage = (name = 'Item', type = 'sweet') => {
  const emoji = type === 'sweet' ? '🍬' : '🏪';
  const encodedName = encodeURIComponent(name);

  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="bacKground:%23FFD700"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%23C41E3A" font-size="40" x="50%25" y="35%25" text-anchor="middle" dominant-baseline="middle"%3E${emoji}%3C/text%3E%3Ctext fill="%23C41E3A" font-size="16" font-weight="bold" x="50%25" y="60%25" text-anchor="middle" dominant-baseline="middle"%3E${encodedName}%3C/text%3E%3C/svg%3E`;
};

export const handleImageError = (element, fallbackName, fallbackType = 'sweet') => {
  element.src = createFallbackImage(fallbackName, fallbackType);
  element.style.bacKground = '#FFD700';
};