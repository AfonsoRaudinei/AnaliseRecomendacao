// ========================================
// DROPDOWN CUSTOMIZADO - AMOSTRAS
// ========================================
const amostrasSelecionadas = new Map(); // id -> nome

function toggleDropdownAmostras(event) {
    event.stopPropagation();
    
    const menu = document.getElementById('amostrasMenu');
    const btn = document.getElementById('btnAmostras');
    
    // Fecha todos os outros dropdowns de micronutrientes
    document.querySelectorAll('.metodos-micro-dropdown').forEach(d => {
        d.classList.remove('active');
    });
    document.querySelectorAll('.btn-add-micro').forEach(b => {
        if (b.id !== 'btnAmostras') {
            b.classList.remove('active');
        }
    });
    
    menu.classList.toggle('active');
    btn.classList.toggle('active');
}

function toggleAmostra(id, nome, element, event) {
    event.stopPropagation();
    
    element.classList.toggle('selected');
    
    if (amostrasSelecionadas.has(id)) {
        amostrasSelecionadas.delete(id);
    } else {
        amostrasSelecionadas.set(id, nome);
    }
    
    renderAmostrasTags();
}

function removerAmostra(id) {
    amostrasSelecionadas.delete(id);
    
    // Desmarca checkbox
    const items = document.querySelectorAll('.amostra-item');
    items.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(`'${id}'`)) {
            item.classList.remove('selected');
        }
    });
    
    renderAmostrasTags();
}

function renderAmostrasTags() {
    const container = document.getElementById('amostrasSelecionadasTags');
    
    if (amostrasSelecionadas.size === 0) {
        container.innerHTML = '<span style="color: #D1D5DB; font-size: 0.8em; font-style: italic;">Nenhuma</span>';
        return;
    }
    
    let html = '';
    amostrasSelecionadas.forEach((nome, id) => {
        html += `
            <div class="amostra-tag">
                <span>${nome}</span>
                <button class="amostra-tag-remove" onclick="removerAmostra('${id}')">×</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ========================================
// RANGES AGRONÔMICOS REAIS
// ========================================
const ranges = {
    ph: { min: 4.0, baixo: 5.0, medio: 5.5, adequado: 6.0, alto: 7.0, max: 8.0 },
    areia: { min: 0, baixo: 20, medio: 40, adequado: 60, alto: 80, max: 100 },
    silte: { min: 0, baixo: 10, medio: 20, adequado: 30, alto: 50, max: 100 },
    argila: { min: 0, baixo: 20, medio: 35, adequado: 50, alto: 70, max: 100 },
    ca: { min: 0, baixo: 2.0, medio: 4.0, adequado: 6.0, alto: 8.0, max: 12.0 },
    mg: { min: 0, baixo: 0.5, medio: 1.0, adequado: 1.5, alto: 3.0, max: 5.0 },
    k: { min: 0, baixo: 0.15, medio: 0.30, adequado: 0.50, alto: 0.80, max: 1.5 },
    na: { min: 0, baixo: 0.05, medio: 0.10, adequado: 0.15, alto: 0.30, max: 1.0 },
    al: { min: 0, baixo: 0.3, medio: 0.5, adequado: 0, alto: 0, max: 3.0 },
    hal: { min: 0, baixo: 2.0, medio: 4.0, adequado: 6.0, alto: 8.0, max: 12.0 },
    s: { min: 0, baixo: 5, medio: 10, adequado: 15, alto: 25, max: 50 },
    prem: { min: 0, baixo: 20, medio: 30, adequado: 40, alto: 50, max: 80 },
    pmehlich: { min: 0, baixo: 10, medio: 20, adequado: 30, alto: 50, max: 100 },
    presina: { min: 0, baixo: 15, medio: 25, adequado: 40, alto: 60, max: 120 },
    pr: { min: 0, baixo: 30, medio: 50, adequado: 70, alto: 90, max: 100 },
    fe: { min: 0, baixo: 5, medio: 12, adequado: 20, alto: 45, max: 100 },
    mn: { min: 0, baixo: 2, medio: 5, adequado: 10, alto: 20, max: 50 },
    zn: { min: 0, baixo: 0.5, medio: 1.2, adequado: 2.0, alto: 5.0, max: 15.0 },
    cu: { min: 0, baixo: 0.3, medio: 0.8, adequado: 1.5, alto: 3.0, max: 10.0 },
    b: { min: 0, baixo: 0.2, medio: 0.4, adequado: 0.6, alto: 1.2, max: 3.0 },
    mo: { min: 0, baixo: 0.10, medio: 0.20, adequado: 0.30, alto: 0.50, max: 1.0 },
    ni: { min: 0, baixo: 0.05, medio: 0.10, adequado: 0.20, alto: 0.40, max: 1.0 },
    se: { min: 0, baixo: 0.02, medio: 0.05, adequado: 0.10, alto: 0.20, max: 0.5 }
};

// ========================================
// FUNÇÃO GENÉRICA PARA ATUALIZAR INDICADOR
// ========================================
function updateIndicator(value, range, indicatorId, inverted = false) {
    const indicator = document.getElementById(indicatorId);
    if (!indicator) return;

    let status = '';
    let width = 0;

    if (inverted) {
        if (value <= range.adequado) {
            status = 'adequado';
            width = 80;
        } else if (value <= range.medio) {
            status = 'medio';
            width = 60;
        } else if (value <= range.baixo) {
            status = 'baixo';
            width = 40;
        } else {
            status = 'muito-baixo';
            width = 20;
        }
    } else {
        if (value < range.baixo) {
            status = 'muito-baixo';
            width = (value / range.baixo) * 20;
        } else if (value < range.medio) {
            status = 'baixo';
            width = 20 + ((value - range.baixo) / (range.medio - range.baixo)) * 20;
        } else if (value < range.adequado) {
            status = 'medio';
            width = 40 + ((value - range.medio) / (range.adequado - range.medio)) * 20;
        } else if (value < range.alto) {
            status = 'adequado';
            width = 60 + ((value - range.adequado) / (range.alto - range.adequado)) * 20;
        } else {
            status = 'alto';
            width = 80 + ((value - range.alto) / (range.max - range.alto)) * 20;
        }
    }

    width = Math.min(Math.max(width, 0), 100);
    
    indicator.className = 'status-indicator indicator-' + status;
    indicator.style.width = width + '%';
}

// ========================================
// FUNÇÕES DE ATUALIZAÇÃO PARA CADA MÉTRICA
// ========================================
function updatePH(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.ph, 'ph-indicator');
    updateInterference(value);
}

function updateArgila(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.argila, 'argila-indicator');
    calcularTextura();
}

function updateAreia(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.areia, 'areia-indicator');
    calcularTextura();
}

function updateSilte(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.silte, 'silte-indicator');
    calcularTextura();
}

// ========================================
// CALCULADORA DE TEXTURA DO SOLO
// ========================================
function calcularTextura() {
    const areia = parseFloat(document.getElementById('inputAreia')?.value) || 0;
    const silte = parseFloat(document.getElementById('inputSilte')?.value) || 0;
    const argila = parseFloat(document.getElementById('inputArgila')?.value) || 0;
    
    const total = areia + silte + argila;
    
    const totalElem = document.getElementById('totalTextura');
    if (totalElem) {
        totalElem.textContent = total.toFixed(0);
    }
    
    const validIcon = document.getElementById('validacaoIcon');
    if (validIcon) {
        if (total === 100) {
            validIcon.textContent = '✓';
            validIcon.style.color = '#4ADE80';
        } else if (total > 0) {
            validIcon.textContent = '⚠';
            validIcon.style.color = '#F59E0B';
        } else {
            validIcon.textContent = '○';
            validIcon.style.color = '#D1D5DB';
        }
    }
    
    let classe = '-';
    if (total === 100) {
        if (argila >= 60) {
            classe = 'Muito Argilosa';
        } else if (argila >= 35) {
            classe = 'Argilosa';
        } else if (argila >= 15) {
            if (areia >= 45) {
                classe = 'Franco-Arenosa';
            } else if (silte >= 40) {
                classe = 'Franco-Siltosa';
            } else {
                classe = 'Franca';
            }
        } else {
            if (areia >= 85) {
                classe = 'Arenosa';
            } else if (silte >= 50) {
                classe = 'Siltosa';
            } else {
                classe = 'Franco-Arenosa';
            }
        }
    }
    
    const classeElem = document.getElementById('classeTextural');
    if (classeElem) {
        classeElem.textContent = classe;
    }
}

function aplicarTipoSolo(tipo) {
    const tipos = {
        argiloso: { areia: 30, silte: 20, argila: 50 },
        arenoso: { areia: 80, silte: 10, argila: 10 },
        siltoso: { areia: 15, silte: 70, argila: 15 }
    };

    const valores = tipos[tipo];
    
    document.getElementById('inputAreia').value = valores.areia;
    document.getElementById('inputSilte').value = valores.silte;
    document.getElementById('inputArgila').value = valores.argila;
    
    updateIndicator(valores.areia, ranges.areia, 'areia-indicator');
    updateIndicator(valores.silte, ranges.silte, 'silte-indicator');
    updateIndicator(valores.argila, ranges.argila, 'argila-indicator');
    
    document.querySelectorAll('.card-tipo-solo').forEach(card => {
        card.classList.remove('ativo');
    });
    
    const cardId = 'card' + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    document.getElementById(cardId)?.classList.add('ativo');
    
    calcularTextura();
}

function updateCa(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.ca, 'ca-indicator');
}

function updateMg(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.mg, 'mg-indicator');
}

function updateK(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.k, 'k-indicator');
}

function updateNa(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.na, 'na-indicator');
}

function updateAl(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.al, 'al-indicator', true);
}

function updateHAl(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.hal, 'hal-indicator', true);
}

function updateS(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.s, 's-indicator');
}

function updatePrem(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.prem, 'prem-indicator');
}

function updatePMehlich(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.pmehlich, 'pmehlich-indicator');
}

function updatePResina(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.presina, 'presina-indicator');
}

function updatePR(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.pr, 'pr-indicator');
}

function updatePremFosforo(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.prem, 'prem-fosforo-indicator');
}

function updateFe(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.fe, 'fe-indicator');
}

function updateMn(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.mn, 'mn-indicator');
}

function updateZn(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.zn, 'zn-indicator');
}

function updateCu(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.cu, 'cu-indicator');
}

function updateB(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.b, 'b-indicator');
}

function updateMo(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.mo, 'mo-indicator');
}

function updateNi(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.ni, 'ni-indicator');
}

function updateSe(input) {
    const value = parseFloat(input.value) || 0;
    updateIndicator(value, ranges.se, 'se-indicator');
}

// ========================================
// CÁLCULOS: SB, CTC, V% E RELAÇÕES
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

    document.getElementById('valorSB').textContent = sb.toFixed(2);
    document.getElementById('valorCTC').textContent = ctc.toFixed(2);
    document.getElementById('valorV').textContent = Math.round(v);

    calcularRelacoesBases(ca, mg, k);
}

function calcularRelacoesBases(ca, mg, k) {
    // Ca/Mg (ideal: 3-5)
    const caMg = mg > 0 ? ca / mg : 0;
    const caMgPercent = Math.min((caMg / 10) * 100, 100);
    document.getElementById('relacaoCaMg').textContent = mg > 0 ? caMg.toFixed(1) : '--';
    document.getElementById('barraCaMg').style.width = caMgPercent + '%';
    
    if (caMg >= 3 && caMg <= 5) {
        document.getElementById('statusCaMg').textContent = '✓';
        document.getElementById('statusCaMg').style.color = '#4ADE80';
    } else if (caMg > 0) {
        document.getElementById('statusCaMg').textContent = '3-5';
        document.getElementById('statusCaMg').style.color = '#9CA3AF';
    } else {
        document.getElementById('statusCaMg').textContent = '3-5';
    }

    // Ca/K (ideal: 10-30)
    const caK = k > 0 ? ca / k : 0;
    const caKPercent = Math.min((caK / 50) * 100, 100);
    document.getElementById('relacaoCaK').textContent = k > 0 ? caK.toFixed(1) : '--';
    document.getElementById('barraCaK').style.width = caKPercent + '%';
    
    if (caK >= 10 && caK <= 30) {
        document.getElementById('statusCaK').textContent = '✓';
        document.getElementById('statusCaK').style.color = '#3B82F6';
    } else if (caK > 0) {
        document.getElementById('statusCaK').textContent = '10-30';
        document.getElementById('statusCaK').style.color = '#9CA3AF';
    } else {
        document.getElementById('statusCaK').textContent = '10-30';
    }

    // Mg/K (ideal: 3-10)
    const mgK = k > 0 ? mg / k : 0;
    const mgKPercent = Math.min((mgK / 20) * 100, 100);
    document.getElementById('relacaoMgK').textContent = k > 0 ? mgK.toFixed(1) : '--';
    document.getElementById('barraMgK').style.width = mgKPercent + '%';
    
    if (mgK >= 3 && mgK <= 10) {
        document.getElementById('statusMgK').textContent = '✓';
        document.getElementById('statusMgK').style.color = '#F59E0B';
    } else if (mgK > 0) {
        document.getElementById('statusMgK').textContent = '3-10';
        document.getElementById('statusMgK').style.color = '#9CA3AF';
    } else {
        document.getElementById('statusMgK').textContent = '3-10';
    }
}

// ========================================
// LÓGICA DE INTERFERÊNCIA DO pH
// ========================================
function updateInterference(ph) {
    const nutrients = {
        n:  { optimal: [6.0, 7.0], range: [5.0, 8.0] },
        p:  { optimal: [6.0, 7.0], range: [5.5, 7.5] },
        k:  { optimal: [6.0, 7.5], range: [5.5, 8.0] },
        ca: { optimal: [6.0, 7.5], range: [5.5, 8.5] },
        mg: { optimal: [6.0, 8.0], range: [5.5, 8.5] },
        s:  { optimal: [5.5, 7.5], range: [5.0, 8.0] },
        fe: { optimal: [5.0, 6.5], range: [4.5, 7.0] },
        mn: { optimal: [5.0, 6.5], range: [4.5, 7.0] },
        zn: { optimal: [5.0, 7.0], range: [4.5, 7.5] },
        cu: { optimal: [5.0, 7.0], range: [4.5, 7.5] },
        b:  { optimal: [5.0, 7.0], range: [4.5, 8.0] },
        mo: { optimal: [6.0, 8.0], range: [5.5, 8.5] }
    };

    Object.keys(nutrients).forEach(nutrient => {
        const elem = document.getElementById('int-' + nutrient);
        const n = nutrients[nutrient];
        
        let status = 'neutral';
        let value = '--';

        if (ph >= n.optimal[0] && ph <= n.optimal[1]) {
            status = 'positive';
            value = '100%';
        } else if (ph >= n.range[0] && ph <= n.range[1]) {
            status = 'neutral';
            const distance = Math.min(
                Math.abs(ph - n.optimal[0]),
                Math.abs(ph - n.optimal[1])
            );
            const percentage = Math.max(50, 100 - (distance * 20));
            value = Math.round(percentage) + '%';
        } else {
            status = 'negative';
            const distance = Math.min(
                Math.abs(ph - n.range[0]),
                Math.abs(ph - n.range[1])
            );
            const percentage = Math.max(10, 50 - (distance * 15));
            value = Math.round(percentage) + '%';
        }

        elem.textContent = value;
        elem.className = 'interference-value interference-' + status;
    });
}

// ========================================
// CONTROLE DE MENUS
// ========================================
function toggleMenuCorretivo() {
    const menu = document.getElementById('correctiveMenu');
    menu.classList.toggle('active');
}

function toggleMenuPotassio() {
    const menu = document.getElementById('potassioMenu');
    menu.classList.toggle('active');
}

function toggleMenuFosforo() {
    const menu = document.getElementById('fosforoMenu');
    menu.classList.toggle('active');
}

function toggleMenuMicro() {
    const menu = document.getElementById('microMenu');
    menu.classList.toggle('active');
}

// ========================================
// CONTROLE DE CORRETIVOS
// ========================================
const selectedCorrectives = {
    dolomitico: false,
    calcitico: false,
    gesso: false
};

function hasCalcarioSelected() {
    return selectedCorrectives.dolomitico || selectedCorrectives.calcitico;
}

function toggleCorrective(type) {
    const menuItem = event.currentTarget;
    selectedCorrectives[type] = !selectedCorrectives[type];
    menuItem.classList.toggle('selected');

    if (type === 'gesso') {
        const card = document.getElementById('cardGesso');
        card.classList.toggle('active', selectedCorrectives.gesso);
    } else {
        const cardCalagem = document.getElementById('cardCalagem');
        const miniCard = document.getElementById('mini' + type.charAt(0).toUpperCase() + type.slice(1));
        
        if (selectedCorrectives[type]) {
            if (!cardCalagem.classList.contains('active')) {
                cardCalagem.classList.add('active');
            }
            miniCard.style.display = 'block';
        } else {
            miniCard.style.display = 'none';
            if (!hasCalcarioSelected()) {
                cardCalagem.classList.remove('active');
            }
        }
    }
}

function removeCorrective(type) {
    selectedCorrectives[type] = false;
    
    const menuItems = document.querySelectorAll('#correctiveMenu .menu-item');
    menuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if ((text.includes('dolomítico') && type === 'dolomitico') ||
            (text.includes('calcítico') && type === 'calcitico') ||
            (text.includes('gesso') && type === 'gesso')) {
            item.classList.remove('selected');
        }
    });

    if (type === 'gesso') {
        document.getElementById('cardGesso').classList.remove('active');
    } else {
        const miniCard = document.getElementById('mini' + type.charAt(0).toUpperCase() + type.slice(1));
        miniCard.style.display = 'none';
        if (!hasCalcarioSelected()) {
            document.getElementById('cardCalagem').classList.remove('active');
        }
    }
}

// ========================================
// CONTROLE DE NUTRIENTES
// ========================================
function toggleNutrient(type, category) {
    const menuItem = event.currentTarget;
    menuItem.classList.toggle('selected');

    const menuId = type + 'Menu';
    const cardId = 'card' + type.charAt(0).toUpperCase() + type.slice(1);
    
    const anySelected = document.querySelector('#' + menuId + ' .menu-item.selected');
    document.getElementById(cardId).classList.toggle('active', anySelected !== null);
}

function removeNutrient(type) {
    const menuId = type + 'Menu';
    document.querySelectorAll('#' + menuId + ' .menu-item').forEach(item => {
        item.classList.remove('selected');
    });

    const cardId = 'card' + type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById(cardId).classList.remove('active');
}

// ========================================
// MINIMIZAR CARDS
// ========================================
function minimizeCard(cardId) {
    const content = document.querySelector('#' + cardId + ' .card-content');
    if (content.style.display === 'none') {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
}

// ========================================
// CONTROLE DE MICRONUTRIENTES
// ========================================
const selectedMicros = {
    fe: false,
    mn: false,
    zn: false,
    cu: false,
    b: false,
    mo: false
};

function toggleMicro(type) {
    const menuItem = event.currentTarget;
    selectedMicros[type] = !selectedMicros[type];
    menuItem.classList.toggle('selected');

    const cardMicro = document.getElementById('cardMicro');
    const miniCard = document.getElementById('micro' + type.charAt(0).toUpperCase() + type.slice(1));

    if (selectedMicros[type]) {
        if (!cardMicro.classList.contains('active')) {
            cardMicro.classList.add('active');
        }
        miniCard.style.display = 'block';
    } else {
        miniCard.style.display = 'none';
        if (!hasMicroSelected()) {
            cardMicro.classList.remove('active');
        }
    }
}

function hasMicroSelected() {
    return Object.values(selectedMicros).some(val => val === true);
}

function removeMicro(element) {
    selectedMicros[element] = false;

    const menuItems = document.querySelectorAll('#microMenu .menu-item');
    const names = { fe: 'ferro', mn: 'manganês', zn: 'zinco', cu: 'cobre', b: 'boro', mo: 'molibdênio' };
    menuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(names[element])) {
            item.classList.remove('selected');
        }
    });

    const miniCard = document.getElementById('miniMicro' + element.charAt(0).toUpperCase() + element.slice(1));
    if (miniCard) miniCard.style.display = 'none';

    if (!hasMicroSelected()) {
        document.getElementById('cardMicro').classList.remove('active');
    }
}

function closeAllMicro() {
    Object.keys(selectedMicros).forEach(key => {
        selectedMicros[key] = false;
    });

    document.querySelectorAll('#microMenu .menu-item').forEach(item => {
        item.classList.remove('selected');
    });

    document.querySelectorAll('[id^="miniMicro"]').forEach(mini => {
        mini.style.display = 'none';
    });

    document.getElementById('cardMicro').classList.remove('active');
}

// ========================================
// CAMPOS CONDICIONAIS - CORREÇÃO TOTAL
// ========================================

// POTÁSSIO
function toggleCamposCorrecaoPotassio() {
    const metodo = document.getElementById('metodoPotassio');
    const campos = document.getElementById('camposCorrecaoPotassio');
    
    if (metodo && campos) {
        if (metodo.value !== '') {
            campos.style.display = 'block';
        } else {
            campos.style.display = 'none';
            const correcaoTotal = document.getElementById('correcaoTotalPotassio');
            const percentual = document.getElementById('percentualPotassio');
            if (correcaoTotal) correcaoTotal.value = '';
            if (percentual) percentual.style.display = 'none';
        }
    }
}

function togglePercentualPotassio() {
    const correcaoTotal = document.getElementById('correcaoTotalPotassio');
    const percentual = document.getElementById('percentualPotassio');
    
    if (correcaoTotal && percentual) {
        if (correcaoTotal.value === 'nao') {
            percentual.style.display = 'block';
        } else {
            percentual.style.display = 'none';
        }
    }
}

// FÓSFORO
function toggleCamposCorrecaoFosforo() {
    const metodo = document.getElementById('metodoFosforo');
    const campos = document.getElementById('camposCorrecaoFosforo');
    
    if (metodo && campos) {
        if (metodo.value !== '') {
            campos.style.display = 'block';
        } else {
            campos.style.display = 'none';
            const correcaoTotal = document.getElementById('correcaoTotalFosforo');
            const percentual = document.getElementById('percentualFosforo');
            if (correcaoTotal) correcaoTotal.value = '';
            if (percentual) percentual.style.display = 'none';
        }
    }
}

function togglePercentualFosforo() {
    const correcaoTotal = document.getElementById('correcaoTotalFosforo');
    const percentual = document.getElementById('percentualFosforo');
    
    if (correcaoTotal && percentual) {
        if (correcaoTotal.value === 'nao') {
            percentual.style.display = 'block';
        } else {
            percentual.style.display = 'none';
        }
    }
}

// ========================================
// NUTRIENTES ADICIONAIS - POTÁSSIO
// ========================================
let contadorNutrientesPotassio = 0;

function toggleNutrientesAdicionaisPotassio() {
    const select = document.getElementById('outroNutrientePotassio');
    const container = document.getElementById('nutrientesAdicionaisPotassio');
    
    if (select && container) {
        if (select.value === 'sim') {
            container.style.display = 'block';
            if (document.getElementById('listaNutrientesPotassio').children.length === 0) {
                adicionarNutrientePotassio();
            }
        } else {
            container.style.display = 'none';
            document.getElementById('listaNutrientesPotassio').innerHTML = '';
            contadorNutrientesPotassio = 0;
        }
    }
}

function adicionarNutrientePotassio() {
    contadorNutrientesPotassio++;
    const id = 'nutrientePotassio' + contadorNutrientesPotassio;
    
    const html = `
        <div id="${id}" style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #E5E5E7;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 0.85em; color: #86868B;">Nutriente ${contadorNutrientesPotassio}</span>
                <button onclick="removerNutrientePotassio('${id}')" 
                        class="control-btn" 
                        title="Remover">×</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <label style="font-size: 0.8em; color: #1D1D1F; font-weight: 400; display: block; margin-bottom: 4px;">Nutriente</label>
                    <select class="dropdown-clean">
                        <option value="">Selecione</option>
                        <option value="n">Nitrogênio (N)</option>
                        <option value="p">Fósforo (P₂O₅)</option>
                        <option value="s">Enxofre (S)</option>
                        <option value="ca">Cálcio (Ca)</option>
                        <option value="mg">Magnésio (Mg)</option>
                    </select>
                </div>
                <div>
                    <label style="font-size: 0.8em; color: #1D1D1F; font-weight: 400; display: block; margin-bottom: 4px;">Teor (%)</label>
                    <input type="number" step="0.1" placeholder="0.0" style="width: 100%; border: 1px solid #D1D1D6; border-radius: 6px; padding: 6px 10px; font-size: 0.9em; background: white;">
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('listaNutrientesPotassio').insertAdjacentHTML('beforeend', html);
}

function removerNutrientePotassio(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.remove();
    }
}

// ========================================
// NUTRIENTES ADICIONAIS - FÓSFORO
// ========================================
let contadorNutrientesFosforo = 0;

function toggleNutrientesAdicionaisFosforo() {
    const select = document.getElementById('outroNutrienteFosforo');
    const container = document.getElementById('nutrientesAdicionaisFosforo');
    
    if (select && container) {
        if (select.value === 'sim') {
            container.style.display = 'block';
            if (document.getElementById('listaNutrientesFosforo').children.length === 0) {
                adicionarNutrienteFosforo();
            }
        } else {
            container.style.display = 'none';
            document.getElementById('listaNutrientesFosforo').innerHTML = '';
            contadorNutrientesFosforo = 0;
        }
    }
}

function adicionarNutrienteFosforo() {
    contadorNutrientesFosforo++;
    const id = 'nutrienteFosforo' + contadorNutrientesFosforo;
    
    const html = `
        <div id="${id}" style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #E5E5E7;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 0.85em; color: #86868B;">Nutriente ${contadorNutrientesFosforo}</span>
                <button onclick="removerNutrienteFosforo('${id}')" 
                        class="control-btn" 
                        title="Remover">×</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <label style="font-size: 0.8em; color: #1D1D1F; font-weight: 400; display: block; margin-bottom: 4px;">Nutriente</label>
                    <select class="dropdown-clean">
                        <option value="">Selecione</option>
                        <option value="n">Nitrogênio (N)</option>
                        <option value="k">Potássio (K₂O)</option>
                        <option value="s">Enxofre (S)</option>
                        <option value="ca">Cálcio (Ca)</option>
                        <option value="mg">Magnésio (Mg)</option>
                    </select>
                </div>
                <div>
                    <label style="font-size: 0.8em; color: #1D1D1F; font-weight: 400; display: block; margin-bottom: 4px;">Teor (%)</label>
                    <input type="number" step="0.1" placeholder="0.0" style="width: 100%; border: 1px solid #D1D1D6; border-radius: 6px; padding: 6px 10px; font-size: 0.9em; background: white;">
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('listaNutrientesFosforo').insertAdjacentHTML('beforeend', html);
}

function removerNutrienteFosforo(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.remove();
    }
}

// ========================================
// MÉTODOS DE APLICAÇÃO - MICRONUTRIENTES
// ========================================
const metodosMicronutrientes = {
    fe: null,
    mn: null,
    zn: null,
    cu: null,
    b: null,
    mo: null,
    ni: null,
    se: null
};

function toggleMetodosMicro(elemento, event) {
    event.stopPropagation();
    
    const dropdown = document.getElementById('metodos' + elemento.charAt(0).toUpperCase() + elemento.slice(1));
    const btn = document.getElementById('btn' + elemento.charAt(0).toUpperCase() + elemento.slice(1));
    
    document.querySelectorAll('.metodos-micro-dropdown').forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.btn-add-micro').forEach(b => {
        if (b !== btn) {
            b.classList.remove('active');
        }
    });
    
    dropdown.classList.toggle('active');
    btn.classList.toggle('active');
}

function selecionarMetodoMicro(elemento, metodo, event) {
    event.stopPropagation();
    
    metodosMicronutrientes[elemento] = metodo;
    
    const dropdown = document.getElementById('metodos' + elemento.charAt(0).toUpperCase() + elemento.slice(1));
    const btn = document.getElementById('btn' + elemento.charAt(0).toUpperCase() + elemento.slice(1));
    
    setTimeout(() => {
        dropdown.classList.remove('active');
        btn.classList.remove('active');
    }, 200);
    
    abrirCardRecomendacao(elemento, metodo);
    
    console.log(`${elemento.toUpperCase()}: ${metodo} selecionado`);
}

function abrirCardRecomendacao(elemento, metodo) {
    const card = document.getElementById('cardRecomendacao' + elemento.charAt(0).toUpperCase() + elemento.slice(1));
    const badge = document.getElementById('badgeMetodo' + elemento.charAt(0).toUpperCase() + elemento.slice(1));
    
    if (card) {
        card.style.display = 'block';
        
        if (badge) {
            const textos = {
                'solo': 'Solo',
                'foliar': 'Foliar',
                'solo-foliar': 'S+F'
            };
            badge.textContent = textos[metodo] || metodo;
        }

        const regenciaContainer = document.getElementById('regenciaContainer' + elemento.charAt(0).toUpperCase() + elemento.slice(1));
        if (regenciaContainer) {
            regenciaContainer.style.display = 'flex';
            regenciaContainer.querySelectorAll('.pill-opcao').forEach(pill => {
                pill.classList.remove('removida', 'selecionada');
                pill.style.display = 'inline-flex';
            });
        }

        ['especificaContainer', 'fonteContainer', 'resumo'].forEach(id => {
            const el = document.getElementById(id + elemento.charAt(0).toUpperCase() + elemento.slice(1));
            if (el) el.style.display = 'none';
        });
    }
}

function fecharRecomendacao(elemento) {
    const card = document.getElementById('cardRecomendacao' + elemento.charAt(0).toUpperCase() + elemento.slice(1));
    if (card) {
        card.style.display = 'none';
    }
    metodosMicronutrientes[elemento] = null;
}

// ========================================
// SISTEMA DE PILLS QUE DESAPARECEM
// ========================================
const selecoes = {};

function selecionarOpcao(elemento, tipo, valor, pillElement) {
    if (!selecoes[elemento]) {
        selecoes[elemento] = {};
    }

    selecoes[elemento][tipo] = valor;

    pillElement.classList.add('selecionada');

    setTimeout(() => {
        const container = pillElement.parentElement;
        const pills = container.querySelectorAll('.pill-opcao');
        
        pills.forEach(pill => {
            if (pill !== pillElement) {
                pill.classList.add('removida');
            }
        });

        setTimeout(() => {
            pills.forEach(pill => {
                if (pill !== pillElement) {
                    pill.style.display = 'none';
                }
            });

            proximoPasso(elemento, tipo, valor);
        }, 200);
    }, 300);
}

function proximoPasso(elemento, tipo, valor) {
    const elemCap = elemento.charAt(0).toUpperCase() + elemento.slice(1);

    if (tipo === 'regencia') {
        mostrarEspecificas(elemento, valor);
    } else if (tipo === 'especifica') {
        const fonteContainer = document.getElementById('fonteContainer' + elemCap);
        if (fonteContainer) {
            fonteContainer.style.display = 'block';
        }
    } else if (tipo === 'fonte') {
        const resumo = document.getElementById('resumo' + elemCap);
        if (resumo) {
            resumo.style.display = 'block';
        }
    }
}

// Dados de regência
const dadosRegencia = {
    autor: [
        { val: 'malavolta', txt: 'Malavolta (1980)' },
        { val: 'raij', txt: 'Raij et al. (1997)' },
        { val: 'sousa', txt: 'Sousa & Lobato (2004)' },
        { val: 'novais', txt: 'Novais et al. (2007)' },
        { val: 'embrapa', txt: 'Embrapa (2013)' }
    ],
    tecnologia: [
        { val: 'convencional', txt: 'Convencional' },
        { val: 'intacta', txt: 'Intacta RR2' },
        { val: 'enlist', txt: 'Enlist E3' },
        { val: 'xtend', txt: 'XtendFlex' },
        { val: 'liberty', txt: 'Liberty Link' }
    ],
    cultivar: [
        { val: 'tmg7062', txt: 'TMG 7062' },
        { val: 'ns7709', txt: 'NS 7709' },
        { val: 'm8644', txt: 'M 8644' },
        { val: 'as3730', txt: 'AS 3730' },
        { val: 'bmx', txt: 'BMX Potência' }
    ]
};

function mostrarEspecificas(elemento, tipoRegencia) {
    const elemCap = elemento.charAt(0).toUpperCase() + elemento.slice(1);
    const container = document.getElementById('especificaContainer' + elemCap);
    const label = document.getElementById('labelEspecifica' + elemCap);
    const opsContainer = document.getElementById('especificaOps' + elemCap);

    if (container && opsContainer && label) {
        const labels = {
            'autor': 'Autor/Referência',
            'tecnologia': 'Tecnologia',
            'cultivar': 'Cultivar'
        };
        label.textContent = labels[tipoRegencia] || '';

        opsContainer.innerHTML = '';
        dadosRegencia[tipoRegencia].forEach(item => {
            const pill = document.createElement('button');
            pill.className = 'pill-opcao';
            pill.textContent = item.txt;
            pill.onclick = function() {
                selecionarOpcao(elemento, 'especifica', item.val, this);
            };
            opsContainer.appendChild(pill);
        });

        container.style.display = 'block';
    }
}

// ========================================
// EVENT LISTENERS GLOBAIS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    renderAmostrasTags();
});

document.addEventListener('click', function(event) {
    // Fecha menus flutuantes
    if (!event.target.closest('.button-group') && !event.target.closest('.floating-menu') && !event.target.closest('.recommend-btn')) {
        document.querySelectorAll('.floating-menu').forEach(menu => {
            menu.classList.remove('active');
        });
    }
    
    // Fecha dropdown de amostras
    if (!event.target.closest('#btnAmostras') && !event.target.closest('#amostrasMenu')) {
        const menu = document.getElementById('amostrasMenu');
        const btn = document.getElementById('btnAmostras');
        if (menu) menu.classList.remove('active');
        if (btn) btn.classList.remove('active');
    }
});

// ========================================
// SISTEMA DE GRUPOS DE MICRONUTRIENTES
// ========================================

// Lista de micronutrientes disponíveis (ordem fixa)
const micronutrientesDisponiveis = [
    { id: 'mn', nome: 'Mn', nomeCompleto: 'Manganês' },
    { id: 'zn', nome: 'Zn', nomeCompleto: 'Zinco' },
    { id: 'cu', nome: 'Cu', nomeCompleto: 'Cobre' },
    { id: 'fe', nome: 'Fe', nomeCompleto: 'Ferro' },
    { id: 'b', nome: 'B', nomeCompleto: 'Boro' },
    { id: 'mo', nome: 'Mo', nomeCompleto: 'Molibdênio' },
    { id: 'ni', nome: 'Ni', nomeCompleto: 'Níquel' },
    { id: 'se', nome: 'Se', nomeCompleto: 'Selênio' }
];

// Fontes por micronutriente
const fontesMicronutrientes = {
    mn: [
        { value: 'sulfato', label: 'Sulfato de Manganês (26-28% Mn)' },
        { value: 'quelato', label: 'Quelato de Mn (Mn-EDTA)' },
        { value: 'oxido', label: 'Óxido de Manganês (41-68% Mn)' }
    ],
    zn: [
        { value: 'sulfato', label: 'Sulfato de Zinco (20-22% Zn)' },
        { value: 'quelato', label: 'Quelato de Zinco (14% Zn)' },
        { value: 'oxido', label: 'Óxido de Zinco (50-80% Zn)' }
    ],
    cu: [
        { value: 'sulfato', label: 'Sulfato de Cobre (13-25% Cu)' },
        { value: 'quelato', label: 'Quelato de Cobre (13% Cu)' },
        { value: 'oxido', label: 'Óxido de Cobre (75-89% Cu)' }
    ],
    fe: [
        { value: 'sulfato', label: 'Sulfato Ferroso (19-23% Fe)' },
        { value: 'quelato', label: 'Quelato de Fe (Fe-EDTA)' },
        { value: 'oxido', label: 'Óxido de Ferro (60-70% Fe)' },
        { value: 'eddha', label: 'Fe-EDDHA (6% Fe)' }
    ],
    b: [
        { value: 'acido', label: 'Ácido Bórico (17% B)' },
        { value: 'borax', label: 'Bórax (11% B)' },
        { value: 'ulexita', label: 'Ulexita (10-12% B)' },
        { value: 'colemanita', label: 'Colemanita (10-15% B)' }
    ],
    mo: [
        { value: 'molibdato-sodio', label: 'Molibdato de Sódio (39% Mo)' },
        { value: 'molibdato-amonio', label: 'Molibdato de Amônio (54% Mo)' },
        { value: 'trioxido', label: 'Trióxido de Molibdênio (66% Mo)' }
    ],
    ni: [
        { value: 'sulfato', label: 'Sulfato de Níquel (22% Ni)' },
        { value: 'quelato', label: 'Quelato de Níquel (Ni-EDTA)' }
    ],
    se: [
        { value: 'selenato', label: 'Selenato de Sódio (41% Se)' },
        { value: 'selenito', label: 'Selenito de Sódio (45% Se)' }
    ]
};

// Dados de regência - Autores, Tecnologias e Cultivares
const dadosRegenciaGrupo = {
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
        { value: 'ADV4681-Ipro-SR2', label: 'ADV4681 Ipro - SR2' },
        { value: 'ADV4681-Ipro-SR3', label: 'ADV4681 Ipro - SR3' },
        { value: 'AS3595i2x', label: 'AS3595i2x' },
        { value: 'AS3640i2x', label: 'AS3640i2x' },
        { value: 'AS3700XTD', label: 'AS3700XTD' },
        { value: 'AS3707I2X', label: 'AS3707I2X' },
        { value: 'AS3790i2x', label: 'AS3790i2x' },
        { value: 'CREDENZ-CZ37B39', label: 'CREDENZ CZ37B39' },
        { value: 'CZ16B17-IPRO', label: 'CZ16B17 IPRO' },
        { value: 'CZ37B39-I2X', label: 'CZ37B39 I2X' },
        { value: 'CZ37B43', label: 'CZ37B43' },
        { value: 'CZ37B43Ipro-PM', label: 'CZ37B43Ipro - PM' },
        { value: 'CZ37B43Ipro-PO1', label: 'CZ37B43Ipro - PO1' },
        { value: 'CZ37B43Ipro-PO2', label: 'CZ37B43Ipro - PO2' },
        { value: 'Dagma-7621', label: 'Dagma 7621' },
        { value: 'Dagma-7921', label: 'Dagma 7921' },
        { value: 'Desafio-PER1', label: 'Desafio - PER1' },
        { value: 'DESAFIO-8473RFS', label: 'DESAFIO (8473 RFS)' },
        { value: 'Desafio-RR-BM1', label: 'Desafio RR - BM1' },
        { value: 'Desafio-RR-BM2', label: 'Desafio RR - BM2' },
        { value: 'Desafio-RR-PER2', label: 'Desafio RR - PER2' },
        { value: 'Desafio-RR-VM', label: 'Desafio RR - VM' },
        { value: 'DM-69IX69', label: 'DM 69IX69' },
        { value: 'DM-72IX74', label: 'DM 72IX74' },
        { value: 'DM-74K75', label: 'DM 74K75' },
        { value: 'DM-76IX77', label: 'DM 76IX77' },
        { value: 'Exata-i2x', label: 'Exata i2x (OURO VERDE)' },
        { value: 'FOCO-74177RFS', label: 'FOCO (74177 RFS)' },
        { value: 'Guepardo-IPRO', label: 'Guepardo IPRO (67168 RFS)' },
        { value: 'HO-PARAGUACU', label: 'HO PARAGUAÇU (64HO130 I2X)' },
        { value: 'HO-TAQUARI', label: 'HO TAQUARI (80 H0 110)' },
        { value: 'Juruena-Ipro-SR1', label: 'Juruena Ipro - SR1' },
        { value: 'Juruena-Ipro-SR2', label: 'Juruena Ipro - SR2' },
        { value: 'Juruena-Ipro-SR3', label: 'Juruena Ipro - SR3' },
        { value: 'K7922I2X', label: 'K7922I2X' },
        { value: 'LENDARIA-80K80RFS', label: 'LENDARIA (80K80 RFS)' },
        { value: 'M6430XTD', label: 'M 6430 XTD' },
        { value: 'M6100XTD', label: 'M6100 XTD' },
        { value: 'M6110i2x', label: 'M6110 i2x' },
        { value: 'M6210Ipro', label: 'M6210 Ipro' },
        { value: 'NEO750', label: 'NEO750' },
        { value: 'NEOGEN680', label: 'NEOGEN 680' },
        { value: 'NEOGEN71E', label: 'NEOGEN 71E' },
        { value: 'NEOGEN720', label: 'NEOGEN 720' },
        { value: 'NEOGEN770', label: 'NEOGEN 770' },
        { value: 'Olimpo-80182RFS', label: 'Olimpo (80182 RFS)' },
        { value: 'SUPERA-i2x', label: 'SUPERA i2x (BRASMAX)' }
    ]
};

// Armazena os grupos criados
let gruposMicro = [];
let contadorGrupos = 0;

// Função para criar um novo grupo
function criarGrupoMicro() {
    contadorGrupos++;
    const grupoId = 'grupo-micro-' + contadorGrupos;
    
    const grupo = {
        id: grupoId,
        numero: contadorGrupos,
        nutrientes: [],
        tipoAplicacao: '',
        regenciaTipo: '',
        regenciaEspecifica: '',
        fontesDoses: {}
    };
    
    gruposMicro.push(grupo);
    
    renderGrupo(grupo);
}

// Função para renderizar um grupo
function renderGrupo(grupo) {
    const container = document.getElementById('containerGruposMicro');
    
    const html = `
        <div class="grupo-micro-card" id="${grupo.id}">
            <div class="grupo-micro-header">
                <div class="grupo-micro-titulo">
                    <span class="grupo-micro-numero">${grupo.numero}</span>
                    Grupo de Recomendação
                </div>
                <button class="grupo-micro-close" onclick="removerGrupo('${grupo.id}')" title="Remover grupo">×</button>
            </div>

            <!-- Seletor de Micronutrientes -->
            <div class="micro-selector">
                <span class="micro-selector-label">Selecione os micronutrientes</span>
                <div class="micro-pills-container" id="pills-${grupo.id}">
                    ${micronutrientesDisponiveis.map(m => `
                        <button class="micro-pill" 
                                data-micro="${m.id}" 
                                onclick="toggleMicroPill('${grupo.id}', '${m.id}', this)">
                            ${m.nome}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Configuração do Grupo -->
            <div class="grupo-config-section">
                <div class="grupo-config-row">
                    <div class="grupo-config-field">
                        <label>Tipo de Aplicação</label>
                        <select id="tipoAplicacao-${grupo.id}" onchange="updateGrupoConfig('${grupo.id}', 'tipoAplicacao', this.value)">
                            <option value="">Selecione...</option>
                            <option value="solo">Solo</option>
                            <option value="foliar">Aplicação Foliar</option>
                            <option value="solo-foliar">Solo e Aplicação Foliar</option>
                        </select>
                    </div>
                    <div class="grupo-config-field">
                        <label>Tipo de Regência</label>
                        <select id="regenciaTipo-${grupo.id}" onchange="updateRegenciaTipo('${grupo.id}', this.value)">
                            <option value="">Selecione...</option>
                            <option value="autor">📚 Autor/Referência</option>
                            <option value="tecnologia">⚙️ Tecnologia</option>
                            <option value="cultivar">🌱 Cultivar</option>
                        </select>
                    </div>
                </div>
                <div class="grupo-config-row" id="regenciaEspecificaRow-${grupo.id}" style="display: none;">
                    <div class="grupo-config-field" style="grid-column: span 2;">
                        <label>Regência Específica</label>
                        <select id="regenciaEspecifica-${grupo.id}" onchange="updateGrupoConfig('${grupo.id}', 'regenciaEspecifica', this.value)">
                            <option value="">Selecione...</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Fontes e Doses (aparece quando há nutrientes selecionados) -->
            <div class="fontes-doses-section" id="fontesDoses-${grupo.id}" style="display: none;">
                <div class="fontes-doses-titulo">Fontes e Doses por Nutriente</div>
                <div id="listaNutrientes-${grupo.id}">
                    <!-- Nutrientes aparecerão aqui -->
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
}

// Toggle pill de micronutriente
function toggleMicroPill(grupoId, microId, element) {
    const grupo = gruposMicro.find(g => g.id === grupoId);
    if (!grupo) return;
    
    const index = grupo.nutrientes.indexOf(microId);
    
    if (index === -1) {
        // Adicionar
        grupo.nutrientes.push(microId);
        element.classList.add('selected');
    } else {
        // Remover
        grupo.nutrientes.splice(index, 1);
        element.classList.remove('selected');
        delete grupo.fontesDoses[microId];
    }
    
    // Ordenar nutrientes na ordem fixa
    const ordemFixa = micronutrientesDisponiveis.map(m => m.id);
    grupo.nutrientes.sort((a, b) => ordemFixa.indexOf(a) - ordemFixa.indexOf(b));
    
    // Atualizar seção de fontes/doses
    renderFontesDoses(grupo);
}

// Atualizar configuração do grupo
function updateGrupoConfig(grupoId, campo, valor) {
    const grupo = gruposMicro.find(g => g.id === grupoId);
    if (!grupo) return;
    
    grupo[campo] = valor;
}

// Atualizar tipo de regência
function updateRegenciaTipo(grupoId, valor) {
    const grupo = gruposMicro.find(g => g.id === grupoId);
    if (!grupo) return;
    
    grupo.regenciaTipo = valor;
    grupo.regenciaEspecifica = '';
    
    const rowEspecifica = document.getElementById(`regenciaEspecificaRow-${grupoId}`);
    const selectEspecifica = document.getElementById(`regenciaEspecifica-${grupoId}`);
    
    if (valor && dadosRegenciaGrupo[valor]) {
        // Mostrar e popular dropdown de regência específica
        rowEspecifica.style.display = 'grid';
        
        const options = dadosRegenciaGrupo[valor];
        selectEspecifica.innerHTML = '<option value="">Selecione...</option>' +
            options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    } else {
        rowEspecifica.style.display = 'none';
        selectEspecifica.innerHTML = '<option value="">Selecione...</option>';
    }
}

// Renderizar seção de fontes e doses
function renderFontesDoses(grupo) {
    const container = document.getElementById(`listaNutrientes-${grupo.id}`);
    const section = document.getElementById(`fontesDoses-${grupo.id}`);
    
    if (grupo.nutrientes.length === 0) {
        section.style.display = 'none';
        container.innerHTML = '';
        return;
    }
    
    section.style.display = 'block';
    
    let html = '';
    
    grupo.nutrientes.forEach(microId => {
        const micro = micronutrientesDisponiveis.find(m => m.id === microId);
        const fontes = fontesMicronutrientes[microId] || [];
        const unidade = microId === 'mo' ? 'g/ha' : 'kg/ha';
        
        // Preservar valores existentes
        const fonteSelecionada = grupo.fontesDoses[microId]?.fonte || '';
        const doseAtual = grupo.fontesDoses[microId]?.dose || '';
        
        html += `
            <div class="fonte-dose-item">
                <div class="fonte-dose-nutriente">${micro.nome}</div>
                <select class="fonte-dose-select" 
                        id="fonte-${grupo.id}-${microId}"
                        onchange="updateFonteDose('${grupo.id}', '${microId}', 'fonte', this.value)">
                    <option value="">Fonte...</option>
                    ${fontes.map(f => `
                        <option value="${f.value}" ${fonteSelecionada === f.value ? 'selected' : ''}>
                            ${f.label}
                        </option>
                    `).join('')}
                </select>
                <div style="display: flex; align-items: center;">
                    <input type="number" 
                           class="fonte-dose-input" 
                           id="dose-${grupo.id}-${microId}"
                           placeholder="0.0" 
                           step="0.1"
                           value="${doseAtual}"
                           onchange="updateFonteDose('${grupo.id}', '${microId}', 'dose', this.value)">
                    <span class="fonte-dose-unidade">${unidade}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Atualizar fonte ou dose de um nutriente
function updateFonteDose(grupoId, microId, campo, valor) {
    const grupo = gruposMicro.find(g => g.id === grupoId);
    if (!grupo) return;
    
    if (!grupo.fontesDoses[microId]) {
        grupo.fontesDoses[microId] = { fonte: '', dose: '' };
    }
    
    grupo.fontesDoses[microId][campo] = valor;
}

// Remover grupo
function removerGrupo(grupoId) {
    const index = gruposMicro.findIndex(g => g.id === grupoId);
    if (index !== -1) {
        gruposMicro.splice(index, 1);
    }
    
    const element = document.getElementById(grupoId);
    if (element) {
        element.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => element.remove(), 200);
    }
}

// Obter dados dos grupos (para exportação/uso)
function getGruposMicroData() {
    return gruposMicro.map(grupo => ({
        numero: grupo.numero,
        nutrientes: grupo.nutrientes,
        tipoAplicacao: grupo.tipoAplicacao,
        regenciaTipo: grupo.regenciaTipo,
        regenciaEspecifica: grupo.regenciaEspecifica,
        fontesDoses: grupo.fontesDoses
    }));
}

// CSS Animation adicional (adiciona ao head)
const styleExtra = document.createElement('style');
styleExtra.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(styleExtra);
