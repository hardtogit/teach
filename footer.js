iweb.controller('footer', function($scope) {
    $(function () {
        $('#down').popover({
            trigger:'hover',
            content:'<div><img src="./qr.png" width="77px" height="77px"/><p class="text-center">安卓下载</p><img src="./qr.png" width="77px" height="77px"/><div class="text-center">IOS下载</div></div>',
            html:true
        })
    })
})