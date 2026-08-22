<audio id="bgm" src="/music/ambient.mp3" autoplay loop></audio>
<script>
const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];
let i = 0;
setInterval(() => {
  document.body.style.backgroundImage = `url(${images[i]})`;
  i = (i + 1) % images.length;
}, 10000);
</script>
