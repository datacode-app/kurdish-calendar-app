if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const o=e=>a(e,c),r={module:{uri:c},exports:t,require:o};s[c]=Promise.all(n.map((e=>r[e]||o(e)))).then((e=>(i(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"5ff9fa8c465c0b609c47671e8c904447"},{url:"/_next/static/Ss8WvjQotyvSoOwo_Q_P-/_buildManifest.js",revision:"17bdd52420b570d724cef16a1417facb"},{url:"/_next/static/Ss8WvjQotyvSoOwo_Q_P-/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/13b76428.88a93620c41fc7e7.js",revision:"88a93620c41fc7e7"},{url:"/_next/static/chunks/264.2430b203b2bc1c42.js",revision:"2430b203b2bc1c42"},{url:"/_next/static/chunks/365-c830e4d53cfd650f.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/37-6c93231e914d2064.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/4bd1b696-6c4b3dc7c99c238e.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/564.ba68e558543b818c.js",revision:"ba68e558543b818c"},{url:"/_next/static/chunks/587-45243dae2791f662.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/6-90fbef15e2204ffa.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/641.d8d9f8a8eaae9f5a.js",revision:"d8d9f8a8eaae9f5a"},{url:"/_next/static/chunks/724.e3b9c26f7855e225.js",revision:"e3b9c26f7855e225"},{url:"/_next/static/chunks/725.ea7abbe70106ca10.js",revision:"ea7abbe70106ca10"},{url:"/_next/static/chunks/760-27db8dd0f04dbe90.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/771.3e538ab6f21c9d3c.js",revision:"3e538ab6f21c9d3c"},{url:"/_next/static/chunks/82.8a408301bc9c7de1.js",revision:"8a408301bc9c7de1"},{url:"/_next/static/chunks/882-e540b3b889e50c77.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/935-e7360f17c193a82a.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/%5Blocale%5D/about/page-06dca365f54208b6.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/%5Blocale%5D/calendar/page-8e7230a17fb34392.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/%5Blocale%5D/events/page-e398171f427d2bdb.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/%5Blocale%5D/layout-217623426231355e.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/%5Blocale%5D/page-b2f78abd8ca428b5.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/%5Blocale%5D/time/page-5eb8acd823af100c.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/_not-found/page-5d99bd1bdaee2428.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/layout-ffddd3ec53b3b54a.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/app/page-ed95ae4cc249045a.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/framework-bd98995f121cf294.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/main-app-ff0e760152b56bad.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/main-edd25aee28856c8b.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/pages/_app-eef484fc49b57a90.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/pages/_error-5933f280f2bada68.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-1174353543b13da8.js",revision:"Ss8WvjQotyvSoOwo_Q_P-"},{url:"/_next/static/css/5a7fab311702e63d.css",revision:"5a7fab311702e63d"},{url:"/_next/static/css/d498c84e4ab246b3.css",revision:"d498c84e4ab246b3"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/data/holidays.json",revision:"c19a1781d3e21229eedc3c8f63ac362b"},{url:"/favicon/apple-touch-icon.png",revision:"62e1f800ed8bca740e5541cb63676684"},{url:"/favicon/favicon-96x96.png",revision:"0fc9b38b88d251f9535b2616170e8070"},{url:"/favicon/favicon.ico",revision:"62d0438daea12b2b448fce5c432c227b"},{url:"/favicon/favicon.svg",revision:"78b0fed38b4007194f96e1f9ac48a2a7"},{url:"/favicon/site.webmanifest",revision:"433fce523f10a16b41926ffc706c2ff5"},{url:"/favicon/web-app-manifest-192x192.png",revision:"f7624802971be66a43a504734553a55c"},{url:"/favicon/web-app-manifest-512x512.png",revision:"f748f25e35fcba832bb36e3df2535fc6"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/fonts/Vazirmatn-Black.woff2",revision:"6cfb460b4140c8544af1cee2e23359a2"},{url:"/fonts/Vazirmatn-Bold.woff2",revision:"7958481fe611c2574940c172068921bb"},{url:"/fonts/Vazirmatn-ExtraBold.woff2",revision:"a0f99309cd35ee8634cac7d7f6d9f9bc"},{url:"/fonts/Vazirmatn-ExtraLight.woff2",revision:"3d8ceebeffb457d5cb97b08977e23a3f"},{url:"/fonts/Vazirmatn-Light.woff2",revision:"6458eed8cf924e973b43dac780a737f8"},{url:"/fonts/Vazirmatn-Medium.woff2",revision:"dd2193b32cbe791734c97e4e167816bf"},{url:"/fonts/Vazirmatn-Regular.woff2",revision:"cdc140628f111dc1f6185775f968e379"},{url:"/fonts/Vazirmatn-SemiBold.woff2",revision:"9260c192787251165aacac4e12c997ad"},{url:"/fonts/Vazirmatn-Thin.woff2",revision:"99086e7ee7b05991f5b02b7647952c4b"},{url:"/fonts/Vazirmatn[wght].woff2",revision:"f6d31671339db80142ceaf6382570e79"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/holidays.json",revision:"bad857dd87a59eb72c18c80677a7ed3c"},{url:"/images/HYMkb3RyRWOu4Joa0rl3kg.webp",revision:"e6ce1a5df19fe26d59677945828a516e"},{url:"/images/og-image.jpg",revision:"189de79c9d09bc1b2295990b2e1d58df"},{url:"/locale/ar/common.json",revision:"58bb36b207ac280039e7bfc8657fb504"},{url:"/locale/en/common.json",revision:"2d22e57eb9ef53d674dda40f2b9e9615"},{url:"/locale/fa/common.json",revision:"03ecb765bd6ea3a68e51c14c9a667b0b"},{url:"/locale/ku/common.json",revision:"61b2cd6061f06453b14c1159543a3fe8"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/site.webmanifest",revision:"18deee89a0ed6752d85cd2a446117fc1"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
