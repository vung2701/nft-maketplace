import React, { useState, useEffect } from 'react';
import { Image } from 'antd';
import { getIPFSFallbacks } from '../config/moralis';

interface IPFSImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  fallback?: string;
  preview?: boolean;
}

export const IPFSImage: React.FC<IPFSImageProps> = ({ 
  src, 
  alt, 
  style, 
  fallback = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN",
  preview = true
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fallbackUrls = React.useMemo(() => getIPFSFallbacks(src), [src]);

  useEffect(() => {
    setFallbackIndex(0);
    setHasError(false);
    setIsLoading(true);
    
    if (fallbackUrls.length > 0) {
      setCurrentSrc(fallbackUrls[0]);
    }
  }, [src]);

  const handleError = () => {
    console.log(`❌ Failed to load image from: ${currentSrc}`);
    
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < fallbackUrls.length) {
      console.log(`🔄 Trying fallback ${nextIndex}: ${fallbackUrls[nextIndex]}`);
      setFallbackIndex(nextIndex);
      setCurrentSrc(fallbackUrls[nextIndex]);
    } else {
      console.log('❌ All IPFS gateways failed, using fallback image');
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    console.log(`✅ Successfully loaded image from: ${currentSrc}`);
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <Image
        src={fallback}
        alt={alt}
        style={style}
        preview={preview}
        onError={() => console.log('❌ Even fallback image failed')}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      style={style}
      preview={preview}
      onError={handleError}
      onLoad={handleLoad}
      placeholder={isLoading}
    />
  );
}; 