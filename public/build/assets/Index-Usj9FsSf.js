import{j as e,L as x,$ as o}from"./index.esm-DYHbi2wE.js";import{A as m}from"./AuthenticatedLayout-C7BwTL0r.js";import{f as i}from"./format-C9qPCfVZ.js";function h({auth:n,event:l,feedback:t,averageRating:r}){const d=[0,0,0,0,0];return t.forEach(s=>{s.rating>=1&&s.rating<=5&&d[s.rating-1]++}),e.jsxs(m,{user:n.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-200 leading-tight",children:"Event Feedback"}),children:[e.jsx(x,{title:"Event Feedback"}),e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:[e.jsx("div",{className:"bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl mb-6 border border-gray-700/50",children:e.jsx("div",{className:"p-6 sm:p-8",children:e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-2xl font-bold text-white mb-2",children:l.title}),e.jsxs("div",{className:"flex flex-wrap gap-4 text-sm",children:[e.jsxs("p",{className:"text-gray-300 flex items-center",children:[e.jsx("span",{className:"material-symbols-outlined mr-1 text-indigo-400",children:"calendar_month"}),i(new Date(l.date),"MMMM dd, yyyy")]}),e.jsxs("p",{className:"text-gray-300 flex items-center",children:[e.jsx("span",{className:"material-symbols-outlined mr-1 text-indigo-400",children:"location_on"}),l.location]})]})]}),e.jsxs(o,{href:route("events.my-events"),className:"mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150",children:[e.jsx("span",{className:"material-symbols-outlined mr-1",children:"arrow_back"}),"Back to Events"]})]})})}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[e.jsx("div",{className:"lg:col-span-1",children:e.jsx("div",{className:"bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl border border-gray-700/50 h-full",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h4",{className:"text-xl font-semibold text-white mb-6",children:"Rating Summary"}),e.jsx("div",{className:"flex items-center justify-between mb-8",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-4xl font-bold text-yellow-400 mb-1",children:r?r.toFixed(1):"-"}),e.jsx("div",{className:"flex justify-center mb-2",children:[1,2,3,4,5].map(s=>e.jsx("span",{className:`text-xl ${s<=Math.round(r)?"text-yellow-400":"text-gray-600"}`,children:"★"},s))}),e.jsxs("p",{className:"text-gray-400 text-sm",children:[t.length," ",t.length===1?"review":"reviews"]})]})}),e.jsx("div",{className:"space-y-3",children:[5,4,3,2,1].map(s=>{const a=d[s-1],c=t.length>0?Math.round(a/t.length*100):0;return e.jsxs("div",{className:"flex items-center",children:[e.jsxs("div",{className:"flex items-center w-12",children:[e.jsx("span",{className:"text-sm text-gray-300",children:s}),e.jsx("span",{className:"text-yellow-400 ml-1",children:"★"})]}),e.jsx("div",{className:"w-full bg-gray-700 rounded-full h-2.5 mx-2 dark:bg-gray-700",children:e.jsx("div",{className:"bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out",style:{width:`${c}%`}})}),e.jsx("span",{className:"text-sm text-gray-400 w-10 text-right",children:a})]},s)})})]})})}),e.jsx("div",{className:"lg:col-span-2",children:e.jsx("div",{className:"bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-xl border border-gray-700/50",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h4",{className:"text-xl font-semibold text-white mb-6",children:"Participant Reviews"}),t.length===0?e.jsxs("div",{className:"text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800/50",children:[e.jsx("div",{className:"text-gray-400 text-5xl mb-4",children:"★"}),e.jsx("p",{className:"text-gray-300 text-lg font-medium",children:"No feedback yet"}),e.jsx("p",{className:"text-gray-400 mt-2",children:"Participants haven't submitted any reviews for this event."})]}):e.jsx("div",{className:"space-y-6",children:t.map(s=>e.jsxs("div",{className:"bg-gray-900/30 rounded-xl p-5 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-medium mr-3",children:s.user.name.charAt(0).toUpperCase()}),e.jsxs("div",{children:[e.jsx("h5",{className:"text-white font-medium",children:s.user.name}),e.jsx("p",{className:"text-gray-400 text-sm",children:i(new Date(s.created_at),"MMM dd, yyyy")})]})]}),e.jsx("div",{className:"flex bg-gray-800/50 px-3 py-1.5 rounded-lg",children:[1,2,3,4,5].map(a=>e.jsx("span",{className:`text-lg ${a<=s.rating?"text-yellow-400":"text-gray-600"}`,children:"★"},a))})]}),s.comment?e.jsx("div",{className:"bg-gray-800/30 rounded-lg p-4 border-l-4 border-indigo-500/50",children:e.jsx("p",{className:"text-gray-300",children:s.comment})}):e.jsx("p",{className:"text-gray-500 italic",children:"No additional comments"})]},s.feedback_id))})]})})})]})]})})]})}const u=Object.freeze(Object.defineProperty({__proto__:null,default:h},Symbol.toStringTag,{value:"Module"}));export{u as _};
