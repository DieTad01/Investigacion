document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("calculateBtn").addEventListener("click", calcular);
});

function calcular() {
  const fStr = document.getElementById("objectiveFunction").value.trim();
  const type = document.getElementById("optimizationType").value;
  const vars = document.getElementById("variables").value
    .split(",")
    .map(v => v.trim());
  const constraintsStr = document.getElementById("constraints").value.trim();
  const resultBox = document.getElementById("resultBox");

  if (!fStr || vars.length === 0) {
    resultBox.textContent = "Error: faltan datos.";
    return;
  }

  if (vars.length > 2) {
    resultBox.textContent = "Este método solo admite 1 o 2 variables.";
    return;
  }

  const constraints = constraintsStr
    ? constraintsStr.split("\n").map(c => c.trim()).filter(c => c)
    : [];

  const res = gradientWithPenalty(fStr, vars, type, constraints);
  resultBox.textContent = res;
}

/* ==========================
   MÉTODO DEL GRADIENTE
   CON PENALIZACIÓN
========================== */
function gradientWithPenalty(fStr, vars, type, constraints) {
  const maxIter = 300;
  const alpha = 0.05;
  const tol = 1e-6;
  const h = 1e-5;
  const mu = 100; // factor de penalización

  let x = Math.random() * 5;
  let y = Math.random() * 5;

  let output = "=== MÉTODO DEL GRADIENTE CON PENALIZACIÓN ===\n\n";
  output += `Función objetivo: ${fStr}\n`;
  output += `Tipo: ${type === "min" ? "Minimizar" : "Maximizar"}\n`;
  output += `Restricciones:\n`;
  output += constraints.length
    ? constraints.map(c => " - " + c).join("\n")
    : " - Ninguna";
  output += "\n\n";

  for (let i = 0; i < maxIter; i++) {
    if (vars.length === 1) {
      const f0 = penalizedValue(fStr, vars, constraints, mu, { [vars[0]]: x });
      const f1 = penalizedValue(fStr, vars, constraints, mu, { [vars[0]]: x + h });

      const grad = (f1 - f0) / h;
      const dir = type === "min" ? -1 : 1;

      const xNew = x + dir * alpha * grad;
      if (Math.abs(xNew - x) < tol) break;
      x = xNew;
    }

    if (vars.length === 2) {
      const values = { [vars[0]]: x, [vars[1]]: y };

      const f0 = penalizedValue(fStr, vars, constraints, mu, values);
      const fx = penalizedValue(fStr, vars, constraints, mu, {
        [vars[0]]: x + h,
        [vars[1]]: y
      });
      const fy = penalizedValue(fStr, vars, constraints, mu, {
        [vars[0]]: x,
        [vars[1]]: y + h
      });

      const dfdx = (fx - f0) / h;
      const dfdy = (fy - f0) / h;
      const dir = type === "min" ? -1 : 1;

      const xNew = x + dir * alpha * dfdx;
      const yNew = y + dir * alpha * dfdy;

      if (Math.hypot(xNew - x, yNew - y) < tol) break;

      x = xNew;
      y = yNew;
    }
  }

  if (vars.length === 1) {
    const fVal = evalExpr(fStr, { [vars[0]]: x });
    output += `Solución aproximada:\n`;
    output += `${vars[0]}* = ${x.toFixed(6)}\n`;
    output += `f = ${fVal.toFixed(6)}\n`;
  }

  if (vars.length === 2) {
    const fVal = evalExpr(fStr, { [vars[0]]: x, [vars[1]]: y });
    output += `Solución aproximada:\n`;
    output += `${vars[0]}* = ${x.toFixed(6)}\n`;
    output += `${vars[1]}* = ${y.toFixed(6)}\n`;
    output += `f = ${fVal.toFixed(6)}\n`;
  }

  output += `\nNota: solución numérica aproximada usando penalización.\n`;
  return output;
}

/* ==========================
   FUNCIÓN PENALIZADA
========================== */
function penalizedValue(expr, vars, constraints, mu, values) {
  let value = evalExpr(expr, values);
  let penalty = 0;

  constraints.forEach(c => {
    let cons = c;
    for (const v in values) {
      cons = cons.replace(new RegExp(`\\b${v}\\b`, "g"), values[v]);
    }
    cons = cons.replace(/\^/g, "**");

    if (cons.includes("<=")) {
      const [l, r] = cons.split("<=");
      const diff = Function(`return (${l}) - (${r})`)();
      if (diff > 0) penalty += mu * diff * diff;
    }

    if (cons.includes(">=")) {
      const [l, r] = cons.split(">=");
      const diff = Function(`return (${r}) - (${l})`)();
      if (diff > 0) penalty += mu * diff * diff;
    }
  });

  return value + penalty;
}

/* ==========================
   EVALUAR EXPRESIÓN
========================== */
function evalExpr(expr, values) {
  let e = expr;
  for (const v in values) {
    e = e.replace(new RegExp(`\\b${v}\\b`, "g"), values[v]);
  }
  e = e.replace(/\^/g, "**");
  return Function(`"use strict"; return (${e})`)();
}