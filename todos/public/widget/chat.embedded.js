(function (window, document, callback) {
    var j, d;
    var loaded = false;
    if (!(j = window.jQuery) || callback(j, loaded)) {
        var script = document.createElement("script");
        var p = /^http:/.test(document.location) ? 'http' : 'https';
        script.type = "text/javascript";
        script.src = p + "://http://libs.baidu.com/jquery/1.11.1/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
            if (!loaded && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                callback((j = window.jQuery).noConflict(1), loaded = true);
                j(script).remove();
            }
        };
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
    }
})(window, document, function ($, jquery_loaded) {
    if (Meteor && Meteor.startup) {
        Meteor.startup(function () {
            init();
        })
    } else {
        init();
    }

    function init() {
        var width = IM_CHAT_WIDGET_EMBEDDED.width;
        var height = IM_CHAT_WIDGET_EMBEDDED.height;
        var headerOffsetLeft = 40;

        var id = "id" + Math.floor(Math.random() * 1000000000000000);

        var wrapper = $("<div id='" + id + "-wrapper'></div>");
        var fader = $("<div id='" + id + "-fader'></div>");
        var header = $("<div id='" + id + "-header'></div>");
        var iframe = $("<iframe id='" + id + "-iframe' src='" + IM_CHAT_WIDGET_EMBEDDED.url + "' width='" + width + "' height='" + height + "'></iframe>");

        wrapper.css({
            "position": "fixed",
            "z-index": 1000,
            background: "rgb(82, 110, 156)",
            "padding": 0,
            "margin": 0,
            "overflow": "hidden",
            "height": height + "px",
            "box-shadow": "rgba(0, 0, 0, 0.4) 7px 8px 10px 0px",
            "-webkit-box-shadow": "rgba(0, 0, 0, 0.4) 7px 8px 10px 0px",
            "-moz-box-shadow": "rgba(0, 0, 0, 0.4) 7px 8px 10px 0px"
        });
        if (IM_CHAT_WIDGET_EMBEDDED.position.hasOwnProperty("right")) {
            var right = IM_CHAT_WIDGET_EMBEDDED.position.right;
            delete IM_CHAT_WIDGET_EMBEDDED.position.right;
            IM_CHAT_WIDGET_EMBEDDED.position.left = ($(window).width() - width - right) + "px";
        }
        if (IM_CHAT_WIDGET_EMBEDDED.position.hasOwnProperty("bottom")) {
            var bottom = IM_CHAT_WIDGET_EMBEDDED.position.bottom;
            delete IM_CHAT_WIDGET_EMBEDDED.position.bottom;
            IM_CHAT_WIDGET_EMBEDDED.position.top = ($(window).height() - height - bottom) + "px";
        }
        wrapper.css(IM_CHAT_WIDGET_EMBEDDED.position)
        fader.css({
            "position": "absolute",
            "top": "0px",
            "bottom": "0px",
            "left": "0px",
            "right": "0px",
            "display": "none",
            "z-index": 1001,
            background: "rgba(0,0,0,0.25)"
        });
        iframe.css({
            border: "none"
        });
        header.css({
            height: "40px",
            "margin": 0,
            "padding": 0,
            position: "absolute",
            top: "0px",
            left: headerOffsetLeft + "px",
            right: "80px"
        })
        wrapper.append(header);
        wrapper.append(iframe);
        wrapper.append(fader);
        //header.append();

        $(document).find("body").append(wrapper);

        var isDragging = false;
        var offset;
        var windowWidth;
        var windowHeight;
        $(window).on("mousedown", function (e) {
            if ($(e.target).is("#" + id + "-header")) {
                e.preventDefault();
                fader.show()
                isDragging = true;
                var headerOffset = header.offset();
                headerOffset.left -= headerOffsetLeft;
                offset = {
                    x: e.pageX - headerOffset.left + window.scrollX,
                    y: e.pageY - headerOffset.top + window.scrollY
                };
                windowHeight = $(window).height();
                windowWidth = $(window).width();
            }
        });
        $(document).mousemove(function (e) {
            if (isDragging) {
                var x = (e.pageX - offset.x);
                var y = (e.pageY - offset.y);
                var _height = collapsed ? 38 : height;
                x = x + width > windowWidth ? windowWidth - width : x;
                y = y + _height > windowHeight ? windowHeight - _height : y;
                x = x < 0 ? 0 : x;
                y = y < 0 ? 0 : y;
                wrapper.css({
                    left: x + "px",
                    top: y + "px"
                })
            }
        })
        $(window).on("mouseup", function (e) {
            isDragging = false;
            fader.hide()
        });

        var collapsed = false;

        function collapse() {
            if (!collapsed) {
                var top = wrapper.offset().top - window.scrollY + height - 38;
                wrapper.css({
                    top: top + "px",
                    height: "39px"
                });
                collapsed = true;
            }
        }

        function expand() {
            if (collapsed) {
                var top = wrapper.offset().top - window.scrollY - height + 38;
                wrapper.css({
                    top: top + "px",
                    height: height + "px"
                });
                collapsed = false;
            }
        }

        window.addEventListener("message", function (e) {
            if (IM_CHAT_WIDGET_EMBEDDED.url.indexOf(e.origin) !== -1) {
                e.data === "collapse" && collapse();
                e.data === "expand" && expand();
            }
        });


    }
});