const PICA_BASE_URL = "https://api.picaos.com/v1/passthrough";

const ACTION_IDS = {
  LIST_AGENTS: "conn_mod_def::GCcb-NFocrI::TWFlai4QQhuDVXZnNOaTeA",
  CREATE_AGENT: "conn_mod_def::GCcb_iT9I0k::xNo_w809TEu2pRzqcCQ4_w",
  GET_AGENT: "conn_mod_def::GCcb-vHVNgs::-804MkN5TgOFbcxSH14dRg",
  DELETE_AGENT: "conn_mod_def::GCcb-AieXyI::fUZGVTkhRyK5DFsh956RTg",
  LIST_TOOLS: "conn_mod_def::GCccCjzsbCw::bdqxJZXcTmipXJSbyJPU6w",
  CREATE_TOOL: "conn_mod_def::GCccDiK7P6I::WFrNUFPKTgu70g5qTZ-4Vg",
  CREATE_PHONE_NUMBER: "conn_mod_def::GCcb_c6ac1E::4CIaoE3kSK2k_AKKGDvPnA",
  LIST_KNOWLEDGE_BASE: "conn_mod_def::GCcb_ZgOwos::MhWc8fTFRj2BeqvqrnvKBA",
  CHARACTER_STATS: "conn_mod_def::GCccCTdlIU4::bWOFVd8nTTq9hgW2cCiVrw",
  DOWNLOAD_HISTORY: "conn_mod_def::GCcb-__KYBE::F-8ER8XzSxSfNIdcS7NMHw",
};

function getPicaHeaders(actionId: string) {
  return {
    "x-pica-secret": process.env.PICA_SECRET_KEY || "",
    "x-pica-connection-key": process.env.PICA_ELEVENLABS_CONNECTION_KEY || "",
    "x-pica-action-id": actionId,
    "Content-Type": "application/json",
  };
}

export async function listAgents(params?: { page_size?: number; search?: string; cursor?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page_size) searchParams.set("page_size", String(params.page_size));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.cursor) searchParams.set("cursor", params.cursor);

  const url = `${PICA_BASE_URL}/v1/convai/agents${searchParams.toString() ? `?${searchParams}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: getPicaHeaders(ACTION_IDS.LIST_AGENTS),
  });

  if (!res.ok) {
    throw new Error(`Failed to list agents: ${res.status}`);
  }

  return res.json();
}

export async function createAgent(body: {
  conversation_config?: {
    agent?: {
      prompt?: { prompt?: string };
      first_message?: string;
      language?: string;
    };
    tts?: { voice_id?: string };
  };
  name: string;
}) {
  const res = await fetch(`${PICA_BASE_URL}/v1/convai/agents/create`, {
    method: "POST",
    headers: getPicaHeaders(ACTION_IDS.CREATE_AGENT),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to create agent: ${res.status}`);
  }

  return res.json();
}

export async function getAgent(agentId: string) {
  const res = await fetch(`${PICA_BASE_URL}/v1/convai/agents/${agentId}`, {
    method: "GET",
    headers: getPicaHeaders(ACTION_IDS.GET_AGENT),
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(`Failed to get agent: ${res.status}`);
  }

  return res.json();
}

export async function deleteAgent(agentId: string) {
  const res = await fetch(`${PICA_BASE_URL}/v1/convai/agents/${agentId}`, {
    method: "DELETE",
    headers: getPicaHeaders(ACTION_IDS.DELETE_AGENT),
  });

  if (!res.ok) {
    throw new Error(`Failed to delete agent: ${res.status}`);
  }

  return res.json();
}

export async function listTools() {
  const res = await fetch(`${PICA_BASE_URL}/v1/convai/tools`, {
    method: "GET",
    headers: getPicaHeaders(ACTION_IDS.LIST_TOOLS),
  });

  if (!res.ok) {
    throw new Error(`Failed to list tools: ${res.status}`);
  }

  return res.json();
}

export async function createTool(body: {
  tool_config: {
    type: string;
    api_schema?: { url: string };
    description?: string;
    name: string;
  };
}) {
  const res = await fetch(`${PICA_BASE_URL}/v1/convai/tools`, {
    method: "POST",
    headers: getPicaHeaders(ACTION_IDS.CREATE_TOOL),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to create tool: ${res.status}`);
  }

  return res.json();
}

export async function createPhoneNumber(body: {
  phone_number: string;
  provider: string;
  label?: string;
  sid?: string;
  token?: string;
}) {
  const res = await fetch(`${PICA_BASE_URL}/v1/convai/phone-numbers/create`, {
    method: "POST",
    headers: getPicaHeaders(ACTION_IDS.CREATE_PHONE_NUMBER),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to create phone number: ${res.status}`);
  }

  return res.json();
}

export async function listKnowledgeBase() {
  const res = await fetch(`${PICA_BASE_URL}/v1/convai/knowledge-base`, {
    method: "GET",
    headers: getPicaHeaders(ACTION_IDS.LIST_KNOWLEDGE_BASE),
  });

  if (!res.ok) {
    throw new Error(`Failed to list knowledge base: ${res.status}`);
  }

  return res.json();
}

export async function getCharacterStats(startUnix: number, endUnix: number) {
  const url = `${PICA_BASE_URL}/v1/usage/character-stats?start_unix=${startUnix}&end_unix=${endUnix}`;

  const res = await fetch(url, {
    method: "GET",
    headers: getPicaHeaders(ACTION_IDS.CHARACTER_STATS),
  });

  if (!res.ok) {
    throw new Error(`Failed to get character stats: ${res.status}`);
  }

  return res.json();
}

export async function downloadHistory(historyItemIds: string[], outputFormat = "wav") {
  const res = await fetch(`${PICA_BASE_URL}/v1/history/download`, {
    method: "POST",
    headers: getPicaHeaders(ACTION_IDS.DOWNLOAD_HISTORY),
    body: JSON.stringify({
      history_item_ids: historyItemIds,
      output_format: outputFormat,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to download history: ${res.status}`);
  }

  return res.json();
}
