'use strict';
/* =====================================================
   PicoSim v4 — Raspberry Pi Pico Simulator
   All components functional · Dropdown selector
   Fixed wire-click z-order bug · Precise pin positions
   ===================================================== */

// ── PICO PIN TABLES ──────────────────────────────────
const PIN_SPACING = 18, FIRST_Y = 34;
const PW = 160, PH = 20 * PIN_SPACING + FIRST_Y + 10;
const LPX = -16, RPX = PW + 16; // left/right pin circle x (local)
const PICO_X = 290, PICO_Y = 18;

const LEFT_PINS = [
  {id:'GP0', label:'GP0', func:'UART0 TX / I2C0 SDA', num:1,  type:'io', gpio:0},
  {id:'GP1', label:'GP1', func:'UART0 RX / I2C0 SCL', num:2,  type:'io', gpio:1},
  {id:'GND1',label:'GND', func:'Ground',               num:3,  type:'gnd'},
  {id:'GP2', label:'GP2', func:'SPI0 SCK / I2C1 SDA', num:4,  type:'io', gpio:2},
  {id:'GP3', label:'GP3', func:'SPI0 TX  / I2C1 SCL', num:5,  type:'io', gpio:3},
  {id:'GP4', label:'GP4', func:'UART1 TX / I2C0 SDA', num:6,  type:'io', gpio:4},
  {id:'GP5', label:'GP5', func:'UART1 RX / I2C0 SCL', num:7,  type:'io', gpio:5},
  {id:'GND2',label:'GND', func:'Ground',               num:8,  type:'gnd'},
  {id:'GP6', label:'GP6', func:'SPI0 SCK / I2C1 SDA', num:9,  type:'io', gpio:6},
  {id:'GP7', label:'GP7', func:'SPI0 TX  / I2C1 SCL', num:10, type:'io', gpio:7},
  {id:'GP8', label:'GP8', func:'SPI1 RX  / I2C0 SDA', num:11, type:'io', gpio:8},
  {id:'GP9', label:'GP9', func:'SPI1 CSn / I2C0 SCL', num:12, type:'io', gpio:9},
  {id:'GND3',label:'GND', func:'Ground',               num:13, type:'gnd'},
  {id:'GP10',label:'GP10',func:'SPI1 SCK / I2C1 SDA', num:14, type:'io', gpio:10},
  {id:'GP11',label:'GP11',func:'SPI1 TX  / I2C1 SCL', num:15, type:'io', gpio:11},
  {id:'GP12',label:'GP12',func:'SPI1 RX  / I2C0 SDA', num:16, type:'io', gpio:12},
  {id:'GP13',label:'GP13',func:'SPI1 CSn / I2C0 SCL', num:17, type:'io', gpio:13},
  {id:'GND4',label:'GND', func:'Ground',               num:18, type:'gnd'},
  {id:'GP14',label:'GP14',func:'SPI1 SCK / I2C1 SDA', num:19, type:'io', gpio:14},
  {id:'GP15',label:'GP15',func:'SPI1 TX  / I2C1 SCL', num:20, type:'io', gpio:15},
];
const RIGHT_PINS = [
  {id:'VBUS',  label:'VBUS',   func:'USB 5V Power',         num:40, type:'pwr'},
  {id:'VSYS',  label:'VSYS',   func:'System Power (1.8–5V)',num:39, type:'pwr'},
  {id:'GND5',  label:'GND',    func:'Ground',               num:38, type:'gnd'},
  {id:'3V3EN', label:'3V3_EN', func:'3.3V Regulator Enable',num:37, type:'pwr'},
  {id:'3V3',   label:'3V3',    func:'3.3V Output (300mA)',  num:36, type:'pwr'},
  {id:'ADCREF',label:'ADCREF', func:'ADC Reference Voltage',num:35, type:'pwr'},
  {id:'GP28',  label:'GP28',   func:'ADC2',                 num:34, type:'adc', gpio:28},
  {id:'GP27',  label:'GP27',   func:'ADC1 / I2C1 SCL',      num:33, type:'adc', gpio:27},
  {id:'GP26',  label:'GP26',   func:'ADC0 / I2C1 SDA',      num:32, type:'adc', gpio:26},
  {id:'AGND',  label:'AGND',   func:'Analogue Ground',      num:31, type:'gnd'},
  {id:'RUN',   label:'RUN',    func:'Reset Pin (Low=Reset)', num:30, type:'io'},
  {id:'GP22',  label:'GP22',   func:'General Purpose I/O',  num:29, type:'io', gpio:22},
  {id:'GND6',  label:'GND',    func:'Ground',               num:28, type:'gnd'},
  {id:'GP21',  label:'GP21',   func:'I2C0 SCL',             num:27, type:'io', gpio:21},
  {id:'GP20',  label:'GP20',   func:'I2C0 SDA',             num:26, type:'io', gpio:20},
  {id:'GP19',  label:'GP19',   func:'SPI0 TX  / I2C1 SCL',  num:25, type:'io', gpio:19},
  {id:'GP18',  label:'GP18',   func:'SPI0 SCK / I2C1 SDA',  num:24, type:'io', gpio:18},
  {id:'GND7',  label:'GND',    func:'Ground',               num:23, type:'gnd'},
  {id:'GP17',  label:'GP17',   func:'UART0 RX / I2C0 SCL',  num:22, type:'io', gpio:17},
  {id:'GP16',  label:'GP16',   func:'UART0 TX / I2C0 SDA',  num:21, type:'io', gpio:16},
];
const ALL_PICO_PINS = [...LEFT_PINS, ...RIGHT_PINS];

// ── COMPONENT DEFINITIONS ────────────────────────────
// IMPORTANT: rx,ry are the EXACT pixel coords of pin circles relative to the component origin.
// The draw functions MUST draw pin leads ending at (rx, ry) and pin circles AT (rx, ry).
// This is the contract that makes wire connections accurate.
const COMP_DEFS = {
  led:          {label:'LED',              w:56,  h:80,  pins:[
    {id:'anode',  label:'A(+)', rx:16, ry:68, color:'#00aa44'},
    {id:'cathode',label:'K(−)', rx:40, ry:68, color:'#cc2222'},
  ]},
  button:       {label:'Button',           w:56,  h:66,  pins:[
    {id:'pin1',   label:'P1',   rx:10, ry:54, color:'#00aa44'},
    {id:'pin2',   label:'P2',   rx:46, ry:54, color:'#00aa44'},
  ]},
  buzzer:       {label:'Buzzer',           w:56,  h:74,  pins:[
    {id:'vcc',    label:'VCC',  rx:14, ry:62, color:'#cc2222'},
    {id:'io',     label:'I/O',  rx:42, ry:62, color:'#00aa44'},
  ]},
  dht22:        {label:'DHT22',            w:72,  h:92,  pins:[
    {id:'vcc',    label:'VCC',  rx:9,  ry:80, color:'#cc2222'},
    {id:'data',   label:'DATA', rx:27, ry:80, color:'#00aa44'},
    {id:'nc',     label:'NC',   rx:45, ry:80, color:'#555'},
    {id:'gnd',    label:'GND',  rx:63, ry:80, color:'#445566'},
  ]},
  hcsr04:       {label:'HC-SR04',          w:120, h:84,  pins:[
    {id:'vcc',    label:'VCC',  rx:14, ry:72, color:'#cc2222'},
    {id:'trig',   label:'TRIG', rx:40, ry:72, color:'#00aa44'},
    {id:'echo',   label:'ECHO', rx:66, ry:72, color:'#00aaff'},
    {id:'gnd',    label:'GND',  rx:92, ry:72, color:'#445566'},
  ]},
  servo:        {label:'SG90 Servo',       w:76,  h:86,  pins:[
    {id:'gnd',    label:'GND',  rx:10, ry:74, color:'#445566'},
    {id:'vcc',    label:'VCC',  rx:38, ry:74, color:'#cc2222'},
    {id:'sig',    label:'SIG',  rx:66, ry:74, color:'#ff9900'},
  ]},
  potentiometer:{label:'Potentiometer',    w:64,  h:86,  pins:[
    {id:'gnd',    label:'GND',  rx:10, ry:74, color:'#445566'},
    {id:'out',    label:'OUT',  rx:32, ry:74, color:'#ffbb44'},
    {id:'vcc',    label:'VCC',  rx:54, ry:74, color:'#cc2222'},
  ]},
  neopixel:     {label:'NeoPixel',         w:56,  h:78,  pins:[
    {id:'gnd',    label:'GND',  rx:8,  ry:66, color:'#445566'},
    {id:'vcc',    label:'VCC',  rx:28, ry:66, color:'#cc2222'},
    {id:'din',    label:'DIN',  rx:48, ry:66, color:'#ff44ff'},
  ]},
  lcd:          {label:'I2C LCD 16×2',     w:134, h:84,  pins:[
    {id:'gnd',    label:'GND',  rx:12, ry:72, color:'#445566'},
    {id:'vcc',    label:'VCC',  rx:36, ry:72, color:'#cc2222'},
    {id:'sda',    label:'SDA',  rx:62, ry:72, color:'#00aaff'},
    {id:'scl',    label:'SCL',  rx:88, ry:72, color:'#00ccff'},
  ]},
};

// ── STATE ────────────────────────────────────────────
let nid=1, comps={}, wires=[], selComp=null, selWire=null;
let wireMode=false, wireStart=null, wireColor='#00e87a';
let dragSt=null, panSt=null;
let pinStates={}, simRunning=false, simTimers=[];
let vZoom=1, vPanX=0, vPanY=0;
let editor, ctxCompId=null;

// ── SVG HELPERS ──────────────────────────────────────
const NS='http://www.w3.org/2000/svg';
function S(tag,a){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a||{}))e.setAttribute(k,v);return e;}
function ST(txt,a){const e=S('text',a);e.textContent=txt;return e;}

// Convert screen coords → SVG world coords (accounting for zoom+pan)
function toWorld(ex,ey){
  const r=document.getElementById('pg').getBoundingClientRect();
  return{x:(ex-r.left-vPanX)/vZoom,y:(ey-r.top-vPanY)/vZoom};
}

function applyVP(){
  document.getElementById('vp').setAttribute('transform',`translate(${vPanX},${vPanY}) scale(${vZoom})`);
  document.getElementById('zlvl').textContent=Math.round(vZoom*100)+'%';
}

function zoom(d){
  const pg=document.getElementById('pg'),r=pg.getBoundingClientRect();
  const cx=r.width/2,cy=r.height/2;
  const nz=Math.max(.3,Math.min(3,vZoom+d));
  vPanX=cx-(cx-vPanX)*(nz/vZoom);
  vPanY=cy-(cy-vPanY)*(nz/vZoom);
  vZoom=nz; applyVP();
}
function resetView(){vZoom=1;vPanX=0;vPanY=0;applyVP();}

document.getElementById('pg').addEventListener('wheel',e=>{
  e.preventDefault();
  const r=document.getElementById('pg').getBoundingClientRect();
  const mx=e.clientX-r.left,my=e.clientY-r.top,d=e.deltaY<0?.1:-.1;
  const nz=Math.max(.3,Math.min(3,vZoom+d));
  vPanX=mx-(mx-vPanX)*(nz/vZoom);
  vPanY=my-(my-vPanY)*(nz/vZoom);
  vZoom=nz;applyVP();
},{passive:false});

// Middle-mouse pan
document.getElementById('pg').addEventListener('mousedown',e=>{
  const panBgTarget=e.target.id==='pg'||e.target.id==='vp';
  const canPan=(e.button===1)||(e.button===0&&panBgTarget&&!wireMode);
  if(canPan){
    panSt={sx:e.clientX,sy:e.clientY,px:vPanX,py:vPanY};
    document.getElementById('pg').classList.add('panning');
    e.preventDefault();
  }
});

// ── PIN ABSOLUTE POSITION (world coords) ─────────────
function pinPos(compId,pinId){
  if(compId==='pico'){
    const li=LEFT_PINS.findIndex(p=>p.id===pinId);
    if(li>=0)return{x:PICO_X+LPX,y:PICO_Y+FIRST_Y+li*PIN_SPACING};
    const ri=RIGHT_PINS.findIndex(p=>p.id===pinId);
    if(ri>=0)return{x:PICO_X+RPX,y:PICO_Y+FIRST_Y+ri*PIN_SPACING};
  }
  const c=comps[compId];if(!c)return{x:0,y:0};
  const p=c.pins.find(p=>p.id===pinId);if(!p)return{x:0,y:0};
  return{x:c.x+p.rx,y:c.y+p.ry};
}

// ── WIRE PATH (smooth cubic bezier) ──────────────────
function wPath(x1,y1,x2,y2){
  const dx=Math.abs(x2-x1),dy=Math.abs(y2-y1);
  const cx=Math.max(dx*.45,Math.min(100,dx));
  const cy=dy*.05;
  const sx=Math.sign(x2-x1)||1;
  return`M${x1},${y1} C${x1+sx*cx},${y1+cy} ${x2-sx*cx},${y2-cy} ${x2},${y2}`;
}
function refreshWire(w){
  const a=pinPos(w.fc,w.fp),b=pinPos(w.tc,w.tp);
  w.el.setAttribute('d',wPath(a.x,a.y,b.x,b.y));
}

// ── SIMULATION HELPER: find GPIO connected to a pin ──
function wiredGPIO(compId,pinId){
  const w=wires.find(w=>(w.fc===compId&&w.fp===pinId)||(w.tc===compId&&w.tp===pinId));
  if(!w)return null;
  const pid=w.fc==='pico'?w.fp:w.tc==='pico'?w.tp:null;
  if(!pid)return null;
  const pp=ALL_PICO_PINS.find(p=>p.id===pid);
  return pp&&pp.gpio!==undefined?pp.gpio:null;
}
function isWired(compId,pinId){
  return wires.some(w=>(w.fc===compId&&w.fp===pinId)||(w.tc===compId&&w.tp===pinId));
}

// ── DRAW PICO ─────────────────────────────────────────
function drawPico(){
  const g=document.getElementById('pico-layer');
  g.innerHTML='';
  const pg=S('g',{transform:`translate(${PICO_X},${PICO_Y})`});

  // Shadow
  pg.appendChild(S('rect',{x:-3,y:-3,width:PW+6,height:PH+6,rx:7,fill:'rgba(0,0,0,.55)'}));
  // PCB body
  pg.appendChild(S('rect',{x:0,y:0,width:PW,height:PH,rx:5,fill:'#1a5c2a',stroke:'#2a8040','stroke-width':1.5}));
  // PCB trace lines
  for(let i=0;i<14;i++) pg.appendChild(S('line',{x1:0,y1:36+i*32,x2:PW,y2:36+i*32,stroke:'#1d6330','stroke-width':.35,opacity:.5}));

  // USB connector
  const usb=S('g');
  usb.appendChild(S('rect',{x:42,y:-20,width:76,height:24,rx:3,fill:'#c0b8a8',stroke:'#a0988a','stroke-width':1}));
  usb.appendChild(S('rect',{x:48,y:-16,width:64,height:16,rx:2,fill:'#1a1a1a'}));
  usb.appendChild(S('rect',{x:51,y:-13,width:58,height:10,rx:1,fill:'#0a0a12'}));
  usb.appendChild(ST('MICRO USB',{x:80,y:-5,'text-anchor':'middle',fill:'#444','font-size':5,'font-family':'monospace'}));
  pg.appendChild(usb);

  // Mounting holes
  [[5,5],[PW-5,5],[5,PH-5],[PW-5,PH-5]].forEach(([x,y])=>
    pg.appendChild(S('circle',{cx:x,cy:y,r:3.5,fill:'#0d3515',stroke:'#1a4a1e','stroke-width':1})));

  // RP2040 chip
  const cy2=Math.round(PH*.30);
  const chip=S('g');
  chip.appendChild(S('rect',{x:32,y:cy2,width:96,height:96,rx:3,fill:'#0c0c0c',stroke:'#222','stroke-width':1}));
  chip.appendChild(S('circle',{cx:36,cy:cy2+5,r:2.5,fill:'#444'}));
  for(let i=0;i<10;i++){
    chip.appendChild(S('rect',{x:32+i*9.6-1,y:cy2-4,width:3,height:5,fill:'#888'}));
    chip.appendChild(S('rect',{x:32+i*9.6-1,y:cy2+96,width:3,height:5,fill:'#888'}));
    chip.appendChild(S('rect',{x:28,y:cy2+i*9.6-1,width:4,height:3,fill:'#888'}));
    chip.appendChild(S('rect',{x:128,y:cy2+i*9.6-1,width:4,height:3,fill:'#888'}));
  }
  chip.appendChild(ST('RP2040',{x:80,y:cy2+50,'text-anchor':'middle',fill:'#666','font-size':13,'font-family':'JetBrains Mono,monospace','font-weight':'700'}));
  chip.appendChild(ST('Raspberry Pi',{x:80,y:cy2+65,'text-anchor':'middle',fill:'#3a3a3a','font-size':8,'font-family':'monospace'}));
  pg.appendChild(chip);

  // Flash chip
  const fy=Math.round(PH*.61);
  pg.appendChild(S('rect',{x:44,y:fy,width:42,height:22,rx:2,fill:'#0c0c0c',stroke:'#222','stroke-width':1}));
  pg.appendChild(ST('W25Q16',{x:65,y:fy+14,'text-anchor':'middle',fill:'#444','font-size':7,'font-family':'monospace'}));

  // Crystal
  pg.appendChild(S('rect',{x:PW-22,y:68,width:13,height:30,rx:3,fill:'#999',stroke:'#777','stroke-width':.5}));
  pg.appendChild(S('rect',{x:PW-20,y:70,width:9,height:26,rx:2,fill:'#bbb'}));

  // BOOTSEL button
  const by=Math.round(PH*.76);
  pg.appendChild(S('rect',{x:PW-44,y:by,width:30,height:16,rx:3,fill:'#eee',stroke:'#ccc','stroke-width':1}));
  pg.appendChild(S('rect',{x:PW-40,y:by+4,width:22,height:8,rx:2,fill:'#ddd'}));
  pg.appendChild(ST('BOOTSEL',{x:PW-29,y:by+29,'text-anchor':'middle',fill:'#3a6a3a','font-size':7,'font-family':'monospace'}));

  // Built-in LED (GP25)
  const bled=S('circle',{cx:PW-14,cy:by-16,r:5.5,fill:'#003300',stroke:'#005500','stroke-width':1,id:'bi-led'});
  pg.appendChild(bled);
  pg.appendChild(ST('LED',{x:PW-14,y:by-1,'text-anchor':'middle',fill:'#3a6a3a','font-size':6.5,'font-family':'monospace'}));

  // SWD pads
  const sy=PH-18;
  [[PW/2-10,sy],[PW/2,sy],[PW/2+10,sy]].forEach(([x,y])=>
    pg.appendChild(S('rect',{x:x-4,y:y-4,width:8,height:9,rx:1,fill:'#c8a020',stroke:'#a08010','stroke-width':.5})));
  pg.appendChild(ST('SWD',{x:PW/2,y:sy+13,'text-anchor':'middle',fill:'#3a6a3a','font-size':6.5,'font-family':'monospace'}));

  // PCB label
  pg.appendChild(ST('Raspberry Pi Pico',{x:PW/2,y:PH-30,'text-anchor':'middle',fill:'#2a6040','font-size':9,'font-family':'JetBrains Mono,monospace','font-weight':'700'}));

  // ── LEFT PINS ──
  LEFT_PINS.forEach((pin,i)=>{
    const y=FIRST_Y+i*PIN_SPACING;
    const isG=pin.type==='gnd',isP=pin.type==='pwr';
    const tc=isG?'#778899':isP?'#ee5555':'#88ddaa';
    const pc=isG?'#445566':isP?'#cc2222':'#00aa44';
    pg.appendChild(S('rect',{x:0,y:y-4,width:20,height:8,fill:'#c8a020',stroke:'#a08010','stroke-width':.5}));
    pg.appendChild(S('line',{x1:0,y1:y,x2:LPX-1,y2:y,stroke:'#c8a020','stroke-width':2}));
    // Label inside PCB — large and legible
    pg.appendChild(ST(pin.label,{x:24,y:y+4.5,fill:tc,'font-size':8.5,'font-family':'JetBrains Mono,monospace','font-weight':'600'}));
    // Pin number (small, near pad)
    pg.appendChild(ST(pin.num,{x:10,y:y+3.5,'text-anchor':'middle',fill:'rgba(200,160,32,.7)','font-size':5.5,'font-family':'monospace'}));
    // Pin circle
    const circle=S('circle',{cx:LPX,cy:y,r:5,fill:pc,stroke:'rgba(255,255,255,.45)','stroke-width':.7,
      class:'pdot','data-cid':'pico','data-pid':pin.id,id:`pp-${pin.id}`});
    addPinHover(circle,pin);
    pg.appendChild(circle);
  });

  // ── RIGHT PINS ──
  RIGHT_PINS.forEach((pin,i)=>{
    const y=FIRST_Y+i*PIN_SPACING;
    const isG=pin.type==='gnd',isP=pin.type==='pwr',isA=pin.type==='adc';
    const tc=isG?'#778899':isP?'#ee5555':isA?'#55aaff':'#88ddaa';
    const pc=isG?'#445566':isP?'#cc2222':isA?'#0077cc':'#00aa44';
    pg.appendChild(S('rect',{x:PW-20,y:y-4,width:20,height:8,fill:'#c8a020',stroke:'#a08010','stroke-width':.5}));
    pg.appendChild(S('line',{x1:PW,y1:y,x2:RPX+1,y2:y,stroke:'#c8a020','stroke-width':2}));
    pg.appendChild(ST(pin.label,{x:PW-24,y:y+4.5,'text-anchor':'end',fill:tc,'font-size':8.5,'font-family':'JetBrains Mono,monospace','font-weight':'600'}));
    pg.appendChild(ST(pin.num,{x:PW-10,y:y+3.5,'text-anchor':'middle',fill:'rgba(200,160,32,.7)','font-size':5.5,'font-family':'monospace'}));
    const circle=S('circle',{cx:RPX,cy:y,r:5,fill:pc,stroke:'rgba(255,255,255,.45)','stroke-width':.7,
      class:'pdot','data-cid':'pico','data-pid':pin.id,id:`pp-${pin.id}`});
    addPinHover(circle,pin);
    pg.appendChild(circle);
  });

  g.appendChild(pg);
}

function addPinHover(el,pin){
  el.addEventListener('mouseenter',e=>{
    const t={io:'Digital I/O',pwr:'Power',gnd:'Ground',adc:'Analog / ADC'};
    document.getElementById('pt1').textContent=`${pin.label}  ·  Pin ${pin.num}`;
    document.getElementById('pt2').textContent=`${t[pin.type]||pin.type}${pin.gpio!==undefined?' · GPIO '+pin.gpio:''}  ${pin.func?'· '+pin.func:''}`;
    document.getElementById('ptt').style.display='block';
    showSnap('pico',pin.id);
  });
  el.addEventListener('mousemove',e=>{
    const tt=document.getElementById('ptt');
    tt.style.left=(e.clientX+14)+'px';
    tt.style.top=(e.clientY-42)+'px';
  });
  el.addEventListener('mouseleave',()=>{document.getElementById('ptt').style.display='none';hideSnap();});
  el.addEventListener('click',onPinClick);
}

function showSnap(cid,pid){
  const p=pinPos(cid,pid),si=document.getElementById('snap');
  si.setAttribute('cx',p.x);si.setAttribute('cy',p.y);si.setAttribute('opacity','1');
}
function hideSnap(){document.getElementById('snap').setAttribute('opacity','0');}

// ── PIN CLICK (wire drawing) ──────────────────────────
function onPinClick(e){
  e.stopPropagation();
  const cid=e.currentTarget.dataset.cid,pid=e.currentTarget.dataset.pid;
  const abs=pinPos(cid,pid);
  if(!wireMode){
    wireMode=true;
    wireStart={cid,pid,ax:abs.x,ay:abs.y};
    document.getElementById('pg').classList.add('wmode');
    document.getElementById('imode').innerHTML='Mode: <b>Wire Drawing</b>';
    document.getElementById('twire').setAttribute('opacity','1');
    document.getElementById('twire').style.stroke=wireColor;
    document.getElementById('hint').classList.add('vis');
  } else {
    if(wireStart.cid===cid&&wireStart.pid===pid){cancelWire();return;}
    const dup=wires.find(w=>(w.fc===wireStart.cid&&w.fp===wireStart.pid&&w.tc===cid&&w.tp===pid)||(w.tc===wireStart.cid&&w.tp===wireStart.pid&&w.fc===cid&&w.fp===pid));
    if(dup){clog('⚠ Already connected','warn');cancelWire();return;}
    const p2=pinPos(cid,pid);
    const wid='w'+(nid++);
    const path=S('path',{class:'wire',stroke:wireColor,d:wPath(wireStart.ax,wireStart.ay,p2.x,p2.y),id:wid,'data-wid':wid});
    path.addEventListener('click',onWireClick);
    path.addEventListener('contextmenu',e=>{e.preventDefault();selWireF(wid);ctxCompId=null;showCtx(e);});
    document.getElementById('wires-layer').appendChild(path);
    wires.push({id:wid,fc:wireStart.cid,fp:wireStart.pid,tc:cid,tp:pid,color:wireColor,el:path});
    updateInfo();
    clog(`✓ Wired ${wireStart.cid}:${wireStart.pid} → ${cid}:${pid}`,'info');
    cancelWire();
    markWiredPins();
  }
}
function cancelWire(){
  wireMode=false;wireStart=null;
  document.getElementById('pg').classList.remove('wmode');
  document.getElementById('twire').setAttribute('opacity','0');
  document.getElementById('twire').setAttribute('d','');
  document.getElementById('imode').innerHTML='Mode: <b>Select</b>';
  document.getElementById('hint').classList.remove('vis');
}
function onWireClick(e){e.stopPropagation();if(wireMode)return;selWireF(e.currentTarget.dataset.wid);}
function selWireF(wid){
  deselectAll();selWire=wid;
  const w=wires.find(x=>x.id===wid);
  if(w){w.el.classList.add('sel');w.el.style.filter=`drop-shadow(0 0 5px ${w.color})`;document.getElementById('isel').innerHTML=`Selected: <b>Wire</b>`;}
}

// ── COMPONENT DRAW FUNCTIONS ──────────────────────────
// Pattern for ALL draw functions:
//   1. Draw body/visuals
//   2. Draw pin leads (line from body edge to pin.ry)
//   3. Draw pin labels
//   4. Call addDrag()        ← DRAG HANDLE FIRST (below in z-order)
//   5. Call addPins()        ← PIN CIRCLES LAST (on top, receive clicks first)
//   6. Add interactive overlays that DON'T overlap pin circles

function drawLED(g,comp){
  const on=comp.state,col=comp.ledColor||'y';
  const cs={
    y:{f:on?'url(#lg-y)':'#3a3410',s:on?'#ffd060':'#5a5020',gl:'fg-y',ga:'rgba(255,200,0,.18)'},
    r:{f:on?'url(#lg-r)':'#3a1010',s:on?'#ff3355':'#5a2020',gl:'fg-r',ga:'rgba(255,50,80,.18)'},
    g:{f:on?'url(#lg-g)':'#0a2a14',s:on?'#00e87a':'#1a5a2a',gl:'fg-g',ga:'rgba(0,200,100,.18)'},
    b:{f:on?'url(#lg-b)':'#101a3a',s:on?'#00aaff':'#204070',gl:'fg-b',ga:'rgba(0,150,255,.18)'},
    w:{f:on?'url(#lg-w)':'#2a2a2a',s:on?'#ffffff':'#666',gl:'fg-g',ga:'rgba(255,255,255,.15)'},
  };
  const c=cs[col]||cs.y;
  // Glow aura
  if(on)g.appendChild(S('ellipse',{cx:28,cy:26,rx:22,ry:26,fill:c.ga,filter:`url(#${c.gl})`}));
  // Body base
  g.appendChild(S('rect',{x:16,y:30,width:24,height:14,rx:2,fill:'#2a2a2a',stroke:'#444','stroke-width':1}));
  // Dome
  g.appendChild(S('ellipse',{cx:28,cy:28,rx:14,ry:18,fill:c.f,stroke:c.s,'stroke-width':2,...(on?{filter:`url(#${c.gl})`}:{})}));
  g.appendChild(S('line',{x1:14,y1:30,x2:42,y2:30,stroke:c.s,'stroke-width':1}));
  // State indicator
  g.appendChild(ST(on?'●':'○',{x:28,y:-5,'text-anchor':'middle',fill:on?c.s:'#444','font-size':11}));
  g.appendChild(ST('LED',{x:28,y:-16,'text-anchor':'middle',fill:'#6a8aaa','font-size':9,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Lead wires: from body (y=44) to pin circles (y=68)
  g.appendChild(S('line',{x1:16,y1:44,x2:16,y2:68,stroke:'#bbb','stroke-width':1.5}));
  g.appendChild(S('line',{x1:40,y1:44,x2:40,y2:68,stroke:'#bbb','stroke-width':1.5}));
  // Pin labels
  g.appendChild(ST('A',{x:16,y:80,'text-anchor':'middle',fill:'#3a7a3a','font-size':9,'font-family':'monospace'}));
  g.appendChild(ST('K',{x:40,y:80,'text-anchor':'middle',fill:'#7a3a3a','font-size':9,'font-family':'monospace'}));
  // Color chooser dots (above component)
  ['y','r','g','b','w'].forEach((c2,i)=>{
    const cv={y:'#ffd060',r:'#ff3355',g:'#00e87a',b:'#00aaff',w:'#ffffff'}[c2];
    const dot=S('circle',{cx:i*11+3,cy:-22,r:4.5,fill:cv,stroke:comp.ledColor===c2?'#fff':'transparent','stroke-width':1.8,cursor:'pointer'});
    dot.addEventListener('click',e=>{e.stopPropagation();comp.ledColor=c2;renderComp(comp);});
    g.appendChild(dot);
  });
  addDrag(g,comp,-6,-28,68,100); // ← DRAG BEFORE PINS
  addPins(g,comp);                // ← PINS ON TOP
}

function drawButton(g,comp){
  const on=comp.state;
  // PCB
  g.appendChild(S('rect',{x:2,y:8,width:52,height:42,rx:4,fill:'#1a2030',stroke:'#2a3a50','stroke-width':1.5}));
  // Button shadow (3D)
  if(!on)g.appendChild(S('rect',{x:10,y:36,width:36,height:6,rx:3,fill:'#441166'}));
  // Button cap (y=14 → y=36 when up, y=16 → y=38 when pressed)
  const by=on?16:14;
  const bh=on?24:24;
  g.appendChild(S('rect',{x:10,y:by,width:36,height:bh,rx:5,fill:on?'#9933cc':'#cc66ff',stroke:on?'#7711aa':'#aa44dd','stroke-width':1.5,...(on?{filter:'url(#fg-p)'}:{})}));
  g.appendChild(ST(on?'PRESSED':'PUSH',{x:28,y:by+15,'text-anchor':'middle',fill:'#fff','font-size':7.5,'font-family':'monospace','font-weight':'700'}));
  g.appendChild(ST('BUTTON',{x:28,y:4,'text-anchor':'middle',fill:'#6a8aaa','font-size':9,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Lead lines: from PCB bottom (y=50) to pin circles (y=54)
  g.appendChild(S('line',{x1:10,y1:50,x2:10,y2:54,stroke:'#bbb','stroke-width':1.5}));
  g.appendChild(S('line',{x1:46,y1:50,x2:46,y2:54,stroke:'#bbb','stroke-width':1.5}));
  g.appendChild(ST('P1',{x:10,y:66,'text-anchor':'middle',fill:'#5a8a5a','font-size':7,'font-family':'monospace'}));
  g.appendChild(ST('P2',{x:46,y:66,'text-anchor':'middle',fill:'#5a8a5a','font-size':7,'font-family':'monospace'}));

  addDrag(g,comp,-4,-28,64,80); // drag first
  addPins(g,comp);               // pins on top

  // Clickable button cap overlay (y range 14-40 — does NOT overlap pins at y=54)
  const cap=S('rect',{x:10,y:14,width:36,height:36,rx:5,fill:'transparent',cursor:'pointer'});
  cap.addEventListener('click',e=>{
    e.stopPropagation();
    if(!simRunning){clog('▶ Start simulation first','warn');return;}
    comp.state=!comp.state;
    const gpio=wiredGPIO(comp.id,'pin1')??wiredGPIO(comp.id,'pin2');
    if(gpio!==null){
      pinStates[gpio]=comp.state?1:0;
      clog(`  Button GP${gpio}: ${comp.state?'HIGH ↑':'LOW ↓'}`,'info');
      // Trigger LED or buzzer connected to same line
      triggerPinChange(gpio);
    }
    renderComp(comp);
  });
  g.appendChild(cap);
}

function drawBuzzer(g,comp){
  const on=comp.state;
  g.appendChild(S('rect',{x:6,y:8,width:44,height:46,rx:22,fill:'#1a1a1a',stroke:'#333','stroke-width':1.5}));
  g.appendChild(S('ellipse',{cx:28,cy:8,rx:22,ry:8,fill:'#2a2a2a',stroke:'#444','stroke-width':1.5}));
  for(let i=0;i<4;i++)g.appendChild(S('ellipse',{cx:28,cy:8,rx:4+i*4,ry:2+i*2,fill:'none',stroke:'#3a3a3a','stroke-width':.5}));
  if(on){
    g.appendChild(S('ellipse',{cx:28,cy:8,rx:28,ry:16,fill:'rgba(255,80,160,.1)',filter:'url(#fg-r)'}));
    [1,2,3].forEach(n=>{
      const r2=S('ellipse',{cx:28,cy:8,rx:22+n*6,ry:12+n*4,fill:'none',stroke:'rgba(255,100,180,.35)','stroke-width':1});
      r2.innerHTML=`<animate attributeName="rx" from="22" to="48" dur="${.5+n*.2}s" repeatCount="indefinite"/>
        <animate attributeName="ry" from="12" to="28" dur="${.5+n*.2}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from=".6" to="0" dur="${.5+n*.2}s" repeatCount="indefinite"/>`;
      g.appendChild(r2);
    });
  }
  g.appendChild(ST(on?'♪♫':'BUZZ',{x:28,y:-5,'text-anchor':'middle',fill:on?'#ff88cc':'#888','font-size':on?13:8,'font-family':'monospace'}));
  g.appendChild(ST('BUZZER',{x:28,y:-16,'text-anchor':'middle',fill:'#6a8aaa','font-size':9,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Leads: body bottom y=54, leads to y=62
  g.appendChild(S('line',{x1:14,y1:54,x2:14,y2:62,stroke:'#bbb','stroke-width':1.5}));
  g.appendChild(S('line',{x1:42,y1:54,x2:42,y2:62,stroke:'#bbb','stroke-width':1.5}));
  g.appendChild(ST('VCC',{x:14,y:74,'text-anchor':'middle',fill:'#7a3a3a','font-size':7,'font-family':'monospace'}));
  g.appendChild(ST('I/O',{x:42,y:74,'text-anchor':'middle',fill:'#3a7a3a','font-size':7,'font-family':'monospace'}));
  addDrag(g,comp,-4,-28,64,88);
  addPins(g,comp);
}

function drawDHT22(g,comp){
  const W=72,H=62;
  // PCB body (y:8 to y:70 = H+8)
  g.appendChild(S('rect',{x:0,y:8,width:W,height:H,rx:3,fill:'#1a2070',stroke:'#2a3a99','stroke-width':1.5}));
  g.appendChild(S('rect',{x:8,y:14,width:56,height:46,rx:2,fill:'#111a6a',stroke:'#1a2888','stroke-width':1}));
  for(let i=0;i<7;i++){
    g.appendChild(S('line',{x1:8,y1:14+i*7,x2:64,y2:14+i*7,stroke:'#1a2888','stroke-width':.4,opacity:.6}));
    g.appendChild(S('line',{x1:8+i*8,y1:14,x2:8+i*8,y2:60,stroke:'#1a2888','stroke-width':.4,opacity:.6}));
  }
  g.appendChild(ST('DHT22',{x:36,y:37,'text-anchor':'middle',fill:'#aabbff','font-size':12,'font-family':'JetBrains Mono,monospace','font-weight':'700'}));
  g.appendChild(ST('AM2302',{x:36,y:50,'text-anchor':'middle',fill:'#5566bb','font-size':8,'font-family':'monospace'}));
  g.appendChild(ST('DHT22',{x:36,y:-2,'text-anchor':'middle',fill:'#6a8aaa','font-size':9,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Leads: from y=70 to pin ry=80
  comp.pins.forEach(p=>{
    g.appendChild(S('line',{x1:p.rx,y1:70,x2:p.rx,y2:80,stroke:'#ccc','stroke-width':1.5}));
    g.appendChild(ST(p.label,{x:p.rx,y:92,'text-anchor':'middle',fill:'#5a7a9a','font-size':7,'font-family':'monospace'}));
  });
  // Live data overlay
  if(comp.state){
    const v=S('g');
    v.appendChild(S('rect',{x:-2,y:-60,width:76,height:46,rx:4,fill:'rgba(0,0,0,.88)',stroke:'rgba(0,170,255,.5)','stroke-width':1}));
    v.appendChild(ST(`🌡 ${comp.value.temp.toFixed(1)}°C`,{x:36,y:-40,'text-anchor':'middle',fill:'#ff9900','font-size':11,'font-family':'JetBrains Mono,monospace'}));
    v.appendChild(ST(`💧 ${comp.value.hum.toFixed(1)} %`,{x:36,y:-24,'text-anchor':'middle',fill:'#00aaff','font-size':11,'font-family':'JetBrains Mono,monospace'}));
    g.appendChild(v);
  }
  addDrag(g,comp,-3,-14,78,106);
  addPins(g,comp);
}

function drawHCSR04(g,comp){
  const W=120,H=58;
  // PCB: y=4 to y=62
  g.appendChild(S('rect',{x:0,y:4,width:W,height:H,rx:3,fill:'#1a2a1a',stroke:'#2a4a2a','stroke-width':1.5}));
  // Transducers
  [[24,33],[96,33]].forEach(([cx,cy])=>{
    g.appendChild(S('circle',{cx,cy,r:22,fill:'#888',stroke:'#666','stroke-width':1.5}));
    g.appendChild(S('circle',{cx,cy,r:18,fill:'#c0c0c0',stroke:'#aaa','stroke-width':1}));
    g.appendChild(S('circle',{cx,cy,r:11,fill:'#e0e0e0',stroke:'#bbb','stroke-width':.5}));
    g.appendChild(S('circle',{cx,cy,r:5,fill:'#ccc'}));
    for(let a=0;a<6;a++){const rad=a*60*Math.PI/180;g.appendChild(S('line',{x1:cx+Math.cos(rad)*5,y1:cy+Math.sin(rad)*5,x2:cx+Math.cos(rad)*18,y2:cy+Math.sin(rad)*18,stroke:'#bbb','stroke-width':.5,opacity:.5}));}
  });
  g.appendChild(S('rect',{x:57,y:16,width:16,height:16,rx:1,fill:'#0c0c0c',stroke:'#222','stroke-width':.5}));
  g.appendChild(ST('T',{x:24,y:37,'text-anchor':'middle',fill:'#333','font-size':11,'font-family':'monospace','font-weight':'700'}));
  g.appendChild(ST('R',{x:96,y:37,'text-anchor':'middle',fill:'#333','font-size':11,'font-family':'monospace','font-weight':'700'}));
  g.appendChild(ST('HC-SR04',{x:60,y:0,'text-anchor':'middle',fill:'#6a8aaa','font-size':9,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Sound rings when active
  if(comp.state){
    [1,2,3].forEach(n=>{
      const r2=S('circle',{cx:24,cy:33,r:22+n*7,fill:'none',stroke:'rgba(255,200,0,.35)','stroke-width':1});
      r2.innerHTML=`<animate attributeName="r" from="22" to="56" dur="${.7+n*.2}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from=".6" to="0" dur="${.7+n*.2}s" repeatCount="indefinite"/>`;
      g.appendChild(r2);
    });
  }
  // Leads: from y=62 to pin ry=72
  comp.pins.forEach(p=>{
    g.appendChild(S('line',{x1:p.rx,y1:62,x2:p.rx,y2:72,stroke:'#ccc','stroke-width':1.5}));
    g.appendChild(ST(p.label,{x:p.rx,y:84,'text-anchor':'middle',fill:'#5a7a9a','font-size':7,'font-family':'monospace'}));
  });
  // Distance readout
  if(comp.state){
    const v=S('g');
    v.appendChild(S('rect',{x:24,y:-42,width:72,height:30,rx:4,fill:'rgba(0,0,0,.88)',stroke:'rgba(255,180,0,.5)','stroke-width':1}));
    v.appendChild(ST(`📡 ${comp.value.dist.toFixed(1)} cm`,{x:60,y:-22,'text-anchor':'middle',fill:'#ffcc00','font-size':13,'font-family':'JetBrains Mono,monospace'}));
    g.appendChild(v);
  }
  addDrag(g,comp,-3,-12,126,98);
  addPins(g,comp);
}

function drawServo(g,comp){
  const on=comp.state,ang=(comp.value&&comp.value.angle)||90;
  // Body: y=8 to y=64
  g.appendChild(S('rect',{x:0,y:8,width:76,height:56,rx:4,fill:'#222',stroke:'#333','stroke-width':1.5}));
  // Motor can (circle on left)
  g.appendChild(S('ellipse',{cx:22,cy:36,rx:20,ry:24,fill:'#2a2a2a',stroke:'#3a3a3a','stroke-width':1}));
  g.appendChild(S('circle',{cx:22,cy:36,r:9,fill:'#444',stroke:'#555','stroke-width':1}));
  // Horn
  const rad=(ang-90)*Math.PI/180;
  const hx=22+Math.cos(rad)*18,hy=36+Math.sin(rad)*18;
  g.appendChild(S('line',{x1:22,y1:36,x2:hx,y2:hy,stroke:on?'#00e87a':'#555','stroke-width':3.5,'stroke-linecap':'round',...(on?{filter:'url(#fg-g)'}:{})}));
  g.appendChild(S('circle',{cx:hx,cy:hy,r:4,fill:on?'#00e87a':'#555',...(on?{filter:'url(#fg-g)'}:{})}));
  // Label panel
  g.appendChild(S('rect',{x:48,y:16,width:24,height:28,rx:2,fill:'#111',stroke:'#222','stroke-width':.5}));
  g.appendChild(ST(on?`${Math.round(ang)}°`:'SG90',{x:60,y:33,'text-anchor':'middle',fill:on?'#00e87a':'#555','font-size':on?11:8,'font-family':'JetBrains Mono,monospace','font-weight':'700'}));
  g.appendChild(ST('SERVO',{x:38,y:-3,'text-anchor':'middle',fill:'#6a8aaa','font-size':9,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Leads: from y=64 to pin ry=74
  comp.pins.forEach(p=>{
    g.appendChild(S('line',{x1:p.rx,y1:64,x2:p.rx,y2:74,stroke:'#ccc','stroke-width':1.5}));
    g.appendChild(ST(p.label,{x:p.rx,y:86,'text-anchor':'middle',fill:'#5a7a9a','font-size':7,'font-family':'monospace'}));
  });
  addDrag(g,comp,-3,-14,82,100);
  addPins(g,comp);
}

function drawPot(g,comp){
  const on=comp.state,val=(comp.value&&comp.value.val)||512;
  const pct=val/1023;
  // Body: y=8 to y=64, round shape
  g.appendChild(S('rect',{x:0,y:8,width:64,height:56,rx:28,fill:'#222',stroke:'#444','stroke-width':2}));
  // Track arc
  const cx2=32,cy2=36,R=18;
  const sa=(-210)*Math.PI/180,ea=(-210+pct*300)*Math.PI/180;
  const sx=cx2+R*Math.cos(sa),sy=cy2+R*Math.sin(sa),ex=cx2+R*Math.cos(ea),ey=cy2+R*Math.sin(ea);
  const la=pct*300>180?1:0;
  // bg track
  g.appendChild(S('path',{d:`M${cx2+R*Math.cos((-210)*Math.PI/180)},${cy2+R*Math.sin((-210)*Math.PI/180)} A${R},${R},0,1,1,${cx2+R*Math.cos(90*Math.PI/180)},${cy2+R*Math.sin(90*Math.PI/180)}`,fill:'none',stroke:'#333','stroke-width':4}));
  // active track
  if(pct>0.01)g.appendChild(S('path',{d:`M${sx},${sy} A${R},${R},0,${la},1,${ex},${ey}`,fill:'none',stroke:on?'#ffbb44':'#555','stroke-width':4,'stroke-linecap':'round',...(on?{filter:'url(#fg-y)'}:{})}));
  // Knob
  g.appendChild(S('circle',{cx:cx2,cy:cy2,r:7,fill:'#333',stroke:'#555','stroke-width':1.5}));
  g.appendChild(S('circle',{cx:ex,cy:ey,r:3,fill:on?'#ffbb44':'#666'}));
  g.appendChild(ST('POT',{x:cx2,y:-4,'text-anchor':'middle',fill:'#6a8aaa','font-size':9,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Value overlay
  if(on){
    const v=S('g');
    v.appendChild(S('rect',{x:-2,y:-50,width:68,height:32,rx:4,fill:'rgba(0,0,0,.88)',stroke:'rgba(255,187,68,.4)','stroke-width':1}));
    v.appendChild(ST(`ADC: ${val}`,{x:32,y:-34,'text-anchor':'middle',fill:'#ffbb44','font-size':10,'font-family':'JetBrains Mono,monospace'}));
    v.appendChild(ST(`${(val/1023*3.3).toFixed(2)} V`,{x:32,y:-21,'text-anchor':'middle',fill:'#ffdd88','font-size':9,'font-family':'JetBrains Mono,monospace'}));
    g.appendChild(v);
  }
  // Leads: from y=64 to pin ry=74
  comp.pins.forEach(p=>{
    g.appendChild(S('line',{x1:p.rx,y1:64,x2:p.rx,y2:74,stroke:'#ccc','stroke-width':1.5}));
    g.appendChild(ST(p.label,{x:p.rx,y:86,'text-anchor':'middle',fill:'#5a7a9a','font-size':7,'font-family':'monospace'}));
  });
  addDrag(g,comp,-3,-14,70,100);
  addPins(g,comp);
  // Scroll wheel overlay (y=8-64, does NOT overlap pins at y=74)
  const wheel=S('rect',{x:0,y:8,width:64,height:56,rx:28,fill:'transparent',cursor:'ns-resize'});
  wheel.addEventListener('wheel',e=>{
    e.stopPropagation();e.preventDefault();
    comp.value.val=Math.max(0,Math.min(1023,(comp.value.val||512)+(e.deltaY<0?20:-20)));
    renderComp(comp);
    // Sync panel slider
    const sl=document.getElementById(`sp-slider-${comp.id}-val`);
    const lb=document.getElementById(`sp-${comp.id}-val`);
    if(sl)sl.value=comp.value.val;
    if(lb)lb.textContent=Math.round(comp.value.val)+' · '+(comp.value.val/1023*3.3).toFixed(2)+'V';
    if(simRunning){
      const gpio=wiredGPIO(comp.id,'out');
      if(gpio!==null)clog(`  Pot ADC GP${gpio}: ${comp.value.val} (${(comp.value.val/1023*3.3).toFixed(2)}V)`,'info');
    }
  });
  g.appendChild(wheel);
}

function drawNeoPixel(g,comp){
  const on=comp.state,r=(comp.value||{}).r||0,gr=(comp.value||{}).g||0,b=(comp.value||{}).b||0;
  const hex=on?`rgb(${r},${gr},${b})`:'#1a1a1a';
  // Glow
  if(on&&(r||gr||b))g.appendChild(S('circle',{cx:28,cy:30,r:28,fill:`rgba(${r},${gr},${b},.18)`,filter:'url(#fg-p)'}));
  // Body: y=6 to y=58
  g.appendChild(S('rect',{x:6,y:6,width:44,height:52,rx:4,fill:'#111',stroke:'#333','stroke-width':1.5}));
  g.appendChild(S('rect',{x:12,y:12,width:32,height:32,rx:3,fill:hex,stroke:on?hex:'#222','stroke-width':1,...(on&&(r||gr||b)?{filter:'url(#fg-p)'}:{})}));
  if(on)[ [`R:${r}`,-1],[ `G:${gr}`,0],[`B:${b}`,1]].forEach(([t,off])=>
    g.appendChild(ST(t,{x:28,y:24+off*11,'text-anchor':'middle',fill:'rgba(255,255,255,.9)','font-size':7,'font-family':'monospace'})));
  g.appendChild(ST('NEOPIXEL',{x:28,y:-3,'text-anchor':'middle',fill:'#6a8aaa','font-size':8,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Leads: from y=58 to pin ry=66
  comp.pins.forEach(p=>{
    g.appendChild(S('line',{x1:p.rx,y1:58,x2:p.rx,y2:66,stroke:'#ccc','stroke-width':1.5}));
    g.appendChild(ST(p.label,{x:p.rx,y:78,'text-anchor':'middle',fill:'#5a7a9a','font-size':7,'font-family':'monospace'}));
  });
  addDrag(g,comp,-3,-14,62,92);
  addPins(g,comp);
}

function drawLCD(g,comp){
  const on=comp.state,txt=(comp.value||{}).text||'LCD Ready',l2=(comp.value||{}).line2||'';
  // Frame: y=8 to y=64
  g.appendChild(S('rect',{x:0,y:8,width:134,height:56,rx:3,fill:'#1a2030',stroke:'#2a3a50','stroke-width':1.5}));
  // Screen bezel
  g.appendChild(S('rect',{x:6,y:13,width:122,height:44,rx:2,fill:on?'#143a14':'#0a1a0a',stroke:on?'#1e5a1e':'#162016','stroke-width':1}));
  if(on){
    // Pixel rows
    const r1=txt.substring(0,16).padEnd(16,' '),r2=l2.substring(0,16).padEnd(16,' ');
    g.appendChild(ST(r1,{x:12,y:30,'font-size':8.5,'font-family':'JetBrains Mono,monospace',fill:'#00ee44','letter-spacing':'2.2px'}));
    g.appendChild(ST(r2,{x:12,y:49,'font-size':8.5,'font-family':'JetBrains Mono,monospace',fill:'#00aa33','letter-spacing':'2.2px'}));
    // Blinking cursor
    const cur=S('rect',{x:12+r1.trimEnd().length*10.7,y:33,width:8,height:2,fill:'#00ee44'});
    cur.innerHTML='<animate attributeName="opacity" from="1" to="0" dur=".7s" repeatCount="indefinite"/>';
    g.appendChild(cur);
  } else {
    // Show empty cell grid
    for(let row=0;row<2;row++) for(let c=0;c<16;c++)
      g.appendChild(S('rect',{x:8+c*7.5,y:15+row*22,width:6,height:18,rx:1,fill:'#0c1c0c',stroke:'#102010','stroke-width':.3}));
  }
  g.appendChild(ST('I2C LCD 16×2',{x:67,y:-3,'text-anchor':'middle',fill:'#6a8aaa','font-size':9,'font-family':'Rajdhani,sans-serif','font-weight':'600'}));
  // Leads: from y=64 to pin ry=72
  comp.pins.forEach(p=>{
    g.appendChild(S('line',{x1:p.rx,y1:64,x2:p.rx,y2:72,stroke:'#ccc','stroke-width':1.5}));
    g.appendChild(ST(p.label,{x:p.rx,y:84,'text-anchor':'middle',fill:'#5a7a9a','font-size':7,'font-family':'monospace'}));
  });
  addDrag(g,comp,-3,-14,140,98);
  addPins(g,comp);
}

// ── DRAG HANDLE (must be called BEFORE addPins) ───────
function addDrag(g,comp,x,y,w,h){
  const dh=S('rect',{x,y,width:w,height:h,fill:'transparent',cursor:'grab','data-cid':comp.id});
  dh.addEventListener('mousedown',onDragDown);
  dh.addEventListener('click',e=>{if(!wireMode){e.stopPropagation();selComp2(comp.id);}});
  dh.addEventListener('contextmenu',e=>{e.preventDefault();selComp2(comp.id);ctxCompId=comp.id;showCtx(e);});
  g.appendChild(dh);
}

// ── PIN CIRCLES (called AFTER addDrag so they're on top) ─
function addPins(g,comp){
  comp.pins.forEach(p=>{
    const c=S('circle',{cx:p.rx,cy:p.ry,r:5,fill:p.color,stroke:'rgba(255,255,255,.45)','stroke-width':.7,
      class:'pdot','data-cid':comp.id,'data-pid':p.id,id:`${comp.id}-${p.id}`});
    c.addEventListener('click',onPinClick);
    c.addEventListener('mouseenter',e=>{
      document.getElementById('pt1').textContent=p.label;
      document.getElementById('pt2').textContent=`${comp.id} · ${COMP_DEFS[comp.type]?.label||comp.type}`;
      document.getElementById('ptt').style.display='block';
      showSnap(comp.id,p.id);
    });
    c.addEventListener('mousemove',e=>{
      const tt=document.getElementById('ptt');
      tt.style.left=(e.clientX+14)+'px';tt.style.top=(e.clientY-42)+'px';
    });
    c.addEventListener('mouseleave',()=>{document.getElementById('ptt').style.display='none';hideSnap();});
    g.appendChild(c);
  });
}

// ── COMPONENT MANAGEMENT ─────────────────────────────
function addSelectedComp(){
  const v=document.getElementById('comp-select').value;
  if(!v)return;
  addComp(v);
}
function addComp(type){
  const def=COMP_DEFS[type];if(!def)return;
  const id='c'+(nid++);
  const pg=document.getElementById('pg');
  const r=pg.getBoundingClientRect();
  const bx=(r.width/2-vPanX)/vZoom+(Math.random()*120-60);
  const by=80/vZoom+(Math.random()*60-30);
  // BUG FIX #5: Initialize ledColor for LEDs so color-dot UI shows proper selection
  const comp={id,type,x:bx,y:by,state:false,
    pins:def.pins.map(p=>({...p})),
    ledColor:type==='led'?'y':undefined,
    value:type==='dht22'?{temp:24.5,hum:58}:type==='hcsr04'?{dist:22}:type==='servo'?{angle:90}:type==='potentiometer'?{val:512}:type==='neopixel'?{r:0,g:0,b:0}:type==='lcd'?{text:'Hello World!',line2:'PicoSim v4'}:{}
  };
  comps[id]=comp;renderComp(comp);updateInfo();
  clog(`+ Added ${def.label} [${id}]`,'info');
}
function renderComp(comp){
  const layer=document.getElementById('comps-layer');
  const old=document.getElementById('comp-'+comp.id);if(old)old.remove();
  const g=S('g',{id:'comp-'+comp.id,transform:`translate(${comp.x},${comp.y})`});
  const fns={led:drawLED,button:drawButton,buzzer:drawBuzzer,dht22:drawDHT22,hcsr04:drawHCSR04,servo:drawServo,potentiometer:drawPot,neopixel:drawNeoPixel,lcd:drawLCD};
  if(fns[comp.type])fns[comp.type](g,comp);
  layer.appendChild(g);
}

// ── DRAGGING ──────────────────────────────────────────
function onDragDown(e){
  if(wireMode)return;
  e.stopPropagation();
  const cid=e.currentTarget.dataset.cid;
  const pt=toWorld(e.clientX,e.clientY);
  const c=comps[cid];
  dragSt={cid,smx:pt.x,smy:pt.y,scx:c.x,scy:c.y};
  document.getElementById('comp-'+cid).style.cursor='grabbing';
  selComp2(cid);
}

document.addEventListener('mousemove',e=>{
  if(panSt){
    vPanX=panSt.px+(e.clientX-panSt.sx);
    vPanY=panSt.py+(e.clientY-panSt.sy);
    applyVP();return;
  }
  const pt=toWorld(e.clientX,e.clientY);
  if(wireMode&&wireStart){
    document.getElementById('twire').setAttribute('d',wPath(wireStart.ax,wireStart.ay,pt.x,pt.y));
    // Find nearest snap target
    let near=null,md=18;
    const allP=[
      ...LEFT_PINS.map(p=>({cid:'pico',pid:p.id})),
      ...RIGHT_PINS.map(p=>({cid:'pico',pid:p.id})),
      ...Object.values(comps).flatMap(c=>c.pins.map(p=>({cid:c.id,pid:p.id})))
    ];
    allP.forEach(({cid,pid})=>{
      const pos=pinPos(cid,pid);
      const d=Math.hypot(pt.x-pos.x,pt.y-pos.y);
      if(d<md){md=d;near={cid,pid};}
    });
    if(near)showSnap(near.cid,near.pid);else hideSnap();
  }
  if(dragSt){
    const c=comps[dragSt.cid];
    c.x=dragSt.scx+(pt.x-dragSt.smx);
    c.y=dragSt.scy+(pt.y-dragSt.smy);
    document.getElementById('comp-'+dragSt.cid).setAttribute('transform',`translate(${c.x},${c.y})`);
    wires.forEach(w=>{if(w.fc===dragSt.cid||w.tc===dragSt.cid)refreshWire(w);});
  }
});

document.addEventListener('mouseup',e=>{
  if(panSt)panSt=null;
  document.getElementById('pg').classList.remove('panning');
  if(dragSt){document.getElementById('comp-'+dragSt.cid).style.cursor='';dragSt=null;}
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){cancelWire();deselectAll();}
  if((e.key==='Delete'||e.key==='Backspace')&&!e.target.closest('.CodeMirror'))deleteSel();
});

document.getElementById('pg').addEventListener('click',e=>{
  if(!wireMode&&(e.target.id==='pg'||e.target.closest('#vp')===document.getElementById('vp')&&!e.target.closest('.comp-g')&&!e.target.closest('#pico-main-g'))){
    deselectAll();hideCtx();
  }
});
document.addEventListener('click',()=>hideCtx());

// ── SELECT / DESELECT ─────────────────────────────────
function selComp2(id){
  deselectAll();selComp=id;
  const g=document.getElementById('comp-'+id);
  if(g){
    const def=COMP_DEFS[comps[id].type];
    // BUG FIX #3: Use 'pointer-events' (kebab-case) for SVG attribute, not 'pointer_events'
    const s=S('rect',{x:-8,y:-26,width:def.w+16,height:def.h+24,rx:6,fill:'none',stroke:'rgba(0,170,255,.7)','stroke-width':1.5,'stroke-dasharray':'6,3',class:'selr','pointer-events':'none'});
    g.insertBefore(s,g.firstChild);
    document.getElementById('isel').innerHTML=`Selected: <b>${def.label} [${id}]</b>`;
  }
}
function deselectAll(){
  selComp=null;selWire=null;
  document.querySelectorAll('.selr').forEach(e=>e.remove());
  wires.forEach(w=>{w.el.classList.remove('sel');w.el.style.filter='';});
  document.getElementById('isel').innerHTML='Selected: <b>None</b>';
}
function deleteSel(){
  if(selComp){
    wires.filter(w=>w.fc===selComp||w.tc===selComp).forEach(w=>w.el.remove());
    wires=wires.filter(w=>w.fc!==selComp&&w.tc!==selComp);
    delete comps[selComp];
    document.getElementById('comp-'+selComp)?.remove();
    clog(`− Removed [${selComp}]`,'warn');selComp=null;updateInfo();markWiredPins();
    if(simRunning)buildSensorPanel();
  }
  if(selWire){
    const w=wires.find(x=>x.id===selWire);
    if(w){w.el.remove();wires=wires.filter(x=>x.id!==selWire);}
    clog(`− Removed wire [${selWire}]`,'warn');selWire=null;updateInfo();markWiredPins();
  }
}
function clearWires(){
  wires.forEach(w=>w.el.remove());wires=[];selWire=null;updateInfo();markWiredPins();
  clog('✕ All wires cleared','warn');
}
function markWiredPins(){
  document.querySelectorAll('.pdot').forEach(e=>{e.setAttribute('stroke','rgba(255,255,255,.45)');e.setAttribute('stroke-width','.7');e.classList.remove('wired');});
  wires.forEach(w=>{
    [`pp-${w.fp}`,`pp-${w.tp}`,`${w.fc}-${w.fp}`,`${w.tc}-${w.tp}`].forEach(id=>{
      const e=document.getElementById(id);
      if(e){e.setAttribute('stroke','#fff');e.setAttribute('stroke-width','2');e.classList.add('wired');}
    });
  });
}

// ── CONTEXT MENU ──────────────────────────────────────
function showCtx(e){
  const m=document.getElementById('ctxm');
  m.style.display='block';
  m.style.left=e.clientX+'px';m.style.top=e.clientY+'px';
  document.getElementById('ctx-code').style.display=ctxCompId?'flex':'none';
  e.stopPropagation();
}
function hideCtx(){document.getElementById('ctxm').style.display='none';}
function ctxDel(){hideCtx();deleteSel();}
function ctxCode(){
  hideCtx();if(!ctxCompId)return;
  const comp=comps[ctxCompId];if(!comp)return;
  const snips={
    led:'# LED on GP0\nled = Pin(0, Pin.OUT)\nled.on()\ntime.sleep(1)\nled.off()',
    button:'# Button on GP15 (pull-up)\nbtn = Pin(15, Pin.IN, Pin.PULL_UP)\nif not btn.value():\n    print("Pressed!")',
    buzzer:'# Buzzer on GP0\nbuzz = Pin(0, Pin.OUT)\nbuzz.on()\ntime.sleep(0.1)\nbuzz.off()',
    dht22:'# DHT22 on GP4\nimport dht\nsensor = dht.DHT22(Pin(4))\nsensor.measure()\ntemp = sensor.temperature()\nhum = sensor.humidity()\nprint(f"Temp: {temp}°C  Hum: {hum}%")',
    hcsr04:'# HC-SR04: TRIG→GP4, ECHO→GP5\ntrig = Pin(4, Pin.OUT)\necho = Pin(5, Pin.IN)\ntrig.high(); time.sleep_us(10); trig.low()\n# measure echo pulse duration',
    servo:'# SG90 Servo on GP0 via PWM\nfrom machine import PWM\nservo = PWM(Pin(0), freq=50)\nservo.duty_u16(4800)  # ~90°',
    potentiometer:'# Potentiometer on GP26 (ADC0)\nfrom machine import ADC\npot = ADC(Pin(26))\nval = pot.read_u16()\nprint(f"ADC: {val}  Voltage: {val/65535*3.3:.2f}V")',
    neopixel:'# NeoPixel on GP0\nimport neopixel\nnp = neopixel.NeoPixel(Pin(0), 1)\nnp[0] = (255, 0, 128)  # R, G, B\nnp.write()',
    lcd:'# I2C LCD: SDA→GP0, SCL→GP1\nimport machine\ni2c = machine.I2C(0, sda=Pin(0), scl=Pin(1))\n# lcd.putstr("Hello World!")',
  };
  const s=snips[comp.type]||`# ${COMP_DEFS[comp.type]?.label}`;
  const cur=editor.getCursor();editor.replaceRange('\n'+s+'\n',cur);
  clog(`  Code snippet inserted for ${COMP_DEFS[comp.type]?.label}`,'info');
}

// ── SIMULATION ────────────────────────────────────────
function toggleSim(){simRunning?stopSim():startSim();}

function startSim(){
  const code=editor.getValue();
  simRunning=true;simTimers=[];pinStates={};
  document.getElementById('btn-run').innerHTML='■ &nbsp;Stop';
  document.getElementById('btn-run').classList.add('running');
  document.getElementById('sdot').className='running';
  document.getElementById('stxt').textContent='Running';
  clog('▶ Simulation started','info');
  runSim(code);
  buildSensorPanel();
}

function stopSim(){
  simRunning=false;
  // BUG FIX #2: Clear both timeout and interval handles since simTimers
  // collects handles from both setTimeout and setInterval
  simTimers.forEach(t=>{clearTimeout(t);clearInterval(t);});
  simTimers=[];pinStates={};
  document.getElementById('btn-run').innerHTML='▶ &nbsp;Run';
  document.getElementById('btn-run').classList.remove('running');
  document.getElementById('sdot').className='';
  document.getElementById('stxt').textContent='Ready';
  Object.values(comps).forEach(c=>{c.state=false;renderComp(c);});
  updateBuiltinLED(false);
  buildSensorPanel();
  clog('■ Simulation stopped','warn');
}

function runSim(code){
  try{
    // ── Parse Pin/ADC/PWM definitions ──────────────────
    const pinMap={};
    [...code.matchAll(/(\w+)\s*=\s*(?:machine\.)?Pin\((\d+)(?:,\s*(?:Pin\.\w+))?\)/g)].forEach(m=>{
      pinMap[m[1]]=parseInt(m[2]);pinStates[parseInt(m[2])]=0;
      clog(`  ${m[1]} → GPIO${m[2]}`);
    });
    [...code.matchAll(/(\w+)\s*=\s*(?:machine\.)?ADC\((?:Pin\()?(\d+)\)?(?:\)|)\)/g)].forEach(m=>{
      pinMap[m[1]]=parseInt(m[2]);
    });
    [...code.matchAll(/(\w+)\s*=\s*(?:machine\.)?PWM\(Pin\((\d+)\)/g)].forEach(m=>{
      pinMap[m[1]]=parseInt(m[2]);clog(`  ${m[1]} → GPIO${m[2]} [PWM]`);
    });

    // ── Print statements ────────────────────────────────
    [...code.matchAll(/print\(["'`]([^"'`]+)["'`]\)/g)].forEach(m=>clog('  '+m[1]));

    // ── Loop simulation ─────────────────────────────────
    if(/while\s+(?:True|1)\s*:/.test(code)){
      const lm=code.match(/while\s+(?:True|1)\s*:\n([\s\S]+)/);
      animateLoop(lm?lm[1]:'',pinMap);
    } else {
      executeOnce(code,pinMap);
    }

    // ── Sensor activations ──────────────────────────────
    Object.values(comps).forEach(comp=>{
      simulateComp(comp,code);
    });

  } catch(err){
    clog('Error: '+err.message,'err');
    document.getElementById('sdot').className='error';
    document.getElementById('stxt').textContent='Error';
  }
}

function simulateComp(comp,code){
  const type=comp.type;

  // ── LED: activated by setPinState, handled there ──
  if(type==='led'){
    const gpio=wiredGPIO(comp.id,'anode');
    if(gpio===null)clog(`  ⚠ LED [${comp.id}]: anode not wired`,'warn');
    else clog(`  LED [${comp.id}] anode → GP${gpio}`);
  }

  // ── BUTTON: interactive, check connection ──
  else if(type==='button'){
    const gpio=wiredGPIO(comp.id,'pin1')??wiredGPIO(comp.id,'pin2');
    if(gpio!==null){
      comp.gpioNum=gpio;pinStates[gpio]=0;
      clog(`  Button [${comp.id}] → GP${gpio} [click to toggle]`,'info');
      renderComp(comp);
    } else clog(`  ⚠ Button [${comp.id}]: not wired`,'warn');
  }

  // ── BUZZER: activated by setPinState ──
  else if(type==='buzzer'){
    const gpio=wiredGPIO(comp.id,'io');
    if(gpio!==null)clog(`  Buzzer [${comp.id}] io → GP${gpio}`);
    else clog(`  ⚠ Buzzer [${comp.id}]: I/O not wired`,'warn');
  }

  // ── DHT22: slider-controlled temp & humidity ──
  else if(type==='dht22'){
    const gpio=wiredGPIO(comp.id,'data');
    if(gpio!==null){
      comp.state=true;
      if(!comp.value)comp.value={temp:25.0,hum:60.0};
      if(comp.value.temp===undefined)comp.value.temp=25.0;
      if(comp.value.hum===undefined)comp.value.hum=60.0;
      renderComp(comp);
      clog(`  DHT22 [${comp.id}] data → GP${gpio} [use sliders to adjust]`,'info');
      const iv=setInterval(()=>{
        if(!simRunning){clearInterval(iv);comp.state=false;renderComp(comp);return;}
        renderComp(comp);
        clog(`  DHT22: ${comp.value.temp.toFixed(1)}°C  ${comp.value.hum.toFixed(1)}%`);
      },2500);
      simTimers.push(iv);
    } else clog(`  ⚠ DHT22 [${comp.id}]: data pin not wired`,'warn');
  }

  // ── HC-SR04: slider-controlled distance ──
  else if(type==='hcsr04'){
    const trigGP=wiredGPIO(comp.id,'trig');
    const echoGP=wiredGPIO(comp.id,'echo');
    if(trigGP!==null){
      comp.state=true;
      if(!comp.value||comp.value.dist===undefined)comp.value={dist:30};
      renderComp(comp);
      clog(`  HC-SR04 [${comp.id}] trig→GP${trigGP}${echoGP!==null?` echo→GP${echoGP}`:''} [use slider to set distance]`,'info');
      // Periodic log to console using current slider value
      const iv=setInterval(()=>{
        if(!simRunning){clearInterval(iv);comp.state=false;renderComp(comp);return;}
        renderComp(comp);
        clog(`  HC-SR04: ${comp.value.dist.toFixed(1)} cm`);
      },2000);
      simTimers.push(iv);
    } else clog(`  ⚠ HC-SR04 [${comp.id}]: trig not wired`,'warn');
  }

  // ── SERVO: slider-controlled angle (or code duty) ──
  else if(type==='servo'){
    const gpio=wiredGPIO(comp.id,'sig');
    if(gpio!==null){
      comp.state=true;
      // Check for explicit duty_u16 in code
      const dm=code.match(/\.duty_u16\((\d+)\)/);
      if(dm){
        const duty=parseInt(dm[1]);
        comp.value.angle=Math.round(Math.min(180,Math.max(0,(duty-1000)/8000*180)));
        clog(`  Servo [${comp.id}] sig→GP${gpio} duty=${duty} → ${comp.value.angle}°`,'info');
      } else {
        if(!comp.value)comp.value={angle:90};
        if(comp.value.angle===undefined)comp.value.angle=90;
        clog(`  Servo [${comp.id}] sig→GP${gpio} [use slider to set angle]`,'info');
      }
      renderComp(comp);
    } else clog(`  ⚠ Servo [${comp.id}]: SIG not wired`,'warn');
  }

  // ── POTENTIOMETER: ADC readout ──
  else if(type==='potentiometer'){
    const gpio=wiredGPIO(comp.id,'out');
    if(gpio!==null){
      comp.state=true;renderComp(comp);
      clog(`  Pot [${comp.id}] out→GP${gpio}: ADC=${comp.value.val} (scroll to adjust)`,'info');
    } else clog(`  ⚠ Pot [${comp.id}]: OUT not wired`,'warn');
  }

  // ── NEOPIXEL: color from code ──
  // BUG FIX #4: Removed unused nm2 variable
  else if(type==='neopixel'){
    const gpio=wiredGPIO(comp.id,'din');
    if(gpio!==null){
      comp.state=true;
      const nm=code.match(/np\[0\]\s*=\s*\((\d+),\s*(\d+),\s*(\d+)\)/);
      if(nm){comp.value={r:+nm[1],g:+nm[2],b:+nm[3]};}
      else{comp.value={r:0,g:180,b:255};}// default teal
      renderComp(comp);
      clog(`  NeoPixel [${comp.id}] din→GP${gpio} RGB(${comp.value.r},${comp.value.g},${comp.value.b})`,'info');
      // Rainbow cycle animation if no explicit color set
      if(!nm){
        let hue=0;
        const iv=setInterval(()=>{
          if(!simRunning){clearInterval(iv);comp.state=false;renderComp(comp);return;}
          const [r,g,b]=hslToRgb(hue/360,.9,.5);
          comp.value={r,g,b};hue=(hue+2)%360;renderComp(comp);
        },50);
        simTimers.push(iv);
      }
    } else clog(`  ⚠ NeoPixel [${comp.id}]: DIN not wired`,'warn');
  }

  // ── LCD: show text from code ──
  else if(type==='lcd'){
    const sdaGP=wiredGPIO(comp.id,'sda');
    const sclGP=wiredGPIO(comp.id,'scl');
    if(sdaGP!==null||sclGP!==null){
      comp.state=true;
      // Parse text from various LCD patterns
      const p1=code.match(/putstr\(f?["'`]([^"'`]{1,16})["'`]\)/);
      const p2=code.match(/write\(f?["'`]([^"'`]{1,16})["'`]\)/);
      const p3=code.match(/print\(f?["'`]([^"'`]{1,16})["'`]\)/);
      const p4=code.match(/lcd\.move_to\(\d+,0\).*?lcd\.putstr\(f?["'`]([^"'`]{1,16})["'`]\)/s);
      const p5=code.match(/lcd\.move_to\(\d+,1\).*?lcd\.putstr\(f?["'`]([^"'`]{1,16})["'`]\)/s);
      if(p1)comp.value.text=p1[1];
      else if(p2)comp.value.text=p2[1];
      else if(p3){comp.value.text=p3[1];}
      if(p4)comp.value.text=p4[1];
      if(p5)comp.value.line2=p5[1];
      // Simulated scrolling update
      const iv=setInterval(()=>{
        if(!simRunning){clearInterval(iv);comp.state=false;renderComp(comp);return;}
        renderComp(comp);// re-render for cursor blink
      },700);
      simTimers.push(iv);
      renderComp(comp);
      clog(`  LCD [${comp.id}] SDA→GP${sdaGP??'?'} SCL→GP${sclGP??'?'} → "${comp.value.text}"`,'info');
    } else clog(`  ⚠ LCD [${comp.id}]: SDA/SCL not wired`,'warn');
  }
}

function hslToRgb(h,s,l){
  const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h*6)%2-1)),m=l-c/2;
  let r=0,g=0,b=0;
  if(h<1/6){r=c;g=x;}else if(h<2/6){r=x;g=c;}else if(h<3/6){g=c;b=x;}
  else if(h<4/6){g=x;b=c;}else if(h<5/6){r=x;b=c;}else{r=c;b=x;}
  return[Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];
}

function executeOnce(code,pinMap){
  const ctx=buildRuntimeContext(pinMap);
  code.split('\n').forEach(line=>{
    const t=line.trim();
    if(!t||t.startsWith('#'))return;
    if(applyRuntimeAssignment(t,ctx,pinMap))return;
    applyPin(t,pinMap);
    const msg=formatPrintLine(t,ctx);
    if(msg!==null)clog(msg);
  });
}

function animateLoop(body,pinMap){
  const lines=normalizeLoopLines(body);

  function cycle(){
    if(!simRunning)return;
    const runtime=buildCycleActions(lines,pinMap);
    const acts=runtime.acts;
    const total=runtime.total;

    acts.forEach(a=>{
      const t=setTimeout(()=>{
        if(!simRunning)return;
        if(a.type==='pin')applyPin(a.l,pinMap);
        else if(a.type==='print')clog(a.msg);
      },a.d);
      simTimers.push(t);
    });
    simTimers.push(setTimeout(cycle,total));
  }
  cycle();
}

function normalizeLoopLines(body){
  const rawLines=body.split('\n');
  let minIndent=Infinity;
  rawLines.forEach(l=>{
    if(!l.trim())return;
    const ind=l.match(/^\s*/)[0].length;
    if(ind<minIndent)minIndent=ind;
  });
  if(!Number.isFinite(minIndent)||minIndent===0)return rawLines;
  return rawLines.map(l=>{
    if(!l.trim())return '';
    return l.slice(Math.min(minIndent,l.length));
  });
}

function buildRuntimeContext(pinMap){
  const ctx={};
  const sensorDist=getUltrasonicDistance(pinMap);
  if(sensorDist!==null)ctx.dist=sensorDist;
  const dht=getDHTValues(pinMap);
  if(dht!==null){ctx._dht_temp=dht.temp;ctx._dht_hum=dht.hum;}
  return ctx;
}

function getUltrasonicDistance(pinMap){
  const gpios=Object.values(pinMap||{});
  for(const comp of Object.values(comps)){
    if(comp.type!=='hcsr04')continue;
    const trigGP=wiredGPIO(comp.id,'trig');
    const echoGP=wiredGPIO(comp.id,'echo');
    const trigMatch=trigGP!==null&&gpios.includes(trigGP);
    const echoMatch=echoGP!==null&&gpios.includes(echoGP);
    if(trigMatch||echoMatch){
      const dist=comp.value&&comp.value.dist;
      return Number.isFinite(dist)?dist:30;
    }
  }
  const anySensor=Object.values(comps).find(c=>c.type==='hcsr04');
  if(!anySensor)return null;
  const dist=anySensor.value&&anySensor.value.dist;
  return Number.isFinite(dist)?dist:30;
}

function getDHTValues(pinMap){
  for(const comp of Object.values(comps)){
    if(comp.type!=='dht22')continue;
    const dataGP=wiredGPIO(comp.id,'data');
    if(dataGP!==null){
      return{
        temp:comp.value&&comp.value.temp!==undefined?comp.value.temp:25.0,
        hum:comp.value&&comp.value.hum!==undefined?comp.value.hum:60.0
      };
    }
  }
  const any=Object.values(comps).find(c=>c.type==='dht22');
  if(!any)return null;
  return{
    temp:any.value&&any.value.temp!==undefined?any.value.temp:25.0,
    hum:any.value&&any.value.hum!==undefined?any.value.hum:60.0
  };
}

function applyRuntimeAssignment(line,ctx,pinMap){
  // sensor.measure() — no-op, data comes from component slider
  if(/^\w+\.measure\(\)\s*$/.test(line))return true;
  // temp = sensor.temperature()
  const tempA=line.match(/^(\w+)\s*=\s*\w+\.temperature\(\)\s*$/);
  if(tempA){ctx[tempA[1]]=ctx._dht_temp!==undefined?ctx._dht_temp:25.0;return true;}
  // hum = sensor.humidity()
  const humA=line.match(/^(\w+)\s*=\s*\w+\.humidity\(\)\s*$/);
  if(humA){ctx[humA[1]]=ctx._dht_hum!==undefined?ctx._dht_hum:60.0;return true;}
  // dist = get_distance()
  const distAssign=line.match(/^(\w+)\s*=\s*get_distance\(\)\s*$/);
  if(distAssign){
    const d=getUltrasonicDistance(pinMap);
    ctx[distAssign[1]]=d!==null?d:0;
    if(ctx.dist===undefined)ctx.dist=ctx[distAssign[1]];
    return true;
  }
  // val = pot.read_u16()
  const adcA=line.match(/^(\w+)\s*=\s*\w+\.read_u16\(\)\s*$/);
  if(adcA){
    let adcVal=32768;
    for(const comp of Object.values(comps)){
      if(comp.type==='potentiometer'&&comp.value&&comp.value.val!==undefined){
        adcVal=Math.round(comp.value.val/1023*65535);break;
      }
    }
    ctx[adcA[1]]=adcVal;return true;
  }
  // numeric literal: x = 42
  const numAssign=line.match(/^(\w+)\s*=\s*(-?\d+(?:\.\d+)?)\s*$/);
  if(numAssign){
    ctx[numAssign[1]]=parseFloat(numAssign[2]);
    return true;
  }
  return false;
}

// BUG FIX #7: Support utime.sleep in addition to time.sleep
function parseSleepMs(line){
  const sm=line.match(/^u?time\.sleep(?:_ms|_us)?\(([^)]+)\)/);
  if(!sm)return 0;
  const v=parseFloat(sm[1])||0;
  if(line.includes('_ms'))return v;
  if(line.includes('_us'))return v/1000;
  return v*1000;
}

function evalToken(tok,ctx){
  const t=tok.trim();
  if(/^[-+]?\d+(?:\.\d+)?$/.test(t))return parseFloat(t);
  return ctx[t];
}

function evalCondition(cond,ctx){
  const m=cond.match(/^(.+?)\s*(<=|>=|==|!=|<|>)\s*(.+)$/);
  if(!m)return false;
  const a=evalToken(m[1],ctx),b=evalToken(m[3],ctx);
  if(typeof a!=='number'||typeof b!=='number'||!Number.isFinite(a)||!Number.isFinite(b))return false;
  switch(m[2]){
    case '<': return a<b;
    case '>': return a>b;
    case '<=': return a<=b;
    case '>=': return a>=b;
    case '==': return a===b;
    case '!=': return a!==b;
    default: return false;
  }
}

function splitPrintArgs(inner){
  const out=[];
  let cur='',q='';
  for(let i=0;i<inner.length;i++){
    const ch=inner[i];
    if((ch==='"'||ch==="'"||ch==='`')){
      if(!q)q=ch;
      else if(q===ch)q='';
      cur+=ch;
      continue;
    }
    if(ch===','&&!q){out.push(cur.trim());cur='';continue;}
    cur+=ch;
  }
  if(cur.trim())out.push(cur.trim());
  return out;
}

// BUG FIX #8: Support f-string interpolation like print(f"Temp: {temp}°C")
function formatPrintLine(line,ctx){
  const pm=line.match(/^print\((.*)\)\s*$/);
  if(!pm)return null;
  const inner=pm[1].trim();

  // Handle f-string: print(f"...{var}...")
  const fstrMatch=inner.match(/^f(["'`])(.*)\1$/);
  if(fstrMatch){
    const template=fstrMatch[2];
    // Replace {expr} with context values, supporting :.Nf format specifiers
    const result=template.replace(/\{(\w+)(?::([^}]+))?\}/g,(match,varName,fmt)=>{
      const val=ctx[varName];
      if(val===undefined)return match;
      if(fmt&&typeof val==='number'){
        const fmtMatch=fmt.match(/^\.(\d+)f$/);
        if(fmtMatch)return val.toFixed(parseInt(fmtMatch[1]));
      }
      return typeof val==='number'?Number(val.toFixed(1)).toString():String(val);
    });
    return result;
  }

  const args=splitPrintArgs(inner);
  const parts=args.map(a=>{
    if((a.startsWith('"')&&a.endsWith('"'))||(a.startsWith("'")&&a.endsWith("'"))||(a.startsWith('`')&&a.endsWith('`')))return a.slice(1,-1);
    const v=ctx[a];
    if(v===undefined)return a;
    return typeof v==='number'?Number(v.toFixed(1)).toString():String(v);
  });
  return parts.join(' ');
}

function collectIndentedBlock(lines,startIdx,baseIndent){
  const block=[];
  let i=startIdx;
  while(i<lines.length){
    const raw=lines[i];
    if(!raw.trim()){i++;continue;}
    const ind=raw.match(/^\s*/)[0].length;
    if(ind<=baseIndent)break;
    block.push(raw.slice(baseIndent+4));
    i++;
  }
  return {block,next:i};
}

function buildCycleActions(lines,pinMap){
  const ctx=buildRuntimeContext(pinMap);
  const acts=[];
  let cum=0;

  const processLine=(line)=>{
    const t=line.trim();
    if(!t||t.startsWith('#'))return;
    if(applyRuntimeAssignment(t,ctx,pinMap))return;
    const sleepMs=parseSleepMs(t);
    if(sleepMs>0){cum+=sleepMs;return;}
    const msg=formatPrintLine(t,ctx);
    if(msg!==null){acts.push({type:'print',msg,d:cum});return;}
    acts.push({type:'pin',l:t,d:cum});
  };

  function processBlock(blockLines){
    let i=0;
    while(i<blockLines.length){
      const raw=blockLines[i];
      const t=raw.trim();
      if(!t||t.startsWith('#')){i++;continue;}
      const indent=raw.match(/^\s*/)[0].length;
      if(indent!==0){i++;continue;}

      // ── try/except/finally — unwrap try body, skip except/finally ──
      if(/^try\s*:\s*$/.test(t)){
        const tryB=collectIndentedBlock(blockLines,i+1,0);
        i=tryB.next;
        // Skip all except / finally blocks
        while(i<blockLines.length){
          const nr=blockLines[i],nt=nr.trim();
          if(!nt){i++;continue;}
          if(/^except\s/.test(nt)||/^except\s*:/.test(nt)||/^finally\s*:/.test(nt)){
            const b=collectIndentedBlock(blockLines,i+1,0);
            i=b.next;continue;
          }
          break;
        }
        processBlock(tryB.block);
        continue;
      }

      // ── if/elif/else ──
      const ifm=t.match(/^if\s+(.+):\s*$/);
      if(ifm){
        const branches=[];
        const first=collectIndentedBlock(blockLines,i+1,0);
        branches.push({cond:ifm[1],block:first.block});
        i=first.next;
        while(i<blockLines.length){
          const nraw=blockLines[i],nt=nraw.trim();
          if(!nt){i++;continue;}
          if(/^elif\s+(.+):\s*$/.test(nt)){
            const cm=nt.match(/^elif\s+(.+):\s*$/);
            const b=collectIndentedBlock(blockLines,i+1,0);
            branches.push({cond:cm[1],block:b.block});
            i=b.next;continue;
          }
          if(/^else\s*:\s*$/.test(nt)){
            const b=collectIndentedBlock(blockLines,i+1,0);
            branches.push({cond:null,block:b.block});
            i=b.next;
          }
          break;
        }
        let chosen=[];
        for(const b of branches){
          if(b.cond===null){chosen=b.block;break;}
          if(evalCondition(b.cond,ctx)){chosen=b.block;break;}
        }
        processBlock(chosen);
        continue;
      }

      processLine(raw);
      i++;
    }
  }

  processBlock(lines);
  return {acts,total:Math.max(cum,120)};
}

function applyPin(line,pinMap){
  for(const[v,gpio]of Object.entries(pinMap)){
    if(!line.includes(v+'.'))continue;
    if(line.includes('.on()')||line.includes('.value(1)'))setPinState(gpio,1);
    else if(line.includes('.off()')||line.includes('.value(0)'))setPinState(gpio,0);
    else if(line.includes('.toggle()'))setPinState(gpio,pinStates[gpio]?0:1);
    const dm=line.match(/\.duty_u16\((\d+)\)/);
    if(dm){
      const duty=parseInt(dm[1]);
      wires.forEach(w=>{
        const pp=ALL_PICO_PINS.find(p=>p.gpio===gpio&&(p.id===w.fp||p.id===w.tp));
        if(!pp)return;
        const cid=w.fc==='pico'?w.tc:w.fc;
        const c=comps[cid];
        if(c&&c.type==='servo'){c.value.angle=Math.round(Math.min(180,Math.max(0,(duty-1000)/8000*180)));c.state=true;renderComp(c);}
      });
    }
  }
}

function setPinState(gpio,val){
  pinStates[gpio]=val;
  if(gpio===25)updateBuiltinLED(val===1);
  triggerPinChange(gpio);
}

function triggerPinChange(gpio){
  const val=pinStates[gpio]||0;
  wires.forEach(w=>{
    const fromPP=ALL_PICO_PINS.find(p=>p.gpio===gpio&&p.id===w.fp);
    const toPP=ALL_PICO_PINS.find(p=>p.gpio===gpio&&p.id===w.tp);
    let targetCid=null,targetPid=null;
    if(w.fc==='pico'&&fromPP){targetCid=w.tc;targetPid=w.tp;}
    if(w.tc==='pico'&&toPP){targetCid=w.fc;targetPid=w.fp;}
    if(!targetCid||!comps[targetCid])return;
    const comp=comps[targetCid];
    if(comp.type==='led'&&(targetPid==='anode')){comp.state=val===1;renderComp(comp);}
    if(comp.type==='buzzer'&&targetPid==='io'){comp.state=val===1;renderComp(comp);}
  });
}

function updateBuiltinLED(on){
  const e=document.getElementById('bi-led');
  if(e){e.setAttribute('fill',on?'#00ff44':'#003300');e.setAttribute('stroke',on?'#00ff44':'#005500');e.setAttribute('filter',on?'url(#fg-g)':'');}
}

// ── RESET ────────────────────────────────────────────
function resetAll(){
  if(simRunning)stopSim();
  Object.keys(comps).forEach(id=>document.getElementById('comp-'+id)?.remove());
  comps={};wires.forEach(w=>w.el?.remove());wires=[];
  pinStates={};selComp=null;selWire=null;
  cancelWire();updateInfo();updateBuiltinLED(false);clearCon();
  document.getElementById('sensor-panel').style.display='none';
  clog('↺ Playground reset','info');nid=1;
}

function updateInfo(){
  document.getElementById('iwires').textContent=wires.length;
  document.getElementById('icomps').textContent=Object.keys(comps).length;
}

// ── CONSOLE ──────────────────────────────────────────
function clog(msg,cls=''){
  const out=document.getElementById('con-out');
  const line=document.createElement('div');
  line.className='cline'+(cls?' c'+cls:'');
  const ts=new Date().toLocaleTimeString('en',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
  line.textContent=`[${ts}] ${msg}`;
  out.appendChild(line);out.scrollTop=out.scrollHeight;
}
function clearCon(){document.getElementById('con-out').innerHTML='';}

// ── WIRE COLOR ────────────────────────────────────────
document.getElementById('wcols').addEventListener('click',e=>{
  const b=e.target.closest('.wcol');if(!b)return;
  document.querySelectorAll('.wcol').forEach(x=>x.classList.remove('sel'));
  b.classList.add('sel');wireColor=b.dataset.c;
  document.getElementById('twire').style.stroke=wireColor;
});

// ── SENSOR CONTROLS PANEL ────────────────────────────
let spCollapsed=false;

function toggleSP(){
  spCollapsed=!spCollapsed;
  document.getElementById('sp-body').style.display=spCollapsed?'none':'';
  document.getElementById('sp-toggle').textContent=spCollapsed?'▸':'▾';
}

function buildSensorPanel(){
  const panel=document.getElementById('sensor-panel');
  const body=document.getElementById('sp-body');
  if(spCollapsed)body.style.display='none';
  body.innerHTML='';

  const controllable=Object.values(comps).filter(c=>
    ['hcsr04','dht22','potentiometer','servo'].includes(c.type)
  );

  if(!controllable.length||!simRunning){panel.style.display='none';return;}
  panel.style.display='block';

  controllable.forEach((comp,idx)=>{
    if(idx>0){const sep=document.createElement('div');sep.className='sp-sep';body.appendChild(sep);}
    const div=document.createElement('div');
    div.className='sp-comp';

    if(comp.type==='hcsr04'){
      const dist=(comp.value&&comp.value.dist!==undefined)?comp.value.dist:30;
      div.innerHTML=`<div class="sp-comp-name"><span>📡</span> HC-SR04 [${comp.id}]</div>
        <div class="sp-field">
          <div class="sp-field-label"><span class="sp-field-key">Distance</span><span class="sp-field-val" id="sp-${comp.id}-dist">${(+dist).toFixed(1)} cm</span></div>
          <input type="range" class="sp-slider" min="2" max="400" step="0.5" value="${dist}"
            oninput="setSensorVal('${comp.id}','dist',+this.value)">
        </div>`;
    } else if(comp.type==='dht22'){
      const temp=(comp.value&&comp.value.temp!==undefined)?comp.value.temp:25.0;
      const hum=(comp.value&&comp.value.hum!==undefined)?comp.value.hum:60.0;
      div.innerHTML=`<div class="sp-comp-name"><span>🌡️</span> DHT22 [${comp.id}]</div>
        <div class="sp-field">
          <div class="sp-field-label"><span class="sp-field-key">Temperature</span><span class="sp-field-val" id="sp-${comp.id}-temp">${(+temp).toFixed(1)} °C</span></div>
          <input type="range" class="sp-slider" min="-40" max="80" step="0.5" value="${temp}"
            oninput="setSensorVal('${comp.id}','temp',+this.value)">
        </div>
        <div class="sp-field">
          <div class="sp-field-label"><span class="sp-field-key">Humidity</span><span class="sp-field-val" id="sp-${comp.id}-hum">${(+hum).toFixed(1)} %</span></div>
          <input type="range" class="sp-slider" min="0" max="100" step="0.5" value="${hum}"
            oninput="setSensorVal('${comp.id}','hum',+this.value)">
        </div>`;
    } else if(comp.type==='potentiometer'){
      const val=(comp.value&&comp.value.val!==undefined)?comp.value.val:512;
      div.innerHTML=`<div class="sp-comp-name"><span>🎚️</span> Potentiometer [${comp.id}]</div>
        <div class="sp-field">
          <div class="sp-field-label"><span class="sp-field-key">ADC Value</span><span class="sp-field-val" id="sp-${comp.id}-val">${Math.round(val)} · ${(val/1023*3.3).toFixed(2)}V</span></div>
          <input type="range" class="sp-slider" min="0" max="1023" step="1" value="${val}" id="sp-slider-${comp.id}-val"
            oninput="setSensorVal('${comp.id}','val',+this.value)">
        </div>`;
    } else if(comp.type==='servo'){
      const ang=(comp.value&&comp.value.angle!==undefined)?comp.value.angle:90;
      div.innerHTML=`<div class="sp-comp-name"><span>⚙️</span> Servo [${comp.id}]</div>
        <div class="sp-field">
          <div class="sp-field-label"><span class="sp-field-key">Angle</span><span class="sp-field-val" id="sp-${comp.id}-angle">${Math.round(ang)}°</span></div>
          <input type="range" class="sp-slider" min="0" max="180" step="1" value="${ang}" id="sp-slider-${comp.id}-angle"
            oninput="setSensorVal('${comp.id}','angle',+this.value)">
        </div>`;
    }
    body.appendChild(div);
  });
}

function setSensorVal(compId,field,value){
  const comp=comps[compId];if(!comp)return;
  if(!comp.value)comp.value={};
  comp.value[field]=value;
  comp.state=true;
  renderComp(comp);
  // Update label
  const el=document.getElementById(`sp-${compId}-${field}`);
  if(el){
    if(field==='dist')el.textContent=value.toFixed(1)+' cm';
    else if(field==='temp')el.textContent=value.toFixed(1)+' °C';
    else if(field==='hum')el.textContent=value.toFixed(1)+' %';
    else if(field==='val')el.textContent=Math.round(value)+' · '+(value/1023*3.3).toFixed(2)+'V';
    else if(field==='angle')el.textContent=Math.round(value)+'°';
  }
  // Sync pot scroll value
  if(field==='val'){
    const gpio=wiredGPIO(compId,'out');
    if(gpio!==null&&simRunning)clog(`  Pot ADC GP${gpio}: ${Math.round(value)} (${(value/1023*3.3).toFixed(2)}V)`,'info');
  }
}

// ── TABS ─────────────────────────────────────────────
function switchTab(tab,btn){
  document.querySelectorAll('.ptab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.pcontent').forEach(c=>c.classList.add('hidden'));
  document.getElementById('tab-'+tab).classList.remove('hidden');
  if(tab==='code'&&editor)editor.refresh();
}

// ── LIBRARIES ────────────────────────────────────────
const LIBRARIES=[
  {name:'machine',desc:'Pin, ADC, SPI, I2C, UART, PWM',ver:'built-in',icon:'⚙️',on:true},
  {name:'time',   desc:'sleep(), sleep_ms(), ticks_ms()',ver:'built-in',icon:'⏱',on:true},
  {name:'hcsr04', desc:'Ultrasonic distance helper (community)',ver:'v1.0.0',icon:'📡',on:false},
  {name:'dht',    desc:'DHT11/DHT22 sensor driver',ver:'v1.0.0',icon:'🌡️',on:false},
  {name:'neopixel',desc:'WS2812B NeoPixel driver',ver:'v1.0.0',icon:'💎',on:false},
  {name:'utime',  desc:'MicroPython time alias',ver:'built-in',icon:'🕐',on:false},
  {name:'network',desc:'Wi-Fi (Pico W only)',ver:'built-in',icon:'📶',on:false},
  {name:'ujson',  desc:'JSON encode/decode',ver:'built-in',icon:'{}',on:false},
  {name:'random', desc:'Random number generation',ver:'built-in',icon:'🎲',on:false},
  {name:'math',   desc:'sin, cos, sqrt, pi...',ver:'built-in',icon:'∑',on:false},
  {name:'ustruct',desc:'Pack/unpack binary data',ver:'built-in',icon:'📦',on:false},
  {name:'micropython',desc:'MicroPython specific',ver:'built-in',icon:'🐍',on:false},
  {name:'gc',     desc:'Garbage collection',ver:'built-in',icon:'♻️',on:false},
];
function initLibs(){
  const panel=document.getElementById('libs-wrap');
  panel.innerHTML='<div class="libs-title">MicroPython Libraries</div>';
  LIBRARIES.forEach(lib=>{
    const item=document.createElement('div');
    item.className='lib-item'+(lib.on?' active':'');
    item.innerHTML=`<div class="lib-icon">${lib.icon}</div>
      <div class="lib-info"><div class="lib-name">${lib.name}</div><div class="lib-desc">${lib.desc}</div><div class="lib-ver">${lib.ver}</div></div>
      <div class="lib-tog ${lib.on?'on':''}"></div>`;
    const tog=item.querySelector('.lib-tog');
    tog.addEventListener('click',()=>{
      lib.on=!lib.on;tog.classList.toggle('on',lib.on);item.classList.toggle('active',lib.on);
      if(lib.on){const c=editor.getValue();if(!c.includes(`import ${lib.name}`))editor.setValue(`import ${lib.name}\n`+c);}
    });
    panel.appendChild(item);
  });
}

// ── RESIZE PANEL ─────────────────────────────────────
(()=>{
  const r=document.getElementById('resizer'),lp=document.getElementById('left-panel');
  let dr=false,sx=0,sw=0;
  r.addEventListener('mousedown',e=>{dr=true;sx=e.clientX;sw=lp.offsetWidth;document.body.style.userSelect='none';document.body.style.cursor='col-resize';});
  document.addEventListener('mousemove',e=>{if(!dr)return;lp.style.width=Math.max(220,Math.min(700,sw+e.clientX-sx))+'px';if(editor)editor.refresh();});
  document.addEventListener('mouseup',()=>{if(!dr)return;dr=false;document.body.style.userSelect='';document.body.style.cursor='';});
})();

// ── DEFAULT CODE ─────────────────────────────────────
// BUG FIX #1: Updated all version strings from v3 to v4
const DEFAULT_CODE=`from machine import Pin, ADC, PWM
import time

# ===================================================
#  Raspberry Pi Pico Simulator v4
#  - Pick components from the dropdown and click Add
#  - Click a pin dot, then another pin to draw a wire
#  - Scroll to zoom, middle-mouse drag to pan
#  - Right-click a component → Insert Code Snippet
# ===================================================

# Blink the built-in LED (GP25) and an external LED (GP0)
builtin = Pin(25, Pin.OUT)
led     = Pin(0,  Pin.OUT)

print("PicoSim v4 ready!")
print("Blinking GP0 and GP25...")

while True:
    led.on()
    builtin.on()
    time.sleep(0.5)
    led.off()
    builtin.off()
    time.sleep(0.5)
`;

// ── INIT ──────────────────────────────────────────────
window.addEventListener('load',()=>{
  editor=CodeMirror.fromTextArea(document.getElementById('editor'),{
    mode:'python',theme:'dracula',lineNumbers:true,indentUnit:4,
    smartIndent:true,indentWithTabs:false,matchBrackets:true,autoCloseBrackets:true,
    extraKeys:{'Tab':cm=>cm.replaceSelection('    ')}
  });
  editor.setValue(DEFAULT_CODE);
  drawPico();initLibs();updateInfo();applyVP();
  clog('PicoSim v4 ready 🟢','info');
  clog('Select a component → Add · Click pins to wire','info');

  // Demo: add LED and auto-wire to GP0
  setTimeout(()=>{
    addComp('led');
    const led=Object.values(comps)[0];
    if(!led)return;
    led.x=PICO_X+RPX+80;led.y=PICO_Y+20;renderComp(led);
    setTimeout(()=>{
      // GP0 → anode
      const f1=pinPos('pico','GP0'),t1=pinPos(led.id,'anode');
      const w1='w'+(nid++);
      const p1=S('path',{class:'wire',stroke:'#00e87a',d:wPath(f1.x,f1.y,t1.x,t1.y),id:w1,'data-wid':w1});
      p1.addEventListener('click',onWireClick);
      // BUG FIX #6: Add contextmenu handler to demo wires (same as user-created wires)
      p1.addEventListener('contextmenu',e=>{e.preventDefault();selWireF(w1);ctxCompId=null;showCtx(e);});
      document.getElementById('wires-layer').appendChild(p1);
      wires.push({id:w1,fc:'pico',fp:'GP0',tc:led.id,tp:'anode',color:'#00e87a',el:p1});
      // GND1 → cathode
      const f2=pinPos('pico','GND1'),t2=pinPos(led.id,'cathode');
      const w2='w'+(nid++);
      const p2=S('path',{class:'wire',stroke:'#666',d:wPath(f2.x,f2.y,t2.x,t2.y),id:w2,'data-wid':w2});
      p2.addEventListener('click',onWireClick);
      // BUG FIX #6: Add contextmenu handler to demo wires
      p2.addEventListener('contextmenu',e=>{e.preventDefault();selWireF(w2);ctxCompId=null;showCtx(e);});
      document.getElementById('wires-layer').appendChild(p2);
      wires.push({id:w2,fc:'pico',fp:'GND1',tc:led.id,tp:'cathode',color:'#666',el:p2});
      updateInfo();markWiredPins();
      clog('  Demo: LED auto-wired to GP0 + GND');
    },80);
  },140);
});
