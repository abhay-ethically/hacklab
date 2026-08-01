'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store';
import { useSound } from '@/lib/audio';
import { createVFS } from '@/lib/vfs';
import { runCommand, CommandContext } from '@/lib/commandRunner';
import { autocomplete } from '@/lib/autocomplete';
import { getLevel, Level } from '@/lib/levelData';

export default function Terminal({ levelId }: { levelId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termObjRef = useRef<any>(null);
  const fitRef = useRef<any>(null);
  const vfsRef = useRef(createVFS());
  const inputRef = useRef('');
  const historyIndexRef = useRef(0);
  const modeRef = useRef<'normal' | 'ftp'>('normal');
  const ftpRef = useRef({ step: 'idle', user: '', pass: '', ip: '' });
  const levelRef = useRef<Level | undefined>(getLevel(levelId));

  const submitFlag = useGameStore((s) => s.submitFlag);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const play = useSound(soundEnabled);

  useEffect(() => {
    levelRef.current = getLevel(levelId);
    vfsRef.current = createVFS();
    historyIndexRef.current = vfsRef.current.history.length;
    modeRef.current = 'normal';
    ftpRef.current = { step: 'idle', user: '', pass: '', ip: '' };
    inputRef.current = '';

    let mounted = true;
    let cleanup = () => {};

    (async () => {
      if (!containerRef.current) return;
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import('@xterm/xterm'),
        import('@xterm/addon-fit'),
      ]);
      if (!mounted) return;

      const term = new Terminal({
        theme: {
          background: '#0f131c',
          foreground: '#00ff66',
          cursor: '#00ff66',
          selectionBackground: '#163f2a',
        },
        fontFamily: 'var(--font-mono), ui-monospace, Menlo, monospace',
        fontSize: 14,
        cursorStyle: 'block',
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(containerRef.current);
      term.options.ignoreBracketedPasteMode = true;
      fit.fit();

      termObjRef.current = term;
      fitRef.current = fit;

      term.write('\x1b[1;32mWelcome to HackLab v1.0\x1b[0m — type `help` for commands.\r\n');
      prompt();

      const onData = (data: string) => {
        if (data === '\r' || data === '\n') {
          term.write('\r\n');
          execute(inputRef.current);
          inputRef.current = '';
          historyIndexRef.current = vfsRef.current.history.length;
        } else if (data === '\x7f') {
          if (inputRef.current.length > 0) {
            inputRef.current = inputRef.current.slice(0, -1);
            term.write('\b \b');
          }
        } else if (data === '\t') {
          const ac = autocomplete(inputRef.current, vfsRef.current);
          if (ac.newInput !== undefined) {
            inputRef.current = ac.newInput;
            refreshInput();
          }
          if (ac.output) {
            term.write('\r\n' + ac.output);
            prompt();
            term.write(inputRef.current);
          }
        } else if (data === '\x1b[A') {
          if (modeRef.current === 'normal' && historyIndexRef.current > 0) {
            historyIndexRef.current -= 1;
            inputRef.current = vfsRef.current.history[historyIndexRef.current] || '';
            refreshInput();
          }
        } else if (data === '\x1b[B') {
          if (modeRef.current === 'normal') {
            if (historyIndexRef.current < vfsRef.current.history.length) {
              historyIndexRef.current += 1;
              inputRef.current =
                historyIndexRef.current < vfsRef.current.history.length
                  ? vfsRef.current.history[historyIndexRef.current]
                  : '';
              refreshInput();
            }
          }
        } else if (data === '\x03') {
          // Ctrl+C
          if (modeRef.current === 'ftp') {
            term.write('^C');
            modeRef.current = 'normal';
            inputRef.current = '';
            prompt();
          } else {
            inputRef.current = '';
            term.write('^C');
            prompt();
          }
        } else if (data === '\x0c') {
          // Ctrl+L
          term.clear();
          prompt();
          term.write(inputRef.current);
        } else if (data >= ' ') {
          inputRef.current += data;
          term.write(data);
          play('click');
        }
      };

      const { dispose } = term.onData(onData);

      const onResize = () => fit.fit();
      window.addEventListener('resize', onResize);

      cleanup = () => {
        dispose?.();
        window.removeEventListener('resize', onResize);
      };
    })();

    return () => {
      mounted = false;
      cleanup();
      if (termObjRef.current) {
        termObjRef.current.dispose();
        termObjRef.current = null;
      }
      if (fitRef.current) {
        fitRef.current.dispose?.();
        fitRef.current = null;
      }
    };
  }, [levelId]);

  const promptText = () => `user@hacklab:${vfsRef.current.cwd}$ `;

  const prompt = () => {
    if (!termObjRef.current) return;
    termObjRef.current.write(`\r\n${promptText()}`);
  };

  const ftpPrompt = (text: string) => {
    if (!termObjRef.current) return;
    termObjRef.current.write(`\r\n${text}`);
  };

  const refreshInput = () => {
    if (!termObjRef.current) return;
    termObjRef.current.write(`\r\x1b[2K${promptText()}${inputRef.current}`);
  };

  const execute = async (line: string) => {
    const term = termObjRef.current;
    if (!term) return;

    if (modeRef.current === 'ftp') {
      const cmd = line.trim();
      if (ftpRef.current.step === 'user') {
        ftpRef.current.user = cmd;
        ftpRef.current.step = 'pass';
        ftpPrompt('Password:');
      } else if (ftpRef.current.step === 'pass') {
        ftpRef.current.pass = cmd;
        if (ftpRef.current.user === 'anonymous' && ftpRef.current.pass === 'anonymous') {
          ftpPrompt('230 Login successful.\r\nRemote system type is UNIX.\r\nftp>');
          ftpRef.current.step = 'cmd';
        } else {
          ftpPrompt('530 Login incorrect.\r\nName (' + ftpRef.current.ip + ':user):');
          ftpRef.current.step = 'user';
        }
      } else if (ftpRef.current.step === 'cmd') {
        if (cmd === 'ls' || cmd === 'dir') {
          ftpPrompt('-rw-r--r--    1 0        0            2048 backup.zip\r\nftp>');
        } else if (cmd.startsWith('get backup.zip') || cmd === 'get backup.zip') {
          ftpPrompt(
            'local: backup.zip remote: backup.zip\r\n' +
              'backup.zip (1024 bytes) downloaded\r\n' +
              'FLAG{ftp_anonymous_l00t}\r\n' +
              '221 Goodbye.'
          );
          modeRef.current = 'normal';
          prompt();
        } else if (cmd === 'help') {
          ftpPrompt('ftp commands: ls, get <file>, exit, quit, bye\r\nftp>');
        } else if (cmd === 'exit' || cmd === 'quit' || cmd === 'bye') {
          ftpPrompt('221 Goodbye.');
          modeRef.current = 'normal';
          prompt();
        } else {
          ftpPrompt(`?Invalid command ${cmd}\r\nftp>`);
        }
      }
      return;
    }

    // normal shell
    if (line.startsWith('ftp ')) {
      const ip = line.slice(4).trim() || '10.0.0.5';
      ftpRef.current = { step: 'user', user: '', pass: '', ip };
      modeRef.current = 'ftp';
      ftpPrompt(`Connected to ${ip}.\r\n220 (vsFTPd 2.3.4)\r\nName (${ip}:user):`);
      return;
    }

    const ctx: CommandContext = {
      vfs: vfsRef.current,
      level: levelRef.current,
      submitFlag: async (f: string) => {
        const ok = await submitFlag(levelId, f);
        play(ok ? 'success' : 'error');
        return ok;
      },
    };

    const res = await runCommand(line, ctx);
    if (res.cwd) vfsRef.current.cwd = res.cwd;

    if (res.output === '\x1bc') {
      term.clear();
    } else if (res.output) {
      const formatted = res.output.replace(/\r?\n/g, '\r\n');
      term.write(formatted);
    }

    if (res.flag) {
      term.write(res.flag.correct ? '\r\n[+] Flag accepted.' : '\r\n[-] Invalid flag.');
    }

    prompt();
  };

  return <div ref={containerRef} className="h-full w-full" />;
}
