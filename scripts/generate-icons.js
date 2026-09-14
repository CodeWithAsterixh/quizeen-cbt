const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SVG_CONTENT = `<svg width="138" height="138" viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="138" height="138" rx="69" fill="#212121"/>
<g filter="url(#filter0_d_1_10)">
<rect x="23.5" y="13.5" width="90" height="90" fill="url(#pattern0_1_10)"/>
<rect x="23.5" y="34.5" width="90" height="90" fill="url(#pattern1_1_10)"/>
<rect x="24.5" y="26.5" width="90" height="90" fill="url(#pattern2_1_10)"/>
</g>
<defs>
<filter id="filter0_d_1_10" x="20.5" y="12.5" width="99" height="119" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1" dy="3"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_10"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_10" result="shape"/>
</filter>
<pattern id="pattern0_1_10" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_1_10" transform="scale(0.0111111)"/>
</pattern>
<pattern id="pattern1_1_10" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image1_1_10" transform="scale(0.0111111)"/>
</pattern>
<pattern id="pattern2_1_10" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image2_1_10" transform="scale(0.0111111)"/>
</pattern>
<image id="image0_1_10" width="90" height="90" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADz0lEQVR4nO2bOWgWURRG44JGBRELRYSoaBltjIVgYScxYmeTwgVEiLg0EUyXyqideyoVIY117A3BJRZujYUYFURE40ZcUXLk4aiDJP/Mm3dvZrsHAiGZzLv3zPJevvmnqckwDMMwDMOIAOYCh4DbwKfoy31/0P3uz3ZGAMBy4D5Tc89tEzJG7eH3mdxIcly2ndlZiW4XaTmQeaC6A4x4iL6Vd72lBRj3ED2ed72lBXjrIXos73pLC3DDQ/Rw3vWWFmCvh+g9eddb9uXd7RSSb9nyLlz20oTVhzsQS2QObc0BZgFDk0h2P5uVd31VO6u/TCL6G7As7/oqA3C8wa2jL+/6KgGwEHjfQPRHYFFTGSlSLAn0kExP6fwUKZYEmoFXKUS7bZqnqaZwP0WLJYEu0tM1DfXI+ClSLAnMBp541OO2na1ck4yfIsWSQCf+dCrXJOOnKLEkMAO4m0H0A/e3inXJ+PHc0RvFhraRnQ7FusY86vgodWkMKTY0THaGC1JXw1uHWwemZZdSM5sIZ5NSbbulJsO50dIkiR9Aq1Izg4QzqFRba9R7Es7hnDQL8jSyP0frXLHJB1gHTAiIdvtYJzw5d0U9p5Gc7h86dzTcqR8F6kkTpDsDlwo1NIAcA4LJYdJV5hzdjJzNCRnsSMJAr4HtgQ2tSnlZpuUnsCawpi3Ay4RxukPGyDoJXAEWZBzjPPKcy1jLPOBUytvYzixjTDVwh0dzj4D1QsF+KF99HwwAa4GHHmO0ewttMPgGzwbdLaA37WMmoA89jnlMeIeB7577bwsWHCtiZcYm3QSxOjDYDyXxwQDQAlzPuP8WSdHzAxvdFxjsh3K0wfg7gHcB+54vJjoqKM0ashFXgcWTBPtJs7oE7sHAvEmuJDd5hyAfrAHPBBp+DmyO7XM/08ffBwPARs+seypGNUTfQYaJaOnkbkePmT5GoyuoN1pjSzCiIfoasrwQ3l8eY8pnKsBl4SKrwEUN0Sfz7qqAnNAQnZR31JHuvEPvurBTQ7RP3lEX2jVE++YddaBNQ3TWvKPKtGiIDsk7qopsziGYd1QJvfcagad5d1cgRjVFS+UdVWBEU7R03lFmBjVFX8q7u0rnHDHRlndo5hwx0ZZ3aOYcMdGWdyh/yPOP6K2xgepOu6Zoyzs0c46YaMs7/rFCU7TlHdo5h2EYhmEYhj7Rsu4c8CG2vKk774Gz/39KNVR0f95dFZh+Kckzld4vqQruOepME10W0dFZbbeOqbkgIjn23t0Z5Zd6yoZ77+W06GRoGIZhGIZhGIZhGIZhGIbRVFl+AbXVWHtuTDaCAAAAAElFTkSuQmCC"/>
<image id="image1_1_10" width="90" height="90" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEH0lEQVR4nO2dTYhVZRjHj+ZHQYoahAihtIgM2iQpglBptapFAy1aTuXoQIO0UkeUAgMHoqRw0wdE1CJpFzZlMEFNBSVJYIsS+9LKxUyB0IfR8IuX+Q/cBufcc+899znnXv8/uLvzvu/z/OblvOdcmP/NMmOMMcYYY4wxxpirAGAZMAb8wiyXgN+Ai8A5fb4ETgGfACeBN4GjwCgwCDwAbAZuApZnNQO4VrVtUa2Dqv2oejmp3k6p17m+L8pFcpL4GTiSnLVTRBpYJjPAd8A48DywG9gOrOuKxf/3sk5r7ZbEcdWSaiqTI+0UN7eTI/gVeAfYC2xLO60DqUuATcAe4HXg+8g+2im4Sv4C3gOeADYUqHWDrn1fYyuj10TPJ90nH2vc6cB1wOPAp9SIXhc9x3lglz4XqCFlir4D2ArcCwwAjwBDwJPAfh10bwAfAl8D09SfadU6odqfA/appyH1OKCet8pBd0W3PNHsXMuB9cAOYLjh5D/XhZP/SsxorXGtPaxa1rf72Fman9Imar7OSuA+4BDwLvB7CWLTHCeAg5p7ZRfq7twPsDRK9AKPZ3cDzwLftiD3G41JY5dkXSanjqVFJ1irU74S0fPRm+UrOY29nK7JgsmpZzI5LLKT04ULEtbJPHqlHvFZ7r1fj025hHbTQK/U08DOvMFNH/5Du2mgV+ppYDJvcPpGyqLLET3dyeDa7aCsZvUUqs2ii2PRQVh0EBYdhEUHYdFBWHQQFh2ERQdh0UFYdBAWHYRFB2HRQVh0EBYdhEUHYdFBWHQQFh2ERQdh0UFYdBAWHYRFB2HRQVh0EBYdhEUHYdFBWHQQFh2ERQdh0UFYdBAWHYRFB2HR/SJaiVkTimQ4DrwGHAOeBkaUbZEiGm4HVne7say8+Ver5h3qYUQ9HVOPx9XzhBx0XXSrXALOKNbhRWVlbG/6j+kFa2txjrVae1i1nFBtc7FqpRItulmuxgfAU8CDwJqyRAPXK3Fsj3ZjyqoLJU/0n1TLjHbYS8BDSVZR0RI7oLFngpJt8vgjT/RX1Iu/FbGW7pcLMaJr0rV14nSe6ANVV9dHjOaJXqEoSdMZKShrxYKiJfs24McOF7qa+QHYmCt53jPlmAL9TDEuKDh3VSHJV5C+BrgFuFMBew8rqnKvMuTeAj4GzgKX6R8u6xaQMqbeBl5Q5PGQHNyvOOSNwA1ZJMBihfbdoz/GmLLsfqK+nNcbX6p1p15oUqjsNVkvAqwC7lKsZoownqpA6pTWHlU+XmlfEdQWYBFwq1LIX9Wtp2zOau5BrbWo6r5rAXCzXpnTa/k/bYj9V1/4pFf6TVX30xMwewgfbkHyM3nflZgc0oEEfFFA8uc9e3jVbGdPNpF8Y9V19tNPlQwCH+nJYUrP7o+29ZMcxhhjjDFZv/IfqYB2gf7voVcAAAAASUVORK5CYII="/>
<image id="image2_1_10" width="90" height="90" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADgklEQVR4nO3dS6xdUxgA4HVRlGBSYUJj4F2M2jBom4hHE2IgSCeGxGNi0HpFRCIeA8QUQRqReA9oIql3Gqm3hDREGJgIbokgqNcnK2cPmpuQc/ba7jrrnP+b3sH6///sc/Za/15r35RCCCGEEEIIIYwPq3Ep7sSzeBtf4Xv8buRHfIfd2IEHcDXOxAETDDdfcAbuwafK/dB9QPnDOjjNOyzgYrzr/5O/BbfjyDSPsBbvWz4/YStWpHmA/XEH/lTHhzghzTIchhfVl2+km9IswuF40/TIs5dL0gz+XLxk+vyGjWlW4G7T6xsclVqHdRVvfON6Ls3APPk9bWj3JwQXDPhb+haexxPYjg8G/qa8klo1wA3wDVyEQ/5jurgZuwYo9N84PrUGx+Cvnkn/jMsn/Im6Er8UFvvm1Bpc2zPZX7G+55jnY29BoV9PrcHTPZO9qnDc2wr7IQupJfiyR6If58VN4bgruzZpX8emVuDQ7uYyqesGGv/xgkKvTa3AyT2TPG6g8W8pKPTZqRU4q+dNcKHyjTjbkFqBc3sk+PmA499YUOjThopj5uGRgkIfXTv+JhgtXr7oWeSva8ffDKNFS1/ba8ffBByETwoKfU3tHKYe9sOTBUXOS/dVtfOYakarwaeU2VY7j6mGkwbYgJPn8Ktr5zLND3y3dkUqdWvtfKZ5ib/LMF4ubWTNHKzo+hj50dYQds/tnrx/gxPxkeHkaWCsAveFCwt7zEu9GlfyErhswKfduUd+b2xUXwLn7bPDv9RnTbVAlwtW5SbPAAXe220TXlk7p6mEbQMU+bV8E62dy7QfFvqjoMB5+rcl9z9q5zLVcFdBkRf77guZO/qfbcnH4U6tHX8TcETPrWR56nZO7fhbO2/Yx2O1Y28KNvUqM+tqx97iSrDPoc229szVZrQfelI7a8fd6rJ7Ui/Ujrs52DBxmXmmdtytnhGfVBQ6hBBCCCGEEGYS1uC+7lUUi90DgT3dmw3ux+m1Y5yF/c4PjXEoNP/90XyAtHbMrW5k3NHjdRMH1o69KbhBPzfVjr21q3lPwRPw+XhLYymsVyb2c4yje4tMiSvGGmjeGZ1JKXF97RyaIK7oZSv0xsIrOvY/TzDryLMHPfd2xKxjXDGPXiZiZbjsvY4Hx+x1PBy9jvKCn9L9J4t38G3XvVvsunm5q7dmmI82hBBCCCGEENL8+geWsocFIGNfNgAAAABJRU5ErkJggg=="/>
</defs>
</svg>`;

function createDib(img, size) {
  const resized = img.resize({ width: size, height: size, quality: 'best' });
  const raw = resized.toBitmap();

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(0, 16);
  header.writeUInt32LE(size * size * 4, 20);

  const rowBytes = size * 4;
  const pixels = Buffer.alloc(size * rowBytes);
  for (let y = 0; y < size; y++) {
    const srcY = y;
    const dstY = size - 1 - y;
    raw.copy(pixels, dstY * rowBytes, srcY * rowBytes, (srcY + 1) * rowBytes);
  }

  const maskRowBytes = Math.ceil(size / 32) * 4;
  const andMask = Buffer.alloc(maskRowBytes * size, 0);

  return Buffer.concat([header, pixels, andMask]);
}

function makeMultiResolutionIco(img) {
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const items = sizes.map(s => {
    if (s === 256) {
      const png = img.resize({ width: 256, height: 256, quality: 'best' }).toPNG();
      return { size: s, data: png, isPng: true };
    }
    const dib = createDib(img, s);
    return { size: s, data: dib, isPng: false };
  });

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(items.length, 4);

  const entries = Buffer.alloc(items.length * 16);
  let offset = 6 + items.length * 16;
  const buffers = [header, entries];

  items.forEach((item, idx) => {
    const w = item.size >= 256 ? 0 : item.size;
    const h = item.size >= 256 ? 0 : item.size;
    const off = idx * 16;
    entries.writeUInt8(w, off);
    entries.writeUInt8(h, off + 1);
    entries.writeUInt8(0, off + 2);
    entries.writeUInt8(0, off + 3);
    entries.writeUInt16LE(1, off + 4);
    entries.writeUInt16LE(32, off + 6);
    entries.writeUInt32LE(item.data.length, off + 8);
    entries.writeUInt32LE(offset, off + 12);
    offset += item.data.length;
    buffers.push(item.data);
  });

  return Buffer.concat(buffers);
}

function saveAppIcons(nativeImg) {
  const png256 = nativeImg.resize({ width: 256, height: 256, quality: 'best' }).toPNG();
  const icoBuf = makeMultiResolutionIco(nativeImg);
  const root = path.resolve(__dirname, '..');
  const targets = [
    path.join(root, 'apps', 'manager', 'resources'),
    path.join(root, 'apps', 'student', 'resources'),
    path.join(root, 'apps', 'server', 'resources'),
  ];

  targets.forEach((resDir) => {
    fs.mkdirSync(resDir, { recursive: true });
    fs.writeFileSync(path.join(resDir, 'icon.png'), png256);
    fs.writeFileSync(path.join(resDir, 'icon.ico'), icoBuf);
    fs.writeFileSync(path.join(resDir, 'icon.svg'), SVG_CONTENT, 'utf8');
    console.log(`Generated icons in ${resDir}`);
  });

  const publicDirs = [
    path.join(root, 'apps', 'manager', 'public'),
    path.join(root, 'apps', 'student', 'public'),
    path.join(root, 'apps', 'server', 'public'),
  ];
  publicDirs.forEach((pDir) => {
    fs.mkdirSync(pDir, { recursive: true });
    fs.writeFileSync(path.join(pDir, 'icon.png'), png256);
  });
  console.log('App icons successfully generated.');
}

if (process.versions.electron) {
  const { app, BrowserWindow } = require('electron');
  app.whenReady().then(async () => {
    const win = new BrowserWindow({
      width: 512,
      height: 512,
      show: false,
      transparent: true,
      frame: false,
      webPreferences: { offscreen: true },
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 512px;
              height: 512px;
              overflow: hidden;
              background: transparent;
            }
            svg {
              width: 512px;
              height: 512px;
              display: block;
            }
          </style>
        </head>
        <body>
          ${SVG_CONTENT}
        </body>
      </html>
    `;

    await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    await new Promise((r) => setTimeout(r, 800));

    const image = await win.webContents.capturePage({ x: 0, y: 0, width: 512, height: 512 });
    saveAppIcons(image);
    app.quit();
  });
} else {
  const electronBin = require('electron');
  const res = spawnSync(electronBin, [__filename], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error('Failed to generate icons with Electron');
    process.exit(res.status || 1);
  }
}
