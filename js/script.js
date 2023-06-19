//Бургер кнопка
const header_burger = document.querySelector('.header__burger');
//Скрытое меню
const hidden_menu = document.querySelector('.hidden-menu');
//Блок контактов в хедере для исчезновения при открытом меню
const header_contacts = document.querySelector('.header__contacts');

// Функция проверки активности меню на мобилке
const controlScrollHeader = () => {
  if (header_burger.classList.contains('active')) {
    header_burger.classList.remove('active');
  }
  if (hidden_menu.classList.contains('active')) {
    hidden_menu.classList.remove('active');
  }
  header_contacts.classList.add('active');
}

// Плавный скролл
document.querySelectorAll('[scroll]').forEach(link => {
  link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href').substring(1);
      if (href !== '') {
        const scrollTarget = document.getElementById(href);
        const topOffset = document.querySelector('.header').offsetHeight;
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;
        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
        controlScrollHeader();
      } else {
        window.scrollBy({
          top: -999999999,
          behavior: 'smooth'
        });
        controlScrollHeader();
      }
  });
});

//Модальные окна
document.querySelectorAll('[target]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector(btn.getAttribute('target')).classList.toggle('active');
  })
})

//Маска на телефон
const im = new Inputmask({
  mask: '+7 (999) 999-99-99',
  showMaskOnHover: false,
  showMaskOnFocus: false,
  jitMasking: true,
  inputmode: 'tel'
})
document.querySelectorAll('[masked]').forEach(input => {
  im.mask(input);
})

//Работа с формами
const forms = () => {
  // Вывод файлов в форме приглашение в тендер
  const fileInput = document.querySelector('#file');
  const fileList = document.querySelector('.file-list');
  const fileTemplate = document.querySelector('#file-template');
  const fileAddTemplate = document.querySelector('#add-file');
  const selectButton = document.querySelector('.select');
  const fileArray = [];
  const makeFile = ({ name }, key) => {
    const card = fileTemplate.content.cloneNode(true);
    card.querySelector('.del-file').addEventListener('click', () => deleteFile(key))
    card.querySelector('.textContent').innerText = name;
    return card;
  }
  const makeAddButton = () => {
    const card = fileAddTemplate.content.cloneNode(true);
    card.querySelector('svg').addEventListener('click', () => {
      fileInput.click();
    })
    return card;
  }
  const renderFileList = () => {
    if (fileArray.length !== 0) {
      selectButton.style.display = 'none';
      fileList.innerHTML = '';
      fileArray.forEach(file => {
        fileList.appendChild(makeFile(file))
      })
      fileList.appendChild(makeAddButton());
    } else {
      selectButton.style.display = 'block';
      fileList.innerHTML = '';
    }
    
  }
  const deleteFile = (index) => {
    fileArray.splice(index, 1);
    renderFileList();
  }
  fileInput.addEventListener('change', () => {
    for (const key in fileInput.files) {
      if (typeof fileInput.files[key] === 'object') {
        fileArray.push(fileInput.files[key])
      }
    }
    renderFileList();
  })

  document.querySelectorAll('form').forEach((form, index) => {
    const formBody = {
      name: '',
      phone: '',
      email: '',
      comment: '',
      checkbox: false
    }
    form.querySelectorAll('[textValue]').forEach(input => {
      input.addEventListener('input', () => {
        formBody[input.getAttribute('property')] = input.value;
      })
    })
    form.querySelectorAll('[boolValue]').forEach(input => {
      input.addEventListener('change', () => {
        formBody[input.getAttribute('property')] = input.checked;
      })
    })
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const arrOfTrue = [];
      form.querySelectorAll('.modal-dialog__form-input').forEach(elem => {
        if (elem.hasAttribute('requried')) {
          elem.querySelector('input').addEventListener('focus', () => {
            if (elem.classList.contains('error')) {
              elem.classList.remove('error');
            }
          })
          if (formBody[elem.getAttribute('property')] !== '') {
            arrOfTrue.push(1);
          } else {
            arrOfTrue.push(0);
            elem.classList.add('error');
            setTimeout(() => {
              if (elem.classList.contains('error')) {
                elem.classList.remove('error');
              }
            }, 3000)
          }
        }
      })
      const checkbox = form.querySelector('.modal-dialog__form-checkbox');
      if (checkbox.hasAttribute('requried')) {
        if (formBody[checkbox.getAttribute('property')] !== false) {
          arrOfTrue.push(1);
        } else {
          arrOfTrue.push(0)
          checkbox.classList.add('error');
          setTimeout(() => {
            if (checkbox.classList.contains('error')) {
              checkbox.classList.remove('error');
            }
          }, 3000)
        }
      }
      if (arrOfTrue.every(number => number === 1)) {
        const formData = new FormData();
        fileArray.forEach(file => {
          formData.append(`${file.name}`, file);
        })
        formData.append('body', formBody);
        fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
        .then(response => response.json())
        .then(json => {
          form.reset();
          document.querySelectorAll('.overlay')[index].classList.remove('active');
          fileArray.length = 0;
          renderFileList();
        })
      }
    })
  })
}

// Открытие мобильного меню
header_burger.addEventListener('click', () => {
  header_burger.classList.toggle('active');
  hidden_menu.classList.toggle('active');
  header_contacts.classList.toggle('active');
})

forms();