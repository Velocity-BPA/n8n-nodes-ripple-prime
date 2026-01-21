/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class RipplePrimeFix implements ICredentialType {
  name = 'ripplePrimeFix';
  displayName = 'Ripple Prime FIX';
  documentationUrl = 'https://docs.ripple.com/prime/fix';

  properties: INodeProperties[] = [
    {
      displayName: 'FIX Version',
      name: 'fixVersion',
      type: 'options',
      options: [
        { name: 'FIX 4.2', value: '4.2' },
        { name: 'FIX 4.4', value: '4.4' },
        { name: 'FIX 5.0', value: '5.0' },
        { name: 'FIX 5.0 SP2', value: '5.0SP2' },
      ],
      default: '4.4',
      description: 'FIX protocol version',
    },
    {
      displayName: 'Sender Comp ID',
      name: 'senderCompId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your FIX sender identifier',
    },
    {
      displayName: 'Target Comp ID',
      name: 'targetCompId',
      type: 'string',
      default: '',
      required: true,
      description: 'Ripple Prime FIX gateway identifier',
    },
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: '',
      required: true,
      description: 'FIX gateway hostname',
    },
    {
      displayName: 'Port',
      name: 'port',
      type: 'number',
      default: 9876,
      required: true,
      description: 'FIX gateway port',
    },
    {
      displayName: 'Use SSL/TLS',
      name: 'useSsl',
      type: 'boolean',
      default: true,
      description: 'Whether to use SSL/TLS for the connection',
    },
    {
      displayName: 'Heartbeat Interval (seconds)',
      name: 'heartbeatInterval',
      type: 'number',
      default: 30,
      description: 'Heartbeat interval in seconds',
    },
    {
      displayName: 'Sender Sub ID',
      name: 'senderSubId',
      type: 'string',
      default: '',
      description: 'Optional sender sub-identifier',
    },
    {
      displayName: 'Target Sub ID',
      name: 'targetSubId',
      type: 'string',
      default: '',
      description: 'Optional target sub-identifier',
    },
    {
      displayName: 'Reset Sequence on Logon',
      name: 'resetOnLogon',
      type: 'boolean',
      default: false,
      description: 'Whether to reset sequence numbers on logon',
    },
  ];
}
