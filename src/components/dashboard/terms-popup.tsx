"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const TERMS_TEXT = `CONTRATO DE ADESÃO E TERMO DE CONSENTIMENTO INFORMADO — PLATAFORMA VÉRTICE CARREIRAS

CLÁUSULA 1ª — DA NATUREZA FICTÍCIA DO CONTEÚDO. O CONTRATANTE declara estar plenamente ciente, consciente e de acordo que todo e qualquer conteúdo disponibilizado na plataforma VÉRTICE CARREIRAS, incluindo, mas não se limitando a, vagas de emprego, descrições de cargos, nomes empresariais, faixas salariais, benefícios, requisitos, URLs de candidatura, logotipos, módulos de treinamento, aulas em vídeo, materiais didáticos, depoimentos, indicadores de progresso, métricas de conclusão, painéis administrativos e quaisquer outros elementos textuais, gráficos, sonoros, audiovisuais ou interativos, possui caráter ESTRITAMENTE FICTÍCIO, ILUSTRATIVO, EDUCACIONAL E DEMONSTRATIVO, não correspondendo a oportunidades reais de trabalho, empregadores reais, salários praticados ou processos seletivos verídicos, sendo vedada qualquer interpretação em sentido diverso, ainda que parcial, e renunciando o CONTRATANTE, neste ato, a qualquer pretensão indenizatória, moral, material, estética ou de lucros cessantes decorrente de eventual expectativa equivocada gerada pelo consumo do referido conteúdo.

CLÁUSULA 2ª — DA AUSÊNCIA DE INTERMEDIAÇÃO. A VÉRTICE CARREIRAS NÃO é agência de emprego, NÃO é empresa de recrutamento e seleção, NÃO atua como intermediadora de mão de obra, NÃO mantém relação contratual com as empresas eventualmente mencionadas, NÃO garante entrevistas, NÃO garante contratação, NÃO assegura retorno financeiro e NÃO se compromete com qualquer resultado prático decorrente do uso da plataforma, sendo seu único objeto a oferta de conteúdo educacional simulado para fins pedagógicos.

CLÁUSULA 3ª — DA INEXISTÊNCIA DE VÍNCULO. Fica expressamente consignado que nenhuma cláusula deste instrumento, nem qualquer ato praticado no âmbito da plataforma, gera, induz, sugere ou presume vínculo empregatício, societário, cooperativo, associativo, autônomo ou de prestação de serviços entre o CONTRATANTE e a VÉRTICE CARREIRAS ou entre o CONTRATANTE e quaisquer terceiros mencionados.

CLÁUSULA 4ª — DO TREINAMENTO PREPARATÓRIO. O CONTRATANTE reconhece que o acesso aos botões de candidatura está condicionado à conclusão integral (100%) do treinamento preparatório disponibilizado, sendo este um requisito didático que NÃO confere certificação profissional reconhecida por órgão regulador, NÃO substitui formação acadêmica, NÃO equivale a curso técnico, livre ou de extensão, e cujo conteúdo possui finalidade meramente orientativa.

CLÁUSULA 5ª — DA RESPONSABILIDADE DO USUÁRIO. É de exclusiva responsabilidade do CONTRATANTE: (i) a verificação independente da veracidade de qualquer oportunidade externa para a qual eventualmente seja redirecionado; (ii) a guarda de suas credenciais de acesso; (iii) o uso ético, legal e moral das informações apresentadas; (iv) a não reprodução, redistribuição ou comercialização do conteúdo da plataforma; (v) o pleno cumprimento das normas brasileiras aplicáveis, em especial Código Civil, Código de Defesa do Consumidor, Lei Geral de Proteção de Dados e legislação trabalhista vigente.

CLÁUSULA 6ª — DA POLÍTICA DE DADOS. O CONTRATANTE autoriza, em caráter irrevogável e irretratável durante a vigência deste instrumento, o tratamento de seus dados pessoais (nome, e-mail, progresso, candidaturas simuladas e metadados de navegação) para os fins exclusivos de operação da plataforma, comunicação transacional, análise estatística agregada e cumprimento de obrigações legais, declarando-se ciente das bases legais previstas na Lei nº 13.709/2018.

CLÁUSULA 7ª — DA LIMITAÇÃO DE RESPONSABILIDADE. A VÉRTICE CARREIRAS, seus sócios, administradores, colaboradores, prestadores de serviço, parceiros, afiliados e licenciadores não responderão, em nenhuma hipótese, por danos diretos, indiretos, incidentais, especiais, punitivos, exemplares ou consequenciais, perda de lucros, perda de receita, perda de oportunidade, perda de dados, perda de reputação ou qualquer outro prejuízo decorrente, direta ou indiretamente, do acesso, uso, impossibilidade de uso, falha, interrupção, lentidão, indisponibilidade, descontinuação, atualização ou modificação da plataforma.

CLÁUSULA 8ª — DO FORO E LEI APLICÁVEL. Aplica-se a este instrumento exclusivamente a legislação da República Federativa do Brasil, ficando eleito o foro da comarca da sede da VÉRTICE CARREIRAS para dirimir quaisquer controvérsias, com renúncia expressa a qualquer outro, por mais privilegiado que seja.

CLÁUSULA 9ª — DA ACEITAÇÃO. O CONTRATANTE declara que LEU, COMPREENDEU e ACEITA integralmente os termos acima, manifestando seu consentimento livre, informado, inequívoco e específico mediante o clique no botão "Aceito os termos", o qual produz os mesmos efeitos jurídicos de uma assinatura física, nos termos da MP 2.200-2/2001 e do art. 10 do Decreto nº 10.278/2020.

CLÁUSULA 10ª — DAS DISPOSIÇÕES FINAIS. Eventual tolerância quanto ao descumprimento de qualquer cláusula não importará em novação, renúncia ou alteração contratual. Caso qualquer disposição deste instrumento seja considerada nula, inválida ou inexequível, as demais permanecerão em pleno vigor.

— ANEXO I — POLÍTICA DE COOKIES, RASTREADORES E TECNOLOGIAS SIMILARES. (...) — ANEXO II — POLÍTICA DE PROPRIEDADE INTELECTUAL. (...) — ANEXO III — CÓDIGO DE CONDUTA DO USUÁRIO. (...) — ANEXO IV — POLÍTICA DE REEMBOLSO E CANCELAMENTO. (...) — ANEXO V — DECLARAÇÃO ANTIFRAUDE. (...)`;

export function TermsPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("vertice:terms-v1")) setOpen(true);
  }, []);

  if (!open) return null;

  function accept() {
    localStorage.setItem("vertice:terms-v1", new Date().toISOString());
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold">
            Termos de Uso e Consentimento
          </h2>
          <p className="text-xs text-fg-muted mt-1">
            Leia atentamente antes de continuar.
          </p>
        </div>

        <div
          className="px-5 py-4 max-h-[260px] overflow-y-auto text-fg-muted whitespace-pre-wrap select-none"
          style={{ fontSize: "6px", lineHeight: "1.25" }}
        >
          {TERMS_TEXT}
        </div>

        <div className="p-5 border-t border-border flex flex-col gap-2">
          <p className="text-[10px] text-fg-muted">
            Ao clicar abaixo você declara ter lido e aceito integralmente os
            termos acima.
          </p>
          <Button onClick={accept} className="w-full">
            Aceito os termos
          </Button>
        </div>
      </div>
    </div>
  );
}
