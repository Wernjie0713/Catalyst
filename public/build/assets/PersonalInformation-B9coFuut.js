import{r as B,m as U,j as e}from"./index.esm-DYHbi2wE.js";import{U as H,F as R,I as m}from"./FriendRequestButton-Cj-t0Ldt.js";import{D as q}from"./DisplayProfilePhoto-JFqyhybw.js";function G({user:t,viewOnly:n=!1,showFriendButton:c=!1,friendStatus:l,friendRequestId:r}){var b,g,y,j,v,N,u,F,w,_,C,S,k,E,D,I,P;const[p,x]=B.useState(!1),{data:o,setData:s,patch:M,processing:h,errors:i}=U({department:((b=t==null?void 0:t.department_staff)==null?void 0:b.department)||"",faculty:((g=t==null?void 0:t.department_staff)==null?void 0:g.faculty)||"",position:((y=t==null?void 0:t.department_staff)==null?void 0:y.position)||"",contact_number:((j=t==null?void 0:t.department_staff)==null?void 0:j.contact_number)||"",linkedin:((v=t==null?void 0:t.department_staff)==null?void 0:v.linkedin)||"",bio:((N=t==null?void 0:t.department_staff)==null?void 0:N.bio)||""}),A=["Faculty of Computing","Faculty of Civil Engineering","Faculty of Electrical Engineering","Faculty of Chemical Engineering","Faculty of Mechanical Engineering","Faculty of Industrial Sciences & Technology","Faculty of Manufacturing Engineering","Faculty of Technology Engineering","Faculty of Business & Communication","Faculty of Industrial Management","Faculty of Applied Sciences","Faculty of Science & Technology","Faculty of Medicine","Faculty of Pharmacy","Faculty of Dentistry","Faculty of Arts & Social Sciences","Faculty of Education","Faculty of Economics & Administration","Faculty of Law","Faculty of Built Environment","Faculty of Agriculture","Faculty of Forestry","Faculty of Veterinary Medicine","Faculty of Islamic Studies","Faculty of Sports Science","Faculty of Creative Technology","Faculty of Music","Faculty of Architecture & Design","Faculty of Hotel & Tourism Management","Faculty of Health Sciences","Faculty of Defence Studies & Management"],L=a=>{a.preventDefault(),M(route("profile.update"),{preserveScroll:!0,onSuccess:()=>{x(!1)},onError:T=>{console.error("Submission errors:",T)}})};return e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6",children:[e.jsx("div",{className:"bg-[#1e1b4b]/50 rounded-xl p-4 sm:p-6",children:e.jsxs("div",{className:"flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8",children:[e.jsxs("div",{className:"flex flex-col items-center flex-shrink-0",children:[n?e.jsx(q,{profilePhotoPath:(u=t==null?void 0:t.department_staff)==null?void 0:u.profile_photo_path,className:"w-full h-full object-cover"}):e.jsx(H,{user:t}),c&&e.jsx("div",{className:"mt-4",children:e.jsx(R,{userId:t.id,friendStatus:l,friendRequestId:r})})]}),e.jsxs("div",{className:"flex-1 text-center md:text-left",children:[e.jsxs("div",{className:"mb-4 md:mb-6",children:[e.jsx("h1",{className:"text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2",children:(t==null?void 0:t.name)||"User"}),e.jsx("p",{className:"text-sm sm:text-base text-gray-400",children:(t==null?void 0:t.email)||"No email provided"}),((F=t==null?void 0:t.department_staff)==null?void 0:F.bio)&&e.jsx("p",{className:"text-sm sm:text-base text-gray-300 mt-3",children:t.department_staff.bio})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto md:mx-0",children:[e.jsx(d,{icon:"work",label:"Position",value:(w=t==null?void 0:t.department_staff)==null?void 0:w.position}),e.jsx(d,{icon:"business",label:"Department",value:(_=t==null?void 0:t.department_staff)==null?void 0:_.department}),e.jsx(d,{icon:"school",label:"Faculty",value:(C=t==null?void 0:t.department_staff)==null?void 0:C.faculty}),e.jsx(d,{icon:"phone",label:"Contact",value:(S=t==null?void 0:t.department_staff)==null?void 0:S.contact_number})]})]})]})}),e.jsxs("div",{className:"mt-6 sm:mt-8",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4 sm:mb-6 px-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"material-symbols-outlined text-[#635985]",children:"info"}),e.jsx("h2",{className:"text-lg sm:text-xl font-semibold text-white",children:"Detailed Information"})]}),!n&&e.jsx("button",{onClick:()=>x(!p),className:"p-2 hover:bg-[#635985]/20 rounded-lg transition-colors",children:e.jsx("span",{className:"material-symbols-outlined text-[#635985]",children:"edit"})})]}),p&&!n?e.jsxs("form",{onSubmit:L,className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsx(m,{label:"Department",value:o.department,onChange:a=>s("department",a.target.value),error:i.department,className:"bg-white/5 border-white/10 text-white"}),e.jsx(m,{label:"Faculty",type:"select",value:o.faculty,onChange:a=>s("faculty",a.target.value),error:i.faculty,options:A,className:"bg-white/5 border-white/10 text-white"}),e.jsx(m,{label:"Position",value:o.position,onChange:a=>s("position",a.target.value),error:i.position,className:"bg-white/5 border-white/10 text-white"}),e.jsx(m,{label:"Contact Number",type:"tel",value:o.contact_number,onChange:a=>s("contact_number",a.target.value),error:i.contact_number,className:"bg-white/5 border-white/10 text-white"}),e.jsx(m,{label:"LinkedIn",value:o.linkedin,onChange:a=>s("linkedin",a.target.value),error:i.linkedin,className:"bg-white/5 border-white/10 text-white"})]}),e.jsxs("div",{className:"mt-6",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-300 mb-2",children:"Bio"}),e.jsx("textarea",{rows:4,value:o.bio,onChange:a=>s("bio",a.target.value),className:`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl 
                                    text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                    focus:ring-[#635985] transition-colors duration-200`}),i.bio&&e.jsx("p",{className:"mt-1 text-sm text-red-400",children:i.bio})]}),e.jsxs("div",{className:"flex items-center justify-end gap-4 mt-6",children:[e.jsx("button",{type:"button",onClick:()=>x(!1),className:"px-6 py-2.5 text-white/70 hover:text-white",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:h,className:`px-6 py-2.5 bg-[#635985] text-white rounded-xl 
                                    hover:bg-[#635985]/80 transform transition-all duration-200 
                                    hover:scale-105 disabled:opacity-75 flex items-center gap-2`,children:h?"Saving...":"Save Changes"})]})]}):e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(f,{icon:"work",title:"Position Details",items:[{label:"Position",value:(k=t==null?void 0:t.department_staff)==null?void 0:k.position},{label:"Department",value:(E=t==null?void 0:t.department_staff)==null?void 0:E.department}]}),e.jsx(f,{icon:"school",title:"Faculty Information",items:[{label:"Faculty",value:(D=t==null?void 0:t.department_staff)==null?void 0:D.faculty}]}),e.jsx(f,{icon:"contact_page",title:"Contact Information",items:[{label:"Email",value:t==null?void 0:t.email},{label:"Phone",value:(I=t==null?void 0:t.department_staff)==null?void 0:I.contact_number},{label:"LinkedIn",value:(P=t==null?void 0:t.department_staff)==null?void 0:P.linkedin,isLink:!0}]})]})]})]})}function d({icon:t,label:n,value:c}){return e.jsxs("div",{className:"text-center md:text-left",children:[e.jsxs("div",{className:"flex items-center justify-center md:justify-start gap-2 mb-1",children:[e.jsx("span",{className:"material-symbols-outlined text-[#635985]",children:t}),e.jsx("span",{className:"text-xs sm:text-sm text-gray-400",children:n})]}),e.jsx("p",{className:"text-sm sm:text-base text-white",children:c||"Not set"})]})}function f({icon:t,title:n,items:c}){return e.jsxs("div",{className:"bg-[#1e1b4b]/30 rounded-xl p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx("span",{className:"material-symbols-outlined text-[#635985]",children:t}),e.jsx("h3",{className:"text-lg font-medium text-white",children:n})]}),e.jsx("div",{className:"space-y-4",children:c.map((l,r)=>e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-400 mb-1",children:l.label}),l.isLink&&l.value?e.jsx("a",{href:l.value,target:"_blank",rel:"noopener noreferrer",className:"text-[#635985] hover:text-[#635985]/80",children:l.value}):e.jsx("p",{className:"text-white",children:l.value||"Not set"})]},r))})]})}export{G as D};
