mixins.search={data:()=>({rawSearch:""}),watch:{search(e){let t=this.$refs.timeline.childNodes;for(let i of t)!e||i.dataset.title.includes(e)?(i.style.opacity=1,i.style.visibility="visible",i.style.marginTop=0):(i.style.opacity=0,i.style.visibility="hidden",i.style.marginTop=-i.offsetHeight-30+"px")}},computed:{search(){return this.rawSearch.toLowerCase().replace(/\s+/g,"")}}};
//# sourceMappingURL=jquery-3.7.1.js.map