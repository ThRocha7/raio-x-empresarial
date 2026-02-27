# 🔍 Raio-X Empresarial

Questionário de diagnóstico empresarial com design minimalista e elegante.  
Desenvolvido com **Next.js**, **React** e **Tailwind CSS**.

---

## 🚀 Como rodar localmente

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

---

## 📁 Estrutura do projeto

```
raio-x-empresarial/
├── components/
│   ├── ProgressBar.js     # Barra de progresso fixa no topo (durante o quiz)
│   └── QuestionCard.js    # Card de pergunta de múltipla escolha
├── data/
│   └── questions.js       # Perguntas, opções e níveis de resultado
├── pages/
│   ├── _app.js            # Ponto de entrada Next.js
│   ├── _document.js       # HTML base customizado
│   └── index.js           # Página principal com todas as seções
├── styles/
│   └── globals.css        # Estilos globais + Tailwind
├── tailwind.config.js     # Configuração do Tailwind com paleta personalizada
└── postcss.config.js      # PostCSS para Tailwind
```

---

## ✏️ Como personalizar

### Perguntas e resultados
Edite `data/questions.js`:
- **QUESTIONS** — array de perguntas com opções e valores (peso 1–4)
- **SCORE_LEVELS** — níveis de resultado com cor, descrição e CTA
- **getScoreLevel()** — função que retorna o nível baseado na pontuação

### Número do WhatsApp (CTA de resultado)
No arquivo `pages/index.js`, localize a linha:
```js
const whatsappLink = `https://wa.me/5511999999999?text=${whatsappMessage}`;
```
Substitua `5511999999999` pelo número real (com DDI e DDD, sem espaços ou símbolos).

### Cores e tipografia
Edite `tailwind.config.js`:
- `brand.gold` — cor dourada principal
- `brand.navy` — fundo escuro principal
- `fontFamily.display` — fonte dos títulos
- `fontFamily.body` — fonte do corpo de texto

---

## ☁️ Deploy na Vercel

1. Faça o push do projeto para um repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**
3. Selecione o repositório
4. Vercel detecta automaticamente o Next.js — clique em **Deploy**

Pronto! O site estará online em segundos. ✅

---

## 🔐 Integração de dados (próximos passos)

Os dados coletados no formulário estão disponíveis no estado `formData` em `pages/index.js`.  
Para salvá-los, você pode:

- Chamar uma **API Route** do Next.js (`pages/api/`)
- Integrar com **Google Sheets** via Zapier ou Make
- Usar serviços como **Supabase**, **Firebase** ou **Airtable**
- Enviar via **webhook** para seu CRM

---

## 📜 Licença

Projeto privado — todos os direitos reservados.
