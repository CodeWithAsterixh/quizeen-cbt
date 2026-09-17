import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

function isLocalhost(req: NextRequest): boolean {
  const host = req.headers.get('host') || '';
  return host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('::1');
}

export async function POST(req: NextRequest) {
  if (!isLocalhost(req)) {
    return NextResponse.json(
      { success: false, error: 'Build engine is restricted to local execution on your workstation.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const cbtRoot = process.env.CBT_PROJECT_ROOT || 'c:/Users/peter/Documents/quizeen/cbt-system-prototype';
    const tempConfigPath = path.join(cbtRoot, '.qzn-releases', `build-job-${Date.now()}.json`);
    fs.mkdirSync(path.dirname(tempConfigPath), { recursive: true });
    fs.writeFileSync(tempConfigPath, JSON.stringify(body, null, 2), 'utf8');

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const scriptPath = path.join(cbtRoot, 'scripts/build-whitelabel.js');
        const child = spawn('node', [scriptPath, `--config=${tempConfigPath}`], {
          cwd: cbtRoot,
          shell: true,
          env: { ...process.env },
        });

        child.stdout.on('data', (d) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ log: d.toString() })}\n\n`));
        });

        child.stderr.on('data', (d) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: d.toString() })}\n\n`));
        });

        child.on('close', (code) => {
          try { fs.unlinkSync(tempConfigPath); } catch {}
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ complete: true, exitCode: code })}\n\n`));
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Build initialization failed' }, { status: 500 });
  }
}
