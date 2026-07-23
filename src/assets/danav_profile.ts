// Danav J - Default Realtor Profile Photo (Data URL SVG)
// Matches the young Indian realtor with black hair, light mustache/beard, and light blue linen shirt with pocket
export const DEFAULT_DANAV_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
  <defs>
    <!-- Background Gradient (Soft luxury modern interior) -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5f3ef"/>
      <stop offset="50%" stop-color="#e8e4de"/>
      <stop offset="100%" stop-color="#d9d4cd"/>
    </linearGradient>

    <!-- Interior Blur Accents -->
    <radialGradient id="softLight" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#e2ddd5" stop-opacity="0"/>
    </radialGradient>

    <!-- Skin Tone Gradient (Warm South Asian tone) -->
    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e2a87c"/>
      <stop offset="50%" stop-color="#d49466"/>
      <stop offset="100%" stop-color="#c18153"/>
    </linearGradient>

    <!-- Skin Shadow -->
    <linearGradient id="skinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#b67344" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#8c5028" stop-opacity="0.8"/>
    </linearGradient>

    <!-- Shirt Linen Texture Color -->
    <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#bce3f7"/>
      <stop offset="40%" stop-color="#a4d7f5"/>
      <stop offset="100%" stop-color="#8bc9ee"/>
    </linearGradient>
    
    <linearGradient id="shirtFold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#73bce8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#4ea3db" stop-opacity="0.2"/>
    </linearGradient>

    <!-- Hair Color & Volume Gradient -->
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a282a"/>
      <stop offset="30%" stop-color="#181719"/>
      <stop offset="100%" stop-color="#0d0c0e"/>
    </linearGradient>
  </defs>

  <!-- Background Layer -->
  <rect width="800" height="1200" fill="url(#bgGrad)"/>
  <rect width="800" height="1200" fill="url(#softLight)"/>

  <!-- Soft Interior Bokeh Accents in Background -->
  <circle cx="200" cy="300" r="180" fill="#ffffff" opacity="0.25" filter="blur(20px)" />
  <rect x="520" y="220" width="220" height="350" rx="20" fill="#c8c2b9" opacity="0.3" />
  <rect x="80" y="450" width="150" height="200" rx="15" fill="#bbb4a8" opacity="0.25" />

  <!-- Body / Torso (Light Blue Linen Shirt) -->
  <g id="shirt">
    <!-- Shoulders & Chest -->
    <path d="M 120 1200 L 150 780 C 220 720 310 680 400 680 C 490 680 580 720 650 780 L 680 1200 Z" fill="url(#shirtGrad)"/>
    
    <!-- Chest Folds & Shading -->
    <path d="M 220 750 C 280 820 340 900 370 1200" stroke="url(#shirtFold)" stroke-width="8" fill="none" opacity="0.7"/>
    <path d="M 580 750 C 520 820 460 900 430 1200" stroke="url(#shirtFold)" stroke-width="8" fill="none" opacity="0.7"/>

    <!-- Left Chest Pocket (Viewer's Right) -->
    <path d="M 490 850 L 580 850 L 575 960 C 530 980 535 980 495 960 Z" fill="#9cd2f2" stroke="#7bbfe7" stroke-width="3" opacity="0.9"/>
    <line x1="490" y1="850" x2="580" y2="850" stroke="#68b4e2" stroke-width="4"/>

    <!-- Center Button Placket -->
    <rect x="382" y="680" width="36" height="520" fill="#a0d5f4" stroke="#79c2eb" stroke-width="2"/>
    
    <!-- White Shirt Buttons -->
    <circle cx="400" cy="790" r="8" fill="#ffffff" stroke="#c0d8e8" stroke-width="2"/>
    <circle cx="400" cy="920" r="8" fill="#ffffff" stroke="#c0d8e8" stroke-width="2"/>
    <circle cx="400" cy="1050" r="8" fill="#ffffff" stroke="#c0d8e8" stroke-width="2"/>

    <!-- Shirt Collar (Open V-neck) -->
    <!-- Left Collar Piece -->
    <path d="M 280 670 L 370 680 L 320 760 L 250 720 Z" fill="#c9e8f9" stroke="#8ac5ea" stroke-width="3"/>
    <!-- Right Collar Piece -->
    <path d="M 520 670 L 430 680 L 480 760 L 550 720 Z" fill="#c9e8f9" stroke="#8ac5ea" stroke-width="3"/>
  </g>

  <!-- Neck -->
  <g id="neck">
    <path d="M 320 540 L 480 540 L 470 690 L 330 690 Z" fill="url(#skinGrad)"/>
    <!-- Neck Shadow under chin -->
    <path d="M 320 540 C 400 600 400 600 480 540 L 470 620 C 400 650 400 650 330 620 Z" fill="url(#skinShadow)"/>
  </g>

  <!-- Head & Face Structure -->
  <g id="head">
    <!-- Ears -->
    <ellipse cx="270" cy="440" rx="22" ry="38" fill="url(#skinGrad)"/>
    <ellipse cx="530" cy="440" rx="22" ry="38" fill="url(#skinGrad)"/>
    <path d="M 272 420 C 265 440 275 460 270 470" stroke="#b17246" stroke-width="3" fill="none"/>
    <path d="M 528 420 C 535 440 525 460 530 470" stroke="#b17246" stroke-width="3" fill="none"/>

    <!-- Main Head Oval / Jawline -->
    <path d="M 285 340 C 285 240 515 240 515 340 C 515 450 480 570 400 570 C 320 570 285 450 285 340 Z" fill="url(#skinGrad)"/>

    <!-- Cheeks & Nose Shading -->
    <path d="M 370 380 L 400 470 L 430 380" fill="none" opacity="0.15"/>
    <path d="M 385 470 C 400 482 400 482 415 470" stroke="#9e5c32" stroke-width="4" fill="none" stroke-linecap="round"/>

    <!-- Eyes -->
    <!-- Left Eye -->
    <g transform="translate(325, 390)">
      <ellipse cx="25" cy="12" rx="24" ry="14" fill="#ffffff"/>
      <ellipse cx="25" cy="12" rx="12" ry="12" fill="#2b1a0e"/>
      <circle cx="25" cy="12" r="6" fill="#000000"/>
      <circle cx="28" cy="9" r="3" fill="#ffffff"/>
      <path d="M 0 12 C 10 0 40 0 50 12" stroke="#2a180d" stroke-width="4" fill="none"/>
    </g>
    <!-- Right Eye -->
    <g transform="translate(425, 390)">
      <ellipse cx="25" cy="12" rx="24" ry="14" fill="#ffffff"/>
      <ellipse cx="25" cy="12" rx="12" ry="12" fill="#2b1a0e"/>
      <circle cx="25" cy="12" r="6" fill="#000000"/>
      <circle cx="28" cy="9" r="3" fill="#ffffff"/>
      <path d="M 0 12 C 10 0 40 0 50 12" stroke="#2a180d" stroke-width="4" fill="none"/>
    </g>

    <!-- Eyebrows (Dark, natural arch) -->
    <path d="M 320 375 C 345 360 370 365 385 378" stroke="#1c130d" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M 480 375 C 455 360 430 365 415 378" stroke="#1c130d" stroke-width="8" stroke-linecap="round" fill="none"/>

    <!-- Lips -->
    <path d="M 365 510 C 385 502 415 502 435 510 C 415 528 385 528 365 510 Z" fill="#b36959"/>
    <line x1="365" y1="510" x2="435" y2="510" stroke="#7a3a2d" stroke-width="3"/>

    <!-- Facial Hair: Neat Mustache & Chin Beard / Stubble -->
    <!-- Mustache -->
    <path d="M 362 494 C 385 484 400 492 400 495 C 400 492 415 484 438 494 C 420 505 380 505 362 494 Z" fill="#1f1814"/>
    <!-- Chin Beard / Stubble along jawline -->
    <path d="M 340 520 C 360 558 440 558 460 520 C 470 550 430 572 400 572 C 370 572 330 550 340 520 Z" fill="#1f1814" opacity="0.85"/>
  </g>

  <!-- Hair (Black, Voluminous Textured Top) -->
  <g id="hair">
    <!-- Main Hair Base Volume -->
    <path d="M 265 350 
             C 250 250 270 160 350 140 
             C 400 125 460 135 500 160 
             C 550 190 550 270 535 350 
             C 520 300 510 250 480 220 
             C 440 190 360 190 320 220 
             C 290 250 280 300 265 350 Z" fill="url(#hairGrad)"/>
             
    <!-- Textured Hair Strands Top -->
    <path d="M 280 240 C 310 170 370 140 420 150 C 480 160 520 200 530 260" stroke="#3d383b" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M 310 200 C 350 150 430 130 470 170" stroke="#4a4448" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M 340 170 C 380 135 430 145 460 180" stroke="#221e21" stroke-width="14" stroke-linecap="round" fill="none"/>
    
    <!-- Sideburns -->
    <path d="M 275 340 L 285 410 L 295 410 L 290 340 Z" fill="#1a1410"/>
    <path d="M 525 340 L 515 410 L 505 410 L 510 340 Z" fill="#1a1410"/>
  </g>
</svg>
`)}`;
