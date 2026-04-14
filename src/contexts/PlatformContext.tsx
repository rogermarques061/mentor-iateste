import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

// ─── TYPES ──────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  enrolledAt: string;
  courses: string[];
  progress: Record<string, CourseProgress>;
  engagement: EngagementData;
  gamification: GamificationData;
  purchaseHistory: Transaction[];
  notes: MentorNote[];
  tags: string[];
  alerts: AIAlert[];
}

export interface CourseProgress {
  percentage: number;
  completedLessons: string[];
  lastLesson: string | null;
  lastAccessAt: string;
  studyTimeMinutes: number;
}

export interface EngagementData {
  score: number;
  churnRisk: "low" | "medium" | "high" | "critical";
  trend: "growing" | "stable" | "declining" | "critical";
  streak: number;
  lastAccessAt: string;
  weeklyActivity: number[];
}

export interface GamificationData {
  xp: number;
  level: string;
  badges: string[];
  streak: number;
  rank: number | null;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "live";
  duration: string;
  order: number;
  status: "published" | "draft";
}

export interface Module {
  id: string;
  title: string;
  order: number;
  status: "published" | "draft";
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  status: "published" | "draft" | "archived";
  totalModules: number;
  totalLessons: number;
  totalDuration: string;
  modules: Module[];
}

export interface CheckoutProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  price: number;
  originalPrice: number;
  guarantee: number;
  accentColor: string;
  status: "draft" | "published" | "paused" | "archived";
  type: string;
  linkedCourseId: string | null;
  paymentType: "single" | "recurring";
  installments: boolean;
  maxInstallments: number;
  thumbnail: string | null;
  testimonials: Testimonial[];
  faq: FaqItem[];
  benefits: string[];
  sections: Record<string, boolean>;
  analytics: CheckoutAnalytics;
  createdAt: string;
  publishedAt: string | null;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CheckoutAnalytics {
  visits: number;
  checkoutsStarted: number;
  sales: number;
  revenue: number;
  conversionRate: number;
}

export interface Transaction {
  id: string;
  checkoutId: string;
  productName: string;
  customer: { name: string; email: string; cpf: string; phone: string };
  method: "pix" | "card" | "boleto";
  installments: number;
  amount: number;
  taxa: number;
  liquido: number;
  status: "pending" | "paid" | "failed" | "refunded" | "expired";
  createdAt: string;
  paidAt: string | null;
}

export interface MentorNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface AIAlert {
  id: string;
  severity: "critical" | "high" | "moderate" | "info" | "positive";
  studentId: string;
  studentName: string;
  message: string;
  suggestedMessage: string;
  detectedAt: string;
  resolved: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface PlatformSettings {
  accentColor: string;
  logo: string | null;
  platformName: string;
  welcomeMessage: string;
  gamificationEnabled: boolean;
}

export interface PlatformState {
  mentor: { id: string; name: string; email: string; avatar: string | null; platformName: string };
  courses: Course[];
  products: CheckoutProduct[];
  students: Student[];
  transactions: Transaction[];
  notifications: Notification[];
  settings: PlatformSettings;
  currentRole: "mentor" | "student";
  currentStudentId: string | null;
}

// ─── HELPERS ────────────────────────────────────────────────
let idCounter = 1000;
export const generateId = (prefix: string) => `${prefix}_${String(++idCounter).padStart(5, "0")}`;

const generateSlug = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").substring(0, 60);

export const formatCurrency = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export const daysBetween = (d1: string, d2: Date) =>
  Math.floor((d2.getTime() - new Date(d1).getTime()) / (1000 * 60 * 60 * 24));

export const timeAgo = (dateStr: string) => {
  const diff = daysBetween(dateStr, new Date());
  if (diff === 0) {
    const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
    if (hours === 0) return "agora";
    return `há ${hours}h`;
  }
  if (diff === 1) return "há 1 dia";
  if (diff < 7) return `há ${diff} dias`;
  if (diff < 30) return `há ${Math.floor(diff / 7)} semanas`;
  return `há ${Math.floor(diff / 30)} meses`;
};

// ─── SEED DATA ──────────────────────────────────────────────
const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

const SEED_COURSES: Course[] = [
  {
    id: "course_001", title: "Mentoria PATRON", description: "O programa definitivo para vendedores de alto ticket",
    thumbnail: null, status: "published", totalModules: 6, totalLessons: 34, totalDuration: "18h 40min",
    modules: [
      { id: "mod_001", title: "Fundamentos da Venda", order: 1, status: "published", lessons: [
        { id: "l_001", title: "Bem-vindo ao programa", type: "video", duration: "12:34", order: 1, status: "published" },
        { id: "l_002", title: "Mindset de alta performance", type: "video", duration: "18:20", order: 2, status: "published" },
        { id: "l_003", title: "O framework PATRON", type: "video", duration: "24:15", order: 3, status: "published" },
        { id: "l_004", title: "Quiz — Fundamentos", type: "quiz", duration: "10:00", order: 4, status: "published" },
      ]},
      { id: "mod_002", title: "Prospecção Estratégica", order: 2, status: "published", lessons: [
        { id: "l_005", title: "Onde encontrar clientes", type: "video", duration: "22:10", order: 1, status: "published" },
        { id: "l_006", title: "Script de abordagem", type: "video", duration: "15:40", order: 2, status: "published" },
        { id: "l_007", title: "Qualificação de leads", type: "video", duration: "19:30", order: 3, status: "published" },
      ]},
      { id: "mod_003", title: "Negociação Avançada", order: 3, status: "published", lessons: [
        { id: "l_008", title: "Técnicas de rapport", type: "video", duration: "20:00", order: 1, status: "published" },
        { id: "l_009", title: "Contornando objeções", type: "video", duration: "28:15", order: 2, status: "published" },
      ]},
      { id: "mod_004", title: "Fechamento", order: 4, status: "published", lessons: [
        { id: "l_010", title: "Sinais de compra", type: "video", duration: "16:45", order: 1, status: "published" },
        { id: "l_011", title: "Técnicas de fechamento", type: "video", duration: "22:30", order: 2, status: "published" },
      ]},
      { id: "mod_005", title: "Pós-venda", order: 5, status: "published", lessons: [
        { id: "l_012", title: "Fidelização de clientes", type: "video", duration: "14:20", order: 1, status: "published" },
      ]},
      { id: "mod_006", title: "Escalando resultados", order: 6, status: "published", lessons: [
        { id: "l_013", title: "Construindo sua equipe", type: "video", duration: "25:00", order: 1, status: "published" },
        { id: "l_014", title: "Automação de vendas", type: "video", duration: "30:10", order: 2, status: "published" },
      ]},
    ],
  },
  {
    id: "course_002", title: "Curso Identidade Restaurada", description: "Descubra seu propósito e reconstrua sua identidade profissional",
    thumbnail: null, status: "published", totalModules: 4, totalLessons: 24, totalDuration: "12h 20min",
    modules: [
      { id: "mod_010", title: "Autoconhecimento", order: 1, status: "published", lessons: [
        { id: "l_020", title: "Quem sou eu?", type: "video", duration: "18:00", order: 1, status: "published" },
        { id: "l_021", title: "Crenças limitantes", type: "video", duration: "22:00", order: 2, status: "published" },
      ]},
      { id: "mod_011", title: "Propósito", order: 2, status: "published", lessons: [
        { id: "l_022", title: "Encontrando seu porquê", type: "video", duration: "20:00", order: 1, status: "published" },
      ]},
      { id: "mod_012", title: "Ação", order: 3, status: "published", lessons: [
        { id: "l_023", title: "Plano de ação", type: "video", duration: "25:00", order: 1, status: "published" },
      ]},
      { id: "mod_013", title: "Transformação", order: 4, status: "published", lessons: [
        { id: "l_024", title: "Nova identidade", type: "video", duration: "15:00", order: 1, status: "published" },
      ]},
    ],
  },
];

const SEED_STUDENTS: Student[] = [
  { id: "s_001", name: "Ana Silva", email: "ana@email.com", avatar: null, enrolledAt: daysAgo(90), courses: ["course_001"], progress: { course_001: { percentage: 89, completedLessons: ["l_001","l_002","l_003","l_004","l_005","l_006","l_007","l_008","l_009","l_010","l_011","l_012"], lastLesson: "l_013", lastAccessAt: hoursAgo(2), studyTimeMinutes: 1420 }}, engagement: { score: 95, churnRisk: "low", trend: "growing", streak: 12, lastAccessAt: hoursAgo(2), weeklyActivity: [3,5,4,2,6,4,3] }, gamification: { xp: 4200, level: "Especialista", badges: ["b_001","b_003","b_005"], streak: 12, rank: 1 }, purchaseHistory: [], notes: [], tags: ["top_performer"], alerts: [] },
  { id: "s_002", name: "Pedro Santos", email: "pedro@email.com", avatar: null, enrolledAt: daysAgo(60), courses: ["course_002"], progress: { course_002: { percentage: 65, completedLessons: ["l_020","l_021","l_022"], lastLesson: "l_023", lastAccessAt: daysAgo(1), studyTimeMinutes: 680 }}, engagement: { score: 72, churnRisk: "low", trend: "stable", streak: 3, lastAccessAt: daysAgo(1), weeklyActivity: [2,3,1,0,2,1,0] }, gamification: { xp: 2100, level: "Praticante", badges: ["b_001"], streak: 3, rank: 5 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_003", name: "Maria Costa", email: "maria@email.com", avatar: null, enrolledAt: daysAgo(45), courses: ["course_001"], progress: { course_001: { percentage: 30, completedLessons: ["l_001","l_002","l_003","l_004"], lastLesson: "l_005", lastAccessAt: daysAgo(5), studyTimeMinutes: 340 }}, engagement: { score: 45, churnRisk: "medium", trend: "declining", streak: 0, lastAccessAt: daysAgo(5), weeklyActivity: [0,1,0,0,0,1,0] }, gamification: { xp: 980, level: "Aprendiz", badges: ["b_001"], streak: 0, rank: 8 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_004", name: "João Oliveira", email: "joao@email.com", avatar: null, enrolledAt: daysAgo(30), courses: ["course_001","course_002"], progress: { course_001: { percentage: 15, completedLessons: ["l_001","l_002"], lastLesson: "l_003", lastAccessAt: daysAgo(8), studyTimeMinutes: 180 }, course_002: { percentage: 10, completedLessons: ["l_020"], lastLesson: "l_021", lastAccessAt: daysAgo(8), studyTimeMinutes: 60 }}, engagement: { score: 28, churnRisk: "high", trend: "declining", streak: 0, lastAccessAt: daysAgo(8), weeklyActivity: [0,0,0,0,0,0,0] }, gamification: { xp: 420, level: "Iniciante", badges: [], streak: 0, rank: 12 }, purchaseHistory: [], notes: [], tags: [], alerts: [{ id: "al_001", severity: "critical", studentId: "s_004", studentName: "João Oliveira", message: "Sem acesso há 8 dias consecutivos", suggestedMessage: "Oi João! Vi que faz alguns dias que você não passa por aqui. Como estão as coisas?", detectedAt: hoursAgo(2), resolved: false }] },
  { id: "s_005", name: "Carla Lima", email: "carla@email.com", avatar: null, enrolledAt: daysAgo(75), courses: ["course_002"], progress: { course_002: { percentage: 78, completedLessons: ["l_020","l_021","l_022","l_023"], lastLesson: "l_024", lastAccessAt: hoursAgo(3), studyTimeMinutes: 920 }}, engagement: { score: 88, churnRisk: "low", trend: "growing", streak: 7, lastAccessAt: hoursAgo(3), weeklyActivity: [2,4,3,1,3,2,1] }, gamification: { xp: 3100, level: "Praticante", badges: ["b_001","b_003"], streak: 7, rank: 3 }, purchaseHistory: [], notes: [], tags: ["upsell_candidate"], alerts: [] },
  { id: "s_006", name: "Rafael Mendes", email: "rafael@email.com", avatar: null, enrolledAt: daysAgo(50), courses: ["course_001","course_002"], progress: { course_001: { percentage: 52, completedLessons: ["l_001","l_002","l_003","l_004","l_005","l_006","l_007"], lastLesson: "l_008", lastAccessAt: daysAgo(3), studyTimeMinutes: 560 }, course_002: { percentage: 40, completedLessons: ["l_020","l_021"], lastLesson: "l_022", lastAccessAt: daysAgo(3), studyTimeMinutes: 280 }}, engagement: { score: 62, churnRisk: "medium", trend: "stable", streak: 0, lastAccessAt: daysAgo(3), weeklyActivity: [1,0,2,0,1,0,0] }, gamification: { xp: 1800, level: "Aprendiz", badges: ["b_001"], streak: 0, rank: 6 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_007", name: "Beatriz Rocha", email: "beatriz@email.com", avatar: null, enrolledAt: daysAgo(15), courses: ["course_001"], progress: { course_001: { percentage: 8, completedLessons: ["l_001"], lastLesson: "l_002", lastAccessAt: daysAgo(15), studyTimeMinutes: 30 }}, engagement: { score: 18, churnRisk: "critical", trend: "critical", streak: 0, lastAccessAt: daysAgo(15), weeklyActivity: [0,0,0,0,0,0,0] }, gamification: { xp: 50, level: "Iniciante", badges: [], streak: 0, rank: 15 }, purchaseHistory: [], notes: [], tags: [], alerts: [{ id: "al_002", severity: "critical", studentId: "s_007", studentName: "Beatriz Rocha", message: "Nunca acessou após matrícula. 15 dias sem atividade.", suggestedMessage: "Oi Beatriz! Seja bem-vinda ao programa! Preparei tudo para sua primeira aula.", detectedAt: hoursAgo(5), resolved: false }] },
  { id: "s_008", name: "Lucas Ferreira", email: "lucas@email.com", avatar: null, enrolledAt: daysAgo(100), courses: ["course_001"], progress: { course_001: { percentage: 94, completedLessons: ["l_001","l_002","l_003","l_004","l_005","l_006","l_007","l_008","l_009","l_010","l_011","l_012","l_013"], lastLesson: "l_014", lastAccessAt: hoursAgo(1), studyTimeMinutes: 1680 }}, engagement: { score: 91, churnRisk: "low", trend: "growing", streak: 15, lastAccessAt: hoursAgo(1), weeklyActivity: [4,5,3,6,4,5,3] }, gamification: { xp: 4800, level: "Mestre", badges: ["b_001","b_003","b_005","b_007"], streak: 15, rank: 2 }, purchaseHistory: [], notes: [], tags: ["top_performer","upsell_candidate"], alerts: [] },
  { id: "s_009", name: "Juliana Martins", email: "juliana@email.com", avatar: null, enrolledAt: daysAgo(40), courses: ["course_002"], progress: { course_002: { percentage: 42, completedLessons: ["l_020","l_021"], lastLesson: "l_022", lastAccessAt: daysAgo(4), studyTimeMinutes: 320 }}, engagement: { score: 55, churnRisk: "medium", trend: "declining", streak: 0, lastAccessAt: daysAgo(4), weeklyActivity: [0,1,0,1,0,0,0] }, gamification: { xp: 1200, level: "Aprendiz", badges: ["b_001"], streak: 0, rank: 7 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_010", name: "Fernando Alves", email: "fernando@email.com", avatar: null, enrolledAt: daysAgo(80), courses: ["course_001"], progress: { course_001: { percentage: 71, completedLessons: ["l_001","l_002","l_003","l_004","l_005","l_006","l_007","l_008","l_009","l_010"], lastLesson: "l_011", lastAccessAt: hoursAgo(6), studyTimeMinutes: 1100 }}, engagement: { score: 82, churnRisk: "low", trend: "growing", streak: 5, lastAccessAt: hoursAgo(6), weeklyActivity: [3,2,4,1,3,2,1] }, gamification: { xp: 3400, level: "Praticante", badges: ["b_001","b_003"], streak: 5, rank: 4 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_011", name: "Camila Rocha", email: "camila@email.com", avatar: null, enrolledAt: daysAgo(20), courses: ["course_002"], progress: { course_002: { percentage: 55, completedLessons: ["l_020","l_021","l_022"], lastLesson: "l_023", lastAccessAt: daysAgo(2), studyTimeMinutes: 410 }}, engagement: { score: 68, churnRisk: "low", trend: "stable", streak: 2, lastAccessAt: daysAgo(2), weeklyActivity: [1,2,1,0,2,1,0] }, gamification: { xp: 1500, level: "Aprendiz", badges: ["b_001"], streak: 2, rank: 9 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_012", name: "Ricardo Souza", email: "ricardo@email.com", avatar: null, enrolledAt: daysAgo(10), courses: ["course_001"], progress: { course_001: { percentage: 22, completedLessons: ["l_001","l_002","l_003"], lastLesson: "l_004", lastAccessAt: daysAgo(1), studyTimeMinutes: 150 }}, engagement: { score: 75, churnRisk: "low", trend: "growing", streak: 4, lastAccessAt: daysAgo(1), weeklyActivity: [2,3,2,1,2,1,0] }, gamification: { xp: 600, level: "Iniciante", badges: [], streak: 4, rank: 10 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_013", name: "Patrícia Dias", email: "patricia@email.com", avatar: null, enrolledAt: daysAgo(55), courses: ["course_001","course_002"], progress: { course_001: { percentage: 60, completedLessons: ["l_001","l_002","l_003","l_004","l_005","l_006","l_007","l_008"], lastLesson: "l_009", lastAccessAt: daysAgo(6), studyTimeMinutes: 780 }, course_002: { percentage: 30, completedLessons: ["l_020"], lastLesson: "l_021", lastAccessAt: daysAgo(6), studyTimeMinutes: 120 }}, engagement: { score: 48, churnRisk: "medium", trend: "declining", streak: 0, lastAccessAt: daysAgo(6), weeklyActivity: [0,0,1,0,0,0,0] }, gamification: { xp: 1600, level: "Aprendiz", badges: ["b_001"], streak: 0, rank: 11 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_014", name: "Thiago Barbosa", email: "thiago@email.com", avatar: null, enrolledAt: daysAgo(5), courses: ["course_001"], progress: { course_001: { percentage: 8, completedLessons: ["l_001"], lastLesson: "l_002", lastAccessAt: daysAgo(1), studyTimeMinutes: 45 }}, engagement: { score: 80, churnRisk: "low", trend: "growing", streak: 3, lastAccessAt: daysAgo(1), weeklyActivity: [1,2,1,0,1,0,0] }, gamification: { xp: 200, level: "Iniciante", badges: [], streak: 3, rank: 13 }, purchaseHistory: [], notes: [], tags: [], alerts: [] },
  { id: "s_015", name: "Larissa Oliveira", email: "larissa@email.com", avatar: null, enrolledAt: daysAgo(35), courses: ["course_002"], progress: { course_002: { percentage: 85, completedLessons: ["l_020","l_021","l_022","l_023"], lastLesson: "l_024", lastAccessAt: hoursAgo(4), studyTimeMinutes: 890 }}, engagement: { score: 90, churnRisk: "low", trend: "growing", streak: 8, lastAccessAt: hoursAgo(4), weeklyActivity: [3,4,2,3,3,2,1] }, gamification: { xp: 3800, level: "Especialista", badges: ["b_001","b_003","b_005"], streak: 8, rank: 3 }, purchaseHistory: [], notes: [], tags: ["top_performer","upsell_candidate"], alerts: [] },
];

const SEED_PRODUCTS: CheckoutProduct[] = [
  {
    id: "prod_001", slug: "IMPLOFY-patron", name: "Mentoria PATRON",
    description: "O programa definitivo para vendedores de alto ticket",
    headline: "Transforme sua carreira em 90 dias",
    subheadline: "O método comprovado que já ajudou +500 profissionais a triplicar seus resultados",
    ctaText: "Quero começar agora", price: 997, originalPrice: 1497, guarantee: 7,
    accentColor: "#FFD700", status: "published", type: "Mentoria",
    linkedCourseId: "course_001", paymentType: "single", installments: true, maxInstallments: 12,
    thumbnail: null,
    testimonials: [
      { name: "Maria Silva", role: "Empreendedora", text: "Em 3 meses dobrei meu faturamento.", rating: 5 },
      { name: "Pedro Santos", role: "Vendedor Senior", text: "Conteúdo prático e direto ao ponto.", rating: 5 },
      { name: "Ana Costa", role: "Consultora", text: "Recomendo para qualquer profissional.", rating: 5 },
    ],
    faq: [
      { q: "Quanto tempo tenho de acesso?", a: "Acesso vitalício." },
      { q: "Tem garantia?", a: "Sim! Garantia incondicional de 7 dias." },
      { q: "Como funciona o suporte?", a: "Suporte direto com o mentor." },
    ],
    benefits: ["12 módulos com +80 aulas práticas","Acesso vitalício","Suporte direto com o mentor","Certificado de conclusão","Templates exclusivos","Comunidade privada"],
    sections: { paraQuem: true, beneficios: true, conteudo: true, mentor: true, garantia: true, faq: true, depoimentos: true },
    analytics: { visits: 2340, checkoutsStarted: 1200, sales: 578, revenue: 576366, conversionRate: 24.7 },
    createdAt: daysAgo(120), publishedAt: daysAgo(118),
  },
  {
    id: "prod_002", slug: "curso-identidade-restaurada", name: "Curso Identidade Restaurada",
    description: "Descubra seu propósito e reconstrua sua identidade",
    headline: "Descubra quem você realmente é",
    subheadline: "Um programa de autoconhecimento e transformação pessoal",
    ctaText: "Quero me transformar", price: 199, originalPrice: 397, guarantee: 15,
    accentColor: "#FFD700", status: "published", type: "Curso Online",
    linkedCourseId: "course_002", paymentType: "single", installments: true, maxInstallments: 6,
    thumbnail: null,
    testimonials: [
      { name: "Carla Lima", role: "Coach", text: "Mudou minha perspectiva completamente.", rating: 5 },
    ],
    faq: [{ q: "É para iniciantes?", a: "Sim, qualquer pessoa pode participar." }],
    benefits: ["4 módulos completos","Exercícios práticos","Certificado"],
    sections: { paraQuem: true, beneficios: true, conteudo: true, mentor: true, garantia: true, faq: true, depoimentos: true },
    analytics: { visits: 4120, checkoutsStarted: 1800, sales: 499, revenue: 99301, conversionRate: 12.1 },
    createdAt: daysAgo(90), publishedAt: daysAgo(88),
  },
  {
    id: "prod_003", slug: "imersao-presencial-sp", name: "Imersão Presencial SP",
    description: "3 dias de imersão intensiva em São Paulo",
    headline: "3 dias que vão mudar sua vida",
    subheadline: "Imersão presencial com IMPLOFYs ao vivo",
    ctaText: "Garantir minha vaga", price: 1990, originalPrice: 2990, guarantee: 7,
    accentColor: "#FFD700", status: "draft", type: "Imersão",
    linkedCourseId: null, paymentType: "single", installments: true, maxInstallments: 12,
    thumbnail: null, testimonials: [], faq: [], benefits: [],
    sections: { paraQuem: true, beneficios: true, conteudo: false, mentor: true, garantia: true, faq: true, depoimentos: false },
    analytics: { visits: 0, checkoutsStarted: 0, sales: 0, revenue: 0, conversionRate: 0 },
    createdAt: daysAgo(5), publishedAt: null,
  },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: "txn_001", checkoutId: "prod_001", productName: "Mentoria PATRON", customer: { name: "Carlos Mendes", email: "carlos@email.com", cpf: "123.456.789-00", phone: "(11) 99999-0001" }, method: "card", installments: 1, amount: 997, taxa: 49.85, liquido: 947.15, status: "paid", createdAt: hoursAgo(1), paidAt: hoursAgo(1) },
  { id: "txn_002", checkoutId: "prod_001", productName: "Mentoria PATRON", customer: { name: "Ana Paula Reis", email: "anapaula@email.com", cpf: "987.654.321-00", phone: "(21) 98888-0002" }, method: "pix", installments: 1, amount: 997, taxa: 9.97, liquido: 987.03, status: "paid", createdAt: hoursAgo(4), paidAt: hoursAgo(4) },
  { id: "txn_003", checkoutId: "prod_002", productName: "Curso Identidade", customer: { name: "Juliana Costa", email: "juliana.c@email.com", cpf: "111.222.333-44", phone: "(31) 97777-0003" }, method: "card", installments: 3, amount: 199, taxa: 9.95, liquido: 189.05, status: "paid", createdAt: daysAgo(1), paidAt: daysAgo(1) },
  { id: "txn_004", checkoutId: "prod_001", productName: "Mentoria PATRON", customer: { name: "Roberto Lima", email: "roberto@email.com", cpf: "555.666.777-88", phone: "(41) 96666-0004" }, method: "pix", installments: 1, amount: 997, taxa: 9.97, liquido: 987.03, status: "pending", createdAt: daysAgo(1), paidAt: null },
  { id: "txn_005", checkoutId: "prod_001", productName: "Mentoria PATRON", customer: { name: "Fernanda Alves", email: "fernanda@email.com", cpf: "999.888.777-66", phone: "(51) 95555-0005" }, method: "card", installments: 6, amount: 997, taxa: 49.85, liquido: 947.15, status: "refunded", createdAt: daysAgo(2), paidAt: daysAgo(2) },
];

const INITIAL_STATE: PlatformState = {
  mentor: { id: "mentor_001", name: "Carlos Mendes", email: "carlos@IMPLOFY.com", avatar: null, platformName: "Academia Mentor Pro" },
  courses: SEED_COURSES,
  products: SEED_PRODUCTS,
  students: SEED_STUDENTS,
  transactions: SEED_TRANSACTIONS,
  notifications: [
    { id: "n_001", type: "sale", title: "💰 Nova venda!", message: "Carlos Mendes comprou Mentoria PATRON — R$ 997,00", timestamp: hoursAgo(1), read: false },
    { id: "n_002", type: "alert", title: "🤖 Alerta de IA", message: "João Oliveira sem acesso há 8 dias — risco alto", timestamp: hoursAgo(2), read: false },
    { id: "n_003", type: "badge", title: "🏆 Badge desbloqueada", message: "Ana Silva conquistou: Módulo Completo", timestamp: hoursAgo(3), read: true },
  ],
  settings: {
    accentColor: "#FFD700",
    logo: null,
    platformName: "Academia Mentor Pro",
    welcomeMessage: "Bem-vindo ao seu programa de transformação",
    gamificationEnabled: true,
  },
  currentRole: "mentor",
  currentStudentId: null,
};

// ─── CONTEXT ────────────────────────────────────────────────
interface PlatformContextType {
  state: PlatformState;
  // Mutations
  createCheckout: (data: Partial<CheckoutProduct>) => CheckoutProduct;
  updateCheckout: (id: string, updates: Partial<CheckoutProduct>) => void;
  publishCheckout: (id: string) => string;
  simulatePayment: (checkoutId: string, customer: Transaction["customer"], method: Transaction["method"]) => Promise<Transaction>;
  addNotification: (n: Omit<Notification, "id">) => void;
  addStudent: (student: Student) => void;
  updateSettings: (updates: Partial<PlatformSettings>) => void;
  switchRole: (role: "mentor" | "student", studentId?: string) => void;
  resolveAlert: (alertId: string, studentId: string) => void;
  // Computed
  totalRevenue: number;
  activeStudents: number;
  studentsAtRisk: number;
  avgEngagement: number;
  avgCompletionRate: number;
  businessHealthScore: number;
  paidTransactions: Transaction[];
}

const PlatformContext = createContext<PlatformContextType | null>(null);

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
};

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlatformState>(INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  const createCheckout = useCallback((data: Partial<CheckoutProduct>): CheckoutProduct => {
    const checkout: CheckoutProduct = {
      id: generateId("prod"),
      slug: generateSlug(data.name || "novo-produto"),
      name: data.name || "Novo Produto",
      description: data.description || "",
      headline: data.headline || "Transforme seus resultados",
      subheadline: data.subheadline || "",
      ctaText: data.ctaText || "Quero começar agora",
      price: data.price || 0,
      originalPrice: data.originalPrice || 0,
      guarantee: data.guarantee || 7,
      accentColor: data.accentColor || "#FFD700",
      status: "draft",
      type: data.type || "Curso Online",
      linkedCourseId: data.linkedCourseId || null,
      paymentType: data.paymentType || "single",
      installments: data.installments ?? true,
      maxInstallments: data.maxInstallments || 12,
      thumbnail: null,
      testimonials: data.testimonials || [],
      faq: data.faq || [],
      benefits: data.benefits || [],
      sections: data.sections || { paraQuem: true, beneficios: true, conteudo: true, mentor: true, garantia: true, faq: true, depoimentos: true },
      analytics: { visits: 0, checkoutsStarted: 0, sales: 0, revenue: 0, conversionRate: 0 },
      createdAt: new Date().toISOString(),
      publishedAt: null,
    };
    setState(s => ({ ...s, products: [...s.products, checkout] }));
    return checkout;
  }, []);

  const updateCheckout = useCallback((id: string, updates: Partial<CheckoutProduct>) => {
    setState(s => ({
      ...s,
      products: s.products.map(p => p.id === id ? { ...p, ...updates, slug: updates.name ? generateSlug(updates.name) : p.slug } : p),
    }));
  }, []);

  const publishCheckout = useCallback((id: string): string => {
    let url = "";
    setState(s => ({
      ...s,
      products: s.products.map(p => {
        if (p.id !== id) return p;
        const slug = generateSlug(p.name);
        url = `/checkout/${slug}`;
        return { ...p, status: "published" as const, slug, publishedAt: new Date().toISOString() };
      }),
    }));
    return url;
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id">) => {
    setState(s => ({
      ...s,
      notifications: [{ ...n, id: generateId("n") }, ...s.notifications],
    }));
  }, []);

  const addStudent = useCallback((student: Student) => {
    setState(s => ({ ...s, students: [student, ...s.students] }));
  }, []);

  const simulatePayment = useCallback(async (checkoutId: string, customer: Transaction["customer"], method: Transaction["method"]): Promise<Transaction> => {
    const s = stateRef.current;
    const product = s.products.find(p => p.id === checkoutId);
    if (!product) throw new Error("Product not found");

    const amount = product.price;
    const taxRate = method === "pix" ? 0.01 : 0.05;
    const taxa = +(amount * taxRate).toFixed(2);

    const txn: Transaction = {
      id: generateId("txn"),
      checkoutId,
      productName: product.name,
      customer,
      method,
      installments: 1,
      amount,
      taxa,
      liquido: +(amount - taxa).toFixed(2),
      status: "pending",
      createdAt: new Date().toISOString(),
      paidAt: null,
    };

    setState(prev => ({ ...prev, transactions: [txn, ...prev.transactions] }));

    // Simulate payment confirmation
    const delay = method === "pix" ? 5000 : 2500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const paidTxn = { ...txn, status: "paid" as const, paidAt: new Date().toISOString() };

    // Create or find student
    const currentState = stateRef.current;
    let student = currentState.students.find(st => st.email === customer.email);
    const isNew = !student;

    if (!student) {
      student = {
        id: generateId("s"),
        name: customer.name,
        email: customer.email,
        avatar: null,
        enrolledAt: new Date().toISOString(),
        courses: [],
        progress: {},
        engagement: { score: 85, churnRisk: "low", trend: "growing", streak: 0, lastAccessAt: new Date().toISOString(), weeklyActivity: [0,0,0,0,0,0,0] },
        gamification: { xp: 0, level: "Iniciante", badges: [], streak: 0, rank: null },
        purchaseHistory: [paidTxn],
        notes: [],
        tags: [],
        alerts: [],
      };
    }

    // Enroll in course
    if (product.linkedCourseId && !student.courses.includes(product.linkedCourseId)) {
      student = {
        ...student,
        courses: [...student.courses, product.linkedCourseId],
        progress: {
          ...student.progress,
          [product.linkedCourseId]: { percentage: 0, completedLessons: [], lastLesson: null, lastAccessAt: new Date().toISOString(), studyTimeMinutes: 0 },
        },
      };
    }

    // Update analytics
    const updatedProducts = currentState.products.map(p => {
      if (p.id !== checkoutId) return p;
      const an = p.analytics;
      return { ...p, analytics: { ...an, sales: an.sales + 1, revenue: an.revenue + amount, conversionRate: +((an.sales + 1) / Math.max(an.visits, 1) * 100).toFixed(1) }};
    });

    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === txn.id ? paidTxn : t),
      students: isNew ? [student!, ...prev.students] : prev.students.map(st => st.id === student!.id ? student! : st),
      products: updatedProducts,
      notifications: [{
        id: generateId("n"),
        type: "sale",
        title: "💰 Nova venda!",
        message: `${customer.name} comprou ${product.name} — ${formatCurrency(amount)}`,
        timestamp: new Date().toISOString(),
        read: false,
      }, ...prev.notifications],
    }));

    return paidTxn;
  }, []);

  const updateSettings = useCallback((updates: Partial<PlatformSettings>) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...updates } }));
  }, []);

  const switchRole = useCallback((role: "mentor" | "student", studentId?: string) => {
    setState(s => ({ ...s, currentRole: role, currentStudentId: studentId || null }));
  }, []);

  const resolveAlert = useCallback((alertId: string, studentId: string) => {
    setState(s => ({
      ...s,
      students: s.students.map(st =>
        st.id === studentId ? { ...st, alerts: st.alerts.map(a => a.id === alertId ? { ...a, resolved: true } : a) } : st
      ),
    }));
  }, []);

  // Computed values
  const paidTransactions = state.transactions.filter(t => t.status === "paid");
  const totalRevenue = paidTransactions.reduce((acc, t) => acc + t.amount, 0);
  const activeStudents = state.students.filter(s => daysBetween(s.engagement.lastAccessAt, new Date()) <= 7).length;
  const studentsAtRisk = state.students.filter(s => s.engagement.churnRisk === "high" || s.engagement.churnRisk === "critical").length;
  const avgEngagement = state.students.length ? Math.round(state.students.reduce((a, s) => a + s.engagement.score, 0) / state.students.length) : 0;
  const allProgressValues = state.students.flatMap(s => Object.values(s.progress).map(p => p.percentage));
  const avgCompletionRate = allProgressValues.length ? Math.round(allProgressValues.reduce((a, b) => a + b, 0) / allProgressValues.length) : 0;

  const revenueScore = Math.min(totalRevenue / 100000 * 25, 25);
  const retentionScore = state.students.length ? ((state.students.length - studentsAtRisk) / state.students.length) * 25 : 25;
  const engagementScore = (avgEngagement / 100) * 25;
  const growthScore = 18; // simplified
  const businessHealthScore = Math.round(revenueScore + retentionScore + engagementScore + growthScore);

  return (
    <PlatformContext.Provider value={{
      state,
      createCheckout, updateCheckout, publishCheckout, simulatePayment,
      addNotification, addStudent, updateSettings, switchRole, resolveAlert,
      totalRevenue, activeStudents, studentsAtRisk, avgEngagement, avgCompletionRate,
      businessHealthScore, paidTransactions,
    }}>
      {children}
    </PlatformContext.Provider>
  );
};
