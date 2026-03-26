"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MI{id:string;category:string;title:string;description:string;price:number;image:string;allergies:string[];variants:string[];visible:boolean;}
interface HC{override:"open"|"closed"|null;schedule:Record<string,{open:string;close:string}|null>;}

const CATS=["Kaker","Bakverk","Brod"];
const ALLERG=["Gluten","Melk","Egg","Notter","Soya","Sesam","Fisk","Skalldyr","Selleri","Sennep","Sulfitt"];
const DAYS=["mandag","tirsdag","onsdag","torsdag","fredag","lordag","sondag"];
const DL:Record<string,string>={mandag:"Mandag",tirsdag:"Tirsdag",onsdag:"Onsdag",torsdag:"Torsdag",fredag:"Fredag",lordag:"Lordag",sondag:"Sondag"};
const empty=():Omit<MI,"id">=>({category:"Kaker",title:"",description:"",price:0,image:"/images/placeholder.jpg",allergies:[],variants:[],visible:true});

export default function AdminMenyPage(){
  const router=useRouter();
  const [pw,setPw]=useState("");
  const [items,setItems]=useState<MI[]>([]);
  const [hours,setHours]=useState<HC|null>(null);
  const [editing,setEditing]=useState<MI|null>(null);
  const [adding,setAdding]=useState(false);
  const [draft,setDraft]=useState<Omit<MI,"id">>(empty());
  const [saving,setSaving]=useState(false);
  const [tab,setTab]=useState<"menu"|"hours">("menu");
  const [toast,setToast]=useState("");

  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(""),3000);};
  const hdr=useCallback(()=>({"Content-Type":"application/json","x-admin-password":pw}),[pw]);

  useEffect(()=>{
    const p=sessionStorage.getItem("admin_pw");
    if(!p){router.push("/admin");return;}
    setPw(p);
    fetch("/api/admin/menu",{headers:{"x-admin-password":p}})
      .then(r=>r.ok?r.json():Promise.reject())
      .then(setItems)
      .catch(()=>router.push("/admin"));
    fetch("/api/admin/hours",{headers:{"x-admin-password":p}})
      .then(r=>r.ok?r.json():null)
      .then(setHours);
  },[router]);

  const saveItem=async()=>{
    setSaving(true);
    if(editing){
      await fetch("/api/admin/menu",{method:"PUT",headers:hdr(),body:JSON.stringify({...editing,...draft})});
      setItems(it=>it.map(i=>i.id===editing.id?{...i,...draft}:i));
      setEditing(null);
    }else{
      const res=await fetch("/api/admin/menu",{method:"POST",headers:hdr(),body:JSON.stringify(draft)});
      const d=await res.json();
      setItems(it=>[...it,d.item]);
      setAdding(false);
    }
    setDraft(empty());setSaving(false);showToast("Lagret!");
  };
  const del=async(id:string)=>{
    if(!confirm("Slett dette produktet?"))return;
    await fetch("/api/admin/menu",{method:"DELETE",headers:hdr(),body:JSON.stringify({id})});
    setItems(it=>it.filter(i=>i.id!==id));showToast("Slettet");
  };
  const toggleV=async(item:MI)=>{
    const u={...item,visible:!item.visible};
    await fetch("/api/admin/menu",{method:"PUT",headers:hdr(),body:JSON.stringify(u)});
    setItems(it=>it.map(i=>i.id===item.id?u:i));
  };
  const setOv=async(val:"open"|"closed"|null)=>{
    await fetch("/api/admin/hours",{method:"PUT",headers:hdr(),body:JSON.stringify({override:val})});
    setHours(h=>h?{...h,override:val}:h);
    showToast(val==="open"?"Satt til APEN":(val==="closed"?"Satt til STENGT":"Override fjernet"));
  };

  const Toggle=({val,onChange}:{val:boolean;onChange:()=>void})=>(
    <div onClick={onChange} style={{width:44,height:24,borderRadius:12,background:val?"#b8960c":"#2a2a2a",position:"relative",transition:"background 0.2s",cursor:"pointer",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:val?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
    </div>
  );

  const Editor=()=>(
    <div style={{background:"#111",border:"1px solid rgba(184,150,12,0.3)",borderRadius:16,padding:"28px",display:"grid",gap:16,marginBottom:24}}>
      <h3 style={{fontFamily:"Georgia,serif",color:"#d4a820",fontSize:"1.1rem"}}>{editing?"Rediger produkt":"Nytt produkt"}</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <label className="input-label">Tittel *</label>
          <input value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} className="input" placeholder="Produktnavn"/>
        </div>
        <div>
          <label className="input-label">Kategori</label>
          <select value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))} className="input">
            {CATS.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="input-label">Beskrivelse</label>
        <textarea value={draft.description} onChange={e=>setDraft(d=>({...d,description:e.target.value}))} className="input" rows={3} style={{resize:"vertical"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <label className="input-label">Pris (kr)</label>
          <input type="number" value={draft.price} onChange={e=>setDraft(d=>({...d,price:Number(e.target.value)}))} className="input"/>
        </div>
        <div>
          <label className="input-label">Bildesti</label>
          <input value={draft.image} onChange={e=>setDraft(d=>({...d,image:e.target.value}))} className="input" placeholder="/images/foto.jpg"/>
        </div>
      </div>
      <div>
        <label className="input-label">Allergener</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
          {ALLERG.map(a=>(
            <label key={a} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",padding:"4px 10px",borderRadius:50,
              border:`1px solid ${draft.allergies.includes(a)?"#b8960c":"#2a2a2a"}`,
              background:draft.allergies.includes(a)?"rgba(184,150,12,0.1)":"transparent",
              fontSize:"0.78rem",color:draft.allergies.includes(a)?"#d4a820":"#6a5a4a",transition:"all 0.15s"}}>
              <input type="checkbox" checked={draft.allergies.includes(a)}
                onChange={e=>setDraft(d=>({...d,allergies:e.target.checked?[...d.allergies,a]:d.allergies.filter(x=>x!==a)}))}
                style={{display:"none"}}/>
              {a}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="input-label">Varianter (komma-separert)</label>
        <input value={draft.variants.join(",")} onChange={e=>setDraft(d=>({...d,variants:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} className="input" placeholder="Liten,Medium,Stor"/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Toggle val={draft.visible} onChange={()=>setDraft(d=>({...d,visible:!d.visible}))}/>
        <span style={{fontSize:"0.84rem",color:"#7a6a4a"}}>{draft.visible?"Synlig i meny":"Skjult"}</span>
      </div>
      <div style={{display:"flex",gap:12}}>
        <button onClick={saveItem} disabled={saving||!draft.title} className="btn btn-gold" style={{padding:"10px 24px"}}>
          {saving?"Lagrer...":"Lagre"}
        </button>
        <button onClick={()=>{setEditing(null);setAdding(false);setDraft(empty());}} className="btn btn-outline" style={{padding:"10px 20px"}}>Avbryt</button>
      </div>
    </div>
  );

  return(
    <div style={{background:"#0a0a0a",minHeight:"100vh",padding:"60px 0"}}>
      {toast&&(
        <div style={{position:"fixed",top:80,right:24,background:"#1a1a1a",border:"1px solid rgba(184,150,12,0.4)",borderRadius:12,padding:"12px 20px",color:"#d4a820",fontSize:"0.88rem",zIndex:999,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
          ✓ {toast}
        </div>
      )}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:40,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#b8960c",marginBottom:6}}>Admin</div>
            <h1 style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#f0e6d0"}}>Administrasjon</h1>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Link href="/" style={{fontSize:"0.82rem",color:"#5a4a3a",border:"1px solid #2a2a2a",borderRadius:50,padding:"8px 16px"}}>Forside</Link>
            <button onClick={()=>{sessionStorage.removeItem("admin_pw");window.location.href="/admin";}}
              style={{fontSize:"0.82rem",color:"#5a4a3a",background:"none",border:"1px solid #2a2a2a",borderRadius:50,padding:"8px 16px",cursor:"pointer"}}>
              Logg ut
            </button>
          </div>
        </div>

        <div style={{display:"flex",gap:4,marginBottom:32,background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:4,width:"fit-content"}}>
          {(["menu","hours"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:"10px 24px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:600,fontSize:"0.88rem",transition:"all 0.2s",
                background:tab===t?"rgba(184,150,12,0.2)":"transparent",color:tab===t?"#d4a820":"#5a4a3a"}}>
              {t==="menu"?"🍰 Meny":"🕘 Apningstider"}
            </button>
          ))}
        </div>

        {tab==="menu"&&(
          <>
            {(editing||adding)&&<Editor/>}
            {!editing&&!adding&&(
              <button onClick={()=>{setAdding(true);setDraft(empty());}} className="btn btn-gold" style={{marginBottom:24,padding:"10px 24px"}}>
                + Nytt produkt
              </button>
            )}
            <div style={{display:"grid",gap:12}}>
              {items.map(item=>(
                <div key={item.id} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:14,padding:"20px 24px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",opacity:item.visible?1:0.5}}>
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#b8960c",marginBottom:4}}>{item.category}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:"#f0e6d0",marginBottom:2}}>{item.title}</div>
                    <div style={{fontSize:"0.82rem",color:"#5a4a3a"}}>{item.price} kr</div>
                  </div>
                  <div style={{fontSize:"0.8rem",color:"#4a3a2a",maxWidth:280,flex:2}}>{item.description.slice(0,80)}{item.description.length>80?"...":""}</div>
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <Toggle val={item.visible} onChange={()=>toggleV(item)}/>
                      <span style={{fontSize:"0.74rem",color:"#5a4a3a"}}>{item.visible?"Synlig":"Skjult"}</span>
                    </div>
                    <button onClick={()=>{setEditing(item);setDraft({category:item.category,title:item.title,description:item.description,price:item.price,image:item.image,allergies:[...item.allergies],variants:[...item.variants],visible:item.visible});setAdding(false);}}
                      style={{fontSize:"0.8rem",color:"#b8960c",background:"rgba(184,150,12,0.1)",border:"1px solid rgba(184,150,12,0.3)",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>
                      Rediger
                    </button>
                    <button onClick={()=>del(item.id)}
                      style={{fontSize:"0.8rem",color:"#f87171",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>
                      Slett
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==="hours"&&hours&&(
          <div style={{display:"grid",gap:24}}>
            <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:16,padding:"28px"}}>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:"#d4a820",marginBottom:8}}>Manuell overstyring</h2>
              <p style={{color:"#5a4a3a",fontSize:"0.86rem",marginBottom:20}}>Overstyrer apningstidene umiddelbart.</p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <button onClick={()=>setOv("open")}
                  style={{padding:"12px 24px",borderRadius:50,border:`2px solid ${hours.override==="open"?"#4ade80":"#2a2a2a"}`,
                    background:hours.override==="open"?"rgba(74,222,128,0.15)":"transparent",
                    color:hours.override==="open"?"#4ade80":"#5a4a3a",fontWeight:600,fontSize:"0.9rem",cursor:"pointer",transition:"all 0.2s"}}>
                  ✅ Sett som APEN
                </button>
                <button onClick={()=>setOv("closed")}
                  style={{padding:"12px 24px",borderRadius:50,border:`2px solid ${hours.override==="closed"?"#f87171":"#2a2a2a"}`,
                    background:hours.override==="closed"?"rgba(248,113,113,0.15)":"transparent",
                    color:hours.override==="closed"?"#f87171":"#5a4a3a",fontWeight:600,fontSize:"0.9rem",cursor:"pointer",transition:"all 0.2s"}}>
                  ❌ Sett som STENGT
                </button>
                {hours.override&&(
                  <button onClick={()=>setOv(null)}
                    style={{padding:"12px 24px",borderRadius:50,border:"2px solid #2a2a2a",background:"transparent",color:"#7a6a4a",fontWeight:600,fontSize:"0.9rem",cursor:"pointer"}}>
                    Tilbake til normal
                  </button>
                )}
              </div>
              {hours.override&&(
                <div style={{marginTop:16,padding:"10px 16px",background:"rgba(184,150,12,0.07)",border:"1px solid rgba(184,150,12,0.2)",borderRadius:8,fontSize:"0.84rem",color:"#b8960c"}}>
                  Aktiv overstyring: <strong>{hours.override==="open"?"APEN":"STENGT"}</strong>
                </div>
              )}
            </div>
            <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:16,padding:"28px"}}>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:"#d4a820",marginBottom:20}}>Faste apningstider</h2>
              <div style={{display:"grid",gap:12}}>
                {DAYS.map(day=>{
                  const s=hours.schedule[day];
                  return(
                    <div key={day} style={{display:"flex",alignItems:"center",gap:16,padding:"12px 0",borderBottom:"1px solid #161616",flexWrap:"wrap"}}>
                      <span style={{minWidth:90,fontSize:"0.88rem",fontWeight:600,color:"#8a7a5a"}}>{DL[day]}</span>
                      {s?(
                        <>
                          <input type="time" value={s.open} onChange={async e=>{
                            const u={...hours,schedule:{...hours.schedule,[day]:{open:e.target.value,close:s.close}}};
                            setHours(u);
                            await fetch("/api/admin/hours",{method:"PUT",headers:hdr(),body:JSON.stringify({schedule:u.schedule})});
                          }} className="input" style={{width:110}}/>
                          <span style={{color:"#4a3a2a"}}>–</span>
                          <input type="time" value={s.close} onChange={async e=>{
                            const u={...hours,schedule:{...hours.schedule,[day]:{open:s.open,close:e.target.value}}};
                            setHours(u);
                            await fetch("/api/admin/hours",{method:"PUT",headers:hdr(),body:JSON.stringify({schedule:u.schedule})});
                          }} className="input" style={{width:110}}/>
                          <button onClick={async()=>{
                            const u={...hours,schedule:{...hours.schedule,[day]:null}};
                            setHours(u);
                            await fetch("/api/admin/hours",{method:"PUT",headers:hdr(),body:JSON.stringify({schedule:u.schedule})});
                          }} style={{fontSize:"0.78rem",color:"#f87171",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,padding:"4px 12px",cursor:"pointer"}}>
                            Stengt
                          </button>
                        </>
                      ):(
                        <>
                          <span style={{fontSize:"0.84rem",color:"#3a3030"}}>Stengt</span>
                          <button onClick={async()=>{
                            const u={...hours,schedule:{...hours.schedule,[day]:{open:"09:00",close:"18:00"}}};
                            setHours(u);
                            await fetch("/api/admin/hours",{method:"PUT",headers:hdr(),body:JSON.stringify({schedule:u.schedule})});
                          }} style={{fontSize:"0.78rem",color:"#4ade80",background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:8,padding:"4px 12px",cursor:"pointer"}}>
                            + Apne
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
