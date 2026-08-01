'use client';

import { useEffect, useRef, useCallback } from 'react';

type SoundType = 'click' | 'success' | 'error';

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function createWavBlob(frequency: number, duration: number, wave: 'sine' | 'square' = 'sine') {
  const sampleRate = 8000;
  const numSamples = Math.floor(sampleRate * duration);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = Math.sin(2 * Math.PI * frequency * t) * 0.5;
    if (wave === 'square') sample = sample > 0 ? 0.5 : -0.5;
    view.setInt16(44 + i * 2, Math.floor(sample * 32767), true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export function useSound(enabled: boolean) {
  const sounds = useRef<Record<SoundType, any> | null>(null);

  useEffect(() => {
    let mounted = true;
    import('howler').then(({ Howl }) => {
      if (!mounted) return;
      const urls: Record<SoundType, string> = {
        click: URL.createObjectURL(createWavBlob(800, 0.05)),
        success: URL.createObjectURL(createWavBlob(1200, 0.12)),
        error: URL.createObjectURL(createWavBlob(220, 0.18, 'square')),
      };
      sounds.current = {
        click: new Howl({ src: [urls.click], format: ['wav'], volume: 0.4 }),
        success: new Howl({ src: [urls.success], format: ['wav'], volume: 0.6 }),
        error: new Howl({ src: [urls.error], format: ['wav'], volume: 0.5 }),
      };
      return () => {
        Object.values(urls).forEach((u) => URL.revokeObjectURL(u));
      };
    });
    return () => { mounted = false; };
  }, []);

  return useCallback(
    (type: SoundType) => {
      if (!enabled || !sounds.current) return;
      sounds.current[type]?.play();
    },
    [enabled]
  );
}
