import{W as c,j as s,Y as p,a as f}from"./app-CdYkTQy0.js";import{G as w}from"./GuestLayout-BwcjWNbz.js";import{T as t,I as i}from"./TextInput-CPSDr8Ry.js";import{I as m}from"./InputLabel-CcDBlCrb.js";import{P as x}from"./PrimaryButton-D_DYnpNc.js";import"./ApplicationLogo-v208Uy9-.js";function _(){const{data:a,setData:r,post:n,processing:l,errors:o,reset:d}=c({email:"",password:"",password_confirmation:""}),u=e=>{e.preventDefault(),n(route("register"),{onFinish:()=>d("password","password_confirmation")})};return s.jsxs(w,{children:[s.jsx(p,{title:"Register"}),s.jsxs("form",{onSubmit:u,children:[s.jsxs("div",{className:"mt-4",children:[s.jsx(m,{htmlFor:"email",value:"Email"}),s.jsx(t,{id:"email",type:"email",name:"email",value:a.email,className:"mt-1 block w-full",autoComplete:"username",onChange:e=>r("email",e.target.value),required:!0}),s.jsx(i,{message:o.email,className:"mt-2"})]}),s.jsxs("div",{className:"mt-4",children:[s.jsx(m,{htmlFor:"password",value:"Password"}),s.jsx(t,{id:"password",type:"password",name:"password",value:a.password,className:"mt-1 block w-full",autoComplete:"new-password",onChange:e=>r("password",e.target.value),required:!0}),s.jsx(i,{message:o.password,className:"mt-2"})]}),s.jsxs("div",{className:"mt-4",children:[s.jsx(m,{htmlFor:"password_confirmation",value:"Confirm Password"}),s.jsx(t,{id:"password_confirmation",type:"password",name:"password_confirmation",value:a.password_confirmation,className:"mt-1 block w-full",autoComplete:"new-password",onChange:e=>r("password_confirmation",e.target.value),required:!0}),s.jsx(i,{message:o.password_confirmation,className:"mt-2"})]}),s.jsxs("div",{className:"flex items-center justify-end mt-4",children:[s.jsx(f,{href:route("login"),className:"underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",children:"Already registered?"}),s.jsx(x,{className:"ms-4",disabled:l,children:"Register"})]})]})]})}export{_ as default};