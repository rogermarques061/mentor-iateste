export function slugify(input: string): string {
  return input
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatBRL(value: number): string {
  if (isNaN(value)) value = 0;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseBRLInput(input: string): number {
  const digits = input.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

export function calcInstallments(price: number, max: number) {
  const rows: { n: number; value: number; label: string }[] = [];
  for (let n = 1; n <= max; n++) {
    const v = price / n;
    rows.push({
      n,
      value: v,
      label: `${n}x de ${formatBRL(v)}${n <= 6 ? " (sem juros)" : ""}`,
    });
  }
  return rows;
}

export function genId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
