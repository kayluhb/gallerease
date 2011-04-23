(function($) {
    var Gallery = function(el, opts) {
        //Defaults are below
        var settings = $.extend({}, $.fn.gallery.defaults, opts);
        var $el = $(el), $as, $view, $wrap, $nav, $li, $ul, $img, $a, $cap,
		cur = 0, tot = 0, tar = 88, POLL = 3000, i, interval, over = 0.6,
		next = '<a href="#" class="next" title="next">next</a>',
		prev = '<a href="#" class="prev" title="previous">prev</a>';
        // private methods
        function init() {
			$as = $el.find('a');
			tot = $as.length;
			$as.detach();
			$view = $('<div class="view" />');
			$wrap = $('<div class="nav-wrap" />');
			$nav = $('<div class="nav" />');
			$ul = $('<ul/>');
			var src;
            for (i = 0; i < tot; ++i) {
                $a = $($as[i]);
				src = $a.attr('href');
				$img = $('<img/>').attr('src', src);
                $view.append($img);
                $img.click(onNextClick).hide();
                $li = $('<li/>');
                $a.attr('rel', i).click(onById).css({ opacity:over });
                $li.append($a);
                $ul.append($li);
            }
			$ul.width(tar * tot);
            $cap = $('<span class="caption" />');
			$view.append($cap);
			$nav.append($ul);
			$wrap.append($nav);
			
			$a = $(next);
			$view.append($a);
			$a.click(onNextClick).mouseenter(onOver).mouseout(onOut).mouseout();
			$a = $(prev);
			$a.click(onPrev).mouseenter(onOver).mouseout(onOut).mouseout();
			$view.append($a);
			
			$a = $(next);
			$a.click(onNextClick);
			$wrap.append($a);
			$a = $(prev);
			$a.click(onPrev);
			$wrap.append($a);
			$a = null;
			
			$el.append($view);
			$el.append($wrap);
            $img = $el.find('img:first');
			$(document).keydown(function(e){
				if (e.keyCode == 37) { onPrev(); return false; }
				if (e.keyCode == 39) { onNextClick(); return false; }
			});
            if (tot > 1) { interval = setInterval(onNext, POLL); }
            showSlide();
        }
        function onById(e) {
            clearInterval(interval);
            e.preventDefault();
            cur = Number(e.currentTarget.rel);
            showSlide();
        }
		function onOver(e) {
			$(e.currentTarget).css({ opacity:1 });
		}
		function onOut(e) {
			$(e.currentTarget).css({ opacity:over });
		}
        function onNext(e) {
			cur++;
            showSlide();
        }
		function onNextClick(e) {
			if (e !== undefined) { e.preventDefault(); }
			clearInterval(interval);
			onNext();
		}
		function onPrev(e) {
			if (e !== undefined) { e.preventDefault(); }
			cur--;
            showSlide();
		}
        function showSlide() {
            if (cur < 0) { cur = tot - 1; }
            else if (cur > tot - 1) { cur = 0; }
            $img.stop().fadeOut();
            $img = $view.find('img:nth-child(' + (cur + 1) + ')');
            if ($img.width() > 0) {
                $img.css({ left: $view.width() * 0.5 - $img.width() * 0.5 });
            } else {
                setTimeout(showSlide, 1000);
                return;
            }
			$ul.stop().animate({ left:Math.max(-tar * cur, -tot * tar + $wrap.width() + 10) });
			$img.stop().fadeTo('normal', 1);
			if ($a !== null) { $a.stop().fadeTo('fast', over); }
            $a = $nav.find('ul li:nth-child(' + (cur + 1) + ') a');
            $a.stop().fadeTo('fast', 1);
			$cap.children().remove();
            $cap.html('<span class="title">' + $a.find('img').attr('title') + '</span><br/>' + $a.find('img').attr('alt') + '<span class="count">' + (cur + 1) + '/' + tot + '</span>');
        }
        // public methods
        init();
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
    // default settings
    $.fn.gallery.defaults = {};
})(jQuery);
