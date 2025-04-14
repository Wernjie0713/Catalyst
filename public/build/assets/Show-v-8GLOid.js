import{r as i,m as Y,j as e,L as Z}from"./index.esm-DYHbi2wE.js";import{A as z}from"./AuthenticatedLayout-C7BwTL0r.js";import"./TextInput-B6-dr-e6.js";import"./TextArea-CmHH9Tb8.js";import{m as u}from"./proxy-oAEZJcFV.js";import{f as E}from"./format-C9qPCfVZ.js";const I={planning:"bg-indigo-100 text-indigo-800 border border-indigo-200",in_progress:"bg-blue-100 text-blue-800 border border-blue-200",completed:"bg-emerald-100 text-emerald-800 border border-emerald-200",on_hold:"bg-amber-100 text-amber-800 border border-amber-200"},F={low:"bg-slate-100 text-slate-800 border border-slate-200",medium:"bg-blue-100 text-blue-800 border border-blue-200",high:"bg-orange-100 text-orange-800 border border-orange-200",critical:"bg-rose-100 text-rose-800 border border-rose-200"};function ee({auth:j,project:s}){var A,S,$,D,U,W;const[se,y]=i.useState(0),[te,L]=i.useState("planning"),{data:a,setData:o,post:H,processing:v,errors:N,reset:P}=Y({progress_description:"",progress_percentage:0,milestones_completed:"",challenges_faced:"",resources_needed:"",accepted_resources:""}),[O,w]=i.useState(!1),[c,h]=i.useState({milestone:"",challenge:"",resource:"",acceptedResource:""}),[m,p]=i.useState("info"),[b,_]=i.useState([]),B=t=>s.status==="on_hold"?"on_hold":t===0?"planning":t===100?"completed":"in_progress";i.useEffect(()=>{console.log("Project progress:",s==null?void 0:s.progress_percentage);const t=(s==null?void 0:s.progress_percentage)??0;y(t),o("progress_percentage",t),L(B(t)),s!=null&&s.unresolvedResources&&_([])},[s]),i.useEffect(()=>{var t;if(((t=s==null?void 0:s.updates)==null?void 0:t.length)>0){console.log("Project updates:",s.updates);const r=s.updates.filter(n=>!n.updatedBy||!n.updatedBy.name);r.length>0&&console.warn("Updates missing user information:",r)}},[s]),i.useEffect(()=>{L(B(a.progress_percentage))},[a.progress_percentage]),i.useEffect(()=>{s.status==="completed"&&m==="add"&&(p("info"),console.log("Project is completed - redirecting from add update tab"))},[m,s.status]);const V=t=>{const n=t.currentTarget.getBoundingClientRect(),d=t.clientX-n.left,l=Math.round(d/n.width*100),g=Math.min(100,Math.max(0,l));o("progress_percentage",g),y(g)},X=t=>{if(O){const n=t.currentTarget.getBoundingClientRect(),d=t.clientX-n.left,l=Math.round(d/n.width*100),g=Math.min(100,Math.max(0,l));o("progress_percentage",g),y(g)}},k=t=>{if(c[t].trim()){const n={milestone:"milestones_completed",challenge:"challenges_faced",resource:"resources_needed"}[t],d=a[n]?a[n].split(",").filter(Boolean):[];o(n,[...d,c[t].trim()].join(",")),h(l=>({...l,[t]:""}))}},q=(t,r)=>{const d={milestone:"milestones_completed",challenge:"challenges_faced",resource:"resources_needed"}[t],l=a[d]?a[d].split(",").filter(Boolean):[];l.splice(r,1),o(d,l.join(","))},G=t=>{t.preventDefault(),o("accepted_resources",b.join(",")),console.log("Form data being submitted:",{...a,updated_by:j.user.id}),H(route("projects.updates.store",s.id),{...a,updated_by:j.user.id},{onSuccess:()=>{console.log("Update submitted successfully"),P(),window.location.reload()},onError:r=>{console.error("Failed to add project update:",r)}})},x=t=>{try{return E(new Date(t),"MMM d, yyyy")}catch{return"Invalid date"}},C=t=>{if(b.includes(t)){_(b.filter(n=>n!==t));const r=a.accepted_resources?a.accepted_resources.split(",").filter(Boolean):[];o("accepted_resources",r.filter(n=>n!==t).join(","))}else{_([...b,t]);const r=a.accepted_resources?a.accepted_resources.split(",").filter(Boolean):[];o("accepted_resources",[...r,t].join(","))}},J=t=>{C(t)},f=t=>{const r={milestone:"milestones_completed",challenge:"challenges_faced",resource:"resources_needed"},n={milestone:{item:"bg-white border border-green-200",button:"text-green-600 hover:text-green-800",dot:"bg-green-500"},challenge:{item:"bg-white border border-red-200",button:"text-red-600 hover:text-red-800",dot:"bg-red-500"},resource:{item:"bg-white border border-blue-200",button:"text-blue-600 hover:text-blue-800",dot:"bg-blue-500"}},d=r[t],l=n[t],g=a[d]?a[d].split(",").filter(Boolean):[],Q=a.accepted_resources?a.accepted_resources.split(",").filter(Boolean):[];return g.map((M,T)=>e.jsxs(u.li,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.2},className:`flex items-center justify-between text-sm p-2 rounded ${l.item}`,children:[e.jsxs("span",{className:"flex items-center",children:[e.jsx("span",{className:`w-2 h-2 rounded-full mr-2 ${l.dot}`}),M]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[t==="resource"&&e.jsx("button",{type:"button",onClick:()=>J(M),className:`p-1 ${Q.includes(M)?"text-green-600":"text-gray-400"} hover:text-green-800`,children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})})}),e.jsx("button",{type:"button",onClick:()=>q(t,T),className:`p-1 ${l.button}`,children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})]},T))},K=t=>t<25?"bg-red-500":t<50?"bg-orange-500":t<75?"bg-yellow-500":"bg-green-500",R=s.unresolvedResources||[];return s?e.jsxs(z,{user:j.user,header:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Project Details"}),e.jsxs("span",{className:`px-3 py-1 rounded-full text-xs font-medium ${F[s.priority||"medium"]}`,children:[s.priority||"Medium"," Priority"]})]}),children:[e.jsx(Z,{title:`Project - ${(s==null?void 0:s.title)||"Details"}`}),e.jsx("div",{className:"py-6",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsxs(u.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4},className:"bg-white overflow-hidden shadow-sm sm:rounded-lg",children:[e.jsxs("div",{className:"p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:justify-between md:items-center gap-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:s.title||"Untitled Project"}),e.jsxs("p",{className:"text-gray-600 mt-1",children:["Started on ",x(s.start_date)," • Expected to finish by ",x(s.expected_end_date)]})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-medium ${I[s.status||"planning"]}`,children:(s.status||"planning").replace("_"," ")}),e.jsxs("span",{className:"text-xl font-bold text-indigo-600",children:[s.progress_percentage,"%"]}),s.status==="completed"&&s.actual_end_date&&e.jsxs("span",{className:"text-xs font-medium text-emerald-600",children:["Completed on ",x(s.actual_end_date)]})]})]}),e.jsx("div",{className:"mt-4",children:e.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2.5",children:e.jsx("div",{className:`${K(s.progress_percentage)} h-2.5 rounded-full`,style:{width:`${s.progress_percentage}%`}})})})]}),e.jsx("div",{className:"border-b border-gray-200",children:e.jsxs("nav",{className:"flex -mb-px",children:[e.jsx("button",{onClick:()=>p("info"),className:`py-3 px-6 text-sm font-medium ${m==="info"?"border-b-2 border-indigo-500 text-indigo-600":"text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:"Project Info"}),e.jsx("button",{onClick:()=>p("updates"),className:`py-3 px-6 text-sm font-medium ${m==="updates"?"border-b-2 border-indigo-500 text-indigo-600":"text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:"Updates & Timeline"}),s.status!=="completed"?e.jsx("button",{onClick:()=>p("add"),className:`py-3 px-6 text-sm font-medium ${m==="add"?"border-b-2 border-indigo-500 text-indigo-600":"text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,children:"Add Update"}):e.jsxs("div",{className:"py-3 px-6 text-sm font-medium text-gray-400 flex items-center cursor-not-allowed",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})}),"Project Completed"]})]})}),e.jsxs("div",{className:"p-6",children:[m==="info"&&e.jsxs(u.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.3},className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",children:[e.jsxs("div",{className:"bg-white rounded-lg p-5 shadow-sm border border-gray-100",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4 border-b pb-2",children:"Project Information"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Title:"}),e.jsx("span",{className:"font-medium text-gray-900",children:s.title||"Untitled"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Type:"}),e.jsx("span",{className:"font-medium text-gray-900 capitalize",children:s.type||"Individual"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Status:"}),e.jsx("span",{className:`px-2.5 py-0.5 rounded-full text-xs font-medium ${I[s.status||"planning"]}`,children:(s.status||"planning").replace("_"," ")})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Priority:"}),e.jsx("span",{className:`px-2.5 py-0.5 rounded-full text-xs font-medium ${F[s.priority||"medium"]}`,children:s.priority||"medium"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Start Date:"}),e.jsx("span",{className:"font-medium text-gray-900",children:x(s.start_date)})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Expected End:"}),e.jsx("span",{className:"font-medium text-gray-900",children:x(s.expected_end_date)})]}),s.actual_end_date&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Completed On:"}),e.jsx("span",{className:"font-medium text-emerald-600",children:x(s.actual_end_date)})]})]}),s.type==="individual"&&s.student&&e.jsxs("div",{className:"mt-6",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Student"}),e.jsxs("div",{className:"flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100",children:[e.jsx("div",{className:"w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-medium",children:((S=(A=s.student.user)==null?void 0:A.name)==null?void 0:S.charAt(0))||"?"}),e.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[(($=s.student.user)==null?void 0:$.name)||"Unknown",s.student.matric_no&&e.jsxs("span",{className:"text-xs text-gray-500 ml-2",children:["(",s.student.matric_no,")"]})]}),s.student.user&&e.jsx("a",{href:route("profile.view",s.student.user.id),className:"ml-auto",children:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 text-green-500 hover:text-green-700",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})})]})]}),s.type==="team"&&s.team&&e.jsxs("div",{className:"mt-6",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Team Members"}),e.jsxs("div",{className:"bg-indigo-50 p-3 rounded-lg border border-indigo-100",children:[e.jsxs("div",{className:"text-xs text-indigo-700 mb-2",children:[s.team.name," ",e.jsxs("span",{className:"bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded text-xs ml-1",children:[((D=s.team.members)==null?void 0:D.length)||0," members"]})]}),e.jsxs("div",{className:"space-y-2 mt-3",children:[(U=s.team.members)==null?void 0:U.map(t=>{var r,n,d,l;return e.jsxs("div",{className:"flex items-center space-x-2 p-2 bg-white rounded-md shadow-sm",children:[e.jsx("div",{className:"w-7 h-7 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-medium text-xs",children:((n=(r=t.user)==null?void 0:r.name)==null?void 0:n.charAt(0))||"?"}),e.jsx("span",{className:"text-sm text-gray-700",children:(d=t.user)==null?void 0:d.name}),e.jsx("a",{href:route("profile.view",(l=t.user)==null?void 0:l.id),className:"ml-auto",children:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 text-indigo-500 hover:text-indigo-700",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})})]},t.id)}),(!s.team.members||s.team.members.length===0)&&e.jsx("p",{className:"text-xs text-indigo-500 italic py-2 px-3 bg-white rounded",children:"No team members found"})]})]})]}),e.jsxs("div",{className:"mt-6",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Description"}),e.jsx("p",{className:"text-gray-700 bg-gray-50 p-3 rounded-md",children:s.description||"No description provided."})]})]}),e.jsxs("div",{className:"bg-white rounded-lg p-5 shadow-sm border border-gray-100",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4 border-b pb-2",children:"Project Details"}),e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Progress Overview"}),e.jsxs("div",{className:"bg-gray-50 p-4 rounded-md",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("span",{className:"text-sm text-gray-500",children:"Current Progress"}),e.jsxs("span",{className:"text-sm font-medium text-indigo-600",children:[s.progress_percentage,"%"]})]}),e.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2.5",children:e.jsx("div",{className:"h-2.5 rounded-full",style:{width:`${s.progress_percentage}%`,background:`linear-gradient(90deg, ${s.progress_percentage<30?"#818cf8":s.progress_percentage<70?"#60a5fa":"#34d399"}, ${s.progress_percentage<30?"#6366f1":s.progress_percentage<70?"#3b82f6":"#10b981"})`}})}),e.jsx("div",{className:"text-xs text-gray-500 mt-2",children:s.status==="completed"?"Project completed!":s.status==="planning"?"Project in planning phase.":s.status==="on_hold"?"Project currently on hold.":`${s.progress_percentage}% of project tasks completed.`})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Supervisor"}),s.supervisor?e.jsxs("div",{className:"flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-medium",children:s.supervisor.name.charAt(0)}),e.jsx("span",{className:"text-sm font-medium text-gray-700",children:s.supervisor.name}),e.jsx("a",{href:route("profile.view",s.supervisor.id),className:"ml-auto",children:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 text-blue-500 hover:text-blue-700",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})})]}):e.jsx("p",{className:"text-gray-500 italic",children:"No supervisor assigned."})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Project Statistics"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{className:"bg-indigo-50 p-3 rounded-lg border border-indigo-100",children:[e.jsx("div",{className:"text-xs text-indigo-700 mb-1",children:"Total Updates"}),e.jsx("div",{className:"text-xl font-bold text-indigo-800",children:((W=s.updates)==null?void 0:W.length)||0})]}),s.status==="completed"?e.jsxs("div",{className:"bg-emerald-50 p-3 rounded-lg border border-emerald-100",children:[e.jsx("div",{className:"text-xs text-emerald-700 mb-1",children:"Completed On"}),e.jsx("div",{className:"text-xl font-bold text-emerald-800",children:x(s.actual_end_date)})]}):e.jsxs("div",{className:"bg-emerald-50 p-3 rounded-lg border border-emerald-100",children:[e.jsx("div",{className:"text-xs text-emerald-700 mb-1",children:"Days Remaining"}),e.jsx("div",{className:"text-xl font-bold text-emerald-800",children:s.expected_end_date?Math.max(0,Math.ceil((new Date(s.expected_end_date)-new Date)/(1e3*60*60*24))):"N/A"})]})]})]})]})]})]}),m==="updates"&&e.jsxs(u.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.3},children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Project Timeline"}),s.updates&&s.updates.length>0?e.jsx("div",{className:"relative border-l-2 border-indigo-200 ml-3 pb-4",children:s.updates.map((t,r)=>{var n;return e.jsxs(u.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},transition:{duration:.3,delay:r*.1},className:"mb-6 ml-6",children:[e.jsx("div",{className:"absolute w-4 h-4 bg-indigo-500 rounded-full mt-1.5 -left-2 border border-white"}),e.jsxs("div",{className:"bg-white p-4 rounded-lg shadow-sm border border-gray-100",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-gray-500",children:E(new Date(t.created_at),"MMM d, yyyy")}),e.jsxs("div",{className:"flex items-center mt-1",children:[e.jsx("div",{className:"h-2.5 w-2.5 rounded-full bg-blue-600 mr-2"}),e.jsxs("span",{className:"text-sm font-medium text-gray-900",children:["Progress Update: ",t.progress_percentage,"%"]})]})]}),e.jsxs("span",{className:"bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full",children:["By ",t.user_name||((n=t.updatedBy)==null?void 0:n.name)||"Unknown"]})]}),e.jsx("p",{className:"text-gray-600 mb-3",children:t.progress_description}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 mt-3",children:[t.milestones_completed&&e.jsxs("div",{className:"bg-green-50 p-2 rounded border border-green-100",children:[e.jsx("h5",{className:"text-xs font-medium text-green-800 mb-1",children:"Milestones Completed"}),e.jsx("ul",{className:"text-xs text-gray-600 pl-2",children:t.milestones_completed.split(",").filter(Boolean).map((d,l)=>e.jsxs("li",{className:"flex items-center mb-1",children:[e.jsx("span",{className:"w-2 h-2 bg-green-500 rounded-full mr-2"}),d]},l))})]}),t.challenges_faced&&e.jsxs("div",{className:"bg-red-50 p-2 rounded border border-red-100",children:[e.jsx("h5",{className:"text-xs font-medium text-red-800 mb-1",children:"Challenges Faced"}),e.jsx("ul",{className:"text-xs text-gray-600 pl-2",children:t.challenges_faced.split(",").filter(Boolean).map((d,l)=>e.jsxs("li",{className:"flex items-center mb-1",children:[e.jsx("span",{className:"w-2 h-2 bg-red-500 rounded-full mr-2"}),d]},l))})]}),t.resources_needed&&e.jsxs("div",{className:"bg-blue-50 p-2 rounded border border-blue-100",children:[e.jsx("h5",{className:"text-xs font-medium text-blue-800 mb-1",children:"Resources Needed"}),e.jsx("ul",{className:"text-xs text-gray-600 pl-2",children:t.resources_needed.split(",").filter(Boolean).map((d,l)=>e.jsxs("li",{className:"flex items-center mb-1",children:[e.jsx("span",{className:"w-2 h-2 bg-blue-500 rounded-full mr-2"}),d]},l))})]}),t.accepted_resources&&e.jsxs("div",{className:"bg-emerald-50 p-2 rounded border border-emerald-100",children:[e.jsx("h5",{className:"text-xs font-medium text-emerald-800 mb-1",children:"Accepted Resources"}),e.jsx("ul",{className:"text-xs text-gray-600 pl-2",children:t.accepted_resources.split(",").filter(Boolean).map((d,l)=>e.jsxs("li",{className:"flex items-center mb-1",children:[e.jsx("span",{className:"w-2 h-2 bg-emerald-500 rounded-full mr-2"}),d]},l))})]})]})]})]},t.id)})}):e.jsxs("div",{className:"text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300",children:[e.jsx("svg",{className:"mx-auto h-12 w-12 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1,d:"M19 9l-7 7-7-7"})}),e.jsx("h3",{className:"mt-2 text-sm font-medium text-gray-900",children:"No updates yet"}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Add your first project update to begin tracking progress."}),e.jsx("div",{className:"mt-6",children:s.status!=="completed"?e.jsx("button",{type:"button",onClick:()=>p("add"),className:"inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700",children:"Add Update"}):e.jsx("div",{className:"inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-100",children:"Project Completed"})})]})]}),m==="add"&&e.jsx(u.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.3},children:s.status==="completed"?e.jsxs("div",{className:"bg-amber-50 p-8 rounded-lg border border-amber-200 text-center",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-16 w-16 mx-auto text-amber-500 mb-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})}),e.jsx("h3",{className:"text-lg font-medium text-amber-800 mb-2",children:"Project Already Completed"}),e.jsxs("p",{className:"text-amber-700 mb-4",children:["This project has been marked as completed on ",x(s.actual_end_date),". No further updates can be added to completed projects."]}),e.jsx("button",{type:"button",onClick:()=>p("updates"),className:"inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700",children:"View Project Timeline"})]}):e.jsxs(e.Fragment,{children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-4",children:"Add Project Update"}),e.jsxs("form",{onSubmit:G,className:"space-y-6 bg-white rounded-lg p-6 shadow-sm border border-gray-100",children:[e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Progress Description"}),e.jsx("textarea",{value:a.progress_description,onChange:t=>o("progress_description",t.target.value),className:"w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",rows:"3",placeholder:"Describe the current progress, key achievements, or challenges...",required:!0}),N.progress_description&&e.jsx("div",{className:"text-red-500 text-sm mt-1",children:N.progress_description})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Progress Percentage"}),e.jsxs("div",{className:"mt-2 mb-10 relative",children:[e.jsx("div",{className:"h-5 w-full bg-gray-200 rounded-lg cursor-pointer relative",onClick:V,onMouseMove:X,onMouseDown:()=>w(!0),onMouseUp:()=>w(!1),onMouseLeave:()=>w(!1),children:e.jsx(u.div,{initial:{width:"0%"},animate:{width:`${a.progress_percentage}%`},transition:{duration:.3},className:"h-full rounded-lg relative",style:{background:`linear-gradient(90deg, 
                                                                            ${a.progress_percentage<30?"#818cf8":a.progress_percentage<70?"#60a5fa":"#34d399"}, 
                                                                            ${a.progress_percentage<30?"#6366f1":a.progress_percentage<70?"#3b82f6":"#10b981"})`},children:e.jsx("div",{className:"absolute -right-3.5 -top-2 w-9 h-9 bg-white rounded-full cursor-grab shadow-md flex items-center justify-center border-2 border-indigo-500 select-none",children:e.jsxs("span",{className:"text-xs font-semibold text-indigo-700",children:[a.progress_percentage,"%"]})})})}),e.jsxs("div",{className:"absolute mt-2 w-full flex justify-between px-1 text-xs text-gray-500",children:[e.jsx("span",{children:"0%"}),e.jsx("span",{children:"25%"}),e.jsx("span",{children:"50%"}),e.jsx("span",{children:"75%"}),e.jsx("span",{children:"100%"})]})]}),N.progress_percentage&&e.jsx("div",{className:"text-red-500 text-sm mt-1",children:N.progress_percentage})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-4 sm:space-y-6",children:[e.jsxs("div",{className:"bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100",children:[e.jsx("label",{className:"block text-sm font-medium text-green-800 mb-2",children:"Milestones Completed"}),e.jsxs("div",{className:"flex",children:[e.jsx("input",{type:"text",value:c.milestone,onChange:t=>h(r=>({...r,milestone:t.target.value})),className:"flex-1 rounded-l-md border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm",placeholder:"Add a milestone"}),e.jsxs("button",{type:"button",onClick:()=>k("milestone"),className:"inline-flex items-center px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-green-100 text-green-700 hover:bg-green-200 text-sm",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 mr-0 sm:mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m8-8H4"})}),e.jsx("span",{className:"hidden sm:inline",children:"Add"})]})]}),e.jsx("ul",{className:"mt-2 sm:mt-3 space-y-1 max-h-28 sm:max-h-32 overflow-y-auto",children:f("milestone").length>0?f("milestone"):e.jsx("li",{className:"text-sm text-gray-500 italic py-2 px-3 bg-white rounded",children:"No milestones added yet"})})]}),e.jsxs("div",{className:"bg-red-50 p-3 sm:p-4 rounded-lg border border-red-100",children:[e.jsx("label",{className:"block text-sm font-medium text-red-800 mb-2",children:"Challenges Faced"}),e.jsxs("div",{className:"flex",children:[e.jsx("input",{type:"text",value:c.challenge,onChange:t=>h(r=>({...r,challenge:t.target.value})),className:"flex-1 rounded-l-md border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm",placeholder:"Add a challenge"}),e.jsxs("button",{type:"button",onClick:()=>k("challenge"),className:"inline-flex items-center px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-red-100 text-red-700 hover:bg-red-200 text-sm",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 mr-0 sm:mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m8-8H4"})}),e.jsx("span",{className:"hidden sm:inline",children:"Add"})]})]}),e.jsx("ul",{className:"mt-2 sm:mt-3 space-y-1 max-h-28 sm:max-h-32 overflow-y-auto",children:f("challenge").length>0?f("challenge"):e.jsx("li",{className:"text-sm text-gray-500 italic py-2 px-3 bg-white rounded",children:"No challenges added yet"})})]})]}),e.jsxs("div",{className:"space-y-4 sm:space-y-6",children:[e.jsxs("div",{className:"bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100",children:[e.jsx("label",{className:"block text-sm font-medium text-blue-800 mb-2",children:"Resources Needed"}),e.jsxs("div",{className:"flex",children:[e.jsx("input",{type:"text",value:c.resource,onChange:t=>h(r=>({...r,resource:t.target.value})),className:"flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm",placeholder:"Add a resource"}),e.jsxs("button",{type:"button",onClick:()=>k("resource"),className:"inline-flex items-center px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 mr-0 sm:mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m8-8H4"})}),e.jsx("span",{className:"hidden sm:inline",children:"Add"})]})]}),e.jsx("ul",{className:"mt-2 sm:mt-3 space-y-1 max-h-28 sm:max-h-32 overflow-y-auto",children:f("resource").length>0?f("resource"):e.jsx("li",{className:"text-sm text-gray-500 italic py-2 px-3 bg-white rounded",children:"No resources added yet"})}),R.length>0&&e.jsxs("div",{className:"mt-2 sm:mt-3",children:[e.jsx("h4",{className:"text-xs font-medium text-blue-800 mb-1",children:"Unresolved Resources"}),e.jsx("ul",{className:"space-y-1 text-xs",children:R.map((t,r)=>e.jsxs("li",{className:"text-gray-700 flex items-center",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"}),t]},r))})]})]}),e.jsxs("div",{className:"bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100",children:[e.jsx("label",{className:"block text-sm font-medium text-green-800 mb-2",children:"Accepted Resources"}),e.jsxs("div",{className:"flex mb-2 sm:mb-3",children:[e.jsxs("select",{value:c.acceptedResource||"",onChange:t=>h(r=>({...r,acceptedResource:t.target.value})),className:"flex-1 rounded-l-md border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm",children:[e.jsx("option",{value:"",children:"Select a resource..."}),e.jsx("option",{value:"Mentorship Access",children:"Mentorship"}),e.jsx("option",{value:"Funding Opportunities",children:"Funding"}),e.jsx("option",{value:"Tools for Startup",children:"Tools for Startup"}),e.jsx("option",{value:"Networking",children:"Networking"}),e.jsx("option",{value:"Educational Resources",children:"Educational"}),e.jsx("option",{value:"Legal Assistance",children:"Legal Assistance"}),e.jsx("option",{value:"Market Research",children:"Market Research"}),e.jsx("option",{value:"Prototyping Resources",children:"Prototyping"})]}),e.jsxs("button",{type:"button",onClick:()=>{c.acceptedResource&&c.acceptedResource.trim()&&(C(c.acceptedResource),h(t=>({...t,acceptedResource:""})))},className:"inline-flex items-center px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-green-100 text-green-700 hover:bg-green-200 text-sm",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 mr-0 sm:mr-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m8-8H4"})}),e.jsx("span",{className:"hidden sm:inline",children:"Add"})]})]}),e.jsx("ul",{className:"space-y-1 max-h-28 sm:max-h-32 overflow-y-auto",children:b.length>0?b.map((t,r)=>e.jsxs("li",{className:"flex items-center justify-between text-sm p-2 rounded bg-white border border-green-200",children:[e.jsxs("span",{className:"flex items-center text-xs sm:text-sm truncate pr-2",children:[e.jsx("span",{className:"w-2 h-2 rounded-full mr-1 sm:mr-2 flex-shrink-0 bg-green-500"}),t]}),e.jsx("button",{type:"button",onClick:()=>C(t),className:"p-1 text-green-600 hover:text-green-800 flex-shrink-0",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]},r)):e.jsx("li",{className:"text-sm text-gray-500 italic py-2 px-3 bg-white rounded",children:"No accepted resources added yet"})})]})]})]})]}),e.jsxs("div",{className:"flex justify-end pt-4 border-t",children:[e.jsx("button",{type:"button",onClick:()=>P(),className:"px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3",disabled:v,children:"Reset"}),e.jsx("button",{type:"submit",disabled:v,className:"inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",children:v?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Updating..."]}):"Submit Update"})]})]})]})})]})]})})})]}):e.jsx(z,{user:j.user,children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsx(u.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},className:"bg-white overflow-hidden shadow-sm sm:rounded-lg p-6",children:e.jsx("p",{className:"text-gray-500 text-center",children:"Project not found."})})})})})}const oe=Object.freeze(Object.defineProperty({__proto__:null,default:ee},Symbol.toStringTag,{value:"Module"}));export{oe as _};
