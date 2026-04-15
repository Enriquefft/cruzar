interface RenderMagicLinkInput {
  url: string;
  expiresInMinutes: number;
}

interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

export function renderMagicLink({ url, expiresInMinutes }: RenderMagicLinkInput): RenderedEmail {
  const subject = "Tu enlace para entrar a Cruzar";

  const text = [
    "Hola,",
    "",
    `Usa este enlace para continuar en Cruzar. Expira en ${expiresInMinutes} minutos.`,
    "",
    url,
    "",
    "Si tú no lo pediste, puedes ignorar este mensaje.",
    "",
    "— Cruzar",
  ].join("\n");

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cruzar · enlace de acceso</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b0c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#ececec;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0b0b0c;padding:48px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="background:#121214;border:1px solid #232328;border-radius:12px;padding:40px 32px;">
            <tr>
              <td style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#9a9aa2;padding-bottom:24px;">Cruzar</td>
            </tr>
            <tr>
              <td style="font-size:22px;line-height:1.3;color:#f5f5f6;padding-bottom:16px;">Tu enlace de acceso</td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.6;color:#c6c6cc;padding-bottom:28px;">Haz clic en el botón para continuar. El enlace expira en ${expiresInMinutes} minutos.</td>
            </tr>
            <tr>
              <td style="padding-bottom:28px;">
                <a href="${url}" style="display:inline-block;background:#f5f5f6;color:#0b0b0c;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Entrar a Cruzar</a>
              </td>
            </tr>
            <tr>
              <td style="font-size:13px;line-height:1.6;color:#8a8a92;padding-bottom:8px;">Si el botón no funciona, copia y pega esta URL:</td>
            </tr>
            <tr>
              <td style="font-size:13px;line-height:1.6;color:#9a9aa2;word-break:break-all;padding-bottom:24px;">${url}</td>
            </tr>
            <tr>
              <td style="font-size:12px;line-height:1.6;color:#6a6a72;border-top:1px solid #232328;padding-top:20px;">Si tú no pediste este enlace, puedes ignorar este mensaje — nadie entrará a tu cuenta sin hacer clic.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
