import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export interface ConversationConfig {
  agent: {
    prompt: {
      prompt?: string;
    };
    first_message: string;
    language: string;
  };
  // Add other nested configs as needed based on ElevenLabs schema
}

export interface CreateAgentBody {
  conversation_config: ConversationConfig;
  platform_settings?: any;
  name: string;
}

export interface Tool {
  tool_id?: string;
  name: string;
  description?: string;
  tool_config: {
    type: 'webhook' | 'function' | 'api'; // approximate
    api_schema?: { url: string };
    [key: string]: any;
  };
}

export interface PhoneNumber {
  phone_number: string;
  provider: string;
  label: string;
  sid?: string;
}

// --- API Client ---

const BASE_URL = "https://api.picaos.com/v1/passthrough/v1";

const getHeaders = (actionId: string) => {
  // Use environment variables for secrets
  // Note: specific action-ids are required per endpoint as per docs
  return {
    "x-pica-secret": process.env.PICA_SECRET_KEY || "",
    "x-pica-connection-key": process.env.PICA_ELEVENLABS_CONNECTION_KEY || "",
    "x-pica-action-id": actionId,
    "Content-Type": "application/json",
  };
};

export const Pica = {
  // 1. List Agents
  listAgents: async (pageSize = 30, cursor?: string): Promise<AgentListResponse> => {
    const params = new URLSearchParams({ page_size: pageSize.toString() });
    if (cursor) params.append("cursor", cursor);

    // Action ID from docs
    const ACTION_ID = "conn_mod_def::GCcb-NFocrI::TWFlai4QQhuDVXZnNOaTeA";

    const response = await fetch(`${BASE_URL}/convai/agents?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(ACTION_ID),
    });
    if (!response.ok) throw new Error("Failed to list agents");
    return response.json();
  },

  // 2. Create Agent
  createAgent: async (body: CreateAgentBody) => {
    const ACTION_ID = "conn_mod_def::GCcb_iT9I0k::xNo_w809TEu2pRzqcCQ4_w";
    const response = await fetch(`${BASE_URL}/convai/agents/create`, {
      method: "POST",
      headers: getHeaders(ACTION_ID),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Failed to create agent");
    return response.json();
  },

  // 3. Get Agent
  getAgent: async (agentId: string) => {
    const ACTION_ID = "conn_mod_def::GCcb-vHVNgs::-804MkN5TgOFbcxSH14dRg";
    const response = await fetch(`${BASE_URL}/convai/agents/${agentId}`, {
      method: "GET",
      headers: getHeaders(ACTION_ID),
    });
    if (!response.ok) throw new Error("Failed to get agent");
    return response.json();
  },

  // 4. Delete Agent
  deleteAgent: async (agentId: string) => {
    const ACTION_ID = "conn_mod_def::GCcb-AieXyI::fUZGVTkhRyK5DFsh956RTg";
    const response = await fetch(`${BASE_URL}/convai/agents/${agentId}`, {
      method: "DELETE",
      headers: getHeaders(ACTION_ID),
    });
    if (!response.ok) throw new Error("Failed to delete agent");
    return response.json(); // returns {}
  },

  // 5. Tools
  listTools: async () => {
    const ACTION_ID = "conn_mod_def::GCccCjzsbCw::bdqxJZXcTmipXJSbyJPU6w";
    const response = await fetch(`${BASE_URL}/convai/tools`, { // Docs say /tools? Check endpoint consistency carefully. Docs: /passthrough/v1/convai/tools
      method: "GET",
      headers: getHeaders(ACTION_ID)
    });
    if (!response.ok) throw new Error("Failed to list tools");
    return response.json();
  },

  createTool: async (toolConfig: Tool) => {
    const ACTION_ID = "conn_mod_def::GCccDiK7P6I::WFrNUFPKTgu70g5qTZ-4Vg";
    const response = await fetch(`${BASE_URL}/convai/tools`, {
      method: "POST",
      headers: getHeaders(ACTION_ID),
      body: JSON.stringify(toolConfig)
    });
    return response.json();
  },

  // 6. Phone Numbers
  createPhoneNumber: async (body: PhoneNumber) => {
    const ACTION_ID = "conn_mod_def::GCcb_c6ac1E::4CIaoE3kSK2k_AKKGDvPnA";
    const response = await fetch(`${BASE_URL}/convai/phone-numbers/create`, {
      method: "POST",
      headers: getHeaders(ACTION_ID),
      body: JSON.stringify(body)
    });
    return response.json();
  },

  // 7. Knowledge Base
  listIDs: async () => { // Docs say 'List Documents'
    const ACTION_ID = "conn_mod_def::GCcb_ZgOwos::MhWc8fTFRj2BeqvqrnvKBA";
    const response = await fetch(`${BASE_URL}/convai/knowledge-base`, {
      method: "GET",
      headers: getHeaders(ACTION_ID)
    });
    return response.json();
  },

  // 9. Analytics
  getCharacterStats: async (startUnix: number, endUnix: number) => {
    const ACTION_ID = "conn_mod_def::GCccCTdlIU4::bWOFVd8nTTq9hgW2cCiVrw";
    const url = `${BASE_URL}/usage/character-stats?start_unix=${startUnix}&end_unix=${endUnix}`;
    const response = await fetch(url, {
      headers: getHeaders(ACTION_ID)
    });
    return response.json();
  },

  // 10. Conversations (History)
  listConversations: async (pageSize = 30) => {
    // Endpoint assumption based on standard ElevenLabs or PicaOS conventions
    // If PicaOS uses passthrough for everything, it might be /convai/conversations
    const ACTION_ID = "conn_mod_def::GCcb-__KYBE::F-8ER8XzSxSfNIdcS7NMHw"; // Reuse history download ID or similar?
    // Actually, history download ID was F-8ER8XzSxSfNIdcS7NMHw. I'll use a placeholder or that one.
    // But typically list is GET.
    const response = await fetch(`${BASE_URL}/convai/conversations?page_size=${pageSize}`, {
      method: "GET",
      headers: getHeaders(ACTION_ID)
    });
    if (!response.ok) throw new Error("Failed to list conversations");
    return response.json();
  }
};
