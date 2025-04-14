import{r as x,m as b,j as e,L as N}from"./index.esm-DYHbi2wE.js";import"./index-BdFZFnLD.js";import{A as C}from"./AuthenticatedLayout-C7BwTL0r.js";import{m}from"./proxy-oAEZJcFV.js";import{A as k}from"./index-CkxCHxkU.js";function E({user:l}){const[a,s]=x.useState(null),[i,t]=x.useState(""),[n,d]=x.useState(!1),{setData:c,post:g,processing:f,errors:h,reset:u}=b({photo:null,profile_type:v(l)});x.useEffect(()=>{if(i||h.photo){const r=setTimeout(()=>{t(""),u("photo")},5e3);return()=>clearTimeout(r)}},[i,h.photo]);function v(r){return r.department_staff?"department_staff":r.student?"student":r.lecturer?"lecturer":r.university?"university":r.organizer?"organizer":null}const j=r=>{const o=r.target.files[0];if(t(""),o&&o.size>2*1024*1024){t("Image size must be less than 2MB"),r.target.value="";return}if(o&&!["image/jpeg","image/png","image/jpg","image/gif"].includes(o.type)){t("Please upload a valid image file (JPEG, PNG, JPG, GIF)"),r.target.value="";return}if(o){c("photo",o);const p=new FileReader;p.onloadend=()=>{s(p.result)},p.readAsDataURL(o)}},w=r=>{r.preventDefault(),g(route("profile.photo"),{forceFormData:!0,preserveScroll:!0,onSuccess:()=>{window.location.reload()},onError:o=>{console.error("Upload failed:",o),t(o.photo||"Failed to upload photo. Please try again."),s(null),u("photo")}})},y=(()=>{if(a)return a;const r=l[v(l)];return r!=null&&r.profile_photo_path?`/${r.profile_photo_path}`:null})();return e.jsx("div",{className:"relative flex flex-col items-center w-32",children:e.jsxs("form",{onSubmit:w,encType:"multipart/form-data",className:"flex flex-col items-center relative",children:[e.jsxs("div",{className:"w-32 relative",onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),children:[e.jsxs("div",{className:"w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative shadow-lg",children:[y?e.jsx("img",{src:y,alt:"Profile",className:"w-full h-full object-cover"}):e.jsx("div",{className:"w-full h-full flex items-center justify-center text-gray-400",children:e.jsx("span",{className:"material-symbols-outlined text-4xl",children:"person"})}),e.jsx("div",{className:`absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer
                                ${n?"opacity-100":"opacity-0"}`,onClick:()=>document.getElementById("photo").click(),children:e.jsx("div",{className:"transform transition-transform duration-300 ease-in-out hover:scale-110",children:e.jsx("span",{className:"material-symbols-outlined text-white text-3xl",children:"photo_camera"})})})]}),e.jsx("input",{type:"file",id:"photo",onChange:j,className:"hidden",accept:"image/jpeg,image/png,image/jpg,image/gif"})]}),(i||h.photo)&&e.jsx("div",{className:"ml-50",children:e.jsxs("div",{className:"bg-red-500/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap mt-2",children:[e.jsx("span",{className:"material-symbols-outlined text-base",children:"error"}),e.jsx("span",{className:"text-sm font-medium",children:i||h.photo})]})}),a&&e.jsx("div",{className:"mt-4",children:e.jsx("button",{type:"submit",disabled:f,className:"group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 text-sm font-medium text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",children:e.jsx("span",{className:"relative flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1.5 transition-all duration-200 ease-in group-hover:bg-opacity-0",children:f?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin h-4 w-4",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{children:"Saving..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"material-symbols-outlined text-base",children:"save"}),e.jsx("span",{children:"Save"})]})})})})]})})}function P({user:l,children:a,activeTab:s,onTabChange:i,components:t}){const n=!(t!=null&&t.Teams)&&!(t!=null&&t.Certificates)&&!(t!=null&&t.Badges),d=[{name:"Profiles",key:"profiles"},(t==null?void 0:t.Teams)&&{name:"Teams",key:"teams"},(t==null?void 0:t.Certificates)&&{name:"Certificates",key:"certificates"},(t==null?void 0:t.Badges)&&{name:"Badges",key:"badges"}].filter(Boolean),c={initial:{opacity:0},animate:{opacity:1,transition:{duration:.5,when:"beforeChildren",staggerChildren:.1}}},g={initial:{opacity:0,y:-20},animate:{opacity:1,y:0,transition:{duration:.5,ease:"easeOut"}}},f={initial:{opacity:0,y:20},animate:{opacity:1,y:0,transition:{delay:.2,duration:.5,ease:"easeOut"}}},h={inactive:{opacity:.7},active:{opacity:1,transition:{duration:.3}},hover:{opacity:1,scale:1.05,transition:{duration:.2}},tap:{scale:.95,transition:{duration:.1}}};return e.jsxs(C,{user:l,children:[e.jsx(N,{title:"Profile"}),e.jsx(m.div,{className:"min-h-screen",initial:"initial",animate:"animate",variants:c,children:e.jsx("div",{className:"relative",children:e.jsxs("div",{className:"relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6",children:[!n&&e.jsx(m.div,{className:"flex justify-center mb-4 sm:mb-6 overflow-x-auto",variants:g,children:e.jsx("div",{className:"bg-[#24225a]/80 backdrop-blur-sm rounded-xl p-1 shadow-lg w-full max-w-[95vw] sm:max-w-fit",children:e.jsx("nav",{className:"flex gap-1 min-w-full sm:min-w-0",children:d.map(u=>e.jsxs(m.button,{onClick:()=>i(u.key),className:`
                                                    flex-1 sm:flex-none px-3 sm:px-6 py-2.5 rounded-lg text-sm font-medium
                                                    whitespace-nowrap transition-all duration-200
                                                    ${s===u.key?"bg-purple-600/50 text-white shadow-md":"text-gray-300 hover:text-white hover:bg-white/5"}
                                                `,variants:h,initial:"inactive",animate:s===u.key?"active":"inactive",whileHover:"hover",whileTap:"tap",children:[u.name,s===u.key&&e.jsx(m.div,{layoutId:"activeTabIndicator",className:"absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 mx-3",initial:{opacity:0},animate:{opacity:1},transition:{duration:.3}})]},u.key))})})}),e.jsx("div",{className:`${n?"mt-0":"mt-4 sm:mt-6"}`,children:e.jsx(m.div,{className:"bg-[#24225a]/80 backdrop-blur-sm rounded-xl shadow-lg",variants:f,layout:!0,children:e.jsx(k,{mode:"wait",children:e.jsx(m.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},className:"relative p-4 sm:p-6",children:a},s)})})})]})})})]})}function I({activeTab:l,components:a,user:s}){return(()=>{switch(l){case"profiles":return a.PersonalInformation?e.jsx(a.PersonalInformation,{user:s}):null;case"teams":return a.Teams?e.jsx(a.Teams,{user:s}):null;case"certificates":return a.Certificates?e.jsx(a.Certificates,{user:s}):null;case"badges":return a.Badges?e.jsx(a.Badges,{user:s}):null;default:return a.PersonalInformation?e.jsx(a.PersonalInformation,{user:s}):null}})()}function M({auth:l,components:a,profileUser:s,roles:i,showFriendButton:t,friendStatus:n,friendRequestId:d}){const[c,g]=x.useState("profiles"),f={initial:{opacity:0,y:10},animate:{opacity:1,y:0,transition:{duration:.3,ease:"easeOut"}},exit:{opacity:0,y:-10,transition:{duration:.2}}};return e.jsx(P,{user:l.user,activeTab:c,onTabChange:g,components:a,showFriendButton:t,friendStatus:n,friendRequestId:d,profileUser:s,children:e.jsx(m.div,{initial:"initial",animate:"animate",exit:"exit",variants:f,children:e.jsx(I,{activeTab:c,components:a,user:l.user})},c)})}function L({type:l="text",className:a="",options:s=[],...i}){const t="w-full px-4 py-2.5 bg-[#242031] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 focus:ring-[#635985] transition-colors duration-200";return l==="select"?e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-300 mb-2",children:i.label}),e.jsxs("select",{...i,className:`${t} ${a}
                        appearance-none bg-[#242031]
                        background-image: url("data:image/svg+xml,...") // Add a custom dropdown arrow
                    `,children:[e.jsxs("option",{value:"",disabled:!0,children:["Select ",i.label]}),s.map(n=>e.jsx("option",{value:n,className:"bg-[#242031] text-white",children:n},n))]}),i.error&&e.jsx("p",{className:"mt-1 text-sm text-red-400",children:i.error})]}):e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-400 mb-2",children:i.label}),e.jsx("input",{type:l,...i,className:`${t} ${a}`}),i.error&&e.jsx("p",{className:"mt-1 text-sm text-red-400",children:i.error})]})}function V({userId:l,friendStatus:a,friendRequestId:s}){const{post:i,processing:t}=b(),[n,d]=x.useState(a);x.useEffect(()=>{d(a)},[a]);const c=()=>{i(route("friend.request",l),{},{onSuccess:()=>{d("pending")}})};return n==="accepted"?e.jsxs("button",{className:"inline-flex items-center px-4 py-2 bg-green-500/80 text-white rounded-xl text-sm font-medium backdrop-blur-sm",disabled:!0,children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 mr-2",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),"Friends"]}):n==="pending"?e.jsxs("button",{className:"inline-flex items-center px-4 py-2 bg-gray-500/80 text-white rounded-xl text-sm font-medium backdrop-blur-sm cursor-not-allowed",disabled:!0,children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 mr-2",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",clipRule:"evenodd"})}),"Request Pending"]}):e.jsxs("button",{onClick:c,disabled:t,className:"inline-flex items-center px-4 py-2 bg-[#635985]/80 hover:bg-[#635985] text-white rounded-xl text-sm font-medium transition-colors",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 mr-2",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{d:"M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"})}),"Add Friend"]})}export{M as B,V as F,L as I,E as U};
