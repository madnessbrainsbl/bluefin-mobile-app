import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Animated, ViewProps } from 'react-native'
// import FastImage from 'react-native-fast-image'
// import { Image } from 'expo-image';

interface Props extends ViewProps {
  delay: number
}

const Dot = ({ delay, ...rest }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current
  const [shouldAnimate, setShouldAnimate] = useState(true)

  const animateDots = useCallback(
    (reverse = false) => {
      if (!shouldAnimate) return

      Animated.timing(opacity, {
        toValue: reverse ? 0 : 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        animateDots(!reverse)
      })
    },
    [opacity, shouldAnimate]
  )

  useEffect(() => {
    const timer = setTimeout(() => animateDots(), delay)
    return () => {
      clearTimeout(timer)
      setShouldAnimate(false)
    }
  }, [animateDots, delay])

  return (
    <Animated.View style={{ opacity }}>
      <Box
        className="bg-primary-main w-4 h-4 mx-1.5 rounded-full overflow-hidden"  
        {...rest}
      />
    </Animated.View>
  )
}

const LoadingScreen = ({ ...rest }: Omit<Props, 'delay'>) => {
  return (
    <Box className='bg-background z-[9999]'>
      <Image
        source={require('../assets/images/splash.png')}
        className='w-full h-full object-contain'
        alt="splash"
      />

      <HStack className='absolute bottom-[30%] z-10 left-0 right-0 justify-center'>
        {Array.from({ length: 3 }, (_, i) => (
          <Dot key={i} delay={i * 200} {...rest} />
        ))}
      </HStack>
    </Box>
  )
}

export default LoadingScreen
