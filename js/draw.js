class draw {
  constructor() {}
  getRectDraw(p1, p2) {
    var x1, y1, x2, y2;

    if (p1.x < p2.x) {
      x1 = p1.x;
      x2 = p2.x;
    } else {
      x2 = p1.x;
      x1 = p2.x;
    }

    if (p1.y < p2.y) {
      y1 = p1.y;
      y2 = p2.y;
    } else {
      y2 = p1.y;
      y1 = p2.y;
    }
    return {
      x: x1 - 3,
      y: y1 - 3,
      width: x2 - x1 + 6,
      height: y2 - y1 + 6,
    };
  }
  findCentre(i, j) {
    return {
      x: i * 42 + 42 / 2,
      y: j * 52 + 52 / 2,
    };
  }
}

export const drawClass = new draw();
