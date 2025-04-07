import{m as g,j as e,L as u,$ as h}from"./index.esm-DYHbi2wE.js";import{A as b}from"./AuthenticatedLayout-B8ZFME79.js";import{I as i}from"./InputLabel-DQ2J_py9.js";import{I as n}from"./InputError-DDtAwo1I.js";import{T as f}from"./TextArea-CmHH9Tb8.js";import{P as p}from"./PrimaryButton-D7dWA5bS.js";import{f as y}from"./format-fR2ARjQC.js";function j({auth:d,event:a,existingFeedback:r}){const{data:t,setData:o,post:m,processing:c,errors:l}=g({rating:r?r.rating:3,comment:r?r.comment:""}),x=s=>{s.preventDefault(),m(route("feedback.store",a.event_id))};return e.jsxs(b,{user:d.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-200 leading-tight",children:"Provide Feedback"}),children:[e.jsx(u,{title:"Provide Feedback"}),e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:[e.jsx("div",{className:"bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl mb-6 border border-gray-700/50",children:e.jsx("div",{className:"p-6 sm:p-8",children:e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-2xl font-bold text-white mb-2",children:a.title}),e.jsxs("div",{className:"flex flex-wrap gap-4 text-sm",children:[e.jsxs("p",{className:"text-gray-300 flex items-center",children:[e.jsx("span",{className:"material-symbols-outlined mr-1 text-indigo-400",children:"calendar_month"}),y(new Date(a.date),"MMMM dd, yyyy")]}),e.jsxs("p",{className:"text-gray-300 flex items-center",children:[e.jsx("span",{className:"material-symbols-outlined mr-1 text-indigo-400",children:"location_on"}),a.location]})]})]}),e.jsxs(h,{href:route("events.my-events"),className:"mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150",children:[e.jsx("span",{className:"material-symbols-outlined mr-1",children:"arrow_back"}),"Back to Events"]})]})})}),e.jsx("div",{className:"bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl border border-gray-700/50",children:e.jsxs("div",{className:"p-6 sm:p-8",children:[e.jsx("h4",{className:"text-xl font-semibold text-white mb-6",children:r?"Update Your Review":"Share Your Experience"}),e.jsxs("form",{onSubmit:x,children:[e.jsxs("div",{className:"mb-8",children:[e.jsx(i,{htmlFor:"rating",value:"How would you rate this event?",className:"text-gray-300 text-lg mb-3"}),e.jsx("div",{className:"bg-gray-900/30 rounded-xl p-6 border border-gray-800/50",children:e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"flex items-center justify-center space-x-4 mb-4",children:[1,2,3,4,5].map(s=>e.jsx("button",{type:"button",onClick:()=>o("rating",s),className:`text-4xl focus:outline-none transition-all duration-200 transform hover:scale-110 ${s<=t.rating?"text-yellow-400":"text-gray-600"}`,children:"★"},s))}),e.jsxs("div",{className:"text-center text-gray-400 mt-2",children:[t.rating===1&&"Poor",t.rating===2&&"Fair",t.rating===3&&"Good",t.rating===4&&"Very Good",t.rating===5&&"Excellent"]})]})}),e.jsx(n,{message:l.rating,className:"mt-2"})]}),e.jsxs("div",{className:"mb-8",children:[e.jsx(i,{htmlFor:"comment",value:"Additional Comments (Optional)",className:"text-gray-300 text-lg mb-3"}),e.jsx("div",{className:"bg-gray-900/30 rounded-xl p-6 border border-gray-800/50",children:e.jsx(f,{id:"comment",className:"w-full border-gray-700 bg-gray-800/50 text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",value:t.comment,onChange:s=>o("comment",s.target.value),rows:5,placeholder:"Share your thoughts about the event..."})}),e.jsx(n,{message:l.comment,className:"mt-2"})]}),e.jsx("div",{className:"flex items-center justify-end",children:e.jsxs(p,{className:"px-6 py-3 bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center",disabled:c,children:[e.jsx("span",{className:"material-symbols-outlined mr-2",children:r?"update":"rate_review"}),r?"Update Feedback":"Submit Feedback"]})})]})]})})]})})]})}const E=Object.freeze(Object.defineProperty({__proto__:null,default:j},Symbol.toStringTag,{value:"Module"}));export{E as _};
