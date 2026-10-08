# 1. História de Usuário

<table>
    <thead>
        <tr style="background-color: purple; color: white" >
            <th style="border-style:solid;border-width:1px;text-align:center">ID</th>
            <th style="border-style:solid;border-width:1px;text-align:center">História de Usuário</th>
            <th style="border-style:solid;border-width:1px;text-align:center">Critérios de aceitação</th>
            <th style="border-style:solid;border-width:1px;text-align:center">Prioridade</th>
            <th style="border-style:solid;border-width:1px;text-align:center">RF/RNF relacionado</th>
            <th style="border-style:solid;border-width:1px;text-align:center">Story Points</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <span id="ustory-01"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US01</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular ou anunciante, quero fazer login com meu e-mail institucional para acessar o marketplace com a minha conta.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O cadastro e o login só aceitam e-mail institucional; qualquer outro e-mail é recusado com uma mensagem explicando o motivo.</li><li>Com credenciais válidas, o usuário entra no sistema.</li><li>Com credenciais inválidas, o sistema exibe uma mensagem de erro e mantém o usuário na tela de login.</li><li>O login funciona tanto no aplicativo quanto no site.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Alta</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF01, RNF01</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">8</td>
        </tr>
        <tr>
            <span id="ustory-02"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US02</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular, quero visualizar os anúncios disponíveis para saber o que está à venda.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O hub principal lista os anúncios disponíveis, cada um com suas informações resumidas.</li><li>O hub carrega em até 2 segundos com a internet em estado normal.</li><li>O hub é 100% responsivo e exibe todo o conteúdo sem corte ou rolagem horizontal em celular, tablet e desktop.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Alta</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF02, RNF02, RNF04</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">8</td>
        </tr>
        <tr>
            <span id="ustory-03"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US03</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular, quero abrir um anúncio e ver seus detalhes para decidir se tenho interesse.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>Ao selecionar um anúncio na listagem, o sistema abre a tela com os detalhes dele.</li><li>A tela do anúncio oferece as ações disponíveis para o usuário: favoritar, entrar em contato com o anunciante e reportar.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Alta</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF03</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">3</td>
        </tr>
        <tr>
            <span id="ustory-04"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US04</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular, quero favoritar anúncios para encontrá-los facilmente depois.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O usuário pode favoritar um anúncio a partir da listagem ou da tela de detalhes.</li><li>O usuário pode remover um anúncio dos favoritos.</li><li>O usuário consegue acessar a lista dos anúncios que favoritou.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Baixa</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF04</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">3</td>
        </tr>
        <tr>
            <span id="ustory-05"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US05</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular, quero entrar em contato com o anunciante para tirar dúvidas e combinar a compra.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>A tela do anúncio exibe uma opção para entrar em contato com o anunciante.</li><li>Ao acioná-la, o sistema abre a conversa com o anunciante no chat interno.</li><li>O contato não usa chamada de voz nem ligação, que estão fora do escopo.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Alta</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF05</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">3</td>
        </tr>
        <tr>
            <span id="ustory-06"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US06</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como anunciante, quero cadastrar um novo anúncio para divulgar um produto novo ou usado.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O usuário logado consegue acessar o formulário de criação de anúncio.</li><li>Se todos os campos obrigatórios estiverem preenchidos, o anúncio é criado e passa a aparecer na listagem.</li><li>Se faltar algum campo obrigatório, o sistema aponta qual está faltando e não cria o anúncio.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Alta</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF06</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">8</td>
        </tr>
        <tr>
            <span id="ustory-07"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US07</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como anunciante, quero editar ou excluir meus anúncios para manter as informações corretas.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O usuário vê as opções de editar e excluir apenas nos anúncios que ele mesmo criou.</li><li>Ao salvar uma edição, as alterações aparecem no anúncio.</li><li>Ao excluir, o anúncio deixa de aparecer na listagem e na busca.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Média</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF07</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">5</td>
        </tr>
        <tr>
            <span id="ustory-08"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US08</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular, quero filtrar os anúncios por campus da UTFPR para ver apenas os de interesse na minha região.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O sistema oferece um filtro com os campus da UTFPR.</li><li>Ao selecionar um campus, a listagem mostra somente os anúncios daquele campus.</li><li>O usuário pode remover o filtro e voltar a ver todos os anúncios.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Média</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF08</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">3</td>
        </tr>
        <tr>
            <span id="ustory-09"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US09</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular, quero buscar anúncios por termos-chave para encontrar rapidamente o que procuro.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O sistema oferece um campo de busca acessível no hub.</li><li>Ao buscar um termo, a listagem exibe apenas os anúncios relacionados a ele.</li><li>Se nenhum anúncio corresponder, o sistema informa que não há resultados.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Média</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF09</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">5</td>
        </tr>
        <tr>
            <span id="ustory-10"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US10</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como anunciante, quero marcar meu anúncio como "Vendido" ou "Inativo" para que os compradores saibam que ele não está mais disponível.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O usuário consegue alterar o status de um anúncio seu para "Vendido" ou "Inativo".</li><li>Após a alteração, o anúncio deixa de aparecer entre os anúncios disponíveis.</li><li>Somente o anunciante do anúncio pode alterar o status dele.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Média</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF10</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">3</td>
        </tr>
        <tr>
            <span id="ustory-11"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US11</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular ou anunciante, quero conversar pelo chat interno para negociar sem sair da plataforma.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>Os dois usuários conseguem trocar mensagens no chat.</li><li>Cada mensagem enviada chega ao destinatário com atraso máximo de 500 ms.</li><li>Se o servidor cair ou o usuário se desconectar, as mensagens já enviadas continuam salvas e aparecem na conversa quando o serviço ou a conexão voltar.</li><li>O chat é 100% responsivo em celular, tablet e desktop.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Alta</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF11, RNF03, RNF04, RNF07</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">13</td>
        </tr>
        <tr>
            <span id="ustory-12"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US12</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular ou anunciante, quero recuperar minha senha por e-mail para voltar a acessar minha conta caso a esqueça.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>A tela de login oferece a opção de recuperar a senha.</li><li>O sistema envia as instruções de recuperação ao e-mail cadastrado.</li><li>Seguindo as instruções, o usuário consegue definir uma nova senha e entrar com ela.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Média</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF12</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">5</td>
        </tr>
        <tr>
            <span id="ustory-13"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US13</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular ou anunciante, quero reportar anúncios ou perfis suspeitos para ajudar a manter a plataforma segura.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>A tela do anúncio e a do perfil oferecem a opção de reportar.</li><li>Ao enviar o report, o sistema confirma ao usuário que ele foi registrado.</li><li>O report fica registrado no sistema, associado ao anúncio ou perfil reportado.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Média</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF13</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">5</td>
        </tr>
        <tr>
            <span id="ustory-14"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US14</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como usuário regular ou anunciante, quero avaliar outros usuários para registrar minha experiência e orientar quem for negociar com eles.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>O usuário consegue enviar uma avaliação sobre outro usuário.</li><li>A avaliação enviada fica registrada e associada ao perfil do usuário avaliado.</li><li>Após o envio, o sistema confirma que a avaliação foi registrada.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Baixa</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RF14</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">5</td>
        </tr>
        <tr>
            <span id="ustory-15"></span>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">US15</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1">Eu, como novo usuário, quero acessar o chat ou criar uma venda em poucos passos para começar a usar o marketplace sem dificuldade.</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle" rowspan="1"><ol><li>A partir da tela inicial, é possível chegar ao chat em no máximo 3 cliques.</li><li>A partir da tela inicial, é possível chegar à criação de um anúncio em no máximo 3 cliques.</li></ol></td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">Média</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">RNF05</td>
            <td style="border-style:solid;border-width:1px;text-align:center;vertical-align:middle">2</td>
        </tr>
    </tbody>
</table>
