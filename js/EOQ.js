// Elementos del DOM
        const demandaInput = document.getElementById('demanda');
        const costoOrdenarInput = document.getElementById('costo-ordenar');
        const costoMantenerInput = document.getElementById('costo-mantener');
        const costoProductoInput = document.getElementById('costo-producto');
        const tiempoEntregaInput = document.getElementById('tiempo-entrega');
        const diasTrabajoInput = document.getElementById('dias-trabajo');
        const calculateBtn = document.getElementById('calculateBtn');
        const exampleBtn = document.getElementById('exampleBtn');
        
        // Elementos de resultados
        const eoqResult = document.getElementById('eoq-result');
        const reorderResult = document.getElementById('reorder-result');
        const holdingCostResult = document.getElementById('holding-cost-result');
        const orderingCostResult = document.getElementById('ordering-cost-result');
        const purchaseCostElement = document.getElementById('purchase-cost');
        const orderingCostBreakdown = document.getElementById('ordering-cost-breakdown');
        const holdingCostBreakdown = document.getElementById('holding-cost-breakdown');
        const totalCostElement = document.getElementById('total-cost');
        const chartEoqElement = document.getElementById('chart-eoq');
        const chartReorderElement = document.getElementById('chart-reorder');
        const chartContainer = document.getElementById('chartContainer');
        
        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            // Configurar eventos
            calculateBtn.addEventListener('click', calculateEOQ);
            exampleBtn.addEventListener('click', loadExample);
            
            // Calcular con valores por defecto
            calculateEOQ();
        });
        
        // Cargar ejemplo
        function loadExample() {
            demandaInput.value = 10000;
            costoOrdenarInput.value = 50;
            costoMantenerInput.value = 2;
            costoProductoInput.value = 10;
            tiempoEntregaInput.value = 5;
            diasTrabajoInput.value = 250;
            
            calculateEOQ();
        }
        
        // Calcular EOQ y resultados
        function calculateEOQ() {
            // Obtener valores de entrada
            const D = parseFloat(demandaInput.value);
            const S = parseFloat(costoOrdenarInput.value);
            const H = parseFloat(costoMantenerInput.value);
            const C = parseFloat(costoProductoInput.value);
            const L = parseFloat(tiempoEntregaInput.value);
            const diasTrabajo = parseFloat(diasTrabajoInput.value);
            
            // Validar entradas
            if (isNaN(D) || D <= 0) {
                alert('Por favor ingrese una demanda anual válida (mayor que 0)');
                return;
            }
            
            if (isNaN(S) || S <= 0) {
                alert('Por favor ingrese un costo de ordenar válido (mayor que 0)');
                return;
            }
            
            if (isNaN(H) || H <= 0) {
                alert('Por favor ingrese un costo de mantener válido (mayor que 0)');
                return;
            }
            
            if (isNaN(C) || C <= 0) {
                alert('Por favor ingrese un costo de producto válido (mayor que 0)');
                return;
            }
            
            if (isNaN(L) || L <= 0) {
                alert('Por favor ingrese un tiempo de entrega válido (mayor que 0)');
                return;
            }
            
            if (isNaN(diasTrabajo) || diasTrabajo < 200 || diasTrabajo > 365) {
                alert('Por favor ingrese días de trabajo válidos (entre 200 y 365)');
                return;
            }
            
            // Calcular EOQ (Cantidad Económica de Pedido)
            // Fórmula: Q* = √(2DS/H)
            const EOQ = Math.sqrt((2 * D * S) / H);
            
            // Calcular demanda diaria
            const d = D / diasTrabajo;
            
            // Calcular punto de reorden (R)
            // Fórmula: R = d × L
            const R = d * L;
            
            // Calcular número de pedidos por año
            const N = D / EOQ;
            
            // Calcular tiempo entre pedidos (en días)
            const T = diasTrabajo / N;
            
            // Calcular costos
            // Costo de compra = D × C
            const costoCompra = D * C;
            
            // Costo de ordenar = (D/Q) × S
            const costoOrdenar = (D / EOQ) * S;
            
            // Costo de mantener = (Q/2) × H
            const costoMantener = (EOQ / 2) * H;
            
            // Costo total = Costo de compra + Costo de ordenar + Costo de mantener
            const costoTotal = costoCompra + costoOrdenar + costoMantener;
            
            // Mostrar resultados
            displayResults(EOQ, R, costoMantener, costoOrdenar, costoCompra, costoTotal);
            
            // Generar gráfico
            generateChart(EOQ, R, T);
        }
        
        // Mostrar resultados
        function displayResults(EOQ, R, costoMantener, costoOrdenar, costoCompra, costoTotal) {
            // Formatear números
            const formatCurrency = (value) => `$${value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const formatNumber = (value) => value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            
            // Actualizar elementos de resultados
            eoqResult.textContent = formatNumber(EOQ);
            reorderResult.textContent = formatNumber(Math.ceil(R));
            holdingCostResult.textContent = formatCurrency(costoMantener);
            orderingCostResult.textContent = formatCurrency(costoOrdenar);
            
            purchaseCostElement.textContent = formatCurrency(costoCompra);
            orderingCostBreakdown.textContent = formatCurrency(costoOrdenar);
            holdingCostBreakdown.textContent = formatCurrency(costoMantener);
            totalCostElement.textContent = formatCurrency(costoTotal);
            
            chartEoqElement.textContent = formatNumber(EOQ);
            chartReorderElement.textContent = formatNumber(Math.ceil(R));
        }
        
        // Generar gráfico de niveles de inventario
        function generateChart(EOQ, R, cycleTime) {
            // Limpiar contenedor del gráfico
            chartContainer.innerHTML = '';
            
            // Dimensiones del gráfico
            const chartWidth = chartContainer.offsetWidth;
            const chartHeight = 150;
            const maxInventory = EOQ * 1.2; // Aumentar un 20% para mostrar espacio
            
            // Crear elementos del gráfico
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", chartHeight + 50);
            svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight + 50}`);
            
            // Función para escalar valores al tamaño del gráfico
            const scaleY = (value) => chartHeight - (value / maxInventory) * chartHeight;
            const scaleX = (value) => (value / cycleTime) * (chartWidth - 100) + 50;
            
            // Dibujar líneas de nivel
            // Línea de EOQ
            const eoqY = scaleY(EOQ);
            const eoqLine = document.createElementNS(svgNS, "line");
            eoqLine.setAttribute("x1", "0");
            eoqLine.setAttribute("y1", eoqY);
            eoqLine.setAttribute("x2", chartWidth);
            eoqLine.setAttribute("y2", eoqY);
            eoqLine.setAttribute("stroke", "#3498db");
            eoqLine.setAttribute("stroke-width", "2");
            eoqLine.setAttribute("stroke-dasharray", "5,5");
            svg.appendChild(eoqLine);
            
            // Etiqueta EOQ
            const eoqLabel = document.createElementNS(svgNS, "text");
            eoqLabel.setAttribute("x", chartWidth - 40);
            eoqLabel.setAttribute("y", eoqY - 5);
            eoqLabel.setAttribute("fill", "#3498db");
            eoqLabel.setAttribute("font-size", "12");
            eoqLabel.setAttribute("font-weight", "bold");
            eoqLabel.textContent = "EOQ";
            svg.appendChild(eoqLabel);
            
            // Línea de punto de reorden
            const reorderY = scaleY(R);
            const reorderLine = document.createElementNS(svgNS, "line");
            reorderLine.setAttribute("x1", "0");
            reorderLine.setAttribute("y1", reorderY);
            reorderLine.setAttribute("x2", chartWidth);
            reorderLine.setAttribute("y2", reorderY);
            reorderLine.setAttribute("stroke", "#e74c3c");
            reorderLine.setAttribute("stroke-width", "2");
            reorderLine.setAttribute("stroke-dasharray", "5,5");
            svg.appendChild(reorderLine);
            
            // Etiqueta R
            const reorderLabel = document.createElementNS(svgNS, "text");
            reorderLabel.setAttribute("x", chartWidth - 40);
            reorderLabel.setAttribute("y", reorderY - 5);
            reorderLabel.setAttribute("fill", "#e74c3c");
            reorderLabel.setAttribute("font-size", "12");
            reorderLabel.setAttribute("font-weight", "bold");
            reorderLabel.textContent = "R";
            svg.appendChild(reorderLabel);
            
            // Dibujar ciclo de inventario (forma de diente de sierra)
            const points = [];
            
            // Punto inicial (inventario lleno)
            points.push(`0,${scaleY(EOQ)}`);
            
            // Punto medio (inventario en R)
            const timeToReorder = (EOQ - R) / (EOQ / cycleTime);
            points.push(`${scaleX(timeToReorder)},${scaleY(R)}`);
            
            // Punto de reabastecimiento (inventario vuelve a EOQ)
            points.push(`${scaleX(timeToReorder)},${scaleY(EOQ)}`);
            
            // Punto final del ciclo
            points.push(`${scaleX(cycleTime)},${scaleY(R)}`);
            
            // Crear polígono del ciclo
            const polygon = document.createElementNS(svgNS, "polygon");
            polygon.setAttribute("points", points.join(" "));
            polygon.setAttribute("fill", "rgba(52, 152, 219, 0.1)");
            polygon.setAttribute("stroke", "#3498db");
            polygon.setAttribute("stroke-width", "2");
            svg.appendChild(polygon);
            
            // Eje X (tiempo)
            const xAxis = document.createElementNS(svgNS, "line");
            xAxis.setAttribute("x1", "40");
            xAxis.setAttribute("y1", chartHeight);
            xAxis.setAttribute("x2", chartWidth);
            xAxis.setAttribute("y2", chartHeight);
            xAxis.setAttribute("stroke", "#333");
            xAxis.setAttribute("stroke-width", "1");
            svg.appendChild(xAxis);
            
            // Etiquetas del eje X
            const timeLabel1 = document.createElementNS(svgNS, "text");
            timeLabel1.setAttribute("x", "50");
            timeLabel1.setAttribute("y", chartHeight + 15);
            timeLabel1.setAttribute("fill", "#666");
            timeLabel1.setAttribute("font-size", "11");
            timeLabel1.textContent = "0 días";
            svg.appendChild(timeLabel1);
            
            const timeLabel2 = document.createElementNS(svgNS, "text");
            timeLabel2.setAttribute("x", scaleX(cycleTime/2));
            timeLabel2.setAttribute("y", chartHeight + 15);
            timeLabel2.setAttribute("fill", "#666");
            timeLabel2.setAttribute("font-size", "11");
            timeLabel2.textContent = `${(cycleTime/2).toFixed(1)} días`;
            svg.appendChild(timeLabel2);
            
            const timeLabel3 = document.createElementNS(svgNS, "text");
            timeLabel3.setAttribute("x", scaleX(cycleTime) - 20);
            timeLabel3.setAttribute("y", chartHeight + 15);
            timeLabel3.setAttribute("fill", "#666");
            timeLabel3.setAttribute("font-size", "11");
            timeLabel3.textContent = `${cycleTime.toFixed(1)} días`;
            svg.appendChild(timeLabel3);
            
            // Eje Y (inventario)
            const yAxis = document.createElementNS(svgNS, "line");
            yAxis.setAttribute("x1", "40");
            yAxis.setAttribute("y1", "0");
            yAxis.setAttribute("x2", "40");
            yAxis.setAttribute("y2", chartHeight);
            yAxis.setAttribute("stroke", "#333");
            yAxis.setAttribute("stroke-width", "1");
            svg.appendChild(yAxis);
            
            // Etiquetas del eje Y
            const inventoryLabel1 = document.createElementNS(svgNS, "text");
            inventoryLabel1.setAttribute("x", "20");
            inventoryLabel1.setAttribute("y", "15");
            inventoryLabel1.setAttribute("fill", "#666");
            inventoryLabel1.setAttribute("font-size", "11");
            inventoryLabel1.textContent = `${maxInventory.toFixed(0)}`;
            svg.appendChild(inventoryLabel1);
            
            const inventoryLabel2 = document.createElementNS(svgNS, "text");
            inventoryLabel2.setAttribute("x", "20");
            inventoryLabel2.setAttribute("y", scaleY(EOQ/2) + 5);
            inventoryLabel2.setAttribute("fill", "#666");
            inventoryLabel2.setAttribute("font-size", "11");
            inventoryLabel2.textContent = `${(EOQ/2).toFixed(0)}`;
            svg.appendChild(inventoryLabel2);
            
            const inventoryLabel3 = document.createElementNS(svgNS, "text");
            inventoryLabel3.setAttribute("x", "20");
            inventoryLabel3.setAttribute("y", chartHeight - 5);
            inventoryLabel3.setAttribute("fill", "#666");
            inventoryLabel3.setAttribute("font-size", "11");
            inventoryLabel3.textContent = "0";
            svg.appendChild(inventoryLabel3);
            
            // Etiqueta del eje Y
            const yAxisLabel = document.createElementNS(svgNS, "text");
            yAxisLabel.setAttribute("x", "15");
            yAxisLabel.setAttribute("y", "-15");
            yAxisLabel.setAttribute("fill", "#666");
            yAxisLabel.setAttribute("font-size", "10");
            yAxisLabel.setAttribute("transform", "rotate(-90, 15, -15)");
            yAxisLabel.textContent = "Inventario (unidades)";
            svg.appendChild(yAxisLabel);
            
            // Agregar SVG al contenedor
            chartContainer.appendChild(svg);
            
            // Crear leyenda
            const legend = document.createElement('div');
            legend.style.marginTop = '10px';
            legend.style.display = 'flex';
            legend.style.justifyContent = 'center';
            legend.style.gap = '20px';
            legend.style.fontSize = '0.9rem';
            
            const eoqLegend = document.createElement('div');
            eoqLegend.innerHTML = '<span style="display:inline-block;width:15px;height:15px;background-color:#3498db;margin-right:5px;"></span> EOQ = Nivel máximo';
            
            const reorderLegend = document.createElement('div');
            reorderLegend.innerHTML = '<span style="display:inline-block;width:15px;height:15px;background-color:#e74c3c;margin-right:5px;"></span> R = Punto de reorden';
            
            const cycleLegend = document.createElement('div');
            cycleLegend.innerHTML = '<span style="display:inline-block;width:15px;height:15px;background-color:rgba(52, 152, 219, 0.1);border:1px solid #3498db;margin-right:5px;"></span> Ciclo de inventario';
            
            legend.appendChild(eoqLegend);
            legend.appendChild(reorderLegend);
            legend.appendChild(cycleLegend);
            
            chartContainer.appendChild(legend);
        }
        
        // Función para redibujar el gráfico al cambiar el tamaño de la ventana
        window.addEventListener('resize', function() {
            if (demandaInput.value) {
                calculateEOQ();
            }
        });