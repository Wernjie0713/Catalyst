import{_ as A}from"./Edit-BcB7KV3W.js";import{_ as I}from"./Index-C5kQywL3.js";import{_ as L}from"./ConfirmPassword-DpiB5gnJ.js";import{_ as U}from"./ForgotPassword-JBDfGyOo.js";import{_ as N}from"./Login-Cb8yykUx.js";import{_ as M}from"./Register-o-Pao8Oi.js";import{_ as z}from"./ResetPassword-16LOz6BV.js";import{_ as D}from"./RoleSelection-7YIdph_N.js";import{_ as O}from"./VerifyEmail-RQ9HWhL7.js";import{_ as F}from"./TemplateBuilder-DcLUmWTx.js";import{_ as W}from"./Dashboard-U62tlhQM.js";import{_ as B}from"./Create-BCf0b7Qs.js";import{_ as V}from"./Edit-u9fiRE8X.js";import{_ as $}from"./Index-DWu0xVJA.js";import{_ as H}from"./MyEvents-CluXlCWA.js";import{_ as X}from"./Create-CpyIPzWO.js";import{_ as G}from"./Index-Usj9FsSf.js";import{_ as J}from"./list-BqxGT3sG.js";import{_ as K}from"./Profile-CDlm5_lI.js";import{_ as Q}from"./Profile-CnKkKjz9.js";import{_ as Y}from"./Profile-BRLH702k.js";import{_ as Z}from"./Profile-Cc0k6drL.js";import{_ as ee}from"./Profile-BB8OmxKm.js";import{_ as te}from"./Analytics-DnoD4XPW.js";import{_ as re}from"./Create-C3yo0c0-.js";import{_ as se}from"./Index-BbU5vT2B.js";import{_ as oe}from"./LecturerDashboard-BI8pDZJS.js";import{_ as ne}from"./ProjectAnalytics-Bni6uxRp.js";import{_ as ie}from"./Show-v-8GLOid.js";import{_ as ae}from"./Track-D0ECua74.js";import{_ as _e}from"./Index-DzwNfEkp.js";import{_ as pe}from"./Index-D7fkQvXc.js";import{_ as le}from"./Index-C5y6S3C7.js";import{_ as me}from"./Edit-v0s6vX-e.js";import{_ as ue}from"./DeleteUserForm-BxP7qJ4E.js";import{_ as fe}from"./UpdatePasswordForm-XqTkZ_We.js";import{_ as de}from"./UpdateProfileInformationForm-BzRrenTp.js";import{_ as ge}from"./ViewProfile-oN9ZgYzL.js";import{_ as ce}from"./Welcome-DEcombXz.js";import{a as ve,b as be,j as xe}from"./index.esm-DYHbi2wE.js";import{r as Pe}from"./index-BdFZFnLD.js";import"./AuthenticatedLayout-C7BwTL0r.js";import"./InputError-DDtAwo1I.js";import"./PrimaryButton-D7dWA5bS.js";import"./InputLabel-DQ2J_py9.js";import"./TextInput-B6-dr-e6.js";import"./GuestLayout-DwEvnI_9.js";import"./index-BiLPlKNU.js";import"./Aurora-BAGSavrW.js";import"./TiltedEventCard-DndYdjV7.js";import"./EventModal-B-rowo8j.js";import"./index-CkxCHxkU.js";import"./proxy-oAEZJcFV.js";import"./format-C9qPCfVZ.js";import"./DisplayProfilePhoto-JFqyhybw.js";import"./TextArea-CmHH9Tb8.js";import"./BackButton-Btkur5XL.js";import"./Modal-CitSm-79.js";import"./transition-DTKzzgZY.js";import"./FriendRequestButton-DSm7-oZs.js";import"./PersonalInformation-Bs8oC_hp.js";import"./PersonalInformation-Dmx22V1F.js";import"./PersonalInformation-DkxBlmQc.js";import"./PersonalInformation-CfIyLb68.js";import"./PersonalInformation-C1QVsjy7.js";import"./SecondaryButton-DQtoSKok.js";import"./DocumentTextIcon-Db6R066H.js";import"./index-z80RvGVh.js";window.axios=ve;window.axios.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";var S={},E;function he(){if(E)return S;E=1;var a=Pe();return S.createRoot=a.createRoot,S.hydrateRoot=a.hydrateRoot,S}var je=he(),C={},w={exports:{}};/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */var ye=w.exports,R;function Se(){return R||(R=1,function(a,p){(function(r,o){a.exports=o()})(ye,function(){var r={};r.version="0.2.0";var o=r.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};r.configure=function(e){var t,s;for(t in e)s=e[t],s!==void 0&&e.hasOwnProperty(t)&&(o[t]=s);return this},r.status=null,r.set=function(e){var t=r.isStarted();e=x(e,o.minimum,1),r.status=e===1?null:e;var s=r.render(!t),n=s.querySelector(o.barSelector),l=o.speed,d=o.easing;return s.offsetWidth,_(function(i){o.positionUsing===""&&(o.positionUsing=r.getPositioningCSS()),f(n,k(e,l,d)),e===1?(f(s,{transition:"none",opacity:1}),s.offsetWidth,setTimeout(function(){f(s,{transition:"all "+l+"ms linear",opacity:0}),setTimeout(function(){r.remove(),i()},l)},l)):setTimeout(i,l)}),this},r.isStarted=function(){return typeof r.status=="number"},r.start=function(){r.status||r.set(0);var e=function(){setTimeout(function(){r.status&&(r.trickle(),e())},o.trickleSpeed)};return o.trickle&&e(),this},r.done=function(e){return!e&&!r.status?this:r.inc(.3+.5*Math.random()).set(1)},r.inc=function(e){var t=r.status;return t?(typeof e!="number"&&(e=(1-t)*x(Math.random()*t,.1,.95)),t=x(t+e,0,.994),r.set(t)):r.start()},r.trickle=function(){return r.inc(Math.random()*o.trickleRate)},function(){var e=0,t=0;r.promise=function(s){return!s||s.state()==="resolved"?this:(t===0&&r.start(),e++,t++,s.always(function(){t--,t===0?(e=0,r.done()):r.set((e-t)/e)}),this)}}(),r.render=function(e){if(r.isRendered())return document.getElementById("nprogress");h(document.documentElement,"nprogress-busy");var t=document.createElement("div");t.id="nprogress",t.innerHTML=o.template;var s=t.querySelector(o.barSelector),n=e?"-100":c(r.status||0),l=document.querySelector(o.parent),d;return f(s,{transition:"all 0 linear",transform:"translate3d("+n+"%,0,0)"}),o.showSpinner||(d=t.querySelector(o.spinnerSelector),d&&y(d)),l!=document.body&&h(l,"nprogress-custom-parent"),l.appendChild(t),t},r.remove=function(){j(document.documentElement,"nprogress-busy"),j(document.querySelector(o.parent),"nprogress-custom-parent");var e=document.getElementById("nprogress");e&&y(e)},r.isRendered=function(){return!!document.getElementById("nprogress")},r.getPositioningCSS=function(){var e=document.body.style,t="WebkitTransform"in e?"Webkit":"MozTransform"in e?"Moz":"msTransform"in e?"ms":"OTransform"in e?"O":"";return t+"Perspective"in e?"translate3d":t+"Transform"in e?"translate":"margin"};function x(e,t,s){return e<t?t:e>s?s:e}function c(e){return(-1+e)*100}function k(e,t,s){var n;return o.positionUsing==="translate3d"?n={transform:"translate3d("+c(e)+"%,0,0)"}:o.positionUsing==="translate"?n={transform:"translate("+c(e)+"%,0)"}:n={"margin-left":c(e)+"%"},n.transition="all "+t+"ms "+s,n}var _=function(){var e=[];function t(){var s=e.shift();s&&s(t)}return function(s){e.push(s),e.length==1&&t()}}(),f=function(){var e=["Webkit","O","Moz","ms"],t={};function s(i){return i.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(m,u){return u.toUpperCase()})}function n(i){var m=document.body.style;if(i in m)return i;for(var u=e.length,b=i.charAt(0).toUpperCase()+i.slice(1),g;u--;)if(g=e[u]+b,g in m)return g;return i}function l(i){return i=s(i),t[i]||(t[i]=n(i))}function d(i,m,u){m=l(m),i.style[m]=u}return function(i,m){var u=arguments,b,g;if(u.length==2)for(b in m)g=m[b],g!==void 0&&m.hasOwnProperty(b)&&d(i,b,g);else d(i,u[1],u[2])}}();function P(e,t){var s=typeof e=="string"?e:v(e);return s.indexOf(" "+t+" ")>=0}function h(e,t){var s=v(e),n=s+t;P(s,t)||(e.className=n.substring(1))}function j(e,t){var s=v(e),n;P(e,t)&&(n=s.replace(" "+t+" "," "),e.className=n.substring(1,n.length-1))}function v(e){return(" "+(e.className||"")+" ").replace(/\s+/gi," ")}function y(e){e&&e.parentNode&&e.parentNode.removeChild(e)}return r})}(w)),w.exports}var q;function we(){if(q)return C;q=1;var a,p=(a=Se())&&typeof a=="object"&&"default"in a?a.default:a,r=null;function o(_){document.addEventListener("inertia:start",x.bind(null,_)),document.addEventListener("inertia:progress",c),document.addEventListener("inertia:finish",k)}function x(_){r=setTimeout(function(){return p.start()},_)}function c(_){p.isStarted()&&_.detail.progress.percentage&&p.set(Math.max(p.status,_.detail.progress.percentage/100*.9))}function k(_){clearTimeout(r),p.isStarted()&&(_.detail.visit.completed?p.done():_.detail.visit.interrupted?p.set(0):_.detail.visit.cancelled&&(p.done(),p.remove()))}return C.InertiaProgress={init:function(_){var f=_===void 0?{}:_,P=f.delay,h=f.color,j=h===void 0?"#29d":h,v=f.includeCSS,y=v===void 0||v,e=f.showSpinner,t=e!==void 0&&e;o(P===void 0?250:P),p.configure({showSpinner:t}),y&&function(s){var n=document.createElement("style");n.type="text/css",n.textContent=`
    #nprogress {
      pointer-events: none;
    }

    #nprogress .bar {
      background: `+s+`;

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
      box-shadow: 0 0 10px `+s+", 0 0 5px "+s+`;
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
      border-top-color: `+s+`;
      border-left-color: `+s+`;
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
  `,document.head.appendChild(n)}(j)}},C}var ke=we();const T="Catalyst";be({title:a=>a?`${a} - ${T}`:T,resolve:a=>{const r=Object.assign({"./Pages/Admin/Roles/Edit.jsx":A,"./Pages/Admin/Roles/Index.jsx":I,"./Pages/Auth/ConfirmPassword.jsx":L,"./Pages/Auth/ForgotPassword.jsx":U,"./Pages/Auth/Login.jsx":N,"./Pages/Auth/Register.jsx":M,"./Pages/Auth/ResetPassword.jsx":z,"./Pages/Auth/RoleSelection.jsx":D,"./Pages/Auth/VerifyEmail.jsx":O,"./Pages/Certificates/TemplateBuilder.jsx":F,"./Pages/Dashboard.jsx":W,"./Pages/Events/Create.jsx":B,"./Pages/Events/Edit.jsx":V,"./Pages/Events/Index.jsx":$,"./Pages/Events/MyEvents.jsx":H,"./Pages/Feedback/Create.jsx":X,"./Pages/Feedback/Index.jsx":G,"./Pages/Friend/list.jsx":J,"./Pages/Profile/DepartmentStaff/Profile.jsx":K,"./Pages/Profile/Lecturer/Profile.jsx":Q,"./Pages/Profile/Organizer/Profile.jsx":Y,"./Pages/Profile/Student/Profile.jsx":Z,"./Pages/Profile/University/Profile.jsx":ee,"./Pages/Projects/Analytics.jsx":te,"./Pages/Projects/Create.jsx":re,"./Pages/Projects/Index.jsx":se,"./Pages/Projects/LecturerDashboard.jsx":oe,"./Pages/Projects/ProjectAnalytics.jsx":ne,"./Pages/Projects/Show.jsx":ie,"./Pages/Projects/Track.jsx":ae,"./Pages/Reports/Admin/Index.jsx":_e,"./Pages/Reports/Department/Index.jsx":pe,"./Pages/Reports/University/Index.jsx":le,"./Pages/Settings/Edit.jsx":me,"./Pages/Settings/Partials/DeleteUserForm.jsx":ue,"./Pages/Settings/Partials/UpdatePasswordForm.jsx":fe,"./Pages/Settings/Partials/UpdateProfileInformationForm.jsx":de,"./Pages/ViewProfile.jsx":ge,"./Pages/Welcome.jsx":ce})[`./Pages/${a}.jsx`];if(!r)throw new Error(`Page not found: ${a}`);return r},setup({el:a,App:p,props:r}){je.createRoot(a).render(xe.jsx(p,{...r}))}});ke.InertiaProgress.init();
