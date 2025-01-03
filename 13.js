/*
Part one was a kind of fun algebra problem.
Part two was a major pain, and it took me awhile to find the right
library to help me out. Initially I was trying to use big.js
but the solution required hacks, and I realized a library specifically
designed for fractions was a much better fit. Fraction.js worked well.

The solution is:

A0 * a + B0 * b = P0
A1 * a + B1 * b = P1

a = (P0 - B0 * b) / A0

(A1 / A0) * (P0 - B0 * b) + B1 * b = P1

(A1 / A0) * (-B0) * b + B1 * b = P1 - (A1 / A0) * P0

b = (P1 - (A1 / A0) * P0) / ((A1 / A0) * (-B0) + B1)
*/

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const groups = [];

  const buttonRegex = /Button .: X\+(\d+), Y\+(\d+)/;
  const prizeRegex = /Prize: X=(\d+), Y=(\d+)/;

  const getNums = (match) => [match[1], match[2]].map((num) => parseInt(num));

  for (let index = 0; index < lines.length; index += 3) {
    const aMatch = lines[index].match(buttonRegex);
    const bMatch = lines[index + 1].match(buttonRegex);
    const prizeMatch = lines[index + 2].match(prizeRegex);

    groups.push({
      a: getNums(aMatch),
      b: getNums(bMatch),
      prize: getNums(prizeMatch),
    });
  }

  const round = (num) => {
    const precision = 0.0000000001;
    if (Math.abs(Math.round(num) - num) < precision) {
      return Math.round(num);
    }
    return 0;
  };

  let total = 0;

  for (const group of groups) {
    const [A0, A1] = group.a;
    const [B0, B1] = group.b;
    const [P0, P1] = group.prize;

    const bRaw = (P1 - (A1 / A0) * P0) / ((A1 / A0) * -B0 + B1);
    const aRaw = (P0 - B0 * bRaw) / A0;
    const a = round(aRaw);
    const b = round(bRaw);

    total += 3 * a + b;
  }

  return total;
})();

// part two
(() => {
  /*
  Fraction.js v5.2.1 11/17/2024
  https://raw.org/article/rational-numbers-in-javascript/

  Copyright (c) 2024, Robert Eisele (https://raw.org/)
  Licensed under the MIT license.
  */
  /*
  MIT License

  Copyright (c) 2024 Robert Eisele

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  */
  // prettier-ignore
  (function(E){function C(){return Error("Parameters must be integer")}function w(){return Error("Invalid argument")}function A(){return Error("Division by Zero")}function p(a,b){var d=g,c=h;let f=h;if(void 0!==a&&null!==a)if(void 0!==b){if("bigint"===typeof a)d=a;else{if(isNaN(a))throw w();if(0!==a%1)throw C();d=BigInt(a)}if("bigint"===typeof b)c=b;else{if(isNaN(b))throw w();if(0!==b%1)throw C();c=BigInt(b)}f=d*c}else if("object"===typeof a){if("d"in a&&"n"in a)d=BigInt(a.n),c=BigInt(a.d),"s"in a&&(d*=BigInt(a.s));else if(0 in a)d=BigInt(a[0]),1 in a&&(c=BigInt(a[1]));else if("bigint"===typeof a)d=a;else throw w();f=d*c}else if("number"===typeof a){if(isNaN(a))throw w();0>a&&(f=-h,a=-a);if(0===a%1)d=BigInt(a);else if(0<a){b=1;var k=0,l=1,m=1;let q=1;1<=a&&(b=10**Math.floor(1+Math.log10(a)),a/=b);for(;1E7>=l&&1E7>=q;)if(c=(k+m)/(l+q),a===c){1E7>=l+q?(d=k+m,c=l+q):q>l?(d=m,c=q):(d=k,c=l);break}else a>c?(k+=m,l+=q):(m+=k,q+=l),1E7<l?(d=m,c=q):(d=k,c=l);d=BigInt(d)*BigInt(b);c=BigInt(c)}}else if("string"===typeof a){c=0;k=b=d=g;l=m=h;a=a.replace(/_/g,"").match(/d+|./g);if(null===a)throw w();"-"===a[c]?(f=-h,c++):"+"===a[c]&&c++;if(a.length===c+1)b=v(a[c++],f);else if("."===a[c+1]||"."===a[c]){"."!==a[c]&&(d=v(a[c++],f));c++;if(c+1===a.length||"("===a[c+1]&&")"===a[c+3]||"'"===a[c+1]&&"'"===a[c+3])b=v(a[c],f),m=r**BigInt(a[c].length),c++;if("("===a[c]&&")"===a[c+2]||"'"===a[c]&&"'"===a[c+2])k=v(a[c+1],f),l=r**BigInt(a[c+1].length)-h,c+=3}else"/"===a[c+1]||":"===a[c+1]?(b=v(a[c],f),m=v(a[c+2],h),c+=3):"/"===a[c+3]&&" "===a[c+1]&&(d=v(a[c],f),b=v(a[c+2],f),m=v(a[c+4],h),c+=5);if(a.length<=c)c=m*l,f=d=k+c*d+l*b;else throw w();}else if("bigint"===typeof a)f=d=a,c=h;else throw w();if(c===g)throw A();e.s=f<g?-h:h;e.n=d<g?-d:d;e.d=c<g?-c:c}function v(a,b){try{a=BigInt(a)}catch(d){throw w();}return a*b}function t(a){return"bigint"===typeof a?a:Math.floor(a)}function n(a,b){if(b===g)throw A();const d=Object.create(u.prototype);d.s=a<g?-h:h;a=a<g?-a:a;const c=x(a,b);d.n=a/c;d.d=b/c;return d}function y(a){const b={};let d=a,c=z,f=B-h;for(;f<=d;){for(;d%c===g;)d/=c,b[c]=(b[c]||g)+h;f+=h+z*c++}d!==a?1<d&&(b[d]=(b[d]||g)+h):b[a]=(b[a]||g)+h;return b}function x(a,b){if(!a)return b;if(!b)return a;for(;;){a%=b;if(!a)return b;b%=a;if(!b)return a}}function u(a,b){p(a,b);if(this instanceof u)a=x(e.d,e.n),this.s=e.s,this.n=e.n/a,this.d=e.d/a;else return n(e.s*e.n,e.d)}"undefined"===typeof BigInt&&(BigInt=function(a){if(isNaN(a))throw Error("");return a});const g=BigInt(0),h=BigInt(1),z=BigInt(2),B=BigInt(5),r=BigInt(10),e={s:h,n:g,d:h};u.prototype={s:h,n:g,d:h,abs:function(){return n(this.n,this.d)},neg:function(){return n(-this.s*this.n,this.d)},add:function(a,b){p(a,b);return n(this.s*this.n*e.d+e.s*this.d*e.n,this.d*e.d)},sub:function(a,b){p(a,b);return n(this.s*this.n*e.d-e.s*this.d*e.n,this.d*e.d)},mul:function(a,b){p(a,b);return n(this.s*e.s*this.n*e.n,this.d*e.d)},div:function(a,b){p(a,b);return n(this.s*e.s*this.n*e.d,this.d*e.n)},clone:function(){return n(this.s*this.n,this.d)},mod:function(a,b){if(void 0===a)return n(this.s*this.n%this.d,h);p(a,b);if(g===e.n*this.d)throw A();return n(this.s*e.d*this.n%(e.n*this.d),e.d*this.d)},gcd:function(a,b){p(a,b);return n(x(e.n,this.n)*x(e.d,this.d),e.d*this.d)},lcm:function(a,b){p(a,b);return e.n===g&&this.n===g?n(g,h):n(e.n*this.n,x(e.n,this.n)*x(e.d,this.d))},inverse:function(){return n(this.s*this.d,this.n)},pow:function(a,b){p(a,b);if(e.d===h)return e.s<g?n((this.s*this.d)**e.n,this.n**e.n):n((this.s*this.n)**e.n,this.d**e.n);if(this.s<g)return null;a=y(this.n);b=y(this.d);let d=h,c=h;for(let f in a)if("1"!==f){if("0"===f){d=g;break}a[f]*=e.n;if(a[f]%e.d===g)a[f]/=e.d;else return null;d*=BigInt(f)**a[f]}for(let f in b)if("1"!==f){b[f]*=e.n;if(b[f]%e.d===g)b[f]/=e.d;else return null;c*=BigInt(f)**b[f]}return e.s<g?n(c,d):n(d,c)},log:function(a,b){p(a,b);if(this.s<=g||e.s<=g)return null;var d={};a=y(e.n);const c=y(e.d);b=y(this.n);const f=y(this.d);for(var k in c)a[k]=(a[k]||g)-c[k];for(var l in f)b[l]=(b[l]||g)-f[l];for(var m in a)"1"!==m&&(d[m]=!0);for(var q in b)"1"!==q&&(d[q]=!0);l=k=null;for(const D in d)if(m=a[D]||g,d=b[D]||g,m===g){if(d!==g)return null}else if(q=x(d,m),d/=q,m/=q,null===k&&null===l)k=d,l=m;else if(d*l!==k*m)return null;return null!==k&&null!==l?n(k,l):null},equals:function(a,b){p(a,b);return this.s*this.n*e.d===e.s*e.n*this.d},lt:function(a,b){p(a,b);return this.s*this.n*e.d<e.s*e.n*this.d},lte:function(a,b){p(a,b);return this.s*this.n*e.d<=e.s*e.n*this.d},gt:function(a,b){p(a,b);return this.s*this.n*e.d>e.s*e.n*this.d},gte:function(a,b){p(a,b);return this.s*this.n*e.d>=e.s*e.n*this.d},compare:function(a,b){p(a,b);a=this.s*this.n*e.d-e.s*e.n*this.d;return(g<a)-(a<g)},ceil:function(a){a=r**BigInt(a||0);return n(t(this.s*a*this.n/this.d)+(a*this.n%this.d>g&&this.s>=g?h:g),a)},floor:function(a){a=r**BigInt(a||0);return n(t(this.s*a*this.n/this.d)-(a*this.n%this.d>g&&this.s<g?h:g),a)},round:function(a){a=r**BigInt(a||0);return n(t(this.s*a*this.n/this.d)+this.s*((this.s>=g?h:g)+a*this.n%this.d*z>this.d?h:g),a)},roundTo:function(a,b){p(a,b);var d=this.n*e.d;a=this.d*e.n;b=d%a;d=t(d/a);b+b>=a&&d++;return n(this.s*d*e.n,e.d)},divisible:function(a,b){p(a,b);return!(!(e.n*this.d)||this.n*e.d%(e.n*this.d))},valueOf:function(){return Number(this.s*this.n)/Number(this.d)},toString:function(a){let b=this.n,d=this.d;a=a||15;var c;a:{for(c=d;c%z===g;c/=z);for(;c%B===g;c/=B);if(c===h)c=g;else{for(var f=r%c,k=1;f!==h;k++)if(f=f*r%c,2E3<k){c=g;break a}c=BigInt(k)}}a:{f=h;k=r;var l=c;let m=h;for(;l>g;k=k*k%d,l>>=h)l&h&&(m=m*k%d);k=m;for(l=0;300>l;l++){if(f===k){f=BigInt(l);break a}f=f*r%d;k=k*r%d}f=0}k=f;f=this.s<g?"-":"";f+=t(b/d);(b=b%d*r)&&(f+=".");if(c){for(a=k;a--;)f+=t(b/d),b%=d,b*=r;f+="(";for(a=c;a--;)f+=t(b/d),b%=d,b*=r;f+=")"}else for(;b&&a--;)f+=t(b/d),b%=d,b*=r;return f},toFraction:function(a){let b=this.n,d=this.d,c=this.s<g?"-":"";if(d===h)c+=b;else{let f=t(b/d);a&&f>g&&(c+=f,c+=" ",b%=d);c=c+b+"/"+d}return c},toLatex:function(a){let b=this.n,d=this.d,c=this.s<g?"-":"";if(d===h)c+=b;else{let f=t(b/d);a&&f>g&&(c+=f,b%=d);c=c+"\\frac{"+b+"}{"+d;c+="}"}return c},toContinued:function(){let a=this.n,b=this.d,d=[];do{d.push(t(a/b));let c=a%b;a=b;b=c}while(a!==h);return d},simplify:function(a){a=BigInt(1/(a||.001)|0);const b=this.abs(),d=b.toContinued();for(let f=1;f<d.length;f++){let k=n(d[f-1],h);for(var c=f-2;0<=c;c--)k=k.inverse().add(d[c]);c=k.sub(b);if(c.n*a<c.d)return k.mul(this.s)}return this}};"function"===typeof define&&define.amd?define([],function(){return u}):"object"===typeof exports?(Object.defineProperty(u,"__esModule",{value:!0}),u["default"]=u,u.Fraction=u,module.exports=u):E.Fraction=u})(this);

  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const groups = [];

  const buttonRegex = /Button .: X\+(\d+), Y\+(\d+)/;
  const prizeRegex = /Prize: X=(\d+), Y=(\d+)/;

  const getNums = (match) =>
    [match[1], match[2]].map((num) => new Fraction(parseInt(num)));

  for (let index = 0; index < lines.length; index += 3) {
    const aMatch = lines[index].match(buttonRegex);
    const bMatch = lines[index + 1].match(buttonRegex);
    const prizeMatch = lines[index + 2].match(prizeRegex);

    groups.push({
      a: getNums(aMatch),
      b: getNums(bMatch),
      prize: getNums(prizeMatch),
    });
  }

  let total = new Fraction(0);

  for (const group of groups) {
    const [A0, A1] = group.a;
    const [B0, B1] = group.b;
    const [P0Old, P1Old] = group.prize;
    const P0 = P0Old.add(10000000000000);
    const P1 = P1Old.add(10000000000000);

    const b = P1.sub(A1.div(A0).mul(P0)).div(
      A1.div(A0).mul(B0.mul(-1)).add(B1)
    );
    const a = P0.sub(B0.mul(b)).div(A0);
    if (a.mod().equals(0) && b.mod().equals(0)) {
      total = total.add(a.mul(3).add(b));
    }
  }

  return parseFloat(total.toString());
})();
