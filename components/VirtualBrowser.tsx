'use client';

import { useState } from 'react';
import { Globe, Lock, Unlock, Search, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Level } from '@/lib/levelData';
import { useGameStore } from '@/lib/store';
import TrophyCelebration from './TrophyCelebration';

type WebType = 'sqli-login' | 'idor-profile' | 'cookie-editor' | 'jwt-editor' | 'command-injection' | 'xss-comment';

function isSqliPayload(input: string) {
  const s = input.toUpperCase().replace(/\s+/g, ' ');
  return s.includes("' OR '1'='1") || s.includes('OR 1=1') || s.includes('1=1');
}

export default function VirtualBrowser({ level }: { level: Level }) {
  const submitFlag = useGameStore((s) => s.submitFlag);
  const isCompleted = useGameStore((s) => s.isCompleted);
  const web = level.webComponent!;

  const [status, setStatus] = useState<string>('idle');
  const [showTrophy, setShowTrophy] = useState(false);

  const setSuccess = async () => {
    setStatus('correct');
    await submitFlag(level.id, level.flag);
    setShowTrophy(true);
    setTimeout(() => setShowTrophy(false), 3000);
  };

  const renderWebComponent = () => {
    const type = web.type as WebType;
    switch (type) {
      case 'sqli-login':
        return <SqliLogin data={web.data} onSuccess={setSuccess} />;
      case 'idor-profile':
        return <IdorProfile data={web.data} onSuccess={setSuccess} />;
      case 'cookie-editor':
        return <CookieEditor data={web.data} onSuccess={setSuccess} />;
      case 'jwt-editor':
        return <JwtEditor data={web.data} onSuccess={setSuccess} />;
      case 'command-injection':
        return <CommandInjection data={web.data} onSuccess={setSuccess} />;
      case 'xss-comment':
        return <XssComment data={web.data} onSuccess={setSuccess} />;
      default:
        return <div className="p-4 text-slate-400">Unknown web scenario.</div>;
    }
  };

  return (
    <div className="flex h-full flex-col rounded border border-hack-green/20 bg-hack-bg">
      <div className="flex items-center gap-2 border-b border-hack-green/20 bg-hack-panel/50 px-3 py-2">
        <Globe className="h-4 w-4 text-hack-green" />
        <div className="flex flex-1 items-center rounded bg-hack-bg px-3 py-1 font-mono text-xs text-slate-400">
          <span className="text-hack-green">http(s)://</span>
          <span className="ml-1 text-slate-200">{web.data.url?.replace(/^https?:\/\//, '') || 'target'}</span>
        </div>
        <div className="text-slate-500">
          {isCompleted(level.id) ? <Unlock className="h-4 w-4 text-hack-green" /> : <Lock className="h-4 w-4" />}
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto p-4">
        {renderWebComponent()}
        {status === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded border border-hack-green/30 bg-hack-green/10 p-3 text-center font-mono text-sm text-hack-green"
          >
            Access granted. Flag: {level.flag}
          </motion.div>
        )}
        <TrophyCelebration show={showTrophy} flag={level.flag} />
      </div>
    </div>
  );
}

function SqliLogin({ data, onSuccess }: { data: any; onSuccess: () => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');

  const submit = () => {
    if (isSqliPayload(user) || isSqliPayload(pass)) {
      setMsg('Welcome, admin');
      onSuccess();
    } else {
      setMsg('Invalid username or password.');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded border border-hack-green/20 bg-hack-panel/40 p-6">
      <h3 className="text-center font-mono text-hack-green">Target Login</h3>
      <input
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Username"
        className="w-full rounded border border-hack-green/20 bg-hack-bg px-3 py-2 font-mono text-sm text-slate-200 outline-none focus:border-hack-green"
      />
      <input
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Password"
        type="password"
        className="w-full rounded border border-hack-green/20 bg-hack-bg px-3 py-2 font-mono text-sm text-slate-200 outline-none focus:border-hack-green"
      />
      <button
        onClick={submit}
        className="w-full rounded bg-hack-green/20 py-2 font-mono text-sm font-bold text-hack-green hover:bg-hack-green/30"
      >
        LOGIN
      </button>
      {msg && <p className="text-center font-mono text-xs text-slate-400">{msg}</p>}
    </div>
  );
}

function IdorProfile({ data, onSuccess }: { data: any; onSuccess: () => void }) {
  const [id, setId] = useState(data.currentId || '102');
  const [profile, setProfile] = useState({ name: 'Noob User', role: 'standard', email: 'noob@target' });

  const update = () => {
    if (id === data.targetId) {
      setProfile({ name: 'Administrator', role: 'admin', email: 'admin@target' });
      onSuccess();
    } else {
      setProfile({ name: 'Noob User', role: 'standard', email: 'noob@target' });
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded border border-hack-green/20 bg-hack-panel/40 p-6">
      <h3 className="font-mono text-hack-green">User Profile</h3>
      <div className="flex gap-2 font-mono text-xs">
        <span className="text-slate-400">id=</span>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="flex-1 rounded border border-hack-green/20 bg-hack-bg px-2 py-1 text-slate-200 outline-none focus:border-hack-green"
        />
        <button onClick={update} className="rounded bg-hack-green/20 px-3 py-1 text-hack-green hover:bg-hack-green/30">
          <Search className="h-3 w-3" />
        </button>
      </div>
      <div className="rounded border border-hack-green/10 bg-hack-bg p-3 font-mono text-xs text-slate-300">
        <p>
          <span className="text-hack-amber">Name:</span> {profile.name}
        </p>
        <p>
          <span className="text-hack-amber">Role:</span> {profile.role}
        </p>
        <p>
          <span className="text-hack-amber">Email:</span> {profile.email}
        </p>
      </div>
    </div>
  );
}

function CookieEditor({ data, onSuccess }: { data: any; onSuccess: () => void }) {
  const [cookies, setCookies] = useState(data.cookies || [{ name: 'role', value: 'dXNlcg==' }]);
  const [msg, setMsg] = useState('');

  const update = (idx: number, value: string) => {
    const next = [...cookies];
    next[idx].value = value;
    setCookies(next);
  };

  const apply = () => {
    try {
      const decoded = atob(cookies[0].value);
      setMsg(`Decoded: ${decoded}`);
      if (decoded.toLowerCase() === 'admin' || decoded.toLowerCase().includes('admin')) {
        onSuccess();
      } else {
        setMsg((m) => `${m}\nAccess denied. Current role is not admin.`);
      }
    } catch {
      setMsg('Invalid base64 cookie value.');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded border border-hack-green/20 bg-hack-panel/40 p-6">
      <h3 className="font-mono text-hack-green">Cookie Inspector</h3>
      {cookies.map((c: any, i: number) => (
        <div key={i} className="space-y-1">
          <div className="font-mono text-xs text-slate-400">{c.name}</div>
          <input
            value={c.value}
            onChange={(e) => update(i, e.target.value)}
            className="w-full rounded border border-hack-green/20 bg-hack-bg px-3 py-2 font-mono text-sm text-slate-200 outline-none focus:border-hack-green"
          />
        </div>
      ))}
      <button onClick={apply} className="w-full rounded bg-hack-green/20 py-2 font-mono text-sm font-bold text-hack-green hover:bg-hack-green/30">
        APPLY COOKIE
      </button>
      {msg && <pre className="whitespace-pre-wrap font-mono text-xs text-slate-400">{msg}</pre>}
    </div>
  );
}

function JwtEditor({ data, onSuccess }: { data: any; onSuccess: () => void }) {
  const [header, setHeader] = useState(data.header || '{"alg":"HS256"}');
  const [payload, setPayload] = useState(data.payload || '{"admin":false,"user":"hacker"}');
  const [msg, setMsg] = useState('');

  const forge = () => {
    try {
      const h = JSON.parse(header);
      const p = JSON.parse(payload);
      if (h.alg === 'none' && p.admin === true) {
        setMsg('Token accepted. Admin access granted.');
        onSuccess();
      } else {
        setMsg('Invalid token. Try setting alg to "none" and admin to true.');
      }
    } catch {
      setMsg('Invalid JSON in header or payload.');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded border border-hack-green/20 bg-hack-panel/40 p-6">
      <h3 className="font-mono text-hack-green">JWT Forger</h3>
      <div>
        <label className="font-mono text-xs text-slate-400">Header</label>
        <textarea
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          className="h-20 w-full rounded border border-hack-green/20 bg-hack-bg p-2 font-mono text-xs text-slate-200 outline-none focus:border-hack-green"
        />
      </div>
      <div>
        <label className="font-mono text-xs text-slate-400">Payload</label>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          className="h-28 w-full rounded border border-hack-green/20 bg-hack-bg p-2 font-mono text-xs text-slate-200 outline-none focus:border-hack-green"
        />
      </div>
      <button onClick={forge} className="w-full rounded bg-hack-green/20 py-2 font-mono text-sm font-bold text-hack-green hover:bg-hack-green/30">
        FORGE TOKEN
      </button>
      {msg && <p className="font-mono text-xs text-slate-400">{msg}</p>}
    </div>
  );
}

function CommandInjection({ data, onSuccess }: { data: any; onSuccess: () => void }) {
  const [input, setInput] = useState('');
  const [out, setOut] = useState('');

  const ping = () => {
    if (input.includes(';') && input.includes('cat /etc/passwd')) {
      setOut(
        'PING 8.8.8.8 (8.8.8.8): 56 data bytes\n64 bytes from 8.8.8.8: icmp_seq=0 ttl=117 time=12.3 ms\n\nroot:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\n\nFlag exposed.'
      );
      onSuccess();
    } else if (input.includes(';')) {
      setOut('PING failed. Command chain rejected.');
    } else {
      setOut(`PING ${input || '127.0.0.1'}: 56 data bytes\n64 bytes from target: icmp_seq=0 ttl=64`);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded border border-hack-green/20 bg-hack-panel/40 p-6">
      <div className="flex items-center gap-2 text-hack-amber">
        <AlertTriangle className="h-4 w-4" />
        <h3 className="font-mono text-sm">Network Diagnostics</h3>
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="IP address"
        className="w-full rounded border border-hack-green/20 bg-hack-bg px-3 py-2 font-mono text-sm text-slate-200 outline-none focus:border-hack-green"
      />
      <button onClick={ping} className="w-full rounded bg-hack-green/20 py-2 font-mono text-sm font-bold text-hack-green hover:bg-hack-green/30">
        PING
      </button>
      {out && <pre className="whitespace-pre-wrap rounded bg-hack-bg p-3 font-mono text-xs text-slate-300">{out}</pre>}
    </div>
  );
}

function XssComment({ data, onSuccess }: { data: any; onSuccess: () => void }) {
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const post = () => {
    setComments([...comments, input]);
    if (input.toLowerCase().includes('<script') && input.includes('document.cookie')) {
      onSuccess();
    }
    setInput('');
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded border border-hack-green/20 bg-hack-panel/40 p-6">
      <h3 className="font-mono text-hack-green">Comment Stream</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Leave a comment..."
        className="h-24 w-full rounded border border-hack-green/20 bg-hack-bg p-2 font-mono text-xs text-slate-200 outline-none focus:border-hack-green"
      />
      <button onClick={post} className="w-full rounded bg-hack-green/20 py-2 font-mono text-sm font-bold text-hack-green hover:bg-hack-green/30">
        POST COMMENT
      </button>
      <div className="space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="rounded border border-hack-green/10 bg-hack-bg p-2 font-mono text-xs text-slate-300">
            <div dangerouslySetInnerHTML={{ __html: c }} />
          </div>
        ))}
      </div>
    </div>
  );
}
