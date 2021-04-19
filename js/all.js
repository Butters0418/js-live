// [variable]
const productWrap = document.querySelector('.productWrap'); // 產品列表 ul
const productSelect = document.querySelector('.productSelect'); // 產品下拉選單
const shoppingCartBody = document.querySelector('.shoppingCart-body'); // 購物車列表
const discardAllBtn = document.querySelector('.discardAllBtn'); // 刪除所有品項
const finalTotal = document.querySelector('.finalTotal'); // 總金額

let productsData = []; // 產品列表
let cartsData = [];

// [init]
function init() {
  getProductsList();
  getCartsList();
}

// [產品列表]-- get api
function getProductsList() {
  axios
    .get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`)
    .then(function (response) {
      productsData = response.data.products;
      console.log(productsData);
      renderProductsHTML(productsData);
    });
}

// [產品列表]-- 渲染至 html
function renderProductsHTML(data) {
  let str = '';
  data.forEach(function (item) {
    str += `
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="">
      <a href="#" class="addCartBtn" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
    </li>
    `;
  });
  productWrap.innerHTML = str;
}

// [產品列表]-- 下拉選單篩選
function selectController() {
  const selectVal = this.value;
  if (selectVal === '全部') {
    renderProductsHTML(productsData);
  } else {
    let filterProductsData = productsData.filter(function (item) {
      return item.category === selectVal;
    });
    renderProductsHTML(filterProductsData);
  }
}

// [產品列表]-- 加入購物車
function addToCart(e) {
  e.preventDefault();
  if (e.target.getAttribute('class') !== 'addCartBtn') return;
  const productId = e.target.dataset.id;
  let quantity = 1;
  cartsData.carts.forEach(function (item) {
    if (item.product.id === productId) {
      quantity = item.quantity += 1;
    }
  });
  axios
    .post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`, {
      data: {
        productId: productId,
        quantity: quantity,
      },
    })
    .then(function (response) {
      alert('加入購物車成功!!');
      cartsData = response.data;
      getCartsList();
    });
}

// [購物車列表]-- api get
function getCartsList() {
  axios
    .get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
    .then(function (response) {
      cartsData = response.data;
      console.log(response.data);
      renderCartsHTML();
    });
}

// [購物車列表]-- 渲染至 html
function renderCartsHTML() {
  let str = '';
  cartsData.carts.forEach(function (item) {
    str += `
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="${item.product.images}" alt="">
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>NT$${item.product.price}</td>
      <td>${item.quantity}</td>
      <td>NT$${item.product.price * item.quantity}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${item.id}">
          clear
        </a>
      </td>
    </tr>
    `;
  });
  shoppingCartBody.innerHTML = str;
  finalTotal.textContent = `NT$${cartsData.finalTotal}`;
}

// [購物車列表]-- 刪除購物車列表(特定產品)
function cartsListDismiss(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'A') return;
  const cartId = e.target.dataset.id;
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then(function (response) {
      alert('刪除成功!!');
      getCartsList();
    });
}

// [購物車列表]-- 刪除購物車列表(所有產品)
function deleteAllCarts(e) {
  e.preventDefault();
  axios
    .delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
    .then(function (response) {
      alert('刪除所有購物車成功！');
      getCartsList();
    })
    .catch(function (response) {
      alert('購物車無商品，勿重複點擊');
    });
}

// [監聽]
productSelect.addEventListener('change', selectController); // 下拉選單篩選
shoppingCartBody.addEventListener('click', cartsListDismiss); // 刪除購物車列表
productWrap.addEventListener('click', addToCart); // 加入購物車
discardAllBtn.addEventListener('click', deleteAllCarts); // 刪除所有購物車

init();
