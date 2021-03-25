window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsParent = document.querySelector('.tabheader__items'),
          tabsContent = document.querySelectorAll('.tabcontent');

    function hiddenTabs() {
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });

        tabsContent.forEach(item => {
            item.classList.remove('show');
            item.classList.add('hide');
        });
    }

    function showFirstTab() {
        tabs[0].classList.add('tabheader__item_active');
        tabsContent[0].classList.remove('hide');
        tabsContent[0].classList.add('show');
    }

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hiddenTabs();
                    item.classList.add('tabheader__item_active');
                    tabsContent[i].classList.add('show');
                    tabsContent[i].classList.add('fade');
                }
            });
        }

    });

    hiddenTabs();
    showFirstTab();

    // Timer 

    const deadline = 'Dec 25, 2021';

    function getTime() {
        const time = Date.parse(deadline) - Date.parse(new Date()),
              days = Math.floor( time / (1000 * 60 * 60 * 24) ),
              hours = Math.floor( (time / (1000 * 60 * 60)) % 24 ),
              minutes = Math.floor ( (time / (1000 * 60)) % 60),
              seconds = Math.floor ( (time / (1000) % 60));
        return {
            'time': time,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function zero(arg) {
        if (0 <= arg && arg < 10) {
            return `0${arg}`;
        } else {
            return arg;
        }
    }

    function setTime() {
        const timer = document.querySelector('.timer'),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds');
        
        updateTime();

        function updateTime() {
            let t = getTime();

            if ( t.time <= 0) {
                days.innerHTML = '0';
                hours.innerHTML = '0';
                minutes.innerHTML = '0';
                seconds.innerHTML = '0';
                clearInterval(updateTime);
            }
            else {
                days.innerHTML = zero(t.days);
                hours.innerHTML = zero(t.hours);
                minutes.innerHTML = zero(t.minutes);
                seconds.innerHTML = zero(t.seconds);
            }
        }
        setInterval(updateTime, 1000);
    }
    setTime();

    // Modal 

    const btnOpenModal = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.remove('hide');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        window.removeEventListener('scroll', autoShowModal);
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = 'visible';
    }
    
    btnOpenModal.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal__close')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function autoShowModal() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
        }
    }

    window.addEventListener('scroll', autoShowModal);

    // Создание окон классами

    class Card {
        constructor(src, alt, title, descr, price, parent, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.convertToUAH();
            this.parent = document.querySelector(parent);
        }

        convertToUAH() {
            this.price *= 30;
        }

        render() {
            const elem = document.createElement('div');
            if (this.classes.length === 0) {
                elem.classList.add('menu__item');
            }
            else {
                this.classes.forEach(className => {
                    elem.classList.add(className);
                });
            }
            elem.innerHTML = `
                <img src=${this.src} alt=${this.src}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(elem);
        }
    }

    async function getResource(server) {
        const res = await fetch(server);
        if (!res.ok) {
            throw new Error(`Could not fetch ${server}, status: ${res.status}`);
        }
        return await res.json();
    }

    // getResource('http://localhost:3000/menu')
    // .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const card = document.createElement('div');
    //         card.classList.add('menu__item');
    //         price *= 30;

    //         card.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector('.menu .container').append(card);
    //     });
    // }

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new Card(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new Card(img, altimg, title, descr, price, '.menu .container').render();
        });
    });

    // forms

    const forms = document.querySelectorAll('form');

    forms.forEach(item => {
        bindPostForm(item);
    });

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Ваши данные отправлены!',
        fail: 'Произошла ошибка...'
    }

    async function postForm(server, data) {
        const res = await fetch(server, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    }


    function bindPostForm(form) {
        form.addEventListener('submit', (e) => {
            const spinner = document.createElement('img');
            spinner.src = message.loading;
            spinner.style.cssText = `
                display: block;
                margin: 0 auto
            `;
            form.insertAdjacentElement('afterend', spinner);
            e.preventDefault();
            const formData = new FormData(form);
            console.log(formData);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            postForm('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
            }).catch(() => {
                showThanksModal(message.fail);
            }).finally(() => {
                form.reset();
                spinner.remove();
            });
        });

        function showThanksModal(message) {
            const modalBlock = document.querySelector('.modal__dialog');
            modalBlock.classList.remove('show');
            modalBlock.classList.add('hide');
            const thanksModal = document.createElement('div');
            thanksModal.innerHTML = `
                <div class="modal__dialog">
                    <div class="modal__content">
                        <div class="modal__close">×</div>
                        <div class="modal__title">${message}</div> 
                    </div>       
                </div>
            `;
            modal.append(thanksModal);
            setTimeout(() => {
                closeModal();
                thanksModal.remove();
                modalBlock.classList.remove('hide');
                modalBlock.classList.add('show');
            }, 4000);
        }
    }

    // slider 
    
    const slider = document.querySelector('.offer__slider'),
          slides = slider.querySelectorAll('.offer__slide'),
          prev = slider.querySelector('.offer__slider-prev'),
          next = slider.querySelector('.offer__slider-next'),
          current = slider.querySelector('#current'),
          total = slider.querySelector('#total'),
          wrapper = slider.querySelector('.offer__slider-wrapper'),
          sliderString = wrapper.querySelector('.offer__slider-string'),
          width = window.getComputedStyle(wrapper).width;
    
    function addZero(data) {
        if (data < 10) {
            return data.innerHTML = `0${data}`;
        } else {
            return data;
        }
    }

    wrapper.style.overflow = 'hidden';
    sliderString.style.display = 'flex';
    sliderString.style.width = 400 + '%';
    sliderString.style.transition = '0.4s';

    let indexOfSlide = 1;

    updateCurrent();
    total.textContent = addZero(slides.length);

    function updateCurrent() {
        current.textContent = addZero(indexOfSlide);
    }

    function showNextSlide() {
        if (indexOfSlide < slides.length) {
            sliderString.style.transform = `translateX(-${indexOfSlide * +(width.slice(0, (width.length - 2)))}px)`;
            indexOfSlide += 1;
            updateCurrent();
            updateDot(indexOfSlide);
        } else {
            sliderString.style.transform = `translateX(0)`;
            indexOfSlide = 1
            updateCurrent();
            updateDot(indexOfSlide);
        }
    }

    function showPrevSlide() {
        if (indexOfSlide == 1) {
            indexOfSlide = slides.length;
            sliderString.style.transform = `translateX(-${(indexOfSlide - 1) * +(width.slice(0, (width.length - 2)))}px)`;
            updateCurrent();
            updateDot(indexOfSlide);
        } else {
            indexOfSlide -= 1;
            sliderString.style.transform = `translateX(-${(indexOfSlide - 1) * +(width.slice(0, (width.length - 2)))}px)`;
            updateCurrent();
            updateDot(indexOfSlide);
        }
    }



    next.addEventListener('click', () => {
        showNextSlide();
    });

    prev.addEventListener('click', () => {
        showPrevSlide();
    });

    // dots for slider

    slider.style.position = 'relative';
    const dotsWrapper = document.createElement('div');
    dotsWrapper.classList.add('offer__slider-dots');
    slider.append(dotsWrapper);

    function createDot() {
        const dot = document.createElement('div');
        dot.classList.add('offer__slider-dot');
        dotsWrapper.append(dot);
    }

    slides.forEach(() => {
        createDot();
    });

    const dots = document.querySelectorAll('.offer__slider-dot');

    function updateDot(i) {
        dots.forEach(item => {
            item.style.backgroundColor = '#fff';
        });
        dots[i - 1].style.backgroundColor = '#000';
    }

    updateDot(1);
    
    dotsWrapper.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.classList.contains('offer__slider-dot')) {
            dots.forEach((item, i) => {
                if (target == item) {
                    indexOfSlide = i;
                    showNextSlide();
                }
            })
        }
    });

    // calc

    const calc = document.querySelector('.calculating__field'),
          man = calc.querySelector('#man'),
          woman = calc.querySelector('#woman'),
          height = calc.querySelector('#height'),
          weight = calc.querySelector('#weight'),
          age = calc.querySelector('#age'),
          activityInputs = calc.querySelectorAll('.calculating__choose_big .calculating__choose-item'),
          result = calc.querySelector('.calculating__result span');

    let calcData = {
        sex: 'woman',
        height: '',
        weight: '',
        age: '',
        activity: '1.375',
    }

    showResult();

    function manFormula(weight, height, age, activity) {
        return (88.36 + (13.4 * +weight) + (4.8 * +height) - (5.7 * +age)) * +activity;
    }

    function womanFormula(weight, height, age, activity) {
        return (44.77 + (9.2 * +weight) + (3.1 * +height) - (4.3 * +age)) * +activity;
    }

    
    function choiceSex(exSex, item) {
        item.classList.add('calculating__choose-item_active');
        exSex.classList.remove('calculating__choose-item_active');
    }

    man.addEventListener('click', () => {
        choiceSex(woman, man);
        calcData.sex = 'man';
        showResult();
    });



    woman.addEventListener('click', () => {
        choiceSex(man, woman);
        calcData.sex = 'woman';
        showResult();
    });

    height.addEventListener('input', () => {
        calcData.height = height.value;
        showResult();
    });

    weight.addEventListener('input', () => {
        calcData.weight = weight.value;
        showResult();
    });

    age.addEventListener('input', () => {
        calcData.age = age.value;
        showResult();
    });

    console.log(activityInputs);

    calc.querySelector('.calculating__choose_big').addEventListener('click', (e) => {
        target = e.target;
        if (target && target.classList.contains('calculating__choose-item')) {
            activityInputs.forEach(item => {
                item.classList.remove('calculating__choose-item_active');
                if (target == item) {
                    item.classList.add('calculating__choose-item_active');
                    calcData.activity = item.getAttribute('data-activity');
                    showResult();
                }
            });
        }
    });

    function showResult() {
        function calcResult(data) {
            return Math.floor(data(calcData.weight, calcData.height, calcData.age, calcData.activity));
        }
        if (calcData.age != '' && calcData.height != '' && calcData != '') {
            if (calcData.sex == 'man') {
                result.textContent = calcResult(manFormula);
            } else {
                result.textContent = calcResult(womanFormula);
            }
        } else {
            result.textContent = '____';
        }
    }

});