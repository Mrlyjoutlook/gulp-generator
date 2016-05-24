/**
 * Created by MRLYJ on 2016/5/3.
 */
window.onload=function(){
    var router = new Router({
        container: '#container',
        enterTimeout: 250,
        leaveTimeout: 250
    });

    var home = {
        url: '/',
        className: 'home',
        render: function () {
            return $('#tpl_home').html();
        }
    };

    router.push(home)
        .init();
};