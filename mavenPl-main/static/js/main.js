// Timer
document.addEventListener('DOMContentLoaded', (event) => {
  // Set the date we're counting down to
  var countDownDate = new Date("Jan 5, 2025 15:37:25").getTime();

  // Update the count down every 1 second
  var x = setInterval(function() {

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="countdown"
      document.getElementById("countdown").innerHTML = days + "d " + hours + "h " +
          minutes + "m " + seconds + "s ";

      // If the count down is over, write some text
      if (distance < 0) {
          clearInterval(x);
          document.getElementById("countdown").innerHTML = "EXPIRED";
      }
  }, 1000);
});

// Dark Mode
document.addEventListener('DOMContentLoaded', (event) => {
    const toggleBtn = document.getElementById('darkMode');
    const body = document.body;

    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className=savedTheme;
    } else {
    // If no theme preference is saved, default to light mode
    body.className='crypt-dark';
    }

    toggleBtn.addEventListener('click', () => {
    if (body.classList.contains('crypt-light')) {
        body.classList.replace('crypt-light', 'crypt-dark');
        localStorage.setItem('theme', 'crypt-dark'); // Save the theme to localStorage
    } else {
        body.classList.replace('crypt-dark', 'crypt-light');
        localStorage.setItem('theme', 'crypt-light'); // Save the theme to localStorage
    }
    });
});

/* Scroll-based animations */
document.addEventListener('DOMContentLoaded', (event) => {
  var $animation_elements = $('.animation-element');
  var $window = $(window);

  function check_if_in_view() {
      var window_height = $window.height();
      var window_top_position = $window.scrollTop();
      var window_bottom_position = (window_top_position + window_height);

      $.each($animation_elements, function() {
          var $element = $(this);
          var element_height = $element.outerHeight();
          var element_top_position = $element.offset().top;
          var element_bottom_position = (element_top_position + element_height);

          //check to see if this current container is within viewport
          if ((element_bottom_position >= window_top_position) &&
              (element_top_position <= window_bottom_position)) {
              $element.addClass('in-view');
          } else {
              $element.removeClass('in-view');
          }
      });
  }

  $window.on('scroll resize', check_if_in_view);
  $('#myModal').on('shown.bs.modal', function(e) {
      check_if_in_view();
  });
  $window.trigger('scroll');
});

/* Tooltip Trigger */
document.addEventListener('DOMContentLoaded', (event) => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});

/* Encrypt Value */
document.addEventListener('DOMContentLoaded', (event) => {
  let crypt_state = false;
  let _el = document.getElementById('encrypt');
  if (_el) {
      _el.addEventListener('click', function() {
          crypt_state = !crypt_state;
          let elements = document.querySelectorAll(".encrypted");
          elements.forEach((el) => el.innerText = crypt_state ? "***" : el.dataset.content);
      });
  }

  window.addEventListener("DOMContentLoaded", function() {
      let elements = document.querySelectorAll(".encrypted");
      elements.forEach((el) => el.setAttribute("data-content", el.innerText));
  })
});

/*--- Chart ---*/
document.addEventListener('DOMContentLoaded', (event) => {
  // colors
  var colors = ['#007bff', '#28a745', '#ffcd2d', '#7000f0', '#dc3545', '#c90097'];

  var donutOptions = {
      cutoutPercentage: 60,
      legend: {
          position: 'right',
          padding: 0,
          labels: {
              pointStyle: 'circle',
              usePointStyle: true
          }
      }
  };

  // Configuration
  var chDonutData = {
      labels: ['BTC', 'DOT', 'ETH', 'DOGE'],
      datasets: [{
          backgroundColor: colors.slice(0, 4),
          borderWidth: 0,
          data: [40, 11, 40, 20]
      }]
  };

  var chDonut = document.getElementById("chDonut");
  if (chDonut) {
      new Chart(chDonut, {
          type: 'pie',
          data: chDonutData,
          options: donutOptions
      });
  }
});

/*--- Dropdown on Hover ---*/
document.addEventListener('DOMContentLoaded', (event) => {
  $(document).ready(function() {
      $('.dropdown').hover(function() {
          $(this).addClass('show');
          $(this).find('.dropdown-menu-shows').addClass('show');
      }, function() {
          $(this).removeClass('show');
          $(this).find('.dropdown-menu-shows').removeClass('show');
      });
  });

  $(document).ready(function() {
      $('.dropdown').hover(function() {
          $(this).find('.dropdown-menu-shows')
              .stop(true, true).delay(50).fadeIn(200);
      }, function() {
          $(this).find('.dropdown-menu-shows')
              .stop(true, true).delay(50).fadeOut(200);
      });
  });
});

// Favorite Button
document.addEventListener('DOMContentLoaded', (event) => {
  $('.favme').click(function() {
      $(this).toggleClass('active');
  });

  /* when a user clicks, toggle the 'is-animating' class */
  $(".favme").on('click touchstart', function() {
      $(this).toggleClass('is_animating');
  });

  /*when the animation is over, remove the class*/
  $(".favme").on('animationend', function() {
      $(this).toggleClass('is_animating');
  });
});

// Scrollspy
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('#nav-tab>[data-bs-toggle="tab"]').forEach(el => {
      el.addEventListener('shown.bs.tab', () => {
          const target = el.getAttribute('data-bs-target')
          const scrollElem = document.querySelector(`${target} [data-bs-spy="scroll"]`)
          bootstrap.ScrollSpy.getOrCreateInstance(scrollElem).refresh()
      })
  })
});

// ApexChart
document.addEventListener('DOMContentLoaded', (event) => {
  const chartOptions = {
      chart: {
          type: "area",
          height: 120,
          toolbar: {
              show: false
          },
          zoom: {
              enabled: false
          }
      },
      colors: ["#0d6efd"],
      series: [{
          name: "Total Assets",
          data: [0.00, 0.00, 4.55, 0.00, 0.00, 0.00]
      }],
      dataLabels: {
          enabled: false
      },
      stroke: {
          width: 3,
          curve: "smooth"
      },
      fill: {
          type: "gradient",
          gradient: {
              shadeIntensity: 0,
              opacityFrom: 0.4,
              opacityTo: 0,
              stops: [0, 90, 100]
          }
      },
      xaxis: {
          categories: ["Feb", "Apr", "Jun", "Aug", "Oct", "Dec"],
          axisBorder: {
              show: false
          },
          labels: {
              style: {
                  colors: "#adb5bd",
                  fontFamily: "inter"
              }
          }
      },
      yaxis: {
          show: false
      },
      grid: {
          borderColor: "rgba(0, 0, 0, 0, 0)",
          padding: {
              top: -30,
              bottom: -8,
              left: 12,
              right: 12
          }
      },
      tooltip: {
          enabled: true,
          y: {
              formatter: value => `${value} BTC`
          },
          style: {
              fontFamily: "inter"
          }
      },
      markers: {
          show: true
      }
  }

  const chart = new ApexCharts(document.querySelector(".chart-area"), chartOptions)
  chart.render()
});

// Price Meter
document.addEventListener('DOMContentLoaded', (event) => {
  (function() {
      var leaseMeter, meterBar, meterBarWidth, meterValue, progressNumber;

      /*Get value of value attribute*/
      var valueGetter = function() {
          leaseMeter = document.getElementsByClassName('leaseMeter');
          for (var i = 0; i < leaseMeter.length; i++) {
              meterValue = leaseMeter[i].getAttribute('value');
              return meterValue;
          }
      }

      /*Convert value of value attribute to percentage*/
      var getPercent = function() {
          meterBarWidth = parseInt(valueGetter()) * 0.10;
          meterBarWidth.toString;
          meterBarWidth = meterBarWidth + "%";
          return meterBarWidth;
      }

      /*Apply percentage to width of .meterBar*/
      var adjustWidth = function() {
          meterBar = document.getElementsByClassName('meterBar');
          for (var i = 0; i < meterBar.length; i++) {
              meterBar[i].style['width'] = getPercent();
          }
      }

      /*Update value indicator*/
      var indicUpdate = function() {
          progressNumber = document.getElementsByClassName('progressNumber');
          for (var i = 0; i < progressNumber.length; i++) {
              progressNumber[i].innerHTML = valueGetter();
          }
      }

      adjustWidth();
      indicUpdate();
  })();
});

// Validation
document.addEventListener('DOMContentLoaded', (event) => {
  (() => {
      'use strict'

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll('.needs-validation')

      // Loop over them and prevent submission
      Array.from(forms).forEach(form => {
          form.addEventListener('submit', event => {
              if (!form.checkValidity()) {
                  event.preventDefault()
                  event.stopPropagation()
              }

              form.classList.add('was-validated')
          }, false)
      })
  })();
});

// Password Strength
document.addEventListener('DOMContentLoaded', (event) => {
  $('#password').keyup(function(e) {
      var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
      var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
      var enoughRegex = new RegExp("(?=.{6,}).*", "g");
      if (false == enoughRegex.test($(this).val())) {
          $('#passstrength').html('More characters');
          document.getElementById("passstrength").style.color = "#dc3545";
      } else if (strongRegex.test($(this).val())) {
        document.getElementById("passstrength").style.color = "#0d6efd";
          $('#passstrength').html('Strong!');
      } else if (mediumRegex.test($(this).val())) {
        document.getElementById("passstrength").style.color = "#0dcaf0";
          $('#passstrength').html('Medium!');
      } else {
          document.getElementById("passstrength").style.color = "#ffc107";
          $('#passstrength').html('Weak!');
      }
      return true;
  });
});


// Password Visibility
var state = false;

function toggle() {
    if (state) {
        document.getElementById("password").setAttribute("type", "password");
        document.getElementById("eye").style.color = "#7a797e";
        state = false;
    } else {
        document.getElementById("password").setAttribute("type", "text");
        document.getElementById("eye").style.color = "#0d6efd";
        state = true;
    }
}


// Newsletter Signup Button
document.addEventListener('DOMContentLoaded', (event) => {
    (function () {
        $(document).mousemove(function (e) {
            var mX = e.pageX;
            var mY = e.pageY;
            var from = { x: mX, y: mY };
            var $n = $(".signup-btn");
            var off = $n.offset(),
                nx1 = off.left,
                ny1 = off.top,
                nx2 = nx1 + $n.outerWidth(),
                ny2 = ny1 + $n.outerHeight(),
                maxX1 = Math.max(mX, nx1),
                minX2 = Math.min(mX, nx2),
                maxY1 = Math.max(mY, ny1),
                minY2 = Math.min(mY, ny2),
                intersectX = minX2 >= maxX1,
                intersectY = minY2 >= maxY1,
                to = {
                    x: intersectX ? mX : nx2 < mX ? nx2 : nx1,
                    y: intersectY ? mY : ny2 < mY ? ny2 : ny1,
                };
            var distX = to.x - from.x,
                distY = to.y - from.y,
                hypot = Math.sqrt(distX * distX + distY * distY);
            final = Math.round(hypot);
    
            $("#distance_text").text(final); //this will output 0 when next to your element.
    
            if (final == 0) {
                // document.getElementById("news").style.color = "yellow"
                document.getElementById("news").classList.add("active");
            } else {
                // document.getElementById("news").style.color = "black"
                document.getElementById("news").classList.remove("active");
            }
        });
    })();
});


// Popovers
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

//Sidebar Collapse
document.addEventListener("DOMContentLoaded", function() {
    let arrow_el = document.getElementById("sidebar-collapse");
    let body_el = document.querySelector("body");
    if(!arrow_el || !body_el) return null;
  
    arrow_el.addEventListener("click", function() {
      body_el.classList.toggle("sidebar-close");
    });
  });


//mobile sidebar toggle
  document.addEventListener("DOMContentLoaded", function() {
    let arrow_el = document.getElementById("sidebar-mobile-toggle");
    let body_el = document.querySelector("body");
    if(!arrow_el || !body_el) return null;
  
    arrow_el.addEventListener("click", function() {
      body_el.classList.toggle("sidebar-mobile-close");
    });
  });

