/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * n8n-nodes-ripple-prime
 *
 * Comprehensive n8n community node for Ripple Prime (formerly Hidden Road)
 * institutional prime brokerage platform.
 *
 * @packageDocumentation
 */

// Credentials
export { RipplePrimeApi } from './credentials/RipplePrimeApi.credentials';
export { RipplePrimeFix } from './credentials/RipplePrimeFix.credentials';
export { RipplePrimeWebSocket } from './credentials/RipplePrimeWebSocket.credentials';

// Nodes
export { RipplePrime } from './nodes/RipplePrime/RipplePrime.node';
export { RipplePrimeTrigger } from './nodes/RipplePrime/RipplePrimeTrigger.node';

// Emit licensing notice on module load (non-blocking, informational only)
const emitLicensingNotice = (): void => {
  const notice = `
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;
  // eslint-disable-next-line no-console
  console.warn(notice);
};

// Emit notice once on module load
let noticeEmitted = false;
if (!noticeEmitted) {
  emitLicensingNotice();
  noticeEmitted = true;
}
