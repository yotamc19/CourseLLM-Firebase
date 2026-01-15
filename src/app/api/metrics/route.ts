import { NextResponse } from 'next/server';
import os from 'os';

/**
 * API endpoint that returns system metrics for monitoring
 * GET /api/metrics
 */
export async function GET() {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const uptime = process.uptime();

  // Get system-level metrics
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const cpus = os.cpus();

  // Calculate CPU load average (1, 5, 15 minutes)
  const loadAvg = os.loadavg();

  // Calculate average CPU usage across all cores
  const cpuCount = cpus.length;
  const cpuModel = cpus[0]?.model || 'Unknown';

  const metrics = {
    timestamp: new Date().toISOString(),

    // Process metrics (Next.js server)
    process: {
      uptime: Math.floor(uptime),
      uptimeFormatted: formatUptime(uptime),
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
        heapTotal: memoryUsage.heapTotal,
        heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
        rss: memoryUsage.rss,
        rssMB: (memoryUsage.rss / 1024 / 1024).toFixed(2),
        external: memoryUsage.external,
        externalMB: (memoryUsage.external / 1024 / 1024).toFixed(2),
      },
      cpu: {
        user: cpuUsage.user,
        userMs: (cpuUsage.user / 1000).toFixed(2),
        system: cpuUsage.system,
        systemMs: (cpuUsage.system / 1000).toFixed(2),
      },
      pid: process.pid,
      nodeVersion: process.version,
    },

    // System metrics (host machine)
    system: {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpuCount,
      cpuModel,
      loadAverage: {
        '1min': loadAvg[0]?.toFixed(2) || '0',
        '5min': loadAvg[1]?.toFixed(2) || '0',
        '15min': loadAvg[2]?.toFixed(2) || '0',
      },
      memory: {
        total: totalMemory,
        totalGB: (totalMemory / 1024 / 1024 / 1024).toFixed(2),
        free: freeMemory,
        freeGB: (freeMemory / 1024 / 1024 / 1024).toFixed(2),
        used: totalMemory - freeMemory,
        usedGB: ((totalMemory - freeMemory) / 1024 / 1024 / 1024).toFixed(2),
        usagePercent: (((totalMemory - freeMemory) / totalMemory) * 100).toFixed(1),
      },
    },
  };

  return NextResponse.json(metrics);
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}
