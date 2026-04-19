

## Plano: Landing Page Implofy (HTML único)

### Entrega
Arquivo único `/mnt/documents/implofy-landing.html` com todo CSS e JS inline, fiel à identidade visual do dashboard atual da plataforma (preto + dourado âmbar #c9a227).

### Por que fora do app React
A solicitação é explícita: **um arquivo .html standalone, CSS/JS embutidos, vanilla JS, sem frameworks**. Isso não pertence ao codebase React/Vite — é um artefato entregável. Vou gerar via `code--exec` e disponibilizar como download.

### Estrutura do arquivo

**1. `<head>`** — Meta tags, Google Fonts (Inter 400/500/600/700), CSS inline com:
- Variáveis CSS da paleta exata (--bg #0d0d0d, --gold #c9a227, --gold-bright #e6b830, etc.)
- Reset + tipografia base
- Utilities (container, glass, badge)
- Animações (pulse, fadeIn, slideUp)

**2. `<body>` — Seções na ordem:**
1. **Header fixo** — logo SVG geométrico dourado + "Implofy" + tagline; nav (4 links); botões Entrar/Criar Conta. Transparente → sólido com blur ao scroll.
2. **Hero** — badge pulsante "Ao vivo", H1 com clamp(), subtítulo, 2 CTAs, grid de fundo + radial gradient dourado, mockup recortado do dashboard à direita.
3. **Benefícios** — grid 4 colunas com cards (ícone dourado em container quadrado arredondado, título, descrição).
4. **Preview do Produto** — recriação fiel em HTML/CSS do dashboard:
   - Sidebar com 11 itens (Visão Geral ativo em fundo âmbar suave), badges 2/3 vermelhos em Checkout/IA, rodapé com avatar "MC" Marcos Costa Mentor
   - Topbar com data, filtros, badge AO VIVO dourado
   - 6 cards de métricas com ícones dourados
   - Gráfico SVG inline de linha dourada (sem fill)
   - Lista produtos mais vendidos (3 itens com valores)
   - 3 cards laterais de conversão com indicador circular SVG
   - Feed de atividade recente (3 itens)
5. **Diferencial IA** — título, texto, 3 cards de alerta replicando estilo do feed, stats em grid 4 colunas.
6. **Seção Alunos** — fundo levemente diferente, badge dourada, H2, CTA dourado, ícone decorativo com glow.
7. **Footer** — logo + tagline + links + copyright.

**3. Modais (3)** — Login, Criar Conta (com seletor Mentor/Aluno + indicador de força de senha), Recuperação. Overlay com blur, animação opacity+translateY.

**4. `<script>` vanilla:**
- Scroll handler para header (sólido após 60px)
- Abrir/fechar modais (com backdrop click + ESC)
- Trocar entre modais (login ↔ criar ↔ recuperar)
- Seletor Mentor/Aluno no signup
- Indicador de força de senha (regex: comprimento + maiúscula + número/símbolo → fraca/média/forte)
- Submit handlers com loading simulado: email contém "mentor" → "Abrindo Painel de Performance..." senão "Acessando área de membros..."
- Smooth scroll entre âncoras

**5. Responsividade** — `@media (max-width: 768px)`: sidebar do mockup oculta, grids viram 1 coluna, modal full-width, hero centralizado, fontes via clamp().

### QA
Após gerar, vou:
1. Renderizar o HTML em screenshot via headless (chromium/puppeteer já disponível) em desktop (1440x900) e mobile (390x844)
2. Inspecionar visualmente: paleta correta, mockup fiel, modais abrem, layout responsivo intacto
3. Corrigir e re-renderizar se necessário

### Entrega final
`<lov-artifact path="implofy-landing.html" mime_type="text/html"></lov-artifact>` para o usuário baixar/abrir.

