$(function(){

  var codestyle;
  var languages = ['cs','js'];
  (codestyle = $('.selection.codestyle')).on('change', 'input', function(){
    var now = codestyle.find('input:checked');
    var language = now.val();
    for (var i = 0, l = languages.length; i<l; ++i) {
      var lang = languages[i];
      $('[data-for="'+lang+'"]')[ lang === language ? 'show' : 'hide' ]();
    }
  });
  codestyle.find('.auto').removeClass('auto').click();

})