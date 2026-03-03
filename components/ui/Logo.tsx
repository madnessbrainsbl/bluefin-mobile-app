import React from 'react'
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/helpers';

const logoImages = {
    "light": require('@/assets/images/logo-light.png'),
    "dark": require('@/assets/images/logo-light.png'),
    "gold": require('@/assets/images/logo-gold.png'),
}

const Logo = ({
  variant = 'dark',
  className
}: {
  variant?: 'light' | 'dark' | 'gold',
  className?: string
}) => {
  return (
    <Image
      className={cn(className)}
      source={logoImages[variant]}
      size='none'
      resizeMode='contain'
      // contentFit='contain'
      alt="logo"
    />
  )
}

export default Logo
