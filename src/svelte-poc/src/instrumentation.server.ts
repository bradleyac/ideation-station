// src/instrumentation.server.js (or .ts)
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { env } from '$env/dynamic/private';

// The connection string is picked up from the APPLICATIONINSIGHTS_CONNECTION_STRING environment variable
// automatically by the Azure Monitor exporter if not explicitly provided in the options.
const exporterOptions = {
  connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING
};

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: new AzureMonitorTraceExporter(exporterOptions),
});

sdk.start();
