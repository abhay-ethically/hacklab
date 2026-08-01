'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function FeedbackPage() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    if (!message.trim()) return;

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send feedback');
      setStatus('success');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrorText(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 font-mono text-2xl font-bold text-hack-green">Feedback</h1>
      <p className="mb-6 font-mono text-sm text-slate-400">
        Found a bug, have a suggestion, or want a feature? Let us know.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded border border-hack-green/20 bg-hack-panel/40 p-4">
        <div>
          <label className="mb-2 block font-mono text-xs text-slate-500">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full rounded border border-hack-green/20 bg-hack-bg p-3 font-mono text-sm text-slate-200 outline-none focus:border-hack-green"
            placeholder="Describe your feedback..."
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded border border-hack-green/30 px-4 py-2 font-mono text-sm text-hack-green hover:bg-hack-green/10"
        >
          <Send className="h-4 w-4" />
          Submit Feedback
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4 flex items-center gap-2 rounded border border-hack-green/20 bg-hack-green/5 p-3 font-mono text-xs text-hack-green">
          <CheckCircle className="h-4 w-4" />
          Thanks for the feedback!
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 flex items-center gap-2 rounded border border-hack-red/20 bg-hack-red/5 p-3 font-mono text-xs text-hack-red">
          <AlertCircle className="h-4 w-4" />
          {errorText}
        </div>
      )}
    </div>
  );
}
