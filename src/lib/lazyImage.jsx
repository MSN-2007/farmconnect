import React, { useState, useEffect, useRef } from 'react';
import { cn } from './utils';

/**
 * LazyImage Component
 * Automatically lazy loads images when they enter the viewport
 * Shows a blur placeholder while loading
 */
export const LazyImage = ({
    src,
    alt,
    className,
    placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(placeholderSrc);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        let observer;

        if (imageRef.current && 'IntersectionObserver' in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Load the actual image
                            const img = new Image();
                            img.src = src;
                            img.onload = () => {
                                setImageSrc(src);
                                setImageLoaded(true);
                            };

                            // Stop observing once loaded
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px', // Start loading 50px before entering viewport
                    threshold: 0.01
                }
            );

            observer.observe(imageRef.current);
        } else {
            // Fallback for browsers without IntersectionObserver
            setImageSrc(src);
            setImageLoaded(true);
        }

        return () => {
            if (observer && imageRef.current) {
                observer.unobserve(imageRef.current);
            }
        };
    }, [src]);

    return (
        <img
            ref={imageRef}
            src={imageSrc}
            alt={alt}
            className={cn(
                'transition-opacity duration-300',
                imageLoaded ? 'opacity-100' : 'opacity-50',
                className
            )}
            loading="lazy"
            {...props}
        />
    );
};

/**
 * useImagePreloader Hook
 * Preload critical images on component mount
 */
export const useImagePreloader = (imageUrls) => {
    useEffect(() => {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }, [imageUrls]);
};
