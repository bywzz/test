

var SUtil = {
    // 添加标签页
    addTab: function (opts) {
        var defaults = {close: true},
            settings = {},
            $container = $('#content');
        $.extend(settings, defaults, opts);
        if ($container.length) {
            $container.tabs("addTab", settings);
        }
    },
    // 获取当前激活的tab页，返回window对象。
    getActiveTab: function () {
        var frameId = $('#content').tabs('getCurrenTabWithIframe');
        if (frameId) {
            return document.getElementById(frameId).contentWindow;
        }
    },
    //格式化日期
    formatDate: function(time) {
        var date = new Date(time),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    },
    //查询区域重置方法
    searchReset: function() {
        $('.grid-layout input:visible').each(function () {
            if ($(this).parent().hasClass('summer-combobox')) {
                $(this).combobox('clear');
            } else if ($(this).hasClass('summer-comboboxTree')) {
                $(this).comboboxTree('clear');
            } else {
                $(this).val('');
            }
        });
    },
    //图片展示
    showImages : function (options){
        if ($("#imagesArea").length > 0){
            $("#imagesArea").empty();
        } else {
            $("body").append('<div id="imagesArea" style="display: none"></div>');
        }
        $.each(options.images,function(){
            $('<a>').attr({
                "href" : this.href,
                "data-lightbox" : this.group || "group1",
                "data-title": this.title || "默认"
            }).appendTo($("#imagesArea"));
        });
        if (options.defaultShow){
            $("#imagesArea a[data-title=" + options.defaultShow + "]").click();
        } else {
            $("#imagesArea a").first().click();
        }
    }
};

// dataTable 表格插件工具类
var tableUtil = {
    //初始化表格
    initTable: function (tableObj) {
        $(tableObj.table_id).dataTable().fnDestroy();
        $(tableObj.table_id).dataTable({
            "serverSide": true,
            "ajax": {
                url: tableObj.request_url,
                type: 'POST',
                data: tableObj.request_param,
                async: tableObj.async == false ? false : true
            },
            "columns": tableObj.columns,
            "columnDefs": tableObj.column_defs
        });
    },
    // 根据表格ID 获取选中行 的数据项, 若选中了多行,则只返回第一行的数据
    getSelectData: function(tableId) {
        var $table = $(tableId),
            dataTable = $table.DataTable(),
            $selectTr = $table.find('tbody input[type="checkbox"]:checked').closest('tr');
        return dataTable.row($selectTr.get(0)).data();
    },
    // 是否已选择 1 表格ID 2 是否多选 3 空选择时提示信息 4 多选择时提示信息
    isChoose: function (tableId, isMultiple, msg1, msg2) {
        var ids = tableUtil.getSelected($(tableId)),
            msg1Default = '未选中任何记录，请重新选择',
            msg2Default = '只能选择一条记录进行操作';
        if (ids.length < 1) {
            if (msg1) {
                msg1Default = msg1;
            }
            showInfo("info", msg1Default);
            return false;
        }
        if (!isMultiple) {
            if (ids.length > 1) {
                if (msg2) {
                    msg2Default = msg2;
                }
                showInfo("info", msg2Default);
                return false;
            }
        }
        return ids;
    },

    // 获得表格选中记录 1 表格对应jquery对象
    getSelected : function ($table) {
        var ids = [];
        $table.find('tbody input[type="checkbox"]:checked').each(function () {
            ids.push($(this).val());
        });
        return ids;
    }
};

//关闭窗口方法
function closeWin(id) {
    $(id).window('close');
}
//隐藏窗口方法
function hideWindow(id) {
    $(id).window('hide');
}

//去除开头结尾空格
function trimSpace(value) {
    if(value) {
        var reg = /(^\s+)|(\s+$)/g;
        if(reg.test(value)){
            value = $.trim(value);
        }
    }
    return value;
}

//防止在输入框内按enter键返回到主页面
document.onkeydown = check;
function check(e) {
    var ev = e || window.event,  //获取event对象
        obj = ev.target || ev.srcElement, //获取事件源
        t = obj.type || obj.getAttribute('type'), //获取事件源类型
        vReadOnly = obj.readOnly,  //只读
        vDisabled = obj.disabled;  //不可用

    //处理undefinde值
    vReadOnly = (vReadOnly == 'undefined') ? false : vReadOnly;
    vDisabled = (vDisabled == 'undefined') ? false : vDisabled;

    //当按backspace键时，事件类型为密码、单行、多行、文件类型时
    //并且readOnly为true或disabled为true时，退格失效
    var flag1 = (ev.keyCode == 8 &&(((t == "text" || t == "textarea" || t == "password") && (vReadOnly == true || vDisabled == true))  || t == "file"))
            || ((ev.ctrlKey) && ((ev.keyCode == 78) || (ev.keyCode == 82))) || // CtrlN,CtrlR
            (ev.keyCode == 116); //F5

    //当敲Backspace键时，事件源类型非密码或单行、多行文本、文件的，则退格键失效
    var flag2 = (ev.keyCode == 8 && t != "text" && t != "textarea" && t != "password" && t != "file")
    || ((ev.ctrlKey) && ((ev.keyCode == 78) || (ev.keyCode == 82))) || // CtrlN,CtrlR
    (ev.keyCode == 116);

    if (flag1 || flag2) {
        ev.returnValue = false;
        if (ev.preventDefault) {  //阻止默认行为(ie9以下不支持，要进行判断)
            ev.preventDefault();
        }
    }
}
// 提示信息
function showInfo(type, msg, owner) {
    $.sdialog({
        type: type,
        msg: msg,
        modal: true,
        owner: owner || window.top
    });
}




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