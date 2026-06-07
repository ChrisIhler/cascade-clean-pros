import React from "react";
const { useState, useEffect, useRef } = React;

/* ===========================================================
   PHOTO LIBRARY — every URL below was verified by reading the
   image's alt-text on Unsplash; each one genuinely depicts
   pressure washing / exterior surface cleaning.
   To use your own job photos later, just replace the URLs here.
   =========================================================== */
const P = {
  wand:    "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1600", // person with pressure washer wand
  drive1:  "https://images.pexels.com/photos/12111864/pexels-photo-12111864.jpeg?auto=compress&cs=tinysrgb&w=1600", // driveway pressure washing
  drive2:  "https://images.pexels.com/photos/14965464/pexels-photo-14965464.jpeg?auto=compress&cs=tinysrgb&w=1600", // driveway pressure washing
  surface: "https://images.pexels.com/photos/14965464/pexels-photo-14965464.jpeg?auto=compress&cs=tinysrgb&w=1600", // cleaning a paved surface
  floor:   "https://images.pexels.com/photos/12919779/pexels-photo-12919779.jpeg?auto=compress&cs=tinysrgb&w=1600", // cleaning a hard floor/surface
  generic: "https://images.pexels.com/photos/30958770/pexels-photo-30958770.jpeg?auto=compress&cs=tinysrgb&w=1600", // pressure washing in progress
};

const BRAND = { name:"Cascade Clean Pros", phone:"(360) 202-7249", tel:"3602027249", email:"info@cascadecleanpros.com", domain:"CascadeCleanPros.com" };

const STATS=["Free Estimates","Owner-Operated","King & Snohomish","Residential & Commercial"];

const RES=[
  {img:P.wand,title:"House Washing",desc:"Gentle soft wash lifts dirt, mold & mildew from siding — safe for every surface."},
  {img:P.drive1,title:"Driveway & Concrete",desc:"Restores concrete, pavers & walkways, with oil-stain treatment for tough spots."},
  {img:P.floor,title:"Deck & Patio",desc:"Brighten wood, composite & stone surfaces so your outdoor space looks new again."},
  {img:P.surface,title:"Walkways & Hardscape",desc:"Clear algae, moss & weathering from paths, steps, pavers & retaining walls."},
  {img:"/media/cascade-fence.jpg",title:"Fence Cleaning",desc:"Remove green algae, moss & grime from wood, vinyl and metal fencing."},
];

const ADDON_ICONS=[
  <svg key="i0" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/></svg>,
  <svg key="i1" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c3.4 4.1 5.4 6.6 5.4 9.2a5.4 5.4 0 0 1-10.8 0C6.6 9.6 8.6 7.1 12 3z"/></svg>,
  <svg key="i2" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3.5" width="16" height="17" rx="1.5"/><path d="M12 3.5v17M4 12h16"/></svg>,
  <svg key="i3" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 5.6v5.2c0 4.4 3 7.7 7 9.2 4-1.5 7-4.8 7-9.2V5.6L12 3z"/></svg>,
  <svg key="i4" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 21V7l1.5-2 1.5 2v14"/><path d="M10.5 21V7l1.5-2 1.5 2v14"/><path d="M16.5 21V7l1.5-2 1.5 2v14"/><path d="M3 11.5h18"/><path d="M3 16.5h18"/></svg>,
  <svg key="i5" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="10.5" height="5.5" rx="1.5"/><path d="M13.5 7.2h3.3a1.2 1.2 0 0 0 1.2-1.2V4.5"/><path d="M9 10v2a2 2 0 0 1-2 2 1.6 1.6 0 0 0-1.6 1.6V21"/></svg>,
  <svg key="i6" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14.6 6.4a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.4-3.4a6 6 0 0 1-7.8 7.8l-6.6 6.6a2.1 2.1 0 0 1-3-3l6.6-6.6a6 6 0 0 1 7.8-7.8l-3.4 3.4z"/></svg>,
];
const ADDON_SERVICES=[
  {title:"Roof Cleaning & Moss Treatment",desc:"We treat, kill, and clear moss and algae from your roof, then clean up — never high-pressure washing the shingles."},
  {title:"Gutter Cleaning & Clear-Out",desc:"Full gutter and downspout clear-out so water flows freely and your foundation stays protected."},
  {title:"Window Cleaning",desc:"Streak-free interior and exterior windows, with screen and track cleaning on request."},
  {title:"Concrete Sealing",desc:"Protective sealing after cleaning to guard concrete against stains, moisture, and wear."},
  {title:"Deck & Fence Staining",desc:"Refresh and protect wood after cleaning with quality stain or sealer for lasting color."},
  {title:"Exterior Painting Touch-Ups",desc:"Light exterior painting and touch-up work to finish off your property's refresh."},
  {title:"Odd Jobs — Just Ask",desc:"Got something else on your list? Debris haul-away and other small exterior tasks — ask us, we can likely help."},
];

const COMM=[
  {img:P.wand,title:"Apartment & Multi-Family",desc:"Breezeways, entryways, parking & common areas kept spotless portfolio-wide.",scope:"Breezeways · Walkways · Parking · Common Areas"},
  {img:P.surface,title:"Retail & Storefront",desc:"Clean sidewalks & entrances before customers arrive. Overnight service available.",scope:"Storefronts · Sidewalks · Drive-thrus · Entrances"},
  {img:P.floor,title:"Industrial & Warehouse",desc:"Loading docks, floors & equipment pads cleaned with care for the surrounding area.",scope:"Loading Docks · Floors · Equipment Pads"},
  {img:P.generic,title:"Office & Medical Parks",desc:"Professional exterior upkeep for campuses, clinics & professional buildings.",scope:"Building Exteriors · Walkways · Parking"},
  {img:P.drive1,title:"Restaurant & Food Service",desc:"Dumpster pads, drive-thru lanes & patios. Health-code ready.",scope:"Dumpster Pads · Patios · Drive-thrus"},
  {img:P.drive2,title:"Fleet & Equipment",desc:"On-site washing for trucks, vans & service vehicles. Keep your brand sharp.",scope:"Trucks · Vans · Heavy Equipment"},
];


const STEPS=[
  {n:"01",t:"Request a Quote",d:"Fill out the quick form or give us a call. We respond within an hour on business days."},
  {n:"02",t:"Free Assessment",d:"We measure, assess condition, and send an exact written quote — no obligation."},
  {n:"03",t:"Schedule & Prep",d:"Pick a date. We send prep notes and confirm 24 hours ahead."},
  {n:"04",t:"Professional Clean",d:"Right pressure, right chemistry, for every surface. On time, every time."},
  {n:"05",t:"Walkthrough",d:"A final walkthrough together to make sure every surface meets your expectations before we pack up — plus before-and-after photos of the work."},
];

const FAQS=[
  {q:"What's the difference between pressure washing and soft washing?",a:"Pressure washing uses high-pressure water for hard surfaces like concrete. Soft washing uses low pressure with specialized solutions for delicate surfaces like siding and roofs. We match the method to every surface."},
  {q:"Do you handle wastewater and stormwater compliance?",a:"Yes. We use biodegradable solutions and follow Washington Department of Ecology and county stormwater guidelines, with water-capture practices on commercial jobs."},
  {q:"Will pressure washing damage my property?",a:"Not when done correctly. We adjust pressure, nozzle, and chemistry for each surface and are trained to spot vulnerabilities before we start."},
  {q:"What areas do you serve?",a:"Our core service area is King and Snohomish Counties — the greater Seattle–Everett corridor. For larger residential and commercial projects we're happy to travel farther; just ask when you request your quote."},
];

const CITIES=["Lynnwood","Edmonds","Mill Creek","Everett","Mountlake Terrace","Mukilteo","Marysville","Lake Stevens","Snohomish","Monroe","Bothell","Woodinville","Kenmore","Kirkland","Redmond","Bellevue","Shoreline","Seattle","Sammamish","Issaquah"];


/* ===== Cascade blue-green palette ===== */
const C={
  ink:"#001838", deep:"#001230", blue:"#0054b4", green:"#0060c0", teal:"#0a66cc",
  aqua:"#84c0f0", aquaDk:"#5aa0e0", bg:"#f5f9fd", card:"#ffffff",
  text:"#0e1f3a", soft:"#48566e", mute:"#5d6a85", line:"#dde6f2", mist:"#eaf2fb"
};
const GRAD=`linear-gradient(135deg,${C.deep} 0%,${C.blue} 55%,${C.teal} 100%)`; // cascade navy→royal blue
const F="'Plus Jakarta Sans','Segoe UI',-apple-system,sans-serif";
const FS="'Fraunces','Georgia',serif";

function Reveal({children,style}){const r=useRef(null);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){e.target.classList.add("in");o.disconnect()}},{threshold:.12});if(r.current)o.observe(r.current);return()=>o.disconnect()},[]);return<div ref={r} className="fade-up" style={style}>{children}</div>}

function App(){
  const[tab,setTab]=useState("residential");
  const[lightbox,setLightbox]=useState(null);
  const[menuOpen,setMenuOpen]=useState(false);
  const[formActive,setFormActive]=useState(false);
  const[faq,setFaq]=useState(0);
  const[form,setForm]=useState({name:"",phone:"",email:"",service:"residential",notes:""});
  const[sent,setSent]=useState(false);
  const[sending,setSending]=useState(false);
  const[err,setErr]=useState("");
  const[sc,setSc]=useState(false);
  const FORM_ENDPOINT="https://script.google.com/macros/s/AKfycbwd6_grRUcJWzo2svxE7pEJX613jQlSKqaDFRJmNXKN858nrJ8sBUAwM6x83MvOb0-_/exec";
  const submitForm=async()=>{
    setErr("");
    if(!form.name.trim()){setErr("Please enter your name.");return;}
    if(!form.phone.trim()&&!form.email.trim()){setErr("Please add a phone or email so we can reach you.");return;}
    if(form.email.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())){setErr("That email doesn't look right — please check it.");return;}
    setSending(true);
    try{
      await fetch(FORM_ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(form)});
      setSent(true);
    }catch(e){
      setErr("Something went wrong sending your request. Please call us instead.");
    }finally{setSending(false);}
  };
  useEffect(()=>{const f=()=>setSc(window.scrollY>40);addEventListener("scroll",f);return()=>removeEventListener("scroll",f)},[]);
  useEffect(()=>{const k=e=>{if(e.key==="Escape")setLightbox(null);};addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[]);
  const go=id=>{const el=document.getElementById(id);if(!el)return;if(id==="quote"){if(innerWidth<880){el.scrollIntoView({behavior:"smooth",block:"start"});}else{scrollTo({top:0,behavior:"smooth"});}setFormActive(true);el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash");setTimeout(()=>el.classList.remove("flash"),10000);}else{el.scrollIntoView({behavior:"smooth",block:"start"});}};

  return(
    <div style={{fontFamily:F,color:C.text,background:C.bg,lineHeight:1.65,overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

      {lightbox&&<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,12,28,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:"4vw",cursor:"zoom-out"}}>
        <img src={lightbox} alt="Service detail" onClick={e=>e.stopPropagation()} style={{maxWidth:"96vw",maxHeight:"92vh",width:"auto",height:"auto",borderRadius:12,boxShadow:"0 30px 90px rgba(0,0,0,.55)",cursor:"default"}}/>
        <button onClick={()=>setLightbox(null)} aria-label="Close" style={{position:"fixed",top:"16px",right:"20px",width:46,height:46,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.18)",color:"#fff",fontSize:"1.7rem",lineHeight:1,cursor:"pointer"}}>×</button>
      </div>}

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"#ffffff",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.line}`,transition:"all .3s",boxShadow:"0 4px 24px rgba(0,24,56,.06)"}}>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"0 28px",display:"flex",justifyContent:"space-between",alignItems:"center",height:sc?64:82,transition:"height .3s"}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:42,height:42,borderRadius:12,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,84,180,.3)"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" fill="#fff" opacity=".95"/><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" stroke="#fff" strokeWidth="0"/></svg>
            </div>
            <div>
              <div style={{color:C.ink,fontWeight:700,fontSize:"1.1rem",lineHeight:1.1}}>{BRAND.name}</div>
              <div style={{color:C.blue,fontSize:".7rem",textTransform:"uppercase",letterSpacing:2.5,fontWeight:700}}>Exterior Cleaning · Puget Sound</div>
            </div>
          </div>
          <div style={{display:"flex",gap:30,alignItems:"center"}}>
            {[["Residential","services"],["Commercial","commercial"],["Add-Ons","addons"],["Areas","areas"],["FAQ","faq"]].map(a=>(
              <button key={a[1]} onClick={()=>go(a[1])} className="nd" style={{display:"none",padding:"10px 2px",background:"none",border:"none",color:C.text,fontSize:".84rem",fontWeight:600,cursor:"pointer",fontFamily:F}}>{a[0]}</button>
            ))}
            <button className="mnav" aria-label="Open menu" onClick={()=>setMenuOpen(o=>!o)} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:42,height:42,borderRadius:10,border:"none",background:"rgba(0,24,56,.06)",cursor:"pointer",color:C.ink,fontSize:"1.4rem",lineHeight:1}}>☰</button>
            <a href={`tel:${BRAND.tel}`} style={{color:C.blue,fontWeight:700,fontSize:".9rem"}}>{BRAND.phone}</a>
            <button onClick={()=>go("quote")} style={{background:GRAD,color:"#fff",border:"none",padding:"11px 22px",borderRadius:9,fontWeight:700,fontSize:".83rem",cursor:"pointer",fontFamily:F,boxShadow:"0 4px 16px rgba(0,84,180,.35)"}}>Free Quote</button>
          </div>
        </div>
      {menuOpen&&<div className="mmenu" style={{borderTop:"1px solid "+C.line,background:"#fff",padding:"8px 22px 16px",boxShadow:"0 12px 24px rgba(0,24,56,.08)"}}>
        {[["Residential","services"],["Commercial","commercial"],["Add-Ons","addons"],["Areas","areas"],["FAQ","faq"]].map(a=>(
          <button key={a[1]} onClick={()=>{go(a[1]);setMenuOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",borderBottom:"1px solid "+C.line,padding:"15px 2px",fontFamily:F,fontSize:"1rem",fontWeight:600,color:C.text,cursor:"pointer"}}>{a[0]}</button>
        ))}
      </div>}
      </nav>
      <style>{`@media(min-width:920px){.nd{display:inline-block !important}.mnav{display:none !important}.mmenu{display:none !important}}`}</style>

      {/* HERO */}
      <header style={{position:"relative",display:"flex",alignItems:"center",overflow:"hidden"}}>
        <div className="hv" style={{position:"absolute",inset:0}}>
          <video autoPlay muted loop playsInline poster="/media/hero-poster.jpg" aria-hidden="true" style={{width:"100%",height:"100%",objectFit:"cover"}}>
            <source src="/media/hero.mp4" type="video/mp4"/>
          </video>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(105deg,${C.ink}f5 0%,${C.deep}e0 40%,${C.blue}66 72%,transparent 100%)`}}/>
        </div>
        <div style={{position:"relative",zIndex:2,maxWidth:1240,margin:"0 auto",padding:"108px 28px 56px",width:"100%",display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:60,alignItems:"center"}} className="hg">
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:9,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:100,padding:"7px 16px",marginBottom:26,backdropFilter:"blur(8px)"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:C.aqua,boxShadow:`0 0 10px ${C.aqua}`}}/>
              <span style={{color:"rgba(255,255,255,.92)",fontSize:".8rem",fontWeight:600}}>Now booking Spring & Summer 2026</span>
            </div>
            <h1 style={{fontFamily:FS,fontSize:"clamp(2.3rem,6.5vw,4rem)",lineHeight:1.04,color:"#fff",letterSpacing:"-.02em",marginBottom:22,fontWeight:600}}>
              The Pacific Northwest's<br/><span style={{color:C.aqua,fontStyle:"italic"}}>exterior cleaning</span> specialists
            </h1>
            <p style={{fontSize:"1.18rem",color:"rgba(255,255,255,.8)",maxWidth:520,marginBottom:34,lineHeight:1.7}}>
              Commercial & residential pressure washing and soft washing across King & Snohomish Counties. From storefronts to driveways — done right, the first time. Backed by years of large-scale experience, from single driveways to multi-building commercial campuses.
            </p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:40}}>
              <button onClick={()=>go("quote")} style={{background:C.aqua,color:C.ink,border:"none",padding:"17px 34px",borderRadius:11,fontWeight:700,fontSize:"1.02rem",cursor:"pointer",fontFamily:F,boxShadow:"0 8px 28px rgba(63,192,180,.45)"}}>Get a Free Estimate →</button>
              <button onClick={()=>go("services")} style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1px solid rgba(255,255,255,.28)",padding:"13px 20px",borderRadius:10,fontWeight:600,fontSize:".92rem",cursor:"pointer",fontFamily:F}}>Residential Services</button>
              <button onClick={()=>go("commercial")} style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1px solid rgba(255,255,255,.28)",padding:"13px 20px",borderRadius:10,fontWeight:600,fontSize:".92rem",cursor:"pointer",fontFamily:F}}>Commercial Services</button>
              <button onClick={()=>go("addons")} style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1px solid rgba(255,255,255,.28)",padding:"13px 20px",borderRadius:10,fontWeight:600,fontSize:".92rem",cursor:"pointer",fontFamily:F}}>Other Services</button>
            </div>
            <div style={{display:"flex",gap:26,flexWrap:"wrap"}}>
              {["Eco-Friendly Methods","Free Estimates","Owner-Operated"].map(b=>(
                <div key={b} style={{display:"flex",alignItems:"center",gap:7,color:"rgba(255,255,255,.72)",fontSize:".84rem"}}><span style={{color:C.aqua}}>✓</span>{b}</div>
              ))}
            </div>
          </div>
          <div id="quote" className="hf" onClick={()=>setFormActive(true)} onFocusCapture={()=>setFormActive(true)} style={{scrollMarginTop:"95px",transition:"background .35s ease",background:formActive?"rgba(255,255,255,.97)":"rgba(255,255,255,.3)",borderRadius:20,padding:30,boxShadow:"0 30px 80px rgba(7,42,52,.4)"}}>
            {!sent?(<div>
              <div style={{fontSize:".76rem",textTransform:"uppercase",letterSpacing:2,color:C.teal,fontWeight:800,marginBottom:5}}>Free · No Obligation</div>
              <h3 style={{fontFamily:FS,fontSize:"1.5rem",marginBottom:3,color:C.ink,fontWeight:600}}>Get your quote today</h3>
              <p style={{fontSize:".82rem",color:C.mute,marginBottom:20}}>We respond within the hour, every business day.</p>
              {[["name","Full Name","text"],["phone","Phone","tel"],["email","Email","email"]].map(f=>(
                <input key={f[0]} type={f[2]} aria-label={f[1]} placeholder={f[1]} value={form[f[0]]} onChange={e=>setForm(p=>({...p,[f[0]]:e.target.value}))} style={{width:"100%",padding:"13px 15px",borderRadius:10,border:`1.5px solid ${C.line}`,fontSize:".94rem",fontFamily:F,background:formActive?C.mist:"rgba(234,242,251,.6)",boxSizing:"border-box",marginBottom:13}}/>
              ))}
              <select aria-label="Service type" value={form.service} onChange={e=>setForm(p=>({...p,service:e.target.value}))} style={{width:"100%",padding:"13px 15px",borderRadius:10,border:`1.5px solid ${C.line}`,fontSize:".94rem",fontFamily:F,background:formActive?C.mist:"rgba(234,242,251,.6)",boxSizing:"border-box",marginBottom:13}}>
                <option value="residential">Residential</option><option>Commercial — Small Business</option><option>Commercial — Mid-Size</option><option>Commercial — Enterprise / Property Mgmt</option>
              </select>
              <textarea aria-label="Project details" placeholder="Tell us about your project..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{width:"100%",padding:"13px 15px",borderRadius:10,border:`1.5px solid ${C.line}`,fontSize:".9rem",fontFamily:F,background:formActive?C.mist:"rgba(234,242,251,.6)",height:62,resize:"vertical",boxSizing:"border-box",marginBottom:14}}/>
              {err&&<div style={{background:"#fdecea",border:"1px solid #f5c2c0",color:"#b3261e",fontSize:".83rem",padding:"10px 13px",borderRadius:9,marginBottom:12}}>{err}</div>}
              <button onClick={submitForm} disabled={sending} style={{width:"100%",padding:15,background:GRAD,color:"#fff",border:"none",borderRadius:10,fontSize:"1rem",fontWeight:700,cursor:sending?"default":"pointer",fontFamily:F,opacity:sending?.7:1}}>{sending?"Sending…":"Request My Free Quote →"}</button><div style={{textAlign:"center",marginTop:16,fontSize:".84rem",color:C.soft,lineHeight:1.7}}>Prefer to call or email?<br/><a href={`tel:${BRAND.tel}`} style={{color:C.blue,fontWeight:700,textDecoration:"none"}}>{BRAND.phone}</a><span style={{margin:"0 7px",color:C.mute}}>·</span><a href={`mailto:${BRAND.email}`} style={{color:C.blue,fontWeight:700,textDecoration:"none",wordBreak:"break-word"}}>{BRAND.email}</a></div>
            </div>):(
            <div style={{textAlign:"center",padding:"30px 0"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:GRAD,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"1.8rem"}}>✓</div>
              <h4 style={{color:C.teal,marginBottom:8,fontSize:"1.2rem",fontFamily:FS}}>Request received!</h4>
              <p style={{color:C.soft,fontSize:".92rem",marginBottom:18}}>We'll contact you within the hour during business hours.</p>
              <a href={`tel:${BRAND.tel}`} style={{display:"inline-block",padding:"13px 26px",background:C.aqua,color:C.ink,borderRadius:10,fontWeight:700}}>Call {BRAND.phone}</a>
            </div>)}
          </div>
        </div>
      </header>
      <style>{`@media(max-width:880px){.hg{grid-template-columns:1fr !important}}@media(min-width:881px){.hv{transform:translateX(30px) scale(1.08)}.hf{transform:translateX(-28px)}}@keyframes formflash{0%,100%{box-shadow:0 0 0 0 rgba(132,192,240,0),0 30px 80px rgba(7,42,52,.4)}50%{box-shadow:0 0 0 5px rgba(132,192,240,.85),0 30px 80px rgba(7,42,52,.4)}}.flash{animation:formflash 2.5s ease-in-out 4}`}</style>

      {/* STATS */}
      <div style={{background:GRAD,padding:"26px 28px",marginTop:"-1px",position:"relative"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:"18px 30px"}}>
          {STATS.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,minWidth:170}}>
            <span style={{color:"rgba(255,255,255,.85)",fontSize:"1.1rem",fontWeight:800}}>✓</span>
            <span style={{fontSize:"1.05rem",fontWeight:700,color:"#fff",fontFamily:FS}}>{s}</span>
          </div>))}
        </div>
      </div>

      {/* RESIDENTIAL SERVICES */}
      <section id="services" style={{maxWidth:1240,margin:"0 auto",padding:"74px 28px 34px"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:14}}><span style={{fontSize:"1.15rem",textTransform:"uppercase",letterSpacing:2,color:C.teal,fontWeight:800}}>Residential</span></div>
          <h2 style={{fontFamily:FS,fontSize:"2.6rem",color:C.ink,textAlign:"center",marginBottom:14,fontWeight:600}}>Homes, top to bottom</h2>
          <p style={{fontSize:"1.08rem",color:C.soft,maxWidth:600,margin:"0 auto 8px",textAlign:"center"}}>Gentle, surface-safe soft washing and pressure washing for every part of your property.</p>
          <p style={{fontSize:".82rem",color:C.mute,textAlign:"center",marginBottom:38}}>Tap any service to enlarge.</p>
        </Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {[["/media/cascade-house-washing.jpg","House washing — soft wash for siding, trim, soffits and exterior surfaces"],["/media/cascade-driveway-concrete.jpg","Driveway and concrete cleaning"],["/media/cascade-deck-patio.jpg","Deck and patio cleaning"],["/media/cascade-walkways-hardscape.jpg","Walkways and hardscape cleaning"],["/media/cascade-fence-cleaning.jpg","Fence cleaning"]].map(p=>(
            <div key={p[0]} role="button" tabIndex={0} aria-label={"Enlarge: "+p[1]} onClick={()=>setLightbox(p[0])} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setLightbox(p[0]);}}} style={{display:"block",cursor:"zoom-in",borderRadius:14,overflow:"hidden",boxShadow:"0 5px 20px rgba(0,24,56,.10)",transition:"transform .3s,box-shadow .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 38px rgba(0,24,56,.18)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 5px 20px rgba(0,24,56,.10)";}}>
              <img src={p[0]} alt={p[1]} loading="lazy" decoding="async" style={{width:"100%",display:"block"}}/>
            </div>
          ))}
        </div>
      </section>

      {/* COMMERCIAL */}
      <section id="commercial" style={{margin:"50px 0 0"}}>
        <div style={{position:"relative",minHeight:480,display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0}}>
            <img src={P.surface} alt="Commercial pressure washing" loading="lazy" decoding="async" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(100deg,${C.ink}f5,${C.deep}d4 55%,${C.blue}88)`}}/>
          </div>
          <div style={{position:"relative",zIndex:2,maxWidth:1240,margin:"0 auto",padding:"56px 28px",width:"100%"}}>
            <div style={{maxWidth:620}}>
              <span style={{fontSize:"1.15rem",textTransform:"uppercase",letterSpacing:2,color:C.aqua,fontWeight:800}}>Commercial Division</span>
              <h2 style={{fontFamily:FS,fontSize:"2.6rem",color:"#fff",margin:"14px 0 18px",fontWeight:600,lineHeight:1.1}}>Built for property managers & business owners</h2>
              <p style={{fontSize:"1.08rem",color:"rgba(255,255,255,.82)",marginBottom:24,lineHeight:1.7}}>
                Moss and algae on concrete aren't just unsightly — when wet, they become a slip-and-fall liability for your tenants and customers. We help keep your property safe, clean, and presentable. With experience on large commercial properties and full multi-building campuses, no job is too big.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:30,maxWidth:520}}>
                {["Free on-site assessments & written bids","Flexible scheduling around your hours","Soft wash & pressure washing for every surface","Experienced on large multi-building properties"].map(x=>(
                  <div key={x} style={{display:"flex",gap:9,alignItems:"flex-start",color:"rgba(255,255,255,.88)",fontSize:".88rem"}}><span style={{color:C.aqua,fontWeight:800,flexShrink:0}}>✓</span>{x}</div>
                ))}
              </div>
              <button onClick={()=>go("quote")} style={{background:C.aqua,color:C.ink,border:"none",padding:"16px 32px",borderRadius:11,fontWeight:700,fontSize:"1rem",cursor:"pointer",fontFamily:F,boxShadow:"0 8px 28px rgba(63,192,180,.4)"}}>Request a Commercial Bid →</button>
            </div>
          </div>
        </div>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"48px 28px 60px"}}>
          <p style={{fontSize:"1.08rem",color:C.soft,maxWidth:600,margin:"0 auto 8px",textAlign:"center"}}>From storefronts and restaurants to warehouses and fleets — scheduled around your operations.</p>
          <p style={{fontSize:".82rem",color:C.mute,textAlign:"center",marginBottom:38}}>Tap any service to enlarge.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
            {[["/media/cascade-apartment-multifamily.jpg","Apartment and multi-family exterior cleaning"],["/media/cascade-retail-storefront.jpg","Retail and storefront cleaning"],["/media/cascade-industrial-warehouse.jpg","Industrial and warehouse cleaning"],["/media/cascade-office-medical.jpg","Office and medical park cleaning"],["/media/cascade-restaurant-food.jpg","Restaurant and food service cleaning"],["/media/cascade-fleet-equipment.jpg","Fleet and equipment washing — trucks, vans and heavy equipment"]].map(p=>(
              <div key={p[0]} role="button" tabIndex={0} aria-label={"Enlarge: "+p[1]} onClick={()=>setLightbox(p[0])} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setLightbox(p[0]);}}} style={{display:"block",cursor:"zoom-in",borderRadius:14,overflow:"hidden",boxShadow:"0 5px 20px rgba(0,24,56,.10)",transition:"transform .3s,box-shadow .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 38px rgba(0,24,56,.18)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 5px 20px rgba(0,24,56,.10)";}}>
                <img src={p[0]} alt={p[1]} loading="lazy" decoding="async" style={{width:"100%",display:"block"}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADD-ON SERVICES */}
      <section id="addons" style={{maxWidth:1240,margin:"0 auto",padding:"74px 28px 34px"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:44}}>
            <span style={{fontSize:"1.15rem",textTransform:"uppercase",letterSpacing:2,color:C.teal,fontWeight:800}}>More Than Pressure Washing</span>
            <h2 style={{fontFamily:FS,fontSize:"2.6rem",color:C.ink,margin:"12px 0",fontWeight:600}}>Additional services</h2>
            <p style={{fontSize:"1.06rem",color:C.soft,maxWidth:580,margin:"0 auto"}}>Bundle any of these with a wash to tackle your whole exterior to-do list in one visit — and if you don't see what you need, just ask.</p>
          </div>
        </Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20}}>
          {ADDON_SERVICES.map((s,i)=>(
            <Reveal key={s.title} style={{transitionDelay:`${i*70}ms`}}>
              <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:16,padding:"28px 26px",height:"100%",boxShadow:"0 2px 16px rgba(10,38,48,.05)",transition:"transform .3s,box-shadow .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 16px 36px rgba(10,38,48,.12)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 16px rgba(10,38,48,.05)"}}>
                <div style={{width:46,height:46,borderRadius:12,background:C.mist,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                  <span style={{color:C.blue,display:"flex"}}>{ADDON_ICONS[i]}</span>
                </div>
                <h4 style={{fontSize:"1.12rem",fontWeight:700,color:C.ink,marginBottom:8,fontFamily:FS}}>{s.title}</h4>
                <p style={{fontSize:".9rem",color:C.soft,lineHeight:1.65}}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:36}}>
          <button onClick={()=>go("quote")} style={{background:GRAD,color:"#fff",border:"none",padding:"15px 32px",borderRadius:11,fontWeight:700,fontSize:"1rem",cursor:"pointer",fontFamily:F}}>Ask About Add-On Services →</button>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{maxWidth:1240,margin:"0 auto",padding:"66px 28px"}}>
        <Reveal><div style={{textAlign:"center",marginBottom:50}}>
          <span style={{fontSize:"1.15rem",textTransform:"uppercase",letterSpacing:2,color:C.teal,fontWeight:800}}>How It Works</span>
          <h2 style={{fontFamily:FS,fontSize:"2.6rem",color:C.ink,margin:"12px 0",fontWeight:600}}>Simple, from quote to clean</h2>
        </div></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:16}}>
          {STEPS.map((s,i)=>(<Reveal key={i} style={{transitionDelay:`${i*70}ms`}}>
            <div style={{background:C.card,border:`1px solid ${C.line}`,borderRadius:14,padding:"26px 22px",height:"100%"}}>
              <div style={{fontFamily:FS,fontSize:"2rem",fontWeight:700,background:GRAD,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:10}}>{s.n}</div>
              <h4 style={{fontSize:"1rem",fontWeight:700,marginBottom:7,color:C.ink}}>{s.t}</h4>
              <p style={{fontSize:".86rem",color:C.soft,lineHeight:1.6}}>{s.d}</p>
            </div>
          </Reveal>))}
        </div>
      </section>

      {/* AREAS */}
      <section id="areas" style={{position:"relative",padding:"60px 28px",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:GRAD}}/>
        <div style={{position:"relative",zIndex:2,maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
          <span style={{fontSize:"1.15rem",textTransform:"uppercase",letterSpacing:2,color:"rgba(255,255,255,.85)",fontWeight:800}}>Coverage</span>
          <h2 style={{fontFamily:FS,fontSize:"2.6rem",color:"#fff",margin:"12px 0 8px",fontWeight:600}}>Serving King & Snohomish Counties</h2>
          <p style={{fontSize:"1.05rem",color:"rgba(255,255,255,.85)",marginBottom:8}}>Our home turf across the greater Seattle–Everett corridor.</p>
          <p style={{fontSize:".92rem",color:"rgba(255,255,255,.7)",marginBottom:30}}>Outside the area? We're happy to travel farther for larger and commercial projects — just ask.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:9,justifyContent:"center"}}>
            {CITIES.map(c=><span key={c} style={{background:"rgba(255,255,255,.14)",border:"1px solid rgba(255,255,255,.25)",padding:"8px 17px",borderRadius:100,fontSize:".85rem",color:"#fff",fontWeight:500}}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{maxWidth:820,margin:"0 auto",padding:"66px 28px"}}>
        <Reveal><div style={{textAlign:"center",marginBottom:44}}>
          <span style={{fontSize:"1.15rem",textTransform:"uppercase",letterSpacing:2,color:C.teal,fontWeight:800}}>Questions</span>
          <h2 style={{fontFamily:FS,fontSize:"2.6rem",color:C.ink,margin:"12px 0",fontWeight:600}}>Good to know</h2>
        </div></Reveal>
        {FAQS.map((f,i)=>(
          <div key={i} style={{borderBottom:`1px solid ${C.line}`}}>
            <button onClick={()=>setFaq(faq===i?-1:i)} style={{width:"100%",padding:"22px 0",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:F,fontSize:"1.03rem",fontWeight:600,color:C.ink,cursor:"pointer",textAlign:"left"}}>
              {f.q}<span style={{fontSize:"1.4rem",color:C.teal,transition:"transform .3s",transform:faq===i?"rotate(45deg)":"none",flexShrink:0,marginLeft:16}}>+</span>
            </button>
            {faq===i&&<div style={{padding:"0 0 22px",fontSize:".95rem",color:C.soft,lineHeight:1.7}}>{f.a}</div>}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section id="cta" style={{position:"relative",padding:"72px 28px",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0}}><img src={P.drive2} alt="" loading="lazy" decoding="async" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.ink}f2,${C.teal}cc)`}}/></div>
        <div style={{position:"relative",zIndex:2,maxWidth:680,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontFamily:FS,fontSize:"2.9rem",color:"#fff",marginBottom:14,fontWeight:600,lineHeight:1.1}}>Ready for a cleaner property?</h2>
          <p style={{fontSize:"1.12rem",color:"rgba(255,255,255,.85)",marginBottom:34}}>Free, no-obligation estimate. We respond within the hour.</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <a href={`tel:${BRAND.tel}`} style={{display:"inline-flex",alignItems:"center",gap:10,background:C.aqua,color:C.ink,padding:"18px 38px",borderRadius:12,fontSize:"1.2rem",fontWeight:800,boxShadow:"0 10px 30px rgba(63,192,180,.45)"}}>📞 {BRAND.phone}</a>
            <button onClick={()=>go("quote")} style={{background:"rgba(255,255,255,.14)",color:"#fff",border:"1px solid rgba(255,255,255,.32)",padding:"18px 32px",borderRadius:12,fontSize:"1rem",fontWeight:600,cursor:"pointer",fontFamily:F,backdropFilter:"blur(8px)"}}>↑ Back to Quote Form</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:C.deep,color:"rgba(255,255,255,.55)",padding:"56px 28px 32px"}}>
        <div style={{maxWidth:1240,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40}} className="fg">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:16}}>
              <div style={{width:40,height:40,borderRadius:11,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" fill="#fff" opacity=".95"/></svg>
              </div>
              <span style={{color:"#fff",fontWeight:700,fontSize:"1.05rem"}}>{BRAND.name}</span>
            </div>
            <p style={{fontSize:".88rem",lineHeight:1.7,maxWidth:320}}>Owner-operated exterior cleaning for the Pacific Northwest, built on years of large-scale, commercial-grade experience. Residential and commercial pressure washing and soft washing across King & Snohomish Counties — and beyond for larger projects.</p>
          </div>
          <div><h4 style={{color:"#fff",fontSize:".82rem",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Services</h4>{[["House Washing","services"],["Driveway & Concrete","services"],["Roof Moss Treatment","addons"],["Gutter Clear-Out","addons"],["Commercial","commercial"]].map(s=><div key={s[0]} onClick={()=>go(s[1])} style={{fontSize:".85rem",marginBottom:9,cursor:"pointer"}}>{s[0]}</div>)}</div>
          <div><h4 style={{color:"#fff",fontSize:".82rem",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Company</h4>{[["Commercial Bids","commercial"],["Service Areas","areas"],["FAQ","faq"],["Contact","quote"]].map(s=><div key={s[0]} onClick={()=>go(s[1])} style={{fontSize:".85rem",marginBottom:9,cursor:"pointer"}}>{s[0]}</div>)}</div>
          <div><h4 style={{color:"#fff",fontSize:".82rem",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Contact</h4><div style={{fontSize:".85rem",marginBottom:9}}><a href={`tel:${BRAND.tel}`} style={{color:"inherit",textDecoration:"none"}}>{BRAND.phone}</a></div><div style={{fontSize:".85rem",marginBottom:9}}><a href={`mailto:${BRAND.email}`} style={{color:"inherit",textDecoration:"none"}}>{BRAND.email}</a></div><div style={{fontSize:".85rem"}}>{BRAND.domain}</div></div>
        </div>
        <div style={{maxWidth:1240,margin:"40px auto 0",paddingTop:24,borderTop:"1px solid rgba(255,255,255,.12)",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <p style={{fontSize:".76rem"}}>© 2026 {BRAND.name}. All rights reserved.</p>
          <p style={{fontSize:".74rem",maxWidth:560,lineHeight:1.6}}>Owner-operated exterior cleaning serving King & Snohomish Counties. Free estimates subject to availability.</p>
        </div>
      </footer>
      <style>{`@media(max-width:820px){.fg{grid-template-columns:1fr 1fr !important}}`}</style>
    </div>
  );
}

export default App;
