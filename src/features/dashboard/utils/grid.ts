export function indexToCoords(index: number, cols: number) {
  return { row: Math.floor(index / cols), col: index % cols };
}

export function getRectangle(start: number, end: number, cols: number) {
  const a = indexToCoords(start, cols);
  const b = indexToCoords(end, cols);

  const rowMin = Math.min(a.row, b.row);
  const rowMax = Math.max(a.row, b.row);
  const colMin = Math.min(a.col, b.col);
  const colMax = Math.max(a.col, b.col);

  const selected: number[] = [];
  for (let r = rowMin; r <= rowMax; r++) {
    for (let c = colMin; c <= colMax; c++) {
      selected.push(r * cols + c);
    }
  }
  return selected;
}



