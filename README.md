# 🗳️ Colinha Lelo Couto - Santinho Digital Interativo

Aplicação web leve, moderna e responsiva construída puramente com **HTML5, CSS3 e JavaScript puro**, desenvolvida para permitir que eleitores personalizem seu santinho de votação com seus candidatos, visualizem o resultado perfeitamente enquadrado, baixem a imagem em alta resolução para levar no dia da eleição ou compartilhem via WhatsApp.

---

## 🎯 Configuração Oficial dos Candidatos
- **Deputado Federal**: `4444` (Oficial - 4 caixas preenchidas)
- **Deputado Estadual**: `15444` (Lelo Couto - 5 caixas fixas na arte)
- **Senador 1º Voto**: `400` (Oficial - 3 caixas preenchidas)
- **Senador 2º Voto**: Aberto para o eleitor preencher (3 dígitos)
- **Governador**: `15` (Oficial - 2 caixas preenchidas)
- **Presidente**: Aberto para o eleitor preencher (2 dígitos)

---

## 🚀 Como Executar Localmente

Basta dar dois cliques no arquivo `index.html` ou arrastá-lo para qualquer navegador.

Se desejar subir com servidor local:
```bash
python -m http.server 8000
```
Acesse `http://localhost:8000`.

---

## 📊 Coleta Silenciosa de Métricas no Google Sheets

As métricas são coletadas **exclusivamente em segundo plano** (não ficam visíveis para o eleitor final na página). Toda vez que alguém clica em **"Baixar Santinho"**, os dados escolhidos são enviados silenciosamente para a sua Planilha Google.

### Solução para o erro do Google Drive ("Não foi possível abrir o arquivo"):
Esse erro ocorre quando existem **múltiplas contas Google conectadas ao mesmo tempo no navegador** (o Google Drive tenta abrir com a conta secundária e bloqueia).

### Passo a Passo sem Erro (Opção Direta):
1. Crie uma planilha no [Google Sheets](https://sheets.new) chamada `Metricas_Colinha_Lelo_Couto`.
2. Na Linha 1, crie os cabeçalhos:
   `ID | Data/Hora | Deputado Federal | Deputado Estadual | Senador 1 | Senador 2 | Governador | Presidente | Dispositivo`
3. Copie o ID da sua planilha (é a sequência de letras e números na URL entre `/d/` e `/edit`).
4. Abra em uma janela anônima ou na sua conta principal o link: **[https://script.google.com/home/start](https://script.google.com/home/start)**
5. Clique em **"+ Novo projeto"** (ou use Extensões > Apps Script na planilha em janela anônima).
6. Cole o código do arquivo [`google-sheets-script.js`](./google-sheets-script.js).
7. Se criou pelo link direto, coloque o ID da planilha na variável `SPREADSHEET_ID`.
8. Clique no botão azul **Implantar (Deploy) > Nova implantação**.
9. Em tipo, selecione **App da Web (Web App)**:
   - **Executar como**: `Eu`
   - **Quem pode acessar**: `Qualquer pessoa` (Anyone)
10. Clique em **Implantar** e copie a URL gerada (termina com `/exec`).
11. Cole essa URL no arquivo `assets/js/config.js` no campo `metricsWebhookUrl`.

---

## 🌐 Como Fazer o Deploy (GitHub Pages ou Vercel)

### Opção 1: Vercel (Recomendado - Gratuito e Instantâneo)
1. Suba esta pasta para um repositório no seu GitHub.
2. Acesse [vercel.com](https://vercel.com) e importe o repositório.
3. Clique em **Deploy**.

### Opção 2: GitHub Pages
1. Crie um repositório no GitHub e envie os arquivos.
2. Acesse **Settings** > **Pages**.
3. Selecione o branch `main` e a pasta `/ (root)`.
4. Clique em **Save**.
