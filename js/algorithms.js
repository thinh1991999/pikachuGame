class algorithms {
  constructor() {}
  getRandom(n) {
    return Math.round(Math.random() * (n - 1));
  }
  newArray(col) {
    let a = new Array();
    for (let i = 0; i < col; i++) a[i] = new Array();
    return a;
  }

  point(x, y) {
    return {
      x,
      y,
    };
  }

  getNewMatrix() {
    let a = this.newArray(18);
    let i, j, k, t, remain, key;
    let stop;

    for (i = 0; i < 18; i++) for (j = 0; j < 11; j++) a[i][j] = 0;
    remain = 144;
    for (k = 1; k <= 36; k++) {
      for (t = 1; t <= 4; t++) {
        key = this.getRandom(remain--) + 1;
        stop = false;
        for (i = 1; i <= 16; i++) {
          if (stop) break;
          else
            for (j = 1; j <= 9; j++)
              if (a[i][j] == 0) {
                key--;
                if (key == 0) {
                  stop = true;
                  a[i][j] = k;
                  break;
                }
              }
        }
      }
    }
    return a;
  }

  checkPath(a, i1, j1, i2, j2) {
    let UU = new Array(0, 0, 1, -1);
    let VV = new Array(1, -1, 0, 0);
    if (i1 == i2 && j1 == j2) return null;
    if (a[i1][j1] == 0 || a[i2][j2] == 0) return null;
    if (a[i1][j1] != a[i2][j2]) return null;

    let fist, last, i, j, t;
    let queue = new Array();
    let box = this.newArray(18);
    let count = this.newArray(18);

    for (i = 0; i < 198; i++) queue[i] = this.point(0, 0);
    fist = 0;
    last = 0;
    queue[0].x = i1;
    queue[0].y = j1;
    for (i = 0; i < 18; i++)
      for (j = 0; j < 11; j++) box[i][j] = this.point(-1, -1);
    box[i1][j1].x = -2;
    count[i1][j1] = 0;

    let canGo = new Array();
    let p = new Array();
    let q = new Array();

    while (fist <= last) {
      i = queue[fist].x;
      j = queue[fist].y;
      fist++;
      for (t = 0; t < 4; t++) {
        canGo[t] = true;
        p[t] = i;
        q[t] = j;
      }
      do {
        for (t = 0; t < 4; t++)
          if (canGo[t]) {
            p[t] += UU[t];
            q[t] += VV[t];
            if (!this.myInside(p[t], q[t])) {
              canGo[t] = false;
              continue;
            }
            if (p[t] == i2 && q[t] == j2) {
              box[p[t]][q[t]].x = i;
              box[p[t]][q[t]].y = j;
              return this.createArrayList(box, i2, j2);
            }
            if (a[p[t]][q[t]] > 0) {
              canGo[t] = false;
              continue;
            }
            if (box[p[t]][q[t]].x != -1) continue;
            if (count[i][j] == 2) continue;
            last++;
            queue[last].x = p[t];
            queue[last].y = q[t];
            box[p[t]][q[t]].x = i;
            box[p[t]][q[t]].y = j;
            count[p[t]][q[t]] = count[i][j] + 1;
          }
      } while (canGo[0] || canGo[1] || canGo[2] || canGo[3]);
    }
    return null;
  }

  myInside(i, j) {
    return i >= 0 && i < 18 && j >= 0 && j < 11;
  }
  createArrayList(box, i, j) {
    let arrayList = new Array();
    let p, q;
    do {
      arrayList.push(this.point(i, j));
      p = box[i][j].x;
      q = box[i][j].y;
      i = p;
      j = q;
    } while (i != -2);
    return arrayList;
  }
  getCol(arr, n) {
    return arr.map((x) => x[n]);
  }
  getNewArrZero() {
    const newArray = this.newArray(18);
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < 11; j++) {
        newArray[i][j] = 0;
      }
    }
    return newArray;
  }
  getLevelMatrix(arrayList, level) {
    switch (level) {
      case 1: {
        return arrayList;
      }
      case 2: {
        const newArray = this.getNewArrZero();
        for (let i = 1; i < arrayList.length - 1; i++) {
          const arrHandle = arrayList[i];
          let arrZero = [];
          for (let j = 1; j < arrHandle.length - 1; j++) {
            if (arrHandle[j] === 0) {
              arrZero.push(j);
            }
          }
          for (let i = 0; i < arrZero.length; i++) {
            arrHandle.splice(arrZero[i], 1);
            arrHandle.unshift(0);
          }
          for (let m = 0; m < arrHandle.length; m++) {
            newArray[i][m] = arrHandle[m];
          }
        }
        return newArray;
      }
      case 3: {
        const newArray = this.getNewArrZero();
        for (let i = 1; i < arrayList.length - 1; i++) {
          const arrHandle = arrayList[i];
          let arrZero = [];
          for (let j = 1; j < arrHandle.length - 1; j++) {
            if (arrHandle[j] === 0) {
              arrZero.push(j);
            }
          }

          for (let i = 0; i < arrZero.length; i++) {
            if (i === 0) {
              arrHandle.splice(arrZero[i], 1);
              arrHandle.push(0);
            } else {
              arrHandle.splice(arrZero[i] - 1, 1);
              arrHandle.push(0);
            }
          }
          for (let m = 0; m < arrHandle.length; m++) {
            newArray[i][m] = arrHandle[m];
          }
        }
        return newArray;
      }
      case 4: {
        const newArray = this.getNewArrZero();
        for (let i = 1; i < arrayList[0].length - 1; i++) {
          const arrHandle = this.getCol(arrayList, i);
          let arrZero = [];
          for (let j = 1; j < arrHandle.length - 1; j++) {
            if (arrHandle[j] === 0) {
              arrZero.push(j);
            }
          }

          for (let i = 0; i < arrZero.length; i++) {
            if (i === 0) {
              arrHandle.splice(arrZero[i], 1);
              arrHandle.push(0);
            } else {
              arrHandle.splice(arrZero[i] - 1, 1);
              arrHandle.push(0);
            }
          }
          for (let m = 0; m < arrHandle.length; m++) {
            newArray[m][i] = arrHandle[m];
          }
        }
        return newArray;
      }
      case 5: {
        const newArray = this.getNewArrZero();
        for (let i = 1; i < arrayList[0].length - 1; i++) {
          const arrHandle = this.getCol(arrayList, i);
          let arrZero = [];
          for (let j = 1; j < arrHandle.length - 1; j++) {
            if (arrHandle[j] === 0) {
              arrZero.push(j);
            }
          }

          for (let i = 0; i < arrZero.length; i++) {
            arrHandle.splice(arrZero[i], 1);
            arrHandle.unshift(0);
          }
          for (let m = 0; m < arrHandle.length; m++) {
            newArray[m][i] = arrHandle[m];
          }
        }
        return newArray;
      }
      case 6: {
        const newArray = this.getNewArrZero();
        for (let i = 1; i < arrayList.length - 1; i++) {
          const arrHandle = arrayList[i];
          const center = arrHandle.length / 2;
          let arrZeroSmall = [];
          let arrZeroBig = [];
          for (let j = 1; j < arrHandle.length - 1; j++) {
            if (arrHandle[j] === 0) {
              if (j < center) {
                arrZeroSmall.push(j);
              } else {
                arrZeroBig.push(j);
              }
            }
          }
          for (let i = 0; i < arrZeroSmall.length; i++) {
            arrHandle.splice(arrZeroSmall[i], 1);
            arrHandle.unshift(0);
          }
          for (let i = 0; i < arrZeroBig.length; i++) {
            if (i === 0) {
              arrHandle.splice(arrZeroBig[i], 1);
              arrHandle.push(0);
            } else {
              arrHandle.splice(arrZeroBig[i] - 1, 1);
              arrHandle.push(0);
            }
          }
          for (let m = 0; m < arrHandle.length; m++) {
            newArray[i][m] = arrHandle[m];
          }
        }
        for (let i = 1; i < newArray[0].length - 1; i++) {
          const arrHandle = this.getCol(newArray, i);
          const center = arrHandle.length / 2;
          let arrZeroSmall = [];
          let arrZeroBig = [];
          for (let j = 1; j < arrHandle.length - 1; j++) {
            if (arrHandle[j] === 0) {
              if (j < center) {
                arrZeroSmall.push(j);
              } else {
                arrZeroBig.push(j);
              }
            }
          }
          for (let i = 0; i < arrZeroSmall.length; i++) {
            arrHandle.splice(arrZeroSmall[i], 1);
            arrHandle.unshift(0);
          }
          for (let i = 0; i < arrZeroBig.length; i++) {
            if (i === 0) {
              arrHandle.splice(arrZeroBig[i], 1);
              arrHandle.push(0);
            } else {
              arrHandle.splice(arrZeroBig[i] - 1, 1);
              arrHandle.push(0);
            }
          }
          for (let m = 0; m < arrHandle.length; m++) {
            newArray[m][i] = arrHandle[m];
          }
        }
        return newArray;
      }
      default:
        return newArray;
    }
  }
  checkHavePath(arr) {
    let finalPath = null;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        for (let m = 0; m < arr.length; m++) {
          for (let n = 0; n < arr[m].length; n++) {
            finalPath = this.checkPath(arr, i, j, m, n);
            if (finalPath) return finalPath;
          }
        }
      }
    }
    return null;
  }
  fixMatrix(a) {
    let b = new Array();
    let i,
      j,
      k = 0;
    for (let i = 1; i <= 16; i++)
      for (let j = 1; j <= 9; j++) if (a[i][j] > 0) b[k++] = a[i][j];
    this.mixArr(b, k);
    k = 0;
    for (let i = 1; i <= 16; i++)
      for (let j = 1; j <= 9; j++) if (a[i][j] > 0) a[i][j] = b[k++];

    let tmp = this.newArray(18);
    for (let i = 0; i < 18; i++)
      for (let j = 0; j < 11; j++) tmp[i][j] = a[i][j] > 0 ? 1 : 0;
    const checkPath = this.checkHavePath(a);
    if (!checkPath) {
      return this.fixMatrix(a);
    } else {
      return a;
    }
  }
  checkFinishRound(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[0].length; j++) {
        count += arr[i][j];
      }
    }
    return count === 0;
  }
  mixArr(a, n) {
    let b = this.generate(n);
    let c = new Array();
    for (let i = 0; i < n; i++) c[i] = a[b[i]];
    for (let i = 0; i < n; i++) a[i] = c[i];
  }
  generate(n) {
    let a = new Array();
    let i, j, k, t;
    for (i = 0; i < n; i++) a[i] = n;
    j = n;
    for (i = 0; i < n; i++) {
      k = this.getRandom(j--) + 1;
      t = 0;
      while (k > 0) {
        if (a[t++] == n) k--;
      }
      a[t - 1] = i;
    }
    return a;
  }
}

export const algorithmsClass = new algorithms();
