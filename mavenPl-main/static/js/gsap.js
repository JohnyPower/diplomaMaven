gsap.registerPlugin(ScrollTrigger);


var sections = gsap.utils.toArray(".attribute").forEach(function(elem, i) {

  const dx = [600, -400, -500, 300, 800, -120]
  const dy = [-50, 20, -150, -120, -80, 40]
  const dr = [-190, 200, 60, -290, 230, -540]


  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: elem,
      start: "top 500",
      scrub: 0.2,
    },
  })
  .to( elem, {
    x: dx[i],
    y: dy[i],
    rotation: dr[i],
  } )
});