export default function section(board, col, row, value, firstActive) {
  let PieceWidth = 42;
  let PieceHeight = 52;
  let div = document.createElement("div");
  div.classList.add("section");
  div.image = document.createElement("img");
  div.setAttribute("col", col);
  div.setAttribute("row", row);
  div.setImage = function (imgIndex) {
    this.image.src = "images/section" + imgIndex + ".png";
    this.valueInMatrix = imgIndex;
  };
  if (col === firstActive?.col && row === firstActive?.row) {
    div.style.opacity = "50%";
  }

  if (value > 0) {
    div.style.cursor = "pointer";

    div.setImage(value);
  }
  div.appendChild(div.image);

  div.board = board;
  div.colIndex = col;
  div.rowIndex = row;

  div.style.position = "absolute";
  div.style.left = col * PieceWidth + "px";
  div.style.top = row * PieceHeight + "px";
  div.style.width = PieceWidth + "px";
  div.style.height = PieceHeight + "px";

  div.isVisible = true;

  div.setVisible = function (flag) {
    this.isVisible = flag;
    this.style.visibility = flag ? "visible" : "hidden";
  };

  div.setBorder = function (thick, color) {
    this.image.border = thick;
    this.image.style.borderColor = color;
  };

  div.setHightlight = function () {
    this.setBorder(1, "red");
  };

  div.setNormal = function () {
    this.setBorder(1, "#009933");
  };

  div.onmouseover = function () {
    this.setHightlight();
  };

  div.onmouseout = function () {
    this.setNormal();
  };
  div.onclick = () => {};

  div.setNormal();

  return div;
}
