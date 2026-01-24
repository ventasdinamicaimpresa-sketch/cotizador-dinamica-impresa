document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const form = document.getElementById('cotizadorForm');
    const tamanoSelect = document.getElementById('tamano');
    const papelSelect = document.getElementById('papel');
    const cantidadInput = document.getElementById('cantidad');
    const colorSelect = document.getElementById('color');
    const ladosSelect = document.getElementById('lados');

    // Result display elements
    const resultadoDiv = document.getElementById('resultado');
    const subtotalSpan = document.getElementById('subtotal');
    const ivaSpan = document.getElementById('iva');
    const precioFinalSpan = document.getElementById('precioFinal');
    const costoUnitarioSpan = document.getElementById('costoUnitario');
    const costoUnitarioSinIvaSpan = document.getElementById('costoUnitarioSinIva');
    const resumenCostosTextoP = document.getElementById('resumenCostosTexto');
    const resumenSimplificadoTextoPre = document.getElementById('resumenSimplificadoTexto');
    const advertenciaOffsetDiv = document.getElementById('advertenciaOffset');

    // Action buttons
    const limpiarCamposBtn = document.getElementById('limpiarCampos');
    const copiarPortapapelesBtn = document.getElementById('copiarPortapapeles');

    // Data from TXT file
    const costosPapel = {
        'carta': {
            'papel-opalina-blanca-120gr': { costo: 3.80, porPliego: 8, cortePorHojas: 200 },
            'cartulina-opalina-blanca-225gr': { costo: 7.34, porPliego: 8, cortePorHojas: 100 },
            'cartulina-opalina-crema-225gr': { costo: 6.20, porPliego: 8, cortePorHojas: 100 },
            'papel-bond-75gr': { costo: 1.56, porPliego: 8, cortePorHojas: 500 },
            'papel-bond-90gr': { costo: 1.60, porPliego: 8, cortePorHojas: 500 },
            'papel-couche-130gr': { costo: 2.31, porPliego: 8, cortePorHojas: 500 },
            'papel-couche-150gr': { costo: 2.95, porPliego: 8, cortePorHojas: 250 },
            'cartulina-couche-200gr': { costo: 3.42, porPliego: 8, cortePorHojas: 250 },
            'cartulina-couche-250gr': { costo: 4.51, porPliego: 8, cortePorHojas: 250 },
            'cartulina-couche-300gr': { costo: 5.40, porPliego: 8, cortePorHojas: 125 },
        },
        'oficio': {
            'papel-opalina-blanca-120gr': { costo: 5.07, porPliego: 8, cortePorHojas: 200 },
            'papel-bond-75gr': { costo: 1.63, porPliego: 8, cortePorHojas: 500 },
            'papel-bond-90gr': { costo: 1.95, porPliego: 8, cortePorHojas: 500 },
            'papel-couche-130gr': { costo: 3.26, porPliego: 8, cortePorHojas: 250 },
            'papel-couche-150gr': { costo: 3.50, porPliego: 8, cortePorHojas: 250 },
            'cartulina-couche-200gr': { costo: 4.91, porPliego: 8, cortePorHojas: 125 },
            'cartulina-couche-250gr': { costo: 6.23, porPliego: 8, cortePorHojas: 125 },
            'cartulina-couche-300gr': { costo: 7.37, porPliego: 8, cortePorHojas: 125 },
        }
    };
    const costosImpresion = {
        'color': {
            'carta': [{ max: 100, costo: 6.08 }, { max: 200, costo: 6.00 }, { max: 300, costo: 5.85 }, { max: 500, costo: 5.70 }],
            'doble-carta': [{ max: 100, costo: 12.16 }, { max: 200, costo: 12.00 }, { max: 300, costo: 11.70 }, { max: 500, costo: 11.40 }],
            'oficio': [{ max: 100, costo: 6.50 }, { max: 200, costo: 6.08 }, { max: 300, costo: 5.90 }, { max: 500, costo: 5.70 }],
            'doble-oficio': [{ max: 100, costo: 13.00 }, { max: 200, costo: 12.16 }, { max: 300, costo: 11.80 }, { max: 500, costo: 11.40 }]
        },
        'blanco-negro': {
            'carta': [{ max: 100, costo: 1.06 }, { max: 200, costo: 1.00 }, { max: 300, costo: 0.98 }, { max: 500, costo: 0.80 }, { max: Infinity, costo: 0.78 }],
            'doble-carta': [{ max: 100, costo: 2.12 }, { max: 200, costo: 2.00 }, { max: 300, costo: 1.96 }, { max: 500, costo: 1.60 }, { max: Infinity, costo: 1.56 }],
            'oficio': [{ max: 100, costo: 1.20 }, { max: 200, costo: 1.05 }, { max: 300, costo: 0.98 }, { max: 500, costo: 0.80 }, { max: Infinity, costo: 0.78 }],
            'doble-oficio': [{ max: 100, costo: 2.40 }, { max: 200, costo: 2.10 }, { max: 300, costo: 1.96 }, { max: 500, costo: 1.60 }, { max: Infinity, costo: 1.56 }]
        }
    };
    costosImpresion['1-color'] = costosImpresion['color'];
    costosImpresion['2-colores'] = costosImpresion['color'];
    costosImpresion['3-colores'] = costosImpresion['color'];
    const bajadasCorte = { '1/8': 8, '1/4': 7, '1/3': 6, '1/2': 5 };
    const costoPorBajada = 25;
    const IVA_RATE = 0.16;

    function formatCurrency(value) {
        return `$${value.toFixed(2)}`;
    }

    function actualizarOpcionesPapel() {
        const tamanoSeleccionado = tamanoSelect.value;
        const tipoPliego = tamanoSeleccionado.includes('oficio') ? 'oficio' : 'carta';
        const opciones = costosPapel[tipoPliego];
        papelSelect.innerHTML = '';
        for (const key in opciones) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            papelSelect.appendChild(option);
        }
    }

    function calcularCosto() {
        const cantidad = parseInt(cantidadInput.value);
        const tamano = tamanoSelect.value;
        const color = colorSelect.value;
        const lados = parseInt(ladosSelect.value);
        const papelKey = papelSelect.value;
        const papelNombre = papelSelect.options[papelSelect.selectedIndex].text;
        const disenoSelect = document.getElementById('diseno');
        const costoDiseno = parseFloat(disenoSelect.value);
        const disenoNombre = disenoSelect.options[disenoSelect.selectedIndex].text;

        if (!cantidad || !tamano || !color || !lados || !papelKey) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        let resumenDetallado = 'Cálculo Detallado:\n\n';

        // --- 1. Costo de Papel ---
        const tipoPliego = tamano.includes('oficio') ? 'oficio' : 'carta';
        const papelData = costosPapel[tipoPliego][papelKey];
        const costoPorHojaBase = (papelData.costo / papelData.porPliego) * 2;

        let divisorTamano = 1;
        if (tamano.includes('doble')) {
            divisorTamano = 1 / 2;
        } else if (tamano.includes('1/2')) {
            divisorTamano = 2;
        } else if (tamano.includes('1/3')) {
            divisorTamano = 3;
        } else if (tamano.includes('1/4')) {
            divisorTamano = 4;
        } else if (tamano.includes('1/8')) {
            divisorTamano = 8;
        }

        const hojasBaseNecesarias = Math.ceil(cantidad / divisorTamano);
        const costoTotalPapel = costoPorHojaBase * hojasBaseNecesarias;

        resumenDetallado += `1. Costo de Papel (${papelNombre}):\n`;
        resumenDetallado += `   - Costo del pliego: ${formatCurrency(papelData.costo)}\n`;
        resumenDetallado += `   - Hojas (${tipoPliego}) por pliego: ${papelData.porPliego}\n`;
        resumenDetallado += `   - Fórmula costo por hoja base (con utilidad): (${formatCurrency(papelData.costo)} / ${papelData.porPliego}) * 2 = ${formatCurrency(costoPorHojaBase)}\n`;
        resumenDetallado += `   - Hojas base necesarias para ${cantidad} volantes de ${tamano}: CEIL(${cantidad} / ${divisorTamano}) = ${hojasBaseNecesarias}\n`;
        resumenDetallado += `   - Costo total del papel: ${formatCurrency(costoPorHojaBase)} * ${hojasBaseNecesarias} = ${formatCurrency(costoTotalPapel)}\n\n`;

        // --- 2. Costo de Impresión ---
        let tamanoBaseImpresion;
        if (tamano.includes('doble-carta')) tamanoBaseImpresion = 'doble-carta';
        else if (tamano.includes('carta')) tamanoBaseImpresion = 'carta';
        else if (tamano.includes('doble-oficio')) tamanoBaseImpresion = 'doble-oficio';
        else tamanoBaseImpresion = 'oficio';

        const rangos = costosImpresion[color][tamanoBaseImpresion];
        let costoImpresionPorHojaBase = rangos[rangos.length - 1].costo;
        
        for (const rango of rangos) {
            if (hojasBaseNecesarias <= rango.max) {
                costoImpresionPorHojaBase = rango.costo;
                break;
            }
        }

        const costoTotalImpresion = costoImpresionPorHojaBase * hojasBaseNecesarias * lados;

        resumenDetallado += `2. Costo de Impresión (${color.replace(/-/g, ' ')} a ${lados} lado(s)):\n`;
        resumenDetallado += `   - Hojas a imprimir (${tamanoBaseImpresion}): ${hojasBaseNecesarias}\n`;
        resumenDetallado += `   - Costo de impresión por hoja (según cantidad de hojas): ${formatCurrency(costoImpresionPorHojaBase)}\n`;
        resumenDetallado += `   - Fórmula costo total: ${formatCurrency(costoImpresionPorHojaBase)} * ${hojasBaseNecesarias} hojas * ${lados} lado(s) = ${formatCurrency(costoTotalImpresion)}\n\n`;

        // --- 3. Costo de Corte ---
        let costoTotalCorte = 0;
        const tamanoFraccion = Object.keys(bajadasCorte).find(f => tamano.includes(f));
        if (tamanoFraccion) {
            const numBajadas = bajadasCorte[tamanoFraccion];
            const gruposDeCorte = Math.ceil(hojasBaseNecesarias / papelData.cortePorHojas);
            costoTotalCorte = numBajadas * costoPorBajada * gruposDeCorte;
            resumenDetallado += `3. Costo de Corte:\n`;
            resumenDetallado += `   - Bajadas de guillotina para ${tamanoFraccion}: ${numBajadas}\n`;
            resumenDetallado += `   - Costo por bajada: ${formatCurrency(costoPorBajada)}\n`;
            resumenDetallado += `   - Hojas por grupo de corte (según papel): ${papelData.cortePorHojas}\n`;
            resumenDetallado += `   - Grupos de corte necesarios: CEIL(${hojasBaseNecesarias} / ${papelData.cortePorHojas}) = ${gruposDeCorte}\n`;
            resumenDetallado += `   - Fórmula costo total de corte: ${numBajadas} bajadas * ${formatCurrency(costoPorBajada)} * ${gruposDeCorte} grupo(s) = ${formatCurrency(costoTotalCorte)}\n\n`;
        } else {
            resumenDetallado += `3. Costo de Corte: ${formatCurrency(0)} (No aplica para este tamaño)\n\n`;
        }

        // --- 4. Costo de Diseño ---
        resumenDetallado += `4. Costo de Diseño (${disenoNombre}): ${formatCurrency(costoDiseno)}\n\n`;

        // --- 5. Totalización ---
        const subtotal = costoTotalPapel + costoTotalImpresion + costoTotalCorte + costoDiseno;
        const iva = subtotal * IVA_RATE;
        const total = subtotal + iva;
        const costoUnitario = total / cantidad;
        const costoUnitarioSinIva = subtotal / cantidad;

        resumenDetallado += `5. Totalización:\n`;
        resumenDetallado += `   - Subtotal (Papel + Impresión + Corte + Diseño): ${formatCurrency(subtotal)}\n`;
        resumenDetallado += `   - IVA (16%): ${formatCurrency(iva)}\n`;
        resumenDetallado += `   - Total: ${formatCurrency(total)}\n`;
        resumenDetallado += `   - Costo Unitario (Neto): ${formatCurrency(total)} / ${cantidad} = ${formatCurrency(costoUnitario)}\n`;
        resumenDetallado += `   - Costo Unitario (sin IVA): ${formatCurrency(subtotal)} / ${cantidad} = ${formatCurrency(costoUnitarioSinIva)}\n`;

        // --- Display Results ---
        resultadoDiv.style.display = 'block';
        subtotalSpan.textContent = formatCurrency(subtotal);
        ivaSpan.textContent = formatCurrency(iva);
        precioFinalSpan.textContent = formatCurrency(total);
        costoUnitarioSpan.textContent = formatCurrency(costoUnitario);
        costoUnitarioSinIvaSpan.textContent = formatCurrency(costoUnitarioSinIva);
        resumenCostosTextoP.textContent = resumenDetallado;

        // --- Generate Simplified Summary ---
        const resumenSimplificado = `${cantidad} Volantes tamaño ${tamano.replace(/-/g, ' ')} en ${papelNombre}, impresión ${color.replace(/-/g, ' ')} a ${lados} lado(s), ${disenoNombre}. Costo Unitario: ${formatCurrency(costoUnitario)}, Costo Total: ${formatCurrency(total)}, Impresion Digital Laser`;
        resumenSimplificadoTextoPre.textContent = resumenSimplificado;

        // --- Show/Hide Offset Warning ---
        if (hojasBaseNecesarias >= 350 && ['carta', 'oficio', 'doble-carta', 'doble-oficio'].includes(tamanoBaseImpresion)) {
            advertenciaOffsetDiv.innerHTML = '<span class="icono-advertencia"><i class="bi bi-exclamation-triangle-fill"></i></span> Se recomienda cotizar en offset';
            advertenciaOffsetDiv.style.display = 'block';
        } else {
            advertenciaOffsetDiv.style.display = 'none';
        }
    }

    function limpiarCampos() {
        form.reset();
        resultadoDiv.style.display = 'none';
        advertenciaOffsetDiv.style.display = 'none';
        actualizarOpcionesPapel();
    }

    function copiarAlPortapapeles() {
        const texto = resumenSimplificadoTextoPre.textContent;
        navigator.clipboard.writeText(texto).then(() => {
            alert('¡Resumen copiado al portapapeles!');
        }, (err) => {
            alert('Error al copiar el texto.');
            console.error('Error al copiar: ', err);
        });
    }

    // Event Listeners
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calcularCosto();
    });
    tamanoSelect.addEventListener('change', actualizarOpcionesPapel);
    limpiarCamposBtn.addEventListener('click', limpiarCampos);
    copiarPortapapelesBtn.addEventListener('click', copiarAlPortapapeles);

    // Initial setup
    actualizarOpcionesPapel();
});