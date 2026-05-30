'use client';

import { useEffect, useRef } from 'react';

export default function CopyCodeBlocks({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const pres = container.querySelectorAll<HTMLPreElement>('pre');

    pres.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;

      pre.style.position = 'relative';

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', 'Copy code');
      btn.style.cssText = [
        'position:absolute',
        'top:0.5rem',
        'right:0.5rem',
        'font-family:monospace',
        'font-size:0.65rem',
        'letter-spacing:0.06em',
        'text-transform:uppercase',
        'padding:0.2rem 0.55rem',
        'border-radius:3px',
        'border:1px solid rgba(255,255,255,0.18)',
        'background:rgba(255,255,255,0.07)',
        'color:rgba(255,255,255,0.45)',
        'cursor:pointer',
        'line-height:1.5',
        'transition:color 0.15s,background 0.15s',
        'user-select:none',
      ].join(';');

      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,255,255,0.13)';
        btn.style.color = 'rgba(255,255,255,0.75)';
      });
      btn.addEventListener('mouseleave', () => {
        if (btn.textContent !== 'copied!') {
          btn.style.background = 'rgba(255,255,255,0.07)';
          btn.style.color = 'rgba(255,255,255,0.45)';
        }
      });

      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const text = code?.textContent ?? pre.textContent ?? '';
        navigator.clipboard.writeText(text.trimEnd()).then(() => {
          btn.textContent = 'copied!';
          btn.style.color = 'rgba(255,255,255,0.9)';
          btn.style.background = 'rgba(255,255,255,0.13)';
          setTimeout(() => {
            btn.textContent = 'copy';
            btn.style.color = 'rgba(255,255,255,0.45)';
            btn.style.background = 'rgba(255,255,255,0.07)';
          }, 1500);
        });
      });

      pre.appendChild(btn);
    });

    return () => {
      pres.forEach((pre) => {
        pre.querySelector('.copy-btn')?.remove();
        pre.style.position = '';
      });
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose-lore"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
