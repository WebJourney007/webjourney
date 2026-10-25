// Envoi des formulaires vers les scripts PHP du site sans quitter la page. Le PHP répond
// en JSON ({ success, message }) : son message s'affiche sous le bouton.
// Formulaire marqué `data-track` : un envoi réussi est remonté à Google Tag Manager
// (`form_submit`, avec l'id du formulaire) et au pixel Meta (`Lead`), comme sur
// l'ancien site.

type Tracking = Window & { dataLayer?: unknown[]; fbq?: (...args: unknown[]) => void };

/** Le PHP ne lit pas certains champs (ex. `company` du contact) : leur valeur est
    ajoutée au champ qu'il lit, indiqué par `data-append-to`. */
function mergeFields(form: HTMLFormElement, data: FormData) {
  form.querySelectorAll<HTMLInputElement>("[data-append-to]").forEach((field) => {
    const target = field.dataset.appendTo ?? "";
    const value = field.value.trim();
    if (!target || !value) return;
    const label = field.labels?.[0]?.firstChild?.textContent?.trim() ?? field.name;
    data.set(target, `${label} : ${value}\n\n${String(data.get(target) ?? "")}`);
  });
}

function showStatus(status: HTMLElement, text: string, ok: boolean) {
  status.textContent = text;
  status.dataset.state = ok ? "success" : "error";
  status.hidden = false;
  status.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function submit(form: HTMLFormElement, status: HTMLElement) {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const data = new FormData(form);
  mergeFields(form, data);
  status.hidden = true;
  if (button) button.disabled = true;

  try {
    const response = await fetch(form.action, { method: "POST", body: data });
    const json = (await response.json().catch(() => null)) as { message?: string } | null;
    const fallback = response.ok ? "Message envoyé." : "Une erreur est survenue.";
    const success = response.ok ? form.dataset.success : undefined;
    showStatus(status, success ?? json?.message ?? fallback, response.ok);
    if (response.ok && form.hasAttribute("data-track")) {
      const tracking = window as Tracking;
      tracking.dataLayer = tracking.dataLayer ?? [];
      tracking.dataLayer.push({ event: "form_submit", form_type: form.id || "contact" });
      tracking.fbq?.("track", "Lead");
    }
    if (response.ok) form.reset();
  } catch {
    showStatus(status, "Erreur de connexion. Réessayez, ou écrivez-nous à hello@webjourney.ch.", false);
  } finally {
    if (button) button.disabled = false;
  }
}

document.querySelectorAll<HTMLFormElement>("form[data-send-form]").forEach((form) => {
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  if (!status) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void submit(form, status);
  });
});
