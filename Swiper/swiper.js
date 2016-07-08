/**
 * Created by shenshaohui on 2016/6/14.
 */
(function ($) {
    $.fn.swiper = function () {
        var $container = $(this), // 获得容器
            children = $container.children('.swiper-item'), // 滚动图片
            itemCount = children.length, // 实际元素数
            curIndex = 0,
            nextIndex = 1,
            preIndex = itemCount - 1,
            hasFadeIndex = itemCount - 2, // 已经消失的元素
            willShowIndex = 2, // 待展示元素
            defaultOptions = {
                speed: 5000,
                animateSpeed: 200
            },
            bePreAnimate, backPreAnimate, beNextAnimate, backNextAnimate,
            beCurAnimate, backCurAnimate, beFadeAnimate, backHideAnimate,
            beNextCss = {
                left: '30%',
                height: '80%',
                opacity: 1,
                zIndex: 10
            },
            beCurCss = {
                left: 0,
                height: '100%',
                opacity: 1,
                zIndex: 30
            },
            bePreCss = {
                left: '-30%',
                height: '80%',
                opacity: 1,
                zIndex: 10
            },
            $dots = $('<ul class="swiper-dots"></ul>'),
            $dot, intervalId, swiperGoNext, swiperGoPrev, setAnimate, setCss, setActiveDot;

        bePreAnimate = backPreAnimate = {
            left: '-30%',
            height: '80%',
            opacity: 1,
            zIndex: 10
        };
        beNextAnimate = backNextAnimate = {
            left: '30%',
            height: '80%',
            opacity: 1,
            zIndex: 10
        };
        beCurAnimate = backCurAnimate = {
            left: '0',
            right: 0,
            height: '100%',
            opacity: 1
        };
        beFadeAnimate = backHideAnimate = {
            left: '0',
            right: 0,
            height: '100%',
            opacity: 0,
            zIndex: 1
        };

        if (itemCount == 0) {
            // no children
            throw new Error('no swiper-item, please check it');
        }

        for (var i = 0, len = itemCount; i < len; i++) {
            $(children[i]).attr('data-swiper-index', i);

            // 创建进度条
            if (i == 0) {
                $dots.append($('<li class="active" data-index="' + i + '"></li>'));
            } else {
                $dots.append($('<li data-index="' + i + '"></li>'));
            }
        }
        $container.append($dots);
        $dot = $dots.children('li');

        // 添加左右可点击按钮
        $container.append($('<div class="swiper-btn goPrev-btn"></div>'));
        $container.append($('<div class="swiper-btn goNext-btn"></div>'));

        $('.goPrev-btn').on('click', function () {
            clearInterval(intervalId);
            intervalId = setInterval(swiperGoNext, defaultOptions.speed);
            swiperGoPrev();
        });

        $('.goNext-btn').on('click', function () {
            clearInterval(intervalId);
            intervalId = setInterval(swiperGoNext, defaultOptions.speed);
            swiperGoNext();
        });

        setAnimate = function ($dom, type) {
            switch (type) {
                case 'bePre':
                    $dom.animate(bePreAnimate, defaultOptions.animateSpeed, function () {
                        $dom.removeClass('swiper-curItem')
                            .addClass('swiper-preItem');
                    });
                    break;
                case 'beCur':
                    $dom
                        .css({
                            'z-index': 50
                        })
                        .removeClass('swiper-nextItem')
                        .animate(beCurAnimate, defaultOptions.animateSpeed, function () {
                            $dom
                                .css({'z-index': 30})
                                .addClass('swiper-curItem');
                        });
                    break;
                case 'beNext':
                    $dom.animate(beNextAnimate, defaultOptions.animateSpeed, function () {
                        $dom
                            .addClass('swiper-nextItem');
                    });
                    break;
                case 'fade':
                    $dom.animate(beFadeAnimate, defaultOptions.animateSpeed, function () {
                        $dom.removeClass('swiper-preItem');
                    });
                    break;
                case 'backPre':
                    $dom.animate(backPreAnimate, defaultOptions.animateSpeed, function () {
                        $dom.addClass('swiper-preItem');
                    });
                    break;
                case 'backCur':
                    $dom
                        .css({
                            'z-index': 50
                        })
                        .removeClass('swiper-preItem')
                        .animate(backCurAnimate, defaultOptions.animateSpeed, function () {
                            $dom
                                .css({'z-index': 30})
                                .addClass('swiper-curItem');
                        });
                    break;
                case 'backNext':
                    $dom.animate(backNextAnimate, defaultOptions.animateSpeed, function () {
                        $dom
                            .removeClass('swiper-curItem')
                            .addClass('swiper-nextItem');
                    });
                    break;
                case 'backHide':
                    $dom.animate(backHideAnimate, defaultOptions.animateSpeed, function () {
                        $dom.removeClass('swiper-nextItem');
                    });
                    break;
                default:
                    break;
            }
        };

        setCss = function ($dom, type) {
            switch (type) {
                case 'pre':
                    $dom.css(bePreCss);
                    break;
                case 'cur':
                    $dom.css(beCurCss);
                    break;
                case 'next':
                    $dom.css(beNextCss);
                    break;
                default:
                    break;
            }
        };

        setActiveDot = function (index) {
            $dot.removeClass('active');
            $dot.filter('[data-index="' + index + '"]').addClass('active');
        };

        // 初始化位置类
        setCss($($container.children()[preIndex]).addClass('swiper-preItem'), 'pre');
        setCss($($container.children()[curIndex]).addClass('swiper-curItem'), 'cur');
        setCss($($container.children()[nextIndex]).addClass('swiper-nextItem'), 'next');

        // 动画函数
        swiperGoNext = function () {
            setAnimate($('.swiper-item[data-swiper-index=' + preIndex + ']'), 'fade');
            setAnimate($('.swiper-item[data-swiper-index=' + curIndex + ']'), 'bePre');
            setAnimate($('.swiper-item[data-swiper-index=' + nextIndex + ']'), 'beCur');
            setAnimate($('.swiper-item[data-swiper-index=' + willShowIndex + ']'), 'beNext');

            hasFadeIndex = preIndex;
            preIndex = curIndex;
            nextIndex = (curIndex + 2) % itemCount;
            willShowIndex = (curIndex + 3) % itemCount;
            curIndex = (curIndex + 1) % itemCount;

            console.log('go next', hasFadeIndex, preIndex, curIndex, nextIndex, willShowIndex);

            setActiveDot(curIndex);
        };

        swiperGoPrev = function () {
            setAnimate($('.swiper-item[data-swiper-index=' + hasFadeIndex + ']'), 'backPre');
            setAnimate($('.swiper-item[data-swiper-index=' + preIndex + ']'), 'backCur');
            setAnimate($('.swiper-item[data-swiper-index=' + curIndex + ']'), 'backNext');
            setAnimate($('.swiper-item[data-swiper-index=' + nextIndex + ']'), 'backHide');

            curIndex = (preIndex) % itemCount;
            hasFadeIndex = curIndex - 2 < 0 ? curIndex - 2 + itemCount : curIndex - 2;
            preIndex = curIndex - 1 < 0 ? curIndex - 1 + itemCount : curIndex - 1;
            nextIndex = (curIndex + 1) % itemCount;
            willShowIndex = (curIndex + 2) % itemCount;

            console.log('go prev', hasFadeIndex, preIndex, curIndex, nextIndex, willShowIndex);

            setActiveDot(curIndex);
        };

        // 定时器
        intervalId = setInterval(swiperGoNext, defaultOptions.speed);
    };
})(jQuery);