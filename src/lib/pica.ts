// --- Types ---

export interface Agent {
  agent_id: string;
  name: string;
  created_at_unix_secs: number;
  access_level: "admin" | "editor" | "viewer";
}

export interface AgentListResponse {
  agents: Agent[];
  has_more: boolean;
  next_cursor?: string;
}

export interface KnowledgeBaseItem {
  id: string;
  type: string;
}

export interface ConversationConfig {
  agent: {
    prompt: {
      prompt?: string;
    };
    first_message: string;
    language: string;
    tools?: string[];
    knowledge_base?: KnowledgeBaseItem[];
    dynamic_variables?: {
      dynamic_variable_placeholders?: Record<string, unknown>;
    };
  };
  tts?: {
    voice_id?: string;
  };
}

export interface CreateAgentBody {
  conversation_config: ConversationConfig;
  platform_settings?: Record<string, unknown>;
  name: string;
}

export interface Tool {
  tool_id?: string;
  name: string;
  description?: string;
  tool_config: {
    type: "webhook" | "function" | "api"; // approximate
    api_schema?: { url: string };
    [key: string]: unknown;
  };
}

export interface PhoneNumber {
  phone_number: string;
  provider: string;
  label: string;
  sid?: string;
}

// --- Mock Data ---
const MOCK_AGENTS: Agent[] = [
  { agent_id: "mock_1", name: "Customer Support", created_at_unix_secs: Date.now() / 1000 - 86400, access_level: "admin" },
  { agent_id: "mock_2", name: "Sales Representative", created_at_unix_secs: Date.now() / 1000 - 172800, access_level: "editor" },
  { agent_id: "mock_3", name: "Technical Assistant", created_at_unix_secs: Date.now() / 1000 - 259200, access_level: "viewer" },
];

const MOCK_TOOLS: Tool[] = [
  { tool_id: "t1", name: "Weather Check", description: "Checks current weather", tool_config: { type: "function" } },
  { tool_id: "t2", name: "Google Search", description: "Search the web", tool_config: { type: "function" } }
];

// --- API Client ---

const API_BASE = "/api/pica";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, init);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json() as T;
  } catch (err) {
    console.warn(`API/Network failed for ${path}, falling back to Mock Mode.`);

    // Mock Router
    if (path.includes("/agents") && !path.includes("/create")) {
      // List or Get
      if (path.includes("?")) return { agents: MOCK_AGENTS, has_more: false } as unknown as T;
      return { name: "Mock Agent", conversation_config: { agent: { first_message: "Hello!", language: "en" } } } as unknown as T;
    }
    if (path.includes("/tools")) return { tools: MOCK_TOOLS } as unknown as T;
    if (path.includes("/conversations")) return { conversations: [] } as unknown as T;
    if (path.includes("/usage")) return { total_usage: 12500, active_agents: 3 } as unknown as T;
    if (path.includes("/knowledge")) return { documents: [] } as unknown as T;

    // Changes (POST/DELETE) - Simulate success
    if (init?.method === "POST" || init?.method === "DELETE") {
      return {} as T;
    }

    throw err;
  }
}

export const Pica = {
  listAgents: async (pageSize = 30, cursor?: string): Promise<AgentListResponse> => {
    const params = new URLSearchParams({ page_size: pageSize.toString() });
    if (cursor) params.append("cursor", cursor);

    return apiFetch<AgentListResponse>(`/agents?${params.toString()}`);
  },

  createAgent: async (body: CreateAgentBody) =>
    apiFetch<unknown>(`/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  getAgent: async (agentId: string) =>
    apiFetch<unknown>(`/agents/${encodeURIComponent(agentId)}`),

  deleteAgent: async (agentId: string) =>
    apiFetch<unknown>(`/agents/${encodeURIComponent(agentId)}`, {
      method: "DELETE",
    }),

  listTools: async () => apiFetch<unknown>(`/tools`),

  createTool: async (toolConfig: Tool) =>
    apiFetch<unknown>(`/tools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolConfig),
    }),

  createPhoneNumber: async (body: PhoneNumber) =>
    apiFetch<unknown>(`/phone-numbers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  // Docs say "List Documents"; this is used by KnowledgeSelector/Knowledge page.
  listIDs: async () => apiFetch<unknown>(`/knowledge-base`),

  getCharacterStats: async (startUnix: number, endUnix: number) => {
    const params = new URLSearchParams({
      start_unix: startUnix.toString(),
      end_unix: endUnix.toString(),
    });
    return apiFetch<unknown>(`/usage/character-stats?${params.toString()}`);
  },

  listConversations: async (pageSize = 30) => {
    const params = new URLSearchParams({ page_size: pageSize.toString() });
    return apiFetch<unknown>(`/conversations?${params.toString()}`);
  },
};
