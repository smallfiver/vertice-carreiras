"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageCircle, BadgeCheck, Heart } from "lucide-react";

type Testimonial = {
  name: string;
  city: string;
  initials: string;
  color: string;
  rating: number;
  daysToHire: number;
  role: string;
  salary: string;
  text: string;
  likes: number;
  replies: number;
  verified: boolean;
  timeAgo: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Camila Ribeiro",
    city: "Fortaleza/CE",
    initials: "CR",
    color: "bg-pink-500",
    rating: 5,
    daysToHire: 4,
    role: "Atendente de Chat",
    salary: "R$ 2.450",
    text: "Gente, eu CHOREI quando recebi a aprovação 😭 Era mãe solo, sem nunca ter trabalhado fichada, e em 4 dias depois de terminar o treinamento já estava contratada. O módulo de entrevista online salvou minha vida — fiz exatamente o que ensinaram e o recrutador disse que eu parecia ter anos de experiência. HOJE pago meu aluguel e ainda sobra pra fralda da Helena 💖",
    likes: 1284,
    replies: 87,
    verified: true,
    timeAgo: "há 2 dias",
  },
  {
    name: "Diego Almeida",
    city: "Manaus/AM",
    initials: "DA",
    color: "bg-blue-500",
    rating: 5,
    daysToHire: 6,
    role: "SDR Outbound",
    salary: "R$ 1.800 + comissão",
    text: "Velho... eu tava DESEMPREGADO há 8 meses, devendo aluguel, quase voltando pra casa da minha mãe no interior. Entrei na Vértice MEIO descrente, confesso. Terminei o treinamento numa segunda, terça mandei currículo seguindo o modelo da aula 3, quinta fiz entrevista, DOMINGO já tinha contrato assinado. No primeiro mês bati meta e fechei R$ 4.200 com comissão. Surreal.",
    likes: 2031,
    replies: 142,
    verified: true,
    timeAgo: "há 5 dias",
  },
  {
    name: "Juliana Tavares",
    city: "Belo Horizonte/MG",
    initials: "JT",
    color: "bg-purple-500",
    rating: 5,
    daysToHire: 3,
    role: "Assistente Virtual Bilíngue",
    salary: "R$ 3.600",
    text: "TRÊS DIAS. Eu nem acreditei. Sou formada em Letras mas nunca tinha conseguido nada na área. O módulo de currículo me fez reescrever TUDO do zero — e fez sentido. Mandei pra 12 vagas no domingo, na quarta-feira já tava assinando contrato com uma empresa de Curitiba. Trabalho de casa, em pijama, ouvindo Caetano. A vida é boa demais.",
    likes: 1567,
    replies: 98,
    verified: true,
    timeAgo: "há 1 semana",
  },
  {
    name: "Rogério Pinheiro",
    city: "Recife/PE",
    initials: "RP",
    color: "bg-orange-500",
    rating: 5,
    daysToHire: 5,
    role: "Suporte N1 Helpdesk",
    salary: "R$ 2.100",
    text: "57 anos. Tinha sido demitido da fábrica depois de 22 anos. Achei que ninguém ia me contratar nunca mais. Minha filha me inscreveu na Vértice meio na marra. Fiz o treinamento todo, anotei em caderninho mesmo, à moda antiga. Em 5 dias eu tava contratado num call center remoto. Hoje atendo cliente em SP sem sair de Olinda. Obrigado, Vértice, por devolver minha dignidade. 🙏",
    likes: 3402,
    replies: 286,
    verified: true,
    timeAgo: "há 3 dias",
  },
  {
    name: "Bianca Souza",
    city: "Curitiba/PR",
    initials: "BS",
    color: "bg-green-500",
    rating: 5,
    daysToHire: 2,
    role: "Mídias Sociais Jr",
    salary: "R$ 2.800",
    text: "DOIS DIAS gente, DOIS. Eu tô em choque ainda escrevendo isso. 19 anos, nunca tinha trabalhado, achava que sem experiência ninguém olhava meu currículo. Fiz o treinamento em uma maratona de fim de semana, segunda mandei aplicação seguindo o passo a passo da aula 7, terça TINHA OFERTA. Não tô recebendo pra falar isso não, tô falando porque mudou minha vida mesmo 🥹",
    likes: 892,
    replies: 64,
    verified: true,
    timeAgo: "ontem",
  },
  {
    name: "Marcos Vinícius",
    city: "Goiânia/GO",
    initials: "MV",
    color: "bg-red-500",
    rating: 5,
    daysToHire: 7,
    role: "Vendedor Inbound",
    salary: "R$ 2.000 + comissão",
    text: "Cara, eu era motoboy e tava cansado de pegar chuva. Vi um anúncio da Vértice no Instagram, paguei meio desconfiado. Em uma semana exata depois de terminar o treinamento, fechei com uma fintech. Primeiro mês: R$ 3.700 com comissão. Segundo mês: R$ 4.900. NUNCA mais peguei chuva pra entregar marmita. Tamo junto irmão, recomendo de olhos fechados.",
    likes: 1789,
    replies: 134,
    verified: true,
    timeAgo: "há 4 dias",
  },
  {
    name: "Luana Carvalho",
    city: "Salvador/BA",
    initials: "LC",
    color: "bg-yellow-500",
    rating: 5,
    daysToHire: 6,
    role: "RH Backoffice",
    salary: "R$ 2.650",
    text: "Saí de uma relação abusiva sem nada além da roupa do corpo. Morava de favor na casa de uma amiga. Em 6 dias depois do treinamento, tinha contrato, salário e a esperança de volta. Hoje aluguei meu cantinho, comprei uma cama nova, e durmo em paz pela primeira vez em anos. A independência financeira muda TUDO. ❤️",
    likes: 4218,
    replies: 412,
    verified: true,
    timeAgo: "há 6 dias",
  },
  {
    name: "Pedro Henrique",
    city: "Florianópolis/SC",
    initials: "PH",
    color: "bg-cyan-500",
    rating: 5,
    daysToHire: 5,
    role: "Suporte de Streaming",
    salary: "R$ 2.300",
    text: "Tava trancado no quarto faz tempo, ansiedade me destruiu na pandemia, não conseguia nem fazer entrevista presencial. A Vértice me mostrou que dá pra trabalhar 100% remoto de verdade. Em 5 dias tava contratado, atendendo cliente por chat (sem precisar falar ao telefone!!). Pra quem tem TAG igual eu, é literalmente um divisor de águas.",
    likes: 2956,
    replies: 198,
    verified: true,
    timeAgo: "há 1 dia",
  },
  {
    name: "Adriana Mendes",
    city: "Porto Alegre/RS",
    initials: "AM",
    color: "bg-indigo-500",
    rating: 5,
    daysToHire: 4,
    role: "Cobrança Receptiva",
    salary: "R$ 1.950 + bônus",
    text: "Sou avó, 61 anos, criei meu neto sozinha depois que minha filha faleceu. Pensei que tava velha pra tudo. Minha vizinha de 20 anos me ensinou a usar o notebook e fizemos o treinamento JUNTAS — ela queria me ajudar. Eu fui contratada em 4 dias, ela em 6. As duas trabalhando de casa, no mesmo prédio. A vida dá voltas lindas. 🥰",
    likes: 5612,
    replies: 523,
    verified: true,
    timeAgo: "há 8 horas",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < n ? "fill-yellow-400 text-yellow-400" : "text-fg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  const [liked, setLiked] = useState(false);
  const likes = t.likes + (liked ? 1 : 0);
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <header className="flex items-start gap-3">
        <div
          className={`h-11 w-11 rounded-full grid place-items-center text-white font-semibold ${t.color}`}
        >
          {t.initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold">{t.name}</span>
            {t.verified && (
              <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/20" />
            )}
            <span className="text-xs text-fg-muted">• {t.city}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Stars n={t.rating} />
            <span className="text-xs text-fg-muted">{t.timeAgo}</span>
          </div>
        </div>
      </header>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-success/15 text-success px-2 py-1 font-medium">
          ✅ Contratada em {t.daysToHire} dias
        </span>
        <span className="rounded-full bg-card-alt px-2 py-1 text-fg-muted">
          {t.role}
        </span>
        <span className="rounded-full bg-brand/15 text-brand-accent px-2 py-1 font-medium">
          {t.salary}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
        {t.text}
      </p>

      <footer className="mt-4 flex items-center gap-4 text-sm text-fg-muted">
        <button
          onClick={() => setLiked((v) => !v)}
          className={`inline-flex items-center gap-1.5 hover:text-fg transition-colors ${
            liked ? "text-pink-500" : ""
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-pink-500" : ""}`} />
          {likes.toLocaleString("pt-BR")}
        </button>
        <button className="inline-flex items-center gap-1.5 hover:text-fg transition-colors">
          <MessageCircle className="h-4 w-4" /> {t.replies}
        </button>
        <button className="inline-flex items-center gap-1.5 hover:text-fg transition-colors ml-auto">
          <ThumbsUp className="h-4 w-4" /> Útil
        </button>
      </footer>
    </article>
  );
}

export function Testimonials() {
  const avg = (
    TESTIMONIALS.reduce((s, t) => s + t.rating, 0) / TESTIMONIALS.length
  ).toFixed(1);
  const avgDays = (
    TESTIMONIALS.reduce((s, t) => s + t.daysToHire, 0) / TESTIMONIALS.length
  ).toFixed(1);

  return (
    <section className="mt-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Histórias reais de quem começou do zero
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Pessoas sem nenhuma experiência prévia que foram contratadas logo
            após concluir o treinamento.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Stars n={5} />
              <span className="font-semibold">{avg}</span>
            </div>
            <p className="text-xs text-fg-muted">
              {TESTIMONIALS.length}+ avaliações verificadas
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-success">
              {avgDays}d
            </div>
            <p className="text-xs text-fg-muted">média de contratação</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t) => (
          <Card key={t.name} t={t} />
        ))}
      </div>

      <p className="text-[10px] text-fg-muted text-center mt-6 italic">
        * Depoimentos ilustrativos. Resultados podem variar conforme dedicação,
        perfil e mercado.
      </p>
    </section>
  );
}
