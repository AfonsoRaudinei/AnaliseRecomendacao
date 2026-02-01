// ========================================
// FORMATAÇÃO DE INPUTS (MAX XXX,X)
// ========================================
function formatDecimal(input) {
    let value = input.value.replace(/[^0-9,.]/g, '');
    value = value.replace(',', '.');
    const parts = value.split('.');
    if (parts[0] && parts[0].length > 3) parts[0] = parts[0].substring(0, 3);
    if (parts[1] && parts[1].length > 1) parts[1] = parts[1].substring(0, 1);
    input.value = parts.join('.');
}

// ========================================
// DADOS DE REGÊNCIA
// ========================================
const dadosRegencia = {
    autor: [
        { value: 'araujo-2023', label: 'Araújo (2023)' },
        { value: 'kurihara-2013', label: 'Kurihara et al. (2013)' },
        { value: 'santos-2008', label: 'Santos et al. (2008)' },
        { value: 'embrapa', label: 'EMBRAPA' },
        { value: 'malavolta', label: 'Malavolta (1980)' }
    ],
    tecnologia: [
        { value: 'enlist', label: 'Enlist' },
        { value: 'xtend', label: 'Xtend' },
        { value: 'roundup-ready', label: 'Roundup Ready' }
    ],
    cultivar: [
        { value: '73i75RSF', label: '73i75RSF' },
        { value: 'AS3595i2x', label: 'AS3595i2x' },
        { value: 'M6210Ipro', label: 'M6210 Ipro' },
        { value: 'NEOGEN720', label: 'NEOGEN 720' }
    ]
};

// Estado global
let regenciaSelecionada = { potassio: { tipo: 'autor' }, fosforo: { tipo: 'autor' } };
let nutrienteAtual = '';
let corretivosAtivos = { dolomitico: false, calcitico: false, gesso: false };
let amostrasSelecionadas = {};

// ========================================
// FECHAR TODOS OS DROPDOWNS
// ========================================
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.btn-add').forEach(b => b.classList.remove('active'));
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-wrapper') && !e.target.closest('.dropdown-menu')) {
        closeAllDropdowns();
    }
});

// ========================================
// AMOSTRAS
// ========================================
function toggleDropdownAmostras(event) {
    event.stopPropagation();
    closeAllDropdowns();
    document.getElementById('amostrasMenu').classList.toggle('active');
    document.getElementById('btnAmostras').classList.toggle('active');
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

function removerAmostra(id) {
    delete amostrasSelecionadas[id];
    document.querySelectorAll('.dropdown-item').forEach(item => {
        if (item.getAttribute('onclick')?.includes(`'${id}'`)) item.classList.remove('selected');
    });
    renderAmostrasTags();
}

function renderAmostrasTags() {
    const container = document.getElementById('amostrasSelecionadasTags');
    if (!container) return;
    if (Object.keys(amostrasSelecionadas).length === 0) {
        container.innerHTML = '<span style="color:#9CA3AF;font-size:12px;font-style:italic;">Nenhuma selecionada</span>';
        return;
    }
    container.innerHTML = Object.entries(amostrasSelecionadas).map(([id, label]) => `
        <div class="amostra-tag"><span>${label}</span><button class="amostra-tag-remove" onclick="removerAmostra('${id}')">×</button></div>
    `).join('');
}

// ========================================
// CORRETIVOS
// ========================================
function toggleMenuCorretivo(event) {
    event.stopPropagation();
    closeAllDropdowns();
    document.getElementById('correctiveMenu').classList.toggle('active');
}

function toggleCorrective(tipo, element, event) {
    event.stopPropagation();
    corretivosAtivos[tipo] = !corretivosAtivos[tipo];
    element.classList.toggle('selected');
    
    const cardNames = { dolomitico: 'Dolomitico', calcitico: 'Calcitico', gesso: 'Gesso' };
    const miniCard = document.getElementById(`mini${cardNames[tipo]}`);
    
    if (corretivosAtivos[tipo]) {
        if (miniCard) miniCard.style.display = 'block';
        document.getElementById('cardCalagem').style.display = 'block';
    } else {
        if (miniCard) miniCard.style.display = 'none';
        if (!corretivosAtivos.dolomitico && !corretivosAtivos.calcitico && !corretivosAtivos.gesso) {
            document.getElementById('cardCalagem').style.display = 'none';
        }
    }
}

function removeCorrective(tipo) {
    corretivosAtivos[tipo] = false;
    const cardNames = { dolomitico: 'Dolomitico', calcitico: 'Calcitico', gesso: 'Gesso' };
    const miniCard = document.getElementById(`mini${cardNames[tipo]}`);
    if (miniCard) miniCard.style.display = 'none';
    
    document.querySelector(`.dropdown-item[data-type="${tipo}"]`)?.classList.remove('selected');
    
    if (!corretivosAtivos.dolomitico && !corretivosAtivos.calcitico && !corretivosAtivos.gesso) {
        document.getElementById('cardCalagem').style.display = 'none';
    }
}

// ========================================
// MODAL REGÊNCIA
// ========================================
function abrirSeletorRegencia(nutriente) {
    nutrienteAtual = nutriente;
    document.getElementById('modalRegenciaTitulo').textContent = `Regência para ${nutriente === 'potassio' ? 'Potássio' : 'Fósforo'}`;
    document.getElementById('modalRegencia').classList.add('active');
}

function fecharModalRegencia(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('modalRegencia').classList.remove('active');
}

function selecionarRegencia(tipo) {
    regenciaSelecionada[nutrienteAtual].tipo = tipo;
    
    const tagId = `tag${nutrienteAtual.charAt(0).toUpperCase() + nutrienteAtual.slice(1)}`;
    const emojis = { autor: '📚', tecnologia: '⚙️', cultivar: '🌱' };
    const labels = { autor: 'Autor', tecnologia: 'Tecnologia', cultivar: 'Cultivar' };
    document.getElementById(tagId).textContent = `${emojis[tipo]} ${labels[tipo]}`;
    
    atualizarDropdownReferencia(nutrienteAtual, tipo);
    document.getElementById(`card${nutrienteAtual.charAt(0).toUpperCase() + nutrienteAtual.slice(1)}`).style.display = 'block';
    fecharModalRegencia();
}

function atualizarDropdownReferencia(nutriente, tipo) {
    const select = document.getElementById(`selectRef${nutriente.charAt(0).toUpperCase() + nutriente.slice(1)}`);
    select.innerHTML = '<option value="">Selecione...</option>';
    (dadosRegencia[tipo] || []).forEach(opt => {
        select.innerHTML += `<option value="${opt.value}">${opt.label}</option>`;
    });
}

// ========================================
// CARDS
// ========================================
function minimizeCard(cardId) {
    const content = document.getElementById(cardId.replace('card', 'content'));
    if (content) content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

function fecharCard(cardId) {
    document.getElementById(cardId).style.display = 'none';
    
    if (cardId === 'cardCalagem') {
        corretivosAtivos = { dolomitico: false, calcitico: false, gesso: false };
        document.querySelectorAll('#correctiveMenu .dropdown-item').forEach(i => i.classList.remove('selected'));
        ['miniDolomitico', 'miniCalcitico', 'miniGesso'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }
}

// ========================================
// NÍVEIS DE REFERÊNCIA PARA NUTRIENTES
// ========================================
const niveisNutrientes = {
    ca: { muitoBaixo: 1.5, baixo: 2.5, medio: 4.0, adequado: 6.0 },
    mg: { muitoBaixo: 0.4, baixo: 0.8, medio: 1.2, adequado: 1.5 },
    k: { muitoBaixo: 0.08, baixo: 0.15, medio: 0.25, adequado: 0.35 },
    na: { muitoBaixo: 0.05, baixo: 0.1, medio: 0.2, adequado: 0.3 }
};

function classificarNutriente(valor, niveis) {
    if (valor === 0) return { texto: '--', classe: '' };
    if (valor < niveis.muitoBaixo) return { texto: 'Muito Baixo', classe: 'muito-baixo' };
    if (valor < niveis.baixo) return { texto: 'Baixo', classe: 'baixo' };
    if (valor < niveis.medio) return { texto: 'Médio', classe: 'medio' };
    if (valor < niveis.adequado) return { texto: 'Adequado', classe: 'adequado' };
    return { texto: 'Alto', classe: 'alto' };
}

function atualizarStatusBadge(elementId, status) {
    const badge = document.getElementById(elementId);
    if (!badge) return;
    
    badge.textContent = status.texto;
    badge.className = 'status-badge ' + status.classe;
}

// ========================================
// CÁLCULOS - SB, CTC, V% COM PORCENTAGENS
// ========================================
function calcularSBCTC() {
    const ca = parseFloat(document.getElementById('inputCa')?.value) || 0;
    const mg = parseFloat(document.getElementById('inputMg')?.value) || 0;
    const k = parseFloat(document.getElementById('inputK')?.value) || 0;
    const na = parseFloat(document.getElementById('inputNa')?.value) || 0;
    const al = parseFloat(document.getElementById('inputAl')?.value) || 0;
    const hal = parseFloat(document.getElementById('inputHAl')?.value) || 0;
    
    const sb = ca + mg + k + na;
    const ctc = sb + hal;
    const v = ctc > 0 ? (sb / ctc) * 100 : 0;
    
    // Calcular m% (saturação por alumínio)
    const ctcEfetiva = sb + al;
    const m = ctcEfetiva > 0 ? (al / ctcEfetiva) * 100 : 0;
    
    // Calcular Al% na CTC
    const alPercent = ctc > 0 ? (al / ctc) * 100 : 0;
    
    document.getElementById('valorSB').textContent = sb.toFixed(2);
    document.getElementById('valorCTC').textContent = ctc.toFixed(2);
    document.getElementById('valorM').textContent = Math.round(m);
    document.getElementById('valorAlPercent').textContent = Math.round(alPercent);
    
    // Atualizar status badges dos nutrientes
    const statusCa = classificarNutriente(ca, niveisNutrientes.ca);
    const statusMg = classificarNutriente(mg, niveisNutrientes.mg);
    const statusK = classificarNutriente(k, niveisNutrientes.k);
    const statusNa = classificarNutriente(na, niveisNutrientes.na);
    
    atualizarStatusBadge('statusBadgeCa', statusCa);
    atualizarStatusBadge('statusBadgeMg', statusMg);
    atualizarStatusBadge('statusBadgeK', statusK);
    atualizarStatusBadge('statusBadgeNa', statusNa);
    
    // Calcular e exibir porcentagens individuais
    if (ctc > 0) {
        const percCa = (ca / ctc) * 100;
        const percMg = (mg / ctc) * 100;
        const percK = (k / ctc) * 100;
        const percNa = (na / ctc) * 100;
        
        document.getElementById('percentCa').textContent = percCa.toFixed(1) + '%';
        document.getElementById('percentMg').textContent = percMg.toFixed(1) + '%';
        document.getElementById('percentK').textContent = percK.toFixed(1) + '%';
        document.getElementById('percentNa').textContent = percNa.toFixed(1) + '%';
        
        // Atualizar barras de status
        document.getElementById('ca-indicator').style.width = Math.min(percCa, 100) + '%';
        document.getElementById('mg-indicator').style.width = Math.min(percMg, 100) + '%';
        document.getElementById('k-indicator').style.width = Math.min(percK * 10, 100) + '%';
        document.getElementById('na-indicator').style.width = Math.min(percNa * 10, 100) + '%';
    } else {
        document.getElementById('percentCa').textContent = '0%';
        document.getElementById('percentMg').textContent = '0%';
        document.getElementById('percentK').textContent = '0%';
        document.getElementById('percentNa').textContent = '0%';
    }
    
    // Atualizar barril
    atualizarBarril(v);
    
    // Relações
    document.getElementById('relacaoCaMg').textContent = mg > 0 ? (ca / mg).toFixed(1) : '--';
    document.getElementById('relacaoCaK').textContent = k > 0 ? (ca / k).toFixed(1) : '--';
    document.getElementById('relacaoMgK').textContent = k > 0 ? (mg / k).toFixed(1) : '--';
    
    // Barras
    if (mg > 0) document.getElementById('barraCaMg').style.width = Math.min((ca/mg/10)*100, 100) + '%';
    if (k > 0) {
        document.getElementById('barraCaK').style.width = Math.min((ca/k/50)*100, 100) + '%';
        document.getElementById('barraMgK').style.width = Math.min((mg/k/20)*100, 100) + '%';
    }
}

function atualizarBarril(vPercent) {
    const fill = document.getElementById('barrelFill');
    const value = document.getElementById('barrelValue');
    const percent = document.getElementById('barrelPercent');
    
    const vClamped = Math.min(Math.max(vPercent, 0), 100);
    fill.style.height = vClamped + '%';
    
    // Atualizar valor dentro do barril
    if (vClamped > 15) {
        value.textContent = Math.round(vClamped) + '%';
        value.classList.remove('empty');
    } else {
        value.textContent = Math.round(vClamped) + '%';
        value.classList.add('empty');
    }
    
    // Atualizar valor grande ao lado
    if (percent) percent.textContent = Math.round(vClamped);
}

// Função para toggle dos campos de Grade
function toggleGradeFields(tipo) {
    const select = document.getElementById('superficie' + tipo.charAt(0).toUpperCase() + tipo.slice(1));
    const fields = document.getElementById('gradeFields' + tipo.charAt(0).toUpperCase() + tipo.slice(1));
    
    if (select && fields) {
        if (select.value === 'grade') {
            fields.style.display = 'block';
        } else {
            fields.style.display = 'none';
        }
    }
}

function calcularVPercent() {
    const baseCa = parseFloat(document.getElementById('baseCa')?.value) || 0;
    const baseMg = parseFloat(document.getElementById('baseMg')?.value) || 0;
    const baseK = parseFloat(document.getElementById('baseK')?.value) || 0;
    const baseNa = parseFloat(document.getElementById('baseNa')?.value) || 0;
    
    const v = baseCa + baseMg + baseK + baseNa;
    
    const fill = document.getElementById('miniBarrelFill');
    const value = document.getElementById('miniBarrelValue');
    
    if (fill) fill.style.height = Math.min(v, 100) + '%';
    if (value) value.textContent = `V% ${Math.round(v)}`;
}

// ========================================
// TEXTURA
// ========================================
function updateTextura() {
    const areia = parseFloat(document.getElementById('inputAreia')?.value) || 0;
    const silte = parseFloat(document.getElementById('inputSilte')?.value) || 0;
    const argila = parseFloat(document.getElementById('inputArgila')?.value) || 0;
    
    const total = areia + silte + argila;
    document.getElementById('totalTextura').textContent = total.toFixed(0);
    
    const icon = document.getElementById('validacaoIcon');
    if (total === 100) {
        icon.textContent = '✓';
        icon.style.color = '#22C55E';
    } else if (total > 0) {
        icon.textContent = '⚠';
        icon.style.color = '#F59E0B';
    } else {
        icon.textContent = '○';
        icon.style.color = '#D1D5DB';
    }
    
    // Barras coloridas: largura proporcional ao valor (0-100%)
    document.getElementById('barAreia').style.width = Math.min(areia, 100) + '%';
    document.getElementById('barSilte').style.width = Math.min(silte, 100) + '%';
    document.getElementById('barArgila').style.width = Math.min(argila, 100) + '%';
    
    // Classe textural
    let classe = '—';
    if (total >= 99 && total <= 101) {
        if (argila >= 60) classe = 'Muito Argilosa';
        else if (argila >= 35) classe = 'Argilosa';
        else if (argila >= 15) classe = areia >= 45 ? 'Franco-Arenosa' : silte >= 40 ? 'Franco-Siltosa' : 'Franca';
        else classe = areia >= 85 ? 'Arenosa' : silte >= 50 ? 'Siltosa' : 'Franco-Arenosa';
    }
    document.getElementById('classeTextural').textContent = classe;
    
    // Atualizar posição no triângulo textural
    atualizarTrianguloTextural(areia, silte, argila);
}

function atualizarTrianguloTextural(areia, silte, argila) {
    const marcador = document.getElementById('marcadorPosicao');
    if (!marcador) return;
    
    const total = areia + silte + argila;
    
    // Mostrar/ocultar marcador
    if (total >= 99 && total <= 101) {
        marcador.style.opacity = '1';
        
        // Converter porcentagens para coordenadas do triângulo
        // Triângulo: topo (250,0), base esquerda (0,433), base direita (500,433)
        // Argila = altura (0% embaixo, 100% em cima)
        // Areia = eixo horizontal esquerdo (0% direita, 100% esquerda)
        // Silte = eixo horizontal direito (0% esquerda, 100% direita)
        
        const percArgila = argila / 100;
        const percAreia = areia / 100;
        const percSilte = silte / 100;
        
        // Posição Y (altura baseada na argila)
        // Topo = y:2, Base = y:435
        const y = 435 - (percArgila * 433);
        
        // Posição X (interpolação entre silte e areia)
        // Base esquerda (0,435), base direita (500,435), topo (250,2)
        const baseWidth = 500;
        const topX = 250;
        const width = baseWidth * (1 - percArgila);
        const leftEdge = topX - (width / 2);
        const x = leftEdge + (percAreia * width);
        
        marcador.setAttribute('cx', x);
        marcador.setAttribute('cy', y);
        
        // Animar pulsação quando válido
        marcador.style.animation = 'pulse 2s infinite';
    } else {
        marcador.style.opacity = '0';
        marcador.style.animation = 'none';
    }
}

function aplicarTipoSolo(tipo) {
    const tipos = {
        argiloso: { areia: 30, silte: 20, argila: 50 },
        arenoso: { areia: 80, silte: 10, argila: 10 },
        siltoso: { areia: 15, silte: 70, argila: 15 }
    };
    const v = tipos[tipo];
    
    document.getElementById('inputAreia').value = v.areia;
    document.getElementById('inputSilte').value = v.silte;
    document.getElementById('inputArgila').value = v.argila;
    
    document.querySelectorAll('.card-tipo-solo-micro').forEach(c => c.classList.remove('ativo'));
    document.getElementById('card' + tipo.charAt(0).toUpperCase() + tipo.slice(1))?.classList.add('ativo');
    
    updateTextura();
}

// ========================================
// pH E INTERFERÊNCIA
// ========================================
function updatePH(input) {
    const ph = parseFloat(input.value) || 0;
    
    // Calcular posição do marcador (pH 4-9 -> 0-100%)
    const minPH = 4, maxPH = 9;
    const position = Math.min(Math.max((ph - minPH) / (maxPH - minPH) * 100, 0), 100);
    
    // Atualizar marcador
    const marker = document.getElementById('ph-indicator-marker');
    const bg = document.getElementById('ph-indicator-bg');
    
    if (marker) marker.style.left = `calc(${position}% - 2px)`;
    if (bg) bg.style.width = `${100 - position}%`;
    
    updateInterference(ph);
}

function updateInterference(ph) {
    const nutrients = {
        n: { optimal: [6.0, 7.0] }, p: { optimal: [6.0, 7.0] }, k: { optimal: [6.0, 7.5] },
        ca: { optimal: [6.0, 7.5] }, mg: { optimal: [6.0, 8.0] }, s: { optimal: [5.5, 7.5] },
        fe: { optimal: [5.0, 6.5] }, mn: { optimal: [5.0, 6.5] }, zn: { optimal: [5.0, 7.0] },
        cu: { optimal: [5.0, 7.0] }, b: { optimal: [5.0, 7.0] }, mo: { optimal: [6.0, 8.0] }
    };
    
    Object.keys(nutrients).forEach(n => {
        const el = document.getElementById('int-' + n);
        if (!el) return;
        
        const opt = nutrients[n].optimal;
        let status = '', value = '--';
        
        if (ph > 0) {
            if (ph >= opt[0] && ph <= opt[1]) {
                status = 'interference-positive';
                value = '100%';
            } else {
                const dist = Math.min(Math.abs(ph - opt[0]), Math.abs(ph - opt[1]));
                const pct = Math.max(30, 100 - dist * 25);
                value = Math.round(pct) + '%';
                status = pct >= 70 ? 'interference-warning' : 'interference-negative';
            }
        }
        
        el.textContent = value;
        el.className = 'interference-value ' + status;
    });
}

// ========================================
// RECOMENDAÇÕES
// ========================================
function gerarRecomendacaoCalagem() {
    const resultado = document.getElementById('resultadoCalagem');
    resultado.style.display = 'block';
    
    ['dolomitico', 'calcitico', 'gesso'].forEach(tipo => {
        const recEl = document.getElementById('rec' + tipo.charAt(0).toUpperCase() + tipo.slice(1));
        const valEl = document.getElementById('valor' + tipo.charAt(0).toUpperCase() + tipo.slice(1));
        if (corretivosAtivos[tipo]) {
            recEl.style.display = 'flex';
            valEl.textContent = (Math.random() * 3 + 0.5).toFixed(1);
        } else {
            recEl.style.display = 'none';
        }
    });
    
    atualizarGraficoCalagem();
}

function atualizarGraficoCalagem() {
    const ca = parseFloat(document.getElementById('inputCa')?.value) || 1.5;
    const mg = parseFloat(document.getElementById('inputMg')?.value) || 0.5;
    const s = 5;
    
    const caD = ca * 2, mgD = mg * 2, sD = s * 2.5;
    const maxCa = 5, maxMg = 2, maxS = 20;
    
    document.getElementById('barraCaAntes').style.width = Math.min((ca/maxCa)*100, 100) + '%';
    document.getElementById('barraCaDepois').style.width = Math.min((caD/maxCa)*100, 100) + '%';
    document.getElementById('valCaAntes').textContent = ca.toFixed(1);
    document.getElementById('valCaDepois').textContent = caD.toFixed(1);
    
    document.getElementById('barraMgAntes').style.width = Math.min((mg/maxMg)*100, 100) + '%';
    document.getElementById('barraMgDepois').style.width = Math.min((mgD/maxMg)*100, 100) + '%';
    document.getElementById('valMgAntes').textContent = mg.toFixed(1);
    document.getElementById('valMgDepois').textContent = mgD.toFixed(1);
    
    document.getElementById('barraSAntes').style.width = Math.min((s/maxS)*100, 100) + '%';
    document.getElementById('barraSDepois').style.width = Math.min((sD/maxS)*100, 100) + '%';
    document.getElementById('valSAntes').textContent = s.toFixed(0);
    document.getElementById('valSDepois').textContent = sD.toFixed(0);
}

function gerarRecomendacaoPotassio() {
    const dose = document.getElementById('dosePotassio').value || '0';
    const adubo = document.getElementById('aduboPotassio');
    const nome = adubo.selectedIndex > 0 ? adubo.options[adubo.selectedIndex].text : 'Não selecionado';
    
    document.getElementById('textoPotassio').textContent = `${dose} kg/ha de ${nome}`;
    document.getElementById('resultadoPotassio').style.display = 'flex';
}

function gerarRecomendacaoFosforo() {
    const dose = document.getElementById('doseFosforo').value || '0';
    const adubo = document.getElementById('aduboFosforo');
    const nome = adubo.selectedIndex > 0 ? adubo.options[adubo.selectedIndex].text : 'Não selecionado';
    
    document.getElementById('textoFosforo').textContent = `${dose} kg/ha de ${nome}`;
    document.getElementById('resultadoFosforo').style.display = 'flex';
}

// ========================================
// MICRONUTRIENTES - STATUS
// ========================================
const micronutrientesNiveis = {
    mn: { baixo: 5, ideal: 10, alto: 50, excessivo: 100 },
    zn: { baixo: 1, ideal: 2, alto: 10, excessivo: 20 },
    cu: { baixo: 0.5, ideal: 1, alto: 5, excessivo: 10 },
    fe: { baixo: 10, ideal: 20, alto: 100, excessivo: 200 },
    b: { baixo: 0.3, ideal: 0.6, alto: 2, excessivo: 3 },
    mo: { baixo: 0.1, ideal: 0.2, alto: 0.5, excessivo: 1 },
    ni: { baixo: 0.1, ideal: 0.2, alto: 1, excessivo: 2 },
    se: { baixo: 0.05, ideal: 0.1, alto: 0.5, excessivo: 1 }
};

function updateMicroStatus(micro, valor) {
    const val = parseFloat(valor) || 0;
    const niveis = micronutrientesNiveis[micro];
    const fill = document.getElementById('status' + micro.charAt(0).toUpperCase() + micro.slice(1));
    
    if (!fill || !niveis) return;
    
    let cor = '';
    let largura = 0;
    
    if (val === 0) {
        // Sem valor
        cor = '#E5E5EA';
        largura = 0;
    } else if (val < niveis.baixo) {
        // Muito baixo - Vermelho
        cor = 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)';
        largura = (val / niveis.baixo) * 30;
    } else if (val < niveis.ideal) {
        // Baixo - Laranja
        cor = 'linear-gradient(90deg, #F97316 0%, #EA580C 100%)';
        largura = 30 + ((val - niveis.baixo) / (niveis.ideal - niveis.baixo)) * 20;
    } else if (val <= niveis.alto) {
        // Adequado - Verde
        cor = 'linear-gradient(90deg, #22C55E 0%, #16A34A 100%)';
        largura = 50 + ((val - niveis.ideal) / (niveis.alto - niveis.ideal)) * 40;
    } else if (val <= niveis.excessivo) {
        // Alto - Amarelo
        cor = 'linear-gradient(90deg, #EAB308 0%, #CA8A04 100%)';
        largura = 90 + ((val - niveis.alto) / (niveis.excessivo - niveis.alto)) * 8;
    } else {
        // Excessivo - Vermelho escuro
        cor = 'linear-gradient(90deg, #DC2626 0%, #991B1B 100%)';
        largura = 100;
    }
    
    fill.style.background = cor;
    fill.style.width = Math.min(largura, 100) + '%';
}

// ========================================
// MICRONUTRIENTES - GRUPOS MINIMALISTAS
// ========================================
const micronutrientesDisponiveis = [
    { id: 'mn', nome: 'Mn' }, { id: 'zn', nome: 'Zn' }, { id: 'cu', nome: 'Cu' }, { id: 'fe', nome: 'Fe' },
    { id: 'b', nome: 'B' }, { id: 'mo', nome: 'Mo' }, { id: 'ni', nome: 'Ni' }, { id: 'se', nome: 'Se' }
];

const fontesMicro = {
    mn: [{ value: 'sulfato', label: 'Sulfato de Mn' }, { value: 'quelato', label: 'Quelato Mn' }],
    zn: [{ value: 'sulfato', label: 'Sulfato de Zn' }, { value: 'quelato', label: 'Quelato Zn' }],
    cu: [{ value: 'sulfato', label: 'Sulfato de Cu' }, { value: 'quelato', label: 'Quelato Cu' }],
    fe: [{ value: 'sulfato', label: 'Sulfato Ferroso' }, { value: 'quelato', label: 'Quelato Fe' }],
    b: [{ value: 'acido', label: 'Ácido Bórico' }, { value: 'borax', label: 'Bórax' }],
    mo: [{ value: 'molibdato', label: 'Molibdato de Na' }],
    ni: [{ value: 'sulfato', label: 'Sulfato de Ni' }],
    se: [{ value: 'selenato', label: 'Selenato de Na' }]
};

let gruposMicro = [];
let contadorGrupos = 0;
let grupoAtualEditando = null;
let selecaoTemporariaMicro = [];

function criarGrupoMicro() {
    contadorGrupos++;
    const grupoId = `grupo-${contadorGrupos}`;
    
    // Iniciar com seleção vazia
    gruposMicro.push({ 
        id: grupoId, 
        numero: contadorGrupos, 
        nutrientes: [],
        aplicacao: 'solo',
        regencia: 'autor'
    });
    
    grupoAtualEditando = grupoId;
    selecaoTemporariaMicro = [];
    
    // Abrir modal de seleção
    abrirModalMicro();
}

function abrirModalMicro() {
    const modal = document.getElementById('modalMicronutrientes');
    const grid = document.getElementById('microSelectorGrid');
    
    // Preencher grid com micronutrientes
    grid.innerHTML = micronutrientesDisponiveis.map(m => `
        <div class="micro-selector-item ${selecaoTemporariaMicro.includes(m.id) ? 'selected' : ''}" 
             onclick="toggleMicroSelecao('${m.id}')">
            <div class="micro-selector-check">
                <svg class="checkmark-micro" width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5L5 9.5L13 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <span>${m.nome}</span>
        </div>
    `).join('');
    
    modal.classList.add('active');
}

function toggleMicroSelecao(microId) {
    const idx = selecaoTemporariaMicro.indexOf(microId);
    if (idx === -1) {
        selecaoTemporariaMicro.push(microId);
    } else {
        selecaoTemporariaMicro.splice(idx, 1);
    }
    
    // Atualizar visual
    document.querySelectorAll('.micro-selector-item').forEach((item, i) => {
        const micro = micronutrientesDisponiveis[i];
        if (selecaoTemporariaMicro.includes(micro.id)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function confirmarSelecaoMicro() {
    if (selecaoTemporariaMicro.length === 0) {
        alert('Selecione pelo menos um micronutriente');
        return;
    }
    
    const grupo = gruposMicro.find(g => g.id === grupoAtualEditando);
    if (grupo) {
        grupo.nutrientes = [...selecaoTemporariaMicro];
        renderGrupoMicro(grupo.id, grupo.numero);
    }
    
    fecharModalMicro();
}

function fecharModalMicro(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('modalMicronutrientes').classList.remove('active');
}

function renderGrupoMicro(grupoId, numero) {
    const grupo = gruposMicro.find(g => g.id === grupoId);
    if (!grupo) return;
    
    // Verificar se já existe
    let container = document.getElementById(grupoId);
    if (!container) {
        container = document.createElement('div');
        container.id = grupoId;
        container.className = 'grupo-micro-card-clean';
        document.getElementById('containerGruposMicro').appendChild(container);
    }
    
    // Ordenar nutrientes
    const ordem = micronutrientesDisponiveis.map(m => m.id);
    grupo.nutrientes.sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));
    
    const html = `
        <div class="grupo-micro-header-clean">
            <div class="grupo-micro-numero-badge">${numero}</div>
            <div class="grupo-micro-titulo-clean">Grupo de Micronutrientes</div>
            <button class="btn-edit-micro" onclick="editarGrupoMicro('${grupoId}')" title="Editar seleção">✎</button>
            <button class="btn-remove" onclick="removerGrupoMicro('${grupoId}')">×</button>
        </div>
        
        <div class="form-row-inline">
            <div class="form-field-inline">
                <label>Aplicação</label>
                <select class="dropdown-compact" id="aplicacao-${grupoId}" onchange="atualizarGrupo('${grupoId}')">
                    <option value="solo" ${grupo.aplicacao === 'solo' ? 'selected' : ''}>Solo</option>
                    <option value="foliar" ${grupo.aplicacao === 'foliar' ? 'selected' : ''}>Foliar</option>
                </select>
            </div>
            <div class="form-field-inline">
                <label>Regência</label>
                <select class="dropdown-compact" id="regencia-${grupoId}" onchange="atualizarRegenciaGrupo('${grupoId}')">
                    <option value="autor">Autor</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="cultivar">Cultivar</option>
                </select>
            </div>
            <div class="form-field-inline" style="flex:1.5;">
                <label>Referência</label>
                <select class="dropdown-full" id="ref-${grupoId}"></select>
            </div>
        </div>
        
        <div class="subsection-title" style="margin-top: 12px;">Fontes e Doses</div>
        <div class="fontes-doses-clean">
            ${grupo.nutrientes.map(microId => {
                const micro = micronutrientesDisponiveis.find(m => m.id === microId);
                const fontes = fontesMicro[microId] || [];
                const unidade = microId === 'mo' ? 'g/ha' : 'kg/ha';
                
                return `
                    <div class="fonte-dose-row">
                        <div class="micro-nome-badge">${micro.nome}</div>
                        <select class="fonte-select">
                            <option value="">Fonte...</option>
                            ${fontes.map(f => `<option value="${f.value}">${f.label}</option>`).join('')}
                        </select>
                        <input type="text" class="dose-input" maxlength="7" placeholder="0.0" oninput="formatDecimal(this)">
                        <span class="dose-unit">${unidade}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = html;
    atualizarRegenciaGrupo(grupoId);
}

function editarGrupoMicro(grupoId) {
    const grupo = gruposMicro.find(g => g.id === grupoId);
    if (!grupo) return;
    
    grupoAtualEditando = grupoId;
    selecaoTemporariaMicro = [...grupo.nutrientes];
    abrirModalMicro();
}

function atualizarGrupo(grupoId) {
    const grupo = gruposMicro.find(g => g.id === grupoId);
    if (!grupo) return;
    
    const aplicacao = document.getElementById(`aplicacao-${grupoId}`)?.value;
    if (aplicacao) grupo.aplicacao = aplicacao;
}

function atualizarRegenciaGrupo(grupoId) {
    const tipo = document.getElementById(`regencia-${grupoId}`)?.value || 'autor';
    const select = document.getElementById(`ref-${grupoId}`);
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione...</option>';
    (dadosRegencia[tipo] || []).forEach(opt => {
        select.innerHTML += `<option value="${opt.value}">${opt.label}</option>`;
    });
}

function removerGrupoMicro(grupoId) {
    gruposMicro = gruposMicro.filter(g => g.id !== grupoId);
    document.getElementById(grupoId)?.remove();
}

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    renderAmostrasTags();
});
