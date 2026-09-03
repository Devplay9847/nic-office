# Generate ultra-accurate IN-SPACe logo SVG matching the user's uploaded image exactly

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 150" width="100%" height="100%">
  <defs>
    <!-- Sharp crisp rendering -->
    <style>
      .coral-in { fill: #D07474; }
      .navy-space { fill: #12458D; }
      .orbit-line { stroke: #12458D; fill: none; stroke-width: 3.2; stroke-linecap: round; }
    </style>
  </defs>

  <!-- BACKGROUND: Transparent or White -->
  
  <!-- ORBIT (Ellipse sweeping from below S/P, up past e, and looping over the top) -->
  <g id="inspace-orbit">
    <!-- Bottom arc swooping under SPACe -->
    <path d="M 230 102 C 235 116, 260 135, 340 135 C 430 135, 520 115, 545 75 C 555 58, 550 42, 530 32 C 490 14, 380 12, 280 40" 
          fill="none" stroke="#12458D" stroke-width="3.4" stroke-linecap="round" />
          
    <!-- Satellite on top-right orbit (around x=530, y=34) -->
    <g transform="translate(528, 33) rotate(-22)">
      <!-- Left solar panel array -->
      <rect x="-24" y="-2" width="6.5" height="4" fill="#12458D" rx="0.5" />
      <rect x="-15.5" y="-2" width="6.5" height="4" fill="#12458D" rx="0.5" />
      <line x1="-25" y1="0" x2="-8" y2="0" stroke="#12458D" stroke-width="1.2" />

      <!-- Center satellite body (coral pink) -->
      <ellipse cx="0" cy="0" rx="4.5" ry="6.5" fill="#D07474" />
      
      <!-- Right solar panel array -->
      <rect x="9" y="-2" width="6.5" height="4" fill="#12458D" rx="0.5" />
      <rect x="17.5" y="-2" width="6.5" height="4" fill="#12458D" rx="0.5" />
      <line x1="8" y1="0" x2="25" y2="0" stroke="#12458D" stroke-width="1.2" />
    </g>
  </g>

  <!-- LETTERING: IN- -->
  <g id="lettering-IN" fill="#D07474">
    <!-- 'I' with two vertical pillars -->
    <!-- Left pillar of I -->
    <rect x="38" y="52" width="7" height="48" />
    <!-- Right pillar of I -->
    <rect x="50" y="52" width="7" height="48" />

    <!-- 'N' -->
    <!-- Left vertical bar of N -->
    <rect x="68" y="52" width="7.5" height="48" />
    <!-- Diagonal of N (slanted slab) -->
    <polygon points="75.5,52 86,52 145,100 134.5,100" />
    <!-- Right vertical bar of N -->
    <rect x="137.5" y="52" width="7.5" height="48" />
  </g>

  <!-- HYPHEN '-' (Navy Blue) -->
  <rect x="157" y="72" width="15" height="8.5" fill="#12458D" rx="1" />

  <!-- LETTERING: SPACe (Navy Blue) -->
  <g id="lettering-SPACe" fill="#12458D">
    <!-- 'S' -->
    <path d="M 230 52 
             L 185 52 
             C 176 52, 172 56, 172 65 
             L 172 71 
             C 172 79, 177 82, 185 82 
             L 218 82 
             L 218 89 
             C 218 92, 214 93.5, 208 93.5 
             L 173 93.5 
             L 173 100 
             L 217 100 
             C 226 100, 230 96, 230 87 
             L 230 81 
             C 230 73, 225 70, 217 70 
             L 184 70 
             L 184 63 
             C 184 59.5, 188 58.5, 194 58.5 
             L 230 58.5 
             Z" />

    <!-- 'P' -->
    <path d="M 241 52 
             L 241 100 
             L 249.5 100 
             L 249.5 82 
             L 278 82 
             C 287 82, 292 77, 292 68 
             L 292 66 
             C 292 57, 287 52, 278 52 
             Z 
             M 249.5 58.5 
             L 276 58.5 
             C 281 58.5, 283.5 61, 283.5 66 
             L 283.5 68 
             C 283.5 73, 281 75.5, 276 75.5 
             L 249.5 75.5 
             Z" />

    <!-- 'A' - Supersonic Rocket Arrow (Navy Blue Main Arrow) -->
    <polygon points="348,22 301,100 338,100 348,78 358,100 395,100" />
    <!-- Bottom notch cutout inside the blue arrow -->
    <polygon points="348,46 324,93 348,77 372,93" fill="#ffffff" />
  </g>

  <!-- 'A' - Coral Pink Right Fin / Lower Delta Wing (Nested beneath the blue arrow right wing) -->
  <polygon points="364,74 388,93 372,93 348,77" fill="#D07474" />
  <!-- Lower trailing fin -->
  <polygon points="348,77 372,93 395,100 380,105 348,87" fill="#D07474" />

  <g fill="#12458D">
    <!-- 'C' -->
    <path d="M 458 58.5 
             L 423 58.5 
             C 416 58.5, 412 62, 412 69 
             L 412 83 
             C 412 90, 416 93.5, 423 93.5 
             L 458 93.5 
             L 458 100 
             L 421 100 
             C 410 100, 403.5 94, 403.5 83 
             L 403.5 69 
             C 403.5 58, 410 52, 421 52 
             L 458 52 
             Z" />

    <!-- 'e' (Lowercase) -->
    <path d="M 470 65 
             C 470 56, 477 52, 489 52 
             L 509 52 
             C 520 52, 526 57, 526 67 
             L 526 85 
             C 526 95, 520 100, 509 100 
             L 489 100 
             C 477 100, 470 95, 470 85 
             Z 
             M 479 72 
             L 517 72 
             L 517 67 
             C 517 61, 514 58.5, 508 58.5 
             L 489 58.5 
             C 483 58.5, 479 61.5, 479 67 
             Z 
             M 479 78 
             L 479 84 
             C 479 89.5, 483 93.5, 489 93.5 
             L 508 93.5 
             C 514 93.5, 517 90.5, 517 86 
             L 526 86 
             C 526 95, 520 100, 509 100 
             L 489 100 
             C 477 100, 470 95, 470 85 
             Z" />
  </g>
</svg>'''

with open('public/inspace_logo.svg', 'w') as f:
    f.write(svg_content)
print("SVG updated successfully")
