"use client";
import { useState } from "react";
import Link from "next/link";
export default function AdminLogin(){
  const [pw,setPw]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const login=async(e:React.FormEvent)=>{
    e.preventDefault();setLoading(true);setError("");
    const res=await fetch("/api/admin/hours",{headers:{"x-admin-password":pw}});
    if(res.ok){
      sessionStorage.setItem("admin_pw",pw);
      window.location.href="/admin/meny";
    }else{
      setError("Feil passord. Prov igjen.");
    }
    setLoading(false);
  };
  return(
    <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:"2.5rem",marginBottom:16}}>🔐</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#d4a820",marginBottom:8}}>Admin</h1>
          <p style={{color:"#5a4a3a",fontSize:"0.9rem"}}>T&D Bakeri administrasjonsside</p>
        </div>
        <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:20,padding:"36px"}}>
          <form onSubmit={login} style={{display:"grid",gap:20}}>
            <div>
              <label className="input-label">Passord</label>
              <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setError("");}}
                className="input" placeholder="Admin-passord" autoFocus/>
              {error&&<p className="input-error" style={{marginTop:6}}>{error}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:"14px"}}>
              {loading?"Sjekker...":"Logg inn"}
            </button>
          </form>
        </div>
        <div style={{textAlign:"center",marginTop:24}}>
          <Link href="/" style={{color:"#4a3a2a",fontSize:"0.84rem"}}>Tilbake til forsiden</Link>
        </div>
      </div>
    </div>
  );
}
