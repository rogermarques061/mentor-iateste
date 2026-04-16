

## Plano: Fluxo de Criação de Produto Funcional

### Diagnóstico
O editor em `MentorProducts.tsx` é 100% visual: inputs sem `value`/`onChange`, botões "Próximo" só trocam o step, lista de produtos é array hardcoded. Nenhum dado persiste.

### Arquitetura proposta

**1. Estado global compartilhado (Context + localStorage)**

Criar `src/contexts/ProductsContext.tsx`:
- `products[]`: lista persistida no `localStorage` (chave `mentoria_products`), inicializa com os 5 mocks atuais.
- `draftProduct`: objeto sendo editado com toda a estrutura do prompt (Steps 1–6 + meta).
- Ações: `updateDraft(patch)`, `resetDraft()`, `saveDraft()` (status rascunho), `publishDraft()` (gera id/slug/url, status "Publicado", redirect), `loadProductIntoDraft(id)`, `deleteProduct(id)`.
- Slug = `slugify(name)`. URL = `/checkout/{slug}`.

Envolver `<App>` em `<ProductsProvider>`.

**2. Refatorar `MentorProducts.tsx`**

Lista de produtos lê do context. Cada card mostra: thumbnail (preview da imagem se houver), nome, preço, status, contagem de módulos/aulas (`product.course.modules.reduce(...)`), botões Editar/Ver/Copiar funcionais.

Botão "Criar produto" → `resetDraft()` + `setView("editor")`.

**3. Quebrar editor em componentes (em `src/components/products/`)**

- `ProductEditor.tsx` — wrapper com sidebar de steps (com check verde nos concluídos, atual destacado, futuros bloqueados, barra de progresso).
- `Step1Basics.tsx` — inputs controlados, upload de capa via `FileReader` → base64 com preview, validação obrigatória do nome (highlight vermelho + mensagem).
- `Step2Pricing.tsx` — toggles funcionais (Switch), máscara R$, slider Radix de parcelas (1–12), tabela de parcelas calculada em tempo real, toggle de garantia (7/15/30 dias).
- `Step3Content.tsx` — **editor de curso completo (foco principal):**
  - Layout 2 colunas: sidebar de módulos | editor de aula
  - "+ Adicionar módulo" → cria `{ id, title: "Módulo N", lessons: [] }`
  - Título de módulo editável inline (clique duplo)
  - "+ Adicionar aula" dentro do módulo
  - Aula tem: nome, tipo (segmentado: Vídeo/Texto/Quiz/Live), URL de vídeo com preview de iframe (YouTube embed), editor de texto simples (textarea com bold/italic via markdown), duração, toggle Publicado/Rascunho, materiais extras (FileReader → lista)
  - Reordenar módulos/aulas com drag-and-drop nativo HTML5 (sem nova dependência)
  - Excluir módulo/aula com confirmação
  - Indicador "Salvo automaticamente" (debounce visual)
- `Step4SalesPage.tsx` — headline, subheadline, CTA, lista dinâmica de benefícios (add/remove), lista de FAQ (add/remove), preview ao lado.
- `Step5Checkout.tsx` — toggles PIX/Cartão/Boleto, max parcelas, texto do botão.
- `Step6PostPurchase.tsx` — mensagem de sucesso, toggle redirect + URL, toggle e-mail + texto.
- `Step7Publish.tsx` — checklist computado dinamicamente do `draftProduct`. Botão "Publicar" desabilitado se obrigatórios faltarem; ao clicar → `publishDraft()` → toast → navega para lista.

**4. Navegação entre steps**

- "Próximo" do Step 1 valida `name` não-vazio (caso contrário, marca o input vermelho + toast erro).
- "Voltar" sempre permitido, dados intactos (vêm do context).
- "Salvar rascunho" disponível em todos os steps → salva com status "Rascunho" e volta à lista.
- Sidebar de steps: clicar em step anterior já visitado é permitido; futuros, bloqueados.

**5. Lista de produtos pós-publicação**

Produto recém-publicado aparece imediatamente (state reativo do context). Mostra `modules.length` módulos e total de aulas. Botão "Copiar link" copia URL gerada com toast.

### Arquivos afetados
- **Criar:** `src/contexts/ProductsContext.tsx`, `src/components/products/ProductEditor.tsx`, `Step1Basics.tsx`, `Step2Pricing.tsx`, `Step3Content.tsx` (+ subcomponentes `ModuleList`, `LessonEditor`), `Step4SalesPage.tsx`, `Step5Checkout.tsx`, `Step6PostPurchase.tsx`, `Step7Publish.tsx`, `src/lib/products-utils.ts` (slugify, formatBRL, calcInstallments).
- **Editar:** `src/App.tsx` (envolver com Provider), `src/pages/MentorProducts.tsx` (substituir mock + editor inline pelos novos componentes).

### Fora de escopo
- Backend real / Supabase (tudo localStorage). Pode ser adicionado depois.
- Editor rich-text complexo (usar markdown simples em textarea).

### Validação final
Executar o fluxo de 12 passos do prompt manualmente após a entrega.

