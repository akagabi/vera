if(!self.define){let e,i={};const n=(n,c)=>(n=new URL(n+".js",c).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(c,s)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let d={};const o=e=>n(e,r),t={module:{uri:r},exports:d,require:o};i[r]=Promise.all(c.map((e=>t[e]||o(e)))).then((e=>(s(...e),d)))}}define(["./workbox-74f2ef77"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-B4M0b48v.css",revision:null},{url:"assets/index-B9zqb22T.js",revision:null},{url:"index.html",revision:"d51dda16ed9b5ab83c2356c71e70dc8d"},{url:"registerSW.js",revision:"3b5d9eb28051d548b6510ff1e202c001"},{url:"apple-touch-icon.png",revision:"7215ee9c7d9dc229d2921a40e899ec5f"},{url:"favicon.ico",revision:"7215ee9c7d9dc229d2921a40e899ec5f"},{url:"masked-icon.svg",revision:"c769c2730ef93556f8d1ac225b38093a"},{url:"pwa-192x192.png",revision:"7215ee9c7d9dc229d2921a40e899ec5f"},{url:"pwa-512x512.png",revision:"7215ee9c7d9dc229d2921a40e899ec5f"},{url:"manifest.webmanifest",revision:"d2ff2f041602a0d14de47c0fc1ce7975"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/api\.exchangerate\.host\/.*/i,new e.CacheFirst({cacheName:"currency-api-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:86400})]}),"GET")}));
