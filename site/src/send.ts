// "Send it" forms (home Meet, Contribute): post to Web3Forms when PUBLIC_WEB3FORMS_KEY is set at build, else fall back to mailto.
// The key is public by design (Web3Forms ties it to the inbox it delivers to).
export const TO = 'znak@demandsense.com';
const KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY as string | undefined;
const FIELDS = ['name', 'email', 'company', 'kind', 'about'];
const mail = `<a href="mailto:${TO}">${TO}</a>`;

export function wireSendForms(sel: string) {
  document.querySelectorAll<HTMLFormElement>(sel).forEach((f) => {
    if (f.dataset.wired) return;
    f.dataset.wired = '1';
    const btn = f.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const label = btn.querySelector('.go-txt > span')!;
    const idle = label.textContent;
    const note = document.createElement('p');
    note.className = 'send-note t-p2';
    note.setAttribute('role', 'status');
    btn.after(note);
    const say = (state: string, html: string) => { f.dataset.state = state; note.innerHTML = html; };

    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (f.dataset.state === 'sending') return;
      const d = new FormData(f);
      const kind = String(d.get('kind') ?? '');
      if (!KEY) {
        const body = FIELDS.map((k) => `${k}: ${d.get(k) ?? ''}`).join('\n');
        location.href = `mailto:${TO}?subject=${encodeURIComponent(`Contribution: ${kind}`)}&body=${encodeURIComponent(body)}`;
        say('sent', `Your mail app should open with it filled in. If it didn’t, write to ${mail}.`);
        return;
      }
      say('sending', '');
      btn.disabled = true;
      label.textContent = 'Sending…';
      try {
        const r = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: KEY, subject: `Contribution: ${kind}`, from_name: 'The B2B AI Standard', replyto: d.get('email'),
            botcheck: d.get('botcheck') ? true : '', page: location.pathname,
            ...Object.fromEntries(FIELDS.map((k) => [k, d.get(k) ?? ''])),
          }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.success) throw new Error(j.message || r.statusText);
        say('sent', `Thanks, it’s in. We’ll reply to ${String(d.get('email')).replace(/[<>&"]/g, '')} within a few days.`);
        f.reset();
      } catch {
        say('error', `Couldn’t send it. Try again, or write to ${mail}.`);
      } finally {
        btn.disabled = false;
        label.textContent = idle;
      }
    });
  });
}
