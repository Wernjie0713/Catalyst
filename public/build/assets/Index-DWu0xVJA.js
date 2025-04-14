import{j as e,$ as y,r as c,K as j,L as f}from"./index.esm-DYHbi2wE.js";import{A as v}from"./AuthenticatedLayout-C7BwTL0r.js";import{T as b}from"./TiltedEventCard-DndYdjV7.js";import{A as N}from"./index-CkxCHxkU.js";import{m as n}from"./proxy-oAEZJcFV.js";import"./EventModal-B-rowo8j.js";import"./format-C9qPCfVZ.js";function w({links:i}){return i.length===3?null:e.jsx("div",{className:"flex items-center justify-center space-x-1.5 my-6",children:i.map((a,t)=>a.url===null?e.jsx("span",{className:"px-3 py-1.5 text-xs text-gray-400 bg-gray-800/50 rounded-md cursor-not-allowed",dangerouslySetInnerHTML:{__html:a.label}},t):e.jsx(y,{href:a.url,className:`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${a.active?"bg-blue-500 text-white hover:bg-blue-600":"text-gray-300 hover:bg-gray-800/50"}`,dangerouslySetInnerHTML:{__html:a.label}},t))})}const _=({events:i})=>{const[r,a]=c.useState(i),[t,l]=c.useState(!1),{can:x}=j().props,u=s=>{a(d=>({...d,data:d.data.map(m=>m.event_id===s.event_id?s:m)}))},o=r.data.filter(s=>t?s.is_team_event:!s.is_team_event),h={initial:{opacity:0},animate:{opacity:1,transition:{duration:.7,ease:"easeInOut"}},exit:{opacity:0,transition:{duration:.3,ease:"easeInOut"}}},p={hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:.08,delayChildren:.1,ease:"easeOut",duration:.5}}},g={hidden:{opacity:0},show:{opacity:1,transition:{duration:.5,ease:"easeOut"}}};return e.jsxs(v,{children:[e.jsx(f,{title:"Events"}),e.jsx(N,{mode:"wait",children:e.jsx(n.div,{initial:"initial",animate:"animate",exit:"exit",variants:h,className:"py-12",children:e.jsxs("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:[e.jsxs(n.div,{className:"flex justify-between items-center mb-6",initial:{opacity:0},animate:{opacity:1},transition:{duration:.7,ease:"easeOut"},children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("h2",{className:"text-3xl font-semibold text-white",children:"Events"}),e.jsx("p",{className:"text-gray-400",children:"Discover and join amazing events"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsxs("div",{className:"sm:hidden flex items-center bg-[#1E1E2E]/50 rounded-lg p-1.5 w-full",children:[e.jsxs("button",{onClick:()=>l(!1),className:`
                                            flex-1 px-4 py-2 rounded-md text-sm font-medium 
                                            transition-colors duration-300 flex items-center justify-center gap-2
                                            ${t?"text-gray-400 hover:text-white":"bg-blue-500 text-white"}
                                        `,children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"person"}),e.jsx("span",{children:"Individual"})]}),e.jsxs("button",{onClick:()=>l(!0),className:`
                                            flex-1 px-4 py-2 rounded-md text-sm font-medium 
                                            transition-colors duration-300 flex items-center justify-center gap-2
                                            ${t?"bg-blue-500 text-white":"text-gray-400 hover:text-white"}
                                        `,children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"groups"}),e.jsx("span",{children:"Team"})]})]}),e.jsxs("div",{className:"hidden sm:flex items-center space-x-3 bg-[#1E1E2E]/50 px-4 py-2 rounded-xl",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("span",{className:"material-symbols-outlined text-gray-400",children:"person"}),e.jsx("span",{className:`text-sm font-medium transition-colors duration-300 ${t?"text-gray-400":"text-white"}`,children:"Individual"})]}),e.jsx("button",{onClick:()=>l(!t),className:`
                                            relative inline-flex h-7 w-14 items-center rounded-full
                                            transition-all duration-300 ease-in-out focus:outline-none
                                            ${t?"bg-gradient-to-r from-blue-500 to-indigo-500":"bg-gradient-to-r from-rose-400 to-amber-400"}
                                            shadow-lg
                                        `,children:e.jsx("span",{className:`
                                                inline-block h-5 w-5 transform rounded-full
                                                transition-all duration-300 ease-in-out
                                                ${t?"translate-x-8":"translate-x-1"}
                                                bg-white shadow-md
                                                flex items-center justify-center
                                            `,children:e.jsx("span",{className:`
                                                material-symbols-outlined text-[12px]
                                                ${t?"text-blue-500":"text-amber-500"}
                                            `,children:t?"groups":"person"})})}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("span",{className:"material-symbols-outlined text-gray-400",children:"groups"}),e.jsx("span",{className:`text-sm font-medium transition-colors duration-300 ${t?"text-white":"text-gray-400"}`,children:"Team"})]})]}),x.event_upload&&e.jsxs(n.a,{whileHover:{scale:1.02},whileTap:{scale:.98},href:route("events.create"),className:`
                                            bg-blue-500 hover:bg-blue-600 text-white font-bold 
                                            py-2 px-4 sm:px-6 rounded-lg transition-colors duration-300 
                                            flex items-center space-x-2 text-sm sm:text-base shadow-lg
                                            fixed bottom-6 right-6 sm:relative sm:bottom-auto sm:right-auto
                                            z-50
                                        `,children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"add"}),e.jsx("span",{children:"Create Event"})]})]})]}),o.length>0?e.jsxs(e.Fragment,{children:[e.jsx(n.div,{variants:p,initial:"hidden",animate:"show",className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 justify-items-center px-4 sm:px-0",children:o.map(s=>e.jsx(n.div,{variants:g,className:"w-full max-w-sm",children:e.jsx(b,{event:s,onEventUpdate:u})},s.event_id))}),e.jsx(n.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.7,delay:.2},className:"mt-8",children:e.jsx(w,{links:r.links})})]}):e.jsxs(n.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.7},className:"text-center py-12",children:[e.jsx("div",{className:"text-gray-400 text-6xl mb-4",children:e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"4rem"},children:"event_busy"})}),e.jsxs("h3",{className:"text-xl font-medium text-gray-300 mb-2",children:["No ",t?"Team":"Individual"," Events Found"]}),e.jsxs("p",{className:"text-gray-400",children:["There are no ",t?"team":"individual"," events available at the moment."]})]})]})})})]})},L=Object.freeze(Object.defineProperty({__proto__:null,default:_},Symbol.toStringTag,{value:"Module"}));export{L as _};
