import * as THREE from 'three';

// Four categories, five objects each. Visual meshes and Cannon colliders are
// deliberately separate: cone/pyramid visuals use conservative box colliders.
export const CATEGORIES=[
 {id:'esfera',name:'Esferas',color:0xffbd69,shape:'sphere',geometry:()=>new THREE.SphereGeometry(.105,16,12)},
 {id:'cubo',name:'Cubos',color:0x58c6d8,shape:'box',geometry:()=>new THREE.BoxGeometry(.18,.18,.18)},
 {id:'piramide',name:'Pirámides',color:0xff718b,shape:'box',geometry:()=>new THREE.ConeGeometry(.12,.2,4)},
 {id:'prisma',name:'Prismas hexagonales',color:0xa58bff,shape:'cylinder',geometry:()=>new THREE.CylinderGeometry(.12,.12,.18,6)}
];
export const PIECES=CATEGORIES.flatMap(c=>Array.from({length:5},(_,i)=>({...c,key:`${c.id}-${i+1}`})));
const mat=(color,roughness=.68)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.04});
export function makeLab(scene){
 scene.background=new THREE.Color(0x101b29);scene.fog=new THREE.Fog(0x101b29,7,14);scene.add(new THREE.HemisphereLight(0xd5e8ff,0x253044,2.1));const key=new THREE.DirectionalLight(0xffffff,2.1);key.position.set(-3,5,4);scene.add(key);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,12),mat(0x152333));floor.rotation.x=-Math.PI/2;floor.position.y=-.05;scene.add(floor);
 const tables=[],parts=[],bins=[],buttons=[];
 const tableSpots=[[-1.35,-1.4],[1.35,-1.4],[-1.35,.8],[1.35,.8]];
 for(let i=0;i<4;i++){const [x,z]=tableSpots[i],g=new THREE.Group();g.position.set(x,.72,z);scene.add(g);const top=new THREE.Mesh(new THREE.BoxGeometry(1.45,.12,1.05),mat(0x31455a));top.position.y=0;g.add(top);for(const dx of [-.57,.57])for(const dz of [-.38,.38]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.09,.68,.09),mat(0x26394d));leg.position.set(dx,-.4,dz);g.add(leg);}tables.push({x,z,topY:.78,group:g});}
 // Open-top bins: floor and four wall colliders are represented by visible meshes too.
 const binXs=[-1.35,-.45,.45,1.35],binZ=-2.55;
 CATEGORIES.forEach((c,i)=>{const x=binXs[i],group=new THREE.Group();group.position.set(x,0,binZ);scene.add(group);const bm=mat(c.color),dark=mat(0x27394d);const base=new THREE.Mesh(new THREE.BoxGeometry(.68,.08,.62),dark);base.position.y=.12;group.add(base);for(const [wx,wz,sx,sz] of [[0,-.29,.68,.04],[0,.29,.68,.04],[-.32,0,.04,.54],[.32,0,.04,.54]]){const wall=new THREE.Mesh(new THREE.BoxGeometry(sx,.42,sz),bm);wall.position.set(wx,.33,wz);group.add(wall);}const label=makeLabel(c.name,c.color);label.position.set(0,.76,.34);group.add(label);bins.push({id:c.id,name:c.name,x,z:binZ,minY:.2,maxY:.64,halfX:.29,halfZ:.25});});
 const hud=makeHud();hud.position.set(-1.05,2.05,-2.65);hud.rotation.y=.15;scene.add(hud);
 buttons.push(makeButton('COMENZAR',-.62,0x397a75,'start'),makeButton('REINICIAR',0,0x4f7192,'reset'),makeButton('SALIR DE VR',.62,0x9b6272,'exit'));buttons.forEach((b,i)=>{b.position.set(-.62+i*.62,1.42,-2.15);scene.add(b);});
 const pointer=new THREE.Group();scene.add(pointer);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.002,.004,1,6),new THREE.MeshBasicMaterial({color:0x9bc8ff,transparent:true,opacity:.75}));beam.position.z=-.5;beam.rotation.x=Math.PI/2;pointer.add(beam);const reticle=new THREE.Mesh(new THREE.SphereGeometry(.018,12,8),new THREE.MeshBasicMaterial({color:0x9bc8ff}));pointer.add(reticle);
 return {parts,tables,bins,buttons,hud,pointer,reticle,beam};
}
export function makeLabel(text,color){const c=document.createElement('canvas');c.width=512;c.height=96;const x=c.getContext('2d');x.fillStyle='#101a2a';x.fillRect(0,0,512,96);x.strokeStyle=`#${color.toString(16).padStart(6,'0')}`;x.lineWidth=8;x.strokeRect(4,4,504,88);x.fillStyle='#f4f8ff';x.font='bold 34px sans-serif';x.textAlign='center';x.fillText(text,256,62);return new THREE.Mesh(new THREE.PlaneGeometry(.72,.14),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));}
function makeHud(){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const texture=new THREE.CanvasTexture(canvas);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.35,.68),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));mesh.userData={canvas,texture};return mesh;}
export function updateHud(hud,s){const {canvas,texture}=hud.userData,x=canvas.getContext('2d');x.clearRect(0,0,1024,512);x.fillStyle='rgba(12,24,38,.96)';x.beginPath();x.roundRect(4,4,1016,504,26);x.fill();x.strokeStyle='#45627e';x.lineWidth=4;x.stroke();x.fillStyle='#8dbbff';x.font='bold 34px sans-serif';x.fillText('LABORATORIO · CLASIFICACIÓN GEOMÉTRICA',30,54);x.fillStyle='#f2f7ff';x.font='bold 42px sans-serif';x.fillText(`${s.count}/20 piezas`,30,118);x.font='26px sans-serif';x.fillStyle='#d4e0ef';x.fillText(`Intentos ${s.attempts}   Errores ${s.errors}   Precisión ${s.attempts?Math.round(s.count/s.attempts*100):0}%   Tiempo ${fmt(s.elapsed)}`,30,164);CATEGORIES.forEach((c,i)=>{x.fillStyle=`#${c.color.toString(16).padStart(6,'0')}`;x.fillText(`${c.name}: ${s.progress[c.id]}/5 · ${s.finish[c.id]==null?'pendiente':fmt(s.finish[c.id])}`,30,215+i*39);});x.fillStyle=s.tone==='error'?'#ff8293':s.tone==='success'?'#8de4a0':'#aec1d8';x.font='25px sans-serif';x.fillText((s.message||'Pulsa COMENZAR para iniciar').slice(0,65),30,430);x.fillStyle='#8fa9c4';x.font='21px sans-serif';x.fillText(`${s.hands||'Manos: buscando…'} · Estados físicos: gravedad activa`,30,476);texture.needsUpdate=true;}
function fmt(v){return `${Math.floor(v/60).toString().padStart(2,'0')}:${Math.floor(v%60).toString().padStart(2,'0')}`;}
export function formatTime(seconds){return fmt(seconds);}
function makeButton(label,x,color,action){const g=new THREE.Group();g.userData={kind:'button',action};const b=new THREE.Mesh(new THREE.BoxGeometry(.56,.15,.06),mat(color));g.add(b);const c=document.createElement('canvas');c.width=384;c.height=96;const cx=c.getContext('2d');cx.fillStyle='white';cx.font='bold 30px sans-serif';cx.textAlign='center';cx.fillText(label,192,62);const text=new THREE.Mesh(new THREE.PlaneGeometry(.5,.12),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,side:THREE.DoubleSide}));text.position.z=.034;g.add(text);return g;}
