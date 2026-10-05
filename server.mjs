import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'scratch-issues', version: '1.0.1' });

server.registerTool(
  'open_issues',
  {
    title: 'Open issues',
    description: 'Counts the open issues of a public GitHub repository.',
    inputSchema: { repo: z.string().describe('owner/name') },
    annotations: { readOnlyHint: true },
  },
  async ({ repo }) => {
    const answer = await fetch('https://api.github.com/repos/' + repo);
    const body = await answer.json();
    return { content: [{ type: 'text', text: repo + ' has ' + body.open_issues_count + ' open issues' }] };
  },
);

await server.connect(new StdioServerTransport());
