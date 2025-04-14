import{r as F,m as R,j as a}from"./index.esm-DYHbi2wE.js";import{U as W,F as q,I as m}from"./FriendRequestButton-DSm7-oZs.js";import{D as Q}from"./DisplayProfilePhoto-JFqyhybw.js";function J({user:e,viewOnly:n=!1,showFriendButton:l=!1,friendStatus:i,friendRequestId:r}){var f,p,j,v,N,w,z,y,_,k,C,I,P,E,O,S,D;const[b,x]=F.useState(!1),{data:s,setData:c,patch:L,processing:g,errors:o}=R({organization_name:((f=e==null?void 0:e.organizer)==null?void 0:f.organization_name)||"",contact_number:((p=e==null?void 0:e.organizer)==null?void 0:p.contact_number)||"",official_email:((j=e==null?void 0:e.organizer)==null?void 0:j.official_email)||"",website:((v=e==null?void 0:e.organizer)==null?void 0:v.website)||"",linkedin:((N=e==null?void 0:e.organizer)==null?void 0:N.linkedin)||"",bio:((w=e==null?void 0:e.organizer)==null?void 0:w.bio)||""}),U=t=>{t.preventDefault(),L(route("profile.update"),{preserveScroll:!0,onSuccess:()=>{x(!1)},onError:B=>{console.error("Update failed:",B)}})};return a.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6",children:[a.jsx("div",{className:"bg-[#1e1b4b]/50 rounded-xl p-4 sm:p-6",children:a.jsxs("div",{className:"flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8",children:[a.jsxs("div",{className:"flex flex-col items-center flex-shrink-0",children:[n?a.jsx(Q,{profilePhotoPath:(z=e==null?void 0:e.organizer)==null?void 0:z.profile_photo_path,className:"w-full h-full object-cover"}):a.jsx(W,{user:e}),l&&a.jsx("div",{className:"mt-4",children:a.jsx(q,{userId:e.id,friendStatus:i,friendRequestId:r})})]}),a.jsxs("div",{className:"flex-1 text-center md:text-left",children:[a.jsxs("div",{className:"mb-4 md:mb-6",children:[a.jsx("h1",{className:"text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2",children:(e==null?void 0:e.name)||"User"}),a.jsx("p",{className:"text-sm sm:text-base text-gray-400",children:(e==null?void 0:e.email)||"No email provided"}),((y=e==null?void 0:e.organizer)==null?void 0:y.bio)&&a.jsx("p",{className:"text-sm sm:text-base text-gray-300 mt-3",children:e.organizer.bio})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto md:mx-0",children:[a.jsx(d,{icon:"business",label:"Organization",value:(_=e==null?void 0:e.organizer)==null?void 0:_.organization_name}),a.jsx(d,{icon:"phone",label:"Contact",value:(k=e==null?void 0:e.organizer)==null?void 0:k.contact_number}),a.jsx(d,{icon:"mail",label:"Official Email",value:(C=e==null?void 0:e.organizer)==null?void 0:C.official_email})]})]})]})}),a.jsxs("div",{className:"mt-6 sm:mt-8",children:[a.jsxs("div",{className:"flex items-center justify-between mb-4 sm:mb-6 px-1",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("span",{className:"material-symbols-outlined text-[#635985]",children:"info"}),a.jsx("h2",{className:"text-lg sm:text-xl font-semibold text-white",children:"Detailed Information"})]}),!n&&a.jsx("button",{onClick:()=>x(!b),className:"p-2 hover:bg-[#635985]/20 rounded-lg transition-colors",children:a.jsx("span",{className:"material-symbols-outlined text-[#635985]",children:"edit"})})]}),b&&!n?a.jsxs("form",{onSubmit:U,className:"space-y-6",children:[a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[a.jsx(m,{label:"Organization Name",value:s.organization_name,onChange:t=>c("organization_name",t.target.value),error:o.organization_name,className:"bg-white/5 border-white/10 text-white"}),a.jsx(m,{label:"Contact Number",type:"tel",value:s.contact_number,onChange:t=>c("contact_number",t.target.value),error:o.contact_number,className:"bg-white/5 border-white/10 text-white"}),a.jsx(m,{label:"Official Email",type:"email",value:s.official_email,onChange:t=>c("official_email",t.target.value),error:o.official_email,className:"bg-white/5 border-white/10 text-white"}),a.jsx(m,{label:"Website",type:"url",value:s.website,onChange:t=>c("website",t.target.value),error:o.website,className:"bg-white/5 border-white/10 text-white",placeholder:"https://example.com"}),a.jsx(m,{label:"LinkedIn",type:"url",value:s.linkedin,onChange:t=>c("linkedin",t.target.value),error:o.linkedin,className:"bg-white/5 border-white/10 text-white",placeholder:"https://linkedin.com/company/name"})]}),a.jsxs("div",{className:"mt-6",children:[a.jsx("label",{className:"block text-sm font-medium text-gray-300 mb-2",children:"Bio"}),a.jsx("textarea",{rows:4,value:s.bio,onChange:t=>c("bio",t.target.value),className:`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl 
                                    text-white placeholder-gray-500 focus:border-[#635985] focus:ring-1 
                                    focus:ring-[#635985] transition-colors duration-200`}),o.bio&&a.jsx("p",{className:"mt-1 text-sm text-red-400",children:o.bio})]}),a.jsxs("div",{className:"flex items-center justify-end gap-4 mt-6",children:[a.jsx("button",{type:"button",onClick:()=>x(!1),className:"px-6 py-2.5 text-white/70 hover:text-white",children:"Cancel"}),a.jsx("button",{type:"submit",disabled:g,className:`px-6 py-2.5 bg-[#635985] text-white rounded-xl 
                                    hover:bg-[#635985]/80 transform transition-all duration-200 
                                    hover:scale-105 disabled:opacity-75 flex items-center gap-2`,children:g?"Saving...":"Save Changes"})]})]}):a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[a.jsx(h,{icon:"business",title:"Organization Details",items:[{label:"Organization Name",value:(I=e==null?void 0:e.organizer)==null?void 0:I.organization_name},{label:"Status",value:((P=e==null?void 0:e.organizer)==null?void 0:P.status)||"Pending"}]}),a.jsx(h,{icon:"contact_page",title:"Contact Information",items:[{label:"Email",value:e==null?void 0:e.email},{label:"Official Email",value:(E=e==null?void 0:e.organizer)==null?void 0:E.official_email},{label:"Phone",value:(O=e==null?void 0:e.organizer)==null?void 0:O.contact_number}]}),a.jsx(h,{icon:"public",title:"Online Presence",items:[{label:"Website",value:(S=e==null?void 0:e.organizer)==null?void 0:S.website,isLink:!0},{label:"LinkedIn",value:(D=e==null?void 0:e.organizer)==null?void 0:D.linkedin,isLink:!0}]})]})]})]})}function d({icon:e,label:n,value:l,isLink:i}){return a.jsxs("div",{className:"text-center md:text-left",children:[a.jsxs("div",{className:"flex items-center justify-center md:justify-start gap-2 mb-1",children:[a.jsx("span",{className:"material-symbols-outlined text-[#635985]",children:e}),a.jsx("span",{className:"text-xs sm:text-sm text-gray-400",children:n})]}),i&&l?a.jsx("a",{href:l,target:"_blank",rel:"noopener noreferrer",className:"text-sm sm:text-base text-[#635985] hover:text-[#635985]/80",children:l}):a.jsx("p",{className:"text-sm sm:text-base text-white",children:l||"Not set"})]})}function h({icon:e,title:n,items:l}){return a.jsxs("div",{className:"bg-[#1e1b4b]/30 rounded-xl p-6",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[a.jsx("span",{className:"material-symbols-outlined text-[#635985]",children:e}),a.jsx("h3",{className:"text-lg font-medium text-white",children:n})]}),a.jsx("div",{className:"space-y-4",children:l.map((i,r)=>a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-400 mb-1",children:i.label}),i.isLink&&i.value?a.jsx("a",{href:i.value,target:"_blank",rel:"noopener noreferrer",className:"text-[#635985] hover:text-[#635985]/80",children:i.value}):a.jsx("p",{className:"text-white",children:i.value||"Not set"})]},r))})]})}export{J as O};
