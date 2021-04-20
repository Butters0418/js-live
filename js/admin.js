// C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
    type: 'pie',
    columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
    ],
    colors: {
      'Louvre 雙人床架': '#DACBFF',
      'Antony 雙人床架': '#9D7FEA',
      'Anty 雙人床架': '#5434A7',
      其他: '#301E5F',
    },
  },
});

const orderList = document.querySelector('.order-list');
let orderData = [];
// [init]
function init() {
  getOrderList();
}
// [訂單列表]-- api 取得
function getOrderList() {
  axios
    .get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`, {
      headers: {
        Authorization: token,
      },
    })
    .then(function (response) {
      orderData = response.data.orders;
      console.log(orderData);
      renderProductsHTML();
    });
}
// [訂單列表]-- 渲染至 html
function renderProductsHTML() {
  let str = '';
  orderData.forEach(function (item) {
    // 訂單內商品字串
    let productsStr = ``;
    item.products.forEach(function (productsItem) {
      productsStr += `<p>${productsItem.title} / ${productsItem.quantity}</p>`;
    });
    // 訂單狀態判斷
    let orderStatus = item.paid ? '已處理' : '未處理';
    str += `
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      ${productsStr}
    </td>
    <td>${item.createdAt}</td>
    <td class="orderStatus">
      <a href="#">${orderStatus}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
    </td>
  </tr>
    `;
  });
  orderList.innerHTML = str;
}

// [監聽]
init();
