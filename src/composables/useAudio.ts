let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  return audioCtx
}

export function useAudio() {
  const playBeep = (freq = 880, type: OscillatorType = 'sine', duration = 0.08) => {
    try {
      const ctx = getCtx()
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.035, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Ignore audio autoplay blocks
    }
  }

  const playSuccess = () => {
    playBeep(523.25, 'triangle', 0.08)
    setTimeout(() => playBeep(659.25, 'triangle', 0.08), 80)
    setTimeout(() => playBeep(783.99, 'triangle', 0.14), 160)
  }

  const playBootChime = () => {
    const notes = [587.33, 739.99, 880.0, 1174.66]
    notes.forEach((freq, idx) => {
      setTimeout(() => playBeep(freq, 'sine', 0.22), idx * 55)
    })
  }

  return { playBeep, playSuccess, playBootChime }
}
