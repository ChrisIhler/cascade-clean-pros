import React from "react";
const { useState, useEffect, useRef } = React;
import { BLOG_POSTS } from "./blog-content.js";
import { SERVICE_PAGES, LOCATION_PAGES } from "./page-content.js";

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
  {href:"/services/roof-cleaning/",title:"Roof Cleaning & Moss Treatment",desc:"We treat, kill, and clear moss and algae from your roof, then clean up — never high-pressure washing the shingles."},
  {href:"/services/gutter-cleaning/",title:"Gutter Cleaning & Clear-Out",desc:"Full gutter and downspout clear-out so water flows freely and your foundation stays protected."},
  {title:"Window Cleaning",desc:"Streak-free interior and exterior windows, with screen and track cleaning on request."},
  {href:"/services/driveway-concrete-cleaning/",title:"Concrete Sealing",desc:"Protective sealing after cleaning to guard concrete against stains, moisture, and wear."},
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
  {q:"How much does pressure washing cost?",a:"Every property is different — size, surfaces, and condition all affect the price. That's why we give a free, no-obligation on-site estimate with a written price before any work begins."},
  {q:"How often should I wash my home in the Pacific Northwest?",a:"In our damp climate, most homes benefit from a house wash about once a year to keep moss, algae, and mildew from taking hold. North-facing and heavily shaded areas may need it more often — we'll give you an honest recommendation at your estimate."},
  {q:"Do I need to be home during the service?",a:"Not necessarily. As long as we have access to the areas being cleaned and an outdoor water spigot, many jobs can be done while you're away. We'll confirm the details when we schedule."},
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

function Home(){
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
      if(window.fbq)window.fbq("track","Lead");
      if(window.gtag)window.gtag("event","generate_lead");
    }catch(e){
      setErr("Something went wrong sending your request. Please call us instead.");
    }finally{setSending(false);}
  };
  useEffect(()=>{const f=()=>setSc(window.scrollY>40);addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[]);
  useEffect(()=>{const k=e=>{if(e.key==="Escape")setLightbox(null);};addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[]);
  useEffect(()=>{const h=e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href^="tel:"]');if(a){if(window.gtag)window.gtag("event","phone_call_click");if(window.fbq)window.fbq("track","Contact");}};addEventListener("click",h);return()=>removeEventListener("click",h)},[]);
  const heroRef=useRef(null);
  useEffect(()=>{if(typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches&&heroRef.current)heroRef.current.pause();},[]);
  const go=id=>{const el=document.getElementById(id);if(!el)return;if(id==="quote"){if(innerWidth<880){el.scrollIntoView({behavior:"smooth",block:"start"});}else{scrollTo({top:0,behavior:"smooth"});}setFormActive(true);el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash");setTimeout(()=>el.classList.remove("flash"),10000);}else{el.scrollIntoView({behavior:"smooth",block:"start"});}};

  return(
    <div style={{fontFamily:F,color:C.text,background:C.bg,lineHeight:1.65,overflowX:"hidden"}}>
      <a href="#homemain" className="skiplink">Skip to content</a>

      {lightbox&&<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,12,28,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:"4vw",cursor:"zoom-out"}}>
        <img src={lightbox} alt="Service detail" onClick={e=>e.stopPropagation()} style={{maxWidth:"96vw",maxHeight:"92vh",width:"auto",height:"auto",borderRadius:12,boxShadow:"0 30px 90px rgba(0,0,0,.55)",cursor:"default"}}/>
        <button onClick={()=>setLightbox(null)} aria-label="Close" style={{position:"fixed",top:"16px",right:"20px",width:46,height:46,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.18)",color:"#fff",fontSize:"1.7rem",lineHeight:1,cursor:"pointer"}}>×</button>
      </div>}

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"#ffffff",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.line}`,transition:"all .3s",boxShadow:"0 4px 24px rgba(0,24,56,.06)"}}>
        <div className="nbar" style={{maxWidth:1240,margin:"0 auto",padding:"0 28px",display:"flex",justifyContent:"space-between",alignItems:"center",height:sc?64:82,transition:"height .3s"}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:42,height:42,borderRadius:12,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,84,180,.3)"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" fill="#fff" opacity=".95"/><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" stroke="#fff" strokeWidth="0"/></svg>
            </div>
            <div>
              <div className="lname" style={{color:C.ink,fontWeight:700,fontSize:"1.1rem",lineHeight:1.1}}>{BRAND.name}</div>
              <div className="ltag" style={{color:C.blue,fontSize:".7rem",textTransform:"uppercase",letterSpacing:2.5,fontWeight:700}}>Exterior Cleaning · Puget Sound</div>
            </div>
          </div>
          <div className="nactions" style={{display:"flex",gap:22,alignItems:"center"}}>
            {[["Services","/services/"],["Residential","services"],["Commercial","commercial"],["More Services","addons"],["Areas","areas"],["FAQ","faq"],["Blog","/blog/"]].map(a=>(
              a[1][0]==="/"
                ? <a key={a[1]} href={a[1]} className="nd" style={{display:"none",whiteSpace:"nowrap",padding:"10px 2px",color:C.text,fontSize:".84rem",fontWeight:600,fontFamily:F,textDecoration:"none"}}>{a[0]}</a>
                : <button key={a[1]} onClick={()=>go(a[1])} className={a[1]==="services"||a[1]==="commercial"?"nd nd-opt":"nd"} style={{display:"none",whiteSpace:"nowrap",padding:"10px 2px",background:"none",border:"none",color:C.text,fontSize:".84rem",fontWeight:600,cursor:"pointer",fontFamily:F}}>{a[0]}</button>
            ))}
            <button className="mnav" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(o=>!o)} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:42,height:42,borderRadius:10,border:"none",background:"rgba(0,24,56,.06)",cursor:"pointer",color:C.ink,fontSize:"1.4rem",lineHeight:1}}>☰</button>
            <a className="navphone" href={`tel:${BRAND.tel}`} style={{color:C.blue,fontWeight:700,fontSize:".9rem",whiteSpace:"nowrap"}}>{BRAND.phone}</a>
            <button onClick={()=>go("quote")} style={{background:GRAD,color:"#fff",border:"none",padding:"11px 22px",borderRadius:9,fontWeight:700,fontSize:".83rem",cursor:"pointer",fontFamily:F,boxShadow:"0 4px 16px rgba(0,84,180,.35)",whiteSpace:"nowrap"}}>Free Quote</button>
          </div>
        </div>
      {menuOpen&&<div className="mmenu" id="mobile-menu" style={{borderTop:"1px solid "+C.line,background:"#fff",padding:"8px 22px 16px",boxShadow:"0 12px 24px rgba(0,24,56,.08)"}}><a href={`tel:${BRAND.tel}`} style={{display:"flex",alignItems:"center",gap:8,padding:"15px 2px",borderBottom:"1px solid "+C.line,color:C.blue,fontWeight:700,fontSize:"1rem",textDecoration:"none"}}>📞 {BRAND.phone}</a>
        {[["Services","/services/"],["Residential","services"],["Commercial","commercial"],["More Services","addons"],["Areas","areas"],["FAQ","faq"],["Blog","/blog/"]].map(a=>(
          a[1][0]==="/"
            ? <a key={a[1]} href={a[1]} style={{display:"block",width:"100%",textAlign:"left",borderBottom:"1px solid "+C.line,padding:"15px 2px",fontFamily:F,fontSize:"1rem",fontWeight:600,color:C.text,textDecoration:"none"}}>{a[0]}</a>
            : <button key={a[1]} onClick={()=>{go(a[1]);setMenuOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",borderBottom:"1px solid "+C.line,padding:"15px 2px",fontFamily:F,fontSize:"1rem",fontWeight:600,color:C.text,cursor:"pointer"}}>{a[0]}</button>
        ))}
      </div>}
      </nav>
      <style>{`@media(min-width:768px){.nd{display:inline-block !important}.mnav{display:none !important}.mmenu{display:none !important}}@media(max-width:1240px){.nd-opt{display:none !important}}@media(min-width:768px) and (max-width:1024px){.nactions{gap:13px !important}.nd{font-size:.78rem !important;padding:10px 0 !important}.navphone{font-size:.82rem !important}.ltag{font-size:.62rem !important;letter-spacing:1.4px !important}}@media(max-width:767px){.nbar{height:auto !important;min-height:70px;padding-top:11px !important;padding-bottom:11px !important}.navphone{display:none !important}.lname{font-size:1rem !important;white-space:nowrap}.ltag{letter-spacing:1.1px !important;font-size:.6rem !important}.nactions{gap:14px !important}}.skiplink{position:absolute;left:-9999px}.skiplink:focus{position:fixed;left:8px;top:8px;z-index:9999;background:#fff;color:${C.blue};padding:10px 14px;border-radius:8px;box-shadow:0 4px 16px rgba(0,24,56,.2);font-weight:700;text-decoration:none}`}</style>

      <main id="homemain">
      {/* HERO */}
      <header style={{position:"relative",display:"flex",alignItems:"center",overflow:"hidden"}}>
        <div className="hv" style={{position:"absolute",inset:0}}>
          <video ref={heroRef} autoPlay muted loop playsInline poster="/media/hero-poster.jpg" aria-hidden="true" style={{width:"100%",height:"100%",objectFit:"cover"}}>
            <source src="/media/hero.mp4" type="video/mp4"/>
          </video>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(105deg,${C.ink}f5 0%,${C.deep}e0 40%,${C.blue}66 72%,transparent 100%)`}}/>
        </div>
        <div style={{position:"relative",zIndex:2,maxWidth:1240,margin:"0 auto",padding:"108px 28px 56px",width:"100%",display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:60,alignItems:"center"}} className="hg">
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:9,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:100,padding:"7px 16px",marginBottom:26,backdropFilter:"blur(8px)"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:C.aqua,boxShadow:`0 0 10px ${C.aqua}`}}/>
              <span style={{color:"rgba(255,255,255,.92)",fontSize:".8rem",fontWeight:600}}>Now booking — free on-site estimates</span>
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
              <button onClick={()=>go("addons")} style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1px solid rgba(255,255,255,.28)",padding:"13px 20px",borderRadius:10,fontWeight:600,fontSize:".92rem",cursor:"pointer",fontFamily:F}}>More Services</button>
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
              {[["name","Full Name","text","name"],["phone","Phone","tel","tel"],["email","Email","email","email"]].map(f=>(
                <input key={f[0]} type={f[2]} autoComplete={f[3]} aria-label={f[1]} placeholder={f[1]} value={form[f[0]]} onChange={e=>setForm(p=>({...p,[f[0]]:e.target.value}))} style={{width:"100%",padding:"13px 15px",borderRadius:10,border:`1.5px solid ${C.line}`,fontSize:".94rem",fontFamily:F,background:formActive?C.mist:"rgba(234,242,251,.6)",boxSizing:"border-box",marginBottom:13}}/>
              ))}
              <select aria-label="Service type" value={form.service} onChange={e=>setForm(p=>({...p,service:e.target.value}))} style={{width:"100%",padding:"13px 15px",borderRadius:10,border:`1.5px solid ${C.line}`,fontSize:".94rem",fontFamily:F,background:formActive?C.mist:"rgba(234,242,251,.6)",boxSizing:"border-box",marginBottom:13}}>
                <option value="residential">Residential</option><option>Gutter Cleaning</option><option>Commercial — Small Business</option><option>Commercial — Mid-Size</option><option>Commercial — Enterprise / Property Mgmt</option>
              </select>
              <textarea aria-label="Project details" placeholder="Tell us about your project..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{width:"100%",padding:"13px 15px",borderRadius:10,border:`1.5px solid ${C.line}`,fontSize:".9rem",fontFamily:F,background:formActive?C.mist:"rgba(234,242,251,.6)",height:100,minHeight:80,resize:"vertical",boxSizing:"border-box",marginBottom:14}}/>
              {err&&<div style={{background:"#fdecea",border:"1px solid #f5c2c0",color:"#b3261e",fontSize:".83rem",padding:"10px 13px",borderRadius:9,marginBottom:12}}>{err}</div>}
              <button onClick={submitForm} disabled={sending} style={{width:"100%",padding:15,background:GRAD,color:"#fff",border:"none",borderRadius:10,fontSize:"1rem",fontWeight:700,cursor:sending?"default":"pointer",fontFamily:F,opacity:sending?.7:1}}>{sending?"Sending…":"Request My Free Quote →"}</button><div style={{textAlign:"center",marginTop:16,fontSize:".84rem",color:C.soft,lineHeight:1.5}}>Prefer to call or email?<div style={{marginTop:6}}><a href={`tel:${BRAND.tel}`} style={{color:C.blue,fontWeight:700,fontSize:"1.02rem",textDecoration:"none",whiteSpace:"nowrap"}}>{BRAND.phone}</a></div><div style={{marginTop:3}}><a href={`mailto:${BRAND.email}`} style={{color:C.blue,fontWeight:700,textDecoration:"none",wordBreak:"break-word"}}>{BRAND.email}</a></div></div>
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

      {/* FALL GUTTER OFFER */}
      <section id="gutters" aria-label="Fall gutter cleaning offer" style={{maxWidth:1240,margin:"0 auto",padding:"46px 28px 0"}}>
        <Reveal>
          <div style={{background:C.mist,border:`1.5px solid ${C.aqua}`,borderRadius:18,padding:"30px 30px",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"22px 30px"}}>
            <div style={{flex:"1 1 420px"}}>
              <span style={{fontSize:".95rem",textTransform:"uppercase",letterSpacing:2,color:C.teal,fontWeight:800}}>New This Fall · Gutter Cleaning</span>
              <h2 style={{fontFamily:FS,fontSize:"2rem",color:C.ink,margin:"8px 0 10px",fontWeight:600,lineHeight:1.15}}>Beat the rains: gutters cleared from $99</h2>
              <p style={{fontSize:"1.02rem",color:C.soft,margin:0}}>Fall intro pricing: <strong style={{color:C.ink}}>$99 one-story, $149 two-story.</strong> Debris hauled away, downspouts checked, before and after photos, and a 30-day overflow guarantee. Serving Lynnwood and nearby.</p>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <a href={`tel:${BRAND.tel}`} style={{display:"inline-flex",alignItems:"center",gap:8,background:GRAD,color:"#fff",padding:"15px 26px",borderRadius:11,fontWeight:700,fontSize:"1rem"}}>Call or Text {BRAND.phone}</a>
              <button onClick={()=>{setForm(p=>({...p,service:"Gutter Cleaning"}));go("quote");}} style={{background:"#fff",color:C.blue,border:`1.5px solid ${C.blue}`,padding:"15px 24px",borderRadius:11,fontWeight:700,fontSize:"1rem",cursor:"pointer",fontFamily:F}}>Book Online</button>
              <a href="/services/gutter-cleaning/" style={{display:"inline-flex",alignItems:"center",color:C.blue,padding:"15px 6px",fontWeight:700,fontSize:"1rem"}}>Details →</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* RESIDENTIAL SERVICES */}
      <section id="services" style={{maxWidth:1240,margin:"0 auto",padding:"74px 28px 34px"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:14}}><span style={{fontSize:"1.15rem",textTransform:"uppercase",letterSpacing:2,color:C.teal,fontWeight:800}}>Residential</span></div>
          <h2 style={{fontFamily:FS,fontSize:"2.6rem",color:C.ink,textAlign:"center",marginBottom:14,fontWeight:600}}>Homes, top to bottom</h2>
          <p style={{fontSize:"1.08rem",color:C.soft,maxWidth:600,margin:"0 auto 8px",textAlign:"center"}}>Gentle, surface-safe soft washing and pressure washing for every part of your property.</p>
          <p style={{fontSize:".82rem",color:C.mute,textAlign:"center",marginBottom:38}}>Tap a photo to enlarge, or open a service for details and pricing.</p>
        </Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {[["/media/cascade-house-washing.jpg","House washing — soft wash for siding, trim, soffits and exterior surfaces","/services/house-washing/","House Washing"],["/media/cascade-driveway-concrete.jpg","Driveway and concrete cleaning","/services/driveway-concrete-cleaning/","Driveway & Concrete"],["/media/cascade-deck-patio.jpg","Deck and patio cleaning",null,"Deck & Patio"],["/media/cascade-walkways-hardscape.jpg","Walkways and hardscape cleaning","/services/driveway-concrete-cleaning/","Walkways & Hardscape"],["/media/cascade-fence-cleaning.jpg","Fence cleaning",null,"Fence Cleaning"]].map(p=>(
            <div key={p[0]} style={{borderRadius:14,overflow:"hidden",background:"#fff",boxShadow:"0 5px 20px rgba(0,24,56,.10)",transition:"transform .3s,box-shadow .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 38px rgba(0,24,56,.18)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 5px 20px rgba(0,24,56,.10)";}}>
              <div role="button" tabIndex={0} aria-label={"Enlarge: "+p[1]} onClick={()=>setLightbox(p[0])} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setLightbox(p[0]);}}} style={{cursor:"zoom-in"}}><img src={p[0]} alt={p[1]} loading="lazy" decoding="async" style={{width:"100%",display:"block"}}/></div>
                <a href={p[2]||"#quote"} onClick={p[2]?undefined:e=>{e.preventDefault();go("quote");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,padding:"13px 16px",color:C.ink,fontWeight:700,fontSize:".95rem",textDecoration:"none",borderTop:`1px solid ${C.line}`}}><span>{p[3]}</span><span style={{color:C.blue,whiteSpace:"nowrap"}}>{p[2]?"See details →":"Get a quote →"}</span></a>
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
              <p style={{fontSize:"1.05rem",color:"rgba(255,255,255,.78)",margin:"22px 0 0",maxWidth:520,lineHeight:1.6,textAlign:"left"}}>From storefronts and restaurants to warehouses and fleets — scheduled around your operations.</p>
            </div>
          </div>
        </div>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"48px 28px 60px"}}>
          <p style={{fontSize:".82rem",color:C.mute,textAlign:"center",marginBottom:38}}>Tap a photo to enlarge, or open a service for details and pricing.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
            {[["/media/cascade-apartment-multifamily.jpg","Apartment and multi-family exterior cleaning","/services/commercial-fleet-washing/","Apartment & Multi-Family"],["/media/cascade-retail-storefront.jpg","Retail and storefront cleaning","/services/commercial-fleet-washing/","Retail & Storefront"],["/media/cascade-industrial-warehouse.jpg","Industrial and warehouse cleaning","/services/commercial-fleet-washing/","Industrial & Warehouse"],["/media/cascade-office-medical.jpg","Office and medical park cleaning","/services/commercial-fleet-washing/","Office & Medical Parks"],["/media/cascade-restaurant-food.jpg","Restaurant and food service cleaning","/services/commercial-fleet-washing/","Restaurant & Food Service"],["/media/cascade-fleet-equipment.jpg","Fleet and equipment washing — trucks, vans and heavy equipment","/services/commercial-fleet-washing/","Fleet & Equipment"]].map(p=>(
              <div key={p[0]} style={{borderRadius:14,overflow:"hidden",background:"#fff",boxShadow:"0 5px 20px rgba(0,24,56,.10)",transition:"transform .3s,box-shadow .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 38px rgba(0,24,56,.18)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 5px 20px rgba(0,24,56,.10)";}}>
                <div role="button" tabIndex={0} aria-label={"Enlarge: "+p[1]} onClick={()=>setLightbox(p[0])} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setLightbox(p[0]);}}} style={{cursor:"zoom-in"}}><img src={p[0]} alt={p[1]} loading="lazy" decoding="async" style={{width:"100%",display:"block"}}/></div>
                <a href={p[2]||"#quote"} onClick={p[2]?undefined:e=>{e.preventDefault();go("quote");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,padding:"13px 16px",color:C.ink,fontWeight:700,fontSize:".95rem",textDecoration:"none",borderTop:`1px solid ${C.line}`}}><span>{p[3]}</span><span style={{color:C.blue,whiteSpace:"nowrap"}}>{p[2]?"See details →":"Get a quote →"}</span></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MORE SERVICES (formerly "Add-Ons") */}
      <section id="addons" style={{maxWidth:1240,margin:"0 auto",padding:"74px 28px 34px"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:44}}>
            <span style={{fontSize:"1.15rem",textTransform:"uppercase",letterSpacing:2,color:C.teal,fontWeight:800}}>More Than Pressure Washing</span>
            <h2 style={{fontFamily:FS,fontSize:"2.6rem",color:C.ink,margin:"12px 0",fontWeight:600}}>More services</h2>
            <p style={{fontSize:"1.06rem",color:C.soft,maxWidth:580,margin:"0 auto"}}>Bundle any of these with a wash to tackle your whole exterior to-do list in one visit — and if you don't see what you need, just ask.</p>
          </div>
        </Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20}}>
          {ADDON_SERVICES.map((s,i)=>(
            <Reveal key={s.title} style={{transitionDelay:`${i*70}ms`}}>
              <a href={s.href||undefined} style={{display:"block",textDecoration:"none",color:"inherit",background:C.card,border:`1px solid ${C.line}`,borderRadius:16,padding:"28px 26px",height:"100%",boxShadow:"0 2px 16px rgba(10,38,48,.05)",transition:"transform .3s,box-shadow .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 16px 36px rgba(10,38,48,.12)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 16px rgba(10,38,48,.05)"}}>
                <div style={{width:46,height:46,borderRadius:12,background:C.mist,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                  <span style={{color:C.blue,display:"flex"}}>{ADDON_ICONS[i]}</span>
                </div>
                <h4 style={{fontSize:"1.12rem",fontWeight:700,color:C.ink,marginBottom:8,fontFamily:FS}}>{s.title}</h4>
                <p style={{fontSize:".9rem",color:C.soft,lineHeight:1.65}}>{s.desc}</p>
                {s.href&&<span style={{display:"inline-block",marginTop:12,color:C.blue,fontWeight:700,fontSize:".9rem"}}>See details →</span>}
              </a>
            </Reveal>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:36}}>
          <button onClick={()=>go("quote")} style={{background:GRAD,color:"#fff",border:"none",padding:"15px 32px",borderRadius:11,fontWeight:700,fontSize:"1rem",cursor:"pointer",fontFamily:F}}>Ask About More Services →</button>
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

      {/* MEET THE OWNERS */}
      <section id="owners" style={{maxWidth:1240,margin:"0 auto",padding:"56px 28px"}}>
        <div style={{background:C.mist,border:`1px solid ${C.line}`,borderRadius:20,padding:"36px 32px",display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{width:96,height:96,borderRadius:24,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 8px 24px rgba(0,84,180,.3)"}}>
            <svg width="48" height="48" viewBox="0 0 24 24"><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" fill="#fff" opacity=".95"/></svg>
          </div>
          <div style={{flex:"1 1 320px"}}>
            <h2 style={{fontFamily:FS,fontSize:"1.7rem",fontWeight:600,color:C.ink,margin:"0 0 10px"}}>Meet Chris &amp; Corey Ihler</h2>
            <p style={{fontSize:"1.02rem",color:C.soft,lineHeight:1.7,margin:0}}>Cascade Clean Pros is owner-operated by twin brothers Chris and Corey Ihler. They're hands-on with every project — from the free on-site estimate to the final walkthrough — matching the right pressure and method to each surface. Local, family-run, and serving homes and businesses across King &amp; Snohomish Counties.</p>
          </div>
        </div>
      </section>
      </main>
      {/* FOOTER */}
      <footer style={{background:C.deep,color:"rgba(255,255,255,.55)",padding:"56px 28px 32px"}}>
        <div style={{maxWidth:1240,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:40}} className="fg">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:16}}>
              <div style={{width:40,height:40,borderRadius:11,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" fill="#fff" opacity=".95"/></svg>
              </div>
              <span style={{color:"#fff",fontWeight:700,fontSize:"1.05rem"}}>{BRAND.name}</span>
            </div>
            <p style={{fontSize:".88rem",lineHeight:1.7,maxWidth:320}}>Owner-operated exterior cleaning for the Pacific Northwest, built on years of large-scale, commercial-grade experience. Residential and commercial pressure washing and soft washing across King & Snohomish Counties — and beyond for larger projects.</p>
          </div>
          <div><h4 style={{color:"#fff",fontSize:".82rem",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Services</h4>{[["House Washing","/services/house-washing/"],["Roof Cleaning","/services/roof-cleaning/"],["Commercial & Fleet","/services/commercial-fleet-washing/"],["Driveway & Concrete","/services/driveway-concrete-cleaning/"]].map(s=><a key={s[0]} href={s[1]} style={{display:"block",color:"inherit",fontSize:".85rem",marginBottom:9,textDecoration:"none"}}>{s[0]}</a>)}</div>
          <div><h4 style={{color:"#fff",fontSize:".82rem",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Service Areas</h4>{[["Lynnwood, WA","/locations/lynnwood-wa/"],["Everett, WA","/locations/everett-wa/"],["Kirkland, WA","/locations/kirkland-wa/"],["Mill Creek, WA","/locations/mill-creek-wa/"]].map(s=><a key={s[0]} href={s[1]} style={{display:"block",color:"inherit",fontSize:".85rem",marginBottom:9,textDecoration:"none"}}>{s[0]}</a>)}</div>
          <div><h4 style={{color:"#fff",fontSize:".82rem",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Company</h4>{[["Commercial Bids","commercial"],["Blog","/blog/"],["FAQ","faq"],["Contact","quote"]].map(s=>{const u=s[1][0]==="/";return <a key={s[0]} href={u?s[1]:"/#"+s[1]} onClick={u?undefined:e=>{e.preventDefault();go(s[1]);}} style={{display:"block",color:"inherit",fontSize:".85rem",marginBottom:9,textDecoration:"none",cursor:"pointer"}}>{s[0]}</a>;})}</div>
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

/* ===========================================================
   SUB-PAGE SHELL (blog / future service + location pages)
   Static (no hooks) so prerender + hydration always match.
   =========================================================== */
function SubNav(){
  return (
    <nav style={{position:"sticky",top:0,zIndex:200,background:"#fff",borderBottom:`1px solid ${C.line}`,boxShadow:"0 4px 24px rgba(0,24,56,.06)"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"12px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
          <div style={{width:38,height:38,borderRadius:11,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" fill="#fff" opacity=".95"/></svg>
          </div>
          <span style={{color:C.ink,fontWeight:800,fontSize:"1.02rem"}}>{BRAND.name}</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <a href="/services/" className="snl snl-keep" style={{color:C.text,fontWeight:600,fontSize:".9rem",textDecoration:"none"}}>Services</a>
          <a href="/locations/" className="snl" style={{color:C.text,fontWeight:600,fontSize:".9rem",textDecoration:"none"}}>Areas</a>
          <a href="/blog/" className="snl" style={{color:C.text,fontWeight:600,fontSize:".9rem",textDecoration:"none"}}>Blog</a>
          <a href={`tel:${BRAND.tel}`} className="snl" style={{color:C.blue,fontWeight:700,fontSize:".9rem",textDecoration:"none"}}>{BRAND.phone}</a>
          <a href="/#quote" style={{background:GRAD,color:"#fff",padding:"10px 18px",borderRadius:9,fontWeight:700,fontSize:".82rem",textDecoration:"none"}}>Free Quote</a>
        </div>
      </div>
    </nav>
  );
}
function Breadcrumbs({crumbs,width=760}){
  return (
    <nav aria-label="Breadcrumb" style={{maxWidth:width,margin:"0 auto",padding:"20px 22px 0",fontSize:".82rem",color:C.mute}}>
      {crumbs.map((c,i)=>(
        <span key={i}>
          {i>0 && <span style={{margin:"0 7px",color:C.line}}>/</span>}
          {c.url ? <a href={c.url} style={{color:C.mute,textDecoration:"none"}}>{c.name}</a> : <span style={{color:C.soft}}>{c.name}</span>}
        </span>
      ))}
    </nav>
  );
}
function QuoteCTA(){
  return (
    <section style={{background:GRAD,padding:"54px 22px",marginTop:56}}>
      <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
        <h2 style={{fontFamily:FS,color:"#fff",fontSize:"2rem",fontWeight:600,margin:"0 0 10px"}}>Get a free, no-obligation estimate</h2>
        <p style={{color:"rgba(255,255,255,.85)",fontSize:"1.02rem",margin:"0 0 26px",lineHeight:1.6}}>Owner-operated exterior cleaning across King &amp; Snohomish Counties. We respond within the hour on business days.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/#quote" style={{background:C.aqua,color:C.ink,padding:"15px 30px",borderRadius:11,fontWeight:700,fontSize:"1rem",textDecoration:"none"}}>Request a Free Estimate →</a>
          <a href={`tel:${BRAND.tel}`} style={{background:"rgba(255,255,255,.14)",color:"#fff",border:"1px solid rgba(255,255,255,.32)",padding:"15px 26px",borderRadius:11,fontWeight:600,fontSize:"1rem",textDecoration:"none"}}>Call {BRAND.phone}</a>
        </div>
      </div>
    </section>
  );
}
function SubFooter(){
  return (
    <footer style={{background:C.ink,color:"rgba(255,255,255,.7)",padding:"40px 22px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
        <div style={{maxWidth:320}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:34,height:34,borderRadius:10,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" fill="#fff" opacity=".95"/></svg>
            </div>
            <span style={{color:"#fff",fontWeight:700}}>{BRAND.name}</span>
          </div>
          <p style={{fontSize:".85rem",lineHeight:1.7}}>Owner-operated pressure &amp; soft washing serving King &amp; Snohomish Counties, WA. Free estimates.</p>
        </div>
        <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
          <div>
            <h4 style={{color:"#fff",fontSize:".8rem",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Explore</h4>
            <div style={{fontSize:".85rem",marginBottom:8}}><a href="/" style={{color:"inherit",textDecoration:"none"}}>Home</a></div>
            <div style={{fontSize:".85rem",marginBottom:8}}><a href="/blog/" style={{color:"inherit",textDecoration:"none"}}>Blog</a></div>
            <div style={{fontSize:".85rem",marginBottom:8}}><a href="/#quote" style={{color:"inherit",textDecoration:"none"}}>Free Quote</a></div>
          </div>
          <div>
            <h4 style={{color:"#fff",fontSize:".8rem",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Contact</h4>
            <div style={{fontSize:".85rem",marginBottom:8}}><a href={`tel:${BRAND.tel}`} style={{color:"inherit",textDecoration:"none"}}>{BRAND.phone}</a></div>
            <div style={{fontSize:".85rem",marginBottom:8}}><a href={`mailto:${BRAND.email}`} style={{color:"inherit",textDecoration:"none"}}>{BRAND.email}</a></div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"28px auto 0",paddingTop:18,borderTop:"1px solid rgba(255,255,255,.12)",fontSize:".76rem"}}>© 2026 {BRAND.name}. All rights reserved.</div>
    </footer>
  );
}
function Shell({crumbs,children,sticky,wide}){
  return (
    <div className={sticky?"has-sticky":undefined} style={{background:"#fff",minHeight:"100vh",fontFamily:F,color:C.text}}>
      <a href="#main" className="skiplink">Skip to content</a>
      <SubNav/>
      <main id="main">
      {crumbs && <Breadcrumbs crumbs={crumbs} width={wide||760}/>}
      {children}
      <QuoteCTA/>
      </main>
      <SubFooter/>
      {sticky && <StickyCall/>}
      <style dangerouslySetInnerHTML={{__html:SVC_CSS+`
        .skiplink{position:absolute;left:-9999px}.skiplink:focus{position:fixed;left:8px;top:8px;z-index:9999;background:#fff;color:${C.blue};padding:10px 14px;border-radius:8px;box-shadow:0 4px 16px rgba(0,24,56,.2);font-weight:700;text-decoration:none}
        .article{max-width:760px;margin:0 auto;padding:12px 22px 0;font-size:1.06rem;line-height:1.75;color:${C.text}}
        .article h1{font-family:${FS};font-weight:600;font-size:2.35rem;line-height:1.12;color:${C.ink};margin:.3em 0 .5em}
        .article h2{font-family:${FS};font-weight:600;font-size:1.6rem;color:${C.ink};margin:1.6em 0 .5em}
        .article h3{font-weight:700;font-size:1.18rem;color:${C.ink};margin:1.4em 0 .4em}
        .article p{margin:0 0 1.1em}
        .article ul,.article ol{margin:0 0 1.1em 1.3em}
        .article li{margin:.35em 0}
        .article a{color:${C.blue};text-decoration:underline}
        .article strong{color:${C.ink}}
        .article blockquote{margin:1.3em 0;padding:16px 20px;background:${C.mist};border-left:4px solid ${C.blue};border-radius:8px}
        .article blockquote p{margin:.4em 0}
        .article table{width:100%;border-collapse:collapse;margin:1.4em 0;font-size:.95rem}
        .article th,.article td{border:1px solid ${C.line};padding:10px 12px;text-align:left;vertical-align:top}
        .article th{background:${C.mist};color:${C.ink};font-weight:700}
        .article hr{border:none;border-top:1px solid ${C.line};margin:2em 0}
        .article code{background:${C.mist};padding:2px 6px;border-radius:5px;font-size:.9em}
        @media(max-width:520px){.snl{display:none}.snl-keep{display:inline !important}.article h1{font-size:1.8rem}.article h2{font-size:1.35rem}}
      `}}/>
    </div>
  );
}
function BlogIndex(){
  return (
    <Shell crumbs={[{name:"Home",url:"/"},{name:"Blog"}]}>
      <div style={{maxWidth:760,margin:"0 auto",padding:"12px 22px 0"}}>
        <h1 style={{fontFamily:FS,fontWeight:600,fontSize:"2.35rem",color:C.ink,margin:".2em 0 .3em",lineHeight:1.12}}>The Cascade Clean Pros Blog</h1>
        <p style={{fontSize:"1.08rem",color:C.soft,margin:"0 0 30px",lineHeight:1.7}}>Practical guides to exterior cleaning, soft washing, and protecting your home from moss and algae in the Pacific Northwest climate.</p>
        <div style={{display:"grid",gap:18}}>
          {BLOG_POSTS.map(p=>(
            <a key={p.slug} href={p.path} style={{display:"block",border:`1px solid ${C.line}`,borderRadius:14,padding:"22px 24px",textDecoration:"none",background:"#fff",boxShadow:"0 4px 18px rgba(0,24,56,.05)"}}>
              <h2 style={{fontFamily:FS,fontWeight:600,fontSize:"1.35rem",color:C.ink,margin:"0 0 8px",lineHeight:1.2}}>{p.title}</h2>
              <p style={{fontSize:".96rem",color:C.soft,margin:"0 0 12px",lineHeight:1.6}}>{p.metaDescription}</p>
              <span style={{color:C.blue,fontWeight:700,fontSize:".9rem"}}>Read more →</span>
            </a>
          ))}
        </div>
      </div>
    </Shell>
  );
}
function RelatedCard({p}){
  return (
    <a href={p.path} style={{display:"block",border:`1px solid ${C.line}`,borderRadius:12,padding:"16px 20px",textDecoration:"none",background:"#fff"}}>
      <span style={{display:"block",fontWeight:700,color:C.ink,marginBottom:4}}>{p.title}</span>
      <span style={{fontSize:".9rem",color:C.soft,lineHeight:1.5}}>{p.metaDescription}</span>
    </a>
  );
}
function BlogPost({post}){
  const others = BLOG_POSTS.filter(p=>p.slug!==post.slug);
  return (
    <Shell crumbs={[{name:"Home",url:"/"},{name:"Blog",url:"/blog/"},{name:post.title}]}>
      <article className="article" dangerouslySetInnerHTML={{__html:post.html}}/>
      {others.length>0 &&
        <div style={{maxWidth:760,margin:"40px auto 0",padding:"0 22px"}}>
          <h2 style={{fontFamily:FS,fontWeight:600,fontSize:"1.4rem",color:C.ink,margin:"0 0 16px"}}>Related guides</h2>
          <div style={{display:"grid",gap:14}}>{others.map(p=><RelatedCard key={p.slug} p={p}/>)}</div>
          <div style={{marginTop:18}}><a href="/blog/" style={{color:C.blue,fontWeight:700,textDecoration:"none"}}>← All guides</a></div>
        </div>}
    </Shell>
  );
}

/* ===== Service catalog: icons, card photos, quick facts =====
   Card photos in /media/cards/ are crops of the site's service graphics (title
   text trimmed off). The gutter photo is an Unsplash stock image — it is
   credited as stock wherever it appears and never captioned as our own job. */
const ICO={
  house:["M3 10.5 12 3l9 7.5","M5.5 9.5V20h13V9.5","M10 20v-5h4v5"],
  roof:["M2 13 12 4l10 9","M5 11v9h14v-9","M8 8.5l1-1M12 7l1-1M15.5 9l1-1"],
  gutter:["M3 6h18l-1.5 4h-15z","M17 10v7a3 3 0 0 1-3 3h-2","M8 14c-.8 1.2-1.2 2-1.2 2.6a1.2 1.2 0 0 0 2.4 0c0-.6-.4-1.4-1.2-2.6z"],
  drive:["M8 3 5 21","M16 3l3 18","M12 4v2.5M12 10v2.5M12 16v3"],
  deck:["M3 9h18","M3 13h18","M3 17h18","M6 17v4M18 17v4","M5 9V5h14v4"],
  path:["M9 21c0-4 6-5 6-9s-4-5-4-9","M5 21c0-5 6-6 6-10","M19 21c0-4-3-6-3-9"],
  fence:["M4.5 21V7l1.5-2 1.5 2v14","M10.5 21V7l1.5-2 1.5 2v14","M16.5 21V7l1.5-2 1.5 2v14","M3 11.5h18","M3 16.5h18"],
  apt:["M4 21V4h10v17","M14 9h6v12","M7 8h1M10 8h1M7 12h1M10 12h1M7 16h1M10 16h1M17 13h0M17 17h0","M2 21h20"],
  store:["M3 9l1.5-5h15L21 9","M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0","M5 12v9h14v-9","M10 21v-5h4v5"],
  warehouse:["M2 21V9l10-5 10 5v12","M6 21v-8h12v8","M6 16h12"],
  office:["M5 21V3h14v18","M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2","M3 21h18"],
  food:["M7 3v8a2 2 0 0 0 4 0V3","M9 11v10","M16 3c-1.7 1.5-2.5 3.7-2.5 6.5V13H17V3z","M17 13v8"],
  truck:["M2 6h12v10H2z","M14 10h4l3 3v3h-7","M6 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01"],
  window:["M4 3h16v18H4z","M12 3v18M4 12h16"],
  seal:["M12 3 5 5.6v5.2c0 4.4 3 7.7 7 9.2 4-1.5 7-4.8 7-9.2V5.6L12 3z","M9 12l2 2 4-4"],
  brush:["M4 14h9l1 3H3z","M8.5 14V5a2 2 0 0 1 4 0v9","M18 4v10","M16 9h4"],
  paint:["M4 4h13v5H4z","M17 6.5h2.5V12H11v3","M9.5 15h3v6h-3z"],
  wrench:["M14.6 6.4a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.4-3.4a6 6 0 0 1-7.8 7.8l-6.6 6.6a2.1 2.1 0 0 1-3-3l6.6-6.6a6 6 0 0 1 7.8-7.8l-3.4 3.4z"],
  phone:["M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"],
  chat:["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"],
  check:["M5 12.5l4.5 4.5L19 7.5"],
  clock:["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z","M12 7v5l3 2"],
  tag:["M3 12V4h8l10 10-8 8z","M7.5 8.5h0"],
};
function Icon({name,size=24,color="currentColor",sw=1.8}){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{(ICO[name]||[]).map((d,i)=><path key={i} d={d}/>)}</svg>;
}
const GUTTER_CREDIT = {text:"Stock photo · Aleksi Partanen / Unsplash", url:"https://unsplash.com/@aleksi_p"};
const FREE_EST = "Free estimate";
const SERVICE_GROUPS=[
  {id:"residential",label:"Residential",title:"For your home",intro:"Soft washing for the delicate stuff, pressure washing where concrete can take it.",items:[
    {name:"House Washing",icon:"house",img:"/media/cards/house-washing.jpg",line:"Soft wash for siding, trim and soffits — lifts dirt, mold and mildew.",price:FREE_EST,href:"/services/house-washing/"},
    {name:"Roof Cleaning & Moss Treatment",icon:"roof",img:"/media/cards/roof-cleaning.jpg",line:"Moss and algae treated at the root — never high pressure on shingles.",price:FREE_EST,href:"/services/roof-cleaning/"},
    {name:"Gutter Cleaning",icon:"gutter",img:"/media/cards/gutter-cleaning.jpg",line:"Gutters and downspouts cleared, debris hauled away.",price:"From $99",href:"/services/gutter-cleaning/",stock:true},
    {name:"Driveway & Concrete",icon:"drive",img:"/media/cards/driveway-concrete.jpg",line:"Algae, moss and stains lifted from concrete and pavers, with optional sealing.",price:FREE_EST,href:"/services/driveway-concrete-cleaning/"},
    {name:"Walkways & Hardscape",icon:"path",img:"/media/cards/walkways-hardscape.jpg",line:"Slick, mossy paths, steps and pavers made safe to walk on again.",price:FREE_EST,href:"/services/driveway-concrete-cleaning/"},
    {name:"Deck & Patio",icon:"deck",img:"/media/cards/deck-patio.jpg",line:"Wood, composite and stone brightened with the right pressure for each.",price:FREE_EST,href:"/#quote",cta:"Get a quote"},
    {name:"Fence Cleaning",icon:"fence",img:"/media/cards/fence-cleaning.jpg",line:"Green algae, moss and grime cleared from wood, vinyl and metal fencing.",price:FREE_EST,href:"/#quote",cta:"Get a quote"},
  ]},
  {id:"commercial",label:"Commercial",title:"For your business or property",intro:"Written bids, scheduling around your hours, and water-capture practices on commercial sites.",items:[
    {name:"Apartment & Multi-Family",icon:"apt",img:"/media/cards/apartment-multifamily.jpg",line:"Breezeways, stairwells, siding and shared walkways.",price:FREE_EST,href:"/services/commercial-fleet-washing/"},
    {name:"Retail & Storefront",icon:"store",img:"/media/cards/retail-storefront.jpg",line:"Sidewalks and entrances clean before customers arrive.",price:FREE_EST,href:"/services/commercial-fleet-washing/"},
    {name:"Restaurant & Food Service",icon:"food",img:"/media/cards/restaurant-food.jpg",line:"Dumpster pads, drive-thru lanes and patios.",price:FREE_EST,href:"/services/commercial-fleet-washing/"},
    {name:"Office & Medical Parks",icon:"office",img:"/media/cards/office-medical.jpg",line:"Building exteriors, walkways and parking areas.",price:FREE_EST,href:"/services/commercial-fleet-washing/"},
    {name:"Industrial & Warehouse",icon:"warehouse",img:"/media/cards/industrial-warehouse.jpg",line:"Loading docks, equipment pads and large elevations.",price:FREE_EST,href:"/services/commercial-fleet-washing/"},
    {name:"Fleet & Equipment",icon:"truck",img:"/media/cards/fleet-equipment.jpg",line:"On-site washing for trucks, vans and heavy equipment.",price:FREE_EST,href:"/services/commercial-fleet-washing/"},
  ]},
  {id:"more",label:"More Services",title:"Finish the whole to-do list",intro:"Add any of these to a wash, or ask about them on their own.",items:[
    {name:"Window Cleaning",icon:"window",line:"Interior and exterior windows, with screens and tracks on request.",price:FREE_EST,href:"/#quote",cta:"Get a quote"},
    {name:"Concrete Sealing",icon:"seal",line:"Penetrating sealer after cleaning to slow stains, moss and freeze-thaw damage.",price:FREE_EST,href:"/services/driveway-concrete-cleaning/"},
    {name:"Deck & Fence Staining",icon:"brush",line:"Stain or sealer on freshly cleaned wood for lasting color.",price:FREE_EST,href:"/#quote",cta:"Get a quote"},
    {name:"Exterior Painting Touch-Ups",icon:"paint",line:"Light touch-up work to finish off your exterior refresh.",price:FREE_EST,href:"/#quote",cta:"Get a quote"},
    {name:"Odd Jobs — Just Ask",icon:"wrench",line:"Debris haul-away and other small exterior tasks.",price:FREE_EST,href:"/#quote",cta:"Get a quote"},
  ]},
];
// Quick facts shown at the top of each service page. Pulled from each page's own
// copy — typical times are only stated where the page itself states one.
const SERVICE_FACTS={
  "house-washing":{icon:"house",summary:"A low-pressure soft wash that cleans siding without forcing water behind it.",
    included:["Soft wash of siding on all accessible sides","Algae, mold and mildew treatment","Trim, soffits and gutter faces","Plants pre-wetted and protected","Final rinse and walkthrough with you"],
    price:"Free on-site estimate",priceNote:"Written price before any work starts",time:"Confirmed on your estimate"},
  "roof-cleaning":{icon:"roof",summary:"Moss and algae killed at the root with a soft wash — never a pressure wand on your shingles.",
    included:["Soft wash matched to asphalt, cedar or metal","Moss, algae and lichen treated at the root","Care around flashing, valleys and vents","Plants and surfaces below protected","Straight talk on the die-back timeline"],
    price:"Free on-site estimate",priceNote:"Priced after we see your roof's pitch and condition",time:"Confirmed on your estimate"},
  "gutter-cleaning":{icon:"gutter",summary:"Fall gutter clear-out so the first big storm goes down the downspout, not over the edge.",
    included:["Leaves, needles and moss removed by hand","Water flush to confirm drainage","Downspouts checked and cleared","Debris bagged and hauled away","Before and after photos"],
    price:"From $99",priceNote:"$99 one-story · $149 two-story (fall intro pricing)",time:"1–2 hours for most homes",photoCredit:GUTTER_CREDIT,photo:"/media/stock-gutter-unsplash.jpg",photoAlt:"Stock photo of a mossy, dirty gutter below a tile roof"},
  "driveway-concrete-cleaning":{icon:"drive",summary:"Concrete cleaned at the right pressure, then sealed if it's worth it for your slab.",
    included:["Driveways, walkways, steps and patios","Algae, moss, tire marks and stains","Pavers cleaned without blowing out joint sand","Optional penetrating sealer once dry","Final look-over with you"],
    price:"Free on-site estimate",priceNote:"Including a straight answer on whether sealing is worth it",time:"Confirmed on your estimate — sealing waits until the concrete is dry"},
  "commercial-fleet-washing":{icon:"warehouse",summary:"Building exteriors, hardscape and fleet vehicles — one vendor, scheduled around your hours.",
    included:["Soft washing of building exteriors","Sidewalks, entries, parking and dumpster pads","On-site truck, van and equipment washing","Water-capture practices on commercial sites","One-time or recurring service"],
    price:"Free written bid",priceNote:"After an on-site assessment",time:"Early mornings, evenings or off-peak"},
};

function ServiceCard({s}){
  const internal = s.href.startsWith("/services/");
  return (
    <a href={s.href} className="svc-card" style={{display:"flex",flexDirection:"column",background:"#fff",border:`1px solid ${C.line}`,borderRadius:16,overflow:"hidden",textDecoration:"none",color:C.text,boxShadow:"0 4px 18px rgba(0,24,56,.06)"}}>
      {s.img
        ? <div style={{position:"relative",aspectRatio:"16/10",background:C.mist,overflow:"visible",minHeight:0}}>
            <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
            <img src={s.img} alt="" loading="lazy" decoding="async" width="800" height="483" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/></div>
            <span style={{position:"absolute",left:14,bottom:-22,width:46,height:46,borderRadius:12,background:GRAD,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 16px rgba(0,84,180,.35)",border:"3px solid #fff"}}><Icon name={s.icon} size={22}/></span>
            {s.stock && <span style={{position:"absolute",right:8,top:8,background:"rgba(0,18,48,.7)",color:"#fff",fontSize:".68rem",padding:"3px 8px",borderRadius:6}}>Stock photo</span>}
          </div>
        : <div style={{padding:"22px 20px 0"}}><span style={{width:50,height:50,borderRadius:13,background:C.mist,color:C.blue,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={s.icon} size={26}/></span></div>}
      <div style={{padding:s.img?"32px 20px 20px":"14px 20px 20px",display:"flex",flexDirection:"column",flex:1}}>
        <h3 style={{fontFamily:FS,fontWeight:600,fontSize:"1.22rem",color:C.ink,margin:"0 0 6px",lineHeight:1.2}}>{s.name}</h3>
        <p style={{fontSize:".94rem",color:C.soft,lineHeight:1.55,margin:"0 0 16px",flex:1}}>{s.line}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:".86rem",fontWeight:700,color:s.price===FREE_EST?C.soft:C.blue,background:s.price===FREE_EST?C.bg:C.mist,border:`1px solid ${C.line}`,padding:"5px 11px",borderRadius:100}}>{s.price}</span>
          <span className="svc-btn" style={{fontSize:".9rem",fontWeight:700,color:C.blue}}>{s.cta || (internal ? "See details" : "Get a quote")} →</span>
        </div>
      </div>
    </a>
  );
}

function StickyCall(){
  return (
    <div className="stickycall" style={{position:"fixed",left:0,right:0,bottom:0,zIndex:300,background:"#fff",borderTop:`1px solid ${C.line}`,boxShadow:"0 -6px 20px rgba(0,24,56,.12)",padding:"10px 12px calc(10px + env(safe-area-inset-bottom))",gap:10}}>
      <a href={`tel:+1${BRAND.tel}`} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:GRAD,color:"#fff",padding:"14px 10px",borderRadius:11,fontWeight:700,fontSize:"1rem",textDecoration:"none"}}><Icon name="phone" size={18}/> Call</a>
      <a href={`sms:+1${BRAND.tel}`} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.mist,color:C.blue,border:`1.5px solid ${C.blue}`,padding:"12.5px 10px",borderRadius:11,fontWeight:700,fontSize:"1rem",textDecoration:"none"}}><Icon name="chat" size={18}/> Text</a>
    </div>
  );
}
const SVC_CSS = `
  .svc-card{transition:transform .25s,box-shadow .25s}
  .svc-card:hover{transform:translateY(-4px);box-shadow:0 16px 36px rgba(0,24,56,.14) !important}
  .svc-card:hover .svc-btn{text-decoration:underline}
  .svc-card:focus-visible{outline:3px solid ${C.aquaDk};outline-offset:3px}
  .svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:22px}
  .stickycall{display:none}
  @media(max-width:767px){.stickycall{display:flex}.has-sticky{padding-bottom:78px}}
  .qf{display:grid;grid-template-columns:1.05fr .95fr;gap:26px;align-items:start}
  @media(max-width:860px){.qf{grid-template-columns:1fr}.qf-photo{order:2}}
`;

/* ===== Service + location pages (data-driven; copy lives in page-content.js) ===== */
function CardList({heading,intro,items}){
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"12px 22px 0"}}>
      <h1 style={{fontFamily:FS,fontWeight:600,fontSize:"2.35rem",color:C.ink,margin:".2em 0 .3em",lineHeight:1.12}}>{heading}</h1>
      <p style={{fontSize:"1.08rem",color:C.soft,margin:"0 0 30px",lineHeight:1.7}}>{intro}</p>
      <div style={{display:"grid",gap:18}}>
        {items.map(p=>(
          <a key={p.slug} href={p.path} style={{display:"block",border:`1px solid ${C.line}`,borderRadius:14,padding:"22px 24px",textDecoration:"none",background:"#fff",boxShadow:"0 4px 18px rgba(0,24,56,.05)"}}>
            <h2 style={{fontFamily:FS,fontWeight:600,fontSize:"1.35rem",color:C.ink,margin:"0 0 8px",lineHeight:1.2}}>{p.title}</h2>
            <p style={{fontSize:".96rem",color:C.soft,margin:"0 0 12px",lineHeight:1.6}}>{p.metaDescription}</p>
            <span style={{color:C.blue,fontWeight:700,fontSize:".9rem"}}>Read more →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
// Split the generated article into its H1, its leading photo (if any) and the rest,
// so the quick-facts box can sit directly under the H1.
function splitArticle(html){
  let rest = html, h1 = null, img = null;
  const m = rest.match(/^\s*<h1>([\s\S]*?)<\/h1>\s*/);
  if(m){ h1 = m[1]; rest = rest.slice(m[0].length); }
  const f = rest.match(/^<figure[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>\s*<\/figure>\s*/);
  if(f){ img = {src:f[1], alt:f[2]}; rest = rest.slice(f[0].length); }
  return {h1, img, rest};
}
function QuickFacts({facts}){
  const row = (icon,label,val,note) => (
    <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 0",borderTop:`1px solid ${C.line}`}}>
      <span style={{color:C.blue,flexShrink:0,marginTop:2}}><Icon name={icon} size={20}/></span>
      <div><div style={{fontSize:".76rem",textTransform:"uppercase",letterSpacing:1.2,fontWeight:800,color:C.soft}}>{label}</div>
        <div style={{fontWeight:700,color:C.ink,fontSize:"1.05rem"}}>{val}</div>
        {note && <div style={{fontSize:".86rem",color:C.soft,lineHeight:1.45}}>{note}</div>}</div>
    </div>
  );
  return (
    <aside aria-label="Quick facts" style={{background:C.mist,border:`1px solid ${C.line}`,borderRadius:18,padding:"22px 22px 20px"}}>
      <div style={{fontSize:".8rem",textTransform:"uppercase",letterSpacing:2,fontWeight:800,color:C.teal,marginBottom:10}}>Quick facts</div>
      <div style={{fontWeight:700,color:C.ink,marginBottom:8}}>What's included</div>
      <ul style={{listStyle:"none",padding:0,margin:"0 0 12px"}}>
        {facts.included.map(x=><li key={x} style={{display:"flex",gap:9,alignItems:"flex-start",margin:"0 0 7px",fontSize:".95rem",lineHeight:1.45,color:C.text}}><span style={{color:C.blue,flexShrink:0,marginTop:1}}><Icon name="check" size={18} sw={2.4}/></span>{x}</li>)}
      </ul>
      {row("tag","Price",facts.price,facts.priceNote)}
      {row("clock","Typical time",facts.time)}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
        <a href={`tel:+1${BRAND.tel}`} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:GRAD,color:"#fff",padding:"12px 8px",borderRadius:11,fontWeight:700,textDecoration:"none",textAlign:"center",lineHeight:1.25}}><span style={{fontSize:"1rem"}}>Call / Text</span><span style={{fontSize:".86rem",fontWeight:600,opacity:.92,whiteSpace:"nowrap"}}>{BRAND.phone}</span></a>
        <a href="/#quote" style={{display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",color:C.blue,border:`1.5px solid ${C.blue}`,padding:"12px 8px",borderRadius:11,fontWeight:700,fontSize:"1rem",textDecoration:"none",textAlign:"center"}}>Get a Quote</a>
      </div>
    </aside>
  );
}
function ServicePage({page}){
  const {h1, img, rest} = splitArticle(page.html);
  const facts = SERVICE_FACTS[page.slug];
  if(!facts || !h1){
    return (
      <Shell crumbs={[{name:"Home",url:"/"},{name:"Services",url:"/services/"},{name:page.title}]}>
        <article className="article" dangerouslySetInnerHTML={{__html:page.html}}/>
      </Shell>
    );
  }
  const photo = facts.photo ? {src:facts.photo, alt:facts.photoAlt} : img;
  return (
    <Shell crumbs={[{name:"Home",url:"/"},{name:"Services",url:"/services/"},{name:page.title}]} wide={1060} sticky>
      <div style={{maxWidth:1060,margin:"0 auto",padding:"10px 22px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,margin:".3em 0 .4em"}}>
          <span style={{width:52,height:52,borderRadius:14,background:GRAD,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 6px 16px rgba(0,84,180,.3)"}}><Icon name={facts.icon} size={26}/></span>
          <h1 style={{fontFamily:FS,fontWeight:600,fontSize:"clamp(1.75rem,4vw,2.35rem)",lineHeight:1.12,color:C.ink,margin:0}} dangerouslySetInnerHTML={{__html:h1}}/>
        </div>
        <p style={{fontSize:"1.12rem",color:C.soft,margin:"0 0 22px",lineHeight:1.6,maxWidth:720}}>{facts.summary}</p>
        <div className="qf">
          <QuickFacts facts={facts}/>
          {photo && <figure className="qf-photo" style={{margin:0}}>
            <img src={photo.src} alt={photo.alt} width="1400" height="933" style={{width:"100%",height:"auto",borderRadius:16,display:"block",boxShadow:"0 10px 30px rgba(0,24,56,.14)"}}/>
            {facts.photoCredit && <figcaption style={{fontSize:".78rem",color:C.mute,marginTop:8}}><a href={facts.photoCredit.url} rel="noopener" style={{color:C.mute}}>{facts.photoCredit.text}</a></figcaption>}
          </figure>}
        </div>
      </div>
      <div style={{maxWidth:760,margin:"40px auto 0",padding:"0 22px"}}>
        <div style={{fontSize:".8rem",textTransform:"uppercase",letterSpacing:2,fontWeight:800,color:C.teal,borderTop:`1px solid ${C.line}`,paddingTop:26}}>The full details</div>
      </div>
      <article className="article" dangerouslySetInnerHTML={{__html:rest}}/>
      <div style={{maxWidth:760,margin:"30px auto 0",padding:"0 22px"}}><a href="/services/" style={{color:C.blue,fontWeight:700,textDecoration:"none"}}>← All services</a></div>
    </Shell>
  );
}
function LocationPage({page}){
  return (
    <Shell crumbs={[{name:"Home",url:"/"},{name:"Service Areas",url:"/locations/"},{name:page.title}]}>
      <article className="article" dangerouslySetInnerHTML={{__html:page.html}}/>
    </Shell>
  );
}
function ServicesIndex(){
  return (
    <Shell crumbs={[{name:"Home",url:"/"},{name:"Services"}]} wide={1180} sticky>
      <div style={{maxWidth:1180,margin:"0 auto",padding:"10px 22px 0"}}>
        <h1 style={{fontFamily:FS,fontWeight:600,fontSize:"clamp(1.9rem,4.5vw,2.6rem)",color:C.ink,margin:".2em 0 .25em",lineHeight:1.1}}>Exterior Cleaning Services — King &amp; Snohomish County</h1>
        <p style={{fontSize:"1.1rem",color:C.soft,margin:"0 0 20px",lineHeight:1.6,maxWidth:720}}>Pick a service to see what's included and how pricing works. Every job starts with a free estimate and the right method for each surface.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
          {SERVICE_GROUPS.map(g=><a key={g.id} href={"#"+g.id} style={{background:C.mist,color:C.blue,border:`1px solid ${C.line}`,padding:"9px 16px",borderRadius:100,fontWeight:700,fontSize:".9rem",textDecoration:"none"}}>{g.label}</a>)}
          <a href={`tel:+1${BRAND.tel}`} style={{background:GRAD,color:"#fff",padding:"9px 16px",borderRadius:100,fontWeight:700,fontSize:".9rem",textDecoration:"none"}}>Call / Text {BRAND.phone}</a>
        </div>
        {SERVICE_GROUPS.map(g=>(
          <section key={g.id} id={g.id} style={{scrollMarginTop:80,paddingTop:34}}>
            <div style={{display:"flex",alignItems:"baseline",gap:"4px 14px",flexWrap:"wrap",marginBottom:4}}>
              <span style={{fontSize:".85rem",textTransform:"uppercase",letterSpacing:2,fontWeight:800,color:C.teal}}>{g.label}</span>
              <h2 style={{fontFamily:FS,fontWeight:600,fontSize:"1.75rem",color:C.ink,margin:0}}>{g.title}</h2>
            </div>
            <p style={{color:C.soft,margin:"0 0 20px",fontSize:"1rem"}}>{g.intro}</p>
            <div className="svc-grid">{g.items.map(s=><ServiceCard key={s.name} s={s}/>)}</div>
          </section>
        ))}
        <p style={{fontSize:".8rem",color:C.mute,marginTop:22}}>Gutter photo: <a href={GUTTER_CREDIT.url} rel="noopener" style={{color:C.mute}}>stock image by Aleksi Partanen on Unsplash</a>.</p>
      </div>
    </Shell>
  );
}
function LocationsIndex(){
  return <Shell crumbs={[{name:"Home",url:"/"},{name:"Service Areas"}]}><CardList heading="Pressure Washing Service Areas — King & Snohomish County, WA" intro="Owner-operated exterior cleaning across the greater Seattle–Everett corridor in King & Snohomish Counties. We serve 20+ cities — from Lynnwood, Everett, and Mill Creek to Kirkland, Bellevue, and Seattle — and travel farther for larger residential and commercial projects. Every job starts with a free on-site estimate." items={LOCATION_PAGES}/></Shell>;
}

function normPath(p){
  if(!p) return "/";
  p = p.split("?")[0].split("#")[0];
  if(p.length>1 && !p.endsWith("/")) p += "/";
  return p;
}
function App({route}){
  const path = normPath(route || (typeof window!=="undefined" ? window.location.pathname : "/"));
  if(path==="/blog/") return <BlogIndex/>;
  const post = BLOG_POSTS.find(p=>p.path===path);
  if(post) return <BlogPost post={post}/>;
  if(path==="/services/" && SERVICE_PAGES.length) return <ServicesIndex/>;
  if(path==="/locations/" && LOCATION_PAGES.length) return <LocationsIndex/>;
  const svc = SERVICE_PAGES.find(p=>p.path===path);
  if(svc) return <ServicePage page={svc}/>;
  const loc = LOCATION_PAGES.find(p=>p.path===path);
  if(loc) return <LocationPage page={loc}/>;
  return <Home/>;
}

export default App;
