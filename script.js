(function () {
  var raiz = document.documentElement;
  var corpo = document.body;
  var MIN = 80, MAX = 200, PASSO = 10;
  var tamanho = 100;

  function guardar(chave, valor) {
    try { localStorage.setItem(chave, valor); } catch (e) { /* sem armazenamento */ }
  }
  function ler(chave) {
    try { return localStorage.getItem(chave); } catch (e) { return null; }
  }

  function aplicarFonte(valor) {
    tamanho = Math.min(MAX, Math.max(MIN, valor));
    raiz.style.setProperty('--fonte', tamanho + '%');
    document.getElementById('fonte-valor').textContent = tamanho + '%';
    guardar('fonte', tamanho);
  }

  document.getElementById('fonte-mais').addEventListener('click', function () { aplicarFonte(tamanho + PASSO); });
  document.getElementById('fonte-menos').addEventListener('click', function () { aplicarFonte(tamanho - PASSO); });

  var temas = { 'tema-padrao': '', 'tema-escuro': 'escuro', 'tema-claro': 'claro', 'tema-amarelo': 'amarelo' };

  function aplicarTema(id) {
    var nome = temas[id] || '';
    if (nome) { raiz.setAttribute('data-tema', nome); } else { raiz.removeAttribute('data-tema'); }
    guardar('tema', id);
  }

  Object.keys(temas).forEach(function (id) {
    document.getElementById(id).addEventListener('change', function () { aplicarTema(id); });
  });

  var espaco = document.getElementById('espaco');
  var links = document.getElementById('links');
  espaco.addEventListener('change', function () {
    corpo.classList.toggle('espaco', espaco.checked);
    guardar('espaco', espaco.checked ? '1' : '0');
  });
  links.addEventListener('change', function () {
    corpo.classList.toggle('links', links.checked);
    guardar('links', links.checked ? '1' : '0');
  });

  // restaurar preferências
  var f = parseInt(ler('fonte'), 10);
  if (f) { aplicarFonte(f); }
  var t = ler('tema');
  if (t && temas.hasOwnProperty(t)) { document.getElementById(t).checked = true; aplicarTema(t); }
  if (ler('espaco') === '1') { espaco.checked = true; corpo.classList.add('espaco'); }
  if (ler('links') === '1') { links.checked = true; corpo.classList.add('links'); }

  // formulário com mensagens de erro claras
  var form = document.getElementById('form-sugestao');
  var status = document.getElementById('status-form');

  function mostrarErro(campo, erro, mensagem) {
    if (mensagem) {
      erro.textContent = mensagem;
      erro.hidden = false;
      campo.setAttribute('aria-invalid', 'true');
    } else {
      erro.hidden = true;
      campo.removeAttribute('aria-invalid');
    }
    return !mensagem;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var nome = document.getElementById('nome');
    var email = document.getElementById('email');
    var okNome = mostrarErro(nome, document.getElementById('erro-nome'),
      nome.value.trim() ? '' : 'Erro: digite seu nome.');
    var okEmail = mostrarErro(email, document.getElementById('erro-email'),
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Erro: digite um e-mail válido, como nome@exemplo.com.');

    if (!okNome) { nome.focus(); status.textContent = 'O formulário tem erros. Corrija os campos marcados.'; return; }
    if (!okEmail) { email.focus(); status.textContent = 'O formulário tem erros. Corrija os campos marcados.'; return; }
    status.textContent = 'Obrigado, ' + nome.value.trim() + '! Sua sugestão foi registrada.';
    form.reset();
  });

  // checklist
  var itens = document.querySelectorAll('.checklist input');
  var progresso = document.getElementById('progresso');
  function atualizar() {
    var feitos = document.querySelectorAll('.checklist input:checked').length;
    progresso.textContent = feitos + ' de ' + itens.length + ' itens concluídos.' +
      (feitos === itens.length ? ' Tudo pronto para publicar!' : '');
  }
  itens.forEach(function (i) { i.addEventListener('change', atualizar); });
})();
