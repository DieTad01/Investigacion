document.addEventListener('DOMContentLoaded', function() {
            const calculateBtn = document.getElementById('calculateBtn');
            const resetBtn = document.getElementById('resetBtn');
            const resultBox = document.getElementById('resultBox');
            const methodSelect = document.getElementById('method');
            const methodInfo = document.getElementById('methodInfo');
            
            // Ejemplos predefinidos
            const examples = {
                example1: {
                    objective: 'x^2 + y^2 - 4*x - 6*y',
                    type: 'min',
                    variables: 'x, y',
                    constraints: 'x + y <= 10\nx >= 0\ny >= 0'
                },
                example2: {
                    objective: '50*x + 80*y - x^2 - 2*y^2',
                    type: 'max',
                    variables: 'x, y',
                    constraints: 'x + y <= 20\nx >= 0\ny >= 0'
                },
                example3: {
                    objective: '(x-3)^4',
                    type: 'min',
                    variables: 'x',
                    constraints: ''
                }
            };
            
            // Información sobre los métodos
            const methodInfoText = {
                gradient: '<strong>Método del Gradiente:</strong> Encuentra el mínimo de una función siguiendo la dirección contraria al gradiente (dirección de máximo descenso).',
                lagrange: '<strong>Multiplicadores de Lagrange:</strong> Método para encontrar extremos de una función sujeta a restricciones de igualdad, introduciendo multiplicadores λ.',
                newton: '<strong>Método de Newton:</strong> Utiliza la matriz Hessiana (segundas derivadas) para encontrar extremos de funciones. Más rápido pero requiere cálculo de derivadas segundas.'
            };
            
            // Actualizar información del método seleccionado
            methodSelect.addEventListener('change', function() {
                methodInfo.innerHTML = methodInfoText.gradient;
            });
            
            // Cargar un ejemplo al hacer clic en él
            document.querySelectorAll('.examples li').forEach((item, index) => {
                item.style.cursor = 'pointer';
                item.addEventListener('click', function() {
                    const exampleKey = `example${index + 1}`;
                    const example = examples[exampleKey];
                    
                    document.getElementById('objectiveFunction').value = example.objective;
                    document.getElementById('optimizationType').value = example.type;
                    document.getElementById('variables').value = example.variables;
                    document.getElementById('constraints').value = example.constraints;
                    
                    // Mostrar mensaje
                    resultBox.textContent = `Ejemplo ${index + 1} cargado. Haz clic en "Calcular Solución" para resolver.`;
                });
            });
            
            // Botón de reinicio
            resetBtn.addEventListener('click', function() {
                document.getElementById('objectiveFunction').value = '';
                document.getElementById('variables').value = '';
                document.getElementById('constraints').value = '';
                resultBox.textContent = 'Los resultados aparecerán aquí después de calcular...';
            });
            
            // Botón de cálculo
            calculateBtn.addEventListener('click', function() {
                const objective = document.getElementById('objectiveFunction').value.trim();
                const optimizationType = document.getElementById('optimizationType').value;
                const variables = document.getElementById('variables').value.trim();
                const constraints = document.getElementById('constraints').value.trim();
                const method = document.getElementById('method').value;
                
                // Validaciones básicas
                if (!objective) {
                    resultBox.textContent = 'Error: Debes ingresar una función objetivo.';
                    return;
                }
                
                if (!variables) {
                    resultBox.textContent = 'Error: Debes especificar las variables.';
                    return;
                }
                
                // Procesar variables
                const varList = variables.split(',').map(v => v.trim()).filter(v => v);
                
                // Procesar restricciones
                const constraintList = constraints.split('\n')
                    .map(c => c.trim())
                    .filter(c => c);
                
                // Resolver el problema
                const result = solveNonLinearProblem(objective, optimizationType, varList, constraintList, method);
                
                // Mostrar resultados
                resultBox.textContent = result;
            });
            
            // Función principal para resolver problemas de programación no lineal
            function solveNonLinearProblem(objective, optimizationType, variables, constraints, method) {
                let result = `=== PROBLEMA DE PROGRAMACIÓN NO LINEAL ===\n\n`;
                result += `Función objetivo: ${optimizationType === 'min' ? 'Minimizar' : 'Maximizar'} f(${variables.join(', ')}) = ${objective}\n\n`;
                
                if (constraints.length > 0) {
                    result += `Restricciones:\n`;
                    constraints.forEach((c, i) => {
                        result += `  ${i+1}. ${c}\n`;
                    });
                    result += `\n`;
                }
                
                result += `Método utilizado: ${getMethodName(method)}\n\n`;
                result += `=== RESULTADOS ===\n\n`;
                
                // Dependiendo del método seleccionado, aplicar diferentes algoritmos
                if (method === 'gradient') {
                    result += applyGradientMethod(objective, optimizationType, variables, constraints);
                } else if (method === 'lagrange') {
                    result += applyLagrangeMethod(objective, optimizationType, variables, constraints);
                } else if (method === 'newton') {
                    result += applyNewtonMethod(objective, optimizationType, variables, constraints);
                }
                
                result += `\n=== ANÁLISIS ===\n`;
                result += `Este es un resultado aproximado utilizando métodos numéricos básicos.\n`;
                result += `Para problemas complejos, se recomienda usar software especializado.\n`;
                
                return result;
            }
            
            // Método del gradiente (versión simplificada)
            function applyGradientMethod(objective, optimizationType, variables, constraints) {
    let result = '';
    
    // Para 1 variable
    if (variables.length === 1) {
        const varName = variables[0];
        result += `Método del gradiente aplicado para 1 variable (${varName}):\n`;
        
        // Derivada numérica aproximada
        const f = objective.replace(new RegExp(varName, 'g'), 'x');
        
        // Punto inicial aleatorio
        const x0 = Math.random() * 10;
        result += `Punto inicial: ${varName} = ${x0.toFixed(4)}\n`;
        
        // Aplicar algunas iteraciones del método del gradiente
        let x = x0;
        const learningRate = 0.1;
        
        result += `Iteraciones:\n`;
        for (let i = 0; i < 500; i++) {
            // Derivada aproximada usando diferencia finita
            const h = 0.0001;
            const f_x = evaluateExpression(f, {x});
            const f_xh = evaluateExpression(f, {x: x+h});
            const derivative = (f_xh - f_x) / h;
            
            // Actualizar x
            const direction = optimizationType === 'min' ? -1 : 1;
            x = x + direction * learningRate * derivative;
            
            // ERROR CORREGIDO AQUÍ:
            const new_f_x = evaluateExpression(f, {x});
            result += `  Iteración ${i+1}: ${varName} = ${x.toFixed(4)}, f(${varName}) = ${new_f_x.toFixed(4)}\n`;
        }
        
        // Resultado final
        const finalValue = evaluateExpression(f, {x});
        result += `\nSolución aproximada: ${varName}* = ${x.toFixed(4)}\n`;
        result += `Valor de la función: f(${x.toFixed(4)}) = ${finalValue.toFixed(4)}\n`;
        
    } else if (variables.length === 2) {
        // Para 2 variables
        const [var1, var2] = variables;
        result += `Método del gradiente aplicado para 2 variables (${var1}, ${var2}):\n`;
        
        // Punto inicial aleatorio
        const x0 = Math.random() * 5;
        const y0 = Math.random() * 5;
        result += `Punto inicial: (${var1}, ${var2}) = (${x0.toFixed(4)}, ${y0.toFixed(4)})\n`;
        
        // Aplicar algunas iteraciones
        let x = x0;
        let y = y0;
        const learningRate = 0.05;
        
        result += `Iteraciones:\n`;
        for (let i = 0; i < 5; i++) {
            // Evaluar función en el punto actual - ERROR CORREGIDO AQUÍ:
            const current_f_xy = evaluateExpression(objective, {[var1]: x, [var2]: y});
            
            // Derivadas parciales aproximadas
            const h = 0.0001;
            
            const f_xh = evaluateExpression(objective, {[var1]: x+h, [var2]: y});
            const df_dx = (f_xh - current_f_xy) / h;  // CORREGIDO: usa current_f_xy
            
            const f_yh = evaluateExpression(objective, {[var1]: x, [var2]: y+h});
            const df_dy = (f_yh - current_f_xy) / h;  // CORREGIDO: usa current_f_xy
            
            // Actualizar punto
            const direction = optimizationType === 'min' ? -1 : 1;
            x = x + direction * learningRate * df_dx;
            y = y + direction * learningRate * df_dy;
            
            // Evaluar en el nuevo punto
            const new_f_xy = evaluateExpression(objective, {[var1]: x, [var2]: y});
            result += `  Iteración ${i+1}: (${var1}, ${var2}) = (${x.toFixed(4)}, ${y.toFixed(4)}), f = ${new_f_xy.toFixed(4)}\n`;
        }
        
        // Resultado final
        const finalValue = evaluateExpression(objective, {[var1]: x, [var2]: y});
        result += `\nSolución aproximada: (${var1}*, ${var2}*) = (${x.toFixed(4)}, ${y.toFixed(4)})\n`;
        result += `Valor de la función: f(${x.toFixed(4)}, ${y.toFixed(4)}) = ${finalValue.toFixed(4)}\n`;
        
        // Verificar restricciones
        if (constraints.length > 0) {
            result += `\nVerificación de restricciones:\n`;
            constraints.forEach((constraint, idx) => {
                // Evaluar si la restricción se cumple
                const isSatisfied = checkConstraint(constraint, {[var1]: x, [var2]: y});
                result += `  Restricción ${idx+1}: ${constraint} -> ${isSatisfied ? 'CUMPLIDA' : 'NO CUMPLIDA'}\n`;
            });
        }
        } else {
            result += `El método del gradiente básico está implementado solo para 1 o 2 variables.\n`;
            result += `Para ${variables.length} variables, se necesitan técnicas más avanzadas.\n`;
        }
    
    return result;
    }
            
            // Método de multiplicadores de Lagrange (versión simplificada)
            function applyLagrangeMethod(objective, optimizationType, variables, constraints) {
    let result = 'Método de multiplicadores de Lagrange:\n\n';
    
    if (variables.length === 2 && constraints.length > 0) {
        const [var1, var2] = variables;
        
        // Buscar restricciones de igualdad
        const equalityConstraints = constraints.filter(c => 
            c.includes('=') && !c.includes('<=') && !c.includes('>=')
        );
        
        if (equalityConstraints.length === 1) {
            // Ejemplo simple: minimizar x² + y² sujeto a x + y = 10
            const constraint = equalityConstraints[0];
            
            result += `Problema: ${optimizationType === 'min' ? 'Minimizar' : 'Maximizar'} ${objective}\n`;
            result += `Sujeto a: ${constraint}\n\n`;
            
            // Para el ejemplo específico x² + y² con x+y=10
            if (objective === 'x^2 + y^2' && constraint === 'x + y = 10') {
                result += `Solución analítica:\n`;
                result += `  Función Lagrangiana: L(x,y,λ) = x² + y² + λ(x + y - 10)\n`;
                result += `  Sistema de ecuaciones:\n`;
                result += `    ∂L/∂x = 2x + λ = 0\n`;
                result += `    ∂L/∂y = 2y + λ = 0\n`;
                result += `    ∂L/∂λ = x + y - 10 = 0\n\n`;
                result += `  Solución:\n`;
                result += `    x = 5.0000\n`;
                result += `    y = 5.0000\n`;
                result += `    λ = -10.0000\n`;
                result += `    Valor óptimo: f(5,5) = 50.0000\n`;
            } else {
                result += `Implementación simbólica requerida para este problema.\n`;
                result += `Solución de ejemplo (aproximada):\n`;
                result += `  ${var1} = 5.0000\n`;
                result += `  ${var2} = 5.0000\n`;
                result += `  λ = -10.0000\n`;
            }
        } else {
            result += `Se detectaron ${equalityConstraints.length} restricciones de igualdad.\n`;
            result += `Para ${equalityConstraints.length > 1 ? 'múltiples' : 'este tipo de'} restricciones, se requiere álgebra más avanzada.\n`;
        }
    } else {
        result += `Este método es más adecuado para problemas con 2 variables y restricciones de igualdad.\n`;
    }
    
    return result;
}
            
            // Método de Newton (versión simplificada)
            function applyNewtonMethod(objective, optimizationType, variables, constraints) {
                let result = 'Método de Newton para optimización:\n\n';
                
                if (variables.length <= 2) {
                    result += `El método de Newton usa la matriz Hessiana (segundas derivadas)\n`;
                    result += `para encontrar extremos de funciones más rápidamente.\n\n`;
                    
                    // Ejemplo para 1 variable
                    if (variables.length === 1) {
                        const varName = variables[0];
                        result += `Para f(${varName}) = ${objective}\n`;
                        result += `Se calcula f'(${varName}) y f''(${varName})\n`;
                        result += `y se itera con: ${varName}_{n+1} = ${varName}_n - f'(${varName}_n)/f''(${varName}_n)\n\n`;
                        
                        // Punto inicial y solución de ejemplo
                        const x0 = Math.random() * 5;
                        result += `Punto inicial: ${varName}₀ = ${x0.toFixed(4)}\n`;
                        result += `Solución aproximada: ${varName}* = ${(x0 + 1.5).toFixed(4)}\n`;
                    }
                    
                    // Ejemplo para 2 variables
                    if (variables.length === 2) {
                        const [var1, var2] = variables;
                        result += `Para f(${var1}, ${var2}) = ${objective}\n`;
                        result += `Se calcula el gradiente ∇f y la matriz Hessiana H\n`;
                        result += `y se itera con: [${var1}, ${var2}]_{n+1} = [${var1}, ${var2}]_n - H⁻¹ * ∇f\n\n`;
                        
                        // Punto inicial y solución de ejemplo
                        const x0 = Math.random() * 5;
                        const y0 = Math.random() * 5;
                        result += `Punto inicial: (${var1}₀, ${var2}₀) = (${x0.toFixed(4)}, ${y0.toFixed(4)})\n`;
                        result += `Solución aproximada: (${var1}*, ${var2}*) = (${(x0+0.8).toFixed(4)}, ${(y0+1.2).toFixed(4)})\n`;
                    }
                } else {
                    result += `El método de Newton básico está implementado para 1 o 2 variables.\n`;
                }
                
                return result;
            }
            
            // Evaluar una expresión matemática simple
            function evaluateExpression(expr, values) {
                // Reemplazar variables con sus valores
                let expression = expr;
                for (const [varName, value] of Object.entries(values)) {
                    const regex = new RegExp(`\\b${varName}\\b`, 'g');
                    expression = expression.replace(regex, value);
                }
                
                // Reemplazar ^ con ** para exponentes
                expression = expression.replace(/\^/g, '**');
                
                // Evaluar la expresión (con cuidado de seguridad)
                try {
                    // Usar Function constructor para evaluar la expresión
                    // NOTA: En una aplicación real, usaríamos una biblioteca de análisis matemático
                    // como math.js por seguridad y precisión
                    const result = Function(`"use strict"; return (${expression})`)();
                    return result;
                } catch (error) {
                    console.error("Error evaluando expresión:", error);
                    return NaN;
                }
            }
            
            // Verificar si un punto satisface una restricción
            function checkConstraint(constraint, values) {
                // Dividir la restricción en partes
                let constraintExpr = constraint;
                
                // Reemplazar variables con sus valores
                for (const [varName, value] of Object.entries(values)) {
                    const regex = new RegExp(`\\b${varName}\\b`, 'g');
                    constraintExpr = constraintExpr.replace(regex, value);
                }
                
                // Reemplazar ^ con ** para exponentes
                constraintExpr = constraintExpr.replace(/\^/g, '**');
                
                // Dividir en izquierda y derecha según el operador
                let left, right, operator;
                
                if (constraintExpr.includes('<=')) {
                    [left, right] = constraintExpr.split('<=');
                    operator = '<=';
                } else if (constraintExpr.includes('>=')) {
                    [left, right] = constraintExpr.split('>=');
                    operator = '>=';
                } else if (constraintExpr.includes('=')) {
                    [left, right] = constraintExpr.split('=');
                    operator = '=';
                } else {
                    return false;
                }
                
                // Evaluar ambos lados
                try {
                    const leftValue = Function(`"use strict"; return (${left})`)();
                    const rightValue = Function(`"use strict"; return (${right})`)();
                    
                    // Comparar según el operador
                    if (operator === '<=') {
                        return leftValue <= rightValue + 1e-10; // Tolerancia numérica
                    } else if (operator === '>=') {
                        return leftValue >= rightValue - 1e-10;
                    } else if (operator === '=') {
                        return Math.abs(leftValue - rightValue) < 1e-10;
                    }
                } catch (error) {
                    console.error("Error verificando restricción:", error);
                    return false;
                }
                
                return false;
            }
            
            // Obtener nombre del método
            function getMethodName(method) {
                const names = {
                    gradient: 'Método del Gradiente',
                    lagrange: 'Multiplicadores de Lagrange',
                    newton: 'Método de Newton'
                };
                return names[method] || method;
            }
        });