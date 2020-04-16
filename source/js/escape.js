/**
 * Hexo-theme-escape
 * @author Andy Lee
 * @date 2020-3-10
 */

$(function() {
    // Go up button
    $("#go-up").hide();
    let height = $(window).height();
    $(window).scroll(function() {
        if ($(window).scrollTop() > height) {
            $("#go-up").fadeIn();
        } else { 
            $("#go-up").fadeOut();
        }
    });
    $("#go-up").click(function() {
        $("html, body").animate({scrollTop: 0}, 800);
        return false;
    });

    // TOC
    let tocTop = $("#article-toc").offset().top;
    $(window).scroll(function() {
        if ($(window).scrollTop() > tocTop) {
            $(".article-toc").addClass("fixed");
        } else {
            $(".article-toc").removeClass("fixed");
        }
    });
})