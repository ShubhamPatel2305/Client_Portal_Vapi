import React from 'react';
import { useSpring, animated } from 'react-spring';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  formatter?: (value: number) => string;
}

export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  duration = 1000,
  delay = 0,
  formatter = (val) => val.toLocaleString(),
}: AnimatedNumberProps) {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    delay,
    config: { duration },
  });

  return (
    <span className="text-2xl font-bold">
      {prefix}
      <animated.span>
        {number.to((val) => formatter(val))}
      </animated.span>
      {suffix}
    </span>
  );
}