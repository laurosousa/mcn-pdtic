// Gera dist/public/404.html para o GitHub Pages.
// O Pages entrega este arquivo para qualquer endereço que não existe. Ele:
//  - leva rotas internas da edição completa (/mcn-pdtic/ufrr/...) para a edição completa;
//  - leva o link antigo da avaliação UFRR (/mcn-pdtic/avaliacoes/ufrr-pdtic-2023-2025) para a edição completa;
//  - leva o link antigo /mcn-pdtic/cgtic/ para a página principal (edição pública);
//  - nos demais casos, abre a própria edição pública (rotas internas dela).
import { readFileSync, writeFileSync } from 'node:fs';

const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const html = readFileSync('dist/public/index.html', 'utf8');
const redirect = `<script>(function(){var b=${JSON.stringify(base)},c=b+'ufrr/',p=location.pathname;
if(p.indexOf(c)===0){location.replace(c+'?rota='+encodeURIComponent(p.slice(c.length))+location.hash);return;}
if(p.indexOf(b+'avaliacoes/ufrr-pdtic-2023-2025')===0){location.replace(c+'?rota=avaliacoes/ufrr-pdtic-2023-2025');return;}
if(p.indexOf(b+'cgtic')===0){location.replace(b);}})();</script>`;
writeFileSync('dist/public/404.html', html.replace('<head>', '<head>' + redirect));
console.log('404.html gerado (base ' + base + ')');
