(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const m of document.querySelectorAll('link[rel="modulepreload"]'))a(m);new MutationObserver(m=>{for(const o of m)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function t(m){const o={};return m.integrity&&(o.integrity=m.integrity),m.referrerPolicy&&(o.referrerPolicy=m.referrerPolicy),m.crossOrigin==="use-credentials"?o.credentials="include":m.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(m){if(m.ep)return;m.ep=!0;const o=t(m);fetch(m.href,o)}})();const d=256,u=31764,E=6708,T=10720,f=10716;function P(e){const n=e.getUint32(E,!0),t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);for(let a=0;a<t.length;++a)t[a]=(t[a]^n)&255;e.setUint32(E,n,!0)}function A(e){return e.getUint32(f,!0)}function S(e,n){let t=R[n];const a=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);for(let m=0;m<a.length;++m){if(m==f){m+=3;continue}t+=a[m]}return t}const R={protoman:114,colonel:24},h={"REXE5TOB 20041006 US":{region:"US",version:"protoman"},"REXE5TOK 20041006 US":{region:"US",version:"colonel"},"REXE5TOB 20041104 JP":{region:"JP",version:"protoman"},"REXE5TOK 20041104 JP":{region:"JP",version:"colonel"}},w=class{constructor(e,n){this.dv=new DataView(e),this.gameInfo=n}static sramDumpToRaw(e){return e=e.slice(d,d+u),P(new DataView(e)),e}static rawToSRAMDump(e){const n=new Uint8Array(65536);return n.set(new Uint8Array(e),d),P(new DataView(n.buffer,d,u)),n.buffer}static sniff(e){if(e.byteLength!=u)throw"invalid byte length of save file: expected "+u+" but got "+e.byteLength;e=e.slice(0);const n=new DataView(e),a=new TextDecoder("ascii").decode(new Uint8Array(n.buffer,n.byteOffset+T,20));if(!Object.prototype.hasOwnProperty.call(h,a))throw"unknown game name: "+a;if(A(n)!=S(n,h[a].version))throw"checksum mismatch";return h[a]}computeChecksum(){return S(this.dv,this.gameInfo.version)}rebuild(){this.rebuildChecksum()}toSRAMDump(){return w.rawToSRAMDump(this.dv.buffer)}getChecksum(){return A(this.dv)}rebuildChecksum(){return this.dv.setUint32(f,this.computeChecksum(),!0)}getPatchCardCount(){return this.dv.getUint8(31136)}setPatchCardCount(e){this.dv.setUint8(31136,e)}getPatchCard(e){if(e>=this.getPatchCardCount())return null;const n=this.dv.getUint8(31184+e);return{id:n&127,enabled:!(n>>7)}}setPatchCard(e,n,t){this.dv.setUint8(31184+e,n|(t?0:1)<<7)}};let s=w;s.PATCH_CARD_INFO=[{name:"",mb:0},{name:"Mettaur",mb:7},{name:"VolGear",mb:12},{name:"Ghost",mb:15},{name:"Swordy",mb:10},{name:"Fishy",mb:18},{name:"Piranha",mb:10},{name:"Ratty",mb:10},{name:"Billy",mb:5},{name:"Candela",mb:9},{name:"Anaconda",mb:12},{name:"Mushy",mb:15},{name:"Spikey",mb:6},{name:"Puffball",mb:16},{name:"Yort",mb:17},{name:"Dominerd",mb:18},{name:"Null",mb:13},{name:"BrushMan",mb:19},{name:"Scuttlst",mb:20},{name:"SnowBlow",mb:17},{name:"KillrEye",mb:21},{name:"Quaker",mb:15},{name:"Boomer",mb:18},{name:"Lark",mb:17},{name:"Moloko",mb:5},{name:"Melody",mb:15},{name:"Zomon",mb:20},{name:"Catack",mb:20},{name:"Champy",mb:15},{name:"Whirly",mb:20},{name:"Cactikil",mb:16},{name:"Roll",mb:40},{name:"GutsMan",mb:35},{name:"FireMan",mb:43},{name:"Bass",mb:45},{name:"QuickMan",mb:38},{name:"SnakeMan",mb:40},{name:"BubblMan",mb:37},{name:"FlameMan",mb:45},{name:"MetalMan",mb:46},{name:"ShadeMan",mb:43},{name:"SparkMan",mb:43},{name:"JunkMan",mb:40},{name:"GyroMan",mb:45},{name:"Meddy",mb:45},{name:"CosmoMan",mb:44},{name:"Chaud's Custom",mb:35},{name:"Mr.-Match's Custom",mb:35},{name:"Count-Zap's Custom",mb:35},{name:"Anetta's Custom",mb:47},{name:"Chillski's Custom",mb:47},{name:"Bugtank",mb:7},{name:"Powie",mb:10},{name:"Froshell",mb:16},{name:"HardHead",mb:10},{name:"Cloudy",mb:10},{name:"Gaia",mb:15},{name:"Popper",mb:20},{name:"Fan",mb:15},{name:"Drain",mb:18},{name:"Rush",mb:11},{name:"Bunny",mb:8},{name:"Flamey",mb:20},{name:"Shrimpy",mb:10},{name:"RedUFO",mb:20},{name:"Ninjoy",mb:18},{name:"Lavagon",mb:20},{name:"Protecto",mb:23},{name:"Basher",mb:20},{name:"Pengi",mb:18},{name:"Elebee",mb:20},{name:"AlphaBug",mb:16},{name:"N.O",mb:13},{name:"Eleball",mb:14},{name:"Dharma",mb:22},{name:"Weather",mb:19},{name:"Elmperor",mb:20},{name:"CirKill",mb:18},{name:"Drixol",mb:17},{name:"Batty",mb:25},{name:"Appley",mb:24},{name:"WoodMan",mb:45},{name:"ElecMan",mb:35},{name:"ProtoMan",mb:45},{name:"BombMan",mb:43},{name:"MagicMan",mb:44},{name:"HeatMan",mb:45},{name:"GateMan",mb:46},{name:"FlashMan",mb:46},{name:"DrillMan",mb:47},{name:"KingMan",mb:45},{name:"AquaMan",mb:40},{name:"WindMan",mb:46},{name:"LaserMan",mb:47},{name:"Colonel",mb:42},{name:"TmhkMan",mb:40},{name:"Lan's Custom",mb:25},{name:"Dex's Custom",mb:40},{name:"Maddy's Custom",mb:5},{name:"Yahoot's Bug Repair",mb:17},{name:"Tora's Tactics",mb:64},{name:"Life-Virus",mb:55},{name:"Gospel",mb:60},{name:"Serenade",mb:50},{name:"Alpha",mb:55},{name:"BassGS",mb:59},{name:"Duo",mb:70},{name:"BassXX",mb:70},{name:"Nebula-Gray",mb:70},{name:"Dad's Repair Program",mb:50},{name:"Hub Hikari",mb:80},{name:"Bass-Cross MegaMan",mb:70}];const C=document.getElementById("save"),O=document.getElementById("patch-cards"),k=document.getElementById("total-mb"),B=document.getElementById("download"),i=document.getElementById("add-patch-card");function U(e){const n=URL.createObjectURL(e),t=document.createElement("a");t.download="bn5.sav",t.href=n,t.textContent="download",document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(n)}function F(){for(let e=1;e<s.PATCH_CARD_INFO.length;++e){const{name:n,mb:t}=s.PATCH_CARD_INFO[e],a=document.createElement("option");i.appendChild(a),a.textContent=`${n} (${t} MB)`,a.value=e.toString()}}i.addEventListener("change",()=>{if(i.value=="")return;const e=parseInt(i.value);r.setPatchCardCount(r.getPatchCardCount()+1),r.setPatchCard(r.getPatchCardCount()-1,e,!0),i.value="",p()});function _(e,n){const t=e.getPatchCardCount();for(;n<t-1;++n){const{id:a,enabled:m}=e.getPatchCard(n+1);e.setPatchCard(n,a,m)}e.setPatchCardCount(e.getPatchCardCount()-1)}const D=80;function p(){const e=O.querySelector("tbody");e.innerHTML="";let n=0;for(let t=0,a=r.getPatchCardCount();t<a;++t){const{id:m,enabled:o}=r.getPatchCard(t),c=s.PATCH_CARD_INFO[m];o&&(n+=c.mb);const l=document.createElement("tr");e.appendChild(l),o||(l.className="text-body-tertiary");const g=document.createElement("td");l.appendChild(g);const b=document.createElement("button");b.className="btn btn-danger btn-sm",b.innerHTML='<i class="bi bi-x"></i>',b.onclick=(v=>{_(r,v),p()}).bind(null,t),g.appendChild(b);const y=document.createElement("td");l.appendChild(y),y.textContent=c.name;const M=document.createElement("td");l.appendChild(M),M.textContent=c.mb.toString()}k.textContent=n.toString();for(const t of i.querySelectorAll("option")){if(t.value=="")continue;const{mb:a}=s.PATCH_CARD_INFO[parseInt(t.value,10)];t.disabled=n+a>D}}let r;B.addEventListener("click",()=>{if(r==null)return;r.rebuild();const e=new Blob([new Uint8Array(r.toSRAMDump())]);U(e)});C.addEventListener("change",()=>{if(C.files.length==0)return;const e=C.files[0];(async()=>{const n=await e.arrayBuffer();try{const t=s.sramDumpToRaw(n),a=s.sniff(t);r=new s(t,a)}catch(t){alert(`Failed to load save: ${t}`);return}p(),B.disabled=!1,i.disabled=!1})()});F();
