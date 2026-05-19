import { useState, useEffect } from "react";

const CHAPTERS_SEED = [
  { id:1,  name:"Arizona Chapter",                    code:"AZC",  exec:"Charles Olyma Sinnah",   email:"charles.sinnah@yahoo.com",         phone:"(602) 693-3530" },
  { id:2,  name:"Atlanta GA Chapter",                 code:"GAC",  exec:"Edward Mallah",           email:"eddymallah@gmail.com",             phone:"(770) 656-4028" },
  { id:3,  name:"Chicago Chapter",                    code:"ILC",  exec:"Mustapha Sheriff",        email:"msheriff02@gmail.com",             phone:"(630) 864-2057" },
  { id:4,  name:"Dallas Chapter",                     code:"TXDC", exec:"Joseph Batilo Macarthy",  email:"danmac2017@yahoo.com",             phone:"(469) 879-8640" },
  { id:5,  name:"Delaware Valley Chapter",            code:"DVC",  exec:"Dende Korpoi",            email:"dendedorc@gmail.com",              phone:"(267) 981-5955" },
  { id:6,  name:"Durham, Raleigh & Chapel Hill (DRC)",code:"DRC",  exec:"Amina Kawa",              email:"myminava@yahoo.com",               phone:"(919) 358-9382" },
  { id:7,  name:"Houston Chapter",                    code:"TXHC", exec:"Peter Pablo Bainda",      email:"peebainda@gmail.com",              phone:"(832) 343-3895" },
  { id:8,  name:"Minnesota Chapter",                  code:"MNC",  exec:"Ibrahim Koroma",          email:"ismkoroma@gmail.com",              phone:"(612) 430-3795" },
  { id:9,  name:"New England Chapter",                code:"NEC",  exec:"Kula Sillah",             email:"sillahkula@gmail.com",             phone:"(678) 301-8876" },
  { id:10, name:"New Jersey Chapter",                 code:"NJC",  exec:"Solomon Bona",            email:"solomonbona@yahoo.com",            phone:"(732) 763-7786" },
  { id:11, name:"New York Chapter",                   code:"NYC",  exec:"Jabati A Wai",            email:"kjongopy@gmail.com",               phone:"(818) 272-6589" },
  { id:12, name:"North Dakota Chapter",               code:"NDC",  exec:"Lawal Mustapha",          email:"lawalmustapha2004@yahoo.com",      phone:"(484) 340-6952" },
  { id:13, name:"Northern California",                code:"CANC", exec:"Gerald Senesie Samah",    email:"senesie1@gmail.com",               phone:"(408) 910-1197" },
  { id:14, name:"Ohio Chapter",                       code:"OHC",  exec:"Miatta Abu-Rogers",       email:"miattaabu@ymail.com",              phone:"(614) 316-4068" },
  { id:15, name:"Seattle Washington",                 code:"SWC",  exec:"Moses M Fatorma",         email:"fatormamukehmoses1169@gmail.com",  phone:"(206) 335-6815" },
  { id:16, name:"Southern California",                code:"CASC", exec:"Francis Baion",           email:"fbaion@aol.com",                   phone:"(714) 860-8322" },
  { id:17, name:"Virginia Chapter",                   code:"VAC",  exec:"Ahmed Bowling",           email:"bowlingahmed60@gmail.com",         phone:"(571) 466-6609" },
  { id:18, name:"Washington DC Chapter",              code:"WDC",  exec:"Solomon Palmer",          email:"solomonmpalmer@gmail.com",         phone:"(301) 592-7037" },
  { id:19, name:"Iowa Chapter",                       code:"IAC",  exec:"Brima K Caulker",         email:"k.caulker@yahoo.com",              phone:"(612) 388-9983" },
  { id:20, name:"Florida Chapter",                    code:"FLC",  exec:"Susan Jaward",            email:"susanbjaward@hotmail.com",         phone:"(813) 841-4130" },
];

const EVENT = {
  name:"SLPPNA DRC Executive Inaugural Ball",
  date:"Saturday, July 25, 2026", time:"8:00 PM – 2:00 AM",
  venue:"5410 NC-55, Durham, NC 27713", chair:"Amina Kawa",
  secretary:"Adu Sheref", secretary_phone:"(919) 638-7503",
  secretary_email:"adusheref@gmail.com",
};

const TTYPES = [
  { id:"Ordinary",           price:100,  desc:"General admission"           },
  { id:"Patron",             price:150,  desc:"Patron-level support"         },
  { id:"Grand Chief Patron", price:null, desc:"Premium honor · by donation"  },
];

function buildTickets(chapters) {
  const all=[]; let n=1;
  for (const ch of chapters)
    for (let t=1;t<=5;t++){
      all.push({ id:`DRC-20260725-${String(n).padStart(3,"0")}`, chRef:`${ch.code}-${String(t).padStart(2,"0")}`,
        chapterId:ch.id, chapterName:ch.name, chapterCode:ch.code, exec:ch.exec,
        email:ch.email, phone:ch.phone, ticketNum:t, globalNum:n,
        type:"Ordinary", holder:"", status:"Pending",
        confirmedBy:"", confirmedAt:"", sentAt:"", notes:"", source:"chapter" });
      n++;
    }
  return all;
}

const fmt$ = v=>"$"+Number(v).toLocaleString();
const fmtD = d=>d?new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—";
const nowISO = ()=>new Date().toISOString();
const SKEY = "drc_v2";

function Badge({status}){
  const m={Confirmed:{bg:"#e8f5e9",c:"#1b5e20"},Pending:{bg:"#fff8e1",c:"#f57f17"},
    Sent:{bg:"#e3f2fd",c:"#0d47a1"},Cancelled:{bg:"#fce4ec",c:"#880e4f"},"Paid Online":{bg:"#f3e5f5",c:"#6a1b9a"}};
  const s=m[status]||m.Pending;
  return <span style={{background:s.bg,color:s.c,fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:20,whiteSpace:"nowrap"}}>{status}</span>;
}

function QR({serial,size=68}){
  const d=encodeURIComponent(`SLPPNA DRC INAUGURAL BALL|Serial:${serial}|Jul 25 2026|5410 NC-55 Durham NC`);
  return <img src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${d}&color=1B5E20&bgcolor=ffffff&margin=2`} alt={serial} width={size} height={size} style={{borderRadius:3,border:"1px solid #c8e6c9",display:"block"}}/>;
}

function TCard({tk}){
  const price=tk.type==="Patron"?"$150":tk.type==="Grand Chief Patron"?"By Donation":"$100";
  return(
    <div style={{background:"#1b5e20",borderRadius:10,overflow:"hidden",border:"2px solid #d4a017",fontFamily:"Georgia,serif"}}>
      <div style={{height:4,background:"linear-gradient(90deg,#7a5a10,#d4a017,#f5d060,#d4a017,#7a5a10)"}}/>
      <div style={{display:"flex",alignItems:"stretch"}}>
        <div style={{flex:1,padding:"10px 12px"}}>
          <div style={{fontSize:8,letterSpacing:2,color:"#d4a017",fontFamily:"Arial",fontWeight:"bold",marginBottom:2}}>SLPPNA · DRC CHAPTER</div>
          <div style={{fontSize:12,fontWeight:"bold",color:"#fff",marginBottom:5}}>Executive Inaugural Ball</div>
          <div style={{display:"flex",gap:8,marginBottom:5,flexWrap:"wrap"}}>
            {[["DATE","Sat Jul 25 2026"],["TIME","8 PM–2 AM"],["VENUE","5410 NC-55 Durham NC"]].map(([l,v])=>(
              <div key={l}><div style={{fontSize:6,color:"#d4a017",fontFamily:"Arial",letterSpacing:1}}>{l}</div>
              <div style={{fontSize:8,color:"#dff0df",fontFamily:"Arial"}}>{v}</div></div>
            ))}
          </div>
          <div style={{display:"flex",gap:8,borderTop:"0.5px dashed rgba(212,160,23,0.4)",paddingTop:5}}>
            <div style={{flex:1}}><div style={{fontSize:6,color:"#d4a017",fontFamily:"Arial"}}>HOLDER</div>
              <div style={{fontSize:9,color:"#fff",fontFamily:"Arial",fontWeight:"bold",marginTop:1}}>{tk.holder||<span style={{color:"#5a8a6a",fontStyle:"italic"}}>Unassigned</span>}</div></div>
            <div style={{flex:1}}><div style={{fontSize:6,color:"#d4a017",fontFamily:"Arial"}}>CHAPTER</div>
              <div style={{fontSize:8,color:"#8fd4a8",fontFamily:"Arial",marginTop:1}}>{tk.chapterName}</div></div>
          </div>
          <div style={{marginTop:5,background:"rgba(0,0,0,0.3)",borderRadius:4,padding:"3px 7px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:6,color:"#d4a017",fontFamily:"Arial"}}>SERIAL</div>
              <div style={{fontSize:10,fontFamily:"Courier New,monospace",fontWeight:"bold",color:"#f5d060",letterSpacing:1}}>{tk.id}</div></div>
            <div style={{background:"rgba(0,0,0,0.35)",border:"1px solid #d4a017",borderRadius:4,padding:"2px 6px",textAlign:"center"}}>
              <div style={{fontSize:6,color:"#d4a017",fontFamily:"Arial"}}>{tk.type}</div>
              <div style={{fontSize:10,color:"#f5d060",fontFamily:"Arial",fontWeight:"bold"}}>{price}</div></div>
          </div>
        </div>
        <div style={{width:72,background:"rgba(0,0,0,0.3)",borderLeft:"1.5px dashed rgba(212,160,23,0.5)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"6px 4px"}}>
          <QR serial={tk.id} size={58}/>
          <div style={{fontSize:6,color:"#d4a017",fontFamily:"Arial",letterSpacing:1}}>SCAN</div>
          <div style={{fontSize:8,color:"#8fd4a8",fontFamily:"Courier New,monospace"}}>#{String(tk.globalNum).padStart(3,"0")}</div>
        </div>
      </div>
      <div style={{height:4,background:"linear-gradient(90deg,#7a5a10,#d4a017,#f5d060,#d4a017,#7a5a10)"}}/>
    </div>
  );
}

// ─── BUY TICKETS HUB ────────────────────────────────────────────────────────
function BuyHub({tickets,setTickets,chapters}){
  const [step,setStep]=useState("browse");
  const [selType,setSelType]=useState("Ordinary");
  const [qty,setQty]=useState(1);
  const [form,setForm]=useState({firstName:"",lastName:"",email:"",phone:"",chapter:"",message:""});
  const [pay,setPay]=useState("zelle");
  const [order,setOrder]=useState(null);

  const ti=TTYPES.find(t=>t.id===selType);
  const subtotal=ti.price?ti.price*qty:0;
  const avail=tickets.filter(t=>t.status==="Pending"&&!t.holder).length;

  function doOrder(){
    const pool=tickets.filter(t=>t.status==="Pending"&&!t.holder).slice(0,qty);
    if(pool.length<qty){alert("Not enough tickets available.");return;}
    const assigned=pool.map(t=>({...t,holder:`${form.firstName} ${form.lastName}`.trim(),
      type:selType,status:"Paid Online",confirmedBy:form.email,confirmedAt:nowISO(),
      notes:`Online·${pay}·${form.message}`,source:"online"}));
    const ids=new Set(assigned.map(t=>t.id));
    setTickets(prev=>prev.map(t=>ids.has(t.id)?assigned.find(a=>a.id===t.id):t));
    setOrder({tickets:assigned,buyer:form,total:subtotal,pay});
    setStep("done");
  }

  if(step==="done"&&order) return(
    <div>
      <div style={{background:"#1b5e20",borderRadius:12,padding:"22px",marginBottom:16,border:"2px solid #d4a017",textAlign:"center"}}>
        <div style={{height:4,background:"linear-gradient(90deg,#7a5a10,#d4a017,#f5d060,#d4a017,#7a5a10)",marginBottom:14,borderRadius:2}}/>
        <div style={{fontSize:32,marginBottom:6}}>🎉</div>
        <div style={{fontSize:19,fontWeight:"bold",color:"#fff",fontFamily:"Georgia,serif",marginBottom:3}}>Order Confirmed!</div>
        <div style={{fontSize:12,color:"#8fd4a8"}}>Your tickets are reserved · Check email for details</div>
      </div>
      <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"12px 14px",marginBottom:14,fontSize:12}}>
        {[["Buyer",`${order.buyer.firstName} ${order.buyer.lastName}`],["Email",order.buyer.email],
          ["Chapter",order.buyer.chapter||"—"],["Tickets",order.tickets.length],
          ["Type",selType],["Total",order.total?fmt$(order.total):"By Donation"],
          ["Payment",pay.charAt(0).toUpperCase()+pay.slice(1)]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            <span style={{color:"var(--color-text-secondary)"}}>{l}</span><span style={{color:"var(--color-text-primary)",fontWeight:500}}>{String(v)}</span>
          </div>
        ))}
      </div>
      <div style={{marginBottom:12,fontSize:12,fontWeight:500,color:"var(--color-text-primary)"}}>Your Tickets</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {order.tickets.map(tk=><TCard key={tk.id} tk={tk}/>)}
      </div>
      <div style={{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:"var(--border-radius-md)",padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:500,color:"#f57f17",marginBottom:6}}>⚠️ Complete your payment</div>
        {pay==="zelle"&&<div style={{fontSize:11,color:"#5d4037",lineHeight:1.8}}>Send <strong>{fmt$(subtotal)}</strong> via <strong>Zelle</strong> to <strong>(919) 638-7503</strong> (Adu Sheref). Use serial number as memo.</div>}
        {pay==="cashapp"&&<div style={{fontSize:11,color:"#5d4037",lineHeight:1.8}}>Send <strong>{fmt$(subtotal)}</strong> to <strong>$adusheref</strong> on Cash App. Use serial number as memo.</div>}
        {pay==="paypal"&&<div style={{fontSize:11,color:"#5d4037",lineHeight:1.8}}>Send <strong>{fmt$(subtotal)}</strong> to <strong>{EVENT.secretary_email}</strong> via PayPal Friends &amp; Family.</div>}
        {pay==="check"&&<div style={{fontSize:11,color:"#5d4037",lineHeight:1.8}}>Mail check to <strong>SLPPNA DRC Chapter</strong>. Include serial number in memo.</div>}
      </div>
      <button onClick={()=>{setStep("browse");setForm({firstName:"",lastName:"",email:"",phone:"",chapter:"",message:""});setOrder(null);}}
        style={{width:"100%",padding:"10px",fontSize:13,cursor:"pointer",background:"#1b5e20",color:"#d4a017",
          border:"1px solid #d4a017",borderRadius:"var(--border-radius-md)",fontWeight:500}}>Order More Tickets</button>
    </div>
  );

  return(
    <div>
      {/* Event hero */}
      <div style={{background:"#1b5e20",borderRadius:12,overflow:"hidden",marginBottom:18,border:"2px solid #d4a017"}}>
        <div style={{height:5,background:"linear-gradient(90deg,#7a5a10,#d4a017,#f5d060,#d4a017,#7a5a10)"}}/>
        <div style={{padding:"18px 22px"}}>
          <div style={{fontSize:10,letterSpacing:3,color:"#d4a017",fontFamily:"Arial",fontWeight:"bold",marginBottom:3}}>SLPPNA · DRC CHAPTER · NORTH CAROLINA</div>
          <div style={{fontSize:22,fontWeight:"bold",color:"#fff",fontFamily:"Georgia,serif",marginBottom:8}}>Executive Inaugural Ball 2026</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:10}}>
            {[["📅",EVENT.date],["⏰",EVENT.time],["📍",EVENT.venue],["🎤","Chair: "+EVENT.chair]].map(([i,v])=>(
              <div key={v} style={{fontSize:11,color:"#c8e6c9"}}>{i} {v}</div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"4px 12px",fontSize:11,color:"#8fd4a8",border:"0.5px solid rgba(212,160,23,0.4)"}}>
              🎟 {avail} tickets available
            </div>
            <div style={{background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"4px 12px",fontSize:11,color:"#8fd4a8",border:"0.5px solid rgba(212,160,23,0.4)"}}>
              20 Chapters · 100 Total
            </div>
          </div>
        </div>
        <div style={{height:5,background:"linear-gradient(90deg,#7a5a10,#d4a017,#f5d060,#d4a017,#7a5a10)"}}/>
      </div>

      {/* Steps indicator */}
      <div style={{display:"flex",alignItems:"center",marginBottom:18}}>
        {[["browse","1","Select"],["details","2","Details"],["payment","3","Payment"]].map(([s,n,l],i)=>{
          const done=["browse","details","payment"].indexOf(step)>i;
          const active=step===s;
          return(
            <div key={s} style={{display:"flex",alignItems:"center",flex:i<2?1:"auto"}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:22,height:22,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:10,fontWeight:500,background:active?"#1b5e20":done?"#e8f5e9":"var(--color-background-secondary)",
                  color:active?"#d4a017":done?"#1b5e20":"var(--color-text-secondary)",
                  border:active?"1.5px solid #d4a017":done?"1px solid #a5d6a7":"0.5px solid var(--color-border-tertiary)"}}>
                  {done?"✓":n}
                </div>
                <span style={{fontSize:11,color:active?"var(--color-text-primary)":"var(--color-text-secondary)",fontWeight:active?500:400}}>{l}</span>
              </div>
              {i<2&&<div style={{flex:1,height:"0.5px",background:"var(--color-border-tertiary)",margin:"0 8px"}}/>}
            </div>
          );
        })}
      </div>

      {/* Step 1: Select */}
      {step==="browse"&&(
        <div>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:12}}>Choose ticket type</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
            {TTYPES.map(tt=>(
              <div key={tt.id} onClick={()=>setSelType(tt.id)}
                style={{background:"var(--color-background-primary)",
                  border:selType===tt.id?"2px solid #1b5e20":"0.5px solid var(--color-border-tertiary)",
                  borderRadius:"var(--border-radius-lg)",padding:"14px 16px",cursor:"pointer",
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:2}}>
                    {selType===tt.id&&<span style={{color:"#1b5e20",marginRight:5}}>✓</span>}{tt.id}
                  </div>
                  <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{tt.desc}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:500,color:tt.id==="Patron"?"#b45309":tt.id==="Grand Chief Patron"?"#6a1b9a":"#1b5e20"}}>
                    {tt.price?fmt$(tt.price):"By Donation"}
                  </div>
                  <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>per ticket</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:18}}>
            <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",marginBottom:8}}>Quantity</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:34,height:34,borderRadius:"var(--border-radius-md)",fontSize:16,cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)"}}>−</button>
              <span style={{fontSize:20,fontWeight:500,minWidth:28,textAlign:"center",color:"var(--color-text-primary)"}}>{qty}</span>
              <button onClick={()=>setQty(Math.min(5,qty+1))} style={{width:34,height:34,borderRadius:"var(--border-radius-md)",fontSize:16,cursor:"pointer",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)"}}>+</button>
              <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>max 5</span>
            </div>
          </div>
          <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"10px 14px",marginBottom:14,fontSize:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{color:"var(--color-text-secondary)"}}>{qty} × {selType}</span>
              <span style={{fontWeight:500}}>{ti.price?fmt$(subtotal):"By Donation"}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:6}}>
              <span style={{fontWeight:500,color:"var(--color-text-primary)"}}>Total</span>
              <span style={{fontSize:15,fontWeight:500,color:"#1b5e20"}}>{ti.price?fmt$(subtotal):"By Donation"}</span>
            </div>
          </div>
          <button onClick={()=>setStep("details")} style={{width:"100%",padding:"11px",fontSize:13,cursor:"pointer",fontWeight:500,background:"#1b5e20",color:"#d4a017",border:"1.5px solid #d4a017",borderRadius:"var(--border-radius-md)"}}>
            Continue — Enter Details →
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step==="details"&&(
        <div>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:12}}>Your details</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            {[["firstName","First name","text"],["lastName","Last name","text"],["email","Email address","email"],["phone","Phone","tel"]].map(([k,l,t])=>(
              <div key={k}>
                <label style={{fontSize:11,color:"var(--color-text-secondary)",display:"block",marginBottom:2}}>{l} *</label>
                <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{width:"100%",fontSize:12,boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
          <div style={{marginBottom:8}}>
            <label style={{fontSize:11,color:"var(--color-text-secondary)",display:"block",marginBottom:2}}>SLPPNA Chapter (optional)</label>
            <select value={form.chapter} onChange={e=>setForm(p=>({...p,chapter:e.target.value}))} style={{width:"100%",fontSize:12}}>
              <option value="">— Select —</option>
              {chapters.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              <option value="General Public">General Public</option>
            </select>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,color:"var(--color-text-secondary)",display:"block",marginBottom:2}}>Notes / special requests</label>
            <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={2} style={{width:"100%",fontSize:12,boxSizing:"border-box",resize:"none"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep("browse")} style={{flex:1,padding:"9px",fontSize:12,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)"}}>← Back</button>
            <button onClick={()=>{if(!form.firstName||!form.email){alert("Please fill required fields.");return;}setStep("payment");}}
              style={{flex:2,padding:"9px",fontSize:12,cursor:"pointer",fontWeight:500,background:"#1b5e20",color:"#d4a017",border:"1.5px solid #d4a017",borderRadius:"var(--border-radius-md)"}}>
              Continue to Payment →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step==="payment"&&(
        <div>
          <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:12}}>Choose payment method</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {[["zelle","💳","Zelle","Instant · no fees"],["cashapp","📱","Cash App","Instant · no fees"],
              ["paypal","🅿️","PayPal","Friends & Family"],["check","✉️","Check by Mail","5–7 days"]].map(([id,icon,label,sub])=>(
              <div key={id} onClick={()=>setPay(id)}
                style={{background:"var(--color-background-primary)",cursor:"pointer",padding:"12px",
                  border:pay===id?"2px solid #1b5e20":"0.5px solid var(--color-border-tertiary)",
                  borderRadius:"var(--border-radius-md)"}}>
                <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)"}}>{label}</div>
                <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>{sub}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:"var(--border-radius-md)",padding:"10px 14px",marginBottom:12,fontSize:11}}>
            <div style={{fontWeight:500,color:"#f57f17",marginBottom:4}}>How to pay</div>
            {pay==="zelle"&&<div style={{color:"#5d4037",lineHeight:1.7}}>Send {ti.price?fmt$(subtotal):"your donation"} via Zelle to <strong>(919) 638-7503</strong> · Adu Sheref</div>}
            {pay==="cashapp"&&<div style={{color:"#5d4037",lineHeight:1.7}}>Send to <strong>$adusheref</strong> on Cash App</div>}
            {pay==="paypal"&&<div style={{color:"#5d4037",lineHeight:1.7}}>Send to <strong>{EVENT.secretary_email}</strong> · Friends &amp; Family</div>}
            {pay==="check"&&<div style={{color:"#5d4037",lineHeight:1.7}}>Mail to SLPPNA DRC Chapter · include serial in memo</div>}
          </div>
          <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"10px 14px",marginBottom:12,fontSize:11}}>
            {[["Buyer",`${form.firstName} ${form.lastName}`],["Email",form.email],
              ["Tickets",`${qty} × ${selType}`],["Total",ti.price?fmt$(subtotal):"By Donation"],
              ["Payment",pay.charAt(0).toUpperCase()+pay.slice(1)]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                <span style={{color:"var(--color-text-secondary)"}}>{l}</span>
                <span style={{color:"var(--color-text-primary)",fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep("details")} style={{flex:1,padding:"9px",fontSize:12,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)"}}>← Back</button>
            <button onClick={doOrder} style={{flex:2,padding:"9px",fontSize:12,cursor:"pointer",fontWeight:500,background:"#1b5e20",color:"#d4a017",border:"1.5px solid #d4a017",borderRadius:"var(--border-radius-md)"}}>
              ✓ Complete Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({tickets,chapters}){
  const total=tickets.length;
  const conf=tickets.filter(t=>t.status==="Confirmed"||t.status==="Paid Online").length;
  const sent=tickets.filter(t=>t.status==="Sent").length;
  const online=tickets.filter(t=>t.source==="online").length;
  const pending=tickets.filter(t=>t.status==="Pending").length;
  const revenue=tickets.filter(t=>t.status==="Confirmed"||t.status==="Paid Online")
    .reduce((s,t)=>s+(t.type==="Patron"?150:t.type==="Grand Chief Patron"?0:100),0);
  const stats=[
    {l:"Total Tickets",v:total,s:"20 chapters × 5",c:"var(--color-text-primary)"},
    {l:"Confirmed",v:conf,s:Math.round(conf/total*100)+"% confirmed",c:"#1b5e20"},
    {l:"Sent",v:sent,s:"awaiting reply",c:"#0d47a1"},
    {l:"Online Orders",v:online,s:"via Buy Tickets",c:"#6a1b9a"},
    {l:"Pending",v:pending,s:"not yet sent",c:"#e65100"},
    {l:"Est. Revenue",v:fmt$(revenue),s:"confirmed",c:"#5c3317"},
  ];
  const byCh=chapters.map(ch=>{
    const t=tickets.filter(x=>x.chapterId===ch.id);
    return {...ch,conf:t.filter(x=>x.status==="Confirmed"||x.status==="Paid Online").length,
      sent:t.filter(x=>x.status==="Sent").length,total:t.length};
  });
  return(
    <div>
      <div style={{background:"#1b5e20",borderRadius:12,padding:"16px 20px",marginBottom:16,border:"2px solid #d4a017"}}>
        <div style={{height:3,background:"linear-gradient(90deg,#7a5a10,#d4a017,#f5d060,#d4a017,#7a5a10)",marginBottom:10,borderRadius:2}}/>
        <div style={{fontSize:9,letterSpacing:3,color:"#d4a017",fontWeight:"bold",marginBottom:3}}>SLPPNA · DRC CHAPTER</div>
        <div style={{fontSize:18,fontWeight:"bold",color:"#fff",fontFamily:"Georgia,serif",marginBottom:6}}>{EVENT.name}</div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          {[["📅",EVENT.date],["⏰",EVENT.time],["📍",EVENT.venue],["👤","Chair: "+EVENT.chair],["📞",EVENT.secretary_phone]].map(([i,v])=>(
            <div key={v} style={{fontSize:10,color:"#c8e6c9"}}>{i} {v}</div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:16}}>
        {stats.map(s=>(
          <div key={s.l} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"10px 12px"}}>
            <div style={{fontSize:10,color:"var(--color-text-secondary)",marginBottom:2}}>{s.l}</div>
            <div style={{fontSize:20,fontWeight:500,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:"var(--color-text-secondary)",marginTop:1}}>{s.s}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>
          <span>Confirmation progress</span><span>{conf}/{total}</span>
        </div>
        <div style={{height:7,background:"var(--color-background-secondary)",borderRadius:99,overflow:"hidden",border:"0.5px solid var(--color-border-tertiary)"}}>
          <div style={{height:"100%",width:`${Math.round(conf/total*100)}%`,background:"#2e7d32",borderRadius:99}}/>
        </div>
        <div style={{display:"flex",gap:8,marginTop:4}}>
          {[["#2e7d32","Confirmed"],["#6a1b9a","Online"],["#1565c0","Sent"],["#e65100","Pending"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"var(--color-text-secondary)"}}>
              <div style={{width:7,height:7,borderRadius:2,background:c}}/>{l}
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",overflow:"hidden"}}>
        <div style={{padding:"9px 14px",borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:12,fontWeight:500}}>
          Chapter Status — 20 Chapters · 100 Tickets
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}>
            <thead><tr style={{background:"var(--color-background-secondary)"}}>
              {["#","Chapter","Code","Chair","Conf","Sent","Pend"].map(h=>(
                <th key={h} style={{padding:"6px 9px",textAlign:"left",fontWeight:500,color:"var(--color-text-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {byCh.map((ch,i)=>(
                <tr key={ch.id} style={{background:i%2===0?"var(--color-background-primary)":"var(--color-background-secondary)"}}>
                  <td style={{padding:"6px 9px",color:"var(--color-text-secondary)"}}>{ch.id}</td>
                  <td style={{padding:"6px 9px",fontWeight:ch.conf===5?500:400,color:"var(--color-text-primary)"}}>{ch.name}</td>
                  <td style={{padding:"6px 9px",fontFamily:"monospace",fontSize:10,color:"var(--color-text-secondary)"}}>{ch.code}</td>
                  <td style={{padding:"6px 9px",color:"var(--color-text-secondary)"}}>{ch.exec}</td>
                  <td style={{padding:"6px 9px",color:"#1b5e20",fontWeight:500}}>{ch.conf}<span style={{color:"var(--color-text-secondary)",fontWeight:400}}>/5</span></td>
                  <td style={{padding:"6px 9px",color:"#1565c0"}}>{ch.sent}</td>
                  <td style={{padding:"6px 9px",color:ch.total-ch.conf-ch.sent>0?"#e65100":"var(--color-text-secondary)"}}>{ch.total-ch.conf-ch.sent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TICKET MANAGER ─────────────────────────────────────────────────────────
function TicketMgr({tickets,setTickets,chapters}){
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null);
  const [edit,setEdit]=useState(false);
  const [ed,setEd]=useState({});
  const filtered=tickets.filter(t=>{
    const ms=filter==="All"||t.status===filter;
    const q=search.toLowerCase();
    return ms&&(!q||t.id.toLowerCase().includes(q)||t.chapterName.toLowerCase().includes(q)||(t.holder||"").toLowerCase().includes(q));
  });
  const selTk=sel?tickets.find(t=>t.id===sel):null;
  function upd(id,ch){setTickets(p=>p.map(t=>t.id===id?{...t,...ch}:t));}
  return(
    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
          <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{flex:1,minWidth:150,fontSize:12,padding:"5px 9px",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)"}}/>
          {["All","Pending","Sent","Confirmed","Paid Online"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"4px 9px",fontSize:10,borderRadius:20,cursor:"pointer",
              background:filter===f?"#1b5e20":"transparent",color:filter===f?"#d4a017":"var(--color-text-secondary)",
              border:filter===f?"1px solid #d4a017":"0.5px solid var(--color-border-tertiary)"}}>{f}</button>
          ))}
          <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>{filtered.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {filtered.map(tk=>(
            <div key={tk.id} onClick={()=>setSel(tk.id)}
              style={{background:"var(--color-background-primary)",
                border:sel===tk.id?"1px solid #2e7d32":"0.5px solid var(--color-border-tertiary)",
                borderRadius:"var(--border-radius-md)",padding:"8px 11px",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontFamily:"monospace",fontSize:10,fontWeight:500,color:"#1b5e20"}}>{tk.id}</span>
                  <Badge status={tk.status}/>
                  {tk.source==="online"&&<span style={{fontSize:9,background:"#f3e5f5",color:"#6a1b9a",padding:"1px 5px",borderRadius:10}}>Online</span>}
                </div>
                <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>{tk.type}</span>
              </div>
              <div style={{fontSize:10,color:"var(--color-text-secondary)",display:"flex",gap:8}}>
                <span style={{fontWeight:500,color:"var(--color-text-primary)"}}>{tk.chapterName}</span>
                {tk.holder&&<span style={{color:"#1b5e20"}}>→ {tk.holder}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selTk&&(
        <div style={{width:265,flexShrink:0,background:"var(--color-background-primary)",
          border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"12px",position:"sticky",top:0}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <div style={{fontSize:12,fontWeight:500}}>Detail</div>
            <button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--color-text-secondary)"}}>×</button>
          </div>
          <div style={{marginBottom:10}}><TCard tk={selTk}/></div>
          {!edit?(
            <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>
              {[["Serial",selTk.id],["Ref",selTk.chRef],["Chapter",selTk.chapterName],
                ["Type",selTk.type],["Holder",selTk.holder||"—"],["Status",selTk.status],
                ["Source",selTk.source||"chapter"],["Confirmed",fmtD(selTk.confirmedAt)],["Notes",selTk.notes||"—"]
              ].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                  <span>{l}</span><span style={{color:"var(--color-text-primary)",fontWeight:l==="Serial"?500:400,fontFamily:l==="Serial"?"monospace":"inherit",maxWidth:130,textAlign:"right",wordBreak:"break-all"}}>{v}</span>
                </div>
              ))}
              <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:8}}>
                <button onClick={()=>{setEdit(true);setEd({holder:selTk.holder,type:selTk.type,confirmedBy:selTk.confirmedBy,notes:selTk.notes});}}
                  style={{padding:"5px",fontSize:10,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)"}}>Edit</button>
                {selTk.status==="Pending"&&<button onClick={()=>upd(selTk.id,{status:"Sent",sentAt:nowISO()})}
                  style={{padding:"5px",fontSize:10,cursor:"pointer",borderRadius:"var(--border-radius-md)",background:"#e3f2fd",color:"#0d47a1",border:"1px solid #90caf9"}}>Mark Sent</button>}
                {selTk.status!=="Confirmed"&&<button onClick={()=>upd(selTk.id,{status:"Confirmed",confirmedAt:nowISO()})}
                  style={{padding:"5px",fontSize:10,cursor:"pointer",borderRadius:"var(--border-radius-md)",background:"#e8f5e9",color:"#1b5e20",border:"1px solid #a5d6a7",fontWeight:500}}>✓ Confirm</button>}
              </div>
            </div>
          ):(
            <div style={{fontSize:10}}>
              {[["holder","Holder"],["confirmedBy","Confirmed By"],["notes","Notes"]].map(([k,l])=>(
                <div key={k} style={{marginBottom:5}}>
                  <label style={{display:"block",color:"var(--color-text-secondary)",marginBottom:1}}>{l}</label>
                  <input value={ed[k]||""} onChange={e=>setEd(p=>({...p,[k]:e.target.value}))} style={{width:"100%",fontSize:10,boxSizing:"border-box"}}/>
                </div>
              ))}
              <div style={{marginBottom:6}}>
                <label style={{display:"block",color:"var(--color-text-secondary)",marginBottom:1}}>Type</label>
                <select value={ed.type||selTk.type} onChange={e=>setEd(p=>({...p,type:e.target.value}))} style={{width:"100%",fontSize:10}}>
                  <option>Ordinary</option><option>Patron</option><option>Grand Chief Patron</option>
                </select>
              </div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>{upd(selTk.id,ed);setEdit(false);}} style={{flex:1,padding:"5px",fontSize:10,cursor:"pointer",background:"#e8f5e9",color:"#1b5e20",border:"1px solid #a5d6a7",borderRadius:"var(--border-radius-md)"}}>Save</button>
                <button onClick={()=>setEdit(false)} style={{flex:1,padding:"5px",fontSize:10,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)"}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CHAPTERS VIEW ───────────────────────────────────────────────────────────
function ChaptersView({chapters,tickets}){
  const [sel,setSel]=useState(null);
  const ch=sel?chapters.find(c=>c.id===sel):null;
  return(
    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
      <div style={{flex:1,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:7}}>
        {chapters.map(chapter=>{
          const tix=tickets.filter(t=>t.chapterId===chapter.id);
          const conf=tix.filter(t=>t.status==="Confirmed"||t.status==="Paid Online").length;
          return(
            <div key={chapter.id} onClick={()=>setSel(chapter.id)}
              style={{background:"var(--color-background-primary)",
                border:sel===chapter.id?"1.5px solid #2e7d32":(chapter.code==="DRC"?"1.5px solid #d4a017":"0.5px solid var(--color-border-tertiary)"),
                borderRadius:"var(--border-radius-lg)",padding:"11px",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                <div>
                  <div style={{fontSize:10,fontWeight:500,color:"var(--color-text-primary)",lineHeight:1.3}}>{chapter.name}</div>
                  <div style={{fontSize:9,color:"var(--color-text-secondary)",fontFamily:"monospace",marginTop:1}}>{chapter.code}</div>
                </div>
                {chapter.code==="DRC"&&<span style={{fontSize:8,background:"#1b5e20",color:"#d4a017",borderRadius:4,padding:"1px 4px"}}>HOST</span>}
              </div>
              <div style={{fontSize:9,color:"var(--color-text-secondary)",marginBottom:5}}>{chapter.exec}</div>
              <div style={{display:"flex",gap:2,marginBottom:3}}>
                {tix.map(t=><div key={t.id} style={{flex:1,height:3,borderRadius:2,background:t.status==="Confirmed"||t.status==="Paid Online"?"#2e7d32":t.status==="Sent"?"#1565c0":"#e0e0e0"}}/>)}
              </div>
              <div style={{fontSize:9,color:"var(--color-text-secondary)"}}><span style={{color:"#1b5e20",fontWeight:500}}>{conf}</span>/5</div>
            </div>
          );
        })}
      </div>
      {ch&&(
        <div style={{width:270,flexShrink:0,background:"var(--color-background-primary)",
          border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <div style={{fontSize:12,fontWeight:500}}>{ch.name}</div>
            <button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--color-text-secondary)"}}>×</button>
          </div>
          <div style={{fontSize:11,marginBottom:10}}>
            {[["Code",ch.code],["Chair",ch.exec],["Email",ch.email],["Phone",ch.phone]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                <span style={{color:"var(--color-text-secondary)"}}>{l}</span>
                <span style={{color:"var(--color-text-primary)",fontWeight:500,fontSize:10}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,fontWeight:500,marginBottom:6}}>Tickets</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {tickets.filter(t=>t.chapterId===ch.id).map(tk=>(
              <div key={tk.id} style={{padding:"7px 9px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                  <span style={{fontFamily:"monospace",fontSize:9,fontWeight:500,color:"#1b5e20"}}>{tk.id}</span>
                  <Badge status={tk.status}/>
                </div>
                <div style={{fontSize:9,color:"var(--color-text-secondary)"}}>{tk.type} · {tk.holder||<span style={{fontStyle:"italic"}}>Unassigned</span>}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPOSE ─────────────────────────────────────────────────────────────────
function Compose({tickets,setTickets,chapters}){
  const [mode,setMode]=useState("allocation");
  const [selCh,setSelCh]=useState(chapters[0].id);
  const [msg,setMsg]=useState("");
  const [done,setDone]=useState(false);
  const ch=chapters.find(c=>c.id===selCh);
  const tix=tickets.filter(t=>t.chapterId===selCh);
  useEffect(()=>{
    if(!ch)return;
    if(mode==="allocation") setMsg(`Dear ${ch.exec},\n\nGreetings from the SLPPNA DRC Chapter!\n\nYour chapter's 5 tickets for the DRC Executive Inaugural Ball:\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nEVENT: ${EVENT.name}\nDATE:  ${EVENT.date}  |  TIME: ${EVENT.time}\nVENUE: ${EVENT.venue}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nYOUR SERIALS (${ch.code}):\n${tix.map(t=>"  "+t.id).join("\n")}\n\nPrices: Ordinary $100 · Patron $150 · Grand Chief Patron By Donation\n\nPlease reply confirming holder names and ticket types.\n\nRSVP: ${EVENT.chair} · ${EVENT.secretary} ${EVENT.secretary_phone}\n\n${EVENT.secretary}\nSecretary General, SLPPNA DRC Chapter`);
    else setMsg(`Dear ${ch.exec},\n\nTicket confirmation for DRC Inaugural Ball:\n\n${tix.filter(t=>t.status==="Confirmed"||t.status==="Paid Online").map(t=>"  "+t.id+" | "+(t.holder||"Unassigned")+" | "+t.type).join("\n")||"  No confirmed tickets yet."}\n\nDate: ${EVENT.date} · ${EVENT.time}\nVenue: ${EVENT.venue}\n\nPresent this email or physical ticket at the door.\n\n${EVENT.secretary}`);
  },[mode,selCh,ch]);
  function send(){setTickets(p=>p.map(t=>t.chapterId===selCh&&t.status==="Pending"?{...t,status:"Sent",sentAt:nowISO()}:t));setDone(true);setTimeout(()=>setDone(false),3000);}
  return(
    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
      <div style={{flex:1}}>
        <div style={{display:"flex",gap:5,marginBottom:10}}>
          {[["allocation","Allocation"],["confirmation","Confirmation"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{padding:"5px 12px",fontSize:11,cursor:"pointer",borderRadius:20,
              background:mode===m?"#1b5e20":"transparent",color:mode===m?"#d4a017":"var(--color-text-secondary)",
              border:mode===m?"1px solid #d4a017":"0.5px solid var(--color-border-tertiary)"}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:6,marginBottom:7,alignItems:"center"}}>
          <label style={{fontSize:11,color:"var(--color-text-secondary)",whiteSpace:"nowrap"}}>To:</label>
          <select value={selCh} onChange={e=>setSelCh(Number(e.target.value))} style={{flex:1,fontSize:11}}>
            {chapters.map(c=><option key={c.id} value={c.id}>{c.name} – {c.exec}</option>)}
          </select>
        </div>
        {ch&&<div style={{marginBottom:7,padding:"5px 10px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",fontSize:10,color:"var(--color-text-secondary)"}}>
          <span style={{fontWeight:500,color:"var(--color-text-primary)"}}>{ch.exec}</span> · <span style={{color:"var(--color-text-info)"}}>{ch.email}</span></div>}
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={14}
          style={{width:"100%",fontSize:11,boxSizing:"border-box",fontFamily:"monospace",lineHeight:1.6,resize:"vertical",marginBottom:8}}/>
        <div style={{display:"flex",gap:6}}>
          <button onClick={send} style={{padding:"7px 16px",fontSize:12,cursor:"pointer",fontWeight:500,
            background:done?"#e8f5e9":"#1b5e20",color:done?"#1b5e20":"#d4a017",
            border:done?"1px solid #a5d6a7":"1px solid #d4a017",borderRadius:"var(--border-radius-md)"}}>
            {done?"✓ Sent!":`Send to ${ch?.exec?.split(" ")[0]}`}
          </button>
          <button style={{padding:"7px 16px",fontSize:12,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)"}}>Copy</button>
        </div>
      </div>
      <div style={{width:210,flexShrink:0,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"12px"}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:8}}>Bulk Send</div>
        <div style={{fontSize:10,color:"var(--color-text-secondary)",lineHeight:1.6,marginBottom:8}}>Send to all 20 chapters at once.</div>
        <button style={{width:"100%",padding:"7px",fontSize:11,cursor:"pointer",background:"#e8f5e9",color:"#1b5e20",border:"1px solid #a5d6a7",borderRadius:"var(--border-radius-md)",fontWeight:500,marginBottom:5}}>Send All (20)</button>
        <button style={{width:"100%",padding:"7px",fontSize:11,cursor:"pointer",background:"#e3f2fd",color:"#0d47a1",border:"1px solid #90caf9",borderRadius:"var(--border-radius-md)",fontWeight:500}}>Confirm All</button>
        <div style={{marginTop:10,padding:"7px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",fontSize:9,color:"var(--color-text-secondary)"}}>
          Connect Gmail via Apps Script for live email delivery.
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function Analytics({tickets,chapters}){
  const total=tickets.length;
  const conf=tickets.filter(t=>t.status==="Confirmed"||t.status==="Paid Online").length;
  const sent=tickets.filter(t=>t.status==="Sent").length;
  const online=tickets.filter(t=>t.source==="online").length;
  const pat=tickets.filter(t=>t.type==="Patron").length;
  const revenue=tickets.filter(t=>t.status==="Confirmed"||t.status==="Paid Online")
    .reduce((s,t)=>s+(t.type==="Patron"?150:100),0);
  const pct=v=>Math.round(v/total*100);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"12px"}}>
          <div style={{fontSize:12,fontWeight:500,marginBottom:10,color:"var(--color-text-primary)"}}>Ticket status</div>
          {[["Confirmed",conf,"#2e7d32"],["Online",online,"#6a1b9a"],["Sent",sent,"#1565c0"],["Pending",total-conf-sent,"#e65100"]].map(([l,v,c])=>(
            <div key={l} style={{marginBottom:7}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--color-text-secondary)",marginBottom:2}}>
                <span>{l}</span><span style={{color:c,fontWeight:500}}>{v} ({pct(v)}%)</span>
              </div>
              <div style={{height:4,background:"var(--color-background-secondary)",borderRadius:99,overflow:"hidden"}}>
                <div style={{width:`${pct(v)}%`,height:"100%",background:c,borderRadius:99}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"12px"}}>
          <div style={{fontSize:12,fontWeight:500,marginBottom:10,color:"var(--color-text-primary)"}}>Revenue</div>
          {[["Confirmed",fmt$(revenue),"#1b5e20"],["All Ordinary",fmt$(total*100),"#2e7d32"],["All Patron",fmt$(total*150),"#b45309"],["Max",fmt$(total*150),"#5b21b6"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:11}}>
              <span style={{color:"var(--color-text-secondary)"}}>{l}</span>
              <span style={{color:c,fontWeight:500}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"12px"}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:10,color:"var(--color-text-primary)"}}>Per chapter — 20 chapters</div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {chapters.map(ch=>{
            const c=tickets.filter(t=>t.chapterId===ch.id&&(t.status==="Confirmed"||t.status==="Paid Online")).length;
            return(
              <div key={ch.id} style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:75,fontSize:9,color:"var(--color-text-secondary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ch.code}</div>
                <div style={{flex:1,height:4,background:"var(--color-background-secondary)",borderRadius:99,overflow:"hidden"}}>
                  <div style={{width:`${c/5*100}%`,height:"100%",background:c===5?"#2e7d32":c>0?"#1565c0":"#e0e0e0",borderRadius:99}}/>
                </div>
                <div style={{fontSize:9,color:"var(--color-text-secondary)",width:22,textAlign:"right"}}>{c}/5</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("hub");
  const [chapters]=useState(CHAPTERS_SEED);
  const [tickets,setTickets]=useState(()=>buildTickets(CHAPTERS_SEED));
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    async function load(){
      try{const r=await window.storage.get(SKEY);if(r?.value){const s=JSON.parse(r.value);if(s.tickets)setTickets(s.tickets);}}catch{}
      setLoaded(true);
    }
    load();
  },[]);

  useEffect(()=>{
    if(!loaded)return;
    async function save(){try{await window.storage.set(SKEY,JSON.stringify({tickets,savedAt:nowISO()}));}catch{}}
    save();
  },[tickets,loaded]);

  const conf=tickets.filter(t=>t.status==="Confirmed"||t.status==="Paid Online").length;
  const online=tickets.filter(t=>t.source==="online").length;
  const pending=tickets.filter(t=>t.status==="Pending").length;

  const TABS=[
    {id:"hub",      icon:"ti-ticket",   label:"Buy Tickets",  hub:true},
    {id:"dashboard",icon:"ti-home",     label:"Dashboard"},
    {id:"tickets",  icon:"ti-list",     label:"All Tickets",  badge:pending>0?pending:null},
    {id:"chapters", icon:"ti-users",    label:"Chapters"},
    {id:"compose",  icon:"ti-mail",     label:"Send"},
    {id:"analytics",icon:"ti-chart-bar",label:"Analytics"},
  ];

  return(
    <div style={{fontFamily:"var(--font-sans)",minHeight:600}}>
      {/* Header */}
      <div style={{background:"#1b5e20",borderRadius:"var(--border-radius-lg)",padding:"9px 14px",
        marginBottom:12,border:"1.5px solid #d4a017",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:8,letterSpacing:3,color:"#d4a017",fontWeight:"bold",textTransform:"uppercase"}}>SLPPNA · DRC Chapter</div>
          <div style={{fontSize:14,fontWeight:500,color:"#fff",fontFamily:"Georgia,serif"}}>Event &amp; Ticketing Platform</div>
        </div>
        <div style={{display:"flex",gap:12,fontSize:10,color:"#8fd4a8"}}>
          {[["Tickets",tickets.length,"#fff"],["Confirmed",conf,"#81c784"],["Online",online,"#ce93d8"],["Pending",pending,pending>0?"#ffb74d":"#8fd4a8"]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:15,fontWeight:500,color:c}}>{v}</div>
              <div>{l}</div>
            </div>
          ))}
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:500,color:"#fff"}}>Jul 25</div>
            <div>2026</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:1,marginBottom:16,borderBottom:"0.5px solid var(--color-border-tertiary)",flexWrap:"wrap"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{display:"flex",alignItems:"center",gap:4,padding:"7px 12px",fontSize:12,cursor:"pointer",
              background:tab===t.id&&t.hub?"#1b5e20":"transparent",
              color:tab===t.id&&t.hub?"#d4a017":tab===t.id?"#1b5e20":"var(--color-text-secondary)",
              border:"none",
              borderBottom:tab===t.id&&!t.hub?"2.5px solid #1b5e20":tab===t.id&&t.hub?"2.5px solid #d4a017":"2.5px solid transparent",
              fontWeight:tab===t.id?500:400,
              borderRadius:tab===t.id&&t.hub?"var(--border-radius-md) var(--border-radius-md) 0 0":"0",
              transition:"all 0.15s",position:"relative"}}>
            <i className={`ti ${t.icon}`} style={{fontSize:14}} aria-hidden="true"/>
            {t.label}
            {t.badge&&<span style={{background:"#e65100",color:"white",borderRadius:10,fontSize:9,padding:"1px 5px",fontWeight:500,marginLeft:2}}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {tab==="hub"      &&<BuyHub     tickets={tickets} setTickets={setTickets} chapters={chapters}/>}
      {tab==="dashboard"&&<Dashboard  tickets={tickets} chapters={chapters}/>}
      {tab==="tickets"  &&<TicketMgr  tickets={tickets} setTickets={setTickets} chapters={chapters}/>}
      {tab==="chapters" &&<ChaptersView tickets={tickets} chapters={chapters}/>}
      {tab==="compose"  &&<Compose    tickets={tickets} setTickets={setTickets} chapters={chapters}/>}
      {tab==="analytics"&&<Analytics  tickets={tickets} chapters={chapters}/>}
    </div>
  );
}
