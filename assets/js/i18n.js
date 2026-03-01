$(document).ready(function () {
  const lang = localStorage.getItem('lang') || 'en';
  //const lang = 'en';
  loadLanguage(lang);
});

function loadLanguage(lang) {
  $.getJSON(`assets/i18n/${lang}.json`, function (data) {
    $('[data-i18n]').each(function () {
      const key = $(this).data('i18n').split('.');
      let value = data;

      key.forEach(k => value = value[k]);

      $(this).text(value);
    });

    localStorage.setItem('lang', lang);
  });
}

$('.lang-switch button').on('click', function () {
  loadLanguage($(this).data('lang'));
});