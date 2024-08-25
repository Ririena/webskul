'use client'
import { useEffect, useState } from 'react';
import { useSwiper } from 'swiper/react';

/**
 * Hook to get the swiper instance in a reactive way.
 * This is useful when you need to get the active index of the swiper on every slide change.
 * @returns {Swiper} swiper
 */
export const useSwiperReactive = () => {
  const swiper = useSwiper();

  // State to force a rerender.
  const [, setSignal] = useState({});
  const forceRerender = () => setSignal({});

  useEffect(() => {
    if (swiper) {
      swiper.on('slideChange', forceRerender);
    }
    return () => {
      if (swiper) {
        swiper.off('slideChange', forceRerender);
      }
    };
  }, [swiper]);

  return swiper;
};
