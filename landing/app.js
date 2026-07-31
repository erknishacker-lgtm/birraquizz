(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- FAQ accordion ----------
  document.querySelectorAll('[data-faq] .faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.faq-icon').textContent = '+';
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        item.querySelector('.faq-icon').textContent = '−';
      }
    });
  });

  // ---------- carrosséis: arrastar com mouse (touch já funciona nativo) ----------
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var isDown = false;
    var startX, scrollLeft;

    car.addEventListener('mousedown', function (e) {
      isDown = true;
      car.classList.add('is-dragging');
      startX = e.pageX - car.offsetLeft;
      scrollLeft = car.scrollLeft;
    });
    car.addEventListener('mouseleave', function () { isDown = false; car.classList.remove('is-dragging'); });
    car.addEventListener('mouseup', function () { isDown = false; car.classList.remove('is-dragging'); });
    car.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - car.offsetLeft;
      car.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  });
})();
