// ========================================
// FORMATAÇÃO DE INPUTS (MAX XXX,X)
// ========================================
function formatDecimal(input) {
    let value = input.value.replace(/[^0-9,.]/g, '');
    value = value.replace(',', '.');
    
    const parts = value.split('.');
    if (parts[0] && parts[0].length > 3) {
        parts[0] = parts[0].substring(0, 3);
    }
    if (parts[1] && parts[1].length > 1) {
        parts[1] = parts[1].substring(0, 1);
    }
    
    value = parts.join('.');
    input.value = value;
}

// ========================================
// DADOS DE REGÊNCIA
// ========================================
const dadosRegencia = {
    autor: [
        { value: 'araujo-2023', label: 'Araújo (2023)' },
        { value: 'kurihara-2013-1', label: 'Kurihara et al. (2013)¹' },
        { value: 'kurihara-2013-138', label: 'Kurihara et al. (2013)138' },
        { value: 'santos-2008', label: 'Santos et al. (2008)' },
        { value: 'bataglia-1977', label: 'Bataglia & Mascarenhas (1977)' },
        { value: 'borkert-1986', label: 'Borkert (1986)' },
        { value: 'cordeiro-1977', label: 'Cordeiro et al. (1977)' },
        { value: 'darwich-1993', label: 'Darwich (1993)' },
        { value: 'embrapa', label: 'EMBRAPA' },
        { value: 'portafos', label: 'Portafos' },
        { value: 'tanaka-1994', label: 'Tanaka et al. (1994)' }
    ],
    tecnologia: [
        { value: 'enlist', label: 'Enlist' },
        { value: 'xtend', label: 'Xtend' },
        { value: 'roundup-ready', label: 'Roundup Ready' }
    ],
    cultivar: [
        { value: '73i75RSF', label: '73i75RSF' },
        { value: '75i74RSF', label: '75i74RSF' },
        { value: '77EA40', label: '77EA40' },
        { value: 'ADV4681-Ipro-SR1', label: 'ADV4681 Ipro - SR1' },
        { value: 'AS3595i2x', label: 'AS3595i2x' },
        { value: 'AS3640i2x', label: 'AS3640i2x' },
        { value: 'AS3700XTD', label: 'AS3700XTD' },
        { value: 'CZ37B43', label: 'CZ37B43' },
        { value: 'Dagma-7621', label: 'Dagma 7621' },
        { value: 'DESAFIO-8473RFS', label: 'DESAFIO (8473 RFS)' },
        { value: 'DM-72IX74', label: 'DM 72IX74' },
        { value: 'FOCO-74177RFS', label: 'FOCO (74177 RFS)' },
        { value: 'Guepardo-IPRO', label: 'Guepardo IPRO' },
        { value: 'M6210Ipro', label: 'M6210 Ipro' },
        { value: 'NEOGEN720', label: 'NEOGEN 720' },
        { value: 'Olimpo-80182RFS', label: 'Olimpo (80182 RFS)' },
        { value: 'SUPERA-i2x', label: 'SUPERA i2x (BRASMAX)' }
    ]
};

let regenciaSelecionada = {
    potassio: { tipo: 'autor', especifica: '' },
    fosforo: { tipo: 'autor', especifica: '' }
};

let nutrienteAtual = '';

// ========================================
// MODAL DE REGÊNCIA
// ========================================
function abrirSeletorRegencia(nutriente) {
    nutrienteAtual = nutriente;
    const modal = document.getElementById('modalRegencia');
    document.getElementById('modalRegenciaTitulo').textContent = 
        `Tipo de regência para ${nutriente === 'potassio' ? 'Potássio' : 'Fósforo'}`;
    modal.classList.add('active');
}

function fecharModalRegencia(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('modalRegencia').classList.remove('active');
}

function selecionarRegencia(tipo) {
    regenciaSelecionada[nutrienteAtual].tipo = tipo;
    
    const tagId = `tag${nutrienteAtual.charAt(0).toUpperCase() + nutrienteAtual.slice(1)}`;
    const tag = document.getElementById(tagId);
    const emojis = { autor: '📚', tecnologia: '⚙️', cultivar: '🌱' };
    const labels = { autor: 'Autor', tecnologia: 'Tecnologia', cultivar: 'Cultivar' };
    tag.textContent = `${emojis[tipo]} ${labels[tipo]}`;
    
    atualizarDropdownReferencia(nutrienteAtual, tipo);
    
    const cardId = `card${nutrienteAtual.charAt(0).toUpperCase() + nutrienteAtual.slice(1)}`;
    document.getElementById(cardId).style.display = 'block';
    
    fecharModalRegencia();
}

function atualizarDropdownReferencia(nutriente, tipo) {
    const selectId = `selectRef${nutriente.charAt(0).toUpperCase() + nutriente.slice(1)}`;
    const select = document.getElementById(selectId);
    
    select.innerHTML = '<option value="">Selecione...</option>';
    (dadosRegencia[tipo] || []).forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
    });
}

// ========================================
// CORRETIVOS
// ========================================
let corretivosAtivos = { dolomitico: false, calcitico: false, gesso: false };

function toggleMenuCorretivo() {
    document.getElementById('correctiveMenu').classList.toggle('active');
}

function toggleCorrective(tipo) {
    corretivosAtivos[tipo] = !corretivosAtivos[tipo];
    
    const cardNames = { dolomitico: 'Dolomitico', calcitico: 'Calcitico', gesso: 'Gesso' };
    const miniCard = document.getElementById(`mini${cardNames[tipo]}`);
    const menuItem = document.querySelector(`.menu-item[onclick*="${tipo}"]`);
    
    if (corretivosAtivos[tipo]) {
        if (miniCard) miniCard.style.display = 'block';
        if (menuItem) menuItem.classList.add('selected');
    } else {
        if (miniCard) miniCard.style.display = 'none';
        if (menuItem) menuItem.classList.remove('selected');
    }
    
    document.getElementById('correctiveMenu').classList.remove('active');
}

function removeCorrective(tipo) {
    corretivosAtivos[tipo] = false;
    const cardNames = { dolomitico: 'Dolomitico', calcitico: 'Calcitico', gesso: 'Gesso' };
    const miniCard = document.getElementById(`mini${cardNames[tipo]}`);
    const menuItem = document.querySelector(`.menu-item[onclick*="${tipo}"]`);
    
    if (miniCard) miniCard.style.display = 'none';
    if (menuItem) menuItem.classList.remove('selected');
}

// ========================================
// RECOMENDAÇÃO CALAGEM
// ========================================
function gerarRecomendacaoCalagem() {
    const resultado = document.getElementById('resultadoCalagem');
    resultado.style.display = 'block';
    
    document.getElementById('recDolomitico').style.display = corretivosAtivos.dolomitico ? 'flex' : 'none';
    document.getElementById('recCalcitico').style.display = corretivosAtivos.calcitico ? 'flex' : 'none';
    document.getElementById('recGesso').style.display = corretivosAtivos.gesso ? 'flex' : 'none';
    
    if (corretivosAtivos.dolomitico) {
        document.getElementById('valorDolomitico').textContent = (Math.random() * 3 + 1).toFixed(1);
    }
    if (corretivosAtivos.calcitico) {
        document.getElementById('valorCalcitico').textContent = (Math.random() * 2 + 0.5).toFixed(1);
    }
    if (corretivosAtivos.gesso) {
        document.getElementById('valorGesso').textContent = (Math.random() * 2 + 0.5).toFixed(1);
    }
    
    atualizarGraficoCalagem();
}

function atualizarGraficoCalagem() {
    const caAntes = parseFloat(document.getElementById('inputCa')?.value) || 1.5;
    const mgAntes = parseFloat(document.getElementById('inputMg')?.value) || 0.5;
    const sAntes = 5;
    
    const caDepois = caAntes * 2;
    const mgDepois = mgAntes * 2;
    const sDepois = sAntes * 2.5;
    
    const maxCa = 5, maxMg = 2, maxS = 20;
    
    document.getElementById('barraCaAntes').style.width = `${Math.min((caAntes/maxCa)*100, 100)}%`;
    document.getElementById('barraCaDepois').style.width = `${Math.min((caDepois/maxCa)*100, 100)}%`;
    document.getElementById('valCaAntes').textContent = caAntes.toFixed(1);
    document.getElementById('valCaDepois').textContent = caDepois.toFixed(1);
    
    document.getElementById('barraMgAntes').style.width = `${Math.min((mgAntes/maxMg)*100, 100)}%`;
    document.getElementById('barraMgDepois').style.width = `${Math.min((mgDepois/maxMg)*100, 100)}%`;
    document.getElementById('valMgAntes').textContent = mgAntes.toFixed(1);
    document.getElementById('valMgDepois').textContent = mgDepois.toFixed(1);
    
    document.getElementById('barraSAntes').style.width = `${Math.min((sAntes/maxS)*100, 100)}%`;
    document.getElementById('barraSDepois').style.width = `${Math.min((sDepois/maxS)*100, 100)}%`;
    document.getElementById('valSAntes').textContent = sAntes.toFixed(0);
    document.getElementById('valSDepois').textContent = sDepois.toFixed(0);
}

// ========================================
// RECOMENDAÇÃO POTÁSSIO/FÓSFORO
// ========================================
function gerarRecomendacaoPotassio() {
    const dose = document.getElementById('dosePotassio').value || '0';
    const adubo = document.getElementById('aduboPotassio');
    const aduboNome = adubo.selectedIndex > 0 ? adubo.options[adubo.selectedIndex].text : 'Não selecionado';
    
    document.getElementById('textoPotassio').textContent = `${dose} kg/ha de ${aduboNome}`;
    document.getElementById('resultadoPotassio').style.display = 'flex';
}

function gerarRecomendacaoFosforo() {
    const dose = document.getElementById('doseFosforo').value || '0';
    const adubo = document.getElementById('aduboFosforo');
    const aduboNome = adubo.selectedIndex > 0 ? adubo.options[adubo.selectedIndex].text : 'Não selecionado';
    
    document.getElementById('textoFosforo').textContent = `${dose} kg/ha de ${aduboNome}`;
    document.getElementById('resultadoFosforo').style.display = 'flex';
}

// ========================================
// CARDS
// ========================================
function minimizeCard(cardId) {
    const content = document.getElementById(cardId.replace('card', 'content'));
    if (content) content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

function fecharCard(cardId) {
    const card = document.getElementById(cardId);
    if (card) card.style.display = 'none';
}

// ========================================
// CÁLCULOS
// ========================================
function calcularSBCTC() {
    const ca = parseFloat(document.getElementById('inputCa')?.value) || 0;
    const mg = parseFloat(document.getElementById('inputMg')?.value) || 0;
    const k = parseFloat(document.getElementById('inputK')?.value) || 0;
    const na = parseFloat(document.getElementById('inputNa')?.value) || 0;
    const hal = parseFloat(document.getElementById('inputHAl')?.value) || 0;
    
    const sb = ca + mg + k + na;
    const ctc = sb + hal;
    const v = ctc > 0 ? (sb / ctc) * 100 : 0;
    
    document.getElementById('valorSB').textContent = sb.toFixed(2);
    document.getElementById('valorCTC').textContent = ctc.toFixed(2);
    document.getElementById('valorV').textContent = v.toFixed(0);
    
    document.getElementById('relacaoCaMg').textContent = mg > 0 ? (ca / mg).toFixed(1) : '--';
    document.getElementById('relacaoCaK').textContent = k > 0 ? (ca / k).toFixed(1) : '--';
    document.getElementById('relacaoMgK').textContent = k > 0 ? (mg / k).toFixed(1) : '--';
}

function updateTextura() {
    const areia = parseFloat(document.getElementById('inputAreia')?.value) || 0;
    const silte = parseFloat(document.getElementById('inputSilte')?.value) || 0;
    const argila = parseFloat(document.getElementById('inputArgila')?.value) || 0;
    
    const total = areia + silte + argila;
    document.getElementById('totalTextura').textContent = `${total}%`;
    
    let classe = '-';
    if (total >= 99 && total <= 101) {
        if (argila >= 60) classe = 'Muito Argiloso';
        else if (argila >= 35) classe = 'Argiloso';
        else if (areia >= 70) classe = 'Arenoso';
        else if (silte >= 50) classe = 'Siltoso';
        else classe = 'Franco';
    }
    document.getElementById('classeTextural').textContent = classe;
}

function updatePH(input) {
    const ph = parseFloat(input.value) || 0;
    const indicator = document.getElementById('ph-indicator');
    
    let color, width;
    if (ph < 5) { color = '#FF3B30'; width = 25; }
    else if (ph < 5.5) { color = '#FF9500'; width = 40; }
    else if (ph < 6.5) { color = '#34C759'; width = 70; }
    else if (ph < 7.5) { color = '#007AFF'; width = 85; }
    else { color = '#5856D6'; width = 95; }
    
    indicator.style.width = `${width}%`;
    indicator.style.backgroundColor = color;
}

// ========================================
// AMOSTRAS
// ========================================
let amostrasSelecionadas = {};

function toggleDropdownAmostras(event) {
    event.stopPropagation();
    document.getElementById('amostrasMenu').classList.toggle('active');
}

function toggleAmostra(id, label, element, event) {
    event.stopPropagation();
    
    if (amostrasSelecionadas[id]) {
        delete amostrasSelecionadas[id];
        element.classList.remove('selected');
    } else {
        amostrasSelecionadas[id] = label;
        element.classList.add('selected');
    }
    renderAmostrasTags();
}

function renderAmostrasTags() {
    const container = document.getElementById('amostrasSelecionadasTags');
    if (!container) return;
    container.innerHTML = Object.entries(amostrasSelecionadas)
        .map(([id, label]) => `<span class="regencia-tag">${label}</span>`).join('');
}

// ========================================
// MICRONUTRIENTES
// ========================================
const micronutrientesDisponiveis = [
    { id: 'mn', nome: 'Mn' }, { id: 'zn', nome: 'Zn' },
    { id: 'cu', nome: 'Cu' }, { id: 'fe', nome: 'Fe' },
    { id: 'b', nome: 'B' }, { id: 'mo', nome: 'Mo' },
    { id: 'ni', nome: 'Ni' }, { id: 'se', nome: 'Se' }
];

const fontesMicro = {
    mn: [{ value: 'sulfato', label: 'Sulfato de Manganês' }, { value: 'quelato', label: 'Quelato Mn' }],
    zn: [{ value: 'sulfato', label: 'Sulfato de Zinco' }, { value: 'quelato', label: 'Quelato Zn' }],
    cu: [{ value: 'sulfato', label: 'Sulfato de Cobre' }, { value: 'quelato', label: 'Quelato Cu' }],
    fe: [{ value: 'sulfato', label: 'Sulfato Ferroso' }, { value: 'quelato', label: 'Quelato Fe' }],
    b: [{ value: 'acido', label: 'Ácido Bórico' }, { value: 'borax', label: 'Bórax' }],
    mo: [{ value: 'molibdato', label: 'Molibdato de Sódio' }],
    ni: [{ value: 'sulfato', label: 'Sulfato de Níquel' }],
    se: [{ value: 'selenato', label: 'Selenato de Sódio' }]
};

let gruposMicro = [];
let contadorGrupos = 0;

function criarGrupoMicro() {
    contadorGrupos++;
    const grupoId = `grupo-${contadorGrupos}`;
    
    gruposMicro.push({
        id: grupoId,
        numero: contadorGrupos,
        nutrientes: []
    });
    
    renderGrupoMicro(grupoId, contadorGrupos);
}

function renderGrupoMicro(grupoId, numero) {
    const container = document.getElementById('containerGruposMicro');
    
    const html = `
        <div class="grupo-micro-card" id="${grupoId}">
            <div class="grupo-micro-header">
                <div class="grupo-micro-titulo">
                    <span class="grupo-micro-numero">${numero}</span>
                    Grupo de Micronutrientes
                </div>
                <button class="btn-remove" onclick="removerGrupoMicro('${grupoId}')">×</button>
            </div>
            
            <div class="micro-pills-container" id="pills-${grupoId}">
                ${micronutrientesDisponiveis.map(m => `
                    <button class="micro-pill" onclick="toggleMicroPill('${grupoId}', '${m.id}', this)">${m.nome}</button>
                `).join('')}
            </div>
            
            <div class="compact-row">
                <div class="compact-field">
                    <label>Aplicação</label>
                    <select class="dropdown-compact">
                        <option value="">Selecione...</option>
                        <option value="solo">Solo</option>
                        <option value="foliar">Foliar</option>
                        <option value="solo-foliar">Solo + Foliar</option>
                    </select>
                </div>
                <div class="compact-field">
                    <label>Regência</label>
                    <select class="dropdown-compact" id="regencia-${grupoId}" onchange="atualizarRegenciaGrupo('${grupoId}')">
                        <option value="autor">Autor</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="cultivar">Cultivar</option>
                    </select>
                </div>
                <div class="compact-field" style="flex: 2;">
                    <label>Referência</label>
                    <select class="dropdown-compact" id="ref-${grupoId}">
                        <option value="">Selecione...</option>
                    </select>
                </div>
            </div>
            
            <div class="section-subtitle">Fontes e Doses</div>
            <div id="fontes-${grupoId}">
                <p style="color: #86868B; font-size: 12px;">Selecione os micronutrientes acima</p>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
    atualizarRegenciaGrupo(grupoId);
}

function toggleMicroPill(grupoId, microId, element) {
    element.classList.toggle('selected');
    
    const grupo = gruposMicro.find(g => g.id === grupoId);
    if (!grupo) return;
    
    const idx = grupo.nutrientes.indexOf(microId);
    if (idx === -1) grupo.nutrientes.push(microId);
    else grupo.nutrientes.splice(idx, 1);
    
    renderFontesDosesGrupo(grupoId);
}

function renderFontesDosesGrupo(grupoId) {
    const grupo = gruposMicro.find(g => g.id === grupoId);
    const container = document.getElementById(`fontes-${grupoId}`);
    
    if (!grupo || grupo.nutrientes.length === 0) {
        container.innerHTML = '<p style="color: #86868B; font-size: 12px;">Selecione os micronutrientes acima</p>';
        return;
    }
    
    const ordem = micronutrientesDisponiveis.map(m => m.id);
    grupo.nutrientes.sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));
    
    container.innerHTML = grupo.nutrientes.map(microId => {
        const micro = micronutrientesDisponiveis.find(m => m.id === microId);
        const fontes = fontesMicro[microId] || [];
        const unidade = microId === 'mo' ? 'g/ha' : 'kg/ha';
        
        return `
            <div class="compact-row" style="margin-bottom: 6px;">
                <div class="compact-field" style="max-width: 50px;"><label>${micro.nome}</label></div>
                <div class="compact-field" style="flex: 2;">
                    <select class="dropdown-compact">
                        <option value="">Fonte...</option>
                        ${fontes.map(f => `<option value="${f.value}">${f.label}</option>`).join('')}
                    </select>
                </div>
                <div class="compact-field">
                    <input type="text" class="input-compact" maxlength="5" placeholder="0.0" oninput="formatDecimal(this)">
                </div>
                <span class="unidade">${unidade}</span>
            </div>
        `;
    }).join('');
}

function atualizarRegenciaGrupo(grupoId) {
    const select = document.getElementById(`regencia-${grupoId}`);
    const refSelect = document.getElementById(`ref-${grupoId}`);
    if (!select || !refSelect) return;
    
    const tipo = select.value;
    refSelect.innerHTML = '<option value="">Selecione...</option>';
    
    (dadosRegencia[tipo] || []).forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        refSelect.appendChild(option);
    });
}

function removerGrupoMicro(grupoId) {
    gruposMicro = gruposMicro.filter(g => g.id !== grupoId);
    document.getElementById(grupoId)?.remove();
}

// ========================================
// EVENT LISTENERS
// ========================================
document.addEventListener('click', function(event) {
    if (!event.target.closest('.floating-menu') && !event.target.closest('.recommend-btn')) {
        document.querySelectorAll('.floating-menu').forEach(m => m.classList.remove('active'));
    }
    if (!event.target.closest('#amostrasMenu') && !event.target.closest('#btnAmostras')) {
        document.getElementById('amostrasMenu')?.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    renderAmostrasTags();
});
