/*!
 * Summer window 1.0
 *
 * Copyright 2014 ITIC
 *
 * Author:
 *  liangshanshan
 */
$(function() {

    //导航特效开始
    var $nav = $('.nav-front'),
        $icon = $('.nav-front-icon'),
        $arrow = $('.nav-arrow'),
        $menu = $('.nav-behind'),
        $menutitle = $('.nav-behind>a'),
        $menutext = $('.behind-text'),
        $submenu = $('.behind-text li'),
        $marks = $('.nav-behind').find('.right i'),
        $firstmark = $('.nav-behind').find('i[data-firstmark]'),
        $linkIcon = $('.nav-front-linkicon');

    //hover效果

    $('.nav-front-linkicon').hover(function(){
        var loaction = $('.nav-front ul').offset().left;
        if(loaction < 0) {
            $(this).addClass('nav-front-linkicon-selfhover');
        }
    },function(){
        $(this).removeClass('nav-front-linkicon-selfhover');
    });


    $('.nav-front ul li a.link').hover(function(){
        var $this = $(this),
            url = $this.attr('data-url'),
            actionIcon = $('.nav-front-linkicon[data-url = '+ url +']');
        actionIcon.addClass('nav-front-linkicon-otherhover');
    },function(){
        $('.nav-front-linkicon').removeClass('nav-front-linkicon-otherhover');
    });


    //点击二级菜单特效
    $('.nav-front ul li a.link').on('click', function () {
        var $this = $(this),
            url = $this.attr('data-url'),
            homeword = $this.text(),
            actionIcon = $('.nav-front-linkicon[data-url = '+ url +']');
        if (url) {
            var $url = $('#' + url),
                $text = $url.find('.behind-text').first(),
                $links = $url.find('>a');

            actionIcon.addClass('nav-front-linkicon-click');
            $url.find('.behind-home-word').text(homeword);
            $url.show();
            navHide();
        }

        function navHide() {
            $nav.velocity({'marginLeft': '-225px'}, 300, iconShow);
        }
        function iconShow() {
            $arrow.velocity({'marginLeft': '225px'}, 200);
            $icon.velocity({'marginLeft': '225px'}, 200, menuShow);
        }
        function menuShow() {
            $links.each(function (order, ele) {
                if (order === $links.length - 1) {
                    $(ele)
                        .delay(order * 100)
                        .velocity({'left': '0px'}, 250, submenuShow);
                } else {
                    $(ele)
                        .delay(order * 100)
                        .velocity({'left': '0px'}, 250);
                }
            });
        }
        function submenuShow() {
            $text.delay(200).slideDown(300);
        }
    });

    //点击arrow特效
    $('.nav-arrow').on('click', function () {

        $icon.velocity({'marginLeft': '0px'}, 200, navShow);
        $arrow.velocity({'marginLeft': '0px'}, 200);
        behindrenew();

        function navShow() {
            $nav.velocity({'marginLeft': '0px'}, 300);
        }
    });

    //点击icons特效
    $('.nav-front-linkicon').on('click', function() {
        var loaction = $('.nav-front ul').offset().left;
        if(loaction < 0) {
            var $this = $(this),
                url = $this.attr('data-url'),
                homeword = $this.attr('title');
            if (url) {
                var $url = $('#' + url),
                    $text = $url.find('.behind-text').first(),
                    $links = $url.find('>a');

                $url.find('.behind-home-word').text(homeword);
                behindrenew();
                $url.show();
                menuShow();
                $('.nav-front-linkicon').removeClass('nav-front-linkicon-click');
                $this.addClass('nav-front-linkicon-click');
            }
        }

        function menuShow() {
            $links.each(function (order, ele) {
                if (order === $links.length - 1) {
                    $(ele)
                        .delay(order * 100)
                        .velocity({'left': '0px'}, 250, submenuShow);
                } else {
                    $(ele)
                        .delay(order * 100)
                        .velocity({'left': '0px'}, 250);
                }
            });
        }
        function submenuShow() {
            $text.delay(200).slideDown(300);
        }
    });

    //nav-behind、marks、submenu、menutitle回到最初状态的特效
    function behindrenew() {
        $linkIcon.removeClass('nav-front-linkicon-click');
        $submenu.removeClass('submenu-selected');
        $marks.removeClass('fa-minus');
        $marks.addClass('fa-plus');
        $firstmark.removeClass('fa-plus');
        $firstmark.addClass('fa-minus');
        $menutext.slideUp(1);
        $menutitle
            .velocity({'left': '170px'},1);
        $menu.hide();
    }

    //点击三级菜单效果
    $('.behind-title').click(function () {
        var $textobj = $(this).next('.behind-text'),
            $othermarks = $(this).parent('.nav-behind').find('.right i'),
            $mark = $(this).find('.right i');

        if ($textobj.css('display') == 'none') {
            $textobj.slideDown(300);
            $textobj.siblings('.behind-text').each(function () {
                var $this = $(this);
                $this.slideUp(300);
            });
            $othermarks.removeClass('fa-minus');
            $othermarks.addClass('fa-plus');
            $mark.removeClass('fa-plus');
            $mark.addClass('fa-minus');
        } else{
            $textobj. slideUp(200);
            $mark.removeClass('fa-minus');
            $mark.addClass('fa-plus');
        }

    });

    //点击最底层菜单项效果
    $('.behind-text').on('click', 'li a', function (e) {
        var $this = $(this),
            href = $this.attr('href');
        $('.behind-text li a').removeClass('submenu-selected');
        $this.addClass('submenu-selected');

        if (href) {
            e.preventDefault();
            $('#content').tabs("addTab", {
                close: true,
                title: $this.text(),
                url: href
            });
        }
    });

    $('#content').tabs({
        width: '100%',
        height:  '100%'
    }).tabs('addTab', {
        url: 'page/main.html',
        title: '首页',
        close: false
    });


    //修改密码操作
    $('#modifyPwd').on('click', function () {
        $('#modifyPwdWindow').window({
            title: '修改密码',
            width: 520,
            height: 330,
            iframe: {
                url: 'page/sys/modifyPwd.html'
            }
        });
    })

    //退出系统
    $('#logout').click(function(){
        $.sdialog({
            type: 'confirm',
            msg: '您确定要退出系统吗？',
            confirm: function(result) {
                if (result) {
                    location.href = 'page/login.html';
                }
            }
        });
    });

});