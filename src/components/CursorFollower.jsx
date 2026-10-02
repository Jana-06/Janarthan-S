import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Eye } from 'lucide-react'

export default function CursorFollower() {
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const x = useSpring(pointerX, { stiffness: 420, damping: 34, mass: 0.35 })
  const y = useSpring(pointerY, { stiffness: 420, damping: 34, mass: 0.35 })

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!media.matches) return undefined

    document.documentElement.classList.add('has-cursor-follower')

    const onMove = (event) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
      setVisible(true)
    }
    const onOver = (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-cursor-label]') : null
      setLabel(target?.getAttribute('data-cursor-label') ?? '')
    }
    const onLeave = () => {
      setLabel('')
      setVisible(false)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-cursor-follower')
    }
  }, [pointerX, pointerY])

  const expanded = Boolean(label)

  return (
    <motion.div
      className={`cursor-follower${expanded ? ' is-expanded' : ''}`}
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0, scale: expanded ? 1 : visible ? 0.78 : 0.45 }}
      transition={{ opacity: { duration: 0.16 }, scale: { type: 'spring', stiffness: 420, damping: 28 } }}
      aria-hidden="true"
    >
      <span className="cursor-follower__core">
        {expanded ? <><Eye size={15} strokeWidth={2} /><span>{label}</span><ArrowUpRight size={13} strokeWidth={2} /></> : <i />}
      </span>
    </motion.div>
  )
}
