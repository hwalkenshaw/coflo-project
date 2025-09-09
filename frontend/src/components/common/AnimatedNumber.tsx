import { useEffect, useState } from 'react'
import { animate, useMotionValue } from 'framer-motion'

export default function AnimatedNumber({ value, fractionDigits = 0 }: { value: number; fractionDigits?: number }) {
  const mv = useMotionValue(0)
  const [displayValue, setDisplayValue] = useState('0')
  
  useEffect(() => {
    const unsubscribe = mv.on('change', (latest) => {
      setDisplayValue(Number(latest).toFixed(fractionDigits))
    })
    
    const controls = animate(mv, value, { duration: 0.6 })
    
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value, mv, fractionDigits])
  
  return <span>{displayValue}</span>
}

