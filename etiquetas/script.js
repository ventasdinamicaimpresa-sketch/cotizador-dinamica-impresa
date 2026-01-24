document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN CENTRALIZADA DE COSTOS Y MEDIDAS ---
    const CONFIG = {
        costos: {
            papel: {
                carta: { 'brillante_normal': 2.1, 'refrigerante': 2.4 },
                dobleCarta: { 'brillante_normal': 5.25, 'refrigerante': 6 }
            },
            impresion: {
                color: {
                    carta: { 50: 6.04, 100: 6, 150: 5.9, 200: 5.8, Infinity: 5.65 },
                    dobleCarta: { 50: 12.08, 100: 12, 150: 11.8, 200: 11.6, Infinity: 11.3 }
                },
                byn: {
                    carta: { 50: 1.2, 100: 1.1, 150: 1, 200: 0.85, Infinity: 0.8 },
                    dobleCarta: { 50: 2.4, 100: 2.2, 150: 2, 200: 1.7, Infinity: 1.6 }
                }
            },
            corte: {
                rectoPorBloque: 21.55,
                registroPapel: {
                    base: 150,
                    tier1: { limite: 9, precio: 150 }, // Tarifa base hasta 9 pliegos
                    tier2: { limite: 25, precio: 13 },
                    tier3: { limite: Infinity, precio: 10 }
                },
                registroVinilPorMetro: 95
            },
            diseno: {
                envia_papel: 0,
                envia_vinil: 80,
                guardado: 150,
                nuevo: 215.52
            },
            vinilPorMetro: {
                tier1: { limite: 5, precio: 310 },
                tier2: { limite: 10, precio: 280 },
                tier3: { limite: Infinity, precio: 265 }
            }
        },
        medidas: {
            papel: {
                carta: { w: 18.5, h: 25 },
                dobleCarta: { w: 25, h: 40 }
            },
            vinil: {
                conCorte: { w: 130, h: 50 },
                sinCorte: { w: 140, h: 70 }
            }
        },
        factores: {
            utilidadPapel: 2
        },
        limites: {
            pliegosParaUsarDobleCarta: 10,
            pliegosPorBloqueCorteRecto: 100
        },
        opcionesDinamicas: {
            subMaterial: {
                papel: {
                    'brillante_normal': 'Papel Brillante Normal',
                    'refrigerante': 'Papel Refrigerante'
                },
                vinil: {
                    'blanco_brillante': 'Vinil Blanco Brillante',
                    'transparente_brillante': 'Vinil Transparente Brillante',
                    'transparente_mate': 'Vinil Transparente Mate'
                }
            }
        }
    };

    // --- ELEMENTOS DEL DOM ---
    const form = document.getElementById('cotizadorForm');
    const materialSelect = document.getElementById('material');
    const subMaterialContainer = document.getElementById('subMaterialContainer');
    const subMaterialSelect = document.getElementById('subMaterial');
    const impresionContainer = document.getElementById('impresionContainer');
    const corteSelect = document.getElementById('corte');
    const bajadasContainer = document.getElementById('bajadasContainer');
    const resultadoDiv = document.getElementById('resultado');
    const desgloseP = document.getElementById('desglose');
    const subtotalSpan = document.getElementById('subtotal');
    const ivaSpan = document.getElementById('iva');
    const totalSpan = document.getElementById('total');
    const unitarioSpan = document.getElementById('unitario');
    const limpiarBtn = document.getElementById('limpiar');
    const resumenClienteDiv = document.getElementById('resumenCliente');
    const textoResumenTextarea = document.getElementById('textoResumen');
    const copiarResumenBtn = document.getElementById('copiarResumen');
    const errorContainer = document.getElementById('errorContainer');

    // --- EVENT LISTENERS ---
    materialSelect.addEventListener('change', updateUI);
    corteSelect.addEventListener('change', updateUI);
    form.addEventListener('submit', handleCalculate);
    form.addEventListener('input', clearError); // Limpia el error al modificar cualquier campo
    limpiarBtn.addEventListener('click', resetForm);
    copiarResumenBtn.addEventListener('click', copyToClipboard);

    // --- LÓGICA DE UI ---
    function updateUI() {
        const material = materialSelect.value;
        const corte = corteSelect.value;

        if (material) {
            subMaterialContainer.style.display = 'block';
            subMaterialSelect.innerHTML = '';
            const options = CONFIG.opcionesDinamicas.subMaterial[material];
            for (const [value, text] of Object.entries(options)) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                subMaterialSelect.appendChild(option);
            }
        } else {
            subMaterialContainer.style.display = 'none';
        }

        impresionContainer.style.display = material === 'papel' ? 'block' : 'none';
        bajadasContainer.style.display = corte === 'recto' && material === 'papel' ? 'block' : 'none';
    }

    // --- MANEJO DE ERRORES ---
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    function clearError() {
        errorContainer.style.display = 'none';
        errorContainer.textContent = '';
    }

    // --- LÓGICA DE CÁLCULO ---
    function handleCalculate(e) {
        e.preventDefault();
        clearError(); // Limpia errores previos
        
        const inputs = {
            cantidad: parseInt(document.getElementById('cantidad').value),
            ancho: parseFloat(document.getElementById('ancho').value),
            largo: parseFloat(document.getElementById('largo').value),
            material: materialSelect.value,
            subMaterial: subMaterialSelect.value,
            impresion: document.getElementById('impresion').value,
            corte: corteSelect.value,
            bajadas: parseInt(document.getElementById('bajadas').value) || 0,
            diseno: document.getElementById('diseno').value
        };

        if (!inputs.cantidad || !inputs.ancho || !inputs.largo || !inputs.material || !inputs.subMaterial || !inputs.corte || !inputs.diseno) {
            showError('Por favor, complete todos los campos requeridos.');
            return;
        }

        let costos;
        if (inputs.material === 'papel') {
            costos = calcularCostosPapel(inputs);
        } else { // VINIL
            costos = calcularCostosVinil(inputs);
        }
        
        if (!costos) return; // Si hubo un error en los cálculos, ya se mostró el mensaje

        const subtotal = costos.material + costos.impresion + costos.corte + costos.diseno;
        const iva = subtotal * 0.16;
        const total = subtotal + iva;
        const unitario = total / inputs.cantidad;

        mostrarResultados(costos.desglose, subtotal, iva, total, unitario, inputs);
    }

    function calcularCostosPapel(inputs) {
        const { cantidad, ancho, largo, subMaterial, impresion, corte, bajadas, diseno } = inputs;
        let desglose = [];

        const tamanoCarta = CONFIG.medidas.papel.carta;
        const tamanoDobleCarta = CONFIG.medidas.papel.dobleCarta;
        const etiquetasPorCarta = calcularEtiquetasPorArea(ancho, largo, tamanoCarta.w, tamanoCarta.h);
        const etiquetasPorDobleCarta = calcularEtiquetasPorArea(ancho, largo, tamanoDobleCarta.w, tamanoDobleCarta.h);

        let usaDobleCarta = (etiquetasPorCarta === 0 && etiquetasPorDobleCarta > 0) || (etiquetasPorCarta > 0 && Math.ceil(cantidad / etiquetasPorCarta) > CONFIG.limites.pliegosParaUsarDobleCarta && etiquetasPorDobleCarta > 0);
        
        if (etiquetasPorCarta === 0 && etiquetasPorDobleCarta === 0) {
            showError("La etiqueta es demasiado grande para los pliegos de papel disponibles.");
            return null;
        }

        const tamanoPliego = usaDobleCarta ? 'dobleCarta' : 'carta';
        const nombrePliego = usaDobleCarta ? 'Doble Carta' : 'Carta';
        const etiquetasPorPliego = usaDobleCarta ? etiquetasPorDobleCarta : etiquetasPorCarta;
        const pliegosNecesarios = Math.ceil(cantidad / etiquetasPorPliego);

        // 1. Costo Material
        const costoUnitarioPliego = CONFIG.costos.papel[tamanoPliego][subMaterial];
        const costoMaterial = pliegosNecesarios * costoUnitarioPliego * CONFIG.factores.utilidadPapel;
        desglose.push(`Costo Papel: <b>${costoMaterial.toFixed(2)}</b> <small>(${pliegosNecesarios} pliegos ${nombrePliego} ${subMaterialSelect.selectedOptions[0].text} (${etiquetasPorPliego} etiq. c/u) x ${costoUnitarioPliego.toFixed(2)} x ${CONFIG.factores.utilidadPapel} utilidad)</small>`);

        // 2. Costo Impresión
        const tiersImpresion = CONFIG.costos.impresion[impresion][tamanoPliego];
        const tierKeyImpresion = Object.keys(tiersImpresion).find(key => pliegosNecesarios <= key);
        const costoUnitarioImpresion = tiersImpresion[tierKeyImpresion];
        const costoImpresion = pliegosNecesarios * costoUnitarioImpresion;
        desglose.push(`Costo Impresión: <b>${costoImpresion.toFixed(2)}</b> <small>(${pliegosNecesarios} pliegos x ${costoUnitarioImpresion.toFixed(2)})</small>`);

        // 3. Costo Corte
        let costoCorte = 0;
        if (corte === 'recto') {
            const bloquesDe100 = Math.ceil(pliegosNecesarios / CONFIG.limites.pliegosPorBloqueCorteRecto);
            costoCorte = bajadas * bloquesDe100 * CONFIG.costos.corte.rectoPorBloque;
            desglose.push(`Costo Corte Recto: <b>${costoCorte.toFixed(2)}</b> <small>(${bajadas} bajadas x ${bloquesDe100} bloque(s) x $${CONFIG.costos.corte.rectoPorBloque})</small>`);
        } else if (corte === 'registro') {
            const tiersCorte = CONFIG.costos.corte.registroPapel;
            let calcCorteRegistro = "";
            if (pliegosNecesarios <= tiersCorte.tier1.limite) {
                costoCorte = tiersCorte.tier1.precio;
                calcCorteRegistro = `tarifa base de $${costoCorte.toFixed(2)}`;
            } else if (pliegosNecesarios <= tiersCorte.tier2.limite) {
                costoCorte = pliegosNecesarios * tiersCorte.tier2.precio;
                calcCorteRegistro = `${pliegosNecesarios} pliegos x $${tiersCorte.tier2.precio.toFixed(2)}`;
            } else {
                costoCorte = pliegosNecesarios * tiersCorte.tier3.precio;
                calcCorteRegistro = `${pliegosNecesarios} pliegos x $${tiersCorte.tier3.precio.toFixed(2)}`;
            }
            desglose.push(`Costo Corte a Registro: <b>${costoCorte.toFixed(2)}</b> <small>(${calcCorteRegistro})</small>`);
        }

        // 4. Costo Diseño
        const costoDiseno = CONFIG.costos.diseno[diseno === 'envia' ? 'envia_papel' : diseno];
        desglose.push(`Costo Diseño: <b>${costoDiseno.toFixed(2)}</b> <small>(${document.getElementById('diseno').selectedOptions[0].text})</small>`);

        return { material: costoMaterial, impresion: costoImpresion, corte: costoCorte, diseno: costoDiseno, desglose };
    }

    function calcularCostosVinil(inputs) {
        const { cantidad, ancho, largo, corte, diseno } = inputs;
        let desglose = [];

        const medidaAncho = corte === 'registro' ? ancho + 1 : ancho;
        const medidaLargo = corte === 'registro' ? largo + 1 : largo;
        const areaPliego = corte === 'registro' ? CONFIG.medidas.vinil.conCorte : CONFIG.medidas.vinil.sinCorte;
        const etiquetasPorPliego = calcularEtiquetasPorArea(medidaAncho, medidaLargo, areaPliego.w, areaPliego.h);

        if (etiquetasPorPliego === 0) {
            showError("La etiqueta es demasiado grande para el área de vinil disponible.");
            return null;
        }

        const metrosNecesarios = Math.ceil(cantidad / etiquetasPorPliego);
        
        // 1. Costo Material (Vinil con impresión incluida)
        const tiersVinil = CONFIG.costos.vinilPorMetro;
        let costoUnitarioMetro;
        if (metrosNecesarios <= tiersVinil.tier1.limite) costoUnitarioMetro = tiersVinil.tier1.precio;
        else if (metrosNecesarios <= tiersVinil.tier2.limite) costoUnitarioMetro = tiersVinil.tier2.precio;
        else costoUnitarioMetro = tiersVinil.tier3.precio;
        const costoMaterial = metrosNecesarios * costoUnitarioMetro;
        desglose.push(`Costo Vinil (con impresión): <b>${costoMaterial.toFixed(2)}</b> <small>(${metrosNecesarios}m (${etiquetasPorPliego} etiq. c/u) x ${costoUnitarioMetro.toFixed(2)})</small>`);

        // 2. Costo Corte
        let costoCorte = 0;
        if (corte === 'registro') {
            costoCorte = metrosNecesarios * CONFIG.costos.corte.registroVinilPorMetro;
            desglose.push(`Costo Corte a Registro: <b>${costoCorte.toFixed(2)}</b> <small>(${metrosNecesarios}m x $${CONFIG.costos.corte.registroVinilPorMetro.toFixed(2)})</small>`);
        }

        // 3. Costo Diseño
        const costoDiseno = CONFIG.costos.diseno[diseno === 'envia' ? 'envia_vinil' : diseno];
        desglose.push(`Costo Diseño: <b>${costoDiseno.toFixed(2)}</b> <small>(${document.getElementById('diseno').selectedOptions[0].text})</small>`);

        return { material: costoMaterial, impresion: 0, corte: costoCorte, diseno: costoDiseno, desglose };
    }

    function calcularEtiquetasPorArea(anchoEtiqueta, largoEtiqueta, anchoArea, largoArea) {
        const orientacion1 = Math.floor(anchoArea / anchoEtiqueta) * Math.floor(largoArea / largoEtiqueta);
        const orientacion2 = Math.floor(anchoArea / largoEtiqueta) * Math.floor(largoArea / anchoEtiqueta);
        return Math.max(orientacion1, orientacion2);
    }

    function mostrarResultados(desglose, subtotal, iva, total, unitario, inputs) {
        desgloseP.innerHTML = '<b>Desglose de Costos:</b><br>' + desglose.join('<br>');
        subtotalSpan.textContent = `${subtotal.toFixed(2)}`;
        ivaSpan.textContent = `${iva.toFixed(2)}`;
        totalSpan.textContent = `${total.toFixed(2)}`;
        unitarioSpan.textContent = `${unitario.toFixed(2)}`;

        resultadoDiv.style.display = 'block';
        limpiarBtn.style.display = 'block';
        
        const impresionTexto = inputs.material === 'papel' ? inputs.impresion.charAt(0).toUpperCase() + inputs.impresion.slice(1) : 'Incluida';
        const resumen = `${inputs.cantidad} etiquetas de ${inputs.ancho}x${inputs.largo} cm. Material: ${subMaterialSelect.selectedOptions[0].text}. Impresión: ${impresionTexto}. Corte: ${corteSelect.selectedOptions[0].text}. Diseño: ${document.getElementById('diseno').selectedOptions[0].text}. | Costo Unitario: ${unitario.toFixed(2)}. Total: ${total.toFixed(2)} (IVA incl.)`;
        
        textoResumenTextarea.value = resumen;
        resumenClienteDiv.style.display = 'block';

        resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function resetForm() {
        form.reset();
        clearError();
        resultadoDiv.style.display = 'none';
        limpiarBtn.style.display = 'none';
        resumenClienteDiv.style.display = 'none';
        subMaterialContainer.style.display = 'none';
        impresionContainer.style.display = 'none';
        bajadasContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function copyToClipboard() {
        textoResumenTextarea.select();
        navigator.clipboard.writeText(textoResumenTextarea.value).then(() => {
            copiarResumenBtn.textContent = '¡Copiado!';
            setTimeout(() => {
                copiarResumenBtn.textContent = 'Copiar al Portapapeles';
            }, 2000);
        }).catch(err => {
            showError('Error al copiar el texto: ' + err); // Usar showError para consistencia
        });
    }

    updateUI();
});
