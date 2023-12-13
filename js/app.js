const postcardSlider = new Swiper('.postcard__slider', {
    loop: 1,
    speed: 300,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        slideChangeTransitionStart: (slider) => {
            const selectedSlideType = slider.slides[slider.activeIndex].getAttribute('data-postcard-type')
            const activeCb = document.querySelector(`.postcard-type[value=${selectedSlideType}]`);
            activeCb.checked = true;
        }
    }
})




const postcardTypes = document.querySelectorAll('.postcard-type');
postcardTypes.forEach(item => {
    item.addEventListener('input', (e) => {
        const target = e.target;
        const postcardType = target.value;
        const currentSlide = postcardSlider.slides.findIndex(item => item.getAttribute('data-postcard-type') === postcardType);
        postcardSlider.slideTo(currentSlide)
    })
})



function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const fields = document.querySelectorAll('.fields__input,.from-message');
fields.forEach(item => {
    item.addEventListener('input', (e) => {
        const target = e.target;
        if (target.closest('.fields-item').classList.contains('error')) {
            target.closest('.fields-item').classList.remove('error')
        }
    })
});


const formModal = document.querySelector('.form-modal')
const form = document.querySelector('#form');
form.addEventListener('submit', e => {
    e.preventDefault();
    if (form.classList.contains('sending')) {
        return;
    }
    const formData = new FormData(form);
    for (let [name, value] of formData) {
        if (name == 'some-input') {
            continue;
        }
        const field = document.querySelector(`[name="${name}"]`);
        if (value.trim().length < 1) {
            field.closest('.fields-item').classList.add('error');
        }
        if (field.name == 'email-from' || field.name == 'email-to') {
            if (!validateEmail(value)) {
                field.closest('.fields-item').classList.add('error');
            }
        }
    }
    const errors = document.querySelectorAll('.error');
    const errorsLength = errors.length;
    if (errorsLength > 0) {
        errors[0].scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
        form.classList.add('sending');
        fetch('/ajax/sendmail.php', {
            method: 'POST',
            body: formData
        }).then((response) => {
            if (response.ok) {
                form.reset()
                form.classList.remove('sending');
                formModal.classList.add('show');
            } else {
                throw new Error('Ошибка');
            }
        }).catch((error) => {
            console.log(error);
        });
    }
})


document.addEventListener('click', (e) => {
    const target = e.target;
    if ((target.closest('.form-modal') && !target.closest('.form-modal__content')) || target.closest('[data-modal-close]')) {
        formModal.classList.remove('show');
    }
})
