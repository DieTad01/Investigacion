// Variables globales
        let supplyCount = 3;
        let demandCount = 3;
        let costMatrix = [];
        let supplyValues = [];
        let demandValues = [];
        
        // Elementos del DOM
        const supplyCountInput = document.getElementById('supplyCount');
        const demandCountInput = document.getElementById('demandCount');
        const generateMatrixBtn = document.getElementById('generateMatrixBtn');
        const calculateBtn = document.getElementById('calculateBtn');
        const costMatrixContainer = document.getElementById('costMatrixContainer');
        const supplyDemandContainer = document.getElementById('supplyDemandContainer');
        const resultsContainer = document.getElementById('resultsContainer');
        const stepsContainer = document.getElementById('stepsContainer');
        
        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            generateCostMatrix();
            generateSupplyDemandInputs();
            
            // Configurar eventos
            supplyCountInput.addEventListener('change', function() {
                supplyCount = parseInt(this.value);
                generateCostMatrix();
                generateSupplyDemandInputs();
            });
            
            demandCountInput.addEventListener('change', function() {
                demandCount = parseInt(this.value);
                generateCostMatrix();
                generateSupplyDemandInputs();
            });
            
            generateMatrixBtn.addEventListener('click', function() {
                generateCostMatrix();
                generateSupplyDemandInputs();
            });
            
            calculateBtn.addEventListener('click', calculateVogel);
            
            // Datos de ejemplo
            setExampleData();
        });
        
        // Generar tabla de costos
        function generateCostMatrix() {
            costMatrix = [];
            costMatrixContainer.innerHTML = '';
            
            // Crear tabla para costos
            const table = document.createElement('table');
            table.id = 'costTable';
            
            // Crear encabezados
            const thead = document.createElement('thead');
            let headerRow = document.createElement('tr');
            
            // Celda vacía en la esquina superior izquierda
            headerRow.appendChild(document.createElement('th'));
            
            // Encabezados para destinos
            for (let j = 0; j < demandCount; j++) {
                const th = document.createElement('th');
                th.textContent = `D${j+1}`;
                headerRow.appendChild(th);
            }
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            
            for (let i = 0; i < supplyCount; i++) {
                const row = document.createElement('tr');
                
                // Encabezado de origen
                const th = document.createElement('th');
                th.textContent = `O${i+1}`;
                row.appendChild(th);
                
                // Celdas para costos
                costMatrix[i] = [];
                
                for (let j = 0; j < demandCount; j++) {
                    const td = document.createElement('td');
                    td.className = 'cost-cell';
                    
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.value = Math.floor(Math.random() * 20) + 1;
                    input.id = `cost-${i}-${j}`;
                    
                    td.appendChild(input);
                    row.appendChild(td);
                    
                    costMatrix[i][j] = parseInt(input.value);
                }
                
                tbody.appendChild(row);
            }
            
            table.appendChild(tbody);
            costMatrixContainer.appendChild(table);
        }
        
        // Generar inputs para ofertas y demandas
        function generateSupplyDemandInputs() {
            supplyDemandContainer.innerHTML = '';
            
            // Contenedor para ofertas y demandas
            const container = document.createElement('div');
            container.className = 'supply-demand-container';
            
            // Ofertas
            const supplyDiv = document.createElement('div');
            supplyDiv.innerHTML = '<h4>Ofertas (Suministros)</h4>';
            
            for (let i = 0; i < supplyCount; i++) {
                const div = document.createElement('div');
                div.className = 'size-input';
                div.style.marginBottom = '10px';
                
                const label = document.createElement('label');
                label.textContent = `O${i+1}:`;
                label.htmlFor = `supply-${i}`;
                
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.value = Math.floor(Math.random() * 100) + 20;
                input.id = `supply-${i}`;
                
                div.appendChild(label);
                div.appendChild(input);
                supplyDiv.appendChild(div);
            }
            
            // Demandas
            const demandDiv = document.createElement('div');
            demandDiv.innerHTML = '<h4>Demandas (Requerimientos)</h4>';
            
            for (let j = 0; j < demandCount; j++) {
                const div = document.createElement('div');
                div.className = 'size-input';
                div.style.marginBottom = '10px';
                
                const label = document.createElement('label');
                label.textContent = `D${j+1}:`;
                label.htmlFor = `demand-${j}`;
                
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.value = Math.floor(Math.random() * 80) + 10;
                input.id = `demand-${j}`;
                
                div.appendChild(label);
                div.appendChild(input);
                demandDiv.appendChild(div);
            }
            
            container.appendChild(supplyDiv);
            container.appendChild(demandDiv);
            supplyDemandContainer.appendChild(container);
        }
        
        // Establecer datos de ejemplo
        function setExampleData() {
            // Datos de ejemplo típicos para problema de transporte
            const exampleCosts = [
                [2, 3, 5],
                [4, 1, 3],
                [3, 2, 4]
            ];
            
            const exampleSupply = [30, 40, 50];
            const exampleDemand = [35, 25, 60];
            
            // Aplicar datos de ejemplo si las dimensiones coinciden
            if (supplyCount === 3 && demandCount === 3) {
                for (let i = 0; i < supplyCount; i++) {
                    document.getElementById(`supply-${i}`).value = exampleSupply[i];
                    
                    for (let j = 0; j < demandCount; j++) {
                        document.getElementById(`cost-${i}-${j}`).value = exampleCosts[i][j];
                    }
                }
                
                for (let j = 0; j < demandCount; j++) {
                    document.getElementById(`demand-${j}`).value = exampleDemand[j];
                }
            }
        }
        
        // Leer datos de entrada
        function readInputData() {
            // Leer matriz de costos
            costMatrix = [];
            for (let i = 0; i < supplyCount; i++) {
                costMatrix[i] = [];
                for (let j = 0; j < demandCount; j++) {
                    const value = parseInt(document.getElementById(`cost-${i}-${j}`).value);
                    costMatrix[i][j] = isNaN(value) ? 0 : value;
                }
            }
            
            // Leer ofertas
            supplyValues = [];
            for (let i = 0; i < supplyCount; i++) {
                const value = parseInt(document.getElementById(`supply-${i}`).value);
                supplyValues[i] = isNaN(value) ? 0 : value;
            }
            
            // Leer demandas
            demandValues = [];
            for (let j = 0; j < demandCount; j++) {
                const value = parseInt(document.getElementById(`demand-${j}`).value);
                demandValues[j] = isNaN(value) ? 0 : value;
            }
        }
        
        // Calcular solución con método Vogel
        function calculateVogel() {
            // Leer datos de entrada
            readInputData();
            
            // Verificar que la suma de ofertas sea igual a la suma de demandas
            const totalSupply = supplyValues.reduce((a, b) => a + b, 0);
            const totalDemand = demandValues.reduce((a, b) => a + b, 0);
            
            if (totalSupply !== totalDemand) {
                alert(`La suma de ofertas (${totalSupply}) debe ser igual a la suma de demandas (${totalDemand}).\nPor favor, ajuste los valores para que coincidan.`);
                return;
            }
            
            // Limpiar contenedores de resultados
            resultsContainer.innerHTML = '';
            stepsContainer.innerHTML = '';
            
            // Mostrar problema original
            displayOriginalProblem();
            
            // Aplicar algoritmo de Vogel
            const result = vogelAlgorithm();
            
            // Mostrar resultados
            displayResults(result);
        }
        
        // Algoritmo de Vogel
        function vogelAlgorithm() {
            // Copiar matrices para no modificar los originales
            let supply = [...supplyValues];
            let demand = [...demandValues];
            let costs = costMatrix.map(row => [...row]);
            
            // Matriz para asignaciones
            let allocations = Array(supplyCount).fill().map(() => Array(demandCount).fill(0));
            
            // Para almacenar los pasos
            const steps = [];
            let stepCounter = 1;
            
            // Mientras haya oferta o demanda pendiente
            while (supply.some(s => s > 0) && demand.some(d => d > 0)) {
                // Calcular penalizaciones por fila (origen)
                const rowPenalties = [];
                for (let i = 0; i < supplyCount; i++) {
                    if (supply[i] > 0) {
                        // Encontrar los dos costos más bajos en la fila
                        const rowCosts = costs[i]
                            .map((cost, j) => demand[j] > 0 ? cost : Infinity)
                            .filter(cost => cost !== Infinity)
                            .sort((a, b) => a - b);
                        
                        const penalty = rowCosts.length >= 2 ? rowCosts[1] - rowCosts[0] : rowCosts[0];
                        rowPenalties[i] = penalty;
                    } else {
                        rowPenalties[i] = -Infinity;
                    }
                }
                
                // Calcular penalizaciones por columna (destino)
                const colPenalties = [];
                for (let j = 0; j < demandCount; j++) {
                    if (demand[j] > 0) {
                        // Encontrar los dos costos más bajos en la columna
                        const colCosts = costs
                            .map((row, i) => supply[i] > 0 ? row[j] : Infinity)
                            .filter(cost => cost !== Infinity)
                            .sort((a, b) => a - b);
                        
                        const penalty = colCosts.length >= 2 ? colCosts[1] - colCosts[0] : colCosts[0];
                        colPenalties[j] = penalty;
                    } else {
                        colPenalties[j] = -Infinity;
                    }
                }
                
                // Encontrar la máxima penalización
                const maxRowPenalty = Math.max(...rowPenalties);
                const maxColPenalty = Math.max(...colPenalties);
                
                let selectedRow = -1;
                let selectedCol = -1;
                
                if (maxRowPenalty >= maxColPenalty) {
                    // Seleccionar fila con mayor penalización
                    selectedRow = rowPenalties.indexOf(maxRowPenalty);
                    
                    // En esa fila, encontrar la columna con el menor costo
                    let minCost = Infinity;
                    for (let j = 0; j < demandCount; j++) {
                        if (demand[j] > 0 && costs[selectedRow][j] < minCost) {
                            minCost = costs[selectedRow][j];
                            selectedCol = j;
                        }
                    }
                } else {
                    // Seleccionar columna con mayor penalización
                    selectedCol = colPenalties.indexOf(maxColPenalty);
                    
                    // En esa columna, encontrar la fila con el menor costo
                    let minCost = Infinity;
                    for (let i = 0; i < supplyCount; i++) {
                        if (supply[i] > 0 && costs[i][selectedCol] < minCost) {
                            minCost = costs[i][selectedCol];
                            selectedRow = i;
                        }
                    }
                }
                
                // Asignar la máxima cantidad posible
                const allocation = Math.min(supply[selectedRow], demand[selectedCol]);
                allocations[selectedRow][selectedCol] = allocation;
                
                // Actualizar oferta y demanda restantes
                supply[selectedRow] -= allocation;
                demand[selectedCol] -= allocation;
                
                // Registrar paso
                steps.push({
                    step: stepCounter++,
                    rowPenalties: [...rowPenalties],
                    colPenalties: [...colPenalties],
                    selectedRow,
                    selectedCol,
                    allocation,
                    remainingSupply: [...supply],
                    remainingDemand: [...demand],
                    allocations: allocations.map(row => [...row])
                });
            }
            
            // Calcular costo total
            let totalCost = 0;
            for (let i = 0; i < supplyCount; i++) {
                for (let j = 0; j < demandCount; j++) {
                    if (allocations[i][j] > 0) {
                        totalCost += allocations[i][j] * costMatrix[i][j];
                    }
                }
            }
            
            return {
                allocations,
                totalCost,
                steps
            };
        }
        
        // Mostrar problema original
        function displayOriginalProblem() {
            const problemDiv = document.createElement('div');
            problemDiv.className = 'step';
            
            problemDiv.innerHTML = `
                <h3 class="step-title">Problema de Transporte Original</h3>
                <div class="step-table">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                ${Array.from({length: demandCount}, (_, j) => `<th>D${j+1}</th>`).join('')}
                                <th>Oferta</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Array.from({length: supplyCount}, (_, i) => `
                                <tr>
                                    <th>O${i+1}</th>
                                    ${Array.from({length: demandCount}, (_, j) => `<td>${costMatrix[i][j]}</td>`).join('')}
                                    <td class="highlight">${supplyValues[i]}</td>
                                </tr>
                            `).join('')}
                            <tr>
                                <th>Demanda</th>
                                ${Array.from({length: demandCount}, (_, j) => `<td class="highlight">${demandValues[j]}</td>`).join('')}
                                <td class="total-cost">${supplyValues.reduce((a,b) => a+b, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            
            resultsContainer.appendChild(problemDiv);
        }
        
        // Mostrar resultados
        function displayResults(result) {
            // Mostrar solución óptima
            const solutionDiv = document.createElement('div');
            solutionDiv.className = 'result-summary';
            
            solutionDiv.innerHTML = `
                <h3 class="step-title">Solución Inicial por Método Vogel</h3>
                <div class="step-table">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                ${Array.from({length: demandCount}, (_, j) => `<th>D${j+1}</th>`).join('')}
                                <th>Oferta</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Array.from({length: supplyCount}, (_, i) => `
                                <tr>
                                    <th>O${i+1}</th>
                                    ${Array.from({length: demandCount}, (_, j) => {
                                        const allocation = result.allocations[i][j];
                                        return allocation > 0 ? 
                                            `<td class="allocation-cell">${allocation} (${costMatrix[i][j]})</td>` :
                                            `<td>0</td>`;
                                    }).join('')}
                                    <td class="highlight">${supplyValues[i]}</td>
                                </tr>
                            `).join('')}
                            <tr>
                                <th>Demanda</th>
                                ${Array.from({length: demandCount}, (_, j) => `<td class="highlight">${demandValues[j]}</td>`).join('')}
                                <td class="total-cost">Costo Total: ${result.totalCost}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="total-cost">Costo Total Mínimo: ${result.totalCost}</p>
            `;
            
            resultsContainer.appendChild(solutionDiv);
            
            // Mostrar pasos del algoritmo
            displayAlgorithmSteps(result.steps);
        }
        
        // Mostrar pasos del algoritmo
        function displayAlgorithmSteps(steps) {
            stepsContainer.innerHTML = '<h3 class="section-title">Pasos del Algoritmo Vogel</h3>';
            
            steps.forEach(step => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'step';
                
                // Crear tabla para mostrar penalizaciones y selección
                let penaltiesTable = `
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                ${Array.from({length: demandCount}, (_, j) => `<th>D${j+1}</th>`).join('')}
                                <th>Penalización Fila</th>
                                <th>Oferta Restante</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                for (let i = 0; i < supplyCount; i++) {
                    penaltiesTable += `
                        <tr>
                            <th>O${i+1}</th>
                    `;
                    
                    for (let j = 0; j < demandCount; j++) {
                        const cellClass = (i === step.selectedRow && j === step.selectedCol) ? 'allocation-cell' : '';
                        penaltiesTable += `<td class="${cellClass}">${costMatrix[i][j]}</td>`;
                    }
                    
                    penaltiesTable += `
                            <td class="penalty-cell">${step.rowPenalties[i] !== -Infinity ? step.rowPenalties[i].toFixed(1) : '-'}</td>
                            <td>${step.remainingSupply[i]}</td>
                        </tr>
                    `;
                }
                
                penaltiesTable += `
                            <tr>
                                <th>Penalización Columna</th>
                                ${Array.from({length: demandCount}, (_, j) => 
                                    `<td class="penalty-cell">${step.colPenalties[j] !== -Infinity ? step.colPenalties[j].toFixed(1) : '-'}</td>`
                                ).join('')}
                                <td colspan="2"></td>
                            </tr>
                            <tr>
                                <th>Demanda Restante</th>
                                ${Array.from({length: demandCount}, (_, j) => `<td>${step.remainingDemand[j]}</td>`).join('')}
                                <td colspan="2"></td>
                            </tr>
                        </tbody>
                    </table>
                `;
                
                stepDiv.innerHTML = `
                    <h3 class="step-title">Paso ${step.step}</h3>
                    <p><strong>Asignación:</strong> O${step.selectedRow + 1} → D${step.selectedCol + 1} = ${step.allocation} unidades</p>
                    <div class="step-table">${penaltiesTable}</div>
                `;
                
                stepsContainer.appendChild(stepDiv);
            });
        }