let ima6310Timeout;
let ima6310LastId = "";
window.initialWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

function imh_6310_init() {
  //Default load set
  setTimeout(function () {
    jQuery("div[data-json]").each(function () {
      if (
        jQuery(this).attr("data-always-show") == 1 &&
        window.innerWidth > 768
      ) {
        jQuery(this).trigger("mouseenter");
      }
    });
    imh_6310_load_modal_image();
  }, 700);
  setTimeout(function () {
    jQuery(".imh-6310-drag").each(function () {
      let that = jQuery(this);
      let pointId = that.attr("data-id");
      let id = that.closest(".imh-6310-annotation-box").attr("data-id");
      setTooltipPosition(pointId, id);
    });
    jQuery(".imh-6310-hover-content").each(function () {
      if (
        jQuery(this).attr("data-always-show") == 1 &&
        window.innerWidth > 768
      ) {
        jQuery(this).css("transform", "scale(1)");
      } else {
        jQuery(this).css("transform", "scale(0)");
        jQuery(this).hide();
      }
    });

    let hoverContent = jQuery(".imh-6310-hover-content iframe");
    if (hoverContent.length) {
      hoverContent.each(function () {
        jQuery(this)
          .closest(".imh-6310-template-02-hover-content")
          .removeAttr("style");
      });
    }

    jQuery(".imh-6310-drag").each(function () {
      let type = Number(
        jQuery(this)
          .closest(".imh-6310-annotation-box")
          .attr("data-display-type")
      );

      if (type === 1) {
        jQuery(this)
          .click(function () {
            clearTimeout(ima6310Timeout);
            let pointId = jQuery(this).attr("data-id");
            let id = jQuery(this)
              .closest(".imh-6310-annotation-box")
              .attr("data-id");
            let alwaysShow =
              jQuery(this).attr("data-always-show") == 1 &&
              window.initialWidth > 768
                ? 1
                : 2;
            setTooltipPosition(pointId, id, alwaysShow);
            if (ima6310LastId && ima6310LastId != pointId) {
              jQuery(".imh-6310-hover-content").each(function () {
                jQuery(this).attr("data-always-show") == 1 &&
                window.innerWidth > 768
                  ? jQuery(this).css("transform", "scale(1)")
                  : jQuery(this).css("transform", "scale(0)");
              });
            }
            ima6310LastId = pointId;
            jQuery(".imh-6310-hover-content-" + id + "-" + pointId)
              .stop()
              .css("transform", "scale(1)");

            jQuery(".imh-6310-hover-content-" + id + "-" + pointId).show();
          })
          .mouseout(function () {
            imh_6310_hide();
          });
      } else {
        jQuery(this)
          .mouseover(function () {
            clearTimeout(ima6310Timeout);
            let pointId = jQuery(this).attr("data-id");
            let id = jQuery(this)
              .closest(".imh-6310-annotation-box")
              .attr("data-id");
            let alwaysShow =
              jQuery(this).attr("data-always-show") == 1 &&
              window.initialWidth > 768
                ? 1
                : 2;
            setTooltipPosition(pointId, id, alwaysShow);
            if (ima6310LastId && ima6310LastId != pointId) {
              jQuery(".imh-6310-hover-content").each(function () {
                jQuery(this).attr("data-always-show") == 1 &&
                window.innerWidth > 768
                  ? jQuery(this).css("transform", "scale(1)")
                  : jQuery(this).css("transform", "scale(0)");
              });
            }
            ima6310LastId = pointId;
            jQuery(".imh-6310-hover-content-" + id + "-" + pointId)
              .stop()
              .css("transform", "scale(1)");

            jQuery(".imh-6310-hover-content-" + id + "-" + pointId).show();
            imh_6310_slider_reset(
              jQuery(".imh-6310-popup-" + id + "-" + pointId)
            );
          })
          .mouseout(function () {
            imh_6310_hide();
          });
      }
    });

    jQuery(".imh-6310-hover-content")
      .mouseover(function () {
        clearTimeout(ima6310Timeout);
      })
      .mouseout(function () {
        imh_6310_hide();
      });
  }, 500);
  imh_6310_adjust_position();

  //Popup Open
  jQuery("body").on(
    "click",
    ".imh-6310-drag, .imh-6310-drag .imh-6310-point-icons",
    function () {
      let directLink = jQuery(this)
        .closest(".imh-6310-drag")
        .attr("data-link-url");

      if (directLink != undefined && directLink != null) {
        let target = jQuery(this).closest(".imh-6310-drag").attr("target");
        if (target != undefined && target != null) {
          window.open(directLink, "_blank");
          win.focus();
        } else {
          window.location.href = directLink;
        }
      }

      let dataId =
        jQuery(this).closest(".imh-6310-annotation-box").attr("data-id") +
        "-" +
        jQuery(this).closest(".imh-6310-drag").attr("data-id");

      let selector = jQuery(".imh-6310-popup-" + dataId);
      if (selector.length) {
        jQuery(".imh-6310-hover-content-" + dataId).css({
          transform: "scale(0)",
        });
        let width = selector.find("iframe").attr("width");
        let height = selector.find("iframe").attr("height");
        let windowWidth = jQuery(window).width();

        if (!width) {
          width = windowWidth > 700 ? 700 : windowWidth;
          height = windowWidth > 700 ? 490 : "auto";
        } else if (windowWidth < width) {
          windowWidth -= 20;
          height = (windowWidth * height) / width;
          width = windowWidth;
        }

        selector.find("iframe").css({
          width: width + "px",
          height: height + "px",
        });
        selector.css({
          display: "block",
        });
        selector.find(".imh-6310-modal-content").css({
          display: "block",
          width: width + "px",
          height: height + "px",
        });
        jQuery("body").css({
          overflow: "hidden",
        });
      }
    }
  );

  jQuery("body").on("click", ".imh-6310-close-button", function () {
    jQuery(".imh-6310-modal").css({
      display: "none",
    });
    jQuery("body").css({
      overflow: "initial",
    });
    var attr = jQuery(this).closest(".imh-6310-modal").attr("data-modal-layer");
    if (typeof attr !== "undefined" && attr !== false) {
      jQuery(this).closest(".imh-6310-modal").remove();
    } else {
      jQuery("body").css({
        overflow: "initial",
      });

      let src = jQuery(this).find("iframe").attr("src");
      jQuery(this).find("iframe").attr("src", "");
      jQuery(this).find("iframe").attr("src", src);
    }

    let src = jQuery(this).find("iframe").attr("src");
    jQuery(this).find("iframe").attr("src", "");
    jQuery(this).find("iframe").attr("src", src);
  });

  //Hover iFrame tooltip responsive
  let hoverContent = jQuery(
    ".imh-6310-hover-content .imh-6310-template-02 iframe"
  );
  if (hoverContent.length) {
    hoverContent.each(function () {
      let iframeWidth = jQuery(this).attr("width");
      let iframeHeight = jQuery(this).attr("height");
      let deviceWidth = jQuery(window).width();
      iframeWidth =
        iframeWidth != undefined && iframeWidth != 0 && iframeWidth != ""
          ? iframeWidth
          : 496;
      iframeHeight =
        iframeHeight != undefined && iframeHeight != 0 && iframeHeight != ""
          ? iframeHeight
          : 397;

      if (deviceWidth < iframeWidth) {
        iframeHeight = (iframeHeight * deviceWidth) / iframeWidth;
        jQuery(this).attr("width", deviceWidth);
        jQuery(this).attr("height", iframeHeight);
      }
    });
  }

  imh6310RemoveLazyLoad(1000);
  imh6310RemoveLazyLoad(2000);
  imh6310RemoveLazyLoad(5000);
  imh6310RemoveLazyLoad(10000);
  setTimeout(function () {
    jQuery(".imh-6310-point-icons").show();
  }, 500);

  jQuery("body").on("click", ".imh-6310-close-button-mobile", function () {
    let hoverContent = jQuery(".imh-6310-hover-content iframe");
    if (hoverContent.length) {
      hoverContent.each(function () {
        jQuery(this)
          .closest(".imh-6310-template-02-hover-content")
          .removeAttr("style");
      });
    }
    jQuery(this)
      .closest(".imh-6310-hover-content")
      .css({ transform: "scale(0)" });
  });
}

function imh_6310_adjust_position() {
  let annotationWidth = jQuery(".imh-6310-annotation-box").width();
  let windowWidth = jQuery(window).width();
  jQuery(".imh-6310-drag").each(function () {
    let jsonData = jQuery(this).attr("data-json");
    jsonData = JSON.parse(jsonData);
    let calData =
      (Number(jsonData.iconWidth) * annotationWidth) / Number(jsonData.tWidth);

    let adjustWidth = 0;
    if (jsonData.iconType == 1 && jsonData.fontAwesomIconSizeInMobile) {
      adjustWidth =
        windowWidth < 768
          ? parseInt(
              (jsonData.fontAwesomIconSize -
                jsonData.fontAwesomIconSizeInMobile) /
                2
            )
          : 0;
    } else if (jsonData.iconType == 2 && jsonData.imgOrIconSizeInMobile) {
      adjustWidth =
        windowWidth < 768
          ? parseInt(
              (jsonData.imgOrIconSize - jsonData.imgOrIconSizeInMobile) / 2
            )
          : 0;
    }

    if (annotationWidth > Number(jsonData.iconWidth)) {
      calData = calData / 2 - Number(jsonData.iconWidth) / 2;

      jQuery(this).attr(
        "style",
        "left: calc(" +
          jsonData.xPos +
          "% + " +
          calData +
          "px + " +
          adjustWidth +
          "px) !important; bottom: " +
          jsonData.yPos +
          "%; display: inline-block;"
      );
    } else {
      calData = calData / 2;
      jQuery(this).attr(
        "style",
        "left: calc(" +
          jsonData.xPos +
          "% - " +
          calData +
          "px + " +
          adjustWidth +
          "px) !important; bottom: " +
          jsonData.yPos +
          "%; display: inline-block;"
      );
    }
  });
}

function imh_6310_hide() {
  ima6310Timeout = setTimeout(function () {
    jQuery(".imh-6310-hover-content").each(function () {
      jQuery(this).attr("data-always-show") == 1 && window.innerWidth > 768
        ? jQuery(this).css("transform", "scale(1)")
        : jQuery(this).css("transform", "scale(0)");
    });

    let hoverContent = jQuery(".imh-6310-hover-content iframe");
    if (hoverContent.length) {
      hoverContent.each(function () {
        let that = jQuery(this);
        setTimeout(function () {
          that
            .closest(".imh-6310-template-02-hover-content")
            .removeAttr("style");
        }, 700);
        let src = jQuery(this).attr("src");
        if (src.includes("youtube") || src.includes("vimeo")) {
          jQuery(this).attr("src", "");
          jQuery(this).attr("src", src);
        }
      });
    }
  }, 500);
}

function imh6310RemoveLazyLoad(timeValue) {
  //Remove lazyload
  setTimeout(() => {
    var $allImages = jQuery(".imh-6310-img");
    $allImages.each(function () {
      var image = jQuery(this).attr("data-imh-value");
      var src = jQuery(this).attr("src");
      var alt = jQuery(this).attr("alt");
      var className = jQuery(this).attr("data-imh-cls");

      var attributes = this.attributes;
      var i = attributes.length;
      while (i--) {
        let attrName = attributes[i].name.toLowerCase();
        if (
          attrName != "src" &&
          attrName != "class" &&
          attrName != "alt" &&
          attrName != "data-imh-value" &&
          attrName != "data-imh-cls"
        ) {
          this.removeAttributeNode(attributes[i]);
        }
      }
      if (src != image) {
        jQuery(this).attr({
          src: image,
          class: className,
          alt: alt,
          "data-imh-value": image,
          "data-imh-cls": className,
        });
      } else {
        jQuery(this).attr({ class: className });
      }
    });
  }, timeValue);
}

function setTooltipPosition(pointId, id, alwaysShow = 2) {
  let jsonData = JSON.parse(
    jQuery(
      ".imh-6310-annotation-box-" + id + " div[data-id='" + pointId + "']"
    ).attr("data-json")
  );

  if (jsonData.selectedTemplate == "02") {
    let iFrame = jQuery(
      ".imh-6310-hover-content-" + id + "-" + pointId + " iframe"
    );
    let iframeWidth = iFrame.attr("width");
    let iframeHeight = iFrame.attr("height");

    iframeWidth =
      iframeWidth != undefined && iframeWidth != 0 && iframeWidth != ""
        ? iframeWidth
        : 496;
    iframeHeight =
      iframeHeight != undefined && iframeHeight != 0 && iframeHeight != ""
        ? iframeHeight
        : 397;

    jQuery(
      ".imh-6310-hover-content-" +
        id +
        "-" +
        pointId +
        " iframe, .imh-6310-hover-content-" +
        id +
        "-" +
        pointId +
        " .imh-6310-template-02-hover-content"
    ).css({
      width: iframeWidth + "px",
      height: iframeHeight + "px",
    });
  }
  let icons = jQuery(
    ".imh-6310-annotation-box-" +
      id +
      " div[data-id='" +
      pointId +
      "'] .imh-6310-point-icons"
  );
  let tempIconSize = icons.width() / 2;
  let fromLeft = icons.offset().left;
  let fromRight = jQuery(window).width() - fromLeft;
  let fromTop = icons.offset().top;
  let iconHeight = icons.height();
  let content = jQuery(".imh-6310-hover-content-" + id + "-" + pointId);
  let pointWidth = content.width() / 2;
  let contentHeight = content.height();
  let toolTipPosition = calculateToolTipPosition(
    fromTop,
    tempIconSize,
    contentHeight
  );

  if (fromLeft + tempIconSize < pointWidth) {
    content.css({
      left: "0px",
      right: "auto",
    });
  } else if (fromRight + tempIconSize < pointWidth) {
    content.css({
      left: "auto",
      right: "10px",
    });
  } else {
    let temp = fromLeft + tempIconSize - pointWidth;
    content.css({
      left: temp + "px",
      right: "auto",
    });
  }

  let topPos;
  if (toolTipPosition == 1 || alwaysShow == 1) {
    fromTop -= contentHeight + 10;
    topPos = fromTop + "px";
  } else if (toolTipPosition == 2) {
    fromTop += iconHeight + 5;
    topPos = fromTop + "px";
  }
  if (parseInt(topPos) < 15) {
    topPos = "15px";
  }
  content.css({
    top: topPos,
  });
}

function calculateToolTipPosition(fromTop, tempIconSize, contentHeight) {
  let scrollTop = jQuery(window).scrollTop();
  let deviceHeight = jQuery(window).height();
  let center = scrollTop + deviceHeight / 2;
  let iconCenter = fromTop + tempIconSize + 10;

  if (fromTop - contentHeight > scrollTop) {
    //Space available in top
    return 1;
  } else if (iconCenter > center) {
    //Space not available in top but more space than bottom
    return 1;
  } else {
    return 2;
  }
}

window.addEventListener("load", function () {
  imh_6310_init();

  setTimeout(function () {
    jQuery(".imh-6310-hover-content").each(function () {
      jQuery("body").append(jQuery(this).clone());
      jQuery(this).remove();
    });
    jQuery(".imh-6310-modal").each(function () {
      jQuery("body").append(jQuery(this).clone());
      jQuery(this).remove();
    });
  }, 300);

  setTimeout(function () {
    imh_6310_slider_init();
  }, 300);
});

window.addEventListener("resize", function (event) {
  imh_6310_adjust_position();
});

function imh_6310_load_modal_image() {
  jQuery("body").on("click", ".imh-6310-hover-content img", function (e) {
    var id = jQuery(this)
      .closest(".imh-6310-hover-content")
      .attr("data-imh-6310-id");
    var idList = id.split("-");
    var attr = Number(
      jQuery(".imh-6310-annotation-box-" + idList[0]).attr("data-image-zoom")
    );
    if (attr) {
      jQuery(this)
        .closest(".imh-6310-hover-content")
        .css("transform", "scale(0)");

      var windowWidth = jQuery(window).width() - 200;
      var imgWidth = jQuery(this).prop("naturalWidth");
      var src = jQuery(this).attr("src");

      if (windowWidth < imgWidth) {
        imgWidth = windowWidth;
      }

      jQuery("body").css({
        overflow: "hidden",
      });

      jQuery("body")
        .append(`<div class="imh-6310-modal" style="display: block;" data-modal-layer='${id}'>
      <div class="imh-6310-modal-content imh-6310-modal-xl" style="display: block; width: ${imgWidth}px; height: auto; margin-bottom: 100px">
         <div class="imh-6310-popup">
            <div class="imh-6310-close-button"></div>
            <img src='${src}' width='${imgWidth}' style='padding-bottom: 30px' />
         </div>
      </div>
   </div>`);
    }
  });
}
/* ================================================================= */
/* ================================================================= */
/* ================================================================= */
/* ================================================================= */
/* ================================================================= */

function imh_6310_slider_reset(selector) {
  var allSlider = jQuery(".imh-6310-slider");
  jQuery(".imh-6310-slider-content").hide();
  imh_6310_calculate_slider_size(selector, 0);
  selector.find(".imh-6310-slider-content-0").show();
  allSlider.each(function () {
    jQuery(this).attr("data-current-slider", 0);
  });
}

function imh_6310_calculate_slider_size(selector, num) {
  console.log("selector", selector.attr("class"));
  var windowWidth = jQuery(window).width();
  if (windowWidth < 768) {
    windowWidth -= 50;
  } else if (windowWidth < 992) {
    windowWidth -= 80;
  } else {
    windowWidth -= 130;
  }

  var sliderWidth = Number(
    selector.find(".imh-6310-slider").attr("imh-slider-width") || 700
  );
  var imgWidth = selector
    .find(".imh-6310-slider-content-" + num + " img")
    .prop("naturalWidth");

  var imgHeight = selector
    .find(".imh-6310-slider-content-" + num + " img")
    .prop("naturalHeight");

  if (sliderWidth > windowWidth) {
    imgHeight = (imgHeight * windowWidth) / imgWidth;
    imgWidth = windowWidth;
  } else {
    imgHeight = (imgHeight * sliderWidth) / imgWidth;
    imgWidth = sliderWidth;
  }

  selector
    .find(".imh-6310-slider, .imh-6310-modal-content")
    .attr(
      "style",
      "width: " +
        imgWidth +
        "px !important; max-width: " +
        imgWidth +
        "px !important; height: " +
        imgHeight +
        "px !important"
    );
}

function imh_6310_slider_init() {
  var allSliderImg = jQuery(
    ".imh-6310-slider .imh-6310-slider-content img, .imh-6310-hover-content img"
  );
  allSliderImg.each(function () {
    var src =
      jQuery(this).attr("imh-image-url") ||
      jQuery(this).attr("data-src") ||
      jQuery(this).attr("data-src") ||
      jQuery(this).attr("src");
    var attributes = jQuery.map(this.attributes, function (item) {
      return item.name;
    });

    var img = jQuery(this);
    jQuery.each(attributes, function (i, item) {
      img.removeAttr(item);
    });
    img.attr("src", src);
  });

  var allSlider = jQuery(".imh-6310-slider");
  allSlider.each(function () {
    var i = 0;
    var sliderContent = jQuery(this).find(".imh-6310-slider-content");
    jQuery(this).attr("data-total-slider", sliderContent.length);
    jQuery(this).attr("data-current-slider", 0);
    sliderContent.each(function () {
      jQuery(this).addClass(" imh-6310-slider-content-" + i);
      i++;
    });
  });

  jQuery("body").on("click", ".next", function () {
    imh_6310_slider_next(jQuery(this).closest(".imh-6310-slider"));
  });

  jQuery("body").on("click", ".prev", function () {
    imh_6310_slider_prev(jQuery(this).closest(".imh-6310-slider"));
  });
}

function imh_6310_slider_next(selector) {
  var totalSlider = Number(selector.attr("data-total-slider"));
  var currentSlider = Number(selector.attr("data-current-slider"));
  selector.find(".imh-6310-slider-content-" + currentSlider).fadeOut(200);
  currentSlider += 1;
  if (totalSlider <= currentSlider) {
    currentSlider = 0;
  }
  imh_6310_calculate_slider_size(
    selector.closest(".imh-6310-modal"),
    currentSlider
  );
  selector.find(".imh-6310-slider-content-" + currentSlider).fadeIn(300);
  selector.attr("data-current-slider", currentSlider);
}

function imh_6310_slider_prev(selector) {
  var totalSlider = Number(selector.attr("data-total-slider"));
  var currentSlider = Number(selector.attr("data-current-slider"));
  selector.find(".imh-6310-slider-content-" + currentSlider).fadeOut(200);
  currentSlider -= 1;

  if (currentSlider < 0) {
    currentSlider = totalSlider - 1;
  }
  imh_6310_calculate_slider_size(
    selector.closest(".imh-6310-modal"),
    currentSlider
  );
  selector.find(".imh-6310-slider-content-" + currentSlider).fadeIn(300);
  selector.attr("data-current-slider", currentSlider);
}
