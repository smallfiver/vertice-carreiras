-- ============================================================
-- VagaStart — Seed de vagas, módulos e aulas
-- Execute no SQL Editor do Supabase APÓS rodar a migration inicial.
-- ============================================================

-- ---------- VAGAS (15 vagas home-office sem experiência) ----------
insert into jobs (title, company_name, logo_url, description, requirements, benefits, salary_range, application_url, is_active) values

('Atendente de Suporte ao Cliente (Home Office)', 'TechCare Brasil', null,
 'Atue no atendimento de clientes via chat e e-mail, ajudando a solucionar dúvidas sobre nossos produtos digitais. Treinamento completo fornecido pela empresa. Não exigimos experiência prévia.',
 array['Computador com internet estável','Boa comunicação escrita','Disponibilidade de 6h diárias','Ensino médio completo'],
 array['Salário fixo + bônus por desempenho','Vale-refeição R$ 600','Plano de saúde após 90 dias','100% home-office'],
 'R$ 1.800 - R$ 2.500',
 'https://forms.gle/exemplo-techcare', true),

('Assistente Administrativo Remoto', 'Nuvem Contábil', null,
 'Organização de planilhas, cadastro de clientes em sistema próprio e envio de documentos. Vaga ideal para primeiro emprego. Treinamento online de 7 dias.',
 array['Conhecimento básico em Excel/Google Sheets','Internet de pelo menos 10MB','Disponibilidade comercial','Boa organização'],
 array['Salário CLT','VR R$ 500','Auxílio home-office R$ 150','Folga no aniversário'],
 'R$ 1.600 - R$ 2.200',
 'https://forms.gle/exemplo-nuvem', true),

('Operador de Telemarketing Receptivo', 'ConectaCall', null,
 'Receba ligações de clientes interessados em planos de internet residencial. Script pronto, treinamento incluído. Sem cold calling.',
 array['Voz clara e boa dicção','Headset (fornecemos após 30 dias)','Computador básico','Ensino médio'],
 array['R$ 1.500 fixo + comissão (média R$ 3.000 total)','VR + VT','Premiações mensais','Plano de carreira'],
 'R$ 1.500 - R$ 3.500',
 'https://forms.gle/exemplo-conecta', true),

('Digitador de Dados (Entrada de Pedidos)', 'LogiFast Distribuição', null,
 'Inserção de pedidos no sistema interno a partir de planilhas enviadas pelos vendedores. Tarefa repetitiva, ideal para quem gosta de rotina.',
 array['Digitação acima de 40 palavras/min','Atenção a detalhes','Computador próprio','Sem experiência exigida'],
 array['Salário fixo','Vale-alimentação','Pagamento quinzenal','100% remoto'],
 'R$ 1.700 - R$ 2.100',
 'https://forms.gle/exemplo-logifast', true),

('Moderador de Conteúdo Online', 'SafeWeb Moderação', null,
 'Analise publicações em redes sociais e marque conteúdos que violem as diretrizes da plataforma. Treinamento pago de 5 dias.',
 array['Maior de 18 anos','Internet estável','Português correto','Disponibilidade de 6h/dia'],
 array['Salário fixo','Bônus por produtividade','Apoio psicológico gratuito','Equipamento fornecido após 60 dias'],
 'R$ 1.900 - R$ 2.600',
 'https://forms.gle/exemplo-safeweb', true),

('Assistente de Cadastro Online', 'CrediFácil Financeira', null,
 'Cadastre propostas de crédito no sistema da empresa a partir de documentos enviados pelos clientes. Função 100% operacional.',
 array['Ensino médio completo','Excel básico','Disponibilidade comercial','Computador próprio'],
 array['CLT + benefícios','VR R$ 700','Plano odontológico','Gympass'],
 'R$ 1.750 - R$ 2.300',
 'https://forms.gle/exemplo-credifacil', true),

('Atendente de SAC via WhatsApp', 'ShopExpress', null,
 'Atendimento de clientes do e-commerce via WhatsApp Business. Respostas prontas e treinamento completo.',
 array['Boa escrita em português','Smartphone próprio','Internet estável','Maior de 18 anos'],
 array['Salário fixo + comissão','VA R$ 400','Folga aos domingos','100% home-office'],
 'R$ 1.600 - R$ 2.400',
 'https://forms.gle/exemplo-shopexpress', true),

('Transcritor de Áudios (Português)', 'TransCripta', null,
 'Transcrição de áudios de entrevistas, podcasts e reuniões. Você escolhe quantos áudios pegar por dia.',
 array['Boa audição','Português correto','Digitação rápida','Fones de ouvido'],
 array['Pagamento por áudio (média R$ 2.500/mês)','Horário 100% flexível','Pagamento semanal via PIX','Suporte ativo'],
 'R$ 1.800 - R$ 3.200',
 'https://forms.gle/exemplo-transcripta', true),

('Auxiliar de Recursos Humanos Júnior', 'PeopleFirst Consultoria', null,
 'Apoio na triagem de currículos e agendamento de entrevistas. Ótima porta de entrada na área de RH.',
 array['Cursando ou completo ensino superior','Comunicação clara','Excel básico','Interesse em RH'],
 array['CLT','VR + VA','Auxílio educação','Mentoria com sênior'],
 'R$ 1.900 - R$ 2.500',
 'https://forms.gle/exemplo-peoplefirst', true),

('Redator Web Iniciante', 'ContentLab', null,
 'Produção de textos para blogs de pequenas empresas. Damos pauta, palavras-chave e revisamos antes da entrega.',
 array['Português impecável','Vontade de aprender SEO','Disponibilidade de 4h/dia','Sem experiência exigida'],
 array['Pagamento por texto (R$ 30-R$ 80 cada)','Horário flexível','Feedback constante','Pagamento mensal'],
 'R$ 1.500 - R$ 2.800',
 'https://forms.gle/exemplo-contentlab', true),

('Operador de Backoffice Bancário', 'PagaBem Soluções', null,
 'Conferência de documentos e lançamentos no sistema. Função operacional sem contato com cliente.',
 array['Ensino médio completo','Atenção a detalhes','Excel básico','Internet estável'],
 array['CLT integral','VR R$ 750','Plano de saúde','Bônus semestral'],
 'R$ 2.000 - R$ 2.700',
 'https://forms.gle/exemplo-pagabem', true),

('Atendente Comercial Inbound', 'EduOnline Cursos', null,
 'Atendimento de leads interessados em nossos cursos online. Leads pré-qualificados, nada de prospecção ativa.',
 array['Boa comunicação','Vontade de vender','Internet estável','Ensino médio'],
 array['R$ 1.500 + comissão (média R$ 4.000)','Premiações','VR R$ 500','100% remoto'],
 'R$ 1.500 - R$ 4.500',
 'https://forms.gle/exemplo-eduonline', true),

('Auxiliar de Mídias Sociais', 'BoostAgência', null,
 'Agendamento de posts, resposta a comentários e organização de pautas para clientes da agência.',
 array['Familiaridade com Instagram/TikTok','Português correto','Criatividade','Disponibilidade de 6h/dia'],
 array['Salário fixo','VA','Cursos gratuitos da agência','Plano de carreira'],
 'R$ 1.700 - R$ 2.400',
 'https://forms.gle/exemplo-boost', true),

('Assistente Virtual Generalista', 'VirtualOffice BR', null,
 'Apoio a empresários e PMEs com agenda, e-mails, planilhas e tarefas administrativas variadas.',
 array['Pacote Google Workspace básico','Boa comunicação','Proatividade','Internet estável'],
 array['Pagamento por hora (R$ 18-R$ 25/h)','Horário flexível','Pagamento quinzenal','Cliente fixo'],
 'R$ 2.000 - R$ 3.500',
 'https://forms.gle/exemplo-virtualoffice', true),

('Conferente de Pedidos E-commerce', 'MegaStore Online', null,
 'Conferência de pedidos no painel da loja antes do despacho. Rotina simples e bem definida.',
 array['Atenção a detalhes','Computador próprio','Internet estável','Ensino médio'],
 array['CLT','VR R$ 600','Auxílio home-office R$ 100','Folgas escalonadas'],
 'R$ 1.650 - R$ 2.100',
 'https://forms.gle/exemplo-megastore', true);

-- ---------- MÓDULOS DE TREINAMENTO ----------
insert into modules (title, description, sequence_order) values
('Bem-vindo à VagaStart', 'Entenda como a plataforma funciona e o que te espera nessa jornada.', 1),
('Currículo que se Destaca Sem Experiência', 'Aprenda a montar um currículo profissional mesmo no primeiro emprego.', 2),
('Entrevista de Emprego Home-Office', 'Domine entrevistas online e mostre seu valor para qualquer recrutador.', 3),
('Trabalho Remoto na Prática', 'Organização, produtividade e ferramentas essenciais do home-office.', 4);

-- ---------- AULAS ----------
-- Módulo 1: Bem-vindo
insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Como funciona a VagaStart', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Nesta aula você entende a estrutura da plataforma, o sistema de desbloqueio progressivo e como acessar as vagas.', 1
from modules where sequence_order = 1;

insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Por que vagas home-office sem experiência?', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'O mercado mudou. Veja os dados de crescimento do trabalho remoto e por que empresas estão contratando perfis sem experiência.', 2
from modules where sequence_order = 1;

-- Módulo 2: Currículo
insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'A estrutura de um currículo vencedor', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Cabeçalho, objetivo, formação, experiências e habilidades — o que colocar em cada campo quando você não tem experiência formal.', 1
from modules where sequence_order = 2;

insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Como transformar atividades comuns em experiência', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Aprenda a valorizar trabalhos voluntários, projetos pessoais e atividades do dia a dia no seu currículo.', 2
from modules where sequence_order = 2;

insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Modelos prontos e ferramentas gratuitas', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Lista das melhores plataformas para gerar seu currículo grátis em minutos: Canva, LivecCareer, Resume.io.', 3
from modules where sequence_order = 2;

-- Módulo 3: Entrevista
insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Preparando o ambiente da entrevista online', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Iluminação, fundo, áudio e roupa: o checklist completo para parecer profissional na chamada de vídeo.', 1
from modules where sequence_order = 3;

insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'As 10 perguntas mais comuns e como responder', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       '"Fale sobre você", "por que devemos te contratar", "qual sua pretensão salarial" — respostas prontas e técnica STAR.', 2
from modules where sequence_order = 3;

insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Perguntas para fazer ao recrutador', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Perguntas que mostram interesse genuíno e te diferenciam dos demais candidatos.', 3
from modules where sequence_order = 3;

-- Módulo 4: Home-office
insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Montando sua estação de trabalho', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Setup mínimo para trabalhar de casa com qualidade: cadeira, mesa, iluminação e ergonomia.', 1
from modules where sequence_order = 4;

insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Ferramentas essenciais (gratuitas)', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Google Workspace, Slack, Trello, Zoom — como usar as principais ferramentas do trabalho remoto.', 2
from modules where sequence_order = 4;

insert into lessons (module_id, title, video_url, content, sequence_order)
select id, 'Rotina, foco e produtividade', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
       'Técnica Pomodoro, time-blocking e como não cair na armadilha da procrastinação trabalhando de casa.', 3
from modules where sequence_order = 4;
