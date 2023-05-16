$(document).ready(function () {
  // navbar
  $('.navbar-toggler').click(function () {
    $('.navbar-collapse').toggleClass('show');
  });

  // dropdown
  $('.dropdown').click(function () {
    $(this).find('.dropdown-menu').toggleClass('show');
  });

  // filter-btns
  $('.filter-btns .btn').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('active').siblings().removeClass('active');
  });

  // pagination
  $('.pagination .page-item').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('active').siblings().removeClass('active');
  });

  // scroll to top
  $('#btn-top').click(function () {
    $('html').animate({ scrollTop: 0 }, 1000);
  });

  // 常見問題展開
  $('.qa-card').click(function (e) {
    e.preventDefault();
    $(this).find('.add-icon').toggleClass('d-none');
    $(this).find('.remove-icon').toggleClass('d-inline-block');
    $(this).find('.collapse').toggleClass('show');


  });
});

//  Initialize Swiper
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    920: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  },
});





// 資料串接
const apiPath = 'https://2023-engineer-camp.zeabur.app';
const list = document.querySelector('#list');
const pagination = document.querySelector('#pagination');

const data = {
  type: '',
  sort: 0,
  page: 1,
  search: '',
}

let worksData = []
let pagesData = {}

function getData({ type, sort, page, search }) {
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${type ? `type=${type}&` : ''}${search ? `search=${search}` : ''}`
  axios.get(apiUrl)
    .then((res) => {
      worksData = res.data.ai_works.data;
      pagesData = res.data.ai_works.page;

      renderWorks();
      renderPages();
    })
}

getData(data);

// 作品選染至畫面
function renderWorks() {
  let works = '';

  worksData.forEach((item) => {
    works += /*html*/`<li class="col-4 h-100">
      <div class="card">
        <div class="card-layer">
          <img class="card-img" src="${item.imageUrl}" alt="ai image">
        </div>
        <div class="card-body">
          <h4 class="card-title">${item.title}</h4>
          <p class="card-text">${item.description}</p>
        </div>
        <div class="card-body">
          <p class="card-subtitle">AI 模型</p>
          <p class="card-text">${item.model}</p>
        </div>
        <div class="card-body">
          <span class="card-text">#${item.type}</span>
          <a class="card-link" href="${item.link}" target="_blank">
            <span class="material-icons">
              share
            </span>
          </a>
        </div>
      </div>
    </li>`
  });

  list.innerHTML= works;
}

// 切換分頁
function changePage(pagesData) {
  const pageLinks = document.querySelectorAll('a.page-link')
  let pageId = '';

  pageLinks.forEach((item) => {

    item.addEventListener('click', (e) => {
      e.preventDefault();
      pageId = e.target.dataset.page;
      data.page = Number(pageId);

      if(!pageId) {
        data.page =  Number(pagesData.current_page) + 1
      }
       
      getData(data);
    });
  });
}

// 分頁選染至畫面
function renderPages() {
  let pageStr = '';

  for (let i = 1; i <= pagesData.total_pages; i += 1) {
    pageStr += /*html*/`<li class="page-item ${pagesData.current_page == i ? 'active' : ''}" >
      <a class="page-link ${pagesData.current_page == i ? 'disabled' : ''}" href="#"  data-page="${i}">${i}</a>
    </li>`
  };

  if (pagesData.has_next) {
    pageStr +=  /*html*/`<li class="page-item">
      <a class="page-link" href="#">
        <span class="material-icons">
          chevron_right
        </span>
      </a>
    </li>`
  };
  pagination.innerHTML = pageStr

  changePage(pagesData);
}
// 切換作品排序
const desc = document.querySelector('#desc');
const asc = document.querySelector('#asc');
const btnSort = document.querySelector('#btn-sort');
//  由新到舊 -> sort = 0
desc.addEventListener('click', (e) => {
  e.preventDefault();
  data.sort = 0;
  getData(data);
  btnSort.innerHTML = '由新到舊<span class="material-icons pl-12">expand_more</span>';
})
//  由舊到新 -> sort = 1
asc.addEventListener('click', (e) => {
  e.preventDefault();
  data.sort = 1
  getData(data);
  btnSort.innerHTML = '由舊到新<span class="material-icons pl-12">expand_more</span>';
})




// 切換作品類型
const filterBtns = document.querySelectorAll('#filter-btn')
filterBtns.forEach((item) => {
  item.addEventListener('click', () => {
    data.type = item.textContent;
    getData(data)
  })
})

// 搜尋
const search = document.querySelector('#search');
search.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    data.search = search.value
    data.page = 1
    getData(data);
  }
})
