const isBrowser = typeof window !== 'undefined'
let audioContext

const getAudioContext = () => {
  if (!isBrowser) return null
  if (audioContext && audioContext.state === 'closed') {
    audioContext = null
  }

  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    audioContext = new AudioContext()
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }

  return audioContext
}

const playTone = ({ frequency, duration, volume, type }) => {
  const context = getAudioContext()
  if (!context) return

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, context.currentTime)
  gainNode.gain.setValueAtTime(Math.max(volume, 0.0001), context.currentTime)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  const now = context.currentTime
  const stopAt = now + duration

  gainNode.gain.setValueAtTime(volume, now)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, stopAt)

  oscillator.start(now)
  oscillator.stop(stopAt + 0.05)

  oscillator.onended = () => {
    oscillator.disconnect()
    gainNode.disconnect()
  }
}

export const prewarmAudioContext = () => {
  const context = getAudioContext()
  if (!context) return

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  gainNode.gain.value = 0

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  const now = context.currentTime
  oscillator.start(now)
  oscillator.stop(now + 0.01)

  oscillator.onended = () => {
    oscillator.disconnect()
    gainNode.disconnect()
  }
}

export const playIncomingMessageTone = () => {
  playTone({ frequency: 660, duration: 0.22, volume: 0.08, type: 'triangle' })
  setTimeout(() => {
    playTone({ frequency: 990, duration: 0.18, volume: 0.06, type: 'triangle' })
  }, 120)
}

export const playOutgoingMessageTone = () => {
  playTone({ frequency: 440, duration: 0.15, volume: 0.06, type: 'sine' })
}

export const playErrorTone = () => {
  playTone({ frequency: 220, duration: 0.3, volume: 0.09, type: 'sawtooth' })
}

export default getAudioContext
