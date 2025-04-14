import{m as g,j as e,L as p}from"./index.esm-DYHbi2wE.js";import{A as j}from"./AuthenticatedLayout-C7BwTL0r.js";import{I as f}from"./InputError-DDtAwo1I.js";import{P as b}from"./PrimaryButton-D7dWA5bS.js";function v({auth:l,role:t,abilities:r,roleAbilities:a}){const{data:i,setData:d,put:o,processing:n,errors:m}=g({abilities:a}),c=s=>{s.preventDefault(),o(route("admin.roles.update",t.id))},x=s=>{const u=i.abilities.includes(s)?i.abilities.filter(h=>h!==s):[...i.abilities,s];d("abilities",u)};return e.jsxs(j,{user:l.user,children:[e.jsx(p,{title:`Edit Role - ${t.title}`}),e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"max-w-6xl mx-auto sm:px-6 lg:px-8",children:e.jsx("div",{className:"bg-white overflow-hidden shadow-sm sm:rounded-lg relative",children:e.jsxs("div",{className:"p-6",children:[e.jsxs("h2",{className:"text-2xl font-semibold mb-6",children:["Edit Role: ",t.title]}),e.jsxs("form",{onSubmit:c,children:[e.jsxs("div",{className:"mb-6",children:[e.jsx("h3",{className:"text-lg font-medium mb-4",children:"Permissions"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:r.map(s=>e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",id:`ability-${s.id}`,checked:i.abilities.includes(s.name),onChange:()=>x(s.name),className:"rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"}),e.jsx("label",{htmlFor:`ability-${s.id}`,className:"ml-2 text-sm text-gray-600",children:s.title})]},s.id))})]}),e.jsx(f,{message:m.abilities,className:"mt-2"}),e.jsx("div",{className:"flex items-center justify-end mt-6",children:e.jsx(b,{disabled:n,children:"Update Role"})})]})]})})})})]})}const E=Object.freeze(Object.defineProperty({__proto__:null,default:v},Symbol.toStringTag,{value:"Module"}));export{E as _};
