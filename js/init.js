
(function ($) {
    var initMobileNav = function() {
        $('.button-collapse').sideNav();
        $('.carousel').carousel();
        $('#nav-mobile a').click(function () {
            $("#sidenav-overlay").click();
        });
    };

    var initFancyBox = function() {
        $('[data-fancybox="gallery"]').fancybox({
            caption : function( instance, item ) {
                return $(this).next('figcaption').html();
            }
        });
    }

    var initVersioning = function() {
        var currentPageVersion;
        $.get('/version', function(data) {
            currentPageVersion = data;
            setInterval(function () {
                $.get('/version', function(data) {
                    if (data != currentPageVersion) {
                        currentPageVersion = data;
                        if (confirm('Nová verze návodu k dispozici, aktualizovat?')) {
                            location.reload(true);
                        }
                    }
                });
            }, 3 * 60 * 1000);
        });
    }

    var initSteps = function() {
        var globalCounter = 0;

        var savedLastStep = null;
        if(window.localStorage && window.location.hash === "") {
            savedLastStep = window.localStorage.getItem("lastStep")
        }

        document.querySelectorAll("p.step, .con-guide hr").forEach(function(el) {
            if(el.tagName == "HR") {
                ++globalCounter;
                return;
            }

            var globalStep = "";
            if(globalCounter > 26) {
                globalStep = String.fromCharCode(64 + globalCounter/26, 65 + globalCounter%26);
            } else {
                globalStep = String.fromCharCode(64 + globalCounter);
            }

            var step = globalStep + "-" + el.textContent;
            var id = "step-" + step;
            el.innerHTML = "Krok " + step;
            el.parentElement.parentElement.id = id;

            if(savedLastStep === id) {
                window.location.hash = id;
            }
        });
    };

    var initLinenos = function() {
        document.querySelectorAll("[data-linenos-offset]").forEach(function(el) {
            var offset = parseInt(el.dataset.linenosOffset, 10);
            var pre = el.querySelector("pre.lineno")
            var lines = pre.textContent.split("\n").length - 1
            var newtext = ""
            for(var i = offset; i < offset+lines; ++i) {
                newtext += i + "\n"
            }
            pre.textContent = newtext;
        })
    }

    var initSpoilers = function() {
        var blur = "blur(8px)"
        document.querySelectorAll(".spoiler .highlight").forEach(function(el) {
            var pre = el.querySelector("pre.highlight")
            if(!pre) return

            pre.style.filter = blur

            var div = document.createElement("div")
            div.style.padding = "8px"

            var show = document.createElement("a");
            show.classList.add("btn-small")
            show.addEventListener("click", function(ev) {
                ev.preventDefault()
                if(pre.style.filter.indexOf("blur") !== -1) {
                    pre.style.filter = ""
                } else {
                    pre.style.filter = blur
                }
            })
            show.textContent = "Ukázat řešení"

            div.appendChild(show);
            el.insertBefore(div, el.childNodes[0]);
        });
    }

    $(function () {
        initMobileNav();
        initFancyBox();

        if(window.location.pathname !== "/")
            initVersioning();

        if(window.location.pathname.indexOf("/guide/") !== -1) {
            initSteps();
            document.addEventListener("scroll", onDocumentScroll);
        }

        initLinenos();
        initSpoilers();

    });
})(jQuery);

function onJumpToStepClick() {
    var res = window.prompt("Zadejte číslo kroku (příklad: A-1, K-12, s1, ...)")
    if(res === null) {
        return
    }

    var m = /([a-zA-Z]+)[\s-]*([0-9]+)/.exec(res)
    if(m == null) {
        return;
    }

    var id = "step-" + m[1].toUpperCase() + "-" + m[2];
    if(document.getElementById(id)) {
        window.location.hash = id;
    }
}

var scrollReactionTimeout = null;

function onDocumentScroll() {
    if(scrollReactionTimeout !== null) {
        clearTimeout(scrollReactionTimeout);
    }
    scrollReactionTimeout = setTimeout(onScrollFinished, 300);
}

var defaultDuration = 500
var edgeOffset = 30
var sidenav = document.getElementById("sidenav")
var guideScroller = zenscroll.createScroller(sidenav, defaultDuration, edgeOffset)

function onScrollFinished() {
    var list = document.querySelectorAll("figure[id^=\"step-\"]");
    var len = list.length;
    for(var i = 0; i < len; ++i) {
        var el = list[i];
        var bounding = el.getBoundingClientRect();
        if(bounding.top >= -32) {
            history.replaceState(null, null, '#' + el.id);
            if(window.localStorage) {
                window.localStorage.setItem("lastStep", el.id)
            }
            break;
        }
    }

    var list = document.querySelectorAll("h3,h4");
    var len = list.length;
    var minElement = list[0];
    var minPos = minElement.getBoundingClientRect().top;
    for(var i = 1; i < len; ++i) {
        var el = list[i];
        var bounding = el.getBoundingClientRect();
        if (bounding.top > minPos && bounding.top <= 10) {
            minElement = el;
            minPos = bounding.top;
        }
    }
    var allLinks = document.querySelectorAll(".sidenav a");
    var targetHref = encodeURIComponent(minElement.id.toLowerCase());
    for ( var i = 0; i != allLinks.length; i++ ) {
        allLinks[i].classList.remove("sidenavHighglight");
        if (allLinks[i].href.toLowerCase().endsWith("#" + targetHref.toLowerCase())) {
            allLinks[i].classList.add("sidenavHighglight");
            guideScroller.center(allLinks[i]);
        }
    }

}

onScrollFinished();
