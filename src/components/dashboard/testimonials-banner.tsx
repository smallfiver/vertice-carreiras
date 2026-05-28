"use client";

import { useEffect, useState } from "react";
import { Star, BadgeCheck, TrendingUp, Users, Clock } from "lucide-react";

const QUICK = [
  {
    initials: "CR",
    color: "bg-pink-500",
    name: "Camila R.",
    city: "Fortaleza/CE",
    days: 4,
    role: "Atendente Chat",
    text: "Mãe solo, sem experiência. Contratada em 4 dias depois do treinamento. Hoje pago aluguel sozinha 💖",
  },
  {
    initials: "DA",
    color: "bg-blue-500",
    name: "Diego A.",
    city: "Manaus/AM",
    days: 6,
    role: "SDR Outbound",
    text: "8 meses desempregado. Terminei o treinamento na segunda, domingo já tinha contrato. Primeiro mês: R$ 4.200.",
  },
  {
    initials: "BS",
    color: "bg-green-500",
    name: "Bianca S.",
    city: "Curitiba/PR",
    days: 2,
    role: "Mídias Sociais",
    text: "19 anos, primeiro emprego. DOIS dias depois do treinamento já tava com oferta na mão. Tô em choque 🥹",
  },
  {
    initials: "RP",
    color: "bg-orange-500",
    name: "Rogério P.",
    city: "Recife/PE",
    days: 5,
    role: "Suporte Helpdesk",
    text: "57 anos, demitido da fábrica. Achei que ninguém ia me contratar. 5 dias e tava trabalhando de casa 🙏",
  },
  {
    initials: "LC",
    color: "bg-yellow-500",
    name: "Luana C.",
    city: "Salvador/BA",
    days: 6,
    role: "RH Backoffice",
    text: "Saí de uma relação abusiva sem nada. Em 6 dias tinha salário, casa e dignidade de volta. ❤️",
  },
];

export function TestimonialsBanner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % QUICK.length), 4500);
    return () => clearInterval(id);
  }, []);
  const t = QUICK[i];

  return (
    <div className="max-w-7xl mx-auto mb-4">
      <div className="rounded-2xl border border-success/30 bg-gradient-to-br from-success/10 via-brand/5 to-transparent p-4 md:p-5">
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
          {/* Rotating testimonial */}
          <div className="flex items-start gap-3 min-h-[88px]">
            <div
              className={`h-12 w-12 rounded-full grid place-items-center text-white font-semibold shrink-0 ${t.color}`}
            >
              {t.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm">{t.name}</span>
                <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/20" />
                <span className="text-xs text-fg-muted">• {t.city}</span>
                <span className="ml-1 rounded-full bg-success/20 text-success px-2 py-0.5 text-[10px] font-semibold">
                  ✅ {t.days} dias até a contratação
                </span>
              </div>
              <div className="flex gap-0.5 mt-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, n) => (
                  <Star
                    key={n}
                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-[10px] text-fg-muted ml-1.5">
                  {t.role}
                </span>
              </div>
              <p className="text-sm text-fg leading-snug">{t.text}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 md:border-l md:border-border md:pl-5">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-success">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xl md:text-2xl font-bold">4.7d</span>
              </div>
              <p className="text-[10px] text-fg-muted leading-tight">
                média até<br />contratação
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-brand-accent">
                <Users className="h-4 w-4" />
                <span className="text-xl md:text-2xl font-bold">9.842</span>
              </div>
              <p className="text-[10px] text-fg-muted leading-tight">
                alunos<br />contratados
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-yellow-400" />
                <span className="text-xl md:text-2xl font-bold">4.9</span>
              </div>
              <p className="text-[10px] text-fg-muted leading-tight">
                de 5<br />estrelas
              </p>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {QUICK.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Depoimento ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-success" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
