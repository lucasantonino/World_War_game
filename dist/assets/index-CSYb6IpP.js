var Ul=Object.defineProperty;var Nl=(s,t,e)=>t in s?Ul(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var T=(s,t,e)=>Nl(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const da="170",Fl=0,Na=1,Ol=2,Wo=1,Xo=2,on=3,wn=0,we=1,$e=2,bn=0,Hn=1,Vi=2,Fa=3,Oa=4,zl=5,On=100,Bl=101,kl=102,Gl=103,Hl=104,Vl=200,Wl=201,Xl=202,ql=203,br=204,Er=205,Yl=206,jl=207,Zl=208,$l=209,Kl=210,Jl=211,Ql=212,tc=213,ec=214,wr=0,Tr=1,Ar=2,gi=3,Rr=4,Cr=5,Pr=6,Dr=7,qo=0,nc=1,ic=2,En=0,sc=1,rc=2,ac=3,Yo=4,oc=5,lc=6,cc=7,jo=300,_i=301,vi=302,Ir=303,Lr=304,Bs=306,Wi=1e3,kn=1001,Ur=1002,qe=1003,hc=1004,ts=1005,Ke=1006,Ws=1007,Gn=1008,un=1009,Zo=1010,$o=1011,Xi=1012,ua=1013,Vn=1014,ln=1015,Yi=1016,fa=1017,pa=1018,xi=1020,Ko=35902,Jo=1021,Qo=1022,Xe=1023,tl=1024,el=1025,pi=1026,Mi=1027,nl=1028,ma=1029,il=1030,ga=1031,_a=1033,Cs=33776,Ps=33777,Ds=33778,Is=33779,Nr=35840,Fr=35841,Or=35842,zr=35843,Br=36196,kr=37492,Gr=37496,Hr=37808,Vr=37809,Wr=37810,Xr=37811,qr=37812,Yr=37813,jr=37814,Zr=37815,$r=37816,Kr=37817,Jr=37818,Qr=37819,ta=37820,ea=37821,Ls=36492,na=36494,ia=36495,sl=36283,sa=36284,ra=36285,aa=36286,dc=3200,uc=3201,rl=0,fc=1,Sn="",be="srgb",Si="srgb-linear",ks="linear",Kt="srgb",Zn=7680,za=519,pc=512,mc=513,gc=514,al=515,_c=516,vc=517,xc=518,Mc=519,oa=35044,Ba="300 es",cn=2e3,Ns=2001;class bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ka=1234567;const Gi=Math.PI/180,qi=180/Math.PI;function hn(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(xe[s&255]+xe[s>>8&255]+xe[s>>16&255]+xe[s>>24&255]+"-"+xe[t&255]+xe[t>>8&255]+"-"+xe[t>>16&15|64]+xe[t>>24&255]+"-"+xe[e&63|128]+xe[e>>8&255]+"-"+xe[e>>16&255]+xe[e>>24&255]+xe[n&255]+xe[n>>8&255]+xe[n>>16&255]+xe[n>>24&255]).toLowerCase()}function Ee(s,t,e){return Math.max(t,Math.min(e,s))}function va(s,t){return(s%t+t)%t}function yc(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Sc(s,t,e){return s!==t?(e-s)/(t-s):0}function Hi(s,t,e){return(1-e)*s+e*t}function bc(s,t,e,n){return Hi(s,t,1-Math.exp(-e*n))}function Ec(s,t=1){return t-Math.abs(va(s,t*2)-t)}function wc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Tc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Ac(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Rc(s,t){return s+Math.random()*(t-s)}function Cc(s){return s*(.5-Math.random())}function Pc(s){s!==void 0&&(ka=s);let t=ka+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Dc(s){return s*Gi}function Ic(s){return s*qi}function Lc(s){return(s&s-1)===0&&s!==0}function Uc(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Nc(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Fc(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*d,l*u,a*c);break;case"YZY":s.set(l*u,a*h,l*d,a*c);break;case"ZXZ":s.set(l*d,l*u,a*h,a*c);break;case"XZX":s.set(a*h,l*g,l*p,a*c);break;case"YXY":s.set(l*p,a*h,l*g,a*c);break;case"ZYZ":s.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function We(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Zt(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const ae={DEG2RAD:Gi,RAD2DEG:qi,generateUUID:hn,clamp:Ee,euclideanModulo:va,mapLinear:yc,inverseLerp:Sc,lerp:Hi,damp:bc,pingpong:Ec,smoothstep:wc,smootherstep:Tc,randInt:Ac,randFloat:Rc,randFloatSpread:Cc,seededRandom:Pc,degToRad:Dc,radToDeg:Ic,isPowerOfTwo:Lc,ceilPowerOfTwo:Uc,floorPowerOfTwo:Nc,setQuaternionFromProperEuler:Fc,normalize:Zt,denormalize:We};class Lt{constructor(t=0,e=0){Lt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ee(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class It{constructor(t,e,n,i,r,o,a,l,c){It.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],g=n[8],_=i[0],m=i[3],f=i[6],E=i[1],b=i[4],x=i[7],D=i[2],R=i[5],A=i[8];return r[0]=o*_+a*E+l*D,r[3]=o*m+a*b+l*R,r[6]=o*f+a*x+l*A,r[1]=c*_+h*E+d*D,r[4]=c*m+h*b+d*R,r[7]=c*f+h*x+d*A,r[2]=u*_+p*E+g*D,r[5]=u*m+p*b+g*R,r[8]=u*f+p*x+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,p=c*r-o*l,g=e*d+n*u+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=d*_,t[1]=(i*c-h*n)*_,t[2]=(a*n-i*o)*_,t[3]=u*_,t[4]=(h*e-i*l)*_,t[5]=(i*r-a*e)*_,t[6]=p*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Xs.makeScale(t,e)),this}rotate(t){return this.premultiply(Xs.makeRotation(-t)),this}translate(t,e){return this.premultiply(Xs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Xs=new It;function ol(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Fs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Oc(){const s=Fs("canvas");return s.style.display="block",s}const Ga={};function Bi(s){s in Ga||(Ga[s]=!0,console.warn(s))}function zc(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Bc(s){const t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function kc(s){const t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Wt={enabled:!0,workingColorSpace:Si,spaces:{},convert:function(s,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Kt&&(s.r=dn(s.r),s.g=dn(s.g),s.b=dn(s.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(s.applyMatrix3(this.spaces[t].toXYZ),s.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Kt&&(s.r=mi(s.r),s.g=mi(s.g),s.b=mi(s.b))),s},fromWorkingColorSpace:function(s,t){return this.convert(s,this.workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Sn?ks:this.spaces[s].transfer},getLuminanceCoefficients:function(s,t=this.workingColorSpace){return s.fromArray(this.spaces[t].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,t,e){return s.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function dn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function mi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const Ha=[.64,.33,.3,.6,.15,.06],Va=[.2126,.7152,.0722],Wa=[.3127,.329],Xa=new It().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),qa=new It().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Wt.define({[Si]:{primaries:Ha,whitePoint:Wa,transfer:ks,toXYZ:Xa,fromXYZ:qa,luminanceCoefficients:Va,workingColorSpaceConfig:{unpackColorSpace:be},outputColorSpaceConfig:{drawingBufferColorSpace:be}},[be]:{primaries:Ha,whitePoint:Wa,transfer:Kt,toXYZ:Xa,fromXYZ:qa,luminanceCoefficients:Va,outputColorSpaceConfig:{drawingBufferColorSpace:be}}});let $n;class Gc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{$n===void 0&&($n=Fs("canvas")),$n.width=t.width,$n.height=t.height;const n=$n.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=$n}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Fs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=dn(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(dn(e[n]/255)*255):e[n]=dn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Hc=0;class ll{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Hc++}),this.uuid=hn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(qs(i[o].image)):r.push(qs(i[o]))}else r=qs(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function qs(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Gc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Vc=0;class Te extends bi{constructor(t=Te.DEFAULT_IMAGE,e=Te.DEFAULT_MAPPING,n=kn,i=kn,r=Ke,o=Gn,a=Xe,l=un,c=Te.DEFAULT_ANISOTROPY,h=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vc++}),this.uuid=hn(),this.name="",this.source=new ll(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new It,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==jo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wi:t.x=t.x-Math.floor(t.x);break;case kn:t.x=t.x<0?0:1;break;case Ur:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wi:t.y=t.y-Math.floor(t.y);break;case kn:t.y=t.y<0?0:1;break;case Ur:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Te.DEFAULT_IMAGE=null;Te.DEFAULT_MAPPING=jo;Te.DEFAULT_ANISOTROPY=1;class Qt{constructor(t=0,e=0,n=0,i=1){Qt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(c+1)/2,x=(p+1)/2,D=(f+1)/2,R=(h+u)/4,A=(d+_)/4,I=(g+m)/4;return b>x&&b>D?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=R/n,r=A/n):x>D?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=R/i,r=I/i):D<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(D),n=A/r,i=I/r),this.set(n,i,r,e),this}let E=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-_)/E,this.z=(u-h)/E,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Wc extends bi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Qt(0,0,t,e),this.scissorTest=!1,this.viewport=new Qt(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ke,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Te(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new ll(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wn extends Wc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class cl extends Te{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=qe,this.minFilter=qe,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Xc extends Te{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=qe,this.minFilter=qe,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ji{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const u=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(d!==_||l!==u||c!==p||h!==g){let m=1-a;const f=l*u+c*p+h*g+d*_,E=f>=0?1:-1,b=1-f*f;if(b>Number.EPSILON){const D=Math.sqrt(b),R=Math.atan2(D,f*E);m=Math.sin(m*R)/D,a=Math.sin(a*R)/D}const x=a*E;if(l=l*m+u*x,c=c*m+p*x,h=h*m+g*x,d=d*m+_*x,m===1-a){const D=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=D,c*=D,h*=D,d*=D}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],u=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*d+l*p-c*u,t[e+1]=l*g+h*u+c*d-a*p,t[e+2]=c*g+h*p+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),u=l(n/2),p=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"YZX":this._x=u*h*d+c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d-u*p*g;break;case"XZY":this._x=u*h*d-c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d+u*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-i)*p}else if(n>a&&n>d){const p=2*Math.sqrt(1+n-a-d);this._w=(h-l)/p,this._x=.25*p,this._y=(i+o)/p,this._z=(r+c)/p}else if(a>d){const p=2*Math.sqrt(1+a-n-d);this._w=(r-c)/p,this._x=(i+o)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+d-n-a);this._w=(o-i)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ee(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*i+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ya.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ya.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ys.copy(this).projectOnVector(t),this.sub(Ys)}reflect(t){return this.sub(Ys.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ee(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ys=new C,Ya=new ji;class Zi{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ge.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ge.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ge.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Ge):Ge.fromBufferAttribute(r,o),Ge.applyMatrix4(t.matrixWorld),this.expandByPoint(Ge);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),es.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),es.copy(n.boundingBox)),es.applyMatrix4(t.matrixWorld),this.union(es)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ge),Ge.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ri),ns.subVectors(this.max,Ri),Kn.subVectors(t.a,Ri),Jn.subVectors(t.b,Ri),Qn.subVectors(t.c,Ri),gn.subVectors(Jn,Kn),_n.subVectors(Qn,Jn),An.subVectors(Kn,Qn);let e=[0,-gn.z,gn.y,0,-_n.z,_n.y,0,-An.z,An.y,gn.z,0,-gn.x,_n.z,0,-_n.x,An.z,0,-An.x,-gn.y,gn.x,0,-_n.y,_n.x,0,-An.y,An.x,0];return!js(e,Kn,Jn,Qn,ns)||(e=[1,0,0,0,1,0,0,0,1],!js(e,Kn,Jn,Qn,ns))?!1:(is.crossVectors(gn,_n),e=[is.x,is.y,is.z],js(e,Kn,Jn,Qn,ns))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ge).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ge).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(en[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),en[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),en[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),en[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),en[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),en[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),en[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),en[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(en),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const en=[new C,new C,new C,new C,new C,new C,new C,new C],Ge=new C,es=new Zi,Kn=new C,Jn=new C,Qn=new C,gn=new C,_n=new C,An=new C,Ri=new C,ns=new C,is=new C,Rn=new C;function js(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Rn.fromArray(s,r);const a=i.x*Math.abs(Rn.x)+i.y*Math.abs(Rn.y)+i.z*Math.abs(Rn.z),l=t.dot(Rn),c=e.dot(Rn),h=n.dot(Rn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const qc=new Zi,Ci=new C,Zs=new C;class Gs{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):qc.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ci.subVectors(t,this.center);const e=Ci.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ci,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Zs.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ci.copy(t.center).add(Zs)),this.expandByPoint(Ci.copy(t.center).sub(Zs))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const nn=new C,$s=new C,ss=new C,vn=new C,Ks=new C,rs=new C,Js=new C;class hl{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,nn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=nn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(nn.copy(this.origin).addScaledVector(this.direction,e),nn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){$s.copy(t).add(e).multiplyScalar(.5),ss.copy(e).sub(t).normalize(),vn.copy(this.origin).sub($s);const r=t.distanceTo(e)*.5,o=-this.direction.dot(ss),a=vn.dot(this.direction),l=-vn.dot(ss),c=vn.lengthSq(),h=Math.abs(1-o*o);let d,u,p,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,p=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy($s).addScaledVector(ss,u),p}intersectSphere(t,e){nn.subVectors(t.center,this.origin);const n=nn.dot(this.direction),i=nn.dot(nn)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,nn)!==null}intersectTriangle(t,e,n,i,r){Ks.subVectors(e,t),rs.subVectors(n,t),Js.crossVectors(Ks,rs);let o=this.direction.dot(Js),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;vn.subVectors(this.origin,t);const l=a*this.direction.dot(rs.crossVectors(vn,rs));if(l<0)return null;const c=a*this.direction.dot(Ks.cross(vn));if(c<0||l+c>o)return null;const h=-a*vn.dot(Js);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,i,r,o,a,l,c,h,d,u,p,g,_,m){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,d,u,p,g,_,m)}set(t,e,n,i,r,o,a,l,c,h,d,u,p,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=i,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/ti.setFromMatrixColumn(t,0).length(),r=1/ti.setFromMatrixColumn(t,1).length(),o=1/ti.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,p=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=p+g*c,e[5]=u-_*c,e[9]=-a*l,e[2]=_-u*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,p=l*d,g=c*h,_=c*d;e[0]=u+_*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,p=l*d,g=c*h,_=c*d;e[0]=u-_*a,e[4]=-o*d,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,p=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=g*c-p,e[8]=u*c+_,e[1]=l*d,e[5]=_*c+u,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,p=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-u*d,e[8]=g*d+p,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=p*d+g,e[10]=u-_*d}else if(t.order==="XZY"){const u=o*l,p=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+_,e[5]=o*h,e[9]=p*d-g,e[2]=g*d-p,e[6]=a*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Yc,t,jc)}lookAt(t,e,n){const i=this.elements;return De.subVectors(t,e),De.lengthSq()===0&&(De.z=1),De.normalize(),xn.crossVectors(n,De),xn.lengthSq()===0&&(Math.abs(n.z)===1?De.x+=1e-4:De.z+=1e-4,De.normalize(),xn.crossVectors(n,De)),xn.normalize(),as.crossVectors(De,xn),i[0]=xn.x,i[4]=as.x,i[8]=De.x,i[1]=xn.y,i[5]=as.y,i[9]=De.y,i[2]=xn.z,i[6]=as.z,i[10]=De.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],E=n[3],b=n[7],x=n[11],D=n[15],R=i[0],A=i[4],I=i[8],S=i[12],y=i[1],P=i[5],G=i[9],F=i[13],X=i[2],q=i[6],W=i[10],K=i[14],H=i[3],st=i[7],dt=i[11],St=i[15];return r[0]=o*R+a*y+l*X+c*H,r[4]=o*A+a*P+l*q+c*st,r[8]=o*I+a*G+l*W+c*dt,r[12]=o*S+a*F+l*K+c*St,r[1]=h*R+d*y+u*X+p*H,r[5]=h*A+d*P+u*q+p*st,r[9]=h*I+d*G+u*W+p*dt,r[13]=h*S+d*F+u*K+p*St,r[2]=g*R+_*y+m*X+f*H,r[6]=g*A+_*P+m*q+f*st,r[10]=g*I+_*G+m*W+f*dt,r[14]=g*S+_*F+m*K+f*St,r[3]=E*R+b*y+x*X+D*H,r[7]=E*A+b*P+x*q+D*st,r[11]=E*I+b*G+x*W+D*dt,r[15]=E*S+b*F+x*K+D*St,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*l*d-i*c*d-r*a*u+n*c*u+i*a*p-n*l*p)+_*(+e*l*p-e*c*u+r*o*u-i*o*p+i*c*h-r*l*h)+m*(+e*c*d-e*a*p-r*o*d+n*o*p+r*a*h-n*c*h)+f*(-i*a*h-e*l*d+e*a*u+i*o*d-n*o*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],E=d*m*c-_*u*c+_*l*p-a*m*p-d*l*f+a*u*f,b=g*u*c-h*m*c-g*l*p+o*m*p+h*l*f-o*u*f,x=h*_*c-g*d*c+g*a*p-o*_*p-h*a*f+o*d*f,D=g*d*l-h*_*l-g*a*u+o*_*u+h*a*m-o*d*m,R=e*E+n*b+i*x+r*D;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return t[0]=E*A,t[1]=(_*u*r-d*m*r-_*i*p+n*m*p+d*i*f-n*u*f)*A,t[2]=(a*m*r-_*l*r+_*i*c-n*m*c-a*i*f+n*l*f)*A,t[3]=(d*l*r-a*u*r-d*i*c+n*u*c+a*i*p-n*l*p)*A,t[4]=b*A,t[5]=(h*m*r-g*u*r+g*i*p-e*m*p-h*i*f+e*u*f)*A,t[6]=(g*l*r-o*m*r-g*i*c+e*m*c+o*i*f-e*l*f)*A,t[7]=(o*u*r-h*l*r+h*i*c-e*u*c-o*i*p+e*l*p)*A,t[8]=x*A,t[9]=(g*d*r-h*_*r-g*n*p+e*_*p+h*n*f-e*d*f)*A,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*f+e*a*f)*A,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*p-e*a*p)*A,t[12]=D*A,t[13]=(h*_*i-g*d*i+g*n*u-e*_*u-h*n*m+e*d*m)*A,t[14]=(g*a*i-o*_*i-g*n*l+e*_*l+o*n*m-e*a*m)*A,t[15]=(o*d*i-h*a*i+h*n*l-e*d*l-o*n*u+e*a*u)*A,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,p=r*h,g=r*d,_=o*h,m=o*d,f=a*d,E=l*c,b=l*h,x=l*d,D=n.x,R=n.y,A=n.z;return i[0]=(1-(_+f))*D,i[1]=(p+x)*D,i[2]=(g-b)*D,i[3]=0,i[4]=(p-x)*R,i[5]=(1-(u+f))*R,i[6]=(m+E)*R,i[7]=0,i[8]=(g+b)*A,i[9]=(m-E)*A,i[10]=(1-(u+_))*A,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=ti.set(i[0],i[1],i[2]).length();const o=ti.set(i[4],i[5],i[6]).length(),a=ti.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],He.copy(this);const c=1/r,h=1/o,d=1/a;return He.elements[0]*=c,He.elements[1]*=c,He.elements[2]*=c,He.elements[4]*=h,He.elements[5]*=h,He.elements[6]*=h,He.elements[8]*=d,He.elements[9]*=d,He.elements[10]*=d,e.setFromRotationMatrix(He),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=cn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-i),d=(e+t)/(e-t),u=(n+i)/(n-i);let p,g;if(a===cn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ns)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=cn){const l=this.elements,c=1/(e-t),h=1/(n-i),d=1/(o-r),u=(e+t)*c,p=(n+i)*h;let g,_;if(a===cn)g=(o+r)*d,_=-2*d;else if(a===Ns)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ti=new C,He=new oe,Yc=new C(0,0,0),jc=new C(1,1,1),xn=new C,as=new C,De=new C,ja=new oe,Za=new ji;class Ye{constructor(t=0,e=0,n=0,i=Ye.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],p=i[10];switch(e){case"XYZ":this._y=Math.asin(Ee(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ee(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ee(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ee(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ee(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ee(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ja.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ja,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Za.setFromEuler(this),this.setFromQuaternion(Za,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ye.DEFAULT_ORDER="XYZ";class dl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Zc=0;const $a=new C,ei=new ji,sn=new oe,os=new C,Pi=new C,$c=new C,Kc=new ji,Ka=new C(1,0,0),Ja=new C(0,1,0),Qa=new C(0,0,1),to={type:"added"},Jc={type:"removed"},ni={type:"childadded",child:null},Qs={type:"childremoved",child:null};class ue extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zc++}),this.uuid=hn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ue.DEFAULT_UP.clone();const t=new C,e=new Ye,n=new ji,i=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new oe},normalMatrix:{value:new It}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=ue.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ei.setFromAxisAngle(t,e),this.quaternion.multiply(ei),this}rotateOnWorldAxis(t,e){return ei.setFromAxisAngle(t,e),this.quaternion.premultiply(ei),this}rotateX(t){return this.rotateOnAxis(Ka,t)}rotateY(t){return this.rotateOnAxis(Ja,t)}rotateZ(t){return this.rotateOnAxis(Qa,t)}translateOnAxis(t,e){return $a.copy(t).applyQuaternion(this.quaternion),this.position.add($a.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ka,t)}translateY(t){return this.translateOnAxis(Ja,t)}translateZ(t){return this.translateOnAxis(Qa,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(sn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?os.copy(t):os.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Pi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?sn.lookAt(Pi,os,this.up):sn.lookAt(os,Pi,this.up),this.quaternion.setFromRotationMatrix(sn),i&&(sn.extractRotation(i.matrixWorld),ei.setFromRotationMatrix(sn),this.quaternion.premultiply(ei.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(to),ni.child=t,this.dispatchEvent(ni),ni.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Jc),Qs.child=t,this.dispatchEvent(Qs),Qs.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),sn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),sn.multiply(t.parent.matrixWorld)),t.applyMatrix4(sn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(to),ni.child=t,this.dispatchEvent(ni),ni.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pi,t,$c),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pi,Kc,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}ue.DEFAULT_UP=new C(0,1,0);ue.DEFAULT_MATRIX_AUTO_UPDATE=!0;ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ve=new C,rn=new C,tr=new C,an=new C,ii=new C,si=new C,eo=new C,er=new C,nr=new C,ir=new C,sr=new Qt,rr=new Qt,ar=new Qt;class ze{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Ve.subVectors(t,e),i.cross(Ve);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Ve.subVectors(i,e),rn.subVectors(n,e),tr.subVectors(t,e);const o=Ve.dot(Ve),a=Ve.dot(rn),l=Ve.dot(tr),c=rn.dot(rn),h=rn.dot(tr),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,p=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,an)===null?!1:an.x>=0&&an.y>=0&&an.x+an.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,an)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,an.x),l.addScaledVector(o,an.y),l.addScaledVector(a,an.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return sr.setScalar(0),rr.setScalar(0),ar.setScalar(0),sr.fromBufferAttribute(t,e),rr.fromBufferAttribute(t,n),ar.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(sr,r.x),o.addScaledVector(rr,r.y),o.addScaledVector(ar,r.z),o}static isFrontFacing(t,e,n,i){return Ve.subVectors(n,e),rn.subVectors(t,e),Ve.cross(rn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ve.subVectors(this.c,this.b),rn.subVectors(this.a,this.b),Ve.cross(rn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ze.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ze.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return ze.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return ze.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ze.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;ii.subVectors(i,n),si.subVectors(r,n),er.subVectors(t,n);const l=ii.dot(er),c=si.dot(er);if(l<=0&&c<=0)return e.copy(n);nr.subVectors(t,i);const h=ii.dot(nr),d=si.dot(nr);if(h>=0&&d<=h)return e.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(ii,o);ir.subVectors(t,r);const p=ii.dot(ir),g=si.dot(ir);if(g>=0&&p<=g)return e.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(si,a);const m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return eo.subVectors(r,i),a=(d-h)/(d-h+(p-g)),e.copy(i).addScaledVector(eo,a);const f=1/(m+_+u);return o=_*f,a=u*f,e.copy(n).addScaledVector(ii,o).addScaledVector(si,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ul={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mn={h:0,s:0,l:0},ls={h:0,s:0,l:0};function or(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Ft{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Wt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Wt.workingColorSpace){if(t=va(t,1),e=Ee(e,0,1),n=Ee(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=or(o,r,t+1/3),this.g=or(o,r,t),this.b=or(o,r,t-1/3)}return Wt.toWorkingColorSpace(this,i),this}setStyle(t,e=be){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=be){const n=ul[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=dn(t.r),this.g=dn(t.g),this.b=dn(t.b),this}copyLinearToSRGB(t){return this.r=mi(t.r),this.g=mi(t.g),this.b=mi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=be){return Wt.fromWorkingColorSpace(Me.copy(this),t),Math.round(Ee(Me.r*255,0,255))*65536+Math.round(Ee(Me.g*255,0,255))*256+Math.round(Ee(Me.b*255,0,255))}getHexString(t=be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wt.workingColorSpace){Wt.fromWorkingColorSpace(Me.copy(this),e);const n=Me.r,i=Me.g,r=Me.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Wt.workingColorSpace){return Wt.fromWorkingColorSpace(Me.copy(this),e),t.r=Me.r,t.g=Me.g,t.b=Me.b,t}getStyle(t=be){Wt.fromWorkingColorSpace(Me.copy(this),t);const e=Me.r,n=Me.g,i=Me.b;return t!==be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Mn),this.setHSL(Mn.h+t,Mn.s+e,Mn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Mn),t.getHSL(ls);const n=Hi(Mn.h,ls.h,e),i=Hi(Mn.s,ls.s,e),r=Hi(Mn.l,ls.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Me=new Ft;Ft.NAMES=ul;let Qc=0;class Xn extends bi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qc++}),this.uuid=hn(),this.name="",this.blending=Hn,this.side=wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=br,this.blendDst=Er,this.blendEquation=On,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ft(0,0,0),this.blendAlpha=0,this.depthFunc=gi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=za,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zn,this.stencilZFail=Zn,this.stencilZPass=Zn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Hn&&(n.blending=this.blending),this.side!==wn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==br&&(n.blendSrc=this.blendSrc),this.blendDst!==Er&&(n.blendDst=this.blendDst),this.blendEquation!==On&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==gi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==za&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Re extends Xn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ye,this.combine=qo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const de=new C,cs=new Lt;class Ue{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=oa,this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)cs.fromBufferAttribute(this,e),cs.applyMatrix3(t),this.setXY(e,cs.x,cs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyMatrix3(t),this.setXYZ(e,de.x,de.y,de.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyMatrix4(t),this.setXYZ(e,de.x,de.y,de.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyNormalMatrix(t),this.setXYZ(e,de.x,de.y,de.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.transformDirection(t),this.setXYZ(e,de.x,de.y,de.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=We(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Zt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=We(e,this.array)),e}setX(t,e){return this.normalized&&(e=Zt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=We(e,this.array)),e}setY(t,e){return this.normalized&&(e=Zt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=We(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Zt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=We(e,this.array)),e}setW(t,e){return this.normalized&&(e=Zt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array),i=Zt(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array),i=Zt(i,this.array),r=Zt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==oa&&(t.usage=this.usage),t}}class fl extends Ue{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class pl extends Ue{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class fe extends Ue{constructor(t,e,n){super(new Float32Array(t),e,n)}}let th=0;const Oe=new oe,lr=new ue,ri=new C,Ie=new Zi,Di=new Zi,ge=new C;class Ce extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:th++}),this.uuid=hn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ol(t)?pl:fl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new It().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Oe.makeRotationFromQuaternion(t),this.applyMatrix4(Oe),this}rotateX(t){return Oe.makeRotationX(t),this.applyMatrix4(Oe),this}rotateY(t){return Oe.makeRotationY(t),this.applyMatrix4(Oe),this}rotateZ(t){return Oe.makeRotationZ(t),this.applyMatrix4(Oe),this}translate(t,e,n){return Oe.makeTranslation(t,e,n),this.applyMatrix4(Oe),this}scale(t,e,n){return Oe.makeScale(t,e,n),this.applyMatrix4(Oe),this}lookAt(t){return lr.lookAt(t),lr.updateMatrix(),this.applyMatrix4(lr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ri).negate(),this.translate(ri.x,ri.y,ri.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new fe(n,3))}else{for(let n=0,i=e.count;n<i;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];Ie.setFromBufferAttribute(r),this.morphTargetsRelative?(ge.addVectors(this.boundingBox.min,Ie.min),this.boundingBox.expandByPoint(ge),ge.addVectors(this.boundingBox.max,Ie.max),this.boundingBox.expandByPoint(ge)):(this.boundingBox.expandByPoint(Ie.min),this.boundingBox.expandByPoint(Ie.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(Ie.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Di.setFromBufferAttribute(a),this.morphTargetsRelative?(ge.addVectors(Ie.min,Di.min),Ie.expandByPoint(ge),ge.addVectors(Ie.max,Di.max),Ie.expandByPoint(ge)):(Ie.expandByPoint(Di.min),Ie.expandByPoint(Di.max))}Ie.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)ge.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ge));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ge.fromBufferAttribute(a,c),l&&(ri.fromBufferAttribute(t,c),ge.add(ri)),i=Math.max(i,n.distanceToSquared(ge))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ue(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let I=0;I<n.count;I++)a[I]=new C,l[I]=new C;const c=new C,h=new C,d=new C,u=new Lt,p=new Lt,g=new Lt,_=new C,m=new C;function f(I,S,y){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,S),d.fromBufferAttribute(n,y),u.fromBufferAttribute(r,I),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,y),h.sub(c),d.sub(c),p.sub(u),g.sub(u);const P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(P),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(P),a[I].add(_),a[S].add(_),a[y].add(_),l[I].add(m),l[S].add(m),l[y].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let I=0,S=E.length;I<S;++I){const y=E[I],P=y.start,G=y.count;for(let F=P,X=P+G;F<X;F+=3)f(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const b=new C,x=new C,D=new C,R=new C;function A(I){D.fromBufferAttribute(i,I),R.copy(D);const S=a[I];b.copy(S),b.sub(D.multiplyScalar(D.dot(S))).normalize(),x.crossVectors(R,S);const P=x.dot(l[I])<0?-1:1;o.setXYZW(I,b.x,b.y,b.z,P)}for(let I=0,S=E.length;I<S;++I){const y=E[I],P=y.start,G=y.count;for(let F=P,X=P+G;F<X;F+=3)A(t.getX(F+0)),A(t.getX(F+1)),A(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ue(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const i=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,d=new C;if(t)for(let u=0,p=t.count;u<p;u+=3){const g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=e.count;u<p;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ge.fromBufferAttribute(t,e),ge.normalize(),t.setXYZ(e,ge.x,ge.y,ge.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*h;for(let f=0;f<h;f++)u[g++]=c[p++]}return new Ue(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ce,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],p=t(u,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const p=c[d];h.push(p.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const no=new oe,Cn=new hl,hs=new Gs,io=new C,ds=new C,us=new C,fs=new C,cr=new C,ps=new C,so=new C,ms=new C;class Q extends ue{constructor(t=new Ce,e=new Re){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){ps.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(cr.fromBufferAttribute(d,t),o?ps.addScaledVector(cr,h):ps.addScaledVector(cr.sub(e),h))}e.add(ps)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),hs.copy(n.boundingSphere),hs.applyMatrix4(r),Cn.copy(t.ray).recast(t.near),!(hs.containsPoint(Cn.origin)===!1&&(Cn.intersectSphere(hs,io)===null||Cn.origin.distanceToSquared(io)>(t.far-t.near)**2))&&(no.copy(r).invert(),Cn.copy(t.ray).applyMatrix4(no),!(n.boundingBox!==null&&Cn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Cn)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=o[m.materialIndex],E=Math.max(m.start,p.start),b=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let x=E,D=b;x<D;x+=3){const R=a.getX(x),A=a.getX(x+1),I=a.getX(x+2);i=gs(this,f,t,n,c,h,d,R,A,I),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const E=a.getX(m),b=a.getX(m+1),x=a.getX(m+2);i=gs(this,o,t,n,c,h,d,E,b,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=o[m.materialIndex],E=Math.max(m.start,p.start),b=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let x=E,D=b;x<D;x+=3){const R=x,A=x+1,I=x+2;i=gs(this,f,t,n,c,h,d,R,A,I),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const E=m,b=m+1,x=m+2;i=gs(this,o,t,n,c,h,d,E,b,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function eh(s,t,e,n,i,r,o,a){let l;if(t.side===we?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===wn,a),l===null)return null;ms.copy(a),ms.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(ms);return c<e.near||c>e.far?null:{distance:c,point:ms.clone(),object:s}}function gs(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,ds),s.getVertexPosition(l,us),s.getVertexPosition(c,fs);const h=eh(s,t,e,n,ds,us,fs,so);if(h){const d=new C;ze.getBarycoord(so,ds,us,fs,d),i&&(h.uv=ze.getInterpolatedAttribute(i,a,l,c,d,new Lt)),r&&(h.uv1=ze.getInterpolatedAttribute(r,a,l,c,d,new Lt)),o&&(h.normal=ze.getInterpolatedAttribute(o,a,l,c,d,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new C,materialIndex:0};ze.getNormal(ds,us,fs,u.normal),h.face=u,h.barycoord=d}return h}class yt extends Ce{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(d,2));function g(_,m,f,E,b,x,D,R,A,I,S){const y=x/A,P=D/I,G=x/2,F=D/2,X=R/2,q=A+1,W=I+1;let K=0,H=0;const st=new C;for(let dt=0;dt<W;dt++){const St=dt*P-F;for(let Ot=0;Ot<q;Ot++){const te=Ot*y-G;st[_]=te*E,st[m]=St*b,st[f]=X,c.push(st.x,st.y,st.z),st[_]=0,st[m]=0,st[f]=R>0?1:-1,h.push(st.x,st.y,st.z),d.push(Ot/A),d.push(1-dt/I),K+=1}}for(let dt=0;dt<I;dt++)for(let St=0;St<A;St++){const Ot=u+St+q*dt,te=u+St+q*(dt+1),j=u+(St+1)+q*(dt+1),nt=u+(St+1)+q*dt;l.push(Ot,te,nt),l.push(te,j,nt),H+=6}a.addGroup(p,H,S),p+=H,u+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function yi(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Se(s){const t={};for(let e=0;e<s.length;e++){const n=yi(s[e]);for(const i in n)t[i]=n[i]}return t}function nh(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function ml(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Wt.workingColorSpace}const ih={clone:yi,merge:Se};var sh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class fn extends Xn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sh,this.fragmentShader=rh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=yi(t.uniforms),this.uniformsGroups=nh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class gl extends ue{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=cn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const yn=new C,ro=new Lt,ao=new Lt;class Le extends gl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Gi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qi*2*Math.atan(Math.tan(Gi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(yn.x,yn.y).multiplyScalar(-t/yn.z),yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yn.x,yn.y).multiplyScalar(-t/yn.z)}getViewSize(t,e){return this.getViewBounds(t,ro,ao),e.subVectors(ao,ro)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Gi*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ai=-90,oi=1;class ah extends ue{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Le(ai,oi,t,e);i.layers=this.layers,this.add(i);const r=new Le(ai,oi,t,e);r.layers=this.layers,this.add(r);const o=new Le(ai,oi,t,e);o.layers=this.layers,this.add(o);const a=new Le(ai,oi,t,e);a.layers=this.layers,this.add(a);const l=new Le(ai,oi,t,e);l.layers=this.layers,this.add(l);const c=new Le(ai,oi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===cn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ns)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(d,u,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class _l extends Te{constructor(t,e,n,i,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:_i,super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class oh extends Wn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new _l(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ke}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new yt(5,5,5),r=new fn({name:"CubemapFromEquirect",uniforms:yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:we,blending:bn});r.uniforms.tEquirect.value=e;const o=new Q(i,r),a=e.minFilter;return e.minFilter===Gn&&(e.minFilter=Ke),new ah(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}const hr=new C,lh=new C,ch=new It;class Nn{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=hr.subVectors(n,e).cross(lh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(hr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ch.getNormalMatrix(t),i=this.coplanarPoint(hr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Pn=new Gs,_s=new C;class xa{constructor(t=new Nn,e=new Nn,n=new Nn,i=new Nn,r=new Nn,o=new Nn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=cn){const n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],d=i[6],u=i[7],p=i[8],g=i[9],_=i[10],m=i[11],f=i[12],E=i[13],b=i[14],x=i[15];if(n[0].setComponents(l-r,u-c,m-p,x-f).normalize(),n[1].setComponents(l+r,u+c,m+p,x+f).normalize(),n[2].setComponents(l+o,u+h,m+g,x+E).normalize(),n[3].setComponents(l-o,u-h,m-g,x-E).normalize(),n[4].setComponents(l-a,u-d,m-_,x-b).normalize(),e===cn)n[5].setComponents(l+a,u+d,m+_,x+b).normalize();else if(e===Ns)n[5].setComponents(a,d,_,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Pn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Pn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Pn)}intersectsSprite(t){return Pn.center.set(0,0,0),Pn.radius=.7071067811865476,Pn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Pn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(_s.x=i.normal.x>0?t.max.x:t.min.x,_s.y=i.normal.y>0?t.max.y:t.min.y,_s.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(_s)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function vl(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function hh(s){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=s.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=s.HALF_FLOAT:p=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=s.SHORT;else if(c instanceof Uint32Array)p=s.UNSIGNED_INT;else if(c instanceof Int32Array)p=s.INT;else if(c instanceof Int8Array)p=s.BYTE;else if(c instanceof Uint8Array)p=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(s.bindBuffer(c,a),d.length===0)s.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){const g=d[u],_=d[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){const _=d[p];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}class qn extends Ce{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=t/a,u=e/l,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){const E=f*u-o;for(let b=0;b<c;b++){const x=b*d-r;g.push(x,-E,0),_.push(0,0,1),m.push(b/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let E=0;E<a;E++){const b=E+c*f,x=E+c*(f+1),D=E+1+c*(f+1),R=E+1+c*f;p.push(b,x,R),p.push(x,D,R)}this.setIndex(p),this.setAttribute("position",new fe(g,3)),this.setAttribute("normal",new fe(_,3)),this.setAttribute("uv",new fe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qn(t.width,t.height,t.widthSegments,t.heightSegments)}}var dh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ph=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_h=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,vh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Mh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Eh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,wh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Th=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ah=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ch=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ph=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Dh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ih=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Lh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Uh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Oh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Wh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xh=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,qh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,jh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$h=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jh=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,td=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ed=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,id=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,sd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ad=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,od=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ld=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,dd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ud=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fd=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pd=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,md=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_d=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Md=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ed=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Td=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ad=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Pd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Id=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ld=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ud=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Od=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,kd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Yd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Zd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$d=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Kd=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,tu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,eu=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,nu=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,iu=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,su=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ru=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,au=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ou=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,lu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const hu=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,du=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fu=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mu=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gu=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,_u=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vu=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xu=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Mu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yu=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Su=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bu=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Eu=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,wu=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tu=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Au=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ru=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Cu=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pu=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Du=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Iu=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lu=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uu=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Nu=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fu=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ou=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zu=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Bu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ku=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gu=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Hu=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Nt={alphahash_fragment:dh,alphahash_pars_fragment:uh,alphamap_fragment:fh,alphamap_pars_fragment:ph,alphatest_fragment:mh,alphatest_pars_fragment:gh,aomap_fragment:_h,aomap_pars_fragment:vh,batching_pars_vertex:xh,batching_vertex:Mh,begin_vertex:yh,beginnormal_vertex:Sh,bsdfs:bh,iridescence_fragment:Eh,bumpmap_pars_fragment:wh,clipping_planes_fragment:Th,clipping_planes_pars_fragment:Ah,clipping_planes_pars_vertex:Rh,clipping_planes_vertex:Ch,color_fragment:Ph,color_pars_fragment:Dh,color_pars_vertex:Ih,color_vertex:Lh,common:Uh,cube_uv_reflection_fragment:Nh,defaultnormal_vertex:Fh,displacementmap_pars_vertex:Oh,displacementmap_vertex:zh,emissivemap_fragment:Bh,emissivemap_pars_fragment:kh,colorspace_fragment:Gh,colorspace_pars_fragment:Hh,envmap_fragment:Vh,envmap_common_pars_fragment:Wh,envmap_pars_fragment:Xh,envmap_pars_vertex:qh,envmap_physical_pars_fragment:id,envmap_vertex:Yh,fog_vertex:jh,fog_pars_vertex:Zh,fog_fragment:$h,fog_pars_fragment:Kh,gradientmap_pars_fragment:Jh,lightmap_pars_fragment:Qh,lights_lambert_fragment:td,lights_lambert_pars_fragment:ed,lights_pars_begin:nd,lights_toon_fragment:sd,lights_toon_pars_fragment:rd,lights_phong_fragment:ad,lights_phong_pars_fragment:od,lights_physical_fragment:ld,lights_physical_pars_fragment:cd,lights_fragment_begin:hd,lights_fragment_maps:dd,lights_fragment_end:ud,logdepthbuf_fragment:fd,logdepthbuf_pars_fragment:pd,logdepthbuf_pars_vertex:md,logdepthbuf_vertex:gd,map_fragment:_d,map_pars_fragment:vd,map_particle_fragment:xd,map_particle_pars_fragment:Md,metalnessmap_fragment:yd,metalnessmap_pars_fragment:Sd,morphinstance_vertex:bd,morphcolor_vertex:Ed,morphnormal_vertex:wd,morphtarget_pars_vertex:Td,morphtarget_vertex:Ad,normal_fragment_begin:Rd,normal_fragment_maps:Cd,normal_pars_fragment:Pd,normal_pars_vertex:Dd,normal_vertex:Id,normalmap_pars_fragment:Ld,clearcoat_normal_fragment_begin:Ud,clearcoat_normal_fragment_maps:Nd,clearcoat_pars_fragment:Fd,iridescence_pars_fragment:Od,opaque_fragment:zd,packing:Bd,premultiplied_alpha_fragment:kd,project_vertex:Gd,dithering_fragment:Hd,dithering_pars_fragment:Vd,roughnessmap_fragment:Wd,roughnessmap_pars_fragment:Xd,shadowmap_pars_fragment:qd,shadowmap_pars_vertex:Yd,shadowmap_vertex:jd,shadowmask_pars_fragment:Zd,skinbase_vertex:$d,skinning_pars_vertex:Kd,skinning_vertex:Jd,skinnormal_vertex:Qd,specularmap_fragment:tu,specularmap_pars_fragment:eu,tonemapping_fragment:nu,tonemapping_pars_fragment:iu,transmission_fragment:su,transmission_pars_fragment:ru,uv_pars_fragment:au,uv_pars_vertex:ou,uv_vertex:lu,worldpos_vertex:cu,background_vert:hu,background_frag:du,backgroundCube_vert:uu,backgroundCube_frag:fu,cube_vert:pu,cube_frag:mu,depth_vert:gu,depth_frag:_u,distanceRGBA_vert:vu,distanceRGBA_frag:xu,equirect_vert:Mu,equirect_frag:yu,linedashed_vert:Su,linedashed_frag:bu,meshbasic_vert:Eu,meshbasic_frag:wu,meshlambert_vert:Tu,meshlambert_frag:Au,meshmatcap_vert:Ru,meshmatcap_frag:Cu,meshnormal_vert:Pu,meshnormal_frag:Du,meshphong_vert:Iu,meshphong_frag:Lu,meshphysical_vert:Uu,meshphysical_frag:Nu,meshtoon_vert:Fu,meshtoon_frag:Ou,points_vert:zu,points_frag:Bu,shadow_vert:ku,shadow_frag:Gu,sprite_vert:Hu,sprite_frag:Vu},it={common:{diffuse:{value:new Ft(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new It}},envmap:{envMap:{value:null},envMapRotation:{value:new It},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new It}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new It}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new It},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new It},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new It},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new It}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new It}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new It}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ft(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ft(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0},uvTransform:{value:new It}},sprite:{diffuse:{value:new Ft(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}}},Ze={basic:{uniforms:Se([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:Se([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Ft(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:Se([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Ft(0)},specular:{value:new Ft(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:Se([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new Ft(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:Se([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new Ft(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:Se([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:Se([it.points,it.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:Se([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:Se([it.common,it.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:Se([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:Se([it.sprite,it.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new It},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new It}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:Se([it.common,it.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:Se([it.lights,it.fog,{color:{value:new Ft(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};Ze.physical={uniforms:Se([Ze.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new It},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new It},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new It},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new It},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new It},sheen:{value:0},sheenColor:{value:new Ft(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new It},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new It},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new It},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new It},attenuationDistance:{value:0},attenuationColor:{value:new Ft(0)},specularColor:{value:new Ft(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new It},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new It},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new It}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};const vs={r:0,b:0,g:0},Dn=new Ye,Wu=new oe;function Xu(s,t,e,n,i,r,o){const a=new Ft(0);let l=r===!0?0:1,c,h,d=null,u=0,p=null;function g(E){let b=E.isScene===!0?E.background:null;return b&&b.isTexture&&(b=(E.backgroundBlurriness>0?e:t).get(b)),b}function _(E){let b=!1;const x=g(E);x===null?f(a,l):x&&x.isColor&&(f(x,1),b=!0);const D=s.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,o):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(E,b){const x=g(b);x&&(x.isCubeTexture||x.mapping===Bs)?(h===void 0&&(h=new Q(new yt(1,1,1),new fn({name:"BackgroundCubeMaterial",uniforms:yi(Ze.backgroundCube.uniforms),vertexShader:Ze.backgroundCube.vertexShader,fragmentShader:Ze.backgroundCube.fragmentShader,side:we,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Dn.copy(b.backgroundRotation),Dn.x*=-1,Dn.y*=-1,Dn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Dn.y*=-1,Dn.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Wu.makeRotationFromEuler(Dn)),h.material.toneMapped=Wt.getTransfer(x.colorSpace)!==Kt,(d!==x||u!==x.version||p!==s.toneMapping)&&(h.material.needsUpdate=!0,d=x,u=x.version,p=s.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Q(new qn(2,2),new fn({name:"BackgroundMaterial",uniforms:yi(Ze.background.uniforms),vertexShader:Ze.background.vertexShader,fragmentShader:Ze.background.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Wt.getTransfer(x.colorSpace)!==Kt,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||u!==x.version||p!==s.toneMapping)&&(c.material.needsUpdate=!0,d=x,u=x.version,p=s.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function f(E,b){E.getRGB(vs,ml(s)),n.buffers.color.setClear(vs.r,vs.g,vs.b,b,o)}return{getClearColor:function(){return a},setClearColor:function(E,b=1){a.set(E),l=b,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,f(a,l)},render:_,addToRenderList:m}}function qu(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,o=!1;function a(y,P,G,F,X){let q=!1;const W=d(F,G,P);r!==W&&(r=W,c(r.object)),q=p(y,F,G,X),q&&g(y,F,G,X),X!==null&&t.update(X,s.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,x(y,P,G,F),X!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function l(){return s.createVertexArray()}function c(y){return s.bindVertexArray(y)}function h(y){return s.deleteVertexArray(y)}function d(y,P,G){const F=G.wireframe===!0;let X=n[y.id];X===void 0&&(X={},n[y.id]=X);let q=X[P.id];q===void 0&&(q={},X[P.id]=q);let W=q[F];return W===void 0&&(W=u(l()),q[F]=W),W}function u(y){const P=[],G=[],F=[];for(let X=0;X<e;X++)P[X]=0,G[X]=0,F[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:G,attributeDivisors:F,object:y,attributes:{},index:null}}function p(y,P,G,F){const X=r.attributes,q=P.attributes;let W=0;const K=G.getAttributes();for(const H in K)if(K[H].location>=0){const dt=X[H];let St=q[H];if(St===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(St=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(St=y.instanceColor)),dt===void 0||dt.attribute!==St||St&&dt.data!==St.data)return!0;W++}return r.attributesNum!==W||r.index!==F}function g(y,P,G,F){const X={},q=P.attributes;let W=0;const K=G.getAttributes();for(const H in K)if(K[H].location>=0){let dt=q[H];dt===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(dt=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(dt=y.instanceColor));const St={};St.attribute=dt,dt&&dt.data&&(St.data=dt.data),X[H]=St,W++}r.attributes=X,r.attributesNum=W,r.index=F}function _(){const y=r.newAttributes;for(let P=0,G=y.length;P<G;P++)y[P]=0}function m(y){f(y,0)}function f(y,P){const G=r.newAttributes,F=r.enabledAttributes,X=r.attributeDivisors;G[y]=1,F[y]===0&&(s.enableVertexAttribArray(y),F[y]=1),X[y]!==P&&(s.vertexAttribDivisor(y,P),X[y]=P)}function E(){const y=r.newAttributes,P=r.enabledAttributes;for(let G=0,F=P.length;G<F;G++)P[G]!==y[G]&&(s.disableVertexAttribArray(G),P[G]=0)}function b(y,P,G,F,X,q,W){W===!0?s.vertexAttribIPointer(y,P,G,X,q):s.vertexAttribPointer(y,P,G,F,X,q)}function x(y,P,G,F){_();const X=F.attributes,q=G.getAttributes(),W=P.defaultAttributeValues;for(const K in q){const H=q[K];if(H.location>=0){let st=X[K];if(st===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&(st=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&(st=y.instanceColor)),st!==void 0){const dt=st.normalized,St=st.itemSize,Ot=t.get(st);if(Ot===void 0)continue;const te=Ot.buffer,j=Ot.type,nt=Ot.bytesPerElement,vt=j===s.INT||j===s.UNSIGNED_INT||st.gpuType===ua;if(st.isInterleavedBufferAttribute){const at=st.data,Tt=at.stride,Ct=st.offset;if(at.isInstancedInterleavedBuffer){for(let zt=0;zt<H.locationSize;zt++)f(H.location+zt,at.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let zt=0;zt<H.locationSize;zt++)m(H.location+zt);s.bindBuffer(s.ARRAY_BUFFER,te);for(let zt=0;zt<H.locationSize;zt++)b(H.location+zt,St/H.locationSize,j,dt,Tt*nt,(Ct+St/H.locationSize*zt)*nt,vt)}else{if(st.isInstancedBufferAttribute){for(let at=0;at<H.locationSize;at++)f(H.location+at,st.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let at=0;at<H.locationSize;at++)m(H.location+at);s.bindBuffer(s.ARRAY_BUFFER,te);for(let at=0;at<H.locationSize;at++)b(H.location+at,St/H.locationSize,j,dt,St*nt,St/H.locationSize*at*nt,vt)}}else if(W!==void 0){const dt=W[K];if(dt!==void 0)switch(dt.length){case 2:s.vertexAttrib2fv(H.location,dt);break;case 3:s.vertexAttrib3fv(H.location,dt);break;case 4:s.vertexAttrib4fv(H.location,dt);break;default:s.vertexAttrib1fv(H.location,dt)}}}}E()}function D(){I();for(const y in n){const P=n[y];for(const G in P){const F=P[G];for(const X in F)h(F[X].object),delete F[X];delete P[G]}delete n[y]}}function R(y){if(n[y.id]===void 0)return;const P=n[y.id];for(const G in P){const F=P[G];for(const X in F)h(F[X].object),delete F[X];delete P[G]}delete n[y.id]}function A(y){for(const P in n){const G=n[P];if(G[y.id]===void 0)continue;const F=G[y.id];for(const X in F)h(F[X].object),delete F[X];delete G[y.id]}}function I(){S(),o=!0,r!==i&&(r=i,c(r.object))}function S(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:I,resetDefaultState:S,dispose:D,releaseStatesOfGeometry:R,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function Yu(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,d){d!==0&&(s.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function a(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];e.update(p,n,1)}function l(c,h,d,u){if(d===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*u[_];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function ju(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(A){return!(A!==Xe&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const I=A===Yi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==un&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ln&&!I)}function l(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),f=s.getParameter(s.MAX_VERTEX_ATTRIBS),E=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,R=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:E,maxVaryings:b,maxFragmentUniforms:x,vertexTextures:D,maxSamples:R}}function Zu(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new Nn,a=new It,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const p=d.length!==0||u||n!==0||i;return i=u,n=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,p){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,f=s.get(d);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const E=r?0:n,b=E*4;let x=f.clippingState||null;l.value=x,x=h(g,u,b,p);for(let D=0;D!==b;++D)x[D]=e[D];f.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,p,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,E=u.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<f)&&(m=new Float32Array(f));for(let b=0,x=p;b!==_;++b,x+=4)o.copy(d[b]).applyMatrix4(E,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function $u(s){let t=new WeakMap;function e(o,a){return a===Ir?o.mapping=_i:a===Lr&&(o.mapping=vi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ir||a===Lr)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new oh(l.height);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class xl extends gl{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const fi=4,oo=[.125,.215,.35,.446,.526,.582],zn=20,dr=new xl,lo=new Ft;let ur=null,fr=0,pr=0,mr=!1;const Fn=(1+Math.sqrt(5))/2,li=1/Fn,co=[new C(-Fn,li,0),new C(Fn,li,0),new C(-li,0,Fn),new C(li,0,Fn),new C(0,Fn,-li),new C(0,Fn,li),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class ho{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){ur=this._renderer.getRenderTarget(),fr=this._renderer.getActiveCubeFace(),pr=this._renderer.getActiveMipmapLevel(),mr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=po(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ur,fr,pr),this._renderer.xr.enabled=mr,t.scissorTest=!1,xs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_i||t.mapping===vi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ur=this._renderer.getRenderTarget(),fr=this._renderer.getActiveCubeFace(),pr=this._renderer.getActiveMipmapLevel(),mr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ke,minFilter:Ke,generateMipmaps:!1,type:Yi,format:Xe,colorSpace:Si,depthBuffer:!1},i=uo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=uo(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ku(r)),this._blurMaterial=Ju(r,t,e)}return i}_compileMaterial(t){const e=new Q(this._lodPlanes[0],t);this._renderer.compile(e,dr)}_sceneToCubeUV(t,e,n,i){const a=new Le(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(lo),h.toneMapping=En,h.autoClear=!1;const p=new Re({name:"PMREM.Background",side:we,depthWrite:!1,depthTest:!1}),g=new Q(new yt,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(lo),_=!0);for(let f=0;f<6;f++){const E=f%3;E===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):E===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const b=this._cubeSize;xs(i,E*b,f>2?b:0,b,b),h.setRenderTarget(i),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===_i||t.mapping===vi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=po()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fo());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new Q(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;xs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,dr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=co[(i-r-1)%co.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Q(this._lodPlanes[i],c),u=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*zn-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):zn;m>zn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${zn}`);const f=[];let E=0;for(let A=0;A<zn;++A){const I=A/_,S=Math.exp(-I*I/2);f.push(S),A===0?E+=S:A<m&&(E+=2*S)}for(let A=0;A<f.length;A++)f[A]=f[A]/E;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:b}=this;u.dTheta.value=g,u.mipInt.value=b-n;const x=this._sizeLods[i],D=3*x*(i>b-fi?i-b+fi:0),R=4*(this._cubeSize-x);xs(e,D,R,3*x,2*x),l.setRenderTarget(e),l.render(d,dr)}}function Ku(s){const t=[],e=[],n=[];let i=s;const r=s-fi+1+oo.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>s-fi?l=oo[o-s+fi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,_=3,m=2,f=1,E=new Float32Array(_*g*p),b=new Float32Array(m*g*p),x=new Float32Array(f*g*p);for(let R=0;R<p;R++){const A=R%3*2/3-1,I=R>2?0:-1,S=[A,I,0,A+2/3,I,0,A+2/3,I+1,0,A,I,0,A+2/3,I+1,0,A,I+1,0];E.set(S,_*g*R),b.set(u,m*g*R);const y=[R,R,R,R,R,R];x.set(y,f*g*R)}const D=new Ce;D.setAttribute("position",new Ue(E,_)),D.setAttribute("uv",new Ue(b,m)),D.setAttribute("faceIndex",new Ue(x,f)),t.push(D),i>fi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function uo(s,t,e){const n=new Wn(s,t,e);return n.texture.mapping=Bs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function xs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Ju(s,t,e){const n=new Float32Array(zn),i=new C(0,1,0);return new fn({name:"SphericalGaussianBlur",defines:{n:zn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ma(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function fo(){return new fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ma(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function po(){return new fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ma(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Ma(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Qu(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ir||l===Lr,h=l===_i||l===vi;if(c||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new ho(s)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return c&&p&&p.height>0||h&&p&&i(p)?(e===null&&(e=new ho(s)),d=c?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function tf(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Bi("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function ef(s,t,e,n){const i={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}u.removeEventListener("dispose",o),delete i[u.id];const p=r.get(u);p&&(t.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)t.update(u[g],s.ARRAY_BUFFER);const p=d.morphAttributes;for(const g in p){const _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],s.ARRAY_BUFFER)}}function c(d){const u=[],p=d.index,g=d.attributes.position;let _=0;if(p!==null){const E=p.array;_=p.version;for(let b=0,x=E.length;b<x;b+=3){const D=E[b+0],R=E[b+1],A=E[b+2];u.push(D,R,R,A,A,D)}}else if(g!==void 0){const E=g.array;_=g.version;for(let b=0,x=E.length/3-1;b<x;b+=3){const D=b+0,R=b+1,A=b+2;u.push(D,R,R,A,A,D)}}else return;const m=new(ol(u)?pl:fl)(u,1);m.version=_;const f=r.get(d);f&&t.remove(f),r.set(d,m)}function h(d){const u=r.get(d);if(u){const p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function nf(s,t,e){let n;function i(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,p){s.drawElements(n,p,r,u*o),e.update(p,n,1)}function c(u,p,g){g!==0&&(s.drawElementsInstanced(n,p,r,u*o,g),e.update(p,n,g))}function h(u,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function d(u,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/o,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,u,0,_,0,g);let f=0;for(let E=0;E<g;E++)f+=p[E]*_[E];e.update(f,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function sf(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function rf(s,t,e){const n=new WeakMap,i=new Qt;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let y=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",y)};var p=y;u!==void 0&&u.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],E=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let D=a.attributes.position.count*x,R=1;D>t.maxTextureSize&&(R=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const A=new Float32Array(D*R*4*d),I=new cl(A,D,R,d);I.type=ln,I.needsUpdate=!0;const S=x*4;for(let P=0;P<d;P++){const G=f[P],F=E[P],X=b[P],q=D*R*4*P;for(let W=0;W<G.count;W++){const K=W*S;g===!0&&(i.fromBufferAttribute(G,W),A[q+K+0]=i.x,A[q+K+1]=i.y,A[q+K+2]=i.z,A[q+K+3]=0),_===!0&&(i.fromBufferAttribute(F,W),A[q+K+4]=i.x,A[q+K+5]=i.y,A[q+K+6]=i.z,A[q+K+7]=0),m===!0&&(i.fromBufferAttribute(X,W),A[q+K+8]=i.x,A[q+K+9]=i.y,A[q+K+10]=i.z,A[q+K+11]=X.itemSize===4?i.w:1)}}u={count:d,texture:I,size:new Lt(D,R)},n.set(a,u),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",_),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function af(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(i.get(d)!==c&&(t.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Ml extends Te{constructor(t,e,n,i,r,o,a,l,c,h=pi){if(h!==pi&&h!==Mi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===pi&&(n=Vn),n===void 0&&h===Mi&&(n=xi),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:qe,this.minFilter=l!==void 0?l:qe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const yl=new Te,mo=new Ml(1,1),Sl=new cl,bl=new Xc,El=new _l,go=[],_o=[],vo=new Float32Array(16),xo=new Float32Array(9),Mo=new Float32Array(4);function Ei(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=go[i];if(r===void 0&&(r=new Float32Array(i),go[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function pe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function me(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Hs(s,t){let e=_o[t];e===void 0&&(e=new Int32Array(t),_o[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function of(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function lf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2fv(this.addr,t),me(e,t)}}function cf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(pe(e,t))return;s.uniform3fv(this.addr,t),me(e,t)}}function hf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4fv(this.addr,t),me(e,t)}}function df(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;Mo.set(n),s.uniformMatrix2fv(this.addr,!1,Mo),me(e,n)}}function uf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;xo.set(n),s.uniformMatrix3fv(this.addr,!1,xo),me(e,n)}}function ff(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;vo.set(n),s.uniformMatrix4fv(this.addr,!1,vo),me(e,n)}}function pf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function mf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2iv(this.addr,t),me(e,t)}}function gf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pe(e,t))return;s.uniform3iv(this.addr,t),me(e,t)}}function _f(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4iv(this.addr,t),me(e,t)}}function vf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function xf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2uiv(this.addr,t),me(e,t)}}function Mf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pe(e,t))return;s.uniform3uiv(this.addr,t),me(e,t)}}function yf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4uiv(this.addr,t),me(e,t)}}function Sf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(mo.compareFunction=al,r=mo):r=yl,e.setTexture2D(t||r,i)}function bf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||bl,i)}function Ef(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||El,i)}function wf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Sl,i)}function Tf(s){switch(s){case 5126:return of;case 35664:return lf;case 35665:return cf;case 35666:return hf;case 35674:return df;case 35675:return uf;case 35676:return ff;case 5124:case 35670:return pf;case 35667:case 35671:return mf;case 35668:case 35672:return gf;case 35669:case 35673:return _f;case 5125:return vf;case 36294:return xf;case 36295:return Mf;case 36296:return yf;case 35678:case 36198:case 36298:case 36306:case 35682:return Sf;case 35679:case 36299:case 36307:return bf;case 35680:case 36300:case 36308:case 36293:return Ef;case 36289:case 36303:case 36311:case 36292:return wf}}function Af(s,t){s.uniform1fv(this.addr,t)}function Rf(s,t){const e=Ei(t,this.size,2);s.uniform2fv(this.addr,e)}function Cf(s,t){const e=Ei(t,this.size,3);s.uniform3fv(this.addr,e)}function Pf(s,t){const e=Ei(t,this.size,4);s.uniform4fv(this.addr,e)}function Df(s,t){const e=Ei(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function If(s,t){const e=Ei(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Lf(s,t){const e=Ei(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Uf(s,t){s.uniform1iv(this.addr,t)}function Nf(s,t){s.uniform2iv(this.addr,t)}function Ff(s,t){s.uniform3iv(this.addr,t)}function Of(s,t){s.uniform4iv(this.addr,t)}function zf(s,t){s.uniform1uiv(this.addr,t)}function Bf(s,t){s.uniform2uiv(this.addr,t)}function kf(s,t){s.uniform3uiv(this.addr,t)}function Gf(s,t){s.uniform4uiv(this.addr,t)}function Hf(s,t,e){const n=this.cache,i=t.length,r=Hs(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||yl,r[o])}function Vf(s,t,e){const n=this.cache,i=t.length,r=Hs(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||bl,r[o])}function Wf(s,t,e){const n=this.cache,i=t.length,r=Hs(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||El,r[o])}function Xf(s,t,e){const n=this.cache,i=t.length,r=Hs(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Sl,r[o])}function qf(s){switch(s){case 5126:return Af;case 35664:return Rf;case 35665:return Cf;case 35666:return Pf;case 35674:return Df;case 35675:return If;case 35676:return Lf;case 5124:case 35670:return Uf;case 35667:case 35671:return Nf;case 35668:case 35672:return Ff;case 35669:case 35673:return Of;case 5125:return zf;case 36294:return Bf;case 36295:return kf;case 36296:return Gf;case 35678:case 36198:case 36298:case 36306:case 35682:return Hf;case 35679:case 36299:case 36307:return Vf;case 35680:case 36300:case 36308:case 36293:return Wf;case 36289:case 36303:case 36311:case 36292:return Xf}}class Yf{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Tf(e.type)}}class jf{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=qf(e.type)}}class Zf{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const gr=/(\w+)(\])?(\[|\.)?/g;function yo(s,t){s.seq.push(t),s.map[t.id]=t}function $f(s,t,e){const n=s.name,i=n.length;for(gr.lastIndex=0;;){const r=gr.exec(n),o=gr.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){yo(e,c===void 0?new Yf(a,s,t):new jf(a,s,t));break}else{let d=e.map[a];d===void 0&&(d=new Zf(a),yo(e,d)),e=d}}}class Us{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);$f(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function So(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Kf=37297;let Jf=0;function Qf(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const bo=new It;function tp(s){Wt._getMatrix(bo,Wt.workingColorSpace,s);const t=`mat3( ${bo.elements.map(e=>e.toFixed(4))} )`;switch(Wt.getTransfer(s)){case ks:return[t,"LinearTransferOETF"];case Kt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Eo(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+Qf(s.getShaderSource(t),o)}else return i}function ep(s,t){const e=tp(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function np(s,t){let e;switch(t){case sc:e="Linear";break;case rc:e="Reinhard";break;case ac:e="Cineon";break;case Yo:e="ACESFilmic";break;case lc:e="AgX";break;case cc:e="Neutral";break;case oc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ms=new C;function ip(){Wt.getLuminanceCoefficients(Ms);const s=Ms.x.toFixed(4),t=Ms.y.toFixed(4),e=Ms.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ki).join(`
`)}function rp(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ap(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function ki(s){return s!==""}function wo(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function To(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const op=/^[ \t]*#include +<([\w\d./]+)>/gm;function la(s){return s.replace(op,cp)}const lp=new Map;function cp(s,t){let e=Nt[t];if(e===void 0){const n=lp.get(t);if(n!==void 0)e=Nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return la(e)}const hp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ao(s){return s.replace(hp,dp)}function dp(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ro(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function up(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Wo?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Xo?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===on&&(t="SHADOWMAP_TYPE_VSM"),t}function fp(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case _i:case vi:t="ENVMAP_TYPE_CUBE";break;case Bs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function pp(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case vi:t="ENVMAP_MODE_REFRACTION";break}return t}function mp(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case qo:t="ENVMAP_BLENDING_MULTIPLY";break;case nc:t="ENVMAP_BLENDING_MIX";break;case ic:t="ENVMAP_BLENDING_ADD";break}return t}function gp(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function _p(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=up(e),c=fp(e),h=pp(e),d=mp(e),u=gp(e),p=sp(e),g=rp(r),_=i.createProgram();let m,f,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ki).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ki).join(`
`),f.length>0&&(f+=`
`)):(m=[Ro(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ki).join(`
`),f=[Ro(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==En?"#define TONE_MAPPING":"",e.toneMapping!==En?Nt.tonemapping_pars_fragment:"",e.toneMapping!==En?np("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,ep("linearToOutputTexel",e.outputColorSpace),ip(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ki).join(`
`)),o=la(o),o=wo(o,e),o=To(o,e),a=la(a),a=wo(a,e),a=To(a,e),o=Ao(o),a=Ao(a),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Ba?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ba?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const b=E+m+o,x=E+f+a,D=So(i,i.VERTEX_SHADER,b),R=So(i,i.FRAGMENT_SHADER,x);i.attachShader(_,D),i.attachShader(_,R),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function A(P){if(s.debug.checkShaderErrors){const G=i.getProgramInfoLog(_).trim(),F=i.getShaderInfoLog(D).trim(),X=i.getShaderInfoLog(R).trim();let q=!0,W=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,D,R);else{const K=Eo(i,D,"vertex"),H=Eo(i,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+G+`
`+K+`
`+H)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(F===""||X==="")&&(W=!1);W&&(P.diagnostics={runnable:q,programLog:G,vertexShader:{log:F,prefix:m},fragmentShader:{log:X,prefix:f}})}i.deleteShader(D),i.deleteShader(R),I=new Us(i,_),S=ap(i,_)}let I;this.getUniforms=function(){return I===void 0&&A(this),I};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(_,Kf)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Jf++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=R,this}let vp=0;class xp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Mp(t),e.set(t,n)),n}}class Mp{constructor(t){this.id=vp++,this.code=t,this.usedTimes=0}}function yp(s,t,e,n,i,r,o){const a=new dl,l=new xp,c=new Set,h=[],d=i.logarithmicDepthBuffer,u=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,y,P,G,F){const X=G.fog,q=F.geometry,W=S.isMeshStandardMaterial?G.environment:null,K=(S.isMeshStandardMaterial?e:t).get(S.envMap||W),H=K&&K.mapping===Bs?K.image.height:null,st=g[S.type];S.precision!==null&&(p=i.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const dt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,St=dt!==void 0?dt.length:0;let Ot=0;q.morphAttributes.position!==void 0&&(Ot=1),q.morphAttributes.normal!==void 0&&(Ot=2),q.morphAttributes.color!==void 0&&(Ot=3);let te,j,nt,vt;if(st){const jt=Ze[st];te=jt.vertexShader,j=jt.fragmentShader}else te=S.vertexShader,j=S.fragmentShader,l.update(S),nt=l.getVertexShaderID(S),vt=l.getFragmentShaderID(S);const at=s.getRenderTarget(),Tt=s.state.buffers.depth.getReversed(),Ct=F.isInstancedMesh===!0,zt=F.isBatchedMesh===!0,le=!!S.map,Ht=!!S.matcap,he=!!K,O=!!S.aoMap,Ne=!!S.lightMap,Bt=!!S.bumpMap,kt=!!S.normalMap,Et=!!S.displacementMap,ie=!!S.emissiveMap,bt=!!S.metalnessMap,w=!!S.roughnessMap,v=S.anisotropy>0,z=S.clearcoat>0,Z=S.dispersion>0,J=S.iridescence>0,Y=S.sheen>0,xt=S.transmission>0,ot=v&&!!S.anisotropyMap,ut=z&&!!S.clearcoatMap,Vt=z&&!!S.clearcoatNormalMap,tt=z&&!!S.clearcoatRoughnessMap,ft=J&&!!S.iridescenceMap,wt=J&&!!S.iridescenceThicknessMap,At=Y&&!!S.sheenColorMap,pt=Y&&!!S.sheenRoughnessMap,Gt=!!S.specularMap,Ut=!!S.specularColorMap,ee=!!S.specularIntensityMap,L=xt&&!!S.transmissionMap,rt=xt&&!!S.thicknessMap,V=!!S.gradientMap,$=!!S.alphaMap,ht=S.alphaTest>0,lt=!!S.alphaHash,Pt=!!S.extensions;let ce=En;S.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(ce=s.toneMapping);const ve={shaderID:st,shaderType:S.type,shaderName:S.name,vertexShader:te,fragmentShader:j,defines:S.defines,customVertexShaderID:nt,customFragmentShaderID:vt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:zt,batchingColor:zt&&F._colorsTexture!==null,instancing:Ct,instancingColor:Ct&&F.instanceColor!==null,instancingMorph:Ct&&F.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:at===null?s.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:Si,alphaToCoverage:!!S.alphaToCoverage,map:le,matcap:Ht,envMap:he,envMapMode:he&&K.mapping,envMapCubeUVHeight:H,aoMap:O,lightMap:Ne,bumpMap:Bt,normalMap:kt,displacementMap:u&&Et,emissiveMap:ie,normalMapObjectSpace:kt&&S.normalMapType===fc,normalMapTangentSpace:kt&&S.normalMapType===rl,metalnessMap:bt,roughnessMap:w,anisotropy:v,anisotropyMap:ot,clearcoat:z,clearcoatMap:ut,clearcoatNormalMap:Vt,clearcoatRoughnessMap:tt,dispersion:Z,iridescence:J,iridescenceMap:ft,iridescenceThicknessMap:wt,sheen:Y,sheenColorMap:At,sheenRoughnessMap:pt,specularMap:Gt,specularColorMap:Ut,specularIntensityMap:ee,transmission:xt,transmissionMap:L,thicknessMap:rt,gradientMap:V,opaque:S.transparent===!1&&S.blending===Hn&&S.alphaToCoverage===!1,alphaMap:$,alphaTest:ht,alphaHash:lt,combine:S.combine,mapUv:le&&_(S.map.channel),aoMapUv:O&&_(S.aoMap.channel),lightMapUv:Ne&&_(S.lightMap.channel),bumpMapUv:Bt&&_(S.bumpMap.channel),normalMapUv:kt&&_(S.normalMap.channel),displacementMapUv:Et&&_(S.displacementMap.channel),emissiveMapUv:ie&&_(S.emissiveMap.channel),metalnessMapUv:bt&&_(S.metalnessMap.channel),roughnessMapUv:w&&_(S.roughnessMap.channel),anisotropyMapUv:ot&&_(S.anisotropyMap.channel),clearcoatMapUv:ut&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:Vt&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:tt&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ft&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:wt&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:At&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:pt&&_(S.sheenRoughnessMap.channel),specularMapUv:Gt&&_(S.specularMap.channel),specularColorMapUv:Ut&&_(S.specularColorMap.channel),specularIntensityMapUv:ee&&_(S.specularIntensityMap.channel),transmissionMapUv:L&&_(S.transmissionMap.channel),thicknessMapUv:rt&&_(S.thicknessMap.channel),alphaMapUv:$&&_(S.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(kt||v),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!q.attributes.uv&&(le||$),fog:!!X,useFog:S.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Tt,skinning:F.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:St,morphTextureStride:Ot,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:ce,decodeVideoTexture:le&&S.map.isVideoTexture===!0&&Wt.getTransfer(S.map.colorSpace)===Kt,decodeVideoTextureEmissive:ie&&S.emissiveMap.isVideoTexture===!0&&Wt.getTransfer(S.emissiveMap.colorSpace)===Kt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===$e,flipSided:S.side===we,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Pt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Pt&&S.extensions.multiDraw===!0||zt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ve.vertexUv1s=c.has(1),ve.vertexUv2s=c.has(2),ve.vertexUv3s=c.has(3),c.clear(),ve}function f(S){const y=[];if(S.shaderID?y.push(S.shaderID):(y.push(S.customVertexShaderID),y.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)y.push(P),y.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(E(y,S),b(y,S),y.push(s.outputColorSpace)),y.push(S.customProgramCacheKey),y.join()}function E(S,y){S.push(y.precision),S.push(y.outputColorSpace),S.push(y.envMapMode),S.push(y.envMapCubeUVHeight),S.push(y.mapUv),S.push(y.alphaMapUv),S.push(y.lightMapUv),S.push(y.aoMapUv),S.push(y.bumpMapUv),S.push(y.normalMapUv),S.push(y.displacementMapUv),S.push(y.emissiveMapUv),S.push(y.metalnessMapUv),S.push(y.roughnessMapUv),S.push(y.anisotropyMapUv),S.push(y.clearcoatMapUv),S.push(y.clearcoatNormalMapUv),S.push(y.clearcoatRoughnessMapUv),S.push(y.iridescenceMapUv),S.push(y.iridescenceThicknessMapUv),S.push(y.sheenColorMapUv),S.push(y.sheenRoughnessMapUv),S.push(y.specularMapUv),S.push(y.specularColorMapUv),S.push(y.specularIntensityMapUv),S.push(y.transmissionMapUv),S.push(y.thicknessMapUv),S.push(y.combine),S.push(y.fogExp2),S.push(y.sizeAttenuation),S.push(y.morphTargetsCount),S.push(y.morphAttributeCount),S.push(y.numDirLights),S.push(y.numPointLights),S.push(y.numSpotLights),S.push(y.numSpotLightMaps),S.push(y.numHemiLights),S.push(y.numRectAreaLights),S.push(y.numDirLightShadows),S.push(y.numPointLightShadows),S.push(y.numSpotLightShadows),S.push(y.numSpotLightShadowsWithMaps),S.push(y.numLightProbes),S.push(y.shadowMapType),S.push(y.toneMapping),S.push(y.numClippingPlanes),S.push(y.numClipIntersection),S.push(y.depthPacking)}function b(S,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),S.push(a.mask)}function x(S){const y=g[S.type];let P;if(y){const G=Ze[y];P=ih.clone(G.uniforms)}else P=S.uniforms;return P}function D(S,y){let P;for(let G=0,F=h.length;G<F;G++){const X=h[G];if(X.cacheKey===y){P=X,++P.usedTimes;break}}return P===void 0&&(P=new _p(s,y,S,r),h.push(P)),P}function R(S){if(--S.usedTimes===0){const y=h.indexOf(S);h[y]=h[h.length-1],h.pop(),S.destroy()}}function A(S){l.remove(S)}function I(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:x,acquireProgram:D,releaseProgram:R,releaseShaderCache:A,programs:h,dispose:I}}function Sp(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function bp(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Co(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Po(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(d,u,p,g,_,m){let f=s[t];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},s[t]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=_,f.group=m),t++,f}function a(d,u,p,g,_,m){const f=o(d,u,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?i.push(f):e.push(f)}function l(d,u,p,g,_,m){const f=o(d,u,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?i.unshift(f):e.unshift(f)}function c(d,u){e.length>1&&e.sort(d||bp),n.length>1&&n.sort(u||Co),i.length>1&&i.sort(u||Co)}function h(){for(let d=t,u=s.length;d<u;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Ep(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new Po,s.set(n,[o])):i>=r.length?(o=new Po,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function wp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Ft};break;case"SpotLight":e={position:new C,direction:new C,color:new Ft,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Ft,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Ft,groundColor:new Ft};break;case"RectAreaLight":e={color:new Ft,position:new C,halfWidth:new C,halfHeight:new C};break}return s[t.id]=e,e}}}function Tp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Ap=0;function Rp(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Cp(s){const t=new wp,e=Tp(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const i=new C,r=new oe,o=new oe;function a(c){let h=0,d=0,u=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,E=0,b=0,x=0,D=0,R=0,A=0;c.sort(Rp);for(let S=0,y=c.length;S<y;S++){const P=c[S],G=P.color,F=P.intensity,X=P.distance,q=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=G.r*F,d+=G.g*F,u+=G.b*F;else if(P.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(P.sh.coefficients[W],F);A++}else if(P.isDirectionalLight){const W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const K=P.shadow,H=e.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.directionalShadow[p]=H,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=P.shadow.matrix,E++}n.directional[p]=W,p++}else if(P.isSpotLight){const W=t.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(G).multiplyScalar(F),W.distance=X,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,n.spot[_]=W;const K=P.shadow;if(P.map&&(n.spotLightMap[D]=P.map,D++,K.updateMatrices(P),P.castShadow&&R++),n.spotLightMatrix[_]=K.matrix,P.castShadow){const H=e.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=q,x++}_++}else if(P.isRectAreaLight){const W=t.get(P);W.color.copy(G).multiplyScalar(F),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=W,m++}else if(P.isPointLight){const W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){const K=P.shadow,H=e.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,H.shadowCameraNear=K.camera.near,H.shadowCameraFar=K.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=P.shadow.matrix,b++}n.point[g]=W,g++}else if(P.isHemisphereLight){const W=t.get(P);W.skyColor.copy(P.color).multiplyScalar(F),W.groundColor.copy(P.groundColor).multiplyScalar(F),n.hemi[f]=W,f++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=it.LTC_FLOAT_1,n.rectAreaLTC2=it.LTC_FLOAT_2):(n.rectAreaLTC1=it.LTC_HALF_1,n.rectAreaLTC2=it.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const I=n.hash;(I.directionalLength!==p||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==f||I.numDirectionalShadows!==E||I.numPointShadows!==b||I.numSpotShadows!==x||I.numSpotMaps!==D||I.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=x+D-R,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=A,I.directionalLength=p,I.pointLength=g,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=f,I.numDirectionalShadows=E,I.numPointShadows=b,I.numSpotShadows=x,I.numSpotMaps=D,I.numLightProbes=A,n.version=Ap++)}function l(c,h){let d=0,u=0,p=0,g=0,_=0;const m=h.matrixWorldInverse;for(let f=0,E=c.length;f<E;f++){const b=c[f];if(b.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),d++}else if(b.isSpotLight){const x=n.spot[p];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),p++}else if(b.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(b.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(b.width*.5,0,0),x.halfHeight.set(0,b.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){const x=n.point[u];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),u++}else if(b.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(b.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Do(s){const t=new Cp(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Pp(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new Do(s),t.set(i,[a])):r>=o.length?(a=new Do(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Dp extends Xn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=dc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ip extends Xn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Lp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Up=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Np(s,t,e){let n=new xa;const i=new Lt,r=new Lt,o=new Qt,a=new Dp({depthPacking:uc}),l=new Ip,c={},h=e.maxTextureSize,d={[wn]:we,[we]:wn,[$e]:$e},u=new fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:Lp,fragmentShader:Up}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ce;g.setAttribute("position",new Ue(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Q(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wo;let f=this.type;this.render=function(R,A,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const S=s.getRenderTarget(),y=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),G=s.state;G.setBlending(bn),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const F=f!==on&&this.type===on,X=f===on&&this.type!==on;for(let q=0,W=R.length;q<W;q++){const K=R[q],H=K.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const st=H.getFrameExtents();if(i.multiply(st),r.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/st.x),i.x=r.x*st.x,H.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/st.y),i.y=r.y*st.y,H.mapSize.y=r.y)),H.map===null||F===!0||X===!0){const St=this.type!==on?{minFilter:qe,magFilter:qe}:{};H.map!==null&&H.map.dispose(),H.map=new Wn(i.x,i.y,St),H.map.texture.name=K.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const dt=H.getViewportCount();for(let St=0;St<dt;St++){const Ot=H.getViewport(St);o.set(r.x*Ot.x,r.y*Ot.y,r.x*Ot.z,r.y*Ot.w),G.viewport(o),H.updateMatrices(K,St),n=H.getFrustum(),x(A,I,H.camera,K,this.type)}H.isPointLightShadow!==!0&&this.type===on&&E(H,I),H.needsUpdate=!1}f=this.type,m.needsUpdate=!1,s.setRenderTarget(S,y,P)};function E(R,A){const I=t.update(_);u.defines.VSM_SAMPLES!==R.blurSamples&&(u.defines.VSM_SAMPLES=R.blurSamples,p.defines.VSM_SAMPLES=R.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Wn(i.x,i.y)),u.uniforms.shadow_pass.value=R.map.texture,u.uniforms.resolution.value=R.mapSize,u.uniforms.radius.value=R.radius,s.setRenderTarget(R.mapPass),s.clear(),s.renderBufferDirect(A,null,I,u,_,null),p.uniforms.shadow_pass.value=R.mapPass.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,s.setRenderTarget(R.map),s.clear(),s.renderBufferDirect(A,null,I,p,_,null)}function b(R,A,I,S){let y=null;const P=I.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(P!==void 0)y=P;else if(y=I.isPointLight===!0?l:a,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const G=y.uuid,F=A.uuid;let X=c[G];X===void 0&&(X={},c[G]=X);let q=X[F];q===void 0&&(q=y.clone(),X[F]=q,A.addEventListener("dispose",D)),y=q}if(y.visible=A.visible,y.wireframe=A.wireframe,S===on?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:d[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,I.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const G=s.properties.get(y);G.light=I}return y}function x(R,A,I,S,y){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&y===on)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,R.matrixWorld);const F=t.update(R),X=R.material;if(Array.isArray(X)){const q=F.groups;for(let W=0,K=q.length;W<K;W++){const H=q[W],st=X[H.materialIndex];if(st&&st.visible){const dt=b(R,st,S,y);R.onBeforeShadow(s,R,A,I,F,dt,H),s.renderBufferDirect(I,null,F,dt,R,H),R.onAfterShadow(s,R,A,I,F,dt,H)}}}else if(X.visible){const q=b(R,X,S,y);R.onBeforeShadow(s,R,A,I,F,q,null),s.renderBufferDirect(I,null,F,q,R,null),R.onAfterShadow(s,R,A,I,F,q,null)}}const G=R.children;for(let F=0,X=G.length;F<X;F++)x(G[F],A,I,S,y)}function D(R){R.target.removeEventListener("dispose",D);for(const I in c){const S=c[I],y=R.target.uuid;y in S&&(S[y].dispose(),delete S[y])}}}const Fp={[wr]:Tr,[Ar]:Pr,[Rr]:Dr,[gi]:Cr,[Tr]:wr,[Pr]:Ar,[Dr]:Rr,[Cr]:gi};function Op(s,t){function e(){let L=!1;const rt=new Qt;let V=null;const $=new Qt(0,0,0,0);return{setMask:function(ht){V!==ht&&!L&&(s.colorMask(ht,ht,ht,ht),V=ht)},setLocked:function(ht){L=ht},setClear:function(ht,lt,Pt,ce,ve){ve===!0&&(ht*=ce,lt*=ce,Pt*=ce),rt.set(ht,lt,Pt,ce),$.equals(rt)===!1&&(s.clearColor(ht,lt,Pt,ce),$.copy(rt))},reset:function(){L=!1,V=null,$.set(-1,0,0,0)}}}function n(){let L=!1,rt=!1,V=null,$=null,ht=null;return{setReversed:function(lt){if(rt!==lt){const Pt=t.get("EXT_clip_control");rt?Pt.clipControlEXT(Pt.LOWER_LEFT_EXT,Pt.ZERO_TO_ONE_EXT):Pt.clipControlEXT(Pt.LOWER_LEFT_EXT,Pt.NEGATIVE_ONE_TO_ONE_EXT);const ce=ht;ht=null,this.setClear(ce)}rt=lt},getReversed:function(){return rt},setTest:function(lt){lt?at(s.DEPTH_TEST):Tt(s.DEPTH_TEST)},setMask:function(lt){V!==lt&&!L&&(s.depthMask(lt),V=lt)},setFunc:function(lt){if(rt&&(lt=Fp[lt]),$!==lt){switch(lt){case wr:s.depthFunc(s.NEVER);break;case Tr:s.depthFunc(s.ALWAYS);break;case Ar:s.depthFunc(s.LESS);break;case gi:s.depthFunc(s.LEQUAL);break;case Rr:s.depthFunc(s.EQUAL);break;case Cr:s.depthFunc(s.GEQUAL);break;case Pr:s.depthFunc(s.GREATER);break;case Dr:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}$=lt}},setLocked:function(lt){L=lt},setClear:function(lt){ht!==lt&&(rt&&(lt=1-lt),s.clearDepth(lt),ht=lt)},reset:function(){L=!1,V=null,$=null,ht=null,rt=!1}}}function i(){let L=!1,rt=null,V=null,$=null,ht=null,lt=null,Pt=null,ce=null,ve=null;return{setTest:function(jt){L||(jt?at(s.STENCIL_TEST):Tt(s.STENCIL_TEST))},setMask:function(jt){rt!==jt&&!L&&(s.stencilMask(jt),rt=jt)},setFunc:function(jt,Be,Qe){(V!==jt||$!==Be||ht!==Qe)&&(s.stencilFunc(jt,Be,Qe),V=jt,$=Be,ht=Qe)},setOp:function(jt,Be,Qe){(lt!==jt||Pt!==Be||ce!==Qe)&&(s.stencilOp(jt,Be,Qe),lt=jt,Pt=Be,ce=Qe)},setLocked:function(jt){L=jt},setClear:function(jt){ve!==jt&&(s.clearStencil(jt),ve=jt)},reset:function(){L=!1,rt=null,V=null,$=null,ht=null,lt=null,Pt=null,ce=null,ve=null}}}const r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,E=null,b=null,x=null,D=null,R=null,A=new Ft(0,0,0),I=0,S=!1,y=null,P=null,G=null,F=null,X=null;const q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,K=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(H)[1]),W=K>=1):H.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),W=K>=2);let st=null,dt={};const St=s.getParameter(s.SCISSOR_BOX),Ot=s.getParameter(s.VIEWPORT),te=new Qt().fromArray(St),j=new Qt().fromArray(Ot);function nt(L,rt,V,$){const ht=new Uint8Array(4),lt=s.createTexture();s.bindTexture(L,lt),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Pt=0;Pt<V;Pt++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(rt,0,s.RGBA,1,1,$,0,s.RGBA,s.UNSIGNED_BYTE,ht):s.texImage2D(rt+Pt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ht);return lt}const vt={};vt[s.TEXTURE_2D]=nt(s.TEXTURE_2D,s.TEXTURE_2D,1),vt[s.TEXTURE_CUBE_MAP]=nt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),vt[s.TEXTURE_2D_ARRAY]=nt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),vt[s.TEXTURE_3D]=nt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),at(s.DEPTH_TEST),o.setFunc(gi),Bt(!1),kt(Na),at(s.CULL_FACE),O(bn);function at(L){h[L]!==!0&&(s.enable(L),h[L]=!0)}function Tt(L){h[L]!==!1&&(s.disable(L),h[L]=!1)}function Ct(L,rt){return d[L]!==rt?(s.bindFramebuffer(L,rt),d[L]=rt,L===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=rt),L===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=rt),!0):!1}function zt(L,rt){let V=p,$=!1;if(L){V=u.get(rt),V===void 0&&(V=[],u.set(rt,V));const ht=L.textures;if(V.length!==ht.length||V[0]!==s.COLOR_ATTACHMENT0){for(let lt=0,Pt=ht.length;lt<Pt;lt++)V[lt]=s.COLOR_ATTACHMENT0+lt;V.length=ht.length,$=!0}}else V[0]!==s.BACK&&(V[0]=s.BACK,$=!0);$&&s.drawBuffers(V)}function le(L){return g!==L?(s.useProgram(L),g=L,!0):!1}const Ht={[On]:s.FUNC_ADD,[Bl]:s.FUNC_SUBTRACT,[kl]:s.FUNC_REVERSE_SUBTRACT};Ht[Gl]=s.MIN,Ht[Hl]=s.MAX;const he={[Vl]:s.ZERO,[Wl]:s.ONE,[Xl]:s.SRC_COLOR,[br]:s.SRC_ALPHA,[Kl]:s.SRC_ALPHA_SATURATE,[Zl]:s.DST_COLOR,[Yl]:s.DST_ALPHA,[ql]:s.ONE_MINUS_SRC_COLOR,[Er]:s.ONE_MINUS_SRC_ALPHA,[$l]:s.ONE_MINUS_DST_COLOR,[jl]:s.ONE_MINUS_DST_ALPHA,[Jl]:s.CONSTANT_COLOR,[Ql]:s.ONE_MINUS_CONSTANT_COLOR,[tc]:s.CONSTANT_ALPHA,[ec]:s.ONE_MINUS_CONSTANT_ALPHA};function O(L,rt,V,$,ht,lt,Pt,ce,ve,jt){if(L===bn){_===!0&&(Tt(s.BLEND),_=!1);return}if(_===!1&&(at(s.BLEND),_=!0),L!==zl){if(L!==m||jt!==S){if((f!==On||x!==On)&&(s.blendEquation(s.FUNC_ADD),f=On,x=On),jt)switch(L){case Hn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Vi:s.blendFunc(s.ONE,s.ONE);break;case Fa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Oa:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Hn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Vi:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Fa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Oa:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}E=null,b=null,D=null,R=null,A.set(0,0,0),I=0,m=L,S=jt}return}ht=ht||rt,lt=lt||V,Pt=Pt||$,(rt!==f||ht!==x)&&(s.blendEquationSeparate(Ht[rt],Ht[ht]),f=rt,x=ht),(V!==E||$!==b||lt!==D||Pt!==R)&&(s.blendFuncSeparate(he[V],he[$],he[lt],he[Pt]),E=V,b=$,D=lt,R=Pt),(ce.equals(A)===!1||ve!==I)&&(s.blendColor(ce.r,ce.g,ce.b,ve),A.copy(ce),I=ve),m=L,S=!1}function Ne(L,rt){L.side===$e?Tt(s.CULL_FACE):at(s.CULL_FACE);let V=L.side===we;rt&&(V=!V),Bt(V),L.blending===Hn&&L.transparent===!1?O(bn):O(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),r.setMask(L.colorWrite);const $=L.stencilWrite;a.setTest($),$&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ie(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?at(s.SAMPLE_ALPHA_TO_COVERAGE):Tt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Bt(L){y!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),y=L)}function kt(L){L!==Fl?(at(s.CULL_FACE),L!==P&&(L===Na?s.cullFace(s.BACK):L===Ol?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Tt(s.CULL_FACE),P=L}function Et(L){L!==G&&(W&&s.lineWidth(L),G=L)}function ie(L,rt,V){L?(at(s.POLYGON_OFFSET_FILL),(F!==rt||X!==V)&&(s.polygonOffset(rt,V),F=rt,X=V)):Tt(s.POLYGON_OFFSET_FILL)}function bt(L){L?at(s.SCISSOR_TEST):Tt(s.SCISSOR_TEST)}function w(L){L===void 0&&(L=s.TEXTURE0+q-1),st!==L&&(s.activeTexture(L),st=L)}function v(L,rt,V){V===void 0&&(st===null?V=s.TEXTURE0+q-1:V=st);let $=dt[V];$===void 0&&($={type:void 0,texture:void 0},dt[V]=$),($.type!==L||$.texture!==rt)&&(st!==V&&(s.activeTexture(V),st=V),s.bindTexture(L,rt||vt[L]),$.type=L,$.texture=rt)}function z(){const L=dt[st];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Z(){try{s.compressedTexImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{s.compressedTexImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Y(){try{s.texSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{s.texSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ot(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ut(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Vt(){try{s.texStorage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function tt(){try{s.texStorage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ft(){try{s.texImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function wt(){try{s.texImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function At(L){te.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),te.copy(L))}function pt(L){j.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),j.copy(L))}function Gt(L,rt){let V=c.get(rt);V===void 0&&(V=new WeakMap,c.set(rt,V));let $=V.get(L);$===void 0&&($=s.getUniformBlockIndex(rt,L.name),V.set(L,$))}function Ut(L,rt){const $=c.get(rt).get(L);l.get(rt)!==$&&(s.uniformBlockBinding(rt,$,L.__bindingPointIndex),l.set(rt,$))}function ee(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},st=null,dt={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,E=null,b=null,x=null,D=null,R=null,A=new Ft(0,0,0),I=0,S=!1,y=null,P=null,G=null,F=null,X=null,te.set(0,0,s.canvas.width,s.canvas.height),j.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:at,disable:Tt,bindFramebuffer:Ct,drawBuffers:zt,useProgram:le,setBlending:O,setMaterial:Ne,setFlipSided:Bt,setCullFace:kt,setLineWidth:Et,setPolygonOffset:ie,setScissorTest:bt,activeTexture:w,bindTexture:v,unbindTexture:z,compressedTexImage2D:Z,compressedTexImage3D:J,texImage2D:ft,texImage3D:wt,updateUBOMapping:Gt,uniformBlockBinding:Ut,texStorage2D:Vt,texStorage3D:tt,texSubImage2D:Y,texSubImage3D:xt,compressedTexSubImage2D:ot,compressedTexSubImage3D:ut,scissor:At,viewport:pt,reset:ee}}function Io(s,t,e,n){const i=zp(n);switch(e){case Jo:return s*t;case tl:return s*t;case el:return s*t*2;case nl:return s*t/i.components*i.byteLength;case ma:return s*t/i.components*i.byteLength;case il:return s*t*2/i.components*i.byteLength;case ga:return s*t*2/i.components*i.byteLength;case Qo:return s*t*3/i.components*i.byteLength;case Xe:return s*t*4/i.components*i.byteLength;case _a:return s*t*4/i.components*i.byteLength;case Cs:case Ps:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ds:case Is:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Fr:case zr:return Math.max(s,16)*Math.max(t,8)/4;case Nr:case Or:return Math.max(s,8)*Math.max(t,8)/2;case Br:case kr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Gr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Hr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Vr:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Wr:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Xr:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case qr:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Yr:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case jr:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Zr:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case $r:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Kr:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Jr:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Qr:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case ta:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case ea:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Ls:case na:case ia:return Math.ceil(s/4)*Math.ceil(t/4)*16;case sl:case sa:return Math.ceil(s/4)*Math.ceil(t/4)*8;case ra:case aa:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function zp(s){switch(s){case un:case Zo:return{byteLength:1,components:1};case Xi:case $o:case Yi:return{byteLength:2,components:1};case fa:case pa:return{byteLength:2,components:4};case Vn:case ua:case ln:return{byteLength:4,components:1};case Ko:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function Bp(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Lt,h=new WeakMap;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,v){return p?new OffscreenCanvas(w,v):Fs("canvas")}function _(w,v,z){let Z=1;const J=bt(w);if((J.width>z||J.height>z)&&(Z=z/Math.max(J.width,J.height)),Z<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Y=Math.floor(Z*J.width),xt=Math.floor(Z*J.height);d===void 0&&(d=g(Y,xt));const ot=v?g(Y,xt):d;return ot.width=Y,ot.height=xt,ot.getContext("2d").drawImage(w,0,0,Y,xt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+Y+"x"+xt+")."),ot}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),w;return w}function m(w){return w.generateMipmaps}function f(w){s.generateMipmap(w)}function E(w){return w.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?s.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function b(w,v,z,Z,J=!1){if(w!==null){if(s[w]!==void 0)return s[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Y=v;if(v===s.RED&&(z===s.FLOAT&&(Y=s.R32F),z===s.HALF_FLOAT&&(Y=s.R16F),z===s.UNSIGNED_BYTE&&(Y=s.R8)),v===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(Y=s.R8UI),z===s.UNSIGNED_SHORT&&(Y=s.R16UI),z===s.UNSIGNED_INT&&(Y=s.R32UI),z===s.BYTE&&(Y=s.R8I),z===s.SHORT&&(Y=s.R16I),z===s.INT&&(Y=s.R32I)),v===s.RG&&(z===s.FLOAT&&(Y=s.RG32F),z===s.HALF_FLOAT&&(Y=s.RG16F),z===s.UNSIGNED_BYTE&&(Y=s.RG8)),v===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(Y=s.RG8UI),z===s.UNSIGNED_SHORT&&(Y=s.RG16UI),z===s.UNSIGNED_INT&&(Y=s.RG32UI),z===s.BYTE&&(Y=s.RG8I),z===s.SHORT&&(Y=s.RG16I),z===s.INT&&(Y=s.RG32I)),v===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(Y=s.RGB8UI),z===s.UNSIGNED_SHORT&&(Y=s.RGB16UI),z===s.UNSIGNED_INT&&(Y=s.RGB32UI),z===s.BYTE&&(Y=s.RGB8I),z===s.SHORT&&(Y=s.RGB16I),z===s.INT&&(Y=s.RGB32I)),v===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(Y=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(Y=s.RGBA16UI),z===s.UNSIGNED_INT&&(Y=s.RGBA32UI),z===s.BYTE&&(Y=s.RGBA8I),z===s.SHORT&&(Y=s.RGBA16I),z===s.INT&&(Y=s.RGBA32I)),v===s.RGB&&z===s.UNSIGNED_INT_5_9_9_9_REV&&(Y=s.RGB9_E5),v===s.RGBA){const xt=J?ks:Wt.getTransfer(Z);z===s.FLOAT&&(Y=s.RGBA32F),z===s.HALF_FLOAT&&(Y=s.RGBA16F),z===s.UNSIGNED_BYTE&&(Y=xt===Kt?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT_4_4_4_4&&(Y=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(Y=s.RGB5_A1)}return(Y===s.R16F||Y===s.R32F||Y===s.RG16F||Y===s.RG32F||Y===s.RGBA16F||Y===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function x(w,v){let z;return w?v===null||v===Vn||v===xi?z=s.DEPTH24_STENCIL8:v===ln?z=s.DEPTH32F_STENCIL8:v===Xi&&(z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Vn||v===xi?z=s.DEPTH_COMPONENT24:v===ln?z=s.DEPTH_COMPONENT32F:v===Xi&&(z=s.DEPTH_COMPONENT16),z}function D(w,v){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==qe&&w.minFilter!==Ke?Math.log2(Math.max(v.width,v.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?v.mipmaps.length:1}function R(w){const v=w.target;v.removeEventListener("dispose",R),I(v),v.isVideoTexture&&h.delete(v)}function A(w){const v=w.target;v.removeEventListener("dispose",A),y(v)}function I(w){const v=n.get(w);if(v.__webglInit===void 0)return;const z=w.source,Z=u.get(z);if(Z){const J=Z[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&S(w),Object.keys(Z).length===0&&u.delete(z)}n.remove(w)}function S(w){const v=n.get(w);s.deleteTexture(v.__webglTexture);const z=w.source,Z=u.get(z);delete Z[v.__cacheKey],o.memory.textures--}function y(w){const v=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(v.__webglFramebuffer[Z]))for(let J=0;J<v.__webglFramebuffer[Z].length;J++)s.deleteFramebuffer(v.__webglFramebuffer[Z][J]);else s.deleteFramebuffer(v.__webglFramebuffer[Z]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[Z])}else{if(Array.isArray(v.__webglFramebuffer))for(let Z=0;Z<v.__webglFramebuffer.length;Z++)s.deleteFramebuffer(v.__webglFramebuffer[Z]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Z=0;Z<v.__webglColorRenderbuffer.length;Z++)v.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[Z]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const z=w.textures;for(let Z=0,J=z.length;Z<J;Z++){const Y=n.get(z[Z]);Y.__webglTexture&&(s.deleteTexture(Y.__webglTexture),o.memory.textures--),n.remove(z[Z])}n.remove(w)}let P=0;function G(){P=0}function F(){const w=P;return w>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+i.maxTextures),P+=1,w}function X(w){const v=[];return v.push(w.wrapS),v.push(w.wrapT),v.push(w.wrapR||0),v.push(w.magFilter),v.push(w.minFilter),v.push(w.anisotropy),v.push(w.internalFormat),v.push(w.format),v.push(w.type),v.push(w.generateMipmaps),v.push(w.premultiplyAlpha),v.push(w.flipY),v.push(w.unpackAlignment),v.push(w.colorSpace),v.join()}function q(w,v){const z=n.get(w);if(w.isVideoTexture&&Et(w),w.isRenderTargetTexture===!1&&w.version>0&&z.__version!==w.version){const Z=w.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(z,w,v);return}}e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+v)}function W(w,v){const z=n.get(w);if(w.version>0&&z.__version!==w.version){j(z,w,v);return}e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+v)}function K(w,v){const z=n.get(w);if(w.version>0&&z.__version!==w.version){j(z,w,v);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+v)}function H(w,v){const z=n.get(w);if(w.version>0&&z.__version!==w.version){nt(z,w,v);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+v)}const st={[Wi]:s.REPEAT,[kn]:s.CLAMP_TO_EDGE,[Ur]:s.MIRRORED_REPEAT},dt={[qe]:s.NEAREST,[hc]:s.NEAREST_MIPMAP_NEAREST,[ts]:s.NEAREST_MIPMAP_LINEAR,[Ke]:s.LINEAR,[Ws]:s.LINEAR_MIPMAP_NEAREST,[Gn]:s.LINEAR_MIPMAP_LINEAR},St={[pc]:s.NEVER,[Mc]:s.ALWAYS,[mc]:s.LESS,[al]:s.LEQUAL,[gc]:s.EQUAL,[xc]:s.GEQUAL,[_c]:s.GREATER,[vc]:s.NOTEQUAL};function Ot(w,v){if(v.type===ln&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===Ke||v.magFilter===Ws||v.magFilter===ts||v.magFilter===Gn||v.minFilter===Ke||v.minFilter===Ws||v.minFilter===ts||v.minFilter===Gn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(w,s.TEXTURE_WRAP_S,st[v.wrapS]),s.texParameteri(w,s.TEXTURE_WRAP_T,st[v.wrapT]),(w===s.TEXTURE_3D||w===s.TEXTURE_2D_ARRAY)&&s.texParameteri(w,s.TEXTURE_WRAP_R,st[v.wrapR]),s.texParameteri(w,s.TEXTURE_MAG_FILTER,dt[v.magFilter]),s.texParameteri(w,s.TEXTURE_MIN_FILTER,dt[v.minFilter]),v.compareFunction&&(s.texParameteri(w,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(w,s.TEXTURE_COMPARE_FUNC,St[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===qe||v.minFilter!==ts&&v.minFilter!==Gn||v.type===ln&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(w,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function te(w,v){let z=!1;w.__webglInit===void 0&&(w.__webglInit=!0,v.addEventListener("dispose",R));const Z=v.source;let J=u.get(Z);J===void 0&&(J={},u.set(Z,J));const Y=X(v);if(Y!==w.__cacheKey){J[Y]===void 0&&(J[Y]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,z=!0),J[Y].usedTimes++;const xt=J[w.__cacheKey];xt!==void 0&&(J[w.__cacheKey].usedTimes--,xt.usedTimes===0&&S(v)),w.__cacheKey=Y,w.__webglTexture=J[Y].texture}return z}function j(w,v,z){let Z=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Z=s.TEXTURE_3D);const J=te(w,v),Y=v.source;e.bindTexture(Z,w.__webglTexture,s.TEXTURE0+z);const xt=n.get(Y);if(Y.version!==xt.__version||J===!0){e.activeTexture(s.TEXTURE0+z);const ot=Wt.getPrimaries(Wt.workingColorSpace),ut=v.colorSpace===Sn?null:Wt.getPrimaries(v.colorSpace),Vt=v.colorSpace===Sn||ot===ut?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt);let tt=_(v.image,!1,i.maxTextureSize);tt=ie(v,tt);const ft=r.convert(v.format,v.colorSpace),wt=r.convert(v.type);let At=b(v.internalFormat,ft,wt,v.colorSpace,v.isVideoTexture);Ot(Z,v);let pt;const Gt=v.mipmaps,Ut=v.isVideoTexture!==!0,ee=xt.__version===void 0||J===!0,L=Y.dataReady,rt=D(v,tt);if(v.isDepthTexture)At=x(v.format===Mi,v.type),ee&&(Ut?e.texStorage2D(s.TEXTURE_2D,1,At,tt.width,tt.height):e.texImage2D(s.TEXTURE_2D,0,At,tt.width,tt.height,0,ft,wt,null));else if(v.isDataTexture)if(Gt.length>0){Ut&&ee&&e.texStorage2D(s.TEXTURE_2D,rt,At,Gt[0].width,Gt[0].height);for(let V=0,$=Gt.length;V<$;V++)pt=Gt[V],Ut?L&&e.texSubImage2D(s.TEXTURE_2D,V,0,0,pt.width,pt.height,ft,wt,pt.data):e.texImage2D(s.TEXTURE_2D,V,At,pt.width,pt.height,0,ft,wt,pt.data);v.generateMipmaps=!1}else Ut?(ee&&e.texStorage2D(s.TEXTURE_2D,rt,At,tt.width,tt.height),L&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,tt.width,tt.height,ft,wt,tt.data)):e.texImage2D(s.TEXTURE_2D,0,At,tt.width,tt.height,0,ft,wt,tt.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ut&&ee&&e.texStorage3D(s.TEXTURE_2D_ARRAY,rt,At,Gt[0].width,Gt[0].height,tt.depth);for(let V=0,$=Gt.length;V<$;V++)if(pt=Gt[V],v.format!==Xe)if(ft!==null)if(Ut){if(L)if(v.layerUpdates.size>0){const ht=Io(pt.width,pt.height,v.format,v.type);for(const lt of v.layerUpdates){const Pt=pt.data.subarray(lt*ht/pt.data.BYTES_PER_ELEMENT,(lt+1)*ht/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,V,0,0,lt,pt.width,pt.height,1,ft,Pt)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,V,0,0,0,pt.width,pt.height,tt.depth,ft,pt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,V,At,pt.width,pt.height,tt.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?L&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,V,0,0,0,pt.width,pt.height,tt.depth,ft,wt,pt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,V,At,pt.width,pt.height,tt.depth,0,ft,wt,pt.data)}else{Ut&&ee&&e.texStorage2D(s.TEXTURE_2D,rt,At,Gt[0].width,Gt[0].height);for(let V=0,$=Gt.length;V<$;V++)pt=Gt[V],v.format!==Xe?ft!==null?Ut?L&&e.compressedTexSubImage2D(s.TEXTURE_2D,V,0,0,pt.width,pt.height,ft,pt.data):e.compressedTexImage2D(s.TEXTURE_2D,V,At,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?L&&e.texSubImage2D(s.TEXTURE_2D,V,0,0,pt.width,pt.height,ft,wt,pt.data):e.texImage2D(s.TEXTURE_2D,V,At,pt.width,pt.height,0,ft,wt,pt.data)}else if(v.isDataArrayTexture)if(Ut){if(ee&&e.texStorage3D(s.TEXTURE_2D_ARRAY,rt,At,tt.width,tt.height,tt.depth),L)if(v.layerUpdates.size>0){const V=Io(tt.width,tt.height,v.format,v.type);for(const $ of v.layerUpdates){const ht=tt.data.subarray($*V/tt.data.BYTES_PER_ELEMENT,($+1)*V/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,$,tt.width,tt.height,1,ft,wt,ht)}v.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,ft,wt,tt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,At,tt.width,tt.height,tt.depth,0,ft,wt,tt.data);else if(v.isData3DTexture)Ut?(ee&&e.texStorage3D(s.TEXTURE_3D,rt,At,tt.width,tt.height,tt.depth),L&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,ft,wt,tt.data)):e.texImage3D(s.TEXTURE_3D,0,At,tt.width,tt.height,tt.depth,0,ft,wt,tt.data);else if(v.isFramebufferTexture){if(ee)if(Ut)e.texStorage2D(s.TEXTURE_2D,rt,At,tt.width,tt.height);else{let V=tt.width,$=tt.height;for(let ht=0;ht<rt;ht++)e.texImage2D(s.TEXTURE_2D,ht,At,V,$,0,ft,wt,null),V>>=1,$>>=1}}else if(Gt.length>0){if(Ut&&ee){const V=bt(Gt[0]);e.texStorage2D(s.TEXTURE_2D,rt,At,V.width,V.height)}for(let V=0,$=Gt.length;V<$;V++)pt=Gt[V],Ut?L&&e.texSubImage2D(s.TEXTURE_2D,V,0,0,ft,wt,pt):e.texImage2D(s.TEXTURE_2D,V,At,ft,wt,pt);v.generateMipmaps=!1}else if(Ut){if(ee){const V=bt(tt);e.texStorage2D(s.TEXTURE_2D,rt,At,V.width,V.height)}L&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ft,wt,tt)}else e.texImage2D(s.TEXTURE_2D,0,At,ft,wt,tt);m(v)&&f(Z),xt.__version=Y.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function nt(w,v,z){if(v.image.length!==6)return;const Z=te(w,v),J=v.source;e.bindTexture(s.TEXTURE_CUBE_MAP,w.__webglTexture,s.TEXTURE0+z);const Y=n.get(J);if(J.version!==Y.__version||Z===!0){e.activeTexture(s.TEXTURE0+z);const xt=Wt.getPrimaries(Wt.workingColorSpace),ot=v.colorSpace===Sn?null:Wt.getPrimaries(v.colorSpace),ut=v.colorSpace===Sn||xt===ot?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const Vt=v.isCompressedTexture||v.image[0].isCompressedTexture,tt=v.image[0]&&v.image[0].isDataTexture,ft=[];for(let $=0;$<6;$++)!Vt&&!tt?ft[$]=_(v.image[$],!0,i.maxCubemapSize):ft[$]=tt?v.image[$].image:v.image[$],ft[$]=ie(v,ft[$]);const wt=ft[0],At=r.convert(v.format,v.colorSpace),pt=r.convert(v.type),Gt=b(v.internalFormat,At,pt,v.colorSpace),Ut=v.isVideoTexture!==!0,ee=Y.__version===void 0||Z===!0,L=J.dataReady;let rt=D(v,wt);Ot(s.TEXTURE_CUBE_MAP,v);let V;if(Vt){Ut&&ee&&e.texStorage2D(s.TEXTURE_CUBE_MAP,rt,Gt,wt.width,wt.height);for(let $=0;$<6;$++){V=ft[$].mipmaps;for(let ht=0;ht<V.length;ht++){const lt=V[ht];v.format!==Xe?At!==null?Ut?L&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht,0,0,lt.width,lt.height,At,lt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht,Gt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht,0,0,lt.width,lt.height,At,pt,lt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht,Gt,lt.width,lt.height,0,At,pt,lt.data)}}}else{if(V=v.mipmaps,Ut&&ee){V.length>0&&rt++;const $=bt(ft[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,rt,Gt,$.width,$.height)}for(let $=0;$<6;$++)if(tt){Ut?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ft[$].width,ft[$].height,At,pt,ft[$].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Gt,ft[$].width,ft[$].height,0,At,pt,ft[$].data);for(let ht=0;ht<V.length;ht++){const Pt=V[ht].image[$].image;Ut?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht+1,0,0,Pt.width,Pt.height,At,pt,Pt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht+1,Gt,Pt.width,Pt.height,0,At,pt,Pt.data)}}else{Ut?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,At,pt,ft[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Gt,At,pt,ft[$]);for(let ht=0;ht<V.length;ht++){const lt=V[ht];Ut?L&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht+1,0,0,At,pt,lt.image[$]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht+1,Gt,At,pt,lt.image[$])}}}m(v)&&f(s.TEXTURE_CUBE_MAP),Y.__version=J.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function vt(w,v,z,Z,J,Y){const xt=r.convert(z.format,z.colorSpace),ot=r.convert(z.type),ut=b(z.internalFormat,xt,ot,z.colorSpace),Vt=n.get(v),tt=n.get(z);if(tt.__renderTarget=v,!Vt.__hasExternalTextures){const ft=Math.max(1,v.width>>Y),wt=Math.max(1,v.height>>Y);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,Y,ut,ft,wt,v.depth,0,xt,ot,null):e.texImage2D(J,Y,ut,ft,wt,0,xt,ot,null)}e.bindFramebuffer(s.FRAMEBUFFER,w),kt(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,J,tt.__webglTexture,0,Bt(v)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,J,tt.__webglTexture,Y),e.bindFramebuffer(s.FRAMEBUFFER,null)}function at(w,v,z){if(s.bindRenderbuffer(s.RENDERBUFFER,w),v.depthBuffer){const Z=v.depthTexture,J=Z&&Z.isDepthTexture?Z.type:null,Y=x(v.stencilBuffer,J),xt=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ot=Bt(v);kt(v)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ot,Y,v.width,v.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,ot,Y,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,Y,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,xt,s.RENDERBUFFER,w)}else{const Z=v.textures;for(let J=0;J<Z.length;J++){const Y=Z[J],xt=r.convert(Y.format,Y.colorSpace),ot=r.convert(Y.type),ut=b(Y.internalFormat,xt,ot,Y.colorSpace),Vt=Bt(v);z&&kt(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Vt,ut,v.width,v.height):kt(v)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Vt,ut,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ut,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Tt(w,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,w),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(v.depthTexture);Z.__renderTarget=v,(!Z.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),q(v.depthTexture,0);const J=Z.__webglTexture,Y=Bt(v);if(v.depthTexture.format===pi)kt(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0,Y):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0);else if(v.depthTexture.format===Mi)kt(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0,Y):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Ct(w){const v=n.get(w),z=w.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==w.depthTexture){const Z=w.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Z){const J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Z.removeEventListener("dispose",J)};Z.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=Z}if(w.depthTexture&&!v.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Tt(v.__webglFramebuffer,w)}else if(z){v.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[Z]),v.__webglDepthbuffer[Z]===void 0)v.__webglDepthbuffer[Z]=s.createRenderbuffer(),at(v.__webglDepthbuffer[Z],w,!1);else{const J=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Y=v.__webglDepthbuffer[Z];s.bindRenderbuffer(s.RENDERBUFFER,Y),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),at(v.__webglDepthbuffer,w,!1);else{const Z=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,J),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,J)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function zt(w,v,z){const Z=n.get(w);v!==void 0&&vt(Z.__webglFramebuffer,w,w.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&Ct(w)}function le(w){const v=w.texture,z=n.get(w),Z=n.get(v);w.addEventListener("dispose",A);const J=w.textures,Y=w.isWebGLCubeRenderTarget===!0,xt=J.length>1;if(xt||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=v.version,o.memory.textures++),Y){z.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer[ot]=[];for(let ut=0;ut<v.mipmaps.length;ut++)z.__webglFramebuffer[ot][ut]=s.createFramebuffer()}else z.__webglFramebuffer[ot]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer=[];for(let ot=0;ot<v.mipmaps.length;ot++)z.__webglFramebuffer[ot]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(xt)for(let ot=0,ut=J.length;ot<ut;ot++){const Vt=n.get(J[ot]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=s.createTexture(),o.memory.textures++)}if(w.samples>0&&kt(w)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ot=0;ot<J.length;ot++){const ut=J[ot];z.__webglColorRenderbuffer[ot]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[ot]);const Vt=r.convert(ut.format,ut.colorSpace),tt=r.convert(ut.type),ft=b(ut.internalFormat,Vt,tt,ut.colorSpace,w.isXRRenderTarget===!0),wt=Bt(w);s.renderbufferStorageMultisample(s.RENDERBUFFER,wt,ft,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ot,s.RENDERBUFFER,z.__webglColorRenderbuffer[ot])}s.bindRenderbuffer(s.RENDERBUFFER,null),w.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),at(z.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Y){e.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),Ot(s.TEXTURE_CUBE_MAP,v);for(let ot=0;ot<6;ot++)if(v.mipmaps&&v.mipmaps.length>0)for(let ut=0;ut<v.mipmaps.length;ut++)vt(z.__webglFramebuffer[ot][ut],w,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,ut);else vt(z.__webglFramebuffer[ot],w,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);m(v)&&f(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(xt){for(let ot=0,ut=J.length;ot<ut;ot++){const Vt=J[ot],tt=n.get(Vt);e.bindTexture(s.TEXTURE_2D,tt.__webglTexture),Ot(s.TEXTURE_2D,Vt),vt(z.__webglFramebuffer,w,Vt,s.COLOR_ATTACHMENT0+ot,s.TEXTURE_2D,0),m(Vt)&&f(s.TEXTURE_2D)}e.unbindTexture()}else{let ot=s.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ot=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ot,Z.__webglTexture),Ot(ot,v),v.mipmaps&&v.mipmaps.length>0)for(let ut=0;ut<v.mipmaps.length;ut++)vt(z.__webglFramebuffer[ut],w,v,s.COLOR_ATTACHMENT0,ot,ut);else vt(z.__webglFramebuffer,w,v,s.COLOR_ATTACHMENT0,ot,0);m(v)&&f(ot),e.unbindTexture()}w.depthBuffer&&Ct(w)}function Ht(w){const v=w.textures;for(let z=0,Z=v.length;z<Z;z++){const J=v[z];if(m(J)){const Y=E(w),xt=n.get(J).__webglTexture;e.bindTexture(Y,xt),f(Y),e.unbindTexture()}}}const he=[],O=[];function Ne(w){if(w.samples>0){if(kt(w)===!1){const v=w.textures,z=w.width,Z=w.height;let J=s.COLOR_BUFFER_BIT;const Y=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xt=n.get(w),ot=v.length>1;if(ot)for(let ut=0;ut<v.length;ut++)e.bindFramebuffer(s.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,xt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,xt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let ut=0;ut<v.length;ut++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),ot){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,xt.__webglColorRenderbuffer[ut]);const Vt=n.get(v[ut]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Vt,0)}s.blitFramebuffer(0,0,z,Z,0,0,z,Z,J,s.NEAREST),l===!0&&(he.length=0,O.length=0,he.push(s.COLOR_ATTACHMENT0+ut),w.depthBuffer&&w.resolveDepthBuffer===!1&&(he.push(Y),O.push(Y),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,O)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,he))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ot)for(let ut=0;ut<v.length;ut++){e.bindFramebuffer(s.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,xt.__webglColorRenderbuffer[ut]);const Vt=n.get(v[ut]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,xt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,Vt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,xt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const v=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function Bt(w){return Math.min(i.maxSamples,w.samples)}function kt(w){const v=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Et(w){const v=o.render.frame;h.get(w)!==v&&(h.set(w,v),w.update())}function ie(w,v){const z=w.colorSpace,Z=w.format,J=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||z!==Si&&z!==Sn&&(Wt.getTransfer(z)===Kt?(Z!==Xe||J!==un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),v}function bt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=G,this.setTexture2D=q,this.setTexture2DArray=W,this.setTexture3D=K,this.setTextureCube=H,this.rebindTextures=zt,this.setupRenderTarget=le,this.updateRenderTargetMipmap=Ht,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=Ct,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=kt}function kp(s,t){function e(n,i=Sn){let r;const o=Wt.getTransfer(i);if(n===un)return s.UNSIGNED_BYTE;if(n===fa)return s.UNSIGNED_SHORT_4_4_4_4;if(n===pa)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Ko)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Zo)return s.BYTE;if(n===$o)return s.SHORT;if(n===Xi)return s.UNSIGNED_SHORT;if(n===ua)return s.INT;if(n===Vn)return s.UNSIGNED_INT;if(n===ln)return s.FLOAT;if(n===Yi)return s.HALF_FLOAT;if(n===Jo)return s.ALPHA;if(n===Qo)return s.RGB;if(n===Xe)return s.RGBA;if(n===tl)return s.LUMINANCE;if(n===el)return s.LUMINANCE_ALPHA;if(n===pi)return s.DEPTH_COMPONENT;if(n===Mi)return s.DEPTH_STENCIL;if(n===nl)return s.RED;if(n===ma)return s.RED_INTEGER;if(n===il)return s.RG;if(n===ga)return s.RG_INTEGER;if(n===_a)return s.RGBA_INTEGER;if(n===Cs||n===Ps||n===Ds||n===Is)if(o===Kt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Cs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ps)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Is)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Cs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ps)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Is)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Nr||n===Fr||n===Or||n===zr)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Nr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Fr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Or)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===zr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Br||n===kr||n===Gr)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Br||n===kr)return o===Kt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Gr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Hr||n===Vr||n===Wr||n===Xr||n===qr||n===Yr||n===jr||n===Zr||n===$r||n===Kr||n===Jr||n===Qr||n===ta||n===ea)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Hr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Vr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Wr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Xr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Yr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===jr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Zr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===$r)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Kr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Qr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ta)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ea)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ls||n===na||n===ia)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ls)return o===Kt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===na)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ia)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sl||n===sa||n===ra||n===aa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ls)return r.COMPRESSED_RED_RGTC1_EXT;if(n===sa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ra)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===aa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xi?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}class Gp extends Le{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Jt extends ue{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hp={type:"move"};class _r{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Hp)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Jt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Vp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Wp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Xp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Te,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new fn({vertexShader:Vp,fragmentShader:Wp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Q(new qn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class qp extends bi{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,g=null;const _=new Xp,m=e.getContextAttributes();let f=null,E=null;const b=[],x=[],D=new Lt;let R=null;const A=new Le;A.viewport=new Qt;const I=new Le;I.viewport=new Qt;const S=[A,I],y=new Gp;let P=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let nt=b[j];return nt===void 0&&(nt=new _r,b[j]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(j){let nt=b[j];return nt===void 0&&(nt=new _r,b[j]=nt),nt.getGripSpace()},this.getHand=function(j){let nt=b[j];return nt===void 0&&(nt=new _r,b[j]=nt),nt.getHandSpace()};function F(j){const nt=x.indexOf(j.inputSource);if(nt===-1)return;const vt=b[nt];vt!==void 0&&(vt.update(j.inputSource,j.frame,c||o),vt.dispatchEvent({type:j.type,data:j.inputSource}))}function X(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",X),i.removeEventListener("inputsourceschange",q);for(let j=0;j<b.length;j++){const nt=x[j];nt!==null&&(x[j]=null,b[j].disconnect(nt))}P=null,G=null,_.reset(),t.setRenderTarget(f),p=null,u=null,d=null,i=null,E=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(f=t.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",X),i.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(D),i.renderState.layers===void 0){const nt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(i,e,nt),i.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),E=new Wn(p.framebufferWidth,p.framebufferHeight,{format:Xe,type:un,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let nt=null,vt=null,at=null;m.depth&&(at=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=m.stencil?Mi:pi,vt=m.stencil?xi:Vn);const Tt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:r};d=new XRWebGLBinding(i,e),u=d.createProjectionLayer(Tt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),E=new Wn(u.textureWidth,u.textureHeight,{format:Xe,type:un,depthTexture:new Ml(u.textureWidth,u.textureHeight,vt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),te.setContext(i),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function q(j){for(let nt=0;nt<j.removed.length;nt++){const vt=j.removed[nt],at=x.indexOf(vt);at>=0&&(x[at]=null,b[at].disconnect(vt))}for(let nt=0;nt<j.added.length;nt++){const vt=j.added[nt];let at=x.indexOf(vt);if(at===-1){for(let Ct=0;Ct<b.length;Ct++)if(Ct>=x.length){x.push(vt),at=Ct;break}else if(x[Ct]===null){x[Ct]=vt,at=Ct;break}if(at===-1)break}const Tt=b[at];Tt&&Tt.connect(vt)}}const W=new C,K=new C;function H(j,nt,vt){W.setFromMatrixPosition(nt.matrixWorld),K.setFromMatrixPosition(vt.matrixWorld);const at=W.distanceTo(K),Tt=nt.projectionMatrix.elements,Ct=vt.projectionMatrix.elements,zt=Tt[14]/(Tt[10]-1),le=Tt[14]/(Tt[10]+1),Ht=(Tt[9]+1)/Tt[5],he=(Tt[9]-1)/Tt[5],O=(Tt[8]-1)/Tt[0],Ne=(Ct[8]+1)/Ct[0],Bt=zt*O,kt=zt*Ne,Et=at/(-O+Ne),ie=Et*-O;if(nt.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(ie),j.translateZ(Et),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Tt[10]===-1)j.projectionMatrix.copy(nt.projectionMatrix),j.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const bt=zt+Et,w=le+Et,v=Bt-ie,z=kt+(at-ie),Z=Ht*le/w*bt,J=he*le/w*bt;j.projectionMatrix.makePerspective(v,z,Z,J,bt,w),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function st(j,nt){nt===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(nt.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;let nt=j.near,vt=j.far;_.texture!==null&&(_.depthNear>0&&(nt=_.depthNear),_.depthFar>0&&(vt=_.depthFar)),y.near=I.near=A.near=nt,y.far=I.far=A.far=vt,(P!==y.near||G!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),P=y.near,G=y.far),A.layers.mask=j.layers.mask|2,I.layers.mask=j.layers.mask|4,y.layers.mask=A.layers.mask|I.layers.mask;const at=j.parent,Tt=y.cameras;st(y,at);for(let Ct=0;Ct<Tt.length;Ct++)st(Tt[Ct],at);Tt.length===2?H(y,A,I):y.projectionMatrix.copy(A.projectionMatrix),dt(j,y,at)};function dt(j,nt,vt){vt===null?j.matrix.copy(nt.matrixWorld):(j.matrix.copy(vt.matrixWorld),j.matrix.invert(),j.matrix.multiply(nt.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(nt.projectionMatrix),j.projectionMatrixInverse.copy(nt.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=qi*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(j){l=j,u!==null&&(u.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let St=null;function Ot(j,nt){if(h=nt.getViewerPose(c||o),g=nt,h!==null){const vt=h.views;p!==null&&(t.setRenderTargetFramebuffer(E,p.framebuffer),t.setRenderTarget(E));let at=!1;vt.length!==y.cameras.length&&(y.cameras.length=0,at=!0);for(let Ct=0;Ct<vt.length;Ct++){const zt=vt[Ct];let le=null;if(p!==null)le=p.getViewport(zt);else{const he=d.getViewSubImage(u,zt);le=he.viewport,Ct===0&&(t.setRenderTargetTextures(E,he.colorTexture,u.ignoreDepthValues?void 0:he.depthStencilTexture),t.setRenderTarget(E))}let Ht=S[Ct];Ht===void 0&&(Ht=new Le,Ht.layers.enable(Ct),Ht.viewport=new Qt,S[Ct]=Ht),Ht.matrix.fromArray(zt.transform.matrix),Ht.matrix.decompose(Ht.position,Ht.quaternion,Ht.scale),Ht.projectionMatrix.fromArray(zt.projectionMatrix),Ht.projectionMatrixInverse.copy(Ht.projectionMatrix).invert(),Ht.viewport.set(le.x,le.y,le.width,le.height),Ct===0&&(y.matrix.copy(Ht.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),at===!0&&y.cameras.push(Ht)}const Tt=i.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")){const Ct=d.getDepthInformation(vt[0]);Ct&&Ct.isValid&&Ct.texture&&_.init(t,Ct,i.renderState)}}for(let vt=0;vt<b.length;vt++){const at=x[vt],Tt=b[vt];at!==null&&Tt!==void 0&&Tt.update(at,nt,c||o)}St&&St(j,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}const te=new vl;te.setAnimationLoop(Ot),this.setAnimationLoop=function(j){St=j},this.dispose=function(){}}}const In=new Ye,Yp=new oe;function jp(s,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,ml(s)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function i(m,f,E,b,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,x)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,E,b):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===we&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===we&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const E=t.get(f),b=E.envMap,x=E.envMapRotation;b&&(m.envMap.value=b,In.copy(x),In.x*=-1,In.y*=-1,In.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(In.y*=-1,In.z*=-1),m.envMapRotation.value.setFromMatrix4(Yp.makeRotationFromEuler(In)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,E,b){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*E,m.scale.value=b*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,E){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===we&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const E=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Zp(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,b){const x=b.program;n.uniformBlockBinding(E,x)}function c(E,b){let x=i[E.id];x===void 0&&(g(E),x=h(E),i[E.id]=x,E.addEventListener("dispose",m));const D=b.program;n.updateUBOMapping(E,D);const R=t.render.frame;r[E.id]!==R&&(u(E),r[E.id]=R)}function h(E){const b=d();E.__bindingPointIndex=b;const x=s.createBuffer(),D=E.__size,R=E.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,D,R),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,x),x}function d(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){const b=i[E.id],x=E.uniforms,D=E.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let R=0,A=x.length;R<A;R++){const I=Array.isArray(x[R])?x[R]:[x[R]];for(let S=0,y=I.length;S<y;S++){const P=I[S];if(p(P,R,S,D)===!0){const G=P.__offset,F=Array.isArray(P.value)?P.value:[P.value];let X=0;for(let q=0;q<F.length;q++){const W=F[q],K=_(W);typeof W=="number"||typeof W=="boolean"?(P.__data[0]=W,s.bufferSubData(s.UNIFORM_BUFFER,G+X,P.__data)):W.isMatrix3?(P.__data[0]=W.elements[0],P.__data[1]=W.elements[1],P.__data[2]=W.elements[2],P.__data[3]=0,P.__data[4]=W.elements[3],P.__data[5]=W.elements[4],P.__data[6]=W.elements[5],P.__data[7]=0,P.__data[8]=W.elements[6],P.__data[9]=W.elements[7],P.__data[10]=W.elements[8],P.__data[11]=0):(W.toArray(P.__data,X),X+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,G,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function p(E,b,x,D){const R=E.value,A=b+"_"+x;if(D[A]===void 0)return typeof R=="number"||typeof R=="boolean"?D[A]=R:D[A]=R.clone(),!0;{const I=D[A];if(typeof R=="number"||typeof R=="boolean"){if(I!==R)return D[A]=R,!0}else if(I.equals(R)===!1)return I.copy(R),!0}return!1}function g(E){const b=E.uniforms;let x=0;const D=16;for(let A=0,I=b.length;A<I;A++){const S=Array.isArray(b[A])?b[A]:[b[A]];for(let y=0,P=S.length;y<P;y++){const G=S[y],F=Array.isArray(G.value)?G.value:[G.value];for(let X=0,q=F.length;X<q;X++){const W=F[X],K=_(W),H=x%D,st=H%K.boundary,dt=H+st;x+=st,dt!==0&&D-dt<K.storage&&(x+=D-dt),G.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=x,x+=K.storage}}}const R=x%D;return R>0&&(x+=D-R),E.__size=x,E.__cache={},this}function _(E){const b={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(b.boundary=4,b.storage=4):E.isVector2?(b.boundary=8,b.storage=8):E.isVector3||E.isColor?(b.boundary=16,b.storage=12):E.isVector4?(b.boundary=16,b.storage=16):E.isMatrix3?(b.boundary=48,b.storage=48):E.isMatrix4?(b.boundary=64,b.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),b}function m(E){const b=E.target;b.removeEventListener("dispose",m);const x=o.indexOf(b.__bindingPointIndex);o.splice(x,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function f(){for(const E in i)s.deleteBuffer(i[E]);o=[],i={},r={}}return{bind:l,update:c,dispose:f}}class $p{constructor(t={}){const{canvas:e=Oc(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const E=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=be,this.toneMapping=En,this.toneMappingExposure=1;const x=this;let D=!1,R=0,A=0,I=null,S=-1,y=null;const P=new Qt,G=new Qt;let F=null;const X=new Ft(0);let q=0,W=e.width,K=e.height,H=1,st=null,dt=null;const St=new Qt(0,0,W,K),Ot=new Qt(0,0,W,K);let te=!1;const j=new xa;let nt=!1,vt=!1;const at=new oe,Tt=new oe,Ct=new C,zt=new Qt,le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ht=!1;function he(){return I===null?H:1}let O=n;function Ne(M,U){return e.getContext(M,U)}try{const M={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${da}`),e.addEventListener("webglcontextlost",$,!1),e.addEventListener("webglcontextrestored",ht,!1),e.addEventListener("webglcontextcreationerror",lt,!1),O===null){const U="webgl2";if(O=Ne(U,M),O===null)throw Ne(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Bt,kt,Et,ie,bt,w,v,z,Z,J,Y,xt,ot,ut,Vt,tt,ft,wt,At,pt,Gt,Ut,ee,L;function rt(){Bt=new tf(O),Bt.init(),Ut=new kp(O,Bt),kt=new ju(O,Bt,t,Ut),Et=new Op(O,Bt),kt.reverseDepthBuffer&&u&&Et.buffers.depth.setReversed(!0),ie=new sf(O),bt=new Sp,w=new Bp(O,Bt,Et,bt,kt,Ut,ie),v=new $u(x),z=new Qu(x),Z=new hh(O),ee=new qu(O,Z),J=new ef(O,Z,ie,ee),Y=new af(O,J,Z,ie),At=new rf(O,kt,w),tt=new Zu(bt),xt=new yp(x,v,z,Bt,kt,ee,tt),ot=new jp(x,bt),ut=new Ep,Vt=new Pp(Bt),wt=new Xu(x,v,z,Et,Y,p,l),ft=new Np(x,Y,kt),L=new Zp(O,ie,kt,Et),pt=new Yu(O,Bt,ie),Gt=new nf(O,Bt,ie),ie.programs=xt.programs,x.capabilities=kt,x.extensions=Bt,x.properties=bt,x.renderLists=ut,x.shadowMap=ft,x.state=Et,x.info=ie}rt();const V=new qp(x,O);this.xr=V,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const M=Bt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Bt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(M){M!==void 0&&(H=M,this.setSize(W,K,!1))},this.getSize=function(M){return M.set(W,K)},this.setSize=function(M,U,B=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=M,K=U,e.width=Math.floor(M*H),e.height=Math.floor(U*H),B===!0&&(e.style.width=M+"px",e.style.height=U+"px"),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(W*H,K*H).floor()},this.setDrawingBufferSize=function(M,U,B){W=M,K=U,H=B,e.width=Math.floor(M*B),e.height=Math.floor(U*B),this.setViewport(0,0,M,U)},this.getCurrentViewport=function(M){return M.copy(P)},this.getViewport=function(M){return M.copy(St)},this.setViewport=function(M,U,B,k){M.isVector4?St.set(M.x,M.y,M.z,M.w):St.set(M,U,B,k),Et.viewport(P.copy(St).multiplyScalar(H).round())},this.getScissor=function(M){return M.copy(Ot)},this.setScissor=function(M,U,B,k){M.isVector4?Ot.set(M.x,M.y,M.z,M.w):Ot.set(M,U,B,k),Et.scissor(G.copy(Ot).multiplyScalar(H).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(M){Et.setScissorTest(te=M)},this.setOpaqueSort=function(M){st=M},this.setTransparentSort=function(M){dt=M},this.getClearColor=function(M){return M.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor.apply(wt,arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha.apply(wt,arguments)},this.clear=function(M=!0,U=!0,B=!0){let k=0;if(M){let N=!1;if(I!==null){const et=I.texture.format;N=et===_a||et===ga||et===ma}if(N){const et=I.texture.type,ct=et===un||et===Vn||et===Xi||et===xi||et===fa||et===pa,mt=wt.getClearColor(),gt=wt.getClearAlpha(),Rt=mt.r,Dt=mt.g,_t=mt.b;ct?(g[0]=Rt,g[1]=Dt,g[2]=_t,g[3]=gt,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Rt,_[1]=Dt,_[2]=_t,_[3]=gt,O.clearBufferiv(O.COLOR,0,_))}else k|=O.COLOR_BUFFER_BIT}U&&(k|=O.DEPTH_BUFFER_BIT),B&&(k|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$,!1),e.removeEventListener("webglcontextrestored",ht,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),ut.dispose(),Vt.dispose(),bt.dispose(),v.dispose(),z.dispose(),Y.dispose(),ee.dispose(),L.dispose(),xt.dispose(),V.dispose(),V.removeEventListener("sessionstart",Aa),V.removeEventListener("sessionend",Ra),Tn.stop()};function $(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ht(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const M=ie.autoReset,U=ft.enabled,B=ft.autoUpdate,k=ft.needsUpdate,N=ft.type;rt(),ie.autoReset=M,ft.enabled=U,ft.autoUpdate=B,ft.needsUpdate=k,ft.type=N}function lt(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Pt(M){const U=M.target;U.removeEventListener("dispose",Pt),ce(U)}function ce(M){ve(M),bt.remove(M)}function ve(M){const U=bt.get(M).programs;U!==void 0&&(U.forEach(function(B){xt.releaseProgram(B)}),M.isShaderMaterial&&xt.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,B,k,N,et){U===null&&(U=le);const ct=N.isMesh&&N.matrixWorld.determinant()<0,mt=Dl(M,U,B,k,N);Et.setMaterial(k,ct);let gt=B.index,Rt=1;if(k.wireframe===!0){if(gt=J.getWireframeAttribute(B),gt===void 0)return;Rt=2}const Dt=B.drawRange,_t=B.attributes.position;let Xt=Dt.start*Rt,ne=(Dt.start+Dt.count)*Rt;et!==null&&(Xt=Math.max(Xt,et.start*Rt),ne=Math.min(ne,(et.start+et.count)*Rt)),gt!==null?(Xt=Math.max(Xt,0),ne=Math.min(ne,gt.count)):_t!=null&&(Xt=Math.max(Xt,0),ne=Math.min(ne,_t.count));const se=ne-Xt;if(se<0||se===1/0)return;ee.setup(N,k,mt,B,gt);let Ae,qt=pt;if(gt!==null&&(Ae=Z.get(gt),qt=Gt,qt.setIndex(Ae)),N.isMesh)k.wireframe===!0?(Et.setLineWidth(k.wireframeLinewidth*he()),qt.setMode(O.LINES)):qt.setMode(O.TRIANGLES);else if(N.isLine){let Mt=k.linewidth;Mt===void 0&&(Mt=1),Et.setLineWidth(Mt*he()),N.isLineSegments?qt.setMode(O.LINES):N.isLineLoop?qt.setMode(O.LINE_LOOP):qt.setMode(O.LINE_STRIP)}else N.isPoints?qt.setMode(O.POINTS):N.isSprite&&qt.setMode(O.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)qt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Bt.get("WEBGL_multi_draw"))qt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Mt=N._multiDrawStarts,tn=N._multiDrawCounts,Yt=N._multiDrawCount,ke=gt?Z.get(gt).bytesPerElement:1,jn=bt.get(k).currentProgram.getUniforms();for(let Pe=0;Pe<Yt;Pe++)jn.setValue(O,"_gl_DrawID",Pe),qt.render(Mt[Pe]/ke,tn[Pe])}else if(N.isInstancedMesh)qt.renderInstances(Xt,se,N.count);else if(B.isInstancedBufferGeometry){const Mt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,tn=Math.min(B.instanceCount,Mt);qt.renderInstances(Xt,se,tn)}else qt.render(Xt,se)};function jt(M,U,B){M.transparent===!0&&M.side===$e&&M.forceSinglePass===!1?(M.side=we,M.needsUpdate=!0,Qi(M,U,B),M.side=wn,M.needsUpdate=!0,Qi(M,U,B),M.side=$e):Qi(M,U,B)}this.compile=function(M,U,B=null){B===null&&(B=M),f=Vt.get(B),f.init(U),b.push(f),B.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),M!==B&&M.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const k=new Set;return M.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const et=N.material;if(et)if(Array.isArray(et))for(let ct=0;ct<et.length;ct++){const mt=et[ct];jt(mt,B,N),k.add(mt)}else jt(et,B,N),k.add(et)}),b.pop(),f=null,k},this.compileAsync=function(M,U,B=null){const k=this.compile(M,U,B);return new Promise(N=>{function et(){if(k.forEach(function(ct){bt.get(ct).currentProgram.isReady()&&k.delete(ct)}),k.size===0){N(M);return}setTimeout(et,10)}Bt.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let Be=null;function Qe(M){Be&&Be(M)}function Aa(){Tn.stop()}function Ra(){Tn.start()}const Tn=new vl;Tn.setAnimationLoop(Qe),typeof self<"u"&&Tn.setContext(self),this.setAnimationLoop=function(M){Be=M,V.setAnimationLoop(M),M===null?Tn.stop():Tn.start()},V.addEventListener("sessionstart",Aa),V.addEventListener("sessionend",Ra),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(U),U=V.getCamera()),M.isScene===!0&&M.onBeforeRender(x,M,U,I),f=Vt.get(M,b.length),f.init(U),b.push(f),Tt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),j.setFromProjectionMatrix(Tt),vt=this.localClippingEnabled,nt=tt.init(this.clippingPlanes,vt),m=ut.get(M,E.length),m.init(),E.push(m),V.enabled===!0&&V.isPresenting===!0){const et=x.xr.getDepthSensingMesh();et!==null&&Vs(et,U,-1/0,x.sortObjects)}Vs(M,U,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(st,dt),Ht=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,Ht&&wt.addToRenderList(m,M),this.info.render.frame++,nt===!0&&tt.beginShadows();const B=f.state.shadowsArray;ft.render(B,M,U),nt===!0&&tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=m.opaque,N=m.transmissive;if(f.setupLights(),U.isArrayCamera){const et=U.cameras;if(N.length>0)for(let ct=0,mt=et.length;ct<mt;ct++){const gt=et[ct];Pa(k,N,M,gt)}Ht&&wt.render(M);for(let ct=0,mt=et.length;ct<mt;ct++){const gt=et[ct];Ca(m,M,gt,gt.viewport)}}else N.length>0&&Pa(k,N,M,U),Ht&&wt.render(M),Ca(m,M,U);I!==null&&(w.updateMultisampleRenderTarget(I),w.updateRenderTargetMipmap(I)),M.isScene===!0&&M.onAfterRender(x,M,U),ee.resetDefaultState(),S=-1,y=null,b.pop(),b.length>0?(f=b[b.length-1],nt===!0&&tt.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function Vs(M,U,B,k){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)B=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||j.intersectsSprite(M)){k&&zt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Tt);const ct=Y.update(M),mt=M.material;mt.visible&&m.push(M,ct,mt,B,zt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||j.intersectsObject(M))){const ct=Y.update(M),mt=M.material;if(k&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),zt.copy(M.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),zt.copy(ct.boundingSphere.center)),zt.applyMatrix4(M.matrixWorld).applyMatrix4(Tt)),Array.isArray(mt)){const gt=ct.groups;for(let Rt=0,Dt=gt.length;Rt<Dt;Rt++){const _t=gt[Rt],Xt=mt[_t.materialIndex];Xt&&Xt.visible&&m.push(M,ct,Xt,B,zt.z,_t)}}else mt.visible&&m.push(M,ct,mt,B,zt.z,null)}}const et=M.children;for(let ct=0,mt=et.length;ct<mt;ct++)Vs(et[ct],U,B,k)}function Ca(M,U,B,k){const N=M.opaque,et=M.transmissive,ct=M.transparent;f.setupLightsView(B),nt===!0&&tt.setGlobalState(x.clippingPlanes,B),k&&Et.viewport(P.copy(k)),N.length>0&&Ji(N,U,B),et.length>0&&Ji(et,U,B),ct.length>0&&Ji(ct,U,B),Et.buffers.depth.setTest(!0),Et.buffers.depth.setMask(!0),Et.buffers.color.setMask(!0),Et.setPolygonOffset(!1)}function Pa(M,U,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[k.id]===void 0&&(f.state.transmissionRenderTarget[k.id]=new Wn(1,1,{generateMipmaps:!0,type:Bt.has("EXT_color_buffer_half_float")||Bt.has("EXT_color_buffer_float")?Yi:un,minFilter:Gn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Wt.workingColorSpace}));const et=f.state.transmissionRenderTarget[k.id],ct=k.viewport||P;et.setSize(ct.z,ct.w);const mt=x.getRenderTarget();x.setRenderTarget(et),x.getClearColor(X),q=x.getClearAlpha(),q<1&&x.setClearColor(16777215,.5),x.clear(),Ht&&wt.render(B);const gt=x.toneMapping;x.toneMapping=En;const Rt=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),f.setupLightsView(k),nt===!0&&tt.setGlobalState(x.clippingPlanes,k),Ji(M,B,k),w.updateMultisampleRenderTarget(et),w.updateRenderTargetMipmap(et),Bt.has("WEBGL_multisampled_render_to_texture")===!1){let Dt=!1;for(let _t=0,Xt=U.length;_t<Xt;_t++){const ne=U[_t],se=ne.object,Ae=ne.geometry,qt=ne.material,Mt=ne.group;if(qt.side===$e&&se.layers.test(k.layers)){const tn=qt.side;qt.side=we,qt.needsUpdate=!0,Da(se,B,k,Ae,qt,Mt),qt.side=tn,qt.needsUpdate=!0,Dt=!0}}Dt===!0&&(w.updateMultisampleRenderTarget(et),w.updateRenderTargetMipmap(et))}x.setRenderTarget(mt),x.setClearColor(X,q),Rt!==void 0&&(k.viewport=Rt),x.toneMapping=gt}function Ji(M,U,B){const k=U.isScene===!0?U.overrideMaterial:null;for(let N=0,et=M.length;N<et;N++){const ct=M[N],mt=ct.object,gt=ct.geometry,Rt=k===null?ct.material:k,Dt=ct.group;mt.layers.test(B.layers)&&Da(mt,U,B,gt,Rt,Dt)}}function Da(M,U,B,k,N,et){M.onBeforeRender(x,U,B,k,N,et),M.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),N.onBeforeRender(x,U,B,k,M,et),N.transparent===!0&&N.side===$e&&N.forceSinglePass===!1?(N.side=we,N.needsUpdate=!0,x.renderBufferDirect(B,U,k,N,M,et),N.side=wn,N.needsUpdate=!0,x.renderBufferDirect(B,U,k,N,M,et),N.side=$e):x.renderBufferDirect(B,U,k,N,M,et),M.onAfterRender(x,U,B,k,N,et)}function Qi(M,U,B){U.isScene!==!0&&(U=le);const k=bt.get(M),N=f.state.lights,et=f.state.shadowsArray,ct=N.state.version,mt=xt.getParameters(M,N.state,et,U,B),gt=xt.getProgramCacheKey(mt);let Rt=k.programs;k.environment=M.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(M.isMeshStandardMaterial?z:v).get(M.envMap||k.environment),k.envMapRotation=k.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,Rt===void 0&&(M.addEventListener("dispose",Pt),Rt=new Map,k.programs=Rt);let Dt=Rt.get(gt);if(Dt!==void 0){if(k.currentProgram===Dt&&k.lightsStateVersion===ct)return La(M,mt),Dt}else mt.uniforms=xt.getUniforms(M),M.onBeforeCompile(mt,x),Dt=xt.acquireProgram(mt,gt),Rt.set(gt,Dt),k.uniforms=mt.uniforms;const _t=k.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(_t.clippingPlanes=tt.uniform),La(M,mt),k.needsLights=Ll(M),k.lightsStateVersion=ct,k.needsLights&&(_t.ambientLightColor.value=N.state.ambient,_t.lightProbe.value=N.state.probe,_t.directionalLights.value=N.state.directional,_t.directionalLightShadows.value=N.state.directionalShadow,_t.spotLights.value=N.state.spot,_t.spotLightShadows.value=N.state.spotShadow,_t.rectAreaLights.value=N.state.rectArea,_t.ltc_1.value=N.state.rectAreaLTC1,_t.ltc_2.value=N.state.rectAreaLTC2,_t.pointLights.value=N.state.point,_t.pointLightShadows.value=N.state.pointShadow,_t.hemisphereLights.value=N.state.hemi,_t.directionalShadowMap.value=N.state.directionalShadowMap,_t.directionalShadowMatrix.value=N.state.directionalShadowMatrix,_t.spotShadowMap.value=N.state.spotShadowMap,_t.spotLightMatrix.value=N.state.spotLightMatrix,_t.spotLightMap.value=N.state.spotLightMap,_t.pointShadowMap.value=N.state.pointShadowMap,_t.pointShadowMatrix.value=N.state.pointShadowMatrix),k.currentProgram=Dt,k.uniformsList=null,Dt}function Ia(M){if(M.uniformsList===null){const U=M.currentProgram.getUniforms();M.uniformsList=Us.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function La(M,U){const B=bt.get(M);B.outputColorSpace=U.outputColorSpace,B.batching=U.batching,B.batchingColor=U.batchingColor,B.instancing=U.instancing,B.instancingColor=U.instancingColor,B.instancingMorph=U.instancingMorph,B.skinning=U.skinning,B.morphTargets=U.morphTargets,B.morphNormals=U.morphNormals,B.morphColors=U.morphColors,B.morphTargetsCount=U.morphTargetsCount,B.numClippingPlanes=U.numClippingPlanes,B.numIntersection=U.numClipIntersection,B.vertexAlphas=U.vertexAlphas,B.vertexTangents=U.vertexTangents,B.toneMapping=U.toneMapping}function Dl(M,U,B,k,N){U.isScene!==!0&&(U=le),w.resetTextureUnits();const et=U.fog,ct=k.isMeshStandardMaterial?U.environment:null,mt=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Si,gt=(k.isMeshStandardMaterial?z:v).get(k.envMap||ct),Rt=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Dt=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),_t=!!B.morphAttributes.position,Xt=!!B.morphAttributes.normal,ne=!!B.morphAttributes.color;let se=En;k.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(se=x.toneMapping);const Ae=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,qt=Ae!==void 0?Ae.length:0,Mt=bt.get(k),tn=f.state.lights;if(nt===!0&&(vt===!0||M!==y)){const Fe=M===y&&k.id===S;tt.setState(k,M,Fe)}let Yt=!1;k.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==tn.state.version||Mt.outputColorSpace!==mt||N.isBatchedMesh&&Mt.batching===!1||!N.isBatchedMesh&&Mt.batching===!0||N.isBatchedMesh&&Mt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Mt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Mt.instancing===!1||!N.isInstancedMesh&&Mt.instancing===!0||N.isSkinnedMesh&&Mt.skinning===!1||!N.isSkinnedMesh&&Mt.skinning===!0||N.isInstancedMesh&&Mt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Mt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Mt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Mt.instancingMorph===!1&&N.morphTexture!==null||Mt.envMap!==gt||k.fog===!0&&Mt.fog!==et||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==tt.numPlanes||Mt.numIntersection!==tt.numIntersection)||Mt.vertexAlphas!==Rt||Mt.vertexTangents!==Dt||Mt.morphTargets!==_t||Mt.morphNormals!==Xt||Mt.morphColors!==ne||Mt.toneMapping!==se||Mt.morphTargetsCount!==qt)&&(Yt=!0):(Yt=!0,Mt.__version=k.version);let ke=Mt.currentProgram;Yt===!0&&(ke=Qi(k,U,N));let jn=!1,Pe=!1,Ti=!1;const re=ke.getUniforms(),je=Mt.uniforms;if(Et.useProgram(ke.program)&&(jn=!0,Pe=!0,Ti=!0),k.id!==S&&(S=k.id,Pe=!0),jn||y!==M){Et.buffers.depth.getReversed()?(at.copy(M.projectionMatrix),Bc(at),kc(at),re.setValue(O,"projectionMatrix",at)):re.setValue(O,"projectionMatrix",M.projectionMatrix),re.setValue(O,"viewMatrix",M.matrixWorldInverse);const pn=re.map.cameraPosition;pn!==void 0&&pn.setValue(O,Ct.setFromMatrixPosition(M.matrixWorld)),kt.logarithmicDepthBuffer&&re.setValue(O,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&re.setValue(O,"isOrthographic",M.isOrthographicCamera===!0),y!==M&&(y=M,Pe=!0,Ti=!0)}if(N.isSkinnedMesh){re.setOptional(O,N,"bindMatrix"),re.setOptional(O,N,"bindMatrixInverse");const Fe=N.skeleton;Fe&&(Fe.boneTexture===null&&Fe.computeBoneTexture(),re.setValue(O,"boneTexture",Fe.boneTexture,w))}N.isBatchedMesh&&(re.setOptional(O,N,"batchingTexture"),re.setValue(O,"batchingTexture",N._matricesTexture,w),re.setOptional(O,N,"batchingIdTexture"),re.setValue(O,"batchingIdTexture",N._indirectTexture,w),re.setOptional(O,N,"batchingColorTexture"),N._colorsTexture!==null&&re.setValue(O,"batchingColorTexture",N._colorsTexture,w));const Ai=B.morphAttributes;if((Ai.position!==void 0||Ai.normal!==void 0||Ai.color!==void 0)&&At.update(N,B,ke),(Pe||Mt.receiveShadow!==N.receiveShadow)&&(Mt.receiveShadow=N.receiveShadow,re.setValue(O,"receiveShadow",N.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(je.envMap.value=gt,je.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&U.environment!==null&&(je.envMapIntensity.value=U.environmentIntensity),Pe&&(re.setValue(O,"toneMappingExposure",x.toneMappingExposure),Mt.needsLights&&Il(je,Ti),et&&k.fog===!0&&ot.refreshFogUniforms(je,et),ot.refreshMaterialUniforms(je,k,H,K,f.state.transmissionRenderTarget[M.id]),Us.upload(O,Ia(Mt),je,w)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Us.upload(O,Ia(Mt),je,w),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&re.setValue(O,"center",N.center),re.setValue(O,"modelViewMatrix",N.modelViewMatrix),re.setValue(O,"normalMatrix",N.normalMatrix),re.setValue(O,"modelMatrix",N.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Fe=k.uniformsGroups;for(let pn=0,mn=Fe.length;pn<mn;pn++){const Ua=Fe[pn];L.update(Ua,ke),L.bind(Ua,ke)}}return ke}function Il(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function Ll(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(M,U,B){bt.get(M.texture).__webglTexture=U,bt.get(M.depthTexture).__webglTexture=B;const k=bt.get(M);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=B===void 0,k.__autoAllocateDepthBuffer||Bt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,U){const B=bt.get(M);B.__webglFramebuffer=U,B.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(M,U=0,B=0){I=M,R=U,A=B;let k=!0,N=null,et=!1,ct=!1;if(M){const gt=bt.get(M);if(gt.__useDefaultFramebuffer!==void 0)Et.bindFramebuffer(O.FRAMEBUFFER,null),k=!1;else if(gt.__webglFramebuffer===void 0)w.setupRenderTarget(M);else if(gt.__hasExternalTextures)w.rebindTextures(M,bt.get(M.texture).__webglTexture,bt.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const _t=M.depthTexture;if(gt.__boundDepthTexture!==_t){if(_t!==null&&bt.has(_t)&&(M.width!==_t.image.width||M.height!==_t.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(M)}}const Rt=M.texture;(Rt.isData3DTexture||Rt.isDataArrayTexture||Rt.isCompressedArrayTexture)&&(ct=!0);const Dt=bt.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Dt[U])?N=Dt[U][B]:N=Dt[U],et=!0):M.samples>0&&w.useMultisampledRTT(M)===!1?N=bt.get(M).__webglMultisampledFramebuffer:Array.isArray(Dt)?N=Dt[B]:N=Dt,P.copy(M.viewport),G.copy(M.scissor),F=M.scissorTest}else P.copy(St).multiplyScalar(H).floor(),G.copy(Ot).multiplyScalar(H).floor(),F=te;if(Et.bindFramebuffer(O.FRAMEBUFFER,N)&&k&&Et.drawBuffers(M,N),Et.viewport(P),Et.scissor(G),Et.setScissorTest(F),et){const gt=bt.get(M.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,gt.__webglTexture,B)}else if(ct){const gt=bt.get(M.texture),Rt=U||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,gt.__webglTexture,B||0,Rt)}S=-1},this.readRenderTargetPixels=function(M,U,B,k,N,et,ct){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let mt=bt.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0&&(mt=mt[ct]),mt){Et.bindFramebuffer(O.FRAMEBUFFER,mt);try{const gt=M.texture,Rt=gt.format,Dt=gt.type;if(!kt.textureFormatReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!kt.textureTypeReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-k&&B>=0&&B<=M.height-N&&O.readPixels(U,B,k,N,Ut.convert(Rt),Ut.convert(Dt),et)}finally{const gt=I!==null?bt.get(I).__webglFramebuffer:null;Et.bindFramebuffer(O.FRAMEBUFFER,gt)}}},this.readRenderTargetPixelsAsync=async function(M,U,B,k,N,et,ct){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let mt=bt.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0&&(mt=mt[ct]),mt){const gt=M.texture,Rt=gt.format,Dt=gt.type;if(!kt.textureFormatReadable(Rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!kt.textureTypeReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=M.width-k&&B>=0&&B<=M.height-N){Et.bindFramebuffer(O.FRAMEBUFFER,mt);const _t=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,_t),O.bufferData(O.PIXEL_PACK_BUFFER,et.byteLength,O.STREAM_READ),O.readPixels(U,B,k,N,Ut.convert(Rt),Ut.convert(Dt),0);const Xt=I!==null?bt.get(I).__webglFramebuffer:null;Et.bindFramebuffer(O.FRAMEBUFFER,Xt);const ne=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await zc(O,ne,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,_t),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,et),O.deleteBuffer(_t),O.deleteSync(ne),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,U=null,B=0){M.isTexture!==!0&&(Bi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,M=arguments[1]);const k=Math.pow(2,-B),N=Math.floor(M.image.width*k),et=Math.floor(M.image.height*k),ct=U!==null?U.x:0,mt=U!==null?U.y:0;w.setTexture2D(M,0),O.copyTexSubImage2D(O.TEXTURE_2D,B,0,0,ct,mt,N,et),Et.unbindTexture()},this.copyTextureToTexture=function(M,U,B=null,k=null,N=0){M.isTexture!==!0&&(Bi("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,M=arguments[1],U=arguments[2],N=arguments[3]||0,B=null);let et,ct,mt,gt,Rt,Dt,_t,Xt,ne;const se=M.isCompressedTexture?M.mipmaps[N]:M.image;B!==null?(et=B.max.x-B.min.x,ct=B.max.y-B.min.y,mt=B.isBox3?B.max.z-B.min.z:1,gt=B.min.x,Rt=B.min.y,Dt=B.isBox3?B.min.z:0):(et=se.width,ct=se.height,mt=se.depth||1,gt=0,Rt=0,Dt=0),k!==null?(_t=k.x,Xt=k.y,ne=k.z):(_t=0,Xt=0,ne=0);const Ae=Ut.convert(U.format),qt=Ut.convert(U.type);let Mt;U.isData3DTexture?(w.setTexture3D(U,0),Mt=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(w.setTexture2DArray(U,0),Mt=O.TEXTURE_2D_ARRAY):(w.setTexture2D(U,0),Mt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const tn=O.getParameter(O.UNPACK_ROW_LENGTH),Yt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),ke=O.getParameter(O.UNPACK_SKIP_PIXELS),jn=O.getParameter(O.UNPACK_SKIP_ROWS),Pe=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,se.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,se.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,gt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Rt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Dt);const Ti=M.isDataArrayTexture||M.isData3DTexture,re=U.isDataArrayTexture||U.isData3DTexture;if(M.isRenderTargetTexture||M.isDepthTexture){const je=bt.get(M),Ai=bt.get(U),Fe=bt.get(je.__renderTarget),pn=bt.get(Ai.__renderTarget);Et.bindFramebuffer(O.READ_FRAMEBUFFER,Fe.__webglFramebuffer),Et.bindFramebuffer(O.DRAW_FRAMEBUFFER,pn.__webglFramebuffer);for(let mn=0;mn<mt;mn++)Ti&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,bt.get(M).__webglTexture,N,Dt+mn),M.isDepthTexture?(re&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,bt.get(U).__webglTexture,N,ne+mn),O.blitFramebuffer(gt,Rt,et,ct,_t,Xt,et,ct,O.DEPTH_BUFFER_BIT,O.NEAREST)):re?O.copyTexSubImage3D(Mt,N,_t,Xt,ne+mn,gt,Rt,et,ct):O.copyTexSubImage2D(Mt,N,_t,Xt,ne+mn,gt,Rt,et,ct);Et.bindFramebuffer(O.READ_FRAMEBUFFER,null),Et.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else re?M.isDataTexture||M.isData3DTexture?O.texSubImage3D(Mt,N,_t,Xt,ne,et,ct,mt,Ae,qt,se.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(Mt,N,_t,Xt,ne,et,ct,mt,Ae,se.data):O.texSubImage3D(Mt,N,_t,Xt,ne,et,ct,mt,Ae,qt,se):M.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,N,_t,Xt,et,ct,Ae,qt,se.data):M.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,N,_t,Xt,se.width,se.height,Ae,se.data):O.texSubImage2D(O.TEXTURE_2D,N,_t,Xt,et,ct,Ae,qt,se);O.pixelStorei(O.UNPACK_ROW_LENGTH,tn),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Yt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,ke),O.pixelStorei(O.UNPACK_SKIP_ROWS,jn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Pe),N===0&&U.generateMipmaps&&O.generateMipmap(Mt),Et.unbindTexture()},this.copyTextureToTexture3D=function(M,U,B=null,k=null,N=0){return M.isTexture!==!0&&(Bi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,k=arguments[1]||null,M=arguments[2],U=arguments[3],N=arguments[4]||0),Bi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,U,B,k,N)},this.initRenderTarget=function(M){bt.get(M).__webglFramebuffer===void 0&&w.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?w.setTextureCube(M,0):M.isData3DTexture?w.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?w.setTexture2DArray(M,0):w.setTexture2D(M,0),Et.unbindTexture()},this.resetState=function(){R=0,A=0,I=null,Et.reset(),ee.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Wt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Wt._getUnpackColorSpace()}}class ya{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ft(t),this.density=e}clone(){return new ya(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Kp extends ue{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ye,this.environmentIntensity=1,this.environmentRotation=new Ye,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Jp{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=oa,this.updateRanges=[],this.version=0,this.uuid=hn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ye=new C;class Os{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=We(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Zt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Zt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Zt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Zt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Zt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=We(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=We(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=We(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=We(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array),i=Zt(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array),i=Zt(i,this.array),r=Zt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ue(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Os(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class wl extends Xn{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Ft(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ci;const Ii=new C,hi=new C,di=new C,ui=new Lt,Li=new Lt,Tl=new oe,ys=new C,Ui=new C,Ss=new C,Lo=new Lt,vr=new Lt,Uo=new Lt;class Qp extends ue{constructor(t=new wl){if(super(),this.isSprite=!0,this.type="Sprite",ci===void 0){ci=new Ce;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Jp(e,5);ci.setIndex([0,1,2,0,2,3]),ci.setAttribute("position",new Os(n,3,0,!1)),ci.setAttribute("uv",new Os(n,2,3,!1))}this.geometry=ci,this.material=t,this.center=new Lt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),hi.setFromMatrixScale(this.matrixWorld),Tl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),di.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&hi.multiplyScalar(-di.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;bs(ys.set(-.5,-.5,0),di,o,hi,i,r),bs(Ui.set(.5,-.5,0),di,o,hi,i,r),bs(Ss.set(.5,.5,0),di,o,hi,i,r),Lo.set(0,0),vr.set(1,0),Uo.set(1,1);let a=t.ray.intersectTriangle(ys,Ui,Ss,!1,Ii);if(a===null&&(bs(Ui.set(-.5,.5,0),di,o,hi,i,r),vr.set(0,1),a=t.ray.intersectTriangle(ys,Ss,Ui,!1,Ii),a===null))return;const l=t.ray.origin.distanceTo(Ii);l<t.near||l>t.far||e.push({distance:l,point:Ii.clone(),uv:ze.getInterpolation(Ii,ys,Ui,Ss,Lo,vr,Uo,new Lt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function bs(s,t,e,n,i,r){ui.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Li.x=r*ui.x-i*ui.y,Li.y=i*ui.x+r*ui.y):Li.copy(ui),s.copy(t),s.x+=Li.x,s.y+=Li.y,s.applyMatrix4(Tl)}class Al extends Xn{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Ft(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const No=new oe,ca=new hl,Es=new Gs,ws=new C;class tm extends ue{constructor(t=new Ce,e=new Al){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Es.copy(n.boundingSphere),Es.applyMatrix4(i),Es.radius+=r,t.ray.intersectsSphere(Es)===!1)return;No.copy(i).invert(),ca.copy(t.ray).applyMatrix4(No);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=u,_=p;g<_;g++){const m=c.getX(g);ws.fromBufferAttribute(d,m),Fo(ws,m,l,i,t,e,this)}}else{const u=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let g=u,_=p;g<_;g++)ws.fromBufferAttribute(d,g),Fo(ws,g,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Fo(s,t,e,n,i,r,o){const a=ca.distanceSqToPoint(s);if(a<e){const l=new C;ca.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Sa extends Te{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ba extends Ce{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new C,h=new Lt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const p=n+d/e*i;c.x=t*Math.cos(p),c.y=t*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new fe(o,3)),this.setAttribute("normal",new fe(a,3)),this.setAttribute("uv",new fe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ba(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class _e extends Ce{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],d=[],u=[],p=[];let g=0;const _=[],m=n/2;let f=0;E(),o===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(u,3)),this.setAttribute("uv",new fe(p,2));function E(){const x=new C,D=new C;let R=0;const A=(e-t)/n;for(let I=0;I<=r;I++){const S=[],y=I/r,P=y*(e-t)+t;for(let G=0;G<=i;G++){const F=G/i,X=F*l+a,q=Math.sin(X),W=Math.cos(X);D.x=P*q,D.y=-y*n+m,D.z=P*W,d.push(D.x,D.y,D.z),x.set(q,A,W).normalize(),u.push(x.x,x.y,x.z),p.push(F,1-y),S.push(g++)}_.push(S)}for(let I=0;I<i;I++)for(let S=0;S<r;S++){const y=_[S][I],P=_[S+1][I],G=_[S+1][I+1],F=_[S][I+1];(t>0||S!==0)&&(h.push(y,P,F),R+=3),(e>0||S!==r-1)&&(h.push(P,G,F),R+=3)}c.addGroup(f,R,0),f+=R}function b(x){const D=g,R=new Lt,A=new C;let I=0;const S=x===!0?t:e,y=x===!0?1:-1;for(let G=1;G<=i;G++)d.push(0,m*y,0),u.push(0,y,0),p.push(.5,.5),g++;const P=g;for(let G=0;G<=i;G++){const X=G/i*l+a,q=Math.cos(X),W=Math.sin(X);A.x=S*W,A.y=m*y,A.z=S*q,d.push(A.x,A.y,A.z),u.push(0,y,0),R.x=q*.5+.5,R.y=W*.5*y+.5,p.push(R.x,R.y),g++}for(let G=0;G<i;G++){const F=D+G,X=P+G;x===!0?h.push(X,X+1,F):h.push(X+1,X,F),I+=3}c.addGroup(f,I,x===!0?1:2),f+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ea extends _e{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ea(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Je extends Ce{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new C,u=new C,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const E=[],b=f/n;let x=0;f===0&&o===0?x=.5/e:f===n&&l===Math.PI&&(x=-.5/e);for(let D=0;D<=e;D++){const R=D/e;d.x=-t*Math.cos(i+R*r)*Math.sin(o+b*a),d.y=t*Math.cos(o+b*a),d.z=t*Math.sin(i+R*r)*Math.sin(o+b*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(R+x,1-b),E.push(c++)}h.push(E)}for(let f=0;f<n;f++)for(let E=0;E<e;E++){const b=h[f][E+1],x=h[f][E],D=h[f+1][E],R=h[f+1][E+1];(f!==0||o>0)&&p.push(b,x,R),(f!==n-1||l<Math.PI)&&p.push(x,D,R)}this.setIndex(p),this.setAttribute("position",new fe(g,3)),this.setAttribute("normal",new fe(_,3)),this.setAttribute("uv",new fe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Je(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class wa extends Ce{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],h=new C,d=new C,u=new C;for(let p=0;p<=n;p++)for(let g=0;g<=i;g++){const _=g/i*r,m=p/n*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(_),d.y=(t+e*Math.cos(m))*Math.sin(_),d.z=e*Math.sin(m),a.push(d.x,d.y,d.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(g/i),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=i;g++){const _=(i+1)*p+g-1,m=(i+1)*(p-1)+g-1,f=(i+1)*(p-1)+g,E=(i+1)*p+g;o.push(_,m,E),o.push(m,f,E)}this.setIndex(o),this.setAttribute("position",new fe(a,3)),this.setAttribute("normal",new fe(l,3)),this.setAttribute("uv",new fe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wa(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class $t extends Xn{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ft(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ft(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rl,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ye,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ta extends ue{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ft(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class em extends Ta{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ue.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ft(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const xr=new oe,Oo=new C,zo=new C;class Rl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Lt(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xa,this._frameExtents=new Lt(1,1),this._viewportCount=1,this._viewports=[new Qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Oo.setFromMatrixPosition(t.matrixWorld),e.position.copy(Oo),zo.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(zo),e.updateMatrixWorld(),xr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(xr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Bo=new oe,Ni=new C,Mr=new C;class nm extends Rl{constructor(){super(new Le(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Lt(4,2),this._viewportCount=6,this._viewports=[new Qt(2,1,1,1),new Qt(0,1,1,1),new Qt(3,1,1,1),new Qt(1,1,1,1),new Qt(3,0,1,1),new Qt(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ni.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ni),Mr.copy(n.position),Mr.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Mr),n.updateMatrixWorld(),i.makeTranslation(-Ni.x,-Ni.y,-Ni.z),Bo.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bo)}}class zs extends Ta{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new nm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class im extends Rl{constructor(){super(new xl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sm extends Ta{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ue.DEFAULT_UP),this.updateMatrix(),this.target=new ue,this.shadow=new im}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class rm{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ko(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=ko();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function ko(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:da}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=da);class am{constructor(t,e,n,i){T(this,"scene");T(this,"projectiles");T(this,"vfx");T(this,"audio");T(this,"active",!1);T(this,"warningTimer",0);T(this,"squadZ",-90);T(this,"flakTimer",0);T(this,"planes",[]);T(this,"onComplete",null);T(this,"passSoundPlayed",!1);this.scene=t,this.projectiles=e,this.vfx=n,this.audio=i}isActive(){return this.active}isWarningOrPassing(){return this.active}clear(){for(const t of this.planes)this.scene.remove(t.group),this.scene.remove(t.shadow);this.planes=[],this.active=!1,this.onComplete=null}triggerBomberRun(t){if(this.active)return;this.active=!0,this.warningTimer=4.6,this.squadZ=-95,this.passSoundPlayed=!1,this.onComplete=t??null,this.audio.playAirRaidSiren();const e=[[0,0],[-15,-9],[15,-9]],n=new $t({color:3883068,roughness:.55,metalness:.45}),i=new Re({color:1776667}),r=new Re({color:328965,transparent:!0,opacity:.34,depthWrite:!1});for(const[o,a]of e){const l=new Jt,c=new Q(new yt(1.4,1.3,10.5),n);l.add(c);const h=new Q(new yt(13.5,.28,2.6),n);h.position.set(0,.25,-.6),l.add(h);const d=new Q(new yt(4.4,.22,1.3),n);d.position.set(0,.35,-4.6),l.add(d);const u=new Q(new yt(.22,1.5,1.2),n);u.position.set(0,.9,-4.6),l.add(u);const p=[];for(const _ of[-2.8,2.8]){const m=new Q(new _e(.42,.42,1.6,8),n);m.rotation.x=Math.PI*.5,m.position.set(_,.1,.6),l.add(m);const f=new Q(new yt(1.7,.14,.08),i);f.position.set(_,.1,1.5),l.add(f),p.push(f)}l.position.set(o,37,this.squadZ+a),this.scene.add(l);const g=new Q(new ba(4.6,12),r);g.rotation.x=-Math.PI*.5,g.position.set(o,.45,this.squadZ+a),this.scene.add(g),this.planes.push({group:l,shadow:g,propellers:p,offsetX:o,offsetZ:a,bombsDropped:0,nextDropZ:-20+a*.3})}}update(t,e){if(this.active){if(this.flakTimer-=t,this.flakTimer<=0&&(this.flakTimer=.45+Math.random()*.45,this.vfx.spawnFlakBurst(new C((Math.random()-.5)*55,29+Math.random()*12,-25+Math.random()*55))),this.warningTimer>0){this.warningTimer-=t;return}this.passSoundPlayed||(this.passSoundPlayed=!0,this.audio.playBomberPass()),this.squadZ+=t*32;for(const n of this.planes){const i=this.squadZ+n.offsetZ;n.group.position.set(n.offsetX,37,i),n.shadow.position.set(n.offsetX,.45,i);for(const r of n.propellers)r.rotation.z+=t*36;if(n.bombsDropped<5&&i>=n.nextDropZ){n.bombsDropped++,n.nextDropZ+=12.5;const r=n.offsetX+(Math.random()-.5)*6.5,o=Math.min(35,Math.max(-22,i+3));this.projectiles.spawnFallingBomb(r,35,o,!0);const a=Math.max(-1,Math.min(1,(r-e)/28));this.audio.playBombWhistle(a)}}if(this.squadZ>92){const n=this.onComplete;this.clear(),n==null||n()}}}}function Yn(s){const t=document.createElement("canvas");t.width=s,t.height=s;const e=t.getContext("2d");if(!e)throw new Error("2D canvas context unavailable");return[t,e]}function $i(s){let t=s>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function wi(s,t=1,e=1,n=!0){const i=new Sa(s);return i.wrapS=Wi,i.wrapT=Wi,i.repeat.set(t,e),n&&(i.colorSpace=be),i.anisotropy=4,i.needsUpdate=!0,i}function om(){const[s,t]=Yn(512),e=$i(1917);t.fillStyle="#4e4132",t.fillRect(0,0,512,512);for(let n=0;n<4200;n++){const i=e()*512,r=e()*512,o=1+e()*9,a=e();a<.35?t.fillStyle=`rgba(38, 30, 22, ${.18+e()*.25})`:a<.75?t.fillStyle=`rgba(88, 72, 54, ${.14+e()*.22})`:t.fillStyle=`rgba(62, 54, 42, ${.2+e()*.25})`,t.beginPath(),t.arc(i,r,o,0,Math.PI*2),t.fill()}for(let n=0;n<420;n++){const i=e()*512,r=e()*512;t.fillStyle=e()>.5?"rgba(28, 24, 19, 0.42)":"rgba(116, 102, 82, 0.24)",t.fillRect(i,r,2+e()*4,2+e()*3)}return wi(s,20,20,!0)}function lm(){const[s,t]=Yn(256),e=$i(1918);t.fillStyle="#4f3b28",t.fillRect(0,0,256,256);const n=6,i=256/n;for(let r=0;r<n;r++){const o=r*i,a=Math.floor((e()-.5)*18);t.fillStyle=`rgb(${82+a}, ${60+a}, ${40+a})`,t.fillRect(0,o+1,256,i-2),t.fillStyle="rgba(20, 14, 9, 0.72)",t.fillRect(0,o,256,2);for(let l=0;l<36;l++){const c=o+3+e()*(i-6);t.fillStyle=`rgba(34, 22, 13, ${.15+e()*.22})`,t.fillRect(0,c,256,1+e()*1.4)}}return wi(s,2,1,!0)}function cm(){const[s,t]=Yn(256),e=$i(1942);t.fillStyle="#8b7b5d",t.fillRect(0,0,256,256);for(let n=0;n<256;n+=4)t.fillStyle=n%8===0?"rgba(54, 45, 31, 0.2)":"rgba(176, 160, 126, 0.14)",t.fillRect(0,n,256,2);for(let n=0;n<256;n+=4)t.fillStyle=n%8===0?"rgba(54, 45, 31, 0.18)":"rgba(176, 160, 126, 0.12)",t.fillRect(n,0,2,256);for(let n=0;n<650;n++)t.fillStyle=`rgba(42, 34, 23, ${.08+e()*.16})`,t.beginPath(),t.arc(e()*256,e()*256,2+e()*8,0,Math.PI*2),t.fill();return wi(s,2,1,!0)}function hm(){const[s,t]=Yn(256),e=$i(1944);t.fillStyle="#5e5f5a",t.fillRect(0,0,256,256);for(let n=0;n<1800;n++){const i=70+Math.floor(e()*44);t.fillStyle=`rgba(${i}, ${i}, ${i-4}, 0.22)`,t.fillRect(e()*256,e()*256,2+e()*6,2+e()*6)}t.strokeStyle="rgba(26, 26, 24, 0.55)",t.lineWidth=1.5;for(let n=0;n<14;n++){let i=e()*256,r=e()*256;t.beginPath(),t.moveTo(i,r);for(let o=0;o<5;o++)i+=(e()-.5)*44,r+=(e()-.5)*44,t.lineTo(i,r);t.stroke()}return wi(s,2,2,!0)}function dm(){const[s,t]=Yn(256),e=$i(1943);t.fillStyle="#3f453d",t.fillRect(0,0,256,256);for(let n=0;n<900;n++)t.fillStyle=e()>.45?"rgba(24, 28, 24, 0.24)":"rgba(92, 98, 88, 0.16)",t.fillRect(e()*256,e()*256,2+e()*14,1+e()*4);t.fillStyle="rgba(22, 24, 21, 0.7)";for(let n=12;n<256;n+=24)t.beginPath(),t.arc(n,12,3,0,Math.PI*2),t.arc(n,244,3,0,Math.PI*2),t.fill();return wi(s,1,1,!0)}function Go(s){const[t,e]=Yn(256);return e.fillStyle=s==="ammo"?"#495038":"#7b786c",e.fillRect(0,0,256,256),e.strokeStyle="rgba(24, 25, 20, 0.65)",e.lineWidth=10,e.strokeRect(8,8,240,240),s==="ammo"?(e.fillStyle="#d49b38",e.fillRect(36,108,184,40),e.fillStyle="#22241b",e.fillRect(58,122,140,12)):(e.fillStyle="#ece8df",e.fillRect(56,56,144,144),e.fillStyle="#b93127",e.fillRect(110,74,36,108),e.fillRect(74,110,108,36)),wi(t,1,1,!0)}function um(){const[s,t]=Yn(128),e=t.createRadialGradient(64,64,2,64,64,62);e.addColorStop(0,"rgba(255, 255, 255, 1)"),e.addColorStop(.28,"rgba(255, 232, 178, 0.78)"),e.addColorStop(.65,"rgba(180, 120, 70, 0.28)"),e.addColorStop(1,"rgba(0, 0, 0, 0)"),t.fillStyle=e,t.fillRect(0,0,128,128);const n=new Sa(s);return n.colorSpace=be,n.needsUpdate=!0,n}let yr=null;function Ki(){return yr||(yr={mud:om(),timber:lm(),sandbag:cm(),concrete:hm(),armorSteel:dm(),crateAmmo:Go("ammo"),crateMedic:Go("medic"),radialGlow:um()}),yr}class fm{constructor(){T(this,"root",new Jt);T(this,"weaponPivot",new Jt);T(this,"models",new Map);T(this,"bandageModel",new Jt);T(this,"boltMesh",null);T(this,"muzzleFlashMesh");T(this,"muzzleLight");T(this,"activeWeapon","rifle");T(this,"recoilZ",0);T(this,"recoilPitch",0);T(this,"flashTimer",0);T(this,"swayTime",0);this.root.add(this.weaponPivot);const t=Ki(),e=new $t({map:t.timber,roughness:.72,metalness:.08}),n=new $t({color:2500904,roughness:.42,metalness:.75}),i=new $t({color:1645338,roughness:.5,metalness:.65}),r=new $t({color:4542007,roughness:.8,metalness:.2}),o=new Jt,a=new Q(new yt(.06,.11,.58),e);a.position.set(0,-.025,.1),o.add(a);const l=new Q(new yt(.052,.065,.24),n);l.position.set(0,.032,-.04),o.add(l),this.boltMesh=new Q(new yt(.02,.02,.08),i),this.boltMesh.position.set(.028,.048,-.03),o.add(this.boltMesh);const c=new Q(new _e(.014,.018,.68,10),n);c.rotation.x=Math.PI*.5,c.position.set(0,.046,-.45),o.add(c);const h=new Q(new yt(.036,.022,.018),i);h.position.set(0,.072,.04),o.add(h);const d=new Q(new yt(.006,.026,.012),i);d.position.set(0,.071,-.74),o.add(d),this.models.set("rifle",o),this.weaponPivot.add(o);const u=new Jt,p=new Q(new yt(.062,.075,.36),n);p.position.set(0,.02,-.08),u.add(p);const g=new Q(new _e(.016,.02,.28,10),i);g.rotation.x=Math.PI*.5,g.position.set(0,.032,-.38),u.add(g);const _=new Q(new yt(.034,.2,.046),i);_.position.set(0,-.1,-.18),_.rotation.x=.22,u.add(_);const m=new Q(new yt(.04,.12,.05),e);m.position.set(0,-.06,.06),m.rotation.x=-.25,u.add(m);const f=new Q(new yt(.008,.024,.012),i);f.position.set(0,.068,-.45),u.add(f),this.models.set("smg",u),this.weaponPivot.add(u);const E=new Jt,b=new Q(new _e(.062,.062,1.15,14),r);b.rotation.x=Math.PI*.5,b.position.set(.04,.03,-.22),E.add(b);const x=new Q(new _e(.078,.064,.12,14),i);x.rotation.x=Math.PI*.5,x.position.set(.04,.03,-.82),E.add(x);const D=new Q(new yt(.04,.13,.05),e);D.position.set(.04,-.08,-.18),E.add(D);const R=new Q(new yt(.05,.05,.01),i);R.position.set(-.03,.075,-.45),E.add(R),this.models.set("bazooka",E),this.weaponPivot.add(E);const A=new Jt,I=new Q(new Je(.048,10,10),r);I.scale.set(.95,1.25,.95),I.position.set(0,0,-.12),A.add(I);const S=new Q(new yt(.016,.065,.03),i);S.position.set(.028,.035,-.12),A.add(S),this.models.set("grenade",A),this.weaponPivot.add(A);const y=new $t({color:15131091,roughness:.95}),P=new Q(new _e(.042,.042,.095,12),y);P.rotation.z=Math.PI*.35,P.position.set(0,-.05,-.22),this.bandageModel.add(P),this.bandageModel.visible=!1,this.weaponPivot.add(this.bandageModel),this.muzzleFlashMesh=new Q(new qn(.24,.24),new Re({map:t.radialGlow,color:16762477,transparent:!0,opacity:.95,depthWrite:!1,blending:Vi})),this.muzzleFlashMesh.position.set(0,.048,-.82),this.muzzleFlashMesh.visible=!1,this.weaponPivot.add(this.muzzleFlashMesh),this.muzzleLight=new zs(16757844,0,9,2),this.muzzleLight.position.set(0,.06,-.78),this.weaponPivot.add(this.muzzleLight),this.setWeapon("rifle")}setWeapon(t){this.activeWeapon=t;for(const[e,n]of this.models.entries())n.visible=e===t}triggerFire(t,e,n){if(this.recoilZ=Math.min(.14,this.recoilZ+t),this.recoilPitch=Math.min(.24,this.recoilPitch+e),n){this.flashTimer=.045,this.muzzleFlashMesh.visible=!0,this.muzzleFlashMesh.rotation.z=Math.random()*Math.PI;const i=this.activeWeapon==="smg"?-.55:this.activeWeapon==="bazooka"?-.88:-.82;this.muzzleFlashMesh.position.z=i,this.muzzleLight.intensity=3.2}}update(t,e,n,i,r,o,a){this.swayTime+=t*(1.8+n*6.5),this.recoilZ=ae.lerp(this.recoilZ,0,Math.min(1,t*15)),this.recoilPitch=ae.lerp(this.recoilPitch,0,Math.min(1,t*13)),this.flashTimer>0&&(this.flashTimer-=t,this.flashTimer<=0&&(this.muzzleFlashMesh.visible=!1,this.muzzleLight.intensity=0)),this.boltMesh&&(this.boltMesh.position.z=-.03+this.recoilZ*.55),this.bandageModel.visible=r;for(const[x,D]of this.models.entries())D.visible=!r&&!a&&x===this.activeWeapon;if(r){this.weaponPivot.position.set(Math.sin(this.swayTime*2.2)*.04,-.16+Math.cos(this.swayTime*4.4)*.02,-.25),this.weaponPivot.rotation.set(.2,0,Math.sin(this.swayTime*2.2)*.25);return}const l=this.activeWeapon==="bazooka"?.24:.2,c=this.activeWeapon==="bazooka"?-.19:-.2,h=-.34,d=0,u=this.activeWeapon==="rifle"?-.072:this.activeWeapon==="smg"?-.074:-.095,p=-.27;let g=ae.lerp(l,d,e),_=ae.lerp(c,u,e),m=ae.lerp(h,p,e)+this.recoilZ;const f=(1-e*.85)*(.004+n*.016);g+=Math.cos(this.swayTime*.5)*f,_+=Math.abs(Math.sin(this.swayTime))*f*1.1;let E=0,b=0;if(i>0){const x=Math.sin(i*Math.PI);E=x*.22,b=x*.55}this.activeWeapon==="grenade"&&o>0&&(m+=.14,g+=.08),this.weaponPivot.position.set(g,_-E,m),this.weaponPivot.rotation.set(this.recoilPitch-E*.8,0,b)}}const Bn={rifle:{name:"Fuzil M-42",magSize:8,fireInterval:.24,reloadTime:1.85,damage:78,spreadHip:.022,spreadAds:.0025,recoilPitch:.036,recoilYaw:.008,automatic:!1},smg:{name:"SMG-44",magSize:30,fireInterval:.088,reloadTime:2.05,damage:34,spreadHip:.042,spreadAds:.012,recoilPitch:.016,recoilYaw:.01,automatic:!0},bazooka:{name:"Bazuca AT-43",magSize:1,fireInterval:.6,reloadTime:2.9,damage:115,spreadHip:.015,spreadAds:.003,recoilPitch:.085,recoilYaw:.015,automatic:!1},grenade:{name:"Granada F-1",magSize:1,fireInterval:.5,reloadTime:.5,damage:120,spreadHip:0,spreadAds:0,recoilPitch:0,recoilYaw:0,automatic:!1}};class pm{constructor(t,e,n,i,r,o){T(this,"camera");T(this,"viewModel");T(this,"pos",new C(0,-1.05,30));T(this,"yaw",0);T(this,"pitch",0);T(this,"hp",100);T(this,"maxHp",100);T(this,"bleeding",!1);T(this,"bandages",3);T(this,"bandagingProgress",0);T(this,"suppression",0);T(this,"tinnitus",0);T(this,"dustOverlay",0);T(this,"coverState","sheltered");T(this,"exposure",.1);T(this,"overheadProtected",!1);T(this,"isCrouching",!1);T(this,"isSprinting",!1);T(this,"weaponId","rifle");T(this,"magAmmo",{rifle:8,smg:30,bazooka:1,grenade:1});T(this,"reserveAmmo",{rifle:56,smg:150,bazooka:5,grenade:3});T(this,"reloadingProgress",0);T(this,"isReloading",!1);T(this,"reloadTimer",0);T(this,"adsFactor",0);T(this,"mgMounted",!1);T(this,"mgAnchorPos",new C);T(this,"mgHeat",0);T(this,"mgOverheated",!1);T(this,"cookingGrenade",!1);T(this,"cookTimer",0);T(this,"lastDamageCause","Fogo cruzado inimigo");T(this,"damageIndicators",[]);T(this,"shotsFired",0);T(this,"shotsHit",0);T(this,"hitMarkerTimer",0);T(this,"hitMarkerCrit",!1);T(this,"fireCooldown",0);T(this,"leanCurrent",0);T(this,"currentEyeOffset",1.64);T(this,"footstepTimer",0);T(this,"shakeIntensity",0);T(this,"recoilOffsetPitch",0);T(this,"recoilOffsetYaw",0);T(this,"wireCutCooldown",0);T(this,"nextDamageId",1);T(this,"audio");T(this,"input");T(this,"terrain");T(this,"cover");T(this,"projectiles");this.camera=t,this.audio=e,this.input=n,this.terrain=i,this.cover=r,this.projectiles=o,this.viewModel=new fm,this.camera.add(this.viewModel.root)}resetForMission(t,e,n){const i=this.terrain.getTerrainHeight(t,e);this.pos.set(t,i,e),this.yaw=n,this.pitch=0,this.hp=100,this.bleeding=!1,this.bandages=3,this.bandagingProgress=0,this.suppression=0,this.tinnitus=0,this.dustOverlay=0,this.isCrouching=!1,this.isSprinting=!1,this.currentEyeOffset=1.64,this.leanCurrent=0,this.weaponId="rifle",this.viewModel.setWeapon("rifle"),this.magAmmo={rifle:8,smg:30,bazooka:1,grenade:1},this.reserveAmmo={rifle:56,smg:150,bazooka:5,grenade:3},this.isReloading=!1,this.reloadingProgress=0,this.fireCooldown=0,this.adsFactor=0,this.mgMounted=!1,this.mgHeat=0,this.mgOverheated=!1,this.cookingGrenade=!1,this.cookTimer=0,this.damageIndicators=[],this.shotsFired=0,this.shotsHit=0,this.hitMarkerTimer=0,this.shakeIntensity=0,this.recoilOffsetPitch=0,this.recoilOffsetYaw=0,this.lastDamageCause="Fogo cruzado inimigo"}getEyeY(){return this.pos.y+this.currentEyeOffset}addShake(t){this.shakeIntensity=Math.min(1,this.shakeIntensity+t)}registerHitMarker(t){this.shotsHit++,this.hitMarkerTimer=.16,this.hitMarkerCrit=t,t&&this.audio.playHeadshotPing()}applyDamage(t,e,n,i){if(this.hp<=0)return;this.hp=Math.max(0,this.hp-t),this.lastDamageCause=n,i&&this.hp>0&&(this.bleeding=!0),this.addShake(Math.min(.65,t/45));const r=e.x-this.pos.x,o=e.z-this.pos.z,a=Math.atan2(r,-o);this.damageIndicators.push({id:this.nextDamageId++,angleRad:a+this.yaw,intensity:Math.min(1,t/30),age:0})}applySuppression(t){this.suppression=Math.min(1,this.suppression+t)}resupplyAmmo(){this.reserveAmmo.rifle=64,this.reserveAmmo.smg=180,this.reserveAmmo.bazooka=Math.max(this.reserveAmmo.bazooka,6),this.reserveAmmo.grenade=Math.max(this.reserveAmmo.grenade,4),this.audio.playReload()}resupplyMedic(){this.bandages=Math.max(this.bandages,3),this.hp=Math.min(this.maxHp,this.hp+30),this.bleeding=!1,this.audio.playUiClick()}update(t,e,n,i){const{dx:r,dy:o}=this.input.consumeMouseDelta(),a=.0021*e*(1-this.adsFactor*.42);if(this.yaw-=r*a,this.pitch=Math.max(-1.42,Math.min(1.42,this.pitch-o*a)),this.mgMounted){const F=Math.atan2(Math.sin(this.yaw),Math.cos(this.yaw));this.yaw=Math.max(-1.05,Math.min(1.05,F)),this.pitch=Math.max(-.45,Math.min(.55,this.pitch))}this.recoilOffsetPitch=ae.lerp(this.recoilOffsetPitch,0,Math.min(1,t*8)),this.recoilOffsetYaw=ae.lerp(this.recoilOffsetYaw,0,Math.min(1,t*8)),this.shakeIntensity=Math.max(0,this.shakeIntensity-t*1.9),this.dustOverlay=Math.max(0,this.dustOverlay-t*.42),this.tinnitus=Math.max(0,this.tinnitus-t*.24),this.hitMarkerTimer=Math.max(0,this.hitMarkerTimer-t);for(let F=this.damageIndicators.length-1;F>=0;F--)this.damageIndicators[F].age+=t,this.damageIndicators[F].age>1.35&&this.damageIndicators.splice(F,1);this.input.consumeKeyPress("KeyC")&&!this.mgMounted&&(this.isCrouching=!this.isCrouching);const l=(this.input.isKeyDown("KeyW")?1:0)-(this.input.isKeyDown("KeyS")?1:0),c=(this.input.isKeyDown("KeyD")?1:0)-(this.input.isKeyDown("KeyA")?1:0),h=l!==0||c!==0,d=this.input.isRightMouseDown()&&!this.isReloading&&!this.mgMounted&&this.weaponId!=="grenade";this.adsFactor=ae.lerp(this.adsFactor,d?1:0,Math.min(1,t*13));const u=this.input.isKeyDown("ShiftLeft")&&h&&l>0&&!this.isCrouching&&!d&&!this.mgMounted&&this.bandagingProgress<=0;this.isSprinting=u;const p=this.mgMounted?0:(this.input.isKeyDown("KeyE")?1:0)-(this.input.isKeyDown("KeyQ")?1:0);this.leanCurrent=ae.lerp(this.leanCurrent,p,Math.min(1,t*11));const g=this.isCrouching?.88:1.64;this.currentEyeOffset=ae.lerp(this.currentEyeOffset,g,Math.min(1,t*11));const _=this.cover.evaluatePlayerCover(this.pos,this.getEyeY(),this.isCrouching,this.isSprinting);this.coverState=_.state,this.exposure=_.exposure,this.overheadProtected=_.overheadProtected;let m=0;if(!this.mgMounted&&h){let F=this.isSprinting?6.15:this.isCrouching?2.45:4.25;this.adsFactor>.3&&(F*=.65),this.bandagingProgress>0&&(F*=.45),_.inWireHazard&&(F*=.45,this.wireCutCooldown-=t,this.wireCutCooldown<=0&&(this.wireCutCooldown=.7,this.applyDamage(5,this.pos,"Preso em arame farpado sob fogo inimigo",!1)));const X=Math.sin(this.yaw),q=Math.cos(this.yaw);let W=-X*l+q*c,K=-q*l-X*c;const H=Math.hypot(W,K);H>.001&&(W=W/H*F*t,K=K/H*F*t);const st=this.input.isKeyDown("Space"),dt=this.cover.resolvePlayerMovement(this.pos,W,K,st);this.pos.x=dt.x,this.pos.y=ae.lerp(this.pos.y,dt.y,Math.min(1,t*18)),this.pos.z=dt.z,m=F/6.15,this.footstepTimer-=t*(this.isSprinting?1.4:1),this.footstepTimer<=0&&(this.footstepTimer=this.isCrouching?.54:.39,this.audio.playFootstep(this.terrain.isInsideTrenchOrDugout(this.pos.x,this.pos.z)))}else this.mgMounted&&(this.pos.x=this.mgAnchorPos.x,this.pos.z=this.mgAnchorPos.z,this.pos.y=this.terrain.getTerrainHeight(this.pos.x,this.pos.z));const f=this.coverState==="dugout"||this.coverState==="sheltered"?.48:this.coverState==="peeking"?.2:.07;this.suppression=Math.max(0,this.suppression-f*t),this.bleeding&&(this.hp-=4.2*t,this.hp<=0&&(this.hp=0,this.lastDamageCause="Hemorragia fatal sem aplicar curativo"));let E=0,b=null;if(this.input.isKeyDown("KeyH")&&this.bandages>0&&(this.bleeding||this.hp<95)&&!this.isSprinting&&!this.mgMounted?(this.bandagingProgress+=t/2,E=Math.min(1,this.bandagingProgress),b="APLICANDO CURATIVO...",this.bandagingProgress>=1&&(this.bandagingProgress=0,this.bandages--,this.bleeding=!1,this.hp=Math.min(this.maxHp,this.hp+38),this.audio.playUiClick())):this.bandagingProgress=0,!this.mgMounted&&this.bandagingProgress<=0&&!this.cookingGrenade&&(this.input.consumeKeyPress("Digit1")?this.switchWeapon("rifle"):this.input.consumeKeyPress("Digit2")?this.switchWeapon("smg"):this.input.consumeKeyPress("Digit3")?this.switchWeapon("bazooka"):this.input.consumeKeyPress("Digit4")&&this.switchWeapon("grenade"),this.input.consumeKeyPress("KeyR")&&this.startReload()),this.isReloading){const F=Bn[this.weaponId].reloadTime;this.reloadTimer+=t,this.reloadingProgress=Math.min(1,this.reloadTimer/F),this.reloadTimer>=F&&this.finishReload()}else this.reloadingProgress=0;this.handleGrenadeInput(t),this.fireCooldown=Math.max(0,this.fireCooldown-t),this.mgHeat=Math.max(0,this.mgHeat-t*(this.mgOverheated?.28:.34)),this.mgOverheated&&this.mgHeat<=.15&&(this.mgOverheated=!1),this.mgMounted?this.input.isLeftMouseDown()&&!this.mgOverheated&&this.fireCooldown<=0&&this.fireMountedMG():this.weaponId!=="grenade"&&!this.isReloading&&this.bandagingProgress<=0&&!this.cookingGrenade&&(Bn[this.weaponId].automatic?this.input.isLeftMouseDown():this.input.consumeLeftMouseClick())&&this.fireCooldown<=0&&(this.magAmmo[this.weaponId]>0?this.fireActiveWeapon():this.reserveAmmo[this.weaponId]>0&&this.startReload());let x=null;const D=this.projectiles.getNearestDangerGrenade(this.pos,this.yaw);if(D&&D.dist<2.65&&D.grenade.faction==="enemy"){if(x="[F] Chutar Granada de Volta!",this.input.consumeKeyPress("KeyF")){const F=new C(-Math.sin(this.yaw),.25,-Math.cos(this.yaw)).normalize();this.projectiles.kickGrenade(D.grenade,F)}}else if(this.mgMounted)x="[F] Sair da Metralhadora Pesada",this.input.consumeKeyPress("KeyF")&&(this.mgMounted=!1);else{let F=null,X=1/0;for(const q of n){if(!q.active)continue;const W=Math.hypot(q.x-this.pos.x,q.z-this.pos.z);W<=q.radius&&W<X&&(X=W,F=q)}F&&(x=F.label,this.input.consumeKeyPress("KeyF")&&(F.kind==="ammo_crate"?this.resupplyAmmo():F.kind==="medic_crate"?this.resupplyMedic():F.kind==="mg_mount"&&(this.mgMounted=!0,this.isCrouching=!1,this.mgAnchorPos.set(F.x,this.pos.y,F.z),this.yaw=0),i(F.kind,F.id)))}const R=this.adsFactor>0?ae.lerp(72,46,this.adsFactor):72;Math.abs(this.camera.fov-R)>.05&&(this.camera.fov=R,this.camera.updateProjectionMatrix());const A=Math.cos(this.yaw)*this.leanCurrent*.42,I=-Math.sin(this.yaw)*this.leanCurrent*.42,S=this.shakeIntensity*.045+this.suppression*.008,y=(Math.random()-.5)*S,P=(Math.random()-.5)*S;this.camera.position.set(this.pos.x+A+y,this.getEyeY()+P,this.pos.z+I);const G=new Ye(this.pitch+this.recoilOffsetPitch,this.yaw+this.recoilOffsetYaw,-this.leanCurrent*.14,"YXZ");return this.camera.quaternion.setFromEuler(G),this.viewModel.update(t,this.adsFactor,m,this.reloadingProgress,this.bandagingProgress>0,this.cookingGrenade?Math.min(1,this.cookTimer/3.2):0,this.mgMounted),{interactPrompt:x,actionProgress:E,actionLabel:b}}switchWeapon(t){this.weaponId!==t&&(t==="grenade"&&this.reserveAmmo.grenade<=0||(this.weaponId=t,this.isReloading=!1,this.reloadingProgress=0,this.viewModel.setWeapon(t),this.audio.playUiClick()))}startReload(){if(this.isReloading||this.weaponId==="grenade")return;const t=Bn[this.weaponId].magSize;this.magAmmo[this.weaponId]>=t||this.reserveAmmo[this.weaponId]<=0||(this.isReloading=!0,this.reloadTimer=0,this.audio.playReload())}finishReload(){const e=Bn[this.weaponId].magSize-this.magAmmo[this.weaponId],n=Math.min(e,this.reserveAmmo[this.weaponId]);this.magAmmo[this.weaponId]+=n,this.reserveAmmo[this.weaponId]-=n,this.isReloading=!1,this.reloadTimer=0}handleGrenadeInput(t){const e=this.input.isKeyDown("KeyG"),n=this.weaponId==="grenade"&&this.input.isLeftMouseDown();if((e||n)&&!this.cookingGrenade&&this.reserveAmmo.grenade>0&&!this.mgMounted&&(this.cookingGrenade=!0,this.cookTimer=0),this.cookingGrenade&&(this.cookTimer+=t,!e&&!n||this.cookTimer>=3.15)){const r=Math.max(.25,3.2-this.cookTimer);this.throwGrenade(r),this.cookingGrenade=!1,this.cookTimer=0,this.weaponId==="grenade"&&this.reserveAmmo.grenade<=0&&this.switchWeapon("rifle")}}throwGrenade(t){if(this.reserveAmmo.grenade<=0)return;this.reserveAmmo.grenade--;const e=new C(0,0,-1).applyQuaternion(this.camera.quaternion).normalize();e.y+=.24,e.normalize();const n=this.camera.position.clone().addScaledVector(e,.45);this.projectiles.spawnGrenade(n,e.multiplyScalar(17.5),t,"ally")}fireActiveWeapon(){const t=Bn[this.weaponId];this.magAmmo[this.weaponId]--,this.fireCooldown=t.fireInterval,this.shotsFired++;const n=ae.lerp(t.spreadHip,t.spreadAds,this.adsFactor)*(1+this.suppression*1.4),i=new C(0,0,-1).applyQuaternion(this.camera.quaternion);i.x+=(Math.random()-.5)*n,i.y+=(Math.random()-.5)*n,i.z+=(Math.random()-.5)*n,i.normalize();const r=this.camera.position.clone().addScaledVector(i,.48);this.weaponId==="bazooka"?(this.projectiles.spawnRocket(r,i,"ally"),this.audio.playGunshot("bazooka",0,0),this.viewModel.triggerFire(.11,.14,!0),this.addShake(.35)):(this.projectiles.spawnBullet(r,i,145,t.damage,"ally"),this.audio.playGunshot(this.weaponId==="rifle"?"rifle":"smg",0,0),this.viewModel.triggerFire(this.weaponId==="rifle"?.08:.036,this.weaponId==="rifle"?.095:.04,!0),this.weaponId==="rifle"&&this.magAmmo.rifle===0&&setTimeout(()=>this.audio.playGarandPing(),90)),this.recoilOffsetPitch+=t.recoilPitch*(1-this.adsFactor*.22),this.recoilOffsetYaw+=(Math.random()-.5)*t.recoilYaw}fireMountedMG(){this.fireCooldown=.085,this.shotsFired++,this.mgHeat=Math.min(1,this.mgHeat+.042),this.mgHeat>=1&&(this.mgOverheated=!0);const t=new C(0,0,-1).applyQuaternion(this.camera.quaternion);t.x+=(Math.random()-.5)*.024,t.y+=(Math.random()-.5)*.024,t.normalize();const e=this.camera.position.clone().addScaledVector(t,.7);this.projectiles.spawnBullet(e,t,155,52,"ally"),this.audio.playGunshot("mg",0,0),this.recoilOffsetPitch+=.014,this.recoilOffsetYaw+=(Math.random()-.5)*.012}}class mm{constructor(t,e,n,i,r){T(this,"scene");T(this,"terrain");T(this,"cover");T(this,"vfx");T(this,"audio");T(this,"tracers",[]);T(this,"rockets",[]);T(this,"grenades",[]);T(this,"bombs",[]);T(this,"tracerGeo",new yt(.032,.032,1.35));T(this,"allyTracerMat",new Re({color:16770180}));T(this,"enemyTracerMat",new Re({color:16736824}));T(this,"grenadeGeo",new Je(.085,8,8));T(this,"grenadeMat",new $t({color:4937529,roughness:.75}));T(this,"bombGeo",new _e(.18,.24,1.15,8));T(this,"bombMat",new $t({color:2500645,roughness:.6}));this.scene=t,this.terrain=e,this.cover=n,this.vfx=i,this.audio=r}clear(){for(const t of this.tracers)this.scene.remove(t.mesh);for(const t of this.rockets)this.scene.remove(t.mesh);for(const t of this.grenades)this.scene.remove(t.mesh);for(const t of this.bombs)this.scene.remove(t.mesh);this.tracers=[],this.rockets=[],this.grenades=[],this.bombs=[]}spawnBullet(t,e,n,i,r){const o=new Q(this.tracerGeo,r==="ally"?this.allyTracerMat:this.enemyTracerMat);o.position.copy(t),o.lookAt(t.clone().add(e)),this.scene.add(o),this.tracers.push({mesh:o,pos:t.clone(),vel:e.clone().normalize().multiplyScalar(n),age:0,maxAge:1.35,faction:r,damage:i,whizzed:!1})}spawnRocket(t,e,n){const i=new Jt,r=new Q(new _e(.055,.055,.55,8),new $t({color:4542007,roughness:.6}));r.rotation.x=Math.PI*.5,i.add(r);const o=new Q(new Je(.09,6,6),new Re({color:16755268}));o.position.z=.28,i.add(o),i.position.copy(t),i.lookAt(t.clone().add(e)),this.scene.add(i),this.rockets.push({mesh:i,pos:t.clone(),vel:e.clone().normalize().multiplyScalar(44),age:0,faction:n})}spawnGrenade(t,e,n,i){const r=new Q(this.grenadeGeo,this.grenadeMat);r.position.copy(t),r.castShadow=!0,this.scene.add(r),this.grenades.push({mesh:r,pos:t.clone(),vel:e.clone(),fuse:n,maxFuse:n,faction:i,bounces:0})}spawnFallingBomb(t,e,n,i){const r=new Q(this.bombGeo,this.bombMat);r.position.set(t,e,n),this.scene.add(r),this.bombs.push({mesh:r,pos:new C(t,e,n),velY:-22,radius:i?9.5:7,damage:i?135:95,craterRadius:i?3.5:2.6,craterDepth:i?1.25:.95})}getNearestDangerGrenade(t,e){let n=null,i=7.5;for(const c of this.grenades){const h=c.pos.distanceTo(t);h<i&&(i=h,n=c)}if(!n)return null;const r=n.pos.x-t.x,o=n.pos.z-t.z,l=Math.atan2(r,-o)+e;return{grenade:n,dist:i,angleRad:l,fuseProgress:1-Math.max(0,n.fuse/n.maxFuse)}}kickGrenade(t,e){t.vel.copy(e).multiplyScalar(14),t.vel.y=5.5,t.faction="ally",this.audio.playGrenadeBounce(1)}update(t,e,n,i){const r=new C(e.x,n,e.z);for(let o=this.tracers.length-1;o>=0;o--){const a=this.tracers[o];if(a.age+=t,a.age>=a.maxAge){this.scene.remove(a.mesh),this.tracers.splice(o,1);continue}const l=a.vel.length()*t,c=a.vel.clone().normalize(),h=a.pos.clone().addScaledVector(c,l);a.faction==="enemy"&&!a.whizzed&&this.pointSegmentDist(r,a.pos,h)<2.2&&(a.whizzed=!0,i.onNearMissPlayer(a.pos));let d=!1;const u=2;for(let g=1;g<=u;g++){const _=a.pos.clone().lerp(h,g/u);if(a.faction==="ally"){if(i.onHitEnemySoldier(_,c,a.damage,!0)){d=!0;break}if(i.onHitTank(_,0,!1)){this.vfx.spawnBulletImpact(_,c.clone().negate(),!0),this.audio.playRicochet(0),d=!0;break}}else{const m=Math.hypot(_.x-e.x,_.z-e.z),f=e.y;if(m<.44&&_.y>=f+.15&&_.y<=n+.18){i.onHitPlayer(a.damage,a.pos,"Fogo cruzado inimigo sem cobertura",Math.random()<.35),d=!0;break}if(i.onHitAllySoldier(_,c,a.damage)){d=!0;break}}}if(d){this.scene.remove(a.mesh),this.tracers.splice(o,1);continue}const p=this.cover.raycastWorld(a.pos,c,l,!0);if(p){this.vfx.spawnBulletImpact(p.point,p.normal,!1),p.destructibleId&&this.cover.damageDestructible(p.destructibleId,a.damage*.45),this.scene.remove(a.mesh),this.tracers.splice(o,1);continue}a.pos.copy(h),a.mesh.position.copy(h)}for(let o=this.rockets.length-1;o>=0;o--){const a=this.rockets[o];a.age+=t;const l=a.vel.length()*t,c=a.vel.clone().normalize(),h=a.pos.clone().addScaledVector(c,l);this.vfx.spawnSprite(a.pos,new C(0,.3,0),13289150,.32,.95,.55,.55,0);let d=null;if(i.onHitTank(h,0,!0))d=h;else{const u=this.cover.raycastWorld(a.pos,c,l,!0);u&&(d=u.point,u.destructibleId&&this.cover.damageDestructible(u.destructibleId,240))}if(d||a.age>3.5){const u=d??h;i.onExplosion(u,5.8,115,2.2,.75,"Explosão de foguete antitanque",a.faction==="ally"),this.scene.remove(a.mesh),this.rockets.splice(o,1);continue}a.pos.copy(h),a.mesh.position.copy(h)}for(let o=this.grenades.length-1;o>=0;o--){const a=this.grenades[o];a.fuse-=t,a.vel.y-=16.5*t;const l=a.vel.clone().multiplyScalar(t),c=a.pos.clone().add(l),h=this.terrain.getTerrainHeight(c.x,c.z);c.y<=h+.09&&(c.y=h+.09,Math.abs(a.vel.y)>1.8?(a.vel.y=Math.abs(a.vel.y)*.42,a.vel.x*=.62,a.vel.z*=.62,a.bounces++,a.bounces<=3&&this.audio.playGrenadeBounce(a.pos.distanceTo(e))):a.vel.set(a.vel.x*.85,0,a.vel.z*.85)),a.pos.copy(c),a.mesh.position.copy(c),a.mesh.rotation.x+=t*7,a.mesh.rotation.z+=t*5,a.fuse<=0&&(i.onExplosion(a.pos,6.8,120,2.1,.7,a.faction==="enemy"?"Granada inimiga dentro da trincheira":"Sua própria granada explodiu perto demais",a.faction==="ally"),this.scene.remove(a.mesh),this.grenades.splice(o,1))}for(let o=this.bombs.length-1;o>=0;o--){const a=this.bombs[o];a.velY-=14*t,a.pos.y+=a.velY*t,a.mesh.position.copy(a.pos);const l=this.terrain.getTerrainHeight(a.pos.x,a.pos.z);a.pos.y<=l+.25&&(a.pos.y=l,i.onExplosion(a.pos,a.radius,a.damage,a.craterRadius,a.craterDepth,"Explosão de bomba aérea fora do abrigo",!1),this.scene.remove(a.mesh),this.bombs.splice(o,1))}}pointSegmentDist(t,e,n){const i=new C().subVectors(n,e),r=i.lengthSq();if(r<1e-5)return t.distanceTo(e);const o=Math.max(0,Math.min(1,new C().subVectors(t,e).dot(i)/r)),a=e.clone().addScaledVector(i,o);return t.distanceTo(a)}}class gm{constructor(t,e,n,i,r,o){T(this,"scene");T(this,"terrain");T(this,"cover");T(this,"projectiles");T(this,"vfx");T(this,"audio");T(this,"soldiers",[]);T(this,"nextId",1);T(this,"headGeo",new Je(.14,8,8));T(this,"helmetGeo",new Je(.165,10,8,0,Math.PI*2,0,Math.PI*.56));T(this,"torsoGeo",new yt(.42,.54,.24));T(this,"legGeo",new yt(.15,.58,.16));T(this,"armGeo",new yt(.12,.42,.12));T(this,"rifleGeo",new yt(.06,.08,.78));T(this,"skinMat",new $t({color:12753788,roughness:.8}));T(this,"allyUniformMat",new $t({color:4937787,roughness:.88}));T(this,"allyHelmetMat",new $t({color:4147508,roughness:.65}));T(this,"enemyUniformMat",new $t({color:5067087,roughness:.88}));T(this,"enemyHelmetMat",new $t({color:3093298,roughness:.6}));T(this,"officerUniformMat",new $t({color:3882556,roughness:.8}));T(this,"gunMat",new $t({color:2237218,roughness:.5}));this.scene=t,this.terrain=e,this.cover=n,this.projectiles=i,this.vfx=r,this.audio=o}clear(){for(const t of this.soldiers)this.scene.remove(t.group);this.soldiers=[]}spawnAllies(t){const e=[-24,-18,-11,-5,3,10,17,24];for(let n=0;n<t;n++){const i=e[n%e.length]+(Math.random()-.5)*1.5,r=30.2+(Math.abs(i)>12?1.5:0);this.spawnSoldier("ally",n%3===0?"assault":"rifleman",i,r,!1)}}spawnEmplacedGunners(t){for(const e of t)if(e.faction==="enemy"){const n=this.spawnSoldier("enemy","mg_gunner",e.x,e.z,!0);n.yaw=e.yaw}}spawnEnemySquad(t,e,n=-40,i=-26){for(let r=0;r<t;r++){const o=e[r%e.length],a=(Math.random()-.5)*60,l=ae.lerp(n,i,Math.random());this.spawnSoldier("enemy",o,a,l,!1)}}spawnSoldier(t,e,n,i,r){const o=this.terrain.getTerrainHeight(n,i),a=new Jt;a.position.set(n,o,i);const l=t==="ally"?this.allyUniformMat:e==="officer"?this.officerUniformMat:this.enemyUniformMat,c=t==="ally"?this.allyHelmetMat:this.enemyHelmetMat,h=new Q(this.legGeo,l);h.position.set(-.11,.29,0),h.castShadow=!0,a.add(h);const d=new Q(this.legGeo,l);d.position.set(.11,.29,0),d.castShadow=!0,a.add(d);const u=new Jt;u.position.set(0,.85,0);const p=new Q(this.torsoGeo,l);p.castShadow=!0,u.add(p);const g=new Q(this.headGeo,this.skinMat);g.position.set(0,.4,0),g.castShadow=!0,u.add(g);const _=new Q(this.helmetGeo,c);_.position.set(0,.43,0),_.castShadow=!0,u.add(_);const m=new Q(this.armGeo,l);m.position.set(-.26,.05,-.14),m.rotation.x=1.1,u.add(m);const f=new Q(this.armGeo,l);f.position.set(.24,.05,-.16),f.rotation.x=1.2,u.add(f);const E=new Q(this.rifleGeo,this.gunMat);E.position.set(.12,.06,-.44),u.add(E),a.add(u),this.scene.add(a);const b=e==="mg_gunner"?120:e==="officer"?115:85,x=t==="ally"?i:e==="grenadier"?12+Math.random()*6:23+Math.random()*8,D={id:this.nextId++,faction:t,role:e,group:a,leftLeg:h,rightLeg:d,torsoGroup:u,muzzlePoint:new C,pos:new C(n,o,i),yaw:t==="ally"?0:Math.PI,hp:b,maxHp:b,alive:!0,deathTimer:0,targetPos:new C(n*.72+(Math.random()-.5)*10,0,x),fireCooldown:.6+Math.random()*1.1,grenadeCooldown:5+Math.random()*6,burstShotsLeft:0,firstShotGrace:.35,walkPhase:Math.random()*Math.PI*2,isCrouching:!1,emplaced:r};return this.soldiers.push(D),D}getLivingEnemyCount(){let t=0;for(const e of this.soldiers)e.alive&&e.faction==="enemy"&&t++;return t}checkBulletHit(t,e,n,i,r){for(const o of this.soldiers){if(!o.alive||o.faction!==t)continue;const a=e.x-o.pos.x,l=e.z-o.pos.z;if(Math.hypot(a,l)>.44)continue;const h=o.pos.y+(o.isCrouching?1.1:1.56);if(e.y<o.pos.y+.05||e.y>h)continue;const d=o.pos.y+(o.isCrouching?.85:1.24),u=e.y>=d,p=u?i*2.2:i;return o.hp-=p,this.vfx.spawnSprite(e,n.clone().multiplyScalar(1.2),9051159,.25,.55,.25,.7),o.hp<=0&&(o.alive=!1,o.deathTimer=0,r==null||r(o,u)),{hit:!0,headshot:u}}return{hit:!1,headshot:!1}}applyBlastDamage(t,e,n,i,r){for(const o of this.soldiers){if(!o.alive)continue;const a=o.pos.distanceTo(t);if(a<=e){if(o.faction==="ally"&&i)continue;const l=1-a/e*.65;o.hp-=n*l,o.hp<=0&&(o.alive=!1,o.deathTimer=0,r==null||r(o))}}}update(t,e,n,i,r,o){const a=new C(e.x,n,e.z);for(let l=this.soldiers.length-1;l>=0;l--){const c=this.soldiers[l];if(!c.alive){c.deathTimer+=t;const h=Math.min(1,c.deathTimer/.42);c.group.rotation.x=ae.lerp(0,Math.PI*.48,h),c.group.position.y=c.pos.y+.14*(1-h),c.deathTimer>12&&(this.scene.remove(c.group),this.soldiers.splice(l,1));continue}c.faction==="ally"?this.updateAlly(c,t,r):this.updateEnemy(c,t,e,a,i,o)}}updateAlly(t,e,n){t.isCrouching=n,t.torsoGroup.position.y=ae.lerp(t.torsoGroup.position.y,t.isCrouching?.56:.85,e*8);let i=null,r=48;for(const o of this.soldiers)if(o.alive&&o.faction==="enemy"){const a=o.pos.distanceTo(t.pos);a<r&&(r=a,i=o)}if(i&&!n){const o=i.pos.x-t.pos.x,a=i.pos.z-t.pos.z;if(t.yaw=Math.atan2(-o,-a),t.group.rotation.y=t.yaw,t.fireCooldown-=e,t.fireCooldown<=0){t.fireCooldown=t.role==="assault"?.25+Math.random()*.2:.9+Math.random()*.7;const l=new C(t.pos.x,t.pos.y+1.25,t.pos.z),h=new C(i.pos.x+(Math.random()-.5)*1.1,i.pos.y+.9+(Math.random()-.5)*.6,i.pos.z+(Math.random()-.5)*1.1).sub(l).normalize();this.projectiles.spawnBullet(l,h,130,26,"ally")}}}updateEnemy(t,e,n,i,r,o){const a=new C(t.pos.x,t.pos.y+1.32,t.pos.z),l=t.pos.distanceTo(n),c=l<58&&r>.28&&this.cover.hasLineOfSight(a,i);if(!t.emplaced){const h=t.targetPos.x-t.pos.x,d=t.targetPos.z-t.pos.z,u=Math.hypot(h,d);if(u>1.8&&(!c||t.role==="assault"||l>22)){const g=t.role==="assault"?3.55:2.75,_=h/u*g*e,m=d/u*g*e;t.pos.x+=_,t.pos.z+=m,t.pos.y=this.terrain.getTerrainHeight(t.pos.x,t.pos.z),t.group.position.copy(t.pos),t.walkPhase+=e*g*3.1,t.leftLeg.rotation.x=Math.sin(t.walkPhase)*.55,t.rightLeg.rotation.x=-Math.sin(t.walkPhase)*.55}else t.leftLeg.rotation.x=0,t.rightLeg.rotation.x=0}if(c){const h=n.x-t.pos.x,d=n.z-t.pos.z;if(t.yaw=Math.atan2(-h,-d),t.group.rotation.y=t.yaw,t.role==="grenadier"&&l>11&&l<29&&(t.grenadeCooldown-=e,t.grenadeCooldown<=0)){t.grenadeCooldown=8.5+Math.random()*4;const u=new C(n.x-t.pos.x,0,n.z-t.pos.z),p=Math.max(1,u.length());u.normalize().multiplyScalar(Math.min(16,p*.72)),u.y=7.4,this.projectiles.spawnGrenade(a,u,3.3,"enemy"),o("GRANADA NA TRINCHEIRA! SAIA OU CHUTE DE VOLTA [F]!")}if(t.fireCooldown-=e,t.fireCooldown<=0){t.role==="mg_gunner"?t.fireCooldown=.11:t.role==="assault"?t.fireCooldown=.16:t.fireCooldown=.95+Math.random()*.65;const u=new C().subVectors(i,a).normalize(),p=r>.65&&t.firstShotGrace<=0?.025:r>.38?.065:.13;t.firstShotGrace=Math.max(0,t.firstShotGrace-.18),u.x+=(Math.random()-.5)*p,u.y+=(Math.random()-.5)*p,u.z+=(Math.random()-.5)*p,u.normalize();const g=t.role==="mg_gunner"?18:t.role==="rifleman"?24:15;this.projectiles.spawnBullet(a,u,118,g,"enemy");const _=Math.max(-1,Math.min(1,(t.pos.x-n.x)/28));Math.random()<.45&&this.audio.playGunshot(t.role==="mg_gunner"?"mg":"rifle",l,_)}}else if(t.yaw=Math.PI,t.group.rotation.y=t.yaw,t.firstShotGrace=.35,t.fireCooldown-=e,t.fireCooldown<=0){t.fireCooldown=t.role==="mg_gunner"?.26:1.7+Math.random()*1.4;const h=this.findRandomLivingAlly();if(h){const d=new C().subVectors(new C(h.pos.x,h.pos.y+1,h.pos.z),a).normalize();d.x+=(Math.random()-.5)*.12,d.y+=(Math.random()-.5)*.09,d.normalize(),this.projectiles.spawnBullet(a,d,112,16,"enemy")}}}findRandomLivingAlly(){const t=this.soldiers.filter(e=>e.alive&&e.faction==="ally");return t.length===0?null:t[Math.floor(Math.random()*t.length)]}}class _m{constructor(t,e,n,i,r,o){T(this,"scene");T(this,"terrain");T(this,"cover");T(this,"projectiles");T(this,"vfx");T(this,"audio");T(this,"tanks",[]);T(this,"nextId",1);this.scene=t,this.terrain=e,this.cover=n,this.projectiles=i,this.vfx=r,this.audio=o}clear(){for(const t of this.tanks)this.scene.remove(t.root);this.tanks=[],this.cover.setTankHulls([])}spawnTank(t,e,n,i){const r=Ki(),o=new $t({map:r.armorSteel,color:n?6054232:6777694,roughness:.58,metalness:.48}),a=new $t({color:1908252,roughness:.9,metalness:.35}),l=new $t({color:8006434,roughness:.7}),c=n?1.18:.96,h=new Jt,d=new Jt;h.add(d);const u=new Q(new yt(2.7*c,1.05*c,4.9*c),o);u.position.y=.85*c,u.castShadow=!0,u.receiveShadow=!0,d.add(u);const p=new Q(new yt(2.55*c,.72*c,1.15*c),o);p.position.set(0,.75*c,-2.5*c),p.rotation.x=.52,p.castShadow=!0,d.add(p);const g=new Q(new yt(1.7*c,.45*c,.25*c),l);g.position.set(0,1.05*c,2.46*c),d.add(g);for(const R of[-1,1]){const A=new Q(new yt(.62*c,.92*c,5.25*c),a);A.position.set(R*1.52*c,.52*c,0),A.castShadow=!0,d.add(A)}const _=new Jt;_.position.set(0,1.55*c,-.15*c);const m=new Q(new yt(1.95*c,.82*c,2.3*c),o);m.castShadow=!0,_.add(m);const f=new Q(new _e(.38*c,.42*c,.28*c,10),o);f.position.set(-.3*c,.5*c,.2*c),_.add(f);const E=new Q(new _e(.11*c,.14*c,3.1*c,10),o);E.rotation.x=Math.PI*.5,E.position.set(0,.05*c,-2.1*c),E.castShadow=!0,_.add(E),d.add(_);const b=this.terrain.getTerrainHeight(t,e);h.position.set(t,b,e),this.scene.add(h);const x=n?130:100,D={id:`tank_${this.nextId++}`,heavy:n,root:h,hull:d,turret:_,barrel:E,smokeAnchor:new C,pos:new C(t,b,e),hullYaw:Math.PI,turretYaw:Math.PI,hp:x,maxHp:x,destroyed:!1,waypoints:i,waypointIndex:0,cannonCooldown:3.5,mgCooldown:.4,mgBurstCount:0,barrelRecoil:0,smokeTimer:0};return this.tanks.push(D),this.syncHullColliders(),D}getLivingTankCount(){return this.tanks.filter(t=>!t.destroyed).length}getNearestTankDistance(t){let e=1/0;for(const n of this.tanks)if(!n.destroyed){const i=n.pos.distanceTo(t);i<e&&(e=i)}return e}checkProjectileHit(t,e,n){for(const i of this.tanks){const r=i.heavy?1.18:.96,o=t.x-i.pos.x,a=t.z-i.pos.z;if(Math.hypot(o,a)>2.55*r||t.y<i.pos.y||t.y>i.pos.y+2.6*r)continue;if(!e||i.destroyed)return!0;const c=-Math.sin(i.hullYaw),h=-Math.cos(i.hullYaw),d=new Lt(o,a).normalize(),u=c*d.x+h*d.y;let p=70;return u>.45?p=48:u<-.45&&(p=110),i.hp-=p,i.hp<=0&&(this.destroyTank(i),n==null||n(i)),!0}return!1}applyBlastDamage(t,e,n,i){for(const r of this.tanks){if(r.destroyed)continue;const o=r.pos.distanceTo(t);if(o<=e){const a=n*(1-o/e*.5);r.hp-=a,r.hp<=0&&(this.destroyTank(r),i==null||i(r))}}}destroyTank(t){t.destroyed=!0,t.hp=0,t.turret.rotation.z=.24,t.turret.position.y+=.22,t.hull.traverse(e=>{if(e.isMesh){const n=e.material;n&&n.color&&n.color.setHex(2170653)}}),this.vfx.spawnExplosion(t.pos,1.9),this.audio.playExplosion(12,1.35,0)}syncHullColliders(){const t=this.tanks.map(e=>{const n=e.heavy?1.18:.96;return{id:e.id,x:e.pos.x,y:e.pos.y,z:e.pos.z,halfW:1.85*n,halfH:1.5*n,halfL:2.6*n,yaw:e.hullYaw}});this.cover.setTankHulls(t)}update(t,e,n,i,r){const o=new C(e.x,n,e.z);for(const a of this.tanks){if(a.destroyed){a.smokeTimer-=t,a.smokeTimer<=0&&(a.smokeTimer=.28,this.vfx.spawnSprite(new C(a.pos.x,a.pos.y+1.8,a.pos.z),new C((Math.random()-.5)*.6,2.6,(Math.random()-.5)*.6),1973532,1.4,4.2,2.1,.68,-.2));continue}if(a.waypointIndex<a.waypoints.length){const A=a.waypoints[a.waypointIndex],I=A.x-a.pos.x,S=A.z-a.pos.z;if(Math.hypot(I,S)<1.5)a.waypointIndex++;else{const P=Math.atan2(-I,-S),G=Math.atan2(Math.sin(P-a.hullYaw),Math.cos(P-a.hullYaw));a.hullYaw+=ae.clamp(G,-t*.7,t*.7);const F=a.heavy?2.1:2.9;a.pos.x+=-Math.sin(a.hullYaw)*F*t,a.pos.z+=-Math.cos(a.hullYaw)*F*t,this.cover.destroyWiresInRadius(a.pos.x,a.pos.z,2.4),this.cover.damageDestructiblesInRadius(a.pos,2.5,999)}}const l=this.terrain.getTerrainHeight(a.pos.x,a.pos.z),c=-Math.sin(a.hullYaw),h=-Math.cos(a.hullYaw),d=this.terrain.getTerrainHeight(a.pos.x+c*1.8,a.pos.z+h*1.8),u=this.terrain.getTerrainHeight(a.pos.x-c*1.8,a.pos.z-h*1.8);a.pos.y=ae.lerp(a.pos.y,l,Math.min(1,t*8)),a.root.position.copy(a.pos),a.hull.rotation.y=a.hullYaw,a.hull.rotation.x=ae.lerp(a.hull.rotation.x,Math.atan2(d-u,3.6),Math.min(1,t*6));const p=e.x-a.pos.x,g=e.z-a.pos.z,m=Math.atan2(-p,-g)-a.hullYaw,f=a.turret.rotation.y,E=Math.atan2(Math.sin(m-f),Math.cos(m-f));a.turret.rotation.y+=ae.clamp(E,-t*.95,t*.95),a.turretYaw=a.hullYaw+a.turret.rotation.y,a.barrelRecoil=ae.lerp(a.barrelRecoil,0,Math.min(1,t*10));const b=a.heavy?1.18:.96;a.barrel.position.z=-2.1*b+a.barrelRecoil;const x=new C(a.pos.x-Math.sin(a.turretYaw)*3.4*b,a.pos.y+1.65*b,a.pos.z-Math.cos(a.turretYaw)*3.4*b),D=a.pos.distanceTo(e),R=Math.max(-1,Math.min(1,(a.pos.x-e.x)/30));if(a.cannonCooldown-=t,a.cannonCooldown<=0&&D<65){a.cannonCooldown=a.heavy?5.2:6;const A=x.clone(),S=(i>.35?o.clone():new C(e.x+(Math.random()-.5)*4,Math.max(0,e.y+.8),e.z-1.2)).sub(A).normalize(),y=this.cover.raycastWorld(A,S,65,!0),P=y?y.point:A.clone().addScaledVector(S,30);a.barrelRecoil=.45,this.vfx.spawnFlashLight(x,16755268,5.5,.2),this.audio.playGunshot("tankCannon",D,R),r(P,5.5,82,1.9,.65,"Disparo de canhão de tanque")}if(a.mgCooldown-=t,i>.4&&a.mgCooldown<=0&&D<55&&this.cover.hasLineOfSight(x,o)){a.mgCooldown=.11;const A=o.clone().sub(x).normalize(),I=i>.7?.032:.075;A.x+=(Math.random()-.5)*I,A.y+=(Math.random()-.5)*I,A.normalize(),this.projectiles.spawnBullet(x,A,128,16,"enemy"),Math.random()<.4&&this.audio.playGunshot("mg",D,R)}}this.syncHullColliders()}}class vm{constructor(t){T(this,"scene");T(this,"particles",[]);T(this,"lights",[]);T(this,"glowTex");T(this,"debrisGeo",new yt(.14,.12,.18));this.scene=t,this.glowTex=Ki().radialGlow;for(let e=0;e<4;e++){const n=new zs(16751426,0,22,1.7);this.scene.add(n),this.lights.push({light:n,age:1,maxAge:1,maxIntensity:0})}}clear(){for(const t of this.particles)this.scene.remove(t.mesh),t.mesh.material.dispose();this.particles=[];for(const t of this.lights)t.light.intensity=0,t.age=t.maxAge}spawnFlashLight(t,e,n,i){let r=this.lights[0],o=-1;for(const a of this.lights){const l=a.age/a.maxAge;if(l>=1){r=a;break}l>o&&(o=l,r=a)}r.light.position.copy(t),r.light.color.setHex(e),r.light.intensity=n,r.maxIntensity=n,r.age=0,r.maxAge=i}spawnSprite(t,e,n,i,r,o,a=.85,l=0,c=!1){if(this.particles.length>260){const u=this.particles.shift();this.scene.remove(u.mesh),u.mesh.material.dispose()}const h=new wl({map:this.glowTex,color:n,transparent:!0,opacity:a,depthWrite:!1,blending:c?Vi:Hn}),d=new Qp(h);d.position.copy(t),d.scale.set(i,i,1),this.scene.add(d),this.particles.push({mesh:d,isMesh:!1,vel:e.clone(),age:0,maxAge:o,startScale:i,endScale:r,gravity:l,startOpacity:a})}spawnDebrisChunk(t,e,n,i){if(this.particles.length>260){const a=this.particles.shift();this.scene.remove(a.mesh),a.mesh.material.dispose()}const r=new $t({color:n,roughness:.9}),o=new Q(this.debrisGeo,r);o.position.copy(t),o.rotation.set(Math.random()*6,Math.random()*6,Math.random()*6),this.scene.add(o),this.particles.push({mesh:o,isMesh:!0,vel:e.clone(),age:0,maxAge:i,startScale:1,endScale:.7,gravity:17.5,startOpacity:1})}spawnExplosion(t,e=1){this.spawnFlashLight(new C(t.x,t.y+1.2,t.z),16747051,6.5*e,.34),this.spawnSprite(new C(t.x,t.y+.5,t.z),new C(0,2.2*e,0),16751416,1.8*e,5.2*e,.38,.95,-1.5,!0);for(let i=0;i<6;i++){const r=i/6*Math.PI*2+Math.random()*.6,o=(2.5+Math.random()*4.5)*e;this.spawnSprite(new C(t.x,t.y+.35,t.z),new C(Math.cos(r)*o,(4.5+Math.random()*5)*e,Math.sin(r)*o),16739106,1.1*e,2.5*e,.52,.85,8,!0)}for(let i=0;i<5;i++)this.spawnSprite(new C(t.x+(Math.random()-.5)*1.4*e,t.y+.4+Math.random()*.8,t.z+(Math.random()-.5)*1.4*e),new C((Math.random()-.5)*1.6,2.8+Math.random()*2.5,(Math.random()-.5)*1.6),2368032,2.2*e,6.5*e,1.9+Math.random()*.8,.72,-.4,!1);const n=e>1.3?12:7;for(let i=0;i<n;i++){const r=Math.random()*Math.PI*2,o=(2.5+Math.random()*7.5)*e;this.spawnDebrisChunk(new C(t.x,t.y+.3,t.z),new C(Math.cos(r)*o,6.5+Math.random()*7.5*e,Math.sin(r)*o),i%3===0?5389866:3549985,1.1+Math.random()*.6)}}spawnBulletImpact(t,e,n=!1){const i=n?16765562:7035977,r=n?4:3;for(let o=0;o<r;o++){const a=e.clone().multiplyScalar(2.4+Math.random()*2.5).add(new C((Math.random()-.5)*2.6,Math.random()*2,(Math.random()-.5)*2.6));this.spawnSprite(t,a,i,n?.22:.35,n?.05:.9,n?.18:.32,n?.95:.65,n?9:4,n)}}spawnFlakBurst(t){this.spawnSprite(t,new C(0,.2,0),16755268,1.5,4.2,.24,.9,0,!0),this.spawnSprite(t,new C(.4,.6,0),1710618,2.5,7.5,2.8,.78,0,!1)}update(t){for(let e=this.particles.length-1;e>=0;e--){const n=this.particles[e];if(n.age+=t,n.age>=n.maxAge){this.scene.remove(n.mesh),n.mesh.material.dispose(),this.particles.splice(e,1);continue}const i=n.age/n.maxAge;n.vel.y-=n.gravity*t,n.mesh.position.addScaledVector(n.vel,t);const r=ae.lerp(n.startScale,n.endScale,i);if(n.isMesh)n.mesh.scale.setScalar(r),n.mesh.rotation.x+=t*7,n.mesh.rotation.y+=t*5;else{n.mesh.scale.set(r,r,1);const o=n.mesh.material;o.opacity=n.startOpacity*(1-i*i)}}for(const e of this.lights)if(e.age<e.maxAge){e.age+=t;const n=Math.min(1,e.age/e.maxAge);e.light.intensity=e.maxIntensity*(1-n)}else e.light.intensity=0}}function Ts(){return[{id:"ally_west",x1:-34,z1:33,x2:-12,z2:30,width:2.5,depth:1.05,parapetSide:"north",hasSandbags:!0,duckboards:!0,faction:"ally"},{id:"ally_center",x1:-12,z1:30,x2:12,z2:30,width:2.6,depth:1.05,parapetSide:"north",hasSandbags:!0,duckboards:!0,faction:"ally"},{id:"ally_east",x1:12,z1:30,x2:34,z2:33,width:2.5,depth:1.05,parapetSide:"north",hasSandbags:!0,duckboards:!0,faction:"ally"},{id:"ally_comm_sap",x1:0,z1:30,x2:0,z2:40,width:2.1,depth:1.05,parapetSide:"none",hasSandbags:!1,duckboards:!0,faction:"ally"}]}function As(){return[{x:-18,z:18,radius:2.6,depth:.9},{x:-5,z:16,radius:2.9,depth:1},{x:10,z:17,radius:2.5,depth:.85},{x:24,z:14,radius:3.1,depth:1.05},{x:-24,z:6,radius:3.2,depth:1.1},{x:-9,z:4,radius:2.8,depth:.95},{x:5,z:3,radius:3.3,depth:1.15},{x:19,z:1,radius:2.7,depth:.9},{x:-15,z:-8,radius:3,depth:1.05},{x:0,z:-10,radius:3.4,depth:1.2},{x:14,z:-12,radius:2.9,depth:1},{x:-27,z:-16,radius:2.7,depth:.9}]}const ha=[{id:0,code:"OP-01",title:"Alvorada de Aço",subtitle:"Setor Norte • Segurar a Primeira Linha",briefingSummary:"A neblina da madrugada mal se dissipou e batedores confirmam infantaria inimiga cruzando a Terra de Ninguém. Mantenha a cabeça abaixo do parapeito sob fogo cruzado, reaja nas brechas e prepare o lançador antitanque para a vanguarda blindada.",objectivesSummary:["Conter a primeira vaga de infantaria e ninhos de metralhadora","Sobreviver à barragem de artilharia e granadeiros na trincheira","Destruir o tanque leve de escolta e repelir o assalto final"],threatsSummary:["Fogo de supressão e atiradores inimigos — ficar exposto é morte rápida","Granadeiros inimigos lançando explosivos para dentro da trincheira","Tanque Leve rompendo arame farpado na fase final"],fieldTip:"Use [C] para se abaixar completamente dentro da trincheira. Espie com [Q]/[E] ou [Botão Direito] para mirar com precisão. Se sangrar, segure [H] na cobertura.",environment:{skyTop:3880242,skyHorizon:9329979,fogColor:6048831,fogDensity:.0155,ambientColor:10523012,ambientIntensity:1.15,sunColor:16758904,sunIntensity:1.85,sunPosition:[38,22,-45],isNight:!1,hasRain:!1,hasFlak:!1,hasFlares:!0,hasSearchlights:!1},playerSpawn:{x:-2,z:30,yaw:0},trenches:Ts(),dugouts:[{id:"dug_west",x:-16,z:35.5,width:5,depth:4.2,floorY:-1.05,ceilingY:.55,openSide:"north"},{id:"dug_east",x:16,z:35.5,width:5,depth:4.2,floorY:-1.05,ceilingY:.55,openSide:"north"}],ramps:[{id:"ramp_c",x1:0,z1:30,x2:0,z2:26.2,width:2.2,y1:-1.05,y2:0},{id:"ramp_e",x1:22,z1:31.2,x2:22,z2:27.6,width:2,y1:-1.05,y2:0}],initialCraters:As(),ruins:[{x:-14,z:12,w:3.6,h:1.45,d:.7,rotY:.15},{x:13,z:9,w:4.2,h:1.6,d:.75,rotY:-.2},{x:-3,z:-4,w:4.8,h:1.5,d:.8,rotY:.08}],barbedWires:[{x:-18,z:23,len:10,rotY:.08},{x:-2,z:22,len:9,rotY:-.05},{x:16,z:23,len:11,rotY:-.08}],bunkers:[],allyEmplacements:[{id:"ally_mg_1",x:8,y:.35,z:28.9,yaw:0,faction:"ally"}],enemyEmplacements:[{id:"en_mg_1",x:-18,y:.35,z:-26,yaw:Math.PI,faction:"enemy"}],interactables:[{id:"ammo_1",kind:"ammo_crate",x:-6,y:-1.05,z:30.8,label:"[F] Reabastecer Munição e Foguetes",radius:2.4,active:!0},{id:"med_1",kind:"medic_crate",x:5,y:-1.05,z:31.1,label:"[F] Caixa Médica (+Curativos)",radius:2.4,active:!0},{id:"mg_1",kind:"mg_mount",x:8,y:-1.05,z:29.6,label:"[F] Assumir Metralhadora Pesada",radius:2.2,active:!0}],allyCount:7,phases:[{id:"op1_p1",type:"survive_wave",objectiveText:"SEGURE A TRINCHEIRA — PRIMEIRA VAGA",objectiveSubtext:"Elimine a vanguarda inimiga que avança pela neblina",objectiveTarget:{x:0,z:-12},enemiesToSpawn:14,enemyRoles:["rifleman","rifleman","assault"],artilleryRate:12,radioOpening:"Posto 2 na escuta! Vultos na Terra de Ninguém! Abaixo do parapeito!"},{id:"op1_p2",type:"survive_wave",objectiveText:"CONTER O ASSALTO E GRANADEIROS",objectiveSubtext:"Atenção às granadas lançadas para dentro da vala",objectiveTarget:{x:-4,z:-8},enemiesToSpawn:20,enemyRoles:["rifleman","assault","grenadier","rifleman"],artilleryRate:5.5,radioOpening:"Artilharia inimiga ajustando mira! Cuidado com os granadeiros nos flancos!"},{id:"op1_p3",type:"destroy_tanks",objectiveText:"DESTRUA O TANQUE LEVE E A ESCOLTA",objectiveSubtext:"Equipe a Bazuca [3] e acerte a lateral ou traseira do blindado",objectiveTarget:{x:4,z:6},enemiesToSpawn:16,enemyRoles:["assault","rifleman","grenadier"],tanksToSpawn:[{x:4,z:-36,heavy:!1,waypoints:[{x:4,z:-12},{x:2,z:8},{x:6,z:22}]}],artilleryRate:9,radioOpening:"TANQUE À FRENTE! Peguem o lançador antitanque [3]! Fogo pela traseira!"}]},{id:1,code:"OP-02",title:"Mandíbulas de Ferro",subtitle:"Corredor Central • Deter Coluna Blindada",briefingSummary:"Sob chuva fria e lama espessa, uma ponta de lança blindada avança em formação cerrada para esmagar nossas defesas. Use as trincheiras e muros em ruínas para flanquear os tanques com a Bazuca AT-43 enquanto a infantaria tenta cercar você.",objectivesSummary:["Interceptar a primeira ponta blindada na Terra de Ninguém","Destruir todos os 3 Tanques Pesados antes que rompam a retaguarda","Neutralizar a escolta remanescente de infantaria"],threatsSummary:["Canhões de 75mm que destroem sacos de areia e causam surdez/tinnitus","Metralhadoras coaxiais varrendo qualquer soldado em pé por mais de 1 segundo","Infantaria de assalto aproveitando a sombra dos blindados para invadir a vala"],fieldTip:"Tiros de fuzil e SMG ricocheteiam na blindagem. Acerte a traseira vermelha ou as laterais com a Bazuca [3] e recarregue na cobertura!",environment:{skyTop:2830387,skyHorizon:6054758,fogColor:4541261,fogDensity:.0145,ambientColor:9607579,ambientIntensity:1.1,sunColor:13620952,sunIntensity:1.55,sunPosition:[-28,34,-22],isNight:!1,hasRain:!0,hasFlak:!1,hasFlares:!1,hasSearchlights:!1},playerSpawn:{x:4,z:30,yaw:0},trenches:[...Ts(),{id:"forward_crater_sap",x1:-22,z1:12,x2:-10,z2:11,width:2.3,depth:.95,parapetSide:"north",hasSandbags:!0,duckboards:!1,faction:"ally"}],dugouts:[{id:"dug_west",x:-16,z:35.5,width:5,depth:4.2,floorY:-1.05,ceilingY:.55,openSide:"north"},{id:"dug_east",x:16,z:35.5,width:5,depth:4.2,floorY:-1.05,ceilingY:.55,openSide:"north"}],ramps:[{id:"ramp_c",x1:0,z1:30,x2:0,z2:26.2,width:2.2,y1:-1.05,y2:0},{id:"ramp_w",x1:-22,z1:31.2,x2:-22,z2:27.5,width:2.2,y1:-1.05,y2:0}],initialCraters:As(),ruins:[{x:-16,z:16,w:4.4,h:1.7,d:.8,rotY:.25},{x:15,z:15,w:4.6,h:1.7,d:.8,rotY:-.2},{x:0,z:1,w:5,h:1.65,d:.85,rotY:.05},{x:-20,z:-6,w:3.8,h:1.5,d:.75,rotY:-.15},{x:20,z:-8,w:3.8,h:1.5,d:.75,rotY:.18}],barbedWires:[{x:-24,z:22,len:8,rotY:.05},{x:24,z:22,len:8,rotY:-.05}],bunkers:[],allyEmplacements:[],enemyEmplacements:[{id:"en_mg_2a",x:-24,y:.35,z:-28,yaw:Math.PI,faction:"enemy"},{id:"en_mg_2b",x:24,y:.35,z:-28,yaw:Math.PI,faction:"enemy"}],interactables:[{id:"ammo_2w",kind:"ammo_crate",x:-12,y:-1.05,z:30.8,label:"[F] Reabastecer Munição e Foguetes",radius:2.6,active:!0},{id:"ammo_2e",kind:"ammo_crate",x:12,y:-1.05,z:30.8,label:"[F] Reabastecer Munição e Foguetes",radius:2.6,active:!0},{id:"med_2",kind:"medic_crate",x:0,y:-1.05,z:32.8,label:"[F] Caixa Médica (+Curativos)",radius:2.5,active:!0}],allyCount:8,phases:[{id:"op2_p1",type:"destroy_tanks",objectiveText:"DESTRUA O TANQUE DE VANGUARDA",objectiveSubtext:"Acerte os flancos ou retaguarda com a Bazuca [3]",objectiveTarget:{x:-8,z:2},enemiesToSpawn:16,enemyRoles:["rifleman","assault","grenadier"],tanksToSpawn:[{x:-10,z:-38,heavy:!0,waypoints:[{x:-10,z:-8},{x:-8,z:12},{x:-6,z:24}]}],artilleryRate:10,radioOpening:"Blindado pesado rompendo a neblina à esquerda! Segurem as posições!"},{id:"op2_p2",type:"destroy_tanks",objectiveText:"DETENHA A PINÇA BLINDADA (2 TANQUES)",objectiveSubtext:"Reabasteça foguetes nas caixas [F] e elimine os dois tanques",objectiveTarget:{x:8,z:-2},enemiesToSpawn:22,enemyRoles:["assault","rifleman","grenadier","assault"],tanksToSpawn:[{x:-16,z:-42,heavy:!0,waypoints:[{x:-15,z:-10},{x:-12,z:14}]},{x:16,z:-42,heavy:!0,waypoints:[{x:14,z:-8},{x:10,z:16}]}],artilleryRate:7,radioOpening:"DOIS TANQUES PESADOS AVANÇANDO PELOS FLANCOS! Não deixe que cheguem à borda!"},{id:"op2_p3",type:"survive_wave",objectiveText:"LIQUIDE A INFANTARIA DE ASSALTO",objectiveSubtext:"Sem cobertura blindada, eles vêm com tudo sobre a trincheira",objectiveTarget:{x:0,z:5},enemiesToSpawn:14,enemyRoles:["assault","grenadier","assault"],artilleryRate:11,radioOpening:"Blindados abatidos! Mantenham fogo cerrado na infantaria remanescente!"}]},{id:2,code:"OP-03",title:"Céu de Chumbo",subtitle:"Setor Leste • Sobreviver ao Bombardeio Aéreo",briefingSummary:"Esquadrões de bombardeiros pesados foram detectados no radar. Sempre que a sirene soar, corra imediatamente para os Abrigos Subterrâneos (Dugouts) na parede traseira da trincheira — e saia logo após as bombas para impedir que a infantaria invada pelos vãos destruídos.",objectivesSummary:["Sobreviver às vagas de bombardeio aéreo dentro dos Abrigos","Repelir as tropas de choque e blindados após cada bombardeio","Ativar o Rádio de Campo e resistir 25s pelo contra-ataque"],threatsSummary:["Tapete de bombas aéreas — mortal fora do teto reforçado dos Abrigos","Bombardeio abre novas crateras e destrói seus sacos de areia de proteção","Inimigos avançam imediatamente aproveitando a fumaça pós-explosão"],fieldTip:"Procure as placas [ABRIGO] e a luz âmbar dentro da trincheira traseira quando a sirene tocar. Somente o teto de toras salva de uma bomba direta.",environment:{skyTop:3283996,skyHorizon:10173995,fogColor:5385768,fogDensity:.0135,ambientColor:10649977,ambientIntensity:1.05,sunColor:16745303,sunIntensity:1.75,sunPosition:[44,18,-32],isNight:!1,hasRain:!1,hasFlak:!0,hasFlares:!1,hasSearchlights:!1},playerSpawn:{x:0,z:30,yaw:0},trenches:Ts(),dugouts:[{id:"dug_west",x:-16,z:35.5,width:5.2,depth:4.4,floorY:-1.05,ceilingY:.55,openSide:"north"},{id:"dug_east",x:16,z:35.5,width:5.2,depth:4.4,floorY:-1.05,ceilingY:.55,openSide:"north"}],ramps:[{id:"ramp_c",x1:0,z1:30,x2:0,z2:26.2,width:2.2,y1:-1.05,y2:0}],initialCraters:As(),ruins:[{x:-12,z:8,w:3.8,h:1.5,d:.75,rotY:.1},{x:12,z:10,w:3.8,h:1.5,d:.75,rotY:-.15}],barbedWires:[{x:-16,z:23,len:10,rotY:0},{x:16,z:23,len:10,rotY:0}],bunkers:[],allyEmplacements:[{id:"ally_mg_3",x:-8,y:.35,z:28.9,yaw:0,faction:"ally"}],enemyEmplacements:[{id:"en_mg_3",x:18,y:.35,z:-26,yaw:Math.PI,faction:"enemy"}],interactables:[{id:"ammo_3",kind:"ammo_crate",x:-3,y:-1.05,z:31,label:"[F] Reabastecer Munição e Foguetes",radius:2.5,active:!0},{id:"med_3",kind:"medic_crate",x:4,y:-1.05,z:31,label:"[F] Caixa Médica (+Curativos)",radius:2.5,active:!0},{id:"mg_3",kind:"mg_mount",x:-8,y:-1.05,z:29.6,label:"[F] Assumir Metralhadora Pesada",radius:2.2,active:!0},{id:"radio_3",kind:"radio",x:0,y:-1.05,z:38.5,label:"[F] Chamar Contra-Ataque pelo Rádio",radius:2.5,active:!1}],allyCount:7,phases:[{id:"op3_p1",type:"bomber_storm",objectiveText:"ALERTA AÉREO — ABRIGUE-SE DO BOMBARDEIO",objectiveSubtext:"Corra para o ABRIGO subterrâneo antes da passagem dos bombardeiros",objectiveTarget:{x:-16,z:35},bomberWaves:1,enemiesToSpawn:12,enemyRoles:["assault","rifleman"],radioOpening:"SIRENE AÉREA! Bombardeiros no horizonte! Todo mundo para os ABRIGOS!"},{id:"op3_p2",type:"bomber_storm",objectiveText:"SEGUNDA VAGA DE BOMBARDEIO E TANQUE",objectiveSubtext:"Sobreviva às bombas no abrigo e destrua o tanque + assalto seguinte",objectiveTarget:{x:16,z:35},bomberWaves:2,enemiesToSpawn:18,enemyRoles:["assault","grenadier","rifleman"],tanksToSpawn:[{x:0,z:-38,heavy:!1,waypoints:[{x:0,z:-10},{x:2,z:14}]}],radioOpening:"Mais bombardeiros a caminho! Depois deles vem blindado aproveitando as crateras!"},{id:"op3_p3",type:"activate_radio",objectiveText:"ATIVE O RÁDIO DE CAMPO NA VALA TRASEIRA",objectiveSubtext:"Desça pela trincheira central até (Z +38) e pressione [F]",objectiveTarget:{x:0,z:38.5},radioOpening:"Nossas defesas estão em ruínas! Vá até o rádio na sapata traseira e peça apoio!"},{id:"op3_p4",type:"hold_timer",objectiveText:"RESISTA ATÉ O APOIO CHEGAR (25s)",objectiveSubtext:"Segure a linha contra assalto desesperado inimigo",objectiveTarget:{x:0,z:18},durationSeconds:25,enemiesToSpawn:22,enemyRoles:["assault","assault","grenadier","rifleman"],artilleryRate:5,radioOpening:"Sinal confirmado! 25 segundos para nossa artilharia varrer o setor! Aguentem firme!"}]},{id:3,code:"OP-04",title:"Assalto ao Bastião",subtitle:"Setor Ômega (Noite) • Invadir o Bunker Principal",briefingSummary:"É hora de cruzar a Terra de Ninguém sob a escuridão rasgada por sinalizadores e holofotes. Rasteje de cratera em cratera, use granadas e Bazuca para silenciar as casamatas de metralhadora, tome a trincheira inimiga e plante a carga explosiva no Bunker Principal.",objectivesSummary:["Atravessar a Terra de Ninguém usando as crateras como cobertura","Tomar a trincheira avançada e destruir as casamatas + tanque de comando","Plantar a carga explosiva na porta do Bunker Principal e recuar!"],threatsSummary:["Duas casamatas de metralhadora varrendo todo terreno plano sem cobertura","Holofotes e sinalizadores que expõem avanços descuidados","Tanque de Comando guardando o pátio do Bastião"],fieldTip:"Nunca corra em linha reta pelo terreno plano! Mova-se de cratera em cratera agachado, espere a pausa das metralhadoras e destrua as casamatas com a Bazuca [3].",environment:{skyTop:725017,skyHorizon:2500918,fogColor:1580070,fogDensity:.014,ambientColor:6056322,ambientIntensity:.95,sunColor:10269915,sunIntensity:1.05,sunPosition:[-20,36,15],isNight:!0,hasRain:!1,hasFlak:!1,hasFlares:!0,hasSearchlights:!0},playerSpawn:{x:0,z:30,yaw:0},trenches:[...Ts(),{id:"mid_crater_trench",x1:-10,z1:2,x2:10,z2:0,width:2.3,depth:.95,parapetSide:"north",hasSandbags:!0,duckboards:!1,faction:"ally"},{id:"enemy_front_trench",x1:-28,z1:-25,x2:28,z2:-25,width:2.6,depth:1,parapetSide:"south",hasSandbags:!0,duckboards:!0,faction:"enemy"}],dugouts:[{id:"dug_west",x:-16,z:35.5,width:5,depth:4.2,floorY:-1.05,ceilingY:.55,openSide:"north"},{id:"dug_east",x:16,z:35.5,width:5,depth:4.2,floorY:-1.05,ceilingY:.55,openSide:"north"}],ramps:[{id:"ramp_c",x1:0,z1:30,x2:0,z2:26,width:2.6,y1:-1.05,y2:0},{id:"ramp_e",x1:16,z1:30.5,x2:16,z2:26.5,width:2.2,y1:-1.05,y2:0},{id:"ramp_en_c",x1:0,z1:-25,x2:0,z2:-21,width:2.4,y1:-1,y2:0},{id:"ramp_en_b",x1:0,z1:-25,x2:0,z2:-29,width:2.4,y1:-1,y2:0}],initialCraters:[...As(),{x:-7,z:20,radius:3.1,depth:1.15},{x:6,z:14,radius:3.2,depth:1.15},{x:-12,z:-3,radius:3.3,depth:1.2},{x:11,z:-13,radius:3.2,depth:1.15},{x:-4,z:-17,radius:3,depth:1.1}],ruins:[{x:-8,z:10,w:4,h:1.5,d:.75,rotY:.1},{x:9,z:-6,w:4.2,h:1.6,d:.75,rotY:-.14}],barbedWires:[{x:-14,z:-19,len:10,rotY:0},{x:14,z:-19,len:10,rotY:0}],bunkers:[{id:"bunker_mg_w",kind:"bunker_mg",x:-16,z:-31,w:4.6,h:2.4,d:3.8,hp:140},{id:"bunker_mg_e",kind:"bunker_mg",x:16,z:-31,w:4.6,h:2.4,d:3.8,hp:140},{id:"bunker_main",kind:"bunker_main",x:0,z:-37,w:9,h:3.6,d:6.5,hp:9999}],allyEmplacements:[],enemyEmplacements:[{id:"en_mg_w",x:-16,y:1.15,z:-29,yaw:Math.PI,faction:"enemy"},{id:"en_mg_e",x:16,y:1.15,z:-29,yaw:Math.PI,faction:"enemy"}],interactables:[{id:"ammo_4",kind:"ammo_crate",x:-4,y:-1.05,z:30.8,label:"[F] Reabastecer Munição e Foguetes",radius:2.5,active:!0},{id:"med_4",kind:"medic_crate",x:4,y:-1.05,z:30.8,label:"[F] Caixa Médica (+Curativos)",radius:2.5,active:!0},{id:"ammo_4_mid",kind:"ammo_crate",x:0,y:-.95,z:1,label:"[F] Suprimento Avançado (Munição)",radius:2.4,active:!0},{id:"bunker_charge_pt",kind:"bunker_charge",x:0,y:0,z:-33.2,label:"[F] Plantar Carga de Demolição no Bunker",radius:3.2,active:!1}],allyCount:8,phases:[{id:"op4_p1",type:"reach_zone",objectiveText:"CRUZE A TERRA DE NINGUÉM DE CRATERA EM CRATERA",objectiveSubtext:"Chegue ao posto avançado no centro do campo (Z 0)",objectiveTarget:{x:0,z:1},targetZone:{x:0,z:1,radius:7.5},enemiesToSpawn:14,enemyRoles:["rifleman","assault"],artilleryRate:8,radioOpening:"Sinalizadores no alto! Use as crateras e a vala central — não fique em terreno plano!"},{id:"op4_p2",type:"clear_trench",objectiveText:"TOME A TRINCHEIRA INIMIGA E SILENCIE O BASTIÃO",objectiveSubtext:"Destrua o Tanque de Comando e neutralize a guarnição inimiga",objectiveTarget:{x:0,z:-25},enemiesToSpawn:18,enemyRoles:["assault","grenadier","rifleman","officer"],tanksToSpawn:[{x:8,z:-32,heavy:!0,waypoints:[{x:-8,z:-29},{x:10,z:-29}]}],artilleryRate:10,radioOpening:"Invasão! Tomem a trincheira deles e abatam aquele tanque de comando!"},{id:"op4_p3",type:"plant_charge",objectiveText:"PLANTE A CARGA NA ENTRADA DO BUNKER PRINCIPAL",objectiveSubtext:"Aproxime-se do grande bunker de concreto (Z -33) e segure [F]",objectiveTarget:{x:0,z:-33.2},radioOpening:"Caminho limpo até o Bunker! Plante a carga de demolição na porta!"},{id:"op4_p4",type:"detonate_wait",objectiveText:"RECUE PARA A TRINCHEIRA — DETONAÇÃO EM 8s!",objectiveSubtext:"Afaste-se pelo menos 18m do Bunker antes que ele vá pelos ares",objectiveTarget:{x:0,z:-15},durationSeconds:8,radioOpening:"CARGA ARMADA! CORRA PARA TRÁS, VAI EXPLODIR!"}]}];function Fi(s){return ha[s]??ha[0]}const xm={dugout:"ABRIGO SEGURO",sheltered:"EM COBERTURA",peeking:"ESPIANDO",exposed:"EXPOSTO!"};class Mm{constructor(t,e,n,i){T(this,"root");T(this,"callbacks");T(this,"selectedMissionId",0);T(this,"completedMissions",new Set);T(this,"settings");T(this,"menuEl");T(this,"briefingEl");T(this,"pauseEl");T(this,"endEl");T(this,"hudEl");T(this,"vigSuppression");T(this,"vigBlood");T(this,"vigDust");T(this,"damageArcsEl");T(this,"compassStrip");T(this,"compassObjMarker");T(this,"objMainEl");T(this,"objSubEl");T(this,"airRaidEl");T(this,"radioEl");T(this,"reticleEl");T(this,"reticleTop");T(this,"reticleBottom");T(this,"reticleLeft");T(this,"reticleRight");T(this,"hitmarkerEl");T(this,"interactEl");T(this,"actionWrapEl");T(this,"actionLabelEl");T(this,"actionFillEl");T(this,"grenadeWarnEl");T(this,"coverPillEl");T(this,"coverTextEl");T(this,"postureTextEl");T(this,"hpNumEl");T(this,"bleedTagEl");T(this,"hpFillEl");T(this,"bandagesEl");T(this,"weaponNameEl");T(this,"ammoReadoutEl");T(this,"extraAmmoEl");T(this,"slotEls",[]);T(this,"controlsToastEl");this.root=t,this.settings={...e},this.completedMissions=n,this.callbacks=i,this.buildDOM(),this.buildCompassTicks(),this.setScreen("menu")}setCompletedMissions(t){this.completedMissions=t,this.renderOperationsList()}setSelectedMission(t){this.selectedMissionId=t,this.renderOperationsList()}showBriefing(t){this.selectedMissionId=t.id;const e=this.briefingEl.querySelector("#brief-title"),n=this.briefingEl.querySelector("#brief-sub"),i=this.briefingEl.querySelector("#brief-body"),r=this.briefingEl.querySelector("#brief-objs"),o=this.briefingEl.querySelector("#brief-threats"),a=this.briefingEl.querySelector("#brief-tip");e.textContent=`${t.code} — ${t.title}`,n.textContent=t.subtitle,i.textContent=t.briefingSummary,r.innerHTML=t.objectivesSummary.map(l=>`<li>• ${l}</li>`).join(""),o.innerHTML=t.threatsSummary.map(l=>`<li>• ${l}</li>`).join(""),a.textContent=`DICA DE CAMPO: ${t.fieldTip}`,this.setScreen("briefing")}showMissionEnd(t){const e=this.endEl.querySelector("#end-title"),n=this.endEl.querySelector("#end-sub"),i=this.endEl.querySelector("#end-cause-box"),r=this.endEl.querySelector("#end-cause"),o=this.endEl.querySelector("#end-advice"),a=this.endEl.querySelector("#btn-end-next");t.victory?(e.textContent="OBJETIVO CONCLUÍDO",e.setAttribute("style","color: #93cc87"),n.textContent=`${t.missionTitle} — Linha assegurada`,i.classList.add("hidden"),a.classList.toggle("hidden",t.missionId>=3)):(e.textContent="BAIXA EM COMBATE",e.setAttribute("style","color: #ef5343"),n.textContent=`${t.missionTitle} — Você caiu no campo de batalha`,i.classList.remove("hidden"),r.textContent=t.causeOfDeath,o.textContent=t.tacticalAdvice,a.classList.add("hidden"));const l=Math.floor(t.durationSeconds/60),c=Math.floor(t.durationSeconds%60),h=t.shotsFired>0?Math.round(t.shotsHit/t.shotsFired*100):0;this.endEl.querySelector("#stat-time").textContent=`${l}:${c.toString().padStart(2,"0")}`,this.endEl.querySelector("#stat-kills").textContent=String(t.kills),this.endEl.querySelector("#stat-tanks").textContent=String(t.tanksDestroyed),this.endEl.querySelector("#stat-acc").textContent=`${h}%`,this.setScreen(t.victory?"victory":"kia")}setScreen(t){this.menuEl.classList.toggle("hidden",t!=="menu"),this.briefingEl.classList.toggle("hidden",t!=="briefing"),this.pauseEl.classList.toggle("hidden",t!=="paused"),this.endEl.classList.toggle("hidden",t!=="kia"&&t!=="victory"),this.hudEl.classList.toggle("hidden",t!=="playing")}updateHUD(t){this.vigSuppression.style.opacity=String(Math.min(.92,t.suppression*.88));const e=t.hp<45?(45-t.hp)/45:0,n=t.bleeding?Math.max(e,.35+Math.sin(performance.now()*.008)*.16):e*.72;this.vigBlood.style.opacity=String(Math.min(.88,n)),this.vigDust.style.opacity=String(Math.min(.8,t.tinnitus*.75)),this.damageArcsEl.innerHTML=t.damageIndicators.map(p=>{const g=p.angleRad*180/Math.PI,_=Math.max(0,1-p.age/1.35)*p.intensity;return`<div class="damage-arc" style="transform: rotate(${g.toFixed(1)}deg); opacity: ${_.toFixed(2)}"></div>`}).join("");const i=175/(Math.PI*.5),o=(-t.compassYaw*180/Math.PI+360)%360*Math.PI/180,a=170-o*i;if(this.compassStrip.style.transform=`translateX(${a.toFixed(1)}px)`,t.objectiveBearing!==null){let p=t.objectiveBearing-o;for(;p>Math.PI;)p-=Math.PI*2;for(;p<-Math.PI;)p+=Math.PI*2;const g=170+Math.max(-158,Math.min(158,p*i));this.compassObjMarker.style.left=`${g.toFixed(1)}px`,this.compassObjMarker.classList.remove("hidden")}else this.compassObjMarker.classList.add("hidden");this.objMainEl.textContent=t.objectiveText;const l=t.objectiveDistance!==null?` • ${Math.round(t.objectiveDistance)}m`:"";this.objSubEl.textContent=`${t.objectiveSubtext}${l}`,t.airRaidAlert?(this.airRaidEl.textContent=t.airRaidAlert,this.airRaidEl.classList.remove("hidden")):this.airRaidEl.classList.add("hidden"),t.radioCaption?(this.radioEl.textContent=`RÁDIO ALIADO: "${t.radioCaption}"`,this.radioEl.classList.remove("hidden")):this.radioEl.classList.add("hidden");const c=t.adsFactor>.45&&t.weaponId!=="bazooka";this.reticleEl.classList.toggle("hidden",c);const h=Math.round(t.spreadPx);this.reticleTop.style.top=`${-7-h}px`,this.reticleBottom.style.top=`${4+h}px`,this.reticleLeft.style.left=`${-7-h}px`,this.reticleRight.style.left=`${4+h}px`,this.hitmarkerEl.style.opacity=t.hitMarkerTimer>0?"0.95":"0",this.hitmarkerEl.classList.toggle("crit",t.hitMarkerCrit),t.interactPrompt?(this.interactEl.textContent=t.interactPrompt,this.interactEl.classList.remove("hidden")):this.interactEl.classList.add("hidden"),t.actionProgress>0&&t.actionLabel?(this.actionWrapEl.classList.remove("hidden"),this.actionLabelEl.textContent=t.actionLabel,this.actionFillEl.style.width=`${Math.round(t.actionProgress*100)}%`):t.reloadingProgress>0?(this.actionWrapEl.classList.remove("hidden"),this.actionLabelEl.textContent="RECARREGANDO...",this.actionFillEl.style.width=`${Math.round(t.reloadingProgress*100)}%`):t.cookingGrenadeProgress>0?(this.actionWrapEl.classList.remove("hidden"),this.actionLabelEl.textContent="PAVIO DA GRANADA...",this.actionFillEl.style.width=`${Math.round(t.cookingGrenadeProgress*100)}%`):this.actionWrapEl.classList.add("hidden"),t.grenadeWarning?(this.grenadeWarnEl.textContent=`GRANADA PRÓXIMA (${t.grenadeWarning.distance.toFixed(1)}m)`,this.grenadeWarnEl.classList.remove("hidden")):this.grenadeWarnEl.classList.add("hidden"),this.coverPillEl.className=`cover-pill ${t.coverState}`,this.coverTextEl.textContent=xm[t.coverState],this.postureTextEl.textContent=t.mgMounted?"METRALHADORA":t.isCrouching?"AGACHADO":t.isSprinting?"CORRENDO":"EM PÉ";const d=Math.max(0,Math.ceil(t.hp));if(this.hpNumEl.textContent=`${d}`,this.hpFillEl.style.width=`${d}%`,this.hpFillEl.classList.toggle("low",d<38||t.bleeding),this.bleedTagEl.textContent=t.bleeding?"SANGRANDO — SEGURE [H]":"",this.bandagesEl.textContent=`CURATIVOS [H]: ${t.bandages}`,t.mgMounted){this.weaponNameEl.textContent="Metralhadora Pesada M-19";const p=Math.round(t.mgHeat*100);this.ammoReadoutEl.innerHTML=t.mgOverheated?'<span style="color:#ef5343;font-size:1.15rem">SUPERAQUECIDA</span>':`${p}% <span class="ammo-reserve">CALOR</span>`}else this.weaponNameEl.textContent=Bn[t.weaponId].name,t.weaponId==="grenade"?this.ammoReadoutEl.innerHTML=`${t.grenades} <span class="ammo-reserve">UNID.</span>`:this.ammoReadoutEl.innerHTML=`${t.ammoInMag} <span class="ammo-reserve">/ ${t.ammoReserve}</span>`;this.extraAmmoEl.textContent=`GRANADAS [G]: ${t.grenades}  •  FOGUETES: ${t.rockets}`;const u=["rifle","smg","bazooka","grenade"];this.slotEls.forEach((p,g)=>{p.classList.toggle("active",!t.mgMounted&&t.weaponId===u[g])}),this.controlsToastEl.classList.toggle("hidden",!t.showControlsHint)}buildDOM(){this.root.innerHTML=`
      <!-- MAIN MENU / HQ -->
      <div id="screen-menu" class="screen-overlay">
        <div class="hq-layout">
          <div class="brand-block">
            <h1>TERRA DE<br />NINGUÉM</h1>
            <p class="brand-subtitle">
              Sobreviva ao inferno das trincheiras. Cada metro exposto atrai fogo cruzado, canhões de tanque e bombardeios aéreos. Use a lama, as crateras e os abrigos para permanecer vivo.
            </p>
            <div class="survival-rules">
              <div class="survival-rule-row"><span class="rule-tag">COBERTURA</span><span>Abaixe-se com <b>[C]</b> abaixo do parapeito e espie com <b>[Q/E]</b> ou <b>[Botão Direito]</b>.</span></div>
              <div class="survival-rule-row"><span class="rule-tag">BOMBARDEIO</span><span>Ao ouvir a sirene, corra para o <b>ABRIGO</b> subterrâneo na parede traseira.</span></div>
              <div class="survival-rule-row"><span class="rule-tag">ANTITANQUE</span><span>Fuzis ricocheteiam em blindados — use a <b>Bazuca [3]</b> nos flancos ou traseira.</span></div>
              <div class="survival-rule-row"><span class="rule-tag">HEMORRAGIA</span><span>Ferimentos graves sangram até a morte. Segure <b>[H]</b> protegido para estancar.</span></div>
            </div>
            <div class="cta-row">
              <button id="btn-start-campaign" class="btn-primary">Iniciar Operação</button>
              <button id="btn-open-settings-menu" class="btn-secondary">Configurações</button>
            </div>
          </div>

          <div class="operations-panel">
            <div class="panel-heading">
              <span>Teatro de Operações</span>
              <span style="font-family:var(--font-mono);font-size:0.74rem;color:var(--text-secondary)">4 MISSÕES TÁTICAS</span>
            </div>
            <div id="ops-list" class="ops-list"></div>
          </div>
        </div>
      </div>

      <!-- BRIEFING -->
      <div id="screen-briefing" class="screen-overlay centered hidden">
        <div class="dossier-card">
          <h2 id="brief-title">OP-01</h2>
          <div id="brief-sub" class="dossier-sub">Setor</div>
          <p id="brief-body" class="dossier-body"></p>
          <div class="dossier-grid">
            <div class="dossier-box">
              <h3>Objetivos da Missão</h3>
              <ul id="brief-objs"></ul>
            </div>
            <div class="dossier-box">
              <h3>Ameaças Confirmadas</h3>
              <ul id="brief-threats"></ul>
            </div>
          </div>
          <div id="brief-tip" class="dossier-tip"></div>
          <div class="cta-row" style="justify-content:space-between">
            <button id="btn-brief-back" class="btn-secondary">Voltar ao QG</button>
            <button id="btn-enter-battle" class="btn-primary">Entrar na Trincheira</button>
          </div>
        </div>
      </div>

      <!-- PAUSE / SETTINGS -->
      <div id="screen-pause" class="screen-overlay centered hidden">
        <div class="modal-card">
          <h2>Pausa Tática</h2>
          <div class="settings-grid">
            <div class="setting-row">
              <label for="set-sens">Sensibilidade do Mouse</label>
              <input id="set-sens" type="range" min="0.3" max="2.5" step="0.1" value="${this.settings.mouseSensitivity}" />
            </div>
            <div class="setting-row">
              <label for="set-vol">Volume Geral</label>
              <input id="set-vol" type="range" min="0" max="1" step="0.05" value="${this.settings.masterVolume}" />
            </div>
            <div class="setting-row">
              <label for="set-qual">Qualidade Gráfica</label>
              <select id="set-qual">
                <option value="low" ${this.settings.quality==="low"?"selected":""}>Baixa (Sem Sombras)</option>
                <option value="medium" ${this.settings.quality==="medium"?"selected":""}>Média (Recomendada)</option>
                <option value="high" ${this.settings.quality==="high"?"selected":""}>Alta</option>
              </select>
            </div>
          </div>
          <div class="controls-grid">
            <div class="control-pair"><span>Mover / Correr</span><span><kbd>WASD</kbd> <kbd>Shift</kbd></span></div>
            <div class="control-pair"><span>Agachar / Escalar</span><span><kbd>C</kbd> <kbd>Espaço</kbd></span></div>
            <div class="control-pair"><span>Espiar Esq / Dir</span><span><kbd>Q</kbd> <kbd>E</kbd></span></div>
            <div class="control-pair"><span>Atirar / Mirar</span><span><kbd>LMB</kbd> <kbd>RMB</kbd></span></div>
            <div class="control-pair"><span>Armas / Recarregar</span><span><kbd>1-4</kbd> <kbd>R</kbd></span></div>
            <div class="control-pair"><span>Granada / Curativo</span><span><kbd>G</kbd> <kbd>H</kbd></span></div>
            <div class="control-pair"><span>Interagir / Chutar Granada</span><span><kbd>F</kbd></span></div>
            <div class="control-pair"><span>Pausar</span><span><kbd>ESC</kbd></span></div>
          </div>
          <div class="cta-row" style="justify-content:space-between">
            <div style="display:flex;gap:10px">
              <button id="btn-pause-menu" class="btn-secondary">Quartel-General</button>
              <button id="btn-pause-restart" class="btn-secondary">Reiniciar</button>
            </div>
            <button id="btn-pause-resume" class="btn-primary">Voltar ao Combate</button>
          </div>
        </div>
      </div>

      <!-- MISSION END (KIA / VICTORY) -->
      <div id="screen-end" class="screen-overlay centered hidden">
        <div class="modal-card">
          <h2 id="end-title">BAIXA EM COMBATE</h2>
          <div id="end-sub" class="dossier-sub">Relatório</div>
          <div id="end-cause-box" class="dossier-tip" style="border-color:rgba(239,83,67,0.45);background:rgba(168,36,28,0.14)">
            <div style="font-weight:600;margin-bottom:4px">CAUSA DA BAIXA: <span id="end-cause"></span></div>
            <div id="end-advice" style="color:var(--text-secondary);font-size:0.84rem"></div>
          </div>
          <div class="stats-strip tabular">
            <div class="stat-cell"><div class="stat-label">Tempo</div><div id="stat-time" class="stat-value">0:00</div></div>
            <div class="stat-cell"><div class="stat-label">Abates</div><div id="stat-kills" class="stat-value">0</div></div>
            <div class="stat-cell"><div class="stat-label">Blindados</div><div id="stat-tanks" class="stat-value">0</div></div>
            <div class="stat-cell"><div class="stat-label">Precisão</div><div id="stat-acc" class="stat-value">0%</div></div>
          </div>
          <div class="cta-row" style="justify-content:space-between">
            <button id="btn-end-menu" class="btn-secondary">Voltar ao QG</button>
            <div style="display:flex;gap:10px">
              <button id="btn-end-retry" class="btn-secondary">Tentar Novamente</button>
              <button id="btn-end-next" class="btn-primary hidden">Próxima Operação</button>
            </div>
          </div>
        </div>
      </div>

      <!-- IN-GAME HUD -->
      <div id="hud-root" class="hud-root hidden">
        <div id="vig-sup" class="vignette-suppression"></div>
        <div id="vig-blood" class="vignette-blood"></div>
        <div id="vig-dust" class="vignette-dust"></div>
        <div id="damage-arcs" class="damage-arcs-layer"></div>

        <div id="controls-toast" class="controls-toast">
          [WASD] Mover • [C] Agachar • [Q/E] Espiar • [Espaço] Escalar<br />
          [1] Fuzil • [2] SMG • [3] Bazuca • [G] Granada • [H] Curativo • [F] Interagir
        </div>

        <div class="hud-top">
          <div class="compass-bar">
            <div id="compass-strip" class="compass-strip"></div>
            <div id="compass-obj" class="compass-obj-marker"></div>
            <div class="compass-needle"></div>
          </div>
          <div class="objective-banner">
            <div id="hud-obj-main" class="objective-main">OBJETIVO</div>
            <div id="hud-obj-sub" class="objective-sub">...</div>
          </div>
          <div id="hud-air-raid" class="air-raid-banner hidden">ALERTA AÉREO</div>
        </div>

        <div id="hud-radio" class="radio-caption hidden"></div>

        <div id="hud-reticle" class="reticle">
          <div id="ret-t" class="reticle-tick reticle-top"></div>
          <div id="ret-b" class="reticle-tick reticle-bottom"></div>
          <div id="ret-l" class="reticle-tick reticle-left"></div>
          <div id="ret-r" class="reticle-tick reticle-right"></div>
        </div>
        <div id="hud-hitmarker" class="hitmarker"></div>

        <div id="hud-grenade-warn" class="grenade-warning hidden"></div>
        <div id="hud-action-wrap" class="action-progress-wrap hidden">
          <div id="hud-action-label" class="action-progress-label">...</div>
          <div class="action-progress-track"><div id="hud-action-fill" class="action-progress-fill"></div></div>
        </div>
        <div id="hud-interact" class="interact-prompt hidden"></div>

        <div class="hud-bottom-left">
          <div id="hud-cover-pill" class="cover-pill sheltered">
            <span class="cover-dot"></span>
            <span id="hud-cover-text" class="cover-text">EM COBERTURA</span>
            <span id="hud-posture-text" class="posture-sub">EM PÉ</span>
          </div>
          <div class="vitals-box tabular">
            <div class="vitals-row">
              <span id="hud-hp-num" class="hp-num">100</span>
              <span id="hud-bleed-tag" class="bleed-tag"></span>
            </div>
            <div class="hp-track"><div id="hud-hp-fill" class="hp-fill" style="width:100%"></div></div>
            <div class="bandage-row">
              <span id="hud-bandages">CURATIVOS [H]: 3</span>
            </div>
          </div>
        </div>

        <div class="hud-bottom-right tabular">
          <div class="weapon-panel">
            <div id="hud-weapon-name" class="weapon-name">Fuzil M-42</div>
            <div id="hud-ammo-readout" class="ammo-readout">8 <span class="ammo-reserve">/ 56</span></div>
            <div id="hud-extra-ammo" style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-secondary);margin-top:4px">
              GRANADAS [G]: 3 • FOGUETES: 5
            </div>
          </div>
          <div class="weapon-slots">
            <div class="slot-chip active">[1] Fuzil</div>
            <div class="slot-chip">[2] SMG</div>
            <div class="slot-chip">[3] Bazuca</div>
            <div class="slot-chip">[4] Granada</div>
          </div>
        </div>
      </div>
    `,this.menuEl=this.root.querySelector("#screen-menu"),this.briefingEl=this.root.querySelector("#screen-briefing"),this.pauseEl=this.root.querySelector("#screen-pause"),this.endEl=this.root.querySelector("#screen-end"),this.hudEl=this.root.querySelector("#hud-root"),this.vigSuppression=this.root.querySelector("#vig-sup"),this.vigBlood=this.root.querySelector("#vig-blood"),this.vigDust=this.root.querySelector("#vig-dust"),this.damageArcsEl=this.root.querySelector("#damage-arcs"),this.compassStrip=this.root.querySelector("#compass-strip"),this.compassObjMarker=this.root.querySelector("#compass-obj"),this.objMainEl=this.root.querySelector("#hud-obj-main"),this.objSubEl=this.root.querySelector("#hud-obj-sub"),this.airRaidEl=this.root.querySelector("#hud-air-raid"),this.radioEl=this.root.querySelector("#hud-radio"),this.reticleEl=this.root.querySelector("#hud-reticle"),this.reticleTop=this.root.querySelector("#ret-t"),this.reticleBottom=this.root.querySelector("#ret-b"),this.reticleLeft=this.root.querySelector("#ret-l"),this.reticleRight=this.root.querySelector("#ret-r"),this.hitmarkerEl=this.root.querySelector("#hud-hitmarker"),this.interactEl=this.root.querySelector("#hud-interact"),this.actionWrapEl=this.root.querySelector("#hud-action-wrap"),this.actionLabelEl=this.root.querySelector("#hud-action-label"),this.actionFillEl=this.root.querySelector("#hud-action-fill"),this.grenadeWarnEl=this.root.querySelector("#hud-grenade-warn"),this.coverPillEl=this.root.querySelector("#hud-cover-pill"),this.coverTextEl=this.root.querySelector("#hud-cover-text"),this.postureTextEl=this.root.querySelector("#hud-posture-text"),this.hpNumEl=this.root.querySelector("#hud-hp-num"),this.bleedTagEl=this.root.querySelector("#hud-bleed-tag"),this.hpFillEl=this.root.querySelector("#hud-hp-fill"),this.bandagesEl=this.root.querySelector("#hud-bandages"),this.weaponNameEl=this.root.querySelector("#hud-weapon-name"),this.ammoReadoutEl=this.root.querySelector("#hud-ammo-readout"),this.extraAmmoEl=this.root.querySelector("#hud-extra-ammo"),this.slotEls=Array.from(this.root.querySelectorAll(".slot-chip")),this.controlsToastEl=this.root.querySelector("#controls-toast"),this.renderOperationsList(),this.bindButtonEvents()}renderOperationsList(){const t=this.root.querySelector("#ops-list");t.innerHTML=ha.map(e=>{const n=this.completedMissions.has(e.id);return`
        <button class="op-item ${this.selectedMissionId===e.id?"selected":""}" data-op="${e.id}">
          <div class="op-top">
            <span class="op-title">${e.code} — ${e.title}</span>
            <span class="op-badge ${n?"done":""}">${n?"CONCLUÍDA":"DISPONÍVEL"}</span>
          </div>
          <div class="op-desc">${e.subtitle}</div>
        </button>
      `}).join(""),t.querySelectorAll(".op-item").forEach(e=>{e.addEventListener("click",()=>{const n=Number(e.dataset.op);this.selectedMissionId=n,this.callbacks.onSelectMission(n),this.renderOperationsList()})})}buildCompassTicks(){const t=[[0,"N",!0],[45,"NE",!1],[90,"L",!0],[135,"SE",!1],[180,"S",!0],[225,"SO",!1],[270,"O",!0],[315,"NO",!1]],e=175/(Math.PI*.5),n=[];for(const i of[-360,0,360])for(const[r,o,a]of t){const c=(r+i)*Math.PI/180*e;n.push(`<span class="compass-tick ${a?"cardinal":""}" style="left:${c.toFixed(1)}px">${o}</span>`)}this.compassStrip.innerHTML=n.join("")}bindButtonEvents(){this.root.querySelector("#btn-start-campaign").addEventListener("click",()=>{this.callbacks.onStartMissionBriefing()}),this.root.querySelector("#btn-open-settings-menu").addEventListener("click",()=>{this.setScreen("paused")}),this.root.querySelector("#btn-brief-back").addEventListener("click",()=>{this.setScreen("menu")}),this.root.querySelector("#btn-enter-battle").addEventListener("click",()=>{this.callbacks.onEnterBattle()}),this.root.querySelector("#btn-pause-resume").addEventListener("click",()=>{this.callbacks.onResumeBattle()}),this.root.querySelector("#btn-pause-restart").addEventListener("click",()=>{this.callbacks.onRestartMission()}),this.root.querySelector("#btn-pause-menu").addEventListener("click",()=>{this.callbacks.onReturnToMenu()}),this.root.querySelector("#btn-end-menu").addEventListener("click",()=>{this.callbacks.onReturnToMenu()}),this.root.querySelector("#btn-end-retry").addEventListener("click",()=>{this.callbacks.onRestartMission()}),this.root.querySelector("#btn-end-next").addEventListener("click",()=>{this.callbacks.onNextMission()});const t=this.root.querySelector("#set-sens"),e=this.root.querySelector("#set-vol"),n=this.root.querySelector("#set-qual"),i=()=>{this.settings={mouseSensitivity:parseFloat(t.value),masterVolume:parseFloat(e.value),quality:n.value},this.callbacks.onSettingsChanged(this.settings)};t.addEventListener("input",i),e.addEventListener("input",i),n.addEventListener("change",i)}}class ym{constructor(t){T(this,"terrain");T(this,"boxes",[]);T(this,"destructibles",new Map);T(this,"tankHulls",[]);T(this,"wireHazards",[]);this.terrain=t}clear(){this.boxes=[],this.destructibles.clear(),this.tankHulls=[],this.wireHazards=[]}addStaticBox(t){this.boxes.push(t)}registerDestructible(t,e){if(this.destructibles.set(t.id,{...t,mesh:e}),t.blocksBullets||t.blocksMovement||t.blocksSight){const n=t.rotationY??0,i=Math.abs(Math.cos(n)),r=Math.abs(Math.sin(n)),o=t.width*i+t.depth*r,a=t.width*r+t.depth*i;this.boxes.push({id:`col_${t.id}`,minX:t.x-o*.5,maxX:t.x+o*.5,minY:t.y,maxY:t.y+t.height,minZ:t.z-a*.5,maxZ:t.z+a*.5,blocksBullets:t.blocksBullets,blocksMovement:t.blocksMovement,blocksSight:t.blocksSight,destructibleId:t.id})}}addWireHazard(t){this.wireHazards.push(t)}setTankHulls(t){this.tankHulls=t}damageDestructible(t,e,n){const i=this.destructibles.get(t);if(!i||i.hp<=0)return!1;if(i.hp-=e,i.hp<=0){i.hp=0,i.mesh&&(i.mesh.visible=!1),this.boxes=this.boxes.filter(r=>r.destructibleId!==t);for(const r of this.wireHazards)r.id===t&&(r.active=!1);return n==null||n(i),!0}return!1}damageDestructiblesInRadius(t,e,n,i){for(const[r,o]of this.destructibles.entries()){if(o.hp<=0||o.kind==="bunker_main")continue;const a=Math.hypot(o.x-t.x,o.z-t.z);if(a<=e){const l=1-a/e*.45;this.damageDestructible(r,n*l,i)}}}destroyWiresInRadius(t,e,n,i){for(const r of this.wireHazards)r.active&&Math.hypot(r.x-t,r.z-e)<=n+r.halfLen*.4&&this.damageDestructible(r.id,9999,o=>i==null?void 0:i(o.id))}isPointInWireHazard(t,e){for(const n of this.wireHazards){if(!n.active)continue;const i=t-n.x,r=e-n.z,o=Math.cos(-n.rotY),a=Math.sin(-n.rotY),l=i*o-r*a,c=i*a+r*o;if(Math.abs(l)<=n.halfLen&&Math.abs(c)<=.72)return!0}return!1}resolvePlayerMovement(t,e,n,i){const o=this.terrain.getWorldBounds();let a=Math.max(o.minX,Math.min(o.maxX,t.x+e)),l=Math.max(o.minZ,Math.min(o.maxZ,t.z+n));const c=this.terrain.getTerrainHeight(t.x,t.z);let h=this.terrain.getTerrainHeight(a,l),d=!1;const u=h-c;if(u>.56&&!i){const m=this.terrain.getTerrainHeight(a,t.z),f=this.terrain.getTerrainHeight(t.x,l);m-c<=.56?(l=t.z,h=m):f-c<=.56?(a=t.x,h=f):(a=t.x,l=t.z,h=c)}else u>.45&&i&&(d=!0);const p=h+.25,g=h+1.55;for(const m of this.boxes){if(!m.blocksMovement||g<=m.minY||p>=m.maxY)continue;const f=Math.max(m.minX,Math.min(a,m.maxX)),E=Math.max(m.minZ,Math.min(l,m.maxZ)),b=a-f,x=l-E,D=b*b+x*x;if(D<.36*.36){const R=Math.sqrt(D);if(R>1e-4){const A=.36-R;a+=b/R*A,l+=x/R*A}else{const A=Math.abs(a-m.minX),I=Math.abs(m.maxX-a),S=Math.abs(l-m.minZ),y=Math.abs(m.maxZ-l),P=Math.min(A,I,S,y);P===A?a=m.minX-.36:P===I?a=m.maxX+.36:P===S?l=m.minZ-.36:l=m.maxZ+.36}}}for(const m of this.tankHulls){const f=m.halfW+.36,E=a-m.x,b=l-m.z,x=E*E+b*b;if(x<f*f){const D=Math.max(.001,Math.sqrt(x));a=m.x+E/D*f,l=m.z+b/D*f}}const _=this.terrain.getTerrainHeight(a,l);return{x:a,y:_,z:l,mantled:d}}evaluatePlayerCover(t,e,n,i){const r=this.isPointInWireHazard(t.x,t.z);if(this.terrain.getDugoutAt(t.x,t.z))return{state:"dugout",exposure:0,overheadProtected:!0,inWireHazard:r};const a=[0,-.45,.45];let l=0;for(const u of a){const p=new C(Math.sin(u),0,-Math.cos(u)),g=this.terrain.getTerrainHeight(t.x+p.x*1.1,t.z+p.z*1.1),_=this.terrain.getTerrainHeight(t.x+p.x*2,t.z+p.z*2),m=Math.max(g,_);if(e<=m+.06){l++;continue}const f=new C(t.x,e-.14,t.z),E=this.raycastWorld(f,p,3.2,!1);E&&E.distance<3.1&&l++}const h=this.terrain.getTerrainHeight(t.x,t.z)<-.42;if(l>=2)return{state:"sheltered",exposure:.04,overheadProtected:!1,inWireHazard:r};if(h||l===1)return{state:"peeking",exposure:n?.25:.48,overheadProtected:!1,inWireHazard:r};let d=n?.72:1;return i&&(d=1),{state:"exposed",exposure:d,overheadProtected:!1,inWireHazard:r}}raycastWorld(t,e,n,i=!0){let r=n,o=null;for(const a of this.boxes){if(!a.blocksBullets)continue;const l=this.intersectRayAABB(t,e,a,r);l&&l.distance<r&&(r=l.distance,o={point:l.point,normal:l.normal,distance:l.distance,hitType:a.destructibleId?"destructible":"obstacle",destructibleId:a.destructibleId})}if(i){let l=0,c=t.y-this.terrain.getTerrainHeight(t.x,t.z);for(let h=.6;h<=r;h+=.6){const d=t.x+e.x*h,u=t.y+e.y*h,p=t.z+e.z*h,g=this.terrain.getTerrainHeight(d,p),_=u-g;if(_<=0&&c>0){let m=l,f=h;for(let b=0;b<5;b++){const x=(m+f)*.5,D=t.x+e.x*x,R=t.y+e.y*x,A=t.z+e.z*x;R<=this.terrain.getTerrainHeight(D,A)?f=x:m=x}const E=f;if(E<r){const b=t.x+e.x*E,x=t.y+e.y*E,D=t.z+e.z*E,R=.25,A=this.terrain.getTerrainHeight(b-R,D)-this.terrain.getTerrainHeight(b+R,D),I=this.terrain.getTerrainHeight(b,D-R)-this.terrain.getTerrainHeight(b,D+R),S=new C(A,2*R,I).normalize();r=E,o={point:new C(b,x,D),normal:S,distance:E,hitType:"terrain"}}break}l=h,c=_}}return o}hasLineOfSight(t,e){const n=new C().subVectors(e,t),i=n.length();if(i<.1)return!0;const r=n.divideScalar(i);return this.raycastWorld(t,r,i-.15,!0)===null}intersectRayAABB(t,e,n,i){const r=e.x!==0?1/e.x:1e9,o=e.y!==0?1/e.y:1e9,a=e.z!==0?1/e.z:1e9,l=(n.minX-t.x)*r,c=(n.maxX-t.x)*r,h=(n.minY-t.y)*o,d=(n.maxY-t.y)*o,u=(n.minZ-t.z)*a,p=(n.maxZ-t.z)*a,g=Math.min(l,c),_=Math.max(l,c),m=Math.min(h,d),f=Math.max(h,d),E=Math.min(u,p),b=Math.max(u,p),x=Math.max(g,m,E),D=Math.min(_,f,b);if(D<0||x>D||x>i)return null;const R=x>=0?x:D;if(R>i||R<.02)return null;const A=new C(0,1,0);x===g?A.set(e.x>0?-1:1,0,0):x===m?A.set(0,e.y>0?-1:1,0):A.set(0,0,e.z>0?-1:1);const I=t.clone().addScaledVector(e,R);return{distance:R,point:I,normal:A}}}class Sm{constructor(t,e,n){T(this,"scene");T(this,"terrain");T(this,"cover");T(this,"rootGroup",new Jt);T(this,"animatedProps",[]);T(this,"interactableMeshes",new Map);T(this,"mgBarrelMeshes",new Map);T(this,"bunkerMainGroup",null);T(this,"sunLight",null);T(this,"hemiLight",null);T(this,"skyMesh",null);T(this,"rainPoints",null);this.scene=t,this.terrain=e,this.cover=n,this.scene.add(this.rootGroup)}clear(){for(this.cover.clear(),this.animatedProps=[],this.interactableMeshes.clear(),this.mgBarrelMeshes.clear(),this.bunkerMainGroup=null,this.rainPoints=null;this.rootGroup.children.length>0;){const t=this.rootGroup.children[0];this.rootGroup.remove(t),t.traverse(e=>{e.geometry&&e.geometry.dispose();const n=e.material;Array.isArray(n)?n.forEach(i=>i.dispose()):n&&n.dispose()})}}buildMission(t,e){this.clear();const n=t.environment;if(this.scene.fog=new ya(n.fogColor,n.fogDensity),this.scene.background=new Ft(n.skyHorizon),this.buildSkyDome(n.skyTop,n.skyHorizon),this.hemiLight=new em(n.ambientColor,2498071,n.ambientIntensity),this.rootGroup.add(this.hemiLight),this.sunLight=new sm(n.sunColor,n.sunIntensity),this.sunLight.position.set(...n.sunPosition),e!=="low"){this.sunLight.castShadow=!0;const c=e==="high"?2048:1024;this.sunLight.shadow.mapSize.set(c,c),this.sunLight.shadow.camera.near=5,this.sunLight.shadow.camera.far=145,this.sunLight.shadow.camera.left=-56,this.sunLight.shadow.camera.right=56,this.sunLight.shadow.camera.top=56,this.sunLight.shadow.camera.bottom=-56,this.sunLight.shadow.bias=-8e-4}this.rootGroup.add(this.sunLight);const i=Ki(),r=new $t({map:i.timber,roughness:.9,metalness:.05}),o=new $t({map:i.sandbag,roughness:.96,metalness:.02}),a=new $t({map:i.concrete,roughness:.92,metalness:.06}),l=new $t({map:i.armorSteel,roughness:.65,metalness:.45});this.buildTrenches(t,r,o),this.buildDugouts(t,r,o);for(let c=0;c<t.ruins.length;c++){const h=t.ruins[c],d=this.terrain.getTerrainHeight(h.x,h.z),u=new yt(h.w,h.h,h.d),p=new Q(u,a);p.position.set(h.x,d+h.h*.45,h.z),p.rotation.y=h.rotY,p.castShadow=!0,p.receiveShadow=!0,this.rootGroup.add(p);const g={id:`ruin_${c}`,kind:"ruin",x:h.x,y:d,z:h.z,width:h.w,height:h.h,depth:h.d,hp:260,maxHp:260,blocksBullets:!0,blocksMovement:!0,blocksSight:!0,rotationY:h.rotY};this.cover.registerDestructible(g,p)}this.buildBarbedWires(t,r,l),this.buildBunkers(t,a,l);for(const c of[...t.allyEmplacements,...t.enemyEmplacements]){const h=this.buildHeavyMGProp(c.x,c.y,c.z,c.yaw,l);this.rootGroup.add(h),this.mgBarrelMeshes.set(c.id,h)}this.buildInteractables(t,i,r),this.buildBattlefieldAtmosphereProps(r,l),n.hasRain&&this.buildRain(),n.hasFlares&&this.buildFlares(n.isNight),n.hasSearchlights&&this.buildSearchlights()}buildSkyDome(t,e){const n=new Je(170,24,16),i=new fn({side:we,depthWrite:!1,uniforms:{uTop:{value:new Ft(t)},uHorizon:{value:new Ft(e)}},vertexShader:`
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
        uniform vec3 uTop;
        uniform vec3 uHorizon;
        varying vec3 vWorldPos;
        void main() {
          float h = clamp(normalize(vWorldPos).y * 1.45, 0.0, 1.0);
          gl_FragColor = vec4(mix(uHorizon, uTop, pow(h, 0.72)), 1.0);
        }
      `});this.skyMesh=new Q(n,i),this.rootGroup.add(this.skyMesh)}buildTrenches(t,e,n){let i=0;for(const r of t.trenches){const o=r.x2-r.x1,a=r.z2-r.z1,l=Math.hypot(o,a),c=Math.atan2(o,a);if(r.duckboards){const p=Math.max(2,Math.floor(l/1.4));for(let g=0;g<p;g++){const _=(g+.5)/p,m=r.x1+o*_,f=r.z1+a*_,E=this.terrain.getTerrainHeight(m,f),b=new Q(new yt(r.width*.52,.06,1.25),e);b.position.set(m,E+.03,f),b.rotation.y=c,b.receiveShadow=!0,this.rootGroup.add(b)}}const h=Math.max(3,Math.floor(l/2.2)),d=Math.cos(c),u=-Math.sin(c);for(let p=0;p<=h;p++){const g=p/h,_=r.x1+o*g,m=r.z1+a*g;for(const f of[-1,1]){const E=_+d*(r.width*.52)*f,b=m+u*(r.width*.52)*f,x=this.terrain.getTerrainHeight(E,b),D=new Q(new yt(.14,1.35,.14),e);D.position.set(E,x+.35,b),D.castShadow=!0,this.rootGroup.add(D)}}if(r.hasSandbags&&r.parapetSide!=="none"){const p=Math.max(2,Math.floor(l/2.3));for(let g=0;g<p;g++){if(p>5&&g%4===2)continue;const _=(g+.5)/p,m=r.x1+o*_,f=r.z1+a*_+(r.parapetSide==="north"?-r.width*.64:r.width*.64),E=this.terrain.getTerrainHeight(m,f),b=new Jt;b.position.set(m,E,f),b.rotation.y=Math.atan2(a,-o);for(let D=0;D<2;D++)for(let R=-1;R<=1;R++){const A=new Q(new yt(.68,.24,.44),n);A.position.set(R*.68+D%2*.12,.12+D*.22,D%2*.04),A.castShadow=!0,A.receiveShadow=!0,b.add(A)}this.rootGroup.add(b);const x={id:`sandbag_${i++}`,kind:"sandbag",x:m,y:E-.1,z:f,width:2.1,height:.62,depth:.56,hp:90,maxHp:90,blocksBullets:!0,blocksMovement:!1,blocksSight:!1};this.cover.registerDestructible(x,b)}}}}buildDugouts(t,e,n){for(const i of t.dugouts){const r=new Jt,o=i.ceilingY-i.floorY,a=new Q(new yt(i.width+.8,.42,i.depth+.6),e);a.position.set(i.x,i.ceilingY+.21,i.z),a.castShadow=!0,a.receiveShadow=!0,r.add(a);const l=new Q(new yt(i.width+.4,.26,i.depth+.2),n);l.position.set(i.x,i.ceilingY+.54,i.z),l.castShadow=!0,l.receiveShadow=!0,r.add(l);for(const E of[-1,1]){const b=i.x+E*(i.width*.5),x=new Q(new yt(.45,o,i.depth),e);x.position.set(b,i.floorY+o*.5,i.z),x.castShadow=!0,x.receiveShadow=!0,r.add(x),this.cover.addStaticBox({id:`${i.id}_wall_${E}`,minX:b-.24,maxX:b+.24,minY:i.floorY,maxY:i.ceilingY+.4,minZ:i.z-i.depth*.5,maxZ:i.z+i.depth*.5,blocksBullets:!0,blocksMovement:!0,blocksSight:!0})}const c=i.openSide==="north"?i.z+i.depth*.5:i.z-i.depth*.5,h=new Q(new yt(i.width+.5,o,.45),e);h.position.set(i.x,i.floorY+o*.5,c),h.castShadow=!0,h.receiveShadow=!0,r.add(h),this.cover.addStaticBox({id:`${i.id}_back`,minX:i.x-i.width*.5-.2,maxX:i.x+i.width*.5+.2,minY:i.floorY,maxY:i.ceilingY+.4,minZ:c-.24,maxZ:c+.24,blocksBullets:!0,blocksMovement:!0,blocksSight:!0}),this.cover.addStaticBox({id:`${i.id}_roof`,minX:i.x-i.width*.55,maxX:i.x+i.width*.55,minY:i.ceilingY,maxY:i.ceilingY+.65,minZ:i.z-i.depth*.55,maxZ:i.z+i.depth*.55,blocksBullets:!0,blocksMovement:!1,blocksSight:!0});const d=new zs(16755268,2.2,8.5,1.8);d.position.set(i.x,i.ceilingY-.22,i.z),r.add(d);const u=new Q(new Je(.09,8,8),new Re({color:16764023}));u.position.copy(d.position),r.add(u);const p=document.createElement("canvas");p.width=256,p.height=64;const g=p.getContext("2d");g&&(g.fillStyle="#2d2318",g.fillRect(0,0,256,64),g.strokeStyle="#d49b38",g.lineWidth=4,g.strokeRect(4,4,248,56),g.fillStyle="#f2dec0",g.font="bold 34px Oswald, sans-serif",g.textAlign="center",g.textBaseline="middle",g.fillText("ABRIGO",128,34));const _=new Sa(p);_.colorSpace=be;const m=new Q(new qn(1.5,.38),new Re({map:_})),f=i.openSide==="north"?i.z-i.depth*.5-.32:i.z+i.depth*.5+.32;m.position.set(i.x,i.ceilingY+.22,f),i.openSide==="south"&&(m.rotation.y=Math.PI),r.add(m),this.animatedProps.push({update:(E,b)=>{d.intensity=2+Math.sin(b*9.5+i.x)*.22}}),this.rootGroup.add(r)}}buildBarbedWires(t,e,n){for(let i=0;i<t.barbedWires.length;i++){const r=t.barbedWires[i],o=this.terrain.getTerrainHeight(r.x,r.z),a=new Jt;a.position.set(r.x,o,r.z),a.rotation.y=r.rotY;const l=Math.max(3,Math.floor(r.len/2.2));for(let h=0;h<l;h++){const d=-r.len*.5+h/(l-1)*r.len;for(const u of[-.45,.45]){const p=new Q(new yt(.08,1.05,.08),e);p.position.set(d,.4,0),p.rotation.x=u,p.castShadow=!0,a.add(p)}}for(let h=0;h<Math.floor(r.len*1.3);h++){const d=-r.len*.48+h/Math.max(1,Math.floor(r.len*1.3)-1)*r.len*.96,u=new Q(new wa(.36,.022,5,10),n);u.position.set(d,.42,(h%2===0?1:-1)*.08),u.rotation.y=Math.PI*.5+h%3*.2,a.add(u)}this.rootGroup.add(a);const c=`wire_${i}`;this.cover.registerDestructible({id:c,kind:"wire",x:r.x,y:o,z:r.z,width:r.len,height:.85,depth:1,hp:75,maxHp:75,blocksBullets:!1,blocksMovement:!1,blocksSight:!1,rotationY:r.rotY},a),this.cover.addWireHazard({id:c,x:r.x,z:r.z,halfLen:r.len*.5,rotY:r.rotY,active:!0})}}buildBunkers(t,e,n){for(const i of t.bunkers){const r=this.terrain.getTerrainHeight(i.x,i.z),o=new Jt;o.position.set(i.x,r,i.z);const a=new Q(new yt(i.w,i.h,i.d),e);a.position.y=i.h*.5,a.castShadow=!0,a.receiveShadow=!0,o.add(a);const l=new Q(new yt(i.w+.5,.45,i.d+.5),e);l.position.y=i.h+.15,l.castShadow=!0,o.add(l);const c=new Q(new yt(i.w*.52,.34,.3),new Re({color:657929}));if(c.position.set(0,i.h*.54,i.d*.5+.02),o.add(c),i.kind==="bunker_main"){const h=new Q(new yt(1.4,2,.25),n);h.position.set(0,1,i.d*.5+.04),o.add(h),this.bunkerMainGroup=o}this.rootGroup.add(o),this.cover.registerDestructible({id:i.id,kind:i.kind,x:i.x,y:r,z:i.z,width:i.w,height:i.h+.4,depth:i.d,hp:i.hp,maxHp:i.hp,blocksBullets:!0,blocksMovement:!0,blocksSight:!0},o)}}buildHeavyMGProp(t,e,n,i,r){const o=new Jt;o.position.set(t,e,n),o.rotation.y=i;const a=new Q(new _e(.12,.36,.55,6),r);a.position.y=-.25,o.add(a);const l=new Q(new yt(.18,.18,.65),r);l.position.set(0,.08,-.05),o.add(l);const c=new Q(new _e(.045,.055,.85,8),r);c.rotation.x=Math.PI*.5,c.position.set(0,.1,-.58),o.add(c);const h=new Q(new yt(.55,.36,.04),r);return h.position.set(0,.12,-.32),o.add(h),o}buildInteractables(t,e,n){for(const i of t.interactables){const r=this.terrain.getTerrainHeight(i.x,i.z),o=new Jt;if(o.position.set(i.x,r,i.z),i.kind==="ammo_crate"){const a=new Q(new yt(.95,.55,.62),new $t({map:e.crateAmmo,roughness:.85}));a.position.y=.275,a.castShadow=!0,a.receiveShadow=!0,o.add(a)}else if(i.kind==="medic_crate"){const a=new Q(new yt(.82,.52,.58),new $t({map:e.crateMedic,roughness:.85}));a.position.y=.26,a.castShadow=!0,o.add(a)}else if(i.kind==="radio"){const a=new Q(new yt(.9,.72,.55),n);a.position.y=.36,o.add(a);const l=new Q(new yt(.55,.38,.38),new $t({color:3883062,roughness:.7}));l.position.y=.91,o.add(l);const c=new Q(new _e(.015,.02,1.35,6),new $t({color:8949122}));c.position.set(.2,1.55,0),o.add(c)}else if(i.kind==="bunker_charge"){const a=new Q(new yt(.32,.32,.14),new Re({color:13933368}));a.position.y=.9,o.add(a),this.animatedProps.push({update:(l,c)=>{a.visible=i.active&&Math.sin(c*8)>-.3}})}this.rootGroup.add(o),this.interactableMeshes.set(i.id,o)}}buildBattlefieldAtmosphereProps(t,e){const n=[[-36,10],[-32,-12],[34,8],[36,-15],[-42,-26],[40,-30]];for(const[i,r]of n){const o=this.terrain.getTerrainHeight(i,r),a=new Jt;a.position.set(i,o,r);const l=new Q(new _e(.18,.34,4.2,7),t);l.position.y=2,l.rotation.z=(i>0?-1:1)*.08,l.castShadow=!0,a.add(l);const c=new Q(new _e(.06,.14,1.8,5),t);c.position.set(.55,2.7,.1),c.rotation.z=-.78,a.add(c),this.rootGroup.add(a)}for(const[i,r]of[[-28,18],[28,17],[-29,-12],[29,-11]]){const o=this.terrain.getTerrainHeight(i,r),a=new Jt;a.position.set(i,o+.55,r);for(const l of[[.6,.6,0],[-.6,.2,.7],[.2,-.6,-.7]]){const c=new Q(new yt(.12,1.65,.12),e);c.rotation.set(l[0],l[1],l[2]),c.castShadow=!0,a.add(c)}this.rootGroup.add(a)}}buildRain(){const e=new Float32Array(2700);for(let r=0;r<900;r++)e[r*3]=(Math.random()-.5)*90,e[r*3+1]=Math.random()*28,e[r*3+2]=(Math.random()-.5)*90;const n=new Ce;n.setAttribute("position",new Ue(e,3));const i=new Al({color:11187645,size:.16,transparent:!0,opacity:.45});this.rainPoints=new tm(n,i),this.rootGroup.add(this.rainPoints),this.animatedProps.push({update:r=>{if(!this.rainPoints)return;const o=this.rainPoints.geometry.attributes.position;for(let a=0;a<o.count;a++){let l=o.getY(a)-r*26;l<-1&&(l=26),o.setY(a,l)}o.needsUpdate=!0}})}buildFlares(t){const e=new Jt,n=new Q(new Je(.28,8,8),new Re({color:t?15660287:16764023}));e.add(n);const i=new zs(t?14214911:16757606,t?3.5:1.8,48,1.2);e.add(i),e.position.set(-10,24,-6),this.rootGroup.add(e),this.animatedProps.push({update:(r,o)=>{const a=o*.08%1;e.position.y=26-a*19,e.position.x=-8+Math.sin(o*.7)*8,e.position.z=-5+Math.cos(o*.45)*6,i.intensity=(t?3.4:1.7)*(.85+Math.sin(o*16)*.15)}})}buildSearchlights(){for(const[t,e,n]of[[-18,-36,0],[18,-36,2.1]]){const i=new Ea(6.5,42,16,1,!0);i.translate(0,-21,0),i.rotateX(Math.PI*.5);const r=new Re({color:13624063,transparent:!0,opacity:.085,side:$e,depthWrite:!1,blending:Vi}),o=new Q(i,r);o.position.set(t,2.8,e),this.rootGroup.add(o),this.animatedProps.push({update:(a,l)=>{o.rotation.y=Math.sin(l*.42+n)*.75,o.rotation.x=-.18+Math.cos(l*.55+n)*.1}})}}shatterMainBunker(){this.bunkerMainGroup&&(this.bunkerMainGroup.rotation.z=.18,this.bunkerMainGroup.position.y-=1.25,this.bunkerMainGroup.traverse(t=>{if(t.isMesh){const e=t.material;e.color&&e.color.setHex(2631204)}}))}update(t,e){for(const n of this.animatedProps)n.update(t,e)}}const Ln=110,Un=120,Oi=110,Rs=120,bm=70;function zi(s,t,e){const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)}function Sr(s,t,e,n,i,r){const o=i-e,a=r-n,l=o*o+a*a;if(l<1e-6){const g=s-e,_=t-n;return{distSq:g*g+_*_,t:0,cx:e,cz:n}}const c=Math.max(0,Math.min(1,((s-e)*o+(t-n)*a)/l)),h=e+c*o,d=n+c*a,u=s-h,p=t-d;return{distSq:u*u+p*p,t:c,cx:h,cz:d}}class Em{constructor(){T(this,"mesh");T(this,"geometry");T(this,"craters",[]);T(this,"trenches",[]);T(this,"dugouts",[]);T(this,"ramps",[]);T(this,"normalsDirty",!1);this.geometry=new qn(Ln,Un,Oi,Rs),this.geometry.rotateX(-Math.PI/2);const t=this.geometry.attributes.position.count,e=new Float32Array(t*3);for(let r=0;r<t;r++)e[r*3]=.85,e[r*3+1]=.82,e[r*3+2]=.78;this.geometry.setAttribute("color",new Ue(e,3));const n=Ki().mud,i=new $t({map:n,vertexColors:!0,roughness:.94,metalness:.04});this.mesh=new Q(this.geometry,i),this.mesh.receiveShadow=!0,this.mesh.name="terrain"}loadMission(t){this.trenches=t.trenches,this.dugouts=t.dugouts,this.ramps=t.ramps,this.craters.length=0;for(const e of t.initialCraters)this.craters.push({...e});this.rebuildAllVertices()}getWorldBounds(){return{minX:-Ln*.46,maxX:Ln*.46,minZ:-Un*.46,maxZ:Un*.46}}isInsideTrenchOrDugout(t,e){for(const n of this.dugouts)if(Math.abs(t-n.x)<=n.width*.52&&Math.abs(e-n.z)<=n.depth*.52)return!0;for(const n of this.trenches){const i=Sr(t,e,n.x1,n.z1,n.x2,n.z2);if(Math.sqrt(i.distSq)<=n.width*.55)return!0}return!1}getDugoutAt(t,e){for(const n of this.dugouts)if(Math.abs(t-n.x)<=n.width*.48&&Math.abs(e-n.z)<=n.depth*.48)return n;return null}getTerrainHeight(t,e){let n=Math.sin(t*.14)*Math.cos(e*.12)*.12+Math.sin(t*.37+e*.29)*.05,i=0;for(const o of this.trenches){const a=Sr(t,e,o.x1,o.z1,o.x2,o.z2),l=Math.sqrt(a.distSq),c=o.width*.5,h=.42;if(l<c+h){const d=1-zi(c-.15,c+h,l);i=Math.min(i,-o.depth*d)}else if(o.parapetSide!=="none"&&l<c+1.55){const d=e<a.cz;if(o.parapetSide==="north"&&d||o.parapetSide==="south"&&!d){const p=Math.sin(zi(c+.35,c+1.55,l)*Math.PI)*.25;n+=p}}}for(const o of this.dugouts){const a=Math.abs(t-o.x)-o.width*.5,l=Math.abs(e-o.z)-o.depth*.5,c=Math.max(a,l);if(c<.35){const h=1-zi(-.15,.35,c);i=Math.min(i,o.floorY*h)}}n+=i;for(const o of this.ramps){const a=Sr(t,e,o.x1,o.z1,o.x2,o.z2),l=Math.sqrt(a.distSq),c=o.width*.5;if(l<=c+.35){const h=ae.lerp(o.y1,o.y2,a.t),d=1-zi(c-.1,c+.35,l);n=ae.lerp(n,h,d)}}if(!(this.getDugoutAt(t,e)!==null))for(const o of this.craters){const a=t-o.x,l=e-o.z,c=a*a+l*l,h=o.radius*1.25;if(c<h*h){const d=Math.sqrt(c);if(d<o.radius){const u=Math.cos(d/o.radius*Math.PI*.5);n-=o.depth*u}else{const u=(d-o.radius)/(h-o.radius);n+=Math.sin(u*Math.PI)*.15}}}return n}addCrater(t,e,n,i){if(this.getDugoutAt(t,e))return;const r={x:t,z:e,radius:n,depth:i};this.craters.length>=bm&&this.craters.shift(),this.craters.push(r);const o=this.geometry.attributes.position,a=this.geometry.attributes.color,l=n*1.3,c=Math.max(0,Math.floor((t-l+Ln*.5)/(Ln/Oi))),h=Math.min(Oi,Math.ceil((t+l+Ln*.5)/(Ln/Oi))),d=Math.max(0,Math.floor((e-l+Un*.5)/(Un/Rs))),u=Math.min(Rs,Math.ceil((e+l+Un*.5)/(Un/Rs))),p=Oi+1;for(let g=d;g<=u;g++)for(let _=c;_<=h;_++){const m=g*p+_,f=o.getX(m),E=o.getZ(m),b=Math.hypot(f-t,E-e);if(b<=l){const x=this.getTerrainHeight(f,E);o.setY(m,x);const D=1-zi(0,n*1.15,b)*.55,R=a.getX(m),A=a.getY(m),I=a.getZ(m);a.setXYZ(m,Math.min(R,.85*D),Math.min(A,.78*D),Math.min(I,.72*D))}}o.needsUpdate=!0,a.needsUpdate=!0,this.normalsDirty=!0}flushDirtyNormals(){this.normalsDirty&&(this.geometry.computeVertexNormals(),this.normalsDirty=!1)}rebuildAllVertices(){const t=this.geometry.attributes.position,e=this.geometry.attributes.color;for(let n=0;n<t.count;n++){const i=t.getX(n),r=t.getZ(n),o=this.getTerrainHeight(i,r);t.setY(n,o);let a=.86;o<-.35?a=.62:o>.14&&(a=.94);for(const l of this.craters){const c=Math.hypot(i-l.x,r-l.z);c<l.radius*1.1&&(a=Math.min(a,.45+.35*(c/(l.radius*1.1))))}e.setXYZ(n,a,a*.96,a*.91)}t.needsUpdate=!0,e.needsUpdate=!0,this.geometry.computeVertexNormals(),this.normalsDirty=!1}dispose(){this.geometry.dispose(),this.mesh.material.dispose()}}class wm{constructor(){T(this,"ctx",null);T(this,"masterGain",null);T(this,"sfxBus",null);T(this,"lowpass",null);T(this,"noiseBuffer",null);T(this,"windGain",null);T(this,"tinnitusOsc",null);T(this,"tinnitusGain",null);T(this,"tankDroneOsc",null);T(this,"tankDroneGain",null);T(this,"masterVolume",.75);T(this,"heartbeatCooldown",0);T(this,"distantArtilleryCooldown",3.5)}unlock(){if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t,this.masterGain=this.ctx.createGain(),this.masterGain.gain.value=this.masterVolume,this.masterGain.connect(this.ctx.destination),this.lowpass=this.ctx.createBiquadFilter(),this.lowpass.type="lowpass",this.lowpass.frequency.value=18e3,this.lowpass.Q.value=.7,this.lowpass.connect(this.masterGain),this.sfxBus=this.ctx.createGain(),this.sfxBus.gain.value=1,this.sfxBus.connect(this.lowpass),this.noiseBuffer=this.createNoiseBuffer(2.5),this.setupAmbience()}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}setMasterVolume(t){this.masterVolume=Math.max(0,Math.min(1,t)),this.masterGain&&this.ctx&&this.masterGain.gain.setTargetAtTime(this.masterVolume,this.ctx.currentTime,.04)}createNoiseBuffer(t){const e=this.ctx,n=Math.floor(e.sampleRate*t),i=e.createBuffer(1,n,e.sampleRate),r=i.getChannelData(0);let o=0;for(let a=0;a<n;a++){const l=Math.random()*2-1;o=(o+.04*l)/1.04,r[a]=l*.55+o*1.45}return i}setupAmbience(){if(!this.ctx||!this.noiseBuffer||!this.sfxBus||!this.masterGain)return;const t=this.ctx.createBufferSource();t.buffer=this.noiseBuffer,t.loop=!0;const e=this.ctx.createBiquadFilter();e.type="bandpass",e.frequency.value=260,e.Q.value=1.6,this.windGain=this.ctx.createGain(),this.windGain.gain.value=.07,t.connect(e),e.connect(this.windGain),this.windGain.connect(this.sfxBus),t.start(),this.tinnitusOsc=this.ctx.createOscillator(),this.tinnitusOsc.type="sine",this.tinnitusOsc.frequency.value=3750,this.tinnitusGain=this.ctx.createGain(),this.tinnitusGain.gain.value=0,this.tinnitusOsc.connect(this.tinnitusGain),this.tinnitusGain.connect(this.masterGain),this.tinnitusOsc.start(),this.tankDroneOsc=this.ctx.createOscillator(),this.tankDroneOsc.type="sawtooth",this.tankDroneOsc.frequency.value=46;const n=this.ctx.createBiquadFilter();n.type="lowpass",n.frequency.value=135,this.tankDroneGain=this.ctx.createGain(),this.tankDroneGain.gain.value=0,this.tankDroneOsc.connect(n),n.connect(this.tankDroneGain),this.tankDroneGain.connect(this.sfxBus),this.tankDroneOsc.start()}updateState(t,e,n,i,r,o,a){if(!this.ctx||!this.lowpass||!this.tinnitusGain||!this.tankDroneGain||!this.windGain)return;const l=this.ctx.currentTime;if(!a){this.tinnitusGain.gain.setTargetAtTime(0,l,.08),this.tankDroneGain.gain.setTargetAtTime(0,l,.08),this.lowpass.frequency.setTargetAtTime(16e3,l,.1),this.windGain.gain.setTargetAtTime(.035,l,.2);return}this.windGain.gain.setTargetAtTime(.065,l,.2);const c=Math.max(n,e*.72),h=18e3*Math.pow(.03,c);this.lowpass.frequency.setTargetAtTime(Math.max(460,h),l,.08),this.tinnitusGain.gain.setTargetAtTime(n*.095,l,.05);const d=o<42?Math.pow(1-o/42,1.5):0;this.tankDroneGain.gain.setTargetAtTime(d*.14,l,.12),this.heartbeatCooldown-=t;const u=Math.max(e,r?.65:0,i<35?(35-i)/35:0);u>.45&&this.heartbeatCooldown<=0&&(this.playHeartbeat(.12+u*.16),this.heartbeatCooldown=Math.max(.46,.92-u*.42)),this.distantArtilleryCooldown-=t,this.distantArtilleryCooldown<=0&&(this.playDistantThunder(),this.distantArtilleryCooldown=4+Math.random()*6)}getDestNode(t){if(!this.ctx||!this.sfxBus)throw new Error("Audio not ready");if(Math.abs(t)<.02||!this.ctx.createStereoPanner)return this.sfxBus;const e=this.ctx.createStereoPanner();return e.pan.value=Math.max(-1,Math.min(1,t)),e.connect(this.sfxBus),e}playHeartbeat(t){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime,n=(i,r)=>{const o=this.ctx.createOscillator(),a=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(64,e+i),o.frequency.exponentialRampToValueAtTime(36,e+i+.12),a.gain.setValueAtTime(.001,e+i),a.gain.linearRampToValueAtTime(r,e+i+.02),a.gain.exponentialRampToValueAtTime(.001,e+i+.16),o.connect(a),a.connect(this.masterGain),o.start(e+i),o.stop(e+i+.18)};n(0,t),n(.18,t*.72)}playDistantThunder(){if(!this.ctx||!this.noiseBuffer||!this.sfxBus)return;const t=this.ctx.currentTime,e=this.ctx.createBufferSource();e.buffer=this.noiseBuffer;const n=this.ctx.createBiquadFilter();n.type="lowpass",n.frequency.value=140;const i=this.ctx.createGain();i.gain.setValueAtTime(.001,t),i.gain.linearRampToValueAtTime(.08+Math.random()*.06,t+.08),i.gain.exponentialRampToValueAtTime(.001,t+1.4);const r=this.getDestNode((Math.random()-.5)*1.4);e.connect(n),n.connect(i),i.connect(r),e.start(t),e.stop(t+1.5)}playGunshot(t,e=0,n=0){if(!this.ctx||!this.noiseBuffer)return;const i=e<=2?1:Math.max(.04,1/(1+e*.075));if(i<.05)return;const r=this.ctx.currentTime,o=this.getDestNode(n);if(t==="tankCannon"){this.playExplosion(Math.max(4,e),.75,n);return}if(t==="bazooka"){const m=this.ctx.createBufferSource();m.buffer=this.noiseBuffer;const f=this.ctx.createBiquadFilter();f.type="bandpass",f.frequency.setValueAtTime(520,r),f.frequency.exponentialRampToValueAtTime(1600,r+.35);const E=this.ctx.createGain();E.gain.setValueAtTime(.45*i,r),E.gain.exponentialRampToValueAtTime(.001,r+.55),m.connect(f),f.connect(E),E.connect(o),m.start(r),m.stop(r+.58);return}const a=this.ctx.createOscillator(),l=this.ctx.createGain();a.type="triangle";const c=t==="rifle"?210:t==="mg"?160:240,h=t==="rifle"?.14:t==="mg"?.12:.08;a.frequency.setValueAtTime(c,r),a.frequency.exponentialRampToValueAtTime(48,r+h),l.gain.setValueAtTime((t==="rifle"?.42:.28)*i,r),l.gain.exponentialRampToValueAtTime(.001,r+h),a.connect(l),l.connect(o),a.start(r),a.stop(r+h+.02);const d=this.ctx.createBufferSource();d.buffer=this.noiseBuffer;const u=this.ctx.createBiquadFilter();u.type="bandpass",u.frequency.value=Math.max(420,(t==="smg"?1900:1450)-e*14),u.Q.value=.7;const p=this.ctx.createGain(),g=(t==="rifle"?.58:t==="mg"?.48:.38)*i,_=t==="rifle"?.26:t==="mg"?.2:.11;p.gain.setValueAtTime(g,r),p.gain.exponentialRampToValueAtTime(.001,r+_),d.connect(u),u.connect(p),p.connect(o),d.start(r),d.stop(r+_+.02)}playGarandPing(){if(!this.ctx||!this.sfxBus)return;const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(2420,t),e.frequency.exponentialRampToValueAtTime(2360,t+.45),n.gain.setValueAtTime(.16,t),n.gain.exponentialRampToValueAtTime(.001,t+.48),e.connect(n),n.connect(this.sfxBus),e.start(t),e.stop(t+.5)}playBulletWhiz(t=0){if(!this.ctx||!this.noiseBuffer)return;const e=this.ctx.currentTime,n=this.getDestNode(t),i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sawtooth",i.frequency.setValueAtTime(2900+Math.random()*800,e),i.frequency.exponentialRampToValueAtTime(520,e+.085),r.gain.setValueAtTime(.095,e),r.gain.exponentialRampToValueAtTime(.001,e+.09),i.connect(r),r.connect(n),i.start(e),i.stop(e+.1)}playExplosion(t,e=1,n=0){if(!this.ctx||!this.noiseBuffer)return;const i=Math.max(.08,Math.min(1,1/(1+t*.045)*e)),r=this.ctx.currentTime,o=this.getDestNode(n),a=this.ctx.createOscillator(),l=this.ctx.createGain();a.type="sine",a.frequency.setValueAtTime(92,r),a.frequency.exponentialRampToValueAtTime(28,r+.65),l.gain.setValueAtTime(.75*i,r),l.gain.exponentialRampToValueAtTime(.001,r+.72),a.connect(l),l.connect(o),a.start(r),a.stop(r+.75);const c=this.ctx.createBufferSource();c.buffer=this.noiseBuffer;const h=this.ctx.createBiquadFilter();h.type="lowpass",h.frequency.setValueAtTime(1600,r),h.frequency.exponentialRampToValueAtTime(140,r+1.35);const d=this.ctx.createGain();d.gain.setValueAtTime(.82*i,r),d.gain.exponentialRampToValueAtTime(.001,r+1.45),c.connect(h),h.connect(d),d.connect(o),c.start(r),c.stop(r+1.5)}playAirRaidSiren(){if(!this.ctx||!this.sfxBus)return;const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sawtooth",e.frequency.setValueAtTime(320,t),e.frequency.linearRampToValueAtTime(760,t+1.7),e.frequency.linearRampToValueAtTime(360,t+3.4);const i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.value=1100,n.gain.setValueAtTime(.001,t),n.gain.linearRampToValueAtTime(.16,t+.4),n.gain.setValueAtTime(.15,t+2.6),n.gain.exponentialRampToValueAtTime(.001,t+3.5),e.connect(i),i.connect(n),n.connect(this.sfxBus),e.start(t),e.stop(t+3.6)}playBomberPass(){if(!this.ctx||!this.sfxBus)return;const t=this.ctx.currentTime,e=this.ctx.createStereoPanner?this.ctx.createStereoPanner():null;e&&(e.pan.setValueAtTime(-.85,t),e.pan.linearRampToValueAtTime(.85,t+4.8),e.connect(this.sfxBus));const n=e??this.sfxBus,i=this.ctx.createGain();i.gain.setValueAtTime(.001,t),i.gain.linearRampToValueAtTime(.16,t+1.8),i.gain.exponentialRampToValueAtTime(.001,t+5),i.connect(n);for(const r of[58,87,116]){const o=this.ctx.createOscillator();o.type="sawtooth",o.frequency.value=r;const a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=260,o.connect(a),a.connect(i),o.start(t),o.stop(t+5.1)}}playBombWhistle(t=0){if(!this.ctx)return;const e=this.ctx.currentTime,n=this.getDestNode(t),i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(1180,e),i.frequency.exponentialRampToValueAtTime(300,e+1.25),r.gain.setValueAtTime(.001,e),r.gain.linearRampToValueAtTime(.11,e+.25),r.gain.linearRampToValueAtTime(.15,e+1.15),r.gain.exponentialRampToValueAtTime(.001,e+1.28),i.connect(r),r.connect(n),i.start(e),i.stop(e+1.3)}playRicochet(t=0){if(!this.ctx)return;const e=this.ctx.currentTime,n=this.getDestNode(t),i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(2200+Math.random()*700,e),i.frequency.exponentialRampToValueAtTime(980,e+.18),r.gain.setValueAtTime(.14,e),r.gain.exponentialRampToValueAtTime(.001,e+.19),i.connect(r),r.connect(n),i.start(e),i.stop(e+.2)}playHeadshotPing(){if(!this.ctx||!this.sfxBus)return;const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(1650,t),e.frequency.exponentialRampToValueAtTime(1100,t+.08),n.gain.setValueAtTime(.16,t),n.gain.exponentialRampToValueAtTime(.001,t+.09),e.connect(n),n.connect(this.sfxBus),e.start(t),e.stop(t+.1)}playFootstep(t){if(!this.ctx||!this.noiseBuffer||!this.sfxBus)return;const e=this.ctx.currentTime,n=this.ctx.createBufferSource();n.buffer=this.noiseBuffer;const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.value=t?420:230,i.Q.value=1.4;const r=this.ctx.createGain();r.gain.setValueAtTime(t?.11:.085,e),r.gain.exponentialRampToValueAtTime(.001,e+.08),n.connect(i),i.connect(r),r.connect(this.sfxBus),n.start(e),n.stop(e+.09)}playGrenadeBounce(t=4){if(!this.ctx||!this.sfxBus)return;const e=Math.max(.05,1/(1+t*.15)),n=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(540,n),i.frequency.exponentialRampToValueAtTime(220,n+.06),r.gain.setValueAtTime(.12*e,n),r.gain.exponentialRampToValueAtTime(.001,n+.065),i.connect(r),r.connect(this.sfxBus),i.start(n),i.stop(n+.07)}playReload(){if(!this.ctx||!this.sfxBus)return;const t=this.ctx.currentTime;for(const[e,n]of[[0,380],[.24,520]]){const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="square",i.frequency.setValueAtTime(n,t+e),i.frequency.exponentialRampToValueAtTime(n*.55,t+e+.05),r.gain.setValueAtTime(.08,t+e),r.gain.exponentialRampToValueAtTime(.001,t+e+.055),i.connect(r),r.connect(this.sfxBus),i.start(t+e),i.stop(t+e+.06)}}playRadioStatic(){if(!this.ctx||!this.noiseBuffer||!this.sfxBus)return;const t=this.ctx.currentTime,e=this.ctx.createBufferSource();e.buffer=this.noiseBuffer;const n=this.ctx.createBiquadFilter();n.type="bandpass",n.frequency.value=1850,n.Q.value=2.4;const i=this.ctx.createGain();i.gain.setValueAtTime(.08,t),i.gain.exponentialRampToValueAtTime(.001,t+.14),e.connect(n),n.connect(i),i.connect(this.sfxBus),e.start(t),e.stop(t+.15)}playUiClick(){if(!this.ctx||!this.masterGain)return;const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="triangle",e.frequency.setValueAtTime(640,t),e.frequency.exponentialRampToValueAtTime(280,t+.045),n.gain.setValueAtTime(.08,t),n.gain.exponentialRampToValueAtTime(.001,t+.05),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.055)}}class Tm{constructor(t){T(this,"canvas");T(this,"keysDown",new Set);T(this,"keysPressed",new Set);T(this,"mouseLeftDown",!1);T(this,"mouseLeftClicked",!1);T(this,"mouseRightDown",!1);T(this,"deltaX",0);T(this,"deltaY",0);T(this,"pointerLocked",!1);T(this,"activeGameplay",!1);T(this,"onPauseCallback",null);this.canvas=t,this.bindListeners()}setOnPauseRequested(t){this.onPauseCallback=t}setGameplayActive(t){this.activeGameplay=t,t||(this.clearAll(),document.pointerLockElement===this.canvas&&document.exitPointerLock())}requestLock(){if(document.pointerLockElement!==this.canvas)try{const t=this.canvas.requestPointerLock();t&&typeof t.catch=="function"&&t.catch(()=>{})}catch{}}isPointerLocked(){return this.pointerLocked}isKeyDown(t){return this.keysDown.has(t)}consumeKeyPress(t){return this.keysPressed.has(t)?(this.keysPressed.delete(t),!0):!1}isLeftMouseDown(){return this.mouseLeftDown}consumeLeftMouseClick(){return this.mouseLeftClicked?(this.mouseLeftClicked=!1,!0):!1}isRightMouseDown(){return this.mouseRightDown}consumeMouseDelta(){const t=this.deltaX,e=this.deltaY;return this.deltaX=0,this.deltaY=0,{dx:t,dy:e}}clearAll(){this.keysDown.clear(),this.keysPressed.clear(),this.mouseLeftDown=!1,this.mouseLeftClicked=!1,this.mouseRightDown=!1,this.deltaX=0,this.deltaY=0}bindListeners(){window.addEventListener("keydown",t=>{var e;if((t.code==="Space"||t.code==="Tab")&&this.activeGameplay&&t.preventDefault(),t.code==="Escape"&&this.activeGameplay){t.preventDefault(),this.clearAll(),(e=this.onPauseCallback)==null||e.call(this);return}this.keysDown.has(t.code)||this.keysPressed.add(t.code),this.keysDown.add(t.code)}),window.addEventListener("keyup",t=>{this.keysDown.delete(t.code)}),window.addEventListener("blur",()=>{this.clearAll()}),this.canvas.addEventListener("contextmenu",t=>{t.preventDefault()}),this.canvas.addEventListener("mousedown",t=>{this.activeGameplay&&(this.pointerLocked||this.requestLock(),t.button===0?(this.mouseLeftDown=!0,this.mouseLeftClicked=!0):t.button===2&&(this.mouseRightDown=!0))}),window.addEventListener("mouseup",t=>{t.button===0?this.mouseLeftDown=!1:t.button===2&&(this.mouseRightDown=!1)}),document.addEventListener("mousemove",t=>{if(this.activeGameplay&&(this.pointerLocked||this.mouseLeftDown)){const e=Math.max(-120,Math.min(120,t.movementX||0)),n=Math.max(-120,Math.min(120,t.movementY||0));this.deltaX+=e,this.deltaY+=n}}),document.addEventListener("pointerlockchange",()=>{var e;const t=this.pointerLocked;this.pointerLocked=document.pointerLockElement===this.canvas,t&&!this.pointerLocked&&this.activeGameplay&&(this.clearAll(),(e=this.onPauseCallback)==null||e.call(this))})}}const Ho="tdn_completed_ops_v1",Vo="tdn_settings_v1";class Am{constructor(t,e){T(this,"renderer");T(this,"scene");T(this,"camera");T(this,"audio");T(this,"input");T(this,"terrain");T(this,"cover");T(this,"envBuilder");T(this,"vfx");T(this,"projectiles");T(this,"player");T(this,"soldiers");T(this,"tanks");T(this,"bombers");T(this,"ui");T(this,"screen","menu");T(this,"activeMission");T(this,"selectedMissionId",0);T(this,"phaseIndex",0);T(this,"phaseTimer",0);T(this,"artilleryCooldown",999);T(this,"missionElapsed",0);T(this,"kills",0);T(this,"tanksDestroyed",0);T(this,"radioCaption",null);T(this,"radioCaptionTimer",0);T(this,"airRaidAlert",null);T(this,"pendingSpawns",[]);T(this,"liveInteractables",[]);T(this,"settings");T(this,"completedMissions",new Set);T(this,"clock",new rm);T(this,"totalElapsed",0);T(this,"wasInMission",!1);T(this,"animate",()=>{requestAnimationFrame(this.animate);const t=Math.min(this.clock.getDelta(),.05);if(this.totalElapsed+=t,this.screen==="playing")this.updateGameplay(t);else if(this.envBuilder.update(t,this.totalElapsed),this.audio.updateState(t,0,0,100,!1,999,!1),this.screen==="menu"||this.screen==="briefing"){const e=Math.sin(this.totalElapsed*.16)*8;this.camera.position.set(e,4.2,34),this.camera.lookAt(e*.4,.2,-14)}this.renderer.render(this.scene,this.camera)});this.settings=this.loadSettings(),this.completedMissions=this.loadCompleted(),this.renderer=new $p({canvas:t,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=this.settings.quality!=="low",this.renderer.shadowMap.type=Xo,this.renderer.toneMapping=Yo,this.renderer.toneMappingExposure=1.05,this.scene=new Kp,this.camera=new Le(72,window.innerWidth/window.innerHeight,.08,240),this.scene.add(this.camera),this.audio=new wm,this.audio.setMasterVolume(this.settings.masterVolume),this.input=new Tm(t),this.terrain=new Em,this.scene.add(this.terrain.mesh),this.cover=new ym(this.terrain),this.envBuilder=new Sm(this.scene,this.terrain,this.cover),this.vfx=new vm(this.scene),this.projectiles=new mm(this.scene,this.terrain,this.cover,this.vfx,this.audio),this.player=new pm(this.camera,this.audio,this.input,this.terrain,this.cover,this.projectiles),this.soldiers=new gm(this.scene,this.terrain,this.cover,this.projectiles,this.vfx,this.audio),this.tanks=new _m(this.scene,this.terrain,this.cover,this.projectiles,this.vfx,this.audio),this.bombers=new am(this.scene,this.projectiles,this.vfx,this.audio),this.activeMission=Fi(0),this.ui=new Mm(e,this.settings,this.completedMissions,{onSelectMission:n=>{this.audio.unlock(),this.audio.playUiClick(),this.selectedMissionId=n,this.previewMenuScene(n)},onStartMissionBriefing:()=>{this.audio.unlock(),this.audio.playUiClick(),this.screen="briefing",this.ui.showBriefing(Fi(this.selectedMissionId))},onEnterBattle:()=>{this.audio.unlock(),this.startMission(this.selectedMissionId)},onResumeBattle:()=>{this.wasInMission?(this.screen="playing",this.ui.setScreen("playing"),this.input.setGameplayActive(!0),this.input.requestLock()):(this.screen="menu",this.ui.setScreen("menu"))},onRestartMission:()=>{this.audio.unlock(),this.startMission(this.selectedMissionId)},onReturnToMenu:()=>{this.wasInMission=!1,this.input.setGameplayActive(!1),this.screen="menu",this.ui.setScreen("menu"),this.previewMenuScene(this.selectedMissionId)},onNextMission:()=>{const n=Math.min(3,this.selectedMissionId+1);this.selectedMissionId=n,this.ui.setSelectedMission(n),this.screen="briefing",this.ui.showBriefing(Fi(n))},onSettingsChanged:n=>{this.settings={...n},this.audio.setMasterVolume(this.settings.masterVolume),this.renderer.shadowMap.enabled=this.settings.quality!=="low",this.saveSettings()}}),this.input.setOnPauseRequested(()=>{this.screen==="playing"&&(this.screen="paused",this.input.setGameplayActive(!1),this.ui.setScreen("paused"))}),window.addEventListener("resize",()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}),this.previewMenuScene(0),this.animate()}previewMenuScene(t){const e=Fi(t);this.activeMission=e,this.clearCombatActors(),this.terrain.loadMission(e),this.envBuilder.buildMission(e,this.settings.quality),this.player.viewModel.root.visible=!1}clearCombatActors(){this.vfx.clear(),this.projectiles.clear(),this.soldiers.clear(),this.tanks.clear(),this.bombers.clear(),this.pendingSpawns=[]}startMission(t){this.selectedMissionId=t;const e=Fi(t);this.activeMission=e,this.clearCombatActors(),this.terrain.loadMission(e),this.envBuilder.buildMission(e,this.settings.quality),this.liveInteractables=e.interactables.map(n=>({...n})),this.player.resetForMission(e.playerSpawn.x,e.playerSpawn.z,e.playerSpawn.yaw),this.player.viewModel.root.visible=!0,this.soldiers.spawnAllies(e.allyCount),this.soldiers.spawnEmplacedGunners(e.enemyEmplacements),this.phaseIndex=0,this.missionElapsed=0,this.kills=0,this.tanksDestroyed=0,this.airRaidAlert=null,this.radioCaption=null,this.radioCaptionTimer=0,this.wasInMission=!0,this.beginPhase(0),this.screen="playing",this.ui.setScreen("playing"),this.input.setGameplayActive(!0),this.input.requestLock()}beginPhase(t){this.phaseIndex=t;const e=this.activeMission.phases[t];if(!e){this.finishMission(!0);return}if(this.phaseTimer=e.durationSeconds??0,this.artilleryCooldown=e.artilleryRate??999,e.radioOpening&&this.pushRadioCaption(e.radioOpening),e.type==="activate_radio")for(const n of this.liveInteractables)n.kind==="radio"&&(n.active=!0);if(e.type==="plant_charge")for(const n of this.liveInteractables)n.kind==="bunker_charge"&&(n.active=!0);if(e.tanksToSpawn)for(const n of e.tanksToSpawn)this.tanks.spawnTank(n.x,n.z,n.heavy,n.waypoints);if(e.type==="bomber_storm")this.airRaidAlert="ALERTA AÉREO — ENTRE NO ABRIGO SUBTERRÂNEO!",this.bombers.triggerBomberRun(()=>{this.airRaidAlert=null,e.enemiesToSpawn&&e.enemyRoles&&(this.soldiers.spawnEnemySquad(e.enemiesToSpawn,e.enemyRoles),this.pushRadioCaption("Bombardeio passou! Infantaria inimiga avançando pela fumaça!"))});else if(e.enemiesToSpawn&&e.enemyRoles){const n=Math.min(10,e.enemiesToSpawn),i=e.enemiesToSpawn-n;this.soldiers.spawnEnemySquad(n,e.enemyRoles),i>0&&this.pendingSpawns.push({delay:6.5,action:()=>{this.screen==="playing"&&this.soldiers.spawnEnemySquad(i,e.enemyRoles)}})}}pushRadioCaption(t){this.radioCaption=t,this.radioCaptionTimer=5,this.audio.playRadioStatic()}handleExplosion(t,e,n,i,r,o,a){this.terrain.addCrater(t.x,t.z,i,r),this.cover.destroyWiresInRadius(t.x,t.z,e*.75),this.cover.damageDestructiblesInRadius(t,e*.85,n*1.15),this.vfx.spawnExplosion(t,Math.max(.85,e/6.2));const l=t.distanceTo(this.player.pos),c=Math.max(-1,Math.min(1,(t.x-this.player.pos.x)/28));if(this.audio.playExplosion(l,Math.max(.8,e/6.5),c),this.soldiers.applyBlastDamage(t,e,n,a,()=>{a&&this.kills++}),this.tanks.applyBlastDamage(t,e*.8,n*.85,()=>{this.tanksDestroyed++,this.pushRadioCaption("ALVO BLINDADO DESTRUÍDO! BOM TIRO!")}),l<26){const h=1-l/26;this.player.addShake(h*.85),this.player.applySuppression(h*.7),l<13&&(this.player.tinnitus=Math.min(1,this.player.tinnitus+(1-l/13)*.95))}if(l<=e){if((o.includes("aérea")||o.includes("Artilharia"))&&this.player.overheadProtected)return;const d=this.player.coverState==="dugout"?.2:this.player.coverState==="sheltered"&&!o.includes("Granada")?.35:1,u=1-l/e*.65,p=n*u*d;p>4&&this.player.applyDamage(p,t,o,p>25)}}finishMission(t){this.wasInMission=!1,this.input.setGameplayActive(!1),t?(this.completedMissions.add(this.activeMission.id),this.saveCompleted(),this.ui.setCompletedMissions(this.completedMissions),this.screen="victory"):this.screen="kia";let e="Mantenha-se abaixo do parapeito com [C] e avance apenas quando houver pausa no fogo.";this.player.lastDamageCause.includes("aérea")?e="Quando ouvir a sirene aérea, corra imediatamente para um dos ABRIGOS subterrâneos na parede traseira.":this.player.lastDamageCause.includes("Hemorragia")?e="Ao receber tiro grave, recue para a cobertura e segure [H] por 2 segundos para aplicar curativo.":this.player.lastDamageCause.includes("tanque")?e="Nunca encare a frente de um tanque em campo aberto. Flanqueie pelas crateras usando a Bazuca [3].":this.player.lastDamageCause.includes("Granada")&&(e="Fique atento ao aviso de granada próxima — afaste-se ou pressione [F] bem perto dela para chutá-la de volta.");const n={missionId:this.activeMission.id,missionTitle:`${this.activeMission.code} — ${this.activeMission.title}`,victory:t,causeOfDeath:this.player.lastDamageCause,tacticalAdvice:e,durationSeconds:this.missionElapsed,kills:this.kills,tanksDestroyed:this.tanksDestroyed,shotsFired:this.player.shotsFired,shotsHit:this.player.shotsHit};this.ui.showMissionEnd(n)}updateGameplay(t){this.missionElapsed+=t,this.radioCaptionTimer>0&&(this.radioCaptionTimer-=t,this.radioCaptionTimer<=0&&(this.radioCaption=null));for(let r=this.pendingSpawns.length-1;r>=0;r--)if(this.pendingSpawns[r].delay-=t,this.pendingSpawns[r].delay<=0){const o=this.pendingSpawns[r].action;this.pendingSpawns.splice(r,1),o()}const e=this.player.update(t,this.settings.mouseSensitivity,this.liveInteractables,(r,o)=>{var a,l;if(r==="radio"){for(const c of this.liveInteractables)c.id===o&&(c.active=!1);((a=this.activeMission.phases[this.phaseIndex])==null?void 0:a.type)==="activate_radio"&&this.beginPhase(this.phaseIndex+1)}else if(r==="bunker_charge"){for(const c of this.liveInteractables)c.id===o&&(c.active=!1);((l=this.activeMission.phases[this.phaseIndex])==null?void 0:l.type)==="plant_charge"&&this.beginPhase(this.phaseIndex+1)}});this.soldiers.update(t,this.player.pos,this.player.getEyeY(),this.player.exposure,this.bombers.isWarningOrPassing(),r=>this.pushRadioCaption(r)),this.tanks.update(t,this.player.pos,this.player.getEyeY(),this.player.exposure,(r,o,a,l,c,h)=>{this.handleExplosion(r,o,a,l,c,h,!1)}),this.bombers.update(t,this.player.pos.x),this.projectiles.update(t,this.player.pos,this.player.getEyeY(),{onHitEnemySoldier:(r,o,a,l)=>{const c=this.soldiers.checkBulletHit("enemy",r,o,a,()=>{l&&this.kills++});return c.hit&&l&&this.player.registerHitMarker(c.headshot),c.hit},onHitAllySoldier:(r,o,a)=>this.soldiers.checkBulletHit("ally",r,o,a).hit,onHitPlayer:(r,o,a,l)=>{this.player.applyDamage(r,o,a,l)},onNearMissPlayer:r=>{const o=Math.max(-1,Math.min(1,(r.x-this.player.pos.x)/14));this.audio.playBulletWhiz(o),this.player.applySuppression(.24)},onHitTank:(r,o,a)=>{const l=this.tanks.checkProjectileHit(r,a,()=>{this.tanksDestroyed++,this.pushRadioCaption("TANQUE INIMIGO ABATIDO!")});return l&&a&&this.player.registerHitMarker(!0),l},onExplosion:(r,o,a,l,c,h,d)=>{this.handleExplosion(r,o,a,l,c,h,d)}}),this.vfx.update(t),this.envBuilder.update(t,this.totalElapsed),this.terrain.flushDirtyNormals();const n=this.tanks.getNearestTankDistance(this.player.pos);this.audio.updateState(t,this.player.suppression,this.player.tinnitus,this.player.hp,this.player.bleeding,n,!0);const i=this.activeMission.phases[this.phaseIndex];if(i){if(i.artilleryRate&&i.artilleryRate<100&&(this.artilleryCooldown-=t,this.artilleryCooldown<=0)){this.artilleryCooldown=i.artilleryRate*(.75+Math.random()*.5);const o=this.player.pos.x+(Math.random()-.5)*26,a=Math.max(-24,Math.min(34,this.player.pos.z-6+(Math.random()-.5)*18));this.projectiles.spawnFallingBomb(o,28,a,!1),this.audio.playBombWhistle(Math.max(-1,Math.min(1,(o-this.player.pos.x)/20)))}let r=!1;if(i.type==="survive_wave")this.pendingSpawns.length===0&&this.soldiers.getLivingEnemyCount()===0&&(r=!0);else if(i.type==="destroy_tanks")this.tanks.getLivingTankCount()===0&&this.pendingSpawns.length===0&&this.soldiers.getLivingEnemyCount()<=2&&(r=!0);else if(i.type==="bomber_storm")!this.bombers.isActive()&&this.tanks.getLivingTankCount()===0&&this.soldiers.getLivingEnemyCount()===0&&(r=!0);else if(i.type==="hold_timer")this.phaseTimer-=t,this.phaseTimer<=0&&(r=!0);else if(i.type==="reach_zone"&&i.targetZone)Math.hypot(this.player.pos.x-i.targetZone.x,this.player.pos.z-i.targetZone.z)<=i.targetZone.radius&&(r=!0);else if(i.type==="clear_trench")this.tanks.getLivingTankCount()===0&&this.pendingSpawns.length===0&&this.soldiers.getLivingEnemyCount()<=1&&(r=!0);else if(i.type==="detonate_wait"&&(this.phaseTimer-=t,this.phaseTimer<=0)){const o=new C(0,0,-36);this.envBuilder.shatterMainBunker(),this.handleExplosion(o,15,220,4.5,1.5,"Detonação do Bunker Principal",!0),r=!0}r&&this.beginPhase(this.phaseIndex+1)}if(this.player.hp<=0){this.finishMission(!1);return}this.emitHUDState(e)}emitHUDState(t){const e=this.activeMission.phases[this.phaseIndex];let n=null,i=null,r=(e==null?void 0:e.objectiveText)??"",o=(e==null?void 0:e.objectiveSubtext)??"";if(((e==null?void 0:e.type)==="hold_timer"||(e==null?void 0:e.type)==="detonate_wait")&&(o=`${o} (${Math.max(0,Math.ceil(this.phaseTimer))}s)`),e!=null&&e.objectiveTarget){const d=e.objectiveTarget.x-this.player.pos.x,u=e.objectiveTarget.z-this.player.pos.z;i=Math.hypot(d,u),n=Math.atan2(d,-u),n<0&&(n+=Math.PI*2)}const a=this.projectiles.getNearestDangerGrenade(this.player.pos,this.player.yaw),l=Bn[this.player.weaponId],c=(ae.lerp(l.spreadHip,l.spreadAds,this.player.adsFactor)+this.player.suppression*.035)*460,h={hp:this.player.hp,maxHp:this.player.maxHp,bleeding:this.player.bleeding,bandages:this.player.bandages,bandagingProgress:this.player.bandagingProgress,suppression:this.player.suppression,tinnitus:this.player.tinnitus,exposure:this.player.exposure,coverState:this.player.coverState,isCrouching:this.player.isCrouching,isSprinting:this.player.isSprinting,weaponId:this.player.weaponId,ammoInMag:this.player.magAmmo[this.player.weaponId],magCapacity:l.magSize,ammoReserve:this.player.reserveAmmo[this.player.weaponId],reloadingProgress:this.player.reloadingProgress,grenades:this.player.reserveAmmo.grenade,rockets:this.player.reserveAmmo.bazooka,cookingGrenadeProgress:this.player.cookingGrenade?Math.min(1,this.player.cookTimer/3.2):0,adsFactor:this.player.adsFactor,mgMounted:this.player.mgMounted,mgHeat:this.player.mgHeat,mgOverheated:this.player.mgOverheated,interactPrompt:t.interactPrompt,actionProgress:t.actionProgress,actionLabel:t.actionLabel,grenadeWarning:a?{angleRad:a.angleRad,distance:a.dist,fuseProgress:a.fuseProgress}:null,airRaidAlert:this.airRaidAlert,damageIndicators:this.player.damageIndicators,objectiveText:r,objectiveSubtext:o,radioCaption:this.radioCaption,compassYaw:this.player.yaw,objectiveBearing:n,objectiveDistance:i,missionTime:this.missionElapsed,kills:this.kills,tanksDestroyed:this.tanksDestroyed,hitMarkerTimer:this.player.hitMarkerTimer,hitMarkerCrit:this.player.hitMarkerCrit,spreadPx:c,showControlsHint:this.missionElapsed<18&&this.selectedMissionId===0};this.ui.updateHUD(h)}loadCompleted(){try{const t=localStorage.getItem(Ho);if(!t)return new Set;const e=JSON.parse(t);return new Set(e)}catch{return new Set}}saveCompleted(){try{localStorage.setItem(Ho,JSON.stringify([...this.completedMissions]))}catch{}}loadSettings(){try{const t=localStorage.getItem(Vo);if(t)return JSON.parse(t)}catch{}return{mouseSensitivity:1,masterVolume:.75,quality:"medium"}}saveSettings(){try{localStorage.setItem(Vo,JSON.stringify(this.settings))}catch{}}}const Cl=document.getElementById("game-canvas"),Pl=document.getElementById("ui-layer");if(!Cl||!Pl)throw new Error("Elementos base #game-canvas ou #ui-layer não encontrados.");new Am(Cl,Pl);
