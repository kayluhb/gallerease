(function($) {

    var Gallery = function(el, opts) {
        //Defaults are below
        var settings = $.extend({}, $.fn.gallery.defaults, opts);
        var $el = $(el), $img, $nav, $a, $ul, $li, $cap, cur = 0, total = 0, post = '/galleries/details/', dir = '/uploads/images/body-large/', i, obj, interval;

        // private methods
        function init(r) {
            total = r.media.length;
            $el.html('');
            $nav = $('<nav/>');
            $ul = $('<ul/>');
            for (i = 0; i < total; ++i) {
                obj = r.media[i];
                $img = $('<img/>');
                $img.attr('src', dir + obj.f).attr('alt', obj.a);
                $el.append($img);
                $img.click(onImgClick).hide();

                $li = $('<li/>');
                $a = $('<a/>');
                if(obj.a != null)
					$a.text(obj.a).attr('href', '#').attr('rel', i).attr('title', obj.a).click(onById);
                $li.append($a);
                $ul.append($li);
            }
            $nav.append($ul);
            $cap = $('<span/>').addClass('caption');
            $nav.append($cap);
            $el.append($nav);
            $img = $el.find('img:first');
            if (total > 1) { interval = setInterval(onNext, 5000); }
            showSlide();
        }
        function onById(e) {
            clearInterval(interval);
            e.preventDefault();
            cur = Number(e.currentTarget.rel);
            showSlide();
        }
        function onImgClick(e) {
            clearInterval(interval);
            onNext();
        }
        function onNext(e) {
            cur++;
            showSlide();
        }
        function showSlide() {
            if (cur < 0) { cur = total - 1; }
            else if (cur > total - 1) { cur = 0; }
            $img.stop().fadeOut();
            $img = $el.find('img:nth-child(' + (cur + 1) + ')');
            if ($img.width() > 0) {
                $img.css({ left: $el.width() * .5 - $img.width() * .5 });
            } else {
                setTimeout(showSlide, 1000);
                return;
            }
            $img.stop().fadeTo('normal', 1);

            $a.removeClass('on');
            $a = $nav.find('ul li:nth-child(' + (cur + 1) + ') a')
            $a.addClass('on');

            $cap.text($a.attr('title'));

        }
        // public methods

        $.ajax({ url: post + el.id, success: init });
    };

    $.fn.gallery = function(options) {
        return this.each(function(idx, el) {
            var $el = $(this), key = 'gallery';
            // Return early if this element already has a plugin instance
            if ($el.data(key)) { return; }
            // Pass options to plugin constructor
            var gallery = new Gallery(this, options);
            // Store plugin object in this element's data
            $el.data(key, gallery);
        });
    };

    //Default settings
    $.fn.gallery.defaults = {};
})(jQuery);
