document.addEventListener('DOMContentLoaded', function() {
  const booksTable = document.getElementById('books-table');
  const booksList = document.getElementById('books-list');
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');

  const hourglasses = ['⏳', '⌛', '⏳', '⌛'];

  // 渲染图书数据到表格
  function renderBooks(books) {
    booksList.innerHTML = '';
    books.forEach(book => {
      const row = document.createElement('tr');
      const createDate = book.create_time ? new Date(book.create_time).toLocaleString() : '未知'; //+8小时
      row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.book_id}</td>
        <td>${book.name}</td>
        <td>¥${book.price.toFixed(2)}</td>
        <td>${createDate}</td>
      `;
      booksList.appendChild(row);
    });
    booksTable.style.display = 'table';
  }

  // 显示加载提示
  function showLoading(text) {
    loadingElement.textContent = text;
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    booksTable.style.display = 'none';
  }

  // 显示错误提示
  function showError(text) {
    loadingElement.style.display = 'none';
    errorElement.textContent = text;
    errorElement.style.display = 'block';
    booksTable.style.display = 'none';
  }

  // 获取图书数据，支持重试
  function fetchBooks(retryCount = 0) {
    fetch('http://localhost/api/books')
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            if (err && err.error === '数据库未连接') {
              throw new Error('数据库未连接');
            }
            throw new Error('网络响应异常');
          }).catch(() => {
            throw new Error('网络响应异常');
          });
        }
        return response.json();
      })
      .then(books => {
        loadingElement.style.display = 'none';
        if (books.length === 0) {
          showError('没有找到图书数据');
          return;
        }
        renderBooks(books);
      })
      .catch(error => {
        const hourglass = hourglasses[retryCount % hourglasses.length];
        if (error.message === '数据库未连接') {
          showLoading(`数据库连接中... ${hourglass}`);
          setTimeout(() => {
            fetchBooks(retryCount + 1);
          }, 2000);
        } else if (error.message === '网络响应异常') {
          showLoading(`网络响应异常，正在重试... ${hourglass}`);
          setTimeout(() => {
            fetchBooks(retryCount + 1);
          }, 2000);
        } else {
          showError(error.message);
        }
      });
  }

  // 初始加载
  fetchBooks();
});