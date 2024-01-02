TODO da segunda entrega do projeto:

- [x] Analisar a app segura anterior (pasta app aqui);
- [x] Comparar os nossos resultados;
- [ ] Escolher 8 dos issues não implementados até agora;
- [ ] Dividir os issues em partes do frontend e backend;
- [ ] Escrever a parte destes issues no relatório;
- [x] Escolher duas das trẽs funcionalidades extra;
- [x] Dividir em partes frontend e backend;
- [x] Implementar a feature 1;
- [ ] Implementar a feature 2;
- [ ] Atualizar o relatório com as duas features implementadas.

Para analisar a app com a OWASP ASVS Checklist:

- Copiar o ficheiro excel (deixar um não modificado na pasta de analysis);
- A cada secção, analisar todas as linhas com ASVS Level de 1 (laranja);
- Por cada linha, inserir os valores Valid, Non-valid ou Not Applicable em cada coluna "Valid";
- Colocar também a source code reference onde está implementada a resolução (mais importante) do issue com o ficheiro onde está a resolução e a linha se aplicável e um comentário com a descrição de como foi resolvido;
- A coluna "tool used" não é caso usem uma ferramenta para analisar automáticamente as issues;
- Ir tirando screenshots de cada issue a comprovar que foi resolvido e colocar na pasta analysis/screenshots.

Coisas a melhorer v2:
 - CWE 434 de url parameters na webservices
 - As cenas de data protection de certeza que certeza que são boas para o frontend fazer
 - Session management é parecido à linha antes desta
 - Tbm em session management, dar logout e após algum tempo devia expirar o token


DONE | Num     | Description
-----------------------------------------
| Done | Num           | Descriptio |
| ---- | ------------- | ---------- |
|  [ x ]  | 2.7.2  | TOKENS: Expiram depois de 10 minutos ou 1h para os de JWT da google |
|  [ x ]  | 3.1.1  | RESPONSES: Remove all request parameters from the URI to the bodies or params |
|  [ x ]  | 8.3.1  | RESPONSES: Same as above mostly |
|  [ ]  | 9.1.1, 2 and 3  | RESPONSES: Implementar TLS one or two way (secure sockets) |
|  [ x ]  | 13.2.3  | RESPONSES: Origin header checks for a small improvement in request/response trust (CSRF attacks) |
|  [ ]  | 3.7.1  | AUTH: Reauth on sensitive transactions |
|  [ x ]  | 14.4.3, 4, 5 and 7  | Headers: Set the CSP, Content Type Options, Transport Security, Referrer and Security headers |
|  [ +/- ]  | 7.1.1  | MISC: Stop saving payment information, instead request it on every transaction |
|  [ ]  | 12.4.2  | MISC: Check submited files for virus with a anti-virus |
|  [ ]  | 14.5.3  | MISC: Finally fix the CORS implementation |  
