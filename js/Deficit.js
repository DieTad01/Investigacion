// Elementos del DOM
        const demandaInput = document.getElementById('demanda');
        const costoOrdenarInput = document.getElementById('costo-ordenar');
        const costoMantenerInput = document.getElementById('costo-mantener');
        const costoFaltanteInput = document.getElementById('costo-faltante');
        const costoProductoInput = document.getElementById('costo-producto');
        const btnCalcular = document.getElementById('btn-calcular');
        const btnEjemplo = document.getElementById('btn-ejemplo');
        
        // Elementos de resultados
        const resultQ = document.getElementById('result-q');
        const resultS = document.getElementById('result-s');
        const resultInvMax = document.getElementById('result-invmax');
        const resultPedidos = document.getElementById('result-pedidos');
        const resultPorcentaje = document.getElementById('result-porcentaje');
        const costOrdenar = document.getElementById('cost-ordenar');
        const costMantener = document.getElementById('cost-mantener');
        const costFaltante = document.getElementById('cost-faltante');
        const costTotal = document.getElementById('cost-total');
        const labelInvMax = document.getElementById('label-invmax');
        const labelDeficit = document.getElementById('label-deficit');
        const chartContainer = document.getElementById('chart-container');
        
        // Inicializar
        document.addEventListener('DOMContentLoaded', function() {
            btnCalcular.addEventListener('click', calcularEOQ);
            btnEjemplo.addEventListener('click', cargarEjemplo);
            
            // Calcular con valores iniciales
            calcularEOQ();
        });
        
        function cargarEjemplo() {
            demandaInput.value = 10000;
            costoOrdenarInput.value = 50;
            costoMantenerInput.value = 2;
            costoFaltanteInput.value = 5;
            costoProductoInput.value = 10;
            
            calcularEOQ();
        }
        
        function calcularEOQ() {
            // Obtener valores
            const D = parseFloat(demandaInput.value) || 0;
            const S = parseFloat(costoOrdenarInput.value) || 0;
            const H = parseFloat(costoMantenerInput.value) || 0;
            const B = parseFloat(costoFaltanteInput.value) || 0;
            const C = parseFloat(costoProductoInput.value) || 0;
            
            // Validar
            if (D <= 0 || S <= 0 || H <= 0 || B <= 0 || C <= 0) {
                alert('Por favor ingrese todos los valores (mayores a 0)');
                return;
            }
            
            // 1. Calcular Q* (cantidad óptima con déficit)
            // Q* = √[(2DS/H) × ((H+B)/B)]
            const Q = Math.sqrt((2 * S * (D * (B + H))) / (B * H));
            
            // 2. Calcular S* (déficit máximo)
            // S* = Q* × [H/(H+B)]
            const S_deficit = Q * (H / (H + B));
            
            // 3. Calcular inventario máximo
            const invMax = Q - S_deficit;
            
            // 4. Calcular número de pedidos
            const nPedidos = D / Q;
            
            // 5. Calcular costos
            // Costo ordenar = (D/Q) × S
            const costoOrdenarTotal = (D / Q) * S;
            
            // Costo mantener = (Q - S)² × H / (2Q)
            const costoMantenerTotal = Math.pow(Q - S_deficit, 2) * H / (2 * Q);
            
            // Costo faltante = S² × B / (2Q)
            const costoFaltanteTotal = Math.pow(S_deficit, 2) * B / (2 * Q);
            
            // Costo compra = D × C
            const costoCompra = D * C;
            
            // Costo total
            const costoTotal = costoCompra + costoOrdenarTotal + costoMantenerTotal + costoFaltanteTotal;
            
            // Mostrar resultados
            mostrarResultados(Q, S_deficit, invMax, nPedidos, 
                             costoOrdenarTotal, costoMantenerTotal, 
                             costoFaltanteTotal, costoTotal);
            
            // Calcular porcentaje de déficit
            const porcentajeDeficit = (S_deficit / Q) * 100;
            
            // Formatear números
            const formatoNumero = (num) => Math.round(num).toLocaleString();
            const formatoDinero = (num) => `$${num.toFixed(2).toLocaleString()}`;
            const formatoPorcentaje = (num) => `${num.toFixed(1)}%`;
            
            resultQ.textContent = formatoNumero(Q);
            resultS.textContent = formatoNumero(S_deficit);
            resultInvMax.textContent = formatoNumero(invMax);
            resultPedidos.textContent = nPedidos.toFixed(1);
            
            // Mostrar porcentaje de déficit
            if (resultPorcentaje) {
                resultPorcentaje.textContent = formatoPorcentaje(porcentajeDeficit);
            }
            
            costOrdenar.textContent = formatoDinero(costoOrdenarTotal);
            costMantener.textContent = formatoDinero(costoMantenerTotal);
            costFaltante.textContent = formatoDinero(costoFaltanteTotal);
            costTotal.textContent = formatoDinero(costoTotal);
            
            labelInvMax.textContent = formatoNumero(invMax);
            labelDeficit.textContent = formatoNumero(S_deficit);
            }
        
        function mostrarResultados(Q, S_deficit, invMax, nPedidos, 
                                  costoOrdenarTotal, costoMantenerTotal, 
                                  costoFaltanteTotal, costoTotal) {
            
            // Formatear números
            const formatoNumero = (num) => Math.round(num).toLocaleString();
            const formatoDinero = (num) => `$${num.toFixed(2).toLocaleString()}`;
            
            resultQ.textContent = formatoNumero(Q);
            resultS.textContent = formatoNumero(S_deficit);
            resultInvMax.textContent = formatoNumero(invMax);
            resultPedidos.textContent = nPedidos.toFixed(1);
            
            costOrdenar.textContent = formatoDinero(costoOrdenarTotal);
            costMantener.textContent = formatoDinero(costoMantenerTotal);
            costFaltante.textContent = formatoDinero(costoFaltanteTotal);
            costTotal.textContent = formatoDinero(costoTotal);
            
            labelInvMax.textContent = formatoNumero(invMax);
            labelDeficit.textContent = formatoNumero(S_deficit);
        }
        
        function mostrarGrafico(invMax, S_deficit) {
            // Limpiar gráfico
            chartContainer.innerHTML = '';
            
            // Altura máxima del gráfico
            const alturaMax = 180;
            const maxValor = Math.max(invMax, S_deficit) * 1.2; // 20% más alto
            
            // Calcular alturas proporcionales
            const alturaInv = (invMax / maxValor) * alturaMax;
            const alturaDef = (S_deficit / maxValor) * alturaMax;
            
            // Crear barras
            const barraInv = document.createElement('div');
            barraInv.className = 'inventory-bar';
            barraInv.style.height = `${alturaInv}px`;
            barraInv.style.left = '25%';
            barraInv.style.width = '20%';
            
            const barraDef = document.createElement('div');
            barraDef.className = 'deficit-bar';
            barraDef.style.height = `${alturaDef}px`;
            barraDef.style.left = '55%';
            barraDef.style.width = '20%';
            
            // Crear línea de cero
            const lineaCero = document.createElement('div');
            lineaCero.style.position = 'absolute';
            lineaCero.style.bottom = '0';
            lineaCero.style.left = '0';
            lineaCero.style.right = '0';
            lineaCero.style.height = '2px';
            lineaCero.style.backgroundColor = '#333';
            
            // Crear etiquetas en las barras
            const etiquetaInv = document.createElement('div');
            etiquetaInv.textContent = Math.round(invMax);
            etiquetaInv.style.position = 'absolute';
            etiquetaInv.style.bottom = `${alturaInv + 5}px`;
            etiquetaInv.style.left = '25%';
            etiquetaInv.style.width = '20%';
            etiquetaInv.style.textAlign = 'center';
            etiquetaInv.style.fontWeight = 'bold';
            etiquetaInv.style.color = '#2c3e50';
            
            const etiquetaDef = document.createElement('div');
            etiquetaDef.textContent = Math.round(S_deficit);
            etiquetaDef.style.position = 'absolute';
            etiquetaDef.style.bottom = `${alturaDef + 5}px`;
            etiquetaDef.style.left = '55%';
            etiquetaDef.style.width = '20%';
            etiquetaDef.style.textAlign = 'center';
            etiquetaDef.style.fontWeight = 'bold';
            etiquetaDef.style.color = '#e74c3c';
            
            // Agregar elementos al gráfico
            chartContainer.appendChild(barraInv);
            chartContainer.appendChild(barraDef);
            chartContainer.appendChild(lineaCero);
            chartContainer.appendChild(etiquetaInv);
            chartContainer.appendChild(etiquetaDef);
            
            // Agregar línea de referencia (100%)
            const lineaMax = document.createElement('div');
            lineaMax.style.position = 'absolute';
            lineaMax.style.top = `${alturaMax - (maxValor / maxValor) * alturaMax}px`;
            lineaMax.style.left = '10%';
            lineaMax.style.right = '10%';
            lineaMax.style.height = '1px';
            lineaMax.style.backgroundColor = '#ddd';
            lineaMax.style.borderTop = '1px dashed #999';
            
            const etiquetaMax = document.createElement('div');
            etiquetaMax.textContent = Math.round(maxValor);
            etiquetaMax.style.position = 'absolute';
            etiquetaMax.style.top = `${alturaMax - (maxValor / maxValor) * alturaMax - 15}px`;
            etiquetaMax.style.left = '5%';
            etiquetaMax.style.fontSize = '0.8rem';
            etiquetaMax.style.color = '#999';
            
            chartContainer.appendChild(lineaMax);
            chartContainer.appendChild(etiquetaMax);
            
            // Etiqueta de cero
            const etiquetaCero = document.createElement('div');
            etiquetaCero.textContent = '0';
            etiquetaCero.style.position = 'absolute';
            etiquetaCero.style.bottom = '-20px';
            etiquetaCero.style.left = '5%';
            etiquetaCero.style.fontSize = '0.8rem';
            etiquetaCero.style.color = '#999';
            
            chartContainer.appendChild(etiquetaCero);
        }