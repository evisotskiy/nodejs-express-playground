/* global M */

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency',
  }).format(price);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
};

document.querySelectorAll('.price').forEach((node) => (node.textContent = formatPrice(node.textContent)));
document.querySelectorAll('.date').forEach((node) => (node.textContent = formatDate(node.textContent)));
M.Tabs.init(document.querySelectorAll('.tabs'));

const $cart = document.querySelector('#cart');
if ($cart) {
  $cart.addEventListener('click', (e) => {
    if (e.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;

      fetch('/cart/remove/' + id, {
        method: 'delete',
        headers: {
          'X-XSRF-TOKEN': csrf,
        },
      })
        .then((res) => res.json())
        .then((cart) => {
          if (cart.courses.length) {
            const html = cart.courses
              .map(({ title, count, id }) => {
                return `
                                <tr>
                                    <td>${title}</td>
                                    <td>${count}</td>
                                    <td>
                                        <button class="btn btn-small js-remove" data-id="${id}">Delete</button>
                                    </td>
                                </tr>
                            `;
              })
              .join('');
            $cart.querySelector('tbody').innerHTML = html;
            $cart.querySelector('.price').textContent = formatPrice(cart.price);
          } else {
            $cart.innerHTML = '<p>Cart is empty</p>';
          }
        });
    }
  });
}
