import "server-only";

const BASE_URL = "https://api.picaos.com/v1/passthrough/v1";

const ACTION_IDS = {
  listAgents: "conn_mod_def::GCcb-NFocrI::TWFlai4QQhuDVXZnNOaTeA",
  createAgent: "conn_mod_def::GCcb_iT9I0k::xNo_w809TEu2pRzqcCQ4_w",
  getAgent: "conn_mod_def::GCcb-vHVNgs::-804MkN5TgOFbcxSH14dRg",
  deleteAgent: "conn_mod_def::GCcb-AieXyI::fUZGVTkhRyK5DFsh956RTg",
  listTools: "conn_mod_def::GCccCjzsbCw::bdqxJZXcTmipXJSbyJPU6w",
  createTool: "conn_mod_def::GCccDiK7P6I::WFrNUFPKTgu70g5qTZ-4Vg",
  createPhoneNumber: "conn_mod_def::GCcb_c6ac1E::4CIaoE3kSK2k_AKKGDvPnA",
  listKnowledgeBase: "conn_mod_def::GCcb_ZgOwos::MhWc8fTFRj2BeqvqrnvKBA",
  getCharacterStats: "conn_mod_def::GCccCTdlIU4::bWOFVd8nTTq9hgW2cCiVrw",
  listConversations: "conn_mod_def::GCcb-__KYBE::F-8ER8XzSxSfNIdcS7NMHw",
} as const;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getHeaders(actionId: string): Headers {
  return new Headers({
    "x-pica-secret": requiredEnv("PICA_SECRET_KEY"),
    "x-pica-connection-key": requiredEnv("PICA_ELEVENLABS_CONNECTION_KEY"),
    "x-pica-action-id": actionId,
    "Content-Type": "application/json",
  });
}

async function picaRequest(
  path: string,
  init: RequestInit & { actionId: string }
): Promise<Response> {
  const { actionId, headers, ...rest } = init;

  const mergedHeaders = getHeaders(actionId);
  if (headers) {
    new Headers(headers).forEach((value, key) => mergedHeaders.set(key, value));
  }

  return fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: mergedHeaders,
    cache: "no-store",
  });
}

export const PicaServer = {
  listAgents: (pageSize: number, cursor?: string) => {
    const params = new URLSearchParams({ page_size: pageSize.toString() });
    if (cursor) params.append("cursor", cursor);
    return picaRequest(`/convai/agents?${params.toString()}`, {
      method: "GET",
      actionId: ACTION_IDS.listAgents,
    });
  },

  createAgent: (body: unknown) =>
    picaRequest(`/convai/agents/create`, {
      method: "POST",
      actionId: ACTION_IDS.createAgent,
      body: JSON.stringify(body),
    }),

  getAgent: (agentId: string) =>
    picaRequest(`/convai/agents/${encodeURIComponent(agentId)}`, {
      method: "GET",
      actionId: ACTION_IDS.getAgent,
    }),

  deleteAgent: (agentId: string) =>
    picaRequest(`/convai/agents/${encodeURIComponent(agentId)}`, {
      method: "DELETE",
      actionId: ACTION_IDS.deleteAgent,
    }),

  listTools: () =>
    picaRequest(`/convai/tools`, {
      method: "GET",
      actionId: ACTION_IDS.listTools,
    }),

  createTool: (body: unknown) =>
    picaRequest(`/convai/tools`, {
      method: "POST",
      actionId: ACTION_IDS.createTool,
      body: JSON.stringify(body),
    }),

  createPhoneNumber: (body: unknown) =>
    picaRequest(`/convai/phone-numbers/create`, {
      method: "POST",
      actionId: ACTION_IDS.createPhoneNumber,
      body: JSON.stringify(body),
    }),

  listKnowledgeBase: () =>
    picaRequest(`/convai/knowledge-base`, {
      method: "GET",
      actionId: ACTION_IDS.listKnowledgeBase,
    }),

  getCharacterStats: (startUnix: number, endUnix: number) => {
    const params = new URLSearchParams({
      start_unix: startUnix.toString(),
      end_unix: endUnix.toString(),
    });
    return picaRequest(`/usage/character-stats?${params.toString()}`, {
      method: "GET",
      actionId: ACTION_IDS.getCharacterStats,
    });
  },

  listConversations: (pageSize: number) => {
    const params = new URLSearchParams({ page_size: pageSize.toString() });
    return picaRequest(`/convai/conversations?${params.toString()}`, {
      method: "GET",
      actionId: ACTION_IDS.listConversations,
    });
  },
};
