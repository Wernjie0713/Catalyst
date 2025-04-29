import{_ as q}from"./Edit-DXeDAiv6.js";import{_ as L}from"./Index-Dw3GaC1u.js";import{_ as T}from"./ConfirmPassword-BMbkTEMx.js";import{_ as I}from"./ForgotPassword-D_IDj4Cs.js";import{_ as U}from"./Login-B-qfw6WX.js";import{_ as N}from"./ProfileCompletion-BbJUhTM9.js";import{_ as M}from"./DepartmentStaffForm-U8tKPUEI.js";import{_ as z}from"./LecturerForm-ClYu4w1I.js";import{_ as D}from"./OrganizerForm-YIexp1DY.js";import{_ as O}from"./StudentForm-ti_zOpnE.js";import{_ as W}from"./UniversityForm-DfK_MJnk.js";import{_ as B}from"./Register-DWinR6pI.js";import{_ as V}from"./ResetPassword-BvChyNVX.js";import{_ as $}from"./RoleSelection-BixD2oOP.js";import{_ as H}from"./VerifyEmail-COK7LBqC.js";import{_ as X}from"./TemplateBuilder-DYhTLzf8.js";import{_ as G}from"./Dashboard-DZ4aq2mt.js";import{_ as J}from"./Create-ndJgE3z8.js";import{_ as K}from"./Edit-R6-69hV1.js";import{_ as Q}from"./Index-CBD-aSNc.js";import{_ as Y}from"./MyEvents-DanoXD0L.js";import{_ as Z}from"./Create-D9AVv4C9.js";import{_ as ee}from"./Index-C4XvuUOe.js";import{_ as re}from"./list-ZRROaB2E.js";import{_ as te}from"./Profile-CPj-0nqP.js";import{_ as oe}from"./Profile-CToPLK85.js";import{_ as se}from"./Profile-D8oXJQSQ.js";import{_ as ie}from"./Profile-FRIRIwlM.js";import{_ as ne}from"./Profile-Dep-0Nyd.js";import{_ as ae}from"./Analytics-CBtITKxb.js";import{_ as _e}from"./Create-CJNzSTo9.js";import{_ as pe}from"./Index-BKeeoOB8.js";import{_ as me}from"./LecturerDashboard-DRf4FtYE.js";import{_ as le}from"./ProjectAnalytics-Cr1EvWj8.js";import{_ as fe}from"./Show-40-jsqR8.js";import{_ as ue}from"./Track-D0ECua74.js";import{_ as ge}from"./Index-C8myMJef.js";import{_ as de}from"./Index-DMERON1a.js";import{_ as ce}from"./Index-Jau7zO9g.js";import{_ as ve}from"./Edit-UMulhfTI.js";import{_ as be}from"./DeleteUserForm-BS0-i6jX.js";import{_ as xe}from"./UpdatePasswordForm-DMYAp-f-.js";import{_ as Pe}from"./UpdateProfileInformationForm-D-PSTD7a.js";import{_ as he}from"./ViewProfile-a20khieW.js";import{_ as je}from"./Welcome-0_MVXm5W.js";import{j as ye}from"./index-D3Bj6weo.js";import{a as Se,b as we}from"./index.esm-CYkcvaz4.js";import{r as ke}from"./index-CfYVbadh.js";import"./AuthenticatedLayout-CETbKJ6G.js";import"./InputError-DflrxOlj.js";import"./PrimaryButton-D4gZOhu_.js";import"./InputLabel-C_GyD9ao.js";import"./TextInput-ClIswWn0.js";import"./GuestLayout-07bPt-st.js";import"./index-Q_A5jwmA.js";import"./Aurora-71ehcu6u.js";import"./TiltedEventCard-Do0gWiOZ.js";import"./EventModal-B5GJCxdP.js";import"./index-IFTv2SK_.js";import"./proxy-0rKmIGA_.js";import"./format-CIQCzDyo.js";import"./DisplayProfilePhoto-FZSZ12eh.js";import"./TextArea-8YKc5Ae-.js";import"./BackButton-C51yjjBG.js";import"./Modal-CW1t60JH.js";import"./transition-dgGWWUwo.js";import"./FriendRequestButton-XssrZgSy.js";import"./PersonalInformation-C29ezYVK.js";import"./PersonalInformation-VZjRZH7o.js";import"./PersonalInformation-BwSyu03v.js";import"./PersonalInformation-CpNkp1LQ.js";import"./PersonalInformation-Dwo-AHFD.js";import"./SecondaryButton-Cr4unrZI.js";import"./DocumentTextIcon-CNfyh02U.js";import"./index-D_y5qTKP.js";window.axios=Se;window.axios.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";var S={},E;function Ce(){if(E)return S;E=1;var a=ke();return S.createRoot=a.createRoot,S.hydrateRoot=a.hydrateRoot,S}var Ee=Ce(),C={},w={exports:{}};/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */var Re=w.exports,R;function Ae(){return R||(R=1,function(a,p){(function(t,s){a.exports=s()})(Re,function(){var t={};t.version="0.2.0";var s=t.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};t.configure=function(e){var r,o;for(r in e)o=e[r],o!==void 0&&e.hasOwnProperty(r)&&(s[r]=o);return this},t.status=null,t.set=function(e){var r=t.isStarted();e=x(e,s.minimum,1),t.status=e===1?null:e;var o=t.render(!r),i=o.querySelector(s.barSelector),m=s.speed,g=s.easing;return o.offsetWidth,_(function(n){s.positionUsing===""&&(s.positionUsing=t.getPositioningCSS()),u(i,k(e,m,g)),e===1?(u(o,{transition:"none",opacity:1}),o.offsetWidth,setTimeout(function(){u(o,{transition:"all "+m+"ms linear",opacity:0}),setTimeout(function(){t.remove(),n()},m)},m)):setTimeout(n,m)}),this},t.isStarted=function(){return typeof t.status=="number"},t.start=function(){t.status||t.set(0);var e=function(){setTimeout(function(){t.status&&(t.trickle(),e())},s.trickleSpeed)};return s.trickle&&e(),this},t.done=function(e){return!e&&!t.status?this:t.inc(.3+.5*Math.random()).set(1)},t.inc=function(e){var r=t.status;return r?(typeof e!="number"&&(e=(1-r)*x(Math.random()*r,.1,.95)),r=x(r+e,0,.994),t.set(r)):t.start()},t.trickle=function(){return t.inc(Math.random()*s.trickleRate)},function(){var e=0,r=0;t.promise=function(o){return!o||o.state()==="resolved"?this:(r===0&&t.start(),e++,r++,o.always(function(){r--,r===0?(e=0,t.done()):t.set((e-r)/e)}),this)}}(),t.render=function(e){if(t.isRendered())return document.getElementById("nprogress");h(document.documentElement,"nprogress-busy");var r=document.createElement("div");r.id="nprogress",r.innerHTML=s.template;var o=r.querySelector(s.barSelector),i=e?"-100":c(t.status||0),m=document.querySelector(s.parent),g;return u(o,{transition:"all 0 linear",transform:"translate3d("+i+"%,0,0)"}),s.showSpinner||(g=r.querySelector(s.spinnerSelector),g&&y(g)),m!=document.body&&h(m,"nprogress-custom-parent"),m.appendChild(r),r},t.remove=function(){j(document.documentElement,"nprogress-busy"),j(document.querySelector(s.parent),"nprogress-custom-parent");var e=document.getElementById("nprogress");e&&y(e)},t.isRendered=function(){return!!document.getElementById("nprogress")},t.getPositioningCSS=function(){var e=document.body.style,r="WebkitTransform"in e?"Webkit":"MozTransform"in e?"Moz":"msTransform"in e?"ms":"OTransform"in e?"O":"";return r+"Perspective"in e?"translate3d":r+"Transform"in e?"translate":"margin"};function x(e,r,o){return e<r?r:e>o?o:e}function c(e){return(-1+e)*100}function k(e,r,o){var i;return s.positionUsing==="translate3d"?i={transform:"translate3d("+c(e)+"%,0,0)"}:s.positionUsing==="translate"?i={transform:"translate("+c(e)+"%,0)"}:i={"margin-left":c(e)+"%"},i.transition="all "+r+"ms "+o,i}var _=function(){var e=[];function r(){var o=e.shift();o&&o(r)}return function(o){e.push(o),e.length==1&&r()}}(),u=function(){var e=["Webkit","O","Moz","ms"],r={};function o(n){return n.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(l,f){return f.toUpperCase()})}function i(n){var l=document.body.style;if(n in l)return n;for(var f=e.length,b=n.charAt(0).toUpperCase()+n.slice(1),d;f--;)if(d=e[f]+b,d in l)return d;return n}function m(n){return n=o(n),r[n]||(r[n]=i(n))}function g(n,l,f){l=m(l),n.style[l]=f}return function(n,l){var f=arguments,b,d;if(f.length==2)for(b in l)d=l[b],d!==void 0&&l.hasOwnProperty(b)&&g(n,b,d);else g(n,f[1],f[2])}}();function P(e,r){var o=typeof e=="string"?e:v(e);return o.indexOf(" "+r+" ")>=0}function h(e,r){var o=v(e),i=o+r;P(o,r)||(e.className=i.substring(1))}function j(e,r){var o=v(e),i;P(e,r)&&(i=o.replace(" "+r+" "," "),e.className=i.substring(1,i.length-1))}function v(e){return(" "+(e.className||"")+" ").replace(/\s+/gi," ")}function y(e){e&&e.parentNode&&e.parentNode.removeChild(e)}return t})}(w)),w.exports}var A;function Fe(){if(A)return C;A=1;var a,p=(a=Ae())&&typeof a=="object"&&"default"in a?a.default:a,t=null;function s(_){document.addEventListener("inertia:start",x.bind(null,_)),document.addEventListener("inertia:progress",c),document.addEventListener("inertia:finish",k)}function x(_){t=setTimeout(function(){return p.start()},_)}function c(_){p.isStarted()&&_.detail.progress.percentage&&p.set(Math.max(p.status,_.detail.progress.percentage/100*.9))}function k(_){clearTimeout(t),p.isStarted()&&(_.detail.visit.completed?p.done():_.detail.visit.interrupted?p.set(0):_.detail.visit.cancelled&&(p.done(),p.remove()))}return C.InertiaProgress={init:function(_){var u=_===void 0?{}:_,P=u.delay,h=u.color,j=h===void 0?"#29d":h,v=u.includeCSS,y=v===void 0||v,e=u.showSpinner,r=e!==void 0&&e;s(P===void 0?250:P),p.configure({showSpinner:r}),y&&function(o){var i=document.createElement("style");i.type="text/css",i.textContent=`
    #nprogress {
      pointer-events: none;
    }

    #nprogress .bar {
      background: `+o+`;

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
      box-shadow: 0 0 10px `+o+", 0 0 5px "+o+`;
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
      border-top-color: `+o+`;
      border-left-color: `+o+`;
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
  `,document.head.appendChild(i)}(j)}},C}var qe=Fe();const F="Catalyst";we({title:a=>a?`${a} - ${F}`:F,resolve:a=>{const t=Object.assign({"./Pages/Admin/Roles/Edit.jsx":q,"./Pages/Admin/Roles/Index.jsx":L,"./Pages/Auth/ConfirmPassword.jsx":T,"./Pages/Auth/ForgotPassword.jsx":I,"./Pages/Auth/Login.jsx":U,"./Pages/Auth/ProfileCompletion.jsx":N,"./Pages/Auth/ProfileForms/DepartmentStaffForm.jsx":M,"./Pages/Auth/ProfileForms/LecturerForm.jsx":z,"./Pages/Auth/ProfileForms/OrganizerForm.jsx":D,"./Pages/Auth/ProfileForms/StudentForm.jsx":O,"./Pages/Auth/ProfileForms/UniversityForm.jsx":W,"./Pages/Auth/Register.jsx":B,"./Pages/Auth/ResetPassword.jsx":V,"./Pages/Auth/RoleSelection.jsx":$,"./Pages/Auth/VerifyEmail.jsx":H,"./Pages/Certificates/TemplateBuilder.jsx":X,"./Pages/Dashboard.jsx":G,"./Pages/Events/Create.jsx":J,"./Pages/Events/Edit.jsx":K,"./Pages/Events/Index.jsx":Q,"./Pages/Events/MyEvents.jsx":Y,"./Pages/Feedback/Create.jsx":Z,"./Pages/Feedback/Index.jsx":ee,"./Pages/Friend/list.jsx":re,"./Pages/Profile/DepartmentStaff/Profile.jsx":te,"./Pages/Profile/Lecturer/Profile.jsx":oe,"./Pages/Profile/Organizer/Profile.jsx":se,"./Pages/Profile/Student/Profile.jsx":ie,"./Pages/Profile/University/Profile.jsx":ne,"./Pages/Projects/Analytics.jsx":ae,"./Pages/Projects/Create.jsx":_e,"./Pages/Projects/Index.jsx":pe,"./Pages/Projects/LecturerDashboard.jsx":me,"./Pages/Projects/ProjectAnalytics.jsx":le,"./Pages/Projects/Show.jsx":fe,"./Pages/Projects/Track.jsx":ue,"./Pages/Reports/Admin/Index.jsx":ge,"./Pages/Reports/Department/Index.jsx":de,"./Pages/Reports/University/Index.jsx":ce,"./Pages/Settings/Edit.jsx":ve,"./Pages/Settings/Partials/DeleteUserForm.jsx":be,"./Pages/Settings/Partials/UpdatePasswordForm.jsx":xe,"./Pages/Settings/Partials/UpdateProfileInformationForm.jsx":Pe,"./Pages/ViewProfile.jsx":he,"./Pages/Welcome.jsx":je})[`./Pages/${a}.jsx`];if(!t)throw new Error(`Page not found: ${a}`);return t},setup({el:a,App:p,props:t}){Ee.createRoot(a).render(ye.jsx(p,{...t}))}});qe.InertiaProgress.init();
