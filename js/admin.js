(function () {
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
  const delAllOrderBtn = document.querySelector('.discardAllBtn');
  let orderData = [];

  // [init]
  function init() {
    getOrderList();
    renderC3();
  }
  init();

  // [c3]
  function renderC3() {}

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
    if (orderData.length == 0) {
      str += `
    <tr>
      <td colspan="8">目前無訂單</td>
    </tr>
    `;
    } else {
      orderData.forEach(function (item) {
        // 訂單內商品字串
        let productsStr = ``;
        let day = dayjs(item.createdAt * 1000).format('YYYY/MM/DD');
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
      <td>${day}</td>
      <td class="orderStatus">
        <a href="#" data-status="${item.paid}" data-id="${item.id}">${orderStatus}</a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
      </td>
    </tr>
      `;
      });
    }

    orderList.innerHTML = str;
  }

  // [訂單列表]-- 修改訂單狀態
  function statusController(status, id) {
    let newStatus;
    if (status == 'true') {
      newStatus = false;
    } else {
      newStatus = true;
    }
    axios
      .put(
        `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`,
        {
          data: {
            id: id,
            paid: newStatus,
          },
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(function (response) {
        alert('修改訂單成功!');
        getOrderList();
      });
  }

  // [訂單列表]-- 刪除單一訂單
  function deleteOrder(id) {
    axios
      .delete(
        `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(function (response) {
        alert('刪除訂單成功!');
        getOrderList();
      });
  }

  // [訂單列表]-- 刪除所有訂單
  function delAllOrder() {
    console.log(orderData.length);
    if (orderData.length == 0) {
      alert('目前無訂單!');
      return;
    }
    axios
      .delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
          Authorization: token,
        },
      })
      .then(function (response) {
        alert('訂單刪除成功!');
        getOrderList();
      });
  }

  // [監聽]
  delAllOrderBtn.addEventListener('click', delAllOrder);
  orderList.addEventListener('click', function (e) {
    e.preventDefault();
    const id = e.target.dataset.id;
    if (e.target.getAttribute('data-status') !== null) {
      let status = e.target.dataset.status;
      statusController(status, id);
      return;
    }
    if (e.target.getAttribute('class') == 'delSingleOrder-Btn') {
      deleteOrder(id);
      return;
    }
  });
})();
