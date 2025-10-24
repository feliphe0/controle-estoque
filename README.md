# Controle de Estoque - React + Firebase (PWA)

Este projeto é um app completo de controle de estoque pensado para almoxarifado.

## Conteúdo do pacote
- Frontend: React (Vite) + Tailwind
- Firebase client config (src/firebase.js) — substitua com suas credenciais
- Cloud Functions: reservas e decremento seguro (functions/index.js)
- Firestore rules (firestore.rules)
- firebase.json para Hosting + Functions

## Como usar
1. Crie um projeto no Firebase Console
2. Ative Firestore e Storage
3. Ative Firebase Authentication (Email/Password)
4. Copie as credenciais para `src/firebase.js`
5. Na pasta `functions`, rode `npm install` e depois `firebase deploy --only functions` (ou `npm run deploy` se preferir)
6. Na raiz do frontend rode `npm install` e `npm run dev` para desenvolver
7. Para deploy do frontend, rode `npm run build` e `firebase deploy --only hosting`

## Observações
- As regras do Firestore no arquivo `firestore.rules` são um ponto de partida — revise antes de publicar.
- Funções tratam reserva e decremento, mas é recomendado testar com dados reais em ambiente de staging.
- Se quiser que eu ajuste a UX (carrinho, seleção de vários itens, notificações push, scanner QR), me diga que eu incluo.
