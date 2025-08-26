import{_ as q}from"./Edit-BAdsV951.js";import{_ as L}from"./Index-KH6GKHZZ.js";import{_ as T}from"./ConfirmPassword-BMbkTEMx.js";import{_ as I}from"./ForgotPassword-D_IDj4Cs.js";import{_ as U}from"./Login-CI563X-j.js";import{_ as M}from"./ProfileCompletion-CNVJlBhB.js";import{_ as N}from"./DepartmentStaffForm-BoxBD7Tn.js";import{_ as D}from"./LecturerForm-Ch2ZZM0y.js";import{_ as z}from"./OrganizerForm-CftJtbqE.js";import{_ as O}from"./StudentForm-C4Gw_EVv.js";import{_ as W}from"./UniversityForm-PKB-hfbe.js";import{_ as B}from"./Register-CWpBQGt4.js";import{_ as V}from"./ResetPassword-BvChyNVX.js";import{_ as $}from"./RoleSelection-DA0IInI6.js";import{_ as H}from"./VerifyEmail-mOjtn27f.js";import{_ as X}from"./TemplateBuilder-DW96CSo9.js";import{_ as G}from"./Dashboard-CDF3TB_F.js";import{_ as J}from"./Create-CskivFzE.js";import{_ as K}from"./Edit-DW2p9Bd-.js";import{_ as Q}from"./Index-Ccat2gU7.js";import{_ as Y}from"./MyEvents-DUfGf-Vv.js";import{_ as Z}from"./Shared-CPSLxAFb.js";import{_ as ee}from"./Create-C4osYvwz.js";import{_ as re}from"./Index-D98WIf23.js";import{_ as te}from"./list-Btmvwiy1.js";import{_ as oe}from"./FacultyStudents-CdpTMXWl.js";import{_ as se}from"./Dashboard-Bq6Wc0gD.js";import{_ as ie}from"./Profile-9TtcZ2XO.js";import{_ as ne}from"./Profile-CV6h3eaO.js";import{_ as ae}from"./Profile-DAliCUIS.js";import{_ as _e}from"./Profile-BO1GCFaT.js";import{_ as pe}from"./Profile-Be-YrFVW.js";import{_ as me}from"./Analytics-CXzWkYWF.js";import{_ as le}from"./Create-DRkP5lMN.js";import{_ as fe}from"./Index-BWlhiPQn.js";import{_ as ue}from"./ProjectAnalytics-B1IjJ2jH.js";import{_ as ge}from"./ProjectDashboard-CH41m1ay.js";import{_ as de}from"./Show-CCOYjG4c.js";import{_ as ce}from"./Track-D0ECua74.js";import{_ as ve}from"./Index-Dof9hPVb.js";import{_ as be}from"./Index-DQK_JIzE.js";import{_ as Pe}from"./Index-tHfsLRDp.js";import{_ as xe}from"./Edit-aM1SC2RI.js";import{_ as he}from"./DeleteUserForm--Qkd8RcX.js";import{_ as je}from"./UpdatePasswordForm-CBTv1clq.js";import{_ as ye}from"./UpdateProfileInformationForm-C5IYDa4N.js";import{_ as Se}from"./ViewProfile-g7giwbhE.js";import{_ as we}from"./Welcome-DmiJWWu7.js";import{j as ke}from"./index-D3Bj6weo.js";import{a as Ce,b as Ee}from"./index.esm-CYkcvaz4.js";import{r as Re}from"./index-CfYVbadh.js";import"./AuthenticatedLayout-DgmrdonU.js";import"./en-US-DNUEYIb-.js";import"./InputError-DflrxOlj.js";import"./PrimaryButton-D4gZOhu_.js";import"./InputLabel-C_GyD9ao.js";import"./TextInput-ClIswWn0.js";import"./GuestLayout-07bPt-st.js";import"./AuthInput-CpvZLK8W.js";import"./LottieAnimation-DXXHONGt.js";import"./iconBase-C6hKYsF6.js";import"./LoginLayout-CJd1z9ay.js";import"./EventModal-COJyB6y-.js";import"./TagDisplay-Bl1IuvVv.js";import"./proxy-CrpZcEeN.js";import"./index-Dh0BU1j3.js";import"./format-CzgadoOX.js";import"./use-motion-value-BX-IYv_n.js";import"./TextArea-8YKc5Ae-.js";import"./LabelTagsSelector-1YBXN8EQ.js";import"./preload-helper-DPi8upcZ.js";import"./Modal-BIwpINXw.js";import"./transition-dgGWWUwo.js";import"./dialog-Db2lgBmZ.js";import"./DisplayProfilePhoto-DFIzBEor.js";import"./CheckCircleIcon-DRy72VPP.js";import"./ClockIcon-ljP0LaTI.js";import"./FriendRequestButton-C82Mjoh0.js";import"./PersonalInformation-n6pDwumC.js";import"./PersonalInformation-9tsiK6T2.js";import"./PersonalInformation-oF4g6XDl.js";import"./PersonalInformation-DVgat5Ur.js";import"./PersonalInformation-BHOpVqj1.js";import"./SecondaryButton-Cr4unrZI.js";import"./DocumentTextIcon-Bt31Fz68.js";import"./index-BpekFtwt.js";window.axios=Ce;window.axios.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";var S={},E;function Ae(){if(E)return S;E=1;var a=Re();return S.createRoot=a.createRoot,S.hydrateRoot=a.hydrateRoot,S}var Fe=Ae(),C={},w={exports:{}};/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */var qe=w.exports,R;function Le(){return R||(R=1,function(a,p){(function(t,s){a.exports=s()})(qe,function(){var t={};t.version="0.2.0";var s=t.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};t.configure=function(e){var r,o;for(r in e)o=e[r],o!==void 0&&e.hasOwnProperty(r)&&(s[r]=o);return this},t.status=null,t.set=function(e){var r=t.isStarted();e=P(e,s.minimum,1),t.status=e===1?null:e;var o=t.render(!r),i=o.querySelector(s.barSelector),m=s.speed,g=s.easing;return o.offsetWidth,_(function(n){s.positionUsing===""&&(s.positionUsing=t.getPositioningCSS()),u(i,k(e,m,g)),e===1?(u(o,{transition:"none",opacity:1}),o.offsetWidth,setTimeout(function(){u(o,{transition:"all "+m+"ms linear",opacity:0}),setTimeout(function(){t.remove(),n()},m)},m)):setTimeout(n,m)}),this},t.isStarted=function(){return typeof t.status=="number"},t.start=function(){t.status||t.set(0);var e=function(){setTimeout(function(){t.status&&(t.trickle(),e())},s.trickleSpeed)};return s.trickle&&e(),this},t.done=function(e){return!e&&!t.status?this:t.inc(.3+.5*Math.random()).set(1)},t.inc=function(e){var r=t.status;return r?(typeof e!="number"&&(e=(1-r)*P(Math.random()*r,.1,.95)),r=P(r+e,0,.994),t.set(r)):t.start()},t.trickle=function(){return t.inc(Math.random()*s.trickleRate)},function(){var e=0,r=0;t.promise=function(o){return!o||o.state()==="resolved"?this:(r===0&&t.start(),e++,r++,o.always(function(){r--,r===0?(e=0,t.done()):t.set((e-r)/e)}),this)}}(),t.render=function(e){if(t.isRendered())return document.getElementById("nprogress");h(document.documentElement,"nprogress-busy");var r=document.createElement("div");r.id="nprogress",r.innerHTML=s.template;var o=r.querySelector(s.barSelector),i=e?"-100":c(t.status||0),m=document.querySelector(s.parent),g;return u(o,{transition:"all 0 linear",transform:"translate3d("+i+"%,0,0)"}),s.showSpinner||(g=r.querySelector(s.spinnerSelector),g&&y(g)),m!=document.body&&h(m,"nprogress-custom-parent"),m.appendChild(r),r},t.remove=function(){j(document.documentElement,"nprogress-busy"),j(document.querySelector(s.parent),"nprogress-custom-parent");var e=document.getElementById("nprogress");e&&y(e)},t.isRendered=function(){return!!document.getElementById("nprogress")},t.getPositioningCSS=function(){var e=document.body.style,r="WebkitTransform"in e?"Webkit":"MozTransform"in e?"Moz":"msTransform"in e?"ms":"OTransform"in e?"O":"";return r+"Perspective"in e?"translate3d":r+"Transform"in e?"translate":"margin"};function P(e,r,o){return e<r?r:e>o?o:e}function c(e){return(-1+e)*100}function k(e,r,o){var i;return s.positionUsing==="translate3d"?i={transform:"translate3d("+c(e)+"%,0,0)"}:s.positionUsing==="translate"?i={transform:"translate("+c(e)+"%,0)"}:i={"margin-left":c(e)+"%"},i.transition="all "+r+"ms "+o,i}var _=function(){var e=[];function r(){var o=e.shift();o&&o(r)}return function(o){e.push(o),e.length==1&&r()}}(),u=function(){var e=["Webkit","O","Moz","ms"],r={};function o(n){return n.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(l,f){return f.toUpperCase()})}function i(n){var l=document.body.style;if(n in l)return n;for(var f=e.length,b=n.charAt(0).toUpperCase()+n.slice(1),d;f--;)if(d=e[f]+b,d in l)return d;return n}function m(n){return n=o(n),r[n]||(r[n]=i(n))}function g(n,l,f){l=m(l),n.style[l]=f}return function(n,l){var f=arguments,b,d;if(f.length==2)for(b in l)d=l[b],d!==void 0&&l.hasOwnProperty(b)&&g(n,b,d);else g(n,f[1],f[2])}}();function x(e,r){var o=typeof e=="string"?e:v(e);return o.indexOf(" "+r+" ")>=0}function h(e,r){var o=v(e),i=o+r;x(o,r)||(e.className=i.substring(1))}function j(e,r){var o=v(e),i;x(e,r)&&(i=o.replace(" "+r+" "," "),e.className=i.substring(1,i.length-1))}function v(e){return(" "+(e.className||"")+" ").replace(/\s+/gi," ")}function y(e){e&&e.parentNode&&e.parentNode.removeChild(e)}return t})}(w)),w.exports}var A;function Te(){if(A)return C;A=1;var a,p=(a=Le())&&typeof a=="object"&&"default"in a?a.default:a,t=null;function s(_){document.addEventListener("inertia:start",P.bind(null,_)),document.addEventListener("inertia:progress",c),document.addEventListener("inertia:finish",k)}function P(_){t=setTimeout(function(){return p.start()},_)}function c(_){p.isStarted()&&_.detail.progress.percentage&&p.set(Math.max(p.status,_.detail.progress.percentage/100*.9))}function k(_){clearTimeout(t),p.isStarted()&&(_.detail.visit.completed?p.done():_.detail.visit.interrupted?p.set(0):_.detail.visit.cancelled&&(p.done(),p.remove()))}return C.InertiaProgress={init:function(_){var u=_===void 0?{}:_,x=u.delay,h=u.color,j=h===void 0?"#29d":h,v=u.includeCSS,y=v===void 0||v,e=u.showSpinner,r=e!==void 0&&e;s(x===void 0?250:x),p.configure({showSpinner:r}),y&&function(o){var i=document.createElement("style");i.type="text/css",i.textContent=`
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
  `,document.head.appendChild(i)}(j)}},C}var Ie=Te();const F="Catalyst";Ee({title:a=>a?`${a} - ${F}`:F,resolve:a=>{const t=Object.assign({"./Pages/Admin/Roles/Edit.jsx":q,"./Pages/Admin/Roles/Index.jsx":L,"./Pages/Auth/ConfirmPassword.jsx":T,"./Pages/Auth/ForgotPassword.jsx":I,"./Pages/Auth/Login.jsx":U,"./Pages/Auth/ProfileCompletion.jsx":M,"./Pages/Auth/ProfileForms/DepartmentStaffForm.jsx":N,"./Pages/Auth/ProfileForms/LecturerForm.jsx":D,"./Pages/Auth/ProfileForms/OrganizerForm.jsx":z,"./Pages/Auth/ProfileForms/StudentForm.jsx":O,"./Pages/Auth/ProfileForms/UniversityForm.jsx":W,"./Pages/Auth/Register.jsx":B,"./Pages/Auth/ResetPassword.jsx":V,"./Pages/Auth/RoleSelection.jsx":$,"./Pages/Auth/VerifyEmail.jsx":H,"./Pages/Certificates/TemplateBuilder.jsx":X,"./Pages/Dashboard.jsx":G,"./Pages/Events/Create.jsx":J,"./Pages/Events/Edit.jsx":K,"./Pages/Events/Index.jsx":Q,"./Pages/Events/MyEvents.jsx":Y,"./Pages/Events/Shared.jsx":Z,"./Pages/Feedback/Create.jsx":ee,"./Pages/Feedback/Index.jsx":re,"./Pages/Friend/list.jsx":te,"./Pages/Lecturers/FacultyStudents.jsx":oe,"./Pages/Mentors/Dashboard.jsx":se,"./Pages/Profile/DepartmentStaff/Profile.jsx":ie,"./Pages/Profile/Lecturer/Profile.jsx":ne,"./Pages/Profile/Organizer/Profile.jsx":ae,"./Pages/Profile/Student/Profile.jsx":_e,"./Pages/Profile/University/Profile.jsx":pe,"./Pages/Projects/Analytics.jsx":me,"./Pages/Projects/Create.jsx":le,"./Pages/Projects/Index.jsx":fe,"./Pages/Projects/ProjectAnalytics.jsx":ue,"./Pages/Projects/ProjectDashboard.jsx":ge,"./Pages/Projects/Show.jsx":de,"./Pages/Projects/Track.jsx":ce,"./Pages/Reports/Admin/Index.jsx":ve,"./Pages/Reports/Department/Index.jsx":be,"./Pages/Reports/University/Index.jsx":Pe,"./Pages/Settings/Edit.jsx":xe,"./Pages/Settings/Partials/DeleteUserForm.jsx":he,"./Pages/Settings/Partials/UpdatePasswordForm.jsx":je,"./Pages/Settings/Partials/UpdateProfileInformationForm.jsx":ye,"./Pages/ViewProfile.jsx":Se,"./Pages/Welcome.jsx":we})[`./Pages/${a}.jsx`];if(!t)throw new Error(`Page not found: ${a}`);return t},setup({el:a,App:p,props:t}){Fe.createRoot(a).render(ke.jsx(p,{...t}))}});Ie.InertiaProgress.init();
