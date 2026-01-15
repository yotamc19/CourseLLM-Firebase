'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Cpu, HardDrive, Clock, Server, Activity } from 'lucide-react';

interface Metrics {
  timestamp: string;
  process: {
    uptime: number;
    uptimeFormatted: string;
    memory: {
      heapUsed: number;
      heapUsedMB: string;
      heapTotal: number;
      heapTotalMB: string;
      rss: number;
      rssMB: string;
      external: number;
      externalMB: string;
    };
    cpu: {
      user: number;
      userMs: string;
      system: number;
      systemMs: string;
    };
    pid: number;
    nodeVersion: string;
  };
  system: {
    platform: string;
    arch: string;
    hostname: string;
    cpuCount: number;
    cpuModel: string;
    loadAverage: {
      '1min': string;
      '5min': string;
      '15min': string;
    };
    memory: {
      total: number;
      totalGB: string;
      free: number;
      freeGB: string;
      used: number;
      usedGB: string;
      usagePercent: string;
    };
  };
}

interface MetricHistory {
  timestamp: string;
  heapUsedMB: number;
  rssMB: number;
  systemMemoryPercent: number;
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [history, setHistory] = useState<MetricHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(2000);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data: Metrics = await response.json();
      setMetrics(data);
      setError(null);

      // Add to history (keep last 30 data points)
      setHistory(prev => {
        const newEntry: MetricHistory = {
          timestamp: data.timestamp,
          heapUsedMB: parseFloat(data.process.memory.heapUsedMB),
          rssMB: parseFloat(data.process.memory.rssMB),
          systemMemoryPercent: parseFloat(data.system.memory.usagePercent),
        };
        const updated = [...prev, newEntry];
        return updated.slice(-30);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getMemoryColor = (percent: number) => {
    if (percent < 50) return 'bg-green-500';
    if (percent < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">Real-time CPU and memory metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Refresh:</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={1000}>1s</option>
              <option value={2000}>2s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
            </select>
          </div>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          {!autoRefresh && (
            <Button size="sm" onClick={fetchMetrics}>
              Refresh
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {metrics && (
        <>
          {/* Status Bar */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2">
              <Activity className="h-3 w-3 text-green-500" />
              Server Online
            </Badge>
            <Badge variant="outline">PID: {metrics.process.pid}</Badge>
            <Badge variant="outline">Node {metrics.process.nodeVersion}</Badge>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Process Uptime */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.process.uptimeFormatted}</div>
                <p className="text-xs text-muted-foreground">{metrics.process.uptime} seconds</p>
              </CardContent>
            </Card>

            {/* Process Memory (Heap) */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Heap Memory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.process.memory.heapUsedMB} MB</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Used</span>
                    <span>{metrics.process.memory.heapTotalMB} MB total</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getMemoryColor(
                        (parseFloat(metrics.process.memory.heapUsedMB) /
                          parseFloat(metrics.process.memory.heapTotalMB)) *
                          100
                      )}`}
                      style={{
                        width: `${
                          (parseFloat(metrics.process.memory.heapUsedMB) /
                            parseFloat(metrics.process.memory.heapTotalMB)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Memory (RSS) */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  RSS Memory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.process.memory.rssMB} MB</div>
                <p className="text-xs text-muted-foreground">
                  External: {metrics.process.memory.externalMB} MB
                </p>
              </CardContent>
            </Card>

            {/* CPU Time */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  CPU Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.process.cpu.userMs} ms</div>
                <p className="text-xs text-muted-foreground">
                  System: {metrics.process.cpu.systemMs} ms
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>System Resources</CardTitle>
              <CardDescription>
                {metrics.system.hostname} - {metrics.system.platform} ({metrics.system.arch})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Memory */}
                <div>
                  <h4 className="font-medium mb-2">System Memory</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>
                        {metrics.system.memory.usedGB} GB / {metrics.system.memory.totalGB} GB
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getMemoryColor(
                          parseFloat(metrics.system.memory.usagePercent)
                        )}`}
                        style={{ width: `${metrics.system.memory.usagePercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{metrics.system.memory.usagePercent}% used</span>
                      <span>{metrics.system.memory.freeGB} GB free</span>
                    </div>
                  </div>
                </div>

                {/* CPU Info */}
                <div>
                  <h4 className="font-medium mb-2">CPU</h4>
                  <div className="space-y-2">
                    <p className="text-sm truncate" title={metrics.system.cpuModel}>
                      {metrics.system.cpuModel}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {metrics.system.cpuCount} cores
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-muted rounded p-2">
                        <div className="text-lg font-semibold">
                          {metrics.system.loadAverage['1min']}
                        </div>
                        <div className="text-xs text-muted-foreground">1 min</div>
                      </div>
                      <div className="bg-muted rounded p-2">
                        <div className="text-lg font-semibold">
                          {metrics.system.loadAverage['5min']}
                        </div>
                        <div className="text-xs text-muted-foreground">5 min</div>
                      </div>
                      <div className="bg-muted rounded p-2">
                        <div className="text-lg font-semibold">
                          {metrics.system.loadAverage['15min']}
                        </div>
                        <div className="text-xs text-muted-foreground">15 min</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Memory History Chart (Simple ASCII-style) */}
          <Card>
            <CardHeader>
              <CardTitle>Memory History</CardTitle>
              <CardDescription>Last {history.length} data points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end gap-1">
                {history.map((entry, index) => {
                  const maxHeap = Math.max(...history.map((h) => h.heapUsedMB), 1);
                  const height = (entry.heapUsedMB / maxHeap) * 100;
                  return (
                    <div
                      key={index}
                      className="flex-1 bg-blue-500 rounded-t transition-all duration-300"
                      style={{ height: `${height}%` }}
                      title={`${entry.heapUsedMB.toFixed(1)} MB at ${new Date(
                        entry.timestamp
                      ).toLocaleTimeString()}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Heap Memory (MB)</span>
                <span>
                  Current: {history[history.length - 1]?.heapUsedMB.toFixed(1) || 0} MB
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
