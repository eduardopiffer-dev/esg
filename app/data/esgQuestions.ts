export type AxisKey = "ambiental" | "governanca" | "social";
export type StageCode = "E1" | "E2" | "E3" | "E4" | "E5";

export type QuestionOption = {
  code: StageCode;
  label: string;
  value: number;
};

export type Question = {
  id: string;
  axis: AxisKey;
  title: string;
  options: QuestionOption[];
};

export const ESG_QUESTIONS: Question[] = [
  {
    id: "adaptacao-mudancas-climaticas",
    axis: "ambiental",
    title: "Adaptação às mudanças climáticas",
    options: [
      { code: "E1", value: 1, label: "A organização não possui plano de adaptação às mudanças climáticas" },
      { code: "E2", value: 2, label: "A organização está em fase de elaboração do plano de adaptação às mudanças climáticas" },
      { code: "E3", value: 3, label: "A organização possui um plano de adaptação às mudanças climáticas" },
      { code: "E4", value: 4, label: "A organização possui um plano de adaptação às mudanças climáticas, realiza monitoramento periódico e comunica seu plano às partes interessadas" },
      { code: "E5", value: 5, label: "A organização possui um plano de adaptação às mudanças climáticas, realiza monitoramento periódico, comunica seu plano às partes interessadas e engaja atores externos" },
    ],
  },
  {
    id: "biodiversidade",
    axis: "ambiental",
    title: "Conservação e Uso Sustentável da Biodiversidade",
    options: [
      { code: "E1", value: 1, label: "A organização restringe as ações de conservação da biodiversidade e os de serviços ecossistêmicos ao atendimento à requisitos legais." },
      { code: "E2", value: 2, label: "A organização realiza práticas dispersas, não integradas relacionadas à conservação da biodiversidade" },
      { code: "E3", value: 3, label: "A organização considera a conservação e uso sustentável da biodiversidade em suas práticas gerenciais, realizando ações integradas" },
      { code: "E4", value: 4, label: "A organização considera a conservação e utilização sustentável da biodiversidade como parte da estratégia de negócio" },
      { code: "E5", value: 5, label: "A organização considera a conservação e uso sustentável da biodiversidade como uma pauta de engajamento estruturado com as partes interessadas, assumindo protagonismo em seu setor de atividade e cadeia de valor." },
    ],
  },
  {
    id: "economia-circular",
    axis: "ambiental",
    title: "Economia Circular",
    options: [
      { code: "E1", value: 1, label: "A organização não possui ações referentes à economia circular" },
      { code: "E2", value: 2, label: "A organização planeja os produtos com uma perspectiva de redução de impactos no ciclo de vida" },
      { code: "E3", value: 3, label: "A organização planeja os produtos com uma perspectiva de redução de impactos no ciclo de vida, repensando o design dos produtos e priorizando a utilização de materiais reciclados" },
      { code: "E4", value: 4, label: "A organização planeja os produtos com uma perspectiva de redução de impactos no ciclo de vida, repensando o design dos produtos e priorizando a utilização de materiais reciclados. A organização estabeleceu indicadores e metas em direção à circularidade e adota medidas para extensão da vida útil do produto" },
      { code: "E5", value: 5, label: "A organização planeja os produtos com uma perspectiva de redução de impactos no ciclo de vida, repensando o design dos produtos e priorizando a utilização de materiais reciclados. A organização estabeleceu indicadores e metas em direção à circularidade e adota medidas para extensão da vida útil do produto. Além disso, a organização possui parcerias com outras indústrias para promoção da simbiose industrial." },
    ],
  },
  {
    id: "eficiencia-energetica",
    axis: "ambiental",
    title: "Eficiência Energética",
    options: [
      { code: "E1", value: 1, label: "A organização possui controle de seu consumo energético, porém não apresenta ações acerca de eficiência energética" },
      { code: "E2", value: 2, label: "A organização possui controle de seu consumo energético e está em processo de implementação de ações acerca de eficiência energética" },
      { code: "E3", value: 3, label: "A organização possui controle de seu consumo energético e ações acerca de eficiência energética" },
      { code: "E4", value: 4, label: "A organização possui controle de seu consumo energético e ações acerca de eficiência energética e possui sistema de gestão de energia implementado" },
      { code: "E5", value: 5, label: "A organização possui controle de seu consumo energético e ações acerca de eficiência energética e possui sistema de gestão de energia implementado. Além disso, possui certificação de eficiência" },
    ],
  },
  {
    id: "areas-contaminadas",
    axis: "ambiental",
    title: "Gerenciamento de Áreas Contaminadas",
    options: [
      { code: "E1", value: 1, label: "A organização realiza o gerenciamento de áreas contaminadas de acordo com o estabelecido na legislação" },
      { code: "E2", value: 2, label: "A organização realiza o gerenciamento de áreas contaminadas de acordo com o estabelecido na legislação, fazendo o monitoramento do solo e das águas subterrâneas" },
      { code: "E3", value: 3, label: "A organização realiza o gerenciamento de áreas contaminadas de acordo com o estabelecido na legislação, implementando medidas que visem substituir ou eliminar as fontes de emissão de poluentes" },
      { code: "E4", value: 4, label: "A organização realiza o gerenciamento de áreas contaminadas de acordo com o estabelecido na legislação, envolvendo partes interessadas externas, como comunidade do entorno e cadeia de valor." },
      { code: "E5", value: 5, label: "A organização assume um protagonismo em seu setor de negócio, participando de fóruns sobre gerenciamento de áreas contaminadas, apresentando ideias e ações inovadoras que que visam a melhoria do seu desempenho." },
    ],
  },
  {
    id: "gestao-ambiental",
    axis: "ambiental",
    title: "Gestão Ambiental",
    options: [
      { code: "E1", value: 1, label: "A organização não possui SGA, limitando-se à cumprir a legislação ambiental" },
      { code: "E2", value: 2, label: "A organização iniciou o processo de implementação do SGA, tendo realizado a fase de identificação de aspectos e análise de risco" },
      { code: "E3", value: 3, label: "A organização estabeleceu controles operacionais e realiza o monitoramento de seu desempenho ambiental" },
      { code: "E4", value: 4, label: "A organização promoveu a conscientização de partes interessadas internas e externas em sua gestão ambiental" },
      { code: "E5", value: 5, label: "A organização assumiu uma posição de protagonismo em seu setor de negócios" },
    ],
  },
  {
    id: "gestao-efluentes",
    axis: "ambiental",
    title: "Gestão de Efluentes",
    options: [
      { code: "E1", value: 1, label: "A organização realiza a gestão de efluentes de acordo com o estabelecido na legislação" },
      { code: "E2", value: 2, label: "A organização realiza a gestão de efluentes de acordo com o estabelecido na legislação, estabelecendo controles tradicionais para conservação da água e analisando a viabilidade de adoção de métodos alternativos de controle" },
      { code: "E3", value: 3, label: "A organização realiza a gestão de efluentes de acordo com o estabelecido na legislação, fazendo o monitoramento das vazões e características dos efluentes gerados. A organização realizou substituição de matérias-primas que possam gerar impactos negativos ao meio ambiente" },
      { code: "E4", value: 4, label: "A organização realiza a gestão de efluentes de acordo com o estabelecido na legislação, fazendo o monitoramento das vazões e características dos efluentes gerados. A organização realizou substituição de matérias-primas que possam gerar impactos negativos ao meio ambiente e possui plano de redução do volume de efluentes gerados como objetivos e metas estabelecidos" },
      { code: "E5", value: 5, label: "A organização realiza a gestão de efluentes de acordo com o estabelecido na legislação, fazendo o monitoramento das vazões e características dos efluentes gerados. A organização realizou substituição de matérias-primas que possam gerar impactos negativos ao meio ambiente, possui plano de redução do volume de efluentes gerados como objetivos e metas estabelecidos e implementou inovações tecnológicas para atingimento das metas" },
    ],
  },
  {
    id: "gestao-residuos",
    axis: "ambiental",
    title: "Gestão de Resíduos",
    options: [
      { code: "E1", value: 1, label: "A organização realiza a classificação e quantificação dos resíduos de acordo com o estabelecido na legislação" },
      { code: "E2", value: 2, label: "A organização realiza a classificação e quantificação dos resíduos de acordo com o estabelecido na legislação, segregando os resíduos na fonte" },
      { code: "E3", value: 3, label: "A organização realiza a classificação e quantificação dos resíduos de acordo com o sistema de gestão de resíduos implementado" },
      { code: "E4", value: 4, label: "A organização realiza a classificação e quantificação dos resíduos de acordo com o sistema de gestão de resíduos implementado e adota práticas de logística reversa" },
      { code: "E5", value: 5, label: "A organização realiza a classificação e quantificação dos resíduos de acordo com o sistema de gestão de resíduos implementado e adota práticas de logística reversa. Além disso, avalia os terceiros quanto à destinação correta dos resíduos" },
    ],
  },
  {
    id: "mitigacao-gee",
    axis: "ambiental",
    title: "Mitigação de Emissão de Gases de Efeito Estufa (GEE)",
    options: [
      { code: "E1", value: 1, label: "A organização não possui inventário de GEE consolidado." },
      { code: "E2", value: 2, label: "A organização possui inventário de GEE para os Escopos 1 e 2 não verificado." },
      { code: "E3", value: 3, label: "A organização possui inventário de GEE para os Escopos 1 e 2 verificado externamente." },
      { code: "E4", value: 4, label: "A organização possui inventário de GEE para os Escopos 1 e 2 verificado externamente. Possui Plano de Mitigação e faz redução de emissões de acordo com metas estabelecidas e compensa as emissões residuais." },
      { code: "E5", value: 5, label: "A organização possui inventário de GEE para os Escopos 1, 2 e 3 verificado externamente. Possui Plano de Mitigação e faz redução de emissões de acordo com metas estabelecidas e compensa as emissões residuais." },
    ],
  },
  {
    id: "poluicao-sonora",
    axis: "ambiental",
    title: "Prevenção de Poluição Sonora",
    options: [
      { code: "E1", value: 1, label: "A organização realiza o controle da poluição sonora de acordo com o estabelecido na legislação" },
      { code: "E2", value: 2, label: "A organização realiza o controle da poluição sonora de acordo com o estabelecido na legislação, fazendo o monitoramento dos níveis de ruídos e vibrações." },
      { code: "E3", value: 3, label: "A organização realiza o controle da poluição sonora de acordo com o estabelecido na legislação, implementando medidas que visem substituir ou eliminar as fontes de riscos" },
      { code: "E4", value: 4, label: "A organização realiza o controle da poluição sonora de acordo com o estabelecido na legislação, envolvendo partes interessadas externas, como comunidade do entorno e cadeia de valor." },
      { code: "E5", value: 5, label: "A organização assume um protagonismo em seu setor de negócio, participando de fóruns sobre poluição sonora e apresentando ideias e ações inovadoras que que visam a melhoria de seu desempenho." },
    ],
  },
  {
    id: "produtos-perigosos",
    axis: "ambiental",
    title: "Produtos Perigosos",
    options: [
      { code: "E1", value: 1, label: "A organização realiza o gerenciamento de produtos perigosos de acordo com o estabelecido na legislação" },
      { code: "E2", value: 2, label: "A organização realiza o gerenciamento de produtos perigosos de acordo com o estabelecido na legislação, tomando ações que diminuem os riscos relacionados ao uso dos produtos." },
      { code: "E3", value: 3, label: "A organização realiza o gerenciamento de produtos perigosos de acordo com o estabelecido na legislação, implementando medidas que visem substituir ou eliminar as fontes de riscos associados a produtos perigosos" },
      { code: "E4", value: 4, label: "A organização realiza o gerenciamento de produtos perigosos de acordo com o estabelecido na legislação, envolvendo partes interessadas externas, como comunidade do entorno e cadeia de valor." },
      { code: "E5", value: 5, label: "A organização assume um protagonismo em seu setor de negócio, participando de fóruns sobre produtos perigosos, apresentando ideias e ações inovadoras que que visam a melhoria do seu desempenho." },
    ],
  },
  {
    id: "qualidade-ar",
    axis: "ambiental",
    title: "Qualidade do Ar (Emissão de poluentes)",
    options: [
      { code: "E1", value: 1, label: "A organização realiza a gestão da qualidade do ar de acordo com o estabelecido na legislação" },
      { code: "E2", value: 2, label: "A organização realiza a gestão da qualidade do ar de acordo com o estabelecido na legislação, fazendo o monitoramento das emissões." },
      { code: "E3", value: 3, label: "A organização realiza a gestão da qualidade do ar de acordo com o estabelecido na legislação, implementando medidas que visem substituir ou eliminar as fontes de emissão de poluentes" },
      { code: "E4", value: 4, label: "A organização realiza a gestão da qualidade do ar de acordo com o estabelecido na legislação, envolvendo partes interessadas externas, como comunidade do entorno e cadeia de valor." },
      { code: "E5", value: 5, label: "A organização assume um protagonismo em seu setor de negócio, participando de fóruns sobre gestão da qualidade do ar, apresentando ideias e ações inovadoras que que visam a melhoria de seu desempenho." },
    ],
  },
  {
    id: "uso-agua",
    axis: "ambiental",
    title: "Uso da Água",
    options: [
      { code: "E1", value: 1, label: "A organização não trata o requisito" },
      { code: "E2", value: 2, label: "A organização apenas mapeia o consumo de água com suas atividades" },
      { code: "E3", value: 3, label: "A organização mapeia o consumo de água com suas atividades, estabelecendo indicadores, metas e planos de ação para alcance das metas de redução de consumo de água" },
      { code: "E4", value: 4, label: "A organização mapeia o consumo de água com suas atividades, estabelecendo indicadores, metas e planos de ação para alcance das metas de redução de consumo de água. A organização já possui implementados projetos de reutilização de água de reuso ou aproveitamento de água da chuva. Os resultados relacionados aos projetos são divulgados publicamente" },
      { code: "E5", value: 5, label: "A organização mapeia o consumo de água com suas atividades, estabelecendo indicadores, metas e planos de ação para alcance das metas de redução de consumo de água. A organização já possui implementados projetos de reutilização de água de reuso ou aproveitamento de água da chuva. Os resultados relacionados aos projetos são divulgados publicamente. A organização possui ações dirigidas às partes externas no contexto do uso da água" },
    ],
  },
  {
    id: "uso-solo",
    axis: "ambiental",
    title: "Uso Sustentável do Solo",
    options: [
      { code: "E1", value: 1, label: "A organização restringe as ações de uso do solo ao atendimento à requisitos legais." },
      { code: "E2", value: 2, label: "A organização realiza ações dispersas de uso sustentável do solo" },
      { code: "E3", value: 3, label: "A organização integra ações de uso sustentável do solo ao gerenciamento de seus processos" },
      { code: "E4", value: 4, label: "A organização considera o uso sustentável do solo como aspecto estratégico do negócio" },
      { code: "E5", value: 5, label: "A organização promove o engajamento de partes interessadas nas ações relacionadas ao uso sustentável do solo" },
    ],
  },

  {
    id: "ambiente-legal-regulatorio",
    axis: "governanca",
    title: "Ambiente legal e regulatório",
    options: [
      { code: "E1", value: 1, label: "A organização identifica os requisitos legais e executa a avaliação da conformidade a esses requisitos." },
      { code: "E2", value: 2, label: "A organização elabora e implementa planos de ação que visem o cumprimento dos requisitos legais aplicáveis" },
      { code: "E3", value: 3, label: "A organização identifica e monitora das perdas associadas a multas e infrações incorridas em consequência ao descumprimento da regulamentação aplicável e análise da causa-raiz, com a determinação de planos de ação." },
      { code: "E4", value: 4, label: "A organização elabora e implementa programas de compliance inseridos nos planos de trabalho" },
      { code: "E5", value: 5, label: "A organização acompanha as tendências regulatórias que possam afetar o negócio." },
    ],
  },
  {
    id: "auditorias",
    axis: "governanca",
    title: "Auditorias interna e externa",
    options: [
      { code: "E1", value: 1, label: "A organização não realiza auditorias de ESG" },
      { code: "E2", value: 2, label: "A organização realiza auditoria de ESG, considerando os requisitos mínimos de auditoria, sem no entanto utilizar os resultados obtidos para melhoria do desempenho" },
      { code: "E3", value: 3, label: "A organização realiza auditoria de ESG, de forma coordenada, com engajamento da alta direção" },
      { code: "E4", value: 4, label: "A organização realiza auditoria de ESG, de forma coordenada, com engajamento da alta direção e usa os resultados para implementação de planos de ação de melhoria" },
      { code: "E5", value: 5, label: "A organização comunica os resultados das auditorias, assumindo uma postura de transparência" },
    ],
  },
  {
    id: "compliance-integridade-anticorrupcao",
    axis: "governanca",
    title: "Compliance, programa de integridade e práticas anticorrupção",
    options: [
      { code: "E1", value: 1, label: "A organização atende à legislação" },
      { code: "E2", value: 2, label: "A organização atende à legislação e define alguns requisitos voluntários para cumprir" },
      { code: "E3", value: 3, label: "A organização atende à legislação e alguns requisitos voluntários, identificando sistematicamente suas obrigações de compliance resultante de suas atividades, produtos e serviços e avaliando o impacto de suas ações" },
      { code: "E4", value: 4, label: "A organização atende à legislação e alguns requisitos voluntários, identificando sistematicamente suas obrigações de compliance resultante de suas atividades, produtos e serviços e avaliando o impacto de suas ações. Além disso, a organização avalia os riscos de compliance e estabelece política e objetivos compatíveis com a direção estratégica da organização. Quaisquer mudanças nas obrigações de compliance são identificadas e implementadas." },
      { code: "E5", value: 5, label: "A organização atende à legislação e alguns requisitos voluntários, identificando sistematicamente suas obrigações de compliance resultante de suas atividades, produtos e serviços e avaliando o impacto de suas ações. Além disso, a organização avalia os riscos de compliance e estabelece política e objetivos compatíveis com a direção estratégica da organização. Quaisquer mudanças nas obrigações de compliance são identificadas e implementadas. Existe promoção da cultura do compliance a nível organizacional" },
    ],
  },
  {
    id: "controles-internos",
    axis: "governanca",
    title: "Controles internos",
    options: [
      { code: "E1", value: 1, label: "A organização não possui controles internos sistemáticos" },
      { code: "E2", value: 2, label: "A organização possui controles internos sistemáticos" },
      { code: "E3", value: 3, label: "A organização possui um sistema de controles internos que permitem monitorar indicadores para comprovar a melhoria contínua, baseados em gestão de riscos" },
      { code: "E4", value: 4, label: "A organização possui um sistema de controles internos que permitem monitorar indicadores para comprovar a melhoria contínua, baseados em gestão de riscos e adoção de ações preventivas" },
      { code: "E5", value: 5, label: "A organização possui um sistema de controles internos que permitem monitorar indicadores para comprovar a melhoria contínua, baseados em gestão de riscos e adoção de ações preventivas na prestação de contas ao órgão de governança" },
    ],
  },
  {
    id: "engajamento-partes-interessadas",
    axis: "governanca",
    title: "Engajamento com as partes interessadas",
    options: [
      { code: "E1", value: 1, label: "A organização não identifica as partes interessadas para engajamento" },
      { code: "E2", value: 2, label: "A organização identifica as partes interessadas para engajamento" },
      { code: "E3", value: 3, label: "A organização identifica as partes interessadas para engajamento, determinando os requisitos pertinentes" },
      { code: "E4", value: 4, label: "A organização identifica as partes interessadas para engajamento, determinando os requisitos pertinentes e monitorando a efetividade das ações" },
      { code: "E5", value: 5, label: "A organização identifica as partes interessadas para engajamento, determinando os requisitos pertinentes e monitorando a efetividade das ações. Há incentivo das partes interessadas com as boas práticas de sustentabilidade" },
    ],
  },
  {
    id: "estrutura-governanca",
    axis: "governanca",
    title: "Estrutura e composição da governança",
    options: [
      { code: "E1", value: 1, label: "A organização é constituída legalmente" },
      { code: "E2", value: 2, label: "A organização é constituída legalmente e dispõe as regras de votação entre os acionistas publicamente" },
      { code: "E3", value: 3, label: "A organização é constituída legalmente, dispõe as regras de votação entre os acionistas publicamente e apresenta nos documentos societários as atribuições da diretoria. As alçadas de decisão estão claramente estabelecidas" },
      { code: "E4", value: 4, label: "A organização é constituída legalmente, dispõe as regras de votação entre os acionistas publicamente e apresenta nos documentos societários as atribuições da diretoria. As alçadas de decisão estão claramente estabelecidas. A organização possui indicadores e metas de gestão e realiza reuniões periódicas para avaliação dos indicadores gerenciais e ações de melhoria contínua do ESG" },
      { code: "E5", value: 5, label: "A organização é constituída legalmente, dispõe as regras de votação entre os acionistas publicamente e apresenta nos documentos societários as atribuições da diretoria. As alçadas de decisão estão claramente estabelecidas. A organização possui indicadores e metas de gestão e realiza reuniões periódicas para avaliação dos indicadores gerenciais e ações de melhoria contínua do ESG. A Alta Direção é composta equitativamente levando em conta questões de diversidade e inclusão" },
    ],
  },
  {
    id: "seguranca-informacao",
    axis: "governanca",
    title: "Gestão da segurança da informação",
    options: [
      { code: "E1", value: 1, label: "A organização não possui procedimentos de gestão da segurança da informação" },
      { code: "E2", value: 2, label: "A organização começou a implementação de ações isoladas de segurança da informação" },
      { code: "E3", value: 3, label: "A organização empreende ações integradas de gestão da segurança da informação" },
      { code: "E4", value: 4, label: "A organização possui e executa uma política estruturada para gestão da segurança da informação" },
      { code: "E5", value: 5, label: "A política de segurança da informação da organização envolve partes interessadas externas e a cadeia de valor" },
    ],
  },
  {
    id: "gestao-riscos-negocio",
    axis: "governanca",
    title: "Gestão de riscos do negócio",
    options: [
      { code: "E1", value: 1, label: "A organização não realiza gestão de riscos do negócio" },
      { code: "E2", value: 2, label: "A organização iniciou o processo de identificação dos riscos relacionados ao negócio." },
      { code: "E3", value: 3, label: "A organização identificou riscos e realizou uma análise para priorização." },
      { code: "E4", value: 4, label: "A organização estabeleceu planos de ação para mitigação e minimização de riscos do negócio." },
      { code: "E5", value: 5, label: "A organização adota uma cultura de transparência em relação aos riscos do negócio, sempre que possível." },
    ],
  },
  {
    id: "antitruste",
    axis: "governanca",
    title: "Práticas de combate à concorrência desleal (antitruste)",
    options: [
      { code: "E1", value: 1, label: "A organização não trata o requisito" },
      { code: "E2", value: 2, label: "A organização mapeia os principais concorrentes para monitoramento de cartéis" },
      { code: "E3", value: 3, label: "A organização mapeia os principais concorrentes para monitoramento de cartéis e estabeleceu uma política anticoncorrencial e de preços de produtos" },
      { code: "E4", value: 4, label: "A organização mapeia os principais concorrentes para monitoramento de cartéis e estabeleceu uma política anticoncorrencial e de preços de produtos. A organização adota medidas para evitar o vazamento de informações privilegiadas" },
      { code: "E5", value: 5, label: "A organização mapeia os principais concorrentes para monitoramento de cartéis e estabeleceu uma política anticoncorrencial e de preços de produtos. A organização adota medidas para evitar o vazamento de informações privilegiadas e classifica a cadeia de fornecimento a partir do risco de escassez visando coibir práticas anticoncorrenciais" },
    ],
  },
  {
    id: "privacidade-dados",
    axis: "governanca",
    title: "Privacidade de dados pessoais",
    options: [
      { code: "E1", value: 1, label: "A organização não possui procedimentos de procedimentos que assegurem a privacidade de dados pessoais" },
      { code: "E2", value: 2, label: "A organização começou a implementação de ações isoladas que assegurem a privacidade de dados pessoais" },
      { code: "E3", value: 3, label: "A organização empreende ações integradas que assegurem a privacidade de dados pessoais" },
      { code: "E4", value: 4, label: "A organização possui e executa uma política estruturada que assegura a privacidade de dados pessoais" },
      { code: "E5", value: 5, label: "A política de privacidade de dados pessoais da organização envolve partes interessadas externas e a cadeia de valor" },
    ],
  },
  {
    id: "proposito-estrategia-sustentabilidade",
    axis: "governanca",
    title: "Propósito e estratégia em relação à sustentabilidade",
    options: [
      { code: "E1", value: 1, label: "A organização não trata o requisito" },
      { code: "E2", value: 2, label: "A organização está em fase de identificação de aspectos relevantes de sustentabilidade para incorporação nos seus indicadores" },
      { code: "E3", value: 3, label: "A organização adota formalmente o compromisso com o desenvolvimento sustentável e incorpora os indicadores ESG na avaliação de seu desempenho" },
      { code: "E4", value: 4, label: "A organização adota formalmente o compromisso com o desenvolvimento sustentável, incorpora os indicadores ESG na avaliação de seu desempenho e estabelece objetivos e metas mensuráveis para seus indicadores definindo planos de ação para obtê-los" },
      { code: "E5", value: 5, label: "A organização adota formalmente o compromisso com o desenvolvimento sustentável, incorpora os indicadores ESG na avaliação de seu desempenho e estabelece objetivos e metas mensuráveis para seus indicadores definindo planos de ação para obtê-los. Além disso a organização fortalece a pauta ESG num cenário mais amplo, seja através da criação de comitê de sustentabilidade ou de assinatura de compromissos externos" },
    ],
  },
  {
    id: "relatorios-esg",
    axis: "governanca",
    title: "Relatórios ESG, de sustentabilidade e/ou relato integrado",
    options: [
      { code: "E1", value: 1, label: "A organização não possui relatório ESG" },
      { code: "E2", value: 2, label: "A organização possui relatório ESG" },
      { code: "E3", value: 3, label: "A organização possui relatório ESG adequado à abrangência do sistema ESG implementado na organização" },
      { code: "E4", value: 4, label: "A organização possui relatório ESG adequado à abrangência do sistema ESG implementado na organização com descrição de objetivos, metas e indicadores de desempenho" },
      { code: "E5", value: 5, label: "A organização possui relatório ESG adequado à abrangência do sistema ESG implementado na organização com descrição de objetivos, metas e indicadores de desempenho. A organização assegura através de verificação de terceira parte que as informações no relatório são confiáveis e rastreáveis" },
    ],
  },
  {
    id: "prestacao-contas",
    axis: "governanca",
    title: "Responsabilização (prestação de contas)",
    options: [
      { code: "E1", value: 1, label: "A organização não trata o requisito" },
      { code: "E2", value: 2, label: "A organização presta contas de sua atuação de forma transparente" },
      { code: "E3", value: 3, label: "A organização presta contas de sua atuação de forma transparente e possui lista de responsabilidades por função" },
      { code: "E4", value: 4, label: "A organização presta contas de sua atuação de forma transparente, possui lista de responsabilidades por função e estabelece metas e objetivos com planejamento estratégico" },
      { code: "E5", value: 5, label: "A organização presta contas de sua atuação de forma transparente, possui lista de responsabilidades por função e estabelece metas e objetivos com planejamento estratégico. Além disso promove treinamento periódico em todas as áreas da organização" },
    ],
  },

  {
    id: "cultura-inclusao",
    axis: "social",
    title: "Cultura e Promoção de Inclusão",
    options: [
      { code: "E1", value: 1, label: "A organização não promove a inclusão" },
      { code: "E2", value: 2, label: "A organização promove a inclusão através de sua liderança" },
      { code: "E3", value: 3, label: "A organização promove a inclusão estruturalmente através de uma política de diversidade e inclusão" },
      { code: "E4", value: 4, label: "A organização promove a inclusão estruturalmente através de uma política de diversidade e inclusão e possui um programa de diversidade implementado" },
      { code: "E5", value: 5, label: "A organização promove a inclusão estruturalmente através de uma política de diversidade e inclusão e possui um programa de diversidade implementado, promovendo ações afirmativas" },
    ],
  },
  {
    id: "desenvolvimento-profissional",
    axis: "social",
    title: "Desenvolvimento Profissional",
    options: [
      { code: "E1", value: 1, label: "A organização não promove o desenvolvimento profissional de seus trabalhadores" },
      { code: "E2", value: 2, label: "A organização promove o desenvolvimento profissional de seus trabalhadores através de ações pontuais." },
      { code: "E3", value: 3, label: "A organização possui uma política de desenvolvimento profissional de seus trabalhadores" },
      { code: "E4", value: 4, label: "A organização possui uma política de desenvolvimento profissional de seus trabalhadores e possui um programa implementado com objetivos e metas" },
      { code: "E5", value: 5, label: "A organização possui uma política de desenvolvimento profissional e implementa um programa que envolve trabalhadores e membros das comunidades afetadas" },
    ],
  },
  {
    id: "dialogo-engajamento-social",
    axis: "social",
    title: "Diálogo e Engajamento Social",
    options: [
      { code: "E1", value: 1, label: "A organização não estabelece canais de comunicação com as Partes Interessadas" },
      { code: "E2", value: 2, label: "A organização está em processo de implementação de canais de comunicação com as Partes Interessadas" },
      { code: "E3", value: 3, label: "A organização possui canais de comunicação com as Partes Interessadas implementados" },
      { code: "E4", value: 4, label: "A organização possui canais de comunicação com as Partes Interessadas implementados com um plano de comunicação interno e externo estabelecido e avaliado periodicamente" },
      { code: "E5", value: 5, label: "A organização possui canais de comunicação com as Partes Interessadas implementados com um plano de comunicação interno e externo estabelecido e avaliado periodicamente. Além disso estimula a participação dos trabalhadores nas campanhas" },
    ],
  },
  {
    id: "impacto-social",
    axis: "social",
    title: "Impacto Social",
    options: [
      { code: "E1", value: 1, label: "A organização não possui gestão de impacto social nem envolvimento com a comunidade" },
      { code: "E2", value: 2, label: "A organização está em processo de implementação de gestão de impacto social, mapeando a relação da organização com a comunidade e avaliando riscos e oportunidades" },
      { code: "E3", value: 3, label: "A organização possui gestão de impacto social implementada com plano de comunicação interno e externo transparente quanto às ações adotadas" },
      { code: "E4", value: 4, label: "A organização possui gestão de impacto social implementada com plano de comunicação interno e externo transparente quanto às ações adotadas. Há planejamento das ações e envolvimento com a comunidade através de fóruns" },
      { code: "E5", value: 5, label: "A organização possui gestão de impacto social implementada com plano de comunicação interno e externo transparente quanto às ações adotadas. Há planejamento das ações e envolvimento com a comunidade através de fóruns. A organização atende às necessidades das comunidades locais, mesmo que não sejam de sua responsabilidade, por exemplo, capacitação e assistência médica" },
    ],
  },
  {
    id: "investimento-social-privado",
    axis: "social",
    title: "Investimento Social Privado",
    options: [
      { code: "E1", value: 1, label: "A organização não tem nenhuma estrutura, processos e ações para o investimento social privado (ISP). Não há histórico de ações em passado recente" },
      { code: "E2", value: 2, label: "A organização faz algum tipo de investimento social privado (ISP), mas sem processo pré-estabelecido ou regularidade" },
      { code: "E3", value: 3, label: "A organização realiza investimento social voluntário (ISP) frequentemente e possui processos de escolha e gestão para os ISPs" },
      { code: "E4", value: 4, label: "A organização realiza investimento social voluntário (ISP) frequentemente e possui processos de escolha e gestão para os ISPs. As tomadas de decisão para o ISP são feitas através de um comitê de trabalhadores de variados níveis hierárquicos. A participação de membros da comunidade no comitê é opcional. As verbas destinadas são comunicadas internamente" },
      { code: "E5", value: 5, label: "A organização realiza investimento social voluntário (ISP) frequentemente e possui processos de escolha e gestão para os ISPs. As tomadas de decisão para o ISP são feitas através de um comitê de colaboradores de variados níveis hierárquicos e membros da comunidade. As verbas destinadas são comunicadas interna e externamente" },
    ],
  },
  {
    id: "liberdade-associacao",
    axis: "social",
    title: "Liberdade de Associação",
    options: [
      { code: "E1", value: 1, label: "A organização cumpre a legislação sobre liberdade de associação" },
      { code: "E2", value: 2, label: "A organização adota uma posição de facilitação da ação das organizações representativas dos trabalhadores" },
      { code: "E3", value: 3, label: "A organização dialoga com as organizações representativas dos trabalhadores" },
      { code: "E4", value: 4, label: "A organização assume uma posição próativa no relacionamento com as organizações representativas dos trabalhadores." },
      { code: "E5", value: 5, label: "A organização considera em suas decisões estratégicas os resultados das interações com as organizações representativas dos trabalhadores." },
    ],
  },
  {
    id: "remuneracao-beneficios",
    axis: "social",
    title: "Política de Remuneração e Benefícios",
    options: [
      { code: "E1", value: 1, label: "A organização não possui política de remuneração ou de benefícios." },
      { code: "E2", value: 2, label: "A organização está implantando uma política de remuneração ou de benefícios." },
      { code: "E3", value: 3, label: "A organização possui política de remuneração ou de benefícios implementada e, quando possível, pratica remuneração acima do valor médio de mercado" },
      { code: "E4", value: 4, label: "A organização adota práticas de remuneração e benefícios equitativos para os trabalhadores." },
      { code: "E5", value: 5, label: "A organização considera a política de remuneração e benefícios como assunto estratégico, estabelecendo metas de desempenho para toda a força de trabalho." },
    ],
  },
  {
    id: "diversidade-equidade",
    axis: "social",
    title: "Políticas e Práticas de Diversidade e Equidade",
    options: [
      { code: "E1", value: 1, label: "A organização não apresenta políticas de diversidade e equidade" },
      { code: "E2", value: 2, label: "A organização não apresenta políticas de diversidade e equidade, porém promove um ambiente de respeito a todos" },
      { code: "E3", value: 3, label: "A organização apresenta políticas de diversidade e equidade com compromisso institucional" },
      { code: "E4", value: 4, label: "A organização apresenta políticas de diversidade e equidade com compromisso institucional e estabelece objetivos estratégicos com planos de ação para atingi-los" },
      { code: "E5", value: 5, label: "A organização apresenta políticas de diversidade e equidade com compromisso institucional e estabelece objetivos estratégicos com planos de ação para atingi-los. Além disso, possui estratégia de comunicação interna e externa para divulgar o tema" },
    ],
  },
  {
    id: "qualidade-vida",
    axis: "social",
    title: "Qualidade de Vida",
    options: [
      { code: "E1", value: 1, label: "A organização não promove ações relacionadas à qualidade de vida e saúde mental dos trabalhadores" },
      { code: "E2", value: 2, label: "A organização promove ações pontuais de melhoria da qualidade de vida e da saúde mental dos trabalhadores." },
      { code: "E3", value: 3, label: "A organização promove a participação dos trabalhadores, visando identificar a sua percepção sobre qualidade de vida e saúde mental e promove ações de conscientização." },
      { code: "E4", value: 4, label: "A organização possui um programa de acompanhamento e apoio junto aos trabalhadores visando a promoção da qualidade de vida e saúde mental" },
      { code: "E5", value: 5, label: "A organização estimula e forma líderes capazes de entender a importância e promover a qualidade de vida e saúde mental dos trabalhadores." },
    ],
  },
  {
    id: "relacionamento-consumidores",
    axis: "social",
    title: "Relacionamento com Consumidores e Clientes",
    options: [
      { code: "E1", value: 1, label: "A organização cumpre os requisitos legais relacionados aos direitos do consumidor." },
      { code: "E2", value: 2, label: "A organização adota postura transparente em relação à disponibilização aos clientes e consumidores de informações sobre os produtos e serviços." },
      { code: "E3", value: 3, label: "A organização mantém canais de comunicação com clientes e consumidores, visando atender suas necessidades e expectativas" },
      { code: "E4", value: 4, label: "A organização promove o desenvolvimento de produtos e serviços levando em consideração aspectos sustentáveis." },
      { code: "E5", value: 5, label: "A organização adota uma atitude de proativa e de protagonismo nas suas relações com clientes e consumidores" },
    ],
  },
  {
    id: "relacionamento-fornecedores",
    axis: "social",
    title: "Relacionamento com Fornecedores",
    options: [
      { code: "E1", value: 1, label: "A organização não possui política de relacionamento com fornecedores." },
      { code: "E2", value: 2, label: "A organização implementa comunicação ativa com seus fornecedores" },
      { code: "E3", value: 3, label: "A organização possui processo de qualificação de fornecedores que considera o atendimento de requisitos da legislação trabalhista" },
      { code: "E4", value: 4, label: "A organização possui uma política que favorece e monitora os fornecedores que possuam melhores práticas de responsabilidade social" },
      { code: "E5", value: 5, label: "A organização incentiva que seus fornecedores assumam posição de protagonismo junto à sociedade, adotando compromissos públicos com a responsabilidade social." },
    ],
  },
  {
    id: "direitos-humanos",
    axis: "social",
    title: "Respeito aos Direitos Humanos",
    options: [
      { code: "E1", value: 1, label: "A organização não trata o requisito" },
      { code: "E2", value: 2, label: "A organização tem conhecimento dos pontos críticos do negócio e atua de forma reativa" },
      { code: "E3", value: 3, label: "A organização tem conhecimento dos pontos críticos do negócio e atua de forma proativa, garantindo o comprometimento da alta direção em DH" },
      { code: "E4", value: 4, label: "A organização tem conhecimento dos pontos críticos do negócio e atua de forma proativa, garantindo o comprometimento da alta direção em DH. Além disso, possui metas, monitora os indicadores de DH e mantem canais de denúncia" },
      { code: "E5", value: 5, label: "A organização tem conhecimento dos pontos críticos do negócio e atua de forma proativa, garantindo o comprometimento da alta direção em DH. Além disso, possui metas, monitora os indicadores de DH e mantem canais de denúncia e leva em conta os DH nas relações comerciais praticadas" },
    ],
  },
  {
    id: "saude-seguranca-ocupacional",
    axis: "social",
    title: "Saúde e Segurança Ocupacional",
    options: [
      { code: "E1", value: 1, label: "A organização atende aos requisitos legais relacionados às suas atividades." },
      { code: "E2", value: 2, label: "A organização implementa análise de riscos de SSO, bem como implementa as ações de controle e monitoramento para tornar os riscos aceitáveis" },
      { code: "E3", value: 3, label: "A organização realiza ações de conscientização da força de trabalho" },
      { code: "E4", value: 4, label: "A organização incentiva a participação direta da força de trabalho na gestão de SSO, visando promover seu engajamento" },
      { code: "E5", value: 5, label: "A organização assume protagonismo nas questões de SSO, através de sua Alta Direção" },
    ],
  },
  {
    id: "trabalho-forcado",
    axis: "social",
    title: "Combate ao Trabalho Forçado e Compulsório",
    options: [
      { code: "E1", value: 1, label: "A organização atende ao exigido na legislação trabalhista" },
      { code: "E2", value: 2, label: "A organização atende ao exigido na legislação trabalhista e princípios da Organização Internacional do Trabalho (OIT)" },
      { code: "E3", value: 3, label: "A organização atende ao exigido na legislação trabalhista e princípios da Organização Internacional do Trabalho (OIT), avaliando a situação atual de suas operações e da sua cadeia de valor" },
      { code: "E4", value: 4, label: "A organização atende ao exigido na legislação trabalhista e princípios da Organização Internacional do Trabalho (OIT), avaliando a situação atual de suas operações e da sua cadeia de valor. A organização faz o monitoramento das ações implementadas." },
      { code: "E5", value: 5, label: "A organização atende ao exigido na legislação trabalhista e princípios da Organização Internacional do Trabalho (OIT), avaliando a situação atual de suas operações e da sua cadeia de valor. A organização faz o monitoramento das ações implementadas e treina trabalhadores para o cumprimento das políticas" },
    ],
  },
  {
    id: "trabalho-infantil",
    axis: "social",
    title: "Combate ao Trabalho Infantil",
    options: [
      { code: "E1", value: 1, label: "A organização não emprega trabalhadores infantis" },
      { code: "E2", value: 2, label: "A organização não emprega trabalhadores infantis e mapeia em sua cadeia de valor operações que possam apresentar riscos de ocorrência de trabalho infantil" },
      { code: "E3", value: 3, label: "A organização não emprega trabalhadores infantis, mapeia em sua cadeia de valor operações que possam apresentar riscos de ocorrência de trabalho infantil e possui um sistema de gestão que monitora as atividades da cadeia de valor com políticas claras de combate ao trabalho infantil" },
      { code: "E4", value: 4, label: "A organização não emprega trabalhadores infantis, mapeia em sua cadeia de valor operações que possam apresentar riscos de ocorrência de trabalho infantil e possui um sistema de gestão que monitora as atividades da cadeia de valor com políticas claras de combate ao trabalho infantil. Além disso, a organização implanta cláusulas específicas quanto ao trabalho infantil nos seus contratos com sua cadeia de valor" },
      { code: "E5", value: 5, label: "A organização não emprega trabalhadores infantis, mapeia em sua cadeia de valor operações que possam apresentar riscos de ocorrência de trabalho infantil e possui um sistema de gestão que monitora as atividades da cadeia de valor com políticas claras de combate ao trabalho infantil. Além disso, a organização implanta cláusulas específicas quanto ao trabalho infantil nos seus contratos com sua cadeia de valor e participa de campanhas públicas" },
    ],
  },
];

export const AXIS_META: Record<AxisKey, { title: string; color: string; soft: string }> = {
  ambiental: {
    title: "Ambiental",
    color: "from-emerald-700 to-teal-600",
    soft: "from-emerald-50 to-teal-50",
  },
  governanca: {
    title: "Governança",
    color: "from-slate-800 to-emerald-700",
    soft: "from-slate-50 to-emerald-50",
  },
  social: {
    title: "Social",
    color: "from-cyan-700 to-sky-600",
    soft: "from-cyan-50 to-sky-50",
  },
};
