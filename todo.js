angular.module('todoApp', [])
  .controller('EditBookController', function($scope, $http, $location, $timeout) {

    $scope.current_page = 1;
    $scope.btns = [];
    $scope.current_button_index;
    $scope.current_delete_index;
    $scope.current_page_data;
    $scope.content;
    $scope.pages = [];
    $scope.total_page = 0;
    $scope.link;

    $scope.getData = function () {
      $http.get("https://trainghiem.sachmem.vn/api/pages?book_id=82")
      .then(function(res) {
        if (res.data.code == 1) {
          $scope.total_page = res.data.data;
          $scope.data = new Array($scope.total_page);
  
          $http.get("https://trainghiem.sachmem.vn/api/pages/" + $scope.current_page + "?book_id=82")
          .then(function(res) {
            if (res.data.code == 1) {
  
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].page_number == $scope.current_page) {
                  $scope.current_page_data = res.data.data[i];
                  $scope.current_page_data.content = JSON.parse($scope.current_page_data.content);
                }
              }
            }
          })
         
        }
      });
    }
    
    if ($location.search().page) {
      $scope.current_page = $location.search().page
    }

    $scope.getData();

    
    $scope.current_button_id = null;

    $scope.current_button_position_x;
    $scope.current_button_position_y;

    $scope.offset_x = 0;
    $scope.offset_y = 0;

    $("#edit-book").on( "mousemove", function( e ) {
      if ($scope.current_button_id) {
        let bound = document.getElementById("edit-book").getBoundingClientRect();
        let left = ((e.pageX - bound.left - $scope.offset_x) / bound.width * 100) + "%";
        let top = ((e.pageY - bound.top - $scope.offset_y) / bound.height * 100) + "%";
        $($scope.current_button_id).css('left', left);
        $($scope.current_button_id).css('top', top);

        $scope.current_button_position_x = left;
        $scope.current_button_position_y = top;

        $scope.current_page_data.content.btns[$scope.current_button_index].x = left;
        $scope.current_page_data.content.btns[$scope.current_button_index].y = top;

        $scope.$apply()
      }
    });
    $( document ).on( "mouseup", function( e ) {
      if ($scope.current_button_id) {
        $scope.current_button_id = null;
        $scope.offset_x = 0;
        $scope.offset_y = 0;
        $scope.current_page_data.content.btns[$scope.current_button_index].x = $scope.current_button_position_x;
        $scope.current_page_data.content.btns[$scope.current_button_index].y = $scope.current_button_position_y;

        $scope.current_page_data.content.btns[$scope.current_button_index].x = $scope.current_button_position_x;
        $scope.current_page_data.content.btns[$scope.current_button_index].y = $scope.current_button_position_y;

        $scope.$apply();
        $scope.current_button_index = null;
      }
    });

    $scope.hideBtn = function() {
      $scope.current_delete_index = null;
    }
    $scope.addButton = function() {
      $scope.current_page_data.content.btns.push({text: 'test', x: "0%", y: "0%", url: $scope.link});
      console.log($scope.link)
    };

    $scope.deleteBtn = function(index) {
      $scope.current_page_data.content.btns.splice(index, 1);
    }

    $scope.startDrag = function(event, index) {
      event.preventDefault();
      if (event.which == 1) {
        
        $scope.current_button_index = index;
        $scope.current_button_id = "#dragtarget_" + index.toString();
        $($scope.current_button_id).css('position', 'absolute')
  
        var position_of_button = $($scope.current_button_id)[0].getBoundingClientRect();
  
        $scope.offset_x = event.clientX - position_of_button.left;
        $scope.offset_y = event.clientY - position_of_button.top;
      } else {
       $scope.current_delete_index = index;
       let id = '#contextmenu_' + index.toString()
       let bound = document.getElementById("edit-book").getBoundingClientRect();
       let left = ((event).pageX - bound.left - $scope.offset_x) / bound.width * 100 + "%";
       let top = ((event.pageY - bound.top - $scope.offset_y) / bound.height * 100) + "%";

       $(id).css({ 
        left: left,
        top: top,
      })
      }
    }

    $scope.getStyle = function(button) {
      if (button.x && button.y) {
        return { 
          'left': button.x,
          'top': button.y,
          'position': 'absolute',
          'z-index': 1,
        }
      } else return { 'z-index': 1, 'position': 'absolute', 'left': '0%', 'top': '0%' };
    }

    

    $scope.previous = function() {
      $scope.current_page--;
      $scope.btns = [];
      $location.search({'page': $scope.current_page})
      $scope.getData();
    }

    $scope.next = function() {
      $scope.current_page++;
      $scope.btns = [];
      $location.search({'page': $scope.current_page})
      $scope.getData();
    }

    $scope.save = function() {
      
      let data = JSON.parse(JSON.stringify($scope.current_page_data));
      data.content = JSON.stringify(data.content);
      $http.put("https://trainghiem.sachmem.vn/api/pages/" + data.id, data)
      .then(function(res) {
        toastr.options = {
          timeOut: 2000,
          preventDuplicates: false
          };
        toastr.clear();
        if (res.data.code == 1) {
          toastr.success("Lưu thành công", "Thông báo")
        } else {
          toastr.error("Lưu thất bại", "Thông báo")

        }
      });
    }

  }).controller('AddBookController', function($scope, $http, $location, $timeout) {

    $scope.current_page = 1;
    $scope.btns = [];
    $scope.current_button_index;
    $scope.current_page_data;
    $scope.content;
    $scope.pages = [];
    
    if ($location.search().page) {
      $scope.current_page = $location.search().page
    }

    $http.get("http://192.168.0.105:4000/api/pages")
    .then(function(res) {
      if (res.data.code == 1) {
        $scope.pages = res.data.data;
        for (let i = 0; i < $scope.pages.length; i++) {
          $scope.pages[i].content = JSON.parse($scope.pages[i].content);
        }
        $scope.pages.push({
          "book_id": 82,
          "content": {
            "backgroundUrl": "",
            "events": []
          },
          "next_page_id": $scope.pages[$scope.pages.length - 1].id,
          "prev_page_id": null
        })
        $scope.current_page = $scope.pages.length;
        $timeout(function(){
          // $("#flipbook").turn({
          //   width: 650,
          //   height: 900
          // });
          
          
          $("#previous").mousedown(function(){
            $scope.btns = [];
            $scope.$apply();
            
          }).mouseup(function(){
            $scope.current_page--;
            $scope.current_page_data = $scope.pages[$scope.current_page - 1];
            $scope.content = $scope.current_page_data.content;
            $scope.btns = $scope.content.btns;
            $scope.$apply();
            $location.search({'page': $scope.current_page})
          });
          
          $("#next").mousedown(function(){
            $scope.btns = [];
            $scope.$apply();
              
          }).mouseup(function(){
            $scope.current_page++;
            $scope.current_page_data = $scope.pages[$scope.current_page - 1];
            $scope.content = $scope.current_page_data.content;
            $scope.btns = $scope.content.btns;
            $scope.$apply();
            $location.search({'page': $scope.current_page})
            // window.location.hash = $scope.current_page.toString();
          });

        }, 0);


        $scope.current_page_data = $scope.pages[$scope.current_page - 1];
        $scope.content = $scope.current_page_data.content;
        $scope.btns = $scope.content.btns;
      }
    });

    

    $scope.current_button_id = null;

    $scope.current_button_position_x;
    $scope.current_button_position_y;

    $scope.offset_x = 0;
    $scope.offset_y = 0;

    $("#edit-book").on( "mousemove", function( e ) {
      if ($scope.current_button_id) {
        let bound = document.getElementById("edit-book").getBoundingClientRect();
        let left = ((e.pageX - bound.left - $scope.offset_x) / bound.width * 100) + "%";
        let top = ((e.pageY - bound.top - $scope.offset_y) / bound.height * 100) + "%";
        $($scope.current_button_id).css('left', left);
        $($scope.current_button_id).css('top', top);

        $scope.current_button_position_x = left;
        $scope.current_button_position_y = top;
      }
    });
    $( document ).on( "mouseup", function( e ) {
      if ($scope.current_button_id) {
        $scope.current_button_id = null;
        $scope.offset_x = 0;
        $scope.offset_y = 0;
        $scope.btns[$scope.current_button_index].x = $scope.current_button_position_x
        $scope.btns[$scope.current_button_index].y = $scope.current_button_position_y;
        $scope.current_button_index = null;
      }
    });

    $scope.link = ""
 
    $scope.addButton = function() {
      $scope.btns.push({x: "0%", y: "0%", url: $scope.link});
    };

    $scope.startDrag = function(event, index) {
      event.preventDefault();
      $scope.current_button_index = index;
      $scope.current_button_id = "#dragtarget_" + index.toString();
      $($scope.current_button_id).css('position', 'absolute')

      var position_of_button = $($scope.current_button_id)[0].getBoundingClientRect();

      $scope.offset_x = event.clientX - position_of_button.left;
      $scope.offset_y = event.clientY - position_of_button.top;

    }

    $scope.getStyle = function(button) {
      if (button.x && button.y) {
        return { 
          'left': button.x,
          'top': button.y,
          'position': 'absolute',
          'z-index': 1,
        }
      } else return { 'z-index': 1, 'position': 'absolute', 'left': '0%', 'top': '0%' };
    }

    $scope.save = function() {
      $scope.content.btns = $scope.btns;
      $scope.current_page_data.content = JSON.stringify($scope.content);
      $http.post("http://192.168.0.105:4000/api/pages", $scope.current_page_data)
      .then(function(res) {
        toastr.options = {
          timeOut: 0,
          preventDuplicates: false
          };
        toastr.clear()
        if (res.data.code == 1) {
          toastr.success("Lưu thành công", "Thông báo")
        } else {
          toastr.error("Lưu thất bại", "Thông báo")

        }
      // if (res.data.code == 1) {
      //   $scope.data_page = res.data.data[0];
      //   $scope.content = JSON.parse($scope.data_page.content)
      //   $scope.btns = $scope.content.btns;
      // }
      });
    }

  }).controller('BookController', function($scope, $http, $timeout, $location, $window) {
    $scope.btns = [];
    $scope.total_page = 0;
    $scope.current_button_index;
    $scope.data_page;
    $scope.content;
    $scope.pages = [];
    $scope.current_page = 1;
    $scope.time_turned_page = 0;
    $scope.loaded = [];
    $scope.data = [];
    $scope.in_progress_loading = [];
    $scope.unloaded = [];
    $scope.first_time_load = false;


    if ($location.search().page) {
      $scope.current_page = $location.search().page;
    }

    $http.get("https://trainghiem.sachmem.vn/api/pages?book_id=82")
    .then(function(res) {
      if (res.data.code == 1) {
        $scope.total_page = res.data.data;
        $scope.data = new Array($scope.total_page);

        $http.get("https://trainghiem.sachmem.vn/api/pages/" + $scope.current_page + "?book_id=82")
        .then(function(res) {
          if (res.data.code == 1) {

            for (let i = 0; i < res.data.data.length; i++) {
              $scope.loaded.push(res.data.data[i].page_number);
              $scope.data[res.data.data[i].page_number - 1] = res.data.data[i];
              $scope.data[res.data.data[i].page_number - 1].content = JSON.parse($scope.data[res.data.data[i].page_number - 1].content)
            }

            $timeout(function(){
              $scope.loadApp();
            }, 10);
          }
        })
       
      }
    });

    $scope.getData = function(book) {
      if ($scope.unloaded.length) {
        $http.get("https://trainghiem.sachmem.vn/api/pages/" + $scope.unloaded[0] + "?book_id=82")
        .then(function(res) {
          if (res.data.code == 1) {

            for (let i = 0; i < res.data.data.length; i++) {
              let data_page;
              data_page = res.data.data[i];
              data_page.content = JSON.parse(data_page.content);
              addPage(data_page, book, res.data.data[i].page_number);
              $scope.loaded.push(res.data.data[i].page_number);
              var index = $scope.unloaded.indexOf(res.data.data[i].page_number);
              if (index !== -1) $scope.unloaded.splice(index, 1);
            }

            $scope.getData(book);
          }
          
        })
      }
      
    }

    $scope.next = function() {
      $('.magazine').turn('next');
      $scope.current_page = $(".magazine").turn("page");
    }

    $scope.previous = function() {
      $('.magazine').turn('previous');
      $scope.current_page = $(".magazine").turn("page");
    }


    $scope.getStyle = function(button) {
      if (button.x && button.y) {
        return { 
          'left': button.x,
          'top': button.y,
          'position': 'absolute',
          'z-index': 1,
        }
      } else return { 'z-index': 1 };
    }

    $scope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl){
      if ($location.search().page) {
        if ($scope.current_page != $location.search().page) {
          $scope.current_page = parseInt($location.search().page);
          if ($scope.loaded.includes($scope.current_page)) {
            $('.magazine').turn('page', $scope.current_page);
          } else {
            $window.location.reload();
          }
        }
      }
      
  });


    $scope.loadApp = function() {

      $('#canvas').fadeIn(1000);
   
      var flipbook = $('.magazine');
   
      // Check if the CSS was already loaded
     
     if (flipbook.width()==0 || flipbook.height()==0) {
       setTimeout($scope.loadApp, 10);
       return;
     }
     
     // Create the flipbook
     let width = $(window).width() - 50;
     let height = ($(window).width()) / 2 / 0.72;

     if ($scope.view_mode == 'mobile') {
      width = $(window).width();
      height = ($(window).width()) / 0.72;
     }
     flipbook.turn({
         
         // Magazine width
   
         width: width,
   
         // Magazine height
   
         height: height,
   
         // Duration in millisecond
   
         duration: 1000,
   
         // Hardware acceleration
   
         acceleration: !isChrome(),
   
         // Enables gradients
   
         gradients: true,
         
         // Auto center this flipbook
   
         autoCenter: true,
   
         // Elevation from the edge of the flipbook when turning a page
   
         elevation: 50,
   
         // The number of pages
   
         pages: $scope.total_page,

         page: $scope.current_page,
   
         // Events
   
         when: {
           turning: function(event, page, view) {
            //  var book = $(this),
            //  currentPage = book.turn('page');
            //  pages = book.turn('pages');
            var book = $(this);

              // var range = book.turn("range", page);
              //   for (var i = range[0]; i<=range[1]; i++){
              //   if (!book.turn("hasPage", i)) {
              //     $scope.unloaded.push(i)
              //   }
              // }
           },
   
           turned: function(event, page, view) {

             $(this).turn('center');
   
             if (page==1) { 
               $(this).turn('peel', 'br');
             }
             let current_page = page;
             if ($scope.view_mode == 'laptop') {
               if (current_page % 2 == 1 && current_page != 1) current_page--;
             }
             $scope.current_page = current_page;
              
              $location.search({'page': current_page});
              $timeout(function(){
                $scope.$apply();
             },0)
              $scope.getData($(this));
           },
   
           missing: function (event, pages) {
             // Add pages that aren't in the magazine
             for (var i = 0; i < pages.length; i++) {
              if ($scope.data[pages[i] - 1]) {
                addPage($scope.data[pages[i] - 1], $(this), pages[i]);
              } else {
                if ($scope.unloaded.indexOf(pages[i]) < 0) {
                  $scope.unloaded.push(pages[i]);
                  
                }
              }
             }
           }
         }
   
     });
     $('.magazine').turn('page', $scope.current_page);

     setTimeout(function(){
      if ($scope.view_mode == 'mobile') $(".magazine").turn("display", "single");
     }, 0)
   
     // Zoom.js
   
     $('.magazine-viewport').zoom({
       flipbook: $('.magazine'),
   
       max: function() { 
         
         return largeMagazineWidth()/$('.magazine').width();
   
       }, 
   
       when: {
   
         swipeLeft: function() {
   
           $(this).zoom('flipbook').turn('next');
   
         },
   
         swipeRight: function() {
           
           $(this).zoom('flipbook').turn('previous');
   
         },
   
         resize: function(event, scale, page, pageElement) {
          
           if (scale==1)
             loadSmallPage(page, pageElement);
           else
             loadLargePage(page, pageElement);
   
         },
   
         zoomIn: function () {
   
           $('.thumbnails').hide();
           $('.made').hide();
           $('.magazine').removeClass('animated').addClass('zoom-in');
           $('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');
           
           if (!window.escTip && !$.isTouch) {
             escTip = true;
   
             $('<div />', {'class': 'exit-message'}).
               html('<div>Press ESC to exit</div>').
                 appendTo($('body')).
                 delay(2000).
                 animate({opacity:0}, 500, function() {
                   $(this).remove();
                 });
           }
         },
   
         zoomOut: function () {
   
           $('.exit-message').hide();
           $('.thumbnails').fadeIn();
           $('.made').fadeIn();
           $('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');
   
           setTimeout(function(){
             $('.magazine').addClass('animated').removeClass('zoom-in');
             resizeViewport();
           }, 0);
   
         }
       }
     });
   
     // Zoom event
   
     $('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
   
   
     // Using arrow keys to turn the page
   
     $(document).keydown(function(e){
   
       var previous = 37, next = 39, esc = 27;
   
       switch (e.keyCode) {
         case previous:
   
           // left arrow
           $('.magazine').turn('previous');
           e.preventDefault();
   
         break;
         case next:
   
           //right arrow
           $('.magazine').turn('next');
           e.preventDefault();
   
         break;
         case esc:
           
           $('.magazine-viewport').zoom('zoomOut');	
           e.preventDefault();
   
         break;
       }
     });
   
     $(window).resize(function() {
       resizeViewport();
     }).bind('orientationchange', function() {
       resizeViewport();
     });
   
   
     $('.thumbnails li').
       bind($.mouseEvents.over, function() {
         
         $(this).addClass('thumb-hover');
   
       }).bind($.mouseEvents.out, function() {
         
         $(this).removeClass('thumb-hover');
   
       });
   
     if ($.isTouch) {
     
       $('.thumbnails').
         addClass('thumbanils-touch').
         bind($.mouseEvents.move, function(event) {
           event.preventDefault();
         });
   
     } else {
   
       $('.thumbnails ul').mouseover(function() {
   
         $('.thumbnails').addClass('thumbnails-hover');
   
       }).mousedown(function() {
   
         return false;
   
       }).mouseout(function() {
   
         $('.thumbnails').removeClass('thumbnails-hover');
   
       });
   
     }
   
     // Events for the next button
   
     $('.next-button').bind($.mouseEvents.over, function() {
       
       $(this).addClass('next-button-hover');
   
     }).bind($.mouseEvents.out, function() {
       
       $(this).removeClass('next-button-hover');
   
     }).bind($.mouseEvents.down, function() {
       
       $(this).addClass('next-button-down');
   
     }).bind($.mouseEvents.up, function() {
       
       $(this).removeClass('next-button-down');
   
     }).click(function() {
       
       $('.magazine').turn('next');
   
     });
   
     // Events for the next button
     
     $('.previous-button').bind($.mouseEvents.over, function() {
       
       $(this).addClass('previous-button-hover');
   
     }).bind($.mouseEvents.out, function() {
       
       $(this).removeClass('previous-button-hover');
   
     }).bind($.mouseEvents.down, function() {
       
       $(this).addClass('previous-button-down');
   
     }).bind($.mouseEvents.up, function() {
       
       $(this).removeClass('previous-button-down');
   
     }).click(function() {
       
       $('.magazine').turn('previous');
   
     });
   
   
     resizeViewport();
   
     $('.magazine').addClass('animated');
   
   }
   /*
 * Magazine sample
*/

function addPage(page, book, index) {
	// Create a new element for this page
	var element = $('<div />', {});

  // Add the page to the flipbook
	if (book.turn('addPage', element, index)) {
		// Add the initial HTML
		// It will contain a loader indicator and a gradient
		element.html('<div class="gradient"></div><div class="loader"></div>');

		// Load the page
		loadPage(page, element);
	}

}

function loadPage(page, pageElement) {
	// Create an image element
	var img = $('<img />');

	img.mousedown(function(e) {
		e.preventDefault();
	});

	img.load(function() {
		
		// Set the size
		$(this).css({width: '100%', height: '100%'});

		// Add the image to the page after loaded

		$(this).appendTo(pageElement);

		// Remove the loader indicator
		
		pageElement.find('.loader').remove();
  });

  if (page.content) {
    for (let i = 0; i < page.content.btns.length; i++) {
      var link = $('<a class="button-link" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a>');
      link.attr('href', page.content.btns[i].url);
      link.css({
        left: page.content.btns[i].x,
        top: page.content.btns[i].y,
        position: 'absolute',
      })
      link.appendTo(pageElement)
    }
    img.attr('src',page.content.url);
  }
  


	// Load the page

  
  
  // for (let i = 0; i < page.content.btns.length; i++) {
  //   var link = $('<a />');
  //   link.css({
  //     left: page.content.btns[i].x,
  //     top: page.content.btns[i].y,
  //     position: 'absolute',
  //     'z-index': 1
  //   });
  //   link.appendTo(pageElement);
  // }

	// loadRegions(page, pageElement);

}

// Zoom in / Zoom out

function zoomTo(event) {

		setTimeout(function() {
			if ($('.magazine-viewport').data().regionClicked) {
				$('.magazine-viewport').data().regionClicked = false;
			} else {
				if ($('.magazine-viewport').zoom('value')==1) {
					$('.magazine-viewport').zoom('zoomIn', event);
				} else {
					$('.magazine-viewport').zoom('zoomOut');
				}
			}
		}, 1);

}

// Load large page

function loadLargePage(page, pageElement) {
	
	// var img = $('<img />');

	// img.load(function() {

	// 	var prevImg = pageElement.find('img');
	// 	$(this).css({width: '100%', height: '100%'});
	// 	$(this).appendTo(pageElement);
	// 	prevImg.remove();
		
	// });

	// // Loadnew page
	// img.attr('src', $scope.pages[page-1].content.backgroundUrl);
}

// Load small page

function loadSmallPage(page, pageElement) {
	
	// var img = pageElement.find('img');

	// img.css({width: '100%', height: '100%'});

	// img.unbind('load');
	// // Loadnew page

	// img.attr('src', $scope.pages[page-1].content.backgroundUrl);
}

// http://code.google.com/p/chromium/issues/detail?id=128488

function isChrome() {

	return navigator.userAgent.indexOf('Chrome')!=-1;

}

// Set the width and height for the viewport

function resizeViewport() {

	var width = $(window).width(),
		height = $(window).height(),
		options = $('.magazine').turn('options');
  
	$('.magazine').removeClass('animated');

	$('.magazine-viewport').css({
		width: width,
		height: height
	}).
	zoom('resize');


	if ($('.magazine').turn('zoom')==1) {
		var bound = calculateBound({
			width: options.width,
			height: options.height,
			boundWidth: Math.min(options.width, width),
			boundHeight: Math.min(options.height, height)
		});

		if (bound.width%2!==0)
			bound.width-=1;

			
		if (bound.width!=$('.magazine').width() || bound.height!=$('.magazine').height()) {

			$('.magazine').turn('size', bound.width, bound.height);

			if ($('.magazine').turn('page')==1)
				$('.magazine').turn('peel', 'br');

			$('.next-button').css({height: bound.height, backgroundPosition: '-38px '+(bound.height/2-32/2)+'px'});
			$('.previous-button').css({height: bound.height, backgroundPosition: '-4px '+(bound.height/2-32/2)+'px'});
		}

    $('.magazine').css({top: -bound.height/2, left: -bound.width/2});
	}

	var magazineOffset = $('.magazine').offset(),
		boundH = height - magazineOffset.top - $('.magazine').height(),
		marginTop = (boundH - $('.thumbnails > div').height()) / 2;

	if (marginTop<0) {
		$('.thumbnails').css({height:1});
	} else {
		$('.thumbnails').css({height: boundH});
		$('.thumbnails > div').css({marginTop: marginTop});
	}

	if (magazineOffset.top<$('.made').height())
		$('.made').hide();
	else
		$('.made').show();

	$('.magazine').addClass('animated');
	
}


// Width of the flipbook when zoomed in

function largeMagazineWidth() {
	
	return 2214;

}

// decode URL Parameters

function decodeParams(data) {

	var parts = data.split('&'), d, obj = {};

	for (var i =0; i<parts.length; i++) {
		d = parts[i].split('=');
		obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
	}

	return obj;
}

// Calculate the width and height of a square within another square

function calculateBound(d) {
	
	var bound = {width: d.width, height: d.height};

	if (bound.width>d.boundWidth || bound.height>d.boundHeight) {
		
		var rel = bound.width/bound.height;

		if (d.boundWidth/rel>d.boundHeight && d.boundHeight*rel<=d.boundWidth) {
			
			bound.width = Math.round(d.boundHeight*rel);
			bound.height = d.boundHeight;

		} else {
			
			bound.width = d.boundWidth;
			bound.height = Math.round(d.boundWidth/rel);
		
		}
	}
		
	return bound;
}
}).directive('imageonload', function() {
  return {
      restrict: 'A',
      link: function(scope, element) {

        setTimeout(function(){
          element.on('load', function() {
            element.parent().find('.loader').remove();
          });
        }, 0);
       
        scope.$watch('ngSrc', function() {

        });
      }
  };
});;


// .controller('BookMobileController', function($scope, $http, $timeout, $location) {
//   $scope.btns = [];
//   $scope.current_button_index;
//   $scope.data_page;
//   $scope.content;
//   $scope.pages = [];
//   $scope.current_page = 1;
//   $scope.time_turned_page = 0;
//   $scope.data = [];
//   $scope.loaded = [];
//   $scope.unloaded = [];
//   $scope.next = function() {
//     $('.magazine').turn('next');
//     $scope.current_page = $(".magazine").turn("page");
//   }

//   $scope.previous = function() {
//     $('.magazine').turn('previous');
//     $scope.current_page = $(".magazine").turn("page");
//   }

//   if ($location.search().page) {
//     $scope.current_page = $location.search().page;
//   }

//   $http.get("https://trainghiem.sachmem.vn/api/pages?book_id=82")
//   .then(function(res) {
//     if (res.data.code == 1) {
//       $scope.total_page = res.data.data;
//       $scope.data = new Array($scope.total_page);

//       $http.get("https://trainghiem.sachmem.vn/api/pages/" + $scope.current_page + "?book_id=82")
//       .then(function(res) {
//         if (res.data.code == 1) {

//           for (let i = 0; i < res.data.data.length; i++) {
//             $scope.loaded.push(res.data.data[i].page_number);
//             $scope.data[res.data.data[i].page_number - 1] = res.data.data[i];
//             $scope.data[res.data.data[i].page_number - 1].content = JSON.parse($scope.data[res.data.data[i].page_number - 1].content)
//           }

//           $timeout(function(){
//             $scope.loadApp();
//           }, 10);
//         }
//       })
     
//     }
//   });

//   $scope.getData = function(i, book) {
//     if (i < $scope.unloaded.length) {
      
//       $http.get("https://trainghiem.sachmem.vn/api/pages/" + $scope.unloaded[i] + "?book_id=82")
//       .then(function(res) {
//         if (res.data.code == 1) {

//           for (let i = 0; i < res.data.data.length; i++) {
//             let data_page;
//             data_page = res.data.data[i];
//             data_page.content = JSON.parse(data_page.content);
//             addPage(data_page, book, res.data.data[i].page_number);

//             var index = $scope.unloaded.indexOf(res.data.data[i].page_number);
//             if (index !== -1) $scope.unloaded.splice(index, 1);
//           }

//           i++;
//           $scope.getData(i, book);
//         }
        
//       })
//     } else {
//       $scope.first_time_load = true;
//     }
    
//   }

//   $(".magazine").bind("turned", function(event, pageObject, corner) {
//     $scope.time_turned_page++;
//     if ($scope.time_turned_page > 1) {
//       if (pageObject) $scope.current_page = $(".magazine").turn("page");
//       $location.search({'page': $scope.current_page});
//       $scope.$apply()
//     }
//   });
  

//   $scope.getStyle = function(button) {
//     if (button.x && button.y) {
//       return { 
//         'left': button.x,
//         'top': button.y,
//         'position': 'absolute',
//         'z-index': 1,
//       }
//     } else return { 'z-index': 1 };
//   }
//   $scope.goToPage = function(page) {
//     $('.magazine').turn('page', page);
//   }

//   $scope.loadApp = function() {

//     $('#canvas').fadeIn(1000);
 
//     var flipbook = $('.magazine');
 
//     // Check if the CSS was already loaded
   
//    if (flipbook.width()==0 || flipbook.height()==0) {
//      setTimeout($scope.loadApp, 10);
//      return;
//    }
//    let window_width = $(window).width();
//    let window_height = $(window).height();

//    let width = $(window).width() - 50;
//    let height = ($(window).width() - 50) / 0.72;
//    if (height >= window_height) {
//      height = window_height * 0.9; 
//      width = height * 0.72; 
//    }
//    // Create the flipbook
//    flipbook.turn({
       
//        // Magazine width
 
//        width: $(window).width(),
 
//        // Magazine height
 
//        height: ($(window).width()) / 0.72 ,
 
//        // Duration in millisecond
 
//        duration: 2000,
 
//        // Hardware acceleration
 
//        acceleration: !isChrome(),
 
//        // Enables gradients
 
//        gradients: true,
       
//        // Auto center this flipbook
 
//        autoCenter: true,
 
//        // Elevation from the edge of the flipbook when turning a page
 
//        elevation: 50,
 
//        // The number of pages
 
//        pages: $scope.data.length,

//        page: $scope.current_page,
 
//        // Events
 
//        when: {
//         //  turning: function(event, page, view) {
           
//         //    var book = $(this);
//         //    var current_page = book.turn('page');

//         //    newPage = page;

//         //    page_in_array = newPage - 1;
//         //   if (newPage < $scope.data.length) {
            
//         //     if (current_page < newPage) {
//         //       if (!$scope.pages[page_in_array + 1]) {
//         //         addPage($scope.data[page_in_array + 1], $(this), newPage + 1);
//         //       }

//         //     } else {
//         //       if (page_in_array - 1 >= 0) {
//         //         if (!$scope.pages[page_in_array - 1]) {
//         //           addPage($scope.data[page_in_array - 1], $(this), newPage - 1);
//         //         }
//         //       }
              

//         //     }
              
//         //   }

//         //  },
 
//          turned: function(event, page, view) {
 
//            $(this).turn('center');
 
//            if (page==1) { 
//              $(this).turn('peel', 'br');
//            }
 
//          },
 
//          missing: function (event, pages) {
//            // Add pages that aren't in the magazine
//            for (var i = 0; i < pages.length; i++) {
//             if ($scope.data[pages[i] - 1]) {
//               addPage($scope.data[pages[i] - 1], $(this), pages[i]);
//             } else {
//               $scope.unloaded.push(pages[i])
//             }
//            }
//            console.log($scope.first_time_load)
//            if(!$scope.first_time_load) {
//              $scope.getData(0, $(this));
//            }
 
//          },
         
//        }
 
//    });

//    $('.magazine').turn('page', $scope.current_page)
//    $(".magazine").turn("display", "single");
//    // Zoom.js
 
//    $('.magazine-viewport').zoom({
//      flipbook: $('.magazine'),
 
//      max: function() { 
       
//        return largeMagazineWidth()/$('.magazine').width();
 
//      }, 
 
//      when: {
 
//        swipeLeft: function() {
 
//          $(this).zoom('flipbook').turn('next');
 
//        },
 
//        swipeRight: function() {
         
//          $(this).zoom('flipbook').turn('previous');
 
//        },
 
//        resize: function(event, scale, page, pageElement) {
        
//          if (scale==1)
//            loadSmallPage(page, pageElement);
//          else
//            loadLargePage(page, pageElement);
 
//        },
 
//        zoomIn: function () {
 
//          $('.thumbnails').hide();
//          $('.made').hide();
//          $('.magazine').removeClass('animated').addClass('zoom-in');
//          $('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');
         
//          if (!window.escTip && !$.isTouch) {
//            escTip = true;
 
//            $('<div />', {'class': 'exit-message'}).
//              html('<div>Press ESC to exit</div>').
//                appendTo($('body')).
//                delay(2000).
//                animate({opacity:0}, 500, function() {
//                  $(this).remove();
//                });
//          }
//        },
 
//        zoomOut: function () {
 
//          $('.exit-message').hide();
//          $('.thumbnails').fadeIn();
//          $('.made').fadeIn();
//          $('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');
 
//          setTimeout(function(){
//            $('.magazine').addClass('animated').removeClass('zoom-in');
//            resizeViewport();
//          }, 0);
 
//        }
//      }
//    });
 
//    // Zoom event
 
//    $('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
 
 
//    // Using arrow keys to turn the page
 
//    $(document).keydown(function(e){
 
//      var previous = 37, next = 39, esc = 27;
 
//      switch (e.keyCode) {
//        case previous:
 
//          // left arrow
//          $('.magazine').turn('previous');
//          e.preventDefault();
 
//        break;
//        case next:
 
//          //right arrow
//          $('.magazine').turn('next');
//          e.preventDefault();
 
//        break;
//        case esc:
         
//          $('.magazine-viewport').zoom('zoomOut');	
//          e.preventDefault();
 
//        break;
//      }
//    });
 
//    $(window).resize(function() {
//      resizeViewport();
//    }).bind('orientationchange', function() {
//      resizeViewport();
//    });
 
 
//    $('.thumbnails li').
//      bind($.mouseEvents.over, function() {
       
//        $(this).addClass('thumb-hover');
 
//      }).bind($.mouseEvents.out, function() {
       
//        $(this).removeClass('thumb-hover');
 
//      });
 
//    if ($.isTouch) {
   
//      $('.thumbnails').
//        addClass('thumbanils-touch').
//        bind($.mouseEvents.move, function(event) {
//          event.preventDefault();
//        });
 
//    } else {
 
//      $('.thumbnails ul').mouseover(function() {
 
//        $('.thumbnails').addClass('thumbnails-hover');
 
//      }).mousedown(function() {
 
//        return false;
 
//      }).mouseout(function() {
 
//        $('.thumbnails').removeClass('thumbnails-hover');
 
//      });
 
//    }
 
//    // Events for the next button
 
//    $('.next-button').bind($.mouseEvents.over, function() {
     
//      $(this).addClass('next-button-hover');
 
//    }).bind($.mouseEvents.out, function() {
     
//      $(this).removeClass('next-button-hover');
 
//    }).bind($.mouseEvents.down, function() {
     
//      $(this).addClass('next-button-down');
 
//    }).bind($.mouseEvents.up, function() {
     
//      $(this).removeClass('next-button-down');
 
//    }).click(function() {
     
//      $('.magazine').turn('next');
 
//    });
 
//    // Events for the next button
   
//    $('.previous-button').bind($.mouseEvents.over, function() {
     
//      $(this).addClass('previous-button-hover');
 
//    }).bind($.mouseEvents.out, function() {
     
//      $(this).removeClass('previous-button-hover');
 
//    }).bind($.mouseEvents.down, function() {
     
//      $(this).addClass('previous-button-down');
 
//    }).bind($.mouseEvents.up, function() {
     
//      $(this).removeClass('previous-button-down');
 
//    }).click(function() {
     
//      $('.magazine').turn('previous');
 
//    });
 
 
//    resizeViewport();
 
//    $('.magazine').addClass('animated');
 
//  }
//  /*
// * Magazine sample
// */

// function addPage(page, book, index) {

// // Create a new element for this page
// var element = $('<div />', {});

// // Add the page to the flipbook
// if (book.turn('addPage', element, index)) {
//   // Add the initial HTML
//   // It will contain a loader indicator and a gradient
//   element.html('<div class="gradient"></div><div class="loader"></div>');

//   // Load the page
//   loadPage(page, element);
// }

// }

// function loadPage(page, pageElement) {
// // Create an image element
// var img = $('<img />');

// img.mousedown(function(e) {
//   e.preventDefault();
// });

// img.load(function() {
  
//   // Set the size
//   $(this).css({width: '100%', height: '100%'});

//   // Add the image to the page after loaded

//   $(this).appendTo(pageElement);

//   // Remove the loader indicator
  
//   pageElement.find('.loader').remove();
// });

// for (let i = 0; i < page.content.btns.length; i++) {
//   var link = $('<a class="button-link"><i class="fa fa-external-link" aria-hidden="true"></i></a>');
//   link.attr('href', page.content.btns[i].url);
//   link.css({
//     left: page.content.btns[i].x,
//     top: page.content.btns[i].y,
//     position: 'absolute',
//   })
//   link.appendTo(pageElement)
// }


// // Load the page

// img.attr('src',page.content.url);

// // for (let i = 0; i < page.content.btns.length; i++) {
// //   var link = $('<a />');
// //   link.css({
// //     left: page.content.btns[i].x,
// //     top: page.content.btns[i].y,
// //     position: 'absolute',
// //     'z-index': 1
// //   });
// //   link.appendTo(pageElement);
// // }

// // loadRegions(page, pageElement);

// }

// // Zoom in / Zoom out

// function zoomTo(event) {

//   setTimeout(function() {
//     if ($('.magazine-viewport').data().regionClicked) {
//       $('.magazine-viewport').data().regionClicked = false;
//     } else {
//       if ($('.magazine-viewport').zoom('value')==1) {
//         $('.magazine-viewport').zoom('zoomIn', event);
//       } else {
//         $('.magazine-viewport').zoom('zoomOut');
//       }
//     }
//   }, 1);

// }

// // Load large page

// function loadLargePage(page, pageElement) {

// var img = $('<img />');

// img.load(function() {

//   var prevImg = pageElement.find('img');
//   $(this).css({width: '100%', height: '100%'});
//   $(this).appendTo(pageElement);
//   prevImg.remove();
  
// });

// // Loadnew page
// img.attr('src', $scope.pages[page-1].content.backgroundUrl);
// }

// // Load small page

// function loadSmallPage(page, pageElement) {

// var img = pageElement.find('img');

// img.css({width: '100%', height: '100%'});

// img.unbind('load');
// // Loadnew page

// img.attr('src', $scope.pages[page-1].content.backgroundUrl);
// }

// // http://code.google.com/p/chromium/issues/detail?id=128488

// function isChrome() {

// return navigator.userAgent.indexOf('Chrome')!=-1;

// }


// // Set the width and height for the viewport

// function resizeViewport() {

// var width = $(window).width(),
//   height = $(window).height(),
//   options = $('.magazine').turn('options');

// $('.magazine').removeClass('animated');

// $('.magazine-viewport').css({
//   width: width,
//   height: height
// }).
// zoom('resize');


// if ($('.magazine').turn('zoom')==1) {
//   var bound = calculateBound({
//     width: options.width,
//     height: options.height,
//     boundWidth: Math.min(options.width, width),
//     boundHeight: Math.min(options.height, height)
//   });

//   if (bound.width%2!==0)
//     bound.width-=1;

    
//   if (bound.width!=$('.magazine').width() || bound.height!=$('.magazine').height()) {

//     $('.magazine').turn('size', bound.width, bound.height);

//     if ($('.magazine').turn('page')==1)
//       $('.magazine').turn('peel', 'br');

//     $('.next-button').css({height: bound.height, backgroundPosition: '-38px '+(bound.height/2-32/2)+'px'});
//     $('.previous-button').css({height: bound.height, backgroundPosition: '-4px '+(bound.height/2-32/2)+'px'});
//   }

//   $('.magazine').css({top: -bound.height/2, left: -bound.width/2});

  
// }

// var magazineOffset = $('.magazine').offset(),
//   boundH = height - magazineOffset.top - $('.magazine').height(),
//   marginTop = (boundH - $('.thumbnails > div').height()) / 2;

// if (marginTop<0) {
//   $('.thumbnails').css({height:1});
// } else {
//   $('.thumbnails').css({height: boundH});
//   $('.thumbnails > div').css({marginTop: marginTop});
// }

// if (magazineOffset.top<$('.made').height())
//   $('.made').hide();
// else
//   $('.made').show();

// $('.magazine').addClass('animated');

// }

// // Width of the flipbook when zoomed in

// function largeMagazineWidth() {
  
//   return 2214;

// }

// // decode URL Parameters

// function decodeParams(data) {

//   var parts = data.split('&'), d, obj = {};

//   for (var i =0; i<parts.length; i++) {
//     d = parts[i].split('=');
//     obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
//   }

//   return obj;
// }

// // Calculate the width and height of a square within another square

// function calculateBound(d) {
  
//   var bound = {width: d.width, height: d.height};

//   if (bound.width>d.boundWidth || bound.height>d.boundHeight) {
    
//     var rel = bound.width/bound.height;

//     if (d.boundWidth/rel>d.boundHeight && d.boundHeight*rel<=d.boundWidth) {
      
//       bound.width = Math.round(d.boundHeight*rel);
//       bound.height = d.boundHeight;

//     } else {
      
//       bound.width = d.boundWidth;
//       bound.height = Math.round(d.boundWidth/rel);
    
//     }
//   }
    
//   return bound;
// }
// })