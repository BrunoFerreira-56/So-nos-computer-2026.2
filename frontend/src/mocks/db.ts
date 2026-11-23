/**
 * Banco de dados em memória da API mock.
 *
 * - Fica em `globalThis` para sobreviver ao hot reload e ser o mesmo para todos os Route Handlers.
 * - Os dados reiniciam quando o servidor de desenvolvimento reinicia.
 * - O conteúdo do seed espelha as telas do Figma (D03, D05, D07, D09, D10).
 *
 * Nada aqui deve ser importado por componentes de cliente.
 */
import type {
  CampusId,
  Conversation,
  GrammaticalGender,
  Listing,
  Message,
  Report,
  ReviewTag,
  User,
} from "@/types/domain";

export interface DbUser extends User {
  password: string;
  /** Avaliações anteriores ao seed, para chegar nos números do Figma (ex.: 4,0 com 12 avaliações). */
  ratingSeed: { sum: number; count: number };
}

export interface DbReview {
  id: string;
  targetUserId: string;
  authorId: string;
  rating: number;
  tags: ReviewTag[];
  comment: string;
  createdAt: string;
}

export interface Db {
  users: DbUser[];
  listings: Listing[];
  favorites: Record<string, string[]>;
  conversations: Conversation[];
  messages: Message[];
  reviews: DbReview[];
  reports: Report[];
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

let counter = 0;
export function newId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

/** Senha das contas de demonstração (documentada no README). */
export const DEMO_PASSWORD = "utmarket123";

function user(
  id: string,
  name: string,
  email: string,
  campus: CampusId,
  course: string,
  memberSince: number,
  gender: GrammaticalGender,
  ratingSeed = { sum: 0, count: 0 },
): DbUser {
  return { id, name, email, campus, course, memberSince, gender, password: DEMO_PASSWORD, ratingSeed };
}

function listing(data: Omit<Listing, "conversationsCount"> & { conversationsCount?: number }): Listing {
  return { conversationsCount: 0, ...data };
}

function seed(): Db {
  const users: DbUser[] = [
    user(
      "u-joao",
      "João Silva",
      "joao.silva@alunos.utfpr.edu.br",
      "cornelio-procopio",
      "Engenharia de Computação",
      2025,
      "o",
    ),
    user("u-ana", "Ana Souza", "ana.souza@alunos.utfpr.edu.br", "cornelio-procopio", "Engenharia Elétrica", 2024, "a", {
      sum: 36,
      count: 9,
    }),
    user(
      "u-lucas",
      "Lucas Pereira",
      "lucas.pereira@alunos.utfpr.edu.br",
      "londrina",
      "Engenharia Mecânica",
      2023,
      "o",
      { sum: 23, count: 5 },
    ),
    user("u-marina", "Marina Costa", "marina.costa@alunos.utfpr.edu.br", "curitiba", "Química", 2024, "a", {
      sum: 14,
      count: 3,
    }),
    user(
      "u-rafael",
      "Rafael Lima",
      "rafael.lima@alunos.utfpr.edu.br",
      "apucarana",
      "Engenharia de Computação",
      2025,
      "o",
      { sum: 9, count: 2 },
    ),
    user(
      "u-beatriz",
      "Beatriz Alves",
      "beatriz.alves@alunos.utfpr.edu.br",
      "ponta-grossa",
      "Arquitetura e Urbanismo",
      2023,
      "a",
      { sum: 19, count: 4 },
    ),
  ];

  const listings: Listing[] = [
    listing({
      id: "l-calc",
      title: "Calculadora HP 50g — pouco usada",
      priceCents: 44990,
      description:
        "Calculadora usada durante 2 semestres de Engenharia. Acompanha capa, manual e cabo USB. Tela sem riscos, teclas funcionando perfeitamente e pilhas novas. Ideal para Cálculo, Física e Circuitos.",
      category: "eletronicos",
      condition: "bom-estado",
      campus: "cornelio-procopio",
      status: "disponivel",
      images: ["/mock/calc.png", "/mock/calc.png", "/mock/calc.png", "/mock/calc.png", "/mock/calc.png"],
      pickup: "Bloco K ou combinar pelo chat",
      sellerId: "u-ana",
      createdAt: ago(2 * DAY),
      conversationsCount: 5,
    }),
    listing({
      id: "l-livro",
      title: "Livro Cálculo Vol. 1 — Stewart, 7ª edição",
      priceCents: 7990,
      description: "7ª edição, poucas marcações a lápis. Retiro no bloco E.",
      category: "livros",
      condition: "bom-estado",
      campus: "londrina",
      status: "disponivel",
      images: ["/mock/livro.png", "/mock/livro.png", "/mock/livro.png"],
      pickup: "Bloco E",
      sellerId: "u-joao",
      createdAt: ago(3 * DAY),
      conversationsCount: 5,
    }),
    listing({
      id: "l-jaleco-m",
      title: "Jaleco branco tamanho M",
      priceCents: 5990,
      description: "Jaleco de algodão, usado em um semestre de laboratório de Química. Lavado e sem manchas.",
      category: "vestuario",
      condition: "como-novo",
      campus: "curitiba",
      status: "disponivel",
      images: ["/mock/jaleco.png"],
      pickup: "Sede Centro",
      sellerId: "u-marina",
      createdAt: ago(3 * DAY + 2 * HOUR),
      conversationsCount: 2,
    }),
    listing({
      id: "l-notebook",
      title: "Notebook Dell i5 8 GB com carregador",
      priceCents: 124900,
      description:
        "Dell Inspiron, Intel Core i5, 8 GB de RAM, SSD de 256 GB. Bateria dura cerca de 4 horas. Acompanha carregador original.",
      category: "eletronicos",
      condition: "bom-estado",
      campus: "cornelio-procopio",
      status: "disponivel",
      images: ["/mock/notebook.png"],
      pickup: "Biblioteca",
      sellerId: "u-lucas",
      createdAt: ago(4 * DAY),
      conversationsCount: 8,
    }),
    listing({
      id: "l-arduino",
      title: "Kit Arduino Uno + protoboard e jumpers",
      priceCents: 3490,
      description: "Arduino Uno R3, protoboard de 830 pontos, jumpers macho-macho e alguns LEDs e resistores.",
      category: "laboratorio",
      condition: "como-novo",
      campus: "apucarana",
      status: "disponivel",
      images: ["/mock/arduino.png"],
      pickup: "Bloco A",
      sellerId: "u-rafael",
      createdAt: ago(5 * DAY),
      conversationsCount: 3,
    }),
    listing({
      id: "l-fisica",
      title: "Apostila de Física Experimental",
      priceCents: 2490,
      description: "Apostila completa de Física Experimental I com relatórios de exemplo. Algumas anotações a caneta.",
      category: "livros",
      condition: "marcas-de-uso",
      campus: "cornelio-procopio",
      status: "disponivel",
      images: ["/mock/fisica.png"],
      pickup: "Bloco E",
      sellerId: "u-joao",
      createdAt: ago(6 * DAY),
      conversationsCount: 0,
    }),
    listing({
      id: "l-cadeira",
      title: "Cadeira de escritório giratória",
      priceCents: 14990,
      description: "Cadeira ergonômica com regulagem de altura. Ótima para estudar em casa.",
      category: "moveis",
      condition: "bom-estado",
      campus: "londrina",
      status: "disponivel",
      images: ["/mock/cadeira.png"],
      pickup: "Combinar pelo chat",
      sellerId: "u-lucas",
      createdAt: ago(7 * DAY),
      conversationsCount: 1,
    }),
    listing({
      id: "l-bike",
      title: "Bicicleta aro 26 — ótima para ir ao campus",
      priceCents: 29990,
      description: "Bicicleta aro 26 com cestinha, 18 marchas, pneus calibrados e revisão feita no mês passado.",
      category: "transporte",
      condition: "bom-estado",
      campus: "ponta-grossa",
      status: "disponivel",
      images: ["/mock/bike.png"],
      pickup: "Entrada principal",
      sellerId: "u-beatriz",
      createdAt: ago(8 * DAY),
      conversationsCount: 4,
    }),
    listing({
      id: "l-multi",
      title: "Multímetro digital Minipa",
      priceCents: 11990,
      description: "Multímetro Minipa ET-1002 com pontas de prova. Funciona perfeitamente.",
      category: "laboratorio",
      condition: "bom-estado",
      campus: "cornelio-procopio",
      status: "disponivel",
      images: ["/mock/multi.png"],
      pickup: "Bloco P",
      sellerId: "u-ana",
      createdAt: ago(9 * DAY),
      conversationsCount: 2,
    }),
    listing({
      id: "l-circuitos",
      title: "Apostila de Circuitos Elétricos I",
      priceCents: 3990,
      description: "Caderno de resumos e exercícios resolvidos de Circuitos Elétricos I.",
      category: "livros",
      condition: "bom-estado",
      campus: "cornelio-procopio",
      status: "disponivel",
      images: ["/mock/circuitos.png"],
      pickup: "Bloco K",
      sellerId: "u-ana",
      createdAt: ago(10 * DAY),
      conversationsCount: 1,
    }),
    listing({
      id: "l-jaleco-p",
      title: "Jaleco branco tamanho P",
      priceCents: 4500,
      description: "Jaleco usado poucas vezes.",
      category: "vestuario",
      condition: "como-novo",
      campus: "cornelio-procopio",
      status: "vendido",
      images: ["/mock/jaleco.png"],
      pickup: "Bloco E",
      sellerId: "u-joao",
      createdAt: ago(12 * DAY),
      conversationsCount: 3,
    }),
    listing({
      id: "l-casio",
      title: "Calculadora científica Casio fx-82",
      priceCents: 6000,
      description: "Calculadora científica simples, permitida em provas.",
      category: "eletronicos",
      condition: "marcas-de-uso",
      campus: "cornelio-procopio",
      status: "inativo",
      images: ["/mock/calc.png"],
      pickup: "Bloco E",
      sellerId: "u-joao",
      createdAt: ago(15 * DAY),
      conversationsCount: 0,
    }),
  ];

  const conversations: Conversation[] = [
    { id: "c-ana", listingId: "l-calc", buyerId: "u-joao", sellerId: "u-ana", updatedAt: ago(1 * MINUTE) },
    { id: "c-lucas", listingId: "l-livro", buyerId: "u-lucas", sellerId: "u-joao", updatedAt: ago(2 * MINUTE) },
    { id: "c-marina", listingId: "l-jaleco-m", buyerId: "u-joao", sellerId: "u-marina", updatedAt: ago(3 * MINUTE) },
    { id: "c-rafael", listingId: "l-arduino", buyerId: "u-joao", sellerId: "u-rafael", updatedAt: ago(4 * MINUTE) },
  ];

  const read = (ms: number) => ago(ms - 30_000);
  const messages: Message[] = [
    {
      id: "m1",
      conversationId: "c-ana",
      authorId: "u-joao",
      text: "Oi! A calculadora ainda está disponível?",
      createdAt: ago(5 * MINUTE),
      readAt: read(5 * MINUTE),
    },
    {
      id: "m2",
      conversationId: "c-ana",
      authorId: "u-ana",
      text: "Está sim! Posso entregar no bloco P amanhã, depois das 10h.",
      createdAt: ago(4 * MINUTE),
      readAt: read(4 * MINUTE),
    },
    {
      id: "m3",
      conversationId: "c-ana",
      authorId: "u-joao",
      text: "Perfeito. Faz por R$ 420?",
      createdAt: ago(3 * MINUTE),
      readAt: read(3 * MINUTE),
    },
    {
      id: "m4",
      conversationId: "c-ana",
      authorId: "u-ana",
      text: "Fecho por R$ 430 e mando a capa junto 🙂",
      createdAt: ago(1 * MINUTE),
      readAt: read(1 * MINUTE),
    },

    {
      id: "m5",
      conversationId: "c-lucas",
      authorId: "u-lucas",
      text: "Oi! O livro ainda está disponível?",
      createdAt: ago(10 * MINUTE),
      readAt: read(10 * MINUTE),
    },
    {
      id: "m6",
      conversationId: "c-lucas",
      authorId: "u-joao",
      text: "Está sim!",
      createdAt: ago(8 * MINUTE),
      readAt: read(8 * MINUTE),
    },
    {
      id: "m7",
      conversationId: "c-lucas",
      authorId: "u-lucas",
      text: "Você aceita R$ 70?",
      createdAt: ago(2 * MINUTE),
      readAt: null,
    },

    {
      id: "m8",
      conversationId: "c-marina",
      authorId: "u-joao",
      text: "Posso buscar amanhã às 9h na sede Centro?",
      createdAt: ago(6 * MINUTE),
      readAt: read(6 * MINUTE),
    },
    {
      id: "m9",
      conversationId: "c-marina",
      authorId: "u-marina",
      text: "Combinado, até amanhã!",
      createdAt: ago(3 * MINUTE),
      readAt: read(3 * MINUTE),
    },

    {
      id: "m10",
      conversationId: "c-rafael",
      authorId: "u-joao",
      text: "Ainda tem os jumpers?",
      createdAt: ago(4 * MINUTE),
      readAt: read(4 * MINUTE),
    },
  ];

  const reviews: DbReview[] = [
    {
      id: "r1",
      targetUserId: "u-ana",
      authorId: "u-lucas",
      rating: 4,
      tags: ["como-anunciado"],
      comment: "Produto exatamente como anunciado, entrega rápida no bloco K.",
      createdAt: ago(3 * DAY),
    },
    {
      id: "r2",
      targetUserId: "u-ana",
      authorId: "u-marina",
      rating: 4,
      tags: ["boa-comunicacao"],
      comment: "Muito atenciosa no chat. Recomendo!",
      createdAt: ago(14 * DAY),
    },
    {
      id: "r3",
      targetUserId: "u-ana",
      authorId: "u-rafael",
      rating: 4,
      tags: [],
      comment: "Atrasou um pouco, mas deu tudo certo.",
      createdAt: ago(31 * DAY),
    },
  ];

  return {
    users,
    listings,
    favorites: { "u-joao": ["l-livro", "l-notebook", "l-arduino"] },
    conversations,
    messages,
    reviews,
    reports: [],
  };
}

const globalForDb = globalThis as unknown as { __utmarketDb?: Db };

export function getDb(): Db {
  globalForDb.__utmarketDb ??= seed();
  return globalForDb.__utmarketDb;
}
