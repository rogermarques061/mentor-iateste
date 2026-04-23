# Implofy — Plataforma de Mentoria

Plataforma completa para mentores criarem, gerenciarem e monetizarem seus programas de mentoria e cursos online.

## Tecnologias

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **React Router DOM** — roteamento SPA
- **TanStack React Query** — gerenciamento de estado assíncrono
- **React Hook Form** + **Zod** — formulários e validação
- **Recharts** — gráficos e dashboards
- **Vitest** + **Testing Library** — testes unitários

## Estrutura do Projeto

```
src/
├── components/
│   ├── checkout/       # Preview de checkout em tempo real
│   ├── effects/        # Efeitos visuais (cursor, orbs, canvas)
│   ├── landing/        # Seções da landing page pública
│   ├── layout/         # AppLayout (sidebar + navegação)
│   ├── products/       # Editor de produtos (7 steps)
│   ├── student/        # Componentes da área do aluno
│   └── ui/             # Componentes shadcn/ui
├── contexts/
│   ├── PlatformContext.tsx   # Estado global da plataforma
│   └── ProductsContext.tsx   # Estado do editor de produtos
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── products-utils.ts     # Helpers: genId, slugify
└── pages/
    ├── Landing.tsx             # Página pública (/)
    ├── StudentHome.tsx         # Home do aluno (/aluno)
    ├── MyCourses.tsx           # Meus cursos (/aluno/courses)
    ├── LessonPlayer.tsx        # Player de aula (/aluno/player)
    ├── Evolution.tsx           # Evolução do aluno
    ├── Achievements.tsx        # Conquistas
    ├── Ranking.tsx             # Ranking
    ├── MentorDashboard.tsx     # Dashboard do mentor (/mentor)
    ├── MentorStudents.tsx      # Gestão de alunos
    ├── MentorStudentProfile.tsx
    ├── MentorAI.tsx            # Inteligência artificial
    ├── MentorContent.tsx       # Gestão de conteúdo
    ├── MentorGamification.tsx  # Gamificação
    ├── MentorReports.tsx       # Relatórios
    ├── MentorSales.tsx         # Vendas
    ├── MentorFinancial.tsx     # Financeiro
    ├── MentorCheckout.tsx      # Editor de checkout
    ├── MentorProducts.tsx      # Gestão de produtos
    ├── MentorSettings.tsx      # Configurações
    ├── ProductSalesPage.tsx    # Página de vendas pública (/p/:slug)
    ├── CheckoutPage.tsx        # Checkout público (/checkout/:slug)
    └── PurchaseSuccess.tsx     # Confirmação de compra (/obrigado/:id)
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page pública |
| `/aluno` | Home do aluno |
| `/aluno/courses` | Lista de cursos do aluno |
| `/aluno/player` | Player de aulas |
| `/aluno/evolution` | Progresso e evolução |
| `/aluno/achievements` | Conquistas e badges |
| `/aluno/ranking` | Ranking da turma |
| `/mentor` | Dashboard financeiro do mentor |
| `/mentor/students` | Gestão de alunos |
| `/mentor/students/:id` | Perfil individual do aluno |
| `/mentor/ai` | Painel de IA |
| `/mentor/content` | Editor de cursos |
| `/mentor/gamification` | Configurações de gamificação |
| `/mentor/reports` | Relatórios |
| `/mentor/sales` | Painel de vendas |
| `/mentor/financial` | Financeiro detalhado |
| `/mentor/checkout` | Editor de checkout |
| `/mentor/products` | Gestão de produtos |
| `/mentor/settings` | Configurações da plataforma |
| `/p/:slug` | Página de vendas pública |
| `/checkout/:slug` | Página de checkout |
| `/obrigado/:id` | Confirmação de compra |

## Instalação e Uso

```bash
# Instalar dependências
npm install
# ou
bun install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Testes
npm run test

# Lint
npm run lint
```

## Funcionalidades

### Área do Mentor
- **Dashboard** — métricas financeiras em tempo real com filtros por período
- **Alunos** — gestão completa com indicadores de engajamento e risco de churn
- **IA** — alertas inteligentes e sugestões de intervenção
- **Conteúdo** — editor de cursos e módulos
- **Checkout** — editor visual de páginas de venda e checkout com preview em tempo real
- **Produtos** — catálogo de produtos com analytics
- **Financeiro/Vendas** — relatórios financeiros detalhados
- **Gamificação** — sistema de XP, badges e rankings

### Área do Aluno
- **Home** — cursos em andamento, missões semanais, conquistas recentes
- **Meus Cursos** — progresso por módulo com filtros
- **Player** — player de aulas com materiais, comentários, transcrição e anotações persistidas
- **Evolução** — heatmap de atividade e milestones
- **Conquistas** — badges e progresso de conquistas
- **Ranking** — posição na turma

### Checkout Público
- Página de vendas customizável por produto
- Checkout em 2 etapas (identificação + pagamento)
- Suporte a PIX e cartão de crédito com parcelamento
- Cupons de desconto validados (LAUNCH10)
- Página de confirmação com oferta de upsell
