// The shaker-and-coupe animation from the design canvas. Pure markup so it
// prerenders; every motion is a CSS keyframe declared in global.css, and the
// global prefers-reduced-motion rule flattens all of them to a still frame.
export default function HeroPour({ svgRef }) {
  return (
    <svg className="hero__pour" ref={svgRef} viewBox="50 8 300 528" aria-hidden="true">
      <defs>
        <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2a756" />
          <stop offset="55%" stopColor="#c67139" />
          <stop offset="100%" stopColor="#8f4a22" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c67139" stopOpacity=".85" />
          <stop offset="100%" stopColor="#c67139" stopOpacity="0" />
        </radialGradient>
        <clipPath id="bowl">
          <path d="M104 214 H296 C296 214 288 330 200 356 C112 330 104 214 104 214 Z" />
        </clipPath>
      </defs>

      <ellipse cx="200" cy="330" rx="150" ry="86" fill="url(#halo)" className="pour__halo" />

      <g className="pour__shaker">
        <rect x="188" y="98" width="24" height="20" rx="7" fill="rgba(224,162,96,.12)" stroke="rgba(224,162,96,.85)" strokeWidth="2.8" />
        <path d="M172 150 C172 130 182 120 190 118 H210 C218 120 228 130 228 150 Z" fill="rgba(224,162,96,.1)" stroke="rgba(224,162,96,.85)" strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M170 152 H230 L226 234 C226 242 217 247 200 247 C183 247 174 242 174 234 Z" fill="rgba(224,162,96,.08)" stroke="rgba(224,162,96,.85)" strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M170 152 H230" stroke="rgba(246,239,228,.5)" strokeWidth="3" strokeLinecap="round" />
        <path d="M186 172 V228" stroke="rgba(246,239,228,.22)" strokeWidth="4" strokeLinecap="round" />
      </g>

      <g className="pour__stream">
        <path d="M200 112 V212" stroke="url(#liq)" strokeWidth="7" strokeLinecap="round" opacity=".9" />
        <path className="pour__streamDash" d="M200 112 V212" stroke="rgba(246,239,228,.75)" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 26" />
      </g>

      <circle className="pour__drip" cx="212" cy="150" r="3.4" fill="#e2a756" />

      <g clipPath="url(#bowl)">
        <rect className="pour__fill" x="96" y="206" width="208" height="160" fill="url(#liq)" />
        <circle className="pour__bubble pour__bubble--1" cx="164" cy="300" r="4" fill="rgba(246,239,228,.5)" />
        <circle className="pour__bubble pour__bubble--2" cx="196" cy="312" r="3" fill="rgba(246,239,228,.45)" />
        <circle className="pour__bubble pour__bubble--3" cx="228" cy="304" r="3.6" fill="rgba(246,239,228,.4)" />
        <g className="pour__ice pour__ice--1">
          <rect x="156" y="236" width="46" height="46" rx="9" fill="rgba(246,239,228,.3)" stroke="rgba(246,239,228,.66)" strokeWidth="2.6" />
        </g>
        <g className="pour__ice pour__ice--2">
          <rect x="212" y="246" width="40" height="40" rx="8" fill="rgba(246,239,228,.22)" stroke="rgba(246,239,228,.54)" strokeWidth="2.6" />
        </g>
        <path className="pour__surface" d="M104 226 C 140 214, 168 238, 200 228 S 268 212, 296 226 V214 H104 Z" fill="rgba(246,239,228,.4)" />
      </g>

      <ellipse className="pour__ring pour__ring--1" cx="182" cy="230" rx="30" ry="9" fill="none" stroke="rgba(246,239,228,.75)" strokeWidth="2.6" />
      <ellipse className="pour__ring pour__ring--2" cx="234" cy="232" rx="26" ry="8" fill="none" stroke="rgba(246,239,228,.6)" strokeWidth="2.4" />
      <circle className="pour__fly pour__fly--a" cx="172" cy="226" r="4.6" fill="#f2c48c" />
      <circle className="pour__fly pour__fly--b" cx="192" cy="224" r="3.6" fill="#e2a756" />
      <circle className="pour__fly pour__fly--c" cx="236" cy="228" r="3.8" fill="#f2c48c" />

      <path className="pour__glass" d="M104 214 H296 C296 214 288 330 200 356 C112 330 104 214 104 214 Z" fill="none" stroke="rgba(224,162,96,.8)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M96 210 H304" stroke="rgba(246,239,228,.55)" strokeWidth="3" strokeLinecap="round" />
      <path d="M200 356 V498" stroke="rgba(224,162,96,.8)" strokeWidth="3" strokeLinecap="round" />
      <path d="M148 506 C 168 496, 232 496, 252 506" fill="none" stroke="rgba(224,162,96,.8)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="200" cy="520" rx="76" ry="9" fill="rgba(198,113,57,.18)" />

      <g className="pour__peel">
        <circle cx="274" cy="208" r="30" fill="rgba(226,167,86,.6)" stroke="#f2c48c" strokeWidth="3.4" />
        <path d="M274 180 V236 M248 194 L300 222 M248 222 L300 194" stroke="rgba(246,239,228,.8)" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="274" cy="208" r="19" fill="none" stroke="rgba(246,239,228,.85)" strokeWidth="3" />
      </g>
    </svg>
  )
}
