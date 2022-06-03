export default function getBox(title) {
  return `<div class="box__wrap">
    <h5>${title}</h5>
    <p>Cấp độ: <span class="box__lv"></span></p>
    <p>Vòng: <span class="box__round"></span></p>
    <p>Điểm đạt được: <span class="box__score"></span></p>
    <div class="box__btn">
      <button class="again__btn">Choi lai</button>
      <button class="menu__btn">Trang chủ</button>
    </div>
  </div>`;
}
