!function(n,e){const t=e.createElement("div");t.style.cssText="\n        position: fixed; \n        top: 0; \n        left: 0; \n        width: 0; \n        height: 3px; \n        box-shadow: 0 0 3px #999; \n        background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet); \n        z-index: 999999; \n        transition: width 0.3s linear;\n    ",e.body.appendChild(t);const i=n.innerHeight||e.documentElement.clientHeight||e.body.clientHeight;n.addEventListener("scroll",(()=>{const n=e.body.offsetHeight-i,o=scrollY/n*100;t.style.width=Math.min(Math.max(o,0),100)+"%"}),!1)}(window,document);
//# sourceMappingURL=preview.js.map