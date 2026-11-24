# Central de Afiliados 24H

Painel inicial para organizar links de afiliados da Shopee e do Mercado Livre, com interface responsiva para computador e Android.

## Primeira versão
- Cadastro e organização de produtos e links.
- Busca e filtros por plataforma.
- Geração local de textos promocionais editáveis.
- Copiar link e texto para divulgação.
- Dashboard com indicadores calculados a partir dos produtos cadastrados.
- Persistência inicial no navegador (localStorage).

## Executar localmente
Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

## Escopo e limitações
Esta é a primeira versão de interface (MVP). Ela **não publica automaticamente** em redes sociais, não consulta comissões/preços em tempo real e não possui autenticação ou sincronização em nuvem. Essas funções exigem backend, credenciais e integrações oficiais autorizadas. Nunca coloque tokens ou senhas no frontend.

## Próximas etapas
1. Backend e autenticação.
2. Integrações oficiais de afiliados Shopee e Mercado Livre, conforme acesso aprovado.
3. Fila de campanhas e agendador em nuvem.
4. Integrações oficiais de publicação nas redes sociais.
5. Empacotamento Android e Windows.
