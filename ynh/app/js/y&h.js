(function($) {
    var $window = $(window),
        $hello = $('<p>hello</p>');

    function resize() {
        if ($window.width() > 600) {
            return $('.header-content').text(' crafts thoughtful, tailor-made design solutions for forward-thinking humans.');
        }
        $('.header-content').text('');
    }
    $window
        .resize(resize)
        .trigger('resize');
})(jQuery);

$('#toggle').click(function() {
   $(this).toggleClass('active');
   $('#overlay').toggleClass('open');
  });
