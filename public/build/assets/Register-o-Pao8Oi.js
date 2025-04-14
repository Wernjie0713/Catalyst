import{j as e,m as c,L as x,$ as u}from"./index.esm-DYHbi2wE.js";import{I as n}from"./InputError-DDtAwo1I.js";import{A as i,b as p,F as f,a as l,S as h}from"./index-BiLPlKNU.js";import{A as j}from"./Aurora-BAGSavrW.js";function g({children:r,image:t="/images/jellyfish.jpg"}){return e.jsxs("div",{className:"min-h-screen relative overflow-hidden bg-[#1e1b4b]",children:[e.jsx("div",{className:"absolute inset-0 z-0",children:e.jsx(j,{colorStops:["#000000","#1E1B4B","#000000","#5E52F6"],amplitude:1.2,blend:.7})}),e.jsxs("div",{className:"min-h-screen flex relative z-10",children:[e.jsx("div",{className:"w-full md:w-1/2 p-8 flex flex-col justify-center",children:e.jsx("div",{className:"max-w-md mx-auto w-full",children:r})}),e.jsx("div",{className:"hidden md:flex w-1/2 p-8 items-center",children:e.jsx("div",{className:`w-full h-[600px] rounded-2xl overflow-hidden 
                        bg-black/20 backdrop-blur-sm border border-white/10
                        animate-fade-in-up`,children:e.jsx("img",{src:t,alt:"Background",className:"w-full h-full object-cover"})})})]})]})}function v(){const{data:r,setData:t,post:o,processing:d,errors:a}=c({name:"",email:"",password:"",password_confirmation:""}),m=s=>{s.preventDefault(),o(route("register"))};return e.jsxs(g,{image:"/images/register.jpg",children:[e.jsx(x,{title:"Register"}),e.jsxs("div",{className:"w-full max-w-md mx-auto",children:[e.jsx("div",{className:"mb-8 animate-fade-in-up",children:e.jsx("span",{className:`text-2xl px-4 py-2 rounded-full 
                    bg-black/30 border border-gray-700/50 
                    text-white font-space font-bold tracking-wide`,children:"Catalyst"})}),e.jsx("h1",{className:`text-3xl font-outfit font-semibold mb-2 text-white tracking-tight
                    animate-fade-in-up-slow`,children:"Create an account"}),e.jsx("p",{className:"text-gray-400 mb-8 font-outfit animate-fade-in-up-slow",children:"Please enter your details to register"}),e.jsxs("form",{onSubmit:m,className:"space-y-6 animate-fade-in-up-slower",children:[e.jsxs("div",{children:[e.jsx(i,{type:"text",placeholder:"Full name",value:r.name,icon:e.jsx(p,{}),error:a.name,onChange:s=>t("name",s.target.value)}),e.jsx(n,{message:a.name,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(i,{type:"email",placeholder:"Email",value:r.email,icon:e.jsx(f,{}),error:a.email,onChange:s=>t("email",s.target.value)}),e.jsx(n,{message:a.email,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(i,{type:"password",placeholder:"Password",value:r.password,icon:e.jsx(l,{}),error:a.password,onChange:s=>t("password",s.target.value)}),e.jsx(n,{message:a.password,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(i,{type:"password",placeholder:"Confirm Password",value:r.password_confirmation,icon:e.jsx(l,{}),error:a.password_confirmation,onChange:s=>t("password_confirmation",s.target.value)}),e.jsx(n,{message:a.password_confirmation,className:"mt-2"})]}),e.jsx(h,{processing:d,children:"Submit"}),e.jsxs("div",{className:"text-center text-sm text-gray-300",children:["Already have an account?"," ",e.jsx(u,{href:route("login"),className:`text-[#8B7FD3] hover:text-[#9D93DD] font-medium 
                            transition-colors duration-200 
                            hover:underline decoration-2 underline-offset-4`,children:"Sign in"})]})]})]})]})}const _=Object.freeze(Object.defineProperty({__proto__:null,default:v},Symbol.toStringTag,{value:"Module"}));export{_};
