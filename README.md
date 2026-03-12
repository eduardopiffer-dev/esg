# Sustence ESG Diagnóstico — Next.js

Projeto pronto para deploy na Vercel.

## O que este app faz
- Inserção manual das respostas do formulário ESG
- Cálculo automático de maturidade com base na lógica E1 a E5
- Dashboard com gráficos
- Diagnóstico por eixo Ambiental, Social e Governança
- Relatório final pronto para impressão em PDF
- Exportação dos dados em JSON
- Logo da Sustence já configurada em `public/logo-sustence.png`

## Rodar localmente
```bash
npm install
npm run dev
```

Abra:
```bash
http://localhost:3000
```

## Deploy na Vercel em 1 clique
### Opção 1 — via GitHub
1. Crie um repositório no GitHub
2. Envie estes arquivos para o repositório
3. Entre na Vercel
4. Clique em **Add New Project**
5. Importe o repositório
6. Clique em **Deploy**

A Vercel detecta automaticamente que é um projeto Next.js.

### Opção 2 — via terminal com Vercel CLI
```bash
npm i -g vercel
vercel
```

## Estrutura principal
- `app/page.tsx` → aplicação principal
- `app/layout.tsx` → layout base
- `app/globals.css` → estilos globais
- `public/logo-sustence.png` → logo da Sustence

## Observação técnica
Esta versão é front-end e não possui banco de dados. Para histórico de clientes, login e salvamento permanente, a próxima etapa é integrar Supabase, Firebase ou outro backend.
