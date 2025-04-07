import{_ as I}from"./Edit-DuQRmWG9.js";import{_ as L}from"./Index-C86samwk.js";import{_ as U}from"./ConfirmPassword-DpiB5gnJ.js";import{_ as A}from"./ForgotPassword-JBDfGyOo.js";import{_ as N}from"./Login-CjvXjvNc.js";import{_ as M}from"./Register-BaotN39B.js";import{_ as z}from"./ResetPassword-16LOz6BV.js";import{_ as O}from"./RoleSelection-7YIdph_N.js";import{_ as D}from"./VerifyEmail-RQ9HWhL7.js";import{_ as F}from"./TemplateBuilder-DvBzw_Rk.js";import{_ as W}from"./Dashboard-8tq_4EsA.js";import{_ as B}from"./Create-CedB0YRH.js";import{_ as V}from"./Edit-DzlD43ku.js";import{_ as $}from"./Index-BDtGtg7K.js";import{_ as H}from"./MyEvents-DYwkxdPw.js";import{_ as X}from"./Create-UdZFerpI.js";import{_ as G}from"./Index-DYM0uSG5.js";import{_ as J}from"./list-D9HIrZUz.js";import{_ as K}from"./Profile-CX00TCqf.js";import{_ as Q}from"./Profile-CdOpNAmc.js";import{_ as Y}from"./Profile-CaLnvn3a.js";import{_ as Z}from"./Profile-CfPYVQGS.js";import{_ as ee}from"./Profile-C41R5o6r.js";import{_ as te}from"./Index-RbYJG0U7.js";import{_ as re}from"./Index-DaQqJgtr.js";import{_ as ne}from"./Index-_438EHc0.js";import{_ as se}from"./Edit-Cu8VS301.js";import{_ as ie}from"./DeleteUserForm-BUC6mCab.js";import{_ as oe}from"./UpdatePasswordForm-XqTkZ_We.js";import{_ as ae}from"./UpdateProfileInformationForm-BzRrenTp.js";import{_ as pe}from"./ViewProfile-Buf0s505.js";import{_ as le}from"./Welcome-DEcombXz.js";import{a as _e,b as ue,j as me}from"./index.esm-DYHbi2wE.js";import{r as fe}from"./index-BdFZFnLD.js";import"./AuthenticatedLayout-B8ZFME79.js";import"./InputError-DDtAwo1I.js";import"./PrimaryButton-D7dWA5bS.js";import"./InputLabel-DQ2J_py9.js";import"./TextInput-B6-dr-e6.js";import"./GuestLayout-DwEvnI_9.js";import"./index-BIlkxjyu.js";import"./Aurora-BAGSavrW.js";import"./TiltedEventCard-CZK4S-c8.js";import"./EventModal-gIJkeG9v.js";import"./index-CkxCHxkU.js";import"./proxy-oAEZJcFV.js";import"./format-fR2ARjQC.js";import"./DisplayProfilePhoto-JFqyhybw.js";import"./TextArea-CmHH9Tb8.js";import"./BackButton-BJShCE3w.js";import"./Modal-CitSm-79.js";import"./transition-DTKzzgZY.js";import"./FriendRequestButton-Cj-t0Ldt.js";import"./PersonalInformation-B9coFuut.js";import"./PersonalInformation-jEbd8ArU.js";import"./PersonalInformation-Q2jKDLTg.js";import"./PersonalInformation-5-RUi_6I.js";import"./PersonalInformation-DxgF2KcG.js";import"./index-z80RvGVh.js";window.axios=_e;window.axios.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";var j={},R;function de(){if(R)return j;R=1;var a=fe();return j.createRoot=a.createRoot,j.hydrateRoot=a.hydrateRoot,j}var ge=de(),E={},w={exports:{}};/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */var ce=w.exports,C;function ve(){return C||(C=1,function(a,l){(function(r,s){a.exports=s()})(ce,function(){var r={};r.version="0.2.0";var s=r.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};r.configure=function(e){var t,n;for(t in e)n=e[t],n!==void 0&&e.hasOwnProperty(t)&&(s[t]=n);return this},r.status=null,r.set=function(e){var t=r.isStarted();e=x(e,s.minimum,1),r.status=e===1?null:e;var n=r.render(!t),i=n.querySelector(s.barSelector),_=s.speed,d=s.easing;return n.offsetWidth,p(function(o){s.positionUsing===""&&(s.positionUsing=r.getPositioningCSS()),f(i,k(e,_,d)),e===1?(f(n,{transition:"none",opacity:1}),n.offsetWidth,setTimeout(function(){f(n,{transition:"all "+_+"ms linear",opacity:0}),setTimeout(function(){r.remove(),o()},_)},_)):setTimeout(o,_)}),this},r.isStarted=function(){return typeof r.status=="number"},r.start=function(){r.status||r.set(0);var e=function(){setTimeout(function(){r.status&&(r.trickle(),e())},s.trickleSpeed)};return s.trickle&&e(),this},r.done=function(e){return!e&&!r.status?this:r.inc(.3+.5*Math.random()).set(1)},r.inc=function(e){var t=r.status;return t?(typeof e!="number"&&(e=(1-t)*x(Math.random()*t,.1,.95)),t=x(t+e,0,.994),r.set(t)):r.start()},r.trickle=function(){return r.inc(Math.random()*s.trickleRate)},function(){var e=0,t=0;r.promise=function(n){return!n||n.state()==="resolved"?this:(t===0&&r.start(),e++,t++,n.always(function(){t--,t===0?(e=0,r.done()):r.set((e-t)/e)}),this)}}(),r.render=function(e){if(r.isRendered())return document.getElementById("nprogress");h(document.documentElement,"nprogress-busy");var t=document.createElement("div");t.id="nprogress",t.innerHTML=s.template;var n=t.querySelector(s.barSelector),i=e?"-100":c(r.status||0),_=document.querySelector(s.parent),d;return f(n,{transition:"all 0 linear",transform:"translate3d("+i+"%,0,0)"}),s.showSpinner||(d=t.querySelector(s.spinnerSelector),d&&S(d)),_!=document.body&&h(_,"nprogress-custom-parent"),_.appendChild(t),t},r.remove=function(){y(document.documentElement,"nprogress-busy"),y(document.querySelector(s.parent),"nprogress-custom-parent");var e=document.getElementById("nprogress");e&&S(e)},r.isRendered=function(){return!!document.getElementById("nprogress")},r.getPositioningCSS=function(){var e=document.body.style,t="WebkitTransform"in e?"Webkit":"MozTransform"in e?"Moz":"msTransform"in e?"ms":"OTransform"in e?"O":"";return t+"Perspective"in e?"translate3d":t+"Transform"in e?"translate":"margin"};function x(e,t,n){return e<t?t:e>n?n:e}function c(e){return(-1+e)*100}function k(e,t,n){var i;return s.positionUsing==="translate3d"?i={transform:"translate3d("+c(e)+"%,0,0)"}:s.positionUsing==="translate"?i={transform:"translate("+c(e)+"%,0)"}:i={"margin-left":c(e)+"%"},i.transition="all "+t+"ms "+n,i}var p=function(){var e=[];function t(){var n=e.shift();n&&n(t)}return function(n){e.push(n),e.length==1&&t()}}(),f=function(){var e=["Webkit","O","Moz","ms"],t={};function n(o){return o.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(u,m){return m.toUpperCase()})}function i(o){var u=document.body.style;if(o in u)return o;for(var m=e.length,b=o.charAt(0).toUpperCase()+o.slice(1),g;m--;)if(g=e[m]+b,g in u)return g;return o}function _(o){return o=n(o),t[o]||(t[o]=i(o))}function d(o,u,m){u=_(u),o.style[u]=m}return function(o,u){var m=arguments,b,g;if(m.length==2)for(b in u)g=u[b],g!==void 0&&u.hasOwnProperty(b)&&d(o,b,g);else d(o,m[1],m[2])}}();function P(e,t){var n=typeof e=="string"?e:v(e);return n.indexOf(" "+t+" ")>=0}function h(e,t){var n=v(e),i=n+t;P(n,t)||(e.className=i.substring(1))}function y(e,t){var n=v(e),i;P(e,t)&&(i=n.replace(" "+t+" "," "),e.className=i.substring(1,i.length-1))}function v(e){return(" "+(e.className||"")+" ").replace(/\s+/gi," ")}function S(e){e&&e.parentNode&&e.parentNode.removeChild(e)}return r})}(w)),w.exports}var q;function be(){if(q)return E;q=1;var a,l=(a=ve())&&typeof a=="object"&&"default"in a?a.default:a,r=null;function s(p){document.addEventListener("inertia:start",x.bind(null,p)),document.addEventListener("inertia:progress",c),document.addEventListener("inertia:finish",k)}function x(p){r=setTimeout(function(){return l.start()},p)}function c(p){l.isStarted()&&p.detail.progress.percentage&&l.set(Math.max(l.status,p.detail.progress.percentage/100*.9))}function k(p){clearTimeout(r),l.isStarted()&&(p.detail.visit.completed?l.done():p.detail.visit.interrupted?l.set(0):p.detail.visit.cancelled&&(l.done(),l.remove()))}return E.InertiaProgress={init:function(p){var f=p===void 0?{}:p,P=f.delay,h=f.color,y=h===void 0?"#29d":h,v=f.includeCSS,S=v===void 0||v,e=f.showSpinner,t=e!==void 0&&e;s(P===void 0?250:P),l.configure({showSpinner:t}),S&&function(n){var i=document.createElement("style");i.type="text/css",i.textContent=`
    #nprogress {
      pointer-events: none;
    }

    #nprogress .bar {
      background: `+n+`;

      position: fixed;
      z-index: 1031;
      top: 0;
      left: 0;

      width: 100%;
      height: 2px;
    }

    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px `+n+", 0 0 5px "+n+`;
      opacity: 1.0;

      -webkit-transform: rotate(3deg) translate(0px, -4px);
          -ms-transform: rotate(3deg) translate(0px, -4px);
              transform: rotate(3deg) translate(0px, -4px);
    }

    #nprogress .spinner {
      display: block;
      position: fixed;
      z-index: 1031;
      top: 15px;
      right: 15px;
    }

    #nprogress .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;

      border: solid 2px transparent;
      border-top-color: `+n+`;
      border-left-color: `+n+`;
      border-radius: 50%;

      -webkit-animation: nprogress-spinner 400ms linear infinite;
              animation: nprogress-spinner 400ms linear infinite;
    }

    .nprogress-custom-parent {
      overflow: hidden;
      position: relative;
    }

    .nprogress-custom-parent #nprogress .spinner,
    .nprogress-custom-parent #nprogress .bar {
      position: absolute;
    }

    @-webkit-keyframes nprogress-spinner {
      0%   { -webkit-transform: rotate(0deg); }
      100% { -webkit-transform: rotate(360deg); }
    }
    @keyframes nprogress-spinner {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,document.head.appendChild(i)}(y)}},E}var xe=be();const T="Catalyst";ue({title:a=>a?`${a} - ${T}`:T,resolve:a=>{const r=Object.assign({"./Pages/Admin/Roles/Edit.jsx":I,"./Pages/Admin/Roles/Index.jsx":L,"./Pages/Auth/ConfirmPassword.jsx":U,"./Pages/Auth/ForgotPassword.jsx":A,"./Pages/Auth/Login.jsx":N,"./Pages/Auth/Register.jsx":M,"./Pages/Auth/ResetPassword.jsx":z,"./Pages/Auth/RoleSelection.jsx":O,"./Pages/Auth/VerifyEmail.jsx":D,"./Pages/Certificates/TemplateBuilder.jsx":F,"./Pages/Dashboard.jsx":W,"./Pages/Events/Create.jsx":B,"./Pages/Events/Edit.jsx":V,"./Pages/Events/Index.jsx":$,"./Pages/Events/MyEvents.jsx":H,"./Pages/Feedback/Create.jsx":X,"./Pages/Feedback/Index.jsx":G,"./Pages/Friend/list.jsx":J,"./Pages/Profile/DepartmentStaff/Profile.jsx":K,"./Pages/Profile/Lecturer/Profile.jsx":Q,"./Pages/Profile/Organizer/Profile.jsx":Y,"./Pages/Profile/Student/Profile.jsx":Z,"./Pages/Profile/University/Profile.jsx":ee,"./Pages/Reports/Admin/Index.jsx":te,"./Pages/Reports/Department/Index.jsx":re,"./Pages/Reports/University/Index.jsx":ne,"./Pages/Settings/Edit.jsx":se,"./Pages/Settings/Partials/DeleteUserForm.jsx":ie,"./Pages/Settings/Partials/UpdatePasswordForm.jsx":oe,"./Pages/Settings/Partials/UpdateProfileInformationForm.jsx":ae,"./Pages/ViewProfile.jsx":pe,"./Pages/Welcome.jsx":le})[`./Pages/${a}.jsx`];if(!r)throw new Error(`Page not found: ${a}`);return r},setup({el:a,App:l,props:r}){ge.createRoot(a).render(me.jsx(l,{...r}))}});xe.InertiaProgress.init();
