/**
 * Hexo-theme-escape
 * @author Andy Lee
 * @date 2020-3-10
 */

$(document).ready(function () {
  var goUpBtn = $("#go-up");
  goUpBtn.hide();
  let height = $(window).height();
  setMode();

  /**
   * Scroll function
   */
  $(window).scroll(function() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var bannerTransform;

    // Parallax effect
    bannerTransform = "translate3d(0px, " + scrollTop / 5 + "px, 0px)";
    $("#article-banner").css("transform", bannerTransform);

    // Go up button
    if (scrollTop > height) {
      goUpBtn.fadeIn();
    } else {
      goUpBtn.fadeOut();
    }
  });

  // Go up button
  goUpBtn.click(function() {
    if(typeof window.getComputedStyle(document.body).scrollBehavior === 'undefined') {
      $('html,body').animate({ scrollTop: 0 }, 500);
    } else {
      $("html, body").scrollTop(0);
    }
  });

  /**
   * Toc Position
   */
  if($("#article-toc")[0]){
    var tocCoord = $("#article-toc").offset().top;
    $(window).scroll(function() {
      if ($(window).scrollTop() + 50 > tocCoord) {
        $(".toc").addClass("fixed");
      } else {
        $(".toc").removeClass("fixed");
      }
    });
  }

  // Smooth movement in safari browser
  $('.toc-link').click(function () {
    if(typeof window.getComputedStyle(document.body).scrollBehavior === 'undefined') {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
      });
    }
  });

  /**
   * Toc Dynamic style
   */
  var tocContainer = $("#article-toc");
  var toc = tocContainer.children(), tocHeight = toc.height();
  scrollSpy(tocContainer, {offset: 200});

  $(".toc-item").on("scrollspy", function() {
    var tocTop = toc.scrollTop(),
      link = $(this).children(".toc-link"),
      thisTop = link.position().top;
    // make sure the highlighted element contains no child
    if($(this).height() != link.height())
      return;
    // if the highlighted element is above current view of toc
    if(thisTop <= 0)
      toc.scrollTop(tocTop + thisTop);
    // else if below current view of toc
    else if(tocHeight <= thisTop)
      toc.scrollTop(tocTop + thisTop + link.outerHeight() - tocHeight);
  });

  /**
   * No banner Style render
   */
  if($(".no-banner")[0]){
    $(".no-banner").css("background", "linear-gradient(to bottom right, " + randomColor() + "," + randomColor() + ")")
  }

  /**
   * Search
   */
  $("#search").click(function() {
    var searchInput = $(".search-form-input");
    searchInput.show().focus();
    searchInput.css({
      "width": "150px",
      "padding": "0 10px",
    });
  });

  $(".search-form-input").blur(function() {
    if ( !$("#search").is(":active") ) {
      $(".search-form-input").css({
        "width": "0px",
        "border": "none",
        "padding": "0"
      });
    }
  })

  /**
   * Switch Mode
   */
  $("#switch-mode-btn").click(function() {
    let value = $('#switch-mode-btn').attr('class').split(' ').filter(item => item !== 'iconfont').toString();
    console.log(value);
    $('#switch-mode-btn').attr('class', value === 'icon-moon' ? 'iconfont icon-sun' : 'iconfont icon-moon');
    $('html').attr('class', value === 'icon-moon' ? 'dark' : '');
    localStorage.setItem('custom-mode', value === 'icon-moon' ? 'dark' : 'light');
    console.log(localStorage.getItem('custom-mode'));
  })
})

function randomColor() {
  var rgb = Math.random(16);
  return "#"+String(rgb).substring(2,8);
}

function setMode() {
  // 判断用户是否自定义过主题
  const customMode = localStorage.getItem('custom-mode');
  console.log(customMode);
  if (customMode) {
    $('html').attr('class', customMode);
    $('#switch-mode-btn').attr('class', `iconfont ${customMode === 'dark' ? 'icon-sun' : 'icon-moon'}`);
    return
  }

  let className = '';
  // 判断当前环境是否支持 CSS 变量
  if (window.matchMedia('(prefers-color-scheme)').matches) {
    // 根据参数自动调整 Icon
    console.log(window.matchMedia('(prefers-color-scheme: light)'));
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      className = 'icon-moon';
    } else {
      className = 'icon-sun';
    }
    $("#switch-mode-btn").attr('class', `iconfont ${ className }`);
  } else {
    // 使用时间动态调整
    const now = new Date().getHours();
    if (now < 6 || now > 19) {
      className = 'icon-sun';
    } else {
      className = 'icon-moon';
    }
    $("#switch-mode-btn").attr('class', `iconfont ${ className }`);
  }
}

function handleSystemModeChange(event) {
  let className = '';
  if (event.matches) {
    className = 'dark'
  }
  $('html').attr('class', className);
  $('#switch-mode-btn').attr('class', `iconfont ${ className ? 'icon-sun' : 'icon-dark'}`);
}

const systemModeIsDark = window.matchMedia('(prefers-color-scheme: dark)');
systemModeIsDark.addEventListener('change', handleSystemModeChange);

/**
 * @name scrollSpy
 * @author unnamed42
 * @link https://unnamed42.github.io/2016-09-10-Hexo折腾笔记.html
 * @param {String} menuSelector 
 * @param {*} options 
 */
function scrollSpy(menuSelector, options) {
  var menu = $(menuSelector);
  options = options || {};
  var offset = options.offset || 0;
  var activeClassName = options.activeClassName || "active";

  var scollTarget = menu.find("a").map(function() {
      var item = $($(this).attr("href"));
      if (item.length)
        return item[0]; // avoid becoming 2-dim jquery array
    }), lastId = null, active = $();

  $(window).scroll(function() {
    // Get container scroll position
    var fromTop = $(this).scrollTop() + offset;

    // Get id of current scroll item
    var id = scollTarget.filter(function() {
      return $(this).offset().top < fromTop;
    }).last().attr("id") || "";

    if (lastId !== id) {
      active.removeClass(activeClassName);
      var newActive = [];

      for(var target = menu.find("[href='#" + id + "']");
        target.length && !target.is(menu);
        target = target.parent()) {
        if(target.is("li"))
          newActive.push(target[0]);
      }
      active = $(newActive).addClass(activeClassName).trigger("scrollspy");
      lastId = id;
    }
  });
}
