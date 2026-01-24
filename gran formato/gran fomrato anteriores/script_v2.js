document.addEventListener('DOMContentLoaded', () => {
    // --- Inyectar estilos para la nueva UI ---
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .cotizacion-item { display: block; padding: 10px; }
        .item-header { display: flex; justify-content: space-between; align-items: center; gap: 15px; }
        .item-descripcion-linea { flex-grow: 1; font-weight: 500; }
        .item-controles { display: flex; align-items: center; gap: 15px; }
        .item-total-preview { font-weight: bold; min-width: 80px; text-align: right; }
        .item-desglose-content { padding: 15px; border-top: 1px solid #eee; margin-top: 10px; background: #fdfdfd; border-radius: 4px; }
        .toggle-desglose-btn { width: auto; padding: 5px 10px; font-size: 0.8em; background-color: var(--secondary-color); color: white; border-radius: 5px; }
        .remover-item-btn { padding: 5px; font-size: 1.2em; }
        .desglose-optimizacion { background-color: #f0f8ff; padding: 15px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #d1e7fd; font-size: 0.9em; }
        .desglose-optimizacion h4 { margin-top: 0; color: var(--primary-color); border-bottom: 1px solid #bde0fe; padding-bottom: 5px; margin-bottom: 10px; }
        .desglose-optimizacion h5 { margin-top: 10px; margin-bottom: 5px; color: #333; }
        .desglose-optimizacion > ul { margin: 0; padding-left: 20px; }
        .desglose-optimizacion .proveniencia { font-size: 0.9em; color: #555; }
        .desglose-optimizacion .proveniencia ul { padding-left: 15px; }
    `;
    document.head.appendChild(styleSheet);

    // --- Elementos del DOM ---
    const form = document.getElementById('cotizador-form');
    const resumenTexto = document.getElementById('resumen-texto');
    const rotuladoSi = document.getElementById('rotulado-si');
    const rotuladoNo = document.getElementById('rotulado-no');
    const noRotuladoContainer = document.getElementById('materiales-no-rotulado-container');
    const rotuladoContainer = document.getElementById('materiales-rotulado-container');
    const categoriaNoRotulado = document.getElementById('categoria-no-rotulado');
    const desgloseContainer = document.getElementById('desglose-container');
    const cotizacionLista = document.getElementById('cotizacion-lista');
    const cotizacionTotalContainer = document.getElementById('cotizacion-total-container');

    // --- Estado Global ---
    let preciosGlobales = {};
    let cotizacionActual = [];

    // --- INICIALIZACIÓN ---
    const init = async () => {
        await cargarPrecios();
        configurarEventListeners();
        toggleMateriales();
        toggleMaterialesNoRotulado();
        popularFormulariosDeCostos();
        renderCotizacion();
        desgloseContainer.style.display = 'none';
    };

    const cargarPrecios = async () => {
        const preciosGuardados = localStorage.getItem('preciosCotizador');
        if (preciosGuardados) {
            preciosGlobales = JSON.parse(preciosGuardados);
        } else {
            try {
                const response = await fetch('precios.json');
                preciosGlobales = await response.json();
            } catch (error) {
                console.error('No se pudo cargar el archivo de precios.', error);
                alert('ERROR: No se pudo cargar la configuración de precios.');
            }
        }
    };

    // --- LÓGICA DE CÁLCULO ---
    const getFormInputs = () => {
        const rotulado = document.getElementById('rotulado-si').checked;
        const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
        let ancho = parseFloat(document.getElementById('ancho').value) || 0;
        let largo = parseFloat(document.getElementById('largo').value) || 0;
        const unidades = document.getElementById('unidades').value;
        const anchoOriginal = ancho, largoOriginal = largo;

        if (unidades === 'cm') { ancho /= 100; largo /= 100; }

        const tipoDiseno = document.getElementById('tipo-diseno').value;
        const categoria = document.getElementById('categoria-no-rotulado').value;
        const materialImpresion = rotulado ? document.getElementById('material-rotulado-vinil').value : (categoria ? document.getElementById(`material-no-rotulado-${categoria}`).value : null);
        const materialBase = rotulado ? document.getElementById('material-rotulado-base').value : null;

        return { rotulado, cantidad, ancho, largo, anchoOriginal, largoOriginal, unidades, tipoDiseno, materialImpresion, materialBase };
    };

    const encontrarPrecio = (precios, area) => precios.find(p => area >= p.min && (p.max === null || area <= p.max));

    const getCostoDiseno = (tipoDiseno) => {
        const costo = preciosGlobales.preciosDiseno?.[tipoDiseno] || 0;
        const optionElement = document.querySelector(`#tipo-diseno option[value="${tipoDiseno}"]`);
        const texto = optionElement ? optionElement.textContent : tipoDiseno;
        return { costo, texto };
    };

    const calcularItem = () => {
        if (Object.keys(preciosGlobales).length === 0) return null;
        const inputs = getFormInputs();
        if (inputs.ancho === 0 || inputs.largo === 0 || !inputs.materialImpresion) {
            alert("Por favor, complete todos los campos: medidas y material.");
            return null;
        }

        const areaPieza = inputs.ancho * inputs.largo;
        const areaTotal = areaPieza * inputs.cantidad;
        
        const areaDeCalculo = (areaTotal > 0 && areaTotal < 1) ? 1 : areaTotal;
        const seAplicaMinimo = areaDeCalculo === 1 && areaTotal < 1;

        const preciosImpresion = preciosGlobales.preciosNoRotulado[inputs.materialImpresion];
        if (!preciosImpresion) {
            alert(`No se encontraron precios para el material: ${inputs.materialImpresion}`);
            return null;
        }
        const precioTierImpresion = encontrarPrecio(preciosImpresion, areaTotal);

        if (!precioTierImpresion) {
            alert(`No se pudo encontrar un rango de precio para el material '${inputs.materialImpresion}' con un área total de ${areaTotal.toFixed(2)} m².`);
            return null;
        }
        
        const costoImpresion = precioTierImpresion.precio * areaDeCalculo;

        let costoBase = 0, costoMontaje = 0;
        if (inputs.rotulado) {
            const anchoCm = inputs.ancho * 100, largoCm = inputs.largo * 100;
            let pliego = '';
            if (anchoCm <= 60 && largoCm <= 120 || anchoCm <= 120 && largoCm <= 60) pliego = '1/4';
            else if (anchoCm <= 120 && largoCm <= 120) pliego = '1/2';
            else if (anchoCm <= 180 && largoCm <= 120 || anchoCm <= 120 && largoCm <= 180) pliego = '3/4';
            else if (anchoCm <= 120 && largoCm <= 240 || anchoCm <= 240 && largoCm <= 120) pliego = '1';

            if (pliego) {
                costoBase = (preciosGlobales.preciosRotulado[inputs.materialBase]?.[pliego] || 0) * inputs.cantidad;
                costoMontaje = (preciosGlobales.preciosMontaje[pliego] || 0) * inputs.cantidad;
            }
        }

        const { costo: costoDiseno, texto: textoDiseno } = getCostoDiseno(inputs.tipoDiseno);
        const subtotal = costoImpresion + costoBase + costoMontaje + costoDiseno;
        const iva = subtotal * 0.16;
        const total = subtotal + iva;
        
        const materialDesc = inputs.rotulado ? `${inputs.materialImpresion} sobre ${inputs.materialBase}` : inputs.materialImpresion;
        const descripcion = `${inputs.cantidad}pz de ${materialDesc} ${inputs.anchoOriginal}x${inputs.largoOriginal}${inputs.unidades}`;

        let desgloseHTML = `<p><strong>Detalles del Artículo:</strong></p><ul>`;
        if (seAplicaMinimo) {
            desgloseHTML += `<li><strong style="color: var(--danger-color);">Nota: Se cobra mínimo 1 m² (Área real: ${areaTotal.toFixed(3)} m²).</strong></li>`;
        }
        desgloseHTML += `<li>Costo Impresión (${areaDeCalculo.toFixed(2)} m² @ $${precioTierImpresion.precio.toFixed(2)}/m²): $${costoImpresion.toFixed(2)}</li>`;
        if(inputs.rotulado) {
            desgloseHTML += `<li>Costo Base (${inputs.materialBase}): $${costoBase.toFixed(2)}</li>`;
            desgloseHTML += `<li>Costo Montaje: $${costoMontaje.toFixed(2)}</li>`;
        }
        if(costoDiseno > 0) {
             desgloseHTML += `<li>Costo Diseño (${textoDiseno}): $${costoDiseno.toFixed(2)}</li>`;
        }
        desgloseHTML += `</ul>
                        <p style="margin-top: 10px;">Subtotal: $${subtotal.toFixed(2)}</p>
                        <p>IVA (16%): $${iva.toFixed(2)}</p>
                        <h4 style="margin-top: 5px;">Total Artículo (sin optimizar): $${total.toFixed(2)}</h4>`;

        return {
            id: Date.now(),
            descripcion,
            total,
            desgloseHTML,
            datos: { ...inputs, areaTotal, costoImpresion, costoBase, costoMontaje, costoDiseno, subtotal }
        };
    };

    // --- LÓGICA DE OPTIMIZACIÓN ---
    const calcularTotalOptimizado = () => {
        let costoImpresionOptimizado = 0;
        let costoBasesOptimizado = 0;
        let costoMontajeOptimizado = 0;
        let desgloseImpresionHTML = '';
        let desgloseBasesHTML = '';

        const gruposImpresion = cotizacionActual.reduce((acc, item) => {
            const mat = item.datos.materialImpresion;
            if (!acc[mat]) acc[mat] = { areaTotal: 0, descripciones: [] };
            acc[mat].areaTotal += item.datos.areaTotal;
            acc[mat].descripciones.push(item.descripcion);
            return acc;
        }, {});

        for (const material in gruposImpresion) {
            const areaTotalGrupo = gruposImpresion[material].areaTotal;
            const areaDeCalculo = areaTotalGrupo > 0 && areaTotalGrupo < 1 ? 1 : areaTotalGrupo;
            const precios = preciosGlobales.preciosNoRotulado[material];
            const tier = encontrarPrecio(precios, areaTotalGrupo);
            if (tier) {
                const costoMaterialOptimizado = tier.precio * areaDeCalculo;
                costoImpresionOptimizado += costoMaterialOptimizado;
                if (gruposImpresion[material].descripciones.length > 1 || (areaTotalGrupo > 0 && areaTotalGrupo < 1)) {
                    let descripcionesHTML = '<div class="proveniencia"><ul>' + gruposImpresion[material].descripciones.map(d => `<li>${d}</li>`).join('') + '</ul></div>';
                    desgloseImpresionHTML += `<li><strong>${material}:</strong> Área combinada: ${areaTotalGrupo.toFixed(3)} m² (cobrando ${areaDeCalculo.toFixed(2)} m²). Tarifa: $${tier.precio.toFixed(2)}/m². Subtotal: $${costoMaterialOptimizado.toFixed(2)}. ${descripcionesHTML}</li>`;
                }
            }
        }

        const itemsRotulados = cotizacionActual.filter(item => item.datos.rotulado);
        const gruposBases = itemsRotulados.reduce((acc, item) => {
            const mat = item.datos.materialBase;
            if (!acc[mat]) acc[mat] = { areaTotal: 0, descripciones: [] };
            acc[mat].areaTotal += item.datos.areaTotal;
            acc[mat].descripciones.push(item.descripcion);
            return acc;
        }, {});

        for (const materialBase in gruposBases) {
            const areaTotalRequerida = gruposBases[materialBase].areaTotal;
            const preciosPliegos = preciosGlobales.preciosRotulado[materialBase];
            const infoPliegos = [
                { size: '1', area: 2.88, price: preciosPliegos['1'] },
                { size: '3/4', area: 2.16, price: preciosPliegos['3/4'] },
                { size: '1/2', area: 1.44, price: preciosPliegos['1/2'] },
                { size: '1/4', area: 0.72, price: preciosPliegos['1/4'] }
            ].filter(p => p.price).sort((a, b) => b.area - a.area);

            if (infoPliegos.length > 0) {
                let areaRestante = areaTotalRequerida;
                let costoBaseMaterial = 0;
                let costoMontajeMaterial = 0;
                let desglosePliegos = [];

                for (const pliego of infoPliegos) {
                    const cantidadNecesaria = Math.floor(areaRestante / pliego.area);
                    if (cantidadNecesaria > 0) {
                        costoBaseMaterial += cantidadNecesaria * pliego.price;
                        costoMontajeMaterial += cantidadNecesaria * (preciosGlobales.preciosMontaje[pliego.size] || 0);
                        areaRestante -= cantidadNecesaria * pliego.area;
                        desglosePliegos.push(`${cantidadNecesaria} x Pliego(${pliego.size})`);
                    }
                }
                if (areaRestante > 0) {
                    const pliegoIdeal = infoPliegos.slice().reverse().find(p => p.area >= areaRestante) || infoPliegos[0];
                    costoBaseMaterial += pliegoIdeal.price;
                    costoMontajeMaterial += preciosGlobales.preciosMontaje[pliegoIdeal.size] || 0;
                    desglosePliegos.push(`1 x Pliego(${pliegoIdeal.size}) para el resto`);
                }
                costoBasesOptimizado += costoBaseMaterial;
                costoMontajeOptimizado += costoMontajeMaterial;
                if (gruposBases[materialBase].descripciones.length > 1 || areaTotalRequerida > infoPliegos[infoPliegos.length-1].area) {
                    let descripcionesHTML = '<div class="proveniencia"><ul>' + gruposBases[materialBase].descripciones.map(d => `<li>${d}</li>`).join('') + '</ul></div>';
                    desgloseBasesHTML += `<li><strong>${materialBase}:</strong> Área requerida: ${areaTotalRequerida.toFixed(3)} m². Pliegos usados: ${desglosePliegos.join(', ')}. Costo: $${costoBaseMaterial.toFixed(2)}. ${descripcionesHTML}</li>`;
                }
            }
        }

        const costoTotalDiseno = cotizacionActual.reduce((sum, item) => sum + item.datos.costoDiseno, 0);
        const subtotalOptimizado = costoImpresionOptimizado + costoBasesOptimizado + costoMontajeOptimizado + costoTotalDiseno;
        const totalOptimizado = subtotalOptimizado * 1.16;
        const totalIngenuo = cotizacionActual.reduce((sum, item) => sum + item.total, 0);
        const ahorro = totalIngenuo > totalOptimizado ? totalIngenuo - totalOptimizado : 0;

        let desgloseOptimizacionHTML = '';
        if (ahorro > 0.01) {
            desgloseOptimizacionHTML = '<h4>Desglose de la Optimización</h4>';
            if (desgloseImpresionHTML) {
                desgloseOptimizacionHTML += '<h5>Materiales de Impresión:</h5><ul>' + desgloseImpresionHTML + '</ul>';
            }
            if (desgloseBasesHTML) {
                desgloseOptimizacionHTML += '<h5>Placas Rígidas (Sustratos):</h5><ul>' + desgloseBasesHTML + '</ul>';
            }
        }

        return { totalOptimizado, ahorro, subtotalOptimizado, desgloseOptimizacionHTML };
    };

    // --- MANEJO DE LA COTIZACIÓN Y RENDERIZADO ---
    const agregarArticulo = () => {
        const nuevoItem = calcularItem();
        if (nuevoItem) {
            cotizacionActual.push(nuevoItem);
            renderCotizacion();
        }
    };

    const removerArticulo = (id) => {
        cotizacionActual = cotizacionActual.filter(item => item.id !== id);
        renderCotizacion();
    };

    const renderCotizacion = () => {
        cotizacionLista.innerHTML = cotizacionActual.length === 0 ? '<p>No hay artículos en la cotización.</p>' : '';
        cotizacionActual.forEach(item => {
            cotizacionLista.innerHTML += `
                <div class="cotizacion-item">
                    <div class="item-header">
                        <span class="item-descripcion-linea">${item.descripcion}</span>
                        <div class="item-controles">
                            <strong class="item-total-preview">$${item.total.toFixed(2)}</strong>
                            <button class="toggle-desglose-btn" data-id="${item.id}">Ver Desglose</button>
                            <button class="remover-item-btn" data-id="${item.id}"><i class="fas fa-times-circle"></i></button>
                        </div>
                    </div>
                    <div class="item-desglose-content" id="desglose-${item.id}" style="display: none;">
                        ${item.desgloseHTML}
                    </div>
                </div>
            `;
        });
        renderTotal();
    };

    const renderTotal = () => {
        if (cotizacionActual.length === 0) {
            cotizacionTotalContainer.innerHTML = '';
            resumenTexto.value = '';
            return;
        }

        const { totalOptimizado, ahorro, subtotalOptimizado, desgloseOptimizacionHTML } = calcularTotalOptimizado();
        const ivaFinal = totalOptimizado - subtotalOptimizado;

        let html = '';
        if (ahorro > 0.01) {
            html += `<div class="desglose-optimizacion">${desgloseOptimizacionHTML}</div>`;
        }
        html += `<h3>Subtotal: $${subtotalOptimizado.toFixed(2)}</h3>`;
        if (ahorro > 0.01) {
            html += `<h3 style="color: var(--success-color);">Ahorro por optimización: -$${ahorro.toFixed(2)}</h3>`;
        }
        html += `<h3>IVA (16%): $${ivaFinal.toFixed(2)}</h3>`;
        html += `<h2>Total General: $${totalOptimizado.toFixed(2)}</h2>`;
        cotizacionTotalContainer.innerHTML = html;

        let resumenGeneralTexto = "Resumen de Cotización:\n";
        resumenGeneralTexto += cotizacionActual.map(item => `- ${item.descripcion} -> $${item.total.toFixed(2)} (precio individual)`).join('\n');
        resumenGeneralTexto += `\n--------------------`;
        if (ahorro > 0.01) {
            resumenGeneralTexto += `\nAhorro por Optimización: -$${ahorro.toFixed(2)}`;
        }
        resumenGeneralTexto += `\nTotal General (Optimizado): $${totalOptimizado.toFixed(2)} (IVA incluido)`;
        resumenTexto.value = resumenGeneralTexto;
    };

    // --- EVENT LISTENERS Y UI ---
    const configurarEventListeners = () => {
        document.getElementById('agregar-btn').addEventListener('click', agregarArticulo);
        
        document.getElementById('limpiar-todo-btn').addEventListener('click', () => {
            if (cotizacionActual.length > 0 && confirm('¿Estás seguro de que quieres borrar todos los artículos de la cotización?')) {
                cotizacionActual = [];
                renderCotizacion();
            }
        });

        cotizacionLista.addEventListener('click', (e) => {
            const removerBtn = e.target.closest('.remover-item-btn');
            const desgloseBtn = e.target.closest('.toggle-desglose-btn');

            if (removerBtn) {
                removerArticulo(parseInt(removerBtn.dataset.id));
            }
            if (desgloseBtn) {
                const id = desgloseBtn.dataset.id;
                const content = document.getElementById(`desglose-${id}`);
                if (content) {
                    const isVisible = content.style.display === 'block';
                    content.style.display = isVisible ? 'none' : 'block';
                    desgloseBtn.textContent = isVisible ? 'Ocultar Desglose' : 'Ver Desglose';
                }
            }
        });

        rotuladoSi.addEventListener('change', toggleMateriales);
        rotuladoNo.addEventListener('change', toggleMateriales);
        categoriaNoRotulado.addEventListener('change', toggleMaterialesNoRotulado);
        document.getElementById('limpiar-btn').addEventListener('click', () => form.reset());
        document.getElementById('copiar-btn').addEventListener('click', () => {
            if(resumenTexto.value) navigator.clipboard.writeText(resumenTexto.value.replace(/\n/g, '\r\n')).then(() => alert('Resumen copiado'), () => alert('Error al copiar'));
        });
        
        const mainCollapsible = document.querySelector('.collapsible');
        mainCollapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
            this.querySelector('.fa-chevron-down')?.classList.toggle('rotated');
        });

        const innerCollapsibles = document.querySelectorAll('.collapsible-inner');
        const mainContent = document.querySelector('.content-collapsible');

        innerCollapsibles.forEach(clickedColl => {
            clickedColl.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const wasActive = this.classList.contains('active');

                innerCollapsibles.forEach(coll => {
                    if (coll !== this) {
                        coll.classList.remove('active');
                        coll.nextElementSibling.style.maxHeight = null;
                    }
                });

                if (wasActive) {
                    this.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    this.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
                
                if (mainContent.style.maxHeight) {
                    setTimeout(() => {
                        mainContent.style.maxHeight = mainContent.scrollHeight + "px";
                    }, 210);
                }
            });
        });

        document.getElementById('guardar-precios-btn').addEventListener('click', guardarNuevosPrecios);
    };

    const toggleMateriales = () => {
        rotuladoContainer.style.display = rotuladoSi.checked ? 'block' : 'none';
        noRotuladoContainer.style.display = rotuladoNo.checked ? 'block' : 'none';
    };

    const toggleMaterialesNoRotulado = () => {
        const categoria = categoriaNoRotulado.value;
        ['lonas', 'viniles', 'telas', 'papeles'].forEach(c => {
            const container = document.getElementById(`material-no-rotulado-${c}-container`);
            if(container) container.style.display = categoria === c ? 'block' : 'none';
        });
    };

    const popularFormulariosDeCostos = () => {
        if (!preciosGlobales.preciosNoRotulado) return;
        const { preciosNoRotulado, preciosRotulado, preciosMontaje, preciosDiseno } = preciosGlobales;
        const listas = {
            lonas: document.getElementById('costos-lonas-list'),
            viniles: document.getElementById('costos-viniles-list'),
            telas: document.getElementById('costos-telas-list'),
            papeles: document.getElementById('costos-papeles-list'),
            rotulacion: document.getElementById('costos-rotulacion-list'),
            montaje: document.getElementById('costos-montaje-list'),
            diseno: document.getElementById('costos-diseno-list')
        };
        for (const key in listas) { if (listas[key]) listas[key].innerHTML = ''; }

        const materialCategorias = {
            lonas: Array.from(document.querySelectorAll('#material-no-rotulado-lonas option')).map(opt => opt.value),
            viniles: Array.from(document.querySelectorAll('#material-no-rotulado-viniles option')).map(opt => opt.value),
            telas: Array.from(document.querySelectorAll('#material-no-rotulado-telas option')).map(opt => opt.value),
            papeles: Array.from(document.querySelectorAll('#material-no-rotulado-papeles option')).map(opt => opt.value)
        };

        const crearCamposPrecio = (material, rangos) => {
            const el = document.createElement('div');
            el.className = 'item-costo';
            el.innerHTML = `<strong>${material}</strong>`;
            rangos.forEach((r, i) => {
                el.innerHTML += `
                    <div class="rango-precio">
                        <span>Rango (${r.min} - ${r.max || 'adelante'} m²):</span>
                        <input type="number" value="${r.precio}" data-tipo="preciosNoRotulado" data-material="${material}" data-index="${i}">
                    </div>`;
            });
            return el;
        };

        for (const categoria in materialCategorias) {
            const listaContenedor = listas[categoria];
            if (listaContenedor) {
                materialCategorias[categoria].forEach(material => {
                    if (preciosNoRotulado[material]) {
                        listaContenedor.appendChild(crearCamposPrecio(material, preciosNoRotulado[material]));
                    }
                });
            }
        }

        if (listas.rotulacion && preciosRotulado) {
            for (const material in preciosRotulado) {
                const el = document.createElement('div');
                el.className = 'item-costo';
                el.innerHTML = `<strong>${material}</strong>`;
                for (const pliego in preciosRotulado[material]) {
                    el.innerHTML += `
                        <div class="rango-precio">
                            <span>Pliego ${pliego}:</span>
                            <input type="number" value="${preciosRotulado[material][pliego]}" data-tipo="preciosRotulado" data-material="${material}" data-pliego="${pliego}">
                        </div>`;
                }
                listas.rotulacion.appendChild(el);
            }
        }
        
        if (listas.montaje && preciosMontaje) {
            for (const pliego in preciosMontaje) {
                const el = document.createElement('div');
                el.className = 'item-costo';
                el.innerHTML = `<strong>Montaje Pliego ${pliego}</strong>`;
                el.innerHTML += `
                    <div class="rango-precio">
                        <span>Costo:</span>
                        <input type="number" value="${preciosMontaje[pliego]}" data-tipo="preciosMontaje" data-pliego="${pliego}">
                    </div>`;
                listas.montaje.appendChild(el);
            }
        }

        if (listas.diseno && preciosDiseno) {
            for (const tipo in preciosDiseno) {
                const optionElement = document.querySelector(`#tipo-diseno option[value="${tipo}"]`);
                const texto = optionElement ? optionElement.textContent : tipo;
                const el = document.createElement('div');
                el.className = 'item-costo';
                el.innerHTML = `<strong>${texto}</strong>
                                <div class="rango-precio">
                                    <span>Costo:</span>
                                    <input type="number" value="${preciosDiseno[tipo]}" data-tipo="preciosDiseno" data-diseno-tipo="${tipo}">
                                </div>`;
                listas.diseno.appendChild(el);
            }
        }
    };

    const guardarNuevosPrecios = () => {
        const inputs = document.querySelectorAll('.content-collapsible input[type="number"]');
        inputs.forEach(input => {
            const tipo = input.dataset.tipo;
            const material = input.dataset.material;
            const index = input.dataset.index;
            const pliego = input.dataset.pliego;
            const disenoTipo = input.dataset.disenoTipo;
            const nuevoPrecio = parseFloat(input.value);

            if (isNaN(nuevoPrecio)) return;

            if (tipo === 'preciosNoRotulado') {
                preciosGlobales[tipo][material][index].precio = nuevoPrecio;
            } else if (tipo === 'preciosRotulado') {
                preciosGlobales[tipo][material][pliego] = nuevoPrecio;
            } else if (tipo === 'preciosMontaje') {
                preciosGlobales[tipo][pliego] = nuevoPrecio;
            } else if (tipo === 'preciosDiseno') {
                preciosGlobales[tipo][disenoTipo] = nuevoPrecio;
            }
        });

        try {
            localStorage.setItem('preciosCotizador', JSON.stringify(preciosGlobales));
            alert('¡Precios actualizados y guardados en este navegador!');
            renderCotizacion();
            popularFormulariosDeCostos();
        } catch (e) {
            console.error("Error al guardar en localStorage:", e);
            alert("Hubo un error al intentar guardar los precios.");
        }
    };

    // --- Iniciar la aplicación ---
    init();
});