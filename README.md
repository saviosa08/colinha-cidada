# 🗳️ Colinha Lelo Couto - Santinho Digital Interativo

Aplicação web leve, moderna e responsiva construída puramente com **HTML5, CSS3 e JavaScript puro**, desenvolvida para permitir que eleitores personalizem seu santinho de votação com seus candidatos, visualizem o resultado perfeitamente enquadrado, baixem a imagem em alta resolução para levar no dia da eleição ou compartilhem via WhatsApp.

---

## 🎯 Regras de Preenchimento dos Candidatos
- **Deputado Federal**: Aberto para o eleitor preencher (4 dígitos).
- **Deputado Estadual**: Fixo `15444` (Lelo Couto - já impresso na arte).
- **Senador 1º Voto**: Aberto para o eleitor preencher (3 dígitos).
- **Senador 2º Voto**: Aberto para o eleitor preencher (3 dígitos - **obrigatório ser diferente do 1º Senador**).
- **Governador**: Aberto para o eleitor preencher (2 dígitos).
- **Presidente**: Aberto para o eleitor preencher (2 dígitos).

---

## 🔒 Validações de Segurança
- **Preenchimento Obrigatório**: Todos os campos devem estar com todos os dígitos preenchidos para permitir o download ou compartilhamento.
- **Senadores Distintos**: O sistema impede que o eleitor insira o mesmo número para o 1º e 2º voto de Senador.
- **Feedback Visual**: Em caso de pendência, o campo incompleto é destacado em vermelho com animação e foco automático.

---

## 📊 Coleta Silenciosa de Métricas no Google Sheets
Toda vez que alguém clica em **"Baixar Santinho"** ou **"Compartilhar no WhatsApp"**, os dados escolhidos são enviados silenciosamente para a sua Planilha Google, identificando a ação (`Download` ou `WhatsApp`).

### Cabeçalhos da Planilha Google (Linha 1):
`ID | Data/Hora | Ação | Deputado Federal | Deputado Estadual | Senador 1 | Senador 2 | Governador | Presidente | Dispositivo`

---

## 🌐 Deploy no GitHub Pages e Vercel
Link oficial configurado no WhatsApp: `https://colinha-cidada.vercel.app/`
