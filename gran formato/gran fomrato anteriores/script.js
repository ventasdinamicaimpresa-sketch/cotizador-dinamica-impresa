document.addEventListener('DOMContentLoaded', () => {
    // Contenedores y elementos del DOM
    const form = document.getElementById('cotizador-form');
    const resultadosContainer = document.getElementById('resultados-container');
    const resumenTexto = document.getElementById('resumen-texto');
    const rotuladoSi = document.getElementById('rotulado-si');
    const rotuladoNo = document.getElementById('rotulado-no');
    const noRotuladoContainer = document.getElementById('materiales-no-rotulado-container');
    const rotuladoContainer = document.getElementById('materiales-rotulado-container');
    const categoriaNoRotulado = document.getElementById('categoria-no-rotulado');
    const materialNoRotuladoLonasContainer = document.getElementById('material-no-rotulado-lonas-container');
    const materialNoRotuladoVinilesContainer = document.getElementById('material-no-rotulado-viniles-container');
    const materialNoRotuladoTelasContainer = document.getElementById('material-no-rotulado-telas-container');
    const materialNoRotuladoPapelesContainer = document.getElementById('material-no-rotulado-papeles-container');

    // Precios globales que se cargarán al inicio
    let preciosGlobales = {};

    // --- INICIALIZACIÓN ---
    const init = async () => {
        await cargarPrecios();
        configurarEventListeners();
        toggleMateriales();
        toggleMaterialesNoRotulado();
        popularFormulariosDeCostos();
        calcular();
    };

    const cargarPrecios = async () => {
        const preciosGuardados = localStorage.getItem('preciosCotizador');
        if (preciosGuardados) {
            preciosGlobales = JSON.parse(preciosGuardados);
            console.log('Precios cargados desde localStorage.');
        } else {
            try {
                const response = await fetch('precios.json');
                preciosGlobales = await response.json();
                console.log('Precios cargados desde precios.json por defecto.');
            } catch (error) {
                console.error('No se pudo cargar el archivo de precios.', error);
                alert('ERROR: No se pudo cargar la configuración de precios. La aplicación no puede continuar.');
            }
        }
    };

    // --- LÓGICA DE LA CALCULADORA ---

    const getFormInputs = () => {
        const rotulado = document.getElementById('rotulado-si').checked;
        const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
        let ancho = parseFloat(document.getElementById('ancho').value) || 0;
        let largo = parseFloat(document.getElementById('largo').value) || 0;
        const unidades = document.getElementById('unidades').value;

        if (unidades === 'cm') {
            ancho /= 100;
            largo /= 100;
        }

        const tipoDiseno = document.getElementById('tipo-diseno').value;
        const categoria = document.getElementById('categoria-no-rotulado').value;
        const materialSelect = categoria ? document.getElementById(`material-no-rotulado-${categoria}`).value : null;
        const vinil = document.getElementById('material-rotulado-vinil').value;
        const base = document.getElementById('material-rotulado-base').value;

        return { rotulado, cantidad, ancho, largo, tipoDiseno, categoria, materialSelect, vinil, base };
    };

    const getCostoDiseno = (tipoDiseno) => {
        if (tipoDiseno === 'guardado') return { costo: 150, texto: 'Diseño guardado' };
        if (tipoDiseno === 'nuevo') return { costo: 250, texto: 'Diseño nuevo' };
        return { costo: 0, texto: '' };
    };

    const encontrarPrecio = (precios, area) => {
        return precios.find(p => area >= p.min && (p.max === null || area <= p.max));
    };

    const calcularCostoNoRotulado = (inputs, areaDeCalculo) => {
        let subtotal = 0, material = '', resumenHTML = '';
        if (inputs.categoria && inputs.materialSelect) {
            material = inputs.materialSelect;
            const precios = preciosGlobales.preciosNoRotulado[material];
            if (precios) {
                const precioEncontrado = encontrarPrecio(precios, areaDeCalculo);
                if (precioEncontrado) {
                    const costoUnitario = precioEncontrado.precio;
                    subtotal = costoUnitario * areaDeCalculo;
                    resumenHTML += `<p>Costo de ${material}: ${costoUnitario.toFixed(2)} por m²</p>`;
                    resumenHTML += `<p>Formula: Costo Material * Area Cálculo = ${costoUnitario.toFixed(2)} * ${areaDeCalculo.toFixed(2)}m² = ${subtotal.toFixed(2)}</p>`;
                }
            }
        }
        return { subtotal, material, resumenHTML };
    };

    const calcularCostoRotulado = (inputs, areaPieza, areaDeCalculo) => {
        const { cantidad, vinil, base, ancho, largo } = inputs;
        let subtotal = 0, resumenHTML = '';
        const material = `${vinil} sobre ${base}`;

        let costoVinil = 0;
        const preciosVinil = preciosGlobales.preciosNoRotulado[vinil];
        if (preciosVinil) {
            const precioEncontrado = encontrarPrecio(preciosVinil, areaDeCalculo);
            if (precioEncontrado) {
                costoVinil = precioEncontrado.precio;
                resumenHTML += `<p>Costo del ${vinil}: ${costoVinil.toFixed(2)} por m²</p>`;
            }
        }

        let costoBase = 0;
        const anchoCm = ancho * 100, largoCm = largo * 100;
        let pliego = '';
        if (anchoCm <= 60 && largoCm <= 120 || anchoCm <= 120 && largoCm <= 60) pliego = '1/4';
        else if (anchoCm <= 120 && largoCm <= 120) pliego = '1/2';
        else if (anchoCm <= 180 && largoCm <= 120 || anchoCm <= 120 && largoCm <= 180) pliego = '3/4';
        else if (anchoCm <= 120 && largoCm <= 240 || anchoCm <= 240 && largoCm <= 120) pliego = '1';
        else resumenHTML += '<p>Medida no soportada para rotulación.</p>';

        const preciosBase = preciosGlobales.preciosRotulado[base];
        if (preciosBase && pliego) {
            costoBase = preciosBase[pliego];
            resumenHTML += `<p>Costo de ${base} (${pliego} de pliego): ${costoBase.toFixed(2)}</p>`;
        }

        let costoMontaje = 0;
        if (pliego && preciosGlobales.preciosMontaje[pliego]) {
            costoMontaje = preciosGlobales.preciosMontaje[pliego];
            resumenHTML += `<p>Costo de montaje: ${costoMontaje.toFixed(2)}</p>`;
        }

        const costoUnitario = (costoVinil * areaPieza) + costoBase + costoMontaje;
        subtotal = costoUnitario * cantidad;
        resumenHTML += `<p>Formula: (((Costo Vinil * Area) + Costo Base + Costo Montaje) * Cantidad) = (((${costoVinil.toFixed(2)} * ${areaPieza.toFixed(2)}m²) + ${costoBase.toFixed(2)} + ${costoMontaje.toFixed(2)}) * ${cantidad}) = ${subtotal.toFixed(2)}</p>`;

        return { subtotal, material, resumenHTML };
    };

    const calcular = () => {
        if (Object.keys(preciosGlobales).length === 0) return; // No calcular si no hay precios
        const inputs = getFormInputs();
        const { costo: costoDiseno, texto: textoDiseno } = getCostoDiseno(inputs.tipoDiseno);
        const areaPieza = inputs.ancho * inputs.largo;
        const areaTotal = areaPieza * inputs.cantidad;
        const areaDeCalculo = areaTotal < 1 && areaTotal > 0 ? 1 : areaTotal;

        const calculo = inputs.rotulado ? calcularCostoRotulado(inputs, areaPieza, areaDeCalculo) : calcularCostoNoRotulado(inputs, areaDeCalculo);

        let subtotal = calculo.subtotal + costoDiseno;
        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        let resumenDeCostosHTML = '<h3>Resumen de Costos</h3>' + calculo.resumenHTML;
        if (costoDiseno > 0) resumenDeCostosHTML += `<p>Costo de diseño (${textoDiseno}): ${costoDiseno.toFixed(2)}</p>`;
        resumenDeCostosHTML += `<p>Subtotal: ${subtotal.toFixed(2)}</p>`;
        resumenDeCostosHTML += `<p>IVA (16%): ${iva.toFixed(2)}</p>`;
        resumenDeCostosHTML += `<h4>Total: ${total.toFixed(2)}</h4>`;
        resultadosContainer.innerHTML = resumenDeCostosHTML;

        let resumenSimplificado = `${inputs.cantidad}pz ${calculo.material} ${inputs.ancho * 100}x${inputs.largo * 100}cm Impresos en Alta Resolución, `;
        if (inputs.cantidad > 1) resumenSimplificado += `Costo Unitario: ${(total / inputs.cantidad).toFixed(2)}, `;
        resumenSimplificado += `Costo Neto: ${total.toFixed(2)}`;
        resumenTexto.value = resumenSimplificado;
    };

    // --- LÓGICA DE LA INTERFAZ (UI) ---

    const toggleMateriales = () => {
        rotuladoContainer.style.display = rotuladoSi.checked ? 'block' : 'none';
        noRotuladoContainer.style.display = rotuladoNo.checked ? 'block' : 'none';
    };

    const toggleMaterialesNoRotulado = () => {
        materialNoRotuladoLonasContainer.style.display = categoriaNoRotulado.value === 'lonas' ? 'block' : 'none';
        materialNoRotuladoVinilesContainer.style.display = categoriaNoRotulado.value === 'viniles' ? 'block' : 'none';
        materialNoRotuladoTelasContainer.style.display = categoriaNoRotulado.value === 'telas' ? 'block' : 'none';
        materialNoRotuladoPapelesContainer.style.display = categoriaNoRotulado.value === 'papeles' ? 'block' : 'none';
    };

    const configurarEventListeners = () => {
        form.addEventListener('input', calcular);
        rotuladoSi.addEventListener('change', toggleMateriales);
        rotuladoNo.addEventListener('change', toggleMateriales);
        categoriaNoRotulado.addEventListener('change', toggleMaterialesNoRotulado);

        document.getElementById('limpiar-btn').addEventListener('click', () => {
            form.reset();
            toggleMateriales();
            toggleMaterialesNoRotulado();
            calcular();
        });

        document.getElementById('copiar-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(resumenTexto.value).then(() => alert('Resumen copiado'), () => alert('Error al copiar'));
        });

        // Collapsibles
        const mainCollapsible = document.querySelector('.collapsible');
        const innerCollapsibles = document.querySelectorAll('.collapsible-inner');

        mainCollapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
            const icon = this.querySelector('.fa-chevron-down');
            if (icon) {
                icon.classList.toggle('rotated');
            }
        });

        const mainContent = document.querySelector('.content-collapsible');

        innerCollapsibles.forEach(clickedColl => {
            clickedColl.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const wasActive = this.classList.contains('active');

                // Close all other inner panels
                innerCollapsibles.forEach(coll => {
                    if (coll !== this) {
                        coll.classList.remove('active');
                        coll.nextElementSibling.style.maxHeight = null;
                    }
                });

                // Toggle the clicked panel
                if (wasActive) {
                    this.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    this.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
                
                // Update the parent's height after a delay to account for animations
                if (mainContent.style.maxHeight) {
                    setTimeout(() => {
                        mainContent.style.maxHeight = mainContent.scrollHeight + "px";
                    }, 210); // A little more than the inner transition time (0.2s)
                }
            });
        });

        document.getElementById('guardar-precios-btn').addEventListener('click', guardarNuevosPrecios);
    };

    // --- LÓGICA DE EDICIÓN DE PRECIOS ---

    const popularFormulariosDeCostos = () => {
        const { preciosNoRotulado, preciosRotulado, preciosMontaje } = preciosGlobales;

        // Definir contenedores para cada categoría
        const listas = {
            lonas: document.getElementById('costos-lonas-list'),
            viniles: document.getElementById('costos-viniles-list'),
            telas: document.getElementById('costos-telas-list'),
            papeles: document.getElementById('costos-papeles-list'),
            rotulacion: document.getElementById('costos-rotulacion-list'),
            montaje: document.getElementById('costos-montaje-list')
        };

        // Limpiar todas las listas
        for (const key in listas) {
            if (listas[key]) {
                listas[key].innerHTML = '';
            }
        }

        // Mapeo de materiales a categorías (basado en los selects del formulario)
        const materialCategorias = {
            lonas: Array.from(document.querySelectorAll('#material-no-rotulado-lonas option')).map(opt => opt.value),
            viniles: Array.from(document.querySelectorAll('#material-no-rotulado-viniles option')).map(opt => opt.value),
            telas: Array.from(document.querySelectorAll('#material-no-rotulado-telas option')).map(opt => opt.value),
            papeles: Array.from(document.querySelectorAll('#material-no-rotulado-papeles option')).map(opt => opt.value)
        };

        // Función auxiliar para crear campos de precio
        const crearCamposPrecio = (material, rangos) => {
            const el = document.createElement('div');
            el.className = 'item-costo';
            el.innerHTML = `<strong>${material}</strong>`;
            rangos.forEach((r, i) => {
                el.innerHTML += `
                    <div class="rango-precio">
                        <span>Rango (${r.min} - ${r.max || 'en adelante'} m²):</span>
                        <input type="number" value="${r.precio}" data-tipo="preciosNoRotulado" data-material="${material}" data-index="${i}">
                    </div>`;
            });
            return el;
        };

        // Llenar materiales de impresión por categoría
        for (const categoria in materialCategorias) {
            const listaMateriales = materialCategorias[categoria];
            const listaContenedor = listas[categoria];
            if (listaContenedor) {
                listaMateriales.forEach(material => {
                    if (preciosNoRotulado[material]) {
                        const rangos = preciosNoRotulado[material];
                        listaContenedor.appendChild(crearCamposPrecio(material, rangos));
                    }
                });
            }
        }

        // Llenar materiales de rotulación
        if (listas.rotulacion) {
            for (const material in preciosRotulado) {
                const pliegos = preciosRotulado[material];
                const el = document.createElement('div');
                el.className = 'item-costo';
                el.innerHTML = `<strong>${material}</strong>`;
                for (const pliego in pliegos) {
                    el.innerHTML += `
                        <div class="rango-precio">
                            <span>Pliego ${pliego}:</span>
                            <input type="number" value="${pliegos[pliego]}" data-tipo="preciosRotulado" data-material="${material}" data-pliego="${pliego}">
                        </div>`;
                }
                listas.rotulacion.appendChild(el);
            }
        }
        
        // Llenar costos de montaje
        if (listas.montaje) {
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
    };

    const guardarNuevosPrecios = () => {
        const inputs = document.querySelectorAll('.content-collapsible input[type="number"]');
        inputs.forEach(input => {
            const tipo = input.dataset.tipo;
            const material = input.dataset.material;
            const index = input.dataset.index;
            const pliego = input.dataset.pliego;
            const nuevoPrecio = parseFloat(input.value);

            if (isNaN(nuevoPrecio)) return;

            if (tipo === 'preciosNoRotulado') {
                preciosGlobales[tipo][material][index].precio = nuevoPrecio;
            } else if (tipo === 'preciosRotulado') {
                preciosGlobales[tipo][material][pliego] = nuevoPrecio;
            } else if (tipo === 'preciosMontaje') {
                preciosGlobales[tipo][pliego] = nuevoPrecio;
            }
        });

        localStorage.setItem('preciosCotizador', JSON.stringify(preciosGlobales));
        alert('¡Precios actualizados y guardados en este navegador!');
        calcular(); // Recalcular con los nuevos precios
    };

    // Iniciar la aplicación
    init();
});