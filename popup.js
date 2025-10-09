const campoTexto = document.getElementById("texto");
const guardarBtn = document.getElementById("guardar");
const generarBtn = document.getElementById("generar");
const seGuardo = document.getElementById("guardado");
const toggleUA = document.getElementById("toggle-ua");
const autoToggle = document.querySelector("#toggle-auto");
let androidArray = [], iphoneArray = [];


if(localStorage.getItem("autoToggleWhenLoad")==="true"){
autoToggle.checked=true;
}

const url = "https://raw.githubusercontent.com/microlinkhq/top-user-agents/refs/heads/master/src/mobile.json";
fetch(url)
  .then(res => res.json())
  .then(data => {
    androidArray = data.filter(ua => ua.toLowerCase().includes("android"));
    iphoneArray = data.filter(ua => !ua.toLowerCase().includes("android"));
  });

document.getElementById("theform").addEventListener("submit", e => {
  e.preventDefault();
  const type = new FormData(e.target).get("type");
  const array = type === "android" ? androidArray : iphoneArray;
  const randomIndex = Math.floor(Math.random() * array.length);
  campoTexto.value = array[randomIndex] || "Error cargando user agents";
  guardarBtn.click();
});

guardarBtn.addEventListener("click", () => {
  const ua = campoTexto.value.trim();
  if (!ua) return alert("Primero genera un User-Agent");

  chrome.storage.local.set({ userAgent: ua }, () => {
    seGuardo.hidden = false;
    setTimeout(() => seGuardo.hidden = true, 1000);
  });
});

// Cargar el estado del switch al iniciar
chrome.storage.local.get("uaEnabled", (data) => {
  toggleUA.checked = data.uaEnabled ?? true; // por defecto activado
});

// Guardar cambios del switch
toggleUA.addEventListener("change", () => {
  chrome.storage.local.set({ uaEnabled: toggleUA.checked });
});

//CARGAR USER AGENT ACTUAL

document.addEventListener("DOMContentLoaded", () => {
  // Recuperar el último userAgent guardado
  chrome.storage.local.get("userAgent", (data) => {
    if (data.userAgent) {
      campoTexto.value = data.userAgent;
    }
  });
  
 if(localStorage.getItem("autoToggleWhenLoad")==="true"){
 	setTimeout(()=>{
 	generarBtn.click();
 	},1000)
 }
 autoToggle.addEventListener("change",(e)=>{
 	localStorage.setItem("autoToggleWhenLoad",""+e.target.checked);
 });
 
});

const borrarBtn = document.getElementById("borrarDatos");
const borradoAviso = document.getElementById("borrado");

borrarBtn.addEventListener("click", () => {
  const oneWeekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7; // 1 semana atrás

  chrome.browsingData.remove(
    { since: oneWeekAgo },
    {
      cache: true,
      cookies: true,
      history: true,
      downloads: true,
      formData: true,
      localStorage: true,
      passwords: true, // no siempre se puede borrar
      serviceWorkers: true
    },
    () => {
      borradoAviso.hidden = false;
      setTimeout(() => (borradoAviso.hidden = true), 1500);
    }
  );
});
