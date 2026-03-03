import { useState, useEffect } from 'react';
import { Image } from 'react-native';

export default function AutoHeightImage({ uri, style }) {
  const [paintedWidth, setPaintedWidth] = useState(0);
  const [resultHeight, setResultHeight] = useState(0);

  useEffect(() => {
    let stillMounted = true;
    Image.getSize(uri, (realW, realH) => {
      if (!paintedWidth || !stillMounted) return;
      const shrinkRatio = realW / paintedWidth;
      setResultHeight(realH / shrinkRatio);
    });
    return () => (stillMounted = false);
  }, [paintedWidth]);

  return (
    <Image
      style={[{ width: '100%' }, style, { height: resultHeight }]}
      source={{ uri }}
      onLayout={(event) => setPaintedWidth(event.nativeEvent.layout.width)}
    />
  );
}