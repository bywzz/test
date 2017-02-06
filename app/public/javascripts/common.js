

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



